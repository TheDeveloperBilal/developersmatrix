"use client";

import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/reveal";

// There is no mailing list behind this section yet. The old form showed
// "Subscribed" without sending the address anywhere, so it is replaced with
// honest links until a real email provider is connected.
export function Newsletter() {
  return (
    <section className="pb-4 pt-4 overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="shell">
        <Reveal>
          <div className="card grid items-center gap-8 !rounded-3xl p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="eyebrow">Stay up to date</p>
              <h2
                id="newsletter-heading"
                className="mt-4 font-sora text-2xl font-bold leading-tight tracking-tight text-ink-950 sm:text-3xl"
              >
                Where to find what is new
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500 sm:text-base">
                New guides go up on the blog, trend reports show the date they were last updated,
                and every tool change is listed in the changelog above.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a href="/blog" className="btn-primary h-12 !py-0">
                Read the latest guides
              </a>
              <a href="/trends" className="btn-secondary h-12 !py-0">
                Browse trend reports
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24" aria-labelledby="final-cta-heading">
      <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)]" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-72 w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/50 blur-3xl"
      />
      <div className="shell relative text-center">
        <Reveal>
          <p className="eyebrow justify-center after:h-px after:w-8 after:bg-ink-300">
            Get started
          </p>
          <h2
            id="final-cta-heading"
            className="mx-auto mt-5 max-w-2xl font-sora text-3xl font-bold leading-tight tracking-tight text-ink-950 sm:text-[2.75rem]"
          >
            Your next opportunity starts with the right tools
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-500">
            Build a better resume, audit your website, plan your budget and stay ahead of the
            trends. All free, all in your browser.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
            <a href="/tools" className="btn-primary">
              Explore free AI tools
            </a>
            <a href="/blog" className="btn-secondary">
              Read the latest guides
            </a>
          </div>
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-500">
            {["Free forever core tools", "No credit card required", "No signup needed"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  {item}
                </li>
              )
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
