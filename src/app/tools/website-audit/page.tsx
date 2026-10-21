import React from 'react';
import { Metadata } from 'next';
import { Search, Gauge, Smartphone, Accessibility } from 'lucide-react';
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/data/config';
import { SidebarAd, InContentAd } from '@/components/ads/AdBanner';
import { generatePageMetadata } from '@/lib/seo/metadata';
import WebsiteAuditClient from './WebsiteAuditClient';
import { NAMED_CHECK_COUNT } from '@/lib/website-audit/check-catalogue';

export const metadata: Metadata = generatePageMetadata({
  title: "Free Website Audit Tool Online: Score Your Site",
  description: `Audit your website online free. ${NAMED_CHECK_COUNT} named checks for SEO, speed, mobile and security, plus Core Web Vitals. A score out of 100 and a fix list. No signup.`,
  keywords: ['audit website online', 'website audit tool online', 'website audit', 'audit website', 'audit a website', 'website auditor tool online', 'site audit online', 'site auditor online', 'audit checker', 'online website audit', 'web site audit', 'website auditor', 'web audit tool', 'website code audit', 'audit my website', 'audit of website', 'free website audit tool', 'website health check free', 'seo audit tool online', 'technical seo audit free', 'seo score checker', 'website performance checker', 'google core web vitals checker', 'website speed test tool', 'mobile friendly test tool', 'accessibility audit tool free', 'website security scanner free', 'free website analyzer', 'website grader', 'grade my website'],
  path: "/tools/website-audit",
  modifiedTime: "2026-10-23",
});

const toolFaqs = [
  {
    question: "Is this website audit tool completely free?",
    answer: "Yes, 100% free. No signup, no credit card and no daily cap. We believe every website owner deserves access to professional grade audit tools regardless of budget. You can audit as many sites as you own. To keep the tool fast for everyone, one visitor can run up to 6 audits a minute."
  },
  {
    question: "Is this a website grader?",
    answer: "Yes. A website grader scores your site out of 100 and tells you what is holding the score down. That is exactly what this tool does, across seven scored areas: SEO, technical, performance, security, content, accessibility and mobile. Conversion tips are listed separately and do not change the grade, and Google Core Web Vitals are shown next to the report. The difference is what happens after the grade. Most website graders show you a number and then ask for your email to see the detail. You get the full breakdown here, every failing check with the specific fix, with no signup."
  },
  {
    question: "How is a website grade calculated?",
    answer: "Every finding has a severity (critical, high, medium or low) and costs points in its category. A problem found on every page costs more than one found on a single page, and small low priority notes are capped per category so a pile of minor notes cannot sink a score. The seven categories are then weighted: SEO 22%, Technical 18%, Performance 15%, Security 12%, Content 12%, Accessibility 11% and Mobile 10%. Weak categories pull the grade down more than strong ones push it up. Any critical finding, such as no HTTPS or a homepage set to noindex, caps the grade at 55. Tips, such as conversion ideas, email records or AI crawler settings, are shown but never change the grade. The report shows every category score next to the overall grade."
  },
  {
    question: "What does the website audit tool check in 2026?",
    answer: `Our website audit tool runs ${NAMED_CHECK_COUNT} named checks across seven scored areas. SEO covers title tags, meta descriptions, H1 and headings, image alt text, keyword use in the title, favicon, doctype, charset, deprecated HTML, canonical tags, noindex, nofollow, structured data and Open Graph. Technical covers robots.txt (read the way Google reads it), the XML sitemap, redirects, broken links (we request the links on the pages we scan, up to 40 internal and 20 outbound), the 404 page and soft 404s, www and non www versions, meta refresh, hreflang, duplicate titles and URL structure. Performance looks at server response, HTML and DOM size, render blocking files, image sizes and formats, lazy loading, compression, caching, minified CSS and JavaScript, and HTTP/2. Security checks HTTPS and the http to https redirect, HSTS, Content Security Policy and other headers, mixed content, open directory listings and insecure forms. Accessibility covers form labels, page language, link text, landmarks, hidden focusable elements and heading order. Content looks at word count, readability (English only), keyword stuffing and trust signals. Mobile checks the viewport, responsive CSS and theme colour, and Google PageSpeed adds a mobile snapshot. Tips that do not change the score cover conversion, analytics, SPF and DMARC email records, ads.txt and whether AI search crawlers can read your site. We do not measure font size, tap targets or colour contrast, because those need a real browser.`
  },
  {
    question: "How accurate is this compared to Google Lighthouse?",
    answer: "They measure different things. Lighthouse loads one page in a real browser and measures speed. We read the HTML and headers of up to 5 pages and focus on the SEO, crawling, indexing and security checks Lighthouse does not cover in depth. The speed numbers in our report come straight from Google PageSpeed Insights, which runs Lighthouse, plus real Chrome user data when Google has enough of it. Our own score is separate from the Lighthouse score, so the two numbers will differ."
  },
  {
    question: "Will fixing audit issues actually improve my Google rankings?",
    answer: "They can, but nothing guarantees rankings. Fixes such as adding a missing title tag, repairing broken internal links or removing a stray noindex take away things that hold a page back. Google has to recrawl a page before it sees a fix, which can take days or weeks. HTTPS is a light ranking signal. Other security headers protect your visitors but are not ranking factors. We order every fix by severity so you start with what matters most."
  },
  {
    question: "How often should I run a website audit in 2026?",
    answer: "For an active business website, once a month is a sensible rhythm. Run one straight away after any big change, such as a redesign, a CMS or theme update, a content migration or a new plugin, because that is when titles, canonicals, redirects and robots rules most often break without anyone noticing. Busy online shops can check weekly in peak seasons. After you fix something, run the audit again as soon as the fix is live to confirm it worked. A small brochure site that rarely changes is fine with a check every few months."
  },
  {
    question: "Does this work for WordPress, Shopify, Next.js, and other platforms?",
    answer: "Yes. Any publicly accessible website works regardless of the technology stack underneath. We read the HTML your server sends, so the platform itself does not matter. WordPress sites often struggle with plugin bloat and caching misconfiguration. Shopify stores frequently have image optimization issues and heavy third party scripts. Next.js and React applications commonly face hydration problems and missing meta tags. We do not run JavaScript, so if content only appears after scripts run, the audit flags it."
  },
  {
    question: "What is a good website audit score?",
    answer: "A score between 90 and 100 is excellent: the technical basics are in place and the remaining notes are small. 75 to 89 is good, with a few things worth fixing. 60 to 74 needs work, usually several medium or high findings in one or two areas. 40 to 59 is poor, and any site with a critical finding, such as no HTTPS or a homepage set to noindex, lands here at most. Below 40 means serious problems in several areas, so start with the critical and high findings. Do not chase a perfect 100. A high score does not guarantee rankings, and a site with useful content and a score of 85 can outrank a thin site that scores 98."
  },
  {
    question: "Can I download or share the audit report?",
    answer: "Absolutely. After running an audit, copy the full text report to your clipboard or save a professionally formatted PDF. The on screen report also shows a Google search preview of your homepage and a mobile snapshot from Google PageSpeed. The PDF includes colour coded scores for each category, issues organized by severity level, a fix for each finding, a content analysis summary, and a clean summary perfect for stakeholders. It is ideal for sharing with clients, team members, or freelancers who will implement the fixes."
  },
  {
    question: "What is a free website health check and why do I need one?",
    answer: "A free website health check is a quick diagnostic scan that evaluates your site's core performance indicators without any cost or commitment. It checks your site's crawlability, server response time, images, security headers, the mobile viewport, and Core Web Vitals from Google PageSpeed. You need one because problems like slow load times, broken links, or missing meta tags often go unnoticed until they cause ranking drops. Running regular health checks catches these issues early, before they impact your traffic or revenue. Our tool returns the report in under a minute with no signup required."
  },
  {
    question: "How much does a website audit cost in 2026?",
    answer: "Website audit cost in 2026 ranges from free to over $5,000 depending on depth and provider. Free tools like DevelopersMatrix and Google Lighthouse cover technical SEO, performance, and security basics for small to medium sites. Paid desktop tools like Screaming Frog cost $259 per year and excel at full site crawling. All in one suites like Ahrefs ($99-$999/month) and SEMrush ($119-$449/month) add competitive analysis, rank tracking, and backlink data. Professional agency audits run $500-$5,000 and include manual review with custom strategy. For most sites under 1,000 pages, a free audit combined with Google Search Console is sufficient to start. Upgrade to paid tools only when your traffic justifies the investment."
  },
  {
    question: "Can I audit a single URL instead of my entire website?",
    answer: "Yes. A URL audit starts from the page you paste and also checks up to 4 pages it links to, covering technical SEO, performance, content quality, and accessibility. This is useful for checking a new blog post before publishing, verifying a landing page after a redesign, auditing a competitor's top ranking article, or spot checking a product page that dropped in conversions. Full site crawls are better for systemic issues like duplicate content and internal linking gaps, but a single URL audit gives you focused, actionable data faster."
  },
  {
    question: "What is the best online website auditor for small businesses?",
    answer: `For small businesses, the best online website auditor is one that balances depth with simplicity and cost. DevelopersMatrix offers a completely free audit with ${NAMED_CHECK_COUNT} named checks across seven scored areas, which suits small sites that need quick, actionable fixes without a learning curve or subscription. Google Lighthouse is also free and excellent for Core Web Vitals. It has a short SEO section and focuses on speed. If you outgrow free tools, Screaming Frog at $259 per year is the next logical step for full site technical crawling. Avoid expensive all in one suites like Ahrefs or SEMrush until your site has significant traffic and you need ongoing rank tracking and competitive intelligence.`
  },
  {
    question: "Why is my website audit score low?",
    answer: "Low scores most commonly result from slow page speed (unoptimized images, render blocking scripts), missing or duplicate meta descriptions, lack of HTTPS or mixed content warnings, poor mobile usability, and missing security headers. The audit report highlights each failing check with a specific fix recommendation so you can address the highest impact issues first."
  },
  {
    question: "Can I audit a competitor's website?",
    answer: "Yes. The tool audits any publicly accessible URL. Enter any website address to see its technical health score, identify weaknesses in its SEO foundation, and compare it with your own site."
  },
  {
    question: "How is this different from Google Search Console?",
    answer: "Google Search Console reports on how Google sees your site after the fact: indexing status, manual actions, and search performance data. The DevelopersMatrix audit tool gives you an instant proactive health check across SEO, speed, mobile, and security before Google flags issues. Use both together: the audit tool to identify and fix problems proactively, and Search Console to monitor the results."
  },
  {
    question: "What makes the DevelopersMatrix Site Health Score different from other audit tools?",
    answer: "Generic pass or fail checkers count every failure the same. Ours does not. Each finding costs points by severity, so a missing title tag costs more than a long meta description, and a problem on every page costs more than one on a single page. Low priority notes are capped per category, so a pile of minor notes cannot sink the score. Any critical finding, such as robots.txt blocking Googlebot or a password form on plain HTTP, caps the grade at 55, because a site with one of those problems is not healthy whatever else it gets right."
  },
];

// A real run of this tool on developersmatrix.com, copied from the API
// response on 21 October 2026. Update by running the tool again; never edit
// the numbers by hand. Conversion is left out because it is tips only and
// does not count toward the score.
const SAMPLE = {
  date: '21 October 2026',
  overall: 93,
  pages: 5,
  findings: { total: 22, critical: 0, high: 0, medium: 3, low: 19 },
  categories: [
    ['SEO', 96],
    ['Technical', 100],
    ['Content', 96],
    ['Mobile', 100],
    ['Performance', 84],
    ['Security', 83],
    ['Accessibility', 90],
  ] as [string, number][],
  top: [
    { title: 'Missing Content-Security-Policy', area: 'Security', severity: 'medium', fix: "Start with a report only policy, then enforce it. At minimum send frame-ancestors 'self'; object-src 'none'; base-uri 'self'." },
    { title: 'No Clickjacking Protection', area: 'Security', severity: 'medium', fix: "Send Content-Security-Policy: frame-ancestors 'self', with X-Frame-Options: SAMEORIGIN as a fallback." },
    { title: 'Missing X-Content-Type-Options Header', area: 'Security', severity: 'medium', fix: 'Send X-Content-Type-Options: nosniff with every response.' },
    { title: 'Title May Be Cut Short in Search Results', area: 'SEO', severity: 'low', fix: 'Keep the most important words in the first 50 to 60 characters.' },
    { title: 'Links Opening in a New Tab Without Warning', area: 'Accessibility', severity: 'low', fix: 'Tell visitors when a link opens a new tab, with visible text or a labelled icon.' },
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
    what: 'Server Response Time, HTML Size, DOM Size, Image Dimensions, Modern Image Format, Render Blocking Resources, Image Lazy Loading, Text Compression, Caching Headers, Minification and HTTP/2 tests.',
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
    what: 'Viewport, Media Query Responsive, Theme Color, HTTPS, Mixed Content, Directory Browsing and security header tests.',
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
    what: 'Image Alt Text, Heading Structure, Form Label, Page Language, Link Text, Content Length, Readability and Keyword Stuffing tests.',
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
  { title: 'Unoptimized Images', text: 'Serving a 2MB hero image as a PNG is one of the most common reasons a page is slow. WebP and AVIF files are usually far smaller at the same quality, responsive images with srcset serve the right size for each screen, and lazy loading delays images below the fold. The audit checks lazy loading, whether images declare their width and height, and whether they are served as WebP or AVIF.' },
  { title: 'Missing or Duplicate Meta Descriptions', text: 'Google often uses the meta description for the search result snippet. Without one, Google picks text from the page that may not earn the click. Every important page should have a unique description between 120 and 158 characters.' },
  { title: 'Broken Internal Links and Orphan Pages', text: 'Broken links waste crawl budget and frustrate visitors. Pages with no internal links pointing to them are hard for Google to find at all. The audit requests the links on the pages it scans, up to 40 internal and 20 outbound per audit, and lists each broken one with the page it was found on.' },
  { title: 'Missing Schema Markup', text: 'Structured data helps Google understand your content and can unlock rich results such as breadcrumbs in search. Article, FAQ and Organization markup suit most content sites. The audit checks whether structured data is present and readable.' },
  { title: 'Poor Accessibility', text: 'Missing alt text, form fields without labels, low contrast and keyboard traps shut out visitors who rely on assistive technology, and in many places accessibility is also a legal requirement under standards such as WCAG 2.1 AA.' },
  { title: 'Third Party Script Bloat', text: 'Analytics, chat widgets, ad networks and social embeds each add weight. A heavy tag manager setup or chat widget can add seconds to load time on a phone. Load these scripts after the main content, or remove the ones you do not use.' },
];

const GOOGLE_CHECKS = [
  { title: 'Core Web Vitals', text: 'Google measures three metrics. Largest Contentful Paint tracks loading speed and should stay under 2.5 seconds. Interaction to Next Paint measures responsiveness and should stay under 200 milliseconds. Cumulative Layout Shift tracks visual stability and should stay under 0.1. The audit reports all three from Google PageSpeed where Google has field data for the page.' },
  { title: 'Mobile First Indexing', text: 'Google uses the mobile version of your page for indexing and ranking. If the mobile site is slow, broken or missing content compared with desktop, that is the version Google judges. The audit checks the mobile viewport, responsive CSS and theme colour, and shows a mobile snapshot from Google PageSpeed. Font size and tap target size need a real browser, so check those on a phone or in the PageSpeed results.' },
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
          { name: 'Website Audit', url: `${siteConfig.url}/tools/website-audit` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Website Audit Tool"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description={`Free website audit tool for SEO, technical, performance, security, content, accessibility and mobile checks. ${NAMED_CHECK_COUNT} named checks, a score out of 100 and a fix list ordered by severity.`}
        url={`${siteConfig.url}/tools/website-audit`}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <FAQSchema faqs={toolFaqsForSchema} />

      <HowToSchema
        name="How to Audit Your Website for SEO, Speed and Security in 2026"
        description="Step by step guide to running a website audit using the DevelopersMatrix free tool. Covers preparation, running the audit, and prioritizing fixes by severity."
        url={`${siteConfig.url}/tools/website-audit`}
        totalTime="PT5M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'DevelopersMatrix Website Audit Tool']}
        step={[
          {
            name: "Prepare your website URL",
            text: "Copy the exact URL of the page or site you want to audit. Use the canonical version with https:// and without tracking parameters. If auditing a single page, use that specific URL. For a wider view of the site, use your homepage, since the tool also checks up to 4 pages it links to. Make sure the site is publicly accessible and not behind a login wall or IP restriction."
          },
          {
            name: "Enter the URL and start the audit",
            text: `Paste your URL into the audit input field and click 'Audit Website'. The tool fetches your page and up to 4 internal pages it links to, reads the HTML your server sends, and runs ${NAMED_CHECK_COUNT} named checks across seven scored areas. This usually takes under a minute. Do not refresh the page during the scan.`
          },
          {
            name: "Review your overall score and category breakdown",
            text: "Your report opens with an overall score out of 100, followed by 7 category scores: SEO, Technical, Performance, Security, Content, Accessibility, and Mobile. Conversion tips are listed separately and do not change the score, and Core Web Vitals from Google PageSpeed appear next to the report. Click any failing check to see the detail and the fix. A score below 50 in any category requires immediate attention. Scores between 50 and 69 indicate moderate issues. Scores above 70 are solid with minor improvements available."
          },
          {
            name: "Prioritize fixes by impact level",
            text: "Each finding is labeled Critical, High, Medium, or Low. Always fix Critical issues first. These include no HTTPS, a homepage set to noindex, robots.txt blocking Googlebot, a password form on plain HTTP, and server errors. High priority covers a missing title tag, no mobile viewport, broken internal links found in the crawl, mixed content, duplicate titles, and a broken sitemap. Medium includes a missing H1, a missing canonical tag, missing security headers, and no text compression. Low priority items are small notes such as title or description length and the Open Graph description. Work down the list in that order."
          },
          {
            name: "Fix Technical SEO issues first",
            text: "Technical SEO is the foundation. Start with your title tag and meta description. Ensure every page has a unique, descriptive title under 60 characters and a meta description under 160 characters. Fix any broken internal links and redirect chains. Add a canonical tag to every page. Verify your XML sitemap is submitted to Google Search Console. Google sees these fixes the next time it crawls the page."
          },
          {
            name: "Address Core Web Vitals and performance",
            text: "Performance improvements require the most technical skill but yield strong results. Compress images using WebP or AVIF formats. Enable browser caching for static assets. Minify CSS, JavaScript, and HTML. Remove render blocking resources by inlining critical CSS and deferring scripts the page does not need straight away. Use a CDN for asset delivery. If your server response time exceeds 800ms, consider upgrading your hosting or enabling server side caching."
          },
          {
            name: "Re-audit after implementing fixes",
            text: "Run the audit again once your fixes are live to confirm them, because the score is recalculated on every run. Rankings take longer, since Google has to recrawl the page first, which can take days or weeks. Some changes like DNS updates and CDN propagation also take time to reflect. Compare your new scores to the baseline and document the delta. If a critical issue persists, verify your fix was deployed correctly and clear any server or CDN caches that might be serving the old version."
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
            To audit a website, paste its URL into the box at the top of this page and press Audit Website. The tool fetches that page and up to 4 internal pages it links to, reads the HTML your server sends, and runs {NAMED_CHECK_COUNT} named checks across seven scored areas: SEO, technical, performance, security, content, accessibility and mobile, plus conversion tips that do not change the score. Speed data comes from Google PageSpeed Insights. You get a scored report in under a minute.
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
                Tests the mobile viewport, responsive CSS and theme colour, and shows a mobile snapshot from Google PageSpeed. Font size and tap target size need a real browser, so we leave those to the PageSpeed results rather than guess.
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
            Each finding costs points in its category by severity, and the seven category scores are weighted into your overall Site Health Score out of 100. Core Web Vitals are shown next to the score, not inside it, and tips such as conversion ideas or email records never change it.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-3">URL Audit: Check a Single Page or a Whole Site</h3>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              Sometimes you do not need a full site crawl. You need a <strong>URL audit</strong> on the one page that matters: a product page that is not converting, a blog post that dropped in rankings, or a landing page you are about to launch. Paste that exact URL and the audit starts there. The tool scans the page you enter and up to four more pages it links to, so a homepage URL gives you a quick view of the whole site and a deep URL keeps the audit focused.
            </p>
            <p>
              A focused URL audit is also a fast way to study a competitor. Audit their top ranking page and compare the result with yours: whether they use structured data, whether their images are sized and lazy loaded, and how clean their heading structure is. For developers, it is a quick check after a deployment that titles, meta tags and security headers came through as intended.
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
              The grade comes from {NAMED_CHECK_COUNT} named checks across seven scored categories. Every finding has a severity (critical, high, medium or low) and costs points in its category, and a problem found on every page costs more than one found on a single page. Small low priority notes are capped per category, so a pile of minor notes cannot sink a score. The categories are then weighted: SEO 22%, Technical 18%, Performance 15%, Security 12%, Content 12%, Accessibility 11% and Mobile 10%. Weak categories pull the grade down more than strong ones push it up. Any critical finding, such as no HTTPS or robots.txt blocking Googlebot, caps the grade at 55. Core Web Vitals from Google are shown next to the grade but are not part of it yet.
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
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Conversion is listed as tips and does not count toward the score.</p>
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
            Read every finding against your own page before acting on it. An automated check reads code, not intent. The trust signals check, for example, only counts clear wording such as named reviews, review counts or a guarantee, so a page that earns trust in other ways can still be flagged. Sorting real problems from noise like this is what our{' '}
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
                A thorough <strong>site audit check</strong> covers more than page speed. This is the technical SEO checklist we recommend. The small line under each heading names the checks you will see in your report, and the ticked items are what to confirm, with the tool or by hand.
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
                  This tool covers the code checks that can be measured automatically from the outside: doctype and charset, deprecated HTML, HTML and DOM size, render blocking stylesheets and scripts, minified CSS and JavaScript, text compression, caching headers, image width, height, format and lazy loading, heading structure, image alt text, structured data, mixed content and security headers. Deeper work such as full HTML validation, finding unused CSS rules and profiling JavaScript needs access to the code itself, and our code audit guide walks through it step by step.
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What Our Website Code Audit Checks</h3>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {['Doctype, charset and deprecated HTML tags', 'HTML size, DOM size and number of script files', 'Render blocking CSS and JavaScript', 'Minified CSS and JavaScript', 'Text compression (gzip or Brotli)', 'Image width, height and lazy loading', 'Heading hierarchy (H1 through H6)', 'Missing alt attributes on images', 'Structured data present and valid', 'Mixed content, subresource integrity and security headers'].map((c) => (
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
                Think of it as an audit checker you can run whenever you need it: after a redesign, before a launch, or whenever traffic dips. A good online website auditor should give you the whole picture without getting in the way.
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
