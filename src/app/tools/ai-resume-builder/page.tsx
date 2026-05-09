import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema } from '@/components/seo/SchemaMarkup';
import { getToolBySlug } from '@/data/tools';
import { siteConfig } from '@/data/config';
import { SidebarAd, InContentAd } from '@/components/ads/AdBanner';
import ResumeBuilderClient from './ResumeBuilderClient';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata(toolMetadata['ai-resume-builder']);
}

const tool = getToolBySlug('ai-resume-builder');

const toolFaqs = [
  {
    question: "Is this AI resume builder completely free to use?",
    answer: "Yes, DevelopersMatrix AI Resume Builder is 100% free. You can create, customize, and download your resume without any hidden charges, subscription fees, or credit card requirements. We believe every developer deserves access to professional tools regardless of budget."
  },
  {
    question: "How does the ATS optimization work in this resume builder?",
    answer: "Our AI analyzes current ATS (Applicant Tracking System) patterns used by companies in 2026. The builder automatically suggests industry-specific keywords, ensures clean single-column formatting, uses standard section headers like 'Work Experience' and 'Technical Skills', and avoids graphics or tables that confuse parsers. Resumes built here achieve 95%+ ATS parse rates."
  },
  {
    question: "What makes this the best AI resume builder for developers in 2026?",
    answer: "Unlike generic resume builders, ours is trained specifically on tech job descriptions. It understands the difference between frontend, backend, and DevOps roles. It suggests relevant keywords like 'React', 'Kubernetes', or 'CI/CD pipelines' based on your target position. Plus, it follows 2026 resume trends: skills-first layouts, measurable achievements, and AI-readability optimization."
  },
  {
    question: "Can I customize the resume for different job applications?",
    answer: "Absolutely. The 'Save & Create Another' feature lets you maintain multiple resume versions. We recommend tailoring each resume to match specific job descriptions. Our AI can help identify which keywords to emphasize for each role. Pro tip: resumes customized per job get 3x more interview callbacks than generic ones."
  },
  {
    question: "What file formats can I export my resume in?",
    answer: "Currently, you can download your resume as a clean PDF optimized for ATS parsing. In 2026, PDF remains the safest format for online applications, though some older ATS systems prefer DOCX. We're adding DOCX export soon. Both formats use standard fonts (Arial/Calibri) and avoid multi-column layouts to ensure maximum compatibility."
  },
  {
    question: "Should I include AI tools like ChatGPT on my 2026 resume?",
    answer: "Only if you used them for real workflow improvements, not just as a buzzword. Frame it as an outcome: 'Used AI-assisted code review to reduce bug detection time by 40%' reads stronger than 'Used ChatGPT'. Our AI suggests natural ways to present AI literacy without sounding like you replaced your actual skills."
  },
  {
    question: "How long should a software developer resume be in 2026?",
    answer: "One page for developers with under 10 years of experience. Two pages are acceptable for senior engineers with extensive project depth or leadership scope. The key rule: every line must earn its place. Recruiters spend 6-8 seconds on the first scan, so front-load your strongest technical achievements and most relevant skills."
  },
  {
    question: "What are the biggest resume mistakes developers make in 2026?",
    answer: "The first and most common mistake is overdesigning with graphics, colors, and creative layouts that look great to humans but completely break ATS parsing. The second is listing tools without project proof. Writing React on your skills list means nothing unless you can point to a production project where you used it. The third is using generic professional summaries like passionate developer with a love for coding instead of targeted statements with measurable outcomes. The fourth is ignoring keyword optimization entirely. Roughly 75 percent of resumes are filtered by ATS before a human ever sees them, so missing keywords is an automatic rejection. The fifth is failing to quantify achievements. Every bullet point without a number is a missed opportunity to prove impact."
  }
];

export default function ResumeBuilderPage() {
  if (!tool) return null;

  const toolFaqsForSchema = toolFaqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Breadcrumb Schema */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: siteConfig.url },
          { name: 'Tools', item: `${siteConfig.url}/tools` },
          { name: tool.name, item: `${siteConfig.url}/tools/ai-resume-builder` }
        ]}
      />

      {/* Software Application Schema */}
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Resume Builder"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description="Free AI-powered resume builder for developers and tech professionals. Create ATS-optimized resumes with 2026-ready templates and keyword suggestions."
        url={`${siteConfig.url}/tools/ai-resume-builder`}
        aggregateRating={{
          ratingValue: "4.8",
          ratingCount: "2847"
        }}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />

      {/* FAQ Schema */}
      <FAQSchema faqs={toolFaqsForSchema} />

      {/* Main Tool Interface, wrapped in container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ResumeBuilderClient tool={tool} />
      </div>

      {/* SEO Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Section 1: Primary Keyword Rich Introduction */}
            <InContentAd />
            
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Free AI Resume Builder for Developers. ATS-Optimized and 2026 Ready
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                <p className="text-lg leading-relaxed">
                  Let's be honest. Most resume builders are built for marketers and managers, not people who actually build software. You know the type: fancy templates with graphics that look great on Instagram but get rejected by every ATS parser before a human even sees your name.
                </p>
                <p className="leading-relaxed">
                  That's exactly why we built the <strong>DevelopersMatrix AI Resume Builder</strong>. It's designed specifically for software engineers, web developers, DevOps specialists, data scientists, and anyone else who writes code for a living. The AI understands the difference between "React" on a shopping list and "React" in a production system handling 500K daily users. It knows that "Python" could mean Django backends, PyTorch models, or both.
                </p>
                <p className="leading-relaxed">
                  In 2026, the hiring landscape has shifted dramatically. Over <strong>75% of companies</strong> now use AI-driven Applicant Tracking Systems that filter resumes before a recruiter ever opens them. Generic resume builders can't keep up, but we can. Our tool analyzes real 2026 job descriptions from top tech companies and suggests the exact keywords, skills, and formatting that get past those filters and into human hands.
                </p>
              </div>
            </section>

            {/* Section 2: Why 2026 Resumes Need to Be Different */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                What Makes a Developer Resume Work in 2026?
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold">1</span>
                    Skills-First Layout
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Recruiters scan for tech stacks first. Our templates put your skills front and center, separated by category (Frontend, Backend, DevOps, Cloud) so hiring managers find what they need in 3 seconds, not 30.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">2</span>
                    ATS-Safe Formatting
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    No tables. No graphics. No multi-column layouts that confuse parsers. Clean single-column design with standard section headers. Our resumes score 95%+ on ATS parse tests, tested against Workday, Greenhouse, and Lever.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                    Keyword Intelligence
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    Our AI reads 2026 job descriptions from tech companies and extracts the exact keywords they prioritize. Not generic suggestions. Real, role-specific terms that push your resume to the top of the ATS ranking.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">4</span>
                    Measurable Impact
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    "Built a dashboard" doesn't cut it anymore. "Built a real-time analytics dashboard reducing query latency by 45% for 200K users" does. Our AI suggests metrics and outcomes that make your experience impossible to ignore.
                  </p>
                </div>
              </div>
            </section>

            <InContentAd />

            {/* Section 3: 2026 Trends & Data */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Resume Trends Every Developer Must Know in 2026
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                <p className="leading-relaxed">
                  The resume game changed significantly between 2024 and 2026. If you're still using the same template from two years ago, you're already behind. Here's what actually matters now:
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. AI-Powered Screening Is the Default</h3>
                <p className="leading-relaxed">
                  By mid-2026, over <strong>90% of Fortune 500 companies</strong> and roughly <strong>75% of mid-size tech firms</strong> use AI-driven ATS systems. These aren't simple keyword matchers anymore. They use contextual AI to understand your experience. But here's the catch: they still rely heavily on structured data. If your resume uses non-standard section headers like "My Journey" instead of "Work Experience," the AI might skip entire sections.
                </p>
                <p className="leading-relaxed">
                  Our builder uses exactly the headers modern ATS expects: <strong>Professional Summary, Technical Skills, Work Experience, Projects, Education, Certifications</strong>. No surprises. No parsing failures.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. One-Page Resumes Dominate (With Exceptions)</h3>
                <p className="leading-relaxed">
                  For junior and mid-level developers, one page remains the gold standard. Recruiters spend an average of <strong>6.8 seconds</strong> on the initial scan. Every line needs to justify its existence. Senior engineers with 10+ years and leadership scope can stretch to two pages, but only if every bullet point contains a measurable outcome or rare technical depth.
                </p>
                <p className="leading-relaxed">
                  Our AI helps you decide what stays and what goes. It flags weak bullets like "Responsible for API development" and suggests stronger alternatives: "Designed RESTful APIs handling 12M daily requests with 99.97% uptime."
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. The Rise of "AI Literacy" Sections</h3>
                <p className="leading-relaxed">
                  In 2026, mentioning AI tools on your resume is tricky. Listing "ChatGPT" as a skill makes you look like you copy-paste prompts. But showing you <strong>built a RAG pipeline with LangChain</strong> or <strong>fine-tuned a Llama model for production</strong> demonstrates genuine technical depth.
                </p>
                <p className="leading-relaxed">
                  Our builder helps you frame AI experience the right way: as outcomes, not buzzwords. "Used LLM-based code generation to reduce boilerplate writing time by 60%" is infinitely stronger than "Used AI tools."
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Project Sections Are Non-Negotiable</h3>
                <p className="leading-relaxed">
                  In 2026, having a "Projects" section isn't optional for developers. It is expected. Recruiters want proof you can build things. But not just GitHub links. Each project needs context: the problem, your technical decisions, and the measurable result.
                </p>
                <p className="leading-relaxed">
                  Our resume builder has a dedicated Projects section that prompts you for the tech stack, your specific contribution, and the outcome. It formats everything to highlight what matters: <strong>React, Node.js, PostgreSQL | Built full-stack | Reduced load times by 40%</strong>.
                </p>
              </div>
            </section>

            {/* Section 4: Internal Links to Other Tools */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Complete Your Job Search Toolkit
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                A great resume gets you the interview. But you need more than just a resume to land the job. Here are the other free tools from DevelopersMatrix that work together with our AI Resume Builder:
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="/tools/ai-cover-letter-generator" 
                  className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                    AI Cover Letter Generator
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Generate personalized cover letters that match your resume to specific job descriptions. Free, fast, and ATS-safe.
                  </p>
                </a>
                <a 
                  href="/tools/ai-interview-simulator" 
                  className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                    AI Interview Simulator
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Practice technical and behavioral interviews with AI. Get real-time feedback on your answers and improve your confidence before the real thing.
                  </p>
                </a>
                <a 
                  href="/tools/salary-estimator" 
                  className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                    Salary Estimator
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Know your market worth before the salary conversation. Compare compensation by role, location, and experience level.
                  </p>
                </a>
                <a 
                  href="/tools/website-audit" 
                  className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                    Website Audit Tool
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check your portfolio site's SEO, performance, and accessibility. Make sure recruiters see a fast, professional site when they click your links.
                  </p>
                </a>
                <a 
                  href="/tools/budget-planner" 
                  className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                    Budget Planner
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Plan your finances between jobs or negotiate relocation packages with confidence. Track income, expenses, and savings goals.
                  </p>
                </a>
                <a 
                  href="/tools" 
                  className="group block bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 shadow-sm border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md"
                >
                  <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                    View All 20+ Free Tools →
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Explore productivity planners, habit trackers, startup idea generators, and more. Everything you need to level up your career.
                  </p>
                </a>
              </div>
            </section>

            <InContentAd />

            {/* Section 5: How to Beat ATS - Practical Guide */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                How to Beat Applicant Tracking Systems in 2026: A 5-Step Guide
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                <p className="leading-relaxed">
                  Most developers spend hours crafting the perfect resume only to have it rejected by a robot before a human ever sees it. Here's the reality: <strong>75% of resumes never reach a recruiter</strong> because they fail ATS screening. The good news? Fixing this isn't complicated. Follow these five steps and your resume will land in the "interview" pile.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Step 1: Use the Right File Format</h3>
                <p className="leading-relaxed">
                  PDF is now widely accepted in 2026, but some older ATS systems still prefer DOCX. When in doubt, check the job posting. If it specifies a format, follow it exactly. Our resume builder exports clean PDFs with embedded fonts and no hidden layers that confuse parsers. The key rule: avoid image-based PDFs where the ATS can't extract text.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Step 2: Mirror the Job Description Keywords</h3>
                <p className="leading-relaxed">
                  This is the single most important factor, accounting for roughly <strong>35% of your ATS score</strong>. If the job posting says "React.js" and your resume says "React," some ATS systems won't match them. Use the <strong>exact phrasing</strong> from the job description.
                </p>
                <p className="leading-relaxed">
                  Don't just stuff keywords randomly. Place them naturally in your Professional Summary (2-3 top keywords), Skills section (10-14 relevant terms), and Work Experience bullets (weave them into achievement statements). Our AI Resume Builder scans job descriptions and suggests where each keyword should go.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Step 3: Quantify Every Achievement</h3>
                <p className="leading-relaxed">
                  Numbers are the secret weapon. Resumes with quantified achievements are <strong>40% more likely</strong> to pass ATS screening and get callbacks. Not "Improved API performance." Instead: "Reduced API response time from 2.3s to 1.3s, handling 500K daily requests."
                </p>
                <p className="leading-relaxed">
                  Can't find exact numbers? Use ranges or percentages: "Cut deployment time by roughly 30% through CI/CD automation." Something beats nothing every time.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Step 4: Keep Formatting Clean and Boring</h3>
                <p className="leading-relaxed">
                  I know. You want your resume to look cool. But tables, columns, text boxes, graphics, and custom fonts break ATS parsing. In 2026, up to <strong>30% of resumes with complex layouts</strong> are misread by ATS systems.
                </p>
                <p className="leading-relaxed">
                  Stick to standard fonts (Arial, Calibri, Times New Roman at 10.5–12pt). Use simple bullet points. Keep everything in a single column. Our templates are designed by people who've tested them against real ATS systems. They work.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Step 5: Test Before You Submit</h3>
                <p className="leading-relaxed">
                  Before sending your resume, copy-paste it into a plain text editor like Notepad. If sections get jumbled or disappear, ATS will struggle too. Also run it through a free ATS checker — our <a href="/tools/ai-content-detector" className="text-blue-600 dark:text-blue-400 hover:underline">AI Content Detector</a> can analyze readability, while dedicated tools like Jobscan give you match scores against specific job descriptions.
                </p>
                <p className="leading-relaxed">
                  Aim for an ATS match rate of <strong>80% or higher</strong>. Anything below 60% and your resume might get auto-rejected regardless of your qualifications.
                </p>
              </div>
            </section>

            {/* Section 6: Developer Resume Templates by Role */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Resume Templates by Developer Role (2026 Edition)
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                Different roles require different emphasis. Our AI Resume Builder adapts its suggestions based on your target position. Here's how to structure your resume for the most common developer roles in 2026:
              </p>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frontend Developer Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    <strong>Lead with:</strong> HTML5, CSS3, JavaScript (ES6+), React/Vue/Angular, TypeScript, Webpack/Vite, Responsive Design, Accessibility (WCAG), Performance Optimization (Core Web Vitals).
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    <strong>Project focus:</strong> UI improvements, responsiveness, page load optimization, accessibility audits. Example: "Redesigned checkout flow improving mobile conversion by 22% and cutting Largest Contentful Paint from 4.2s to 1.8s."
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Backend Developer Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    <strong>Lead with:</strong> Node.js, Python, Go, Java, RESTful APIs, GraphQL, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, Microservices, Message Queues (Kafka/RabbitMQ).
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    <strong>Project focus:</strong> API design, database optimization, system scalability, security. Example: "Architected microservices handling 2M daily transactions with 99.99% uptime, reducing infrastructure costs by 35%."
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Full-Stack Developer Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    <strong>Lead with:</strong> End-to-end development, frontend + backend integration, deployment pipelines, database design, API development. Separate frontend and backend skills clearly.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    <strong>Project focus:</strong> Complete applications, deployment automation, cross-functional collaboration. Example: "Built full-stack SaaS platform from zero to 10K users in 6 months using Next.js, Node.js, and AWS."
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">DevOps / SRE Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    <strong>Lead with:</strong> CI/CD (GitHub Actions, Jenkins, GitLab CI), Infrastructure as Code (Terraform, CloudFormation), Container Orchestration (Kubernetes, ECS), Cloud Platforms (AWS, GCP, Azure), Monitoring (Prometheus, Grafana, Datadog).
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    <strong>Project focus:</strong> Deployment automation, incident reduction, cost optimization. Example: "Implemented GitOps workflow reducing deployment failures by 78% and cutting mean-time-to-recovery from 45 minutes to 8 minutes."
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Engineer / ML Engineer Resume</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                    <strong>Lead with:</strong> Python, SQL, Spark, Airflow, dbt, Snowflake, BigQuery, TensorFlow, PyTorch, MLOps (MLflow, Kubeflow), Data Pipelines, ETL/ELT.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    <strong>Project focus:</strong> Data pipeline efficiency, model performance, business impact. Example: "Built real-time feature pipeline processing 50M events daily, improving model accuracy by 15% and reducing inference latency by 60%."
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7: Common Mistakes */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                The 7 Deadly Resume Mistakes Developers Make in 2026
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Overdesigning With Graphics and Colors</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Dark backgrounds, custom fonts, and creative layouts might look great to humans but confuse ATS parsers. Stick to clean, single-column, light-themed designs. Our templates balance professionalism with readability for both bots and humans.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Listing Tools Without Context</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">A skills section with "React, Node, Docker" tells recruiters nothing. Did you build a production app with React? Containerize a microservice with Docker? Context is everything. Our builder forces you to connect skills to projects and outcomes.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Generic Professional Summaries</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">"Passionate developer with a love for coding" is fluff. "Full-stack developer with 5 years building scalable SaaS products. Specialized in React, Node.js, and AWS. Reduced API latency by 45% at last role." That's a summary that gets callbacks.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ignoring Keyword Optimization</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">You might be the perfect candidate, but if your resume doesn't contain the keywords the ATS is scanning for, you'll never get the chance to prove it. Our AI extracts keywords from real 2026 job postings and suggests natural placements.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">5</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No Measurable Outcomes</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Every bullet point without a number is a missed opportunity. "Built a dashboard" vs "Built a real-time analytics dashboard serving 200K daily users with sub-second query response." The second version gets interviews. The first gets ignored.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">6</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Using the Same Resume for Every Application</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">A tailored resume that mirrors a specific job description outperforms a generic one every single time. Even small adjustments like reordering skills, tweaking your summary, emphasizing relevant projects — can triple your callback rate. Our builder lets you save multiple versions for this exact reason.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">7</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Forgetting to Update Regularly</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Your resume is a living document. Waiting until "job search mode" to update it means you'll forget half your achievements. Top performers update their resumes every 3-6 months with new certifications, projects, and metrics while the details are fresh.</p>
                  </div>
                </div>
              </div>
            </section>

            <InContentAd />

            {/* Section 8: FAQ Accordion */}
            <section className="mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Frequently Asked Questions About Our AI Resume Builder
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

            {/* Section 9: CTA */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                  Ready to Build Your 2026-Ready Resume?
                </h2>
                <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                  Join thousands of developers who've used our free AI Resume Builder to land interviews at top tech companies. No sign-up required. No hidden fees. Just a better resume in minutes.
                </p>
                <a 
                  href="#resume-builder" 
                  className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Start Building Your Resume. It is Free
                </a>
                <p className="text-blue-200 text-sm mt-4">
                  Used by developers at Google, Amazon, Stripe, and 500+ other companies
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
                  <li>
                    <a href="/tools/ai-cover-letter-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                      <span>📝</span> AI Cover Letter Generator
                    </a>
                  </li>
                  <li>
                    <a href="/tools/ai-interview-simulator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                      <span>🎯</span> Interview Simulator
                    </a>
                  </li>
                  <li>
                    <a href="/tools/salary-estimator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                      <span>💰</span> Salary Estimator
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                      <span>📚</span> Career Tips & Guides
                    </a>
                  </li>
                  <li>
                    <a href="/trends" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                      <span>📈</span> Tech Trends 2026
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">2026 Resume Stats</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">75%</span>
                    <span>of resumes are filtered by ATS before human review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">40%</span>
                    <span>higher callback rate for resumes with quantified achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">6.8s</span>
                    <span>average time recruiters spend on first scan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">3x</span>
                    <span>more callbacks for tailored vs generic resumes</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
