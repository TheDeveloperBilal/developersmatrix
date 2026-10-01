'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Cpu,
  HardDrive,
  Loader2,
  MemoryStick,
  MonitorPlay,
  Search,
  TriangleAlert,
  X,
} from 'lucide-react';
import { gamesDatabase, type Game } from '@/data/games-database';
import { matchHardware, suggestHardware, type HardwareItem, type HardwareKind } from '@/lib/hardware/catalogue';

type Status = 'excellent' | 'good' | 'pass' | 'fail';

interface CheckResult {
  game: { id: string; name: string };
  matched: { cpu: string; gpu: string };
  canRun: boolean;
  performance: {
    cpu: Status;
    gpu: Status;
    ram: Status;
    storage: Status;
    score: number;
    settings: string;
    fps_estimate: string;
  };
  compared: {
    cpu: { yours: string; required: string };
    gpu: { yours: string; required: string };
    ram: { yours: number; required: number };
    storage: { yours: number; required: number };
  };
  upgrades: string[];
  note: string | null;
}

/* ------------------------------------------------------------------ */
/* Shared surface styles. One glass recipe, used everywhere, so the    */
/* tool reads as one object rather than a stack of unrelated cards.    */
/* ------------------------------------------------------------------ */

const glass =
  'rounded-3xl border border-white/70 bg-white/60 backdrop-blur-2xl ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_30px_80px_-40px_rgba(15,23,42,0.45)] ' +
  'dark:border-white/[0.08] dark:bg-slate-900/40 ' +
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_rgba(0,0,0,0.9)]';

const inset =
  'rounded-2xl border border-slate-900/[0.06] bg-white/70 ' +
  'dark:border-white/[0.06] dark:bg-white/[0.03]';

const eyebrow = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400';

const STATUS_META: Record<Status, { label: string; dot: string; text: string; ring: string }> = {
  excellent: {
    label: 'Well above',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-500/25 bg-emerald-500/[0.08]',
  },
  good: {
    label: 'Above',
    dot: 'bg-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-300',
    ring: 'ring-emerald-500/20 bg-emerald-500/[0.06]',
  },
  pass: {
    label: 'Just meets',
    dot: 'bg-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-500/25 bg-amber-500/[0.08]',
  },
  fail: {
    label: 'Below minimum',
    dot: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-300',
    ring: 'ring-rose-500/25 bg-rose-500/[0.08]',
  },
};

function monogram(name: string) {
  const words = name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + (words[1]?.[0] ?? '')).toUpperCase();
}

function yearOf(date: string) {
  const m = date.match(/\d{4}/);
  return m ? m[0] : date;
}

/* ------------------------------------------------------------------ */
/* Hardware picker: a combobox limited to the hardware catalogue, so   */
/* the checker can only ever score parts it actually knows.            */
/* ------------------------------------------------------------------ */

function HardwarePicker({
  kind,
  label,
  icon,
  value,
  onChange,
  serverError,
}: {
  kind: HardwareKind;
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  serverError?: string;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);

  const matched = useMemo(() => matchHardware(value, kind), [value, kind]);
  // Six suggestions fit without the list needing its own scrollbar.
  const options = useMemo(() => suggestHardware(value, kind, 6), [value, kind]);
  const showList = open && value.trim().length > 0 && options.length > 0 && matched?.name !== value;
  const invalid = touched && value.trim().length > 0 && !matched;

  const choose = (item: HardwareItem) => {
    onChange(item.name);
    setOpen(false);
    setTouched(true);
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
        <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">{icon}</span>
        {label}
      </label>
      <div
        className={[
          'flex items-center rounded-xl border bg-white/80 px-3.5 transition-colors dark:bg-slate-950/40',
          invalid || serverError
            ? 'border-rose-400/70 ring-4 ring-rose-500/10'
            : matched
            ? 'border-emerald-500/40'
            : 'border-slate-900/10 focus-within:border-slate-900/30 focus-within:ring-4 focus-within:ring-slate-900/5 dark:border-white/10 dark:focus-within:border-white/25 dark:focus-within:ring-white/5',
        ].join(' ')}
      >
        <input
          id={id}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={invalid || !!serverError}
          autoComplete="off"
          spellCheck={false}
          placeholder={kind === 'cpu' ? 'Start typing, e.g. Ryzen 5 5600X' : 'Start typing, e.g. RTX 3060'}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setTouched(true);
            // Delay so a click on an option registers before the list closes.
            setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(e) => {
            if (!showList) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, options.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              choose(options[active]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
          className="h-12 w-full bg-transparent font-mono text-[13.5px] text-slate-900 outline-none placeholder:font-sans placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        {matched && (
          <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Recognised" />
        )}
        {value && !matched && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label={`Clear ${label}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 w-full rounded-2xl border border-slate-900/10 bg-white/95 p-1.5 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
        >
          {options.map((item, i) => (
            <li
              key={item.name}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(item)}
              onMouseEnter={() => setActive(i)}
              className={[
                'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm',
                i === active ? 'bg-slate-900/[0.05] dark:bg-white/[0.06]' : '',
              ].join(' ')}
            >
              <span className="font-mono text-[13px] text-slate-900 dark:text-slate-100">{item.name}</span>
              {item.integrated && (
                <span className="shrink-0 text-[11px] text-slate-500 dark:text-slate-400">Integrated</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1.5 min-h-[1.25rem] text-xs" aria-live="polite">
        {serverError ? (
          <span className="text-rose-600 dark:text-rose-400">{serverError}</span>
        ) : invalid ? (
          <span className="text-rose-600 dark:text-rose-400">
            Not recognised. Pick your exact model from the list.
          </span>
        ) : matched && matched.name !== value ? (
          <span className="text-slate-500 dark:text-slate-400">
            Matched to <span className="font-mono text-slate-700 dark:text-slate-300">{matched.name}</span>
          </span>
        ) : null}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Score ring                                                          */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, tone }: { score: number; tone: 'good' | 'warn' | 'bad' }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const stroke = tone === 'good' ? '#10b981' : tone === 'warn' ? '#f59e0b' : '#f43f5e';
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-slate-900/[0.07] dark:stroke-white/[0.08]" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{score}</span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">out of 100</span>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${m.ring} ${m.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} aria-hidden="true" />
      {m.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

type Filter = 'all' | 'popular' | 'new';

export default function CanYouRunItClient() {
  const [selected, setSelected] = useState<Game | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [showAll, setShowAll] = useState(false);
  const [cpu, setCpu] = useState('');
  const [gpu, setGpu] = useState('');
  const [ram, setRam] = useState(16);
  const [storage, setStorage] = useState(500);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<{ field?: string; message: string; suggestions?: string[] } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const games = useMemo(() => {
    const q = query.trim().toLowerCase();
    return gamesDatabase
      .filter((g) => {
        if (q && !g.name.toLowerCase().includes(q) && !(g.searchName || '').toLowerCase().includes(q) && !g.genre.some((x) => x.toLowerCase().includes(q))) return false;
        if (filter === 'popular') return (g.popularity ?? 0) >= 90;
        if (filter === 'new') return /2025|2026/.test(g.releaseDate);
        return true;
      })
      .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }, [query, filter]);

  // The list never scrolls inside itself. It shows the first few titles and
  // grows when asked, so there is no nested scrollbar on desktop or mobile.
  const COLLAPSED = 8;
  const searching = query.trim().length > 0;
  const visibleGames = useMemo(() => {
    if (showAll || searching || games.length <= COLLAPSED) return games;
    const top = games.slice(0, COLLAPSED);
    if (selected && !top.some((g) => g.id === selected.id) && games.some((g) => g.id === selected.id)) {
      top.push(selected);
    }
    return top;
  }, [games, showAll, searching, selected]);
  const hiddenCount = games.length - visibleGames.length;

  const cpuMatch = matchHardware(cpu, 'cpu');
  const gpuMatch = matchHardware(gpu, 'gpu');
  const unannounced = selected?.requirementsStatus === 'unannounced';
  const ready = !!selected && !unannounced && !!cpuMatch && !!gpuMatch && ram > 0 && !loading;

  useEffect(() => {
    if (result && resultRef.current && window.innerWidth < 1024) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const pick = (game: Game) => {
    setSelected(game);
    setResult(null);
    setError(null);
    // On phones the form sits under a long list, so bring it into view.
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  };

  const check = async () => {
    if (!selected) return;
    if (!cpuMatch || !gpuMatch) {
      setError({ message: 'Pick your processor and graphics card from the lists so we can score them.' });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/system-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: selected.id, userSpecs: { cpu: cpuMatch.name, gpu: gpuMatch.name, ram, storage } }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult(null);
        setError({ field: data.field, message: data.error || 'Something went wrong. Try again.', suggestions: data.suggestions });
        return;
      }
      setResult(data as CheckResult);
    } catch {
      setError({ message: 'Could not reach the checker. Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  const tone = result ? (!result.canRun ? 'bad' : result.performance.score >= 80 ? 'good' : 'warn') : 'good';

  return (
    <div className={`${glass} p-2 sm:p-3`}>
      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* ---------------- Game list ---------------- */}
        <section aria-labelledby="pick-game" className={`${inset} flex min-w-0 flex-col p-4 sm:p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 id="pick-game" className="text-[15px] font-semibold text-slate-900 dark:text-white">
              <span className="mr-2 font-mono text-slate-400">01</span>Choose a game
            </h2>
            <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{games.length} titles</span>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games"
              aria-label="Search games"
              className="h-11 w-full rounded-xl border border-slate-900/10 bg-white/80 pl-10 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900/30 focus:ring-4 focus:ring-slate-900/5 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100 dark:focus:border-white/25"
            />
          </div>

          <div role="tablist" aria-label="Filter games" className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-900/[0.04] p-1 dark:bg-white/[0.04]">
            {(['all', 'popular', 'new'] as Filter[]).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={[
                  'rounded-lg py-1.5 text-xs font-medium transition-colors',
                  filter === f
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                ].join(' ')}
              >
                {f === 'all' ? 'All' : f === 'popular' ? 'Popular' : 'Since 2025'}
              </button>
            ))}
          </div>

          <ul className="mt-3 space-y-1" aria-label="Games">
            {games.length === 0 && (
              <li className="px-2 py-8 text-center text-sm text-slate-500">No game matches that search.</li>
            )}
            {visibleGames.map((g) => {
              const active = selected?.id === g.id;
              const noSpecs = g.requirementsStatus === 'unannounced';
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => pick(g)}
                    aria-pressed={active}
                    className={[
                      'group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors',
                      active
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]',
                    ].join(' ')}
                  >
                    <span
                      aria-hidden="true"
                      className={[
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold tracking-wide',
                        active
                          ? 'bg-white/15 text-white dark:bg-slate-900/10 dark:text-slate-900'
                          : 'border border-slate-900/[0.06] bg-gradient-to-b from-white to-slate-100 text-slate-600 dark:border-white/[0.06] dark:from-white/[0.08] dark:to-white/[0.02] dark:text-slate-300',
                      ].join(' ')}
                    >
                      {monogram(g.searchName || g.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{g.name}</span>
                      <span className={`block truncate text-xs ${active ? 'text-white/65 dark:text-slate-900/60' : 'text-slate-500 dark:text-slate-400'}`}>
                        {g.genre[0]} · {yearOf(g.releaseDate)}
                      </span>
                    </span>
                    {noSpecs ? (
                      <span className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${active ? 'bg-white/15' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300'}`}>
                        No PC specs
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          {(hiddenCount > 0 || (showAll && !searching && games.length > COLLAPSED)) && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              aria-expanded={showAll}
              className="mt-3 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-slate-900/10 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-900/[0.04] dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
            >
              {showAll ? 'Show fewer games' : `Show all ${games.length} games`}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? 'rotate-180' : ''}`} aria-hidden="true" />
            </button>
          )}
        </section>

        {/* ---------------- Right side ---------------- */}
        <section ref={panelRef} aria-live="polite" className={`${inset} min-w-0 scroll-mt-24 p-4 sm:p-6`}>
          {!selected && <EmptyState />}

          {selected && unannounced && (
            <UnannouncedPanel
              game={selected}
              onPickAlternative={() => {
                const alt = gamesDatabase.find((g) => g.id === 'gta-5');
                if (alt) pick(alt);
              }}
            />
          )}

          {selected && !unannounced && (
            <div>
              {/* Game header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className={eyebrow}>
                    <span className="mr-2 font-mono">02</span>Your hardware for
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {selected.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {selected.developer} · {selected.releaseDate}
                  </p>
                </div>
                <a
                  href={`/tools/can-you-run-it/${selected.id}`}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-slate-300"
                >
                  Full requirements <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>

              {/* Minimum spec strip */}
              <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-900/[0.06] bg-slate-900/[0.06] text-xs dark:border-white/[0.06] dark:bg-white/[0.06] md:grid-cols-4">
                {[
                  ['Processor', selected.minimumRequirements.processor],
                  ['Graphics', selected.minimumRequirements.graphics],
                  ['Memory', selected.minimumRequirements.memory],
                  ['Storage', selected.minimumRequirements.storage],
                ].map(([k, v]) => (
                  <div key={k} className="bg-white/80 p-3 dark:bg-slate-950/50">
                    <dt className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-slate-400">Min {k}</dt>
                    <dd className="mt-1 line-clamp-2 text-slate-700 dark:text-slate-300">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Form */}
              <div className="mt-6 grid gap-x-5 gap-y-2 md:grid-cols-2">
                <HardwarePicker
                  kind="cpu"
                  label="Processor"
                  icon={<Cpu className="h-4 w-4" />}
                  value={cpu}
                  onChange={(v) => {
                    setCpu(v);
                    if (error?.field === 'cpu') setError(null);
                  }}
                  serverError={error?.field === 'cpu' ? error.message : undefined}
                />
                <HardwarePicker
                  kind="gpu"
                  label="Graphics card"
                  icon={<MonitorPlay className="h-4 w-4" />}
                  value={gpu}
                  onChange={(v) => {
                    setGpu(v);
                    if (error?.field === 'gpu') setError(null);
                  }}
                  serverError={error?.field === 'gpu' ? error.message : undefined}
                />

                <div>
                  <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    <MemoryStick className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                    Memory
                  </p>
                  <div className="grid grid-cols-4 gap-1 rounded-xl bg-slate-900/[0.04] p-1 dark:bg-white/[0.04]" role="radiogroup" aria-label="Memory in GB">
                    {[8, 16, 32, 64].map((v) => (
                      <button
                        key={v}
                        type="button"
                        role="radio"
                        aria-checked={ram === v}
                        onClick={() => setRam(v)}
                        className={[
                          'h-10 rounded-lg text-sm font-medium tabular-nums transition-colors',
                          ram === v
                            ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
                        ].join(' ')}
                      >
                        {v} GB
                      </button>
                    ))}
                  </div>
                  <label className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    Other amount
                    <input
                      type="number"
                      min={1}
                      max={512}
                      value={ram}
                      onChange={(e) => setRam(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="h-8 w-20 rounded-lg border border-slate-900/10 bg-white/80 px-2 text-right tabular-nums text-slate-900 outline-none focus:border-slate-900/30 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-100"
                    />
                    GB
                  </label>
                </div>

                <div>
                  <label htmlFor="free-storage" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
                    <HardDrive className="h-4 w-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                    Free storage
                  </label>
                  <div className="flex h-12 items-center rounded-xl border border-slate-900/10 bg-white/80 px-3.5 focus-within:border-slate-900/30 focus-within:ring-4 focus-within:ring-slate-900/5 dark:border-white/10 dark:bg-slate-950/40">
                    <input
                      id="free-storage"
                      type="number"
                      min={0}
                      value={storage}
                      onChange={(e) => setStorage(Math.max(0, parseInt(e.target.value, 10) || 0))}
                      className="w-full bg-transparent text-sm tabular-nums text-slate-900 outline-none dark:text-slate-100"
                    />
                    <span className="text-sm text-slate-400">GB</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">Space left on the drive you will install to.</p>
                </div>
              </div>

              {error && !error.field && (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-rose-500/[0.07] px-3.5 py-3 text-sm text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {error.message}
                </p>
              )}

              <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Not sure? Press <kbd className="rounded border border-slate-900/10 bg-white px-1 font-mono text-[11px] dark:border-white/10 dark:bg-white/5">Win</kbd> +{' '}
                  <kbd className="rounded border border-slate-900/10 bg-white px-1 font-mono text-[11px] dark:border-white/10 dark:bg-white/5">R</kbd>, type{' '}
                  <span className="font-mono">dxdiag</span>, press Enter.
                </p>
                <button
                  type="button"
                  onClick={check}
                  disabled={!ready}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_-12px_rgba(15,23,42,0.6)] transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking
                    </>
                  ) : (
                    <>
                      Check my PC <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </div>

              {/* Result */}
              {result && (
                <div ref={resultRef} className="mt-8 scroll-mt-24 border-t border-slate-900/[0.06] pt-7 dark:border-white/[0.06]">
                  <p className={eyebrow}>
                    <span className="mr-2 font-mono">03</span>Result
                  </p>

                  <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <ScoreRing score={result.performance.score} tone={tone} />
                    <div className="min-w-0">
                      <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {result.canRun
                          ? result.performance.score >= 80
                            ? 'Yes, comfortably'
                            : 'Yes, with lower settings'
                          : 'Not at minimum spec'}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                        {result.canRun
                          ? `Expect roughly ${result.performance.fps_estimate.toLowerCase()}. Suggested preset: ${result.performance.settings}.`
                          : 'At least one part is below what the publisher lists as the minimum. The rows below show which one.'}
                      </p>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Estimate from relative hardware performance against the published minimum. Not a benchmark.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 divide-y divide-slate-900/[0.06] overflow-hidden rounded-2xl border border-slate-900/[0.06] dark:divide-white/[0.06] dark:border-white/[0.06]">
                    {(
                      [
                        ['Graphics', result.performance.gpu, result.compared.gpu.yours, result.compared.gpu.required],
                        ['Processor', result.performance.cpu, result.compared.cpu.yours, result.compared.cpu.required],
                        ['Memory', result.performance.ram, `${result.compared.ram.yours} GB`, `${result.compared.ram.required} GB`],
                        [
                          'Storage',
                          result.performance.storage,
                          `${result.compared.storage.yours} GB free`,
                          result.compared.storage.required ? `${result.compared.storage.required} GB` : 'Not listed',
                        ],
                      ] as [string, Status, string, string][]
                    ).map(([label, status, yours, needs]) => (
                      <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 bg-white/60 px-4 py-3.5 dark:bg-white/[0.02] sm:grid-cols-[7rem_1fr_1fr_auto]">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{label}</span>
                        <span className="order-3 col-span-2 min-w-0 truncate font-mono text-[12.5px] text-slate-700 dark:text-slate-300 sm:order-none sm:col-span-1">
                          <span className="mr-1.5 font-sans text-[11px] text-slate-400">You</span>
                          {yours}
                        </span>
                        <span className="order-4 col-span-2 min-w-0 truncate font-mono text-[12.5px] text-slate-500 dark:text-slate-400 sm:order-none sm:col-span-1">
                          <span className="mr-1.5 font-sans text-[11px] text-slate-400">Min</span>
                          {needs}
                        </span>
                        <span className="justify-self-end">
                          <StatusPill status={status} />
                        </span>
                      </div>
                    ))}
                  </div>

                  {result.upgrades.length > 0 && (
                    <div className="mt-5 rounded-2xl bg-slate-900/[0.03] p-4 dark:bg-white/[0.03]">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">What to change first</p>
                      <ul className="mt-2 space-y-1.5">
                        {result.upgrades.map((u) => (
                          <li key={u} className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                            {u}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.note && (
                    <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Publisher note: </span>
                      {result.note}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[22rem] flex-col">
      <p className={eyebrow}>How it works</p>
      <h3 className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Pick a game on the left, then tell us what is inside your PC.
      </h3>
      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['01', 'Choose a game', 'Every title uses the specs its publisher released, with the source on its page.'],
          ['02', 'Add your parts', 'Processor, graphics card, memory and free space. Only real models are accepted.'],
          ['03', 'Read the verdict', 'A score out of 100, a likely preset, and the part that holds you back.'],
        ].map(([n, t, d]) => (
          <li key={n} className="rounded-2xl border border-slate-900/[0.06] bg-white/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <span className="font-mono text-xs text-slate-400">{n}</span>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{t}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
        Finding your specs on Windows: press Win + R, type <span className="font-mono">dxdiag</span> and press Enter.
        Processor and memory are on the first tab, your graphics card is on the Display tab.
      </p>
    </div>
  );
}

function UnannouncedPanel({ game, onPickAlternative }: { game: Game; onPickAlternative: () => void }) {
  const short = game.searchName || game.name;
  return (
    <div className="flex h-full min-h-[22rem] flex-col">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-300">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
        No PC version announced
      </span>
      <h3 className="mt-4 max-w-lg text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        There is nothing to test {short} against yet.
      </h3>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {game.developer} lists {game.name} for {game.platforms.join(' and ')} on {game.releaseDate}, and has published no PC
        requirements. Any score for it would be invented. The closest real target is Rockstar&rsquo;s current PC release,
        Grand Theft Auto V Enhanced, which needs an SSD even at minimum.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPickAlternative}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
        >
          Check against GTA V Enhanced <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <a
          href={`/tools/can-you-run-it/${game.id}`}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-900/10 px-5 text-sm font-medium text-slate-800 transition hover:bg-slate-900/[0.04] dark:border-white/15 dark:text-slate-200 dark:hover:bg-white/[0.05]"
        >
          What is confirmed about {short} <ChevronDown className="h-4 w-4 -rotate-90" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
