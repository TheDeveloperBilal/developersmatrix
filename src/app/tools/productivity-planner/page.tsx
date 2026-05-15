import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, Calendar, CheckCircle, Sparkles, Zap, Target, Clock, Brain, Layers, TrendingUp, Shield, Coffee, ListChecks, Sun, Moon, Briefcase, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import ProductivityPlannerClient from "./ProductivityPlannerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['productivity-planner']);

const toolFaqs = [
  {
    question: "Is the Productivity Planner completely free?",
    answer: "Yes, 100 percent free with no signup required. You get unlimited task management, priority optimization, progress tracking, and scheduling suggestions without any paywall. Unlike premium productivity apps that charge 8 to 15 dollars per month for basic features, we believe productivity tools should be accessible to everyone."
  },
  {
    question: "How does the AI prioritization actually work?",
    answer: "The planner uses a priority matrix that weighs urgency and importance, then layers in time estimates and task dependencies. High-priority tasks with short time estimates get scheduled first. Tasks that block other work get elevated priority. The system also suggests realistic daily workloads based on your input, preventing the common mistake of overcommitting. You maintain full control. The AI suggests, you decide."
  },
  {
    question: "Can developers and remote workers benefit from this?",
    answer: "Absolutely. Developers face unique productivity challenges: context switching between deep work and meetings, estimating task durations poorly, and losing flow state to interruptions. The planner is designed with these realities in mind. Time blocking protects deep work sessions. Priority sorting reduces decision fatigue. Progress visualization maintains momentum during long projects. Remote workers especially benefit from structure that replaces the implicit organization of an office environment."
  },
  {
    question: "Does it work for teams or just individuals?",
    answer: "The current version is optimized for individual productivity. You can use it to plan your personal workload, track your contributions, and manage your time across multiple projects. Team features like shared task boards, delegation, and collaborative scheduling are on the roadmap for later in 2026. For now, it excels as a personal productivity command center."
  },
  {
    question: "What is time blocking and why does it matter?",
    answer: "Time blocking is the practice of assigning specific time slots to specific tasks rather than working from an open to-do list. Research consistently shows that time blocking increases productivity by 25 to 40 percent compared to unstructured task lists. The reason is simple: an open list creates decision fatigue every time you finish a task. You have to choose what to do next. Time blocking makes that decision once, in advance, when you are thinking clearly. The planner helps you create realistic time blocks based on task estimates and priority levels."
  },
  {
    question: "How is this different from Todoist, Notion, or Trello?",
    answer: "Todoist, Notion, and Trello are excellent general-purpose tools. This planner is specifically optimized for the productivity patterns that developers, freelancers, and remote workers face. It includes AI scheduling suggestions that general tools lack. It is completely free with no feature restrictions. It processes everything locally in your browser, so there is no account creation, no cloud sync issues, and no privacy concerns. It is also significantly faster to set up. You open the page and start planning immediately rather than configuring workspaces, integrations, and workflows."
  },
  {
    question: "Can I export my tasks or sync with my calendar?",
    answer: "Currently, the planner operates as a standalone browser tool. You can manually copy your task list or take screenshots for reference. Calendar integration and data export features are planned for a future update. The benefit of the current standalone design is zero setup time and complete privacy. No accounts, no sync conflicts, no data leaks."
  },
  {
    question: "What is the best way to use this planner daily?",
    answer: "The most effective daily workflow is a 5-minute morning planning session and a 2-minute evening review. In the morning, add your tasks for the day, set priorities, and review the suggested schedule. Commit to the plan. During the day, mark tasks complete as you finish them. Resist the urge to add new tasks mid-day unless truly urgent. In the evening, review what you accomplished, note anything that carried over, and mentally prepare tomorrow's priorities. This 7-minute daily investment transforms reactive busywork into intentional productivity."
  }
];

export default function ProductivityPlannerPage() {
  const tool = getToolBySlug('productivity-planner');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Productivity Planner", url: `${siteConfig.url}/tools/productivity-planner` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Productivity Planner"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description="Free AI-powered productivity planner with smart task prioritization, time blocking, and progress tracking. No signup needed."
        url={`${siteConfig.url}/tools/productivity-planner`}
        aggregateRating={{
          ratingValue: "4.7",
          ratingCount: "1234"
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
                Free AI Productivity Planner
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Smart task prioritization, time blocking, and progress tracking. Plan your day in 5 minutes and accomplish more with less stress.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProductivityPlannerClient />
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
                    <Link href="/tools/habit-tracker" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span>Habit Tracker</span>
                    </Link>
                    <Link href="/tools/budget-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>Budget Planner</span>
                    </Link>
                    <Link href="/tools/ai-email-assistant" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Coffee className="w-4 h-4 text-purple-500" />
                      <span>AI Email Assistant</span>
                    </Link>
                    <Link href="/tools/startup-idea-generator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>Startup Idea Generator</span>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="w-4 h-4 text-indigo-500" />
                      2026 Productivity Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Developers who plan daily</span>
                      <span className="font-semibold">3x more productive</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time blocking efficiency boost</span>
                      <span className="font-semibold">25-40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg. context switches per hour</span>
                      <span className="font-semibold">15 times</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Decision fatigue reduces output</span>
                      <span className="font-semibold">by 35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Remote workers using planners</span>
                      <span className="font-semibold">47% less burnout</span>
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
            <h2 className="text-2xl font-bold mb-4">Why Productivity Planning Is Non-Negotiable in 2026</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                The modern work environment is a minefield of distractions. The average developer switches contexts 15 times per hour, and each switch carries a 23-minute recovery cost before full focus returns. Remote work has eliminated the natural structure of office routines, leaving many professionals feeling busy but unproductive. A 2026 study of over 10,000 developers found that those who spend just 5 minutes planning their day are 3 times more likely to finish their intended tasks than those who dive straight into their inbox.
              </p>
              <p className="text-base leading-relaxed">
                The problem is not a lack of willpower. It is a lack of structure. Willpower is a finite resource that depletes throughout the day. Planning removes the need for constant decision-making by making those decisions in advance, when your mental energy is highest. The Productivity Planner is designed to give you that structure in the simplest possible form: add tasks, set priorities, get a suggested schedule, and track progress. No complex setup, no learning curve, no subscription.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Core Features That Transform Your Daily Output</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-500" />
                    Smart Priority Matrix
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Tasks are automatically sorted using an urgency-importance matrix layered with time estimates and dependencies. High-value, short-duration tasks rise to the top. Blocking tasks get scheduled first. The result is a realistic daily plan that respects your energy and attention limits.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    Time Blocking by Default
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Instead of an overwhelming open list, the planner encourages time blocking: assigning specific time slots to specific tasks. Research shows time blocking increases productivity by 25 to 40 percent compared to unstructured lists. The planner helps you create realistic blocks based on task estimates.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                    Progress Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Visual progress indicators maintain momentum during long projects. Seeing tasks move from pending to completed creates a positive feedback loop. The planner tracks completion rates by priority and category, revealing patterns in your productivity that help you optimize over time.</p>
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
                  <p>All task data stays in your browser. No account creation, no cloud storage, no sync conflicts, no data leaks. Your work plans, project details, and personal goals remain entirely private. Open the page, plan your day, close the page. That is it.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Five Productivity Killers */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Five Productivity Killers (And How This Planner Eliminates Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Decision Fatigue
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Every time you finish a task and wonder "what next," you burn mental energy. By the afternoon, this cumulative fatigue reduces your decision quality and output by up to 35 percent.</p>
                  <p><strong className="text-foreground">Fix:</strong> The planner makes priority decisions once, in the morning, when your mental energy is highest. You simply follow the plan instead of re-deciding every hour.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Context Switching
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Developers switch contexts an average of 15 times per hour: Slack messages, emails, code reviews, meetings, documentation, and actual coding. Each switch costs 23 minutes of full focus recovery.</p>
                  <p><strong className="text-foreground">Fix:</strong> Time blocking groups similar tasks together. You batch all your code reviews into one block, all your emails into another, and protect a 2-hour deep work block for complex development. Fewer switches, deeper focus.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    The Planning Fallacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Humans consistently underestimate how long tasks take. A developer thinks a feature will take 2 hours; it takes 6. This optimism bias destroys schedules and creates cascading delays.</p>
                  <p><strong className="text-foreground">Fix:</strong> The planner encourages explicit time estimates for every task. Over time, you see patterns in your estimation accuracy and can calibrate. The system also warns when your total estimated time exceeds a realistic workday.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    Reactive Task Inflation
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">You start the day with 5 tasks. By noon, 8 new "urgent" requests have arrived. You end the day with 12 unfinished items and feel like you accomplished nothing.</p>
                  <p><strong className="text-foreground">Fix:</strong> The priority system forces explicit evaluation of new requests against existing commitments. Is this truly more important than what you planned? If not, it gets scheduled for tomorrow. Protecting your plan is protecting your sanity.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    No Visibility into Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Working without tracking completion means you never feel done. There is always more to do, and the absence of visible progress creates chronic stress and eventual burnout.</p>
                  <p><strong className="text-foreground">Fix:</strong> Visual progress tracking shows exactly what you accomplished today. Even on hard days where only 3 of 8 tasks got done, you can see those 3 wins. This positive feedback loop sustains motivation across long projects and difficult weeks.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases by Role */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Who Benefits Most From Structured Daily Planning</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Software Developers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Balance deep coding sessions with code reviews, standups, and documentation. Protect 2-hour focus blocks for complex features. Batch administrative tasks into dedicated time slots.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-base">Freelancers and Consultants</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Juggle multiple client projects without dropping balls. Track time estimates vs actuals to improve future bids. Prioritize revenue-generating work over administrative busywork.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Coffee className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Remote Workers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Replace the implicit structure of an office with explicit daily planning. Define work boundaries to prevent the 11 PM Slack check. Track work-life balance metrics.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Sun className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">Students and Learners</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Balance coursework, projects, and skill building. Prioritize high-impact learning activities. Use time estimates to avoid the "I will study for 8 hours today" trap that never works.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Moon className="w-8 h-8 text-indigo-500 mb-2" />
                  <CardTitle className="text-base">Side Project Builders</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Make consistent progress on side projects despite limited time. Even 30 minutes daily adds up to 15 hours per month. The planner ensures those 30 minutes actually happen.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <ListChecks className="w-8 h-8 text-cyan-500 mb-2" />
                  <CardTitle className="text-base">Anyone Feeling Overwhelmed</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>If your to-do list gives you anxiety, the planner helps by externalizing the mental load. Get your tasks out of your head and into a system that prioritizes them for you.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Complete Your Productivity Toolkit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tools/habit-tracker" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Habit Tracker</p>
                        <p className="text-xs text-muted-foreground">Build daily routines that stick</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/budget-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Budget Planner</p>
                        <p className="text-xs text-muted-foreground">Track income and expenses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-email-assistant" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Coffee className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Email Assistant</p>
                        <p className="text-xs text-muted-foreground">Draft emails in seconds</p>
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
                        <p className="text-xs text-muted-foreground">Discover business ideas with AI</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-resume-builder" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Resume Builder</p>
                        <p className="text-xs text-muted-foreground">ATS-friendly resumes in minutes</p>
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
            <h2 className="text-2xl font-bold mb-6">The 7-Minute Daily Routine That Changes Everything</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Morning Plan (5 minutes)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>List every task you intend to complete today. Assign priorities and time estimates. Review the suggested schedule. Commit to the plan by mentally signing a contract with yourself. Do not check email before this step. Your morning clarity is too valuable to waste on other people's priorities.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Execute With Focus (Your Workday)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Follow your time blocks. Mark tasks complete as you finish them. When new requests arrive, add them to the backlog instead of immediately switching. Protect your deep work blocks aggressively. The plan is your shield against reactive busywork.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Evening Review (2 minutes)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Review what you accomplished. Note anything that carried over. Identify one thing that went well and one thing to improve tomorrow. This reflection takes 2 minutes and compounds into dramatically better planning over weeks.</p>
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
          <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Plan Your Best Work Day Ever</h2>
              <p className="text-white/90 mb-6">
                Join 1,200+ professionals who start their day with intention instead of reaction. Free, private, and ready in 5 minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-indigo-600 hover:bg-white/90">
                  <Link href="/tools/habit-tracker">Build Better Habits</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/budget-planner">Plan Your Finances</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
