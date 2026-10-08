'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, Check } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import type { ServiceValue } from '@/lib/contact-form';

interface Offer {
  service: ServiceValue;
  title: string;
  body: string;
  fit: string;
  link?: { href: string; label: string };
}

const offers: Offer[] = [
  {
    service: 'sponsored-post',
    title: 'Sponsored or guest posts',
    body: 'An article on the blog, written by you or by me, on a topic readers actually search for. Sponsored posts are labeled and their links use rel="sponsored".',
    fit: 'SaaS, developer tools, courses, agencies',
  },
  {
    service: 'tool-feature',
    title: 'AI tool or product feature',
    body: 'A hands on review or a listing next to related tools, written after actually using your product. You get honest notes, not a paid rave.',
    fit: 'AI tools, browser extensions, apps',
  },
  {
    service: 'advertising',
    title: 'Banner ads and placements',
    body: 'A fixed placement on a relevant tool page, trend report or blog post for an agreed period. I only place what suits the page and its readers.',
    fit: 'Brands with a clear developer or creator audience',
  },
  {
    service: 'website-audit',
    title: 'Manual website audit',
    body: 'A human review of your SEO, speed and technical setup, with a fix list ordered by impact. Want a quick score first? The free audit tool is a good start.',
    fit: 'Site owners, startups, small businesses',
    link: { href: '/services/website-audit', label: 'See audit options' },
  },
  {
    service: 'web-development',
    title: 'Web development or SEO work',
    body: 'Building or fixing sites on Next.js, WordPress or Shopify, plus technical SEO. Larger builds can run through OviTech Global, where I am a cofounder.',
    fit: 'New sites, redesigns, slow or broken sites',
  },
];

const steps = [
  { title: 'Send the form', body: 'Say what you want to do and add a link to your product or site.' },
  { title: 'Get a straight answer', body: 'Within 24 to 48 hours you get a yes or no, a price and a timeline. No call needed unless you want one.' },
  { title: 'Go live', body: 'Once we agree, the work is scheduled and you get the link when it is published or delivered.' },
];

const rules = [
  'Every sponsored post and paid feature is clearly labeled.',
  'Paid links use rel="sponsored", as Google asks.',
  'Reviews stay honest. Paying for a feature does not buy a good verdict.',
  'No gambling, adult content, get rich quick schemes or link selling.',
];

export default function ConnectWithUsClient() {
  const [preset, setPreset] = useState<{ service: string; nonce: number } | undefined>();

  const choose = (service: ServiceValue) => {
    setPreset((p) => ({ service, nonce: (p?.nonce ?? 0) + 1 }));
    document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Offers */}
      <section className="bg-white dark:bg-ink-900">
        <div className="shell py-14 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
              Ways to Work Together
            </h2>
            <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
              Five things I can help with. Pick one to start the form with it already chosen.
            </p>
          </div>

          <ol className="mt-10 border-t border-ink-200 dark:border-ink-800">
            {offers.map((o, i) => (
              <li
                key={o.service}
                className="grid gap-4 border-b border-ink-200 py-7 dark:border-ink-800 md:grid-cols-12 md:items-start md:gap-8"
              >
                <span className="font-sora text-sm font-semibold tabular-nums text-brand-700 dark:text-brand-300 md:col-span-1 md:pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="md:col-span-7">
                  <h3 className="font-sora text-xl font-semibold text-ink-950 dark:text-white">{o.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink-600 dark:text-ink-300">{o.body}</p>
                  {o.link && (
                    <Link href={o.link.href} className="mt-2 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-300">
                      {o.link.label}
                    </Link>
                  )}
                </div>
                <div className="flex flex-col gap-3 md:col-span-4 md:items-end md:text-right">
                  <p className="text-sm text-ink-500 dark:text-ink-400">
                    <span className="font-semibold text-ink-700 dark:text-ink-200">Good for:</span> {o.fit}
                  </p>
                  <button
                    type="button"
                    onClick={() => choose(o.service)}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-ink-300 px-4 text-sm font-semibold text-ink-900 transition hover:border-brand-600 hover:text-brand-700 dark:border-ink-700 dark:text-ink-100 dark:hover:border-brand-400 dark:hover:text-brand-300 sm:w-auto"
                  >
                    Choose this <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process, rules and form */}
      <section id="enquiry" className="scroll-mt-20 border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-950">
        <div className="shell grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white">
                How It Works
              </h2>
              <ol className="mt-8 space-y-6">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-950 font-sora text-sm font-semibold text-white dark:bg-white dark:text-ink-950">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold text-ink-950 dark:text-white">{s.title}</h3>
                      <p className="mt-1 text-ink-600 dark:text-ink-300">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 rounded-2xl border border-ink-200 bg-white p-6 dark:border-ink-800 dark:bg-ink-900">
                <h3 className="font-sora text-lg font-semibold text-ink-950 dark:text-white">My Ground Rules</h3>
                <ul className="mt-4 space-y-3">
                  {rules.map((r) => (
                    <li key={r} className="flex gap-3 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div id="enquiry-form" className="relative scroll-mt-24 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-8">
              <h2 className="font-sora text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
                Send an Enquiry
              </h2>
              <p className="mt-2 text-ink-600 dark:text-ink-300">
                The more detail you give, the more useful my first reply will be.
              </p>
              <div className="mt-6">
                <ContactForm kind="collaboration" preset={preset} submitLabel="Send enquiry" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
