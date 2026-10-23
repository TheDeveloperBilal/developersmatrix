import { SEOAuditor } from '@/lib/website-audit/seo-audit';
import { PerformanceAuditor } from '@/lib/website-audit/performance-audit';
import { SecurityAuditor } from '@/lib/website-audit/security-audit';
import { TechnicalAuditor, detectAnalytics } from '@/lib/website-audit/technical-audit';
import type { AuditIssue, PageData, SiteContext, MetaInfo } from '@/lib/website-audit/types';

let failures = 0;
let passes = 0;
function check(name: string, cond: boolean, extra = '') {
  if (cond) {
    passes++;
    console.log(`  ok   ${name}`);
  } else {
    failures++;
    console.log(`  FAIL ${name}${extra ? ` :: ${extra}` : ''}`);
  }
}

const GOOD_HEAD = '<meta charset="utf-8"><title>Handmade Lamps | Shop</title>';

function page(url: string, html: string, opts: { headers?: Record<string, string>; meta?: Partial<MetaInfo>; text?: string; mainText?: string; title?: string } = {}): PageData {
  const headers = opts.headers ?? { 'content-type': 'text/html; charset=utf-8' };
  const meta: MetaInfo = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], lang: 'en', ...(opts.meta || {}) };
  if (headers['x-robots-tag'] && meta.xRobotsTag === undefined) meta.xRobotsTag = headers['x-robots-tag'];
  return {
    url,
    finalUrl: url,
    redirectChain: [],
    contentType: headers['content-type'] || 'text/html',
    title: opts.title ?? 'Handmade Lamps | Shop',
    titleCount: 1,
    html,
    text: opts.text ?? '',
    mainText: opts.mainText ?? '',
    structuredDataErrors: 0,
    headers,
    statusCode: 200,
    loadTime: 100,
    size: html.length,
    links: [],
    images: [],
    scripts: [],
    styles: [],
    meta,
    structured_data: [],
    forms: [],
  };
}

const doc = (body: string, head = GOOD_HEAD, prefix = '<!DOCTYPE html>') => `${prefix}<html lang="en"><head>${head}</head><body>${body}</body></html>`;

const seo = (pages: PageData[]) => new SEOAuditor().analyze(pages).issues;
const perf = (pages: PageData[]) => new PerformanceAuditor().analyze(pages).issues;
const sec = (pages: PageData[]) => new SecurityAuditor().analyze(pages).issues;
const site: SiteContext = {
  enteredUrl: 'https://a.test/',
  finalUrl: 'https://a.test/',
  origin: 'https://a.test',
  host: 'a.test',
  homeRedirects: [],
  robots: { url: 'https://a.test/robots.txt', status: 404, found: false, body: null },
  sitemaps: [],
};
const tech = (pages: PageData[]) => new TechnicalAuditor().analyze(pages, site, null).issues;
const find = (issues: AuditIssue[], id: string) => issues.find((i) => i.id === id);

const DASH = /[\u2013\u2014]|\s-\s/;
const allNew: AuditIssue[] = [];
const keep = (i: AuditIssue | undefined) => { if (i) allNew.push(i); return i; };

// ---------------------------------------------------------------- 1. doctype
console.log('1. no_doctype');
{
  const bad = page('https://a.test/', doc('<p>x</p>', GOOD_HEAD, ''));
  const goodWithComment = page('https://a.test/b', doc('<p>x</p>', GOOD_HEAD, '\uFEFF  <!-- built by x -->\n<!doctype html>'));
  const xhtml = page('https://a.test/c', doc('<p>x</p>', GOOD_HEAD, '<?xml version="1.0"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "x">'));
  const issues = seo([bad, goodWithComment, xhtml]);
  const hit = keep(find(issues, 'no_doctype_https://a.test/'));
  check('missing doctype is flagged', !!hit && hit.severity === 'medium' && hit.category === 'seo' && hit.type === 'missing_doctype');
  check('BOM, comment, then lowercase doctype passes', !find(issues, 'no_doctype_https://a.test/b'));
  check('XHTML doctype after XML declaration passes', !find(issues, 'no_doctype_https://a.test/c'));
}

// ---------------------------------------------------------------- 2. charset
console.log('2. no_charset');
{
  const none = page('https://a.test/', doc('<p>x</p>', '<title>T</title>'), { headers: { 'content-type': 'text/html' } });
  const header = page('https://a.test/h', doc('<p>x</p>', '<title>T</title>'), { headers: { 'content-type': 'text/html; charset=UTF-8' } });
  const equiv = page('https://a.test/e', doc('<p>x</p>', '<meta http-equiv="content-type" content="text/html; charset=iso-8859-1"><title>T</title>'), { headers: { 'content-type': 'text/html' } });
  const meta = page('https://a.test/m', doc('<p>x</p>'), { headers: { 'content-type': 'text/html' } });
  const issues = seo([none, header, equiv, meta]);
  const hit = keep(find(issues, 'no_charset_https://a.test/'));
  check('no charset anywhere is flagged', !!hit && hit.severity === 'low' && hit.type === 'missing_charset');
  check('charset in Content-Type header passes', !find(issues, 'no_charset_https://a.test/h'));
  check('http-equiv Content-Type with charset passes', !find(issues, 'no_charset_https://a.test/e'));
  check('<meta charset> passes', !find(issues, 'no_charset_https://a.test/m'));
}

// ---------------------------------------------------------------- 3. meta refresh
console.log('3. meta_refresh');
{
  const redirect = page('https://a.test/', doc('<p>x</p>', `${GOOD_HEAD}<meta http-equiv="Refresh" content="0;URL='https://b.test/new'">`));
  const reload = page('https://a.test/r', doc('<p>x</p>', `${GOOD_HEAD}<meta http-equiv="refresh" content="30">`));
  const delayed = page('https://a.test/d', doc('<p>x</p>', `${GOOD_HEAD}<meta http-equiv="refresh" content="5; url=/x">`));
  const clean = page('https://a.test/c', doc('<p>x</p>'));
  const issues = seo([redirect, reload, delayed, clean]);
  const r = keep(find(issues, 'meta_refresh_https://a.test/'));
  check('instant redirect flagged with target and 301 advice', !!r && r.severity === 'medium' && r.description.includes('https://b.test/new') && r.description.includes('0 seconds') && r.suggestion.includes('301') && !!r.affectedElements?.[0]?.outerHTML.toLowerCase().includes('refresh'), r?.description);
  const rl = keep(find(issues, 'meta_refresh_https://a.test/r'));
  check('reload without url says reloads every 30 seconds', !!rl && rl.description.includes('reloads the page every 30 seconds'), rl?.description);
  const d = find(issues, 'meta_refresh_https://a.test/d');
  check('"5; url=/x" parsed', !!d && d.description.includes('to /x after 5 seconds'), d?.description);
  check('page without meta refresh is not flagged', !find(issues, 'meta_refresh_https://a.test/c'));
}

// ---------------------------------------------------------------- 4. deprecated html
console.log('4. deprecated_html');
{
  const old = page('https://a.test/', doc('<center><font color="red">Sale</font><font>x</font></center><tt>code</tt><acronym title="x">NASA</acronym>'));
  const modern = page('https://a.test/m', doc('<p style="text-align:center">Sale</p><code>x</code><abbr>NASA</abbr><svg><font></font></svg>'));
  const issues = seo([old, modern]);
  const hit = keep(find(issues, 'deprecated_html_https://a.test/'));
  check('obsolete tags flagged with counts', !!hit && hit.severity === 'low' && hit.description.includes('<font> (2)') && hit.description.includes('<center> (1)') && hit.description.includes('5 obsolete'), hit?.description);
  check('modern markup (and <font> inside SVG) is not flagged', !find(issues, 'deprecated_html_https://a.test/m'));
}

// ---------------------------------------------------------------- 5. keyword usage
console.log('5. keyword_usage');
{
  const filler = 'We build each one by hand in a small workshop and ship it with care so it arrives ready for your home. ';
  const body = `${'Handmade walnut lamps light every room. Our walnut lamps use brass shades. '.repeat(6)}${filler.repeat(8)}`;
  const mismatch = page('https://a.test/', doc('<h1>Welcome</h1>'), {
    title: 'Welcome to Acme Studio',
    mainText: body,
    meta: { description: 'Walnut lamps made by hand.', h1: ['Welcome'] },
  });
  const issues = seo([mismatch]);
  const hit = keep(find(issues, 'keyword_usage'));
  check('title without top words is flagged (site level id)', !!hit && hit.severity === 'low' && hit.category === 'seo' && hit.type === 'keyword_usage', hit?.description);
  check('description lists word counts and mentions description and H1', !!hit && /^The words that appear most on your homepage are: \w+ \(\d+\)/.test(hit.description) && hit.description.includes('None of the top three appear in the title tag.') && hit.description.includes('The meta description uses') && hit.description.includes('H1 heading does not use them'), hit?.description);

  const match = page('https://a.test/', doc('<h1>Lamps</h1>'), { title: 'Walnut Lamp Studio', mainText: body, meta: { h1: ['Lamps'] } });
  check('title containing a top word (singular of "lamps") is silent', !find(seo([match]), 'keyword_usage'));

  const french = page('https://a.test/', doc('<h1>x</h1>'), { title: 'Welcome to Acme Studio', mainText: body, meta: { lang: 'fr-FR', h1: ['x'] } });
  check('non English lang is silent', !find(seo([french]), 'keyword_usage'));

  const short = page('https://a.test/', doc('<h1>x</h1>'), { title: 'Welcome to Acme Studio', mainText: 'Walnut lamps. '.repeat(40), meta: { h1: ['x'] } });
  check('fewer than 150 words is silent', !find(seo([short]), 'keyword_usage'));

  const fallback = page('https://a.test/', doc('<h1>x</h1>'), { title: 'Welcome to Acme Studio', mainText: '', text: body, meta: { h1: ['x'] } });
  check('falls back to page.text when mainText is empty', !!find(seo([fallback]), 'keyword_usage'));

  const sub = page('https://a.test/sub', doc('<h1>x</h1>'), { title: 'Welcome to Acme Studio', mainText: body, meta: { h1: ['x'] } });
  const homeOk = page('https://a.test/', doc('<h1>x</h1>'), { title: 'Walnut Lamps', mainText: body, meta: { h1: ['x'] } });
  check('only the homepage is checked', !find(seo([homeOk, sub]), 'keyword_usage'));
}

// ---------------------------------------------------------------- 6. nofollow
console.log('6. nofollow');
{
  const metaHome = page('https://a.test/', doc('<p>x</p>'), { meta: { robots: 'index, nofollow' } });
  const header = page('https://a.test/h', doc('<p>x</p>'), { headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'googlebot: nofollow' } });
  const none = page('https://a.test/n', doc('<p>x</p>'), { meta: { googlebot: 'none' } });
  const otherBot = page('https://a.test/o', doc('<p>x</p>'), { headers: { 'content-type': 'text/html; charset=utf-8', 'x-robots-tag': 'bingbot: nofollow' } });
  const clean = page('https://a.test/c', doc('<p>x</p>'), { meta: { robots: 'index, follow' } });
  const issues = seo([metaHome, header, none, otherBot, clean]);
  const h = keep(find(issues, 'nofollow_https://a.test/'));
  check('homepage meta robots nofollow is medium', !!h && h.severity === 'medium' && h.type === 'nofollow');
  const x = keep(find(issues, 'nofollow_https://a.test/h'));
  check('X-Robots-Tag "googlebot: nofollow" caught, low on inner page', !!x && x.severity === 'low' && x.description.includes('X-Robots-Tag'), x?.description);
  const n = find(issues, 'nofollow_https://a.test/n');
  check('"none" is reported once, as noindex, not again as nofollow', !n && !!find(issues, 'noindex_page_https://a.test/n'));
  check('X-Robots-Tag scoped to bingbot is ignored', !find(issues, 'nofollow_https://a.test/o'));
  check('index, follow is not flagged', !find(issues, 'nofollow_https://a.test/c'));
}

// ---------------------------------------------------------------- 7. dom size
console.log('7. dom_size');
{
  const big = page('https://a.test/', doc('<div><span>x</span></div>'.repeat(1600)));
  const medium = page('https://a.test/m', doc('<p>x</p>'.repeat(1500)));
  const small = page('https://a.test/s', doc('<p>x</p>'.repeat(200)));
  const issues = perf([big, medium, small]);
  const b = keep(find(issues, 'dom_size_https://a.test/'));
  check('more than 3000 elements is medium', !!b && b.severity === 'medium' && b.category === 'performance' && b.type === 'dom_size' && b.description.includes('3,20'), b?.description);
  const m = keep(find(issues, 'dom_size_https://a.test/m'));
  check('more than 1400 elements is low', !!m && m.severity === 'low');
  check('200 elements is not flagged', !find(issues, 'dom_size_https://a.test/s'));
}

// ---------------------------------------------------------------- 8. legacy images
console.log('8. legacy_images');
{
  const legacy = page('https://a.test/', doc('<img src="/a.jpg"><img src="/b.PNG?v=2"><img src="https://cdn.test/c.gif#x"><img srcset="/d.jpeg 1x, /d2.jpeg 2x">'));
  const modern = page('https://a.test/m', doc([
    '<img src="/_next/image?url=%2Fa.png&w=640&q=75">',
    '<picture><source srcset="/b.webp" type="image/webp"><img src="/b.jpg"></picture>',
    '<picture><source srcset="/c.avif" type="image/avif"><img src="/c.png"></picture>',
    '<img src="https://res.cloudinary.com/x/image/upload/f_auto,q_auto/d.jpg">',
    '<img src="https://img.test/e.jpg?auto=format&w=400">',
    '<img src="/cdn-cgi/image/width=400/f.png">',
    '<img src="data:image/png;base64,AAAA">',
    '<img src="/g.webp"><img src="/h.svg">',
  ].join('')));
  const two = page('https://a.test/t', doc('<img src="/a.jpg"><img src="/b.png">'));
  const issues = perf([legacy, modern, two]);
  const l = keep(find(issues, 'legacy_images_https://a.test/'));
  check('4 legacy images flagged, srcset first candidate used', !!l && l.severity === 'low' && l.type === 'legacy_image_format' && l.description.startsWith('4 images') && l.description.includes('d.jpeg') && !l.description.includes('d2.jpeg'), l?.description);
  check('next/image, picture with webp/avif, CDN auto format and data URIs are not flagged', !find(issues, 'legacy_images_https://a.test/m'));
  check('fewer than 3 legacy images is not flagged', !find(issues, 'legacy_images_https://a.test/t'));
}

// ---------------------------------------------------------------- 9. plaintext email
console.log('9. plaintext_email');
{
  const withEmail = page('https://a.test/', doc('<p>Write to hello@shop.test</p><a href="mailto:Sales@Shop.test?subject=Hi">Mail</a>'), { text: 'Write to hello@shop.test' });
  const images = page('https://a.test/i', doc('<img src="/logo@2x.png">'), { text: 'See logo@2x.png and icon@3x.webp. Contact you@example.com or a@example.org.' });
  const issues = sec([withEmail, images]);
  const e = keep(find(issues, 'plaintext_email_https://a.test/'));
  check('text and mailto addresses found, informational', !!e && e.informational === true && e.severity === 'low' && e.category === 'security' && e.type === 'plaintext_email' && e.description.includes('hello@shop.test') && e.description.includes('sales@shop.test') && e.description.includes('2 email addresses'), e?.description);
  check('name@2x.png and example.com addresses are not counted', !find(issues, 'plaintext_email_https://a.test/i'));
}

// ---------------------------------------------------------------- 10. unsafe blank links
console.log('10. unsafe_blank_links');
{
  const unsafe = page('https://www.a.test/', doc('<a href="https://other.test/x" target="_BLANK">Partner</a><a href="https://other.test/y" target="_blank" rel="nofollow">Two</a>'));
  const safe = page('https://www.a.test/s', doc([
    '<a href="https://other.test/x" target="_blank" rel="noopener">A</a>',
    '<a href="https://other.test/y" target="_blank" rel="nofollow noreferrer">B</a>',
    '<a href="https://a.test/z" target="_blank">same site</a>',
    '<a href="/local" target="_blank">relative</a>',
    '<a href="https://other.test/w">same tab</a>',
  ].join('')));
  const issues = sec([unsafe, safe]);
  const u = keep(find(issues, 'unsafe_blank_links_https://www.a.test/'));
  check('two unsafe links counted, informational', !!u && u.informational === true && u.severity === 'low' && u.type === 'unsafe_blank_link' && u.description.startsWith('2 links'), u?.description);
  check('noopener, noreferrer, same host and relative links not flagged', !find(issues, 'unsafe_blank_links_https://www.a.test/s'));
}

// ---------------------------------------------------------------- 11. analytics
console.log('11. no_analytics');
{
  const bare = page('https://a.test/', doc('<p>Umami is the fifth taste. We love mixpanel reviews.</p><script>self.__next_f.push([1,"posthog mixpanel umami review"])</script>'));
  const t = tech([bare]);
  const a = keep(find(t, 'no_analytics'));
  check('no tag found is reported (informational, technical, low)', !!a && a.informational === true && a.severity === 'low' && a.category === 'technical' && a.type === 'missing_analytics' && a.description === 'We did not find a common analytics tag in the homepage HTML.');
  check('plain words in text or framework data are not mistaken for tags', detectAnalytics(bare.html).length === 0, detectAnalytics(bare.html).join(','));

  const gtm = page('https://a.test/', doc("<script>(function(w,d,s,l,i){j.src='https://www.googletagmanager.com/gtm.js?id='+i;})(window,document,'script','dataLayer','GTM-X');</script><script defer src=\"https://static.cloudflareinsights.com/beacon.min.js\"></script>"));
  check('GTM page is silent', !find(tech([gtm]), 'no_analytics'));
  check('detectAnalytics names GTM and Cloudflare', JSON.stringify(detectAnalytics(gtm.html)) === JSON.stringify(['Google Tag Manager', 'Cloudflare Web Analytics']), detectAnalytics(gtm.html).join(','));

  const mixed = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-1"></script><script defer data-domain="a.test" src="https://plausible.io/js/script.js"></script><script src="/_vercel/insights/script.js"></script><script>(function(c,l,a,r,i,t,y){t.src="https://www.clarity.ms/tag/"+i;})</script><script>!function(t,e){e.__SV||(window.posthog=e)}(document,window.posthog||[]);</script><script src="https://cdn.heapanalytics.com/js/heap-123.js"></script>';
  const names = detectAnalytics(mixed);
  check('detectAnalytics names GA, Plausible, Vercel, Clarity, PostHog, Heap', ['Google Analytics', 'Plausible', 'Vercel Web Analytics', 'Microsoft Clarity', 'PostHog', 'Heap'].every((n) => names.includes(n)), names.join(','));

  const sub = page('https://a.test/sub', doc('<p>x</p>'));
  const homeWithTag = page('https://a.test/', doc('<script src="https://plausible.io/js/script.js"></script>'));
  check('only the homepage is checked', !find(tech([homeWithTag, sub]), 'no_analytics'));
}

// ---------------------------------------------------------------- copy rules
console.log('copy rules');
{
  const prose = allNew.flatMap((i) => [
    i.title,
    i.description,
    i.impact,
    i.suggestion,
    ...(i.fixInstructions || []).flatMap((f) => [f.title, f.description]),
  ]);
  const withDash = prose.filter((t) => DASH.test(t));
  check('no en or em dashes, no spaced hyphens in new findings', withDash.length === 0, withDash.join(' || '));
  const ids = allNew.map((i) => i.id);
  check('per page ids end with the page url', ids.filter((id) => id !== 'keyword_usage' && id !== 'no_analytics').every((id) => /_https:\/\/[^ ]+$/.test(id)), ids.join(', '));
}

console.log(`\n${passes} passed, ${failures} failed`);
if (failures > 0) process.exit(1);
