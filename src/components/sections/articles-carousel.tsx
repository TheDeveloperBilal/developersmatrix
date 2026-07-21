"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { articles } from "@/lib/home-data";

export default function ArticlesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    el?.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el?.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollBy = (dir: number) => {
    trackRef.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <section className="bg-ink-50/40 py-16 lg:py-20" aria-labelledby="articles-heading">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Editorial</p>
            <h2
              id="articles-heading"
              className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
            >
              Fresh from the publication
            </h2>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/blog"
              className="group mr-2 hidden items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:inline-flex"
            >
              All articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              aria-label="Previous articles"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition-all hover:border-brand-300 hover:text-brand-600 disabled:opacity-35 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              aria-label="Next articles"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 bg-white text-ink-700 transition-all hover:border-brand-300 hover:text-brand-600 disabled:opacity-35 disabled:hover:border-ink-200 disabled:hover:text-ink-700"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 [&::-webkit-scrollbar]:hidden lg:px-[max(2rem,calc((100vw-76rem)/2+2rem))]"
      >
        {articles.map((article) => (
          <Link
            key={article.title}
            href={article.href}
            className="group w-[19.5rem] shrink-0 snap-start sm:w-[22rem]"
          >
            <article className="card card-hover flex h-full flex-col overflow-hidden !p-0">
              <div className="relative h-44 overflow-hidden sm:h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 80vw, 22rem"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="flex items-center gap-2.5 text-xs text-ink-400">
                  <span className={`chip ${article.categoryStyle}`}>{article.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {article.readTime}
                  </span>
                </p>
                <h3 className="mt-3 flex-1 font-sora text-[1.05rem] font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-500">
                  {article.description}
                </p>
                <p className="mt-4 border-t border-ink-100 pt-3.5 text-xs font-medium text-ink-400">
                  {article.updated}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
