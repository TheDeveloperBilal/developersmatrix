"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Answer = "yes" | "no" | "unsure";

const STUDY = "/blog/small-business-website-statistics-2026";

// Every number below comes from the published study (STUDY). Do not add a
// figure here that the study page does not show.
const CHECKS: { id: string; tag: string; label: string; question: string; share: number; yes: string; no: string }[] = [
  { id: "dmarc", tag: "DM", label: "DMARC record", question: "Does your domain have a DMARC record?", share: 0.52, yes: "Like 52% of local businesses", no: "With the 48% that have none" },
  { id: "hsts", tag: "HS", label: "HSTS header", question: "Does your site send an HSTS security header?", share: 0.38, yes: "Like 38% of local sites", no: "With the 62% that do not" },
  { id: "meta", tag: "MD", label: "Meta description", question: "Does your homepage have a meta description?", share: 0.75, yes: "Like 75% of local homepages", no: "With the 25% that have none" },
  { id: "schema", tag: "SD", label: "Structured data", question: "Does your site have structured data (schema)?", share: 0.76, yes: "Like 76% of local sites", no: "With the 24% that have none" },
  { id: "speed", tag: "PS", label: "PageSpeed 90+", question: "Does your homepage score 90 or more on Google's mobile PageSpeed test?", share: 0.08, yes: "Only 8% of local homepages do", no: "With the 92% below 90. The median was 62" },
];

// The average local site has the sum of the five shares, about 2.5 of 5.
// The checks used slightly different samples, so the page says "about".
const AVERAGE = CHECKS.reduce((n, c) => n + c.share, 0);

const OPTIONS: { value: Answer; label: string; on: string }[] = [
  { value: "yes", label: "Yes", on: "text-emerald-700" },
  { value: "no", label: "No", on: "text-rose-700" },
  { value: "unsure", label: "Not sure", on: "text-ink-900" },
];

export default function SiteCompare() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const values = Object.values(answers);
  const yes = values.filter((a) => a === "yes").length;
  const unsure = values.filter((a) => a === "unsure").length;
  const total = CHECKS.length;

  return (
    <div className="flex min-w-0 flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sora text-lg font-medium text-ink-950">How does your site compare?</h3>
        <Link
          href={STUDY}
          className="shrink-0 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-[0.6875rem] text-brand-700 hover:bg-brand-100"
        >
          2026 study
        </Link>
      </div>

      {/* Live bar: your yes count against the average local site in the study. */}
      <div className="mt-5" aria-live="polite">
        <div className="mb-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-ink-500">
          <span>
            You have <b className="font-semibold text-ink-900">{yes}</b> of {total}
            {unsure > 0 ? `, not sure about ${unsure}` : ""}
          </span>
          <span>Local sites average about {AVERAGE.toFixed(1)}</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-ink-50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-[width] duration-500"
            style={{ width: `${(yes / total) * 100}%` }}
          />
          <div
            aria-hidden="true"
            className="absolute -top-1.5 h-[1.375rem] w-0.5 rounded bg-ink-700"
            style={{ left: `${(AVERAGE / total) * 100}%` }}
          />
        </div>
        <p aria-hidden="true" className="relative mt-1.5 h-4 text-[0.6875rem] text-ink-400">
          <span className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${(AVERAGE / total) * 100}%` }}>
            Average site
          </span>
        </p>
        <p className="mt-1 text-[0.6875rem] text-ink-400">Based on your answers, not a scan of your site.</p>
      </div>

      <ul className="mt-5">
        {CHECKS.map((c) => {
          const a = answers[c.id];
          return (
            <li key={c.id} className="border-t border-ink-100/70 py-3">
              <fieldset className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
                <legend className="sr-only">{c.question}</legend>
                <span
                  aria-hidden="true"
                  className="hidden h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 font-sora text-[0.6875rem] font-medium text-brand-600 sm:grid"
                >
                  {c.tag}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink-900" title={c.question}>
                    {c.label}
                  </span>
                  <span className="block text-xs text-ink-400 sm:min-h-[1rem]">
                    {a === "yes" ? c.yes : a === "no" ? c.no : a === "unsure" ? "The free audit checks this" : ""}
                  </span>
                </span>
                <span className="inline-flex w-fit shrink-0 rounded-xl bg-ink-50 p-[3px]">
                  {OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-xs font-medium sm:px-2.5 sm:py-1.5 transition-colors focus-within:ring-2 focus-within:ring-brand-200 ${
                        a === o.value ? `bg-white shadow-sm ${o.on}` : "text-ink-500 hover:text-ink-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`compare-${c.id}`}
                        value={o.value}
                        checked={a === o.value}
                        onChange={() => setAnswers((prev) => ({ ...prev, [c.id]: o.value }))}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  ))}
                </span>
              </fieldset>
            </li>
          );
        })}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
        <Link
          href="/tools/website-audit"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-ink-950 px-4 text-[0.8125rem] font-medium text-white transition-colors hover:bg-ink-800"
        >
          Check my site for real <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
        <Link href={STUDY} className="text-[0.8125rem] text-ink-500 hover:text-brand-700">
          See the study
        </Link>
      </div>
    </div>
  );
}
