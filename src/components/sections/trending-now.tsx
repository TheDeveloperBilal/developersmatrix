"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock, Radio } from "lucide-react";
import type { TrendCard } from "@/lib/home-data";

function TrendCardView({ card }: { card: TrendCard }) {
  return (
    <article className="card group flex w-[19rem] shrink-0 snap-start flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:w-[21rem]">
      <div className="flex items-center justify-between gap-3">
        <span className="chip bg-brand-100 text-brand-700">{card.category}</span>
        <span className="inline-flex items-center gap-1 text-xs text-ink-400">
          <Clock className="h-3 w-3" />
          {card.readTime} min read
        </span>
      </div>

      <Link href={card.href} className="mt-4 block">
        <h3 className="font-sora text-lg font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
          {card.title}
        </h3>
      </Link>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{card.summary}</p>

      <div className="mt-5 flex items-center justify-between border-t border-ink-100/50 pt-4">
        <span className="text-xs text-ink-400">Updated {card.updated}</span>
        {card.related ? (
          <Link
            href={card.related.href}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            {card.related.label} <ArrowUpRight className="h-3 w-3" />
          </Link>
        ) : (
          <Link href={card.href} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
            Read report <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </article>
  );
}

export default function TrendingNow({ cards }: { cards: TrendCard[] }) {
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
              <Radio className="h-3.5 w-3.5 text-brand-600" /> Trend reports
            </p>
            <h2
              id="trending-heading"
              className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
            >
              Trend reports worth reading
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              In depth reports on AI, careers, gaming, security and making money online, each with
              the date it was last updated.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Previous reports"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-brand-600"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Next reports"
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
        {cards.map((card) => (
          <TrendCardView key={card.href} card={card} />
        ))}
        <Link
          href="/trends"
          className="flex w-40 shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl bg-white/80 text-ink-400 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-brand-600"
        >
          <ArrowUpRight className="h-6 w-6" />
          <span className="text-sm font-semibold">All trend reports</span>
        </Link>
      </div>
    </section>
  );
}
