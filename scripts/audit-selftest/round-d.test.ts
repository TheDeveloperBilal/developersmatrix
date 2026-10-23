/**
 * Social profiles, CDN detection, inline CSS and the in browser audit history.
 */
import { SEOAuditor } from '@/lib/website-audit/seo-audit';
import { PerformanceAuditor } from '@/lib/website-audit/performance-audit';
import { detectCdn } from '@/lib/website-audit/site-checks';
import { toEntry, compare, recordAudit, historyFor, clearHistory } from '@/lib/website-audit/history';
import type { PageData, WebsiteAuditResult, AuditIssue } from '@/lib/website-audit/types';

let passes = 0;
let failures = 0;
function check(name: string, cond: boolean, extra = '') {
  if (cond) passes++;
  else failures++;
  console.log(`${cond ? '  ok  ' : '  FAIL'} ${name}${cond || !extra ? '' : `  :: ${extra}`}`);
}

function page(url: string, body: string, extra: Partial<PageData> = {}): PageData {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Lamps | Shop</title></head><body>${body}</body></html>`;
  return {
    url, finalUrl: url, redirectChain: [], contentType: 'text/html', title: 'Lamps | Shop', titleCount: 1, html, text: '', mainText: '',
    structuredDataErrors: 0, headers: { 'content-type': 'text/html; charset=utf-8' }, statusCode: 200, loadTime: 100, size: html.length,
    links: [], images: [], scripts: [], styles: [],
    meta: { h1: ['Lamps'], h2: [], h3: [], h4: [], h5: [], h6: [], lang: 'en', description: 'Handmade lamps.', viewport: 'width=device-width' },
    structured_data: [], forms: [], ...extra,
  } as PageData;
}
const link = (href: string) => ({ href, text: 'x', isInternal: false });
const ids = (issues: AuditIssue[]) => issues.map((i) => i.id);

console.log('social profiles');
{
  const none = new SEOAuditor().analyze([page('https://a.test/', '<p>x</p>')]).issues;
  check('no profiles and no sameAs is a tip', none.some((i) => i.id === 'social-no-profiles' && i.informational === true));

  const shareOnly = page('https://a.test/', '', { links: [link('https://www.facebook.com/sharer/sharer.php?u=x'), link('https://twitter.com/intent/tweet?text=x'), link('https://www.linkedin.com/')] });
  check('share buttons and network homepages are not profiles', ids(new SEOAuditor().analyze([shareOnly]).issues).includes('social-no-profiles'));

  const linked = page('https://a.test/', '', { links: [link('https://www.linkedin.com/company/acme'), link('https://x.com/acme')] });
  const l = new SEOAuditor().analyze([linked]).issues;
  check('profiles without sameAs gives the sameAs tip', l.some((i) => i.id === 'social-no-sameas' && i.description.includes('linkedin.com')));

  const both = page('https://a.test/', '', {
    links: [link('https://www.linkedin.com/company/acme')],
    structured_data: [{ type: 'Organization', json: { '@type': 'Organization', sameAs: ['https://www.linkedin.com/company/acme'] } }],
  });
  check('profiles plus sameAs passes', !ids(new SEOAuditor().analyze([both]).issues).some((id) => id.startsWith('social-')));
}

console.log('CDN detection');
{
  check('Cloudflare from cf-ray', detectCdn({ 'cf-ray': '8a1-IAD', server: 'cloudflare' }, []).name === 'Cloudflare');
  check('Vercel from x-vercel-id', detectCdn({ 'X-Vercel-Id': 'bom1::x' }, []).name === 'Vercel');
  check('CloudFront from via', detectCdn({ via: '1.1 abc.cloudfront.net (CloudFront)' }, []).name === 'Amazon CloudFront');
  check('Fastly from x-served-by', detectCdn({ 'x-served-by': 'cache-lhr7349-LHR' }, []).name === 'Fastly');
  check('Shopify CDN from file host', detectCdn({ server: 'nginx' }, ['cdn.shopify.com']).name === 'Shopify CDN');
  check('plain nginx with own files is no CDN', detectCdn({ server: 'nginx' }, ['a.test']).name === null);
}

console.log('inline CSS');
{
  const many = Array.from({ length: 220 }, (_, i) => `<div style="color:#${(i % 9) + 1}${(i % 9) + 1}${(i % 9) + 1};padding:4px">x</div>`).join('');
  const heavy = new PerformanceAuditor().analyze([page('https://a.test/', many)]).issues;
  check('more than 200 style attributes is flagged low', heavy.some((i) => i.id === 'inline_css_https://a.test/' && i.severity === 'low'));
  const nextImages = Array.from({ length: 250 }, () => '<img data-nimg="fill" style="position:absolute;height:100%;width:100%" src="/_next/image?url=a.jpg" alt="">').join('');
  const n = new PerformanceAuditor().analyze([page('https://a.test/', nextImages)]).issues;
  check('next/image styles are not counted', !ids(n).some((id) => id.startsWith('inline_css_')));
  const svg = `<svg>${Array.from({ length: 250 }, () => '<path style="fill:red" d="M0 0"/>').join('')}</svg>`;
  check('SVG drawing styles are not counted', !ids(new PerformanceAuditor().analyze([page('https://a.test/', svg)]).issues).some((id) => id.startsWith('inline_css_')));
}

console.log('audit history');
{
  // A minimal localStorage, as a browser would have.
  const store = new Map<string, string>();
  (globalThis as unknown as { window: unknown }).window = {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    },
  };
  const issue = (id: string, title: string, severity: AuditIssue['severity'], extra: Partial<AuditIssue> = {}) =>
    ({ id, title, severity, category: 'seo', type: 'missing_title', description: '', impact: '', suggestion: '', priority: 1, ...extra }) as AuditIssue;
  const result = (scannedAt: string, score: number, issues: AuditIssue[]) =>
    ({ url: 'https://www.a.test/', scannedAt, overallScore: score, issues, scores: { seo: { score, scored: true } } }) as unknown as WebsiteAuditResult;

  const first = result('2026-10-01T10:00:00Z', 70, [
    issue('missing_h1_https://a.test/', 'Missing H1', 'medium'),
    issue('missing_h1_https://a.test/b', 'Missing H1', 'medium'),
    issue('no_csp', 'Missing CSP', 'medium'),
    issue('email-no-dmarc', 'No DMARC', 'low', { informational: true }),
  ]);
  const entry = toEntry(first);
  check('per page findings collapse to one rule', Object.keys(entry.findings).length === 2, JSON.stringify(entry.findings));
  check('tips are not part of history', !entry.findings['email-no-dmarc']);

  const r1 = recordAudit(first);
  check('first audit has nothing to compare', r1.comparison === null && r1.entries.length === 1);
  const second = result('2026-10-08T10:00:00Z', 82, [issue('no_csp', 'Missing CSP', 'medium'), issue('tech-broken-internal-links', '2 Broken Internal Links', 'high', { category: 'technical' })]);
  const r2 = recordAudit(second);
  check('second audit shows the score change', r2.comparison?.scoreChange === 12);
  check('fixed and new findings are listed', r2.comparison?.fixed.map((f) => f.title).join() === 'Missing H1' && r2.comparison?.added.map((f) => f.title).join() === 'Broken Internal Links', JSON.stringify(r2.comparison));
  check('www and bare domain share history', historyFor('a.test').length === 2);
  recordAudit(second);
  check('recording the same audit twice does not duplicate it', historyFor('a.test').length === 2);
  check('compare is pure', compare(toEntry(first), toEntry(second)).fixed.length === 1);
  clearHistory('a.test');
  check('clearing removes the site', historyFor('a.test').length === 0);

  (globalThis as unknown as { window: unknown }).window = { get localStorage(): never { throw new Error('blocked'); } };
  check('blocked storage does not throw', recordAudit(first).comparison === null);
}

console.log(`\n${passes} passed, ${failures} failed`);
if (failures > 0) process.exit(1);
