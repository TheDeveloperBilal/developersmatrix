// Enhanced SchemaMarkup.tsx with GEO-optimized structured data
// Supports: Organization, Person, WebApplication, Article, FAQPage, BreadcrumbList,
// HowTo, Review, AggregateRating, Dataset, ClaimReview, ItemList

// One identity for the site and one for the founder. Every page that outputs
// these uses the same @id, so search engines read them as the same entities
// instead of several slightly different copies.
export const SITE_URL = 'https://developersmatrix.com';
export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/about#person`;
export const CONTACT_EMAIL = 'info@developersmatrix.com';

// Official DevelopersMatrix profiles, confirmed by the owner (Oct 2026).
export const ORG_SAME_AS = [
  'https://www.facebook.com/developersmatrix/',
  'https://www.instagram.com/developermatrix/',
  'https://www.pinterest.com/developersmatrix/',
  'https://linkedin.com/company/developersmatrix'
];

export const OVITECH = { name: 'OviTech Global', url: 'https://ovitech.co/' };

interface OrganizationSchemaProps {
  name: string;
  url: string;
  description: string;
  logo?: string;
  /** Kept for older call sites. The founder is always the site owner. */
  founder?: string;
  /** Ignored. DevelopersMatrix does not publish a team size. */
  employees?: string;
  knowsAbout?: string[];
  /** Ignored. The official profiles in ORG_SAME_AS are always used. */
  sameAs?: string[];
}

export function OrganizationSchema({
  name,
  url,
  description,
  logo,
  knowsAbout = [
    'Software Development',
    'Web Development',
    'Career Optimization',
    'Technical Interview Preparation',
    'Resume Building',
    'Website SEO',
    'Productivity Tools',
    'Developer Tools'
  ]
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name,
    url,
    description,
    ...(logo && { logo }),
    email: CONTACT_EMAIL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: CONTACT_EMAIL,
      availableLanguage: ['English']
    },
    founder: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Syed Bilal Shah'
    },
    knowsAbout,
    sameAs: ORG_SAME_AS,
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Free Online Tools',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Thing', name: 'AI Resume Builder' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Thing', name: 'Website Audit Tool' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Thing', name: 'Interview Simulator' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Thing', name: 'Salary Estimator' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Thing', name: 'Budget Planner' } }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PersonSchemaProps {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  /** Used when no affiliations are given. */
  worksFor?: string;
  description?: string;
  alumniOf?: string;
  knowsAbout?: string[];
  sameAs?: string[];
  /** Set for the site founder so every page points at the same person. */
  id?: string;
  /** Organizations the person works for, linked by @id or url. */
  affiliations?: { name: string; url?: string; id?: string }[];
}

export function PersonSchema({
  name,
  url,
  image,
  jobTitle = 'Lead Editor',
  worksFor = 'DevelopersMatrix',
  description,
  alumniOf,
  knowsAbout = ['Software Engineering', 'Web Development', 'Technical Writing', 'Career Development'],
  sameAs = [],
  id,
  affiliations
}: PersonSchemaProps) {
  const orgs = affiliations && affiliations.length > 0
    ? affiliations.map((o) => ({
        '@type': 'Organization',
        ...(o.id && { '@id': o.id }),
        name: o.name,
        ...(o.url && { url: o.url })
      }))
    : { '@type': 'Organization', name: worksFor };
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    ...(id && { '@id': id }),
    name,
    ...(url && { url }),
    ...(image && { image }),
    jobTitle,
    worksFor: orgs,
    ...(description && { description }),
    ...(alumniOf && { alumniOf: {
      '@type': 'Organization',
      name: alumniOf
    }}),
    knowsAbout,
    ...(sameAs.length > 0 && { sameAs })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebApplicationSchemaProps {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  featureList?: string[];
}

export function WebApplicationSchema({
  name,
  description,
  url,
  applicationCategory,
  operatingSystem,
  offers,
  featureList = []
}: WebApplicationSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    ...(offers && { offers: {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency
    }}),
    ...(featureList.length > 0 && { featureList })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleSchemaProps {
  headline: string;
  description: string;
  author: string;
  authorUrl?: string;
  authorImage?: string;
  authorJobTitle?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  wordCount?: number;
  articleSection?: string;
}

export function ArticleSchema({
  headline,
  description,
  author,
  authorUrl,
  authorImage,
  authorJobTitle = 'Lead Editor',
  datePublished,
  dateModified,
  image,
  url,
  wordCount,
  articleSection
}: ArticleSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    author: {
      '@type': 'Person',
      name: author,
      ...(authorUrl && { url: authorUrl }),
      ...(authorImage && { image: authorImage }),
      jobTitle: authorJobTitle
    },
    datePublished,
    ...(dateModified && { dateModified }),
    ...(image && { image }),
    publisher: {
      '@type': 'Organization',
      name: 'DevelopersMatrix',
      url: 'https://developersmatrix.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://developersmatrix.com/favicon.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(wordCount && { wordCount }),
    ...(articleSection && { articleSection })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface HowToSchemaProps {
  name: string;
  description: string;
  /** Canonical page the HowTo lives on. */
  url?: string;
  image?: string;
  totalTime?: string;
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: string[];
  tool?: string[];
  step: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}

export function HowToSchema({
  name,
  description,
  url,
  image,
  totalTime,
  estimatedCost,
  supply,
  tool,
  step
}: HowToSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(url && { mainEntityOfPage: { '@type': 'WebPage', '@id': url } }),
    ...(image && { image }),
    ...(totalTime && { totalTime }),
    ...(estimatedCost && { estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: estimatedCost.currency,
      value: estimatedCost.value
    }}),
    ...(supply && supply.length > 0 && { supply: supply.map(s => ({ '@type': 'HowToSupply', name: s })) }),
    ...(tool && tool.length > 0 && { tool: tool.map(t => ({ '@type': 'HowToTool', name: t })) }),
    step: step.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url && { url: s.url }),
      ...(s.image && { image: s.image })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ReviewSchemaProps {
  itemReviewed: string;
  reviewBody: string;
  author: string;
  reviewRating: {
    ratingValue: string;
    bestRating?: string;
  };
  datePublished?: string;
}

export function ReviewSchema({
  itemReviewed,
  reviewBody,
  author,
  reviewRating,
  datePublished
}: ReviewSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'WebApplication',
      name: itemReviewed
    },
    reviewBody,
    author: {
      '@type': 'Person',
      name: author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating.ratingValue,
      bestRating: reviewRating.bestRating || '5'
    },
    ...(datePublished && { datePublished })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface DatasetSchemaProps {
  name: string;
  description: string;
  url: string;
  creator: string;
  datePublished: string;
  license?: string;
  variableMeasured?: string[];
  measurementMethod?: string;
  temporalCoverage?: string;
  spatialCoverage?: string;
}

export function DatasetSchema({
  name,
  description,
  url,
  creator,
  datePublished,
  license = 'https://creativecommons.org/licenses/by/4.0/',
  variableMeasured = [],
  measurementMethod,
  temporalCoverage,
  spatialCoverage
}: DatasetSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url,
    creator: {
      '@type': 'Organization',
      name: creator
    },
    datePublished,
    license,
    ...(variableMeasured.length > 0 && { variableMeasured }),
    ...(measurementMethod && { measurementMethod }),
    ...(temporalCoverage && { temporalCoverage }),
    ...(spatialCoverage && { spatialCoverage })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ClaimReviewSchemaProps {
  claimReviewed: string;
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
    alternateName?: string;
  };
  author: string;
  datePublished: string;
  itemReviewed?: string;
  url?: string;
}

export function ClaimReviewSchema({
  claimReviewed,
  reviewRating,
  author,
  datePublished,
  itemReviewed,
  url
}: ClaimReviewSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ClaimReview',
    claimReviewed,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: reviewRating.ratingValue,
      bestRating: reviewRating.bestRating || 5,
      worstRating: reviewRating.worstRating || 1,
      alternateName: reviewRating.alternateName || (reviewRating.ratingValue >= 4 ? 'True' : reviewRating.ratingValue >= 2 ? 'Mixed' : 'False')
    },
    author: {
      '@type': 'Organization',
      name: author
    },
    datePublished,
    ...(itemReviewed && { itemReviewed: {
      '@type': 'CreativeWork',
      name: itemReviewed
    }}),
    ...(url && { url })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ItemListSchemaProps {
  name: string;
  description?: string;
  itemListElement: Array<{
    name: string;
    description?: string;
    url?: string;
    position?: number;
  }>;
}

export function ItemListSchema({
  name,
  description,
  itemListElement
}: ItemListSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description && { description }),
    itemListElement: itemListElement.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position || index + 1,
      name: item.name,
      ...(item.description && { description: item.description }),
      ...(item.url && { url: item.url })
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Alias for backward compatibility
export { WebApplicationSchema as SoftwareApplicationSchema };
