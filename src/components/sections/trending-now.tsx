"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, TrendingUp, Flame, Minus, Radio } from "lucide-react";
import { trendCards, type TrendCard } from "@/lib/home-data";

const statusMeta = {
  Rising: { icon: TrendingUp, style: "bg-emerald-50 text-emerald-600" },
  Hot: { icon: Flame, style: "bg-rose-50 text-rose-600" },
  Stable: { icon: Minus, style: "bg-ink-100 text-ink-500" },
};

function Sparkline({ points }: { points: number[] }) {
  const max = Math.max(...points);
  const path = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * 100) / (points.length - 1)},${40 - (v / max) * 38}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 42" className="h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
      <path d={path} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function TrendCardView({ card }: { card: TrendCard }) {
  const status = statusMeta[card.status];
  return (
    <article className="card group flex w-[19rem] shrink-0 snap-start flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:w-[21rem]">
      <div className="flex items-center justify-between">
        <span className={`chip ${card.categoryStyle}`}>{card.category}</span>
        <span className={`chip ${status.style}`}>
          <status.icon className="mr-1 h-3 w-3" />
          {card.status}
        </span>
      </div>

      <Link href={card.href} className="mt-4 block">
        <h3 className="font-sora text-lg font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
          {card.topic}
        </h3>
      </Link>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{card.summary}</p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-ink-400">30 day signal</span>
          <span className="font-bold text-emerald-600">{card.status}</span>
        </div>
        <Sparkline points={card.spark} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-ink-400">Activity</span>
          <span className="font-semibold text-ink-700">{card.activity}/100</span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < Math.round(card.activity / 10) ? "bg-brand-500" : "bg-ink-100"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink-100/50 pt-4">
        <span className="text-xs text-ink-400">{card.freshness}</span>
        <Link
          href={card.related.href}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          {card.related.label} <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </article>
  );
}

export default function TrendingNow() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="py-16 overflow-hidden lg:py-20" aria-labelledby="trending-heading">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">
              <Radio className="h-3.5 w-3.5 text-brand-600" /> Trend radar
            </p>
            <h2
              id="trending-heading"
              className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
            >
              Trending now, tracked live
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Signals across AI, careers, SEO and gaming — scored by momentum so you can act
              before the crowd.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous trends"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-brand-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next trends"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-brand-600"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {trendCards.map((card) => (
          <TrendCardView key={card.topic} card={card} />
        ))}
        <Link
          href="/trends"
          className="flex w-40 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 text-ink-400 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-600"
        >
          <ArrowUpRight className="h-6 w-6" />
          <span className="text-sm font-semibold">Open Trend Radar</span>
        </Link>
      </div>
    </section>
  );
}
