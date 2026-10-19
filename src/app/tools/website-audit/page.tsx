import React from 'react';
import { Metadata } from 'next';
import { Search, Gauge, Smartphone, Accessibility } from 'lucide-react';
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/data/config';
import { SidebarAd, InContentAd } from '@/components/ads/AdBanner';
import { generatePageMetadata } from '@/lib/seo/metadata';
import WebsiteAuditClient from './WebsiteAuditClient';

export const metadata: Metadata = generatePageMetadata({
  title: "Free Website Audit Tool Online: Score Your Site",
  description: "Audit your website online free. Around 150 checks across SEO, speed, Core Web Vitals, mobile and security. Get a score out of 100 and a fix list. No signup.",
  keywords: ['audit website online', 'website audit tool online', 'website audit', 'audit website', 'audit a website', 'website auditor tool online', 'site audit online', 'site auditor online', 'audit checker', 'online website audit', 'web site audit', 'website auditor', 'web audit tool', 'website code audit', 'audit my website', 'audit of website', 'free website audit tool', 'website health check free', 'seo audit tool online', 'technical seo audit free', 'seo score checker', 'website performance checker', 'google core web vitals checker', 'website speed test tool', 'mobile friendly test tool', 'accessibility audit tool free', 'website security scanner free', 'free website analyzer', 'website grader', 'grade my website'],
  path: "/tools/website-audit",
  modifiedTime: "2026-10-14",
});

const toolFaqs = [
  {
    question: "Is this website audit tool completely free?",
    answer: "Yes, 100% free. No signup required, no credit card needed, and no usage limits. We believe every website owner deserves access to professional grade audit tools regardless of budget. Run as many audits as you want on as many sites as you own."
  },
  {
    question: "Is this a website grader?",
    answer: "Yes. A website grader scores your site out of 100 and tells you what is holding the score down. That is exactly what this tool does, across eight categories: technical SEO, performance, mobile usability, security, accessibility, content quality, conversion and Core Web Vitals. The difference is what happens after the grade. Most website graders show you a number and then ask for your email to see the detail. You get the full breakdown here, every failing check with the specific fix, with no signup."
  },
  {
    question: "How is a website grade calculated?",
    answer: "Each of the around 150 checks passes or fails, and each category produces its own score from the checks inside it. The overall grade is the weighted average, with technical SEO and performance carrying the most weight because they have the clearest relationship to rankings. A failing check on something Google uses directly, such as a missing title tag or an LCP over 2.5 seconds, costs more than a failing check on something advisory. The report shows every category score alongside the overall grade so you can see which area is dragging you down."
  },
  {
    question: "What does the website audit tool check in 2026?",
    answer: "Our AI website audit tool performs around 150 checks across 8 categories. For Technical SEO, we examine title tags, meta descriptions, headings, canonical URLs, schema markup, and internal links. For Performance, we look at page size, load time, render blocking resources, image optimization, and caching. Mobile UX covers viewport settings, touch targets, responsive design, and mobile meta tags. Security checks include HTTPS enforcement, security headers, mixed content detection, and TLS version. Accessibility tests cover alt text, form labels, ARIA roles, heading hierarchy, and color contrast. Content Quality analyzes readability, word count, calls to action, and trust signals. Finally, Conversion Optimization checks value propositions, social proof, and form security."
  },
  {
    question: "How accurate is this compared to Google Lighthouse?",
    answer: "Our scoring correlates strongly with Google Lighthouse, PageSpeed Insights, and WebPageTest results. We use the same Core Web Vitals metrics that Google uses as direct ranking factors: Largest Contentful Paint for loading speed, Interaction to Next Paint for responsiveness, and Cumulative Layout Shift for visual stability. The key difference is that we add SEO specific checks that Lighthouse does not cover. We analyze meta tag completeness, validate schema markup, and score keyword density. Think of our tool as combining Lighthouse, an SEO analyzer, and a security scanner into one comprehensive audit."
  },
  {
    question: "Will fixing audit issues actually improve my Google rankings?",
    answer: "Yes, but with realistic expectations. Technical SEO fixes like repairing broken links, adding missing meta tags, and resolving duplicate content typically show ranking improvements within 2 to 4 weeks. Core Web Vitals improvements such as faster page speed and better layout stability can take 4 to 8 weeks for Google to fully recrawl and reassess. Security fixes like enabling HTTPS and adding proper headers act as immediate trust signals. Content improvements such as better readability and stronger calls to action impact engagement metrics, which indirectly affect rankings over time. We prioritize every fix by impact so you focus on what moves the needle first."
  },
  {
    question: "How often should I run a website audit in 2026?",
    answer: "For active business websites, monthly audits hit the sweet spot. After any major update such as a new design, CMS upgrade, content migration, or plugin installation, run an audit immediately because broken updates are the single most common cause of ranking drops. Ecommerce sites should audit weekly during high traffic periods like Black Friday and holiday seasons. After you fix issues, audit again in 2 to 4 weeks to confirm the improvements took effect. For stagnant brochure sites that rarely change, quarterly audits are sufficient."
  },
  {
    question: "Does this work for WordPress, Shopify, Next.js, and other platforms?",
    answer: "Yes. Any publicly accessible website works regardless of the technology stack underneath. We analyze the rendered HTML output, so the platform itself does not matter. WordPress sites often struggle with plugin bloat and caching misconfiguration. Shopify stores frequently have image optimization issues and heavy third party scripts. Next.js and React applications commonly face hydration problems and missing meta tags. Our tool detects platform specific patterns and tailors recommendations accordingly."
  },
  {
    question: "What is a good website audit score?",
    answer: "A score between 90 and 100 means excellent. Your site is well optimized with minimal issues and you are likely ranking well already. A score between 70 and 89 is good. Most websites fall into this range, and while the foundation is solid, some improvements remain. A score between 50 and 69 is fair. Significant issues are affecting performance and SEO, and you should expect ranking struggles. A score below 50 is poor and demands immediate attention. Your site may be penalized or even deindexed. Do not obsess over a perfect 100. An 85 with strong content consistently outranks a 98 with thin content."
  },
  {
    question: "Can I download or share the audit report?",
    answer: "Absolutely. After running an audit, copy the full text report to your clipboard or download a professionally formatted PDF. The PDF includes colour coded scores for each category, issues organized by severity level, actionable recommendations prioritized by impact, a complete content analysis breakdown, and a clean summary perfect for stakeholders. It is ideal for sharing with clients, team members, or freelancers who will implement the fixes."
  },
  {
    question: "What is a free website health check and why do I need one?",
    answer: "A free website health check is a quick diagnostic scan that evaluates your site's core performance indicators without any cost or commitment. It checks your site's crawlability, server response time, image optimization, security headers, mobile responsiveness, and Core Web Vitals. You need one because problems like slow load times, broken links, or missing meta tags often go unnoticed until they cause ranking drops. Running regular health checks catches these issues early, before they impact your traffic or revenue. Our tool delivers a full health check in under 30 seconds with no signup required."
  },
  {
    question: "How much does a website audit cost in 2026?",
    answer: "Website audit cost in 2026 ranges from free to over $5,000 depending on depth and provider. Free tools like DevelopersMatrix and Google Lighthouse cover technical SEO, performance, and security basics for small to medium sites. Paid desktop tools like Screaming Frog cost $259 per year and excel at full site crawling. All in one suites like Ahrefs ($99-$999/month) and SEMrush ($119-$449/month) add competitive analysis, rank tracking, and backlink data. Professional agency audits run $500-$5,000 and include manual review with custom strategy. For most sites under 1,000 pages, a free audit combined with Google Search Console is sufficient to start. Upgrade to paid tools only when your traffic justifies the investment."
  },
  {
    question: "Can I audit a single URL instead of my entire website?",
    answer: "Yes, absolutely. Our URL audit feature is designed for exactly this use case. Paste any individual page URL and get a deep analysis of that specific page's technical SEO, performance, content quality, and accessibility. This is perfect for checking a new blog post before publishing, verifying a landing page after a redesign, auditing a competitor's top ranking article, or spot checking a product page that dropped in conversions. While full site crawls are better for finding systemic issues like orphan pages and duplicate content, a single URL audit gives you granular, actionable data faster."
  },
  {
    question: "What is the best online website auditor for small businesses?",
    answer: "For small businesses, the best online website auditor is one that balances depth with simplicity and cost. DevelopersMatrix offers a completely free audit with around 150 checks across 8 categories, making it ideal for small sites that need quick, actionable insights without a learning curve or subscription. Google Lighthouse is also free and excellent for Core Web Vitals, but it lacks SEO and security checks. If you outgrow free tools, Screaming Frog at $259 per year is the next logical step for full site technical crawling. Avoid expensive all in one suites like Ahrefs or SEMrush until your site has significant traffic and you need ongoing rank tracking and competitive intelligence."
  },
  {
    question: "Why is my website audit score low?",
    answer: "Low scores most commonly result from slow page speed (unoptimized images, render blocking scripts), missing or duplicate meta descriptions, lack of HTTPS or mixed content warnings, poor mobile usability, and missing security headers. The audit report highlights each failing check with a specific fix recommendation so you can address the highest impact issues first."
  },
  {
    question: "Can I audit a competitor's website?",
    answer: "Yes. The tool audits any publicly accessible URL. Enter any website address to see its technical health score, identify weaknesses in its SEO foundation, and benchmark it against your own site."
  },
  {
    question: "How is this different from Google Search Console?",
    answer: "Google Search Console reports on how Google sees your site after the fact. indexing status, manual actions, and search performance data. The DevelopersMatrix audit tool gives you an instant proactive health check across SEO, speed, mobile, and security before Google flags issues. Use both together: the audit tool to identify and fix problems proactively, and Search Console to monitor the results."
  },
  {
    question: "What makes the DevelopersMatrix Site Health Score different from other audit tools?",
    answer: "Unlike generic pass or fail checkers, our scoring engine weights each check by its correlation with search ranking performance. For example, missing title tags carry a higher penalty than minor heading hierarchy issues because they impact rankings more severely. The score also factors in industry context: an ecommerce site is evaluated against ecommerce benchmarks, not generic standards."
  },
];

// A real run of this tool on developersmatrix.com, copied from the API
// response on 14 October 2026. Update by running the tool again; never edit
// the numbers by hand.
const SAMPLE = {
  date: '14 October 2026',
  overall: 77,
  pages: 5,
  findings: { total: 50, critical: 1, high: 1, medium: 19, low: 29 },
  categories: [
    ['SEO', 94],
    ['Technical', 92],
    ['Content', 88],
    ['Mobile', 83],
    ['Performance', 79],
    ['Security', 79],
    ['Accessibility', 43],
    ['Conversion', 40],
  ] as [string, number][],
  top: [
    { title: 'No Clear Call to Action Found', area: 'Conversion', severity: 'critical', fix: 'Add a primary and a secondary call to action above the fold.' },
    { title: 'Form Inputs Without Labels', area: 'Accessibility', severity: 'high', fix: 'Give every input a label element linked with the for attribute.' },
    { title: 'Missing X Frame Options Header', area: 'Security', severity: 'medium', fix: 'Send X-Frame-Options: DENY or SAMEORIGIN from the server.' },
    { title: '22 Small Tap Targets Detected', area: 'Mobile', severity: 'medium', fix: 'Make buttons and links at least 48 by 48 pixels on phones.' },
    { title: 'Fixed Width Layout', area: 'Mobile', severity: 'medium', fix: 'Use responsive units such as %, rem or vw instead of fixed pixels.' },
  ],
};

const CHECKLIST = [
  {
    title: 'Technical SEO',
    icon: Search,
    iconClass: 'text-blue-500',
    what: 'Meta Title, Meta Description, H1, Canonical Tag, Robots.txt, XML Sitemap and Structured Data tests.',
    items: [
      'Unique title tag on every page (50 to 60 characters)',
      'Unique meta description (120 to 158 characters)',
      'One H1 per page, headings in order',
      'Canonical tag on every page',
      'XML sitemap submitted to Google Search Console',
      'Robots.txt configured correctly',
      'Structured data (Article, FAQ, Organization)',
      'No broken internal links or redirect chains',
    ],
  },
  {
    title: 'Performance',
    icon: Gauge,
    iconClass: 'text-orange-500',
    what: 'Page Load Time, Page Size, Image Optimization, Render Blocking Resources, Lazy Loading and Text Compression tests.',
    items: [
      'LCP under 2.5 seconds',
      'INP under 200 milliseconds',
      'CLS under 0.1',
      'Images in WebP or AVIF format',
      'Text compression enabled',
      'CSS and JavaScript not blocking the first paint',
      'Offscreen images lazy loaded',
      'Fast server response (Time to First Byte)',
    ],
  },
  {
    title: 'Mobile and Security',
    icon: Smartphone,
    iconClass: 'text-purple-500',
    what: 'Viewport, Legible Font Size, Tap Target Size, HTTPS, Mixed Content and security header tests.',
    items: [
      'Viewport meta tag configured',
      'Tap targets at least 48 pixels',
      'No horizontal scroll on mobile',
      'HTTPS enforced sitewide',
      'Security headers (HSTS, CSP, X Frame Options)',
      'No mixed content warnings',
    ],
  },
  {
    title: 'Accessibility and Content',
    icon: Accessibility,
    iconClass: 'text-green-500',
    what: 'Image Alt Text, Heading Structure, Content Length, Readability and Keyword Stuffing tests.',
    items: [
      'Alt text on all images',
      'Form labels linked to their inputs',
      'Readable text with enough contrast',
      'Content over 300 words where the page needs it',
      'No keyword stuffing',
      'Clear calls to action present',
    ],
  },
];

const PROBLEMS = [
  { title: 'Slow Server Response Times', text: 'If your server takes over 800 milliseconds to respond, you have lost time before the page even starts loading. Cheap shared hosting, slow databases and missing caching are the usual causes. The audit measures Time to First Byte so you can see whether the delay is on the server or in the page itself.' },
  { title: 'Unoptimized Images', text: 'Serving a 2MB hero image as a PNG is one of the most common reasons a page is slow. WebP and AVIF files are usually far smaller at the same quality, responsive images with srcset serve the right size for each screen, and lazy loading delays images below the fold. The audit checks all three.' },
  { title: 'Missing or Duplicate Meta Descriptions', text: 'Google often uses the meta description for the search result snippet. Without one, Google picks text from the page that may not earn the click. Every important page should have a unique description between 120 and 158 characters.' },
  { title: 'Broken Internal Links and Orphan Pages', text: 'Broken links waste crawl budget and frustrate visitors. Pages with no internal links pointing to them are hard for Google to find at all. The audit flags broken links on the pages it scans, with the exact URLs.' },
  { title: 'Missing Schema Markup', text: 'Structured data helps Google understand your content and can unlock rich results such as breadcrumbs in search. Article, FAQ and Organization markup suit most content sites. The audit checks whether structured data is present and readable.' },
  { title: 'Poor Accessibility', text: 'Missing alt text, form fields without labels, low contrast and keyboard traps shut out visitors who rely on assistive technology, and in many places accessibility is also a legal requirement under standards such as WCAG 2.1 AA.' },
  { title: 'Third Party Script Bloat', text: 'Analytics, chat widgets, ad networks and social embeds each add weight. A heavy tag manager setup or chat widget can add seconds to load time on a phone. Load these scripts after the main content, or remove the ones you do not use.' },
];

const GOOGLE_CHECKS = [
  { title: 'Core Web Vitals', text: 'Google measures three metrics. Largest Contentful Paint tracks loading speed and should stay under 2.5 seconds. Interaction to Next Paint measures responsiveness and should stay under 200 milliseconds. Cumulative Layout Shift tracks visual stability and should stay under 0.1. The audit reports all three from Google PageSpeed where Google has field data for the page.' },
  { title: 'Mobile First Indexing', text: 'Google uses the mobile version of your page for indexing and ranking. If the mobile site is slow, broken or missing content compared with desktop, that is the version Google judges. The audit tests the viewport, tap targets and font sizes.' },
  { title: 'Trust Signals and E-E-A-T', text: 'Experience, Expertise, Authoritativeness and Trustworthiness. Quality raters look for author information, sources, secure connections, privacy policies and about pages. The audit checks for common trust signals and flags what is missing.' },
  { title: 'Technical Foundations', text: 'Canonical tags, one H1 per page, sensible meta descriptions, structured data, an XML sitemap and a correct robots.txt. They are not glamorous, but everything else builds on them. A broken canonical tag alone can stop the right page from ranking.' },
];

const PLATFORMS = [
  { title: 'WordPress Sites', issues: 'The most common issues on WordPress are plugins that still load files after you stop using them, missing caching, oversized images uploaded without compression, and heavy themes full of unused CSS and JavaScript.', fixes: 'Quick wins include a caching plugin, compressing images on upload, removing plugins you do not use, readable permalinks, and a lightweight theme.' },
  { title: 'Shopify Stores', issues: 'The most common issues on Shopify are large product images, heavy theme JavaScript, app scripts loading on every page, missing alt text on product photos, and duplicate content from collection filters.', fixes: 'Quick wins include compressing images before upload, lazy loading images below the fold, removing apps you do not use, unique descriptions on collection pages, and canonical tags on filtered collection URLs.' },
  { title: 'Next.js and React Apps', issues: 'The most common issues on modern frameworks are pages rendered only in the browser without proper meta tags, large JavaScript bundles, images that skip next/image, and navigation that crawlers cannot follow.', fixes: 'Quick wins include generateMetadata in the App Router, next/image with proper sizes, dynamic imports for heavy components, and server rendering for important pages.' },
];

const PHASES = [
  { title: 'Phase 1: Critical Fixes (Do These Today)', steps: [
    'Fix broken links first. Internal 404s waste crawl budget and hurt the visitor experience. The report lists the exact URLs.',
    'Add missing meta descriptions, written for the reader, between 120 and 158 characters.',
    'Move the site to HTTPS if it is not already there. Browsers mark plain HTTP pages as not secure.',
    'Add missing alt text to images. Screen readers need it, and image search relies on it.',
    'Add a canonical tag to every page to prevent duplicate content problems, especially on filtered pages.',
  ] },
  { title: 'Phase 2: Performance Optimization (This Week)', steps: [
    'Compress images, convert large PNGs to WebP or AVIF, serve responsive sizes and lazy load images below the fold.',
    'Set long cache headers for static files so repeat visits load faster.',
    'Minify CSS and JavaScript and remove code you no longer use.',
    'If Time to First Byte is over 800 milliseconds, look at caching, a CDN or faster hosting.',
    'Defer scripts that are not needed to show the page, such as analytics, chat widgets and social feeds.',
  ] },
  { title: 'Phase 3: Content and SEO Enhancements (This Month)', steps: [
    'Add structured data that fits the page: Article, FAQ or Organization markup.',
    'Link related pages to each other so every important page has several internal links pointing to it.',
    'Expand thin pages with genuinely useful information.',
    'Add author information and dates to articles.',
    'Create an XML sitemap and submit it in Google Search Console.',
  ] },
];

export default function WebsiteAuditPage() {
  const toolFaqsForSchema = toolFaqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <>
      {/* Schema Markup */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Tools', url: `${siteConfig.url}/tools` },
          { name: 'AI Website Audit', url: `${siteConfig.url}/tools/website-audit` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Website Audit Tool"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description="Free AI-powered website audit tool for comprehensive SEO, performance, security, and accessibility analysis. Around 150 checks with instant actionable recommendations."
        url={`${siteConfig.url}/tools/website-audit`}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <FAQSchema faqs={toolFaqsForSchema} />

      <HowToSchema
        name="How to Audit Your Website for SEO, Speed and Security in 2026"
        description="Step-by-step guide to running a comprehensive website audit using the DevelopersMatrix free tool. Covers preparation, execution, and prioritizing fixes by impact."
        url={`${siteConfig.url}/tools/website-audit`}
        totalTime="PT5M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'DevelopersMatrix Website Audit Tool']}
        step={[
          {
            name: "Prepare your website URL",
            text: "Copy the exact URL of the page or site you want to audit. Use the canonical version with https:// and without tracking parameters. If auditing a single page, use that specific URL. For a full site scan, use your homepage. Make sure the site is publicly accessible and not behind a login wall or IP restriction."
          },
          {
            name: "Enter the URL and start the audit",
            text: "Paste your URL into the audit input field and click 'Run Audit'. The tool will crawl your page, analyze the HTML structure, run JavaScript where needed, and perform around 150 checks across 8 categories. This typically takes 10 to 30 seconds depending on page complexity. Do not refresh the page during the scan."
          },
          {
            name: "Review your overall score and category breakdown",
            text: "Your report opens with an overall score out of 100, followed by 7 category scores: Technical SEO, Performance, Mobile UX, Security, Accessibility, Content Quality, and Conversion. Click any category to expand detailed findings. A score below 50 in any category requires immediate attention. Scores between 50 and 69 indicate moderate issues. Scores above 70 are solid with minor improvements available."
          },
          {
            name: "Prioritize fixes by impact level",
            text: "Each finding is labeled Critical, High, Medium, or Low. Always fix Critical issues first. These include missing title tags, broken canonical URLs, HTTPS failures, and severe accessibility violations that may trigger legal issues. High priority covers Core Web Vitals failures, missing meta descriptions, and broken internal links. Medium includes image optimization, heading hierarchy, and minor schema issues. Low priority items are optimization suggestions like reducing DOM depth or minifying CSS. Focus on the top 10 issues for maximum impact with minimum effort."
          },
          {
            name: "Fix Technical SEO issues first",
            text: "Technical SEO is the foundation. Start with your title tag and meta description. Ensure every page has a unique, descriptive title under 60 characters and a meta description under 160 characters. Fix any broken internal links and redirect chains. Add a canonical tag to every page. Verify your XML sitemap is submitted to Google Search Console. These fixes alone often improve rankings within 2 to 4 weeks."
          },
          {
            name: "Address Core Web Vitals and performance",
            text: "Performance improvements require the most technical skill but yield strong results. Compress images using WebP or AVIF formats. Enable browser caching for static assets. Minify CSS, JavaScript, and HTML. Remove render-blocking resources by inlining critical CSS and deferring non-essential scripts. Use a CDN for asset delivery. If your server response time exceeds 800ms, consider upgrading your hosting or enabling server-side caching."
          },
          {
            name: "Re-audit after implementing fixes",
            text: "Run a second audit 2 to 4 weeks after implementing fixes to confirm improvements. Some changes like DNS updates, CDN propagation, and Google recrawling take time to reflect. Compare your new scores to the baseline and document the delta. If a critical issue persists, verify your fix was deployed correctly and clear any server or CDN caches that might be serving the old version."
          }
        ]}
      />

      {/* Main Tool Interface, renders its own full page UI */}
      <div id="website-audit">
        <WebsiteAuditClient />
      </div>

      {/* Section 1: How the audit works */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100 dark:border-gray-800">
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            How to Audit a Website Online With This Tool
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8">
            To audit a website, paste its URL into the box at the top of this page and press Audit Website. The tool runs around 150 checks across 8 areas: SEO, technical, performance, mobile, security, accessibility, content and conversion. It crawls the page, measures speed, validates SEO signals, checks mobile usability and tests the security setup in one pass, then returns a scored report within seconds.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">SEO Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Checks title tags, meta descriptions, heading structure, canonical tags, robots directives, sitemap presence, keyword stuffing signals and internal link structure.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Page Speed and Core Web Vitals</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Reads Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), Interaction to Next Paint (INP) and Time to First Byte (TTFB) from Google PageSpeed, plus render blocking resources, page size, compression and image optimization.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mobile and UX</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Tests the mobile viewport, tap target sizing, font legibility, content width and other mobile usability signals.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Security</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Validates HTTPS, mixed content and security headers such as Strict Transport Security, Content Security Policy and X Frame Options.
              </p>
            </div>
          </div>

          <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            Each check is scored individually and weighted to produce your overall Site Health Score out of 100.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-3">URL Audit: Check a Single Page or a Whole Site</h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Sometimes you do not need a full site crawl. You need a <strong>URL audit</strong> on the one page that matters: a product page that is not converting, a blog post that dropped in rankings, or a landing page you are about to launch. Paste that exact URL and the audit starts there. The tool scans the page you enter and up to four more pages it links to, so a homepage URL gives you a quick view of the whole site and a deep URL keeps the audit focused.
            </p>
            <p>
              A focused URL audit is also a fast way to study a competitor. Audit their top ranking page and compare the result with yours: whether they use structured data, how heavy their images are, and how clean their heading structure is. For developers, it is a quick check after a deployment that titles, meta tags and security headers came through as intended.
            </p>
          </div>

          <div className="mt-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Want a person to read the report with you?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              The free tool tells you what is broken. It cannot tell you which three fixes
              will move your rankings first, or rewrite the pages for you. Run the free audit
              above, and if you want the findings turned into a prioritised plan, see our
              paid <a href="/services/website-audit" className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2">website audit services and pricing</a>.
            </p>
            <a
              href="/services/website-audit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              See audit pricing
            </a>
          </div>
        </section>
      </div>

      {/* Section 2: Score, grader and what a good score is */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100 dark:border-gray-800">
        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            What Your Website Audit Score Means
          </h2>

          <div className="overflow-x-auto max-sm:rounded-xl max-sm:border max-sm:border-gray-200 max-sm:dark:border-gray-700">
            <table className="table-stack table-stack--block w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Score Range</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Rating</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">What It Means</th>
                  <th className="p-4 text-sm font-semibold text-gray-900 dark:text-white">Priority</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-600 dark:text-gray-400">
                {[
                  ['90 to 100', 'Excellent', 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', 'Your site meets all major technical standards. Focus on content and authority.', 'Maintenance mode'],
                  ['75 to 89', 'Good', 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', 'Minor issues present. Fix flagged items to protect rankings.', 'Low urgency'],
                  ['60 to 74', 'Needs Work', 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', 'Multiple issues affecting crawlability or user experience. Fix within 30 days.', 'Medium urgency'],
                  ['40 to 59', 'Poor', 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', 'Significant technical problems likely suppressing rankings. Fix immediately.', 'High urgency'],
                  ['Below 40', 'Critical', 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', 'Severe issues that may be stopping Google from indexing or trusting pages. Escalate now.', 'Emergency'],
                ].map(([range, rating, cls, meaning, priority], i, all) => (
                  <tr key={range} className={i < all.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}>
                    <th scope="row" className="p-4 font-medium text-gray-900 dark:text-white">{range}</th>
                    <td data-label="Rating" className="p-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>{rating}</span></td>
                    <td data-label="What it means" className="p-4">{meaning}</td>
                    <td data-label="Priority" className="p-4 text-gray-500 dark:text-gray-400">{priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
            Scores are recalculated on each audit run, so a fix shows up the next time you audit the page. Rankings move more slowly, because Google has to recrawl the page first.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-3">Free Website Grader: How the Grade Is Calculated</h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              A <strong>website grader</strong> gives your site a number out of 100. That number is only useful if you can see what produced it. Most graders show you the score, colour it red, and then ask for your email before they will tell you which checks failed. This one does not. Enter a URL and you get the grade and the full breakdown in the same screen, with no signup.
            </p>
            <p>
              The grade comes from around 150 individual checks grouped into eight categories. Each category is scored on its own, then weighted into the overall number. Technical SEO and performance carry the most weight, because those two have the clearest and most direct relationship with how Google ranks you. A missing title tag or a Largest Contentful Paint above 2.5 seconds costs you more than a missing theme colour meta tag.
            </p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-3">What Is a Good Website Health Score?</h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Anything from 75 up is a solid foundation, and very few real sites score 100 on a first run. More useful than the overall number is which category drags the average down, because that tells you where an afternoon of work buys the most. A site scoring 72 with a performance score of 40 has a completely different to do list from a site scoring 72 with an accessibility score of 40.
            </p>
            <p>
              One caution worth stating plainly: a high grade does not guarantee rankings, and a mediocre grade does not prevent them. A site scoring 85 with genuinely useful content will outrank a site scoring 98 with thin content. Treat the grade as a list of things that could be holding you back, not as a score to max out.
            </p>
          </div>
        </section>
      </div>

      {/* Section 3: A real report */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100 dark:border-gray-800">
        <section className="mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Website Audit Report Example: A Real Result
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-3xl">
            We ran this tool on our own site, developersmatrix.com, on {SAMPLE.date}. The numbers below are exactly what it returned, so you can see what a report looks like before you run one.
          </p>

          <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Site Health Score</p>
              <p className="mt-1 text-5xl font-bold text-gray-900 dark:text-white">
                {SAMPLE.overall}
                <span className="text-xl font-semibold text-gray-400">/100</span>
              </p>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Pages scanned</dt><dd className="font-medium text-gray-900 dark:text-white">{SAMPLE.pages}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Findings</dt><dd className="font-medium text-gray-900 dark:text-white">{SAMPLE.findings.total}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Critical and high</dt><dd className="font-medium text-gray-900 dark:text-white">{SAMPLE.findings.critical + SAMPLE.findings.high}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Medium</dt><dd className="font-medium text-gray-900 dark:text-white">{SAMPLE.findings.medium}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-gray-500 dark:text-gray-400">Low</dt><dd className="font-medium text-gray-900 dark:text-white">{SAMPLE.findings.low}</dd></div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Category scores</p>
              <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {SAMPLE.categories.map(([name, score]) => (
                  <li key={name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">{name}</span>
                      <span className="font-semibold tabular-nums text-gray-900 dark:text-white">{score}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700" aria-hidden="true">
                      <div
                        className={`h-full rounded-full ${score >= 75 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Top Findings From That Audit</h3>
          <ol className="space-y-3">
            {SAMPLE.top.map((f, i) => (
              <li key={f.title} className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white dark:bg-white dark:text-gray-900">{i + 1}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {f.title}{' '}
                    <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">{f.area}, {f.severity}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Suggested fix: {f.fix}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
            Read every finding against your own page before acting on it. An automated check reads code, not intent. The call to action check, for example, looks for common button wording such as Get started or Sign up, so a page whose buttons say something else can still be flagged. Sorting real problems from noise like this is what our{' '}
            <a href="/services/website-audit" className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2">manual website audit</a>{' '}
            does.
          </p>
        </section>
      </div>

      {/* Main content with sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">

            <InContentAd />

            {/* Section 4: Checklist and what each check means */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Site Audit Checklist: What Each Check Means
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                A thorough <strong>site audit check</strong> covers more than page speed. This is the technical SEO checklist the tool works through, with the named checks you will see in your report. Use it as a reference even if you audit by hand.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {CHECKLIST.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.title} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${group.iconClass}`} aria-hidden="true" />
                        {group.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{group.what}</p>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {group.items.map((item) => (
                          <li key={item} className="flex items-start gap-2"><span className="text-green-500" aria-hidden="true">✓</span> {item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-6 leading-relaxed">
                You do not need to memorise the checklist. Run the audit and follow the fix list, which is ordered by how much each problem matters. For the full manual version with every step written out, read our{' '}
                <a href="/blog/website-audit-checklist-2026" className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2">website audit checklist</a>{' '}
                and the{' '}
                <a href="/blog/on-site-seo-guide-2026" className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2">on page SEO guide</a>.
              </p>
            </section>

            {/* Section 5: Code audit */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Website Code Audit: Check Your HTML, CSS & JavaScript Quality
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  A <strong>website code audit</strong> goes deeper than surface level SEO checks. It examines the markup, stylesheets and scripts that power your site. Heavy CSS, render blocking JavaScript and messy markup are invisible to visitors but slow the page down and make it harder for search engines to read.
                </p>
                <p className="leading-relaxed">
                  This tool covers the code checks that can be measured automatically from the outside: page size, render blocking stylesheets and scripts, text compression, image optimisation and lazy loading, heading structure, image alt text, structured data, mixed content and security headers. Deeper work such as full HTML validation, finding unused CSS rules and profiling JavaScript needs access to the code itself, and our code audit guide walks through it step by step.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What Our Website Code Audit Checks</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {['Page size and number of requests', 'Render blocking CSS and JavaScript', 'Text compression (gzip or Brotli)', 'Image size, format and lazy loading', 'Heading hierarchy (H1 through H6)', 'Missing alt attributes on images', 'Structured data present and valid', 'Mixed content, subresource integrity and security headers'].map((c) => (
                      <li key={c} className="flex items-start gap-2"><span className="text-green-500 mt-0.5" aria-hidden="true">✓</span><span>{c}</span></li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl p-6 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What Is a Website Code Audit?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    A <strong>website code audit</strong> is a technical inspection of the HTML, CSS and JavaScript that power your website. Unlike a visual review, it examines how the site is built, how efficiently it loads, and how correctly search engines and assistive technologies can interpret it. The goal is a prioritised action plan that separates critical technical problems from minor improvements.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    <strong>How is a code audit different from an SEO audit?</strong> An SEO audit focuses on search visibility: crawlability, indexing, content and links. A code audit digs into the technical foundation underneath. Poor code quality often causes SEO problems, such as invalid markup that breaks rendering or JavaScript that stops content appearing in search results, so the two work best together.
                  </p>
                </div>

                <div className="rounded-xl p-6 border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/20 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Want a Step by Step Code Audit Walkthrough?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    Our Website Code Audit Guide covers HTML validation, CSS optimisation, JavaScript performance, security hardening and schema, with checklists you can follow today.
                  </p>
                  <a href="/blog/website-code-audit-guide" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    Read the website code audit guide <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </section>

            {/* Section 6: Online auditor, health check, cost */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Online Website Auditor: Free Tool or Paid Audit?
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  Not everyone wants to download software, learn a command line tool, or pay for a subscription just to <strong>analyze a site online</strong>. That is why we built this <strong>online website auditor</strong>. It runs in your browser, needs no installation or account, and works on a phone as well as a desktop.
                </p>
                <p className="leading-relaxed">
                  Desktop <strong>website auditor tools</strong> like Screaming Frog or Sitebulb need installing, configuring and often a licence for larger sites. They are powerful, but more than you need for a quick picture of what is broken. Whether you are a freelancer checking a client site, a developer checking a deployment, or a marketer checking a landing page before a campaign, an online audit gets you the answer in seconds.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Why Use a Free Website Audit Tool Online</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Think of it as an audit checker you can run as often as you like: after a redesign, before a launch, or whenever traffic dips. A good online website auditor should give you the whole picture without getting in the way.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-4">
                {[
                  ['No setup', 'No downloads, no account and nothing to configure.'],
                  ['Any device', 'Works in the browser on a phone, tablet or desktop.'],
                  ['A report you can share', 'Download the full report as a PDF for your team or developer.'],
                  ['Free every time', 'No trial period, no card details and no signup.'],
                ].map(([t, d]) => (
                  <li key={t} className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                    <span className="block font-medium text-gray-900 dark:text-white">{t}</span>
                    <span className="mt-1 block text-sm text-gray-600 dark:text-gray-400">{d}</span>
                  </li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Free Website Health Check</h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                <p>
                  A <strong>free website health check</strong> is the fastest way to know whether your site is in good shape or losing traffic. Think of it like a routine check up: you do not wait for a ranking drop to look. It checks whether Google can crawl the site, whether the server responds quickly, whether images are dragging the page down, and whether the security headers are in place.
                </p>
                <p>
                  There is no commitment. Enter any URL above and you get a full report in under a minute, with no email gate and no trial. Run it on your homepage, a landing page, or a competitor&apos;s site to see where you stand, and run it again after each round of fixes to track your score.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-3">Website Audit Cost: Free vs Paid Tools in 2026</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you have looked up website audit cost, you know the range is wide. Agencies charge anywhere from $500 to $5,000 for a full manual audit. Subscription tools like Ahrefs and Semrush run from about $99 to several hundred dollars a month, and desktop crawlers like Screaming Frog charge an annual licence. For a small business site, a portfolio, a blog or a startup, a <strong>free website audit tool</strong> covers most of what matters.
              </p>
              <div className="mt-6 overflow-x-auto max-sm:rounded-xl max-sm:border max-sm:border-gray-200 max-sm:dark:border-gray-700">
                <table className="table-stack table-stack--block w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                    <tr>
                      <th className="px-4 py-3">Option</th>
                      <th className="px-4 py-3">Cost</th>
                      <th className="px-4 py-3">Best For</th>
                      <th className="px-4 py-3">Limitations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {[
                      ['DevelopersMatrix tool', 'Free', 'Quick checks, small sites, developers', 'Up to 5 pages per scan'],
                      ['DevelopersMatrix manual audit', 'From $9.99', 'A person checks the findings and writes the fix list', 'Fixed scope per audit'],
                      ['Google Lighthouse', 'Free', 'Performance and Core Web Vitals', 'Limited SEO checks, one page at a time'],
                      ['Screaming Frog', 'Annual licence', 'Full site crawls, technical SEO', 'Desktop only, steep learning curve'],
                      ['Ahrefs or Semrush site audit', 'Monthly subscription', 'Large sites, backlinks, rank tracking', 'Expensive if you only need audits'],
                      ['Agency audit', '$500 to $5,000', 'Custom strategy and manual review', 'Slow turnaround, high cost'],
                    ].map(([name, cost, best, limit]) => (
                      <tr key={name} className="bg-white dark:bg-gray-800">
                        <th scope="row" className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{name}</th>
                        <td data-label="Cost" className="px-4 py-3 text-gray-600 dark:text-gray-400">{cost}</td>
                        <td data-label="Best for" className="px-4 py-3 text-gray-600 dark:text-gray-400">{best}</td>
                        <td data-label="Limitations" className="px-4 py-3 text-gray-600 dark:text-gray-400">{limit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl p-6 border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Recommendation</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Start with a <strong>free website audit</strong> to find your biggest issues and fix the critical and high priority findings first. If you want a person to check the findings and turn them into a plan, our{' '}
                  <a href="/services/website-audit" className="font-medium text-blue-600 dark:text-blue-400 underline underline-offset-2">website audit services</a>{' '}
                  start at $9.99. If your site has tens of thousands of pages, or you need ongoing rank tracking, a subscription tool is worth it.
                </p>
              </div>
            </section>

            <InContentAd />

            {/* Section 7: Problems, what Google checks, platforms */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                7 Website Problems That Kill Rankings in 2026
              </h2>
              <div className="space-y-6">
                {PROBLEMS.map((p, i) => (
                  <div key={p.title} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{p.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">What Google Checks in 2026</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {GOOGLE_CHECKS.map((g) => (
                  <div key={g.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{g.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{g.text}</p>
                  </div>
                ))}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-4">Common Issues by Platform</h3>
              <div className="space-y-6">
                {PLATFORMS.map((p) => (
                  <div key={p.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{p.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">{p.issues}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{p.fixes}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8: Action plan */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                How to Turn Audit Results Into Ranking Improvements
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  Getting a report is useless if you do not act on it. Here is the priority order we recommend for fixing issues, based on impact and effort.
                </p>
                {PHASES.map((phase) => (
                  <div key={phase.title}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">{phase.title}</h3>
                    <ul className="space-y-2">
                      {phase.steps.map((s) => (
                        <li key={s} className="leading-relaxed">{s}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <p className="leading-relaxed mt-4">
                  After each phase, run the audit again to confirm the fixes worked, then give Google a few weeks to recrawl. Do not chase a perfect 100. An 85 with great content beats a 98 with thin content.
                </p>
              </div>
            </section>

            <InContentAd />

            {/* Section 9: FAQ */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions About Website Audits
              </h2>
              <div className="space-y-4">
                {toolFaqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                  >
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm group-open:rotate-180 transition-transform" aria-hidden="true">
                        ▼
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                      {faq.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="mb-12 rounded-2xl bg-blue-600 p-8 text-white text-center">
              <p className="text-2xl sm:text-3xl font-bold mb-4">Audit Your Website in Seconds. It is Free</p>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                No signup. No credit card. Paste a URL and get a clear list of what to fix, in order of impact.
              </p>
              <a
                href="#website-audit"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Run Your Free Website Audit
              </a>
            </div>

            {/* Related links */}
            <nav aria-label="Related guides and tools">
              <p className="font-semibold text-gray-900 dark:text-white mb-3">Keep going</p>
              <ul className="flex flex-wrap gap-2 text-sm">
                {[
                  ['/blog/website-audit-checklist-2026', 'Website audit checklist'],
                  ['/blog/on-site-seo-guide-2026', 'On page SEO guide'],
                  ['/blog/website-code-audit-guide', 'Website code audit guide'],
                  ['/services/website-audit', 'Website audit services'],
                  ['/tools/ai-content-detector', 'AI Content Detector'],
                  ['/tools/ai-resume-builder', 'AI Resume Builder'],
                  ['/tools/ai-interview-simulator', 'AI Interview Simulator'],
                  ['/tools/ai-cover-letter-generator', 'AI Cover Letter Generator'],
                  ['/tools/salary-estimator', 'Salary Estimator'],
                  ['/tools', 'All 20+ free tools'],
                ].map(([href, label]) => (
                  <li key={href}>
                    <a href={href} className="inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 transition-colors hover:border-blue-400 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-blue-300">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <SidebarAd />
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Website Audit Guides</h3>
                <ul className="space-y-3">
                  {[
                    ['/blog/website-audit-checklist-2026', 'Website audit checklist'],
                    ['/blog/on-site-seo-guide-2026', 'On page SEO guide'],
                    ['/blog/website-code-audit-guide', 'Website code audit guide'],
                    ['/services/website-audit', 'Website audit services and pricing'],
                    ['/blog', 'SEO guides and tips'],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Core Web Vitals Targets</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">What Google counts as good, for 75% of visits</p>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap">2.5 s</span>
                    <span>or less for Largest Contentful Paint, how fast the main content appears</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap">200 ms</span>
                    <span>or less for Interaction to Next Paint, how quickly the page reacts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap">0.1</span>
                    <span>or less for Cumulative Layout Shift, how much the layout jumps</span>
                  </li>
                </ul>
                <a href="https://web.dev/articles/vitals" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline">
                  Source: web.dev, Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
