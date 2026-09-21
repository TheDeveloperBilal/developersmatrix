/**
 * Thin wrapper around the gtag call that GA4 exposes.
 *
 * Every function here is safe to call anywhere: during SSR, before the GA
 * script has loaded, with an ad blocker installed, or in a browser where
 * consent was declined. It never throws and it never blocks the UI.
 */

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'set',
      target: string,
      params?: GtagParams
    ) => void;
    dataLayer?: unknown[];
  }
}

/** Send a GA4 event. Silently does nothing if GA is unavailable. */
export function track(event: string, params: GtagParams = {}): void {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, params);
      return;
    }
    // GA script has not finished loading yet. Queue it so nothing is lost.
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event, ...params });
    }
  } catch {
    // Analytics must never break the page.
  }
}

/**
 * Reduce a URL to its hostname before sending it to GA.
 * Full URLs a visitor typed can contain query strings with personal data,
 * and GA should never receive those.
 */
export function safeHost(input: string): string {
  try {
    const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    return new URL(withProtocol).hostname.replace(/^www\./, '');
  } catch {
    return 'invalid';
  }
}

/** Bucket a 0 to 100 score so GA reports group cleanly. */
export function scoreBucket(score: number): string {
  if (score >= 90) return '90-100';
  if (score >= 75) return '75-89';
  if (score >= 60) return '60-74';
  if (score >= 40) return '40-59';
  return '0-39';
}

/** Bucket a duration in milliseconds. */
export function durationBucket(ms: number): string {
  const s = ms / 1000;
  if (s < 5) return 'under-5s';
  if (s < 15) return '5-15s';
  if (s < 30) return '15-30s';
  if (s < 60) return '30-60s';
  return 'over-60s';
}

/* ------------------------------------------------------------------ */
/* Named events. Mark the starred ones as key events in GA4:           */
/*   Admin > Events > toggle "Mark as key event"                       */
/* ------------------------------------------------------------------ */

/** * The headline conversion. A visitor ran an audit and got a score. */
export function trackAuditCompleted(opts: {
  targetHost: string;
  score: number;
  durationMs: number;
  issueCount: number;
}): void {
  track('audit_completed', {
    target_host: opts.targetHost,
    score: Math.round(opts.score),
    score_bucket: scoreBucket(opts.score),
    duration_bucket: durationBucket(opts.durationMs),
    issue_count: opts.issueCount,
  });
}

/** An audit was attempted but failed. Watch this: a rising rate means the API is struggling. */
export function trackAuditFailed(opts: { targetHost: string; reason: string }): void {
  track('audit_failed', {
    target_host: opts.targetHost,
    reason: opts.reason.slice(0, 100),
  });
}

/** * Someone exported the report. Strong intent signal. */
export function trackReportExported(opts: { format: 'pdf' | 'text'; score: number }): void {
  track('report_exported', {
    format: opts.format,
    score_bucket: scoreBucket(opts.score),
  });
}

/** * A tool was actually used, not just viewed. Works for every tool on the site. */
export function trackToolUsed(tool: string, detail: GtagParams = {}): void {
  track('tool_used', { tool, ...detail });
}

/** A visitor followed an internal link to another tool or article. */
export function trackInternalCta(opts: { from: string; to: string; label: string }): void {
  track('internal_cta_click', {
    from_page: opts.from,
    to_page: opts.to,
    label: opts.label.slice(0, 60),
  });
}
