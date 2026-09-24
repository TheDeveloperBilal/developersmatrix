/**
 * Google PageSpeed Insights client.
 *
 * This is the one thing an HTML-only audit cannot do for itself: real Core Web
 * Vitals. PSI gives us two different things and it matters which is which.
 *
 *   FIELD data (CrUX)  what actual Chrome users experienced on this origin over
 *                      the last 28 days. This is what Google ranks on. It only
 *                      exists for sites with enough traffic to qualify.
 *   LAB data (Lighthouse)  a single simulated load on a throttled connection.
 *                      Always available, useful for diagnosis, not a ranking input.
 *
 * We report both and label them, because telling someone their LCP is fine in
 * the lab when their real users are suffering is worse than saying nothing.
 *
 * The API works without a key at low volume. Set PAGESPEED_API_KEY to raise the
 * quota. Failures here are never fatal: the audit returns without this section.
 */

import type { PageSpeedData, PageSpeedMetric, PageSpeedOpportunity } from './types';

const PSI_ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

/** Google's own thresholds. Do not invent your own. */
const THRESHOLDS: Record<string, { good: number; poor: number; unit: 'ms' | 'score' }> = {
  LARGEST_CONTENTFUL_PAINT_MS: { good: 2500, poor: 4000, unit: 'ms' },
  INTERACTION_TO_NEXT_PAINT: { good: 200, poor: 500, unit: 'ms' },
  CUMULATIVE_LAYOUT_SHIFT_SCORE: { good: 0.1, poor: 0.25, unit: 'score' },
  FIRST_CONTENTFUL_PAINT_MS: { good: 1800, poor: 3000, unit: 'ms' },
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: { good: 800, poor: 1800, unit: 'ms' },
};

const METRIC_LABELS: Record<string, string> = {
  LARGEST_CONTENTFUL_PAINT_MS: 'Largest Contentful Paint',
  INTERACTION_TO_NEXT_PAINT: 'Interaction to Next Paint',
  CUMULATIVE_LAYOUT_SHIFT_SCORE: 'Cumulative Layout Shift',
  FIRST_CONTENTFUL_PAINT_MS: 'First Contentful Paint',
  EXPERIMENTAL_TIME_TO_FIRST_BYTE: 'Time to First Byte',
};

/** CLS arrives as an integer hundredth (12 means 0.12). Everything else is ms. */
function normaliseValue(key: string, raw: number): number {
  return key === 'CUMULATIVE_LAYOUT_SHIFT_SCORE' ? raw / 100 : raw;
}

function rate(key: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const t = THRESHOLDS[key];
  if (!t) return 'needs-improvement';
  if (value <= t.good) return 'good';
  if (value <= t.poor) return 'needs-improvement';
  return 'poor';
}

function formatValue(key: string, value: number): string {
  if (key === 'CUMULATIVE_LAYOUT_SHIFT_SCORE') return value.toFixed(3);
  return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

type PsiMetricBlock = { percentile?: number; category?: string };

function readFieldMetrics(metrics: Record<string, PsiMetricBlock> | undefined): PageSpeedMetric[] {
  if (!metrics) return [];
  const out: PageSpeedMetric[] = [];
  for (const key of Object.keys(THRESHOLDS)) {
    const block = metrics[key];
    if (!block || typeof block.percentile !== 'number') continue;
    const value = normaliseValue(key, block.percentile);
    out.push({
      id: key,
      label: METRIC_LABELS[key] ?? key,
      value,
      displayValue: formatValue(key, value),
      rating: rate(key, value),
      isCoreWebVital: key === 'LARGEST_CONTENTFUL_PAINT_MS'
        || key === 'INTERACTION_TO_NEXT_PAINT'
        || key === 'CUMULATIVE_LAYOUT_SHIFT_SCORE',
    });
  }
  return out;
}

/** Lighthouse audits worth surfacing, in the order a developer should act on them. */
const OPPORTUNITY_IDS = [
  'render-blocking-resources',
  'unused-javascript',
  'unused-css-rules',
  'modern-image-formats',
  'uses-optimized-images',
  'uses-responsive-images',
  'offscreen-images',
  'unminified-javascript',
  'unminified-css',
  'uses-text-compression',
  'server-response-time',
  'redirects',
  'efficient-animated-content',
  'duplicated-javascript',
  'legacy-javascript',
];

type LhAudit = {
  id?: string;
  title?: string;
  description?: string;
  score?: number | null;
  displayValue?: string;
  details?: { overallSavingsMs?: number; overallSavingsBytes?: number };
};

function readOpportunities(audits: Record<string, LhAudit> | undefined): PageSpeedOpportunity[] {
  if (!audits) return [];
  const out: PageSpeedOpportunity[] = [];
  for (const id of OPPORTUNITY_IDS) {
    const a = audits[id];
    if (!a) continue;
    const savingsMs = a.details?.overallSavingsMs ?? 0;
    const savingsBytes = a.details?.overallSavingsBytes ?? 0;
    // score of 1 means it already passes, nothing to show
    if (a.score === 1 || (savingsMs < 50 && savingsBytes < 2048)) continue;
    out.push({
      id,
      title: a.title ?? id,
      description: (a.description ?? '').replace(/\s*\[Learn more[^\]]*\]\([^)]*\)\.?/gi, '').trim(),
      displayValue: a.displayValue ?? '',
      savingsMs: Math.round(savingsMs),
      savingsBytes: Math.round(savingsBytes),
    });
  }
  return out.sort((a, b) => b.savingsMs - a.savingsMs).slice(0, 8);
}

function categoryScore(cats: Record<string, { score?: number | null }> | undefined, key: string): number | null {
  const s = cats?.[key]?.score;
  return typeof s === 'number' ? Math.round(s * 100) : null;
}

export interface PageSpeedOptions {
  strategy?: 'mobile' | 'desktop';
  timeoutMs?: number;
}

/**
 * Run PSI for a URL. Resolves to null on any failure, never throws.
 * Callers should treat null as "this section is unavailable", not as an error.
 */
export async function fetchPageSpeed(
  url: string,
  options: PageSpeedOptions = {}
): Promise<PageSpeedData | null> {
  const { strategy = 'mobile', timeoutMs = 45000 } = options;

  const params = new URLSearchParams({ url, strategy });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) {
    params.append('category', c);
  }
  const key = process.env.PAGESPEED_API_KEY;
  if (key) params.set('key', key);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${PSI_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return {
        available: false,
        strategy,
        unavailableReason: res.status === 429
          ? 'PageSpeed Insights rate limit reached. Add a PAGESPEED_API_KEY to raise the quota.'
          : `PageSpeed Insights returned ${res.status}.`,
        fetchedAt: new Date().toISOString(),
        fieldData: [],
        labMetrics: [],
        opportunities: [],
        hasFieldData: false,
        scores: { performance: null, accessibility: null, bestPractices: null, seo: null },
        rawError: body.slice(0, 300) || undefined,
      };
    }

    const data = await res.json();
    const lh = data?.lighthouseResult;
    const audits: Record<string, LhAudit> | undefined = lh?.audits;

    // Google returns page level field data in loadingExperience and whole origin
    // data in originLoadingExperience. Small sites usually only qualify for the
    // origin one, so fall back to it and label which we used.
    const pageLevel = readFieldMetrics(data?.loadingExperience?.metrics);
    const originLevel = readFieldMetrics(data?.originLoadingExperience?.metrics);
    const fieldData = pageLevel.length > 0 ? pageLevel : originLevel;
    const fieldScope: 'page' | 'origin' = pageLevel.length > 0 ? 'page' : 'origin';

    // Lab metrics come from Lighthouse numericValue, same units as field data.
    const labIds: Array<[string, string]> = [
      ['largest-contentful-paint', 'LARGEST_CONTENTFUL_PAINT_MS'],
      ['cumulative-layout-shift', 'CUMULATIVE_LAYOUT_SHIFT_SCORE'],
      ['first-contentful-paint', 'FIRST_CONTENTFUL_PAINT_MS'],
      ['total-blocking-time', 'TOTAL_BLOCKING_TIME'],
      ['speed-index', 'SPEED_INDEX'],
      ['server-response-time', 'EXPERIMENTAL_TIME_TO_FIRST_BYTE'],
    ];
    const labMetrics: PageSpeedMetric[] = [];
    for (const [auditId, thresholdKey] of labIds) {
      const a = audits?.[auditId] as (LhAudit & { numericValue?: number }) | undefined;
      if (!a || typeof a.numericValue !== 'number') continue;
      const value = a.numericValue;
      labMetrics.push({
        id: auditId,
        label: a.title ?? auditId,
        value,
        displayValue: a.displayValue ?? formatValue(thresholdKey, value),
        rating: THRESHOLDS[thresholdKey] ? rate(thresholdKey, value)
          : a.score === null || a.score === undefined ? 'needs-improvement'
          : a.score >= 0.9 ? 'good' : a.score >= 0.5 ? 'needs-improvement' : 'poor',
        isCoreWebVital: auditId === 'largest-contentful-paint' || auditId === 'cumulative-layout-shift',
      });
    }

    return {
      available: true,
      strategy,
      fetchedAt: new Date().toISOString(),
      hasFieldData: fieldData.length > 0,
      fieldDataScope: fieldScope,
      fieldData,
      labMetrics,
      opportunities: readOpportunities(audits),
      scores: {
        performance: categoryScore(lh?.categories, 'performance'),
        accessibility: categoryScore(lh?.categories, 'accessibility'),
        bestPractices: categoryScore(lh?.categories, 'best-practices'),
        seo: categoryScore(lh?.categories, 'seo'),
      },
      finalUrl: lh?.finalUrl ?? lh?.requestedUrl ?? url,
    };
  } catch (err) {
    const aborted = err instanceof Error && err.name === 'AbortError';
    return {
      available: false,
      strategy,
      unavailableReason: aborted
        ? 'PageSpeed Insights did not respond in time. This happens on slow sites; the rest of the audit is unaffected.'
        : 'Could not reach PageSpeed Insights.',
      fetchedAt: new Date().toISOString(),
      fieldData: [],
      labMetrics: [],
      opportunities: [],
      hasFieldData: false,
      scores: { performance: null, accessibility: null, bestPractices: null, seo: null },
    };
  } finally {
    clearTimeout(timer);
  }
}
