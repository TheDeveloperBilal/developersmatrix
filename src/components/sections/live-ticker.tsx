import Link from "next/link";
import { liveTickerItems, type TickerTag } from "@/lib/home-data";

const tagStyles: Record<TickerTag, string> = {
  NEW: "bg-emerald-500 text-white",
  TRENDING: "bg-brand-600 text-white",
  HOT: "bg-rose-500 text-white",
  LATEST: "bg-sky-500 text-white",
  UPDATED: "bg-amber-500 text-white",
};

export default function LiveTicker() {
  const items = [...liveTickerItems, ...liveTickerItems];

  return (
    <section
      aria-label="Live updates"
      className="group relative border-b border-ink-100 bg-ink-950 py-3"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent" />

      <div className="flex items-center">
        <div className="z-20 hidden shrink-0 items-center gap-2 border-r border-white/10 bg-ink-950 py-1 pl-5 pr-4 sm:flex sm:pl-8">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
          </span>
          <span className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-white/90">
            Live
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee gap-8 pr-8 group-hover:[animation-play-state:paused]">
            {items.map((item, i) => (
              <Link
                key={`${item.label}-${i}`}
                href={item.href}
                tabIndex={i >= liveTickerItems.length ? -1 : undefined}
                aria-hidden={i >= liveTickerItems.length}
                className="flex shrink-0 items-center gap-2.5 text-[0.8125rem] font-medium text-white/70 transition-colors hover:text-white"
              >
                <span
                  className={`rounded px-1.5 py-0.5 text-[0.625rem] font-bold tracking-wider ${tagStyles[item.tag]}`}
                >
                  {item.tag}
                </span>
                {item.label}
                <span className="ml-2 h-1 w-1 rounded-full bg-white/20" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
