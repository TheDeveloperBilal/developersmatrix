import { Metadata } from 'next';
import { siteConfig } from '@/data/config';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { BreadcrumbSchema, FAQSchema, SoftwareApplicationSchema } from '@/components/seo/SchemaMarkup';
import WebsiteAuditClient from './WebsiteAuditClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['website-audit']);

const faqs = [
  { question: 'What does the website audit tool check?', answer: 'Our AI website audit tool performs comprehensive analysis including Technical SEO (title tags, meta descriptions, heading structure, canonical tags), Performance (page size, load time, scripts, images), Mobile UX (viewport, touch targets, responsive design), Security (HTTPS, security headers, mixed content), Accessibility (alt text, labels, heading hierarchy), and Content Quality (readability, CTAs, trust signals).' },
  { question: 'Is the website audit tool free?', answer: 'Yes, our website audit tool is completely free to use. You can audit any website and receive a comprehensive report with scores and recommendations at no cost.' },
  { question: 'How accurate is the website audit?', answer: 'Our audit engine uses real-time crawling and analysis to provide accurate, actionable insights. We analyze actual page content, headers, and structure rather than relying on estimates or third-party data.' },
  { question: 'Can I download the audit report?', answer: 'Yes, you can download your audit report in PDF or DOCX format. Reports include all findings, scores, recommendations, and are branded with your website analysis details.' },
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
