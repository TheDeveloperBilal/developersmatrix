import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { BreadcrumbSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";
import { TOOLS_LABEL } from "@/lib/home-data";
import { CONTACT_EMAIL } from "@/lib/contact-form";
import { getBlogSummaries } from "@/data/blog";
import { getIndexableTrends } from "@/data/trends-data";
import ConnectWithUsClient from "./ConnectWithUsClient";

export const metadata: Metadata = {
  title: "Connect: Advertise and Partner",
  description:
    "Work with DevelopersMatrix: sponsored and guest posts, AI tool features, ad placements, website audits and web development. Quoted per project.",
  alternates: {
    canonical: `${siteConfig.url}/connect`,
  },
  keywords: ["advertise with us", "partner with us", "sponsored content", "guest post", "AI tool promotion", "tech advertising", "website audit service"],
  openGraph: {
    title: "Connect With Us | DevelopersMatrix",
    description: "Sponsored posts, tool features, ad placements, website audits and web development. Tell us what you have in mind and get a quote.",
    url: `${siteConfig.url}/connect`,
  },
};

// Who reads which part of the site. Kept descriptive on purpose: no traffic
// figures are published here while the site is still growing. Page level
// numbers are shared privately with a quote.
const audiences = [
  {
    who: "Developers and tech professionals",
    reads: "AI agent guides, coding tool comparisons and developer career advice",
    fits: "Developer tools, SaaS, courses",
  },
  {
    who: "Job seekers and career changers",
    reads: "The resume builder, cover letter generator, interview simulator and salary estimator",
    fits: "Career platforms, job boards, learning",
  },
  {
    who: "Site owners and marketers",
    reads: "The website audit tool, SEO checklists and on page guides",
    fits: "Hosting, SEO software, analytics",
  },
  {
    who: "Creators and side hustlers",
    reads: "Trend reports on AI side hustles, social media and making money online",
    fits: "AI tools, creator software, templates",
  },
];

const glance = [
  { term: "Free tools on the site", detail: `${TOOLS_LABEL}, plus trend reports and guides` },
  { term: "Who you work with", detail: "The DevelopersMatrix team", href: "/about" },
  { term: "Reply time", detail: "Under 24 hours" },
  { term: "Pricing", detail: "Quoted per project" },
  { term: "Sponsored articles", detail: "Edited, published and promoted" },
];

const faqs = [
  {
    question: "How much does it cost?",
    answer:
      "Every project is quoted individually, because a sponsored post, a banner placement and a website build involve very different amounts of work. Choose a budget range in the form if you have one, and we will tell you what fits within it.",
  },
  {
    question: "Do you accept guest posts?",
    answer:
      "Yes. We welcome original articles that are useful to developers, creators and professionals. Send us the topic and a short outline first, and our editors will review it, suggest any changes and confirm the details with you by email.",
  },
  {
    question: "How are links in a sponsored article handled?",
    answer:
      "Links are placed to your requirements. Share the pages you would like to link to and your preferred anchor text, and we will confirm every placement detail with you by email before the article goes live.",
  },
  {
    question: "Are traffic figures available before booking?",
    answer:
      "Yes. Mention the pages or topics that interest you, and we will share current figures for them along with your quote, so you can judge a placement on real numbers before you pay.",
  },
  {
    question: "What happens if a reply does not arrive?",
    answer: `We reply to every enquiry within 24 hours. If nothing arrives, please check your spam folder, then email ${CONTACT_EMAIL} directly.`,
  },
];

export default function ConnectPage() {
  const guideCount = getBlogSummaries().filter((p) => !p.noindex).length;
  const trendCount = getIndexableTrends().length;
  const library = [
    { value: TOOLS_LABEL, label: "Free tools to use any time" },
    { value: String(guideCount), label: "Practical guides on the blog" },
    { value: String(trendCount), label: "Trend reports with update dates" },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Connect With Us", url: `${siteConfig.url}/connect` },
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
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="shell relative grid gap-12 py-14 lg:grid-cols-12 lg:items-end lg:gap-16 lg:py-24">
            <div className="lg:col-span-7">
              <nav aria-label="Breadcrumb" className="text-sm text-ink-400">
                <Link href="/" className="hover:text-white">Home</Link>
                <span className="mx-2 text-ink-600">/</span>
                <span className="text-ink-200">Connect</span>
              </nav>
              <p className="mt-8 text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-brand-300">
                Work with DevelopersMatrix
              </p>
              <h1 className="mt-3 font-sora text-4xl font-bold tracking-tight sm:text-6xl">
                Connect With Us
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300 sm:text-xl">
                Want your product in front of people who build things, or need help with your own website? Tell us what you have in mind and we will come back to you with a clear answer, a price and a timeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#enquiry-form"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-ink-950 transition hover:bg-brand-100"
                >
                  Start an enquiry <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                      <dt className="text-sm text-ink-400">{g.term}</dt>
                      <dd className="text-sm font-semibold text-white sm:text-right">
                        {g.href ? (
                          <Link href={g.href} className="underline decoration-white/30 underline-offset-4 hover:decoration-white">
                            {g.detail}
                          </Link>
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

        {/* Audience */}
        <section className="border-b border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
          <div className="shell grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700 dark:text-brand-300">
                A growing, focused audience
              </p>
              <h2 className="mt-2 font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-4xl">
                Who You Reach With Us
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-600 dark:text-ink-300">
                DevelopersMatrix is a young site, and we would rather say so than inflate it. What we offer is a clear match: readers who arrive with a specific job to do, on pages built around that job.
              </p>
              <p className="mt-4 leading-relaxed text-ink-600 dark:text-ink-300">
                That is also why budgets start small, from under $50, and why current figures for any page are shared privately with your quote.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 dark:border-ink-800 dark:bg-ink-800">
                {library.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse justify-end gap-1.5 bg-white p-4 dark:bg-ink-900 sm:p-5">
                    <dt className="text-xs leading-snug text-ink-600 dark:text-ink-300 sm:text-sm">{s.label}</dt>
                    <dd className="font-sora text-2xl font-bold tracking-tight text-ink-950 dark:text-white sm:text-3xl">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <ul className="divide-y divide-ink-200 border-y border-ink-200 dark:divide-ink-800 dark:border-ink-800 lg:col-span-7">
              {audiences.map((a, i) => (
                <li key={a.who} className="grid gap-2 py-6 sm:grid-cols-[3rem_1fr] sm:gap-4">
                  <span className="font-sora text-sm font-semibold tabular-nums text-brand-700 dark:text-brand-300 sm:pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-sora text-lg font-semibold text-ink-950 dark:text-white">{a.who}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-600 dark:text-ink-300">
                      <span className="font-medium text-ink-800 dark:text-ink-100">What they use:</span> {a.reads}.
                    </p>
                    <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                      <span className="font-medium">A natural fit for:</span> {a.fits}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ConnectWithUsClient />

        {/* FAQ */}
        <section className="border-t border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-950">
          <div className="shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-20">
            <div className="lg:col-span-4">
              <h2 className="font-sora text-3xl font-bold tracking-tight text-ink-950 dark:text-white">
                Common Questions
              </h2>
              <p className="mt-4 text-ink-600 dark:text-ink-300">
                Something else on your mind? Ask in the form or email{" "}
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
