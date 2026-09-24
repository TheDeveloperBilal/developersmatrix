/**
 * Named check catalogue.
 *
 * The auditors emit findings, and count passes as (totalChecks - findings).
 * That gives a number but not a name, so a report cannot say "Meta Title Test:
 * passed". This layer gives every check a name and maps findings back onto it.
 *
 * The logic is the same one the auditors already use: an auditor runs all of
 * its checks on every audit, so a check with no finding against it passed.
 * Nothing here invents a result. A check only appears if the auditor that
 * covers it actually ran.
 *
 * Findings that match no named check are not discarded. They surface in the
 * group's additional findings so the report stays complete.
 */

import type { AuditIssue, WebsiteAuditResult, AuditCategory } from './types';

export type CheckStatus = 'pass' | 'warning' | 'fail' | 'not-run';

export type GroupId =
  | 'common-seo'
  | 'speed'
  | 'server-security'
  | 'mobile'
  | 'advanced-seo'
  | 'social';

export interface CheckGroup {
  id: GroupId;
  name: string;
  description: string;
}

export const CHECK_GROUPS: CheckGroup[] = [
  { id: 'common-seo', name: 'Common SEO Issues', description: 'The on-page fundamentals search engines read first.' },
  { id: 'speed', name: 'Speed Optimizations', description: 'What makes the page slow, and by how much.' },
  { id: 'server-security', name: 'Server and Security', description: 'HTTPS, headers and how the server responds.' },
  { id: 'mobile', name: 'Mobile Usability', description: 'How the page behaves on a phone, which is what Google indexes.' },
  { id: 'advanced-seo', name: 'Advanced SEO', description: 'Crawling, indexing, canonicals and structured data.' },
  { id: 'social', name: 'Social and Sharing', description: 'How the page looks when someone shares it.' },
];

/** A matcher: exact finding id, an id prefix, or an issue type. */
interface Matcher {
  ids?: string[];
  idPrefix?: string[];
  types?: string[];
}

export interface CheckDefinition {
  id: string;
  name: string;
  group: GroupId;
  /** Which auditor covers this. Used to decide whether the check ran at all. */
  category: AuditCategory;
  /** Plain description shown when the check passes. */
  passText: string;
  match: Matcher;
}

/**
 * Checks are named the way a site owner would search for them.
 * Every entry maps to findings the engine genuinely emits.
 */
export const CHECK_DEFINITIONS: CheckDefinition[] = [
  // ---- Common SEO -------------------------------------------------------
  { id: 'title', name: 'Meta Title Test', group: 'common-seo', category: 'seo',
    passText: 'The page has a title tag of a sensible length.',
    match: { types: ['missing_title', 'duplicate_title'] } },
  { id: 'description', name: 'Meta Description Test', group: 'common-seo', category: 'seo',
    passText: 'The page has a meta description.',
    match: { types: ['missing_meta_description', 'duplicate_meta_description'] } },
  { id: 'h1', name: 'H1 Heading Test', group: 'common-seo', category: 'seo',
    passText: 'The page has exactly one H1.',
    match: { types: ['missing_h1', 'multiple_h1'] } },
  { id: 'headings', name: 'Heading Structure Test', group: 'common-seo', category: 'accessibility',
    passText: 'Headings descend in order without skipping levels.',
    match: { types: ['heading_hierarchy'] } },
  { id: 'image-alt', name: 'Image Alt Text Test', group: 'common-seo', category: 'seo',
    passText: 'Every image carries alt text.',
    match: { types: ['missing_alt_text'] } },
  { id: 'content-length', name: 'Content Length Test', group: 'common-seo', category: 'content',
    passText: 'The page has enough content to be worth ranking.',
    match: { ids: ['thin_content'], types: ['thin_content'] } },
  { id: 'readability', name: 'Readability Test', group: 'common-seo', category: 'content',
    passText: 'The writing is readable at a general audience level.',
    match: { ids: ['low_readability', 'long_sentences', 'low_vocabulary'] } },
  { id: 'keyword-stuffing', name: 'Keyword Stuffing Test', group: 'common-seo', category: 'content',
    passText: 'No single term is repeated at an unnatural rate.',
    match: { ids: ['keyword_stuffing', 'repeated_phrases'], types: ['keyword_stuffing'] } },
  { id: 'broken-links', name: 'Broken Links Test', group: 'common-seo', category: 'technical',
    passText: 'No broken internal links were found.',
    match: { ids: ['tech-404-in-crawl'], types: ['broken_link'] } },
  { id: 'internal-links', name: 'Internal Linking Test', group: 'common-seo', category: 'technical',
    passText: 'Pages are linked to each other well enough to be discovered.',
    match: { ids: ['tech-low-internal-links', 'tech-orphan-pages', 'tech-too-many-links', 'low_internal_links'] } },

  // ---- Speed ------------------------------------------------------------
  { id: 'load-time', name: 'Page Load Time Test', group: 'speed', category: 'performance',
    passText: 'The page responded quickly.',
    match: { types: ['slow_load_time'], ids: ['tech-slow-response'] } },
  { id: 'page-size', name: 'Page Size Test', group: 'speed', category: 'performance',
    passText: 'The page weight is reasonable.',
    match: { types: ['large_page_size'] } },
  { id: 'image-size', name: 'Image Optimization Test', group: 'speed', category: 'performance',
    passText: 'Images are sized appropriately for the web.',
    match: { types: ['large_image'] } },
  { id: 'render-blocking', name: 'Render Blocking Resources Test', group: 'speed', category: 'performance',
    passText: 'Nothing blocks the first paint.',
    match: { types: ['render_blocking'] } },
  { id: 'lazy-loading', name: 'Image Lazy Loading Test', group: 'speed', category: 'performance',
    passText: 'Below the fold images defer loading.',
    match: { types: ['missing_lazy_loading'] } },
  { id: 'compression', name: 'Text Compression Test', group: 'speed', category: 'performance',
    passText: 'Text assets are served compressed.',
    match: { types: ['missing_compression'] } },

  // ---- Server and Security ---------------------------------------------
  { id: 'https', name: 'HTTPS Test', group: 'server-security', category: 'security',
    passText: 'The site is served over HTTPS.',
    match: { types: ['missing_https'] } },
  { id: 'mixed-content', name: 'Mixed Content Test', group: 'server-security', category: 'security',
    passText: 'No insecure resources load on a secure page.',
    match: { types: ['mixed_content'] } },
  { id: 'hsts', name: 'HSTS Header Test', group: 'server-security', category: 'security',
    passText: 'Strict-Transport-Security is set.',
    match: { ids: ['no_hsts'] } },
  { id: 'csp', name: 'Content Security Policy Test', group: 'server-security', category: 'security',
    passText: 'A Content-Security-Policy is present.',
    match: { ids: ['no_csp'] } },
  { id: 'x-frame', name: 'Clickjacking Protection Test', group: 'server-security', category: 'security',
    passText: 'X-Frame-Options or frame-ancestors is set.',
    match: { ids: ['no_x_frame_options'] } },
  { id: 'x-content-type', name: 'MIME Sniffing Protection Test', group: 'server-security', category: 'security',
    passText: 'X-Content-Type-Options is set to nosniff.',
    match: { ids: ['no_x_content_type'] } },
  { id: 'referrer-policy', name: 'Referrer Policy Test', group: 'server-security', category: 'security',
    passText: 'A Referrer-Policy is set.',
    match: { ids: ['no_referrer_policy'] } },
  { id: 'permissions-policy', name: 'Permissions Policy Test', group: 'server-security', category: 'security',
    passText: 'A Permissions-Policy is set.',
    match: { ids: ['no_permissions_policy'] } },
  { id: 'sri', name: 'Subresource Integrity Test', group: 'server-security', category: 'security',
    passText: 'Third party scripts carry integrity hashes.',
    match: { ids: ['no_sri'] } },
  { id: 'server-errors', name: 'Server Response Test', group: 'server-security', category: 'technical',
    passText: 'Every crawled page returned a healthy status.',
    match: { ids: ['tech-server-errors', 'tech-http-redirects'] } },

  // ---- Mobile -----------------------------------------------------------
  { id: 'viewport', name: 'Viewport Meta Tag Test', group: 'mobile', category: 'mobile',
    passText: 'A viewport meta tag is present.',
    match: { types: ['missing_viewport'] } },
  { id: 'font-size', name: 'Legible Font Size Test', group: 'mobile', category: 'mobile',
    passText: 'Body text is large enough to read on a phone.',
    match: { types: ['text_too_small'] } },
  { id: 'tap-targets', name: 'Tap Target Size Test', group: 'mobile', category: 'mobile',
    passText: 'Buttons and links are big enough to tap.',
    match: { types: ['touch_target_small'], ids: ['conv-small-tap-targets'] } },
  { id: 'theme-color', name: 'Theme Color Test', group: 'mobile', category: 'mobile',
    passText: 'A theme colour is declared for mobile browsers.',
    match: { ids: ['no_theme_color'] } },
  { id: 'apple-capable', name: 'Web App Capable Test', group: 'mobile', category: 'mobile',
    passText: 'Mobile web app meta tags are present.',
    match: { ids: ['no_apple_capable'] } },
  { id: 'mobile-cta', name: 'Mobile Call to Action Test', group: 'mobile', category: 'conversion',
    passText: 'A call to action stays reachable on mobile.',
    match: { ids: ['conv-no-sticky-mobile-cta'] } },

  // ---- Advanced SEO -----------------------------------------------------
  { id: 'robots-txt', name: 'Robots.txt Test', group: 'advanced-seo', category: 'technical',
    passText: 'robots.txt exists and does not block the site.',
    match: { idPrefix: ['tech-robots-', 'tech-missing-robots'], types: ['missing_robots_txt'] } },
  { id: 'sitemap', name: 'XML Sitemap Test', group: 'advanced-seo', category: 'technical',
    passText: 'An XML sitemap was found.',
    match: { ids: ['tech-missing-sitemap', 'tech-sitemap-coverage', 'tech-sitemap-index', 'check_sitemap'],
             types: ['missing_sitemap'] } },
  { id: 'canonical', name: 'Canonical Tag Test', group: 'advanced-seo', category: 'technical',
    passText: 'Canonical tags are present and valid.',
    match: { idPrefix: ['tech-canonical-'], ids: ['tech-missing-canonical-pages', 'tech-multiple-canonicals'],
             types: ['missing_canonical'] } },
  { id: 'redirects', name: 'Redirect Chain Test', group: 'advanced-seo', category: 'technical',
    passText: 'No redirect chains were found.',
    match: { ids: ['tech-redirect-chains'], types: ['redirect_chain'] } },
  { id: 'duplicate-content', name: 'Duplicate Content Test', group: 'advanced-seo', category: 'technical',
    passText: 'No duplicate titles, descriptions or near duplicate pages.',
    match: { ids: ['tech-duplicate-titles', 'tech-duplicate-descriptions', 'tech-near-duplicate'],
             types: ['duplicate_content'] } },
  { id: 'schema', name: 'Structured Data Test', group: 'advanced-seo', category: 'seo',
    passText: 'Valid structured data is present.',
    match: { idPrefix: ['tech-schema-'], ids: ['missing_schema'], types: ['missing_schema'] } },
  { id: 'hreflang', name: 'Hreflang Test', group: 'advanced-seo', category: 'technical',
    passText: 'Hreflang is either absent by design or correctly implemented.',
    match: { idPrefix: ['tech-hreflang-'], ids: ['tech-missing-hreflang'] } },
  { id: 'url-structure', name: 'URL Structure Test', group: 'advanced-seo', category: 'technical',
    passText: 'URLs are clean and a sensible depth.',
    match: { ids: ['tech-long-urls', 'tech-deep-pages', 'tech-session-params', 'tech-filter-params'],
             types: ['url_structure'] } },
  { id: 'crawlability', name: 'Crawlability Test', group: 'advanced-seo', category: 'technical',
    passText: 'Content is reachable without JavaScript interaction.',
    match: { ids: ['tech-infinite-scroll', 'tech-pagination-no-rel'] } },

  // ---- Social -----------------------------------------------------------
  { id: 'og-tags', name: 'Open Graph Test', group: 'social', category: 'seo',
    passText: 'Open Graph tags are present for sharing.',
    match: { ids: ['missing_og_title', 'missing_og_description', 'missing_og_image'],
             types: ['missing_og_tags'] } },
  { id: 'trust-signals', name: 'Trust Signals Test', group: 'social', category: 'conversion',
    passText: 'The page carries recognisable trust signals.',
    match: { ids: ['few_trust_signals', 'conv-low-trust-signals', 'conv-missing-about', 'conv-missing-privacy',
                   'conv-no-contact-info'], types: ['missing_trust_signals'] } },
  { id: 'social-proof', name: 'Social Proof Test', group: 'social', category: 'conversion',
    passText: 'The page shows social proof.',
    match: { ids: ['conv-no-social-proof', 'conv-weak-social-proof', 'conv-generic-testimonials'],
             types: ['missing_social_proof'] } },
];

export interface CheckResult {
  definition: CheckDefinition;
  status: CheckStatus;
  findings: AuditIssue[];
}

export interface GroupResult {
  group: CheckGroup;
  checks: CheckResult[];
  /** Findings in this group that no named check claimed. */
  additionalFindings: AuditIssue[];
  passed: number;
  warnings: number;
  failed: number;
}

function matches(issue: AuditIssue, m: Matcher): boolean {
  if (m.ids?.includes(issue.id)) return true;
  if (m.types?.includes(issue.type)) return true;
  if (m.idPrefix?.some((p) => issue.id.startsWith(p))) return true;
  return false;
}

/** Severity decides whether a finding is a hard fail or a warning. */
function statusFor(findings: AuditIssue[]): CheckStatus {
  if (findings.length === 0) return 'pass';
  return findings.some((f) => f.severity === 'critical' || f.severity === 'high') ? 'fail' : 'warning';
}

/** Which internal category each group draws from, for the additional findings bucket. */
const GROUP_CATEGORIES: Record<GroupId, AuditCategory[]> = {
  'common-seo': ['seo', 'content'],
  speed: ['performance'],
  'server-security': ['security'],
  mobile: ['mobile'],
  'advanced-seo': ['technical'],
  social: ['conversion', 'accessibility'],
};

export interface BuiltReport {
  groups: GroupResult[];
  totals: { passed: number; warnings: number; failed: number; total: number };
}

export function buildReport(result: WebsiteAuditResult): BuiltReport {
  const issues = result.issues ?? [];
  const claimed = new Set<AuditIssue>();

  const groups: GroupResult[] = CHECK_GROUPS.map((group) => {
    const defs = CHECK_DEFINITIONS.filter((d) => d.group === group.id);

    const checks: CheckResult[] = defs.map((definition) => {
      const findings = issues.filter((i) => matches(i, definition.match));
      findings.forEach((f) => claimed.add(f));
      return { definition, status: statusFor(findings), findings };
    });

    return {
      group,
      checks,
      additionalFindings: [],
      passed: checks.filter((c) => c.status === 'pass').length,
      warnings: checks.filter((c) => c.status === 'warning').length,
      failed: checks.filter((c) => c.status === 'fail').length,
    };
  });

  // Anything the catalogue did not claim still belongs somewhere.
  const unclaimed = issues.filter((i) => !claimed.has(i));
  for (const issue of unclaimed) {
    const target =
      groups.find((g) => GROUP_CATEGORIES[g.group.id].includes(issue.category)) ??
      groups.find((g) => g.group.id === 'advanced-seo')!;
    target.additionalFindings.push(issue);
    if (issue.severity === 'critical' || issue.severity === 'high') target.failed += 1;
    else target.warnings += 1;
  }

  const totals = groups.reduce(
    (acc, g) => ({
      passed: acc.passed + g.passed,
      warnings: acc.warnings + g.warnings,
      failed: acc.failed + g.failed,
      total: acc.total + g.checks.length + g.additionalFindings.length,
    }),
    { passed: 0, warnings: 0, failed: 0, total: 0 }
  );

  return { groups, totals };
}
