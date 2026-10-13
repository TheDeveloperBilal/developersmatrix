'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarCheck,
  Check,
  ChevronDown,
  Cpu,
  Globe,
  PenLine,
  Search,
  Wallet,
  X,
  type LucideIcon,
} from 'lucide-react';
import { ToolIcon } from '@/lib/tool-icons';

export interface DirectoryTool {
  slug: string;
  name: string;
  path: string;
  category: string;
  outcome: string;
  youGet: string;
  bestFor: string;
  goals: string[];
  features: string[];
  keywords: string[];
}

export interface DirectoryCategory {
  id: string;
  name: string;
  description: string;
}

const GOALS: { id: string; label: string; hint: string; icon: LucideIcon }[] = [
  { id: 'hired', label: 'Get hired', hint: 'Resume, letters, interviews', icon: Briefcase },
  { id: 'website', label: 'Fix a website', hint: 'Audit and content checks', icon: Globe },
  { id: 'write', label: 'Write faster', hint: 'Emails, prompts, letters', icon: PenLine },
  { id: 'plan', label: 'Plan your day', hint: 'Habits, days and ideas', icon: CalendarCheck },
  { id: 'money', label: 'Manage money', hint: 'Budget, pay, side income', icon: Wallet },
  { id: 'pc', label: 'Check your PC', hint: 'Game requirements', icon: Cpu },
];

const START_HERE = [
  { lead: 'If you run a website', slug: 'website-audit' },
  { lead: 'If you are job hunting', slug: 'ai-resume-builder' },
  { lead: 'If you play on PC', slug: 'can-you-run-it' },
];

export default function ToolsDirectoryClient({
  tools,
  categories,
}: {
  tools: DirectoryTool[];
  categories: DirectoryCategory[];
}) {
  const [goal, setGoal] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(categories[0]?.id ?? '');
  const searchRef = useRef<HTMLInputElement>(null);

  // Press / anywhere on the page to jump to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Highlight the category currently in view.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );
    for (const c of categories) {
      const el = document.getElementById(c.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [categories]);

  const needle = query.trim().toLowerCase();
  const haystacks = useMemo(
    () =>
      Object.fromEntries(
        tools.map((t) => [t.slug, [t.name, t.outcome, t.youGet, t.bestFor, ...t.features, ...t.keywords].join(' ').toLowerCase()])
      ),
    [tools]
  );
  const matches = (t: DirectoryTool) =>
    (!goal || t.goals.includes(goal)) && (!needle || haystacks[t.slug].includes(needle));
  const shown = tools.filter(matches);
  const filtering = Boolean(goal || needle);
  const bySlug = Object.fromEntries(tools.map((t) => [t.slug, t]));

  const reset = () => {
    setGoal(null);
    setQuery('');
  };

  return (
    <>
      {/* Hero with the finder */}
      <section className="border-b border-ink-200 bg-ink-50 pt-16 dark:border-ink-800 dark:bg-ink-950">
        <div className="shell grid gap-10 py-12 lg:grid-cols-12 lg:items-center lg:gap-14 lg:py-20">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb" className="text-sm text-ink-500 dark:text-ink-400">
              <Link href="/" className="hover:text-ink-950 dark:hover:text-white">Home</Link>
              <span className="mx-2 text-ink-300 dark:text-ink-600">/</span>
              <span className="text-ink-800 dark:text-ink-200">Tools</span>
            </nav>
            <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-300">
              Free tool directory
            </p>
            <h1 className="mt-3 font-sora text-4xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-6xl">
              AI Powered <span className="text-brand-700 dark:text-brand-300">Tools</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600 dark:text-ink-300">
              Free tools for your career, your website, your money and your day. Every tool runs in your browser and none of them asks you to sign up.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-ink-700 dark:text-ink-200">
              {['Free to use', 'No account needed', 'Works in your browser'].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-ink-200 bg-white p-5 shadow-[0_1px_0_rgba(11,15,24,0.04),0_20px_40px_-24px_rgba(11,15,24,0.25)] dark:border-ink-800 dark:bg-ink-900 sm:p-6">
              <p id="goal-label" className="font-sora text-lg font-semibold text-ink-950 dark:text-white">
                What do you need to do?
              </p>
              <div role="group" aria-labelledby="goal-label" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {GOALS.map((g) => {
                  const on = goal === g.id;
                  const Icon = g.icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setGoal(on ? null : g.id)}
                      className={`flex min-h-[64px] items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-600/25 ${
                        on
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-ink-200 text-ink-900 hover:border-ink-950 dark:border-ink-700 dark:text-ink-100 dark:hover:border-ink-300'
                      }`}
                    >
                      <span className="tool-icon">
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-tight">{g.label}</span>
                        <span className={`mt-0.5 block text-xs leading-snug ${on ? 'text-white/80' : 'text-ink-500 dark:text-ink-400'}`}>{g.hint}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-4">
                <label htmlFor="tool-search" className="sr-only">Search tools</label>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                <input
                  ref={searchRef}
                  id="tool-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools"
                  autoComplete="off"
                  className="block h-12 w-full rounded-2xl border border-ink-300 bg-ink-50 pl-11 pr-12 text-[0.95rem] text-ink-950 placeholder:text-ink-400 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-600/15 dark:border-ink-700 dark:bg-ink-950 dark:text-white dark:focus:border-brand-400 [&::-webkit-search-cancel-button]:hidden"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Clear search</span>
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-ink-300 bg-white px-1.5 py-0.5 font-mono text-xs text-ink-500 dark:border-ink-700 dark:bg-ink-900 sm:block">
                    /
                  </kbd>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
                <p aria-live="polite" className="text-ink-600 dark:text-ink-300">
                  {filtering
                    ? shown.length === 1
                      ? '1 tool matches'
                      : `${shown.length} tools match`
                    : 'Choose a goal or search to narrow the list'}
                </p>
                <div className="flex items-center gap-4">
                  {filtering && (
                    <button type="button" onClick={reset} className="font-medium text-ink-500 underline underline-offset-4 hover:text-ink-950 dark:text-ink-400 dark:hover:text-white">
                      Clear
                    </button>
                  )}
                  <a href="#directory" className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline dark:text-brand-300">
                    See the tools <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section id="directory" aria-label="All tools" className="scroll-mt-16 bg-white dark:bg-ink-900">
        <div className="shell pb-14 lg:grid lg:grid-cols-12 lg:gap-12 lg:py-16">
          {/* Category rail: chips on small screens, a sticky list on large ones */}
          <nav
            aria-label="Tool categories"
            className="sticky top-16 z-20 -mx-5 border-b border-ink-200 bg-white/95 px-5 py-3 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95 sm:-mx-8 sm:px-8 lg:top-24 lg:col-span-3 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
          >
            <p className="mb-3 hidden text-xs font-semibold uppercase tracking-[0.18em] text-ink-400 lg:block">Browse by category</p>
            <ul className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-0.5 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
              {categories.map((c) => {
                const count = tools.filter((t) => t.category === c.id && matches(t)).length;
                const on = active === c.id;
                return (
                  <li key={c.id} className="shrink-0">
                    <a
                      href={`#${c.id}`}
                      aria-current={on ? 'true' : undefined}
                      className={`flex items-center justify-between gap-3 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition lg:rounded-xl lg:border-0 lg:px-3 lg:py-2.5 ${
                        on
                          ? 'border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950 lg:bg-brand-50 lg:text-brand-800 lg:dark:bg-brand-950/50 lg:dark:text-brand-200'
                          : 'border-ink-200 text-ink-700 hover:border-ink-400 dark:border-ink-700 dark:text-ink-300 lg:hover:bg-ink-50 lg:dark:hover:bg-ink-800'
                      } ${count === 0 ? 'opacity-40' : ''}`}
                    >
                      {c.name}
                      <span className="tabular-nums text-xs opacity-70">{count}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 hidden rounded-2xl border border-ink-200 p-5 text-sm dark:border-ink-800 lg:block">
              <p className="font-semibold text-ink-950 dark:text-white">Need something else?</p>
              <p className="mt-1 text-ink-600 dark:text-ink-300">Our team reviews every tool idea.</p>
              <Link href="/contact" className="mt-3 inline-flex items-center gap-1 font-semibold text-brand-700 hover:underline dark:text-brand-300">
                Suggest a tool <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </nav>

          <div className="pt-10 lg:col-span-9 lg:pt-0">
            {!filtering && (
              <div className="mb-12 rounded-3xl bg-ink-950 p-6 text-white dark:bg-ink-800 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-300">New here? Start with one of these</p>
                <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3">
                  {START_HERE.map((s) => {
                    const t = bySlug[s.slug];
                    if (!t) return null;
                    return (
                      <li key={s.slug} className="bg-ink-950 dark:bg-ink-800">
                        <Link href={t.path} className="group flex h-full flex-col gap-3 p-5 transition hover:bg-white/5">
                          <span className="text-sm text-ink-400">{s.lead}</span>
                          <span className="flex items-center gap-3 font-sora text-lg font-semibold">
                            <ToolIcon tool={t.slug} className="h-5 w-5 text-brand-300" />
                            {t.name}
                          </span>
                          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-300">
                            Open the tool
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {filtering && shown.length === 0 && (
              <div className="rounded-3xl border border-dashed border-ink-300 p-8 text-center dark:border-ink-700">
                <p className="font-sora text-lg font-semibold text-ink-950 dark:text-white">No tool matches that yet</p>
                <p className="mt-2 text-ink-600 dark:text-ink-300">Try a broader word, or tell us what you were looking for.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-full bg-ink-950 px-5 text-sm font-semibold text-white dark:bg-white dark:text-ink-950">
                    Show every tool
                  </button>
                  <Link href="/contact" className="inline-flex h-11 items-center rounded-full border border-ink-300 px-5 text-sm font-semibold text-ink-900 dark:border-ink-700 dark:text-white">
                    Suggest a tool
                  </Link>
                </div>
              </div>
            )}

            <div className="space-y-12">
              {categories.map((c) => {
                const items = tools.filter((t) => t.category === c.id);
                const visible = items.filter(matches).length;
                return (
                  <section
                    key={c.id}
                    id={c.id}
                    aria-labelledby={`${c.id}-title`}
                    hidden={visible === 0}
                    className="scroll-mt-36 lg:scroll-mt-24"
                  >
                    <div className="flex items-end justify-between gap-4 border-b-2 border-ink-950 pb-3 dark:border-ink-200">
                      <div>
                        <h2 id={`${c.id}-title`} className="font-sora text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
                          {c.name}
                        </h2>
                        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{c.description}</p>
                      </div>
                      <span className="font-sora text-sm font-semibold tabular-nums text-ink-400" aria-hidden="true">
                        {String(visible).padStart(2, '0')}
                      </span>
                    </div>
                    <ul className="divide-y divide-ink-200 dark:divide-ink-800">
                      {items.map((t) => (
                        <ToolRow key={t.slug} tool={t} hidden={!matches(t)} />
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ToolRow({ tool: t, hidden }: { tool: DirectoryTool; hidden: boolean }) {
  return (
    <li hidden={hidden} className="py-6">
      <div className="flex gap-4 sm:items-center">
        <Link
          href={t.path}
          tabIndex={-1}
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition hover:bg-brand-600 hover:text-white dark:bg-brand-950/50 dark:text-brand-300 dark:ring-brand-900"
        >
          <ToolIcon tool={t.slug} className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <h3 className="font-sora text-lg font-semibold text-ink-950 dark:text-white">
            <Link href={t.path} className="hover:text-brand-700 dark:hover:text-brand-300">
              {t.name}
            </Link>
          </h3>
          <p className="mt-0.5 leading-relaxed text-ink-600 dark:text-ink-300">{t.outcome}</p>
        </div>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          {t.youGet && (
            <span className="text-right text-xs leading-tight">
              <span className="block uppercase tracking-[0.14em] text-ink-400">You get</span>
              <span className="mt-1 block text-sm font-semibold text-ink-800 dark:text-ink-100">{t.youGet}</span>
            </span>
          )}
          <Link
            href={t.path}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-ink-950 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 dark:bg-white dark:text-ink-950 dark:hover:bg-brand-200"
          >
            Open<span className="sr-only"> {t.name}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-start gap-x-6 gap-y-2 sm:pl-16">
        <details className="group w-full [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-brand-700 dark:text-brand-300 sm:inline-flex sm:justify-start">
            <span className="inline-flex items-center gap-1.5">
              Quick look
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
            <Link
              href={t.path}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-ink-950 dark:text-white sm:hidden"
            >
              Open tool <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </summary>
          <div className="mt-3 grid gap-5 rounded-2xl bg-ink-50 p-5 dark:bg-ink-950 sm:grid-cols-[1.4fr_1fr]">
            <ul className="space-y-2">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-sm text-ink-700 dark:text-ink-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <dl className="space-y-3 text-sm">
              {t.bestFor && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-400">Best for</dt>
                  <dd className="mt-1 font-medium text-ink-800 dark:text-ink-100">{t.bestFor}</dd>
                </div>
              )}
              {t.youGet && (
                <div className="sm:hidden">
                  <dt className="text-xs uppercase tracking-[0.14em] text-ink-400">You get</dt>
                  <dd className="mt-1 font-medium text-ink-800 dark:text-ink-100">{t.youGet}</dd>
                </div>
              )}
            </dl>
          </div>
        </details>
      </div>
    </li>
  );
}
