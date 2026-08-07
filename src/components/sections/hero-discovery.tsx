"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  FileText,
  Gauge,
  ScanSearch,
  TrendingUp,
  Sparkles,
  Activity,
} from "lucide-react";

function useCountUp(target: number, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(parseFloat((target * eased).toFixed(decimals)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { ref, value };
}

function Stat({ value, suffix, label, decimals = 0 }: { value: number; suffix: string; label: string; decimals?: number }) {
  const { ref, value: v } = useCountUp(value, 1400, decimals);
  return (
    <div>
      <p className="font-sora text-2xl font-bold tracking-tight text-ink-950 sm:text-[1.7rem]">
        <span ref={ref}>{decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()}</span>
        <span className="text-brand-600">{suffix}</span>
      </p>
      <p className="mt-0.5 text-xs font-medium text-ink-400">{label}</p>
    </div>
  );
}

const sparkPoints = [8, 14, 11, 20, 18, 28, 24, 36, 33, 46, 44, 58];
const sparkPath = sparkPoints
  .map((v, i) => `${i === 0 ? "M" : "L"}${(i * 100) / (sparkPoints.length - 1)},${60 - v}`)
  .join(" ");

export default function HeroDiscovery() {
  return (
    <section className="relative overflow-hidden bg-ink-50/50">
      <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_0%,black,transparent)]" />
      <div aria-hidden="true" className="absolute -top-40 right-0 h-96 w-[40rem] rounded-full bg-brand-100/60 blur-3xl" />

      <div className="shell relative grid items-center gap-16 py-16 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:py-24 overflow-hidden">
        {/* Copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            AI tools + trend radar + guides — updated daily
          </div>

          <h1 className="mt-6 font-sora text-[2.6rem] font-bold leading-[1.06] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.5rem]">
            20+ Free AI Tools for{" "}
            <span className="text-brand-600">Developers, Marketers</span> & Career Builders
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
            DevelopersMatrix combines 20+ free AI tools, a live technology trend radar and
            practical career guides into one platform — everything free, everything in your
            browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link href="/tools" className="btn-primary">
              Explore the platform <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/tools/website-audit" className="btn-secondary">
              <Gauge className="h-4 w-4 text-brand-600" />
              Run a free audit
            </Link>
          </div>

          <div className="mt-10 flex gap-10 border-t border-ink-100/40 pt-6">
            <Stat value={20} suffix="+" label="Free AI tools" />
            <Stat value={3400} suffix="+" label="Websites audited" />
            <Stat value={4.8} suffix="/5" label="User rating" decimals={1} />
          </div>
        </div>

        {/* Visual composition */}
        <div className="relative mx-auto w-full max-w-[34rem] animate-fade-up [animation-delay:120ms] lg:max-w-none">
          {/* Main dashboard card */}
          <div className="card relative z-10 mx-auto w-full max-w-md !rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                <Activity className="h-3.5 w-3.5 text-brand-600" />
                Trend radar · Today
              </p>
              <span className="chip bg-emerald-50 text-emerald-600">
                <span className="mr-1 h-1 w-1 animate-pulse-dot rounded-full bg-emerald-500" />
                Live
              </span>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="font-sora text-[1.05rem] font-bold leading-snug text-ink-950">
                  AI agents in workflows
                </p>
                <p className="mt-1 text-xs text-ink-400">Search interest · 30 days</p>
              </div>
              <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-sm font-bold text-emerald-600">
                <TrendingUp className="h-4 w-4" />
                +214%
              </span>
            </div>

            <svg viewBox="0 0 100 60" className="mt-4 h-24 w-full" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${sparkPath} L100,60 L0,60 Z`} fill="url(#sparkFill)" />
              <path d={sparkPath} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <circle cx="100" cy="2" r="3.5" fill="#7c3aed" />
            </svg>

            <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 rounded-xl bg-white/5 py-3 text-center backdrop-blur-sm">
              {[
                ["86", "Signals tracked"],
                ["12", "Rising today"],
                ["4", "Hot topics"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-sora text-base font-bold text-ink-900">{v}</p>
                  <p className="mt-0.5 text-[0.625rem] font-medium uppercase tracking-wider text-ink-400">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating card: website audit */}
          <Link href="/tools/website-audit" className="card absolute -right-2 -top-10 z-20 hidden w-52 !rounded-xl p-4 animate-[float_6s_ease-in-out_infinite] transition-all hover:shadow-lg hover:-translate-y-1 sm:block lg:-right-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Gauge className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-900">Website Audit</p>
                <p className="text-[0.625rem] font-medium text-emerald-600">POPULAR</p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full w-[78%] rounded-full bg-brand-500" />
              </div>
              <span className="text-xs font-bold text-ink-900">78</span>
            </div>
          </Link>

          {/* Floating card: resume builder */}
          <Link href="/tools/ai-resume-builder" className="card absolute -left-2 top-1/2 z-20 hidden w-48 !rounded-xl p-4 animate-[float_7s_ease-in-out_1s_infinite] transition-all hover:shadow-lg hover:-translate-y-1 sm:block lg:-left-10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <FileText className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-900">Resume Builder</p>
                <p className="text-[0.625rem] font-medium text-ink-400">8.9k created</p>
              </div>
            </div>
          </Link>

          {/* Floating chip: new tool */}
          <Link href="/tools/ai-content-detector" className="card absolute -bottom-6 right-8 z-20 hidden items-center gap-2.5 !rounded-full py-2.5 pl-3 pr-4 animate-[float_5s_ease-in-out_0.5s_infinite] transition-all hover:shadow-lg sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <ScanSearch className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
            <p className="text-xs font-semibold text-ink-800">
              AI Content Detector <span className="font-bold text-emerald-600">NEW</span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
