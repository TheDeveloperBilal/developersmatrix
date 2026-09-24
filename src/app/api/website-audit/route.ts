import { NextRequest, NextResponse } from 'next/server';
import { WebsiteAuditEngine } from '@/lib/website-audit/engine';
import type { CrawlProgress } from '@/lib/website-audit/types';
import { fetchPageSpeed } from '@/lib/website-audit/pagespeed';

export const runtime = 'nodejs';
export const maxDuration = 120; // 2 minutes. PSI alone can take 45s.

export async function POST(request: NextRequest) {
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

    // The crawl and the PageSpeed call are independent, so run them together.
    // PSI is the slow one (10 to 40 seconds); doing it in series would roughly
    // double the wait for no reason. fetchPageSpeed never throws, so a PSI
    // failure degrades that one section instead of failing the whole audit.
    const [result, pagespeed] = await Promise.all([
      engine.audit((progress: CrawlProgress) => {
        console.log(`[Audit Progress] ${progress.status}: ${progress.message}`);
      }),
      fetchPageSpeed(normalizedUrl, { strategy: 'mobile', timeoutMs: 45000 }),
    ]);

    if (pagespeed) {
      result.pagespeed = pagespeed;
    }

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
