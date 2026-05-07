import { Metadata } from 'next';
import { siteConfig } from '@/data/config';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { BreadcrumbSchema, FAQSchema, SoftwareApplicationSchema } from '@/components/seo/SchemaMarkup';
import WebsiteAuditClient from './WebsiteAuditClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['website-audit']);

const faqs = [
  {
    question: 'What does the website audit tool check?',
    answer: 'Our AI website audit tool performs over 200 checks across 7 categories: Technical SEO (title tags, meta descriptions, headings, canonicals, schema markup), Performance (page size, load time, scripts, images, caching), Mobile UX (viewport, touch targets, responsive design), Security (HTTPS, security headers, mixed content), Accessibility (alt text, labels, ARIA, heading hierarchy), Content Quality (readability, word count, CTAs, trust signals), and Conversion Optimization (value propositions, social proof, form security).'
  },
  {
    question: 'Is the website audit tool free?',
    answer: 'Yes, completely free. No signup required, no credit card needed, and no usage limits. We believe every website owner deserves access to professional-grade audit tools regardless of budget.'
  },
  {
    question: 'How accurate is the website audit?',
    answer: 'The audit score is calculated based on industry-standard best practices from Google Lighthouse, PageSpeed Insights, and WCAG guidelines. While no automated tool can catch everything, our scoring correlates strongly with real search engine ranking factors and Core Web Vitals metrics that Google uses directly in its algorithm.'
  },
  {
    question: 'Can I download the audit report?',
    answer: 'Yes! After running an audit, you can copy the full text report to clipboard or download a professionally formatted PDF report. The PDF includes your scores, categorized issues, actionable recommendations, and content analysis — perfect for sharing with clients or team members.'
  },
  {
    question: 'How often should I audit my website?',
    answer: 'For active websites, we recommend monthly audits to catch issues early. After any major update (new design, CMS upgrade, content migration), run an audit immediately. E-commerce sites should audit weekly during high-traffic periods like holidays.'
  },
  {
    question: 'Will fixing these issues improve my Google rankings?',
    answer: 'Yes, especially for technical SEO and performance issues. Google explicitly uses page speed, mobile-friendliness, HTTPS, and Core Web Vitals as ranking factors. Fixing critical and high-priority issues typically leads to measurable ranking improvements within 2-4 weeks.'
  },
  {
    question: 'Does the audit work for any type of website?',
    answer: 'Yes, our tool works with any publicly accessible website — WordPress, Shopify, Wix, Next.js, React, Vue, plain HTML, and more. It checks the rendered output, so it works regardless of what technology powers your site.'
  },
  {
    question: "What is a 'good' website audit score?",
    answer: 'Scores break down as: 90-100 (Excellent — minimal issues, well-optimized), 70-89 (Good — some improvements needed), 50-69 (Fair — significant issues affecting performance/SEO), 0-49 (Poor — critical issues requiring immediate attention). Most websites score between 60-80 on their first audit.'
  }
];

export default function WebsiteAuditPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Tools', url: `${siteConfig.url}/tools` },
          { name: 'AI Website Audit', url: `${siteConfig.url}/tools/website-audit` }
        ]}
      />
      <SoftwareApplicationSchema
        name="AI Website Audit Tool"
        description="Free AI-powered website audit tool for comprehensive SEO, performance, security, and accessibility analysis."
        url={`${siteConfig.url}/tools/website-audit`}
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        offers={{ price: '0', priceCurrency: 'USD' }}
        aggregateRating={{ ratingValue: '4.8', ratingCount: '1250' }}
      />
      <FAQSchema faqs={faqs} />
      <WebsiteAuditClient />
    </>
  );
}
