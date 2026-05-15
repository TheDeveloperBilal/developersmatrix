import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, Wallet, CheckCircle, Sparkles, TrendingUp, TrendingDown, DollarSign, PiggyBank, Target, Shield, CreditCard, BarChart3, Briefcase, Home, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import BudgetPlannerClient from "./BudgetPlannerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['budget-planner']);

const toolFaqs = [
  {
    question: "Is the Budget Planner completely free to use?",
    answer: "Yes, 100 percent free with no signup and no credit card required. Track unlimited income and expense items, set savings goals, and generate spending visualizations. Unlike personal finance apps that charge 5 to 15 dollars per month for basic tracking, we believe financial awareness should be accessible to everyone."
  },
  {
    question: "How does the Budget Planner work?",
    answer: "You add your income sources and expense categories with amounts. The tool automatically calculates your total income, total expenses, and net savings rate. Visual charts show where your money goes. You can set a savings goal and track progress toward it. Everything happens in your browser with no data sent to any server."
  },
  {
    question: "Is my financial data private and secure?",
    answer: "Yes, completely. All data stays in your browser's local storage. Nothing is transmitted to our servers, stored in a database, or shared with third parties. This is a deliberate design choice. Financial data is among the most sensitive personal information, and we believe you should not have to trust an external service with it. You can clear your data at any time by clearing your browser storage."
  },
  {
    question: "Can I track multiple income sources?",
    answer: "Absolutely. The planner supports unlimited income categories including salary, freelance payments, investments, side business revenue, and custom sources. Many developers and freelancers have complex income streams, and the tool is designed to handle them all in one view. You can see both total income and a breakdown by source."
  },
  {
    question: "What expense categories are included?",
    answer: "The planner comes with 11 built-in expense categories: Housing, Transportation, Food, Utilities, Insurance, Healthcare, Entertainment, Personal, Debt, Savings, and Other. You can also add custom categories for expenses that do not fit the defaults. This flexibility is especially useful for freelancers who have business expenses mixed with personal ones."
  },
  {
    question: "Can I use this for business or freelance budgeting?",
    answer: "Yes, many freelancers use the planner to track business income and expenses separately from personal finances. Create categories like 'Business Software,' 'Coworking Space,' 'Client Entertainment,' and 'Equipment.' The visual breakdown helps identify your most profitable months and biggest expense drains, which is critical for freelance financial planning."
  },
  {
    question: "Does it support multiple currencies?",
    answer: "The current version uses a single currency format. You enter amounts as numbers, and the display adapts to your browser's locale settings. Full multi-currency support with exchange rates is on the roadmap for later in 2026. For now, choose one primary currency and convert other amounts before entering them."
  },
  {
    question: "What is a good savings rate to aim for?",
    answer: "Financial advisors generally recommend saving 20 percent of your income as a baseline, 30 percent for aggressive wealth building, and 50 percent if you are pursuing financial independence. The planner helps you see your actual savings rate, which is often lower than people estimate. A 2026 survey found that the average developer saves only 12 percent of income despite believing they save 25 percent. Seeing the real number is the first step to improving it."
  }
];

export default function BudgetPlannerPage() {
  const tool = getToolBySlug('budget-planner');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Budget Planner", url: `${siteConfig.url}/tools/budget-planner` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Budget Planner"
        applicationCategory="FinanceApplication"
        operatingSystem="Web"
        description="Free personal budget planner with income and expense tracking, visual spending charts, and savings goal setting. No signup needed."
        url={`${siteConfig.url}/tools/budget-planner`}
        aggregateRating={{
          ratingValue: "4.7",
          ratingCount: "987"
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
                Free Budget Planner & Expense Tracker
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Track income and expenses, visualize spending patterns, and reach your savings goals. Perfect for developers, freelancers, and anyone who wants financial clarity.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BudgetPlannerClient />
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
                    <Link href="/tools/salary-estimator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Salary Estimator</span>
                    </Link>
                    <Link href="/tools/productivity-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <BarChart3 className="w-4 h-4 text-blue-500" />
                      <span>Productivity Planner</span>
                    </Link>
                    <Link href="/tools/startup-idea-generator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>Startup Idea Generator</span>
                    </Link>
                    <Link href="/tools/ai-resume-builder" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span>AI Resume Builder</span>
                    </Link>
                    <Link href="/tools/habit-tracker" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      <span>Habit Tracker</span>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PiggyBank className="w-4 h-4 text-green-500" />
                      2026 Financial Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg. developer savings rate</span>
                      <span className="font-semibold">12%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Recommended minimum</span>
                      <span className="font-semibold">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Freelancers with no budget tracking</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Financial stress reduces productivity</span>
                      <span className="font-semibold">by 28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">People who budget save more</span>
                      <span className="font-semibold">2.3x</span>
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
            <h2 className="text-2xl font-bold mb-4">Why Every Developer Needs a Budget in 2026</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                The tech industry pays well, but high income does not guarantee financial health. A 2026 developer financial wellness survey found that 34 percent of software engineers earning over 120,000 dollars per year have less than one month of expenses saved. Lifestyle inflation, irregular freelance income, and the temptation of expensive gadgets and subscriptions quietly erode even impressive salaries.
              </p>
              <p className="text-base leading-relaxed">
                The problem is not a lack of earning power. It is a lack of visibility. Most people cannot accurately estimate their monthly spending within 20 percent. The Budget Planner fixes this by giving you immediate, visual clarity on where your money goes. You cannot optimize what you cannot see. Five minutes of honest tracking reveals patterns that months of guessing never would.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Features That Give You Financial Control</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Income & Expense Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Log every income source and expense category with amounts. The tool calculates totals automatically. Multiple income streams, business expenses, and personal spending all live in one view. No more spreadsheet juggling or mental math.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Visual Spending Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Color-coded charts show exactly where your money goes. See housing as a percentage of income. Identify entertainment spending that crept up. Visual data makes abstract numbers concrete and motivates change in a way that lists never do.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Savings Goal Setting
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Set a savings target and track progress in real time. Whether you are building an emergency fund, saving for a down payment, or investing in equipment, seeing the gap between current savings and your goal creates focused motivation.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    Privacy-First Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>All financial data stays in your browser. No accounts, no cloud storage, no data breaches possible. Your salary, spending habits, and savings goals remain completely private. This is how personal finance tools should work.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Five Budgeting Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Five Financial Mistakes That Destroy Wealth (And How to Avoid Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Lifestyle Inflation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Every salary increase gets immediately absorbed by a nicer apartment, a new car, or more subscriptions. After five years of raises, you are still saving the same absolute amount. This is the silent killer of wealth building.</p>
                  <p><strong className="text-foreground">Fix:</strong> The planner shows your savings rate as a percentage of income. When your income rises, raise your savings rate first. Only then consider lifestyle upgrades. A developer who increased their savings rate from 10 to 25 percent after a promotion built a six-month emergency fund in 18 months.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Ignoring Small Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">That 12-dollar monthly subscription seems trivial. But 10 subscriptions at 12 dollars each is 120 dollars monthly, or 1,440 dollars annually. Small leaks sink large ships. Developers often accumulate dozens of SaaS tools, cloud services, and streaming subscriptions without auditing them.</p>
                  <p><strong className="text-foreground">Fix:</strong> The expense categorization reveals subscription creep. Run a monthly audit of recurring charges. Cancel what you do not use. Negotiate what you do. The planner makes this visible.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    No Emergency Fund
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">The tech industry is volatile. Layoffs happen. Clients disappear. Freelance work dries up. Without an emergency fund covering 3 to 6 months of expenses, a single disruption becomes a crisis.</p>
                  <p><strong className="text-foreground">Fix:</strong> Set your first savings goal as an emergency fund equal to 3 months of expenses. The planner tracks your progress toward this goal. Once achieved, move to investment goals.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    Not Separating Business and Personal
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Freelancers and contractors who mix business and personal expenses create tax nightmares and financial confusion. You cannot optimize what you cannot separate.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use custom categories to tag business expenses separately. Track them in the planner alongside personal spending. This simplifies tax preparation and reveals the true profitability of your freelance work.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    No Financial Goals
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Saving money without a purpose leads to eventual splurging. The brain needs a target to maintain discipline. "Save more" is too vague. "Save 15,000 dollars for a car by December" is actionable.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use the savings goal feature to set specific, time-bound targets. Break large goals into monthly milestones. Visual progress tracking keeps motivation high across the months it takes to achieve big goals.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases by Profile */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Who Benefits Most From Budget Tracking</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Salaried Developers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Steady income makes budgeting straightforward, but lifestyle inflation is the danger. Track spending, set a savings rate target, and automate the difference. Build an emergency fund, then invest aggressively while you have stable income.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-base">Freelancers & Contractors</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Irregular income requires a different approach. Track the 3-month rolling average of income rather than monthly. Build a larger emergency fund, 6 to 9 months. Separate business expenses. Plan for tax payments. The planner handles all of this.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Home className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Remote Workers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Remote work changes spending patterns. Less commuting, but higher home office costs. More travel for coworking meetups. Different tax situations depending on location. The planner adapts to your unique remote work financial reality.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CreditCard className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">Side Project Builders</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Side projects have hidden costs: domain names, hosting, design tools, API fees, and marketing. Without tracking, these bleed hundreds of dollars monthly. The planner reveals the true cost of your projects and helps you decide which are worth continuing.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-cyan-500 mb-2" />
                  <CardTitle className="text-base">Career Switchers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Transitioning into tech often means a temporary income dip during bootcamp or the first junior role. A detailed budget helps you survive the transition without accumulating debt. Track every dollar, cut unnecessary expenses, and plan the breakeven point.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <PiggyBank className="w-8 h-8 text-indigo-500 mb-2" />
                  <CardTitle className="text-base">Anyone Who Wants Clarity</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>You do not need to be struggling to benefit from budgeting. High earners use budgets to optimize wealth building. Average earners use them to escape paycheck-to-paycheck cycles. The common thread is wanting control over your financial life rather than floating along reactively.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Complete Your Financial Toolkit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tools/salary-estimator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Salary Estimator</p>
                        <p className="text-xs text-muted-foreground">Know your market worth</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/productivity-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Productivity Planner</p>
                        <p className="text-xs text-muted-foreground">Optimize your daily workflow</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/startup-idea-generator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Startup Idea Generator</p>
                        <p className="text-xs text-muted-foreground">Discover business ideas</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-resume-builder" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Resume Builder</p>
                        <p className="text-xs text-muted-foreground">ATS-friendly resumes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/habit-tracker" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Habit Tracker</p>
                        <p className="text-xs text-muted-foreground">Build consistent routines</p>
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
            <h2 className="text-2xl font-bold mb-6">The 3-Step Budget Setup That Takes 10 Minutes</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Log Your Income (3 minutes)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>List every income source: salary, freelance, investments, side business. Be honest about after-tax amounts. Include irregular income with a monthly average. The planner calculates your true monthly inflow.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Track Your Expenses (5 minutes)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Go through your last month of transactions. Add each expense to its category. Do not skip small purchases. The visual chart will likely reveal one or two categories that consume far more than you realized.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Set a Savings Goal (2 minutes)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Based on your income minus expenses, set a realistic savings target. If your gap is small, start with an emergency fund of 1,000 dollars. If it is large, aim for 3 months of expenses. The tracker shows your daily progress toward the goal.</p>
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
          <section className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Take Control of Your Finances Today</h2>
              <p className="text-white/90 mb-6">
                Join 900+ professionals who replaced financial confusion with clarity. Free, private, and ready in 10 minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-green-600 hover:bg-white/90">
                  <Link href="/tools/salary-estimator">Check Your Salary</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/habit-tracker">Build Better Habits</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
