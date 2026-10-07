'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Check, ChevronDown, Download, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import {
  COLORS, EMPTY_HABITS, SUGGESTIONS, backupFile, bestStreak, currentStreak, isHabitData, rate30, readBackup, toggleDay, wallColumns,
  type Habit, type HabitColor, type HabitData,
} from '@/lib/planner/habits';
import { addDays, daysBetween, downloadFile, monthName, newId, parseKey, shortDate, todayKey, useStoredState, weekday, weekdayLetter } from '@/lib/planner/store';

const STORE_KEY = 'dm-habits';
const WEEKS = 12;
const MAX_HABITS = 12;

// Literal class names so Tailwind keeps them.
const CELL_ON: Record<HabitColor, string> = {
  lime: 'bg-lime-400',
  sky: 'bg-sky-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  violet: 'bg-violet-400',
  teal: 'bg-teal-400',
};
const DOT: Record<HabitColor, string> = {
  lime: 'bg-lime-400 ring-lime-400',
  sky: 'bg-sky-400 ring-sky-400',
  amber: 'bg-amber-400 ring-amber-400',
  rose: 'bg-rose-400 ring-rose-400',
  violet: 'bg-violet-400 ring-violet-400',
  teal: 'bg-teal-400 ring-teal-400',
};
const LEVELS = ['bg-zinc-800', 'bg-lime-900', 'bg-lime-700', 'bg-lime-500', 'bg-lime-300'];

function level(share: number): number {
  if (share <= 0) return 0;
  if (share < 0.34) return 1;
  if (share < 0.67) return 2;
  if (share < 1) return 3;
  return 4;
}

/* ---------------- Wall grid ---------------- */

function Wall({
  cols, today, label, cell,
}: {
  cols: string[][];
  today: string;
  label: string;
  cell: (day: string) => ReactNode;
}) {
  // Month label above the first column that starts a new month.
  const monthLabels = cols.map((col, i) => {
    const m = parseKey(col[0]).getMonth();
    const prev = i > 0 ? parseKey(cols[i - 1][0]).getMonth() : -1;
    return m !== prev ? monthName(m) : '';
  });
  return (
    <div className="w-full max-w-full overflow-x-auto" aria-label={label}>
      <div className="inline-grid grid-cols-[auto_1fr] gap-x-2">
        <div />
        <div className="grid gap-[3px] text-[10px] text-zinc-500" style={{ gridTemplateColumns: `repeat(${cols.length}, var(--cell))` }}>
          {monthLabels.map((m, i) => <span key={i} className="h-4 whitespace-nowrap">{m}</span>)}
        </div>
        <div className="grid grid-rows-7 gap-[3px] text-[10px] leading-none text-zinc-500">
          {['Mon', '', 'Wed', '', 'Fri', '', 'Sun'].map((d, i) => <span key={i} className="flex h-[var(--cell)] items-center">{d}</span>)}
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
          {cols.flat().map((day) => (
            <div key={day} className="h-[var(--cell)] w-[var(--cell)]">
              {day > today ? <span className="block h-full w-full rounded-[3px] border border-dashed border-zinc-800" /> : cell(day)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Habit card ---------------- */

function HabitCard({
  habit, today, cols, onToggle, onRename, onColor, onDelete,
}: {
  habit: Habit;
  today: string;
  cols: string[][];
  onToggle: (day: string) => void;
  onRename: (name: string) => void;
  onColor: (c: HabitColor) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const doneSet = useMemo(() => new Set(habit.done), [habit.done]);
  const doneToday = doneSet.has(today);
  const streak = currentStreak(habit, today);
  const best = bestStreak(habit);
  const r = rate30(habit, today);
  const age = daysBetween(habit.start, today) + 1;
  const strip = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));

  useEffect(() => {
    if (!confirmDelete) return;
    const t = setTimeout(() => setConfirmDelete(false), 4000);
    return () => clearTimeout(t);
  }, [confirmDelete]);

  const saveName = () => {
    const n = draft.trim();
    if (n) onRename(n);
    else setDraft(habit.name);
    setEditing(false);
  };

  return (
    <li className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onToggle(today)}
          aria-pressed={doneToday}
          aria-label={`${habit.name}: ${doneToday ? 'done today, tap to undo' : 'mark done today'}`}
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 transition ${
            doneToday ? `${CELL_ON[habit.color]} border-transparent text-zinc-950` : 'border-zinc-700 text-zinc-600 hover:border-zinc-400 hover:text-zinc-300'
          }`}
        >
          <Check className="h-6 w-6" strokeWidth={3} />
        </button>

        <div className="min-w-0 flex-1">
          {editing ? (
            <input
              autoFocus
              value={draft}
              maxLength={60}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setDraft(habit.name); setEditing(false); } }}
              aria-label="Habit name"
              className="h-9 w-full rounded-lg border border-zinc-600 bg-zinc-950 px-2 text-[15px] font-semibold text-white outline-none focus:border-lime-400"
            />
          ) : (
            <h3 className="break-words pt-1 text-[16px] font-semibold leading-snug text-white">{habit.name}</h3>
          )}
          <p className="mt-1 text-[13px] text-zinc-400">
            <span className="text-zinc-200">{streak}</span> day streak · best <span className="text-zinc-200">{best}</span> · last 30 days <span className="text-zinc-200">{r.done}/{r.days}</span>
            <span className="hidden sm:inline"> · day {age}</span>
          </p>
        </div>
      </div>

      {/* Last 7 days */}
      <div className="mt-4 grid grid-cols-7 gap-1.5" role="group" aria-label={`${habit.name}, last 7 days`}>
        {strip.map((day) => {
          const on = doneSet.has(day);
          const isToday = day === today;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onToggle(day)}
              aria-pressed={on}
              aria-label={`${shortDate(day)}${isToday ? ' (today)' : ''}: ${on ? 'done' : 'not done'}`}
              className={`flex h-12 flex-col items-center justify-center rounded-lg border text-[11px] transition ${
                on ? `${CELL_ON[habit.color]} border-transparent font-semibold text-zinc-950` : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-500'
              } ${isToday ? 'ring-2 ring-white/70 ring-offset-2 ring-offset-zinc-900' : ''}`}
            >
              <span>{weekdayLetter(day)}</span>
              <span className="text-[13px]">{parseKey(day).getDate()}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-2">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-zinc-300 hover:bg-zinc-800">
          <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} /> {open ? 'Hide' : 'Show'} 12 weeks
        </button>
        <button type="button" onClick={() => { setDraft(habit.name); setEditing(true); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
          <Pencil className="h-3.5 w-3.5" /> Rename
        </button>
        <div className="flex items-center gap-1 px-1" role="group" aria-label="Color">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onColor(c)}
              aria-label={`${c} color`}
              aria-pressed={habit.color === c}
              className="grid h-7 w-7 place-items-center"
            >
              <span className={`block h-3.5 w-3.5 rounded-full ${DOT[c]} ${habit.color === c ? 'ring-2 ring-offset-2 ring-offset-zinc-900' : 'opacity-50 hover:opacity-100'}`} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
          className={`ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[13px] ${confirmDelete ? 'bg-rose-600 font-medium text-white' : 'text-zinc-500 hover:bg-zinc-800 hover:text-rose-400'}`}
        >
          <Trash2 className="h-3.5 w-3.5" /> {confirmDelete ? 'Tap again to delete' : 'Delete'}
        </button>
      </div>

      {open && (
        <div className="mt-3 border-t border-zinc-800 pt-4 [--cell:14px] sm:[--cell:16px]">
          <Wall
            cols={cols}
            today={today}
            label={`${habit.name}, last 12 weeks`}
            cell={(day) => {
              const on = doneSet.has(day);
              const before = day < habit.start;
              return (
                <button
                  type="button"
                  onClick={() => onToggle(day)}
                  aria-pressed={on}
                  aria-label={`${shortDate(day)}: ${on ? 'done' : 'not done'}`}
                  title={shortDate(day)}
                  className={`block h-full w-full rounded-[3px] transition hover:ring-1 hover:ring-white/60 ${on ? CELL_ON[habit.color] : before ? 'bg-zinc-900' : 'bg-zinc-800'} ${day === today ? 'ring-1 ring-white/80' : ''}`}
                />
              );
            }}
          />
          <p className="mt-2 text-[12px] text-zinc-500">Tap any past day to fix a check in you missed.</p>
        </div>
      )}
    </li>
  );
}

/* ---------------- Main ---------------- */

export default function HabitTrackerClient() {
  const [data, setData, ready, saved] = useStoredState<HabitData>(STORE_KEY, EMPTY_HABITS, isHabitData);
  const [today, setToday] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Keep "today" right if the page stays open past midnight.
  useEffect(() => {
    const sync = () => setToday(todayKey());
    sync();
    const t = setInterval(sync, 60000);
    document.addEventListener('visibilitychange', sync);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', sync); };
  }, []);

  const habits = data.habits;
  const cols = useMemo(() => (today ? wallColumns(today, WEEKS, weekday(today)) : []), [today]);

  const setHabit = (id: string, fn: (h: Habit) => Habit) =>
    setData((d) => ({ ...d, habits: d.habits.map((h) => (h.id === id ? fn(h) : h)) }));

  const addHabit = (raw: string) => {
    const n = raw.trim().slice(0, 60);
    if (!n || !today || habits.length >= MAX_HABITS) return;
    if (habits.some((h) => h.name.toLowerCase() === n.toLowerCase())) { setNote(`You already track "${n}".`); return; }
    const used = new Set(habits.map((h) => h.color));
    const color = COLORS.find((c) => !used.has(c)) ?? COLORS[habits.length % COLORS.length];
    setData((d) => ({ ...d, habits: [...d.habits, { id: newId(), name: n, color, start: today, done: [] }] }));
    setName('');
    setNote('');
  };

  const doneToday = today ? habits.filter((h) => h.done.includes(today)).length : 0;

  // Overview: share of habits done each day (only habits that had started).
  const overview = (day: string) => {
    const active = habits.filter((h) => h.start <= day);
    if (!active.length) return { share: 0, done: 0, total: 0 };
    const done = active.filter((h) => h.done.includes(day)).length;
    return { share: done / active.length, done, total: active.length };
  };

  const summary = (() => {
    if (!today || !habits.length) return [];
    let bestNow = 0;
    let bestName = '';
    for (const h of habits) {
      const n = currentStreak(h, today);
      if (n > bestNow) { bestNow = n; bestName = h.name; }
    }
    let perfect = 0;
    let counted = 0;
    for (let i = 0; i < 30; i++) {
      const o = overview(addDays(today, -i));
      if (o.total) { counted++; if (o.done === o.total) perfect++; }
    }
    let ticks = 0;
    let possible = 0;
    for (let i = 0; i < 7; i++) {
      const o = overview(addDays(today, -i));
      ticks += o.done;
      possible += o.total;
    }
    return [
      { label: 'Best streak now', value: `${bestNow} ${bestNow === 1 ? 'day' : 'days'}`, note: bestNow ? bestName : 'Tick a habit to start one' },
      { label: 'Perfect days', value: `${perfect}/${counted}`, note: 'All habits done, last 30 days' },
      { label: 'This week', value: `${ticks}/${possible}`, note: 'Check ins in the last 7 days' },
    ];
  })();

  const exportBackup = () => downloadFile(`habits-backup-${today || 'today'}.json`, backupFile(data), 'application/json');
  const importBackup = async (file: File) => {
    const text = await file.text();
    const parsed = readBackup(text);
    if (!parsed) { setNote('That file is not a Habit Tracker backup.'); return; }
    setData(parsed);
    setNote(`Restored ${parsed.habits.length} ${parsed.habits.length === 1 ? 'habit' : 'habits'} from your backup.`);
  };

  const suggestions = SUGGESTIONS.filter((s) => !habits.some((h) => h.name.toLowerCase() === s.toLowerCase()));

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-xl">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 px-4 py-5 sm:px-8">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-lime-400">Today</p>
          <p className="mt-1 text-2xl font-semibold text-white">{today ? shortDate(today) : ' '}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-2xl font-semibold tabular-nums text-white">{doneToday}<span className="text-zinc-500">/{habits.length}</span></p>
            <p className="text-[12px] text-zinc-400">done today</p>
          </div>
          {habits.length > 0 && (
            <div className="flex gap-1" aria-hidden="true">
              {habits.map((h) => (
                <span key={h.id} className={`h-8 w-2 rounded-full ${today && h.done.includes(today) ? CELL_ON[h.color] : 'bg-zinc-800'}`} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overview wall */}
      <section aria-labelledby="ht-wall" className="border-b border-zinc-800 px-4 py-6 sm:px-8">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="ht-wall" className="text-lg font-semibold text-white">Last 12 weeks</h2>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-500" aria-hidden="true">
            Less {LEVELS.map((c) => <span key={c} className={`h-3 w-3 rounded-[3px] ${c}`} />)} All done
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          {!today ? (
            <div className="h-40 animate-pulse rounded-xl bg-zinc-900" />
          ) : (
            <div className="@container min-w-0 flex-1 lg:max-w-[640px]">
              <div style={{ ['--cell' as string]: 'min(46px, calc((100cqw - 44px) / 12 - 3px))' } as CSSProperties}>
              <Wall
                cols={cols}
                today={today}
                label="All habits, last 12 weeks"
                cell={(day) => {
                  const o = overview(day);
                  return (
                    <span
                      title={`${shortDate(day)}: ${o.total ? `${o.done} of ${o.total} done` : 'no habits yet'}`}
                      className={`block h-full w-full rounded-[3px] ${LEVELS[level(o.share)]} ${day === today ? 'ring-1 ring-white/80' : ''}`}
                    />
                  );
                }}
              />
              </div>
            </div>
          )}
          {habits.length > 0 && today && (
            <dl className="grid gap-3 sm:grid-cols-3 lg:w-72 lg:shrink-0 lg:grid-cols-1">
              {summary.map((x) => (
                <div key={x.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-3 sm:px-4">
                  <dt className="text-[11px] uppercase tracking-[0.1em] text-zinc-500 sm:text-[12px]">{x.label}</dt>
                  <dd className="mt-1 font-mono text-xl font-semibold tabular-nums text-white sm:text-2xl">{x.value}</dd>
                  {x.note && <dd className="truncate text-[12px] text-zinc-400">{x.note}</dd>}
                </div>
              ))}
            </dl>
          )}
        </div>
        {habits.length === 0 && ready && (
          <p className="mt-4 text-sm text-zinc-400">Your wall fills in as you tick habits off. Add your first habit below.</p>
        )}
      </section>

      {/* Add */}
      <section aria-labelledby="ht-add" className="border-b border-zinc-800 px-4 py-6 sm:px-8">
        <h2 id="ht-add" className="sr-only">Add a habit</h2>
        <form
          onSubmit={(e) => { e.preventDefault(); addHabit(name); }}
          className="flex gap-2"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder={habits.length >= MAX_HABITS ? `You can track up to ${MAX_HABITS} habits` : 'Add a small daily habit'}
            disabled={habits.length >= MAX_HABITS}
            aria-label="New habit"
            className="h-12 min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 text-[15px] text-white outline-none placeholder:text-zinc-500 focus:border-lime-400 disabled:opacity-50"
          />
          <button type="submit" disabled={!name.trim() || habits.length >= MAX_HABITS} className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-lime-400 px-4 font-semibold text-zinc-950 transition hover:bg-lime-300 disabled:opacity-40">
            <Plus className="h-5 w-5" /> <span className="hidden sm:inline">Add habit</span><span className="sm:hidden">Add</span>
          </button>
        </form>
        {suggestions.length > 0 && habits.length < MAX_HABITS && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {suggestions.slice(0, habits.length ? 4 : 8).map((s) => (
              <button key={s} type="button" onClick={() => addHabit(s)} className="rounded-full border border-dashed border-zinc-700 px-3 py-1.5 text-[13px] text-zinc-400 transition hover:border-solid hover:border-lime-400 hover:text-lime-300">
                + {s}
              </button>
            ))}
          </div>
        )}
        {note && <p className="mt-3 text-[13px] text-amber-300" role="status">{note}</p>}
      </section>

      {/* Habits */}
      {habits.length > 0 && today && (
        <section aria-labelledby="ht-list" className="px-4 py-6 sm:px-8">
          <h2 id="ht-list" className="mb-4 text-lg font-semibold text-white">Your habits</h2>
          <ul className="grid items-start gap-4 xl:grid-cols-2">
            {habits.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                today={today}
                cols={cols}
                onToggle={(day) => setHabit(h.id, (x) => toggleDay(x, day))}
                onRename={(n) => setHabit(h.id, (x) => ({ ...x, name: n.slice(0, 60) }))}
                onColor={(c) => setHabit(h.id, (x) => ({ ...x, color: c }))}
                onDelete={() => setData((d) => ({ ...d, habits: d.habits.filter((x) => x.id !== h.id) }))}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 px-4 py-4 sm:px-8">
        <p className="text-[12px] text-zinc-500">
          {!ready ? 'Loading your habits…' : saved ? 'Saved in this browser only. Download a backup to move to another device.' : 'Your browser is blocking storage, so habits will not be kept. Download a backup before you leave.'}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={exportBackup} disabled={!habits.length} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 text-[13px] font-medium text-zinc-300 hover:border-zinc-400 disabled:opacity-40">
            <Download className="h-4 w-4" /> Backup
          </button>
          <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-700 px-3 text-[13px] font-medium text-zinc-300 hover:border-zinc-400">
            <Upload className="h-4 w-4" /> Restore
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void importBackup(f); e.target.value = ''; }}
          />
        </div>
      </div>
    </div>
  );
}
