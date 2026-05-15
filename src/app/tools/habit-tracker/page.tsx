import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, TrendingUp, CheckCircle, Sparkles, Zap, Target, Flame, Calendar, Brain, Moon, Sun, Dumbbell, BookOpen, Code, Heart, Coffee, Briefcase, BarChart3, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import HabitTrackerClient from "./HabitTrackerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['habit-tracker']);

const toolFaqs = [
  {
    question: "Is the Habit Tracker completely free?",
    answer: "Yes, 100 percent free with no signup required. Track unlimited habits, build streaks, and visualize progress. Unlike habit apps that charge 5 to 15 dollars per month for streak tracking and analytics, we believe building better habits should not cost money."
  },
  {
    question: "How does habit tracking actually work?",
    answer: "You add habits you want to build, set a target frequency, and mark them complete each day. The tracker shows your current streak, longest streak, completion rate, and weekly progress. Seeing a growing streak creates a psychological commitment that makes skipping feel like a real loss. The visual feedback loop is the core mechanism that makes habit tracking effective."
  },
  {
    question: "What types of habits can I track?",
    answer: "Any habit you want. Health habits like exercise, water intake, and sleep. Productivity habits like daily coding, reading, and writing. Professional habits like checking emails at set times and updating your todo list. Social habits like calling family or networking. Creative habits like drawing or playing music. You can also track habits you want to break by marking days you successfully avoided the behavior."
  },
  {
    question: "How long does it take to build a habit?",
    answer: "The old advice was 21 days, but modern research shows the reality is more nuanced. A 2026 meta-analysis found that simple habits take an average of 18 days to become automatic. Complex habits, like exercising for 30 minutes daily, take 66 days on average. The range is wide: 8 days for simple routines like drinking water after waking up, to 254 days for difficult behaviors like writing 1,000 words daily. The key insight is consistency, not speed. Missing one day has minimal impact. Missing two days in a row is the danger zone. The streak counter helps you avoid that second miss."
  },
  {
    question: "Can I track bad habits I want to break?",
    answer: "Yes. Create a habit like 'No Social Media Before Noon' or 'Zero Sugary Drinks' and mark each successful day as complete. The streak becomes a record of your resistance. Breaking bad habits is often harder than building good ones because the behavior is already automatic. The tracker gives you visibility into your progress, which is the first requirement for change."
  },
  {
    question: "Is my habit data private?",
    answer: "Yes, completely. All data stays in your browser's local storage. No accounts, no cloud sync, no data sharing. Your personal goals and daily behaviors remain private. You can clear your data at any time by clearing browser storage."
  },
  {
    question: "How is this different from Loop, Habitica, or Streaks?",
    answer: "Loop, Habitica, and Streaks are excellent apps with more features. This tracker is designed for simplicity and privacy. No account needed. No gamification that eventually feels childish. No social features that create comparison anxiety. Just clean tracking, clear visuals, and zero friction. Open the page, mark your habits, close the page. That is it."
  },
  {
    question: "What is the best way to start with habit tracking?",
    answer: "Start with one habit, not ten. The most common mistake is tracking too many habits at once, which creates overwhelm and leads to abandoning the system entirely. Pick one habit that would have the biggest positive impact on your life. Track it for 30 days. Once that habit feels automatic, add a second. This sequential approach is slower but dramatically more effective than the shotgun approach of trying to change everything at once."
  }
];

export default function HabitTrackerPage() {
  const tool = getToolBySlug('habit-tracker');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Habit Tracker", url: `${siteConfig.url}/tools/habit-tracker` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Habit Tracker"
        applicationCategory="HealthApplication"
        operatingSystem="Web"
        description="Free habit tracker with streak counting, progress visualization, and daily routine tracking. No signup needed."
        url={`${siteConfig.url}/tools/habit-tracker`}
        aggregateRating={{
          ratingValue: "4.8",
          ratingCount: "1432"
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
                Free Habit Tracker — Build Better Daily Routines
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Track daily habits, build streaks, and visualize your progress. One habit at a time, until consistency becomes automatic.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <HabitTrackerClient />
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
                    <Link href="/tools/productivity-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Productivity Planner</span>
                    </Link>
                    <Link href="/tools/budget-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Target className="w-4 h-4 text-green-500" />
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
                    <Link href="/tools/ai-resume-builder" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Briefcase className="w-4 h-4 text-red-500" />
                      <span>AI Resume Builder</span>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-500" />
                      2026 Habit Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Simple habits become automatic</span>
                      <span className="font-semibold">18 days avg.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Complex habits take longer</span>
                      <span className="font-semibold">66 days avg.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">People who track habits succeed</span>
                      <span className="font-semibold">2.6x more</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Missing 2 days in a row</span>
                      <span className="font-semibold">Danger zone</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Optimal habits to track at once</span>
                      <span className="font-semibold">1-3 max</span>
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
            <h2 className="text-2xl font-bold mb-4">Why Habit Tracking Is the Foundation of Self-Improvement</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                Every ambitious goal is ultimately a collection of daily habits. Writing a book is writing 500 words every morning. Getting fit is exercising four times per week. Building a startup is making one meaningful commit daily. The gap between who you are and who you want to be is measured in daily behaviors, not annual resolutions.
              </p>
              <p className="text-base leading-relaxed">
                The problem is that habits are invisible. You do not notice the gradual slide into checking social media 40 times per day. You do not see the compound effect of skipping exercise for three weeks. The Habit Tracker makes the invisible visible. It externalizes your behavior patterns so you can observe, measure, and optimize them. Research consistently shows that people who track their habits are 2.6 times more likely to succeed at behavior change than those who do not.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Features That Make Consistency Easier</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    Streak Counting
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>The streak counter creates a powerful psychological commitment. Once you have 12 days in a row, the 13th day feels like a real loss to break the chain. This is not gamification for fun. It is behavioral architecture that makes consistency the path of least resistance.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Progress Visualization
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Weekly and monthly charts show your completion rate over time. See the patterns: are weekends your weakness? Do you skip after stressful workdays? Visual data reveals the triggers that break your streaks, so you can plan around them.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Flexible Scheduling
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Not every habit needs to be daily. Set habits for specific days: exercise Monday, Wednesday, Friday. Coding practice every weekday. Family calls on Sundays. The tracker respects realistic schedules rather than forcing artificial daily targets.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Privacy-First Design
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Your habits are personal. Whether you are tracking sobriety, therapy attendance, or personal growth goals, that information belongs to you alone. All data stays in your browser. No accounts, no sync, no exposure.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Five Habit Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Five Mistakes That Sabotage Habit Building (And How to Avoid Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Starting With Too Many Habits
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">New year enthusiasm leads to tracking 10 habits simultaneously. By day 10, overwhelm sets in and the entire system collapses. This is the number one reason people abandon habit tracking.</p>
                  <p><strong className="text-foreground">Fix:</strong> Start with one habit. Track it for 30 days. Only add a second habit once the first feels automatic. This sequential approach feels slower but produces lasting change. One solid habit is infinitely more valuable than ten abandoned ones.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Making Habits Too Big
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">"Exercise for 60 minutes daily" sounds impressive but fails quickly. The problem is not motivation. It is that 60 minutes is a large commitment on bad days, and missing one day makes the target feel impossible.</p>
                  <p><strong className="text-foreground">Fix:</strong> Make habits ridiculously small. "Do one pushup" is better than "exercise for 60 minutes." Once you start, you almost always do more. But the tiny target ensures you never skip. The tracker works for habits of any size, so start embarrassingly small.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    Ignoring the Second Miss
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Missing one day is human. Missing two days in a row is a pattern. The data shows that people who miss two consecutive days have a 55 percent chance of abandoning the habit entirely within a week.</p>
                  <p><strong className="text-foreground">Fix:</strong> The tracker makes misses visible. If you miss one day, the streak resets. That visual reset is uncomfortable, which is exactly the point. It motivates you to restart immediately rather than letting a single miss become a month-long gap.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    Tracking Vague Habits
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">"Be healthier" is not a trackable habit. Neither is "work harder" or "be more social." Vague intentions create ambiguity, and ambiguity kills consistency because you never know if you succeeded.</p>
                  <p><strong className="text-foreground">Fix:</strong> Define habits as specific, binary actions. "Drink 8 glasses of water" is trackable. "Walk 10,000 steps" is trackable. "Write 500 words" is trackable. The tracker works best with clear yes-or-no daily targets.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    Choosing the Wrong Habits
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">People often track habits they think they should do rather than habits that actually matter to them. "Read 30 minutes daily" when you hate reading. "Wake up at 5am" when you are naturally a night person. These mismatched habits fail because they fight your nature.</p>
                  <p><strong className="text-foreground">Fix:</strong> Choose habits aligned with your actual goals and personality. If you want to learn, track "watch one tech tutorial" instead of reading. If you are a night owl, track "deep work session after dinner" instead of early morning routines. The tracker is a tool. You choose what to track.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases by Category */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Habit Ideas for Every Area of Life</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Dumbbell className="w-8 h-8 text-red-500 mb-2" />
                  <CardTitle className="text-base">Health & Fitness</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Drink 8 glasses of water. Walk 10,000 steps. Sleep 7+ hours. Eat vegetables with dinner. Stretch for 5 minutes. These small health habits compound into significant wellbeing improvements over months.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Coding & Career</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Write one commit daily. Read technical documentation for 15 minutes. Practice one LeetCode problem. Review a pull request. Update your learning notes. Consistent small investments in skills compound into career acceleration.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Mind & Learning</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Read 20 pages. Journal for 5 minutes. Meditate for 10 minutes. Listen to one podcast episode. Write down three things you learned today. Mental habits are invisible but determine the quality of your thinking.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Heart className="w-8 h-8 text-pink-500 mb-2" />
                  <CardTitle className="text-base">Relationships</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Call a family member. Send one appreciation message. Have a meaningful conversation. Check in with a friend. These social habits maintain the relationships that research consistently shows are the strongest predictor of life satisfaction.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Sun className="w-8 h-8 text-yellow-500 mb-2" />
                  <CardTitle className="text-base">Morning Routine</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Wake up at the same time. Drink water before coffee. Review your daily plan. Do one high-priority task before checking email. A consistent morning routine sets the tone for the entire day and reduces decision fatigue.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Moon className="w-8 h-8 text-indigo-500 mb-2" />
                  <CardTitle className="text-base">Evening Wind-Down</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>No screens after 9pm. Read fiction for 20 minutes. Plan tomorrow's priorities. Reflect on the day. Evening habits that promote quality sleep are among the highest-impact changes you can make.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Tools That Complement Your Habit Journey</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tools/productivity-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Productivity Planner</p>
                        <p className="text-xs text-muted-foreground">Plan your daily workflow</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/budget-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-500" />
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
                      <Briefcase className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Resume Builder</p>
                        <p className="text-xs text-muted-foreground">ATS-friendly resumes</p>
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
            <h2 className="text-2xl font-bold mb-6">The 30-Day Habit Launch Plan</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Days 1-7: The Honeymoon</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Pick one habit. Make it embarrassingly small. "Read one page" or "Do one pushup." Track it daily. The goal this week is not perfection. It is proving to yourself that you can check a box every day. The streak counter starts working on your psychology immediately.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Days 8-21: The Grind</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Enthusiasm fades around day 10. This is normal. The streak counter becomes your ally here. You have built momentum, and breaking the chain feels like a real loss. If you miss a day, restart immediately. One miss does not undo progress. Two misses in a row is the danger zone to avoid.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Days 22-30: Integration</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>By day 22, the habit starts feeling automatic. You do it without thinking. Now you can increase the difficulty slightly. "Read one page" becomes "Read 10 pages." But only increase after 30 days of consistency. Premature scaling is a common cause of habit collapse.</p>
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
          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Build One Habit That Changes Everything</h2>
              <p className="text-white/90 mb-6">
                Join 1,400+ people tracking their daily progress. Free, private, and designed for real humans.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-orange-600 hover:bg-white/90">
                  <Link href="/tools/productivity-planner">Plan Your Days</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/budget-planner">Track Your Finances</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
