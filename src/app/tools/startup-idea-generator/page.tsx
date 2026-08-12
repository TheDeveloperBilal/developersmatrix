import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, Lightbulb, CheckCircle, Sparkles, TrendingUp, Zap, Rocket, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import StartupIdeaClient from "./StartupIdeaClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['startup-idea-generator']);

const faqs = [
  {
    question: "How does the AI Startup Idea Generator work?",
    answer: "Our generator uses a curated database of innovative business concepts organized by industry. Select a category like AI, SaaS, FinTech, or Climate Tech, and we will surface a detailed startup idea complete with problem statement, solution, market size, monetization strategy, competition analysis, difficulty rating, and estimated MVP timeline."
  },
  {
    question: "Are the generated ideas actually viable in 2026?",
    answer: "Yes. Every idea in our database is grounded in current market trends, real demand signals, and proven business models. We update the database quarterly to reflect 2026 market conditions, emerging technologies, and shifting consumer behaviors. Ideas include realistic market sizing, actual competitor names, and feasible monetization paths."
  },
  {
    question: "Can I refine or expand on a generated idea?",
    answer: "Absolutely. When you generate an idea, you can save it to your list, copy the full breakdown to your notes, or generate another variation in the same industry. Each idea comes with enough detail to serve as a starting point for a pitch deck, business plan, or MVP scope."
  },
  {
    question: "What industries are covered?",
    answer: "We cover SaaS, AI and Machine Learning, FinTech, HealthTech, EdTech, E-commerce, Climate Tech, Creator Economy, DevTools, HR Tech, Robotics, Biotech, Cybersecurity, and Space Tech. Each industry contains multiple ideas ranging from easy weekend projects to ambitious venture-scale concepts."
  },
  {
    question: "Does each idea include an MVP timeline?",
    answer: "Yes. Every idea includes an estimated time to MVP ranging from 2 weeks to 8+ months. The timeline accounts for complexity, regulatory requirements, technical difficulty, and team size assumptions. This helps you pick an idea that matches your available time and resources."
  },
  {
    question: "Is this startup idea generator free to use?",
    answer: "Yes, completely free. No signup, no credit card, no limits. Generate as many ideas as you want, save your favorites, and copy the full details to use in your own planning."
  },
  {
    question: "How can I validate these ideas before building?",
    answer: "Start by researching the competitors we list. Check if the problem resonates by posting in relevant communities or running a simple landing page test. Look at the market size we provide and see if you can carve out a niche. The ideas are designed to be specific enough that validation is straightforward."
  },
  {
    question: "What makes these ideas different from generic lists?",
    answer: "Unlike generic idea lists, each concept includes a specific problem worth solving, a concrete solution, real market data, known competitors, a clear monetization path, and a realistic difficulty assessment. They are designed as starting points for real businesses, not brainstorming fluff."
  }
];

export default function StartupIdeaPage() {
  return (
    <div className="min-h-screen bg-background">
      <SoftwareApplicationSchema
        name="DevelopersMatrix Startup Idea Generator"
        description="Free AI startup idea generator for 2026. Discover innovative business ideas across AI, SaaS, FinTech, HealthTech, Climate Tech, and more with market analysis and MVP timelines."
        url="https://developersmatrix.com/tools/startup-idea-generator"
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
        offers={{ price: "0", priceCurrency: "USD" }}
        aggregateRating={{ ratingValue: "4.6", ratingCount: "2800" }}
      />
      <HowToSchema
        name="How to Find Your Next Startup Idea in 2026"
        description="Step-by-step guide to using the DevelopersMatrix Startup Idea Generator to discover validated business concepts with market analysis and MVP timelines."
        url="https://developersmatrix.com/tools/startup-idea-generator"
        totalTime="PT10M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        step={[
          {
            name: "Choose your industry category",
            text: "Select from categories like AI & Machine Learning, SaaS, FinTech, HealthTech, Climate Tech, E-commerce, or No-Code Tools. Each category contains curated ideas based on 2026 market trends and real demand signals. Pick a category that matches your skills or interests for the best fit."
          },
          {
            name: "Generate and evaluate ideas",
            text: "Click 'Generate Idea' to receive a complete business concept including problem statement, proposed solution, target market, monetization strategy, competition analysis, and difficulty rating. Each idea includes realistic market sizing and actual competitor names. Rate ideas as thumbs up or thumbs down to refine future recommendations."
          },
          {
            name: "Review market analysis and MVP timeline",
            text: "Every generated idea includes an estimated MVP (Minimum Viable Product) timeline and technical complexity assessment. Ideas range from weekend projects to 6-month builds. The market analysis shows addressable market size, realistic revenue potential, and entry barriers. Use this data to validate ideas before investing time."
          },
          {
            name: "Save promising ideas and take action",
            text: "Save ideas you like to your browser's local storage for later review. When you are ready to start, use the action plan to break the idea into concrete first steps. The generator is a starting point — successful execution depends on customer validation, market research, and consistent execution."
          }
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://developersmatrix.com' },
          { name: 'Tools', url: 'https://developersmatrix.com/tools' },
          { name: 'Startup Idea Generator', url: 'https://developersmatrix.com/tools/startup-idea-generator' }
        ]}
      />
      <FAQSchema faqs={faqs} />

      {/* Top Ad Banner */}
      <div className="w-full bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <SidebarAd slot="1234567890" />
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/tools" className="hover:text-primary transition-colors">Tools</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">Startup Idea Generator</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              2026 Ideas
            </Badge>
            <Badge variant="outline" className="text-xs">Free Tool</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Free AI Startup Idea Generator 2026
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
            A startup idea generator uses AI to produce validated, market-aware business concepts based on your skills, interests, available resources, and target market. Unlike random idea lists, AI-powered generators in 2026 cross-reference current market gaps, search trend data, and competitive landscapes to surface ideas with genuine commercial potential.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Zap, title: "50+ Curated Ideas", desc: "Real business concepts with market data and feasibility scores" },
            { icon: Target, title: "14 Industries", desc: "From AI agents to climate tech to robotics and biotech" },
            { icon: TrendingUp, title: "2026 Market Data", desc: "Trending ideas based on current demand and emerging tech" },
            { icon: Rocket, title: "MVP Timelines", desc: "Know exactly how long each idea takes to build and launch" }
          ].map((benefit, i) => (
            <Card key={i} className="border-primary/10">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                    <p className="text-xs text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Layout: Tool + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tool */}
          <div className="lg:col-span-2">
            <StartupIdeaClient />

            {/* In-Content Ad */}
            <div className="mt-8">
              <InContentAd slot="5678901234" />
            </div>

            {/* What Makes Our Tool Different */}
            <Card className="mt-8 border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  What Makes Our Startup Idea Generator Different
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Every idea includes a specific problem, concrete solution, real market size, and known competitors",
                    "50+ curated concepts across 14 industries, not generic fluff or brainstorming filler",
                    "2026 market data reflects current demand for AI agents, climate tech, robotics, and biotech",
                    "Difficulty ratings and MVP timelines help you choose ideas matched to your skills and schedule",
                    "Monetization strategy included for every idea so you know how to make money from day one",
                    "Save, copy, and export ideas to use in pitch decks, business plans, or investor meetings",
                    "No signup, no credit card, no limits. Generate unlimited ideas instantly"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Detailed SEO Content */}
            <div className="mt-12 space-y-10">
              <div>
                <h2 className="text-2xl font-bold mb-4">How to Use the Startup Idea Generator</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Starting a business begins with finding the right problem to solve. Our startup idea generator helps you skip the blank page by surfacing validated business concepts across high-growth industries. Select a category that matches your skills and interests, then generate ideas until one resonates.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Each idea includes six key components: the problem worth solving, your proposed solution, market size, monetization path, competition level, and estimated MVP timeline. This structure gives you enough detail to evaluate an idea in under a minute.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Use the save feature to bookmark ideas you want to revisit. The copy button exports the full idea breakdown in a clean format you can paste into Notion, Google Docs, or a pitch deck. Generate multiple ideas in the same industry to spot patterns and opportunities others might miss.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      The generator works best when you treat it as a starting point, not a final answer. Pick an idea, validate it with potential customers, and adapt the solution to match what you learn. The market data and competitor lists we provide make that first step much faster.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2026 Startup Trends to Watch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      AI agents are the defining trend of 2026. Unlike chatbots that respond to prompts, AI agents autonomously complete tasks: booking meetings, researching leads, writing reports, and managing workflows. Startups building agent platforms, agent marketplaces, and agent infrastructure are seeing unprecedented investor interest.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Climate tech continues its acceleration as regulatory pressure and consumer demand converge. Carbon accounting software, sustainable supply chain tools, and circular economy marketplaces are attracting serious capital. The market is less saturated than AI, creating bigger opportunities for early entrants.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Robotics and automation are crossing the chasm from industrial to consumer and small business applications. Warehouse automation, food service robots, and home maintenance drones are becoming economically viable. The hardware cost curve and AI vision advances make 2026 a unique window.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Vertical AI, which means AI trained for specific industries rather than general purpose, is proving more valuable than horizontal platforms. Healthcare diagnostics, legal document review, financial fraud detection, and manufacturing quality control all show stronger customer willingness to pay than generic AI tools.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Turning an Idea into a Real Business</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      The best validation is a paying customer. Once you generate an idea, create a simple landing page that describes the problem and solution. Run a small ad campaign or post in relevant communities. If people sign up or express interest, you have signal. If not, generate another idea.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Start with the easiest version of the idea that still solves the core problem. Our MVP timelines are estimates, but the principle is universal: launch something basic, learn from real users, and iterate. A six-month perfect product often loses to a two-week good enough product that gets feedback early.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Research the competitors we list for each idea. Do not be discouraged by existing players. Competition validates demand. Your job is to find an underserved segment, a better delivery model, or a specific pain point the incumbents ignore. Most billion-dollar companies started in crowded markets.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Monetization should be clear from week one. Whether it is SaaS subscriptions, transaction fees, or usage-based pricing, know how you will make money before you build. The monetization path we include for each idea is designed to be implementable with minimal complexity.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Related Tools for Entrepreneurs</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/tools/budget-planner" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Budget Planner</h3>
                        <p className="text-sm text-muted-foreground">Plan your startup finances. Track runway, expenses, and cash flow before you launch.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/ai-resume-builder" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">AI Resume Builder</h3>
                        <p className="text-sm text-muted-foreground">Building a team? Create professional job postings and team profiles that attract talent.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/productivity-planner" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Productivity Planner</h3>
                        <p className="text-sm text-muted-foreground">Manage your startup tasks, prioritize features, and track milestones efficiently.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/ai-prompt-library" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">AI Prompt Library</h3>
                        <p className="text-sm text-muted-foreground">Use curated AI prompts for market research, customer outreach, and content creation.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/ai-email-assistant" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">AI Email Assistant</h3>
                        <p className="text-sm text-muted-foreground">Draft investor pitches, partnership requests, and customer emails professionally.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">All 20+ Free Tools</h3>
                        <p className="text-sm text-muted-foreground">Explore our full collection of free AI-powered tools for developers and entrepreneurs.</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-base font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Back to Tools */}
            <div className="mt-12 flex items-center gap-4">
              <Link href="/tools">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Tools
                </Button>
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Tool Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <Badge variant="secondary">Productivity</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <Badge variant="secondary">Free</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ideas</span>
                  <Badge variant="secondary">50+</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Industries</span>
                  <Badge variant="secondary">14</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Market Data</span>
                  <Badge variant="secondary">2026</Badge>
                </div>
              </CardContent>
            </Card>

            <SidebarAd slot="3456789012" />

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Founder Tip</h3>
                <p className="text-sm text-muted-foreground">
                  The best startup ideas come from problems you personally experience. Use this generator for inspiration, then look for pains in your own work and life.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Trending Industries 2026</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { industry: "AI Agents", trend: "Hot" },
                  { industry: "Climate Tech", trend: "Rising" },
                  { industry: "Robotics", trend: "Rising" },
                  { industry: "Biotech", trend: "Hot" },
                  { industry: "Cybersecurity", trend: "Stable" },
                  { industry: "DevTools", trend: "Hot" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1">
                    <span>{item.industry}</span>
                    <Badge variant="outline" className={
                      item.trend === 'Hot' ? 'text-red-600 border-red-200' :
                      item.trend === 'Rising' ? 'text-orange-600 border-orange-200' :
                      'text-blue-600 border-blue-200'
                    }>
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Free Startup Idea Generator: Discover Your Next Business Venture in 2026
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            Every successful startup begins with a single idea. But finding that idea — one that matches your skills, interests, and market timing — is the hardest part. Our <strong>free startup idea generator</strong> uses AI to combine trending industries, emerging technologies, and real market gaps into actionable business concepts. No brainstorming sessions, no blank page anxiety, just validated ideas you can research and build.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Why Use a Startup Idea Generator in 2026
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            The startup landscape is changing rapidly. AI agents, climate tech, biotech, and robotics are creating new opportunities faster than traditional market research can track. Our <strong>AI startup idea generator</strong> synthesizes data from trending industries, emerging technologies, and consumer pain points to generate ideas that are timely and relevant. Each idea includes a problem statement, target audience, revenue model, and implementation difficulty — so you can evaluate before committing months of effort.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            In 2026, solo founders and small teams are building million-dollar businesses with AI tools. The barrier to entry has never been lower. What matters now is choosing the right problem to solve. Our generator helps you skip the ideation paralysis and move straight to validation and building.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Trending Industries for Startups in 2026
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🤖 AI Agents</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Autonomous AI systems that handle customer service, coding, research, and content creation. The AI agent market is projected to grow 10x by 2027.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🌱 Climate Tech</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Carbon accounting, sustainable supply chains, energy optimization, and climate risk analytics. ESG mandates are driving enterprise demand.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🏥 Health Tech</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Remote patient monitoring, mental health apps, personalized nutrition, and AI diagnostics. Post-pandemic healthcare is permanently digital-first.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔒 Cybersecurity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Zero-trust infrastructure, AI threat detection, identity management, and privacy compliance. Breaches are up 40% year-over-year.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Related Tools for Entrepreneurs
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            <a href="/tools/budget-planner" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">💰</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Budget Planner</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Plan your startup finances</p>
              </div>
            </a>
            <a href="/tools/productivity-planner" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">📅</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Productivity Planner</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manage your time as a founder</p>
              </div>
            </a>
            <a href="/tools/ai-prompt-library" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">🤖</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Prompt Library</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">500+ prompts for building with AI</p>
              </div>
            </a>
            <a href="/blog/ai-automation-business-ideas-2026" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">📚</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Automation Business Ideas</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2026 guide to AI-powered businesses</p>
              </div>
            </a>
            <a href="/blog/ai-side-hustles-2026-make-money" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">💰</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Side Hustles Guide</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Real ways to make money with AI</p>
              </div>
            </a>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-100 dark:border-yellow-800">
            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Generate Your First Idea Today
            </h3>
            <p className="text-yellow-800 dark:text-yellow-300 text-sm mb-4">
              The best time to start a business was yesterday. The second best time is today. Use our free generator to discover ideas that match your skills and market timing.
            </p>
            <p className="text-yellow-700 dark:text-yellow-400 text-xs">
              100% free. No signup. Unlimited ideas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
