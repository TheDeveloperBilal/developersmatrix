'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, CalendarPlus, Check, Clock, Copy, ExternalLink, MoveRight, Plus, Star, Trash2, X } from 'lucide-react';
import {
  DURATIONS, GAPS, MAX_TOP, PRIORITIES, carryOver, dayIcs, dayPrompt, duration, emptyPlan, fromMin, isDayPlan, schedule, sortByPriority,
  type DayPlan, type Priority, type Task,
} from '@/lib/planner/day';
import { addDays, downloadFile, newId, parseKey, shortDate, todayKey, useStoredState } from '@/lib/planner/store';
import { chatLinks } from '@/lib/prompts/types';

const STORE_KEY = 'dm-day-plan';
const PX_PER_MIN = 1.4;

const BLOCK: Record<Priority, string> = {
  must: 'border-indigo-700 bg-indigo-600 text-white',
  should: 'border-indigo-300 bg-indigo-50 text-indigo-950 dark:border-indigo-700 dark:bg-indigo-950 dark:text-indigo-100',
  could: 'border-dashed border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200',
};
const TAG: Record<Priority, string> = {
  must: 'bg-indigo-600 text-white',
  should: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  could: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

const fieldCls = 'h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-2.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

function clock(min: number, fmt: Intl.DateTimeFormat | null): string {
  const t = fromMin(min);
  if (!fmt) return t;
  const [h, m] = t.split(':').map(Number);
  return fmt.format(new Date(2000, 0, 1, h, m));
}

function DurationSelect({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const options = DURATIONS.includes(value) ? DURATIONS : [...DURATIONS, value].sort((a, b) => a - b);
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} className={fieldCls}>
      {options.map((m) => <option key={m} value={m}>{duration(m)}</option>)}
      <option value={180}>3 h</option>
      <option value={240}>4 h</option>
    </select>
  );
}

export default function ProductivityPlannerClient() {
  const [plan, setPlan, ready, saved] = useStoredState<DayPlan>(STORE_KEY, emptyPlan('2000-01-01'), isDayPlan);
  const [today, setToday] = useState('');
  const [nowMin, setNowMin] = useState<number | null>(null);
  const [fmt, setFmt] = useState<Intl.DateTimeFormat | null>(null);
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(30);
  const [priority, setPriority] = useState<Priority>('should');
  const [timeFor, setTimeFor] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setFmt(new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }));
    const tick = () => {
      const d = new Date();
      setToday(todayKey());
      setNowMin(d.getHours() * 60 + d.getMinutes());
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  // A brand new visitor, or an old plan with nothing in it, simply starts today.
  useEffect(() => {
    if (!ready || !today) return;
    if (plan.date === '2000-01-01' || (plan.date < today && plan.tasks.length === 0)) {
      setPlan((p) => ({ ...p, date: today }));
    }
  }, [ready, today, plan.date, plan.tasks.length, setPlan]);

  const stale = ready && today && plan.date < today && plan.tasks.length > 0 && plan.date !== '2000-01-01';
  const unfinished = plan.tasks.filter((t) => !t.done).length;
  const sched = useMemo(() => schedule(plan), [plan]);
  const topCount = plan.tasks.filter((t) => t.top).length;

  const patchTask = (id: string, patch: Partial<Task>) =>
    setPlan((p) => ({ ...p, tasks: p.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const addTask = () => {
    const t = title.trim();
    if (!t) return;
    setPlan((p) => ({ ...p, tasks: [...p.tasks, { id: newId(), title: t.slice(0, 80), minutes, priority, top: false, done: false, at: null }] }));
    setTitle('');
  };

  const move = (id: string, dir: -1 | 1) =>
    setPlan((p) => {
      const i = p.tasks.findIndex((t) => t.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.tasks.length) return p;
      const tasks = [...p.tasks];
      [tasks[i], tasks[j]] = [tasks[j], tasks[i]];
      return { ...p, tasks };
    });

  const toggleTop = (task: Task) => {
    if (!task.top && topCount >= MAX_TOP) {
      setNotice(`Your Top ${MAX_TOP} is full. Unstar one first.`);
      return;
    }
    setNotice('');
    patchTask(task.id, { top: !task.top });
  };

  const moveToTomorrow = () => {
    setPlan((p) => carryOver(p, addDays(today || p.date, 1)));
    setNotice('Unfinished tasks moved to tomorrow. Finished ones were cleared.');
  };

  const prompt = useMemo(() => dayPrompt(plan, sched), [plan, sched]);
  const links = useMemo(() => chatLinks(prompt), [prompt]);
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setNotice('Your browser blocked copying. Select the prompt text and copy it by hand.');
    }
  };

  // Timeline range in whole hours.
  const rangeStart = Math.floor(Math.min(sched.dayStart, ...sched.blocks.map((b) => b.start)) / 60) * 60;
  const rangeEnd = Math.ceil(Math.max(sched.dayEnd, sched.finish) / 60) * 60;
  const hours: number[] = [];
  for (let m = rangeStart; m <= rangeEnd; m += 60) hours.push(m);
  const y = (min: number) => (min - rangeStart) * PX_PER_MIN;
  const isToday = plan.date === today;

  const dayTitle = (() => {
    if (!plan.date || plan.date === '2000-01-01') return ' ';
    const d = parseKey(plan.date);
    return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  })();

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {/* Day header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 px-4 py-5 sm:px-8 dark:border-slate-800">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            {!ready ? 'Day plan' : isToday ? 'Today' : plan.date > today ? 'Planning ahead' : 'Earlier plan'}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{ready ? dayTitle : ' '}</p>
        </div>
        <dl className="flex gap-6 text-sm">
          <div>
            <dt className="text-[12px] text-slate-500">Planned</dt>
            <dd className="font-mono font-semibold tabular-nums">{duration(sched.planned)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-slate-500">Working time</dt>
            <dd className="font-mono font-semibold tabular-nums">{duration(sched.open)}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-slate-500">Finishes</dt>
            <dd className={`font-mono font-semibold tabular-nums ${sched.over ? 'text-rose-600 dark:text-rose-400' : ''}`}>{plan.tasks.length ? clock(sched.finish, fmt) : 'n/a'}</dd>
          </div>
        </dl>
      </div>

      {stale && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:px-8 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100" role="status">
          <p>This plan is from {shortDate(plan.date)}. {unfinished ? `${unfinished} ${unfinished === 1 ? 'task is' : 'tasks are'} still open.` : 'Everything on it is done.'}</p>
          <div className="flex gap-2">
            {unfinished > 0 && (
              <button type="button" onClick={() => setPlan((p) => carryOver(p, today))} className="h-9 rounded-lg bg-amber-600 px-3 font-medium text-white hover:bg-amber-700">Start today with them</button>
            )}
            <button type="button" onClick={() => setPlan((p) => ({ ...emptyPlan(today), start: p.start, end: p.end, gap: p.gap }))} className="h-9 rounded-lg border border-amber-400 px-3 font-medium hover:bg-amber-100 dark:hover:bg-amber-900">Start fresh</button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Tasks */}
        <section aria-labelledby="pp-tasks" className="border-b border-slate-200 px-4 py-6 sm:px-8 lg:border-b-0 lg:border-r dark:border-slate-800">
          <h2 id="pp-tasks" className="text-lg font-semibold">Tasks</h2>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">Star up to three that would make today a good day. They go first on the timeline.</p>

          <form onSubmit={(e) => { e.preventDefault(); addTask(); }} className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              placeholder="What do you need to do?"
              aria-label="Task"
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-[15px] outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-slate-700 dark:bg-slate-900"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <DurationSelect value={minutes} onChange={setMinutes} label="How long" />
              <div role="group" aria-label="Priority" className="flex rounded-lg border border-slate-300 bg-white p-0.5 dark:border-slate-700 dark:bg-slate-900">
                {PRIORITIES.map((p) => (
                  <button key={p.id} type="button" title={p.hint} aria-pressed={priority === p.id} onClick={() => setPriority(p.id)}
                    className={`h-[34px] rounded-md px-3 text-[13px] font-medium transition ${priority === p.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={!title.trim()} className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-40 dark:bg-white dark:text-slate-900">
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </form>

          {notice && <p className="mt-3 text-[13px] text-amber-700 dark:text-amber-300" role="status">{notice}</p>}

          {plan.tasks.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700">
              Add what is on your plate today, with a rough time for each. Meetings can be pinned to a fixed time.
            </p>
          ) : (
            <ol className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {plan.tasks.map((t, i) => (
                <li key={t.id} className="py-3">
                  <div className="flex items-start gap-2">
                    <button
                      type="button"
                      onClick={() => patchTask(t.id, { done: !t.done })}
                      aria-pressed={t.done}
                      aria-label={`${t.title}: ${t.done ? 'done, tap to reopen' : 'mark done'}`}
                      className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition ${t.done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 text-transparent hover:border-emerald-600 dark:border-slate-600'}`}
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </button>
                    <input
                      value={t.title}
                      onChange={(e) => patchTask(t.id, { title: e.target.value.slice(0, 80) })}
                      aria-label="Task name"
                      className={`h-9 min-w-0 flex-1 border-b border-transparent bg-transparent text-[15px] outline-none focus:border-indigo-600 ${t.done ? 'text-slate-400 line-through' : 'font-medium'}`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleTop(t)}
                      aria-pressed={t.top}
                      aria-label={t.top ? `Remove ${t.title} from Top 3` : `Add ${t.title} to Top 3`}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition ${t.top ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500 dark:text-slate-600'}`}
                    >
                      <Star className="h-5 w-5" fill={t.top ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-9">
                    <DurationSelect value={t.minutes} onChange={(n) => patchTask(t.id, { minutes: n })} label={`How long for ${t.title}`} />
                    <select value={t.priority} onChange={(e) => patchTask(t.id, { priority: e.target.value as Priority })} aria-label={`Priority for ${t.title}`} className={fieldCls}>
                      {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                    {t.at || timeFor === t.id ? (
                      <span className="inline-flex items-center gap-1">
                        <input
                          type="time"
                          value={t.at ?? ''}
                          autoFocus={timeFor === t.id && !t.at}
                          onChange={(e) => patchTask(t.id, { at: e.target.value || null })}
                          aria-label={`Fixed start time for ${t.title}`}
                          className={`${fieldCls} w-[7.5rem]`}
                        />
                        <button type="button" onClick={() => { patchTask(t.id, { at: null }); setTimeFor(null); }} aria-label="Clear fixed time" className="grid h-9 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-700">
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setTimeFor(t.id)} className="inline-flex h-10 items-center gap-1 rounded-lg px-2 text-[13px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200">
                        <Clock className="h-3.5 w-3.5" /> Fixed time
                      </button>
                    )}
                    <span className="ml-auto flex">
                      <button type="button" onClick={() => move(t.id, -1)} disabled={i === 0} aria-label={`Move ${t.title} up`} className="grid h-9 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 dark:hover:text-white"><ArrowUp className="h-4 w-4" /></button>
                      <button type="button" onClick={() => move(t.id, 1)} disabled={i === plan.tasks.length - 1} aria-label={`Move ${t.title} down`} className="grid h-9 w-8 place-items-center rounded-lg text-slate-400 hover:text-slate-800 disabled:opacity-30 dark:hover:text-white"><ArrowDown className="h-4 w-4" /></button>
                      <button type="button" onClick={() => setPlan((p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== t.id) }))} aria-label={`Delete ${t.title}`} className="grid h-9 w-8 place-items-center rounded-lg text-slate-400 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {plan.tasks.length > 1 && (
            <button type="button" onClick={() => setPlan((p) => ({ ...p, tasks: sortByPriority(p.tasks) }))} className="mt-3 text-[13px] font-medium text-indigo-700 hover:underline dark:text-indigo-400">
              Sort by priority
            </button>
          )}
        </section>

        {/* Timeline */}
        <section aria-labelledby="pp-timeline" className="px-4 py-6 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="pp-timeline" className="text-lg font-semibold">Timeline</h2>
            <div className="flex flex-wrap items-end gap-2 text-[12px] text-slate-500">
              <label className="flex flex-col gap-1">Start
                <input type="time" value={plan.start} onChange={(e) => e.target.value && setPlan((p) => ({ ...p, start: e.target.value }))} className={`${fieldCls} w-[7.5rem]`} />
              </label>
              <label className="flex flex-col gap-1">End
                <input type="time" value={plan.end} onChange={(e) => e.target.value && setPlan((p) => ({ ...p, end: e.target.value }))} className={`${fieldCls} w-[7.5rem]`} />
              </label>
              <label className="flex flex-col gap-1">Gap after tasks
                <select value={plan.gap} onChange={(e) => setPlan((p) => ({ ...p, gap: Number(e.target.value) }))} className={fieldCls}>
                  {GAPS.map((g) => <option key={g} value={g}>{g ? `${g} min` : 'None'}</option>)}
                </select>
              </label>
            </div>
          </div>

          {sched.over > 0 && (
            <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100" role="status">
              <strong>Overbooked by {duration(sched.over)}.</strong> Move something to tomorrow, cut an estimate, or drop a Could task.
            </p>
          )}
          {sched.blocks.some((b) => b.clash) && (
            <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100" role="status">
              Two fixed time tasks overlap. Check the times marked in red.
            </p>
          )}

          {!ready ? (
            <div className="mt-5 h-80 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : (
            <div className="relative mt-5" style={{ height: y(rangeEnd) + 12 }}>
              {/* Outside working hours */}
              {sched.dayStart > rangeStart && <div className="absolute left-16 right-0 bg-slate-50 dark:bg-slate-950" style={{ top: 0, height: y(sched.dayStart) }} aria-hidden="true" />}
              <div className="absolute left-16 right-0 bg-rose-50/70 dark:bg-rose-950/20" style={{ top: y(sched.dayEnd), height: y(rangeEnd) - y(sched.dayEnd) }} aria-hidden="true" />
              {hours.map((m) => (
                <div key={m} className="absolute left-0 right-0 flex items-start" style={{ top: y(m) }} aria-hidden="true">
                  <span className="-mt-2 w-16 shrink-0 whitespace-nowrap pr-2 text-right font-mono text-[11px] tabular-nums text-slate-400">{clock(m, fmt)}</span>
                  <span className="mt-0 h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                </div>
              ))}
              <div className="absolute left-16 right-0 border-t-2 border-dashed border-rose-400" style={{ top: y(sched.dayEnd) }} aria-hidden="true">
                <span className="absolute -top-5 right-0 text-[11px] font-medium text-rose-500">End of day</span>
              </div>

              <ol aria-label="Your day in order">
                {sched.blocks.map((b) => {
                  const h = Math.max(19, b.task.minutes * PX_PER_MIN - 3);
                  const compact = h < 50;
                  return (
                    <li
                      key={b.task.id}
                      className={`absolute left-[4.5rem] right-1 overflow-hidden rounded-md border px-2.5 ${compact ? 'flex items-center gap-2 py-0' : 'py-1.5'} ${BLOCK[b.task.priority]} ${b.task.done ? 'opacity-45' : ''} ${b.clash ? 'ring-2 ring-rose-500' : ''}`}
                      style={{ top: y(b.start) + 1, height: h }}
                    >
                      <span className={`font-mono text-[11px] tabular-nums opacity-80 ${compact ? 'shrink-0' : 'block'}`}>{compact ? clock(b.start, fmt) : `${clock(b.start, fmt)} to ${clock(b.end, fmt)}`}</span>
                      <span className={`min-w-0 truncate font-semibold ${compact ? 'text-[12px]' : 'block text-[13px]'} ${b.task.done ? 'line-through' : ''}`}>
                        {b.task.top && <Star className="mr-1 inline h-3 w-3 -translate-y-px text-amber-400" fill="currentColor" aria-label="Top 3" />}
                        {b.task.title || 'Untitled'}
                        {b.task.at && <span className="ml-1 font-normal opacity-75">(fixed)</span>}
                      </span>
                    </li>
                  );
                })}
              </ol>

              {isToday && nowMin !== null && nowMin >= rangeStart && nowMin <= rangeEnd && (
                <div className="pointer-events-none absolute left-[3.75rem] right-0 flex items-center" style={{ top: y(nowMin) }} aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="h-0.5 flex-1 bg-emerald-500" />
                </div>
              )}
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-500" aria-hidden="true">
            {PRIORITIES.map((p) => <span key={p.id} className="inline-flex items-center gap-1.5"><span className={`h-3 w-3 rounded ${TAG[p.id]}`} />{p.label}</span>)}
            <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 bg-emerald-500" />Now</span>
          </div>
        </section>
      </div>

      {/* Actions */}
      <div className="grid gap-6 border-t border-slate-200 bg-slate-50 px-4 py-6 sm:px-8 lg:grid-cols-2 dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h2 className="text-[15px] font-semibold">Wrap up the day</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={!plan.tasks.some((t) => !t.done)} onClick={() => downloadFile(`day-plan-${plan.date}.ics`, dayIcs(plan, sched), 'text/calendar;charset=utf-8')}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium hover:border-slate-900 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900">
              <CalendarPlus className="h-4 w-4" /> Add to calendar (.ics)
            </button>
            <button type="button" disabled={!unfinished || !today} onClick={moveToTomorrow}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium hover:border-slate-900 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900">
              <MoveRight className="h-4 w-4" /> Move unfinished to tomorrow
            </button>
          </div>
          <p className="mt-2 text-[12px] text-slate-500">The calendar file works with Google Calendar, Outlook and Apple Calendar. It is a one time copy, not a live sync.</p>
        </div>
        <div>
          <h2 className="text-[15px] font-semibold">Plan my day with AI <span className="font-normal text-slate-500">(optional)</span></h2>
          <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">Opens your task list as a ready prompt in ChatGPT or Claude. It asks for an order, a reality check on your estimates and what to drop.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {links ? (
              <>
                <a href={plan.tasks.length ? links.chatgpt : undefined} aria-disabled={!plan.tasks.length} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex h-10 items-center gap-2 rounded-lg bg-slate-900 px-3 text-sm font-medium text-white dark:bg-white dark:text-slate-900 ${plan.tasks.length ? 'hover:bg-slate-700' : 'pointer-events-none opacity-40'}`}>
                  Open in ChatGPT <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a href={plan.tasks.length ? links.claude : undefined} aria-disabled={!plan.tasks.length} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium dark:border-slate-700 dark:bg-slate-900 ${plan.tasks.length ? 'hover:border-slate-900' : 'pointer-events-none opacity-40'}`}>
                  Open in Claude <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </>
            ) : (
              <p className="text-[13px] text-slate-500">Your list is too long to open as a link. Copy the prompt instead.</p>
            )}
            <button type="button" onClick={copyPrompt} disabled={!plan.tasks.length}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium hover:border-slate-900 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900">
              <Copy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy prompt'}
            </button>
          </div>
        </div>
      </div>

      <p className="border-t border-slate-200 px-4 py-3 text-[12px] text-slate-500 sm:px-8 dark:border-slate-800">
        {!ready ? 'Loading your plan…' : saved ? 'Saved in this browser only. Nothing is sent to our servers unless you open the AI prompt yourself.' : 'Your browser is blocking storage, so this plan will not be kept after you close the page.'}
      </p>
    </div>
  );
}

