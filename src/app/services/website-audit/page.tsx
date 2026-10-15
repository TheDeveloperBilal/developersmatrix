import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/data/config';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { AUDIT_PRICING, REFUND_WINDOW_DAYS } from '@/lib/audit-pricing';
import AuditOrderForm from './AuditOrderForm';

// Pricing lives in lib/audit-pricing.ts so the order form and the order emails
// quote exactly the same names, prices and turnaround times as this page.
const PRICING = AUDIT_PRICING;

export const metadata: Metadata = generatePageMetadata({
  title: 'Website Audit Services: Scope and Pricing',
  description:
    'Website audit services with fixed pricing and no sales call. See exactly what each audit covers, what it costs, and how long it takes. Run the free tool first.',
  keywords: [
    'website audit services',
    'website audit cost',
    'website audit pricing',
    'seo audit services',
    'professional website audit',
    'website audit company',
    'hire website audit',
    'technical seo audit service',
    'website audit report service',
    'how much does a website audit cost',
  ],
  path: '/services/website-audit',
});

const faqs = [
  {
    question: 'How much does a website audit cost?',
    answer:
      `Most businesses pay between ${PRICING.currencySymbol}101 and ${PRICING.currencySymbol}750. WebFX surveyed buyers and found 43 percent land in that band, with startups and micro businesses paying ${PRICING.currencySymbol}50 to ${PRICING.currencySymbol}750 and small businesses going up to ${PRICING.currencySymbol}2,500. Full agency audits sold through a sales process start around ${PRICING.currencySymbol}2,500 and run past ${PRICING.currencySymbol}8,000 for large sites. Our prices are published above and sit well below that range: ${PRICING.currencySymbol}${PRICING.tiers[0].price} for the Essential Audit, ${PRICING.currencySymbol}${PRICING.tiers[1].price} for the Complete Audit, and ${PRICING.currencySymbol}${PRICING.tiers[2].price} a month for ongoing monitoring. The scope of each audit is fixed and listed in full, and every report is reviewed by a person rather than exported from a tool. Anything over ${PRICING.currencySymbol}2,000 elsewhere should come with named consultants and a defined scope, not just a bigger number.`,
  },
  {
    question: 'What is the difference between this and your free audit tool?',
    answer:
      'The free tool runs around 150 automated checks and returns a score with a list of issues. It is genuinely useful and you should run it first. What it cannot do is tell you which of those issues actually matter for your site, why a page dropped, or whether a problem is a symptom of something else. A paid audit is a person reading the output, checking it against Search Console and your analytics, discarding the false positives, and writing you a prioritised list of what to fix in what order.',
  },
  {
    question: 'How long does a website audit take?',
    answer:
      `The Essential Audit is delivered in ${PRICING.tiers[0].turnaround} and the Complete Audit in ${PRICING.tiers[1].turnaround}, measured from the point we have access to your Search Console and Analytics. Larger sites and ecommerce catalogues can take longer, and if that applies we say so before taking payment rather than after.`,
  },
  {
    question: 'What does the audit report include?',
    answer:
      'A written report listing every finding, ranked by how much fixing it is worth rather than by severity score. Each finding names the affected URLs, explains what is wrong in plain language, and gives the specific fix. No 40 page PDF of automated output with a health score on the front.',
  },
  {
    question: 'Does the audit need access to the website?',
    answer:
      'Read access to Google Search Console and Google Analytics, which takes two minutes to grant and which you can revoke at any time. We do not need login access to your CMS, hosting or server, and we do not ask for it. If a finding needs a change made, we describe the change and you or your developer make it.',
  },
  {
    question: 'Will an audit improve search rankings?',
    answer:
      'An audit does not improve rankings by itself. It tells you what to change. Implementing the changes is what moves things, and how much they move depends on what was wrong, how competitive your market is, and how much authority your site already has. Anyone who promises a specific ranking outcome from an audit is guessing. What an audit reliably does is stop you spending money on the wrong problem.',
  },
  {
    question: 'How does payment for a website audit work?',
    answer:
      'By PayPal. There is no payment form on this site and we never ask for card details. Send the order form, and within 24 hours we email you the confirmed scope and a PayPal payment link. You can pay with your PayPal balance, or with a debit or credit card through PayPal where your country supports it. Work starts once the payment arrives. Ongoing Monitoring is billed monthly through PayPal and can be cancelled at any time.',
  },
  {
    question: 'What is the refund policy for website audits?',
    answer:
      `You get your money back. If the report arrives later than the promised turnaround, we refund the full amount. If it arrives on time but you are not satisfied, tell us within ${REFUND_WINDOW_DAYS} days of delivery and we refund the full amount, with no forms to fill in. The same promise applies to every monthly monitoring report. Refunds go back through PayPal to the account you paid from.`,
  },
  {
    question: 'Can you fix the issues as well as find them?',
    answer:
      'Implementation is quoted separately once the audit is done, because until the audit exists neither of us knows what the work is. Plenty of clients take the report and hand it to their own developer, which is a completely reasonable outcome and the report is written to make that easy.',
  },
];

export default function WebsiteAuditServicesPage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Website Audit Services',
    serviceType: 'Website audit',
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: 'Worldwide',
    description:
      'Fixed price website audits covering technical SEO, Core Web Vitals, on page optimisation, content and structured data, delivered as a prioritised written report.',
    offers: PRICING.tiers.map((t) => ({
      '@type': 'Offer',
      name: t.name,
      price: String(t.price),
      priceCurrency: PRICING.currency,
      description: t.summary,
      url: `${siteConfig.url}/services/website-audit#${t.id}`,
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Website Audit Services', url: `${siteConfig.url}/services/website-audit` },
        ]}
      />

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="border-b bg-muted/20 border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Fixed pricing. No sales call.
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 max-w-3xl">
              Website Audit Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-6">
              A person reads your site, checks the findings against your own Search Console data,
              throws out the false positives, and hands you a list of what to fix in what order.
              Prices are published below so you can decide without booking anything.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#pricing"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                See pricing
              </a>
              <Link
                href="/tools/website-audit"
                className="inline-flex items-center px-5 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors border-border"
              >
                Run the free audit first
              </Link>
              <a
                href="/sample-website-audit-report.pdf"
                className="inline-flex items-center px-5 py-2.5 rounded-lg border font-medium hover:bg-muted transition-colors border-border"
              >
                See a sample report
              </a>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6">
              {[
                'Pay by PayPal after we confirm the scope',
                `Full refund if late, or if you are not satisfied within ${REFUND_WINDOW_DAYS} days`,
                'Reply within 24 hours',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Start free */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="rounded-xl border bg-blue-50 dark:bg-blue-950/20 p-6 border-border">
              <h2 className="text-lg font-semibold mb-2">Start with the free tool, not with us</h2>
              <p className="text-sm text-muted-foreground max-w-3xl">
                Our{' '}
                <Link href="/tools/website-audit" className="text-blue-600 dark:text-blue-400 underline">
                  free website audit tool
                </Link>{' '}
                runs around 150 automated checks in about a minute and costs nothing. For a lot of
                sites that is genuinely enough, and if it is, you should not be paying anyone. Come
                back here when the automated output stops telling you what you need to know, which
                usually happens when traffic drops and the score still says everything is fine.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-2">What a website audit costs</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Three options. No tiers hidden behind a form, and no per page surprises after you pay.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {PRICING.tiers.map((tier) => (
                <div
                  key={tier.id}
                  id={tier.id}
                  className={`rounded-xl border p-6 flex flex-col ${
                    tier.featured
                      ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'border-border'
                  }`}
                >
                  {tier.featured && (
                    <span className="self-start text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-3">
                      Recommended
                    </span>
                  )}
                  <h3 className="text-lg font-semibold">{tier.name}</h3>
                  <p className="mt-3 mb-1">
                    <span className="text-3xl font-bold">
                      {PRICING.currencySymbol}
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-muted-foreground text-sm"> per {tier.period}</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">{tier.turnaround}</p>
                  <p className="text-sm text-muted-foreground mb-4">{tier.summary}</p>
                  <p className="text-xs font-medium mb-4">
                    <span className="text-muted-foreground">Best for: </span>
                    {tier.bestFor}
                  </p>
                  <ul className="space-y-2 text-sm mb-6 flex-1">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-blue-600 dark:text-blue-400 shrink-0">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`#order-${tier.id}`}
                    className={`text-center px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      tier.featured
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    Order the {tier.name}
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Nothing is paid on this site. After you order, we confirm the scope and email a PayPal link.
            </p>
          </div>
        </section>

        {/* Order */}
        <section id="order" className="border-b bg-muted/20 scroll-mt-20 border-border">
          {PRICING.tiers.map((t) => (
            <span key={t.id} id={`order-${t.id}`} aria-hidden="true" className="block scroll-mt-20" />
          ))}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-2">Order your website audit</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              Pick an audit, tell us the website, and we take it from there. Nothing is charged
              until you have seen the confirmed scope.
            </p>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="order-2 space-y-8 lg:order-1 lg:col-span-5">
                <div>
                  <h3 className="font-semibold mb-4">What happens next</h3>
                  <ol className="space-y-5">
                    {[
                      {
                        t: 'Send the order form',
                        b: 'Choose an audit and add your website. Nothing is charged at this point.',
                      },
                      {
                        t: 'We confirm the scope within 24 hours',
                        b: 'We check the size of the site and email you the confirmed scope with a PayPal payment link. If the site does not fit the audit you chose, we say so before you pay.',
                      },
                      {
                        t: 'Pay and share read access',
                        b: 'Pay through the PayPal link, then give us read access to Search Console and Analytics. Our email explains how, and it takes about two minutes.',
                      },
                      {
                        t: 'Receive your report',
                        b: `The Essential Audit arrives within ${PRICING.tiers[0].turnaround} and the Complete Audit within ${PRICING.tiers[1].turnaround}. Monitoring reports arrive once a month.`,
                      },
                    ].map((s, i) => (
                      <li key={s.t} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium">{s.t}</p>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.b}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div id="payment-and-refunds" className="rounded-xl border bg-background p-5 sm:p-6 scroll-mt-20 border-border">
                  <h3 className="font-semibold mb-3">Payment and refunds</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <li>
                      <span className="font-medium text-foreground">How you pay.</span> By PayPal link, sent by
                      email once the scope is confirmed. Use your PayPal balance, or a debit or credit card
                      through PayPal where your country supports it. We never ask for card details.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">When you pay.</span> Before work starts.
                      Turnaround is counted from the payment and read access, not from the order.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Late report.</span> If your report arrives
                      after the promised turnaround, we refund the full amount.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Not satisfied.</span> Tell us within{' '}
                      {REFUND_WINDOW_DAYS} days of delivery and we refund the full amount. Just reply to the
                      delivery email.
                    </li>
                    <li>
                      <span className="font-medium text-foreground">Monitoring.</span> Billed monthly through
                      PayPal. Cancel any time and the next month is not charged. The refund promise applies to
                      every monthly report.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:col-span-7">
                <div className="rounded-xl border bg-background p-5 shadow-sm sm:p-8 border-border">
                  <AuditOrderForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6">What the report actually looks like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Ranked by impact',
                  body: 'Findings are ordered by what fixing them is worth, not by an automated severity score. A missing alt tag and a noindex on your money page do not belong in the same bucket.',
                },
                {
                  title: 'False positives removed',
                  body: 'Automated tools flag things that do not matter and miss things that do. Every finding is checked by hand before it reaches the report.',
                },
                {
                  title: 'The fix, written out',
                  body: 'Each finding says what is wrong, which URLs are affected, and what specifically to change. Your developer should be able to act on it without a translation layer.',
                },
                {
                  title: 'Checked against your data',
                  body: 'A crawl on its own has no idea which pages matter. Findings are cross referenced with your Search Console and Analytics so the priorities reflect your actual traffic.',
                },
              ].map((c) => (
                <div key={c.title} className="rounded-xl border p-5 border-border">
                  <h3 className="font-semibold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample report */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="rounded-xl border p-6 sm:p-8 max-w-4xl border-border">
              <h2 className="text-2xl font-bold mb-3">Read a real report before you buy</h2>
              <p className="text-muted-foreground mb-5">
                Three pages from an actual Complete Audit, with the client name and URLs
                removed. It shows the priority table and three full findings so you can judge
                the depth for yourself rather than taking our word for it. No email required.
              </p>
              <a
                href="/sample-website-audit-report.pdf"
                className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                Download the sample report
              </a>
              <p className="text-xs text-muted-foreground mt-3">
                PDF, 3 pages. Opens in a new tab.
              </p>
            </div>
          </div>
        </section>

        {/* Honest section */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6">When you should not buy an audit</h2>
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl">
              {[
                {
                  t: 'Your site is brand new',
                  b: 'A site with 10 pages and no search history has nothing to audit. Publish, get some data, come back in a few months.',
                },
                {
                  t: 'You already know the problem',
                  b: 'If you know your site is slow and you have not fixed it, an audit will tell you your site is slow. Spend the money on the fix instead.',
                },
                {
                  t: 'Nobody can act on it',
                  b: 'An audit is only worth what gets implemented. If there is no developer time available for the next six months, the report will go stale before it gets used.',
                },
              ].map((c) => (
                <div key={c.t} className="rounded-xl border border-dashed p-5 border-border">
                  <h3 className="font-semibold mb-2">{c.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6">Common questions</h2>
            <div className="space-y-6 max-w-3xl">
              {faqs.map((f) => (
                <div key={f.question}>
                  <h3 className="font-semibold mb-2">{f.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-2xl font-bold mb-6">Do it yourself instead</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Everything in the paid audit is documented. If you have the time, these guides cover
              the same ground.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { href: '/tools/website-audit', t: 'Free website audit tool', d: 'Around 150 automated checks, no signup' },
                { href: '/blog/website-audit-checklist-2026', t: 'Website audit checklist', d: 'The 47 checks that actually matter' },
                { href: '/blog/website-code-audit-guide', t: 'Website code audit guide', d: 'Performance, rendering, security and schema' },
                { href: '/blog/on-site-seo-guide-2026', t: 'On page SEO checklist', d: 'Titles, headings and internal links' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border p-5 hover:border-blue-500 transition-colors group"
                >
                  <p className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {l.t}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{l.d}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
