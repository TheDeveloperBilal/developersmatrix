import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Skip localhost and IP addresses
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return NextResponse.next();
  }

  // Redirect www.developersmatrix.com → developersmatrix.com (301 permanent)
  if (hostname.startsWith('www.')) {
    const newHost = hostname.replace(/^www\./, '');
    const url = request.nextUrl.clone();
    url.host = newHost + (host.includes(':') ? ':' + host.split(':')[1] : '');
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
