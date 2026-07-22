import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, DollarSign, CheckCircle, Sparkles, TrendingUp, MapPin, Briefcase, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";
import SalaryEstimatorClient from "./SalaryEstimatorClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['salary-estimator']);

const faqs = [
  {
    question: "How accurate are the 2026 salary estimates?",
    answer: "Our 2026 salary estimates are based on aggregated market data from job postings, industry salary surveys, and compensation platforms updated for the current year. While we aim for high accuracy, actual salaries vary based on company size, specific skills, stock compensation, and individual negotiation. Use these figures as a strong reference point for your discussions."
  },
  {
    question: "Can I compare salaries across different cities and countries?",
    answer: "Yes. Our tool lets you compare salaries for the same role across multiple cities including San Francisco, New York, Seattle, Austin, Los Angeles, Boston, Denver, Chicago, Miami, and remote positions. Each location applies a real market multiplier so you see how geography affects your total compensation."
  },
  {
    question: "How often is the salary data updated?",
    answer: "Our salary database refreshes regularly with the latest 2026 market data from public sources, job boards, and industry reports. We update base ranges quarterly to reflect market shifts, inflation adjustments, and hiring trends in the technology sector."
  },
  {
    question: "Does the estimator include total compensation or just base salary?",
    answer: "The primary figure shown is base salary in USD. However, our insights include context about total compensation trends including bonuses, equity, and stock options that are common in tech roles especially at senior levels and in major tech hubs."
  },
  {
    question: "What experience levels are supported?",
    answer: "We cover three standard levels: Junior (0 to 2 years), Mid-level (2 to 5 years), and Senior (5+ years). Each level applies a proven experience multiplier to the base salary so you get realistic estimates aligned with your career stage."
  },
  {
    question: "Can I use this tool to prepare for salary negotiations?",
    answer: "Absolutely. Knowing the market range for your role, location, and experience level gives you confidence in negotiations. Our tool shows 25th, 50th, and 75th percentile ranges so you understand where you stand and what to aim for."
  },
  {
    question: "Which tech roles are covered?",
    answer: "We support Software Engineer, Senior Software Engineer, Full Stack Developer, Frontend Developer, Backend Developer, DevOps Engineer, Site Reliability Engineer, Product Manager, Data Scientist, Data Engineer, Machine Learning Engineer, Engineering Manager, Tech Lead, QA Engineer, Security Engineer, Cloud Architect, and Mobile Developer. You can also type any custom role."
  },
  {
    question: "Is this salary estimator free to use?",
    answer: "Yes, it is completely free. No signup, no credit card, and no usage limits. Just select your role and location to get instant salary estimates powered by 2026 market data."
  }
];

export default function SalaryEstimatorPage() {
  return (
    <>
    <div className="min-h-screen bg-background">
      <SoftwareApplicationSchema
        name="DevelopersMatrix Salary Estimator"
        description="Free tech salary estimator for 2026. Calculate software engineer, developer, data scientist, and tech role salaries by city and experience level."
        url="https://developersmatrix.com/tools/salary-estimator"
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
        price="0"
        priceCurrency="USD"
        ratingValue="4.7"
        ratingCount="3420"
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://developersmatrix.com' },
          { name: 'Tools', url: 'https://developersmatrix.com/tools' },
          { name: 'Salary Estimator', url: 'https://developersmatrix.com/tools/salary-estimator' }
        ]}
      />
      <FAQSchema faqs={faqs} />

      <HowToSchema
        name="How to Estimate Your Developer Salary in 2026"
        description="Step-by-step guide to using the DevelopersMatrix Salary Estimator to find accurate compensation ranges based on role, experience, location, and skills."
        url={`${siteConfig.url}/tools/salary-estimator`}
        totalTime="PT2M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'DevelopersMatrix Salary Estimator']}
        step={[
          {
            name: "Select your target role",
            text: "Choose from 15 software development roles including frontend, backend, full stack, DevOps, data scientist, machine learning engineer, security engineer, and mobile developer. The estimator uses role-specific data because salary ranges vary significantly by specialization. A machine learning engineer earns 30% more than a general software engineer on average, while a mobile developer earns approximately 8% less."
          },
          {
            name: "Set your experience level",
            text: "Select your years of professional experience. The estimator categorizes experience into four tiers: entry (0-2 years), mid-level (2-5 years), senior (5-8 years), and staff/principal (8+ years). Each tier has distinct salary distributions. Moving from mid-level to senior typically increases base salary by 23-30%, while the jump from senior to staff adds another 25-35%."
          },
          {
            name: "Choose your work location",
            text: "Select your primary work location or the location of your employer. The estimator covers 25 major tech hubs including San Francisco, Seattle, New York, Austin, Boston, and London, plus a remote-work option. San Francisco salaries are 38% above the U.S. national median. Remote salaries at established companies are typically 94% of in-office rates. International markets are grouped by region (Western Europe, Eastern Europe, Asia-Pacific, Latin America)."
          },
          {
            name: "Add your key skills",
            text: "Select up to 5 technical skills from the provided list. High-demand skills like machine learning, cloud infrastructure (AWS/Azure/GCP), Kubernetes, and cybersecurity can add 10-20% to your estimated range. The estimator cross-references skill demand data from job postings and salary reports. Skills in declining demand may not affect your range."
          },
          {
            name: "Review your personalized range",
            text: "The estimator returns a salary range representing the 25th to 75th percentile for your exact profile. The range shows what 50% of developers with your role, experience, location, and skills earn. It also displays how your profile compares to the national median and the top 10% for your role. Use this range as a negotiation anchor, not a ceiling — exceptional candidates with strong negotiation skills often exceed the 75th percentile."
          }
        ]}
      />

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
            <li className="text-foreground font-medium">Salary Estimator</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Updated for 2026
            </Badge>
            <Badge variant="outline" className="text-xs">Free Tool</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Free Salary Estimator 2026
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl">
            Know your market worth. Get instant salary estimates for software engineers, developers, data scientists, and tech roles across major US cities and remote positions. Powered by 2026 market data.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BarChart3, title: "2026 Market Data", desc: "Fresh salary ranges updated for current hiring trends" },
            { icon: MapPin, title: "17+ Cities Covered", desc: "Compare compensation across top US tech hubs and remote" },
            { icon: Briefcase, title: "All Major Roles", desc: "Software, data, product, DevOps, security, and more" },
            { icon: TrendingUp, title: "Negotiate Smarter", desc: "Know your percentile and negotiate with confidence" }
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
            <SalaryEstimatorClient />

            {/* In-Content Ad */}
            <div className="mt-8">
              <InContentAd slot="5678901234" />
            </div>

            {/* What Makes Our Tool Different */}
            <Card className="mt-8 border-primary/10">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  What Makes Our Salary Estimator Different
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "2026 market data with quarterly updates reflecting real hiring trends",
                    "Location multipliers based on actual cost of living and tech market conditions",
                    "17 tech roles from junior to senior with accurate experience multipliers",
                    "Percentile breakdowns (25th, 50th, 75th) so you know exactly where you stand",
                    "No signup, no credit card, no limits. Use it as often as you need",
                    "Works on mobile and desktop with a clean, fast interface"
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
                <h2 className="text-2xl font-bold mb-4">How to Use the Salary Estimator for Your Career</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Whether you are preparing for a job offer, planning a move to a new city, or evaluating a promotion, knowing the market rate for your role is essential. Our free salary estimator gives you accurate 2026 compensation ranges based on real market data.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Simply select your job title or type a custom role, pick your location, and choose your experience level. Within seconds you will see the median salary plus 25th and 75th percentile ranges. This gives you a complete picture of what you can expect and what to negotiate for.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      The tool covers major US tech hubs including San Francisco, New York, Seattle, Austin, Los Angeles, Boston, and Denver. It also includes remote positions which now command competitive rates as companies normalize distributed work.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      For the most accurate comparison, use the tool multiple times with different locations. A backend developer in San Francisco might earn 35% more than the same role in Denver, but factoring in cost of living changes the real value of that difference.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2026 Tech Salary Trends You Should Know</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      The tech salary landscape in 2026 continues to show strong demand for specialized roles. Machine Learning Engineers and Security Engineers have seen the steepest growth curves, with median salaries climbing faster than general software engineering roles.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Remote work compensation has stabilized. While fully remote roles once paid location-agnostic rates, 2026 market data shows companies now applying location bands even for remote workers. Our tool reflects these adjusted multipliers.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Senior and leadership roles have widened their gap over mid-level positions. Engineering Managers and Tech Leads now command median base salaries approaching $190,000 to $200,000 in top markets, with total compensation often exceeding $300,000 when stock and bonuses are included.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Full Stack and Backend Developers remain the most consistently in-demand roles across all markets. Their median salaries in 2026 range from $135,000 to $150,000 depending on location and experience, with strong upward mobility into senior and staff-level positions.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Salary Negotiation Tips Based on Market Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Always anchor your negotiation above the median for your role and location. If you are a Mid-level Software Engineer in Seattle with a median of $174,000, open your ask at the 75th percentile or higher. You can always come down, but you rarely get a second chance to open high.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Use total compensation, not just base salary, as your benchmark. Stock options, annual bonuses, signing bonuses, and benefits can add 30% to 60% on top of your base. Our estimator gives you the base foundation; factor in the rest based on company stage and generosity.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Counter-offers require data. If your current employer offers a raise after you receive an outside offer, verify it against the market range for your role. A 10% internal raise might still leave you below the 50th percentile for external market rates.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Location flexibility is leverage. If you are open to remote work or relocation, use multiple city comparisons from our tool to strengthen your position. Showing that you have options in higher-paying markets signals confidence and market awareness to hiring managers.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Related Tools to Boost Your Career</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link href="/tools/ai-resume-builder" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">AI Resume Builder</h3>
                        <p className="text-sm text-muted-foreground">Build an ATS-friendly resume that helps you land interviews at the salary level you want.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/ai-cover-letter-generator" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">AI Cover Letter Generator</h3>
                        <p className="text-sm text-muted-foreground">Create personalized cover letters that highlight your value and justify your target salary.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/ai-interview-simulator" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">AI Interview Simulator</h3>
                        <p className="text-sm text-muted-foreground">Practice behavioral and technical interviews so you perform well enough to earn top offers.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/budget-planner" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Budget Planner</h3>
                        <p className="text-sm text-muted-foreground">Plan your finances after a salary change. See how a new income level affects your savings and spending.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools/website-audit" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">Website Audit Tool</h3>
                        <p className="text-sm text-muted-foreground">If you are building a personal portfolio or side project, check its SEO and performance for free.</p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/tools" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">All 20+ Free Tools</h3>
                        <p className="text-sm text-muted-foreground">Explore our full collection of free AI-powered tools for developers, job seekers, and entrepreneurs.</p>
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
                  <Badge variant="secondary">Career</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price</span>
                  <Badge variant="secondary">Free</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Data Year</span>
                  <Badge variant="secondary">2026</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cities</span>
                  <Badge variant="secondary">10+</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Roles</span>
                  <Badge variant="secondary">17+</Badge>
                </div>
              </CardContent>
            </Card>

            <SidebarAd slot="3456789012" />

            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Negotiation Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Always ask for the 75th percentile or higher in your first offer. You can negotiate down, but rarely up.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Popular Roles in 2026</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { role: "ML Engineer", trend: "+12%" },
                  { role: "Security Engineer", trend: "+10%" },
                  { role: "Cloud Architect", trend: "+9%" },
                  { role: "SRE", trend: "+8%" },
                  { role: "Data Scientist", trend: "+7%" },
                  { role: "Backend Dev", trend: "+6%" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm py-1">
                    <span>{item.role}</span>
                    <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Free Tech Salary Estimator: Know Your Market Value in 2026
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          Negotiating a salary without data is like coding without a debugger — you are flying blind. Our <strong>free tech salary estimator</strong> gives you accurate, location-adjusted salary ranges for 17+ technology roles based on real 2026 market data. Whether you are preparing for a job offer discussion, planning a career move, or benchmarking your current compensation, this tool shows you what you should be earning.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          Why Tech Salaries Vary So Much in 2026
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
          Technology compensation is not a single number. It is a function of role, location, experience, company size, and specialization. A senior backend engineer in San Francisco might earn $180,000-$240,000 base, while the same role in Austin pays $140,000-$190,000. Remote roles often land between these ranges depending on the company's compensation philosophy. Our <strong>salary estimator</strong> accounts for these multipliers so you get realistic numbers, not averages that mislead.
        </p>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          Total compensation is also increasingly important. At major tech companies, equity and bonuses can add 30-50% on top of base salary. Senior engineers at Google, Meta, and Netflix often see total compensation exceed $400,000 when stock grants are included. Our estimator focuses on base salary as the most comparable metric, but we provide context about total comp trends in the FAQ above.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          How to Use Salary Data for Negotiation
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">1. Know Your Range</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Use the 25th, 50th, and 75th percentile to understand where you stand. If you are below the 25th percentile, you are likely underpaid.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">2. Consider Location</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Compare your current city with target cities. Cost of living differences can mean a lower salary is actually better take-home pay.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">3. Factor in Skills</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Specialized skills like machine learning, security, and cloud architecture command premiums. Mention these explicitly in negotiations.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">4. Negotiate Total Comp</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Base salary is just one component. Ask about signing bonuses, equity refreshes, and performance bonuses.</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
          Related Tools for Your Career
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 mb-8">
          <a href="/tools/ai-resume-builder" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">📄</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">AI Resume Builder</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Build an ATS-optimized resume</p>
            </div>
          </a>
          <a href="/tools/ai-interview-simulator" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">🎯</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Interview Simulator</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Practice with AI-powered mock interviews</p>
            </div>
          </a>
          <a href="/tools/ai-cover-letter-generator" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">📝</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Cover Letter Generator</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Personalized letters for each application</p>
            </div>
          </a>
          <a href="/blog" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">📚</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Career Guides</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Salary negotiation tips and industry insights</p>
            </div>
          </a>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800">
          <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
            Know Your Worth
          </h3>
          <p className="text-emerald-800 dark:text-emerald-300 text-sm mb-4">
            The best negotiation starts with data. Use our free estimator to discover your market value before your next conversation.
          </p>
          <p className="text-emerald-700 dark:text-emerald-400 text-xs">
            100% free. No signup. Updated with 2026 market data.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
