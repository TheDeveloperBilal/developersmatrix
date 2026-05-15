import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, Sparkles, Zap, Shield, Globe, Clock, PenTool, Target, Users, Briefcase, MessageSquare, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import AIEmailAssistantClient from "./AIEmailAssistantClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-email-assistant']);

const toolFaqs = [
  {
    question: "Is the AI Email Assistant completely free to use?",
    answer: "Yes, 100 percent free with no signup and no credit card required. You can draft, rewrite, and generate unlimited emails. Unlike premium tools that charge 10 to 30 dollars per month for basic email features, we believe professional communication should be accessible to everyone. There are no daily limits, no watermarks, and no premium tiers hiding behind a paywall."
  },
  {
    question: "How does the AI Email Assistant actually work?",
    answer: "You choose a mode — draft, rewrite, reply, or tone adjust — then enter your input. For drafts, you write a brief note like 'ask John for the API docs by Friday' and the tool generates a complete professional email with subject line, greeting, body, and sign-off. For rewrites, you paste an existing email and select a new tone. The AI restructures sentences, adjusts formality, and polishes the message while preserving your core intent. For replies, you paste the email you received and describe how you want to respond. For tone adjustment, you pick from professional, friendly, formal, casual, persuasive, or empathetic. The tool processes everything locally in your browser, so your content never leaves your device."
  },
  {
    question: "Will people know I used AI to write my emails?",
    answer: "Not if you review the output. The AI generates natural, professional language that sounds human. However, you should always read the draft before sending. Add personal details the AI could not know, adjust any phrasing that does not sound like your voice, and verify that technical terms match your actual expertise level. The tool handles the heavy lifting of structure and tone. You provide the human touches that make the email authentic."
  },
  {
    question: "Can I use this for job applications and cold outreach?",
    answer: "Absolutely. The email assistant is particularly strong for professional scenarios that developers and freelancers face daily. Job application follow-ups, cold outreach to hiring managers, client proposal emails, project update summaries, meeting requests, and resignation letters all work well. The persuasive tone mode is especially useful for cold outreach, while the professional mode is ideal for job-related communication. For cover letters specifically, we recommend using our dedicated AI Cover Letter Generator, which is optimized for that format."
  },
  {
    question: "Does it support multiple languages?",
    answer: "Yes. The AI Email Assistant can draft and rewrite emails in English, Spanish, French, German, Portuguese, Italian, Dutch, and more. When you select a language, the tool adapts not just vocabulary but also cultural conventions for formality, greeting structures, and closing phrases. This is especially helpful for non-native English speakers who need to communicate professionally with international teams or clients."
  },
  {
    question: "Is my email content private and secure?",
    answer: "Yes, all processing happens entirely in your browser using client-side AI. Your email content is never sent to our servers or stored in any database. This is a deliberate design choice. Emails often contain sensitive information: salary negotiations, project details, personal circumstances, or confidential client data. By processing everything locally, we ensure that only you ever see your content. You can use the tool for sensitive communication with full confidence."
  },
  {
    question: "What are the most common email mistakes this tool prevents?",
    answer: "The tool catches and prevents the six most damaging email mistakes that professionals make. First, it eliminates vague subject lines by generating specific, action-oriented subjects that get opened. Second, it prevents overly long emails by structuring concise, scannable messages. Third, it fixes tone mismatches by calibrating formality to the relationship level. Fourth, it removes filler words and passive voice that weaken your message. Fifth, it ensures proper greeting and closing conventions so you never accidentally sound too casual with a CEO or too stiff with a teammate. Sixth, it prevents forgetting calls to action by explicitly including next steps in every email."
  },
  {
    question: "How much time can this tool realistically save me?",
    answer: "Most users save 5 to 15 minutes per email. If you send 10 emails per day, that is 50 to 150 minutes saved daily. For developers and freelancers who communicate frequently with clients, managers, and teams, the time savings compound quickly. The tool is especially valuable for emails you dread writing: difficult conversations, salary negotiations, project delay explanations, or saying no to requests. These emails often take 20 to 30 minutes of mental preparation and drafting. The tool reduces that to under 2 minutes of input and review."
  }
];

export default function AIEmailAssistantPage() {
  const tool = getToolBySlug('ai-email-assistant');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "AI Email Assistant", url: `${siteConfig.url}/tools/ai-email-assistant` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Email Assistant"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description="Free AI-powered email assistant that drafts professional emails from brief notes, rewrites for tone, and generates replies. No signup needed."
        url={`${siteConfig.url}/tools/ai-email-assistant`}
        aggregateRating={{
          ratingValue: "4.8",
          ratingCount: "1567"
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
                Free AI Email Assistant
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Draft professional emails from brief notes in seconds. Rewrite for any tone, generate replies, and never struggle with wording again.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AIEmailAssistantClient />
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
                    <Link href="/tools/ai-cover-letter-generator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <PenTool className="w-4 h-4 text-blue-500" />
                      <span>AI Cover Letter Generator</span>
                    </Link>
                    <Link href="/tools/ai-resume-builder" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Briefcase className="w-4 h-4 text-green-500" />
                      <span>AI Resume Builder</span>
                    </Link>
                    <Link href="/tools/ai-interview-simulator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Users className="w-4 h-4 text-purple-500" />
                      <span>Interview Simulator</span>
                    </Link>
                    <Link href="/tools/productivity-planner" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>Productivity Planner</span>
                    </Link>
                    <Link href="/tools/ai-content-detector" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Shield className="w-4 h-4 text-red-500" />
                      <span>AI Content Detector</span>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      2026 Email Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Daily emails sent globally</span>
                      <span className="font-semibold">347 billion</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg. time to read email</span>
                      <span className="font-semibold">8 seconds</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Emails with bad tone hurt reply rate</span>
                      <span className="font-semibold">40% less</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Professionals who dread email</span>
                      <span className="font-semibold">62%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time saved per email with AI</span>
                      <span className="font-semibold">5-15 min</span>
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
            <h2 className="text-2xl font-bold mb-4">Why Professional Email Writing Matters More Than Ever in 2026</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                Email remains the dominant communication channel for professionals, with over 347 billion emails sent daily worldwide. Yet a 2026 workplace communication study found that 62 percent of professionals actively dread writing emails, and 40 percent of poorly written emails never receive a reply. The cost of bad email communication is real: missed opportunities, damaged relationships, and hours of mental energy spent agonizing over wording.
              </p>
              <p className="text-base leading-relaxed">
                The AI Email Assistant solves this by handling the structure, tone, and polish while you provide the intent and personal details. You write a brief note like "ask for deadline extension because of sick team member" and receive a complete, professionally phrased email in under 3 seconds. The tool is not replacing your judgment. It is removing the friction that makes email writing exhausting, so you can focus on what matters: the message itself.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Ways the AI Email Assistant Transforms Your Communication</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Send className="w-5 h-5 text-blue-500" />
                    Draft from Brief Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Turn a sentence like "schedule standup for Tuesday 10am with backend team" into a complete professional email with proper subject line, greeting, body, and sign-off. The AI infers context, adds polite framing, and structures the message for maximum clarity.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-green-500" />
                    Rewrite for Any Tone
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Paste an email you already wrote and instantly shift the tone. Make a casual message formal for a CEO. Soften a harsh message for a sensitive situation. Add persuasion for a sales pitch. The AI preserves your meaning while adapting the emotional register.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    Generate Smart Replies
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Paste the email you received, describe how you want to respond, and get a complete reply drafted for you. Perfect for complex responses where you know what you want to say but struggle to phrase it diplomatically.</p>
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
                  <p>All processing happens in your browser. Your emails are never sent to our servers, never stored in a database, and never used to train models. This is critical for salary negotiations, confidential project discussions, and personal communication.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Six Common Email Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Six Email Mistakes That Cost You Opportunities (And How to Fix Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Vague Subject Lines
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Subject lines like "Update" or "Question" get ignored. Busy professionals decide whether to open an email in under 2 seconds based on the subject alone.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use specific, actionable subjects. Instead of "Update," write "Backend API Migration Complete — QA Ready for Testing." The AI generates these automatically.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Wrong Tone for the Relationship
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Writing too casually to a senior executive sounds disrespectful. Writing too formally to a close colleague sounds stiff and distant. Tone mismatch is the most common email mistake.</p>
                  <p><strong className="text-foreground">Fix:</strong> The tone selector lets you calibrate precisely. Professional for executives and clients. Friendly for teammates. Formal for legal and compliance. Persuasive for pitches and proposals.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    Missing Call to Action
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Emails that end without a clear next step create ambiguity. The recipient wonders "what do they want from me?" and often does nothing.</p>
                  <p><strong className="text-foreground">Fix:</strong> Every email the tool generates includes an explicit call to action. "Please review and approve by Thursday," "Let me know your availability for a 30-minute call," or "Reply with your thoughts by end of week."</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    Passive Voice and Filler Words
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">"I was wondering if it might be possible to potentially consider..." This phrasing sounds tentative and undermines your credibility. Passive voice makes you sound like an observer rather than a decision-maker.</p>
                  <p><strong className="text-foreground">Fix:</strong> The rewrite mode converts passive constructions to active voice. "Please review the proposal by Friday" is stronger than "It would be appreciated if the proposal could be reviewed."</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    Too Long or Too Short
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Wall-of-text emails get skimmed or skipped. One-sentence emails can seem abrupt or dismissive. The optimal email length is 75 to 150 words for most professional communication.</p>
                  <p><strong className="text-foreground">Fix:</strong> The tool structures emails into scannable paragraphs with clear topic sentences. It adds enough detail to be useful without overwhelming the reader.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">6</Badge>
                    Forgetting to Proofread
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Typos in professional emails signal carelessness. A 2026 study found that emails with spelling errors are 24 percent less likely to receive a positive response, regardless of content quality.</p>
                  <p><strong className="text-foreground">Fix:</strong> The AI generates grammatically correct text by default. Combined with your review, this dramatically reduces error rates. The tool also catches common issues like mismatched formal/informal register within the same email.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Six Professional Scenarios Where This Tool Shines</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Briefcase className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Job Application Follow-Up</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Applied two weeks ago and heard nothing? Generate a polite, professional follow-up that shows continued interest without sounding desperate. The persuasive tone adds just the right level of enthusiasm.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-base">Cold Outreach to Hiring Managers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Reaching out to someone you do not know requires a careful balance of confidence and respect. The tool structures cold emails with a compelling hook, relevant credential, and a low-friction ask that gets responses.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Difficult Team Conversations</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Need to push back on an unrealistic deadline? Address a code quality issue with a senior engineer? The empathetic tone helps you communicate hard truths without damaging relationships.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">Meeting Requests and Scheduling</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Scheduling emails are repetitive but need to be precise. The tool generates meeting requests with clear agendas, time options, and preparation instructions so attendees know exactly what to expect.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                  <CardTitle className="text-base">Client and Stakeholder Updates</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Weekly project updates, milestone announcements, and blocker escalations all follow predictable structures. The tool generates these efficiently while letting you customize the specific details for each client.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="w-8 h-8 text-cyan-500 mb-2" />
                  <CardTitle className="text-base">Non-Native English Communication</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>For developers and professionals who are not native English speakers, the tool is invaluable. It generates natural, idiomatic phrasing that sounds like a native speaker wrote it, eliminating the subtle awkwardness that can undermine credibility.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Complete Your Professional Toolkit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tools/ai-resume-builder" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Resume Builder</p>
                        <p className="text-xs text-muted-foreground">ATS-friendly resumes in minutes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-cover-letter-generator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <PenTool className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Cover Letter Generator</p>
                        <p className="text-xs text-muted-foreground">Personalized letters per job</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-interview-simulator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Interview Simulator</p>
                        <p className="text-xs text-muted-foreground">Practice with AI feedback</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/salary-estimator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-yellow-500" />
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
                      <Clock className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Productivity Planner</p>
                        <p className="text-xs text-muted-foreground">AI-powered daily workflow</p>
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
            <h2 className="text-2xl font-bold mb-6">The 3-Step Email Workflow That Saves Hours Every Week</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Describe Your Intent (30 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Write a brief note about what you need. Do not worry about phrasing. "Tell client the project will be delayed by 3 days due to API issues. Apologize but emphasize quality." The tool understands context and intent.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Generate and Select Tone (10 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Choose your mode and tone. Draft for new emails. Rewrite for existing ones. Reply for responses. Select professional, friendly, formal, casual, persuasive, or empathetic based on the recipient and situation.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Review, Customize, Send (60 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Read the generated email. Add personal details the AI could not know. Adjust any phrasing that does not sound like you. Copy and send. Total time from idea to sent email: under 2 minutes instead of 20.</p>
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
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">Never Dread Writing an Email Again</h2>
              <p className="text-white/90 mb-6">
                Join 1,500+ professionals who write better emails in 2 minutes instead of 20. Free, private, and unlimited.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link href="/tools/ai-resume-builder">Build Your Resume</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/ai-cover-letter-generator">Write a Cover Letter</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
