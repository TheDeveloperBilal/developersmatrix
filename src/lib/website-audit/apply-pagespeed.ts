/**
 * Blends the Google PageSpeed mobile performance score into a finished audit.
 *
 * PageSpeed can take 40 seconds, so the report is shown first and this runs
 * when Google answers. Performance becomes half our own checks and half
 * Google's score, and the overall score is worked out again with the same
 * rules the server used. It always starts from the checks only score, so
 * running it twice never blends twice. Results from before the 2 November 2026
 * rules (no scoringModel) only get the PageSpeed data attached.
 */

import type { AuditCategory, PageSpeedData, WebsiteAuditResult } from './types';
import { blendPerformance, overallScore, SCORED_CATEGORIES } from './scoring';

export function applyPageSpeed(result: WebsiteAuditResult, pagespeed: PageSpeedData | undefined): WebsiteAuditResult {
  const withData: WebsiteAuditResult = { ...result, pagespeed };
  const psiScore = pagespeed?.available ? pagespeed.scores?.performance : null;
  const perf = result.scores?.performance;
  if (!result.scoringModel || !perf || typeof psiScore !== 'number') return withData;

  const checksScore = typeof perf.checksScore === 'number' ? perf.checksScore : perf.score;
  const performance = { ...perf, checksScore, pagespeedScore: psiScore, score: blendPerformance(checksScore, psiScore) };
  const scores = { ...result.scores, performance };
  const values = Object.fromEntries(SCORED_CATEGORIES.map((c) => [c, scores[c].score])) as Record<AuditCategory, number>;

  return {
    ...withData,
    scores,
    overallScore: overallScore(values, result.criticalRules ?? 0),
    pagespeedApplied: true,
  };
}
