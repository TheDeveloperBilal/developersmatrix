// Habit Tracker logic. Every check in is a real calendar date, so streaks
// and rates come from the days you actually ticked, not from button clicks.

import { addDays, daysBetween, isDateKey } from './store';

export interface Habit {
  id: string;
  name: string;
  color: HabitColor;
  /** First day the habit counts from (YYYY-MM-DD). */
  start: string;
  /** Days ticked as done (YYYY-MM-DD), kept sorted. */
  done: string[];
}

export interface HabitData {
  v: 1;
  habits: Habit[];
}

export const COLORS = ['lime', 'sky', 'amber', 'rose', 'violet', 'teal'] as const;
export type HabitColor = (typeof COLORS)[number];

export const EMPTY_HABITS: HabitData = { v: 1, habits: [] };

export const SUGGESTIONS = [
  'Drink a glass of water after waking',
  'Read 10 pages',
  'Walk for 20 minutes',
  'Practice coding for 30 minutes',
  'No phone in bed',
  'Stretch for 5 minutes',
  'Write 200 words',
  'In bed by 11',
];

function isHabit(v: unknown): v is Habit {
  if (!v || typeof v !== 'object') return false;
  const h = v as Record<string, unknown>;
  return typeof h.id === 'string' && typeof h.name === 'string' && COLORS.includes(h.color as HabitColor)
    && isDateKey(h.start) && Array.isArray(h.done) && h.done.every(isDateKey);
}

export function isHabitData(v: unknown): v is HabitData {
  if (!v || typeof v !== 'object') return false;
  const d = v as Record<string, unknown>;
  return d.v === 1 && Array.isArray(d.habits) && d.habits.every(isHabit);
}

/** Tick or untick a day. Ticking a day before the start moves the start back. */
export function toggleDay(h: Habit, day: string): Habit {
  const has = h.done.includes(day);
  const done = has ? h.done.filter((d) => d !== day) : [...h.done, day].sort();
  const start = !has && day < h.start ? day : h.start;
  return { ...h, done, start };
}

/** Days in a row up to today. If today is not ticked yet the streak still
 *  counts up to yesterday, because the day is not over. */
export function currentStreak(h: Habit, today: string): number {
  const set = new Set(h.done);
  let day = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(day)) {
    n++;
    day = addDays(day, -1);
  }
  return n;
}

export function bestStreak(h: Habit): number {
  let best = 0;
  let run = 0;
  let prev = '';
  for (const d of h.done) {
    run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1;
    if (run > best) best = run;
    prev = d;
  }
  return best;
}

/** Share of the last 30 days that were ticked, counting only days since the habit started. */
export function rate30(h: Habit, today: string): { done: number; days: number; share: number } {
  const from = addDays(today, -29);
  const first = h.start > from ? h.start : from;
  const days = Math.max(0, daysBetween(first, today) + 1);
  const done = h.done.filter((d) => d >= first && d <= today).length;
  return { done, days, share: days ? done / days : 0 };
}

/** Dates for a wall of `weeks` columns ending with the week that holds today.
 *  Weeks start on Monday. Returns columns of 7 date keys. */
export function wallColumns(today: string, weeks: number, weekdayOfToday: number): string[][] {
  const mondayIndex = (weekdayOfToday + 6) % 7; // 0 = Monday
  const lastMonday = addDays(today, -mondayIndex);
  const firstMonday = addDays(lastMonday, -7 * (weeks - 1));
  const cols: string[][] = [];
  for (let w = 0; w < weeks; w++) {
    const col: string[] = [];
    for (let d = 0; d < 7; d++) col.push(addDays(firstMonday, w * 7 + d));
    cols.push(col);
  }
  return cols;
}

export function backupFile(data: HabitData): string {
  return JSON.stringify({ app: 'developersmatrix-habit-tracker', exported: new Date().toISOString(), ...data }, null, 2);
}

/** Accepts a backup file and returns clean data, or null if it is not one of ours. */
export function readBackup(text: string): HabitData | null {
  try {
    const raw = JSON.parse(text) as Record<string, unknown>;
    const data = { v: raw.v, habits: raw.habits };
    if (!isHabitData(data)) return null;
    return {
      v: 1,
      habits: data.habits.map((h) => ({ ...h, done: Array.from(new Set(h.done)).sort() })),
    };
  } catch {
    return null;
  }
}
