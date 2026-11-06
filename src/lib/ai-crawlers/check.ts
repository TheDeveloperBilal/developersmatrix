// The server side of /tools/ai-crawler-checker: fetch robots.txt and llms.txt
// for a site and say what each AI crawler is allowed to do.

import { safeFetch, readTextCapped, BlockedUrlError } from '@/lib/website-audit/safe-fetch';
import { AI_BOTS } from './bots';
import { decide, parseWithLines, type ContentSignal, type LineRule } from './explain';

const USER_AGENT = 'Mozilla/5.0 (compatible; DevelopersMatrixCrawlerCheck/1.0; +https://developersmatrix.com/tools/ai-crawler-checker)';
/** Google reads the first 500 KiB of a robots.txt file and ignores the rest. */
const ROBOTS_MAX_BYTES = 500 * 1024;
const LLMS_MAX_BYTES = 200 * 1024;
const VIEWER_MAX_LINES = 600;

/**
 * ok: a robots.txt with rules was read.
 * missing: 4xx, so crawlers treat everything as allowed.
 * html: the address answers with a web page, so crawlers find no rules.
 * error: 5xx or 429. Google and most crawlers treat this as "crawl nothing for now".
 * unreachable: no answer at all.
 */
export type RobotsState = 'ok' | 'missing' | 'html' | 'error' | 'unreachable';

export type Verdict = 'allowed' | 'blocked' | 'paused';

export interface BotResult {
  token: string;
  verdict: Verdict;
  group: string | null;
  groupLine: number | null;
  rule: LineRule | null;
}

export interface CrawlerCheck {
  checkedUrl: string;
  origin: string;
  path: string;
  robots: {
    url: string;
    finalUrl: string | null;
    status: number | null;
    state: RobotsState;
    bytes: number;
    truncated: boolean;
    lines: string[];
    linesCut: boolean;
    groupCount: number;
  };
  bots: BotResult[];
  signals: ContentSignal[];
  llms: { url: string; found: boolean; status: number | null; title: string | null; bytes: number };
  cdn: string | null;
  checkedAt: string;
}

export class CheckInputError extends Error {}

const looksLikeHtml = (contentType: string, text: string) =>
  /text\/html|application\/xhtml/i.test(contentType) || /^\s*(<!doctype html|<html|<head|<body)/i.test(text);

function detectCdn(h: Headers): string | null {
  if (h.get('cf-ray') || /cloudflare/i.test(h.get('server') || '')) return 'Cloudflare';
  if (h.get('x-vercel-id')) return 'Vercel';
  if (h.get('x-nf-request-id')) return 'Netlify';
  if (h.get('x-amz-cf-id')) return 'Amazon CloudFront';
  if (h.get('x-sucuri-id')) return 'Sucuri';
  if (/akamai/i.test(h.get('server') || '')) return 'Akamai';
  if (h.get('x-fastly-request-id')) return 'Fastly';
  return null;
}

export function normalizeInput(raw: unknown): URL {
  if (typeof raw !== 'string' || !raw.trim()) throw new CheckInputError('Enter a website address, such as example.com.');
  let text = raw.trim();
  if (!/^https?:\/\//i.test(text)) text = `https://${text}`;
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    throw new CheckInputError('That does not look like a web address. Try something like example.com.');
  }
  if (!url.hostname.includes('.')) throw new CheckInputError('That does not look like a web address. Try something like example.com.');
  return url;
}

async function getText(url: string, maxBytes: number) {
  const { response, finalUrl } = await safeFetch(url, {
    timeoutMs: 8000,
    headers: { 'User-Agent': USER_AGENT, Accept: 'text/plain,text/markdown;q=0.9,*/*;q=0.5' },
  });
  const ok = response.status >= 200 && response.status < 300;
  const { text, truncated } = ok ? await readTextCapped(response, maxBytes) : { text: '', truncated: false };
  if (!ok) response.body?.cancel().catch(() => {});
  return { response, finalUrl, text, truncated };
}

export async function checkSite(input: unknown): Promise<CrawlerCheck> {
  const url = normalizeInput(input);
  const origin = url.origin;
  const path = (url.pathname || '/') + url.search;
  const robotsUrl = `${origin}/robots.txt`;
  const llmsUrl = `${origin}/llms.txt`;

  const [robotsRes, llmsRes] = await Promise.allSettled([getText(robotsUrl, ROBOTS_MAX_BYTES), getText(llmsUrl, LLMS_MAX_BYTES)]);

  if (robotsRes.status === 'rejected' && robotsRes.reason instanceof BlockedUrlError) throw robotsRes.reason;

  let state: RobotsState = 'unreachable';
  let status: number | null = null;
  let finalUrl: string | null = null;
  let body = '';
  let truncated = false;
  let cdn: string | null = null;

  if (robotsRes.status === 'fulfilled') {
    const r = robotsRes.value;
    status = r.response.status;
    finalUrl = r.finalUrl;
    cdn = detectCdn(r.response.headers);
    if (status >= 200 && status < 300) {
      if (looksLikeHtml(r.response.headers.get('content-type') || '', r.text)) state = 'html';
      else {
        state = 'ok';
        body = r.text;
        truncated = r.truncated;
      }
    } else if (status === 429 || status >= 500) state = 'error';
    else state = 'missing';
  }

  const parsed = parseWithLines(body);
  const bots: BotResult[] = AI_BOTS.map((bot) => {
    if (state === 'error' || state === 'unreachable') return { token: bot.token, verdict: 'paused', group: null, groupLine: null, rule: null };
    const d = decide(parsed, bot.token, path);
    return { token: bot.token, verdict: d.allowed ? 'allowed' : 'blocked', group: d.group, groupLine: d.groupLine, rule: d.rule };
  });

  let llms: CrawlerCheck['llms'] = { url: llmsUrl, found: false, status: null, title: null, bytes: 0 };
  if (llmsRes.status === 'fulfilled') {
    const r = llmsRes.value;
    const s = r.response.status;
    const isText = s >= 200 && s < 300 && !looksLikeHtml(r.response.headers.get('content-type') || '', r.text) && r.text.trim().length > 0;
    // A redirect to another path (often the homepage) is not an llms.txt file.
    const samePath = (() => {
      try {
        return new URL(r.finalUrl).pathname === '/llms.txt';
      } catch {
        return false;
      }
    })();
    const title = isText ? (r.text.split(/\r?\n/).find((l) => /^#\s+\S/.test(l))?.replace(/^#\s+/, '').trim() ?? null) : null;
    llms = { url: llmsUrl, found: isText && samePath, status: s, title: title ? title.slice(0, 120) : null, bytes: isText ? new TextEncoder().encode(r.text).length : 0 };
  }

  const allLines = body ? body.split(/\r?\n/) : [];
  return {
    checkedUrl: url.href,
    origin,
    path,
    robots: {
      url: robotsUrl,
      finalUrl,
      status,
      state,
      bytes: body ? new TextEncoder().encode(body).length : 0,
      truncated,
      lines: allLines.slice(0, VIEWER_MAX_LINES).map((l) => l.slice(0, 300)),
      linesCut: allLines.length > VIEWER_MAX_LINES,
      groupCount: parsed.groups.length,
    },
    bots,
    signals: parsed.signals,
    llms,
    cdn,
    checkedAt: new Date().toISOString(),
  };
}
