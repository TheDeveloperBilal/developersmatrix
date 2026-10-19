// Serves the IndexNow key at /indexnow-key.txt so Bing and the other IndexNow
// engines can confirm the site owns the key. The key itself lives only in the
// INDEXNOW_KEY environment variable in Vercel, never in the repository.
//
// The key is meant to be public (IndexNow fetches it from this URL), but it
// still stays out of git so it can be rotated from Vercel alone.

export const dynamic = 'force-static';

const KEY_PATTERN = /^[a-zA-Z0-9-]{8,128}$/;

export function GET() {
  const key = process.env.INDEXNOW_KEY?.trim();

  if (!key || !KEY_PATTERN.test(key)) {
    return new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }

  return new Response(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
