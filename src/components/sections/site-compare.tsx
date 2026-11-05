"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ToolIcon } from "@/lib/tool-icons";

type Answer = "yes" | "no" | "unsure";

const STUDY = "/blog/small-business-website-statistics-2026";

// Every number below is taken from the published study (STUDY). Do not add a
// figure here that the study page does not show.
const QUESTIONS: { id: string; q: string; yes: string; no: string }[] = [
  {
    id: "dmarc",
    q: "Does your domain have a DMARC record?",
    yes: "You are with the 52% of businesses in our study that have one.",
    no: "You are with the 48% that have none, which makes it easier for scammers to send email in your name.",
  },
  {
    id: "hsts",
    q: "Does your site send an HSTS security header?",
    yes: "You are in the 38% that send it.",
    no: "You are with the 62% that do not. It tells browsers to always use the secure version of your site.",
  },
  {
    id: "meta",
    q: "Does your homepage have a meta description?",
    yes: "75% of the homepages we checked have one, so you are with most sites.",
    no: "You are with the 25% that have none, so Google writes your search snippet for you.",
  },
  {
    id: "schema",
    q: "Does your site have structured data (schema)?",
    yes: "You are with the 76% that have some.",
    no: "You are with the 24% that have none, so search engines get no machine readable business details.",
  },
  {
    id: "speed",
    q: "Does your homepage score 90 or more on Google's mobile PageSpeed test?",
    yes: "Only 8% of the homepages we tested did that. You are ahead of almost all of them.",
    no: "You are with the 92% below 90. The median in our study was 62.",
  },
];

const UNSURE = "Most owners are not sure about this one. The free audit checks it for you.";

const OPTIONS: { value: Answer; label: string }[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export default function SiteCompare() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const answered = Object.keys(answers).length;
  const yes = Object.values(answers).filter((a) => a === "yes").length;
  const unsure = Object.values(answers).filter((a) => a === "unsure").length;

  return (
    <div className="card flex min-w-0 flex-col p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <ToolIcon tool="website-audit" className="h-5 w-5" />
        </span>
        <h3 className="font-sora text-xl font-bold text-ink-950">How does your site compare?</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-500">
        Five things we checked on local business websites in our{" "}
        <Link href={STUDY} className="font-semibold text-brand-700 hover:text-brand-800">
          2026 study
        </Link>
        {". Answer what you know and see where you stand."}
      </p>

      <ol className="mt-6 space-y-4">
        {QUESTIONS.map((item, i) => {
          const a = answers[item.id];
          return (
            <li key={item.id}>
              <fieldset className="min-w-0">
                <legend className="text-sm font-semibold text-ink-900">
                  {i + 1}. {item.q}
                </legend>
                <div className="mt-2 flex flex-wrap gap-2">
                  {OPTIONS.map((o) => (
                    <label
                      key={o.value}
                      className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus-within:ring-2 focus-within:ring-brand-200 ${
                        a === o.value ? "bg-brand-600 text-white" : "bg-ink-50 text-ink-600 hover:bg-brand-50 hover:text-brand-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`compare-${item.id}`}
                        value={o.value}
                        checked={a === o.value}
                        onChange={() => setAnswers((prev) => ({ ...prev, [item.id]: o.value }))}
                        className="sr-only"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
                {a && (
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {a === "yes" ? item.yes : a === "no" ? item.no : UNSURE}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <div aria-live="polite" className="mt-6 border-t border-ink-100/60 pt-5">
        {answered === 0 ? (
          <p className="text-sm text-ink-500">Your summary appears here as you answer.</p>
        ) : (
          <p className="text-sm font-semibold text-ink-900">
            You answered yes to {yes} of {QUESTIONS.length}
            {unsure > 0 ? ` and were not sure about ${unsure}` : ""}.
            {answered < QUESTIONS.length ? ` ${QUESTIONS.length - answered} still to go.` : ""}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href="/tools/website-audit" className="btn-primary">
            Check all of these for real <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={STUDY} className="text-sm font-semibold text-ink-600 hover:text-brand-700">
            See the full study
          </Link>
        </div>
      </div>
    </div>
  );
}
