// Website Crawler Module
// Uses fetch + cheerio for server-side crawling (no headless browser). What a
// browser would only show after running JavaScript is not seen here, and the
// report says so instead of guessing.

import * as cheerio from 'cheerio';
import type {
  PageData, LinkInfo, ImageInfo, ScriptInfo, StyleInfo, MetaInfo, StructuredData, FormInfo, FormInput,
  AuditConfig, CrawlProgress, SiteContext, SitemapInfo,
} from './types';
import { safeFetch, readTextCapped, assertPublicUrl } from './safe-fetch';
import { parseRobots, isAllowed, type ParsedRobots } from './robots';

/** The site answered, but not with a page we can fairly audit. */
export class SiteResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SiteResponseError';
  }
}

const NON_PAGE_EXTENSIONS = /\.(pdf|jpe?g|png|gif|webp|avif|svg|ico|bmp|tiff?|zip|rar|7z|gz|tar|mp3|mp4|m4a|wav|webm|mov|avi|mkv|woff2?|ttf|eot|otf|css|js|mjs|json|xml|rss|atom|txt|csv|xlsx?|docx?|pptx?|exe|dmg|apk)$/i;

/** Markers of bot checks and challenge pages served instead of the real site. */
const CHALLENGE_MARKERS = [
  /cf-chl-|challenge-platform|cf_chl_opt|__cf_chl/i,
  /<title>\s*(just a moment|attention required|access denied|please wait|security check|verifying you are human)/i,
  /_vercel\/challenge|vercel security checkpoint/i,
  /captcha-delivery\.com|geo\.captcha-delivery|px-captcha|perimeterx/i,
  /sucuri website firewall|incapsula incident|request unsuccessful\. incapsula/i,
];

/** Same site when the host matches, with or without "www.". */
function siteKey(host: string): string {
  return host.toLowerCase().replace(/^www\./, '');
}

/** Normalise for de-duplication: no fragment, no trailing slash, lower case host. */
function pageKey(href: string): string {
  try {
    const u = new URL(href);
    u.hash = '';
    const path = u.pathname.replace(/\/+$/, '') || '/';
    return `${u.protocol}//${u.host.toLowerCase()}${path}${u.search}`;
  } catch {
    return href;
  }
}

/**
 * An image without width and height can still be safe from layout shift when
 * its box is sized some other way. next/image "fill" images sit absolutely
 * positioned inside a parent that already has a size; an inline aspect-ratio
 * reserves the space too.
 */
function sizedByContainer(nimg: string | undefined, style: string | undefined): boolean {
  if ((nimg || '').toLowerCase() === 'fill') return true;
  const css = (style || '').toLowerCase().replace(/\s+/g, '');
  if (!css) return false;
  if (css.includes('aspect-ratio:')) return true;
  return css.includes('position:absolute') && css.includes('width:100%') && css.includes('height:100%');
}

export class WebsiteCrawler {
  private config: Required<AuditConfig>;
  private enteredUrl: string;
  private finalUrl: string;
  private origin: string;
  private host: string;
  private visitedKeys: Set<string> = new Set();
  private robots: SiteContext['robots'];
  private parsedRobots: ParsedRobots | null = null;
  private sitemaps: SitemapInfo[] = [];
  private homeRedirects: { url: string; status: number }[] = [];

  constructor(config: AuditConfig) {
    this.config = {
      maxPages: config.maxPages ?? 5,
      // 12s per page. A page that has not answered in 12 seconds is not going
      // to change the verdict, and the whole audit has a 45 second budget.
      timeout: config.timeout ?? 12000,
      userAgent:
        config.userAgent ??
        'Mozilla/5.0 (compatible; DevelopersMatrixAudit/1.1; +https://developersmatrix.com/tools/website-audit)',
      followRedirects: config.followRedirects ?? true,
      ...config,
    };
    this.enteredUrl = config.url;
    this.finalUrl = config.url;
    const u = new URL(config.url);
    this.origin = u.origin;
    this.host = u.hostname;
    this.robots = { url: `${u.origin}/robots.txt`, status: null, found: false, body: null };
  }

  /** Internal means the same site, counting www and the bare domain as one. */
  private isInternal(href: string): boolean {
    try {
      return siteKey(new URL(href).hostname) === siteKey(this.host);
    } catch {
      return false;
    }
  }

  private resolveUrl(href: string, currentUrl: string): string | null {
    const h = href.trim();
    if (!h || h.startsWith('#') || /^(javascript|mailto|tel|sms|data|ftp):/i.test(h)) return null;
    try {
      const resolved = new URL(h, currentUrl);
      if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') return null;
      return resolved.href;
    } catch {
      return null;
    }
  }

  private headers(accept: string): Record<string, string> {
    return {
      'User-Agent': this.config.userAgent,
      Accept: accept,
      'Accept-Language': 'en-US,en;q=0.8',
    };
  }

  // ---------------------------------------------------------------- robots.txt

  private async fetchRobotsTxt(): Promise<void> {
    const url = `${this.origin}/robots.txt`;
    this.robots = { url, status: null, found: false, body: null };
    try {
      const { response } = await safeFetch(url, { headers: this.headers('text/plain,*/*;q=0.5'), timeoutMs: 6000 });
      this.robots.status = response.status;
      const { text } = await readTextCapped(response, 500_000);
      const type = (response.headers.get('content-type') || '').toLowerCase();
      // Many sites answer every unknown path with their HTML homepage and a 200.
      // That is not a robots.txt, and parsing it as one invents rules.
      const looksHtml = type.includes('text/html') || /^\s*<(!doctype|html|head|body)/i.test(text);
      if (response.ok && !looksHtml) {
        this.robots.found = true;
        this.robots.body = text;
        this.parsedRobots = parseRobots(text);
      }
    } catch {
      // Network failure: status stays null and the report says it could not be read.
    }
  }

  // ------------------------------------------------------------------- sitemap

  private async inspectSitemap(url: string, source: SitemapInfo['source']): Promise<SitemapInfo> {
    const info: SitemapInfo = { url, source, status: null, kind: null, urlCount: 0, childCount: 0, ok: false };
    try {
      const { response } = await safeFetch(url, { headers: this.headers('application/xml,text/xml,*/*;q=0.5'), timeoutMs: 6000 });
      info.status = response.status;
      if (!response.ok) {
        response.body?.cancel().catch(() => {});
        return info;
      }
      const type = (response.headers.get('content-type') || '').toLowerCase();
      if (/\.gz($|\?)/i.test(url) || type.includes('gzip')) {
        response.body?.cancel().catch(() => {});
        info.kind = 'gzip';
        info.ok = true;
        return info;
      }
      const { text } = await readTextCapped(response, 5_000_000);
      if (/<sitemapindex[\s>]/i.test(text)) {
        info.kind = 'index';
        info.childCount = (text.match(/<sitemap[\s>]/gi) || []).length;
        info.ok = info.childCount > 0;
      } else if (/<urlset[\s>]/i.test(text)) {
        info.kind = 'urlset';
        info.urlCount = (text.match(/<url[\s>]/gi) || []).length;
        info.ok = true;
      } else {
        info.kind = 'invalid';
      }
    } catch {
      // Unreachable: status stays null.
    }
    return info;
  }

  private async discoverSitemaps(): Promise<void> {
    const listed = (this.parsedRobots?.sitemaps ?? [])
      .map((s) => {
        try {
          return new URL(s, this.origin).href;
        } catch {
          return null;
        }
      })
      .filter((s): s is string => !!s);

    if (listed.length > 0) {
      // Check up to three listed sitemaps; big sites can list dozens.
      this.sitemaps = await Promise.all(listed.slice(0, 3).map((u) => this.inspectSitemap(u, 'robots')));
      return;
    }

    // Nothing listed: try the two addresses almost every CMS uses.
    for (const path of ['/sitemap.xml', '/sitemap_index.xml']) {
      const info = await this.inspectSitemap(`${this.origin}${path}`, 'probe');
      if (info.ok) {
        this.sitemaps = [info];
        return;
      }
    }
    this.sitemaps = [];
  }

  // --------------------------------------------------------------------- pages

  async fetchPage(url: string): Promise<PageData | null> {
    const key = pageKey(url);
    if (this.visitedKeys.has(key)) return null;
    this.visitedKeys.add(key);

    const startTime = Date.now();
    try {
      const { response, finalUrl, redirects } = await safeFetch(url, {
        headers: this.headers('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
        timeoutMs: this.config.timeout,
      });
      // Time until the server answered, measured from our server. This is a
      // response time, not how long the page takes to load in a browser.
      const loadTime = Date.now() - startTime;
      this.visitedKeys.add(pageKey(finalUrl));
      const contentType = (response.headers.get('content-type') || '').toLowerCase();
      const { text: html } = await readTextCapped(response, 3_000_000);
      return this.parse(html, url, finalUrl, redirects, response, loadTime, contentType);
    } catch (error) {
      if (error instanceof Error && error.name === 'BlockedUrlError') throw error;
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  }

  private parse(
    html: string,
    url: string,
    finalUrl: string,
    redirects: { url: string; status: number }[],
    response: Response,
    loadTime: number,
    contentType: string
  ): PageData {
    const $ = cheerio.load(html);
    const headers = this.extractHeaders(response.headers);
    const meta = this.extractMeta($);
    meta.xRobotsTag = headers['x-robots-tag'];

    const page: PageData = {
      url,
      finalUrl,
      redirectChain: redirects,
      contentType,
      title: ($('head > title').first().text() || $('title').first().text() || '').trim(),
      titleCount: $('head > title').length,
      html,
      text: '',
      mainText: '',
      structuredDataErrors: 0,
      headers,
      statusCode: response.status,
      loadTime,
      size: Buffer.byteLength(html, 'utf-8'),
      // Links resolve against the address that actually answered.
      links: this.extractLinks($, finalUrl),
      images: this.extractImages($),
      scripts: this.extractScripts($),
      styles: this.extractStyles($),
      meta,
      structured_data: [],
      forms: this.extractForms($),
    };

    const sd = this.extractStructuredData($);
    page.structured_data = sd.items;
    page.structuredDataErrors = sd.errors;

    // Text last, because it removes elements from the parsed document.
    const texts = this.extractText($);
    page.text = texts.text;
    page.mainText = texts.mainText;
    return page;
  }

  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    // Every Set-Cookie must be kept for the cookie flag check.
    const cookies = typeof headers.getSetCookie === 'function' ? headers.getSetCookie() : [];
    if (cookies.length > 0) result['set-cookie'] = cookies.join(', ');
    return result;
  }

  /**
   * Visible text only. Inline scripts (including framework data such as
   * Next.js self.__next_f payloads), styles, templates and SVG used to be
   * counted as words, which inflated word counts into the thousands.
   */
  private extractText($: cheerio.CheerioAPI): { text: string; mainText: string } {
    $('script, style, noscript, template, svg, iframe, object, canvas').remove();
    // One block per line so paragraphs and sentences can be told apart.
    $('p, div, li, h1, h2, h3, h4, h5, h6, section, article, header, footer, nav, aside, main, tr, td, th, dt, dd, blockquote, pre, figcaption, br, hr, label, button, option').each((_, el) => {
      $(el).append('\n');
    });
    const clean = (t: string) =>
      t
        .replace(/[ \t\f\v ​]+/g, ' ')
        .replace(/ *\n[\s]*/g, '\n')
        .trim();

    const text = clean($('body').text() || $.root().text());

    const mainEl = $('main, [role="main"], article').first();
    let mainText = '';
    if (mainEl.length) {
      mainText = clean(mainEl.text());
    } else {
      const body = $('body').clone();
      body.find('header, nav, footer, aside, [role="navigation"], [role="banner"], [role="contentinfo"]').remove();
      mainText = clean(body.text());
    }
    return { text, mainText: mainText || text };
  }

  private extractLinks($: cheerio.CheerioAPI, currentUrl: string): LinkInfo[] {
    const links: LinkInfo[] = [];
    $('a[href]').each((_, el) => {
      const $el = $(el);
      const resolvedUrl = this.resolveUrl($el.attr('href') || '', currentUrl);
      if (!resolvedUrl) return;
      const text =
        $el.text().replace(/\s+/g, ' ').trim() ||
        $el.attr('aria-label')?.trim() ||
        $el.attr('title')?.trim() ||
        $el.find('img[alt]').first().attr('alt')?.trim() ||
        '';
      links.push({
        href: resolvedUrl,
        text: text.substring(0, 100),
        rel: $el.attr('rel'),
        target: $el.attr('target'),
        isInternal: this.isInternal(resolvedUrl),
      });
    });
    return links;
  }

  private extractImages($: cheerio.CheerioAPI): ImageInfo[] {
    const images: ImageInfo[] = [];
    $('img').each((_, el) => {
      const $el = $(el);
      const w = parseInt($el.attr('width') || '', 10);
      const h = parseInt($el.attr('height') || '', 10);
      images.push({
        src: $el.attr('src') || $el.attr('data-src') || '',
        alt: $el.attr('alt'),
        width: Number.isFinite(w) ? w : undefined,
        height: Number.isFinite(h) ? h : undefined,
        loading: $el.attr('loading'),
        sizedByContainer: sizedByContainer($el.attr('data-nimg'), $el.attr('style')),
      });
    });
    return images;
  }

  private extractScripts($: cheerio.CheerioAPI): ScriptInfo[] {
    const scripts: ScriptInfo[] = [];
    $('script').each((_, el) => {
      const $el = $(el);
      const src = $el.attr('src');
      scripts.push({
        src,
        type: $el.attr('type'),
        async: $el.attr('async') !== undefined,
        defer: $el.attr('defer') !== undefined,
        content: src ? undefined : ($el.html() || '').substring(0, 500),
      });
    });
    return scripts;
  }

  private extractStyles($: cheerio.CheerioAPI): StyleInfo[] {
    const styles: StyleInfo[] = [];
    $('link[rel~="stylesheet"]').each((_, el) => {
      styles.push({ href: $(el).attr('href') });
    });
    $('style').each((_, el) => {
      styles.push({ content: ($(el).html() || '').substring(0, 500) });
    });
    return styles;
  }

  private extractMeta($: cheerio.CheerioAPI): MetaInfo {
    const heads = (sel: string) =>
      $(sel)
        .map((_, el) => $(el).text().replace(/\s+/g, ' ').trim())
        .get();
    const metaName = (name: string) =>
      $('meta')
        .filter((_, el) => ($(el).attr('name') || '').toLowerCase() === name)
        .first()
        .attr('content');
    const metaProp = (prop: string) =>
      $('meta')
        .filter((_, el) => ($(el).attr('property') || $(el).attr('name') || '').toLowerCase() === prop)
        .first()
        .attr('content');

    return {
      title: ($('head > title').first().text() || '').trim() || undefined,
      description: metaName('description'),
      keywords: metaName('keywords'),
      canonical: $('link[rel~="canonical"]').first().attr('href'),
      robots: metaName('robots'),
      googlebot: metaName('googlebot'),
      ogTitle: metaProp('og:title'),
      ogDescription: metaProp('og:description'),
      ogImage: metaProp('og:image'),
      ogUrl: metaProp('og:url'),
      twitterCard: metaName('twitter:card'),
      twitterTitle: metaName('twitter:title'),
      twitterDescription: metaName('twitter:description'),
      twitterImage: metaName('twitter:image'),
      viewport: metaName('viewport'),
      charset: $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type" i]').attr('content'),
      lang: $('html').attr('lang'),
      h1: heads('h1'),
      h2: heads('h2'),
      h3: heads('h3'),
      h4: heads('h4'),
      h5: heads('h5'),
      h6: heads('h6'),
    };
  }

  private extractStructuredData($: cheerio.CheerioAPI): { items: StructuredData[]; errors: number } {
    const items: StructuredData[] = [];
    let errors = 0;

    const pushNode = (node: unknown) => {
      if (!node || typeof node !== 'object') return;
      const rec = node as Record<string, unknown>;
      if (Array.isArray(rec['@graph'])) {
        for (const n of rec['@graph'] as unknown[]) pushNode(n);
        return;
      }
      const rawType = rec['@type'];
      const type = Array.isArray(rawType)
        ? rawType.filter((x): x is string => typeof x === 'string').join(', ')
        : typeof rawType === 'string'
          ? rawType
          : 'Unknown';
      items.push({ type, json: rec });
    };

    $('script[type="application/ld+json" i]').each((_, el) => {
      const raw = ($(el).html() || '').trim();
      if (!raw) return;
      try {
        const json: unknown = JSON.parse(raw);
        // A block can be one object, an object with @graph, or a plain array.
        if (Array.isArray(json)) json.forEach(pushNode);
        else pushNode(json);
      } catch {
        errors++;
      }
    });

    // Microdata, top level items only.
    $('[itemscope]:not([itemprop])').each((_, el) => {
      const $el = $(el);
      const type = $el.attr('itemtype') || 'Unknown';
      const properties: Record<string, string> = {};
      $el.find('[itemprop]').each((_, prop) => {
        const $prop = $(prop);
        const propName = $prop.attr('itemprop');
        if (propName) properties[propName] = $prop.attr('content') || $prop.text().trim();
      });
      items.push({ type: type.split('/').pop() || type, json: properties });
    });

    return { items, errors };
  }

  /**
   * A field counts as labelled the way a screen reader would see it: label
   * for its id anywhere on the page, a wrapping label, aria-label,
   * aria-labelledby or title. Hidden fields and buttons do not need one.
   */
  private extractForms($: cheerio.CheerioAPI): FormInfo[] {
    const forms: FormInfo[] = [];
    const skipTypes = new Set(['hidden', 'submit', 'button', 'reset', 'image']);

    const hasAccessibleName = ($input: ReturnType<typeof $>): boolean => {
      const id = $input.attr('id');
      if ((($input.attr('aria-label') || '').trim()) || (($input.attr('title') || '').trim())) return true;
      const labelledBy = ($input.attr('aria-labelledby') || '').trim();
      if (labelledBy && labelledBy.split(/\s+/).some((ref) => $(`[id="${ref.replace(/"/g, '')}"]`).text().trim())) return true;
      if (id && $(`label[for="${id.replace(/"/g, '')}"]`).text().trim()) return true;
      if ($input.closest('label').length > 0) return true;
      return false;
    };

    $('form').each((_, form) => {
      const $form = $(form);
      const inputs: FormInput[] = [];
      $form.find('input, textarea, select').each((_, input) => {
        const $input = $(input);
        const type = ($input.attr('type') || String($input.prop('tagName') || '')).toLowerCase();
        if (skipTypes.has(type) || $input.attr('aria-hidden') === 'true') return;
        inputs.push({
          type,
          name: $input.attr('name'),
          id: $input.attr('id'),
          placeholder: $input.attr('placeholder'),
          required: $input.attr('required') !== undefined,
          hasLabel: hasAccessibleName($input),
        });
      });
      forms.push({
        action: $form.attr('action'),
        method: $form.attr('method'),
        inputs,
        hasLabel: inputs.length > 0 && inputs.every((i) => i.hasLabel),
      });
    });
    return forms;
  }

  // --------------------------------------------------------------------- crawl

  private checkHomepage(page: PageData): void {
    const head = page.html.slice(0, 20000);
    if (CHALLENGE_MARKERS.some((re) => re.test(head))) {
      throw new SiteResponseError(
        'This site showed our scanner a bot check page (for example a Cloudflare challenge) instead of the real page, so an audit would only measure the challenge. Try again later, or ask the site owner to allow the DevelopersMatrixAudit user agent.'
      );
    }
    if (page.statusCode >= 400) {
      const why =
        page.statusCode === 404 || page.statusCode === 410
          ? 'that page does not exist'
          : page.statusCode === 401 || page.statusCode === 403
            ? 'the site refused our scanner'
            : page.statusCode === 429
              ? 'the site is limiting requests right now'
              : page.statusCode >= 500
                ? 'the site had a server error'
                : 'the request was rejected';
      throw new SiteResponseError(
        `The address answered with HTTP ${page.statusCode} (${why}), so there is no page to audit. Check the address and try again.`
      );
    }
    if (page.contentType && !/html|xml/.test(page.contentType)) {
      throw new SiteResponseError(
        `That address is not a web page (it returned ${page.contentType.split(';')[0]}). Enter the address of an HTML page.`
      );
    }
  }

  async crawl(onProgress?: (progress: CrawlProgress) => void): Promise<PageData[]> {
    const pages: PageData[] = [];
    onProgress?.({ status: 'initializing', message: 'Initializing scan...', progress: 0, pagesScanned: 0, totalPages: this.config.maxPages, errors: [] });

    await assertPublicUrl(this.enteredUrl);

    // The homepage and robots.txt do not depend on each other.
    const [first] = await Promise.all([this.fetchPage(this.enteredUrl), this.fetchRobotsTxt()]);
    if (!first) return pages;
    this.checkHomepage(first);

    // From here on, the site is wherever the homepage request landed.
    this.finalUrl = first.finalUrl;
    this.homeRedirects = first.redirectChain;
    const finalParsed = new URL(first.finalUrl);
    if (finalParsed.origin !== this.origin) {
      this.origin = finalParsed.origin;
      this.host = finalParsed.hostname;
      first.links.forEach((l) => (l.isInternal = this.isInternal(l.href)));
      await this.fetchRobotsTxt();
    }
    pages.push(first);

    onProgress?.({ status: 'crawling', message: 'Fetching page data...', progress: 20, pagesScanned: 1, totalPages: this.config.maxPages, errors: [] });

    // Pick further pages from the homepage links: same site, real pages,
    // each once, and only where robots.txt lets a crawler in.
    const queue: string[] = [];
    const queued = new Set<string>([pageKey(first.url), pageKey(first.finalUrl)]);
    for (const link of first.links) {
      if (queue.length >= this.config.maxPages - 1) break;
      if (!link.isInternal) continue;
      let u: URL;
      try {
        u = new URL(link.href);
      } catch {
        continue;
      }
      u.hash = '';
      if (NON_PAGE_EXTENSIONS.test(u.pathname)) continue;
      const key = pageKey(u.href);
      if (queued.has(key)) continue;
      if (this.parsedRobots && !isAllowed(this.parsedRobots, 'DevelopersMatrixAudit', u.pathname + u.search)) continue;
      queued.add(key);
      queue.push(u.href);
    }

    onProgress?.({ status: 'crawling', message: `Scanning ${queue.length} more pages...`, progress: 30, pagesScanned: 1, totalPages: this.config.maxPages, errors: [] });

    const [fetched] = await Promise.all([
      Promise.all(queue.map((u) => this.fetchPage(u).catch(() => null))),
      this.discoverSitemaps(),
    ]);
    for (const p of fetched) {
      // Pages that redirected onto one we already have would only duplicate it.
      if (p && !pages.some((q) => pageKey(q.finalUrl) === pageKey(p.finalUrl))) pages.push(p);
    }

    onProgress?.({ status: 'analyzing', message: 'Analyzing collected data...', progress: 60, pagesScanned: pages.length, totalPages: pages.length, errors: [] });
    return pages;
  }

  getDomain(): string {
    return this.host;
  }

  getSiteContext(): SiteContext {
    return {
      enteredUrl: this.enteredUrl,
      finalUrl: this.finalUrl,
      origin: this.origin,
      host: this.host,
      homeRedirects: this.homeRedirects,
      robots: this.robots,
      sitemaps: this.sitemaps,
    };
  }

  getParsedRobots(): ParsedRobots | null {
    return this.parsedRobots;
  }
}
