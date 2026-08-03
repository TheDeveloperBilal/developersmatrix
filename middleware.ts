import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 301 redirect for merged TikTok posts
  if (request.nextUrl.pathname === '/blog/how-tiktok-algorithm-works-2026') {
    return NextResponse.redirect(
      new URL('/blog/tiktok-algorithm-guide-2026', request.url),
      301
    );
  }

  // www to non-www redirect (already handled in config, but belt-and-suspenders)
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const newUrl = new URL(request.url);
    newUrl.host = host.replace('www.', '');
    return NextResponse.redirect(newUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/blog/how-tiktok-algorithm-works-2026',
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
