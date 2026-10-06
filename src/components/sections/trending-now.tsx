import Link from "next/link";
import { ArrowRight, ArrowUpRight, Radio } from "lucide-react";
import type { TrendCard } from "@/lib/home-data";

type Topic = { label: string; count: number; href: string };

// Small editorial label: a running number and the topic, no pill.
function Label({ n, text }: { n: number; text: string }) {
  return (
    <p className="flex items-center gap-2.5 text-xs">
      <span className="font-mono text-[11px] font-semibold tabular-nums text-brand-600">
        {String(n).padStart(2, "0")}
      </span>
      <span aria-hidden="true" className="h-px w-4 bg-ink-200" />
      <span className="font-medium text-ink-500">{text}</span>
    </p>
  );
}

// Reading length as a thin bar, using the real read time of each report.
function ReadBar({ minutes, max }: { minutes: number; max: number }) {
  return (
    <div className="h-1 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
      <div className="h-full rounded-full bg-brand-500/70" style={{ width: `${Math.max(12, (minutes / max) * 100)}%` }} />
    </div>
  );
}

export default function TrendingNow({
  cards,
  topics,
  trendCount,
}: {
  cards: TrendCard[];
  topics: Topic[];
  trendCount: number;
}) {
  if (cards.length === 0) return null;
  const [featured, ...rest] = cards;
  const maxRead = Math.max(...cards.map((c) => c.readTime));

  return (
    <section className="py-16 overflow-hidden lg:py-20" aria-labelledby="trending-heading">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">
              <Radio className="h-3.5 w-3.5 text-brand-600" /> Trend reports
            </p>
            <h2
              id="trending-heading"
              className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
            >
              Trend reports worth reading
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              In depth reports on AI, careers, gaming and making money online, each showing the
              date it was last updated.
            </p>
          </div>
          <Link
            href="/trends"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            All {trendCount} reports
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr]">
          {/* Featured report */}
          <article className="card group relative flex flex-col p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover md:col-span-2 lg:col-span-1 lg:row-span-2 sm:p-8">
            <Label n={1} text={featured.category} />
            <h3 className="mt-5 font-sora text-2xl font-bold leading-tight tracking-tight text-ink-950 transition-colors group-hover:text-brand-700 sm:text-[1.7rem]">
              <Link href={featured.href} className="after:absolute after:inset-0 after:rounded-[inherit] focus:outline-none">
                {featured.title}
              </Link>
            </h3>
            <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-ink-500">{featured.summary}</p>

            <div className="mt-8 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-ink-400">
                <span>Updated {featured.updated}</span>
                <span className="font-mono tabular-nums">{featured.readTime} min read</span>
              </div>
              <ReadBar minutes={featured.readTime} max={maxRead} />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-ink-100/60 pt-5">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                Read the report <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              {featured.related && (
                <Link
                  href={featured.related.href}
                  className="relative z-10 inline-flex items-center gap-1 text-xs font-semibold text-ink-500 hover:text-brand-700"
                >
                  {featured.related.label} <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </article>

          {/* Other reports */}
          {rest.map((card, i) => (
            <article
              key={card.href}
              className="card group relative flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <Label n={i + 2} text={card.category} />
              <h3 className="mt-4 font-sora text-base font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
                <Link href={card.href} className="after:absolute after:inset-0 after:rounded-[inherit] focus:outline-none">
                  {card.title}
                </Link>
              </h3>
              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">{card.summary}</p>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs text-ink-400">
                  <span>Updated {card.updated}</span>
                  <span className="font-mono tabular-nums">{card.readTime} min</span>
                </div>
                <ReadBar minutes={card.readTime} max={maxRead} />
              </div>
            </article>
          ))}
        </div>

        {/* Topic index with real counts */}
        {topics.length > 0 && (
          <nav
            aria-label="Trend report topics"
            className="mt-6 flex flex-col gap-3 border-t border-ink-100/70 pt-5 sm:flex-row sm:items-baseline sm:gap-6"
          >
            <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
              {trendCount} reports, {topics.length} topics
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {topics.map((t) => (
                <li key={t.label}>
                  <Link
                    href={t.href}
                    className="text-ink-600 underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
                  >
                    {t.label}
                    <sup className="ml-0.5 font-mono text-[10px] text-ink-400">{t.count}</sup>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </section>
  );
}
