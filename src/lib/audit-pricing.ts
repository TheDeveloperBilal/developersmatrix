// ---------------------------------------------------------------------------
// Website audit pricing. The services page, its structured data, the order
// form, the order email and the customer's receipt all read from this block,
// so changing a number here changes it everywhere.
//
// How these were set:
//   Sept 2026: $199 / $499 / $249 a month, priced against the market.
//   Oct 2026: lowered by the owner to $9.99 / $49 / $15 a month so the first
//   clients can try the service while the site has no reviews or case studies.
//   Revisit once there are published results to point at.
//
// Payment is taken by PayPal link, sent by email after the scope is confirmed.
// There is no payment form on the site.
// ---------------------------------------------------------------------------

export interface AuditTier {
  id: 'essential' | 'complete' | 'ongoing';
  name: string;
  price: number;
  period?: 'month';
  turnaround: string;
  featured?: boolean;
  summary: string;
  bestFor: string;
  includes: string[];
}

export const AUDIT_PRICING: { currency: string; currencySymbol: string; tiers: AuditTier[] } = {
  currency: 'USD',
  currencySymbol: '$',
  tiers: [
    {
      id: 'essential',
      name: 'Essential Audit',
      price: 9.99,
      turnaround: '3 working days',
      summary: 'A full technical and on page review of a single site, delivered as a prioritised report.',
      bestFor: 'Small business sites and portfolios under 100 pages',
      includes: [
        'Crawl of up to 100 pages',
        'Technical SEO review: indexing, canonicals, redirects, status codes',
        'Core Web Vitals and page speed analysis on your five most important pages',
        'On page review: titles, meta descriptions, heading structure, internal links',
        'Mobile rendering and accessibility check',
        'Findings ranked by impact, with the fix for each one written out',
      ],
    },
    {
      id: 'complete',
      name: 'Complete Audit',
      price: 49,
      turnaround: '5 working days',
      featured: true,
      summary: 'Everything in Essential, plus content, structured data and a competitor comparison.',
      bestFor: 'Content sites, ecommerce and anyone whose traffic has dropped',
      includes: [
        'Crawl of up to 1,000 pages',
        'Everything in the Essential Audit',
        'Content review: thin pages, duplication and keyword cannibalisation',
        'Structured data validation across every template',
        'Backlink profile review, including spam and disavow candidates',
        'Comparison against three competitors you name',
      ],
    },
    {
      id: 'ongoing',
      name: 'Ongoing Monitoring',
      price: 15,
      period: 'month',
      turnaround: 'Monthly report',
      summary: 'A monthly re audit so regressions get caught in weeks rather than quarters.',
      bestFor: 'Sites that ship changes often, or teams without an in house SEO',
      includes: [
        'Monthly full re audit',
        'Alerts when a check that was passing starts failing',
        'Search Console and Analytics reviewed alongside the crawl',
        'A short written summary of what changed and what to do',
        'Email access for questions between reports',
      ],
    },
  ],
};

export type AuditTierId = AuditTier['id'];

export function findTier(id: string | undefined): AuditTier | undefined {
  return AUDIT_PRICING.tiers.find((t) => t.id === id);
}

/** "$9.99", "$49" or "$15 a month". */
export function tierPrice(t: AuditTier): string {
  const amount = Number.isInteger(t.price) ? String(t.price) : t.price.toFixed(2);
  return `${AUDIT_PRICING.currencySymbol}${amount}${t.period ? ` a ${t.period}` : ''}`;
}

/** Days the refund window stays open after a report is delivered. */
export const REFUND_WINDOW_DAYS = 7;
