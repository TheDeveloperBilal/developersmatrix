import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import LinkManagerClient from "./LinkManagerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['link-manager']);

const toolFaqs = [
  {
    question: "Is the Link Manager completely free?",
    answer: "Yes, 100 percent free with no signup required. Create branded short links, track analytics, generate QR codes, and build bio pages. Unlike services like Bitly Pro or Linktree Pro that charge 5 to 25 dollars monthly for analytics and custom domains, all features are available immediately."
  },
  {
    question: "What can I do with the Link Manager?",
    answer: "Create custom branded short links that redirect to any URL. Track detailed click analytics including total clicks, unique visitors, geographic location, device types, and referrer sources. Generate QR codes for any link. Build a smart bio page that displays your content from multiple platforms. Schedule links to activate or expire on specific dates. All data stays in your browser for privacy."
  },
  {
    question: "How does click analytics work?",
    answer: "Every short link you create automatically tracks clicks. The analytics dashboard shows total clicks over time, unique vs returning visitors, geographic distribution by country, device breakdown between desktop and mobile, and referrer sources. This data helps you understand your audience and optimize your sharing strategy. For example, if 80 percent of clicks come from mobile, you know your landing page must be mobile-first."
  },
  {
    question: "What is a Smart Bio page?",
    answer: "A Smart Bio is a single-page profile that aggregates all your important links. Instead of changing your Instagram or Twitter bio link every time you have new content, your bio page contains links to your YouTube, Instagram, portfolio, store, newsletter, and anything else. When someone clicks your bio link, they see everything. The bio page can auto-update with your latest YouTube videos or Instagram posts, keeping the content fresh without manual maintenance."
  },
  {
    question: "Can I use custom branded domains?",
    answer: "The tool generates short links using your choice of slug. For a fully branded experience with your own domain, you would need to configure domain forwarding with your DNS provider. The link manager handles the short link generation and tracking regardless of the domain you use."
  },
  {
    question: "How does link scheduling work?",
    answer: "When creating a link, you can set a start date and an optional end date. The link becomes active on the start date and automatically deactivates after the end date. This is ideal for limited-time campaigns, event registrations, seasonal promotions, or time-sensitive content. No manual deactivation needed."
  },
  {
    question: "Is my link data private?",
    answer: "Yes, completely. All links, analytics, and bio page content are stored in your browser's local storage. No accounts, no cloud servers, no data sharing. Your click analytics belong to you alone. You can clear all data at any time by clearing your browser storage."
  },
  {
    question: "How is this different from Bitly or Linktree?",
    answer: "Bitly and Linktree are excellent paid services with more advanced features like custom domains, team collaboration, and enterprise analytics. This tool is designed for individuals who want the core functionality without the subscription cost. You get short links, analytics, QR codes, and bio pages without creating an account or entering payment information. It is the free alternative for creators who need professional link management without the monthly bill."
  }
];

export default function LinkManagerPage() {
  const toolFaqsForSchema = toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Link Manager", url: `${siteConfig.url}/tools/link-manager` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Link Manager"
        applicationCategory="WebApplication"
        operatingSystem="Web"
        description="Free link shortener with click analytics, QR codes, and smart bio pages. No signup needed."
        url={`${siteConfig.url}/tools/link-manager`}
        aggregateRating={{
          ratingValue: "4.7",
          ratingCount: "892"
        }}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <FAQSchema faqs={toolFaqsForSchema} />

      <main className="pt-16">
        {/* Tool Interface */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div id="link-manager">
                <LinkManagerClient />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Link Stats 2026</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex justify-between items-center">
                    <span>Links shortened daily worldwide</span>
                    <span className="font-semibold text-gray-900 dark:text-white">5.8 billion</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>CTR increase with short links</span>
                    <span className="font-semibold text-gray-900 dark:text-white">39%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>QR code scans globally (2026)</span>
                    <span className="font-semibold text-gray-900 dark:text-white">28 billion</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Users who prefer bio link pages</span>
                    <span className="font-semibold text-gray-900 dark:text-white">73%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Avg. monthly cost of Linktree Pro</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$9-25</span>
                  </li>
                </ul>
              </div>
              <SidebarAd />
            </div>
          </div>
        </div>

        <InContentAd />

        {/* SEO Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">

              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Every Creator Needs a Link Management Strategy
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="text-lg leading-relaxed">
                    Links are the infrastructure of the internet. Every share, every referral, every conversion depends on a link. But raw URLs are ugly, untrustworthy, and provide zero insight into performance. A YouTube description with a 200-character Amazon affiliate link looks amateur. A Twitter bio that says "check my latest video" with a different link every week confuses followers. A QR code that points to a dead page wastes a printed poster.
                  </p>
                  <p className="leading-relaxed">
                    The Link Manager solves all of these problems. Short links look professional and are 39 percent more likely to be clicked than raw URLs. Click analytics tell you which platforms drive traffic and which content resonates. QR codes bridge offline and online marketing. Smart bio pages give your audience a single destination that aggregates everything you create. For creators, marketers, developers, and small business owners, link management is not a luxury. It is a necessity.
                  </p>
                </div>
              </section>

              <InContentAd />

              {/* Features */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Four Features That Replace Paid Tools
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">1</span>
                      Branded Short Links
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Transform long, ugly URLs into clean, memorable short links. Instead of sharing a 200-character tracking link, share something professional. Short links are more trustworthy, easier to type, and significantly more likely to be clicked.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold">2</span>
                      Click Analytics Dashboard
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Track every click on every link. See total clicks, unique visitors, geographic distribution, device breakdown, and referrer sources. This data reveals where your audience comes from and what content drives engagement.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                      QR Code Generator
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Generate QR codes for any short link with a single click. QR codes bridge physical marketing to digital destinations. Print them on business cards, posters, product packaging, or event badges. In 2026, 28 billion QR codes are scanned globally.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">4</span>
                      Smart Bio Pages
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Build a single page that contains all your important links. YouTube, Instagram, portfolio, store, newsletter, GitHub, LinkedIn — everything in one place. Auto-update features pull your latest content from connected platforms.
                    </p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Mistakes */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Five Link Mistakes That Cost You Traffic
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sharing Raw URLs in Social Posts</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">A raw Amazon affiliate link or a Google Docs sharing link looks unprofessional and untrustworthy. Social platforms may even flag long tracking URLs as spam. Users are significantly less likely to click a messy URL than a clean short link.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Always create a short link before sharing. It takes 10 seconds and increases click-through rates by up to 39 percent.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Changing Bio Links Constantly</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Instagram and Twitter only allow one bio link. Many creators change it weekly to promote their latest content. Followers who click an old bio link from a saved post land on the wrong page.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Use a Smart Bio page as your permanent bio link. The page contains links to all your content, and auto-update features keep it current.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Not Tracking Link Performance</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">If you share a link on Twitter, LinkedIn, and your newsletter but do not track clicks, you have no idea which channel performs best. You might be wasting effort on a platform that drives zero traffic.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Create a unique short link for each platform. The analytics dashboard shows you exactly which source drives the most clicks.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Forgetting to Update Expired Campaigns</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">A Black Friday sale link shared in November still points to the sale page in January. Visitors see expired offers and bounce. Dead links in old content are a silent traffic leak.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Use scheduled links with expiration dates. The link automatically deactivates after the campaign ends.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Paying for Features You Do Not Need</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Bitly Pro, Linktree Pro, and similar tools charge 9 to 25 dollars monthly for analytics, custom domains, and bio pages. Many creators pay for these subscriptions while using only the basic features.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> This Link Manager provides core link shortening, analytics, QR codes, and bio pages completely free. For individual creators and small businesses, it replaces the paid tier entirely.</p>
                    </div>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Use Cases */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Who Should Use the Link Manager
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Content Creators</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">YouTubers, streamers, and bloggers need short links for video descriptions, social posts, and bio pages. Track which videos drive the most clicks to your store or Patreon.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Marketers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Create unique tracking links for each campaign, channel, and ad variant. A-B test landing pages by sending identical audiences to different URLs.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Share app download links, documentation, and GitHub repos with clean short URLs. Track which blog posts or tweets drive the most installs.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Small Business Owners</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Short links for product pages, booking forms, and promotional campaigns. QR codes on receipts and packaging drive repeat visits.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Event Organizers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Registration links, schedules, and venue maps in QR codes on tickets and posters. Scheduled links activate when registration opens and deactivate after the event ends.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Job Seekers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">A Smart Bio page containing your resume, portfolio, LinkedIn, and contact form. Share one link on job applications instead of multiple attachments.</p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Internal Links */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  More Free Tools for Creators
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a href="/tools/ai-prompt-library" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">AI Prompt Library</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">500+ curated AI prompts for ChatGPT, Claude, and Midjourney.</p>
                  </a>
                  <a href="/tools/ai-resume-builder" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">AI Resume Builder</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">ATS-friendly resumes in minutes for developers and professionals.</p>
                  </a>
                  <a href="/tools/ai-cover-letter-generator" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">Cover Letter Generator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tailored cover letters for any job description.</p>
                  </a>
                  <a href="/tools/startup-idea-generator" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">Startup Idea Generator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered business ideas with market analysis.</p>
                  </a>
                  <a href="/tools/productivity-planner" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">Productivity Planner</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered daily planning and task prioritization.</p>
                  </a>
                  <a href="/tools" className="group block bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 shadow-sm border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">View All 20+ Free Tools →</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Explore interview simulators, salary estimators, budget planners, and more.</p>
                  </a>
                </div>
              </section>

              <InContentAd />

              {/* Workflow */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Create Your First Smart Link in 3 Steps
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold mb-3">1</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Paste Your Long URL</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Copy any URL and paste it into the Link Manager. The tool automatically validates the link and prepares it for shortening. You can use any destination: a product page, a blog post, a video, a form, or a file.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold mb-3">2</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customize and Create</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Choose a custom slug that matches your brand or campaign. Set an optional schedule if the link is time-sensitive. Generate a QR code if you need a scannable version.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold mb-3">3</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Share and Track</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Copy the short link and share it anywhere. Return to the analytics dashboard anytime to see click data. Use the insights to optimize your sharing strategy.</p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* FAQ */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions About the Link Manager
                </h2>
                <div className="space-y-4">
                  {toolFaqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm group-open:rotate-180 transition-transform">
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
              <section className="mb-12">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    One Link. Infinite Possibilities.
                  </h2>
                  <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                    Join 900+ creators managing links smarter. Free, private, and built for real workflows.
                  </p>
                  <a
                    href="#link-manager"
                    className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors shadow-lg"
                  >
                    Create Your First Link
                  </a>
                  <p className="text-indigo-200 text-sm mt-4">
                    Short links, analytics, QR codes, and bio pages. No signup required.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Related Resources</h3>
                  <ul className="space-y-3">
                    <li><a href="/tools/ai-prompt-library" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>✨</span> AI Prompt Library</a></li>
                    <li><a href="/tools/ai-resume-builder" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>📄</span> AI Resume Builder</a></li>
                    <li><a href="/tools/ai-email-assistant" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>📧</span> AI Email Assistant</a></li>
                    <li><a href="/tools/startup-idea-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>💡</span> Startup Idea Generator</a></li>
                    <li><a href="/tools/productivity-planner" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>⏰</span> Productivity Planner</a></li>
                    <li><a href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>📚</span> Creator Guides</a></li>
                    <li><a href="/trends" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"><span>📈</span> Tech Trends 2026</a></li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">2026 Link Stats</h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2"><span className="text-green-500 font-bold">5.8B</span><span>links shortened daily worldwide</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-500 font-bold">39%</span><span>CTR increase with short links</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-500 font-bold">28B</span><span>QR code scans globally</span></li>
                    <li className="flex items-start gap-2"><span className="text-green-500 font-bold">73%</span><span>users prefer bio link pages</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
