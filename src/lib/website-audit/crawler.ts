// Website Crawler Module
// Uses fetch + cheerio for server-side crawling (no Puppeteer needed for basic analysis)

import * as cheerio from 'cheerio';
import type { PageData, LinkInfo, ImageInfo, ScriptInfo, StyleInfo, MetaInfo, StructuredData, FormInfo, FormInput, AuditConfig, CrawlProgress } from './types';

export class WebsiteCrawler {
  private config: Required<AuditConfig>;
  private visitedUrls: Set<string> = new Set();
  private baseUrl: string;
  private domain: string;
  private robotsTxt: string | null = null;
  private sitemapUrls: string[] = [];

  constructor(config: AuditConfig) {
    this.config = {
      maxPages: config.maxPages ?? 10,
      timeout: config.timeout ?? 30000,
      userAgent: config.userAgent ?? 'DevelopersMatrix-Audit-Bot/1.0 (+https://developersmatrix.com)',
      followRedirects: config.followRedirects ?? true,
      ...config,
    };
    
    this.baseUrl = this.normalizeUrl(config.url);
    this.domain = new URL(this.baseUrl).hostname;
  }

  private normalizeUrl(url: string): string {
    try {
      const parsed = new URL(url);
      // Remove trailing slash for consistency
      return `${parsed.protocol}//${parsed.hostname}${parsed.pathname.replace(/\/$/, '') || '/'}`;
    } catch {
      return url;
    }
  }

  private isInternal(url: string): boolean {
    try {
      const parsed = new URL(url, this.baseUrl);
      return parsed.hostname === this.domain;
    } catch {
      return false;
    }
  }

  private resolveUrl(href: string, currentUrl: string): string | null {
    try {
      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return null;
      }
      const resolved = new URL(href, currentUrl);
      return resolved.href;
    } catch {
      return null;
    }
  }

  async fetchRobotsTxt(): Promise<string | null> {
    try {
      const robotsUrl = `${this.baseUrl}/robots.txt`;
      const response = await fetch(robotsUrl, {
        headers: { 'User-Agent': this.config.userAgent },
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        this.robotsTxt = await response.text();
        // Parse sitemap URLs from robots.txt
        const sitemapMatches = this.robotsTxt.matchAll(/Sitemap:\s*(.+)/gi);
        for (const match of sitemapMatches) {
          this.sitemapUrls.push(match[1].trim());
        }
        return this.robotsTxt;
      }
    } catch {
      // Robots.txt not found or error
    }
    return null;
  }

  async fetchPage(url: string): Promise<PageData | null> {
    if (this.visitedUrls.has(url)) {
      return null;
    }
    this.visitedUrls.add(url);

    const startTime = Date.now();
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.config.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        redirect: this.config.followRedirects ? 'follow' : 'manual',
        signal: AbortSignal.timeout(this.config.timeout),
      });

      const loadTime = Date.now() - startTime;
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract all data from the page
      const pageData: PageData = {
        url,
        title: $('title').text() || '',
        html,
        text: $('body').text().replace(/\s+/g, ' ').trim(),
        headers: this.extractHeaders(response.headers),
        statusCode: response.status,
        loadTime,
        size: Buffer.byteLength(html, 'utf-8'),
        links: this.extractLinks($, url),
        images: this.extractImages($),
        scripts: this.extractScripts($, html),
        styles: this.extractStyles($, html),
        meta: this.extractMeta($),
        structured_data: this.extractStructuredData($),
        forms: this.extractForms($),
      };

      return pageData;
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return null;
    }
  }

  private extractHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private extractLinks($: cheerio.CheerioAPI, currentUrl: string): LinkInfo[] {
    const links: LinkInfo[] = [];
    
    $('a[href]').each((_, el) => {
      const $el = $(el);
      const href = $el.attr('href') || '';
      const resolvedUrl = this.resolveUrl(href, currentUrl);
      
      if (resolvedUrl) {
        links.push({
          href: resolvedUrl,
          text: $el.text().trim().substring(0, 100),
          rel: $el.attr('rel'),
          target: $el.attr('target'),
          isInternal: this.isInternal(resolvedUrl),
        });
      }
    });
    
    return links;
  }

  private extractImages($: cheerio.CheerioAPI): ImageInfo[] {
    const images: ImageInfo[] = [];
    
    $('img').each((_, el) => {
      const $el = $(el);
      images.push({
        src: $el.attr('src') || '',
        alt: $el.attr('alt'),
        width: $el.attr('width') ? parseInt($el.attr('width')!) : undefined,
        height: $el.attr('height') ? parseInt($el.attr('height')!) : undefined,
        loading: $el.attr('loading'),
      });
    });
    
    return images;
  }

  private extractScripts($: cheerio.CheerioAPI, html: string): ScriptInfo[] {
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

  private extractStyles($: cheerio.CheerioAPI, html: string): StyleInfo[] {
    const styles: StyleInfo[] = [];
    
    $('link[rel="stylesheet"]').each((_, el) => {
      styles.push({
        href: $(el).attr('href'),
      });
    });
    
    $('style').each((_, el) => {
      styles.push({
        content: ($(el).html() || '').substring(0, 500),
      });
    });
    
    return styles;
  }

  private extractMeta($: cheerio.CheerioAPI): MetaInfo {
    const h1: string[] = [];
    const h2: string[] = [];
    const h3: string[] = [];
    const h4: string[] = [];
    const h5: string[] = [];
    const h6: string[] = [];

    $('h1').each((_, el) => { h1.push($(el).text().trim()); });
    $('h2').each((_, el) => { h2.push($(el).text().trim()); });
    $('h3').each((_, el) => { h3.push($(el).text().trim()); });
    $('h4').each((_, el) => { h4.push($(el).text().trim()); });
    $('h5').each((_, el) => { h5.push($(el).text().trim()); });
    $('h6').each((_, el) => { h6.push($(el).text().trim()); });

    return {
      title: $('title').text() || undefined,
      description: $('meta[name="description"]').attr('content'),
      keywords: $('meta[name="keywords"]').attr('content'),
      canonical: $('link[rel="canonical"]').attr('href'),
      robots: $('meta[name="robots"]').attr('content'),
      ogTitle: $('meta[property="og:title"], meta[name="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"], meta[name="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"], meta[name="og:image"]').attr('content'),
      ogUrl: $('meta[property="og:url"], meta[name="og:url"]').attr('content'),
      twitterCard: $('meta[name="twitter:card"]').attr('content'),
      twitterTitle: $('meta[name="twitter:title"]').attr('content'),
      twitterDescription: $('meta[name="twitter:description"]').attr('content'),
      twitterImage: $('meta[name="twitter:image"]').attr('content'),
      viewport: $('meta[name="viewport"]').attr('content'),
      charset: $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content'),
      lang: $('html').attr('lang'),
      h1, h2, h3, h4, h5, h6,
    };
  }

  private extractStructuredData($: cheerio.CheerioAPI): StructuredData[] {
    const structuredData: StructuredData[] = [];
    
    // JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        const type = json['@type'] || 'Unknown';
        structuredData.push({ type, json });
      } catch {
        // Invalid JSON
      }
    });
    
    // Microdata (simplified)
    $('[itemscope]').each((_, el) => {
      const $el = $(el);
      const type = $el.attr('itemtype') || 'Unknown';
      const properties: Record<string, string> = {};
      $el.find('[itemprop]').each((_, prop) => {
        const $prop = $(prop);
        const propName = $prop.attr('itemprop');
        if (propName) {
          properties[propName] = $prop.text().trim();
        }
      });
      structuredData.push({ type: type.split('/').pop() || type, json: properties });
    });
    
    return structuredData;
  }

  private extractForms($: cheerio.CheerioAPI): FormInfo[] {
    const forms: FormInfo[] = [];
    
    $('form').each((_, form) => {
      const $form = $(form);
      const inputs: FormInput[] = [];
      let hasLabel = false;
      
      $form.find('input, textarea, select').each((_, input) => {
        const $input = $(input);
        const name = $input.attr('name') || $input.attr('id');
        const hasInputLabel = name ? $form.find(`label[for="${name}"]`).length > 0 : false;
        if (hasInputLabel) hasLabel = true;
        
        inputs.push({
          type: $input.attr('type') || $input[0].tagName.toLowerCase(),
          name: $input.attr('name'),
          id: $input.attr('id'),
          placeholder: $input.attr('placeholder'),
          required: $input.attr('required') !== undefined,
          hasLabel: hasInputLabel,
        });
      });
      
      forms.push({
        action: $form.attr('action'),
        method: $form.attr('method'),
        inputs,
        hasLabel,
      });
    });
    
    return forms;
  }

  async crawl(
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<PageData[]> {
    const pages: PageData[] = [];
    const queue: string[] = [this.baseUrl];
    let pagesScanned = 0;

    onProgress?.({
      status: 'initializing',
      message: 'Initializing scan...',
      progress: 0,
      pagesScanned: 0,
      totalPages: this.config.maxPages,
      errors: [],
    });

    // Fetch robots.txt
    await this.fetchRobotsTxt();

    onProgress?.({
      status: 'crawling',
      message: 'Fetching page data...',
      progress: 5,
      pagesScanned: 0,
      totalPages: this.config.maxPages,
      errors: [],
    });

    while (queue.length > 0 && pagesScanned < this.config.maxPages) {
      const url = queue.shift()!;
      
      onProgress?.({
        status: 'crawling',
        message: `Scanning ${new URL(url).pathname}...`,
        progress: Math.min(95, 5 + (pagesScanned / this.config.maxPages) * 50),
        pagesScanned,
        totalPages: this.config.maxPages,
        currentPage: url,
        errors: [],
      });

      const pageData = await this.fetchPage(url);
      
      if (pageData) {
        pages.push(pageData);
        pagesScanned++;

        // Add internal links to queue
        for (const link of pageData.links) {
          if (
            link.isInternal && 
            !this.visitedUrls.has(link.href) && 
            !queue.includes(link.href) &&
            queue.length < this.config.maxPages * 2
          ) {
            queue.push(link.href);
          }
        }
      }
    }

    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing collected data...',
      progress: 60,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });

    return pages;
  }

  async checkBrokenLinks(pages: PageData[]): Promise<Map<string, { status: number; error?: string }>> {
    const results = new Map<string, { status: number; error?: string }>();
    const uniqueLinks = new Set<string>();

    // Collect unique external links
    for (const page of pages) {
      for (const link of page.links) {
        if (!link.isInternal && !uniqueLinks.has(link.href)) {
          uniqueLinks.add(link.href);
        }
      }
    }

    // Check each link (with concurrency limit)
    const linksArray = Array.from(uniqueLinks).slice(0, 50); // Limit to 50 external links
    await Promise.all(
      linksArray.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(10000),
            headers: { 'User-Agent': this.config.userAgent },
          });
          results.set(url, { status: response.status });
        } catch (error) {
          results.set(url, { status: 0, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      })
    );

    return results;
  }

  getDomain(): string {
    return this.domain;
  }

  getRobotsTxt(): string | null {
    return this.robotsTxt;
  }

  getSitemapUrls(): string[] {
    return this.sitemapUrls;
  }
}
