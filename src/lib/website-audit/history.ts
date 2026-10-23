/**
 * Audit history, kept only in the visitor's own browser (localStorage).
 *
 * Nothing is sent to a server or stored in a database. Each browser keeps the
 * last few audits per site, so a returning visitor can see whether the score
 * moved and which findings were fixed or are new since last time.
 *
 * Browser storage can be missing or blocked (private windows, strict privacy
 * settings), so every read and write is wrapped and failure just means "no
 * history", never a broken report.
 */

import type { WebsiteAuditResult, IssueSeverity } from './types';
import { ruleKey } from './scoring';

const STORAGE_KEY = 'dm-website-audit-history-v1';
const MAX_PER_SITE = 5;
const MAX_SITES = 20;

export interface HistoryFinding {
  title: string;
  severity: IssueSeverity;
}

export interface HistoryEntry {
  /** Host without www, the key audits of one site are grouped by. */
  site: string;
  url: string;
  scannedAt: string;
  score: number;
  categories: Record<string, number>;
  /** One entry per rule (a finding id without the page it was found on). Tips are left out. */
  findings: Record<string, HistoryFinding>;
}

export interface HistoryComparison {
  previous: HistoryEntry;
  scoreChange: number;
  fixed: HistoryFinding[];
  added: HistoryFinding[];
}

export function siteOfUrl(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return url.toLowerCase();
  }
}

function readAll(): HistoryEntry[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((e) => e && typeof e.site === 'string' && typeof e.score === 'number') : [];
  } catch {
    return [];
  }
}

function writeAll(entries: HistoryEntry[]): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* storage full or blocked: history is a convenience, so carry on */
  }
}

/** Reduce a result to what the comparison needs. Severity is kept per rule, worst first. */
export function toEntry(result: WebsiteAuditResult): HistoryEntry {
  const order: Record<IssueSeverity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const findings: Record<string, HistoryFinding> = {};
  for (const issue of result.issues ?? []) {
    if (issue.informational || issue.category === 'conversion') continue;
    const { rule } = ruleKey(issue.id);
    const existing = findings[rule];
    if (!existing || order[issue.severity] < order[existing.severity]) {
      // Titles with counts ("3 Broken Links") read oddly in a list of rules, so strip a leading number.
      findings[rule] = { title: issue.title.replace(/^\d+\s+/, ''), severity: issue.severity };
    }
  }
  const categories: Record<string, number> = {};
  for (const [key, value] of Object.entries(result.scores ?? {})) {
    if (value && value.scored !== false) categories[key] = value.score;
  }
  return {
    site: siteOfUrl(result.url),
    url: result.url,
    scannedAt: result.scannedAt,
    score: result.overallScore,
    categories,
    findings,
  };
}

/** Earlier audits of the same site, newest first. */
export function historyFor(site: string): HistoryEntry[] {
  return readAll()
    .filter((e) => e.site === site)
    .sort((a, b) => Date.parse(b.scannedAt) - Date.parse(a.scannedAt));
}

export function compare(previous: HistoryEntry, current: HistoryEntry): HistoryComparison {
  const fixed = Object.entries(previous.findings)
    .filter(([rule]) => !current.findings[rule])
    .map(([, f]) => f);
  const added = Object.entries(current.findings)
    .filter(([rule]) => !previous.findings[rule])
    .map(([, f]) => f);
  return { previous, scoreChange: current.score - previous.score, fixed, added };
}

/**
 * Save this audit and return the comparison with the last one of the same
 * site, plus the site's history including this audit. Safe to call when
 * storage is unavailable: it then returns no comparison.
 */
export function recordAudit(result: WebsiteAuditResult): { comparison: HistoryComparison | null; entries: HistoryEntry[] } {
  const current = toEntry(result);
  const all = readAll();
  // The same audit can be recorded twice if the component re-renders; skip it.
  const earlier = all
    .filter((e) => e.site === current.site && e.scannedAt !== current.scannedAt)
    .sort((a, b) => Date.parse(b.scannedAt) - Date.parse(a.scannedAt));
  const comparison = earlier[0] ? compare(earlier[0], current) : null;

  const siteEntries = [current, ...earlier].slice(0, MAX_PER_SITE);
  const others = all.filter((e) => e.site !== current.site);
  // Keep the sites audited most recently.
  const sitesByRecency = [...new Set(others.sort((a, b) => Date.parse(b.scannedAt) - Date.parse(a.scannedAt)).map((e) => e.site))].slice(0, MAX_SITES - 1);
  writeAll([...siteEntries, ...others.filter((e) => sitesByRecency.includes(e.site))]);

  return { comparison, entries: siteEntries };
}

/** Forget one site's history, or everything when no site is given. */
export function clearHistory(site?: string): void {
  if (!site) {
    writeAll([]);
    return;
  }
  writeAll(readAll().filter((e) => e.site !== site));
}
