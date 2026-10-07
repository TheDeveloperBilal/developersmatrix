// Productivity Planner logic: turns a task list into a timed day plan.
// Plain rules you can see. No hidden scoring.

import { isDateKey } from './store';

export type Priority = 'must' | 'should' | 'could';

export interface Task {
  id: string;
  title: string;
  minutes: number;
  priority: Priority;
  top: boolean;
  done: boolean;
  /** Fixed start time (HH:MM) for meetings and appointments, or null to fit it in. */
  at: string | null;
}

export interface DayPlan {
  v: 1;
  date: string;
  start: string;
  end: string;
  /** Minutes of breathing room after each task. */
  gap: number;
  tasks: Task[];
}

export const PRIORITIES: { id: Priority; label: string; hint: string }[] = [
  { id: 'must', label: 'Must', hint: 'Has to happen today' },
  { id: 'should', label: 'Should', hint: 'Important, but could slip a day' },
  { id: 'could', label: 'Could', hint: 'Nice to get done' },
];

export const DURATIONS = [15, 30, 45, 60, 90, 120];
export const GAPS = [0, 5, 10, 15];
export const MAX_TOP = 3;

const TIME = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isTime(v: unknown): v is string {
  return typeof v === 'string' && TIME.test(v);
}

function isTask(v: unknown): v is Task {
  if (!v || typeof v !== 'object') return false;
  const t = v as Record<string, unknown>;
  return typeof t.id === 'string' && typeof t.title === 'string' && typeof t.minutes === 'number' && t.minutes > 0
    && (t.priority === 'must' || t.priority === 'should' || t.priority === 'could')
    && typeof t.top === 'boolean' && typeof t.done === 'boolean' && (t.at === null || isTime(t.at));
}

export function isDayPlan(v: unknown): v is DayPlan {
  if (!v || typeof v !== 'object') return false;
  const p = v as Record<string, unknown>;
  return p.v === 1 && isDateKey(p.date) && isTime(p.start) && isTime(p.end) && typeof p.gap === 'number'
    && Array.isArray(p.tasks) && p.tasks.every(isTask);
}

export function emptyPlan(date: string): DayPlan {
  return { v: 1, date, start: '09:00', end: '17:30', gap: 5, tasks: [] };
}

export function toMin(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function fromMin(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export function duration(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export interface Block {
  task: Task;
  start: number;
  end: number;
  /** A fixed time task that overlaps another fixed time task. */
  clash: boolean;
}

export interface Schedule {
  blocks: Block[];
  dayStart: number;
  dayEnd: number;
  finish: number;
  /** Minutes the plan runs past the end of the day (0 if it fits). */
  over: number;
  planned: number;
  open: number;
}

/** Top 3 first, then the rest in list order. Fixed time tasks are placed separately. */
export function flexOrder(tasks: Task[]): Task[] {
  const flex = tasks.filter((t) => !t.at);
  return [...flex.filter((t) => t.top), ...flex.filter((t) => !t.top)];
}

export function schedule(plan: DayPlan): Schedule {
  const dayStart = toMin(plan.start);
  const dayEnd = Math.max(toMin(plan.end), dayStart + 15);
  const gap = Math.max(0, plan.gap);

  const fixed: Block[] = plan.tasks
    .filter((t) => t.at)
    .map((t) => ({ task: t, start: toMin(t.at as string), end: toMin(t.at as string) + t.minutes, clash: false }))
    .sort((a, b) => a.start - b.start);
  for (let i = 1; i < fixed.length; i++) {
    if (fixed[i].start < fixed[i - 1].end) {
      fixed[i].clash = true;
      fixed[i - 1].clash = true;
    }
  }

  // First fit: each task (Top 3 first, then list order) takes the earliest
  // free slot from the start of the day, so short tasks can fill gaps before meetings.
  const blocks: Block[] = [...fixed];
  for (const t of flexOrder(plan.tasks)) {
    const starts = [dayStart, ...blocks.map((x) => x.end + gap)].filter((x) => x >= dayStart).sort((x, y) => x - y);
    const free = (st: number) => blocks.every((x) => !(st < x.end + gap && st + t.minutes + gap > x.start));
    const s = starts.find(free) ?? Math.max(dayStart, ...blocks.map((x) => x.end + gap));
    blocks.push({ task: t, start: s, end: s + t.minutes, clash: false });
  }

  blocks.sort((a, b) => a.start - b.start);
  const finish = blocks.reduce((m, b) => Math.max(m, b.end), dayStart);
  const planned = plan.tasks.reduce((s, t) => s + t.minutes, 0);
  return {
    blocks,
    dayStart,
    dayEnd,
    finish,
    over: Math.max(0, finish - dayEnd),
    planned,
    open: dayEnd - dayStart,
  };
}

/** Start a new day with the unfinished tasks. Fixed times are cleared because they belonged to the old day. */
export function carryOver(plan: DayPlan, date: string): DayPlan {
  return {
    ...plan,
    date,
    tasks: plan.tasks.filter((t) => !t.done).map((t) => ({ ...t, at: null })),
  };
}

export function sortByPriority(tasks: Task[]): Task[] {
  const rank: Record<Priority, number> = { must: 0, should: 1, could: 2 };
  return tasks.map((t, i) => ({ t, i })).sort((a, b) => rank[a.t.priority] - rank[b.t.priority] || a.i - b.i).map((x) => x.t);
}

function icsText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function icsStamp(date: string, min: number): string {
  // Times past midnight roll into the next day.
  const d = new Date(`${date}T00:00:00`);
  d.setMinutes(d.getMinutes() + min);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}

/** Calendar file with one event per task, in local (floating) time. */
export function dayIcs(plan: DayPlan, sched: Schedule): string {
  const now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DevelopersMatrix//Productivity Planner//EN', 'CALSCALE:GREGORIAN'];
  for (const b of sched.blocks) {
    if (b.task.done) continue;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${b.task.id}-${plan.date}@developersmatrix.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${icsStamp(plan.date, b.start)}`,
      `DTEND:${icsStamp(plan.date, b.end)}`,
      `SUMMARY:${icsText((b.task.top ? 'Top 3: ' : '') + (b.task.title || 'Task'))}`,
      `DESCRIPTION:${icsText(`Priority: ${PRIORITIES.find((p) => p.id === b.task.priority)?.label ?? ''}`)}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n') + '\r\n';
}

export function dayPrompt(plan: DayPlan, sched: Schedule): string {
  const label = (p: Priority) => PRIORITIES.find((x) => x.id === p)?.label ?? p;
  const list = plan.tasks
    .map((t, i) => `${i + 1}. ${t.title || 'Untitled'} (${duration(t.minutes)}, ${label(t.priority)}${t.top ? ', in my Top 3' : ''}${t.at ? `, fixed at ${t.at}` : ''}${t.done ? ', already done' : ''})`)
    .join('\n');
  return [
    `Help me plan my working day. I work from ${plan.start} to ${plan.end}.`,
    '',
    'My tasks, with my own time estimates and priorities:',
    list,
    '',
    `In total that is ${duration(sched.planned)} of work for ${duration(sched.open)} of working time${sched.over ? `, so my plan runs ${duration(sched.over)} past the end of my day` : ''}.`,
    '',
    'Please:',
    '1. Suggest an order for the day and say why, keeping fixed time tasks where they are.',
    '2. Point out any estimates that look too optimistic.',
    '3. If it does not fit, tell me what to move to tomorrow or cut.',
    '4. Suggest where to put short breaks.',
    'Keep the answer short and practical. Ask me before assuming anything about a task you do not understand.',
  ].join('\n');
}
