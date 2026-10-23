/**
 * Small domain helpers. No public suffix library: a short list of common
 * two part suffixes covers the sites people actually audit, and the result is
 * only used to decide which DNS records and which links belong to the site.
 */

import { isIP } from 'node:net';

/** Common second level suffixes where the registrable domain has three labels. */
const TWO_PART_SUFFIXES = new Set([
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'me.uk', 'ltd.uk', 'plc.uk', 'net.uk',
  'com.au', 'net.au', 'org.au', 'edu.au', 'gov.au',
  'co.nz', 'org.nz', 'net.nz',
  'co.za', 'org.za',
  'co.in', 'net.in', 'org.in', 'gov.in', 'ac.in',
  'com.pk', 'org.pk', 'net.pk', 'edu.pk', 'gov.pk',
  'co.jp', 'ne.jp', 'or.jp', 'ac.jp',
  'com.br', 'net.br', 'org.br',
  'com.mx', 'com.ar', 'com.co', 'com.tr', 'com.sg', 'com.my', 'com.hk', 'com.cn', 'com.tw',
  'com.sa', 'com.eg', 'com.ng', 'com.ph', 'com.vn', 'com.ua', 'co.kr', 'co.id', 'co.th', 'co.il', 'co.ke',
]);

/**
 * Hosting platforms that give each customer a subdomain. The customer cannot
 * set email records on these, so email checks do not apply.
 */
const PLATFORM_SUFFIXES = [
  'vercel.app', 'netlify.app', 'github.io', 'gitlab.io', 'pages.dev', 'workers.dev', 'web.app', 'firebaseapp.com',
  'herokuapp.com', 'onrender.com', 'fly.dev', 'railway.app', 'azurewebsites.net', 'cloudfront.net', 'amplifyapp.com',
  'wixsite.com', 'webflow.io', 'myshopify.com', 'squarespace.com', 'wordpress.com', 'blogspot.com', 'framer.website',
  'framer.app', 'carrd.co', 'weebly.com', 'godaddysites.com', 'notion.site', 'substack.com', 'ghost.io', 'tumblr.com',
];

export function isIpHost(host: string): boolean {
  return isIP(host.replace(/^\[|\]$/g, '')) !== 0;
}

/** example.com for www.example.com, blog.example.com and example.com; example.co.uk for shop.example.co.uk. */
export function registrableDomain(host: string): string {
  const h = host.toLowerCase().replace(/\.$/, '');
  if (isIpHost(h)) return h;
  const labels = h.split('.');
  if (labels.length <= 2) return h;
  const lastTwo = labels.slice(-2).join('.');
  if (TWO_PART_SUFFIXES.has(lastTwo)) return labels.slice(-3).join('.');
  return lastTwo;
}

/** True for customer subdomains on hosting platforms (site.vercel.app and the like). */
export function isPlatformHost(host: string): boolean {
  // squarespace.com itself (or www.squarespace.com) is the platform's own
  // site, not a customer subdomain on it.
  const h = host.toLowerCase().replace(/^www\./, '');
  return PLATFORM_SUFFIXES.some((s) => h !== s && h.endsWith(`.${s}`));
}

/** Same site means the same registrable domain, except on platform hosts, where each subdomain is its own site. */
export function sameSiteHost(a: string, b: string): boolean {
  const x = a.toLowerCase().replace(/^www\./, '');
  const y = b.toLowerCase().replace(/^www\./, '');
  if (x === y) return true;
  if (isPlatformHost(x) || isPlatformHost(y)) return false;
  return registrableDomain(x) === registrableDomain(y);
}
