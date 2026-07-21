"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { goals } from "@/lib/home-data";

export default function ExploreByGoal() {
  const [activeId, setActiveId] = useState(goals[2].id); // default: Build my career
  const active = goals.find((g) => g.id === activeId)!;

  return (
    <section className="relative overflow-hidden bg-ink-950 py-16 lg:py-24" aria-labelledby="goal-heading">
      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,rgba(255,255,255,0.6)_1px,transparent_1px)]"
      />
      <div aria-hidden="true" className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-800/30 blur-3xl" />

      <div className="shell relative">
        <div className="max-w-2xl">
          <p className="eyebrow !text-white/40 before:!bg-white/25">
            <Compass className="h-3.5 w-3.5 text-brand-400" /> Explore by goal
          </p>
          <h2
            id="goal-heading"
            className="mt-4 font-sora text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Tell us what you want to achieve
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            Most sites organize around what they built. We organize around what you need. Pick a
            goal and get a focused set of tools and content for it.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
          {/* Goal picker */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:content-start">
            {goals.map((goal) => {
              const isActive = goal.id === activeId;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setActiveId(goal.id)}
                  aria-pressed={isActive}
                  className={`group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-ink-950"
                      : "bg-white/5 text-white/70 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="goal-active"
                      className="absolute inset-0 rounded-xl bg-white"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span
                    className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isActive ? "bg-brand-600 text-white" : "bg-white/10 text-brand-300"
                    }`}
                  >
                    <goal.icon className="h-4 w-4" strokeWidth={1.9} />
                  </span>
                  <span className="relative">{goal.label}</span>
                </button>
              );
            })}
          </div>

          {/* Result panel */}
          <div className="relative min-h-[24rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9"
              >
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                  I want to {active.label.toLowerCase()}
                </p>
                <h3 className="mt-2.5 font-sora text-2xl font-bold tracking-tight text-ink-950">
                  {active.headline}
                </h3>

                <ul className="mt-7 space-y-2.5">
                  {active.tools.map((tool, i) => (
                    <motion.li
                      key={tool.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.07 }}
                    >
                      <Link
                        href={tool.href}
                        className="group flex items-center gap-4 rounded-2xl border border-ink-100 p-4 transition-all hover:border-brand-200 hover:bg-brand-50/50"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                          <tool.icon className="h-5 w-5" strokeWidth={1.8} />
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-bold text-ink-900">{tool.name}</span>
                          <span className="block text-xs text-ink-400">{tool.note}</span>
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2.5 border-t border-ink-100 pt-5">
                  {active.content.map((c) => (
                    <Link
                      key={c.label}
                      href={c.href}
                      className="inline-flex items-center gap-2 rounded-full bg-ink-50 px-3.5 py-2 text-xs font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      <span className="chip bg-white text-ink-400 ring-1 ring-ink-200">{c.type}</span>
                      {c.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-12px_rgba(255,255,255,0.3)]"
          >
            Or browse the full platform <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
