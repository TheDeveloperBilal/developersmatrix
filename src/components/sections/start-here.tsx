"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, Lock } from "lucide-react";
import { ToolIcon } from "@/lib/tool-icons";
import { auditLink, looksLikeSite } from "@/lib/audit-link";
import type { CheckableGame } from "@/lib/checkable-games";

/*
 * Start here: a small launch console for the three things most visitors come
 * for. Each mode has a quiet animated preview of what the tool does. Every
 * panel is in the server HTML (inactive ones are only hidden), so all links
 * work for search engines and without JavaScript.
 *
 * All motion is CSS on transform and opacity, so it runs off the main thread,
 * and it stops completely for visitors who ask for reduced motion.
 */

type TabId = "site" | "pc" | "career";

const TABS: { id: TabId; n: string; label: string; icon: string }[] = [
  { id: "site", n: "01", label: "Website", icon: "/tools/website-audit" },
  { id: "pc", n: "02", label: "Gaming PC", icon: "/tools/can-you-run-it" },
  { id: "career", n: "03", label: "Career", icon: "/tools/ai-resume-builder" },
];

// The audit groups shown in the preview. The bars show scan progress, not scores.
const SCAN = ["SEO", "Speed", "Security", "Mobile", "Accessibility"];

const SPECS = [
  { label: "Processor", short: "CPU" },
  { label: "Graphics card", short: "GPU" },
  { label: "Memory", short: "RAM" },
];

const CAREER = [
  { href: "/tools/ai-resume-builder", title: "Build my resume", text: "ATS friendly, with a check on every bullet" },
  { href: "/tools/ai-cover-letter-generator", title: "Write a cover letter", text: "Shaped around the job posting you paste in" },
  { href: "/tools/ai-interview-simulator", title: "Practice an interview", text: "Common questions with instant feedback" },
];

const MOTION_CSS = `
@keyframes sh-spin { to { transform: rotate(360deg); } }
@keyframes sh-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes sh-fill { 0%, 6% { transform: scaleX(0); } 26%, 84% { transform: scaleX(1); } 94%, 100% { transform: scaleX(0); } }
@keyframes sh-tick { 0%, 24% { opacity: 0; transform: scale(.5); } 30%, 84% { opacity: 1; transform: scale(1); } 92%, 100% { opacity: 0; transform: scale(.5); } }
@keyframes sh-sweep { 0% { transform: translateY(-120%); } 100% { transform: translateY(520%); } }
@keyframes sh-seg { 0%, 100% { opacity: .18; } 40%, 70% { opacity: 1; } }
@keyframes sh-draw { 0%, 8% { transform: scaleX(0); } 30%, 86% { transform: scaleX(1); } 96%, 100% { transform: scaleX(0); } }
@keyframes sh-blink { 50% { opacity: 0; } }
.sh-ring { animation: sh-spin 9s linear infinite; }
.sh-panel { animation: sh-in .35s ease-out both; }
.sh-fill { transform-origin: left; animation: sh-fill 7s cubic-bezier(.4,0,.2,1) infinite; }
.sh-tick { animation: sh-tick 7s ease-out infinite; }
.sh-sweep { animation: sh-sweep 3.5s linear infinite; }
.sh-seg { animation: sh-seg 2.4s ease-in-out infinite; }
.sh-draw { transform-origin: left; animation: sh-draw 6s cubic-bezier(.4,0,.2,1) infinite; }
.sh-blink { animation: sh-blink 1.1s steps(1) infinite; }
@media (prefers-reduced-motion: reduce) {
  .sh-ring, .sh-panel, .sh-sweep, .sh-blink { animation: none; }
  .sh-fill, .sh-draw { animation: none; transform: scaleX(1); }
  .sh-tick { animation: none; opacity: 1; transform: none; }
  .sh-seg { animation: none; opacity: .8; }
}
`;

const mono = "font-mono text-[0.6875rem] uppercase tracking-[0.14em]";
const action =
  "inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-white px-5 text-sm font-semibold text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_30px_-10px_rgba(167,139,250,0.7)] transition hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-400/40";
const quiet = "inline-flex items-center gap-1 text-[0.8125rem] text-white/55 transition-colors hover:text-white";

export default function StartHere({ games }: { games: CheckableGame[] }) {
  const router = useRouter();
  const id = useId();
  const [tab, setTab] = useState<TabId>("site");
  const [site, setSite] = useState("");
  const [siteError, setSiteError] = useState<string | null>(null);
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const game = games.find((g) => g.id === gameId);
  const index = TABS.findIndex((t) => t.id === tab);
  const host = site.trim().replace(/^https?:\/\//i, "").replace(/\/.*$/, "");

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + TABS.length) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const startAudit = (e: FormEvent) => {
    e.preventDefault();
    if (!looksLikeSite(site)) {
      setSiteError("Type an address like yourbusiness.com");
      return;
    }
    router.push(auditLink(site));
  };

  return (
    <div className="relative w-full min-w-0">
      <style>{MOTION_CSS}</style>
      {/* Soft glow under the console */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_70%_30%,rgba(139,92,246,0.28),transparent_70%)] blur-2xl" />

      {/* A thin band of light travels round the edge */}
      <div className="relative overflow-hidden rounded-[1.75rem] p-px">
        <div aria-hidden="true" className="absolute inset-0 bg-white/10" />
        <div
          aria-hidden="true"
          className="sh-ring absolute left-1/2 top-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0_62%,rgba(167,139,250,0.95)_74%,rgba(52,211,153,0.8)_82%,transparent_92%)]"
        />

        <div className="relative overflow-hidden rounded-[calc(1.75rem-1px)] bg-ink-950 text-white">
          <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:18px_18px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.45),transparent)]" />

          {/* Window bar */}
          <div className="relative flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-brand-400/80" />
            </div>
            <p className={`${mono} text-white/45`}>
              Start here<span className="sh-blink ml-0.5 text-brand-300" aria-hidden="true">_</span>
            </p>
            <span className={`${mono} hidden text-white/30 sm:inline`} aria-hidden="true">
              3 modes
            </span>
          </div>

          <div className="relative p-5 sm:p-6">
            {/* Mode switch with a sliding indicator */}
            <div role="tablist" aria-label="What do you want to do?" className="relative grid grid-cols-3 rounded-2xl bg-white/[0.05] p-1 ring-1 ring-inset ring-white/[0.06]">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-xl bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 ease-out motion-reduce:transition-none"
                style={{ transform: `translateX(${index * 100}%)` }}
              />
              {TABS.map((t, i) => {
                const on = tab === t.id;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${id}-tab-${t.id}`}
                    aria-selected={on}
                    aria-controls={`${id}-panel-${t.id}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setTab(t.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`relative z-10 flex min-h-[3rem] items-center justify-center gap-2 rounded-xl px-2 text-[0.8125rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${
                      on ? "text-white" : "text-white/50 hover:text-white/80"
                    }`}
                  >
                    <span className={`hidden font-mono text-[0.625rem] sm:inline ${on ? "text-brand-300" : "text-white/30"}`}>{t.n}</span>
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 min-h-[17.5rem]">
              {/* 01 Website */}
              <div role="tabpanel" id={`${id}-panel-site`} aria-labelledby={`${id}-tab-site`} hidden={tab !== "site"} className={tab === "site" ? "sh-panel" : undefined}>
                <p className="font-sora text-lg font-medium leading-snug">Audit any website in about a minute</p>
                <form onSubmit={startAudit} action="/tools/website-audit" noValidate className="mt-4">
                  <label htmlFor={`${id}-site`} className="sr-only">
                    Your website address
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div
                      className={`flex h-12 w-full min-w-0 items-center gap-2 rounded-xl sm:flex-1 bg-white/[0.06] px-3.5 ring-1 ring-inset transition focus-within:bg-white/[0.09] focus-within:ring-brand-300/70 ${
                        siteError ? "ring-rose-400/70" : "ring-white/10"
                      }`}
                    >
                      <Lock className="h-3.5 w-3.5 shrink-0 text-emerald-300/80" aria-hidden="true" />
                      <span className="shrink-0 font-mono text-[0.8125rem] text-white/35" aria-hidden="true">
                        https://
                      </span>
                      <input
                        id={`${id}-site`}
                        type="text"
                        inputMode="url"
                        autoComplete="url"
                        spellCheck={false}
                        value={site}
                        onChange={(e) => {
                          setSite(e.target.value);
                          if (siteError) setSiteError(null);
                        }}
                        placeholder="yourbusiness.com"
                        aria-invalid={!!siteError}
                        aria-describedby={`${id}-site-help`}
                        className="h-full min-w-0 flex-1 bg-transparent font-mono text-[0.875rem] text-white outline-none placeholder:text-white/30"
                      />
                    </div>
                    <button type="submit" className={action}>
                      Run audit <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <p id={`${id}-site-help`} className={`mt-2 text-[0.75rem] ${siteError ? "text-rose-300" : "text-white/45"}`} aria-live="polite">
                    {siteError ?? "Free. No signup. You get a fix list ranked by impact."}
                  </p>
                </form>

                {/* Preview of the scan */}
                <div className="relative mt-4 overflow-hidden rounded-xl bg-black/30 px-4 py-3 ring-1 ring-inset ring-white/[0.06]" aria-hidden="true">
                  <div className="sh-sweep pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-transparent via-brand-400/[0.12] to-transparent" />
                  <div className={`${mono} mb-2 flex justify-between gap-3 text-white/35`}>
                    <span className="min-w-0 truncate">Scanning {host || "yourbusiness.com"}</span>
                    <span className="shrink-0">70+ checks</span>
                  </div>
                  <ul className="space-y-1.5">
                    {SCAN.map((s, i) => (
                      <li key={s} className="grid grid-cols-[6.5rem_1fr_1rem] items-center gap-3">
                        <span className="text-[0.75rem] text-white/60">{s}</span>
                        <span className="h-1 overflow-hidden rounded-full bg-white/[0.07]">
                          <span
                            className="sh-fill block h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-300"
                            style={{ animationDelay: `${i * 0.45}s` }}
                          />
                        </span>
                        <Check className="sh-tick h-3.5 w-3.5 text-emerald-300" style={{ animationDelay: `${i * 0.45}s` }} />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  <Link href="/tools/ai-crawler-checker" className={quiet}>
                    Can AI search read your site? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link href="/services/website-audit" className={quiet}>
                    Get an expert audit <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* 02 Gaming PC */}
              <div role="tabpanel" id={`${id}-panel-pc`} aria-labelledby={`${id}-tab-pc`} hidden={tab !== "pc"} className={tab === "pc" ? "sh-panel" : undefined}>
                <p className="font-sora text-lg font-medium leading-snug">Will your PC run it?</p>
                <label htmlFor={`${id}-game`} className="sr-only">
                  Pick a game
                </label>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <select
                    id={`${id}-game`}
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="h-12 w-full min-w-0 cursor-pointer rounded-xl sm:flex-1 bg-white/[0.06] px-3.5 text-[0.9375rem] text-white outline-none ring-1 ring-inset ring-white/10 transition [color-scheme:dark] focus:bg-white/[0.09] focus:ring-brand-300/70"
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id} className="bg-ink-900 text-white">
                        {g.name}
                      </option>
                    ))}
                  </select>
                  <Link href={`/tools/can-you-run-it#game=${gameId}`} className={action}>
                    Check my PC <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
                <p className="mt-2 text-[0.75rem] text-white/45">
                  Add your parts on the next screen.{" "}
                  {game && (
                    <Link href={`/tools/can-you-run-it/${game.id}`} className="text-brand-300 hover:text-brand-200 hover:underline">
                      Read the {game.short ?? game.name} specs
                    </Link>
                  )}
                </p>

                {/* Preview: your parts against the publisher's list */}
                <div className="mt-4 rounded-xl bg-black/30 px-4 py-3 ring-1 ring-inset ring-white/[0.06]" aria-hidden="true">
                  <div className={`${mono} mb-2.5 flex justify-between gap-3 text-white/35`}>
                    <span className="min-w-0 truncate">What gets compared</span>
                    <span className="shrink-0">Official specs</span>
                  </div>
                  <ul className="space-y-2">
                    {SPECS.map((s, row) => (
                      <li key={s.short} className="grid grid-cols-[2.5rem_1fr] items-center gap-3">
                        <span className="font-mono text-[0.6875rem] text-white/55">{s.short}</span>
                        <span className="grid grid-cols-12 gap-[3px]">
                          {Array.from({ length: 12 }, (_, i) => (
                            <span
                              key={i}
                              className={`sh-seg h-2 rounded-[2px] ${i < 8 ? "bg-emerald-300" : i < 10 ? "bg-amber-300" : "bg-white/40"}`}
                              style={{ animationDelay: `${row * 0.3 + i * 0.07}s` }}
                            />
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  <Link href="/tools/fps-calculator" className={quiet}>
                    How many FPS will I get? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link href="/tools/bottleneck-calculator" className={quiet}>
                    Check for a bottleneck <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* 03 Career */}
              <div role="tabpanel" id={`${id}-panel-career`} aria-labelledby={`${id}-tab-career`} hidden={tab !== "career"} className={tab === "career" ? "sh-panel" : undefined}>
                <p className="font-sora text-lg font-medium leading-snug">Get ready for the next job</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-[7.5rem_1fr]">
                  {/* Preview: a page writing itself */}
                  <div className="hidden rounded-xl bg-white px-3 py-3 shadow-[0_10px_30px_-12px_rgba(167,139,250,0.6)] sm:block" aria-hidden="true">
                    <span className="block h-2 w-2/3 rounded bg-ink-900" />
                    <span className="mt-1 block h-1 w-1/2 rounded bg-ink-300" />
                    {[92, 80, 86, 64, 74, 58].map((w, i) => (
                      <span key={i} className="mt-2 block h-1 rounded bg-ink-100">
                        <span className="sh-draw block h-full rounded bg-brand-400/70" style={{ width: `${w}%`, animationDelay: `${i * 0.35}s` }} />
                      </span>
                    ))}
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[0.5625rem] font-semibold text-emerald-700">
                      <Check className="h-2.5 w-2.5" /> ATS
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {CAREER.map((c, i) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="group flex items-center gap-3 rounded-xl bg-white/[0.04] px-3.5 py-2.5 ring-1 ring-inset ring-white/[0.06] transition hover:bg-white/[0.08] hover:ring-brand-300/40"
                        >
                          <span className="font-mono text-[0.625rem] text-white/30">0{i + 1}</span>
                          <span className="text-brand-300">
                            <ToolIcon tool={c.href} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium text-white">{c.title}</span>
                            <span className="block text-[0.75rem] text-white/45">{c.text}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 shrink-0 text-white/25 transition group-hover:translate-x-0.5 group-hover:text-brand-300" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
              <span className={`${mono} text-white/30`}>No signup · in your browser</span>
              <Link href="/tools" className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] font-medium text-white/70 hover:text-white">
                All tools <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
