import { NextRequest, NextResponse } from 'next/server';
import { fetchPageSpeed } from '@/lib/website-audit/pagespeed';

export const runtime = 'nodejs';
export const maxDuration = 60;

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
