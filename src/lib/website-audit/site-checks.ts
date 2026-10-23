/**
 * Site wide checks that need their own requests: links, the 404 page, the
 * favicon, host and HTTPS redirects, HTTP/2, email DNS records, ads.txt,
 * static file caching and minification, responsive CSS, directory listings
 * and AI crawler access.
 *
 * Rules every check here follows:
 * - Every HTTP request goes through safeFetch, so private addresses stay
 *   blocked on every redirect hop.
 * - Nothing is guessed. When a check cannot reach a verdict (time ran out,
 *   bot protection answered, DNS did not answer, there was nothing to read),
 *   its named check id goes into notMeasured and the report shows "Not run",
 *   never a free pass.
 * - Bot walls are not broken sites. 401, 403, 429, 503, 52x and Cloudflare
 *   mitigation answers count as "could not check", not as failures.
 * - The whole module has a time budget, and every request inside it is
 *   shortened to fit the time left, so one slow file cannot void a check.
 */

import { lookup, resolveTxt, resolveMx } from 'node:dns/promises';
import { connect as tlsConnect } from 'node:tls';
import * as cheerio from 'cheerio';
import type { AuditIssue, PageData, SiteContext } from './types';
import { safeFetch, readTextCapped, isPrivateAddress, BlockedUrlError } from './safe-fetch';
import { isAllowed, type ParsedRobots } from './robots';
import { registrableDomain, isPlatformHost, isIpHost, sameSiteHost } from './domains';

/* ------------------------------------------------------------------ */
/* Facts returned to the report                                        */
/* ------------------------------------------------------------------ */

export interface LinkCheckFacts {
  /** Links we got a definite answer for, plus crawled pages that returned an error. */
  checked: number;
  internalChecked: number;
  externalChecked: number;
  broken: { url: string; status: number | null; foundOn: string; internal: boolean }[];
  /** Links behind bot protection, rate limits or redirect loops, so we could not tell. */
  unverified: number;
  /** Links found but not checked because of the per audit limit or time. */
  notChecked: number;
}

export interface SiteCheckFacts {
  links?: LinkCheckFacts;
  notFoundPage?: { status: number | null; redirected: boolean; custom: boolean };
  favicon?: { found: boolean; url: string | null; source: 'link' | 'favicon.ico' | null };
  hosts?: { variant: string; finalUrl: string | null; ok: boolean }[];
  http2?: { protocol: string | null; http3Advertised: boolean };
  email?: { domain: string; spf: string | null; spfCount: number; dmarc: string | null; mx: boolean | null };
  ads?: { adsFound: boolean; publisherIds: string[]; adsTxtFound: boolean; listed: string[] };
  assets?: { url: string; kind: 'css' | 'js'; bytes: number; cacheSeconds: number | null; minified: boolean }[];
  responsiveCss?: { mediaQueries: boolean; inspected: number; declared: number };
  aiCrawlers?: { token: string; name: string; purpose: 'search' | 'training'; allowed: boolean }[];
  preview?: { url: string; title: string; description: string };
}

export interface SiteCheckResult {
  issues: AuditIssue[];
  facts: SiteCheckFacts;
  /** Named check ids (from check-catalogue.ts) that could not reach a verdict this time. */
  notMeasured: string[];
}

interface Context {
  /** 2xx HTML pages. pages[0] is the homepage. */
  pages: PageData[];
  /** Every page the crawl fetched, including 404s. */
  allPages: PageData[];
  site: SiteContext;
  robots: ParsedRobots | null;
  userAgent: string;
}

/* ------------------------------------------------------------------ */
/* Limits                                                              */
/* ------------------------------------------------------------------ */

/** Whole module budget. The crawl has already used part of the route's time. */
const SITE_CHECK_BUDGET_MS = 12000;
const REQUEST_TIMEOUT_MS = 5000;
/** Do not start a request with less time than this left. */
const MIN_REQUEST_MS = 1200;
const MAX_INTERNAL_LINKS = 40;
const MAX_EXTERNAL_LINKS = 20;
const LINK_CONCURRENCY = 8;
const MAX_CSS = 4;
const MAX_JS = 4;
const ASSET_MAX_BYTES = 800_000;
/** A week. Shorter than this and repeat visitors download the same file again soon. */
const MIN_ASSET_CACHE_SECONDS = 7 * 24 * 3600;

/** Crawlers that fetch pages to answer a person's question or build AI search results. */
const AI_SEARCH_CRAWLERS: { token: string; name: string }[] = [
  { token: 'OAI-SearchBot', name: 'ChatGPT search (OAI-SearchBot)' },
  { token: 'ChatGPT-User', name: 'ChatGPT browsing (ChatGPT-User)' },
  { token: 'PerplexityBot', name: 'Perplexity (PerplexityBot)' },
  { token: 'Claude-SearchBot', name: 'Claude search (Claude-SearchBot)' },
  { token: 'Claude-User', name: 'Claude browsing (Claude-User)' },
];

/** Crawlers that collect pages to train models. Blocking these is a business choice. */
const AI_TRAINING_CRAWLERS: { token: string; name: string }[] = [
  { token: 'GPTBot', name: 'OpenAI training (GPTBot)' },
  { token: 'ClaudeBot', name: 'Anthropic training (ClaudeBot)' },
  { token: 'Google-Extended', name: 'Google AI training (Google-Extended)' },
  { token: 'Applebot-Extended', name: 'Apple AI training (Applebot-Extended)' },
  { token: 'CCBot', name: 'Common Crawl (CCBot)' },
];

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

/** The check could not reach a verdict. Its ids are reported as Not run. */
class NoVerdict extends Error {}

/** Resolve with the value, or reject with NoVerdict once the deadline passes. */
function before<T>(work: Promise<T>, deadline: number): Promise<T> {
  const left = deadline - Date.now();
  if (left <= 0) return Promise.reject(new NoVerdict());
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new NoVerdict()), left);
    work.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

/** A request timeout that never runs past the module deadline. 0 means do not start. */
function timeoutFor(deadline: number): number {
  const left = deadline - Date.now() - 500;
  return left < MIN_REQUEST_MS ? 0 : Math.min(REQUEST_TIMEOUT_MS, left);
}

function stripHash(url: string): string {
  const i = url.indexOf('#');
  return i === -1 ? url : url.slice(0, i);
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

/** Answers that come from bot protection or overload, not from a missing page. */
function isBlockedStatus(status: number, headers?: Headers): boolean {
  if (status === 401 || status === 403 || status === 429 || status === 503 || status === 999) return true;
  if (status >= 520 && status <= 530) return true; // Cloudflare origin errors and challenges
  if (headers?.get('cf-mitigated')) return true;
  return false;
}

async function runPool<T>(items: T[], size: number, worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  const lanes = Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
    }
  });
  await Promise.all(lanes);
}

function cacheSeconds(headers: Headers): number | null {
  const cc = (headers.get('cache-control') || '').toLowerCase();
  if (/\bno-store\b|\bno-cache\b/.test(cc)) return 0;
  const m = cc.match(/(?:^|[,\s])max-age\s*=\s*(\d+)/);
  if (m) return parseInt(m[1], 10);
  if (/\bimmutable\b/.test(cc)) return 31536000;
  const expires = headers.get('expires');
  if (expires) {
    const t = Date.parse(expires);
    if (Number.isFinite(t)) return Math.max(0, Math.round((t - Date.now()) / 1000));
  }
  return null;
}

function humanDuration(seconds: number | null): string {
  if (seconds === null) return 'no caching header';
  if (seconds <= 0) return 'not cached';
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  return `${Math.round(seconds / 86400)} days`;
}

function whitespaceShare(text: string): number {
  let ws = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 32 || c === 9 || c === 10 || c === 13) ws++;
  }
  return text.length ? ws / text.length : 0;
}

/**
 * Rough minification test. Minified files have very long lines and almost no
 * indentation. Hand written files have short lines and plenty of whitespace.
 * Files under 5 KB are too small for minification to matter.
 */
function looksMinified(url: string, text: string): boolean {
  if (/[.-]min\.(css|js)(\?|$)/i.test(url)) return true;
  if (text.length < 5000) return true;
  const lines = text.split('\n');
  const avgLine = text.length / Math.max(1, lines.length);
  return avgLine > 200 || whitespaceShare(text) < 0.12;
}

/* ------------------------------------------------------------------ */
/* The checks                                                          */
/* ------------------------------------------------------------------ */

type Job = { ids: string[]; run: () => Promise<string[] | void> };

export async function runSiteChecks(ctx: Context): Promise<SiteCheckResult> {
  const deadline = Date.now() + SITE_CHECK_BUDGET_MS;
  const issues: AuditIssue[] = [];
  const facts: SiteCheckFacts = {};
  const notMeasured: string[] = [];
  const home = ctx.pages[0];
  if (!home) return { issues, facts, notMeasured };

  const origin = ctx.site.origin || new URL(home.finalUrl || home.url).origin;
  const host = ctx.site.host || hostOf(origin);
  const https = origin.startsWith('https:');
  const headers = { 'User-Agent': ctx.userAgent, Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' };
  const $home = cheerio.load(home.html || '');

  facts.preview = {
    url: home.finalUrl || home.url,
    title: home.title || '',
    description: home.meta.description || '',
  };

  // AI crawler access needs no request.
  notMeasured.push(...aiCrawlerCheck(ctx, facts, issues, origin));

  const jobs: Job[] = [
    { ids: ['broken-links'], run: () => linkCheck(ctx, facts, issues, headers, deadline) },
    { ids: ['custom-404'], run: () => notFoundCheck(origin, facts, issues, headers, deadline) },
    { ids: ['favicon'], run: () => faviconCheck($home, home, origin, facts, issues, headers, deadline) },
    { ids: ['url-canonicalization', 'https'], run: () => hostCheck(origin, host, https, home, facts, issues, headers, deadline) },
    { ids: ['http2'], run: () => http2Check(host, https, home, facts, issues, origin) },
    { ids: ['spf', 'dmarc'], run: () => emailCheck(host, facts, issues, origin) },
    { ids: ['ads-txt'], run: () => adsTxtCheck($home, origin, facts, issues, headers, deadline) },
    {
      ids: ['caching', 'minification', 'responsive-css'],
      run: () => assetCheck($home, home, host, facts, issues, headers, deadline),
    },
    { ids: ['directory-listing'], run: () => directoryCheck($home, home, origin, host, issues, headers, deadline) },
  ];

  await Promise.all(
    jobs.map(async (job) => {
      try {
        const partial = await before(job.run(), deadline);
        if (partial) notMeasured.push(...partial);
      } catch {
        // No verdict: time ran out, a bot wall answered, or DNS did not answer.
        notMeasured.push(...job.ids);
      }
    })
  );

  // A check that ran out of time may still finish in the background. Hand
  // back copies so a late result cannot change a report already built.
  const unmeasured = new Set(notMeasured);
  const snapshot: SiteCheckFacts = JSON.parse(JSON.stringify(facts));
  if (unmeasured.has('broken-links')) delete snapshot.links;
  return { issues: [...issues], facts: snapshot, notMeasured: [...unmeasured] };
}

/* ---------- broken links ---------- */

type ProbeResult = number | 'dead' | 'unverified' | 'skipped';

async function linkCheck(
  ctx: Context,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<void> {
  // Pages the crawl already fetched have a known status.
  const known = new Set<string>();
  for (const p of ctx.allPages) {
    known.add(stripHash(p.url));
    known.add(stripHash(p.finalUrl || p.url));
  }

  const foundOn = new Map<string, string>();
  const internal: string[] = [];
  const external: string[] = [];
  const externalPerHost = new Map<string, number>();
  let found = 0;

  for (const page of ctx.pages) {
    for (const link of page.links) {
      const url = stripHash(link.href);
      if (!/^https?:\/\//i.test(url) || known.has(url) || foundOn.has(url)) continue;
      found++;
      foundOn.set(url, page.finalUrl || page.url);
      if (link.isInternal) {
        if (internal.length < MAX_INTERNAL_LINKS) internal.push(url);
      } else {
        const h = hostOf(url);
        const n = externalPerHost.get(h) ?? 0;
        // Two per host is enough to spot a dead site without hammering it.
        if (n < 2 && external.length < MAX_EXTERNAL_LINKS) {
          external.push(url);
          externalPerHost.set(h, n + 1);
        }
      }
    }
  }

  // Crawled pages that answered 404 or 410 are broken internal links too.
  // They are reported here, in the same finding, so one problem counts once.
  const crawledBroken: LinkCheckFacts['broken'] = [];
  for (const p of ctx.allPages) {
    if (p.statusCode !== 404 && p.statusCode !== 410) continue;
    const target = stripHash(p.url);
    const alt = stripHash(p.finalUrl || p.url);
    const from = ctx.pages.find((page) => page.links.some((l) => stripHash(l.href) === target || stripHash(l.href) === alt));
    crawledBroken.push({ url: target, status: p.statusCode, foundOn: from ? from.finalUrl || from.url : 'a crawled page', internal: true });
  }

  const result: LinkCheckFacts = { checked: 0, internalChecked: 0, externalChecked: 0, broken: [], unverified: 0, notChecked: 0 };
  const queue = [...internal.map((u) => ({ url: u, internal: true })), ...external.map((u) => ({ url: u, internal: false }))];
  let probed = 0;

  await runPool(queue, LINK_CONCURRENCY, async ({ url, internal: isInternal }) => {
    const status = await probe(url, headers, deadline);
    if (status === 'skipped') return;
    probed++;
    if (status === 'unverified') {
      result.unverified++;
      return;
    }
    result.checked++;
    if (isInternal) result.internalChecked++;
    else result.externalChecked++;
    if (status === 'dead' || status === 404 || status === 410 || (status >= 400 && status < 600)) {
      result.broken.push({ url, status: status === 'dead' ? null : status, foundOn: foundOn.get(url) || '', internal: isInternal });
    }
  });

  // None of the extra links got an answer: we ran out of time or every one
  // was blocked. Crawled 404s are then reported by the technical module.
  // Also no verdict when every answer came from bot protection: "0 broken"
  // would only mean we were not allowed to look.
  if (queue.length > 0 && (probed === 0 || result.checked === 0)) throw new NoVerdict();

  result.notChecked = Math.max(0, found - probed);
  result.broken.unshift(...crawledBroken);
  result.checked += crawledBroken.length;
  result.internalChecked += crawledBroken.length;
  facts.links = result;

  const describe = (b: LinkCheckFacts['broken'][number]) =>
    `${b.url} (${b.status === null ? 'could not connect' : `HTTP ${b.status}`}) linked from ${b.foundOn}`;

  const brokenInternal = result.broken.filter((b) => b.internal);
  const brokenExternal = result.broken.filter((b) => !b.internal);
  const probedInternal = result.internalChecked - crawledBroken.length;

  if (brokenInternal.length > 0) {
    issues.push({
      id: 'tech-broken-internal-links',
      category: 'technical',
      type: 'broken_link',
      severity: 'high',
      title: `${brokenInternal.length} Broken Internal ${brokenInternal.length === 1 ? 'Link' : 'Links'}`,
      description: `${brokenInternal.length === 1 ? 'This internal link returns' : 'These internal links return'} an error. Besides the pages we crawled, we requested ${probedInternal} more internal ${probedInternal === 1 ? 'link' : 'links'} found on them.`,
      impact: 'Visitors who click these land on an error page, and Google spends crawl time on pages that do not exist.',
      suggestion: 'Point each link at the right page, or add a 301 redirect from the old address to its replacement.',
      priority: 9,
      affectedUrls: brokenInternal.slice(0, 10).map(describe),
      fixInstructions: [
        { step: 1, title: 'Find the link', description: 'Open the page listed after "linked from" and search for the broken address.' },
        { step: 2, title: 'Fix or redirect', description: 'Update the link to the current page, or redirect the old address with a 301 if other sites link to it too.' },
      ],
      timeToFix: '10 minutes per link',
      difficulty: 'easy',
    });
  }

  if (brokenExternal.length > 0) {
    issues.push({
      id: 'tech-broken-external-links',
      category: 'technical',
      type: 'broken_link',
      severity: 'medium',
      title: `${brokenExternal.length} Broken Outbound ${brokenExternal.length === 1 ? 'Link' : 'Links'}`,
      description: `We requested ${result.externalChecked} links to other sites and ${brokenExternal.length} did not load. A site can be down for a moment, so open each one to confirm before you change it.`,
      impact: 'Dead outbound links frustrate readers and make a page look neglected.',
      suggestion: 'Replace each dead link with a working source, link to an archived copy, or remove it.',
      priority: 5,
      affectedUrls: brokenExternal.slice(0, 10).map(describe),
      timeToFix: '5 minutes per link',
      difficulty: 'easy',
    });
  }
}

/** HEAD first, then GET whenever HEAD did not give a clean answer. */
async function probe(url: string, headers: Record<string, string>, deadline: number): Promise<ProbeResult> {
  const attempt = async (method: 'HEAD' | 'GET') => {
    const timeoutMs = timeoutFor(deadline);
    if (timeoutMs === 0) return null;
    const { response } = await safeFetch(url, { method, headers, timeoutMs });
    response.body?.cancel().catch(() => {});
    return response;
  };
  try {
    let response = await attempt('HEAD');
    if (!response) return 'skipped';
    if (response.status >= 400) {
      // Many servers answer HEAD wrongly. Confirm with GET before judging.
      try {
        const again = await attempt('GET');
        if (again) response = again;
      } catch {
        /* keep the HEAD answer */
      }
    }
    if (isBlockedStatus(response.status, response.headers)) return 'unverified';
    return response.status;
  } catch (e) {
    if (e instanceof BlockedUrlError) return 'skipped'; // private address: never ours to check
    const err = e as Error & { cause?: { code?: string } };
    const code = err?.cause?.code || (err as { code?: string })?.code || '';
    // Only a domain that does not exist or refuses connections is dead.
    // Timeouts, TLS hiccups and redirect loops are not proof of anything.
    if (code === 'ENOTFOUND' || code === 'ECONNREFUSED') return 'dead';
    return 'unverified';
  }
}

/* ---------- custom 404 page ---------- */

async function notFoundCheck(
  origin: string,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<void> {
  const timeoutMs = timeoutFor(deadline);
  if (timeoutMs === 0) throw new NoVerdict();
  const probeUrl = `${origin}/dm-audit-missing-page-${Math.random().toString(36).slice(2, 10)}`;
  const { response, redirects, finalUrl } = await safeFetch(probeUrl, { headers, timeoutMs });
  const status = response.status;
  if (isBlockedStatus(status, response.headers) || status >= 500) {
    response.body?.cancel().catch(() => {});
    throw new NoVerdict(); // bot protection or a server error says nothing about the 404 page
  }
  const { text } = await readTextCapped(response, 300_000);
  const $ = cheerio.load(text || '');
  const linkCount = $('a[href]').length;
  const hasTitle = $('title').text().trim().length > 0;
  const custom = status !== 200 && hasTitle && linkCount >= 3;
  facts.notFoundPage = { status, redirected: redirects.length > 0, custom };

  if (status >= 200 && status < 300) {
    let landedPath = '/';
    try {
      landedPath = new URL(finalUrl).pathname;
    } catch {
      /* keep root */
    }
    // The homepage, or a language homepage such as /en/ or /en-gb/.
    const toHome = redirects.length > 0 && /^\/(?:[a-z]{2}(?:-[a-z]{2})?\/?)?$/i.test(landedPath);
    issues.push({
      id: toHome ? 'tech-404-redirects-home' : 'tech-soft-404',
      category: 'technical',
      type: 'broken_link',
      severity: 'medium',
      title: toHome ? 'Missing Pages Redirect to the Homepage' : 'Missing Pages Return 200 (Soft 404)',
      description: toHome
        ? `We requested a page that does not exist (${probeUrl}). It redirected to ${finalUrl} instead of answering 404.`
        : `We requested a page that does not exist (${probeUrl}). The server answered 200 OK instead of 404.`,
      impact: 'Google treats this as a soft 404. It can waste crawl time on addresses that do not exist and keep dead pages in its index longer.',
      suggestion: 'Make unknown addresses answer with HTTP 404 (or 410 for pages removed on purpose) and show a helpful error page with links to your main sections.',
      priority: 6,
      affectedUrls: [probeUrl],
      timeToFix: '30 minutes',
      difficulty: 'medium',
    });
    return;
  }

  if ((status === 404 || status === 410) && !custom) {
    issues.push({
      id: 'tech-default-404',
      category: 'technical',
      type: 'broken_link',
      severity: 'low',
      title: 'Plain 404 Page',
      description: `Missing pages correctly answer ${status}, but the error page has ${linkCount === 0 ? 'no links' : `only ${linkCount} ${linkCount === 1 ? 'link' : 'links'}`}${hasTitle ? '' : ' and no title'}.`,
      impact: 'A visitor who follows an old link hits a dead end and is likely to leave.',
      suggestion: 'Keep the 404 status, but show a page with your normal navigation, a search box or links to your most useful pages.',
      priority: 3,
      affectedUrls: [probeUrl],
      timeToFix: '30 minutes',
      difficulty: 'easy',
    });
  }
}

/* ---------- favicon ---------- */

async function faviconCheck(
  $: cheerio.CheerioAPI,
  home: PageData,
  origin: string,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<void> {
  const base = home.finalUrl || home.url;
  // rel="icon" and rel="shortcut icon" are what Google reads for the search
  // favicon. apple-touch-icon is for home screens, so it does not decide this.
  const declared: string[] = [];
  $('link[rel][href]').each((_, el) => {
    const rel = ($(el).attr('rel') || '').toLowerCase().split(/\s+/);
    if (!rel.includes('icon')) return;
    try {
      const href = new URL($(el).attr('href') || '', base).href;
      if (!declared.includes(href)) declared.push(href);
    } catch {
      /* ignore */
    }
  });

  let blocked = false;
  const loads = async (url: string): Promise<boolean> => {
    if (url.startsWith('data:')) return true;
    const timeoutMs = timeoutFor(deadline);
    if (timeoutMs === 0) throw new NoVerdict();
    const { response } = await safeFetch(url, { headers: { ...headers, Accept: 'image/*,*/*;q=0.8' }, timeoutMs });
    response.body?.cancel().catch(() => {});
    if (isBlockedStatus(response.status, response.headers) || response.status >= 500) {
      blocked = true;
      return false;
    }
    const type = (response.headers.get('content-type') || '').toLowerCase();
    return response.ok && !type.includes('text/html');
  };

  if (declared.length > 0) {
    const tried = declared.slice(0, 3);
    for (const url of tried) {
      if (await loads(url)) {
        facts.favicon = { found: true, url, source: 'link' };
        return;
      }
    }
    if (blocked) throw new NoVerdict();
    facts.favicon = { found: false, url: tried[0], source: 'link' };
    issues.push({
      id: 'seo-favicon-broken',
      category: 'seo',
      type: 'missing_title',
      severity: 'low',
      title: 'Favicon File Does Not Load',
      description: `The page declares ${tried.length === 1 ? 'a favicon' : `${tried.length} favicons`} (${tried.join(', ')}), but none loaded as an image.`,
      impact: 'Google shows a favicon next to your site in search results, and browsers show it in tabs. A broken one is replaced with a generic icon.',
      suggestion: 'Upload the icon file to the address in the link tag, or point the tag at the right file.',
      priority: 3,
      affectedUrls: tried,
      timeToFix: '10 minutes',
      difficulty: 'easy',
    });
    return;
  }

  const fallback = `${origin}/favicon.ico`;
  const ok = await loads(fallback);
  if (!ok && blocked) throw new NoVerdict();
  facts.favicon = { found: ok, url: ok ? fallback : null, source: ok ? 'favicon.ico' : null };
  if (!ok) {
    issues.push({
      id: 'seo-no-favicon',
      category: 'seo',
      type: 'missing_title',
      severity: 'low',
      title: 'No Favicon Found',
      description: 'The homepage has no icon link tag and /favicon.ico does not exist.',
      impact: 'Google shows a favicon next to your site in search results, and browsers show it in tabs and bookmarks. Without one you get a generic icon.',
      suggestion: 'Add a square icon (at least 48 by 48 pixels) and declare it in the head of every page.',
      priority: 3,
      codeSnippet: '<link rel="icon" href="/favicon.ico" sizes="48x48">\n<link rel="icon" href="/icon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
      timeToFix: '15 minutes',
      difficulty: 'easy',
    });
  }
}

/* ---------- www, non www and http variants ---------- */

async function hostCheck(
  origin: string,
  host: string,
  https: boolean,
  home: PageData,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<string[]> {
  const unmeasured: string[] = [];
  if (isIpHost(host)) return ['url-canonicalization'];
  const altHost = host.startsWith('www.') ? host.slice(4) : `www.${host}`;
  const altUrl = `${https ? 'https' : 'http'}://${altHost}/`;
  const httpUrl = `http://${host}/`;
  const homeTitle = (home.title || '').trim().toLowerCase();

  type Outcome = { finalUrl: string | null; status: number | null; title: string; canonical: string; blocked: boolean };
  const visit = async (url: string): Promise<Outcome> => {
    const timeoutMs = timeoutFor(deadline);
    if (timeoutMs === 0) return { finalUrl: null, status: null, title: '', canonical: '', blocked: true };
    try {
      const { response, finalUrl } = await safeFetch(url, { headers, timeoutMs });
      if (isBlockedStatus(response.status, response.headers)) {
        response.body?.cancel().catch(() => {});
        return { finalUrl, status: response.status, title: '', canonical: '', blocked: true };
      }
      const { text } = await readTextCapped(response, 300_000);
      const $ = cheerio.load(text || '');
      return {
        finalUrl,
        status: response.status,
        title: $('head > title').first().text().trim().toLowerCase(),
        canonical: ($('link[rel="canonical"]').attr('href') || '').trim(),
        blocked: false,
      };
    } catch (e) {
      // The other host does not exist or does not answer. That is fine:
      // nobody can reach a duplicate copy through it.
      if (e instanceof BlockedUrlError) return { finalUrl: null, status: null, title: '', canonical: '', blocked: true };
      return { finalUrl: null, status: null, title: '', canonical: '', blocked: false };
    }
  };

  const [alt, plain] = await Promise.all([visit(altUrl), https ? visit(httpUrl) : Promise.resolve(null)]);
  const results: NonNullable<SiteCheckFacts['hosts']> = [];

  const sameOrigin = (u: string | null) => {
    try {
      return !!u && new URL(u).origin === origin;
    } catch {
      return false;
    }
  };

  // www or non www
  if (alt.blocked) {
    unmeasured.push('url-canonicalization');
  } else {
    const servesItself = alt.finalUrl !== null && !sameOrigin(alt.finalUrl) && (alt.status ?? 0) >= 200 && (alt.status ?? 0) < 300;
    results.push({ variant: altUrl, finalUrl: alt.finalUrl, ok: !servesItself });
    if (servesItself) {
      const pointsHome = alt.canonical && sameOrigin(new URL(alt.canonical, alt.finalUrl || altUrl).href);
      const sameSite = pointsHome || (homeTitle && alt.title === homeTitle);
      issues.push(
        sameSite
          ? {
              id: 'tech-duplicate-host',
              category: 'technical',
              type: 'duplicate_content',
              severity: pointsHome ? 'low' : 'medium',
              title: 'Site Loads on Both www and non www',
              description: `${altUrl} shows the same site without redirecting to ${origin}/.${pointsHome ? ' Its canonical tag points to the main address, which limits the damage.' : ''}`,
              impact: 'Two addresses serve the same site, so links and signals can split between them. A canonical tag softens this, but a redirect settles it.',
              suggestion: `Redirect every request on ${altHost} to ${host} with a 301, keeping the path.`,
              priority: 6,
              affectedUrls: [altUrl],
              codeSnippet: `# nginx\nserver {\n  server_name ${altHost};\n  return 301 ${origin}$request_uri;\n}`,
              timeToFix: '15 minutes',
              difficulty: 'medium',
            }
          : {
              id: 'tech-alt-host-different',
              category: 'technical',
              type: 'duplicate_content',
              severity: 'low',
              title: `${altHost} Shows a Different Page`,
              description: `${altUrl} loads a page with a different title instead of redirecting to ${origin}/. It may be a parking page or an old site.`,
              impact: 'Visitors who type the other version of your address may land somewhere unexpected.',
              suggestion: `Point ${altHost} at your site and redirect it to ${host} with a 301, or remove the DNS record if you do not use it.`,
              priority: 3,
              affectedUrls: [altUrl],
              timeToFix: '15 minutes',
              difficulty: 'medium',
            }
      );
    }
  }

  // http to https
  if (plain) {
    if (plain.blocked) {
      unmeasured.push('https');
    } else {
      const open = plain.finalUrl !== null && plain.finalUrl.startsWith('http://') && (plain.status ?? 0) >= 200 && (plain.status ?? 0) < 300;
      results.push({ variant: httpUrl, finalUrl: plain.finalUrl, ok: !open });
      if (open) {
        issues.push({
          id: 'tech-http-not-redirected',
          category: 'security',
          type: 'missing_https',
          severity: 'medium',
          title: 'HTTP Version Does Not Redirect to HTTPS',
          description: `${httpUrl} loads over plain HTTP instead of redirecting to ${origin}/.`,
          impact: 'Visitors who type the address or follow an old link use an unencrypted connection, and Google sees two versions of the site.',
          suggestion: 'Send a 301 redirect from every http:// address to the matching https:// address.',
          priority: 7,
          affectedUrls: [httpUrl],
          timeToFix: '15 minutes',
          difficulty: 'easy',
        });
      }
    }
  }

  facts.hosts = results;
  return unmeasured;
}

/* ---------- HTTP/2 ---------- */

async function http2Check(
  host: string,
  https: boolean,
  home: PageData,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  origin: string
): Promise<void> {
  if (!https || isIpHost(host)) throw new NoVerdict(); // browsers use HTTP/2 only over HTTPS; the HTTPS check covers that
  const http3Advertised = /\bh3\b/.test((home.headers['alt-svc'] || '').toLowerCase());

  const addresses = await lookup(host, { all: true });
  if (addresses.length === 0 || addresses.some((a) => isPrivateAddress(a.address))) throw new NoVerdict();
  // Serverless functions often have no IPv6 route, so try IPv4 first.
  const ordered = [...addresses.filter((a) => a.family === 4), ...addresses.filter((a) => a.family !== 4)];

  const connectOnce = (address: string) =>
    new Promise<string | null>((resolve, reject) => {
      const socket = tlsConnect({
        host: address,
        port: 443,
        servername: host,
        ALPNProtocols: ['h2', 'http/1.1'],
        timeout: 4000,
      });
      socket.once('secureConnect', () => {
        const p = socket.alpnProtocol || null;
        socket.end();
        resolve(typeof p === 'string' ? p : null);
      });
      socket.once('timeout', () => {
        socket.destroy();
        reject(new NoVerdict());
      });
      socket.once('error', (e) => {
        socket.destroy();
        reject(e);
      });
    });

  let protocol: string | null = null;
  let connected = false;
  for (const a of ordered.slice(0, 2)) {
    try {
      protocol = await connectOnce(a.address);
      connected = true;
      break;
    } catch {
      /* try the next address */
    }
  }
  if (!connected) throw new NoVerdict();

  facts.http2 = { protocol, http3Advertised };
  if (protocol !== 'h2') {
    issues.push({
      id: 'perf-no-http2',
      category: 'performance',
      type: 'render_blocking',
      severity: 'low',
      title: 'Server Does Not Use HTTP/2',
      description: `When we connected to ${host}, the server offered ${protocol === 'http/1.1' ? 'HTTP/1.1 only' : 'no newer protocol'}.`,
      impact: 'HTTP/2 loads many files over one connection at the same time. On HTTP/1.1 the browser has to queue them, which slows pages with many images, styles and scripts.',
      suggestion: 'Turn on HTTP/2 in your web server or hosting panel. Most hosts and every major CDN support it, and it needs no change to the site itself.',
      priority: 3,
      affectedUrls: [origin],
      timeToFix: '15 minutes',
      difficulty: 'easy',
    });
  }
}

/* ---------- SPF and DMARC ---------- */

async function emailCheck(host: string, facts: SiteCheckFacts, issues: AuditIssue[], origin: string): Promise<void> {
  // Email records live on the main domain (example.com), not on www or a
  // blog subdomain, and platform subdomains (site.vercel.app) are not yours
  // to set records on.
  if (isIpHost(host) || isPlatformHost(host)) throw new NoVerdict();
  const domain = registrableDomain(host);

  const txt = async (name: string): Promise<string[] | null> => {
    try {
      const records = await resolveTxt(name);
      return records.map((parts) => parts.join(''));
    } catch (e) {
      const code = (e as NodeJS.ErrnoException)?.code;
      if (code === 'ENODATA' || code === 'ENOTFOUND') return [];
      return null; // DNS did not answer: we cannot say
    }
  };

  const [root, dmarc] = await Promise.all([txt(domain), txt(`_dmarc.${domain}`)]);
  if (root === null || dmarc === null) throw new NoVerdict();

  let mx: boolean | null = null;
  try {
    mx = (await resolveMx(domain)).length > 0;
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code;
    mx = code === 'ENODATA' || code === 'ENOTFOUND' ? false : null;
  }

  const spfRecords = root.filter((r) => /^v=spf1\b/i.test(r.trim()));
  const dmarcRecord = dmarc.find((r) => /^v=dmarc1\b/i.test(r.trim())) || null;
  facts.email = { domain, spf: spfRecords[0] || null, spfCount: spfRecords.length, dmarc: dmarcRecord, mx };

  const noMail = mx === false
    ? ' The domain has no mail (MX) records. If it never sends email, a record that says so still stops others sending email in its name.'
    : '';

  if (spfRecords.length === 0) {
    issues.push({
      id: 'email-no-spf',
      category: 'security',
      type: 'missing_security_header',
      severity: 'low',
      informational: true,
      title: 'No SPF Record',
      description: `${domain} has no SPF record in its DNS.${noMail}`,
      impact: 'SPF tells mail servers which servers may send email for your domain. Without it, your own email is more likely to land in spam and others can spoof your address more easily. It has no effect on rankings.',
      suggestion: mx === false
        ? 'If the domain never sends email, add the TXT record v=spf1 -all.'
        : 'Add a TXT record listing the services that send your email. Your email provider gives you the exact value.',
      priority: 2,
      affectedUrls: [origin],
      codeSnippet: mx === false ? `${domain}.  TXT  "v=spf1 -all"` : `${domain}.  TXT  "v=spf1 include:_spf.google.com ~all"   (example for Google Workspace)`,
      timeToFix: '15 minutes',
      difficulty: 'easy',
    });
  } else if (spfRecords.length > 1) {
    issues.push({
      id: 'email-spf-multiple',
      category: 'security',
      type: 'missing_security_header',
      severity: 'low',
      informational: true,
      title: 'More Than One SPF Record',
      description: `${domain} has ${spfRecords.length} SPF records. The standard allows only one, so mail servers treat SPF as broken.`,
      impact: 'A broken SPF setup can send your own email to spam. It has no effect on rankings.',
      suggestion: 'Merge the records into a single v=spf1 record that includes every service that sends your email.',
      priority: 3,
      affectedUrls: [origin],
      timeToFix: '15 minutes',
      difficulty: 'easy',
    });
  }

  if (!dmarcRecord) {
    issues.push({
      id: 'email-no-dmarc',
      category: 'security',
      type: 'missing_security_header',
      severity: 'low',
      informational: true,
      title: 'No DMARC Record',
      description: `There is no DMARC record at _dmarc.${domain}.`,
      impact: 'DMARC tells mail servers what to do with email that fails SPF or DKIM and sends you reports. Gmail and Yahoo require it from bulk senders. It has no effect on rankings.',
      suggestion: 'Start with a monitoring policy, read the reports for a few weeks, then move to quarantine or reject.',
      priority: 2,
      affectedUrls: [origin],
      codeSnippet: `_dmarc.${domain}.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@${domain}"`,
      timeToFix: '15 minutes',
      difficulty: 'easy',
    });
  }
}

/* ---------- ads.txt ---------- */

async function adsTxtCheck(
  $: cheerio.CheerioAPI,
  origin: string,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<void> {
  // Look for real ad code only: script sources, ad slots and inline script
  // code. The words alone in an article about AdSense do not count.
  const scriptSrc = $('script[src]').map((_, el) => $(el).attr('src') || '').get().join(' ');
  const inlineCode = $('script:not([src])').map((_, el) => $(el).text()).get().join('\n');
  const slotClients = $('ins.adsbygoogle[data-ad-client]').map((_, el) => $(el).attr('data-ad-client') || '').get().join(' ');
  const adSignals = `${scriptSrc}\n${slotClients}\n${inlineCode}`;
  const adsFound =
    /pagead2\.googlesyndication\.com|securepubads\.g\.doubleclick\.net|googletagservices\.com\/tag\/js\/gpt/i.test(scriptSrc) ||
    $('ins.adsbygoogle').length > 0 ||
    /adsbygoogle\s*=\s*window\.adsbygoogle|\(adsbygoogle\s*=|googletag\.cmd/i.test(inlineCode);
  const publisherIds = [...new Set((adSignals.match(/ca-pub-\d{10,20}/g) || []).map((id) => id.replace(/^ca-/, '')))];

  if (!adsFound) {
    facts.ads = { adsFound: false, publisherIds: [], adsTxtFound: false, listed: [] };
    return; // ads.txt only matters for sites that sell ad space
  }

  const timeoutMs = timeoutFor(deadline);
  if (timeoutMs === 0) throw new NoVerdict();
  const url = `${origin}/ads.txt`;
  const { response } = await safeFetch(url, { headers: { ...headers, Accept: 'text/plain,*/*;q=0.8' }, timeoutMs });
  if (isBlockedStatus(response.status, response.headers) || response.status >= 500) {
    response.body?.cancel().catch(() => {});
    throw new NoVerdict();
  }
  const type = (response.headers.get('content-type') || '').toLowerCase();
  const { text, truncated } = await readTextCapped(response, 2_000_000);
  const found = response.ok && !type.includes('text/html') && /,\s*(DIRECT|RESELLER)/i.test(text);
  const listed = found ? [...new Set(text.match(/pub-\d{10,20}/g) || [])] : [];
  facts.ads = { adsFound: true, publisherIds, adsTxtFound: found, listed };

  if (!found) {
    issues.push({
      id: 'ads-txt-missing',
      category: 'technical',
      type: 'missing_robots_txt',
      severity: 'medium',
      informational: true,
      title: 'Ads Found but No ads.txt File',
      description: `The homepage loads Google ad code, but ${url} ${response.ok ? 'is not a valid ads.txt file' : `answered HTTP ${response.status}`}.`,
      impact: 'Ad networks use ads.txt to confirm who may sell your ad space. Without it, Google AdSense warns that earnings are at risk and some buyers skip your inventory. It has no effect on rankings.',
      suggestion: 'Download the ads.txt line from your AdSense account (Sites page) and publish it at the root of your domain.',
      priority: 5,
      affectedUrls: [url],
      codeSnippet: `google.com, ${publisherIds[0] || 'pub-0000000000000000'}, DIRECT, f08c47fec0942fa0`,
      timeToFix: '10 minutes',
      difficulty: 'easy',
    });
    return;
  }

  // A truncated file may list the ID further down, so only judge complete files.
  const missing = truncated ? [] : publisherIds.filter((id) => !listed.includes(id));
  if (missing.length > 0) {
    issues.push({
      id: 'ads-txt-missing-publisher',
      category: 'technical',
      type: 'missing_robots_txt',
      severity: 'medium',
      informational: true,
      title: 'ads.txt Does Not List Your Publisher ID',
      description: `The page uses ${missing.join(', ')}, but ${url} does not list ${missing.length === 1 ? 'it' : 'them'}.`,
      impact: 'Buyers that check ads.txt may treat this ad space as unauthorised. It has no effect on rankings.',
      suggestion: 'Add the google.com line for each publisher ID shown in your AdSense account.',
      priority: 5,
      affectedUrls: [url],
      codeSnippet: `google.com, ${missing[0]}, DIRECT, f08c47fec0942fa0`,
      timeToFix: '10 minutes',
      difficulty: 'easy',
    });
  }
}

/* ---------- static files: caching, minification, responsive CSS ---------- */

async function assetCheck(
  $: cheerio.CheerioAPI,
  home: PageData,
  host: string,
  facts: SiteCheckFacts,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<string[]> {
  const unmeasured: string[] = [];
  const base = home.finalUrl || home.url;

  const collect = (selector: string, attr: string, anyHost: boolean) => {
    const out: string[] = [];
    $(selector).each((_, el) => {
      const raw = $(el).attr(attr);
      if (!raw) return;
      try {
        const u = new URL(raw, base);
        if (!/^https?:$/.test(u.protocol)) return;
        if (!anyHost && !sameSiteHost(u.hostname, host)) return;
        if (!out.includes(u.href)) out.push(u.href);
      } catch {
        /* ignore */
      }
    });
    return out;
  };

  // Stylesheets from any host count for the responsive test (themes often
  // load CSS from a CDN). Caching and minification are judged only on the
  // site's own files, and not on files the host platform controls.
  const declaredCss = collect('link[rel~="stylesheet"][href], link[rel="preload"][as="style"][href]', 'href', true);
  const ownCss = declaredCss.filter((u) => sameSiteHost(hostOf(u), host));
  const otherCss = declaredCss.filter((u) => !sameSiteHost(hostOf(u), host));
  const cssTargets = [...ownCss, ...otherCss].slice(0, MAX_CSS);
  const platformPath = (u: string) => /\/_vercel\/|\/cdn-cgi\//.test(new URL(u).pathname);
  const jsTargets = collect('script[src]', 'src', false).filter((u) => !platformPath(u)).slice(0, MAX_JS);

  const inlineCss = $('style').map((_, el) => $(el).text()).get().join('\n');
  let mediaQueries =
    /@media[^{]*\(/i.test(inlineCss) ||
    $('link[rel~="stylesheet"][media]').toArray().some((el) => /width/i.test($(el).attr('media') || ''));
  let cssRead = 0;

  type Asset = NonNullable<SiteCheckFacts['assets']>[number] & { whitespace: number; own: boolean };
  const assets: Asset[] = [];
  const targets = [
    ...cssTargets.map((u) => ({ url: u, kind: 'css' as const })),
    ...jsTargets.map((u) => ({ url: u, kind: 'js' as const })),
  ];

  await runPool(targets, 4, async ({ url, kind }) => {
    const timeoutMs = timeoutFor(deadline);
    if (timeoutMs === 0) return;
    try {
      const { response } = await safeFetch(url, { headers: { ...headers, Accept: '*/*' }, timeoutMs });
      if (!response.ok) {
        response.body?.cancel().catch(() => {});
        return;
      }
      const { text } = await readTextCapped(response, ASSET_MAX_BYTES);
      const own = sameSiteHost(hostOf(url), host) && !platformPath(url);
      assets.push({
        url,
        kind,
        bytes: text.length,
        cacheSeconds: cacheSeconds(response.headers),
        minified: looksMinified(url, text),
        whitespace: whitespaceShare(text),
        own,
      });
      if (kind === 'css') {
        cssRead++;
        if (/@media[^{]*\(/i.test(text)) mediaQueries = true;
      }
    } catch {
      /* one file failing does not fail the check */
    }
  });

  const ownAssets = assets.filter((a) => a.own);
  facts.assets = ownAssets.map(({ url, kind, bytes, cacheSeconds: c, minified }) => ({ url, kind, bytes, cacheSeconds: c, minified }));
  facts.responsiveCss = { mediaQueries, inspected: cssRead + (inlineCss.trim() ? 1 : 0), declared: declaredCss.length };

  // Caching and minification need at least one of the site's own files.
  if (ownAssets.length === 0) {
    unmeasured.push('minification');
    // Page caching headers are still judged by the performance module, so
    // "caching" only becomes Not run when there is nothing else to go on.
    unmeasured.push('caching');
  } else {
    const shortCache = ownAssets.filter((a) => a.cacheSeconds === null || a.cacheSeconds < MIN_ASSET_CACHE_SECONDS);
    if (shortCache.length > 0) {
      issues.push({
        id: 'perf-short-asset-cache',
        category: 'performance',
        type: 'missing_compression',
        severity: 'low',
        title: 'Static Files Are Cached Briefly or Not at All',
        description: `${shortCache.length} of the ${ownAssets.length} CSS and JavaScript files we checked on your own domain ${shortCache.length === 1 ? 'has' : 'have'} a short cache time.`,
        impact: 'Returning visitors download the same files again instead of using their browser cache, which slows every repeat visit.',
        suggestion: 'Serve versioned static files (names that change when the content changes) with Cache-Control: public, max-age=31536000, immutable.',
        priority: 3,
        affectedUrls: shortCache.slice(0, 6).map((a) => `${a.url} (${humanDuration(a.cacheSeconds)})`),
        codeSnippet: '# nginx\nlocation ~* \\.(css|js|woff2|png|jpg|webp|avif|svg)$ {\n  add_header Cache-Control "public, max-age=31536000, immutable";\n}',
        timeToFix: '20 minutes',
        difficulty: 'medium',
      });
    }

    const unminified = ownAssets.filter((a) => !a.minified);
    if (unminified.length > 0) {
      issues.push({
        id: 'perf-unminified-assets',
        category: 'performance',
        type: 'render_blocking',
        severity: 'low',
        title: 'CSS or JavaScript Not Minified',
        description: `${unminified.length} of the ${ownAssets.length} files we checked ${unminified.length === 1 ? 'looks' : 'look'} unminified: short lines and lots of spaces and line breaks.`,
        impact: 'Unminified files are bigger than they need to be. Compression narrows the gap, but minified files still download and parse faster.',
        suggestion: 'Turn on minification in your build tool, caching plugin or CDN. Most modern frameworks do this automatically for production builds.',
        priority: 3,
        affectedUrls: unminified.slice(0, 6).map((a) => `${a.url} (${Math.round(a.bytes / 1024)} KB, about ${Math.round(a.whitespace * 100)}% whitespace)`),
        timeToFix: '30 minutes',
        difficulty: 'medium',
      });
    }
  }

  // Responsive CSS: pass on the first @media rule found anywhere. Flag only
  // when every stylesheet the page declares was read and none had one.
  const hasViewport = !!(home.meta.viewport || '').trim();
  const allCssRead = cssRead >= declaredCss.length && (declaredCss.length > 0 || inlineCss.trim().length > 0);
  if (!mediaQueries) {
    if (!allCssRead || !hasViewport) {
      unmeasured.push('responsive-css');
    } else {
      issues.push({
        id: 'mobile-no-media-queries',
        category: 'mobile',
        type: 'missing_viewport',
        severity: 'low',
        title: 'No CSS Media Queries Found',
        description: `We read every stylesheet on the homepage (${facts.responsiveCss.inspected}) and found no @media rules.`,
        impact: 'Media queries are the usual way a layout adapts to small screens. Layouts built only with flexible grids can work without them, so check the page on a phone, or the mobile snapshot above, before acting on this.',
        suggestion: 'Check the page on a real phone. If text is cramped or content overflows, add breakpoints for small screens.',
        priority: 3,
        affectedUrls: [base],
        timeToFix: '1 to 3 hours',
        difficulty: 'medium',
      });
    }
  }

  return unmeasured;
}

/* ---------- directory listing ---------- */

async function directoryCheck(
  $: cheerio.CheerioAPI,
  home: PageData,
  origin: string,
  host: string,
  issues: AuditIssue[],
  headers: Record<string, string>,
  deadline: number
): Promise<void> {
  const base = home.finalUrl || home.url;
  const dirs: string[] = [];
  $('img[src], script[src], link[rel~="stylesheet"][href]').each((_, el) => {
    const raw = $(el).attr('src') || $(el).attr('href');
    if (!raw || dirs.length >= 3) return;
    try {
      const u = new URL(raw, base);
      if (u.hostname.toLowerCase() !== host || u.pathname.startsWith('/_next/') || u.pathname.startsWith('/_vercel/')) return;
      const dir = u.pathname.replace(/[^/]*$/, '');
      if (dir === '/' || dir.length < 2) return;
      const full = `${origin}${dir}`;
      if (!dirs.includes(full)) dirs.push(full);
    } catch {
      /* ignore */
    }
  });
  // No folders of our own to try: we cannot say anything about listings.
  if (dirs.length === 0) throw new NoVerdict();

  const open: string[] = [];
  let answered = 0;
  await Promise.all(
    dirs.map(async (dir) => {
      const timeoutMs = timeoutFor(deadline);
      if (timeoutMs === 0) return;
      try {
        const { response } = await safeFetch(dir, { headers, timeoutMs });
        if (isBlockedStatus(response.status, response.headers)) {
          response.body?.cancel().catch(() => {});
          return;
        }
        const { text } = await readTextCapped(response, 100_000);
        answered++;
        if (response.ok && /<title>\s*index of \/|<h1>\s*index of \/|directory listing for \//i.test(text)) open.push(dir);
      } catch {
        /* one folder failing does not decide anything */
      }
    })
  );
  if (answered === 0) throw new NoVerdict();

  if (open.length > 0) {
    issues.push({
      id: 'sec-directory-listing',
      category: 'security',
      type: 'missing_security_header',
      severity: 'medium',
      title: 'Folder Contents Are Publicly Listed',
      description: `Opening ${open[0]} shows a list of every file in that folder.`,
      impact: 'Anyone can browse files you never linked to, such as backups, old uploads or configuration files.',
      suggestion: 'Turn off directory listing on the web server.',
      priority: 6,
      affectedUrls: open,
      codeSnippet: '# Apache (.htaccess)\nOptions -Indexes\n\n# nginx\nautoindex off;',
      timeToFix: '5 minutes',
      difficulty: 'easy',
    });
  }
}

/* ---------- AI crawler access ---------- */

function aiCrawlerCheck(ctx: Context, facts: SiteCheckFacts, issues: AuditIssue[], origin: string): string[] {
  const robots = ctx.robots;
  const status = ctx.site.robots.status;
  // No robots.txt (404) means everything is allowed. A robots.txt we could
  // not read (no answer, 5xx) tells us nothing.
  if (!robots && (status === null || status >= 500 || status === 401 || status === 403 || status === 429)) {
    return ['ai-crawlers'];
  }

  const check = (list: { token: string; name: string }[], purpose: 'search' | 'training') =>
    list.map((c) => ({ ...c, purpose, allowed: robots ? isAllowed(robots, c.token, '/') : true }));

  const all = [...check(AI_SEARCH_CRAWLERS, 'search'), ...check(AI_TRAINING_CRAWLERS, 'training')];
  facts.aiCrawlers = all;

  const blockedSearch = all.filter((c) => c.purpose === 'search' && !c.allowed);
  if (blockedSearch.length > 0) {
    const blockedTraining = all.filter((c) => c.purpose === 'training' && !c.allowed);
    issues.push({
      id: 'ai-search-bots-blocked',
      category: 'technical',
      type: 'missing_robots_txt',
      severity: 'low',
      informational: true,
      title: 'robots.txt Blocks AI Search Crawlers',
      description: `robots.txt blocks ${blockedSearch.map((c) => c.name).join(', ')} from the homepage.${blockedTraining.length ? ` It also blocks ${blockedTraining.length} AI training ${blockedTraining.length === 1 ? 'crawler' : 'crawlers'}, which is a separate choice.` : ''}`,
      impact: 'These crawlers fetch pages so AI assistants can cite and link to them. Blocking them keeps your pages out of those answers. Blocking training crawlers (such as GPTBot or Google-Extended) is a different decision and does not affect this.',
      suggestion: 'If you want to be cited in AI answers, allow the search crawlers and keep blocking training crawlers if you prefer.',
      priority: 3,
      affectedUrls: [`${origin}/robots.txt`],
      codeSnippet: 'User-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: Claude-SearchBot\nAllow: /\n\n# Optional: keep training crawlers out\nUser-agent: GPTBot\nDisallow: /',
      timeToFix: '10 minutes',
      difficulty: 'easy',
    });
  }
  return [];
}
