import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Gauge,
  TrendingUp,
  Flame,
  FileText,
  MessagesSquare,
  Wallet,
} from "lucide-react";
import Reveal from "@/components/reveal";

const quickAccess = [
  { name: "Resume Builder", href: "/tools/ai-resume-builder", icon: FileText, meta: "8.9k created" },
  { name: "Interview Simulator", href: "/tools/ai-interview-simulator", icon: MessagesSquare, meta: "AI scoring" },
  { name: "Budget Planner", href: "/tools/budget-planner", icon: Wallet, meta: "2.8k budgets" },
];

export default function FeaturedGrid() {
  return (
    <section className="py-16 lg:py-20" aria-labelledby="featured-heading">
      <div className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Featured right now</p>
              <h2
                id="featured-heading"
                className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
              >
                What deserves your attention
              </h2>
            </div>
            <Link
              href="/tools"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Browse everything
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          {/* Featured tool — large card */}
          <Reveal className="lg:row-span-2">
            <Link
              href="/tools/website-audit"
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-ink-950 p-8 text-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover sm:p-10"
            >
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl transition-all duration-500 group-hover:bg-brand-600/45"
              />
              <div
                aria-hidden="true"
                className="dot-grid absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle,rgba(255,255,255,0.5)_1px,transparent_1px)]"
              />
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 shadow-[0_10px_24px_-8px_rgba(124,58,237,0.8)]">
                    <Gauge className="h-6 w-6" strokeWidth={1.8} />
                  </span>
                  <span className="chip bg-white/10 text-brand-200 ring-1 ring-white/15">
                    Featured tool
                  </span>
                </div>

                <h3 className="mt-7 font-sora text-2xl font-bold leading-tight tracking-tight sm:text-[1.75rem]">
                  AI Website Audit
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                  The most used tool on the platform. Six dimensions scored in seconds, with a
                  prioritized fix list you can act on the same day.
                </p>

                {/* Score visual */}
                <div className="mt-8 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>Overall health</span>
                    <span className="font-sora text-lg font-bold text-white">
                      78<span className="text-white/40">/100</span>
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {[
                      ["SEO", 85, "bg-emerald-400"],
                      ["Performance", 62, "bg-amber-400"],
                      ["Security", 90, "bg-emerald-400"],
                    ].map(([label, v, color]) => (
                      <div key={label as string} className="flex items-center gap-3">
                        <span className="w-24 text-[0.6875rem] text-white/50">{label}</span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div
                            className={`h-full rounded-full ${color} transition-all duration-700`}
                            style={{ width: `${v}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-[0.6875rem] font-semibold text-white/80">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <p className="text-xs text-white/40">3,400+ audits · 4.8/5</p>
                  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-brand-300">
                    Run free audit
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Trending topic card */}
          <Reveal delay={90}>
            <Link
              href="/gta-6"
              className="card card-hover group flex h-full flex-col justify-between p-6 sm:p-7"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="chip bg-rose-50 text-rose-600">
                    <Flame className="mr-1 h-3 w-3" />
                    Trending topic
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                    +168%
                  </span>
                </div>
                <h3 className="mt-4 font-sora text-xl font-bold leading-snug tracking-tight text-ink-950 transition-colors group-hover:text-brand-700">
                  GTA 6 countdown: 39M pre orders and a $1B first hour
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                  Release locked for Nov 19, 2026. Check if your PC can run it before launch day.
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-ink-100 pt-4">
                <span className="text-xs font-medium text-ink-400">Activity: very high</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Open the hub <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Latest insight with image */}
          <Reveal delay={140} className="lg:row-span-2">
            <Link href="/blog/technical-interview-prep-2026" className="group flex h-full flex-col">
              <article className="card card-hover flex h-full flex-col overflow-hidden !p-0">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src="/images/article-interview.jpg"
                    alt="Developer preparing for a technical interview"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <span className="absolute left-4 top-4 chip bg-white/95 text-ink-800 shadow-sm">
                    Latest insight
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex items-center gap-2.5 text-xs text-ink-400">
                    <span className="chip bg-brand-100 text-brand-700">Career</span>
                    24 min read
                  </p>
                  <h3 className="mt-3 font-sora text-lg font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
                    How to Prepare for Technical Interviews in 2026: From Phone Screen to Offer
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                    A six week preparation plan covering coding patterns, system design and how AI
                    assisted screening changes the game.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600">
                    Read the guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </article>
            </Link>
          </Reveal>

          {/* Quick access stack */}
          <Reveal delay={190}>
            <div className="card flex h-full flex-col p-6 sm:p-7">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                Quick access
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {quickAccess.map((tool) => (
                  <li key={tool.name}>
                    <Link
                      href={tool.href}
                      className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-brand-100 hover:bg-brand-50/60"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                        <tool.icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-ink-900">{tool.name}</span>
                        <span className="block text-xs text-ink-400">{tool.meta}</span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/tools"
                className="mt-4 inline-flex items-center gap-1.5 border-t border-ink-100 pt-4 text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                All 20+ tools <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
