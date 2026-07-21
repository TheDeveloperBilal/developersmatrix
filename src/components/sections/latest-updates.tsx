"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, History } from "lucide-react";
import { updates, type UpdateItem } from "@/lib/home-data";

const tabs = ["All", "New", "Updated", "Trending", "Popular"] as const;

const kindStyles: Record<UpdateItem["kind"], string> = {
  New: "bg-emerald-50 text-emerald-600",
  Updated: "bg-amber-50 text-amber-600",
  Trending: "bg-brand-100 text-brand-700",
  Popular: "bg-sky-50 text-sky-600",
};

export default function LatestUpdates() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");

  const visible = updates
    .filter((u) => tab === "All" || u.kind === tab)
    .slice(0, 6);

  return (
    <section className="bg-ink-50/40 py-16 lg:py-20" aria-labelledby="updates-heading">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow">
            <History className="h-3.5 w-3.5 text-brand-600" /> Changelog
          </p>
          <h2
            id="updates-heading"
            className="mt-4 font-sora text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-4xl"
          >
            Always something new to explore
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500">
            New tools ship, guides get refreshed and signals move every week. This feed is the
            pulse of the platform.
          </p>

          <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="Update filters">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t
                    ? "text-white"
                    : "bg-white text-ink-600 ring-1 ring-ink-200 hover:text-ink-900"
                }`}
              >
                {tab === t && (
                  <motion.span
                    layoutId="updates-tab"
                    className="absolute inset-0 rounded-full bg-brand-600"
                    transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{t}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            <motion.ul
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="divide-y divide-ink-100 border-y border-ink-100"
            >
              {visible.map((item) => (
                <li key={item.title}>
                  <Link href={item.href} className="group flex items-center gap-4 py-4">
                    <span className={`chip w-[4.75rem] shrink-0 justify-center ${kindStyles[item.kind]}`}>
                      {item.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-sora text-[0.9375rem] font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-ink-400">{item.meta}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-ink-400 sm:block">{item.date}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
                  </Link>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
