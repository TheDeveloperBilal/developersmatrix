import { NextRequest, NextResponse } from 'next/server';
import { WebsiteAuditEngine } from '@/lib/website-audit/engine';
import type { CrawlProgress } from '@/lib/website-audit/types';
import { rateLimit, callerKey } from '@/lib/website-audit/rate-limit';
import { BlockedUrlError } from '@/lib/website-audit/safe-fetch';
import { SiteResponseError } from '@/lib/website-audit/crawler';

export const runtime = 'nodejs';
export const maxDuration = 60;

// A full crawl costs us function time and costs the target site bandwidth.
// Six a minute is generous for a person and useless for a scraper.
const AUDIT_LIMIT = 6;
const AUDIT_WINDOW_MS = 60_000;

/** Hard ceiling on the crawl. Past this we stop and say so. */
const AUDIT_BUDGET_MS = 45000;

class AuditTimeout extends Error {
  constructor() {
    super('audit-timeout');
    this.name = 'AuditTimeout';
  }
}

/**
 * A promise that never settles will sit there until the platform kills the
 * function, and the caller gets nothing at all: no status, no message, just a
 * request that hangs. Every slow step gets a ceiling of its own.
 */
function withDeadline<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new AuditTimeout()), ms);
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/** A finished audit, or the error a visitor should see, with its HTTP status. */
type AuditReply = { status: number; body: Record<string, unknown> };

/** Map anything the audit threw to a status and a message a person can act on. */
function errorReply(error: unknown): AuditReply {
  console.error('Website audit error:', error);

  const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

  if (error instanceof BlockedUrlError) {
    return { status: 400, body: { success: false, error: error.message } };
  }
  if (error instanceof SiteResponseError) {
    return { status: 422, body: { success: false, error: error.message } };
  }
  if (error instanceof AuditTimeout) {
    return {
      status: 504,
      body: {
        success: false,
        error:
          'This site took too long to scan and the audit was stopped. Very large or very slow sites can exceed the limit. Try a single page URL instead.',
      },
    };
  }

  // A site we cannot reach is the caller's input being wrong, not our server
  // breaking. Returning 500 for it makes real outages impossible to spot in
  // the logs, so unreachable targets get a 422 and a message a user can act on.
  const unreachable =
    /failed to fetch any pages|enotfound|econnrefused|getaddrinfo|certificate|ssl|abort|timeout|etimedout|socket hang up/i.test(
      errorMessage
    );

  const friendly = unreachable
    ? 'We could not reach that website. Check the address is correct and that the site is online, then try again.'
    : errorMessage;

  return {
    status: unreachable ? 422 : 500,
    body: {
      success: false,
      error: friendly,
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
    },
  };
}

/** Run one audit. Never throws: every outcome comes back as a reply. */
async function runAudit(
  normalizedUrl: string,
  maxPages: number,
  onProgress: (progress: CrawlProgress) => void
): Promise<AuditReply> {
  try {
    const engine = new WebsiteAuditEngine({
      url: normalizedUrl,
      maxPages,
      // 12s per page. The crawl fetches the homepage, then the other pages
      // together, so this keeps the whole audit inside the 45 second budget.
      timeout: 12000,
    });

    // PageSpeed used to run here alongside the crawl. It now has its own
    // endpoint that the browser calls once the report is on screen, because
    // waiting 40 seconds for Google before showing anything was the single
    // biggest reason this tool felt slow.
    const result = await withDeadline(engine.audit(onProgress), AUDIT_BUDGET_MS);
    return { status: 200, body: { success: true, result } };
  } catch (error) {
    return errorReply(error);
  }
}

/**
 * While an audit runs, the streamed answer sends a small line this often.
 * A connection that stays silent for 20 seconds or more can be dropped
 * somewhere between the visitor and us without either side noticing, and
 * the finished report then never arrives. A steady trickle keeps the line
 * open, and lets the browser tell a working audit from a dead connection.
 */
const HEARTBEAT_MS = 5000;

/**
 * Streamed answer, used when the browser asks for application/x-ndjson.
 * One JSON object per line:
 *   {"type":"started"}
 *   {"type":"progress","status":"crawling","message":"Scanning 4 more pages...","progress":30}
 *   {"type":"heartbeat"}
 *   {"type":"done","status":200,"success":true,"result":{...}}
 * The HTTP status is always 200 once streaming starts, so the real outcome
 * travels in the "done" line.
 */
function streamAudit(normalizedUrl: string, maxPages: number): Response {
  const encoder = new TextEncoder();
  let closed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (line: Record<string, unknown>) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(line) + '\n'));
        } catch {
          closed = true;
        }
      };

      send({ type: 'started' });
      const beat = setInterval(() => send({ type: 'heartbeat' }), HEARTBEAT_MS);

      try {
        const reply = await runAudit(normalizedUrl, maxPages, (progress) => {
          console.log(`[Audit Progress] ${progress.status}: ${progress.message}`);
          send({ type: 'progress', status: progress.status, message: progress.message, progress: progress.progress });
        });
        send({ type: 'done', status: reply.status, ...reply.body });
      } finally {
        clearInterval(beat);
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            // The visitor already left.
          }
        }
      }
    },
    cancel() {
      // The visitor closed the tab or gave up. The audit finishes on its own
      // inside the time budget; we just stop writing.
      closed = true;
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
      'X-Accel-Buffering': 'no',
    },
  });
}

export async function POST(request: NextRequest) {
  const limit = rateLimit(`audit:${callerKey(request)}`, AUDIT_LIMIT, AUDIT_WINDOW_MS);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: `You have run several audits in the last minute. Please wait about ${Math.max(1, limit.retryAfterSeconds)} seconds and try again.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  let body: { url?: unknown; maxPages?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
  }
  const { url, maxPages = 5 } = body ?? {};

  // Validate URL
  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { success: false, error: 'URL is required' },
      { status: 400 }
    );
  }

  // Normalize URL
  let normalizedUrl = url.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  // Validate URL format
  try {
    const parsed = new URL(normalizedUrl);
    if (!parsed.hostname.includes('.')) throw new Error('no dot');
  } catch {
    return NextResponse.json(
      { success: false, error: 'That does not look like a web address. Try something like example.com or https://example.com.' },
      { status: 400 }
    );
  }

  const pages = Math.max(1, Math.min(Number(maxPages) || 5, 10)); // 1 to 10 pages

  // The tool page asks for a stream. Anyone else gets one JSON answer as before.
  if ((request.headers.get('accept') || '').includes('application/x-ndjson')) {
    return streamAudit(normalizedUrl, pages);
  }

  const reply = await runAudit(normalizedUrl, pages, (progress) => {
    console.log(`[Audit Progress] ${progress.status}: ${progress.message}`);
  });
  return NextResponse.json(reply.body, { status: reply.status });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  // Return audit info/config
  return NextResponse.json({
    success: true,
    message: 'Website Audit API is ready',
    endpoint: '/api/website-audit',
    method: 'POST',
    parameters: {
      url: 'string (required) - The URL to audit',
      maxPages: 'number (optional, default: 5) - Maximum pages to scan',
    },
    features: [
      'Technical SEO Audit',
      'Performance Analysis',
      'Mobile UX Check',
      'Security Assessment',
      'Accessibility Review',
      'Content Quality Analysis',
      'Conversion Optimization',
    ],
  });
}
