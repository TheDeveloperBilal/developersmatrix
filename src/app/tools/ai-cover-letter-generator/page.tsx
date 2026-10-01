import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { getToolBySlug } from "@/data/tools";
import { siteConfig } from "@/data/config";
import CoverLetterClient from "./CoverLetterClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-cover-letter-generator']);

const toolFaqs = [
  {
    question: "Is this AI cover letter generator completely free?",
    answer: "Yes, 100% free with no signup required. Many cover letter tools charge a monthly fee or cap free letters. This one has no limit. You can generate as many cover letters as you need for different job applications without ever paying or creating an account."
  },
  {
    question: "How does the AI cover letter generator work?",
    answer: "You enter the job title, the company, your current role, one or two results you are proud of and why you want the job. If you paste the job description, the tool finds the skills it asks for, leads with the ones you share, and names one duty from the posting that matches your work. Every sentence comes from your input or the posting, so nothing is invented. You can then edit the letter in place, and a letter check flags stock phrases, missing numbers, placeholders and keyword gaps as you type. Copy it, download it as text, or print it to PDF."
  },
  {
    question: "Will recruiters know I used an AI to write my cover letter?",
    answer: "Not if you edit it properly. Recruiters read a lot of letters and quickly spot generic, padded writing. The key is personalization. Our tool gives you a strong foundation. Your job is to add specific details: mention a company project you admire, reference a blog post the CTO wrote, or explain why their tech stack excites you personally. These touches have to come from you, which is why this tool asks for your reason up front and marks the spot if you leave it out. The tool handles the structure. You spend a few minutes making it yours. That combination gets you the best of both speed and authenticity."
  },
  {
    question: "How long should a tech cover letter be in 2026?",
    answer: "Aim for roughly 200 to 400 words, or three to four concise paragraphs. Shorter is fine for an email or quick apply form, as long as every line is specific. Recruiters skim, so every sentence must earn its place. Start with a one sentence hook, follow with two body paragraphs highlighting your most relevant achievements, and close with a confident call to action. Anything longer risks being skimmed or ignored. Anything shorter looks like you did not try."
  },
  {
    question: "Is this cover letter generator ATS-friendly?",
    answer: "Yes. The output is plain text with clean formatting, which is exactly what Applicant Tracking Systems handle best. We avoid graphics, tables, columns, and unusual fonts that confuse ATS parsers. The generated text includes relevant keywords from your input (job title, skills, experience) in natural context rather than keyword stuffed lists. Most large employers use an ATS, so a clean, readable letter is the safe choice."
  },
  {
    question: "Can I use this for non-tech jobs too?",
    answer: "Absolutely. While the tool is optimized for developer and tech professional roles, it works for any job application. Marketing managers, product managers, designers, sales professionals, and operations roles all benefit from structured, personalized cover letters. The key inputs (job title, company name, experience summary and skills) apply to every industry."
  },
  {
    question: "Should I customize the generated cover letter before sending?",
    answer: "Yes, always. Think of the output as a first draft, not a final submission. Here is what you should do before hitting send. First, verify every technical term is accurate for your actual experience level. If the letter says you are an expert in Go but you have only used it once, tone that down. Second, add one company specific detail the tool could not know: a recent product launch, an engineering blog post, or a conference talk by someone on the team. Third, read the letter aloud. If it does not sound like something you would actually say in a conversation, rewrite those sentences. Fourth, replace anything in square brackets; the letter check will flag it until you do. These four steps take under 10 minutes and transform a good draft into a compelling application."
  },
  {
    question: "How many cover letters should I write during my job search?",
    answer: "One per application, minimum. Sending the same generic cover letter to 50 companies is worse than sending zero cover letters at all. Recruiters can spot copy and paste applications instantly. Popular tech roles attract hundreds of applications. The candidates who stand out are the ones who clearly researched the company and tailored their letter to the specific role. That does not mean writing every letter from scratch. Use our generator to create a strong base for each role, then spend 5 to 10 minutes customizing it. If you are applying to 20 companies, that is 20 unique cover letters, each taking 15 minutes total including generation and editing. That is a few hours of work for letters that actually say something."
  },
  {
    question: "How does this cover letter generator work for tech jobs?",
    answer: "It reads the job description you paste and matches the skills it asks for against the skills and results you enter. You add the job title, company, your current role and one or two results. The tool generates a professional cover letter that references the specific role and company, highlights your most relevant qualifications, and includes a strong call to action. It is optimized for tech roles including software engineers, DevOps engineers, data scientists, and product managers."
  },
  {
    question: "Is this the best free cover letter builder for software engineers?",
    answer: "Yes, this is the best free cover letter builder for software engineers because it is specifically designed for tech roles. It generates ATS friendly plain text cover letters that pass through Applicant Tracking Systems. The output includes relevant technical keywords from your input in natural context. It keeps letters in a length recruiters will actually read, and checks the final text for stock phrases and missing numbers. And it is completely free with unlimited use, no signup, and no credit card required."
  }
];

export default function CoverLetterPage() {
  const tool = getToolBySlug('ai-cover-letter-generator');

  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />

      <HowToSchema
        name="How to Write a Tech Cover Letter Using AI in 2026"
        description="Step-by-step guide to generating, customizing, and submitting a professional cover letter for software developer and tech roles using the DevelopersMatrix AI Cover Letter Generator."
        url={`${siteConfig.url}/tools/ai-cover-letter-generator`}
        totalTime="PT10M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'AI Cover Letter Generator', 'Job description']}
        step={[
          {
            name: "Paste the full job description",
            text: "Copy the complete job description from the company's careers page or job board posting and paste it into the tool. The tool finds the skills the posting asks for, leads with the ones you share and names one duty from the posting that matches your work. Including the full description rather than just the title produces a much more relevant letter."
          },
          {
            name: "Enter your experience and skills",
            text: "Add your current role and one or two results. Focus on accomplishments with numbers: 'Built a real time data pipeline processing 50K events per second' rather than 'Worked on data pipelines.' List the key skills you would happily be tested on. The tool uses this information to bridge your background with the role's needs, creating natural connections that demonstrate fit."
          },
          {
            name: "Generate the cover letter",
            text: "Click Write my cover letter to get a complete letter with a reference line, greeting, three or four short paragraphs and a closing. It opens with the role and your reason for wanting it, leads with your matching skills and best result, and closes with a clear next step. Choose a formal, warm or direct tone and a short or standard length."
          },
          {
            name: "Add personal touches",
            text: "This step is critical, because recruiters quickly spot letters that could have been sent to any company. Add specific details only you know: mention a company product you use, reference a blog post the CTO wrote, explain why their tech stack aligns with your interests, or share a connection to their mission. These touches transform a generic draft into a compelling personal narrative. Spend 5 minutes on this step; it determines whether the cover letter gets you an interview."
          },
          {
            name: "Review and submit",
            text: "Proofread for accuracy: verify company name spelling, confirm job title matches the posting, and check that technical terms are correct. Ensure the tone matches the company culture. Startups prefer conversational and enthusiastic, while enterprise companies expect formal and measured. Copy the final letter into your email or application portal. Your name, contact details and skills can be remembered on your device, so the next letter takes a minute."
          }
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "AI Cover Letter Generator", url: `${siteConfig.url}/tools/ai-cover-letter-generator` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Cover Letter Generator"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description="Free cover letter generator for developers and tech professionals. Builds a tailored, ATS friendly letter from your own results and the job description, then checks it for stock phrases, missing numbers and keyword gaps. No signup needed."
        url={`${siteConfig.url}/tools/ai-cover-letter-generator`}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero + Tool */}
        <section className="relative isolate border-b border-slate-900/[0.06] dark:border-white/[0.06]">
          {/* Background layer. Clipping lives here, not on the section, so a
              focused field can never scroll the section sideways on phones. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-clip">
            <div className="absolute inset-0 bg-[#f5f6fa] dark:bg-[#07080c]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
            <div className="absolute -top-56 left-[8%] h-[36rem] w-[36rem] rounded-full bg-indigo-300/30 blur-[150px] dark:bg-indigo-500/[0.14]" />
            <div className="absolute top-40 right-[4%] h-[30rem] w-[30rem] rounded-full bg-sky-200/40 blur-[150px] dark:bg-sky-500/[0.08]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-10 sm:pb-16">
            <Link href="/tools" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Back to Tools
            </Link>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Cover letter writer
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white text-balance">
              {tool?.name}
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">{tool?.description}</p>
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["Built from", "Your results and the job posting"],
                ["Checks", "Length, numbers, stock phrases, keywords"],
                ["Price", "Free, no signup, runs in your browser"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <div id="cover-letter-generator" className="scroll-mt-24">
                <CoverLetterClient />
              </div>
              <InContentAd />

              <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
                <div className="min-w-0 rounded-2xl border border-white/70 bg-white/55 p-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/[0.08] dark:bg-slate-900/40 dark:shadow-none sm:p-6">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">How the letter is written</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    The tool reads the job posting and picks out the skills it asks for. It then writes the letter from what you entered: your role, your results, your reason for wanting the job. Skills you share with the posting go first, and one duty from the posting that matches your work is named in the letter.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    It never adds a skill or a result you did not type. If you leave out why you want the company, the letter marks the spot in square brackets instead of filling it with flattery. Random letters and placeholder text are rejected before anything is written.
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    The letter check then looks at length, numbers, stock phrases, keywords from the posting and placeholders, and updates as you edit.
                  </p>
                </div>
                <aside className="min-w-0 rounded-2xl border border-white/70 bg-white/55 p-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/[0.08] dark:bg-slate-900/40 dark:shadow-none">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Related tools</h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {[
                      ["/tools/ai-resume-builder", "AI Resume Builder"],
                      ["/tools/ai-interview-simulator", "Interview Simulator"],
                      ["/tools/salary-estimator", "Salary Estimator"],
                    ].map(([href, label]) => (
                      <Link
                        key={href}
                        href={href}
                        className="rounded-lg border border-slate-900/[0.07] bg-white/70 px-3 py-1.5 text-slate-700 transition-colors hover:border-slate-900/20 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-white"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                  <SidebarAd />
                </aside>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">

              <InContentAd />

              {/* Section 1: Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Free AI Cover Letter Generator for Developers. Write ATS-Friendly Letters in 60 Seconds
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="text-lg leading-relaxed">
                    Here is the problem with cover letters in 2026. Popular tech roles attract hundreds of applications. Most large employers run them through an Applicant Tracking System before a person reads anything. And recruiters have read so many padded, generic letters that they can spot one in a few lines.
                  </p>
                  <p className="leading-relaxed">
                    So cover letters are not dead. They are harder. A generic template gets filtered by ATS. A pure AI draft gets rejected by humans. The winning strategy is a hybrid approach: use a tool to get a strong, structured draft built from your real results, then add the company specific details only you know.
                  </p>
                  <p className="leading-relaxed">
                    The <strong>DevelopersMatrix AI Cover Letter Generator</strong> was built for this exact challenge. It is completely free, requires no signup, and generates a professional cover letter in under a minute. You enter the job title, company name, your experience, and skills. The tool produces a structured letter with a strong opening, relevant qualifications, genuine enthusiasm, and a clear call to action. Then you spend 5 to 10 minutes customizing it with company-specific details that make it unmistakably yours.
                  </p>
                  <p className="leading-relaxed">
                    The result? A cover letter that passes ATS filters, impresses hiring managers, and takes 15 minutes total instead of 45 minutes writing from scratch.
                  </p>
                </div>
              </section>

              {/* Section 2: Why Cover Letters Still Matter */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Cover Letters Still Matter in 2026 (Even With ATS and AI)
                </h2>
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">1</span>
                      They Filter Serious Candidates
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      With hundreds of applications per role, hiring managers need signals of genuine interest. A candidate who writes a tailored cover letter is signaling they care enough about this specific role to spend 15 minutes crafting a message. Candidates who send generic templates are signaling they are applying to every job they see. In a saturated market, that signal matters.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold">2</span>
                      They Explain Gaps and Transitions
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Resumes are rigid. They show what you did, not why you did it. A cover letter is where you explain career transitions, gaps, or non-traditional paths. Switching from backend to frontend? The cover letter is where you tell that story. Took a year off for a health issue? Address it briefly and professionally here. The resume cannot do that.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                      They Demonstrate Communication Skills
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Every software engineering job posting lists "strong communication skills" as a requirement. Your resume does not prove that. Your GitHub profile does not prove that. Your cover letter is the only place in the application where you demonstrate that you can write clearly, structure arguments, and communicate professionally. A well-written cover letter is evidence of the very skill the job requires.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">4</span>
                      They Influence ATS Ranking
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Modern ATS systems do not just check if keywords exist. They rank applications by keyword density, contextual relevance, and match percentage. A cover letter that naturally weaves in keywords from the job description boosts your overall application score. Terms like "React," "microservices" and "CI/CD" all count. A letter that uses the posting's own words, in real sentences, makes the match obvious to both the system and the person reading.
                    </p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Section 3: What Makes a Tech Cover Letter Work */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  The 4 Elements of a Tech Cover Letter That Gets Callbacks
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="leading-relaxed">
                    Keep a tech cover letter between roughly 200 and 400 words. Recruiters skim on the first pass, so every sentence must earn its place. Here are the four elements that separate cover letters that get callbacks from those that get ignored.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Element 1: The Hook That Proves You Did Your Homework</h3>
                  <p className="leading-relaxed">
                    The opening sentence is the most important sentence in your entire application. A weak opening looks like this: "I am writing to express my interest in the Software Engineer position at your company." A strong opening looks like this: "I read your CTO's blog post about migrating from monoliths to microservices, and the approach your team took with feature flags and gradual rollouts is exactly how I would have approached it." The second version proves research, shows technical depth, and establishes immediate relevance.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Element 2: One Quantified Achievement That Screams Impact</h3>
                  <p className="leading-relaxed">
                    Do not list every project you have ever worked on. Pick the one achievement most relevant to the job and describe it with numbers. "At my previous company, I refactored our payment processing module, which reduced API response time from 4.2 seconds to 1.1 seconds and eliminated timeout errors during peak traffic." Numbers make claims credible. Specifics make you memorable. One strong achievement beats a list of ten vague responsibilities.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Element 3: Genuine Enthusiasm, Not Generic Flattery</h3>
                  <p className="leading-relaxed">
                    "I am excited about this opportunity" is generic and invisible. "I have been following your open-source work on the Kafka connector for two years, and the way your team handles backpressure in streaming pipelines is something I would love to learn from directly" is specific and authentic. The difference is evidence. Anyone can say they are excited. Few candidates can explain why with actual knowledge of the company's work. That is the differentiator.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Element 4: A Confident Close With a Clear Next Step</h3>
                  <p className="leading-relaxed">
                    Weak closes say "Thank you for considering my application. I look forward to hearing from you." Strong closes say "I would welcome the opportunity to discuss how my experience with React performance optimization could contribute to your team's goal of cutting page load times in half. I am available for a call next week at your convenience." The strong version is proactive, specific, and makes it easy for the recruiter to say yes. It also signals confidence, which is attractive in any candidate.
                  </p>
                </div>
              </section>

              <InContentAd />

              {/* Section 4: 7 Deadly Mistakes */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  7 Deadly Cover Letter Mistakes Developers Make in 2026
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Submitting Unedited AI Output</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Recruiters can tell when nobody edited a generated letter, and it hurts your chances. A tool gives you a solid foundation. Your job is to add the personal touches that make it yours. A recruiter who reads "I am enthusiastic about leveraging my skills to drive impactful results" knows instantly that you did not write that sentence. Replace generic phrases with your actual voice.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Using the Same Letter for Every Application</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">This is the most common mistake and the most damaging. A generic cover letter signals that you are applying to every job you see rather than targeting roles that genuinely interest you. Recruiters can spot copy-paste applications in seconds. Each letter should reference the specific company, the specific role, and a specific reason you want to work there. That takes 5 minutes of customization per application.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Repeating the Resume Instead of Complementing It</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Your cover letter should not be a prose version of your resume. The resume lists what you did. The cover letter explains why it matters and how it connects to this specific role. If your resume says "Built a payment API with Node.js," your cover letter should say "When I built our payment API with Node.js, I learned the importance of idempotency in financial transactions. That experience directly prepared me for the transaction processing work described in this role." The cover letter adds narrative and context.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Writing Novels Instead of Cover Letters</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">A cover letter longer than one page is a cover letter that will not be read. Roughly 200 to 400 words is the range most recruiters recommend. The first pass is a skim of a few seconds. They are not reading every word. They are skimming for structure, relevance, and enthusiasm. If your letter is two pages, you are signaling that you do not understand brevity, which is a red flag for any engineering role.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Focusing on What You Want Instead of What You Offer</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Weak cover letters say "This role is perfect for my career goals" or "I am looking for an opportunity to grow." The company does not care about your career goals in the application stage. They care about what you can do for them. Strong cover letters flip the perspective: "I noticed your team is expanding the real-time collaboration feature. My experience with WebSocket optimization and conflict-free replicated data types would let me contribute immediately to that effort." Lead with value, not needs.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">6</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Using Fancy Formatting That Breaks ATS</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Canva templates with graphics, two-column layouts, or colored backgrounds look beautiful to humans but break ATS parsers. Most large employers use an ATS. If your cover letter uses a table, a header image, or unusual fonts, the parser might drop half your content or misread it entirely. Stick to plain text, left-aligned, standard font, single spacing. Beauty is worthless if the system cannot read it.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">7</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Forgetting to Proofread</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">A typo in a cover letter is a signal. It says you do not check your work, you rush through details, and you might be equally careless with production code. Run every cover letter through spell check. Read it aloud. Have a friend review it. Then read it one more time before sending. A single typo in the first paragraph can get your application rejected regardless of your technical skills.</p>
                    </div>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Section 5: Cover Letters by Role */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  How to Write a Cover Letter for Different Tech Roles in 2026
                </h2>
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Software Engineer / Full-Stack Developer</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Emphasize breadth and adaptability. Mention specific frameworks and languages from the job posting. Highlight one end-to-end project where you owned frontend, backend, and deployment. Quantify the impact. If the role mentions React and Node.js, your cover letter should reference your React component library or your Node.js API optimization work specifically.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Behavioral focus: collaboration across teams, balancing technical debt with feature delivery, and learning new technologies quickly.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Frontend Developer</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Focus on user experience, performance, and accessibility. Mention Core Web Vitals improvements, responsive design challenges, or accessibility audits you have led. If the company has a design system, reference it and explain how you have worked with similar systems. Include a GitHub or portfolio link in your contact info.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Behavioral focus: working with designers, handling pixel-perfect requirements, and advocating for user-centered decisions.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Backend Developer / API Engineer</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Lead with scalability, reliability, and system design. Mention database optimization, caching strategies, or API design patterns you have implemented. If the role involves microservices, describe your experience with service boundaries, inter-service communication, or distributed tracing. Numbers matter here: "reduced database query time by 60 percent" or "scaled API to handle 10,000 requests per second."
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Behavioral focus: handling production outages, designing for maintainability, and balancing performance with readability.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">DevOps / Site Reliability Engineer</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Emphasize infrastructure automation, monitoring, and incident response. Mention specific tools: Kubernetes, Terraform, Prometheus, or GitHub Actions. Describe a time you reduced deployment time, improved observability, or handled a critical outage. Companies hiring DevOps engineers want to know you can keep systems running while the team ships features.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Behavioral focus: on-call experiences, blameless postmortems, and advocating for reliability investments.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Scientist / Machine Learning Engineer</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Focus on model performance, business impact, and data pipeline design. Mention specific models, frameworks, or techniques from the job posting. Quantify model accuracy improvements or business metrics your work influenced. If the role involves MLOps, describe your experience with model versioning, A/B testing, or deployment pipelines.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Behavioral focus: explaining complex results to non-technical stakeholders, handling ambiguous data, and iterating on model failures.
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Manager / Technical Program Manager</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">
                      Emphasize cross-functional leadership, stakeholder management, and data-driven decision making. Mention specific products or features you have shipped and the metrics they improved. If the role involves technical depth, reference your engineering background and how it helps you communicate with developers. If it is more business-focused, highlight customer research, roadmap prioritization, or go-to-market strategy.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Behavioral focus: managing conflicting priorities, saying no to feature requests, and aligning technical and business goals.
                    </p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Section: Cover Letter Generator for Tech Jobs */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Cover Letter Generator for Tech Jobs: Why It Matters in 2026
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="text-lg leading-relaxed">
                    Tech jobs in 2026 are more competitive than ever, and popular roles attract hundreds of applications. A cover letter generator for tech jobs helps you stand out by creating personalized, keyword-optimized letters that pass ATS filters and impress hiring managers.
                  </p>
                  <p className="leading-relaxed">
                    Our tool is specifically designed for software engineers, DevOps engineers, data scientists, product managers, and all tech professionals. It understands the language of tech hiring and generates letters that reference relevant skills, technologies, and achievements. Unlike generic cover letter generators, ours produces output that sounds like it was written by someone who understands the difference between React and Angular, between CI/CD and manual deployment.
                  </p>
                  <p className="leading-relaxed">
                    The best part? It is completely free and requires no signup. Generate unlimited cover letters for every job application, customize them with company-specific details, and submit with confidence. Because every line comes from your own details, the draft is already personal, and the letter check shows exactly what to tighten.
                  </p>
                </div>
              </section>

              <InContentAd />

              {/* Section 6: Internal Links */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Complete Your Job Application Toolkit
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  A great cover letter is one piece of a strong application. Here are the other free tools from DevelopersMatrix that work together to help you land the job:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a
                    href="/tools/ai-resume-builder"
                    className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                      AI Resume Builder
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Build an ATS-optimized resume that matches your cover letter. Use consistent keywords across both documents for maximum ATS score.
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
                      Practice behavioral and technical interviews with instant AI feedback. The cover letter gets you the interview. This tool helps you ace it.
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
                      Know your market worth before the salary conversation. Compare compensation by role, location, and experience level across the tech industry.
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
                      Check your portfolio site's speed and SEO. Make sure recruiters see a fast, professional site when they click your portfolio link.
                    </p>
                  </a>
                  <a
                    href="/tools/productivity-planner"
                    className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                      Productivity Planner
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Track your job search progress, schedule application deadlines, and manage follow-ups. Stay organized during the hunt.
                    </p>
                  </a>
                  <a
                    href="/tools"
                    className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all hover:shadow-md"
                  >
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
                      View All 20+ Free Tools →
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Explore habit trackers, budget planners, startup idea generators, and more. Everything you need to grow your career.
                    </p>
                  </a>
                </div>
              </section>

              <InContentAd />

              {/* Section 7: 3-Phase Approach */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  The 3-Phase Approach to Writing Tech Cover Letters That Work
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="leading-relaxed">
                    Writing a cover letter is not a single task. It is a three-phase process that balances speed with quality. Here is the exact workflow we recommend.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Phase 1: Research (5 Minutes)</h3>
                  <p className="leading-relaxed">
                    Before writing a single word, spend five minutes on research. Read the job description twice. The first time, note the required skills and qualifications. The second time, note the language they use. Do they say "fast-paced environment" or "careful deliberation"? Do they emphasize "innovation" or "reliability"? Mirror their language in your letter. Then read the company's engineering blog or recent product announcements. Find one specific detail to reference in your opening hook. This research is what transforms a generic letter into a compelling one.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Phase 2: Generate and Customize (10 Minutes)</h3>
                  <p className="leading-relaxed">
                    Use our cover letter generator to create your foundation. Enter the job title, company name, your current role, your best results and why you want the job. The tool produces a structured letter with all four essential elements: hook, achievement, enthusiasm, and close. Then customize it. Replace generic phrases with your voice. Add the company-specific detail you found in Phase 1. Verify that every technical term matches your actual experience level. Adjust the tone to match the company culture: more formal for banks and enterprises, more conversational for startups. This phase should take about 10 minutes.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Phase 3: Review and Submit (5 Minutes)</h3>
                  <p className="leading-relaxed">
                    In the final phase, proofread ruthlessly. Read the letter aloud. If any sentence sounds awkward or generic, rewrite it. Check every technical term for accuracy. Verify that you have not accidentally left placeholder text or incorrect company names from a previous application. Run spell check. Then save the file with a clear naming convention: "<span className="break-all">CoverLetter_CompanyName_Position_Date</span>." This helps you track applications and avoids the catastrophic mistake of sending the wrong letter to the wrong company.
                  </p>
                  <p className="leading-relaxed">
                    Total time per application: 20 minutes. Writing from a blank page usually takes much longer. When a role attracts hundreds of applications, those 20 minutes are a good investment.
                  </p>
                </div>
              </section>

              <InContentAd />

              {/* Section 8: FAQ Accordion */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions About AI Cover Letter Writing
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
                <div className="rounded-3xl bg-slate-900 p-8 text-white text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Write Your First Cover Letter in 60 Seconds. It is Free
                  </h2>
                  <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                    Paste the posting, add your best result, and get a letter that sounds like you. No signup. No credit card.
                  </p>
                  <a
                    href="#cover-letter-generator"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                  >
                    Generate Your Free Cover Letter
                  </a>
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
                      <a href="/tools/ai-resume-builder" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        AI Resume Builder
                      </a>
                    </li>
                    <li>
                      <a href="/tools/ai-interview-simulator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Interview Simulator
                      </a>
                    </li>
                    <li>
                      <a href="/tools/salary-estimator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Salary Estimator
                      </a>
                    </li>
                    <li>
                      <a href="/blog/ats-resume-guide-2026" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        ATS Resume Optimization Guide
                      </a>
                    </li>
                    <li>
                      <a href="/blog/5-job-offers-30-days-ai" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        5 Job Offers in 30 Days
                      </a>
                    </li>
                    <li>
                      <a href="/trends/remote-tech-jobs-guide-2026" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                        Remote Tech Jobs Guide
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">A strong letter has</h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li><span className="font-semibold text-gray-900 dark:text-white">A real reason.</span> Why this company, in one specific line.</li>
                    <li><span className="font-semibold text-gray-900 dark:text-white">One number.</span> A result someone can picture.</li>
                    <li><span className="font-semibold text-gray-900 dark:text-white">The posting&rsquo;s words.</span> Skills you share, used in real sentences.</li>
                    <li><span className="font-semibold text-gray-900 dark:text-white">No filler.</span> No stock lines like team player or passionate about.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
