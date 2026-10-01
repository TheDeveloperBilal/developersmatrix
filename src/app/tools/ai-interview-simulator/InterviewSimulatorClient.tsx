'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Lightbulb,
  Loader2,
  Mic,
  RotateCcw,
  SkipForward,
  Square,
  Timer,
  TriangleAlert,
  X,
} from 'lucide-react';
import { ROLES, LEVELS, categoryLabel, type Category, type Level, type RoleKey } from '@/lib/interview/bank-types';

/* ------------------------------------------------------------------ */
/* Types returned by /api/interview                                    */
/* ------------------------------------------------------------------ */

interface Question {
  id: string;
  text: string;
  hints: string[];
  category: Category;
  roundLabel: string;
  level: Level;
  targetWords: number;
}

type Tone = 'strong' | 'good' | 'partial' | 'weak';

interface Evaluation {
  status: 'scored' | 'rejected';
  reason?: string;
  title: string;
  message: string;
  score: number | null;
  tone: Tone | null;
  verdict: string | null;
  breakdown: { coverage: number; structure: number; specificity: number } | null;
  covered: string[];
  missed: string[];
  incorrect: string[];
  structure: { label: string; passed: boolean; tip: string }[];
  strengths: string[];
  improvements: string[];
  flags: string[];
  wordCount: number;
  targetWords: number;
  modelAnswer: string;
  hints: string[];
  next: string;
}

interface HistoryItem {
  id: string;
  text: string;
  round: string;
  level: Level;
  score: number | null;
  tone: Tone | null;
}

/* ------------------------------------------------------------------ */
/* Shared surfaces, same recipe as the other tools                     */
/* ------------------------------------------------------------------ */

const glass =
  'rounded-3xl border border-white/70 bg-white/60 backdrop-blur-2xl ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_30px_80px_-40px_rgba(15,23,42,0.45)] ' +
  'dark:border-white/[0.08] dark:bg-slate-900/40 ' +
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_rgba(0,0,0,0.9)]';

const inset = 'rounded-2xl border border-slate-900/[0.06] bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.03]';

const eyebrow = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400';

const primaryBtn =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_-12px_rgba(15,23,42,0.6)] transition hover:bg-slate-800 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';

const secondaryBtn =
  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-900/10 px-4 text-sm font-medium text-slate-700 ' +
  'transition hover:bg-slate-900/[0.04] disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]';

const TONE: Record<Tone, { stroke: string; text: string; ring: string; dot: string }> = {
  strong: { stroke: '#10b981', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-500/25 bg-emerald-500/[0.08]', dot: 'bg-emerald-500' },
  good: { stroke: '#22c55e', text: 'text-emerald-700 dark:text-emerald-300', ring: 'ring-emerald-500/20 bg-emerald-500/[0.06]', dot: 'bg-emerald-400' },
  partial: { stroke: '#f59e0b', text: 'text-amber-700 dark:text-amber-300', ring: 'ring-amber-500/25 bg-amber-500/[0.08]', dot: 'bg-amber-500' },
  weak: { stroke: '#f43f5e', text: 'text-rose-700 dark:text-rose-300', ring: 'ring-rose-500/25 bg-rose-500/[0.08]', dot: 'bg-rose-500' },
};

function roundDescription(role: RoleKey, category: Category): string {
  if (category === 'behavioral') return 'Real situations from your past. Answer with a story.';
  if (category === 'technical') {
    if (role === 'product-manager') return 'Prioritising, metrics and product judgement.';
    if (role === 'engineering-manager') return 'People, delivery and team health.';
    if (role === 'data-analyst' || role === 'data-scientist') return 'Concepts you use with data every day.';
    return 'Core concepts and how you apply them.';
  }
  if (role === 'product-manager') return 'Work through an open product problem.';
  if (role === 'data-analyst') return 'Answer a business question with data.';
  if (role === 'data-scientist') return 'Design a machine learning system end to end.';
  if (role === 'engineering-manager') return 'Plan how a team is shaped and run.';
  return 'Design a system end to end, out loud.';
}

function countWords(text: string) {
  // Same rule as the checker: a word has at least one letter.
  return (text.match(/[A-Za-z0-9']+/g) || []).filter((t) => /[A-Za-z]/.test(t)).length;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/* Speech to text, where the browser supports it                       */
/* ------------------------------------------------------------------ */

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

function getRecognition(): Recognition | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function ScoreRing({ score, tone }: { score: number; tone: Tone }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(10, score)) / 10;
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-slate-900/[0.07] dark:stroke-white/[0.08]" />
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={TONE[tone].stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${c * pct} ${c}`}
          className="transition-[stroke-dasharray] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900 dark:text-white">{score.toFixed(1)}</span>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">out of 10</span>
      </div>
    </div>
  );
}

function Meter({ label, value, help }: { label: string; value: number; help: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</span>
        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-900/[0.07] dark:bg-white/[0.08]">
        <div className="h-full rounded-full bg-slate-900 transition-[width] duration-700 dark:bg-white" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{help}</p>
    </div>
  );
}

function ScorePill({ score, tone }: { score: number | null; tone: Tone | null }) {
  if (score === null || !tone) {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-slate-900/[0.05] px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-white/[0.06] dark:text-slate-400">
        Not scored
      </span>
    );
  }
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ring-1 ${TONE[tone].ring} ${TONE[tone].text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${TONE[tone].dot}`} aria-hidden="true" />
      {score.toFixed(1)}
    </span>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; title: string; sub?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-3 gap-1 rounded-xl bg-slate-900/[0.04] p-1 dark:bg-white/[0.04]">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={value === o.key}
          onClick={() => onChange(o.key)}
          className={[
            'rounded-lg px-1 py-2 text-center transition-colors',
            value === o.key
              ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ].join(' ')}
        >
          <span className="block text-sm font-medium">{o.title}</span>
          {o.sub && <span className="block text-[11px] opacity-70">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function InterviewSimulatorClient() {
  const [role, setRole] = useState<RoleKey>('software-developer');
  const [category, setCategory] = useState<Category>('behavioral');
  const [level, setLevel] = useState<Level>('mid');

  const [question, setQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<Evaluation | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<'question' | 'feedback' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [timing, setTiming] = useState(false);

  const [speechSupported, setSpeechSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<Recognition | null>(null);

  const stageRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSpeechSupported(!!getRecognition());
  }, []);

  useEffect(() => {
    if (!timing) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [timing]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const words = countWords(answer);
  const target = question?.targetWords ?? LEVELS.find((l) => l.key === level)!.targetWords;
  const roleLabel = ROLES.find((r) => r.key === role)!.label;

  const scored = history.filter((h) => h.score !== null);
  const average = scored.length ? scored.reduce((sum, h) => sum + (h.score ?? 0), 0) / scored.length : null;

  // Suggest a level change once there is enough signal. Only a suggestion:
  // the candidate decides.
  const suggestion = useMemo(() => {
    const recent = scored.filter((h) => h.level === level).slice(-3);
    if (recent.length < 3) return null;
    const avg = recent.reduce((s, h) => s + (h.score ?? 0), 0) / recent.length;
    if (avg >= 8.5 && level !== 'senior') return { to: level === 'entry' ? 'mid' : 'senior', text: 'Your last three answers were strong. Try the next level up.' } as const;
    if (avg < 5 && level !== 'entry') return { to: level === 'senior' ? 'mid' : 'entry', text: 'These are landing below 5. A level down may help you build the structure first.' } as const;
    return null;
  }, [scored, level]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setListening(false);
  }, []);

  const startListening = () => {
    const rec = getRecognition();
    if (!rec) return;
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      let text = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) text += e.results[i][0].transcript;
      }
      if (text.trim()) setAnswer((prev) => (prev.trim() ? `${prev.trim()} ${text.trim()}` : text.trim()));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    try {
      rec.start();
      setListening(true);
      setTiming(true);
    } catch {
      setListening(false);
    }
  };

  const loadQuestion = async () => {
    stopListening();
    setLoading('question');
    setError(null);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'question', role, category, level, exclude: history.map((h) => h.id).concat(question ? [question.id] : []) }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not load a question. Please try again.');
        return;
      }
      setQuestion(data.question as Question);
      setAnswer('');
      setResult(null);
      setShowHints(false);
      setShowModel(false);
      setSeconds(0);
      setTiming(true);
      requestAnimationFrame(() => {
        if (window.innerWidth < 1024) stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else textareaRef.current?.focus({ preventScroll: true });
      });
    } catch {
      setError('Could not reach the interview server. Check your connection and try again.');
    } finally {
      setLoading(null);
    }
  };

  const submit = async () => {
    if (!question || !answer.trim()) return;
    stopListening();
    setTiming(false);
    setLoading('feedback');
    setError(null);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'feedback', questionId: question.id, answer, level: question.level, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not check your answer. Please try again.');
        setTiming(true);
        return;
      }
      const r = data.result as Evaluation;
      setResult(r);
      setShowModel(false);
      if (r.status === 'scored') {
        setHistory((prev) => {
          const without = prev.filter((h) => h.id !== question.id);
          return [...without, { id: question.id, text: question.text, round: question.roundLabel, level: question.level, score: r.score, tone: r.tone }];
        });
      }
    } catch {
      setError('Could not reach the interview server. Check your connection and try again.');
      setTiming(true);
    } finally {
      setLoading(null);
    }
  };

  const retry = () => {
    setResult(null);
    setTiming(true);
    requestAnimationFrame(() => textareaRef.current?.focus());
  };

  const visibleHistory = showAllHistory ? [...history].reverse() : [...history].reverse().slice(0, 4);

  return (
    <div className={`${glass} p-2 sm:p-3`}>
      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        {/* ---------------- Setup ---------------- */}
        <section aria-labelledby="iv-setup" className={`${inset} flex min-w-0 flex-col p-4 sm:p-5`}>
          <h2 id="iv-setup" className="text-[15px] font-semibold text-slate-900 dark:text-white">
            <span className="mr-2 font-mono text-slate-400">01</span>Set up your interview
          </h2>

          <p className={`${eyebrow} mt-5`}>Role</p>
          <div role="radiogroup" aria-label="Role" className="mt-2 grid grid-cols-2 gap-1">
            {ROLES.map((r) => {
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setRole(r.key)}
                  className={[
                    'min-h-10 rounded-xl px-2.5 py-2 text-left text-[13px] font-medium leading-tight transition-colors',
                    active
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-700 hover:bg-slate-900/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  {r.label}
                </button>
              );
            })}
          </div>

          <p className={`${eyebrow} mt-6`}>Round</p>
          <div role="radiogroup" aria-label="Round" className="mt-2 space-y-1.5">
            {(['behavioral', 'technical', 'system'] as Category[]).map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setCategory(c)}
                  className={[
                    'flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors',
                    active
                      ? 'border-slate-900/20 bg-white shadow-sm dark:border-white/20 dark:bg-white/[0.08]'
                      : 'border-transparent hover:bg-slate-900/[0.04] dark:hover:bg-white/[0.04]',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border',
                      active ? 'border-slate-900 dark:border-white' : 'border-slate-300 dark:border-slate-600',
                    ].join(' ')}
                  >
                    {active && <span className="h-2 w-2 rounded-full bg-slate-900 dark:bg-white" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-slate-900 dark:text-white">{categoryLabel(role, c)}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{roundDescription(role, c)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className={`${eyebrow} mt-6`}>Level</p>
          <div className="mt-2">
            <Segmented
              label="Experience level"
              value={level}
              onChange={setLevel}
              options={LEVELS.map((l) => ({ key: l.key, title: l.label, sub: l.years }))}
            />
          </div>

          <button type="button" onClick={loadQuestion} disabled={loading !== null} className={`${primaryBtn} mt-6 w-full`}>
            {loading === 'question' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading
              </>
            ) : (
              <>
                {question ? 'New question' : 'Start interview'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
          {question && (
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">Changes to role, round or level apply to the next question.</p>
          )}

          {/* Session */}
          {history.length > 0 && (
            <div className="mt-6 border-t border-slate-900/[0.06] pt-5 dark:border-white/[0.06]">
              <div className="flex items-baseline justify-between">
                <p className={eyebrow}>This session</p>
                {average !== null && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Average <span className="font-semibold tabular-nums text-slate-900 dark:text-white">{average.toFixed(1)}</span>
                  </p>
                )}
              </div>
              <ul className="mt-3 space-y-1.5">
                {visibleHistory.map((h) => (
                  <li key={h.id} className="flex items-start gap-3 rounded-xl px-2 py-1.5">
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-[13px] leading-snug text-slate-700 dark:text-slate-300">{h.text}</span>
                      <span className="text-[11px] text-slate-400">
                        {h.round} · {LEVELS.find((l) => l.key === h.level)?.label}
                      </span>
                    </span>
                    <ScorePill score={h.score} tone={h.tone} />
                  </li>
                ))}
              </ul>
              {history.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowAllHistory((v) => !v)}
                  aria-expanded={showAllHistory}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-medium text-slate-600 hover:bg-slate-900/[0.04] dark:text-slate-400 dark:hover:bg-white/[0.04]"
                >
                  {showAllHistory ? 'Show fewer' : `Show all ${history.length}`}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllHistory ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              )}
              {suggestion && (
                <div className="mt-3 rounded-xl bg-slate-900/[0.04] p-3 text-xs text-slate-600 dark:bg-white/[0.04] dark:text-slate-300">
                  {suggestion.text}{' '}
                  <button
                    type="button"
                    onClick={() => setLevel(suggestion.to)}
                    className="font-semibold text-slate-900 underline underline-offset-2 dark:text-white"
                  >
                    Switch to {LEVELS.find((l) => l.key === suggestion.to)?.label}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ---------------- Interview stage ---------------- */}
        <section ref={stageRef} aria-live="polite" className={`${inset} min-w-0 scroll-mt-24 p-4 sm:p-6`}>
          {error && (
            <p className="mb-4 flex items-start gap-2 rounded-xl bg-rose-500/[0.07] px-3.5 py-3 text-sm text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {error}
            </p>
          )}

          {!question && <EmptyState roleLabel={roleLabel} />}

          {question && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={eyebrow}>
                  <span className="mr-2 font-mono">02</span>
                  {question.roundLabel} · {LEVELS.find((l) => l.key === question.level)?.label} · {roleLabel}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/[0.04] px-2.5 py-1 text-xs tabular-nums text-slate-600 dark:bg-white/[0.06] dark:text-slate-300"
                  aria-label={`Time on this question ${formatTime(seconds)}`}
                >
                  <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                  {formatTime(seconds)}
                </span>
              </div>

              <h3 className="mt-3 text-balance text-xl font-semibold leading-snug tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                {question.text}
              </h3>

              <button
                type="button"
                onClick={() => setShowHints((v) => !v)}
                aria-expanded={showHints}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg py-1 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                {showHints ? 'Hide hints' : 'Show hints'}
              </button>
              {showHints && (
                <ul className="mt-2 space-y-1.5 rounded-xl bg-slate-900/[0.03] p-3.5 text-sm text-slate-600 dark:bg-white/[0.03] dark:text-slate-300">
                  {question.hints.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}

              {/* Answer */}
              <div className="mt-5">
                <label htmlFor="iv-answer" className="sr-only">
                  Your answer
                </label>
                <div className="rounded-2xl border border-slate-900/10 bg-white/80 focus-within:border-slate-900/30 focus-within:ring-4 focus-within:ring-slate-900/5 dark:border-white/10 dark:bg-slate-950/40 dark:focus-within:border-white/25">
                  <textarea
                    id="iv-answer"
                    ref={textareaRef}
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (!timing && !result) setTiming(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        submit();
                      }
                    }}
                    readOnly={loading === 'feedback'}
                    rows={8}
                    placeholder="Answer as you would out loud in the interview. Full sentences work best."
                    className="block min-h-[12rem] w-full resize-y rounded-2xl bg-transparent px-4 py-3.5 text-[15px] leading-relaxed text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-900/[0.06] px-4 py-2.5 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 shrink-0 overflow-hidden rounded-full sm:w-24 bg-slate-900/[0.07] dark:bg-white/[0.08]" aria-hidden="true">
                        <div
                          className={`h-full rounded-full transition-[width] ${words >= target * 0.8 ? 'bg-emerald-500' : 'bg-slate-400'}`}
                          style={{ width: `${Math.min(100, (words / target) * 100)}%` }}
                        />
                      </div>
                      <span className="whitespace-nowrap text-xs tabular-nums text-slate-500 dark:text-slate-400">
                        {words} / ~{target} words
                      </span>
                    </div>
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={listening ? stopListening : startListening}
                        aria-pressed={listening}
                        className={[
                          'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors',
                          listening
                            ? 'bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/25 dark:text-rose-300'
                            : 'text-slate-600 hover:bg-slate-900/[0.05] dark:text-slate-300 dark:hover:bg-white/[0.06]',
                        ].join(' ')}
                      >
                        {listening ? <Square className="h-3.5 w-3.5" aria-hidden="true" /> : <Mic className="h-3.5 w-3.5" aria-hidden="true" />}
                        {listening ? 'Stop dictation' : 'Speak answer'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" onClick={loadQuestion} disabled={loading !== null} className={secondaryBtn}>
                  <SkipForward className="h-4 w-4" aria-hidden="true" /> Skip question
                </button>
                <div className="flex flex-col items-stretch gap-1 sm:items-end">
                  <button type="button" onClick={submit} disabled={!answer.trim() || loading !== null} className={primaryBtn}>
                    {loading === 'feedback' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Checking
                      </>
                    ) : (
                      <>
                        {result ? 'Check again' : 'Get feedback'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                  <span className="hidden text-center text-[11px] text-slate-400 sm:block">Ctrl + Enter</span>
                </div>
              </div>

              {/* Feedback */}
              {result && (
                <div ref={resultRef} className="mt-8 scroll-mt-24 border-t border-slate-900/[0.06] pt-7 dark:border-white/[0.06]">
                  <p className={eyebrow}>
                    <span className="mr-2 font-mono">03</span>Feedback
                  </p>
                  {result.status === 'rejected' ? (
                    <RejectedPanel result={result} onRetry={retry} showModel={showModel} setShowModel={setShowModel} />
                  ) : (
                    <ScoredPanel
                      result={result}
                      onRetry={retry}
                      onNext={loadQuestion}
                      showModel={showModel}
                      setShowModel={setShowModel}
                      busy={loading !== null}
                    />
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

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

function EmptyState({ roleLabel }: { roleLabel: string }) {
  return (
    <div className="flex h-full min-h-[22rem] flex-col">
      <p className={eyebrow}>How it works</p>
      <h3 className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        Practice the questions real interviewers ask, and see exactly what your answer is missing.
      </h3>
      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {[
          ['01', 'Pick a role and round', `You are set up as a ${roleLabel}. Change it on the left.`],
          ['02', 'Answer in full sentences', 'Type or speak, the way you would in the room.'],
          ['03', 'Read the feedback', 'Key points covered and missed, structure, and a model answer.'],
        ].map(([n, t, d]) => (
          <li key={n} className="rounded-2xl border border-slate-900/[0.06] bg-white/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <span className="font-mono text-xs text-slate-400">{n}</span>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{t}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        Every question has a rubric of the points a strong answer covers. Your answer is checked against that rubric, its
        structure and its detail. Answers that are random text, off topic or a copy of the question are not scored.
      </p>
    </div>
  );
}

function ModelAnswer({ text, open, setOpen }: { text: string; open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <div className="rounded-2xl border border-slate-900/[0.06] dark:border-white/[0.06]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white"
      >
        Model answer
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <p className="border-t border-slate-900/[0.06] px-4 py-3.5 text-sm leading-relaxed text-slate-700 dark:border-white/[0.06] dark:text-slate-300">
          {text}
        </p>
      )}
    </div>
  );
}

function RejectedPanel({
  result,
  onRetry,
  showModel,
  setShowModel,
}: {
  result: Evaluation;
  onRetry: () => void;
  showModel: boolean;
  setShowModel: (v: boolean) => void;
}) {
  return (
    <div className="mt-4">
      <div className="rounded-2xl bg-amber-500/[0.07] p-4 ring-1 ring-amber-500/20 sm:p-5">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{result.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{result.message}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">No score was given for this attempt.</p>
          </div>
        </div>
      </div>

      <p className={`${eyebrow} mt-6`}>What a good answer includes</p>
      <ul className="mt-2 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
        {result.hints.map((h) => (
          <li key={h} className="flex gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
            {h}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRetry} className={primaryBtn}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Edit my answer
        </button>
      </div>

      <div className="mt-6">
        <ModelAnswer text={result.modelAnswer} open={showModel} setOpen={setShowModel} />
      </div>
    </div>
  );
}

function ScoredPanel({
  result,
  onRetry,
  onNext,
  showModel,
  setShowModel,
  busy,
}: {
  result: Evaluation;
  onRetry: () => void;
  onNext: () => void;
  showModel: boolean;
  setShowModel: (v: boolean) => void;
  busy: boolean;
}) {
  const tone = result.tone ?? 'weak';
  const b = result.breakdown!;
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <ScoreRing score={result.score ?? 0} tone={tone} />
        <div className="min-w-0">
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{result.verdict}</h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{result.message}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {result.wordCount} words. This checks what you covered and how you structured it, not whether every sentence is true.
          </p>
        </div>
      </div>

      {result.incorrect.length > 0 && (
        <div className="mt-6 rounded-2xl bg-rose-500/[0.07] p-4 ring-1 ring-rose-500/20">
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
            <TriangleAlert className="h-4 w-4" aria-hidden="true" />
            This looks incorrect
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {result.incorrect.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 rounded-2xl border border-slate-900/[0.06] p-4 dark:border-white/[0.06] sm:grid-cols-3 sm:p-5">
        <Meter label="Key points" value={b.coverage} help="Ideas the question is looking for" />
        <Meter label="Structure" value={b.structure} help="Shape of a strong answer" />
        <Meter label="Detail" value={b.specificity} help="Length, numbers and specifics" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="min-w-0 rounded-2xl border border-slate-900/[0.06] p-4 dark:border-white/[0.06]">
          <p className={eyebrow}>Covered</p>
          {result.covered.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">None yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {result.covered.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="min-w-0 rounded-2xl border border-slate-900/[0.06] p-4 dark:border-white/[0.06]">
          <p className={eyebrow}>Missing</p>
          {result.missed.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Nothing important. Nice.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {result.missed.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-900/[0.06] p-4 dark:border-white/[0.06]">
        <p className={eyebrow}>Structure</p>
        <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {result.structure.map((s) => (
            <li key={s.label} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
              {s.passed ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 translate-x-[5px] rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
              )}
              <span className={s.passed ? '' : 'text-slate-500 dark:text-slate-400'}>
                <span className="sr-only">{s.passed ? 'Done: ' : 'Missing: '}</span>
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {result.improvements.length > 0 && (
        <div className="mt-6">
          <p className={eyebrow}>How to improve it</p>
          <ol className="mt-3 space-y-2.5">
            {result.improvements.map((t, i) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 font-mono text-xs text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                {t}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="mt-6">
        <ModelAnswer text={result.modelAnswer} open={showModel} setOpen={setShowModel} />
      </div>

      <div className="mt-3 rounded-2xl bg-slate-900/[0.03] p-4 dark:bg-white/[0.03]">
        <p className={eyebrow}>An interviewer might ask next</p>
        <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{result.next}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Practice it out loud. It is not scored.</p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onRetry} className={secondaryBtn}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Improve this answer
        </button>
        <button type="button" onClick={onNext} disabled={busy} className={primaryBtn}>
          Next question <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
