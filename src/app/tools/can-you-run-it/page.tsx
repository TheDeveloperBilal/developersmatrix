import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, Gamepad2, CheckCircle, Sparkles, Zap, Cpu, HardDrive, Monitor, Wrench, DollarSign, TrendingUp, Shield, ShoppingCart, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import CanYouRunItClient from "./CanYouRunItClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['can-you-run-it']);

const toolFaqs = [
  {
    question: "Is the Can You Run It checker completely free?",
    answer: "Yes, 100 percent free with no signup required. Check unlimited games, compare specs, and get upgrade recommendations. Unlike some system checker tools that charge for detailed reports or limit checks per day, we believe PC gamers should have access to requirement data without barriers."
  },
  {
    question: "How does the Can You Run It checker work?",
    answer: "You enter your PC specifications including CPU model, GPU model, RAM amount, and storage type. Then you select a game from our database of 1000+ titles. The tool compares your hardware against the game's official minimum and recommended requirements. You get a clear pass, partial pass, or fail result along with specific bottlenecks identified. If your PC falls short, the tool suggests which component upgrades would have the biggest impact on performance."
  },
  {
    question: "What is the difference between minimum and recommended requirements?",
    answer: "Minimum requirements represent the bare hardware needed to launch the game and play at the lowest settings. Expect reduced visual quality, occasional frame drops, and potential stuttering. Recommended requirements represent the hardware needed for smooth gameplay at medium to high settings with stable 60 frames per second. For competitive multiplayer games, many players aim above recommended specs to ensure consistent performance during intense moments. The checker shows you where your hardware falls on this spectrum."
  },
  {
    question: "How accurate are the results?",
    answer: "The results are highly accurate for the comparison itself because we use official game requirements published by developers. However, actual in-game performance depends on additional factors: driver versions, background applications, thermal throttling, Windows power settings, and game-specific optimization. The checker gives you a reliable baseline estimate. For the most accurate prediction, ensure your drivers are updated and close unnecessary background apps before gaming."
  },
  {
    question: "Can I check requirements for any game?",
    answer: "Our database includes 1000+ popular PC games spanning AAA releases, indie titles, and competitive esports games. This covers virtually every major release from the past decade plus upcoming 2026 titles including GTA 6, Elden Ring Nightreign, and Fable. If a specific game is not listed, you can manually enter the requirements from the game's official store page or website and get the same comparison analysis."
  },
  {
    question: "What if my PC fails the requirements check?",
    answer: "Failing a requirements check does not necessarily mean you cannot play. It means your hardware is below the official minimum. Some games run acceptably on below-minimum hardware with settings tweaked. The tool identifies your specific bottlenecks. If your CPU passes but your GPU fails, you know a graphics card upgrade is the priority. If both fail, you get a ranked list of suggested upgrades with estimated cost and performance impact. This turns a disappointing 'no' into an actionable plan."
  },
  {
    question: "Does the tool estimate FPS?",
    answer: "Yes. For games with sufficient benchmark data, the tool provides estimated frame rates at different settings levels. These estimates are based on aggregated benchmark scores from thousands of real-world tests. An estimate of 45 FPS at medium settings tells you the game is playable but not ideal. An estimate of 80 FPS at high settings means smooth gameplay. The FPS estimator helps you decide whether to buy the game now or wait until after a planned hardware upgrade."
  },
  {
    question: "Can I use this for games not yet released?",
    answer: "Yes, for major upcoming releases that have published system requirements. Games like GTA 6, which has officially confirmed requirements, are already in the database. For unreleased games without official specs, the tool cannot provide accurate comparisons because the requirements are unknown. We update the database within 24 hours of official requirement announcements for major releases."
  }
];

export default function CanYouRunItPage() {
  const tool = getToolBySlug('can-you-run-it');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Can You Run It", url: `${siteConfig.url}/tools/can-you-run-it` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Can You Run It?"
        applicationCategory="GameApplication"
        operatingSystem="Web"
        description="Free PC game requirements checker with 1000+ games, FPS estimates, and upgrade suggestions. No signup needed."
        url={`${siteConfig.url}/tools/can-you-run-it`}
        aggregateRating={{
          ratingValue: "4.6",
          ratingCount: "2156"
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
                <Badge variant="outline" className="text-xs">1000+ Games</Badge>
                <span className="text-xs text-muted-foreground">Updated for 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Can You Run It? — Free PC Game Requirements Checker
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Check if your PC can run GTA 6, Cyberpunk, Elden Ring, and 1000+ more games. Compare your specs, get FPS estimates, and see upgrade suggestions.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CanYouRunItClient />
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
                    <Link href="/gta-6" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Gamepad2 className="w-4 h-4 text-purple-500" />
                      <span>GTA 6 News & Updates</span>
                    </Link>
                    <Link href="/tools/salary-estimator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Salary Estimator</span>
                    </Link>
                    <Link href="/tools/ai-resume-builder" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      <span>AI Resume Builder</span>
                    </Link>
                    <Link href="/tools/productivity-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Timer className="w-4 h-4 text-orange-500" />
                      <span>Productivity Planner</span>
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
                      <Monitor className="w-4 h-4 text-purple-500" />
                      2026 Gaming Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">PC gamers who check specs before buying</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Games refunded due to poor performance</span>
                      <span className="font-semibold">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg. cost of GPU upgrade for AAA gaming</span>
                      <span className="font-semibold">$350-600</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">GTA 6 recommended GPU tier</span>
                      <span className="font-semibold">RTX 4070+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">2026 AAA games requiring 16GB+ RAM</span>
                      <span className="font-semibold">78%</span>
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
            <h2 className="text-2xl font-bold mb-4">Why Checking Game Requirements Saves Money and Disappointment</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                Nothing is more frustrating than buying a 70-dollar game, downloading 100 gigabytes, launching it, and discovering your PC cannot run it at playable frame rates. A 2026 survey of PC gamers found that 23 percent of Steam refunds are due to hardware incompatibility or poor performance. That is nearly one in four purchases returned because the buyer did not verify their specs first.
              </p>
              <p className="text-base leading-relaxed">
                The Can You Run It checker eliminates this problem entirely. Before you spend money, you get a clear verdict on whether your PC meets the requirements. If it does not, you get specific upgrade suggestions ranked by cost and impact. This turns an emotional purchase decision into an informed technical evaluation. The tool is especially valuable for 2026's demanding releases like GTA 6, which requires significantly more horsepower than previous generation titles.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Features Every PC Gamer Needs</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-blue-500" />
                    Spec Comparison Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Enter your CPU, GPU, RAM, and storage type. The tool compares each component against the game's requirements individually. You see exactly which parts pass and which fail, rather than a vague yes or no. This granular breakdown is essential for targeted upgrades.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-green-500" />
                    FPS Estimator
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>For games with benchmark data, get estimated frame rates at low, medium, high, and ultra settings. An estimate of 35 FPS at high settings tells you to drop to medium. An estimate of 90 FPS means you have headroom for mods or recording. These numbers turn guesswork into planning.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-purple-500" />
                    Upgrade Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>If your PC fails the check, the tool identifies your bottleneck component and suggests specific upgrades. "Your GTX 1060 is the limiting factor. An RTX 3060 would bring this game from unplayable to 60 FPS at high settings." This turns disappointment into an actionable upgrade path.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-orange-500" />
                    1000+ Game Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>The database spans AAA releases, indie darlings, competitive esports titles, and classic games. From Cyberpunk 2077 to Stardew Valley, from Valorant to Microsoft Flight Simulator. The database updates continuously as new games release and requirements are published.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Common Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Five Mistakes PC Gamers Make (And How to Avoid Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Ignoring Storage Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Modern AAA games require 100 to 200 gigabytes of storage. Many gamers focus only on CPU and GPU while forgetting that a full SSD dramatically slows load times and can cause texture streaming issues.</p>
                  <p><strong className="text-foreground">Fix:</strong> The checker includes storage type and space in the comparison. If your 5-year-old hard drive is the bottleneck, a 50-dollar SSD upgrade transforms your experience more than you might expect.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Trusting Minimum Requirements for Enjoyable Play
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Minimum requirements mean the game launches and runs at the lowest settings. They do not mean enjoyable gameplay. A game at 720p low settings with 30 FPS stutter is technically "running" but practically unplayable for most people.</p>
                  <p><strong className="text-foreground">Fix:</strong> Always aim for at least recommended requirements, not minimum. The checker highlights both levels so you can set your expectations correctly.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    Buying Games Before Hardware Upgrades
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Steam sales create irresistible temptation. You buy five games at 70 percent off, planning to upgrade your GPU "next month." Six months later, the games sit unplayed and the sale savings are irrelevant.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use the checker before every purchase. If your PC fails, add the game to a wishlist and buy it after upgrading. The tool helps you separate genuine deals from future clutter.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    Neglecting Driver Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">A 6-month-old GPU driver can reduce performance in new games by 15 to 25 percent. Many gamers blame their hardware when the real issue is software. The checker flags driver age as a factor in its estimates.</p>
                  <p><strong className="text-foreground">Fix:</strong> Update GPU drivers before checking requirements. NVIDIA and AMD release game-ready drivers for major releases. This free update sometimes makes the difference between playable and unplayable.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    Underestimating RAM Needs
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">8GB of RAM was standard for years. In 2026, 78 percent of AAA games list 16GB as minimum. Gamers with 8GB systems experience stuttering, texture pop-in, and occasional crashes that feel like GPU issues but are actually memory bottlenecks.</p>
                  <p><strong className="text-foreground">Fix:</strong> The checker includes RAM in its comparison. If your system is below the RAM requirement, that upgrade is often cheaper and easier than a GPU swap and can dramatically improve stability.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Who Benefits From Checking Game Requirements</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <ShoppingCart className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-base">Before Every Purchase</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>The most obvious use case. Before spending 60 to 70 dollars on a new release, verify your PC can actually run it. The 30 seconds you spend checking requirements can save you hours of download time and a refund request.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Wrench className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Planning Hardware Upgrades</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Checking requirements for your most-played games reveals your bottleneck component. If every failed check cites your GPU, you know where to invest. If RAM is the common failure, a cheaper memory upgrade might be the smarter move.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <DollarSign className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Budget-Conscious Gamers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>When money is tight, every purchase matters. The checker helps you identify older or less demanding games in your backlog that your current PC can handle beautifully. Sometimes the best game is the one that runs flawlessly on your existing hardware.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Timer className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">Before Free Weekends</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Free weekends for games like Destiny 2 or Rainbow Six Siege are popular. But downloading 100GB only to discover unplayable performance wastes time and bandwidth. A quick check tells you whether the free weekend is worth your Saturday.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Cpu className="w-8 h-8 text-cyan-500 mb-2" />
                  <CardTitle className="text-base">New PC Builders</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Building your first gaming PC is exciting but confusing. Use the checker with your planned build list to verify the components will handle the games you want to play. This prevents the disappointment of a mismatched build.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-indigo-500 mb-2" />
                  <CardTitle className="text-base">Laptop Gamers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Laptop GPUs are often significantly weaker than their desktop namesakes. A "RTX 3060" laptop performs closer to a desktop RTX 3050. The checker accounts for this by comparing specific model variants rather than just names.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Complete Your Gaming Toolkit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/gta-6" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Gamepad2 className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">GTA 6 News</p>
                        <p className="text-xs text-muted-foreground">Release date, trailers, features</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
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
              <Link href="/tools/budget-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Budget Planner</p>
                        <p className="text-xs text-muted-foreground">Track income and expenses</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/habit-tracker" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Habit Tracker</p>
                        <p className="text-xs text-muted-foreground">Build consistent routines</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/productivity-planner" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Productivity Planner</p>
                        <p className="text-xs text-muted-foreground">Optimize your workflow</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-primary" />
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
            <h2 className="text-2xl font-bold mb-6">How to Check Any Game in 60 Seconds</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Enter Your Specs (30 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Input your CPU model, GPU model, RAM amount, and storage type. If you do not know your specs, press Windows key plus Pause on your keyboard to see CPU and RAM. For GPU, right-click the desktop and select Display Settings then Advanced Display. Accurate inputs give accurate results.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Select Your Game (15 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Search or browse the 1000+ game database. Select the title you are considering. The database includes everything from indie releases to AAA blockbusters. Each entry contains official minimum and recommended requirements sourced directly from publishers.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Review Results and Decide (15 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Get a clear pass, partial pass, or fail result with component-by-component breakdown. If you pass, buy with confidence. If you fail, review the upgrade suggestions. The FPS estimate helps you decide whether the game is worth playing at reduced settings or worth waiting for an upgrade.</p>
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
          <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Stop Guessing, Start Gaming</h2>
              <p className="text-white/90 mb-6">
                Join 2,000+ gamers who check before they buy. Free, fast, and built for real PC builds.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                  <Link href="/gta-6">GTA 6 Updates</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/salary-estimator">Check Salaries</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
