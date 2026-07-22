"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="pb-4 pt-4 overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="shell">
        <Reveal>
          <div className="card grid items-center gap-8 !rounded-3xl p-8 sm:p-12 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="eyebrow">The weekly index</p>
              <h2
                id="newsletter-heading"
                className="mt-4 font-sora text-2xl font-bold leading-tight tracking-tight text-ink-950 sm:text-3xl"
              >
                One email. New tools, fresh trends, zero noise.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500 sm:text-base">
                A short weekly digest of what we shipped, what is trending and one guide worth
                reading. Unsubscribe any time.
              </p>
            </div>

            <form
              className="flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setDone(true);
              }}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-full border border-ink-200 bg-white px-5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
              />
              <button type="submit" className="btn-primary h-12 !py-0">
                {done ? "Subscribed ✓" : "Subscribe"}
              </button>
            </form>
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
            <a href="/community" className="btn-secondary">
              Join the community
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
