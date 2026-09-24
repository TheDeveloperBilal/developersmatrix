import { NextRequest, NextResponse } from 'next/server';
import { fetchPageSpeed } from '@/lib/website-audit/pagespeed';
import { rateLimit, callerKey, isOffSiteRequest } from '@/lib/website-audit/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ALLOWED_HOSTS = ['developersmatrix.com', 'localhost'];

// This endpoint spends our Google quota, so it is the one worth guarding.
const PSI_LIMIT = 10;
const PSI_WINDOW_MS = 60_000;

/**
 * PageSpeed lives on its own endpoint so the crawl report can render first.
 * Google takes 10 to 40 seconds to answer, and nobody should stare at a
 * spinner that long when the rest of the audit is ready in a few seconds.
 *
 * It is a GET so the CDN can cache it. A site's field data is a 28 day
 * rolling average, so a repeat audit within the hour does not need a fresh
 * call and the second visitor gets an instant answer.
 */
export async function GET(request: NextRequest) {
  if (isOffSiteRequest(request, ALLOWED_HOSTS)) {
    return NextResponse.json(
      { success: false, error: 'This endpoint is only available from the audit tool.' },
      { status: 403 }
    );
  }

  const limit = rateLimit(`psi:${callerKey(request)}`, PSI_LIMIT, PSI_WINDOW_MS);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many speed checks in a short time. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const { searchParams } = new URL(request.url);
  const raw = searchParams.get('url');

  if (!raw) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  let normalizedUrl = raw.trim();
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl;
  }

  try {
    new URL(normalizedUrl);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid URL format' },
      { status: 400 }
    );
  }

  const pagespeed = await fetchPageSpeed(normalizedUrl, {
    strategy: 'mobile',
    timeoutMs: 45000,
  });

  if (!pagespeed) {
    // Not an error the user can fix, and not worth caching.
    return NextResponse.json(
      { success: false, error: 'PageSpeed data is not available for this URL right now.' },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    { success: true, pagespeed },
    {
      status: 200,
      headers: {
        // One hour fresh, one day stale while revalidating.
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  );
}
