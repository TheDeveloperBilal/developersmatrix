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
 * area pulls the grade down more than a strong one pushes it up. Critical
 * findings cap the overall grade.
 *
 * Recalibrated on 2 November 2026. Checked against 167 small business sites
 * audited on 23 October 2026, the earlier points were too gentle: the median
 * site scored 87, nothing scored below 54, and sites that failed Google's
 * mobile speed test still scored 86 on average. A one line placeholder page
 * scored 75. The changes: higher points per finding, a higher cap on low
 * notes, a floor of 25 for each category inside the overall mean, a lower
 * critical cap (45 for one critical problem, 35 for two or more), and half of
 * the Performance score taken from Google PageSpeed when Google returns one.
 */

import type { AuditCategory, AuditIssue, IssueSeverity } from './types';

/** Version of these rules, stored with saved audits so old and new scores are never compared. */
export const SCORING_MODEL = 2;

/** The day the current rules went live, shown wherever older scores may appear. */
export const SCORING_MODEL_DATE = '2 November 2026';

/** Points one problem costs in its category when it affects every page. */
export const SEVERITY_POINTS: Record<IssueSeverity, number> = {
  critical: 40,
  high: 25,
  medium: 12,
  low: 4,
};

/** A problem found on one page out of many still costs this share of the full points. */
const MIN_PAGE_SHARE = 0.5;

/** Most points that low priority notes can take off a single category. */
export const LOW_POINTS_CAP = 20;

/**
 * Inside the overall mean a category counts as at least this much. A category
 * at 0 still pulls the grade down hard, but one broken area cannot drag an
 * otherwise sound site into single digits.
 */
export const CATEGORY_FLOOR = 25;

/** The highest overall grade with one critical finding, and with two or more. */
export const CRITICAL_CAP = 45;
export const CRITICAL_CAP_MULTIPLE = 35;

/** Share of the Performance score taken from Google PageSpeed (mobile) when available. */
export const PAGESPEED_SHARE = 0.5;

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
  /** Distinct critical problems (rules) in this category. */
  criticalRules: number;
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
  const criticalRules = new Set<string>();

  for (const [key, entry] of rules) {
    // Site wide findings (headers, robots.txt, sitemap) affect every page.
    const share = entry.perPage ? Math.min(1, entry.pages.size / pages) : 1;
    const cost = SEVERITY_POINTS[entry.severity] * (MIN_PAGE_SHARE + (1 - MIN_PAGE_SHARE) * share);
    if (entry.severity === 'critical') criticalRules.add(key.split('|')[0]);
    if (entry.severity === 'low') lowPoints += cost;
    else points += cost;
  }

  points += Math.min(LOW_POINTS_CAP, lowPoints);
  return {
    score: Math.max(0, Math.min(100, Math.round(100 - points))),
    rules: rules.size,
    critical: criticalRules.size > 0,
    criticalRules: criticalRules.size,
  };
}

/**
 * Weighted harmonic mean of the scored categories, then the critical cap.
 * criticalRules is the number of distinct critical problems across the scored
 * categories (true counts as one, for older callers).
 */
export function overallScore(scores: Partial<Record<AuditCategory, number>>, criticalRules: number | boolean): number {
  let weightSum = 0;
  let inverseSum = 0;
  for (const category of SCORED_CATEGORIES) {
    const value = scores[category];
    if (typeof value !== 'number') continue;
    const w = CATEGORY_WEIGHTS[category];
    weightSum += w;
    inverseSum += w / Math.max(CATEGORY_FLOOR, value);
  }
  if (weightSum === 0) return 0;
  const grade = Math.round(weightSum / inverseSum);
  const count = typeof criticalRules === 'boolean' ? (criticalRules ? 1 : 0) : criticalRules;
  if (count >= 2) return Math.min(grade, CRITICAL_CAP_MULTIPLE);
  if (count === 1) return Math.min(grade, CRITICAL_CAP);
  return grade;
}

/** Performance from our own checks blended with Google's PageSpeed performance score (0 to 100). */
export function blendPerformance(checksScore: number, pagespeedScore: number | null | undefined): number {
  if (typeof pagespeedScore !== 'number' || !Number.isFinite(pagespeedScore)) return checksScore;
  const psi = Math.max(0, Math.min(100, pagespeedScore));
  return Math.round((1 - PAGESPEED_SHARE) * checksScore + PAGESPEED_SHARE * psi);
}
