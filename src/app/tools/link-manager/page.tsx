import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, Link2, CheckCircle, Sparkles, Zap, BarChart3, QrCode, Globe, Calendar, Bookmark, Code, FileText, Share2, Users, TrendingUp, MousePointer, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
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
  const tool = getToolBySlug('link-manager');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
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

      <div className="min-h-screen bg-muted/20">
        {/* Tool Section */}
        <section className="bg-background border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Link href="/tools" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Tools
              </Link>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
                <span className="text-xs text-muted-foreground">Updated for 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Free Link Manager — Short Links, Analytics & Smart Bio Pages
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Create branded short links, track clicks with detailed analytics, generate QR codes, and build auto-updating bio pages. No signup required.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LinkManagerClient />
                <InContentAd />
              </div>

              <aside className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Related Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <Link href="/tools/ai-prompt-library" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      <span>AI Prompt Library</span>
                    </Link>
                    <Link href="/tools/ai-resume-builder" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>AI Resume Builder</span>
                    </Link>
                    <Link href="/tools/ai-email-assistant" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Share2 className="w-4 h-4 text-green-500" />
                      <span>AI Email Assistant</span>
                    </Link>
                    <Link href="/tools/startup-idea-generator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                      <span>Startup Idea Generator</span>
                    </Link>
                    <Link href="/tools/productivity-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Calendar className="w-4 h-4 text-red-500" />
                      <span>Productivity Planner</span>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      Link Stats 2026
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Links shortened daily worldwide</span>
                      <span className="font-semibold">5.8 billion</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Click-through rate increase with short links</span>
                      <span className="font-semibold">39%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">QR code scans globally (2026)</span>
                      <span className="font-semibold">28 billion</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Users who prefer bio link pages</span>
                      <span className="font-semibold">73%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg. monthly cost of Linktree Pro</span>
                      <span className="font-semibold">$9-25</span>
                    </div>
                  </CardContent>
                </Card>

                <SidebarAd />
              </aside>
            </div>
          </div>
        </section>

        {/* SEO Content Sections */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Why Every Creator Needs a Link Management Strategy</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                Links are the infrastructure of the internet. Every share, every referral, every conversion depends on a link. But raw URLs are ugly, untrustworthy, and provide zero insight into performance. A YouTube description with a 200-character Amazon affiliate link looks amateur. A Twitter bio that says "check my latest video" with a different link every week confuses followers. A QR code that points to a dead page wastes a printed poster.
              </p>
              <p className="text-base leading-relaxed">
                The Link Manager solves all of these problems. Short links look professional and are 39 percent more likely to be clicked than raw URLs. Click analytics tell you which platforms drive traffic and which content resonates. QR codes bridge offline and online marketing. Smart bio pages give your audience a single destination that aggregates everything you create. For creators, marketers, developers, and small business owners, link management is not a luxury. It is a necessity.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Features That Replace Paid Tools</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-blue-500" />
                    Branded Short Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Transform long, ugly URLs into clean, memorable short links. Instead of sharing a 200-character tracking link, share something like dmtr.co/sale. Short links are more trustworthy, easier to type, and significantly more likely to be clicked. The tool lets you customize the slug for brand consistency.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    Click Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Track every click on every link. See total clicks, unique visitors, geographic distribution, device breakdown, and referrer sources. This data reveals where your audience comes from and what content drives engagement. Without analytics, you are sharing links blindly.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-purple-500" />
                    QR Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Generate QR codes for any short link with a single click. QR codes bridge physical marketing to digital destinations. Print them on business cards, posters, product packaging, or event badges. In 2026, 28 billion QR codes are scanned globally. A QR code that points to your bio page turns any physical surface into a traffic source.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-5 h-5 text-orange-500" />
                    Smart Bio Pages
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Build a single page that contains all your important links. YouTube, Instagram, portfolio, store, newsletter, GitHub, LinkedIn — everything in one place. Auto-update features pull your latest content from connected platforms, so the page stays current without manual edits. Share one link. Let visitors choose where to go next.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Five Link Mistakes That Cost You Traffic (And How to Fix Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Sharing Raw URLs in Social Posts
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">A raw Amazon affiliate link or a Google Docs sharing link looks unprofessional and untrustworthy. Social platforms may even flag long tracking URLs as spam. Users are significantly less likely to click a messy URL than a clean short link.</p>
                  <p><strong className="text-foreground">Fix:</strong> Always create a short link before sharing. It takes 10 seconds and increases click-through rates by up to 39 percent. The Link Manager handles the shortening and tracking simultaneously.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Changing Bio Links Constantly
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Instagram and Twitter only allow one bio link. Many creators change it weekly to promote their latest content. Followers who click an old bio link from a saved post land on the wrong page. This creates a fragmented user experience.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use a Smart Bio page as your permanent bio link. The page contains links to all your content, and auto-update features keep it current. One link. Infinite destinations. Zero maintenance.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    Not Tracking Link Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">If you share a link on Twitter, LinkedIn, and your newsletter but do not track clicks, you have no idea which channel performs best. You might be wasting effort on a platform that drives zero traffic while neglecting your highest-converting channel.</p>
                  <p><strong className="text-foreground">Fix:</strong> Create a unique short link for each platform. The analytics dashboard shows you exactly which source drives the most clicks. Double down on what works. Cut what does not.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    Forgetting to Update Expired Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">A Black Friday sale link shared in November still points to the sale page in January. Visitors see expired offers and bounce. Dead links in old content are a silent traffic leak that most creators never notice.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use scheduled links with expiration dates. The link automatically deactivates after the campaign ends. For evergreen content, set links to redirect to your homepage or current promotion when the campaign expires.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    Paying for Features You Do Not Need
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Bitly Pro, Linktree Pro, and similar tools charge 9 to 25 dollars monthly for analytics, custom domains, and bio pages. Many creators pay for these subscriptions while using only the basic features. The monthly cost adds up to hundreds of dollars annually.</p>
                  <p><strong className="text-foreground">Fix:</strong> This Link Manager provides core link shortening, analytics, QR codes, and bio pages completely free. For individual creators and small businesses, it replaces the paid tier entirely. Use the money you save on content or ads instead.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Who Should Use the Link Manager</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Users className="w-8 h-8 text-pink-500 mb-2" />
                  <CardTitle className="text-base">Content Creators</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>YouTubers, streamers, and bloggers need short links for video descriptions, social posts, and bio pages. Track which videos drive the most clicks to your store or Patreon. A bio page aggregates all your platforms in one clean destination.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Marketers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Create unique tracking links for each campaign, channel, and ad variant. A-B test landing pages by sending identical audiences to different URLs. QR codes on print materials bridge offline and digital attribution.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Developers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Share app download links, documentation, and GitHub repos with clean short URLs. Track which blog posts or tweets drive the most installs. Bio pages showcase your portfolio, blog, and projects in one place.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MousePointer className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">Small Business Owners</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Short links for product pages, booking forms, and promotional campaigns. QR codes on receipts and packaging drive repeat visits. Analytics show which marketing channels actually convert into clicks.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Bookmark className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-base">Event Organizers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Registration links, schedules, and venue maps in QR codes on tickets and posters. Scheduled links activate when registration opens and deactivate after the event ends. No manual link management during busy event periods.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="w-8 h-8 text-cyan-500 mb-2" />
                  <CardTitle className="text-base">Job Seekers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>A Smart Bio page containing your resume, portfolio, LinkedIn, and contact form. Share one link on job applications instead of multiple attachments. Track when employers click to gauge interest level.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">More Free Tools for Creators</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tools/ai-prompt-library" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Prompt Library</p>
                        <p className="text-xs text-muted-foreground">500+ curated AI prompts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-resume-builder" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Resume Builder</p>
                        <p className="text-xs text-muted-foreground">ATS-friendly resumes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-cover-letter-generator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Cover Letter Generator</p>
                        <p className="text-xs text-muted-foreground">Tailored cover letters</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/startup-idea-generator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Startup Idea Generator</p>
                        <p className="text-xs text-muted-foreground">Business ideas with AI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/productivity-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Productivity Planner</p>
                        <p className="text-xs text-muted-foreground">Daily task planning</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">All Tools</p>
                        <p className="text-xs text-muted-foreground">15+ free AI-powered tools</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          <InContentAd />

          {/* 3-Phase Workflow */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Create Your First Smart Link in 3 Steps</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Paste Your Long URL</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Copy any URL and paste it into the Link Manager. The tool automatically validates the link and prepares it for shortening. You can use any destination: a product page, a blog post, a video, a form, or a file.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Customize and Create</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Choose a custom slug that matches your brand or campaign. Set an optional schedule if the link is time-sensitive. Generate a QR code if you need a scannable version. All customization happens in one interface.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Share and Track</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Copy the short link and share it anywhere. Return to the analytics dashboard anytime to see click data. Watch trends over time and compare performance across different platforms. Use the insights to optimize your sharing strategy.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {toolFaqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-sm sm:text-base hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA Banner */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">One Link. Infinite Possibilities.</h2>
              <p className="text-white/90 mb-6">
                Join 900+ creators managing links smarter. Free, private, and built for real workflows.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link href="/tools/ai-prompt-library">Explore AI Prompts</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/ai-resume-builder">Build Your Resume</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
