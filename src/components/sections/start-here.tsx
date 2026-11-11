"use client";

import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ToolIcon } from "@/lib/tool-icons";
import { auditLink, looksLikeSite } from "@/lib/audit-link";
import type { CheckableGame } from "@/lib/checkable-games";

/*
 * Start here: the three things most visitors come for, answered from the top
 * of the homepage. Every panel is in the server HTML (inactive ones are only
 * hidden), so its links work for search engines and without JavaScript.
 */

type TabId = "site" | "pc" | "career";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "site", label: "Audit my site", icon: "/tools/website-audit" },
  { id: "pc", label: "Can my PC run it?", icon: "/tools/can-you-run-it" },
  { id: "career", label: "My career", icon: "/tools/ai-resume-builder" },
];

const CAREER = [
  { href: "/tools/ai-resume-builder", title: "Build my resume", text: "ATS friendly, with a check on every bullet" },
  { href: "/tools/ai-cover-letter-generator", title: "Write a cover letter", text: "Shaped around the job posting you paste in" },
  { href: "/tools/ai-interview-simulator", title: "Practice an interview", text: "Common questions with instant feedback" },
];

const field =
  "h-12 w-full min-w-0 rounded-xl border border-ink-200 bg-white px-3.5 text-[0.9375rem] text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100";
const primary =
  "inline-flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-ink-950 px-5 text-sm font-medium text-white transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200";
const quiet = "inline-flex items-center gap-1 text-[0.8125rem] font-medium text-ink-500 transition-colors hover:text-brand-700";

export default function StartHere({ games }: { games: CheckableGame[] }) {
  const router = useRouter();
  const id = useId();
  const [tab, setTab] = useState<TabId>("site");
  const [site, setSite] = useState("");
  const [siteError, setSiteError] = useState<string | null>(null);
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const game = games.find((g) => g.id === gameId);

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
    <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white/90 p-5 shadow-card backdrop-blur-sm sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgba(221,212,254,0.7),transparent)]" />

      <div className="relative">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-brand-600">Start here</p>
        <p className="mt-1.5 font-sora text-lg font-medium text-ink-950">What do you want to do today?</p>

        <div role="tablist" aria-label="Start here" className="mt-4 grid grid-cols-3 gap-1 rounded-2xl bg-ink-50 p-1">
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
                className={`flex min-h-[3.25rem] flex-col items-center justify-center gap-1 rounded-xl px-1.5 py-2 text-center text-[0.75rem] font-medium leading-tight transition-colors sm:flex-row sm:gap-2 sm:text-[0.8125rem] ${
                  on ? "bg-white text-ink-950 shadow-sm" : "text-ink-500 hover:text-ink-900"
                }`}
              >
                <span className={on ? "text-brand-600" : "text-ink-400"}>
                  <ToolIcon tool={t.icon} className="h-4 w-4" />
                </span>
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 min-h-[11.5rem]">
          {/* Website */}
          <div role="tabpanel" id={`${id}-panel-site`} aria-labelledby={`${id}-tab-site`} hidden={tab !== "site"}>
            <form onSubmit={startAudit} action="/tools/website-audit" noValidate>
              <label htmlFor={`${id}-site`} className="text-[0.8125rem] font-medium text-ink-700">
                Your website address
              </label>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
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
                  className={field}
                />
                <button type="submit" className={primary}>
                  Start free audit <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <p id={`${id}-site-help`} className={`mt-2 text-[0.8125rem] ${siteError ? "text-rose-700" : "text-ink-500"}`} aria-live="polite">
                {siteError ?? "Over 70 checks across SEO, speed, security and mobile. Results in about a minute."}
              </p>
            </form>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-100 pt-4">
              <Link href="/tools/ai-crawler-checker" className={quiet}>
                Can AI search read your site? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/services/website-audit" className={quiet}>
                Get an expert audit <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Gaming PC */}
          <div role="tabpanel" id={`${id}-panel-pc`} aria-labelledby={`${id}-tab-pc`} hidden={tab !== "pc"}>
            <label htmlFor={`${id}-game`} className="text-[0.8125rem] font-medium text-ink-700">
              Pick a game
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <select id={`${id}-game`} value={gameId} onChange={(e) => setGameId(e.target.value)} className={`${field} cursor-pointer pr-9`}>
                {games.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <Link href={`/tools/can-you-run-it#game=${gameId}`} className={primary}>
                Check my PC <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-2 text-[0.8125rem] text-ink-500">
              You add your graphics card and processor on the next screen.{" "}
              {game && (
                <Link href={`/tools/can-you-run-it/${game.id}`} className="font-medium text-brand-700 hover:underline">
                  Read the {game.short ?? game.name} specs
                </Link>
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink-100 pt-4">
              <Link href="/tools/fps-calculator" className={quiet}>
                How many FPS will I get? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link href="/tools/bottleneck-calculator" className={quiet}>
                Check for a bottleneck <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Career */}
          <div role="tabpanel" id={`${id}-panel-career`} aria-labelledby={`${id}-tab-career`} hidden={tab !== "career"}>
            <ul className="space-y-1.5">
              {CAREER.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="group flex items-center gap-3 rounded-xl border border-ink-100 px-3.5 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/50"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
                      <ToolIcon tool={c.href} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink-950">{c.title}</span>
                      <span className="block text-[0.8125rem] text-ink-500">{c.text}</span>
                    </span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink-100 pt-4 text-[0.8125rem]">
          <span className="text-ink-400">No signup. Runs in your browser.</span>
          <Link href="/tools" className="inline-flex shrink-0 items-center gap-1 font-medium text-ink-700 hover:text-brand-700">
            All tools <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
