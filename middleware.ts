import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is the ONLY middleware Next.js runs for this project.
// Next.js resolves middleware at the repository root before src/, so any rule
// added to src/middleware.ts is silently ignored. Every redirect and 410 rule
// belongs in this file.

// Spam and legacy URLs that should return 410 Gone (permanent removal signal)
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

// Exact 301 redirects: old path -> new path
const REDIRECTS: Record<string, string> = {
  '/home': '/',
  '/home/': '/',
  '/blog/how-tiktok-algorithm-works-2026': '/blog/tiktok-algorithm-guide-2026',
  '/trends/cybersecurity-skills-gap': '/trends/ai-cybersecurity-threats-protection-2026',
  // Audit cluster consolidated 15 September 2026. These two ranked for the same
  // checklist queries as the target and always ranked worse, so they were merged
  // into it rather than left to split the signal.
  '/blog/how-to-audit-my-website-2026': '/blog/website-audit-checklist-2026',
  '/blog/how-to-audit-website-2026-guide': '/blog/website-audit-checklist-2026',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';
  const hostname = host.split(':')[0];

  // Skip localhost and raw IP addresses so local dev is untouched
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    /^\d+\.\d+\.\d+\.\d+$/.test(hostname)
  ) {
    return NextResponse.next();
  }

  // 1. 410 Gone for spam and permanently removed URLs
  if (GONE_EXACT.has(pathname) || GONE_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse(null, { status: 410 });
  }

  // 2. 301 redirects for merged or moved pages
  const target = REDIRECTS[pathname];
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  // 3. www to non-www (301)
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
