'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, ClipboardCopy, ExternalLink, Link2, Pencil, X } from 'lucide-react';
import { BUDGETS, HOURS, INDUSTRIES, MODELS, SKILLS, type Level, type Model, type Skill } from '@/lib/ideas/data';
import { DEFAULT_ANSWERS, ideaById, pressureTestPrompt, rankIdeas, testPlan, type Answers, type Idea } from '@/lib/ideas/match';
import { chatLinks } from '@/lib/prompts/types';

const ANSWERS_KEY = 'dm-idea-answers';
const SAVED_KEY = 'dm-ideas-saved';
const PAGE = 6;
const STEPS = ['skills', 'industry', 'models', 'hours', 'budget'] as const;
type Step = (typeof STEPS)[number];

const STEP_TEXT: Record<Step, { q: string; help: string }> = {
  skills: { q: 'What are you good at?', help: 'Pick everything that applies. Ideas that use your skills move to the top.' },
  industry: { q: 'Which industry do you know?', help: 'Knowing the customers from the inside is a real advantage. Pick one, or keep it open.' },
  models: { q: 'How would you like to earn?', help: 'Pick one or more, or skip to see every kind.' },
  hours: { q: 'How much time can you give it?', help: 'Be honest. Some ideas need more hours before they earn anything.' },
  budget: { q: 'How much can you spend to start?', help: 'Money you can afford to lose, not your savings.' },
};

function readJson<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage unavailable */ }
}

function Chip({ on, onClick, children, sub }: { on: boolean; onClick: () => void; children: React.ReactNode; sub?: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`rounded-xl border px-3.5 py-2 text-left text-sm transition-colors ${on ? 'border-orange-600 bg-orange-600 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-800 hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200'}`}
    >
      <span className="font-medium">{children}</span>
      {sub && <span className={`mt-0.5 block text-[12px] ${on ? 'text-orange-100' : 'text-stone-500'}`}>{sub}</span>}
    </button>
  );
}

function CanvasBox({ n, label, children, wide }: { n: number; label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`border-b border-r border-stone-300/80 p-4 dark:border-stone-700 ${wide ? 'sm:col-span-2' : ''}`}>
      <p className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
        <span className="font-mono text-orange-600">{String(n).padStart(2, '0')}</span>
        {label}
      </p>
      <div className="text-[14.5px] leading-relaxed text-stone-800 dark:text-stone-200">{children}</div>
    </div>
  );
}

export default function StartupIdeaClient() {
  const [answers, setAnswers] = useState<Answers>(DEFAULT_ANSWERS);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [openId, setOpenId] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  // Restore answers and saved ideas, and open a shared idea from the link.
  useEffect(() => {
    const a = readJson<Answers | null>(ANSWERS_KEY, null);
    if (a && Array.isArray(a.skills)) {
      setAnswers({ ...DEFAULT_ANSWERS, ...a });
      setDone(true);
    }
    setSaved(readJson<string[]>(SAVED_KEY, []));
    const shared = new URLSearchParams(window.location.search).get('idea');
    if (shared) setOpenId(shared);
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current && done) writeJson(ANSWERS_KEY, answers);
  }, [answers, done]);
  useEffect(() => {
    if (loaded.current) writeJson(SAVED_KEY, saved);
  }, [saved]);

  const ranked = useMemo(() => rankIdeas(answers), [answers]);
  const list = ranked.slice(0, shown);
  const current: Idea | null = useMemo(() => {
    if (openId) return ideaById(openId, answers);
    return list[0] ?? null;
  }, [openId, answers, list]);

  useEffect(() => {
    if (!current || !loaded.current) return;
    const url = new URL(window.location.href);
    if (openId) url.searchParams.set('idea', current.id);
    else url.searchParams.delete('idea');
    window.history.replaceState(null, '', url.toString());
  }, [current, openId]);

  const stepId = STEPS[step];
  const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const set = (patch: Partial<Answers>) => {
    setAnswers((a) => ({ ...a, ...patch }));
    setShown(PAGE);
    setOpenId(null);
  };
  const finish = () => {
    setDone(true);
    window.setTimeout(() => canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };
  const open = (id: string) => {
    setOpenId(id);
    window.setTimeout(() => {
      if (window.innerWidth < 1024) canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 30);
  };
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 1800);
    } catch { /* clipboard blocked */ }
  };

  const ideaText = (i: Idea) =>
    [
      i.title,
      i.pitch,
      '',
      `Problem: ${i.problem}`,
      `Customer: ${i.industry.customers}`,
      `First version: ${i.firstVersion}`,
      `Your angle: ${i.angle}`,
      `Channels: ${i.channels}`,
      `Revenue: ${i.revenue}`,
      `Costs: ${i.costs} (rough estimate: ${i.pattern.costBand})`,
      `Time to a first version: ${i.pattern.timeBand} (rough estimate)`,
      `Key number: ${i.metric}`,
      `Risks: ${i.risks.join(' ')}`,
      '',
      '7 day test:',
      ...testPlan(i).map((t) => `${t.day}: ${t.text}`),
    ].join('\n');

  const prompt = current ? pressureTestPrompt(current, answers) : '';
  const links = current ? chatLinks(prompt) : null;
  const savedIdeas = saved.map((id) => ideaById(id, answers)).filter((x): x is Idea => !!x);
  const isSaved = current ? saved.includes(current.id) : false;

  const summary = [
    answers.skills.length ? SKILLS.filter((s) => answers.skills.includes(s.id)).map((s) => s.label).join(', ') : 'Any skills',
    answers.industry === 'any' ? 'Any industry' : INDUSTRIES.find((i) => i.id === answers.industry)?.name,
    answers.models.length ? MODELS.filter((m) => answers.models.includes(m.id)).map((m) => m.label).join(', ') : 'Any model',
    HOURS[answers.hours].label,
    BUDGETS[answers.budget].label,
  ];

  return (
    <div className="space-y-6">
      {/* Questionnaire */}
      <section aria-label="Your answers" className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950">
        {!done ? (
          <div className="p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-stone-500">Step {step + 1} of {STEPS.length}</p>
              <button type="button" onClick={finish} className="text-[13px] font-medium text-stone-500 underline underline-offset-4 hover:text-stone-900 dark:hover:text-white">
                Skip, show ideas
              </button>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1.5" aria-hidden="true">
              {STEPS.map((s, i) => <span key={s} className={`h-1.5 rounded-full ${i <= step ? 'bg-orange-600' : 'bg-stone-200 dark:bg-stone-800'}`} />)}
            </div>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-stone-900 dark:text-white sm:text-3xl">{STEP_TEXT[stepId].q}</h3>
            <p className="mt-1.5 text-[15px] text-stone-600 dark:text-stone-400">{STEP_TEXT[stepId].help}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {stepId === 'skills' && SKILLS.map((s) => (
                <Chip key={s.id} on={answers.skills.includes(s.id)} onClick={() => set({ skills: toggle<Skill>(answers.skills, s.id) })}>{s.label}</Chip>
              ))}
              {stepId === 'industry' && (
                <>
                  <Chip on={answers.industry === 'any'} onClick={() => set({ industry: 'any' })}>Keep it open</Chip>
                  {INDUSTRIES.map((ind) => (
                    <Chip key={ind.id} on={answers.industry === ind.id} onClick={() => set({ industry: ind.id })}>{ind.name}</Chip>
                  ))}
                </>
              )}
              {stepId === 'models' && MODELS.map((m) => (
                <Chip key={m.id} on={answers.models.includes(m.id)} onClick={() => set({ models: toggle<Model>(answers.models, m.id) })} sub={m.hint}>{m.label}</Chip>
              ))}
              {stepId === 'hours' && HOURS.map((h) => (
                <Chip key={h.id} on={answers.hours === h.id} onClick={() => set({ hours: h.id as Level })} sub={h.hint}>{h.label}</Chip>
              ))}
              {stepId === 'budget' && BUDGETS.map((b) => (
                <Chip key={b.id} on={answers.budget === b.id} onClick={() => set({ budget: b.id as Level })} sub={b.hint}>{b.label}</Chip>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-stone-600 hover:text-stone-900 disabled:opacity-30 dark:text-stone-400 dark:hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => setStep((s) => s + 1)} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white hover:bg-stone-700 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200">
                  Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button type="button" onClick={finish} className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-orange-600 px-5 text-sm font-semibold text-white hover:bg-orange-700">
                  Show my ideas <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <ul className="flex flex-wrap gap-1.5 text-[13px]" aria-label="Your answers">
              {summary.map((s) => <li key={s} className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700 dark:bg-stone-900 dark:text-stone-300">{s}</li>)}
            </ul>
            <button type="button" onClick={() => { setDone(false); setStep(0); }} className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-stone-300 px-3.5 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Change answers
            </button>
          </div>
        )}
      </section>

      {/* Shortlist and canvas */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
        <section aria-labelledby="si-shortlist">
          <div className="mb-3 flex items-baseline justify-between gap-2">
            <h3 id="si-shortlist" className="text-[12px] font-semibold uppercase tracking-[0.14em] text-stone-500">
              {done ? 'Your shortlist' : 'Ideas for anyone'}
            </h3>
            <span className="text-[12px] text-stone-500">{ranked.length} ideas match</span>
          </div>
          <ol className="space-y-2.5">
            {list.map((i, k) => {
              const active = current?.id === i.id;
              return (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => open(i.id)}
                    aria-current={active ? 'true' : undefined}
                    className={`w-full rounded-2xl border p-4 text-left transition-colors ${active ? 'border-orange-600 bg-orange-50/70 ring-1 ring-orange-600 dark:bg-orange-500/10' : 'border-stone-200 bg-white hover:border-stone-400 dark:border-stone-800 dark:bg-stone-950 dark:hover:border-stone-600'}`}
                  >
                    <span className="flex items-start gap-3">
                      <span className="font-mono text-[12px] text-orange-600">{String(k + 1).padStart(2, '0')}</span>
                      <span className="min-w-0">
                        <span className="block font-semibold leading-snug text-stone-900 dark:text-white">{i.title}</span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-stone-600 dark:text-stone-400">{i.pitch}</span>
                        {done && i.reasons[0] && <span className="mt-2 block text-[12px] font-medium text-orange-700 dark:text-orange-400">{i.reasons[0]}</span>}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {shown < ranked.length && (
            <button type="button" onClick={() => setShown((n) => n + PAGE)} className="mt-3 w-full rounded-xl border border-dashed border-stone-300 py-2.5 text-sm font-medium text-stone-600 hover:border-stone-400 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:text-white">
              Show {Math.min(PAGE, ranked.length - shown)} more ideas
            </button>
          )}

          {savedIdeas.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-stone-500">Saved in this browser ({savedIdeas.length})</h3>
              <ul className="space-y-1">
                {savedIdeas.map((i) => (
                  <li key={i.id} className="flex items-center gap-2">
                    <button type="button" onClick={() => open(i.id)} className="min-w-0 flex-1 truncate rounded-lg px-2 py-1.5 text-left text-sm text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900">{i.title}</button>
                    <button type="button" onClick={() => setSaved((s) => s.filter((x) => x !== i.id))} className="rounded p-1 text-stone-400 hover:text-stone-900 dark:hover:text-white">
                      <X className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="sr-only">Remove {i.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Canvas */}
        <div ref={canvasRef} className="min-w-0 scroll-mt-24">
          {current ? (
            <article aria-labelledby="si-title" className="overflow-hidden rounded-3xl border border-stone-300 bg-[#fbfaf7] dark:border-stone-700 dark:bg-stone-950">
              <header className="border-b border-stone-300/80 p-5 dark:border-stone-700 sm:p-6">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-orange-700 dark:text-orange-400">Idea canvas</p>
                <h3 id="si-title" className="mt-2 text-2xl font-semibold leading-tight tracking-tight text-stone-900 dark:text-white">{current.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-stone-700 dark:text-stone-300">{current.pitch}</p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[12.5px]">
                  <span className="rounded-full border border-stone-300 px-2.5 py-1 text-stone-700 dark:border-stone-700 dark:text-stone-300">{MODELS.find((m) => m.id === current.pattern.model)?.label}</span>
                  <span className="rounded-full border border-stone-300 px-2.5 py-1 text-stone-700 dark:border-stone-700 dark:text-stone-300">Start up cost: {current.pattern.costBand}</span>
                  <span className="rounded-full border border-stone-300 px-2.5 py-1 text-stone-700 dark:border-stone-700 dark:text-stone-300">First version: {current.pattern.timeBand}</span>
                </div>
                <p className="mt-2 text-[12px] text-stone-500">Cost and time are rough estimates to compare ideas, not forecasts.</p>
                {(current.reasons.length > 0 || current.gaps.length > 0) && (
                  <ul className="mt-3 space-y-1 text-[13px]">
                    {current.reasons.map((r) => <li key={r} className="flex items-start gap-1.5 text-stone-700 dark:text-stone-300"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-orange-600" aria-hidden="true" />{r}</li>)}
                    {current.gaps.map((g) => <li key={g} className="flex items-start gap-1.5 text-stone-500"><span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />{g}</li>)}
                  </ul>
                )}
              </header>

              <div className="grid grid-cols-1 border-l border-stone-300/80 [background-image:linear-gradient(rgba(120,113,108,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,113,108,0.07)_1px,transparent_1px)] [background-size:20px_20px] dark:border-stone-700 sm:grid-cols-2 xl:grid-cols-3" style={{ marginLeft: -1 }}>
                <CanvasBox n={1} label="Problem">{current.problem}</CanvasBox>
                <CanvasBox n={2} label="Customer">{current.industry.customers.charAt(0).toUpperCase() + current.industry.customers.slice(1)}, who serve {current.industry.clients}.</CanvasBox>
                <CanvasBox n={3} label="First version">{current.firstVersion}</CanvasBox>
                <CanvasBox n={4} label="Your angle">{current.angle}</CanvasBox>
                <CanvasBox n={5} label="Where to find customers">{current.channels}</CanvasBox>
                <CanvasBox n={6} label="How it makes money">{current.revenue}</CanvasBox>
                <CanvasBox n={7} label="Costs">{current.costs}</CanvasBox>
                <CanvasBox n={8} label="Number to track">{current.metric}</CanvasBox>
                <CanvasBox n={9} label="Your edge">
                  {current.reasons.length
                    ? current.reasons.filter((r) => r.startsWith('Uses') || r.startsWith('Builds')).join('. ') || 'Pick your skills and industry above to see where you have an edge.'
                    : 'Pick your skills and industry above to see where you have an edge.'}
                </CanvasBox>
              </div>

              <div className="grid gap-0 border-t border-stone-300/80 dark:border-stone-700 lg:grid-cols-[1fr_1.3fr]">
                <div className="border-b border-stone-300/80 p-5 dark:border-stone-700 lg:border-b-0 lg:border-r sm:p-6">
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-stone-500">Main risks</h4>
                  <ul className="mt-2 space-y-2 text-[14px] leading-relaxed text-stone-700 dark:text-stone-300">
                    {current.risks.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
                <div className="p-5 sm:p-6">
                  <h4 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-stone-500">Test it in 7 days, before you build</h4>
                  <ol className="mt-3 space-y-3">
                    {testPlan(current).map((t) => (
                      <li key={t.day} className="grid gap-0.5 text-[14px] leading-relaxed sm:grid-cols-[6.5rem_1fr] sm:gap-3">
                        <span className="font-mono text-[12.5px] font-semibold text-orange-700 dark:text-orange-400">{t.day}</span>
                        <span className="text-stone-700 dark:text-stone-300">{t.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <footer className="flex flex-wrap items-center gap-2 border-t border-stone-300/80 bg-white/70 p-4 dark:border-stone-700 dark:bg-stone-900/40 sm:px-6">
                <button
                  type="button"
                  onClick={() => setSaved((s) => (s.includes(current.id) ? s.filter((x) => x !== current.id) : [...s, current.id]))}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-xl px-3.5 text-sm font-semibold transition-colors ${isSaved ? 'bg-orange-600 text-white hover:bg-orange-700' : 'border border-stone-300 text-stone-800 hover:bg-white dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900'}`}
                >
                  {isSaved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button type="button" onClick={() => copy('idea', ideaText(current))} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-stone-300 px-3.5 text-sm font-medium text-stone-800 hover:bg-white dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900">
                  {copied === 'idea' ? <Check className="h-4 w-4 text-orange-600" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
                  {copied === 'idea' ? 'Copied' : 'Copy canvas'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const url = new URL(window.location.href);
                    url.searchParams.set('idea', current.id);
                    copy('link', url.toString());
                  }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-stone-300 px-3.5 text-sm font-medium text-stone-800 hover:bg-white dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  {copied === 'link' ? <Check className="h-4 w-4 text-orange-600" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
                  {copied === 'link' ? 'Link copied' : 'Share link'}
                </button>
              </footer>

              <div className="border-t border-stone-300/80 bg-stone-900 p-5 text-stone-200 dark:border-stone-700 dark:bg-black sm:p-6">
                <h4 className="font-semibold text-white">Pressure test it with AI</h4>
                <p className="mt-1 text-[13.5px] leading-relaxed text-stone-400">
                  Opens a prompt that asks ChatGPT or Claude to act as a skeptical advisor: likely reasons it fails, what to check about competitors, and questions for real customers. Check anything it states before you rely on it.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {links && (
                    <>
                      <a href={links.chatgpt} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-white px-4 text-sm font-semibold text-stone-900 hover:bg-stone-200">
                        Open in ChatGPT <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                      <a href={links.claude} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-stone-600 px-4 text-sm font-semibold text-white hover:bg-stone-800">
                        Open in Claude <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    </>
                  )}
                  <button type="button" onClick={() => copy('prompt', prompt)} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-stone-600 px-4 text-sm font-medium text-stone-200 hover:bg-stone-800">
                    {copied === 'prompt' ? <Check className="h-4 w-4" aria-hidden="true" /> : <ClipboardCopy className="h-4 w-4" aria-hidden="true" />}
                    {copied === 'prompt' ? 'Copied' : 'Copy prompt'}
                  </button>
                </div>
              </div>
            </article>
          ) : (
            <div className="rounded-3xl border border-dashed border-stone-300 p-8 text-center text-stone-500 dark:border-stone-700">
              No ideas match every answer. Try more skills or a bigger budget.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
