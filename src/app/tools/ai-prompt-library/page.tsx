import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Sparkles, Zap, Search, Star, Copy, Play, Bookmark, Filter, Code, FileText, Brain, Terminal, Palette, Lightbulb, MessageSquare, TrendingUp, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import AIPromptLibraryClient from "./AIPromptLibraryClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-prompt-library']);

const toolFaqs = [
  {
    question: "Is the AI Prompt Library completely free?",
    answer: "Yes, 100 percent free with no signup required. Browse 500+ curated prompts, test them in the AI Playground, and copy them to your clipboard. Unlike prompt marketplaces that charge per prompt or require subscriptions for premium collections, all prompts are available to everyone."
  },
  {
    question: "What is the AI Prompt Library?",
    answer: "A curated collection of 500+ high-quality prompts for ChatGPT, Claude, Midjourney, Stable Diffusion, and other AI tools. Each prompt is organized by category, rated for effectiveness, and includes usage notes. The library covers writing, coding, design, marketing, research, creative projects, and personal productivity. Instead of spending hours crafting the perfect prompt, find one that professionals have already refined and tested."
  },
  {
    question: "What is the AI Playground?",
    answer: "The AI Playground is a built-in testing environment where you can run prompts directly and see the output instantly. Paste a prompt from the library, adjust the variables, and test the results. This iterative workflow lets you refine prompts before using them in production. The playground supports text generation, code generation, and creative writing prompts."
  },
  {
    question: "Can I save my own prompts?",
    answer: "Yes. Save any prompt to your personal library with one click. Organize saved prompts into custom collections. Export your library as a text file. Share individual prompts or entire collections via unique links. All saved data stays in your browser for privacy."
  },
  {
    question: "How are prompts rated?",
    answer: "Every prompt in the library has a community rating based on effectiveness, clarity, and consistency of results. Top-rated prompts appear first in each category. New prompts enter the library with a provisional rating and move up as users report positive results. The rating system helps you identify the prompts that actually produce useful output instead of generic responses."
  },
  {
    question: "What categories of prompts are available?",
    answer: "The library covers 12 categories: Writing and Content Creation, Coding and Development, Design and Visual Arts, Marketing and SEO, Research and Analysis, Data Science and Analytics, Education and Learning, Business and Strategy, Creative Writing, Social Media, Personal Productivity, and Technical Documentation. Each category contains 40 to 60 prompts ranging from beginner to advanced complexity."
  },
  {
    question: "Do I need to know prompt engineering to use this?",
    answer: "No. The entire purpose of the library is to make prompt engineering accessible to everyone. Each prompt includes clear instructions on what variables to customize and what output to expect. You do not need to understand chain-of-thought prompting, few-shot learning, or role-based prompting. Just find a prompt that matches your goal, fill in the blanks, and run it. Over time, using well-crafted prompts teaches you prompt engineering principles naturally."
  },
  {
    question: "How is this different from just searching Google for prompts?",
    answer: "Google search returns scattered blog posts with outdated, untested prompts. The quality varies wildly, and most prompts are not context-aware. The AI Prompt Library provides professionally curated prompts that are tested, rated, categorized, and kept current as AI models evolve. The playground lets you test before committing. The save feature lets you build a personal toolkit. It is the difference between a random recipe blog and a professional cookbook."
  }
];

export default function AIPromptLibraryPage() {
  const tool = getToolBySlug('ai-prompt-library');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "AI Prompt Library", url: `${siteConfig.url}/tools/ai-prompt-library` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Prompt Library"
        applicationCategory="WebApplication"
        operatingSystem="Web"
        description="Free AI prompt library with 500+ curated prompts for ChatGPT, Claude, Midjourney. Test in sandbox. No signup needed."
        url={`${siteConfig.url}/tools/ai-prompt-library`}
        aggregateRating={{
          ratingValue: "4.8",
          ratingCount: "1876"
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
                <Badge variant="outline" className="text-xs">500+ Prompts</Badge>
                <span className="text-xs text-muted-foreground">Updated for 2026</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Free AI Prompt Library — 500+ Curated Prompts for ChatGPT, Claude & Midjourney
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Browse professionally crafted prompts, test them in the AI Playground, and save your favorites. No signup required.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <AIPromptLibraryClient />
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
                    <Link href="/tools/ai-content-detector" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Search className="w-4 h-4 text-red-500" />
                      <span>AI Content Detector</span>
                    </Link>
                    <Link href="/tools/ai-email-assistant" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <MessageSquare className="w-4 h-4 text-green-500" />
                      <span>AI Email Assistant</span>
                    </Link>
                    <Link href="/tools/ai-resume-builder" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span>AI Resume Builder</span>
                    </Link>
                    <Link href="/tools/ai-cover-letter-generator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <CheckCircle className="w-4 h-4 text-purple-500" />
                      <span>Cover Letter Generator</span>
                    </Link>
                    <Link href="/tools/startup-idea-generator" className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                      <Lightbulb className="w-4 h-4 text-orange-500" />
                      <span>Startup Idea Generator</span>
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      AI Prompt Stats 2026
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ChatGPT daily active users</span>
                      <span className="font-semibold">300M+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Output quality increase with good prompts</span>
                      <span className="font-semibold">340%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Professionals who use AI prompts daily</span>
                      <span className="font-semibold">67%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time saved per task with good prompts</span>
                      <span className="font-semibold">55%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Prompt marketplaces charging per prompt</span>
                      <span className="font-semibold">$0.99-5.00</span>
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
            <h2 className="text-2xl font-bold mb-4">Why Prompt Quality Determines Your AI Results</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground">
              <p className="text-base leading-relaxed mb-4">
                The quality of AI output is determined almost entirely by the quality of the prompt. A vague request like "write a blog post about productivity" produces generic, forgettable content. A structured prompt with context, role assignment, format specification, and examples produces content that feels written by a domain expert. The difference is not the AI model. It is the human behind the keyboard.
              </p>
              <p className="text-base leading-relaxed">
                The problem is that crafting excellent prompts takes time and expertise. You need to understand prompt engineering principles like chain-of-thought reasoning, few-shot examples, role-based prompting, and output formatting. Most people do not have hours to spend learning these techniques. The AI Prompt Library solves this by providing 500+ professionally crafted prompts across every major use case. Find a prompt, customize the variables, and get expert-level output without the expert-level learning curve.
              </p>
            </div>
          </section>

          {/* 4 Key Capabilities */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Four Features That Unlock Better AI Results</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    500+ Curated Prompts
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Browse prompts organized by category and rated by effectiveness. Each prompt includes clear instructions on what variables to customize. Categories cover writing, coding, design, marketing, research, data science, education, business, creative projects, and personal productivity.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Play className="w-5 h-5 text-green-500" />
                    AI Playground Sandbox
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Test prompts directly in the built-in playground. See output instantly, adjust variables, and iterate. This eliminates the guesswork of copying prompts to external tools. The playground supports text generation, code generation, and creative writing workflows.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-purple-500" />
                    Save and Organize
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Save any prompt to your personal library with one click. Organize into custom collections for different projects. Export your library as a text file. Share individual prompts or collections via unique links. Build a prompt toolkit that grows with your needs.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500" />
                    Community Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Every prompt is rated by the community for effectiveness, clarity, and consistency. Top-rated prompts appear first in each category. This crowdsourced quality control ensures you are using prompts that actually work, not theoretical templates that look good but produce weak output.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <InContentAd />

          {/* Mistakes */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Five Prompt Mistakes That Waste Your AI Subscription (And How to Fix Them)</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">1</Badge>
                    Vague, Open-Ended Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">"Write something good about marketing" is the fastest path to generic output. The AI has no context about your industry, audience, tone, or goal. It defaults to safe, boring generalizations that sound like they came from a textbook.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use structured prompts with role, context, format, and constraints. "You are a SaaS marketing director. Write a 500-word blog post about email onboarding sequences for B2B software. Include 3 specific examples. Tone: professional but conversational." This prompt produces content that is immediately usable.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">2</Badge>
                    Not Assigning a Role
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">Without a role assignment, the AI defaults to a generic helpful assistant persona. That works for simple questions but fails for specialized tasks. A coding question answered by a generic assistant is less precise than one answered by an assigned "senior backend engineer."</p>
                  <p><strong className="text-foreground">Fix:</strong> Start every prompt with a role assignment. "You are an experienced Python developer specializing in Django REST APIs." "You are a UX researcher with 10 years of experience." The role frames the knowledge, tone, and perspective of the response.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">3</Badge>
                    Forgetting Format Specifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">You ask for a comparison of two frameworks and get a wall of text. You wanted a structured table. You ask for a project plan and get paragraphs. You wanted bullet points with timelines. Without format instructions, the AI chooses its own output structure, which rarely matches your needs.</p>
                  <p><strong className="text-foreground">Fix:</strong> Specify output format explicitly. "Format as a comparison table with columns for Feature, Framework A, Framework B, and Winner." "Format as bullet points with estimated hours for each task." The library includes prompts with format specifications built in.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">4</Badge>
                    No Examples for Complex Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">For tasks like rewriting content in your brand voice, summarizing technical documents, or generating structured data, the AI needs examples to calibrate its output. Without examples, it guesses at your preferences and often misses.</p>
                  <p><strong className="text-foreground">Fix:</strong> Include 1 to 3 examples in your prompt. "Here are 3 examples of our brand voice. Rewrite the following paragraph to match this style." The library's few-shot prompts include example slots that you fill with your own content.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">5</Badge>
                    Treating the First Output as Final
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p className="mb-2">The first response from an AI is rarely the best possible output. Most users accept the first draft, make minor edits, and move on. They are leaving significant quality on the table. Iterative refinement is where the real magic happens.</p>
                  <p><strong className="text-foreground">Fix:</strong> Use the AI Playground to test prompts and iterate. Run the prompt, evaluate the output, adjust one variable, and run again. Three iterations with minor tweaks almost always outperform the first draft. The library includes iteration prompts specifically designed for this refinement workflow.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Who Benefits From the AI Prompt Library</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <FileText className="w-8 h-8 text-blue-500 mb-2" />
                  <CardTitle className="text-base">Writers and Content Creators</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Blog post outlines, headline generation, SEO meta descriptions, social media captions, email sequences, and long-form article drafting. The writing prompts cover everything from brainstorming to final editing.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Code className="w-8 h-8 text-purple-500 mb-2" />
                  <CardTitle className="text-base">Developers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Code generation, debugging assistance, algorithm explanations, API documentation, test case generation, and code review prompts. The coding prompts include language-specific templates for Python, JavaScript, TypeScript, Go, Rust, and more.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Palette className="w-8 h-8 text-pink-500 mb-2" />
                  <CardTitle className="text-base">Designers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Midjourney and Stable Diffusion prompts for image generation. UX copy generation, design critique frameworks, color palette suggestions, and accessibility compliance checks. The visual prompts produce specific, actionable design output.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="w-8 h-8 text-green-500 mb-2" />
                  <CardTitle className="text-base">Marketers</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Ad copy generation, landing page optimization, A-B test ideas, customer persona creation, competitive analysis, and campaign planning. The marketing prompts include framework-based templates like AIDA, PAS, and StoryBrand.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Terminal className="w-8 h-8 text-orange-500 mb-2" />
                  <CardTitle className="text-base">Data Scientists</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Data analysis scripts, visualization suggestions, statistical interpretation, model selection guidance, and report generation. The data science prompts handle everything from exploratory analysis to presentation-ready insights.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lightbulb className="w-8 h-8 text-yellow-500 mb-2" />
                  <CardTitle className="text-base">Entrepreneurs</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Pitch deck copy, business plan sections, investor email templates, market research prompts, and competitive analysis frameworks. The business prompts are designed for founders who need to communicate clearly under time pressure.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Internal Links */}
          <section>
            <h2 className="text-2xl font-bold mb-6">Complete Your AI Toolkit</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/tools/ai-content-detector" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Search className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Content Detector</p>
                        <p className="text-xs text-muted-foreground">Detect AI-generated text</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-email-assistant" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">AI Email Assistant</p>
                        <p className="text-xs text-muted-foreground">Draft emails in seconds</p>
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
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Cover Letter Generator</p>
                        <p className="text-xs text-muted-foreground">Tailored cover letters</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/tools/ai-interview-simulator" className="group">
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-cyan-500" />
                      <div>
                        <p className="font-medium group-hover:text-primary transition-colors">Interview Simulator</p>
                        <p className="text-xs text-muted-foreground">Practice with AI feedback</p>
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
            <h2 className="text-2xl font-bold mb-6">How to Use Any Prompt in 60 Seconds</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <CardHeader>
                  <CardTitle className="text-base">Browse and Select (20 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Filter prompts by category or search by keyword. Each prompt shows its rating, category, and a preview of what it does. Select the prompt that matches your current task. The curated library means you spend seconds finding the right prompt instead of hours crafting one from scratch.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <CardHeader>
                  <CardTitle className="text-base">Customize Variables (20 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Every prompt includes clearly marked variables like [topic], [audience], or [tone]. Replace these with your specific information. "Write a blog post about [topic] for [audience]" becomes "Write a blog post about Kubernetes for junior developers." The structure stays intact while the content becomes yours.</p>
                </CardContent>
              </Card>
              <Card className="relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <CardHeader>
                  <CardTitle className="text-base">Test and Refine (20 seconds)</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Paste the customized prompt into the AI Playground and run it. Evaluate the output. If it needs adjustment, tweak one variable and try again. Three quick iterations almost always produce better results than the first draft. Save the final prompt to your library for future reuse.</p>
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
              <h2 className="text-2xl font-bold mb-3">Stop Writing Bad Prompts. Start Getting Great Results.</h2>
              <p className="text-white/90 mb-6">
                Join 1,800+ professionals using curated prompts to unlock AI potential. Free, always updated, and built for real work.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                  <Link href="/tools/ai-content-detector">Detect AI Text</Link>
                </Button>
                <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  <Link href="/tools/ai-email-assistant">Draft Emails</Link>
                </Button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
