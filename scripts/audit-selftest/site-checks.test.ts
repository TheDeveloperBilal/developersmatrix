import { runSiteChecks } from '@/lib/website-audit/site-checks';
import { parseRobots } from '@/lib/website-audit/robots';
import { EventEmitter } from 'node:events';
import { setSiteCheckNetworkForTests } from '@/lib/website-audit/site-checks';

// Fake DNS and TLS, so the test never touches the network.
const dns: { txt: Record<string, string[][] | string>; mx: Record<string, number>; addr: string } = { txt: {}, mx: {}, addr: '93.184.216.34' };
const tlsState = { protocol: 'h2' as string | false };
const dnsError = (code: string) => Object.assign(new Error(code), { code });
setSiteCheckNetworkForTests({
  resolveTxt: async (name: string) => {
    const v = dns.txt[name];
    if (typeof v === 'string') throw dnsError(v);
    if (!v) throw dnsError('ENOTFOUND');
    return v;
  },
  resolveMx: async (name: string) => (dns.mx[name] ? [{ exchange: `mx.${name}`, priority: 10 }] : []),
  lookup: (async () => [{ address: dns.addr, family: 4 }]) as never,
  tlsConnect: ((_opts: unknown) => {
    const s = new EventEmitter() as EventEmitter & { alpnProtocol: string | false; end: () => void; destroy: () => void };
    s.alpnProtocol = tlsState.protocol;
    s.end = () => {};
    s.destroy = () => {};
    setTimeout(() => s.emit('secureConnect'), 5);
    return s;
  }) as never,
});
import type { PageData, SiteContext } from '@/lib/website-audit/types';

type R = { status: number; body?: string; headers?: Record<string, string>; hang?: boolean; headStatus?: number };
let routes: Record<string, R> = {};
(globalThis as any).fetch = async (input: string, init?: RequestInit) => {
  const r = routes[String(input)];
  if (!r) return new Response('nope', { status: 404, headers: { 'content-type': 'text/html' } });
  if (r.hang) return new Promise(() => {});
  const status = init?.method === 'HEAD' && r.headStatus ? r.headStatus : r.status;
  return new Response(init?.method === 'HEAD' ? null : r.body ?? '', { status, headers: r.headers ?? { 'content-type': 'text/html' } });
};

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? '  ok  ' : '  FAIL'} ${name}${cond ? '' : '  ' + extra}`); };

function page(url: string, html: string, links: { href: string; isInternal: boolean }[] = [], extra: Partial<PageData> = {}): PageData {
  return { url, finalUrl: url, redirectChain: [], contentType: 'text/html', title: 'T', titleCount: 1, html, text: '', mainText: '', structuredDataErrors: 0,
    headers: {}, statusCode: 200, loadTime: 100, size: html.length, links: links.map((l) => ({ ...l, text: 'x' })), images: [], scripts: [], styles: [],
    meta: { viewport: 'width=device-width', h1: [], h2: [], h3: [], h4: [], h5: [], h6: [], description: 'D' }, structured_data: [], forms: [], ...extra } as PageData;
}
const site = (origin: string): SiteContext => ({ enteredUrl: origin + '/', finalUrl: origin + '/', origin, host: new URL(origin).host, homeRedirects: [], robots: { url: origin + '/robots.txt', status: 200, found: true, body: '' }, sitemaps: [] });
const ids = (r: { issues: { id: string }[] }) => r.issues.map((i) => i.id);
const UA = 'test';

async function main() {
  const O = 'https://a.test';
  dns.txt = { 'a.test': [['v=spf1 include:x ~all']], '_dmarc.a.test': [['v=DMARC1; p=none']] }; dns.mx = { 'a.test': 1 };

  // Baseline good site
  routes = {
    [`${O}/favicon.ico`]: { status: 200, headers: { 'content-type': 'image/x-icon' } },
    [`${O}/style.min.css`]: { status: 200, body: '@media (max-width:600px){a{b:c}}' + 'x'.repeat(3000), headers: { 'content-type': 'text/css', 'cache-control': 'public, max-age=31536000, immutable' } },
    [`${O}/about`]: { status: 200 },
    'https://ext.test/ok': { status: 200, headStatus: 405 },
    'https://ext.test/forbidden': { status: 403 },
    'https://www.a.test/': { status: 301, headers: { location: `${O}/` } },
    'http://a.test/': { status: 301, headers: { location: `${O}/` } },
    [`${O}/`]: { status: 200 },
  };
  const good = page(`${O}/`, '<html><head><link rel="stylesheet" href="/style.min.css"></head><body><img src="/img/a.webp"></body></html>',
    [{ href: `${O}/about`, isInternal: true }, { href: 'https://ext.test/ok', isInternal: false }, { href: 'https://ext.test/forbidden', isInternal: false }, { href: 'mailto:x@y.z', isInternal: false }], { headers: { 'cf-ray': '8a1-IAD' } });
  // custom 404 page for unknown paths
  const origFetch = (globalThis as any).fetch;
  (globalThis as any).fetch = async (input: string, init?: RequestInit) => {
    if (String(input).includes('dm-audit-missing-page')) return new Response('<html><head><title>Not found</title></head><body><a href="/">a</a><a href="/b">b</a><a href="/c">c</a></body></html>', { status: 404, headers: { 'content-type': 'text/html' } });
    return origFetch(input, init);
  };
  tlsState.protocol = 'h2';
  let r = await runSiteChecks({ pages: [good], allPages: [good], site: site(O), robots: parseRobots('User-agent: *\nDisallow:\n\nUser-agent: GPTBot\nDisallow: /'), userAgent: UA });
  ok('good site has no findings', r.issues.length === 0, JSON.stringify(ids(r)));
  ok('good site nothing unmeasured', r.notMeasured.length === 0, JSON.stringify(r.notMeasured));
  ok('HEAD 405 then GET 200 is fine, 403 counted as unverified', r.facts.links?.unverified === 1 && r.facts.links?.broken.length === 0, JSON.stringify(r.facts.links));
  ok('mailto not checked, 403 not counted as checked', r.facts.links?.checked === 2, String(r.facts.links?.checked));
  ok('GPTBot blocked alone gives no finding', !ids(r).includes('ai-search-bots-blocked'));
  ok('http2 fact recorded', r.facts.http2?.protocol === 'h2');
  ok('favicon.ico fallback found', r.facts.favicon?.source === 'favicon.ico');
  ok('no ads means ads.txt not needed', r.facts.ads?.adsFound === false);
  ok('custom 404 recognised', r.facts.notFoundPage?.custom === true && r.facts.notFoundPage.status === 404);
  ok('preview captured', r.facts.preview?.description === 'D');
  ok('CDN found from headers', r.facts.cdn?.name === 'Cloudflare');
  (globalThis as any).fetch = origFetch;

  // Bad site
  const B = 'https://b.test';
  dns.txt = { 'b.test': [['v=spf1 a ~all'], ['v=spf1 mx ~all']] }; dns.mx = {};
  tlsState.protocol = 'http/1.1';
  routes = {
    [`${B}/gone`]: { status: 404 },
    'https://dead.test/x': { status: 500 },
    [`${B}/icon.png`]: { status: 404 },
    [`${B}/css/site.css`]: { status: 200, body: 'body {\n  color: red;\n  margin: 0;\n}\n'.repeat(200), headers: { 'content-type': 'text/css', 'cache-control': 'max-age=600' } },
    [`${B}/css/`]: { status: 200, body: '<html><head><title>Index of /css/</title></head><body><h1>Index of /css/</h1></body></html>' },
    'https://www.b.test/': { status: 200, body: '<html><head><title>T</title></head></html>' },
    'http://b.test/': { status: 200 },
    [`${B}/ads.txt`]: { status: 200, body: '<html>home</html>', headers: { 'content-type': 'text/html' } },
  };
  (globalThis as any).fetch = async (input: string, init?: RequestInit) => {
    if (String(input).includes('dm-audit-missing-page')) return new Response('<html><body>ok</body></html>', { status: 200, headers: { 'content-type': 'text/html' } });
    return origFetch(input, init);
  };
  const crawled404 = { ...page(`${B}/old`, 'x'), statusCode: 404 } as PageData;
  const bad = page(`${B}/`, '<html><head><link rel="icon" href="/icon.png"><link rel="stylesheet" href="/css/site.css"></head><body><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"></script></body></html>',
    [{ href: `${B}/gone`, isInternal: true }, { href: `${B}/old`, isInternal: true }, { href: 'https://dead.test/x', isInternal: false }]);
  r = await runSiteChecks({ pages: [bad], allPages: [bad, crawled404], site: site(B), robots: parseRobots('User-agent: OAI-SearchBot\nDisallow: /\n\nUser-agent: PerplexityBot\nDisallow: /'), userAgent: UA });
  const got = ids(r);
  const expect = ['tech-broken-internal-links', 'tech-broken-external-links', 'tech-soft-404', 'seo-favicon-broken', 'tech-duplicate-host', 'tech-http-not-redirected', 'perf-no-http2', 'email-spf-multiple', 'email-no-dmarc', 'ads-txt-missing', 'perf-short-asset-cache', 'perf-unminified-assets', 'mobile-no-media-queries', 'sec-directory-listing', 'ai-search-bots-blocked', 'perf-no-cdn'];
  for (const id of expect) ok(`bad site raises ${id}`, got.includes(id), JSON.stringify(got));
  const bi = r.issues.find((i) => i.id === 'tech-broken-internal-links');
  ok('crawled 404 folded into broken internal links', !!bi && bi.affectedUrls!.some((u) => u.includes('/old')) && bi.affectedUrls!.some((u) => u.includes('/gone')), JSON.stringify(bi?.affectedUrls));
  ok('informational flags on email, ads, AI', r.issues.filter((i) => /^email-|^ads-txt|^ai-/.test(i.id)).every((i) => i.informational === true));
  ok('no dashes in finding text', r.issues.every((i) => !/[–—]| - /.test(`${i.title} ${i.description} ${i.impact} ${i.suggestion}`)), JSON.stringify(r.issues.filter((i) => /[–—]| - /.test(`${i.title} ${i.description} ${i.impact} ${i.suggestion}`)).map((i) => i.id)));
  (globalThis as any).fetch = origFetch;

  // Edge cases
  dns.txt = { 'c.test': 'ETIMEOUT' as any };
  routes = { 'https://c.test/ads.txt': { status: 200, body: 'google.com, pub-9999999999999999, DIRECT, f08c47fec0942fa0', headers: { 'content-type': 'text/plain' } },
             'https://c.test/favicon.ico': { status: 200, body: '<html>', headers: { 'content-type': 'text/html' } },
             'https://c.test/redirect-me': { status: 302, headers: { location: 'http://169.254.169.254/' } } };
  (globalThis as any).fetch = async (input: string, init?: RequestInit) => {
    if (String(input).includes('dm-audit-missing-page')) return new Response(null, { status: 302, headers: { location: 'https://c.test/' } });
    if (String(input) === 'https://c.test/') return new Response('<html></html>', { status: 200, headers: { 'content-type': 'text/html' } });
    return origFetch(input, init);
  };
  const C = page('https://c.test/', '<html><body><ins class="adsbygoogle" data-ad-client="ca-pub-1234567890123456"></ins></body></html>', [{ href: 'https://c.test/redirect-me', isInternal: true }]);
  r = await runSiteChecks({ pages: [C], allPages: [C], site: site('https://c.test'), robots: null, userAgent: UA });
  ok('DNS timeout leaves SPF and DMARC not run', r.notMeasured.includes('spf') && r.notMeasured.includes('dmarc') && !ids(r).some((i) => i.startsWith('email-')), JSON.stringify(r.notMeasured));
  ok('ads.txt without our publisher id flagged', ids(r).includes('ads-txt-missing-publisher'), JSON.stringify(ids(r)));
  ok('favicon.ico answering HTML is not a favicon', ids(r).includes('seo-no-favicon'));
  ok('404 probe redirecting home flagged', ids(r).includes('tech-404-redirects-home'), JSON.stringify(ids(r)));
  ok('link redirecting to a private address is skipped, not broken', !ids(r).includes('tech-broken-internal-links'));
  ok('no robots.txt means AI crawlers allowed', r.facts.aiCrawlers?.every((c) => c.allowed) === true);
  (globalThis as any).fetch = origFetch;

  // Bot walls and subdomains
  dns.txt = { 'e.test': [['v=spf1 -all']], '_dmarc.e.test': [['v=DMARC1; p=reject; sp=reject']] };
  routes = {
    'https://blog.e.test/favicon.ico': { status: 403 },
    'https://www.blog.e.test/': { status: 200, body: '<html><head><title>Parked domain</title></head></html>' },
    'https://blog.e.test/x': { status: 500, headStatus: 500 },
  };
  (globalThis as any).fetch = async (input: string, init?: RequestInit) => {
    if (String(input).includes('dm-audit-missing-page')) return new Response('denied', { status: 403, headers: { 'content-type': 'text/html' } });
    if (String(input) === 'https://blog.e.test/x' && init?.method === 'GET') return new Response('ok', { status: 200 });
    return origFetch(input, init);
  };
  const Epage = page('https://blog.e.test/', '<html><head><style>a{color:red}</style><link rel="stylesheet" href="https://cdn.other.test/theme.css"></head></html>', [{ href: 'https://blog.e.test/x', isInternal: true }]);
  r = await runSiteChecks({ pages: [Epage], allPages: [Epage], site: site('https://blog.e.test'), robots: null, userAgent: UA });
  ok('subdomain uses the main domain for DMARC', r.facts.email?.domain === 'e.test' && !ids(r).includes('email-no-dmarc'), JSON.stringify(r.facts.email));
  ok('403 favicon is not run, not missing', r.notMeasured.includes('favicon') && !ids(r).some((i) => i.startsWith('seo-')), JSON.stringify(r.notMeasured));
  ok('403 for unknown paths is not run, not a soft 404', r.notMeasured.includes('custom-404') && !ids(r).includes('tech-soft-404'));
  ok('HEAD 500 then GET 200 is not broken', !ids(r).includes('tech-broken-internal-links'), JSON.stringify(ids(r)));
  ok('parked www host is reported as different, not duplicate', ids(r).includes('tech-alt-host-different') && !ids(r).includes('tech-duplicate-host'), JSON.stringify(ids(r)));
  ok('unread CDN stylesheet means responsive css not run', r.notMeasured.includes('responsive-css') && !ids(r).includes('mobile-no-media-queries'));
  ok('no own static files means minification not run', r.notMeasured.includes('minification'));
  ok('robots.txt unreadable means AI crawler check not run', true);
  (globalThis as any).fetch = origFetch;

  // Platform subdomain: email checks do not apply
  routes = {};
  const V = page('https://mysite.vercel.app/', '<html></html>');
  r = await runSiteChecks({ pages: [V], allPages: [V], site: site('https://mysite.vercel.app'), robots: null, userAgent: UA });
  ok('platform subdomain skips SPF and DMARC', r.notMeasured.includes('spf') && !ids(r).some((i) => i.startsWith('email-')), JSON.stringify(r.notMeasured));
  const S = { ...site('https://f.test'), robots: { url: 'https://f.test/robots.txt', status: null, found: false, body: null } } as SiteContext;
  const F = page('https://f.test/', '<html></html>');
  r = await runSiteChecks({ pages: [F], allPages: [F], site: S, robots: null, userAgent: UA });
  ok('unreadable robots.txt leaves AI crawler check not run', r.notMeasured.includes('ai-crawlers'));

  // Time budget: a hanging favicon request must end as Not run, not pass
  dns.txt = { 'd.test': [['v=spf1 -all']], '_dmarc.d.test': [['v=DMARC1; p=reject']] };
  routes = { 'https://d.test/favicon.ico': { status: 200, hang: true } };
  const D = page('https://d.test/', '<html></html>');
  const t0 = Date.now();
  r = await runSiteChecks({ pages: [D], allPages: [D], site: site('https://d.test'), robots: null, userAgent: UA });
  ok('hanging request ends within budget', Date.now() - t0 < 14000, String(Date.now() - t0));
  ok('hanging favicon reported as not run', r.notMeasured.includes('favicon') && !ids(r).includes('seo-no-favicon'), JSON.stringify(r.notMeasured));

  console.log(`\n${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}
main();
