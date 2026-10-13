import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";
import Link from "next/link";
import { InContentAd } from "@/components/ads/AdBanner";
import { BreadcrumbSchema, FAQSchema, ItemListSchema } from "@/components/seo/SchemaMarkup";
import { tools } from "@/data/tools";
import { siteConfig } from "@/data/config";
import ToolsDirectoryClient, { type DirectoryTool, type DirectoryCategory } from "./ToolsDirectoryClient";

export const metadata: Metadata = generatePageMetadata(pageMetadata.tools);

const categories: DirectoryCategory[] = [
  { id: 'career', name: 'Career', description: 'Resumes, cover letters, interview practice and pay data' },
  { id: 'seo', name: 'SEO and Web', description: 'Audit a website and check content before you publish' },
  { id: 'ai', name: 'AI and Writing', description: 'Ready prompts and help with work emails' },
  { id: 'productivity', name: 'Productivity', description: 'Habits, day plans and business ideas' },
  { id: 'finance', name: 'Finance', description: 'Plan your monthly budget and savings' },
  { id: 'gaming', name: 'Gaming', description: 'Check PC game requirements before you buy' },
];

// What a visitor walks away with, in plain words. Kept here rather than in
// data/tools.ts because only this page uses it.
const extras: Record<string, { outcome: string; youGet: string; bestFor: string; goals: string[] }> = {
  'website-audit': {
    outcome: 'Score any website and get a fix list ordered by impact.',
    youGet: 'Score and fix list',
    bestFor: 'Site owners, marketers and freelancers',
    goals: ['website'],
  },
  'ai-content-detector': {
    outcome: 'See whether text reads as AI or human, sentence by sentence.',
    youGet: 'AI signal score',
    bestFor: 'Editors, writers and teachers',
    goals: ['website', 'write'],
  },
  'ai-resume-builder': {
    outcome: 'Write your resume on a live A4 page with a check on every bullet.',
    youGet: 'PDF resume',
    bestFor: 'Job seekers in any field, tuned for tech roles',
    goals: ['hired'],
  },
  'ai-cover-letter-generator': {
    outcome: 'Turn a job posting and your own results into a tailored letter.',
    youGet: 'Ready to send letter',
    bestFor: 'Anyone applying for a role this week',
    goals: ['hired', 'write'],
  },
  'ai-interview-simulator': {
    outcome: 'Answer real interview questions and get a score on every answer.',
    youGet: 'Scored feedback',
    bestFor: 'Candidates preparing for an interview',
    goals: ['hired'],
  },
  'salary-estimator': {
    outcome: 'Official US pay ranges for your job in any state or city.',
    youGet: 'Pay range',
    bestFor: 'Job offers, raises and moving cities',
    goals: ['hired', 'money'],
  },
  'ai-prompt-library': {
    outcome: 'Ready prompts you can fill in and open in ChatGPT or Claude.',
    youGet: 'Copy ready prompts',
    bestFor: 'Anyone who wants better answers from AI',
    goals: ['write'],
  },
  'ai-email-assistant': {
    outcome: 'Start from a template and check your draft before you send it.',
    youGet: 'Polished email',
    bestFor: 'Busy professionals and new starters',
    goals: ['write'],
  },
  'habit-tracker': {
    outcome: 'Check in daily and watch real streaks build on a 12 week wall.',
    youGet: 'Streaks and history',
    bestFor: 'Building a routine that sticks',
    goals: ['plan'],
  },
  'productivity-planner': {
    outcome: 'Turn a task list into an hour by hour plan for today.',
    youGet: 'Day timeline',
    bestFor: 'Busy days with too many priorities',
    goals: ['plan'],
  },
  'startup-idea-generator': {
    outcome: 'Business ideas matched to your skills, with a seven day test plan.',
    youGet: 'Idea canvas',
    bestFor: 'Side projects and first time founders',
    goals: ['plan', 'money'],
  },
  'budget-planner': {
    outcome: 'See what is left each month and when you will reach a savings goal.',
    youGet: 'Monthly budget',
    bestFor: 'Households, freelancers and students',
    goals: ['money'],
  },
  'can-you-run-it': {
    outcome: 'Compare your PC with the official requirements of popular games.',
    youGet: 'Spec by spec verdict',
    bestFor: 'PC gamers before they buy',
    goals: ['pc'],
  },
};

const faqs = [
  {
    question: 'Are these tools free?',
    answer:
      'Yes. Every tool on DevelopersMatrix is free to use, with no trial period and no card details. The site is supported by a small number of ads.',
  },
  {
    question: 'Is an account needed?',
    answer:
      'No. None of the tools ask you to sign up. Tools that keep your work, such as the Budget Planner and the Habit Tracker, save it in your own browser.',
  },
  {
    question: 'Which tool is the best place to start?',
    answer:
      'Choose a goal at the top of this page and the list narrows to the tools that fit. If you run a website, the AI Website Audit is a good first step. If you are job hunting, start with the AI Resume Builder.',
  },
  {
    question: 'Does the team take tool suggestions?',
    answer:
      'Yes. Send your idea through our contact page and our team will review it for a future update.',
  },
];

export default function ToolsPage() {
  const list: DirectoryTool[] = categories.flatMap((c) =>
    tools
      .filter((t) => t.category === c.id)
      .map((t) => {
        const x = extras[t.slug];
        return {
          slug: t.slug,
          name: t.name,
          path: t.path,
          category: t.category,
          outcome: x?.outcome ?? t.shortDescription,
          youGet: x?.youGet ?? '',
          bestFor: x?.bestFor ?? '',
          goals: x?.goals ?? [],
          features: t.features.slice(0, 3),
          keywords: t.keywords,
        };
      })
  );

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` }
        ]}
      />
      <ItemListSchema
        name="DevelopersMatrix Tools"
        description="Free browser tools for careers, websites, writing, planning, money and PC gaming"
        itemListElement={list.map((t) => ({ name: t.name, description: t.outcome, url: `${siteConfig.url}${t.path}` }))}
      />
      <FAQSchema faqs={faqs} />

      <ToolsDirectoryClient tools={list} categories={categories} />

      <InContentAd />

      {/* How it works */}
      <section className="border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950">
        <div className="shell py-14 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">How our tools work</p>
            <h2 className="mt-2 font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
              Three Steps, No Sign Up
            </h2>
          </div>
          <ol className="relative mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
            <span aria-hidden="true" className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-ink-200 dark:bg-ink-800 md:left-0 md:right-0 md:top-[1.15rem] md:bottom-auto md:h-px md:w-auto" />
            {[
              { t: 'Pick a tool', b: 'Choose a goal above or search by name. Every tool opens straight away.' },
              { t: 'Add your details', b: 'Type, paste or choose. Your work stays in your browser while you use it.' },
              { t: 'Use the result', b: 'Download, copy or act on a clear result. Each tool explains what to do next.' },
            ].map((s, i) => (
              <li key={s.t} className="relative flex gap-4 md:block">
                <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-300 bg-white font-sora text-sm font-semibold text-ink-950 dark:border-ink-700 dark:bg-ink-950 dark:text-white">
                  {i + 1}
                </span>
                <div className="md:mt-5 md:pr-6">
                  <h3 className="font-semibold text-ink-950 dark:text-white">{s.t}</h3>
                  <p className="mt-1 leading-relaxed text-ink-600 dark:text-ink-300">{s.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-900">
        <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
          <div className="lg:col-span-4">
            <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white">Tool Questions</h2>
            <p className="mt-4 text-ink-600 dark:text-ink-300">
              Missing something? Tell us on the{' '}
              <Link href="/contact" className="font-medium text-brand-700 hover:underline dark:text-brand-300">contact page</Link>.
            </p>
          </div>
          <div className="divide-y divide-ink-200 border-y border-ink-200 dark:divide-ink-800 dark:border-ink-800 lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.question} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sora text-lg font-semibold text-ink-950 dark:text-white">
                  {f.question}
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink-300 text-ink-500 transition group-open:rotate-45 dark:border-ink-700">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink-600 dark:text-ink-300">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
