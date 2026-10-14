"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, History } from "lucide-react";
import type { UpdateItem } from "@/lib/home-data";

type Item = UpdateItem & { shown: string };

const kindStyles: Record<UpdateItem["kind"], string> = {
  New: "bg-emerald-50 text-emerald-600",
  Updated: "bg-amber-50 text-amber-600",
};

export default function LatestUpdates({ items }: { items: Item[] }) {
  // Only offer filters for kinds that actually have entries.
  const tabs = ["All", ...(["New", "Updated"] as const).filter((k) => items.some((u) => u.kind === k))];
  const [tab, setTab] = useState<string>("All");
  // The list animates only after a filter is picked, never on first load.
  const [changed, setChanged] = useState(false);

  const visible = items
    .filter((u) => tab === "All" || u.kind === tab)
    .slice(0, 6);

  return (
    <section className="bg-ink-50/40 py-16 overflow-hidden lg:py-20" aria-labelledby="updates-heading">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">
            <History className="h-3.5 w-3.5 text-brand-600" strokeWidth={2} data-draw="" /> Changelog
          </p>
          <h2
            id="updates-heading"
            className="mt-4 font-sora text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl"
          >
            Always something new to explore
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500">
            A dated log of the tools we have built or rebuilt and the guides we have published
            recently.
          </p>

          <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Update filters">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => {
                  setTab(t);
                  setChanged(true);
                }}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                  tab === t
                    ? "bg-brand-600 text-white"
                    : "bg-white/80 text-ink-600 shadow-sm hover:text-ink-900 hover:bg-white"
                }`}
              >
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
            <ul
              key={tab}
              className={`divide-y divide-ink-100/60 ${changed ? "animate-list-in" : ""}`}
            >
              {visible.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="group flex items-center gap-4 py-4">
                    <span className={`chip w-[4.75rem] shrink-0 justify-center ${kindStyles[item.kind]}`}>
                      {item.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-sora text-[0.9375rem] font-semibold text-ink-900 transition-colors group-hover:text-brand-700 sm:truncate">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-400">{item.meta}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-ink-400 sm:block">{item.shown}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
                  </Link>
                </li>
              ))}
            </ul>
        </div>
      </div>
    </section>
  );
}
