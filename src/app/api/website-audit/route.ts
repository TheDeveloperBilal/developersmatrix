import { NextRequest, NextResponse } from 'next/server';
import { WebsiteAuditEngine } from '@/lib/website-audit/engine';
import type { CrawlProgress } from '@/lib/website-audit/types';
import { rateLimit, callerKey } from '@/lib/website-audit/rate-limit';

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

export async function POST(request: NextRequest) {
  const limit = rateLimit(`audit:${callerKey(request)}`, AUDIT_LIMIT, AUDIT_WINDOW_MS);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many audits in a short time. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const { url, maxPages = 5 } = body;

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
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Create audit engine
    const engine = new WebsiteAuditEngine({
      url: normalizedUrl,
      maxPages: Math.min(maxPages, 10), // Limit to 10 pages max
      timeout: 30000,
    });

    // PageSpeed used to run here alongside the crawl. It now has its own
    // endpoint that the browser calls once the report is on screen, because
    // waiting 40 seconds for Google before showing anything was the single
    // biggest reason this tool felt slow.
    const result = await withDeadline(
      engine.audit((progress: CrawlProgress) => {
        console.log(`[Audit Progress] ${progress.status}: ${progress.message}`);
      }),
      AUDIT_BUDGET_MS
    );

    return NextResponse.json({
      success: true,
      result,
    });

  } catch (error) {
    console.error('Website audit error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    // A site we cannot reach is the caller's input being wrong, not our server
    // breaking. Returning 500 for it makes real outages impossible to spot in
    // the logs, so unreachable targets get a 422 and a message a user can act on.
    if (error instanceof AuditTimeout) {
      return NextResponse.json(
        {
          success: false,
          error:
            'This site took too long to scan and the audit was stopped. Very large or very slow sites can exceed the limit. Try a single page URL instead.',
        },
        { status: 504 }
      );
    }

    const unreachable =
      /failed to fetch any pages|enotfound|econnrefused|getaddrinfo|certificate|ssl|abort|timeout|etimedout|socket hang up/i.test(
        errorMessage
      );

    const friendly = unreachable
      ? 'We could not reach that website. Check the address is correct and that the site is online, then try again.'
      : errorMessage;

    return NextResponse.json(
      {
        success: false,
        error: friendly,
        details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: unreachable ? 422 : 500 }
    );
  }
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
