import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/data/config';
import { TOOLS_LABEL } from '@/lib/home-data';
import { CONTACT_EMAIL } from '@/lib/contact-form';
import ContactClient from './ContactClient';

const glance = [
  { term: 'Email', detail: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { term: 'Reply time', detail: 'Under 24 hours' },
  { term: 'Support', detail: `Free, for all ${TOOLS_LABEL} tools` },
  { term: 'Where we work', detail: 'Remotely, with readers and clients worldwide' },
  { term: 'Business enquiries', detail: 'Visit the Connect page', href: '/connect' },
];

const faqs = [
  {
    question: 'How quickly does the team reply?',
    answer:
      'We reply to every message within 24 hours. A confirmation email is sent as soon as your message arrives, so you know it has reached us.',
  },
  {
    question: 'What should a bug report include?',
    answer: `The page address, the browser and device you were using, and what happened compared with what you expected. A screenshot helps a great deal, and you can send one to ${CONTACT_EMAIL}.`,
  },
  {
    question: 'Does the team accept ideas for new tools?',
    answer:
      'Yes. Tell us what the tool should do and who would use it, and our team will review the idea for a future update.',
  },
  {
    question: 'Where should business enquiries go?',
    answer:
      'Sponsored articles, tool features, advertising and web projects are handled on our Connect page, where the form asks for the details we need to prepare a quote.',
  },
  {
    question: 'Is support free?',
    answer: 'Yes. Every tool on DevelopersMatrix is free to use, and so is help with using them.',
  },
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Contact', url: `${siteConfig.url}/contact` },
        ]}
      />
      <FAQSchema faqs={faqs} />

      <div className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink-950 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl"
          />
          <div className="shell relative grid gap-12 py-14 lg:grid-cols-12 lg:items-end lg:gap-16 lg:py-24">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
                <Link href="/" className="hover:text-white">Home</Link>
                <span className="mx-2 text-ink-600">/</span>
                <span className="text-ink-200">Contact</span>
              </nav>
              <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-300">
                Contact DevelopersMatrix
              </p>
              <h1 className="mt-3 font-sora text-4xl font-bold tracking-tight sm:text-6xl">
                Get in <span className="text-brand-300">Touch</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300 sm:text-xl">
                Have a question about a tool, found a bug or want to suggest something new? Send us a message and our team will reply within 24 hours.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact-form"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-ink-950 transition hover:bg-brand-100"
                >
                  Send a message <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-white/20 px-5 text-sm font-semibold text-white transition hover:border-white"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" /> {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">At a glance</p>
                <dl className="mt-4 divide-y divide-white/10">
                  {glance.map((g) => (
                    <div key={g.term} className="flex flex-col gap-0.5 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <dt className="shrink-0 text-sm text-ink-400">{g.term}</dt>
                      <dd className="break-words text-sm font-semibold text-white sm:text-right">
                        {g.href ? (
                          g.href.startsWith('mailto:') ? (
                            <a href={g.href} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                              {g.detail}
                            </a>
                          ) : (
                            <Link href={g.href} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                              {g.detail}
                            </Link>
                          )
                        ) : (
                          g.detail
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <ContactClient />

        {/* FAQ */}
        <section className="border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-950">
          <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="lg:col-span-4">
              <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white">
                Common Questions
              </h2>
              <p className="mt-4 text-ink-600 dark:text-ink-300">
                Cannot find your answer here? Send us a message or email{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-700 hover:underline dark:text-brand-300">
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            </div>
            <dl className="divide-y divide-ink-200 border-y border-ink-200 dark:divide-ink-800 dark:border-ink-800 lg:col-span-8">
              {faqs.map((f) => (
                <div key={f.question} className="py-6">
                  <dt className="font-sora text-lg font-semibold text-ink-950 dark:text-white">{f.question}</dt>
                  <dd className="mt-2 leading-relaxed text-ink-600 dark:text-ink-300">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </>
  );
}
