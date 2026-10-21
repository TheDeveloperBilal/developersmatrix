/**
 * How the audit turns findings into scores.
 *
 * The old model gave every auditor its own fixed "totalChecks" and took a flat
 * number of points off per finding. Two things went wrong with that:
 *
 * 1. Per page findings stacked. A missing canonical on five pages cost five
 *    times as much as one missing robots.txt, so the SEO score of a small old
 *    site could fall to 3 while a site without HTTPS still scored 81.
 * 2. Nothing stopped a site with a fatal problem (no HTTPS, homepage noindex,
 *    Googlebot blocked) from getting an A, because the other categories
 *    averaged it back up.
 *
 * Now each distinct problem ("rule") is charged once per category, scaled by
 * how many of the crawled pages it affects. Low priority notes are capped per
 * category. Categories are combined with a weighted harmonic mean, so a weak
 * area pulls the grade down more than a strong one pushes it up. Any critical
 * finding caps the overall grade.
 */

import type { AuditCategory, AuditIssue, IssueSeverity } from './types';

/** Points one problem costs in its category when it affects every page. */
export const SEVERITY_POINTS: Record<IssueSeverity, number> = {
  critical: 40,
  high: 20,
  medium: 8,
  low: 3,
};

/** A problem found on one page out of many still costs this share of the full points. */
const MIN_PAGE_SHARE = 0.5;

/** Most points that low priority notes can take off a single category. */
export const LOW_POINTS_CAP = 12;

/** The highest overall grade a site with any critical finding can get. */
export const CRITICAL_CAP = 55;

/** Category weights in the overall grade. Conversion is tips only. */
export const CATEGORY_WEIGHTS: Record<AuditCategory, number> = {
  seo: 0.22,
  technical: 0.18,
  performance: 0.15,
  security: 0.12,
  content: 0.12,
  accessibility: 0.11,
  mobile: 0.1,
  conversion: 0,
};

/** Categories that count toward the overall grade. */
export const SCORED_CATEGORIES = (Object.keys(CATEGORY_WEIGHTS) as AuditCategory[]).filter(
  (c) => CATEGORY_WEIGHTS[c] > 0
);

/**
 * The rule a finding belongs to, without the page it was found on.
 * missing_h1_https://a.com/x and missing_h1_https://a.com/y are one rule.
 * no_label_https://a.com/x_2 is the rule no_label.
 */
export function ruleKey(issueId: string): { rule: string; perPage: boolean } {
  const at = issueId.search(/_https?:\/\//);
  if (at > 0) return { rule: issueId.slice(0, at), perPage: true };
  return { rule: issueId, perPage: false };
}

export interface CategoryScore {
  score: number;
  /** Distinct problems after grouping per page findings. */
  rules: number;
  critical: boolean;
}

/** Score one category from its findings. pageCount is the number of pages audited for content. */
export function scoreCategory(issues: AuditIssue[], pageCount: number): CategoryScore {
  const pages = Math.max(1, pageCount);
  const rules = new Map<string, { severity: IssueSeverity; pages: Set<string>; perPage: boolean }>();

  for (const issue of issues) {
    const { rule, perPage } = ruleKey(issue.id);
    const key = `${rule}|${issue.severity}`;
    let entry = rules.get(key);
    if (!entry) {
      entry = { severity: issue.severity, pages: new Set(), perPage };
      rules.set(key, entry);
    }
    entry.pages.add(issue.url || issue.id);
  }

  let points = 0;
  let lowPoints = 0;
  let critical = false;

  for (const entry of rules.values()) {
    // Site wide findings (headers, robots.txt, sitemap) affect every page.
    const share = entry.perPage ? Math.min(1, entry.pages.size / pages) : 1;
    const cost = SEVERITY_POINTS[entry.severity] * (MIN_PAGE_SHARE + (1 - MIN_PAGE_SHARE) * share);
    if (entry.severity === 'critical') critical = true;
    if (entry.severity === 'low') lowPoints += cost;
    else points += cost;
  }

  points += Math.min(LOW_POINTS_CAP, lowPoints);
  return { score: Math.max(0, Math.min(100, Math.round(100 - points))), rules: rules.size, critical };
}

/**
 * Weighted harmonic mean of the scored categories, then the critical cap.
 * A category at 0 is treated as 1 so the mean stays defined.
 */
export function overallScore(scores: Partial<Record<AuditCategory, number>>, hasCritical: boolean): number {
  let weightSum = 0;
  let inverseSum = 0;
  for (const category of SCORED_CATEGORIES) {
    const value = scores[category];
    if (typeof value !== 'number') continue;
    const w = CATEGORY_WEIGHTS[category];
    weightSum += w;
    inverseSum += w / Math.max(1, value);
  }
  if (weightSum === 0) return 0;
  const grade = Math.round(weightSum / inverseSum);
  return hasCritical ? Math.min(grade, CRITICAL_CAP) : grade;
}
