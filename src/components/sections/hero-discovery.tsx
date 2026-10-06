import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Gauge,
  ScanSearch,
  Sparkles,
  Newspaper,
} from "lucide-react";

type LatestTrend = { title: string; href: string; category: string; updated: string };

// Numbers are rendered as real values on the server. The old count up started
// at 0, so search engines and anyone without JavaScript saw "0+ Free AI tools".
function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-sora text-2xl font-bold tracking-tight text-ink-950 sm:text-[1.7rem]">
        {value.toLocaleString()}
      </p>
      <p className="mt-0.5 text-xs font-medium text-ink-400">{label}</p>
    </div>
  );
}

export default function HeroDiscovery({
  toolCount,
  guideCount,
  trendCount,
  trendCategoryCount,
  latestTrends,
}: {
  toolCount: number;
  guideCount: number;
  trendCount: number;
  trendCategoryCount: number;
  latestTrends: LatestTrend[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink-50/50">
      <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_0%,black,transparent)]" />
      <div aria-hidden="true" className="absolute -top-40 right-0 h-96 w-[40rem] rounded-full bg-brand-100/60 blur-3xl" />

      <div className="shell relative grid items-center gap-16 py-16 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:py-24 overflow-hidden">
        {/* Copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Free tools, trend reports and practical guides
          </div>

          <h1 className="mt-6 font-sora text-[2.6rem] font-bold leading-[1.06] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.5rem]">
            Free AI Tools for{" "}
            <span className="text-brand-600">Developers, Marketers</span> & Career Builders
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
            DevelopersMatrix brings together {toolCount} free tools, {trendCount} in depth trend
            reports and {guideCount} practical guides. Everything is free and runs in your browser,
            with no signup.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link href="/tools" className="btn-primary">
              Explore the tools <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/tools/website-audit" className="btn-secondary">
              <Gauge className="h-4 w-4 text-brand-600" />
              Run a free audit
            </Link>
          </div>

          <div className="mt-10 flex gap-8 border-t sm:gap-10 border-ink-100/40 pt-6">
            <Stat value={toolCount} label="Free tools" />
            <Stat value={guideCount} label="Guides published" />
            <Stat value={trendCount} label="Trend reports" />
          </div>
        </div>

        {/* Visual composition */}
        <div className="relative mx-auto w-full max-w-[34rem] animate-fade-up [animation-delay:120ms] lg:max-w-none">
          {/* Latest trend reports card */}
          <div className="card relative z-10 mx-auto w-full max-w-md !rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                <Newspaper className="h-3.5 w-3.5 text-brand-600" />
                Recently updated reports
              </p>
            </div>

            <ul className="mt-4 divide-y divide-ink-100/60">
              {latestTrends.map((t) => (
                <li key={t.href}>
                  <Link href={t.href} className="group flex items-start justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block font-sora text-[0.95rem] font-bold leading-snug text-ink-950 transition-colors group-hover:text-brand-700">
                        {t.title}
                      </span>
                      <span className="mt-1 block text-xs text-ink-400">
                        {t.category} · Updated {t.updated}
                      </span>
                    </span>
                    <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover:text-brand-600" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-3 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-white/5 py-3 text-center backdrop-blur-sm">
              {[
                [String(trendCount), "Trend reports"],
                [String(trendCategoryCount), "Topics"],
                [String(guideCount), "Guides"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-sora text-base font-bold text-ink-900">{v}</p>
                  <p className="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wider text-ink-400">{l}</p>
                </div>
              ))}
            </div>
            <Link href="/trends" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700">
              All trend reports <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Floating card: website audit */}
          <Link href="/tools/website-audit" className="card absolute -right-2 -top-10 z-20 hidden w-52 !rounded-xl p-4 animate-[float_6s_ease-in-out_infinite] transition-all hover:shadow-lg hover:-translate-y-1 sm:block lg:-right-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Gauge className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-900">Website Audit</p>
                <p className="text-[0.625rem] font-medium text-emerald-600">Around 150 checks</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-[78%] rounded-full bg-brand-500" />
              </div>
              <span className="text-[0.625rem] font-medium text-ink-400">Sample</span>
            </div>
          </Link>

          {/* Floating chip: content detector */}
          <Link href="/tools/ai-content-detector" className="card absolute -bottom-6 right-8 z-20 hidden items-center gap-2.5 !rounded-full py-2.5 pl-3 pr-4 animate-[float_5s_ease-in-out_0.5s_infinite] transition-all hover:shadow-lg sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ScanSearch className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <p className="text-xs font-semibold text-ink-800">
              AI Content Detector <span className="font-bold text-emerald-600">Free</span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
