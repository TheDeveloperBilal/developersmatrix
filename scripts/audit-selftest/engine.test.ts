import { WebsiteAuditEngine } from '@/lib/website-audit/engine';
import { assertPublicUrl, isPrivateAddress } from '@/lib/website-audit/safe-fetch';
import { buildReport } from '@/lib/website-audit/check-catalogue';
import { parseRobots, isAllowed } from '@/lib/website-audit/robots';
import { overallScore, scoreCategory } from '@/lib/website-audit/scoring';
import { setSiteCheckNetworkForTests } from '@/lib/website-audit/site-checks';
import type { AuditIssue } from '@/lib/website-audit/types';

// No real DNS or TLS: email and HTTP/2 checks report Not run.
const offline = () => Promise.reject(Object.assign(new Error('offline'), { code: 'ETIMEOUT' }));
setSiteCheckNetworkForTests({ resolveTxt: offline as never, resolveMx: offline as never, lookup: offline as never });

let passes = 0;
let failures = 0;
function check(name: string, cond: boolean, extra = '') {
  if (cond) passes++;
  else failures++;
  console.log(`${cond ? '  ok  ' : '  FAIL'} ${name}${cond || !extra ? '' : `  :: ${extra}`}`);
}

type Fixture = { status: number; body?: string; headers?: Record<string, string> };
let routes: Record<string, Fixture> = {};
const requested: string[] = [];

(globalThis as any).fetch = async (input: string | URL, init?: RequestInit) => {
  const url = String(input);
  requested.push(url);
  const f = routes[url];
  if (!f) return new Response('not found', { status: 404, headers: { 'content-type': 'text/html' } });
  return new Response(f.body ?? '', { status: f.status, headers: f.headers ?? { 'content-type': 'text/html; charset=utf-8' } });
};

const html = (body: string, head = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Shop Example | Handmade Lamps for Every Room</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Handmade lamps built to order in our workshop, shipped across the country with a two year guarantee and free returns.">${head}</head><body>${body}</body></html>`;

const homeBody = `
<header><nav><a href="/">Home</a><a href="/about">About</a><a href="/blog#top">Blog</a><a href="/blog">Blog</a><a href="/?r=0">Home again</a><a href="/about?ref=nav">About</a><a href="/old">Old</a><a href="/missing">Missing</a><a href="/files/guide.pdf">Guide</a><a href="https://other.example/x">Partner</a></nav></header>
<main class="max-w-[1200px] sm:px-4 text-xs" style="max-width:1200px;line-height:20px">
<h1>Handmade lamps for every room</h1>
<p>We build each lamp by hand in our small workshop. Every lamp is made to order, tested twice and shipped with care so it arrives ready to light up your home. You can choose the wood, the shade and the cable colour.</p>
<p>Scroll down to see the full range. Our infinite range of finishes means there is a lamp for every room in the house, from reading corners to busy kitchens.</p>
<button class="btn">Run audit</button>
<form action="/subscribe"><label for="email">Email</label><input id="email" name="mail" type="email"><label>Name <input name="n" type="text"></label><input aria-label="Search" placeholder="Search" type="search"><input type="hidden" name="t"><button type="submit">Send</button></form>
<img src="/a.jpg" alt="Walnut desk lamp" width="400" height="300"><img src="/b.jpg" alt=""><img src="/c.jpg">
</main>
<footer><a href="/privacy">Privacy</a> © 2026 Shop Example</footer>
<script>self.__next_f.push([1,"classname children classname children classname children classname children"])</script>
<script type="application/ld+json">[{"@context":"https://schema.org","@type":"Organization","name":"Shop Example"},{"@type":"WebSite","name":"Shop Example"}]</script>`;

const sub = (title: string, h1: string) =>
  html(`<header><nav><a href="/">Home</a></nav></header><main><h1>${h1}</h1><p>${'Words about lamps and light. '.repeat(40)}</p></main>`).replace('Shop Example | Handmade Lamps for Every Room', title);

function siteA() {
  routes = {
    'https://shop.example/': { status: 301, headers: { location: 'https://www.shop.example/' } },
    'https://www.shop.example/': { status: 200, body: html(homeBody), headers: { 'content-type': 'text/html; charset=utf-8', 'content-encoding': 'br', 'strict-transport-security': 'max-age=63072000', 'x-content-type-options': 'nosniff' } },
    'https://www.shop.example/robots.txt': { status: 200, body: 'User-agent: *\nDisallow:\n\nUser-agent: GPTBot\nDisallow: /\n\nSitemap: https://www.shop.example/sitemap.xml\n', headers: { 'content-type': 'text/plain' } },
    'https://www.shop.example/sitemap.xml': { status: 200, body: '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.shop.example/</loc></url><url><loc>https://www.shop.example/about</loc></url></urlset>', headers: { 'content-type': 'application/xml' } },
    'https://www.shop.example/about': { status: 200, body: sub('About Shop Example | Our Workshop', 'About our workshop') },
    'https://www.shop.example/blog': { status: 200, body: sub('Lamp Blog | Shop Example', 'Lamp blog') },
    'https://www.shop.example/old': { status: 301, headers: { location: 'https://www.shop.example/older' } },
    'https://www.shop.example/older': { status: 302, headers: { location: 'https://www.shop.example/new' } },
    'https://www.shop.example/new': { status: 200, body: sub('New Page | Shop Example', 'New page') },
    'https://www.shop.example/missing': { status: 404, body: '<html><body>Not found</body></html>' },
  };
}

async function main() {
  console.log('address safety');
  for (const u of ['http://127.0.0.1/', 'http://169.254.169.254/latest/meta-data', 'http://localhost:3000', 'http://[::1]/', 'http://10.1.2.3', 'http://intranet/', 'ftp://example.com', 'http://user:pw@example.com', 'http://example.com:8080/']) {
    let blocked = false;
    try {
      await assertPublicUrl(u);
    } catch {
      blocked = true;
    }
    check(`blocks ${u}`, blocked);
  }
  check('private address list', ['::ffff:127.0.0.1', 'fd00::1', 'fe80::1', '100.64.1.1'].every(isPrivateAddress) && !isPrivateAddress('8.8.8.8') && !isPrivateAddress('2606:4700::1'));

  console.log('robots.txt rules');
  const r = parseRobots('User-agent: *\nDisallow:\n\nUser-agent: GPTBot\nDisallow: /\n');
  check('empty Disallow allows Googlebot', isAllowed(r, 'Googlebot', '/'));
  check('GPTBot group blocks GPTBot only', !isAllowed(r, 'GPTBot', '/'));
  const r2 = parseRobots('User-agent: *\nDisallow: /private/\nAllow: /private/ok$\nDisallow: /*.pdf$\n');
  check('longest match and $ anchors', !isAllowed(r2, 'Googlebot', '/private/x') && isAllowed(r2, 'Googlebot', '/private/ok') && !isAllowed(r2, 'Googlebot', '/a.pdf') && isAllowed(r2, 'Googlebot', '/a.pdf?x'));

  console.log('scoring');
  const all100 = { seo: 100, technical: 100, performance: 100, security: 100, content: 100, accessibility: 100, mobile: 100 };
  check('a critical finding caps the grade at 55', overallScore(all100, true) === 55 && overallScore(all100, false) === 100);
  check('a weak category pulls the grade down more than an average would', overallScore({ ...all100, seo: 20 }, false) < 0.78 * 100);
  const perPage = (n: number): AuditIssue[] => Array.from({ length: n }, (_, i) => ({ id: `missing_h1_https://a.test/p${i}`, url: `https://a.test/p${i}`, category: 'seo', type: 'missing_h1', severity: 'medium', title: '', description: '', impact: '', suggestion: '', priority: 1 }) as AuditIssue);
  check('the same problem on 5 pages counts once, at full weight', scoreCategory(perPage(5), 5).score === 92);
  check('on 1 page of 5 it costs less', scoreCategory(perPage(1), 5).score > 92);

  console.log('full site fixture');
  siteA();
  const result = await new WebsiteAuditEngine({ url: 'https://shop.example/', maxPages: 6 }).audit();
  const ids = result.issues.map((i) => i.id);
  const crawled = result.pageData.map((p) => p.finalUrl);
  check('follows the apex to www redirect', result.url === 'https://www.shop.example/' && result.site?.homeRedirects.length === 1);
  check('does not crawl files, other sites or query string copies', !crawled.some((u) => /\.pdf$|other\.example|\?r=0|\?ref=nav/.test(u)), crawled.join(' '));
  check('reads robots.txt and the sitemap it lists', !!result.site?.robots.found && result.site.sitemaps[0]?.kind === 'urlset' && result.site.sitemaps[0].urlCount === 2);
  check('finds the redirect chain, the 302 and links to redirects', ['tech-redirect-chains', 'tech-temporary-redirects', 'tech-links-to-redirects'].every((id) => ids.includes(id)), ids.join(','));
  const broken = result.issues.find((i) => i.id === 'tech-broken-internal-links');
  check('reports the crawled 404 once, as a broken internal link', !!broken && broken.affectedUrls!.some((u) => u.includes('/missing')) && !ids.includes('tech-404-in-crawl'));
  check('labelled form fields are not flagged', !ids.some((id) => id.startsWith('no_label_')));
  check('GPTBot blocked alone is not an AI search problem', !ids.includes('ai-search-bots-blocked'));
  check('email and HTTP/2 checks are Not run when offline', ['spf', 'dmarc', 'http2'].every((id) => result.notMeasured?.includes(id)), JSON.stringify(result.notMeasured));
  check('payload stays small', JSON.stringify(result).length < 150_000);
  check('score is in a sane range', result.overallScore >= 50 && result.overallScore <= 95, String(result.overallScore));
  const report = buildReport(result);
  const status = (name: string) => report.groups.flatMap((g) => g.checks).find((c) => c.definition.name === name)?.status;
  check('conversion checks show as tips', status('Trust Signals Test') === 'tip');
  check('Not run checks are not counted as passes', status('SPF Record Test') === 'not-run');

  console.log('refusals');
  routes = { 'https://cf.example/': { status: 403, body: '<html><head><title>Just a moment...</title></head><body><div id="cf-chl-widget"></div></body></html>' } };
  let err: Error | null = null;
  try { await new WebsiteAuditEngine({ url: 'https://cf.example/' }).audit(); } catch (e) { err = e as Error; }
  check('bot check page is refused with a clear message', !!err && err.name === 'SiteResponseError');
  routes = { 'https://gone.example/': { status: 404, body: '<html><body>gone</body></html>' } };
  err = null;
  try { await new WebsiteAuditEngine({ url: 'https://gone.example/' }).audit(); } catch (e) { err = e as Error; }
  check('404 homepage is refused', !!err && /404/.test(err.message));
  routes = { 'https://evil.example/': { status: 302, headers: { location: 'http://169.254.169.254/latest/' } } };
  err = null;
  try { await new WebsiteAuditEngine({ url: 'https://evil.example/' }).audit(); } catch (e) { err = e as Error; }
  check('redirect to a private address is refused', !!err && err.name === 'BlockedUrlError');

  console.log('small sites');
  routes = {
    'https://tiny.example/': { status: 200, body: html('<main><h1>Tiny</h1><p>Small site.</p></main>') },
    'https://tiny.example/robots.txt': { status: 200, body: html('<p>home</p>') },
  };
  const t = await new WebsiteAuditEngine({ url: 'https://tiny.example/' }).audit();
  const tsev = (id: string) => t.issues.find((i) => i.id === id)?.severity;
  check('robots.txt answering with HTML counts as missing (low)', tsev('tech-missing-robots') === 'low');
  check('missing sitemap is medium', tsev('tech-missing-sitemap') === 'medium');

  const imgs = Array.from({ length: 6 }, (_, i) => `<span style="position:relative;display:block;width:300px;height:200px"><img alt="Pic ${i}" data-nimg="fill" style="position:absolute;height:100%;width:100%;left:0;top:0" src="/_next/image?url=%2Fp${i}.jpg&w=640&q=75"></span>`).join('');
  routes = {
    'https://next.example/': { status: 200, body: html(`<main><h1>Next site</h1><p>${'Plain words about a product that people like. '.repeat(30)}</p>${imgs}</main>`, '<script src="/_next/static/chunks/polyfills.js" nomodule=""></script><script src="/_next/static/chunks/main.js" async></script>'), headers: { 'content-type': 'text/html; charset=utf-8', 'content-encoding': 'br', 'x-vercel-id': 'iad1::abc', 'strict-transport-security': 'max-age=63072000', 'x-content-type-options': 'nosniff', 'x-frame-options': 'SAMEORIGIN', 'content-security-policy': "frame-ancestors 'self'; object-src 'none'; base-uri 'self'", 'permissions-policy': 'camera=()', 'referrer-policy': 'strict-origin-when-cross-origin' } },
  };
  const n = await new WebsiteAuditEngine({ url: 'https://next.example/' }).audit();
  const nids = n.issues.map((i) => i.id);
  check('Next.js nomodule polyfill is not render blocking', !nids.some((id) => id.startsWith('blocking_scripts_')));
  check('next/image fill images are not missing dimensions', !nids.some((id) => id.startsWith('no_dimensions_')));
  check('a CSP without script rules is a low note', n.issues.find((i) => i.id === 'csp_no_script_rules')?.severity === 'low');
  check('Vercel is detected as the CDN', n.siteChecks?.cdn?.name === 'Vercel' && !nids.includes('perf-no-cdn'));

  console.log(`\n${passes} passed, ${failures} failed`);
  if (failures > 0) process.exit(1);
}

main().catch((e) => {
  console.error('FAILED', e);
  process.exit(1);
});
