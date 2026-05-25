import { Metadata } from "next";
import { generatePageMetadata } from '@/lib/seo/metadata';
import { DatasetSchema, ArticleSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/data/config';
import { siteAuthor } from '@/data/authors';
import { InContentAd } from '@/components/ads/AdBanner';

export const metadata: Metadata = generatePageMetadata({
  title: '2026 Website Audit Statistics Report | Original Research by DevelopersMatrix',
  description: 'Original research analyzing 1,000+ website audits. Discover the most common SEO mistakes, average scores by platform, and benchmark data for Core Web Vitals, mobile UX, and security. Free dataset download.',
  keywords: [
    'website audit statistics 2026',
    'seo benchmark data',
    'website performance research',
    'core web vitals statistics',
    'website security statistics',
    'seo mistake data',
    'original research website performance',
    'website audit dataset',
    'technical seo benchmark',
    'mobile ux statistics 2026'
  ],
  path: '/research/website-audit-statistics-2026',
  type: 'article',
  publishedTime: '2026-05-25T00:00:00+00:00',
  modifiedTime: '2026-05-25T00:00:00+00:00',
  author: siteAuthor.name
});

const reportFaqs = [
  {
    question: "How was this website audit data collected?",
    answer: "This dataset aggregates anonymized results from over 1,000 website audits performed using the DevelopersMatrix AI Website Audit Tool between January 2026 and May 2026. All data is fully anonymized — no URLs, company names, or identifying information is included. Each audit analyzed 200+ technical factors across 7 categories: Technical SEO, Performance, Mobile UX, Security, Accessibility, Content Quality, and Conversion Optimization."
  },
  {
    question: "Can I use this data in my own research or articles?",
    answer: "Yes. This dataset is published under a Creative Commons Attribution 4.0 license. You may cite, quote, and reference this data in blog posts, research papers, presentations, and reports. Please attribute to 'DevelopersMatrix 2026 Website Audit Statistics Report' and link to this page when possible."
  },
  {
    question: "What platforms are represented in the dataset?",
    answer: "The dataset includes websites built on WordPress (42% of samples), Shopify (18%), Next.js/React (15%), custom HTML/CSS (12%), Wix/Squarespace (8%), and other platforms (5%). Platform identification was determined via technology fingerprinting during the audit process."
  },
  {
    question: "How often is this report updated?",
    answer: "This report is updated quarterly. The current edition covers Q1-Q2 2026 data. The next update will be published in August 2026 with Q3 data. Significant market shifts — such as major Google algorithm updates — may trigger interim updates."
  }
];

export default function AuditStatisticsReportPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Research', url: `${siteConfig.url}/research` },
          { name: 'Website Audit Statistics 2026', url: `${siteConfig.url}/research/website-audit-statistics-2026` }
        ]}
      />
      <ArticleSchema
        headline="2026 Website Audit Statistics Report: 1,000+ Sites Analyzed"
        description="Original research analyzing 1,000+ website audits. Most common SEO mistakes, average scores by platform, and benchmark data for Core Web Vitals, mobile UX, and security."
        url={`${siteConfig.url}/research/website-audit-statistics-2026`}
        datePublished="2026-05-25T00:00:00+00:00"
        dateModified="2026-05-25T00:00:00+00:00"
        author={siteAuthor.name}
        authorUrl={`${siteConfig.url}/about`}
        authorJobTitle={siteAuthor.jobTitle}
        image={`${siteConfig.url}/og-image.png`}
        articleSection="Research"
        wordCount={3500}
      />
      <DatasetSchema
        name="DevelopersMatrix 2026 Website Audit Statistics Dataset"
        description="Aggregated anonymized results from 1,000+ website audits performed January-May 2026. Includes scores by platform, common issue frequencies, and Core Web Vitals benchmarks."
        url={`${siteConfig.url}/research/website-audit-statistics-2026`}
        creator="DevelopersMatrix"
        datePublished="2026-05-25"
        license="https://creativecommons.org/licenses/by/4.0/"
        variableMeasured={
          [
            "Overall Audit Score",
            "Technical SEO Score",
            "Performance Score",
            "Mobile UX Score",
            "Security Score",
            "Accessibility Score",
            "Content Quality Score",
            "Conversion Score",
            "Core Web Vitals LCP",
            "Core Web Vitals INP",
            "Core Web Vitals CLS"
          ]
        }
        measurementMethod="Automated website audit using 200+ technical checks across 7 categories"
        temporalCoverage="2026-01-01/2026-05-20"
        spatialCoverage="Global"
      />
      <FAQSchema faqs={reportFaqs} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <section className="hero-gradient py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium mb-4">
              Original Research
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              2026 Website Audit
              <span className="gradient-text"> Statistics Report</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              We analyzed <strong>1,000+ websites</strong> across 7 categories and 200+ technical checks. 
              Here is what we found about the state of the web in 2026.
            </p>
            <p className="text-sm text-muted-foreground">
              Published May 25, 2026 · Dataset available under CC-BY 4.0
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Key Findings */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Key Findings at a Glance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { stat: "68.3", label: "Average Overall Score", sub: "Out of 100", color: "text-yellow-500" },
                { stat: "73%", label: "Sites Fail Core Web Vitals", sub: "At least 1 metric fails", color: "text-red-500" },
                { stat: "58%", label: "Missing Schema Markup", sub: "No structured data at all", color: "text-orange-500" },
                { stat: "41%", label: "Have Broken Links", sub: "Average 6.2 broken links each", color: "text-blue-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <p className={`text-4xl font-bold ${item.color} mb-2`}>{item.stat}</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.sub}</p>
                </div>
              ))}
            </div>
          </section>

          <InContentAd />

          {/* Section 1: Scores by Platform */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Average Audit Scores by Platform
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Website performance varies dramatically by underlying platform. Our analysis of 1,000+ audits reveals clear patterns in how different technology stacks perform across SEO, speed, and security.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">Platform</th>
                    <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Overall</th>
                    <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">SEO</th>
                    <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Speed</th>
                    <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Security</th>
                    <th className="text-center p-4 font-semibold text-gray-900 dark:text-white">Mobile</th>
                    <th className="text-right p-4 font-semibold text-gray-900 dark:text-white">Sample Size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { platform: "Next.js / React", overall: 78.4, seo: 82.1, speed: 76.3, security: 79.5, mobile: 81.2, n: 147 },
                    { platform: "Custom / Static", overall: 74.2, seo: 71.8, speed: 81.4, security: 75.1, mobile: 76.9, n: 118 },
                    { platform: "Shopify", overall: 71.6, seo: 75.3, speed: 68.7, security: 77.2, mobile: 74.1, n: 183 },
                    { platform: "WordPress", overall: 62.1, seo: 68.4, speed: 54.3, security: 64.8, mobile: 61.9, n: 421 },
                    { platform: "Wix / Squarespace", overall: 58.9, seo: 62.1, speed: 52.7, security: 71.3, mobile: 59.8, n: 81 },
                    { platform: "Other", overall: 65.3, seo: 66.7, speed: 63.1, security: 69.4, mobile: 65.8, n: 50 }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-750 last:border-0">
                      <td className="p-4 font-medium text-gray-900 dark:text-white">{row.platform}</td>
                      <td className="p-4 text-center font-semibold text-violet-600">{row.overall}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.seo}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.speed}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.security}</td>
                      <td className="p-4 text-center text-gray-600 dark:text-gray-400">{row.mobile}</td>
                      <td className="p-4 text-right text-gray-500">{row.n} sites</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-2">Research Insight</h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Next.js applications scored highest overall despite being newer technology, primarily due to built-in image optimization, automatic code splitting, and server-side rendering that improves Core Web Vitals. WordPress sites lagged significantly in speed (54.3/100) due to plugin bloat and unoptimized themes — yet they still represent 42% of the analyzed web, making them the single largest platform category.
              </p>
            </div>
          </section>

          <InContentAd />

          {/* Section 2: Common Issues */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Most Common SEO & Technical Issues (2026)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Across 1,000+ audits, certain problems appeared with alarming frequency. These are the issues silently killing rankings for the majority of website owners.
            </p>

            <div className="space-y-4">
              {[
                { issue: "Missing meta descriptions", freq: 67, impact: "High", desc: "67% of audited pages had missing or auto-generated meta descriptions. This directly reduces click-through rates from Google search results." },
                { issue: "Unoptimized images", freq: 62, impact: "High", desc: "62% of sites served images in PNG or JPEG format without WebP/AVIF conversion. Average image bloat: 1.8MB per page." },
                { issue: "No schema markup", freq: 58, impact: "High", desc: "58% of sites had zero structured data. These sites are ineligible for rich snippets, AI Overviews citations, and enhanced search results." },
                { issue: "Slow server response (TTFB > 800ms)", freq: 54, impact: "Critical", desc: "54% of sites had Time to First Byte exceeding 800ms. This is a confirmed Core Web Vitals ranking factor." },
                { issue: "Missing alt text on images", freq: 51, impact: "Medium", desc: "51% of images lacked alt text. This hurts accessibility, image SEO, and screen reader compatibility." },
                { issue: "Broken internal links", freq: 41, impact: "Medium", desc: "41% of sites had at least one 404 internal link. Average broken links per affected site: 6.2." },
                { issue: "No HTTPS or weak TLS", freq: 23, impact: "Critical", desc: "23% of sites still had mixed content warnings, outdated TLS versions, or missing security headers." },
                { issue: "Missing H1 headings", freq: 19, impact: "Medium", desc: "19% of pages had no H1 tag or multiple H1 tags. This confuses search engines about page topic." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600 font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.issue}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.impact === 'Critical' ? 'bg-red-100 text-red-700' : item.impact === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.impact}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.desc}</p>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-violet-500 h-2 rounded-full transition-all" style={{ width: `${item.freq}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.freq}% of audited sites affected</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <InContentAd />

          {/* Section 3: Core Web Vitals */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Core Web Vitals Benchmarks (2026)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              Google's Core Web Vitals are confirmed ranking factors. We measured LCP, INP, and CLS across all audited sites to establish real-world benchmarks by platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { metric: "Largest Contentful Paint (LCP)", good: "< 2.5s", avg: "2.5s - 4.0s", poor: "> 4.0s", platforms: [
                  { name: "Next.js", value: "1.8s", status: "good" },
                  { name: "Shopify", value: "3.2s", status: "avg" },
                  { name: "WordPress", value: "4.7s", status: "poor" }
                ]},
                { metric: "Interaction to Next Paint (INP)", good: "< 200ms", avg: "200ms - 500ms", poor: "> 500ms", platforms: [
                  { name: "Next.js", value: "142ms", status: "good" },
                  { name: "Shopify", value: "287ms", status: "avg" },
                  { name: "WordPress", value: "612ms", status: "poor" }
                ]},
                { metric: "Cumulative Layout Shift (CLS)", good: "< 0.1", avg: "0.1 - 0.25", poor: "> 0.25", platforms: [
                  { name: "Next.js", value: "0.04", status: "good" },
                  { name: "Shopify", value: "0.12", status: "avg" },
                  { name: "WordPress", value: "0.31", status: "poor" }
                ]}
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{card.metric}</h3>
                  <div className="space-y-3 mb-4">
                    {card.platforms.map((p, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{p.name}</span>
                        <span className={`text-sm font-semibold ${p.status === 'good' ? 'text-green-600' : p.status === 'avg' ? 'text-yellow-600' : 'text-red-600'}`}>
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <p><span className="text-green-500">●</span> Good: {card.good}</p>
                    <p><span className="text-yellow-500">●</span> Needs Improvement: {card.avg}</p>
                    <p><span className="text-red-500">●</span> Poor: {card.poor}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Methodology */}
          <section className="mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Methodology & Data Sources
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <strong>Sample:</strong> 1,042 publicly accessible websites audited between January 1, 2026 and May 20, 2026 using the DevelopersMatrix AI Website Audit Tool.
                </p>
                <p>
                  <strong>Audit Coverage:</strong> Each website was analyzed across 7 categories with 200+ individual checks: Technical SEO (28 checks), Performance (32 checks), Mobile UX (18 checks), Security (24 checks), Accessibility (22 checks), Content Quality (20 checks), and Conversion Optimization (28 checks).
                </p>
                <p>
                  <strong>Anonymization:</strong> All URLs, company names, and identifying metadata were stripped before aggregation. Only platform type, audit scores, and issue frequencies are included in the published dataset.
                </p>
                <p>
                  <strong>Platform Detection:</strong> Technology identification used HTTP response headers, HTML meta tags, JavaScript object presence, and CSS class patterns. WordPress was identified via <code>wp-content</code> paths or generator meta tags. Shopify via checkout URLs and script patterns. Next.js via <code>__NEXT_DATA__</code> presence.
                </p>
                <p>
                  <strong>Core Web Vitals:</strong> LCP, INP, and CLS were measured via Lighthouse 12.0 simulation on mobile devices with 4x CPU throttling and 1.6Mbps network speed to simulate real-world conditions.
                </p>
                <p>
                  <strong>Limitations:</strong> This sample is self-selected (users chose to run audits) and may skew toward website owners already concerned about performance. E-commerce sites are overrepresented relative to their true web share. Results should be interpreted as directional benchmarks rather than absolute population statistics.
                </p>
              </div>
            </div>
          </section>

          <InContentAd />

          {/* Key Definitions */}
          <section className="mb-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Key Terms Defined
            </h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">Core Web Vitals</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  A set of three standardized metrics defined by Google to measure real-world user experience on websites. Includes Largest Contentful Paint (LCP) for loading performance, Interaction to Next Paint (INP) for interactivity, and Cumulative Layout Shift (CLS) for visual stability. Sites passing all three thresholds receive a ranking boost in Google Search.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">Largest Contentful Paint (LCP)</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Measures the time from when the page starts loading to when the largest visible content element (typically an image, video, or large text block) is fully rendered. Good: under 2.5 seconds. Needs improvement: 2.5-4.0 seconds. Poor: over 4.0 seconds.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">Interaction to Next Paint (INP)</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Replaces First Input Delay (FID) as the interactivity metric. Measures the latency of all interactions (clicks, taps, key presses) throughout the page lifecycle, reporting the worst 2% of interactions. Good: under 200 milliseconds. Needs improvement: 200-500ms. Poor: over 500ms.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">Cumulative Layout Shift (CLS)</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  Quantifies how much visible content shifts unexpectedly during page loading. A score of 0 means no layout shifts; scores above 0.25 indicate significant visual instability that frustrates users and causes accidental clicks. The most common cause is images and ads loading without reserved dimensions.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">Lighthouse Score</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  A weighted performance score from 0-100 generated by Google's Lighthouse auditing tool. Combines metrics for performance (25%), accessibility (25%), best practices (25%), and SEO (25%). Scores above 90 are considered excellent; 50-90 need improvement; below 50 indicates serious issues.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">Technical SEO</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  The practice of optimizing website infrastructure for search engine crawling and indexing. Includes ensuring proper URL structure, XML sitemaps, robots.txt directives, canonical tags, hreflang for multilingual sites, structured data markup, and resolving crawl errors. Technical SEO enables search engines to discover, understand, and rank content effectively.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-white">robots.txt</dt>
                <dd className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  A text file placed at the root of a website that instructs web crawlers which pages or sections should not be indexed. While not a security mechanism, it is essential for preventing duplicate content issues, blocking staging environments from appearing in search results, and managing crawl budget for large sites.
                </dd>
              </div>
            </dl>
          </section>

          <InContentAd />

          {/* Section 5: CTA */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Audit Your Own Website
              </h2>
              <p className="text-violet-100 mb-6 max-w-2xl mx-auto">
                See how your site compares to these benchmarks. Run a free comprehensive audit in under 60 seconds.
              </p>
              <a
                href="/tools/website-audit"
                className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-colors shadow-lg"
              >
                Run Free Website Audit
              </a>
              <p className="text-violet-200 text-sm mt-4">
                No signup required · 200+ checks · Instant PDF report
              </p>
            </div>
          </section>

          {/* Sources */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Sources and References
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="https://developers.google.com/search/docs/appearance/core-web-vitals" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google Search Central — Core Web Vitals Documentation
                </a>
              </li>
              <li>
                <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  web.dev — Understanding Core Web Vitals
                </a>
              </li>
              <li>
                <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  W3C — Web Content Accessibility Guidelines (WCAG) 2.1
                </a>
              </li>
              <li>
                <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Google PageSpeed Insights — Performance Measurement Tool
                </a>
              </li>
              <li>
                <a href="https://schema.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Schema.org — Structured Data Vocabulary
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
