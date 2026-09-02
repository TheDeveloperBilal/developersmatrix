import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Spam/foreign URLs that should return 410 Gone (permanent removal)
const GONE_PATTERNS = [
  // Gambling / roulette (various languages)
  /^\/roulette-/,
  /^\/european-roulette-/,
  /^\/a-real-super-star-/,
  /^\/ruletka-/,
  /^\/roleta-/,
  /^\/apostas-/,
  /^\/a-roleta-/,
  /^\/probabilidade-/,
  /^\/jogos-/,
  /^\/recenzja-/,
  /^\/roulette-wetten-ohne-einzahlung/,
  /^\/roulette-echtgeld-wetten-ein-experte-leitfaden-fur-spieler/,
  // Foreign language spam
  /^\/kakim-obrazom-/,
  /^\/kak-kontsentratsija-/,
  /^\/pochemu-/,
  /^\/vox-/,
  /^\/elegance-/,
  /^\/pasiune-/,
  /^\/boost-your-play-with-a-seamless-hugo-casino-deposit/,
  // Old site structure (previous domain owner)
  /^\/portfolio\//,
  /^\/portfolio-category\//,
  /^\/service\//,
  /^\/psd-template\//,
  /^\/author\//,
  /^\/thankyou\//,
  /^\/pxl-template\//,
  // Old blog posts that no longer exist
  /^\/blog\/ukraine-russia-war-/,
  /^\/blog\/health-fitness-technology-/,
  /^\/blog\/5g-networks-go-global-/,
  /^\/blog\/middle-east-geopolitics-/,
  // Removed research pages (fabricated statistics)
  /^\/research\//,
];

// Exact paths that should return 410 Gone
const GONE_EXACT = new Set([
  '/blog/ukraine-russia-war-latest-developments-analysis',
  '/blog/health-fitness-technology-2025',
  '/blog/5g-networks-go-global-how-next-gen-connectivity-changes-everything',
  '/blog/middle-east-geopolitics-analysis-2025',
  '/roulette-echtgeld-wetten-ein-experte-leitfaden-fur-spieler/feed/',
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  // 1. Return 410 Gone for spam/foreign URLs (permanent removal signal)
  if (GONE_EXACT.has(pathname) || GONE_PATTERNS.some(pattern => pattern.test(pathname))) {
    return new NextResponse(null, { status: 410 });
  }

  // 2. Redirect /home and /home/ to / (301 permanent)
  if (pathname === '/home' || pathname === '/home/') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url, 301);
  }

  // 3. Redirect old cybersecurity-skills-gap to existing ai-cybersecurity page
  if (pathname === '/trends/cybersecurity-skills-gap') {
    const url = request.nextUrl.clone();
    url.pathname = '/trends/ai-cybersecurity-threats-protection-2026';
    return NextResponse.redirect(url, 301);
  }

  // 4. Redirect www → non-www (301 permanent)
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
