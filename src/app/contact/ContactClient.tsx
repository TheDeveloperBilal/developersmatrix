'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bug, Handshake, LifeBuoy, Lightbulb, MessageSquareText, type LucideIcon } from 'lucide-react';
import ContactForm from '@/components/forms/ContactForm';
import { ToolIcon } from '@/lib/tool-icons';

interface Topic {
  icon: LucideIcon;
  title: string;
  body: string;
  subject: string;
}

const topics: Topic[] = [
  {
    icon: LifeBuoy,
    title: 'A question about a tool',
    body: 'Help with a result, a setting or how a tool works.',
    subject: 'Question about a tool',
  },
  {
    icon: Bug,
    title: 'Report a bug',
    body: 'Something broken, slow or showing the wrong data.',
    subject: 'Bug report',
  },
  {
    icon: Lightbulb,
    title: 'Suggest a tool or feature',
    body: 'An idea for something new or a way to improve a tool.',
    subject: 'Tool or feature idea',
  },
  {
    icon: MessageSquareText,
    title: 'Feedback on our content',
    body: 'A correction, a question or a thought on an article or report.',
    subject: 'Feedback on content',
  },
];

export default function ContactClient() {
  const [preset, setPreset] = useState<{ subject: string; nonce: number } | undefined>();
  const [active, setActive] = useState<string | null>(null);

  const choose = (t: Topic) => {
    setActive(t.subject);
    setPreset((p) => ({ subject: t.subject, nonce: (p?.nonce ?? 0) + 1 }));
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="bg-white dark:bg-ink-900">
      <div className="shell grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
        {/* Topics */}
        <div className="lg:col-span-5">
          <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
            What Can We Help With?
          </h2>
          <p className="mt-4 text-lg text-ink-600 dark:text-ink-300">
            Choose a topic and the subject line is filled in for you.
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {topics.map((t) => {
              const Icon = t.icon;
              const on = active === t.subject;
              return (
                <li key={t.subject}>
                  <button
                    type="button"
                    onClick={() => choose(t)}
                    aria-pressed={on}
                    className={`group flex h-full w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${
                      on
                        ? 'border-brand-600 bg-brand-50 dark:border-brand-400 dark:bg-brand-950/40'
                        : 'border-ink-200 hover:border-brand-400 hover:bg-ink-50 dark:border-ink-800 dark:hover:border-brand-500 dark:hover:bg-ink-800/50'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        on
                          ? 'bg-brand-600 text-white'
                          : 'bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-950/60 dark:text-brand-300'
                      }`}
                    >
                      <span className="tool-icon">
                        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                      </span>
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink-950 dark:text-white">{t.title}</span>
                      <span className="mt-0.5 block text-sm leading-relaxed text-ink-600 dark:text-ink-300">{t.body}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link
              href="/connect"
              className="group flex items-center justify-between gap-3 rounded-2xl bg-ink-950 p-5 text-white transition hover:bg-ink-800 dark:bg-white dark:text-ink-950 dark:hover:bg-ink-100"
            >
              <span className="flex items-center gap-3">
                <span className="tool-icon">
                  <Handshake className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">Business enquiries</span>
                  <span className="block text-xs opacity-70">Sponsorships, ads and projects</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/services/website-audit"
              className="group flex items-center justify-between gap-3 rounded-2xl border border-ink-200 p-5 text-ink-950 transition hover:border-brand-500 dark:border-ink-800 dark:text-white"
            >
              <span className="flex items-center gap-3">
                <ToolIcon tool="website-audit" className="h-5 w-5 text-brand-700 dark:text-brand-300" />
                <span>
                  <span className="block text-sm font-semibold">Website audits</span>
                  <span className="block text-xs text-ink-500 dark:text-ink-400">A full manual review</span>
                </span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7">
          <div
            id="contact-form"
            className="relative scroll-mt-24 rounded-2xl border border-ink-200 bg-ink-50/60 p-6 shadow-sm dark:border-ink-800 dark:bg-ink-950 sm:p-8 lg:sticky lg:top-24"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-sora text-2xl font-bold tracking-tight text-ink-950 dark:text-white">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-ink-600 dark:text-ink-300">
                  Our team reads every message and replies within 24 hours.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                Reply in under 24 hours
              </span>
            </div>
            <div className="mt-6">
              <ContactForm kind="general" preset={preset} submitLabel="Send message" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
