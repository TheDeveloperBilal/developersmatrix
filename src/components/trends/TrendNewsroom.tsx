'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Clock } from 'lucide-react';
import { ToolIcon } from '@/lib/tool-icons';
// The category list comes from the light file. Importing trends-data here would
// ship every trend body to the browser.
import { trendCategories } from '@/data/trend-categories';

export interface NewsroomTrend {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: number;
  updatedAt: string;
  popularityScore: number;
  featured: boolean;
}

type Sort = 'popular' | 'recent' | 'quick';

const SHORT: Record<string, string> = {
  'ai-tools': 'AI Tools',
  'ai-agents': 'AI Agents',
  'make-money': 'Make Money',
  gaming: 'Gaming',
  'future-tech': 'Future Tech',
  cybersecurity: 'Security',
  'social-media': 'Social Media',
  coding: 'Coding',
  'green-tech': 'Green Tech',
  'career-growth': 'Careers',
};

const HEX: Record<string, string> = {
  violet: '#7c3aed',
  purple: '#9333ea',
  green: '#16a34a',
  pink: '#db2777',
  blue: '#2563eb',
  red: '#dc2626',
  cyan: '#0891b2',
  orange: '#ea580c',
  emerald: '#059669',
  amber: '#d97706',
};

const PATHS: { title: string; blurb: string; steps: string[]; tool: { slug: string; name: string; href: string } }[] = [
  {
    title: 'Start a side income',
    blurb: 'From a first idea to your first paying customer.',
    steps: ['ai-side-hustles-make-money-2026', 'chatgpt-advanced-prompts-2026', 'no-code-tools-2026-guide'],
    tool: { slug: 'startup-idea-generator', name: 'Startup Idea Generator', href: '/tools/startup-idea-generator' },
  },
  {
    title: 'Get hired in tech',
    blurb: 'What employers look for and how to show it.',
    steps: ['tech-skills-demand-2026', 'tech-interview-preparation-2026', 'remote-tech-jobs-guide-2026'],
    tool: { slug: 'ai-resume-builder', name: 'AI Resume Builder', href: '/tools/ai-resume-builder' },
  },
  {
    title: 'Stay safe online',
    blurb: 'Understand new threats and protect your accounts and your site.',
    steps: ['ai-cybersecurity-threats-protection-2026', 'passwordless-authentication-future'],
    tool: { slug: 'website-audit', name: 'AI Website Audit', href: '/tools/website-audit' },
  },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const READ_KEY = 'dm:trends:opened';

/** "2026-10-08" to "8 Oct 2026", without the browser's locale or time zone. */
function formatDate(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1].slice(0, 3)} ${y}`;
}

/** Display copy without hyphens or dashes, as the site style asks. */
function clean(s: string) {
  return s
    .replace(/(\$[\d,]+)\s*-\s*(\$[\d,]+)/g, '$1 to $2')
    .replace(/\s[–—-]\s/g, ', ')
    .replace(/(\w)-(\w)/g, '$1 $2');
}

function monthIndex(iso: string) {
  const [y, m] = iso.slice(0, 7).split('-').map(Number);
  return y * 12 + (m - 1);
}

// Radar geometry, in SVG user units.
const C = 200;
const RINGS = [70, 120, 170];
const BAND = [40, 95, 146];

function polar(angleDeg: number, r: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: +(C + r * Math.cos(a)).toFixed(2), y: +(C + r * Math.sin(a)).toFixed(2) };
}

export default function TrendNewsroom({ trends }: { trends: NewsroomTrend[] }) {
  const [topic, setTopic] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('popular');
  const [opened, setOpened] = useState<string[]>([]);
  const pointerRef = useRef<string>('mouse');
  const shownAtDown = useRef<string>('');

  const cats = trendCategories.filter((c) => trends.some((t) => t.category === c.id));
  const catOf = (id: string) => trendCategories.find((c) => c.id === id);
  const colorOf = (id: string) => HEX[catOf(id)?.color ?? 'violet'] ?? HEX.violet;
  const bySlug = useMemo(() => Object.fromEntries(trends.map((t) => [t.slug, t])), [trends]);

  const popular = useMemo(
    () => [...trends].sort((a, b) => b.popularityScore - a.popularityScore || b.updatedAt.localeCompare(a.updatedAt)),
    [trends]
  );
  const recent = useMemo(
    () => [...trends].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || b.popularityScore - a.popularityScore),
    [trends]
  );
  const quick = useMemo(() => [...trends].sort((a, b) => a.readTime - b.readTime || b.popularityScore - a.popularityScore), [trends]);
  const ordered = sort === 'recent' ? recent : sort === 'quick' ? quick : popular;

  const lead = popular[0];
  const fresh = recent.filter((t) => t.slug !== lead?.slug).slice(0, 2);
  const latest = recent[0]?.updatedAt ?? '';
  const [activeSlug, setActiveSlug] = useState<string>(lead?.slug ?? '');
  const active = bySlug[activeSlug] ?? lead;

  // Reports the visitor opened from this page, kept in their own browser only.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(READ_KEY);
      if (raw) setOpened(JSON.parse(raw));
    } catch {
      /* storage blocked: ticks simply do not show */
    }
  }, []);
  const markOpened = (slug: string) => {
    setOpened((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      try {
        localStorage.setItem(READ_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Place every report on the radar: one slice per topic, rings by update month.
  const latestMonth = latest ? monthIndex(latest) : 0;
  const ringOf = (t: NewsroomTrend) => Math.min(2, Math.max(0, latestMonth - monthIndex(t.updatedAt)));
  const slice = 360 / Math.max(cats.length, 1);
  const dots = cats.flatMap((c, i) => {
    const items = popular.filter((t) => t.category === c.id);
    return items.map((t, j) => {
      const ring = ringOf(t);
      const sameRing = items.filter((x) => ringOf(x) === ring);
      const k = sameRing.indexOf(t);
      const angle = -90 + i * slice + ((k + 1) / (sameRing.length + 1)) * slice;
      const r = BAND[ring] + (j % 2 === 1 ? 10 : 0);
      return { t, ...polar(angle, r), color: HEX[c.color] ?? HEX.violet };
    });
  });
  const latestM = latest ? Number(latest.slice(5, 7)) - 1 : 0;
  const ringLabels = [
    `Updated in ${MONTHS[latestM]}`,
    `Updated in ${MONTHS[(latestM + 11) % 12]}`,
    `${MONTHS[(latestM + 10) % 12]} or earlier`,
  ];
  const sweepEnd = polar(-90 + slice, RINGS[2]);

  const count = (id: string | null) => (id ? trends.filter((t) => t.category === id).length : trends.length);
  const visible = (t: NewsroomTrend) => !topic || t.category === topic;
  let n = 0;

  return (
    <>
      {/* Masthead */}
      <section className="border-b border-stone-300 bg-stone-50 pt-16 dark:border-ink-800 dark:bg-ink-950">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-stone-300 py-4 text-xs uppercase tracking-[0.18em] text-stone-500 dark:border-ink-800 dark:text-ink-400">
            <nav aria-label="Breadcrumb" className="normal-case tracking-normal">
              <Link href="/" className="hover:text-ink-950 dark:hover:text-white">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-ink-800 dark:text-ink-200">Trends</span>
            </nav>
            <p className="font-semibold text-ink-900 dark:text-ink-100">The DevelopersMatrix Trend Radar</p>
            <p>
              {trends.length} reports <span aria-hidden="true">·</span> {cats.length} topics
              {latest && (
                <>
                  {' '}<span aria-hidden="true">·</span> Latest update {formatDate(latest)}
                </>
              )}
            </p>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
            {/* Headline and lead story */}
            <div className="lg:col-span-6 xl:col-span-5">
              <h1 className="font-sora text-4xl font-bold leading-[1.05] tracking-tight text-balance text-ink-950 dark:text-white sm:text-6xl">
                Trending Now in Tech
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600 dark:text-ink-300">
                Plain English reports on the technology shaping careers, income and the tools people use every day. Each one explains what is happening, why it matters and what to do next.
              </p>

              {lead && (
                <article className="mt-10 border-t-4 border-ink-950 pt-5 dark:border-white">
                  <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: colorOf(lead.category) }}>
                    <span className="h-2 w-2 rounded-full" style={{ background: colorOf(lead.category) }} aria-hidden="true" />
                    Lead report <span className="text-stone-400">/</span> {SHORT[lead.category] ?? lead.category}
                  </p>
                  <h2 className="mt-3 font-sora text-2xl font-bold leading-tight tracking-tight text-balance text-ink-950 dark:text-white sm:text-3xl">
                    <Link href={`/trends/${lead.slug}`} onClick={() => markOpened(lead.slug)} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                      {clean(lead.title)}
                    </Link>
                  </h2>
                  <p className="mt-3 text-stone-600 dark:text-ink-300">{clean(lead.subtitle)}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-stone-500 dark:text-ink-400">
                    <Link
                      href={`/trends/${lead.slug}`}
                      onClick={() => markOpened(lead.slug)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-950 px-5 font-semibold text-white transition hover:bg-brand-700 dark:bg-white dark:text-ink-950 dark:hover:bg-brand-200"
                    >
                      Read the report <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" aria-hidden="true" /> {lead.readTime} min read
                    </span>
                    <span>Updated {formatDate(lead.updatedAt)}</span>
                  </div>
                </article>
              )}

              {fresh.length > 0 && (
                <div className="mt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-ink-400">Fresh updates</p>
                  <ul className="mt-3 divide-y divide-stone-300 border-y border-stone-300 dark:divide-ink-800 dark:border-ink-800">
                    {fresh.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/trends/${t.slug}`}
                          onClick={() => markOpened(t.slug)}
                          className="group flex items-start justify-between gap-4 py-4"
                        >
                          <span>
                            <span className="block text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: colorOf(t.category) }}>
                              {SHORT[t.category] ?? t.category}
                            </span>
                            <span className="mt-1 block font-sora text-base font-semibold leading-snug tracking-tight sm:text-lg text-ink-950 group-hover:underline dark:text-white">
                              {clean(t.title)}
                            </span>
                            <span className="mt-1 block text-sm text-stone-500 dark:text-ink-400">Updated {formatDate(t.updatedAt)}</span>
                          </span>
                          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-stone-400 transition group-hover:text-ink-950 dark:group-hover:text-white" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Radar */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="rounded-[2rem] border border-stone-300 bg-white p-4 dark:border-ink-800 dark:bg-ink-900 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2 px-1">
                  <p className="font-sora text-xl font-bold tracking-tight text-ink-950 dark:text-white">The radar</p>
                  <p className="text-xs text-stone-500 dark:text-ink-400">One slice per topic. Closer to the centre means updated more recently.</p>
                </div>
                <svg
                  viewBox="-62 -12 524 424"
                  className="mx-auto mt-2 block w-full max-w-[34rem]"
                  role="group"
                  aria-label={`Trend radar with ${trends.length} reports across ${cats.length} topics`}
                >
                  <defs>
                    <linearGradient id="radar-sweep" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#7c3aed" stopOpacity="0.22" />
                      <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {RINGS.map((r, i) => (
                    <circle key={r} cx={C} cy={C} r={r} fill="none" className="stroke-stone-300 dark:stroke-ink-700" strokeDasharray={i === 2 ? undefined : '3 5'} />
                  ))}
                  {cats.map((c, i) => {
                    const p = polar(-90 + i * slice, RINGS[2]);
                    return <line key={c.id} x1={C} y1={C} x2={p.x} y2={p.y} className="stroke-stone-200 dark:stroke-ink-800" />;
                  })}
                  {topic && (() => {
                    const i = cats.findIndex((c) => c.id === topic);
                    if (i < 0) return null;
                    const a = polar(-90 + i * slice, RINGS[2]);
                    const b = polar(-90 + (i + 1) * slice, RINGS[2]);
                    return <path d={`M${C} ${C} L${a.x} ${a.y} A${RINGS[2]} ${RINGS[2]} 0 0 1 ${b.x} ${b.y} Z`} fill={colorOf(topic)} fillOpacity="0.08" />;
                  })()}
                  <g className="motion-reduce:hidden" aria-hidden="true">
                    <path d={`M${C} ${C} L${C} ${C - RINGS[2]} A${RINGS[2]} ${RINGS[2]} 0 0 1 ${sweepEnd.x} ${sweepEnd.y} Z`} fill="url(#radar-sweep)" />
                    <animateTransform attributeName="transform" type="rotate" from={`0 ${C} ${C}`} to={`360 ${C} ${C}`} dur="12s" repeatCount="indefinite" />
                  </g>
                  {cats.map((c, i) => {
                    const mid = -90 + (i + 0.5) * slice;
                    const p = polar(mid, RINGS[2] + 16);
                    const cos = Math.cos((mid * Math.PI) / 180);
                    const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
                    return (
                      <text
                        key={c.id}
                        x={p.x}
                        y={p.y}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        className={`hidden text-[12px] font-medium sm:block ${topic === c.id ? 'fill-ink-950 dark:fill-white' : 'fill-stone-500 dark:fill-ink-400'}`}
                      >
                        {SHORT[c.id] ?? c.name}
                      </text>
                    );
                  })}
                  <circle cx={C} cy={C} r="4" className="fill-ink-950 dark:fill-white" />
                  {dots.map(({ t, x, y, color }) => {
                    const on = active?.slug === t.slug;
                    const dim = topic && t.category !== topic;
                    return (
                      <a
                        key={t.slug}
                        href={`/trends/${t.slug}`}
                        aria-label={`${clean(t.title)}, ${SHORT[t.category] ?? t.category}, updated ${formatDate(t.updatedAt)}`}
                        onMouseEnter={() => setActiveSlug(t.slug)}
                        onFocus={() => setActiveSlug(t.slug)}
                        onPointerDown={(e) => {
                          pointerRef.current = e.pointerType;
                          shownAtDown.current = active?.slug ?? '';
                        }}
                        onClick={(e) => {
                          // On touch screens the first tap previews, the second opens.
                          if (pointerRef.current === 'touch' && shownAtDown.current !== t.slug) {
                            e.preventDefault();
                            setActiveSlug(t.slug);
                            return;
                          }
                          markOpened(t.slug);
                        }}
                        className="cursor-pointer outline-none [&:focus-visible_.dot-focus]:opacity-100"
                        style={{ opacity: dim ? 0.18 : 1, transition: 'opacity 200ms' }}
                      >
                        <circle cx={x} cy={y} r="16" fill="transparent" />
                        <circle className="dot-focus opacity-0" cx={x} cy={y} r="13" fill="none" stroke={color} strokeWidth="2" />
                        {on && <circle cx={x} cy={y} r="12" fill={color} fillOpacity="0.18" />}
                        <circle cx={x} cy={y} r={on ? 7.5 : 6} fill={color} stroke="white" strokeWidth="2" className="dark:stroke-ink-900" />
                      </a>
                    );
                  })}
                </svg>

                <ul className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-stone-500 dark:text-ink-400">
                  {ringLabels.map((l, i) => (
                    <li key={l} className="flex items-center gap-2">
                      <span className="flex h-3 w-3 items-center justify-center rounded-full border border-stone-400" aria-hidden="true">
                        <span className="rounded-full bg-stone-400" style={{ width: 8 - i * 3, height: 8 - i * 3 }} />
                      </span>
                      {l}
                    </li>
                  ))}
                </ul>

                {active && (
                  <div aria-live="polite" className="mt-4 rounded-2xl bg-stone-100 p-4 dark:bg-ink-950 sm:p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: colorOf(active.category) }}>
                      {SHORT[active.category] ?? active.category}
                    </p>
                    <p className="mt-1 font-sora text-base font-bold leading-snug tracking-tight sm:text-lg text-ink-950 dark:text-white">
                      <Link href={`/trends/${active.slug}`} onClick={() => markOpened(active.slug)} className="hover:underline">
                        {clean(active.title)}
                      </Link>
                    </p>
                    <p className="mt-1 text-sm text-stone-500 dark:text-ink-400">
                      {active.readTime} min read <span aria-hidden="true">·</span> Updated {formatDate(active.updatedAt)}
                    </p>
                    <p className="mt-2 text-xs text-stone-400 sm:hidden">Tap a dot to preview a report, tap again to open it.</p>
                    <p className="mt-2 hidden text-xs text-stone-400 sm:block">Point at a dot to preview a report, click to read it.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Index of every report */}
      <section aria-labelledby="index-title" className="bg-white dark:bg-ink-900">
        <div className="sticky top-16 z-20 border-b border-stone-200 bg-white/95 backdrop-blur dark:border-ink-800 dark:bg-ink-900/95">
          <div className="shell flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div role="group" aria-label="Filter by topic" className="-mx-5 flex gap-2 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:px-0 [&::-webkit-scrollbar]:hidden">
              <TopicChip label="All" n={count(null)} on={!topic} onClick={() => setTopic(null)} />
              {cats.map((c) => (
                <TopicChip
                  key={c.id}
                  label={SHORT[c.id] ?? c.name}
                  n={count(c.id)}
                  color={HEX[c.color]}
                  on={topic === c.id}
                  onClick={() => setTopic(topic === c.id ? null : c.id)}
                />
              ))}
            </div>
            <div role="group" aria-label="Sort reports" className="flex shrink-0 self-start rounded-full border border-stone-300 p-1 text-sm dark:border-ink-700">
              {([
                ['popular', 'Top picks'],
                ['recent', 'Latest'],
                ['quick', 'Quick reads'],
              ] as [Sort, string][]).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={sort === v}
                  onClick={() => setSort(v)}
                  className={`flex-1 whitespace-nowrap rounded-full px-3 py-1.5 font-medium transition sm:px-4 ${
                    sort === v ? 'bg-ink-950 text-white dark:bg-white dark:text-ink-950' : 'text-stone-600 hover:text-ink-950 dark:text-ink-300 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shell py-12 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-ink-950 pb-4 dark:border-white">
            <h2 id="index-title" className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">All Trend Reports</h2>
            <p aria-live="polite" className="text-sm text-stone-500 dark:text-ink-400">
              {topic ? `${count(topic)} of ${trends.length} reports in ${SHORT[topic] ?? topic}` : `${trends.length} reports`}
            </p>
          </div>

          <ol className="mt-2 lg:columns-2 lg:gap-14 lg:[column-rule:1px_solid_#e7e5e4] dark:lg:[column-rule-color:#232a3a]">
            {ordered.map((t) => {
              const show = visible(t);
              if (show) n += 1;
              const isOpened = opened.includes(t.slug);
              return (
                <li key={t.slug} hidden={!show} className="break-inside-avoid border-b border-stone-200 py-6 dark:border-ink-800">
                  <div className="flex gap-5">
                    <span className="w-10 shrink-0 font-sora text-2xl font-bold tabular-nums leading-none text-stone-300 dark:text-ink-700" aria-hidden="true">
                      {String(n).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-[0.16em]">
                        <span style={{ color: colorOf(t.category) }}>{SHORT[t.category] ?? t.category}</span>
                        <span className="text-stone-300 dark:text-ink-600" aria-hidden="true">/</span>
                        <span className="font-medium normal-case tracking-normal text-stone-500 dark:text-ink-400">{t.readTime} min read</span>
                      </p>
                      <h3 className="mt-2 font-sora text-lg font-bold leading-snug tracking-tight text-balance text-ink-950 dark:text-white sm:text-xl">
                        <Link
                          href={`/trends/${t.slug}`}
                          onClick={() => markOpened(t.slug)}
                          className="hover:underline hover:decoration-2 hover:underline-offset-4"
                        >
                          {clean(t.title)}
                        </Link>
                      </h3>
                      <p className="mt-2 leading-relaxed text-stone-600 dark:text-ink-300">{clean(t.subtitle)}</p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500 dark:text-ink-400">
                        <span>Updated {formatDate(t.updatedAt)}</span>
                        {isOpened && (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                            <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" /> Opened
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Reading paths */}
      <section aria-labelledby="paths-title" className="border-t border-stone-300 bg-stone-50 dark:border-ink-800 dark:bg-ink-950">
        <div className="shell py-14 lg:py-20">
          <div className="max-w-2xl">
            <h2 id="paths-title" className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">Reading Paths</h2>
            <p className="mt-3 text-lg text-stone-600 dark:text-ink-300">
              Not sure where to begin? Follow a path. Each one ends with a free tool that helps you act on what you read.
            </p>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
            {PATHS.map((p) => (
              <div key={p.title}>
                <h3 className="font-sora text-xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-2xl">{p.title}</h3>
                <p className="mt-1 text-sm text-stone-500 dark:text-ink-400">{p.blurb}</p>
                <ol className="relative mt-6 space-y-5 border-l border-stone-300 pl-6 dark:border-ink-700">
                  {p.steps.map((slug, i) => {
                    const t = bySlug[slug];
                    if (!t) return null;
                    return (
                      <li key={slug} className="relative">
                        <span className="absolute -left-[2.15rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border border-stone-300 bg-white text-xs font-semibold text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-white">
                          {i + 1}
                        </span>
                        <Link href={`/trends/${slug}`} onClick={() => markOpened(slug)} className="group block">
                          <span className="block font-semibold leading-snug text-ink-950 group-hover:underline dark:text-white">{clean(t.title)}</span>
                          <span className="mt-0.5 flex items-center gap-2 text-sm text-stone-500 dark:text-ink-400">
                            {t.readTime} min read
                            {opened.includes(slug) && (
                              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                                <Check className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" /> Opened
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                  <li className="relative">
                    <span className="absolute -left-[2.15rem] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white" aria-hidden="true">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <Link
                      href={p.tool.href}
                      className="group flex items-center gap-3 rounded-2xl border border-stone-300 bg-white p-3 pr-4 transition hover:border-brand-500 dark:border-ink-700 dark:bg-ink-900"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                        <ToolIcon tool={p.tool.slug} className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-xs uppercase tracking-[0.14em] text-stone-500 dark:text-ink-400">Then try</span>
                        <span className="block font-semibold text-ink-950 dark:text-white">{p.tool.name}</span>
                      </span>
                    </Link>
                  </li>
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow */}
      <section className="border-t border-stone-300 bg-white dark:border-ink-800 dark:bg-ink-900">
        <div className="shell flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="max-w-xl">
            <h2 className="font-sora text-2xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-3xl">Stay Ahead of the Curve</h2>
            <p className="mt-3 text-stone-600 dark:text-ink-300">
              New trend reports are shared on our social pages as soon as they go live. Follow along, or email us with a topic you want covered at{' '}
              <a href="mailto:info@developersmatrix.com" className="font-medium text-brand-700 hover:underline dark:text-brand-300">
                info@developersmatrix.com
              </a>
              .
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {[
              { name: 'LinkedIn', href: 'https://linkedin.com/company/developersmatrix' },
              { name: 'Facebook', href: 'https://www.facebook.com/developersmatrix/' },
              { name: 'Instagram', href: 'https://www.instagram.com/developermatrix/' },
              { name: 'Pinterest', href: 'https://www.pinterest.com/developersmatrix/' },
            ].map((l) => (
              <li key={l.name}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full border border-stone-300 px-5 text-sm font-semibold text-ink-900 transition hover:border-ink-950 dark:border-ink-700 dark:text-white dark:hover:border-white"
                >
                  {l.name} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function TopicChip({ label, n, on, color, onClick }: { label: string; n: number; on: boolean; color?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        on
          ? 'border-ink-950 bg-ink-950 text-white dark:border-white dark:bg-white dark:text-ink-950'
          : 'border-stone-300 text-stone-700 hover:border-ink-950 dark:border-ink-700 dark:text-ink-200 dark:hover:border-white'
      }`}
    >
      {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />}
      {label}
      <span className="tabular-nums text-xs opacity-60">{n}</span>
    </button>
  );
}
