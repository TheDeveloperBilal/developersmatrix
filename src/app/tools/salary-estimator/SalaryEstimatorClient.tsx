'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, ChevronDown, Link2, Plus, Search, X } from 'lucide-react';
import { DEFAULT_JOB, JOB_BY_CODE, JOB_GROUPS, JOBS, US_AREA, type TitleHint } from '@/lib/salary/jobs';
import { DATA_PERIOD, DATA_RELEASED, NATIONAL } from '@/lib/salary/national';
import {
  PERCENTILE_LABELS,
  PERIOD_DIVISOR,
  PERIOD_WORD,
  areaName,
  blsProfileUrl,
  fullRange,
  hasMedian,
  money,
  ordinal,
  placeAmount,
  scaleFor,
  searchAreas,
  searchJobs,
  type Area,
  type JobFile,
  type Period,
  type WageRow,
} from '@/lib/salary/pay';

const MAX_PLACES = 4;
const AREA_TYPE_LABEL: Record<number, string> = { 1: 'Country', 2: 'State', 3: 'Territory', 4: 'Metro area', 6: 'Nonmetro area' };
const RELEASED_LABEL = new Date(`${DATA_RELEASED}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

type Sheet = null | 'job' | 'area' | 'compare';

// "Software QA analysts" becomes "software QA analysts" inside a sentence.
function lowerFirst(s: string) {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function nationalRow(code: string): WageRow | undefined {
  const n = NATIONAL[code];
  return n ? [...n.p, n.mean, n.emp] : undefined;
}

function tickLabel(v: number, period: Period) {
  if (period === 'hour') return `$${Math.round(v)}`;
  return v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`;
}

/* ------------------------------------------------------------------ */
/* Pay ruler                                                           */
/* ------------------------------------------------------------------ */

type Scale = ReturnType<typeof scaleFor>;

function Ruler({ p, scale, period, mark, size = 'lg', label }: {
  p: [number, number, number, number, number];
  scale: Scale;
  period: Period;
  mark?: number | null;
  size?: 'lg' | 'sm';
  label: string;
}) {
  const d = PERIOD_DIVISOR[period];
  const x = (v: number) => `${Math.min(100, Math.max(0, scale.pos(v / d)))}%`;
  const lg = size === 'lg';
  return (
    <div role="img" aria-label={label} className={`relative ${lg ? 'h-16' : 'h-7'}`}>
      {/* Faint guide line for each tick */}
      {scale.ticks.map((t) => (
        <span key={t} aria-hidden="true" className="absolute inset-y-0 w-px bg-zinc-200/80 dark:bg-zinc-800" style={{ left: `${scale.pos(t)}%` }} />
      ))}
      {/* 10th to 90th */}
      <span aria-hidden="true" className={`absolute top-1/2 h-[2px] -translate-y-1/2 bg-zinc-400 dark:bg-zinc-500`} style={{ left: x(p[0]), right: `calc(100% - ${x(p[4])})` }} />
      {[p[0], p[4]].map((v, i) => (
        <span key={i} aria-hidden="true" className={`absolute top-1/2 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-zinc-400 dark:bg-zinc-500 ${lg ? 'h-5' : 'h-3'}`} style={{ left: x(v) }} />
      ))}
      {/* 25th to 75th */}
      <span aria-hidden="true" className={`absolute top-1/2 -translate-y-1/2 rounded-md border border-teal-600/70 bg-teal-500/20 dark:border-teal-400/60 dark:bg-teal-400/15 ${lg ? 'h-8' : 'h-4'}`} style={{ left: x(p[1]), right: `calc(100% - ${x(p[3])})` }} />
      {/* Median */}
      <span aria-hidden="true" className={`absolute top-1/2 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900 dark:bg-white ${lg ? 'h-12' : 'h-6'}`} style={{ left: x(p[2]) }} />
      {/* The number the visitor typed */}
      {mark != null && mark > 0 && (
        <span aria-hidden="true" className="absolute inset-y-0 -translate-x-1/2" style={{ left: x(mark) }}>
          <span className="absolute inset-y-0 left-1/2 w-0 -translate-x-1/2 border-l-2 border-dashed border-amber-500" />
          {lg && <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-amber-500" />}
        </span>
      )}
    </div>
  );
}

function Axis({ scale, period }: { scale: Scale; period: Period }) {
  return (
    <div aria-hidden="true" className="relative h-5 font-mono text-[10.5px] text-zinc-400 dark:text-zinc-500">
      {scale.ticks.map((t, i) => (
        <span
          key={t}
          className={`absolute top-0 whitespace-nowrap ${i === 0 ? '' : i === scale.ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'} ${i % 2 === 1 ? 'max-sm:hidden' : ''}`}
          style={{ left: `${scale.pos(t)}%` }}
        >
          {tickLabel(t, period)}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Picker sheet                                                        */
/* ------------------------------------------------------------------ */

function PickerSheet({ title, onClose, children, query, setQuery, placeholder }: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tawk = (window as unknown as { Tawk_API?: { hideWidget?: () => void; showWidget?: () => void } }).Tawk_API;
    try { tawk?.hideWidget?.(); } catch { /* chat widget not ready */ }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
      try { tawk?.showWidget?.(); } catch { /* ignore */ }
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-start sm:p-6 sm:pt-[10vh]">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[1px]" />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-xl sm:rounded-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="font-semibold text-zinc-900 dark:text-white">{title}</p>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <div className="border-b border-zinc-200 p-3 dark:border-zinc-800">
          <label className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 dark:border-zinc-700 dark:bg-zinc-900">
            <Search className="h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
            <span className="sr-only">{placeholder}</span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="h-11 w-full min-w-0 bg-transparent text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Clear</button>
            )}
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">{children}</div>
      </div>
    </div>
  );
}

function JobButton({ code, active, onPick, showBlurb = true }: { code: string; active: boolean; onPick: (c: string) => void; showBlurb?: boolean }) {
  const job = JOB_BY_CODE[code];
  const n = NATIONAL[code];
  return (
    <button
      type="button"
      onClick={() => onPick(code)}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${active ? 'bg-teal-50 dark:bg-teal-500/10' : 'hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-white">
          {job.name}
          {active && <Check className="h-4 w-4 text-teal-600" aria-hidden="true" />}
        </span>
        {showBlurb && <span className="mt-0.5 block text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">{job.blurb}</span>}
      </span>
      {n && (
        <span className="shrink-0 text-right">
          <span className="block font-mono text-[13px] tabular-nums text-zinc-700 dark:text-zinc-300">{money(n.p[2], 'year')}</span>
          <span className="block text-[11px] text-zinc-400">US median</span>
        </span>
      )}
    </button>
  );
}

function HintCard({ hint, current, onPick }: { hint: TitleHint; current: string; onPick: (c: string) => void }) {
  return (
    <div className="m-1 rounded-xl border border-amber-200 bg-amber-50/70 p-3 dark:border-amber-500/30 dark:bg-amber-500/10">
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">{hint.title}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
        {hint.note ?? 'BLS does not track this title as its own job. These are the closest official categories. Pick the one that matches your daily work.'}
      </p>
      <div className="mt-2 space-y-0.5">
        {hint.codes.map((c) => <JobButton key={c} code={c} active={c === current} onPick={onPick} showBlurb={false} />)}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main tool                                                           */
/* ------------------------------------------------------------------ */

export default function SalaryEstimatorClient() {
  const [job, setJob] = useState(DEFAULT_JOB);
  const [area, setArea] = useState(US_AREA);
  const [compare, setCompare] = useState<string[]>([]);
  const [period, setPeriod] = useState<Period>('year');
  const [offer, setOffer] = useState('');
  const [sheet, setSheet] = useState<Sheet>(null);
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<Record<string, JobFile>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [areas, setAreas] = useState<Area[] | null>(null);
  const [topMode, setTopMode] = useState<'pay' | 'jobs'>('pay');
  const [copied, setCopied] = useState(false);
  const ready = useRef(false);

  // Read a shared link once, after the first render.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const j = q.get('job');
    if (j && JOB_BY_CODE[j]) setJob(j);
    const a = q.get('area');
    if (a && /^\d{2,7}$/.test(a)) setArea(a);
    const vs = (q.get('vs') || '').split(',').filter((v) => /^\d{2,7}$/.test(v)).slice(0, MAX_PLACES - 1);
    if (vs.length) setCompare(vs);
    const per = q.get('per');
    if (per === 'month' || per === 'hour') setPeriod(per);
    ready.current = true;
  }, []);

  // Keep the address bar in step so the page can be shared or refreshed.
  useEffect(() => {
    if (!ready.current) return;
    const q = new URLSearchParams();
    if (job !== DEFAULT_JOB) q.set('job', job);
    if (area !== US_AREA) q.set('area', area);
    const vs = compare.filter((c) => c !== area);
    if (vs.length) q.set('vs', vs.join(','));
    if (period !== 'year') q.set('per', period);
    const s = q.toString().replace(/%2C/g, ',');
    window.history.replaceState(null, '', `${window.location.pathname}${s ? `?${s}` : ''}${window.location.hash}`);
  }, [job, area, compare, period]);

  useEffect(() => {
    let alive = true;
    fetch('/data/salary/areas.json')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { areas: Area[] }) => { if (alive) setAreas(d.areas); })
      .catch(() => { if (alive) setAreas([]); });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (files[job] || failed[job]) return;
    let alive = true;
    fetch(`/data/salary/${job}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: JobFile) => { if (alive) setFiles((f) => ({ ...f, [job]: d })); })
      .catch(() => { if (alive) setFailed((f) => ({ ...f, [job]: true })); });
    return () => { alive = false; };
  }, [job, files, failed]);

  const file = files[job];
  const loading = !file && !failed[job];
  const areaMap = useMemo(() => new Map((areas ?? []).map((a) => [a[0], a])), [areas]);
  const jobInfo = JOB_BY_CODE[job];

  const rowFor = useCallback(
    (code: string): WageRow | undefined => (code === US_AREA && !file ? nationalRow(job) : file?.w[code]),
    [file, job],
  );
  const nameOf = (code: string) => (code === US_AREA ? 'United States' : areaName(areaMap.get(code)?.[1] ?? 'this area'));

  const row = rowFor(area);
  const range = fullRange(row);
  const d = PERIOD_DIVISOR[period];
  const offerNum = Number(offer.replace(/[^0-9.]/g, ''));
  const offerAnnual = offer && offerNum > 0 ? offerNum * d : null;

  const mainScale = useMemo(() => {
    if (!range) return null;
    const vals: number[] = [...range];
    // Stretch the ruler for a typed number only when it is near the range,
    // otherwise the marker sits pinned at the edge.
    if (offerAnnual && offerAnnual >= range[0] * 0.6 && offerAnnual <= range[4] * 1.5) vals.push(offerAnnual);
    return scaleFor(vals.map((v) => v / d));
  }, [range, offerAnnual, d]);

  const places = [area, ...compare.filter((c) => c !== area)].slice(0, MAX_PLACES);
  const placeRanges = places.map((c) => ({ code: c, p: fullRange(rowFor(c)), row: rowFor(c) }));
  const compareScale = useMemo(() => {
    const vals = placeRanges.flatMap((r) => (r.p ? [...r.p] : []));
    return vals.length ? scaleFor(vals.map((v) => v / d)) : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(placeRanges.map((r) => r.p)), d]);

  const localAreas = useMemo(() => {
    if (!file || !areas) return [];
    return areas
      .filter((a) => (a[2] === 4 || a[2] === 6) && hasMedian(file.w[a[0]]))
      .map((a) => ({ a, row: file.w[a[0]] }));
  }, [file, areas]);

  const topList = useMemo(() => {
    const list = [...localAreas];
    if (topMode === 'pay') list.sort((x, y) => (y.row[2] ?? 0) - (x.row[2] ?? 0));
    else list.sort((x, y) => (y.row[6] ?? 0) - (x.row[6] ?? 0));
    return list.slice(0, 8);
  }, [localAreas, topMode]);

  const suggestions = useMemo(
    () => [...localAreas].sort((x, y) => (y.row[6] ?? 0) - (x.row[6] ?? 0)).map((x) => x.a[0]).filter((c) => !places.includes(c)).slice(0, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [localAreas, places.join(',')],
  );

  const closeSheet = useCallback(() => { setSheet(null); setQuery(''); }, []);
  const pickJob = (c: string) => { setJob(c); closeSheet(); };
  const pickArea = (c: string) => {
    if (sheet === 'compare') setCompare((prev) => (prev.includes(c) || c === area ? prev : [...prev, c].slice(0, MAX_PLACES - 1)));
    else { setArea(c); setCompare((prev) => prev.filter((x) => x !== c)); }
    closeSheet();
  };

  // Keep a typed amount meaning the same pay when switching year, month or hour.
  const changePeriod = (next: Period) => {
    if (next === period) return;
    const n = Number(offer.replace(/[^0-9.]/g, ''));
    if (offer && n > 0) {
      const v = (n * PERIOD_DIVISOR[period]) / PERIOD_DIVISOR[next];
      setOffer(next === 'hour' ? v.toFixed(2) : Math.round(v).toLocaleString('en-US'));
    }
    setPeriod(next);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked */ }
  };

  const placement = range && offerAnnual ? placeAmount(offerAnnual, range) : null;
  const jobName = jobInfo.name;
  const jobLower = lowerFirst(jobName);
  const placeName = area === US_AREA ? 'the United States' : nameOf(area);

  /* ---------------- render helpers ---------------- */

  const jobResults = searchJobs(query);
  const areaResults = areas ? searchAreas(areas, query) : [];

  const jobSheet = (
    <PickerSheet title="Choose a job" onClose={closeSheet} query={query} setQuery={setQuery} placeholder="Search a job title, for example DevOps or SEO">
      {query ? (
        <>
          {jobResults.hints.map((h) => <HintCard key={h.title} hint={h} current={job} onPick={pickJob} />)}
          {jobResults.jobs.map((j) => <JobButton key={j.code} code={j.code} active={j.code === job} onPick={pickJob} />)}
          {jobResults.jobs.length === 0 && jobResults.hints.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">
              No match for &ldquo;{query}&rdquo;. Try a broader title, such as developer, analyst or designer.
            </p>
          )}
        </>
      ) : (
        JOB_GROUPS.map((g) => (
          <div key={g} className="mb-2">
            <p className="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">{g}</p>
            {JOBS.filter((j) => j.group === g).map((j) => <JobButton key={j.code} code={j.code} active={j.code === job} onPick={pickJob} />)}
          </div>
        ))
      )}
    </PickerSheet>
  );

  const areaSheet = (
    <PickerSheet
      title={sheet === 'compare' ? 'Add a place to compare' : 'Choose a place'}
      onClose={closeSheet}
      query={query}
      setQuery={setQuery}
      placeholder="Search a city, metro area or state"
    >
      {!areas ? (
        <p className="px-3 py-6 text-center text-sm text-zinc-500">Loading places…</p>
      ) : areas.length === 0 ? (
        <p className="px-3 py-6 text-center text-sm text-zinc-500">Places could not be loaded. Check your connection and try again.</p>
      ) : (
        <>
          {!query && (
            <p className="px-3 pb-2 pt-1 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Type a city name, such as Austin or Denver, to find the metro area it belongs to. BLS reports pay by metro area, not by single city.
            </p>
          )}
          <ul>
            {areaResults.map((a) => {
              const r = file?.w[a[0]];
              const ok = a[0] === US_AREA || hasMedian(r);
              const taken = sheet === 'compare' && places.includes(a[0]);
              const disabled = !!file && (!ok || taken);
              return (
                <li key={a[0]}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => pickArea(a[0])}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent dark:hover:bg-zinc-900"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-zinc-900 dark:text-white">{areaName(a[1])}</span>
                      <span className="block text-[12px] text-zinc-500">
                        {AREA_TYPE_LABEL[a[2]]}
                        {taken ? ' · already added' : file && !ok ? ' · no estimate for this job' : ''}
                      </span>
                    </span>
                    {file && ok && r && (
                      <span className="shrink-0 font-mono text-[13px] tabular-nums text-zinc-600 dark:text-zinc-300">{money(r[2], period)}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {query && areaResults.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-zinc-500">No place matches &ldquo;{query}&rdquo;. Try the state name instead.</p>
          )}
        </>
      )}
    </PickerSheet>
  );

  const triggerClass =
    'group inline-flex max-w-full items-baseline gap-1 rounded-md border-b-2 border-dashed border-teal-600/70 px-0.5 text-left text-teal-800 transition-colors hover:border-teal-700 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600/40 dark:text-teal-300 dark:hover:bg-teal-500/10';

  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Question */}
      <div className="border-b border-zinc-200 bg-[linear-gradient(to_right,rgba(13,148,136,0.07)_1px,transparent_1px)] bg-[size:24px_100%] px-4 py-6 dark:border-zinc-800 sm:px-8 sm:py-8">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
          Official BLS wage data · {DATA_PERIOD}
        </p>
        <p className="mt-3 text-balance text-2xl font-semibold leading-snug tracking-tight text-zinc-900 dark:text-white sm:text-[2rem] sm:leading-tight">
          Pay for{' '}
          <button type="button" className={triggerClass} onClick={() => setSheet('job')} aria-label={`Job: ${jobName}. Change job`}>
            <span>{jobLower}</span>
            <ChevronDown className="h-5 w-5 shrink-0 self-center opacity-60 group-hover:opacity-100" aria-hidden="true" />
          </button>{' '}
          in{' '}
          <button type="button" className={triggerClass} onClick={() => setSheet('area')} aria-label={`Place: ${placeName}. Change place`}>
            <span>{placeName}</span>
            <ChevronDown className="h-5 w-5 shrink-0 self-center opacity-60 group-hover:opacity-100" aria-hidden="true" />
          </button>
        </p>
      </div>

      {/* Result */}
      <section aria-live="polite" className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-500">Median pay</p>
            <p className="mt-1 font-mono text-4xl font-semibold tabular-nums tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              {range || (row && row[2] !== null) ? money(row![2], period) : loading ? '…' : 'Not published'}
              {(range || (row && row[2] !== null)) && <span className="ml-2 font-sans text-base font-normal tracking-normal text-zinc-500">{PERIOD_WORD[period]}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div role="radiogroup" aria-label="Show pay per" className="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              {(['year', 'month', 'hour'] as Period[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={period === p}
                  onClick={() => changePeriod(p)}
                  className={`rounded-lg px-3 py-1.5 font-medium capitalize transition-colors ${period === p ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              {copied ? <Check className="h-4 w-4 text-teal-600" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
              <span className="max-[400px]:sr-only">{copied ? 'Copied' : 'Copy link'}</span>
            </button>
          </div>
        </div>

        {range && mainScale ? (
          <>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Half of {jobLower} in {placeName} earn more than this and half earn less.
              {row?.[5] != null && row[5] > 0 && (
                <> The average is {money(row[5], period)}{row[2] !== null && row[5] > row[2] ? ', pulled up by the highest earners' : ''}.</>
              )}
              {row?.[6] != null && <> BLS counts about {row[6].toLocaleString('en-US')} of these jobs here.</>}
            </p>

            <div className="mt-8">
              <Ruler
                p={range}
                scale={mainScale}
                period={period}
                mark={offerAnnual}
                label={`Pay range for ${jobName} in ${placeName}: 10th percentile ${money(range[0], period)}, 25th ${money(range[1], period)}, median ${money(range[2], period)}, 75th ${money(range[3], period)}, 90th ${money(range[4], period)}.`}
              />
              <Axis scale={mainScale} period={period} />
            </div>

            <dl className="mt-4 grid grid-cols-1 divide-y divide-zinc-100 rounded-2xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
              {range.map((v, i) => (
                <div key={i} className={`flex items-baseline justify-between gap-3 px-4 py-2.5 sm:block sm:py-3 ${i === 2 ? 'bg-zinc-50 dark:bg-zinc-900/60' : ''}`}>
                  <dt className={`text-[13px] ${i === 2 ? 'font-semibold text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>
                    {PERCENTILE_LABELS[i]}
                    {i !== 2 && ' percentile'}
                  </dt>
                  <dd className={`font-mono tabular-nums text-zinc-900 dark:text-white sm:mt-1 ${i === 2 ? 'text-base font-semibold' : 'text-[15px]'}`}>{money(v, period)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-3 w-5 rounded-[3px] border border-teal-600/70 bg-teal-500/20" aria-hidden="true" /> Middle half of earners</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-[2px] w-5 bg-zinc-400" aria-hidden="true" /> 10th to 90th percentile</span>
              {offerAnnual && <span className="inline-flex items-center gap-1.5"><span className="h-3 w-0 border-l-2 border-dashed border-amber-500" aria-hidden="true" /> Your number</span>}
            </p>
          </>
        ) : !loading ? (
          <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-5 text-sm leading-relaxed text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
            {failed[job] ? (
              <>The pay data could not be loaded. Check your connection and refresh the page.</>
            ) : (
              <>
                BLS did not publish a full pay range for {jobLower} in {placeName}. It only publishes estimates when enough employers in an area report the job.{' '}
                <button type="button" onClick={() => setArea(US_AREA)} className="font-semibold text-teal-700 underline underline-offset-4 dark:text-teal-400">See the whole US</button>{' '}
                or pick a larger area.
              </>
            )}
          </div>
        ) : (
          <div className="mt-8 h-24 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
        )}
      </section>

      {/* Check a number */}
      {range && (
        <section className="border-t border-zinc-200 px-4 py-6 dark:border-zinc-800 sm:px-8" aria-labelledby="se-offer">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-center lg:gap-8">
            <div>
              <h3 id="se-offer" className="font-semibold text-zinc-900 dark:text-white">Check an offer or your pay</h3>
              <label className="mt-2 flex h-12 items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 dark:border-zinc-700 dark:bg-zinc-900">
                <span className="font-mono text-zinc-400">$</span>
                <span className="sr-only">Amount {PERIOD_WORD[period]}</span>
                <input
                  inputMode="decimal"
                  value={offer}
                  onChange={(e) => setOffer(e.target.value.replace(/[^0-9.,]/g, ''))}
                  placeholder={period === 'hour' ? '55.00' : period === 'month' ? '9,500' : '120,000'}
                  className="h-full w-full min-w-0 bg-transparent font-mono text-lg tabular-nums text-zinc-900 outline-none placeholder:text-zinc-300 dark:text-white dark:placeholder:text-zinc-600"
                />
                <span className="shrink-0 text-sm text-zinc-500">{PERIOD_WORD[period]}</span>
              </label>
            </div>
            <p className="text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              {!placement ? (
                <>Type a salary to see roughly where it falls among {jobLower} in {placeName}. It shows up on the ruler as a dashed amber line.</>
              ) : placement.kind === 'below' ? (
                <><strong className="text-zinc-900 dark:text-white">{money(offerAnnual, period)} {PERIOD_WORD[period]}</strong> is below the 10th percentile. At least 9 in 10 {jobLower} in {placeName} earn more.</>
              ) : placement.kind === 'above' ? (
                <><strong className="text-zinc-900 dark:text-white">{money(offerAnnual, period)} {PERIOD_WORD[period]}</strong> is above the 90th percentile. Fewer than 1 in 10 {jobLower} in {placeName} earn more.</>
              ) : (
                <>
                  <strong className="text-zinc-900 dark:text-white">{money(offerAnnual, period)} {PERIOD_WORD[period]}</strong> is about the{' '}
                  <strong className="text-zinc-900 dark:text-white">{placement.percentile === 50 ? 'median' : `${ordinal(placement.percentile)} percentile`}</strong>.
                  Roughly {placement.percentile} in 100 {jobLower} in {placeName} earn less, and {100 - placement.percentile} earn more.
                  <span className="mt-1 block text-[13px] text-zinc-500">This is an estimate drawn between the five published percentiles, so treat it as a guide, not an exact rank.</span>
                </>
              )}
            </p>
          </div>
        </section>
      )}

      {/* Compare places */}
      <section className="border-t border-zinc-200 px-4 py-6 dark:border-zinc-800 sm:px-8" aria-labelledby="se-compare">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="se-compare" className="font-semibold text-zinc-900 dark:text-white">Compare places</h3>
          <p className="text-[13px] text-zinc-500">Same job, same scale. Pay is not adjusted for cost of living.</p>
        </div>

        {compareScale && (
          <div className="mt-4">
            <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-[minmax(0,200px)_1fr_88px]">
              <span className="hidden sm:block" />
              <Axis scale={compareScale} period={period} />
              <span className="hidden sm:block" />
            </div>
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {placeRanges.map((r, i) => {
                const base = placeRanges[0].row?.[2];
                const med = r.row?.[2] ?? null;
                const diff = i > 0 && base && med ? Math.round(((med - base) / base) * 100) : null;
                return (
                  <li key={r.code} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 py-3 sm:grid-cols-[minmax(0,200px)_1fr_88px]">
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-zinc-900 dark:text-white">
                        <span className="truncate" title={nameOf(r.code)}>{nameOf(r.code)}</span>
                        {i > 0 && (
                          <button type="button" onClick={() => setCompare((prev) => prev.filter((c) => c !== r.code))} className="shrink-0 rounded p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white">
                            <X className="h-3.5 w-3.5" aria-hidden="true" />
                            <span className="sr-only">Remove {nameOf(r.code)}</span>
                          </button>
                        )}
                      </p>
                      <p className="text-[12px] text-zinc-500">{i === 0 ? 'Your selection' : diff === null ? '' : diff === 0 ? 'Same median' : `Median ${Math.abs(diff)}% ${diff > 0 ? 'higher' : 'lower'}`}</p>
                    </div>
                    <p className="text-right font-mono text-sm tabular-nums text-zinc-900 dark:text-white sm:order-last">{med !== null ? money(med, period) : 'Not published'}</p>
                    <div className="col-span-2 sm:col-span-1">
                      {r.p ? (
                        <Ruler p={r.p} scale={compareScale} period={period} size="sm" label={`${nameOf(r.code)}: median ${money(r.p[2], period)}, middle half ${money(r.p[1], period)} to ${money(r.p[3], period)}.`} />
                      ) : (
                        <p className="text-[12px] text-zinc-500">BLS did not publish a full range here.</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {places.length < MAX_PLACES && (
            <button
              type="button"
              onClick={() => setSheet('compare')}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-zinc-900 px-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Add a place
            </button>
          )}
          {places.length < MAX_PLACES && areas && suggestions.length > 0 && (
            <>
              <span className="text-[12px] text-zinc-500">Most jobs:</span>
              {suggestions.slice(0, MAX_PLACES - places.length).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCompare((prev) => [...prev, c].slice(0, MAX_PLACES - 1))}
                  className="inline-flex h-9 max-w-full items-center gap-1 truncate rounded-xl border border-zinc-200 px-3 text-sm text-zinc-700 transition-colors hover:border-teal-600 hover:text-teal-800 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-teal-500 dark:hover:text-teal-300"
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{nameOf(c)}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Top areas and how to read */}
      <div className="grid border-t border-zinc-200 dark:border-zinc-800 lg:grid-cols-[1.15fr_1fr]">
        <section className="px-4 py-6 sm:px-8" aria-labelledby="se-top">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 id="se-top" className="font-semibold text-zinc-900 dark:text-white">Where {jobLower} {topMode === 'pay' ? 'earn the most' : 'work most'}</h3>
            <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 text-[13px] dark:border-zinc-800" role="radiogroup" aria-label="Sort areas by">
              {([['pay', 'Highest pay'], ['jobs', 'Most jobs']] as const).map(([k, l]) => (
                <button key={k} type="button" role="radio" aria-checked={topMode === k} onClick={() => setTopMode(k)} className={`rounded-md px-2.5 py-1 font-medium ${topMode === k ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {topList.length ? (
            <ol className="mt-3">
              {topList.map(({ a, row: r }, i) => (
                <li key={a[0]}>
                  <button type="button" onClick={() => { setArea(a[0]); setCompare((prev) => prev.filter((x) => x !== a[0])); }} className="group grid w-full grid-cols-[1.5rem_1fr_auto] items-baseline gap-2 rounded-lg px-1.5 py-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900">
                    <span className="font-mono text-[12px] tabular-nums text-zinc-400">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="block text-sm text-zinc-800 sm:truncate group-hover:text-teal-800 dark:text-zinc-200 dark:group-hover:text-teal-300">{areaName(a[1])}</span>
                      {r[6] != null && <span className="block text-[11.5px] text-zinc-500">{r[6].toLocaleString('en-US')} jobs</span>}
                    </span>
                    <span className="font-mono text-sm tabular-nums text-zinc-900 dark:text-white">{money(r[2], period)}</span>
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-3 h-40 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" />
          )}
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500">Metro and nonmetro areas, by median pay. Figures for areas with few jobs can change more from one year to the next.</p>
        </section>

        <section className="border-t border-zinc-200 bg-zinc-50/60 px-4 py-6 dark:border-zinc-800 dark:bg-zinc-900/30 sm:px-8 lg:border-l lg:border-t-0" aria-labelledby="se-read">
          <h3 id="se-read" className="font-semibold text-zinc-900 dark:text-white">How to read these numbers</h3>
          <ul className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li><strong className="text-zinc-900 dark:text-white">Where you might sit.</strong> BLS does not record years of experience. As a rough guide, people new to a job are more often near the 10th to 25th percentile and people with many years in it near the 75th to 90th. Skills, employer and industry matter as much as time in the role.</li>
            <li><strong className="text-zinc-900 dark:text-white">What is included.</strong> Pay before tax: base pay plus commissions, tips and production bonuses where a job has them. Overtime pay, other bonuses and benefits are left out, and so is stock, so total pay at many tech companies is higher.</li>
            <li><strong className="text-zinc-900 dark:text-white">Who is counted.</strong> People on an employer&rsquo;s payroll. The self employed and owners of unincorporated businesses are not in the survey.</li>
            <li><strong className="text-zinc-900 dark:text-white">Month and hour.</strong> Monthly is the yearly figure divided by 12. Hourly is the yearly figure divided by 2,080 hours, the typical work year BLS uses.</li>
          </ul>
        </section>
      </div>

      {/* Source */}
      <div className="flex flex-col gap-2 border-t border-zinc-200 bg-zinc-50 px-4 py-4 text-[12.5px] leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics, {DATA_PERIOD} estimates, released {RELEASED_LABEL}. Official job title: {NATIONAL[job]?.title ?? jobName} (SOC {job}).
        </p>
        <a href={blsProfileUrl(job)} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 font-medium text-teal-700 hover:underline dark:text-teal-400">
          See it on bls.gov <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {sheet === 'job' && jobSheet}
      {(sheet === 'area' || sheet === 'compare') && areaSheet}
    </div>
  );
}
