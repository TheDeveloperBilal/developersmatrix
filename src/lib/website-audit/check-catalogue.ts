/**
 * Named check catalogue.
 *
 * The auditors emit findings, and count passes as (totalChecks - findings).
 * That gives a number but not a name, so a report cannot say "Meta Title Test:
 * passed". This layer gives every check a name and maps findings back onto it.
 *
 * A check with no finding against it passed, unless the engine lists it in
 * result.notMeasured, in which case it shows as "Not checked". Nothing here
 * invents a result.
 *
 * Findings that match no named check are not discarded. They surface in the
 * group's additional findings so the report stays complete.
 */

import type { AuditIssue, WebsiteAuditResult, AuditCategory } from './types';

/** tip: a conversion suggestion. It is shown, but it is not a pass or a fail and does not change the score. */
export type CheckStatus = 'pass' | 'warning' | 'fail' | 'not-run' | 'tip';

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
    passText: 'Every linked page we crawled loaded without an error.',
    match: { ids: ['tech-404-in-crawl'], types: ['broken_link'] } },
  { id: 'internal-links', name: 'Internal Linking Test', group: 'common-seo', category: 'technical',
    passText: 'Pages are linked to each other well enough to be discovered.',
    match: { ids: ['tech-low-internal-links', 'tech-orphan-pages', 'tech-too-many-links', 'low_internal_links'] } },

  // ---- Speed ------------------------------------------------------------
  { id: 'load-time', name: 'Server Response Time Test', group: 'speed', category: 'performance',
    passText: 'The server answered our requests quickly. See the Google speed data for real load times.',
    match: { types: ['slow_load_time'], ids: ['tech-slow-response'] } },
  { id: 'page-size', name: 'HTML Size Test', group: 'speed', category: 'performance',
    passText: 'The HTML document is a reasonable size.',
    match: { types: ['large_page_size'] } },
  { id: 'image-size', name: 'Image Dimensions Test', group: 'speed', category: 'performance',
    passText: 'Images declare their width and height, so the layout does not jump while they load.',
    match: { types: ['large_image'] } },
  { id: 'render-blocking', name: 'Render Blocking Resources Test', group: 'speed', category: 'performance',
    passText: 'No scripts in the head block the first paint.',
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
    match: { ids: ['no_csp', 'csp_no_script_rules'] } },
  { id: 'x-frame', name: 'Clickjacking Protection Test', group: 'server-security', category: 'security',
    passText: 'X-Frame-Options or frame-ancestors is set.',
    match: { ids: ['no_x_frame_options'] } },
  { id: 'x-content-type', name: 'MIME Sniffing Protection Test', group: 'server-security', category: 'security',
    passText: 'X-Content-Type-Options is set to nosniff.',
    match: { ids: ['no_x_content_type'] } },
  { id: 'referrer-policy', name: 'Referrer Policy Test', group: 'server-security', category: 'security',
    passText: 'No unsafe Referrer-Policy is set (browsers default to a safe policy).',
    match: { ids: ['no_referrer_policy'] } },
  { id: 'permissions-policy', name: 'Permissions Policy Test', group: 'server-security', category: 'security',
    passText: 'A Permissions-Policy is set.',
    match: { ids: ['no_permissions_policy'] } },
  { id: 'sri', name: 'Subresource Integrity Test', group: 'server-security', category: 'security',
    passText: 'Third party scripts carry integrity hashes.',
    match: { ids: ['no_sri'] } },
  { id: 'server-errors', name: 'Server Response Test', group: 'server-security', category: 'technical',
    passText: 'Every crawled page returned a healthy status.',
    match: { ids: ['tech-server-errors'] } },

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
  { id: 'mobile-cta', name: 'Mobile Call to Action Test', group: 'mobile', category: 'conversion',
    passText: 'A call to action stays reachable on mobile.',
    match: { ids: ['conv-no-sticky-mobile-cta'] } },

  // ---- Advanced SEO -----------------------------------------------------
  { id: 'robots-txt', name: 'Robots.txt Test', group: 'advanced-seo', category: 'technical',
    passText: 'robots.txt does not block Google from the site or from linked pages.',
    match: { idPrefix: ['tech-robots-', 'tech-missing-robots'], types: ['missing_robots_txt'] } },
  { id: 'sitemap', name: 'XML Sitemap Test', group: 'advanced-seo', category: 'technical',
    passText: 'An XML sitemap was found and loads.',
    match: { ids: ['tech-missing-sitemap', 'tech-sitemap-broken', 'tech-sitemap-empty'],
             types: ['missing_sitemap'] } },
  { id: 'canonical', name: 'Canonical Tag Test', group: 'advanced-seo', category: 'technical',
    passText: 'Canonical tags are present and valid.',
    match: { idPrefix: ['tech-canonical-'], ids: ['tech-missing-canonical-pages', 'tech-multiple-canonicals'],
             types: ['missing_canonical'] } },
  { id: 'redirects', name: 'Redirect Chain Test', group: 'advanced-seo', category: 'technical',
    passText: 'No redirect chains were found.',
    match: { ids: ['tech-redirect-chains', 'tech-temporary-redirects', 'tech-links-to-redirects'], types: ['redirect_chain'] } },
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
  { id: 'noindex', name: 'Noindex Test', group: 'advanced-seo', category: 'seo',
    passText: 'No crawled page is kept out of Google by a noindex rule.',
    match: { idPrefix: ['noindex_'] } },

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

/** How many named checks the report shows. Page copy reads this, so it never drifts. */
export const NAMED_CHECK_COUNT = CHECK_DEFINITIONS.length;

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
  tips: number;
}

/**
 * Specific match: this finding is exactly what the check is about.
 * The engine reuses IssueType across many unrelated findings (missing_viewport
 * covers theme-colour and iOS meta as well as an actually missing viewport),
 * so an id match has to outrank a type match or checks steal each other's
 * findings and the same issue gets counted twice.
 */
function matchesSpecific(issue: AuditIssue, m: Matcher): boolean {
  if (m.ids?.includes(issue.id)) return true;
  if (m.idPrefix?.some((p) => issue.id.startsWith(p))) return true;
  return false;
}

/** Generic match, only consulted for findings no specific check claimed. */
function matchesGeneric(issue: AuditIssue, m: Matcher): boolean {
  return m.types?.includes(issue.type) ?? false;
}

/** Severity decides whether a finding is a hard fail or a warning. */
function statusFor(findings: AuditIssue[], measured = true, tipsOnly = false): CheckStatus {
  // A check the engine could not measure is "not checked", never a free pass.
  if (findings.length === 0) return measured ? 'pass' : 'not-run';
  if (tipsOnly) return 'tip';
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
  totals: { passed: number; warnings: number; failed: number; tips: number; total: number };
}

export function buildReport(result: WebsiteAuditResult): BuiltReport {
  const issues = result.issues ?? [];
  const defs = CHECK_DEFINITIONS;
  const notMeasured = new Set(result.notMeasured ?? []);

  // Every finding belongs to exactly one check. Two passes so that a check
  // naming an id beats a check naming only the shared type.
  const owner = new Map<AuditIssue, string>();

  for (const issue of issues) {
    const hit = defs.find((d) => matchesSpecific(issue, d.match));
    if (hit) owner.set(issue, hit.id);
  }
  for (const issue of issues) {
    if (owner.has(issue)) continue;
    const hit = defs.find((d) => matchesGeneric(issue, d.match));
    if (hit) owner.set(issue, hit.id);
  }

  const groups: GroupResult[] = CHECK_GROUPS.map((group) => {
    const checks: CheckResult[] = defs
      .filter((d) => d.group === group.id)
      .map((definition) => {
        const findings = issues.filter((i) => owner.get(i) === definition.id);
        return {
          definition,
          // Tip only when every finding is a conversion suggestion. A content
          // finding under the same check still counts as a warning.
          status: statusFor(findings, !notMeasured.has(definition.id), findings.every((f) => f.category === 'conversion')),
          findings,
        };
      });

    return {
      group,
      checks,
      additionalFindings: [],
      passed: checks.filter((c) => c.status === 'pass').length,
      warnings: checks.filter((c) => c.status === 'warning').length,
      failed: checks.filter((c) => c.status === 'fail').length,
      tips: checks.filter((c) => c.status === 'tip').length,
    };
  });

  // Findings no check claimed still have to appear somewhere.
  for (const issue of issues) {
    if (owner.has(issue)) continue;
    const target =
      groups.find((g) => GROUP_CATEGORIES[g.group.id].includes(issue.category)) ??
      groups.find((g) => g.group.id === 'advanced-seo')!;
    target.additionalFindings.push(issue);
    if (issue.category === 'conversion') target.tips += 1;
    else if (issue.severity === 'critical' || issue.severity === 'high') target.failed += 1;
    else target.warnings += 1;
  }

  const totals = groups.reduce(
    (acc, g) => ({
      passed: acc.passed + g.passed,
      warnings: acc.warnings + g.warnings,
      failed: acc.failed + g.failed,
      tips: acc.tips + g.tips,
      total: acc.total + g.checks.length + g.additionalFindings.length,
    }),
    { passed: 0, warnings: 0, failed: 0, tips: 0, total: 0 }
  );

  return { groups, totals };
}
