"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ToolIcon } from "@/lib/tool-icons";
import { explorerCategories, explorerTools } from "@/lib/home-data";

const badgeStyles: Record<string, string> = {
  NEW: "bg-emerald-50 text-emerald-600",
  POPULAR: "bg-brand-100 text-brand-700",
  TRENDING: "bg-sky-50 text-sky-600",
  UPDATED: "bg-amber-50 text-amber-600",
  HOT: "bg-rose-50 text-rose-600",
};

export default function ToolExplorer() {
  const [active, setActive] = useState("All");
  // Cards animate in only after the visitor picks a tab, never on first load.
  const [changed, setChanged] = useState(false);

  const visible =
    active === "All" ? explorerTools : explorerTools.filter((t) => t.category === active);

  return (
    <section className="bg-ink-50/40 py-16 overflow-hidden lg:py-20" aria-labelledby="explorer-heading">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">Tool explorer</p>
            <h2
              id="explorer-heading"
              className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
            >
              Find the right tool in seconds
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Every tool is free and runs in your browser. Filter by what you are working on.
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Tool categories"
          className="mt-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {explorerCategories.map((cat) => {
            const isActive = active === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActive(cat);
                  setChanged(true);
                }}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                  isActive ? "bg-ink-950 text-white" : "bg-white/80 text-ink-600 shadow-sm hover:text-ink-900 hover:bg-white"
                }`}
              >
                <span className="relative z-10">{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((tool) => (
              <div key={`${active}-${tool.name}`} className={changed ? "animate-pop-in" : undefined}>
                <Link
                  href={tool.href}
                  className="card card-hover group flex h-full flex-col p-6"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <ToolIcon tool={tool.href} fallback={tool.icon} className="h-5 w-5" />
                    </span>
                    {tool.badge && (
                      <span className={`chip ${badgeStyles[tool.badge]}`}>{tool.badge}</span>
                    )}
                  </div>
                  <h3 className="mt-4 font-sora text-base font-semibold text-ink-900">
                    {tool.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                    {tool.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink-100/50 pt-4">
                    <span className="text-xs font-medium text-ink-400">
                      {tool.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                      Open
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
