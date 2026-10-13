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
    body: 'A feature article on our blog, written by your team or by ours, on a topic our readers actively search for. Links are placed to your requirements and agreed with you by email.',
    fit: 'SaaS, developer tools, courses, agencies',
  },
  {
    service: 'tool-feature',
    title: 'AI tool or product feature',
    body: 'A hands on review or a listing alongside related tools, written after our team has used your product. Readers get a clear picture of what it does and who it is for.',
    fit: 'AI tools, browser extensions, apps',
  },
  {
    service: 'advertising',
    title: 'Banner ads and placements',
    body: 'A fixed placement on a relevant tool page, trend report or blog post for an agreed period. Each placement is matched to the page so it reaches the right readers.',
    fit: 'Brands with a clear developer or creator audience',
  },
  {
    service: 'website-audit',
    title: 'Manual website audit',
    body: 'A manual review of your SEO, speed and technical setup, with a fix list ordered by impact. For a quick score first, our free audit tool is a good place to start.',
    fit: 'Site owners, startups, small businesses',
    link: { href: '/services/website-audit', label: 'See audit options' },
  },
  {
    service: 'web-development',
    title: 'Web development or SEO work',
    body: 'Building or fixing sites on Next.js, WordPress or Shopify, along with technical SEO. Larger builds are delivered together with our development partner, OviTech Global.',
    fit: 'New sites, redesigns, slow or broken sites',
  },
];

const steps = [
  { title: 'Send the form', body: 'Tell us what you would like to do and add a link to your product or website.' },
  { title: 'Receive a clear reply', body: 'Within 24 hours you receive our answer, a price and a timeline. A call is optional.' },
  { title: 'Go live', body: 'Once everything is agreed, the work is scheduled and you receive the live link as soon as it is published or delivered.' },
];

const sponsorBenefits = [
  'A professionally edited article, formatted and optimized for search',
  'Links placed to your requirements, agreed with you by email',
  'Internal links from related articles across our blog',
  'Promotion across our social media channels',
  'The live link sent to you as soon as the article is published',
  'A long term placement on the live blog',
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
              Five ways to work with us. Choose one to open the form with it already selected.
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

              <div className="mt-10 overflow-hidden rounded-2xl border border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
                <div className="border-b border-ink-200 bg-brand-50 px-6 py-4 dark:border-ink-800 dark:bg-brand-950/40">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">Sponsored articles</p>
                  <h3 className="mt-1 font-sora text-lg font-semibold text-ink-950 dark:text-white">What You Get When You Sponsor With Us</h3>
                </div>
                <ul className="space-y-3 p-6">
                  {sponsorBenefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-ink-700 dark:text-ink-300">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="border-t border-ink-200 px-6 py-4 text-sm text-ink-500 dark:border-ink-800 dark:text-ink-400">
                  Full terms are shared by email along with your quote.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div id="enquiry-form" className="relative scroll-mt-24 rounded-2xl border border-ink-200 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-8">
              <h2 className="font-sora text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
                Send an Enquiry
              </h2>
              <p className="mt-2 text-ink-600 dark:text-ink-300">
                The more detail you share, the more useful our first reply will be.
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
