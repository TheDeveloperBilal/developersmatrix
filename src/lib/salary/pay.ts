import { JOBS, TITLE_HINTS, type Job, type TitleHint } from "./jobs";
import { DATA_PERIOD } from "./national";

// One area row from a job file: 10th, 25th, median, 75th, 90th, mean, jobs.
// A wage of null means BLS did not publish it. -1 means "$239,200 or more".
export type WageRow = [
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
  number | null,
];

export interface JobFile {
  code: string;
  title: string;
  period: string;
  w: Record<string, WageRow>;
}

// [code, name, type, state]. Type 1 = US, 2 = state, 3 = territory,
// 4 = metro area, 6 = nonmetro area.
export type Area = [string, string, number, string];

export const TOP_CODE = -1;
export const TOP_CODE_VALUE = 239200;
export const PERCENTILES = [10, 25, 50, 75, 90] as const;
export const PERCENTILE_LABELS = ["10th", "25th", "Median", "75th", "90th"];

export type Period = "year" | "month" | "hour";
export const PERIOD_DIVISOR: Record<Period, number> = { year: 1, month: 12, hour: 2080 };
export const PERIOD_WORD: Record<Period, string> = { year: "a year", month: "a month", hour: "an hour" };

export function areaName(name: string) {
  return name === "U.S." ? "United States" : name;
}

// Five percentiles, only when every one of them is a real published number.
export function fullRange(row: WageRow | undefined): [number, number, number, number, number] | null {
  if (!row) return null;
  const p = row.slice(0, 5);
  if (p.some((v) => v === null || v === TOP_CODE)) return null;
  return p as [number, number, number, number, number];
}

export function hasMedian(row: WageRow | undefined) {
  return !!row && row[2] !== null;
}

export function money(annual: number | null, period: Period, opts: { compact?: boolean } = {}) {
  if (annual === null) return "Not published";
  if (annual === TOP_CODE) return `$${TOP_CODE_VALUE.toLocaleString("en-US")} or more`;
  const v = annual / PERIOD_DIVISOR[period];
  if (period === "hour") return `$${v.toFixed(2)}`;
  if (opts.compact && v >= 1000) return `$${Math.round(v / 1000)}k`;
  return `$${Math.round(v).toLocaleString("en-US")}`;
}

// Where an amount falls among the published percentiles, using a straight line
// between each pair. It is an approximation, and the page says so.
export type Placement =
  | { kind: "below" }
  | { kind: "above" }
  | { kind: "within"; percentile: number };

export function placeAmount(annual: number, p: [number, number, number, number, number]): Placement {
  if (annual < p[0]) return { kind: "below" };
  if (annual > p[4]) return { kind: "above" };
  for (let i = 0; i < 4; i++) {
    const lo = p[i];
    const hi = p[i + 1];
    if (annual <= hi) {
      const t = hi === lo ? 0 : (annual - lo) / (hi - lo);
      const pct = PERCENTILES[i] + t * (PERCENTILES[i + 1] - PERCENTILES[i]);
      return { kind: "within", percentile: Math.round(pct) };
    }
  }
  return { kind: "above" };
}

export function ordinal(n: number) {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] || "th";
  return `${n}${s}`;
}

// Axis bounds rounded to tidy steps, with tick marks for the ruler.
export function scaleFor(values: number[]) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = Math.max(hi - lo, 1);
  const rough = span / 5;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= 6) ?? 10 * mag;
  const min = Math.max(0, Math.floor((lo - span * 0.04) / step) * step);
  const max = Math.ceil((hi + span * 0.04) / step) * step;
  const ticks: number[] = [];
  for (let t = min; t <= max + 1e-6; t += step) ticks.push(t);
  return { min, max, ticks, pos: (v: number) => ((v - min) / (max - min)) * 100 };
}

// Search: real job categories first, then titles BLS does not track separately.
export function searchJobs(query: string): { jobs: Job[]; hints: TitleHint[] } {
  const q = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!q) return { jobs: [], hints: [] };
  const scored = JOBS.map((job) => {
    const name = job.name.toLowerCase();
    let score = 0;
    if (job.aliases.includes(q) || name === q) score = 100;
    else if (name.startsWith(q) || job.aliases.some((a) => a.startsWith(q))) score = 60;
    else if (name.includes(q) || job.aliases.some((a) => a.includes(q))) score = 40;
    else if (q.length >= 4 && job.aliases.some((a) => q.includes(a) && a.length >= 4)) score = 30;
    return { job, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
  const hints = TITLE_HINTS.filter(
    (h) => h.match.some((m) => q.includes(m) || (q.length >= 3 && m.startsWith(q))) || h.title.toLowerCase().includes(q),
  );
  return { jobs: scored.map((s) => s.job), hints };
}

// Everyday names for places BLS lists under a longer metro name.
const PLACE_ALIASES: Record<string, string> = {
  nyc: "new york",
  sf: "san francisco",
  "bay area": "san francisco",
  "silicon valley": "san jose",
  dc: "washington",
  philly: "philadelphia",
  vegas: "las vegas",
};

const TYPE_RANK: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 1, 6: 2 };

export function searchAreas(areas: Area[], query: string, limit = 60) {
  const raw = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!raw) return areas.filter((a) => a[2] <= 3);
  const q = PLACE_ALIASES[raw] ?? raw;
  const hits: { a: Area; score: number }[] = [];
  for (const a of areas) {
    const name = areaName(a[1]).toLowerCase();
    let score = -1;
    if (name.startsWith(q)) score = 0;
    else if ([" ", "-", "/", "("].some((c) => name.includes(c + q))) score = 1;
    else if (name.includes(q)) score = 2;
    else if (q.length === 2 && a[3].toLowerCase() === q) score = 3;
    if (score >= 0) hits.push({ a, score: score * 10 + TYPE_RANK[a[2]] });
  }
  return hits
    .sort((x, y) => x.score - y.score || x.a[1].localeCompare(y.a[1]))
    .slice(0, limit)
    .map((h) => h.a);
}

// Official BLS profile for one job, with its state and metro tables.
export function blsProfileUrl(code: string) {
  const year = DATA_PERIOD.split(" ")[1];
  const occ = code.replace("-", "");
  return `https://data.bls.gov/oesprofile/?year=${year}&major_group=${occ.slice(0, 2)}0000&occupation=${occ}&measure=01&areas=INDUSTRY,STATE,MSA`;
}
