import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
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
  const toolFaqsForSchema = toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }));

  return (
    <>
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
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <FAQSchema faqs={toolFaqsForSchema} />

      <HowToSchema
        name="How to Use the AI Prompt Library for Better Results"
        description="Step-by-step guide to finding, testing, and customizing AI prompts from the DevelopersMatrix Prompt Library for ChatGPT, Claude, and other AI tools."
        url={`${siteConfig.url}/tools/ai-prompt-library`}
        totalTime="PT5M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'AI Prompt Library', 'Clipboard']}
        step={[
          {
            name: "Choose a prompt category",
            text: "Browse 12 curated categories including Writing, Coding, Design, Marketing, Research, Data Science, and Business Strategy. Each category contains 40-60 professionally crafted prompts rated by effectiveness. Start with the category closest to your current task rather than searching randomly."
          },
          {
            name: "Select a high-rated prompt",
            text: "Prompts are rated by community effectiveness scores. Top-rated prompts appear first and have been tested by hundreds of users. Read the usage notes to understand what variables to customize and what output to expect. A well-rated prompt saves 10-20 minutes of trial-and-error compared to writing from scratch."
          },
          {
            name: "Customize the variables",
            text: "Every prompt includes placeholder variables marked in brackets or parentheses. Replace these with your specific context: [topic], [audience], [tone], [format], [length]. The more specific your replacements, the better the AI output. For example, replace 'Write about [topic]' with 'Write a technical blog post about React Server Components for senior frontend developers, 1,500 words, professional tone.'"
          },
          {
            name: "Test in the AI Playground",
            text: "Paste your customized prompt into the built-in AI Playground to test output quality before using it in production. The playground supports text generation, code generation, and creative writing. Iterate on the prompt 2-3 times if the first output is not satisfactory — small wording changes often produce dramatically different results."
          },
          {
            name: "Save to your personal library",
            text: "Click the save button to store the prompt in your personal library. Organize saved prompts into custom collections for different projects or workflows. Export your library as a text file for offline use. All saved data stays in your browser for privacy."
          }
        ]}
      />

      <main className="pt-16">
        {/* Tool Interface */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div id="ai-prompt-library">
                <AIPromptLibraryClient />
              </div>
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">AI Prompt Stats 2026</h3>
                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex justify-between items-center">
                    <span>ChatGPT daily active users</span>
                    <span className="font-semibold text-gray-900 dark:text-white">300M+</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Output quality increase with good prompts</span>
                    <span className="font-semibold text-gray-900 dark:text-white">340%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Professionals who use AI prompts daily</span>
                    <span className="font-semibold text-gray-900 dark:text-white">67%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Time saved per task with good prompts</span>
                    <span className="font-semibold text-gray-900 dark:text-white">55%</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Prompt marketplaces charging per prompt</span>
                    <span className="font-semibold text-gray-900 dark:text-white">$0.99-5.00</span>
                  </li>
                </ul>
              </div>
              <SidebarAd />
            </div>
          </div>
        </div>

        <InContentAd />

        {/* SEO Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">

              {/* Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Why Prompt Quality Determines Your AI Results in 2026
                </h2>
                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
                  <p className="text-lg leading-relaxed">
                    The quality of AI output is determined almost entirely by the quality of the prompt. A vague request like "write a blog post about productivity" produces generic, forgettable content. A structured prompt with context, role assignment, format specification, and examples produces content that feels written by a domain expert. The difference is not the AI model. It is the human behind the keyboard.
                  </p>
                  <p className="leading-relaxed">
                    The problem is that crafting excellent prompts takes time and expertise. You need to understand prompt engineering principles like chain-of-thought reasoning, few-shot examples, role-based prompting, and output formatting. Most people do not have hours to spend learning these techniques. The <strong>DevelopersMatrix AI Prompt Library</strong> solves this by providing 500+ professionally crafted prompts across every major use case. Find a prompt, customize the variables, and get expert-level output without the expert-level learning curve.
                  </p>
                </div>
              </section>

              <InContentAd />

              {/* Features */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Four Features That Unlock Better AI Results
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold">1</span>
                      500+ Curated Prompts
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Browse prompts organized by category and rated by effectiveness. Each prompt includes clear instructions on what variables to customize. Categories cover writing, coding, design, marketing, research, data science, education, business, creative projects, and personal productivity.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-sm font-bold">2</span>
                      AI Playground Sandbox
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Test prompts directly in the built-in playground. See output instantly, adjust variables, and iterate. This eliminates the guesswork of copying prompts to external tools. The playground supports text generation, code generation, and creative writing workflows.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-bold">3</span>
                      Save and Organize
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Save any prompt to your personal library with one click. Organize into custom collections for different projects. Export your library as a text file. Share individual prompts or collections via unique links. Build a prompt toolkit that grows with your needs.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center text-sm font-bold">4</span>
                      Community Ratings
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      Every prompt is rated by the community for effectiveness, clarity, and consistency. Top-rated prompts appear first in each category. This crowdsourced quality control ensures you are using prompts that actually work, not theoretical templates that look good but produce weak output.
                    </p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Mistakes */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Five Prompt Mistakes That Waste Your AI Subscription
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Vague, Open-Ended Requests</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">"Write something good about marketing" is the fastest path to generic output. The AI has no context about your industry, audience, tone, or goal. It defaults to safe, boring generalizations that sound like they came from a textbook.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Use structured prompts with role, context, format, and constraints. "You are a SaaS marketing director. Write a 500-word blog post about email onboarding sequences for B2B software. Include 3 specific examples. Tone: professional but conversational." This prompt produces content that is immediately usable.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Not Assigning a Role</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Without a role assignment, the AI defaults to a generic helpful assistant persona. That works for simple questions but fails for specialized tasks. A coding question answered by a generic assistant is less precise than one answered by an assigned "senior backend engineer."</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Start every prompt with a role assignment. "You are an experienced Python developer specializing in Django REST APIs." "You are a UX researcher with 10 years of experience." The role frames the knowledge, tone, and perspective of the response.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Forgetting Format Specifications</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">You ask for a comparison of two frameworks and get a wall of text. You wanted a structured table. You ask for a project plan and get paragraphs. You wanted bullet points with timelines. Without format instructions, the AI chooses its own output structure, which rarely matches your needs.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Specify output format explicitly. "Format as a comparison table with columns for Feature, Framework A, Framework B, and Winner." "Format as bullet points with estimated hours for each task." The library includes prompts with format specifications built in.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No Examples for Complex Tasks</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">For tasks like rewriting content in your brand voice, summarizing technical documents, or generating structured data, the AI needs examples to calibrate its output. Without examples, it guesses at your preferences and often misses.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Include 1 to 3 examples in your prompt. "Here are 3 examples of our brand voice. Rewrite the following paragraph to match this style." The library's few-shot prompts include example slots that you fill with your own content.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Treating the First Output as Final</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">The first response from an AI is rarely the best possible output. Most users accept the first draft, make minor edits, and move on. They are leaving significant quality on the table. Iterative refinement is where the real magic happens.</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mt-1"><strong className="text-gray-900 dark:text-white">Fix:</strong> Use the AI Playground to test prompts and iterate. Run the prompt, evaluate the output, adjust one variable, and run again. Three iterations with minor tweaks almost always produce better results than the first draft. The library includes iteration prompts specifically designed for this refinement workflow.</p>
                    </div>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Use Cases */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Who Benefits From the AI Prompt Library
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Writers and Content Creators</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Blog post outlines, headline generation, SEO meta descriptions, social media captions, email sequences, and long-form article drafting. The writing prompts cover everything from brainstorming to final editing.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Developers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Code generation, debugging assistance, algorithm explanations, API documentation, test case generation, and code review prompts. The coding prompts include language-specific templates for Python, JavaScript, TypeScript, Go, Rust, and more.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Designers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Midjourney and Stable Diffusion prompts for image generation. UX copy generation, design critique frameworks, color palette suggestions, and accessibility compliance checks. The visual prompts produce specific, actionable design output.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Marketers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Ad copy generation, landing page optimization, A-B test ideas, customer persona creation, competitive analysis, and campaign planning. The marketing prompts include framework-based templates like AIDA, PAS, and StoryBrand.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Scientists</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Data analysis scripts, visualization suggestions, statistical interpretation, model selection guidance, and report generation. The data science prompts handle everything from exploratory analysis to presentation-ready insights.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Entrepreneurs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Pitch deck copy, business plan sections, investor email templates, market research prompts, and competitive analysis frameworks. The business prompts are designed for founders who need to communicate clearly under time pressure.</p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* Internal Links */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Complete Your AI Toolkit
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  AI prompts are just one part of a complete AI workflow. Here are the other free tools from DevelopersMatrix that help you generate, refine, and verify AI-powered content:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <a href="/tools/ai-content-detector" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">AI Content Detector</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Detect AI-generated text. Ensure your blog posts pass human quality standards and avoid Google penalties.</p>
                  </a>
                  <a href="/tools/ai-email-assistant" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">AI Email Assistant</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Draft professional emails in seconds, rewrite for clarity, adjust tone, and generate perfect responses.</p>
                  </a>
                  <a href="/tools/ai-resume-builder" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">AI Resume Builder</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Build an ATS-optimized resume in minutes. Perfect for developers, designers, and tech professionals.</p>
                  </a>
                  <a href="/tools/ai-cover-letter-generator" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">Cover Letter Generator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate personalized cover letters tailored to specific job descriptions. Save hours of writing time.</p>
                  </a>
                  <a href="/tools/ai-interview-simulator" className="group block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">Interview Simulator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Practice technical and behavioral interviews with AI feedback. Build confidence before your next job interview.</p>
                  </a>
                  <a href="/tools" className="group block bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 shadow-sm border border-blue-100 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md">
                    <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">View All 20+ Free Tools →</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Explore interview simulators, salary estimators, budget planners, and more free career tools.</p>
                  </a>
                </div>
              </section>

              <InContentAd />

              {/* Workflow */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  How to Use Any Prompt in 60 Seconds
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mb-3">1</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Browse and Select (20 seconds)</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Filter prompts by category or search by keyword. Each prompt shows its rating, category, and a preview of what it does. Select the prompt that matches your current task. The curated library means you spend seconds finding the right prompt instead of hours crafting one from scratch.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mb-3">2</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customize Variables (20 seconds)</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Every prompt includes clearly marked variables like [topic], [audience], or [tone]. Replace these with your specific information. "Write a blog post about [topic] for [audience]" becomes "Write a blog post about Kubernetes for junior developers." The structure stays intact while the content becomes yours.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold mb-3">3</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Test and Refine (20 seconds)</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Paste the customized prompt into the AI Playground and run it. Evaluate the output. If it needs adjustment, tweak one variable and try again. Three quick iterations almost always produce better results than the first draft. Save the final prompt to your library for future reuse.</p>
                  </div>
                </div>
              </section>

              <InContentAd />

              {/* FAQ */}
              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions About the AI Prompt Library
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

              {/* CTA */}
              <section className="mb-12">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Stop Writing Bad Prompts. Start Getting Great Results
                  </h2>
                  <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                    Join 1,800+ professionals using curated prompts to unlock AI potential. Free, always updated, and built for real work.
                  </p>
                  <a
                    href="#ai-prompt-library"
                    className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
                  >
                    Browse Prompts Now
                  </a>
                  <p className="text-purple-200 text-sm mt-4">
                    500+ prompts for ChatGPT, Claude, Midjourney, and more. No signup required.
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
                      <a href="/tools/ai-content-detector" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>🔍</span> AI Content Detector
                      </a>
                    </li>
                    <li>
                      <a href="/tools/ai-email-assistant" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>📧</span> AI Email Assistant
                      </a>
                    </li>
                    <li>
                      <a href="/tools/ai-resume-builder" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>📄</span> AI Resume Builder
                      </a>
                    </li>
                    <li>
                      <a href="/tools/ai-cover-letter-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>✉️</span> Cover Letter Generator
                      </a>
                    </li>
                    <li>
                      <a href="/tools/startup-idea-generator" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>💡</span> Startup Idea Generator
                      </a>
                    </li>
                    <li>
                      <a href="/trends/chatgpt-advanced-prompts-2026" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>🤖</span> ChatGPT Advanced Prompts 2026
                      </a>
                    </li>
                    <li>
                      <a href="/blog/ai-tools-developers-2026" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>🛠️</span> AI Tools for Developers 2026
                      </a>
                    </li>
                    <li>
                      <a href="/trends/ai-coding-assistants-comparison-2026" className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2">
                        <span>💻</span> AI Coding Assistants Compared
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">2026 AI Prompt Stats</h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">300M+</span>
                      <span>ChatGPT daily active users worldwide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">340%</span>
                      <span>output quality increase with well-crafted prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">67%</span>
                      <span>of professionals now use AI prompts daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 font-bold">55%</span>
                      <span>time saved per task when using curated prompts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Free AI Prompt Library: 500+ Curated Prompts for ChatGPT, Claude, and Gemini
          </h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            The quality of AI output depends entirely on the quality of your input. A vague prompt like "write a blog post" gets generic results. A structured prompt with role, context, format, and constraints gets publication-ready content. Our <strong>free AI prompt library</strong> contains 500+ professionally crafted prompts for writing, coding, marketing, research, and productivity. Each prompt is tested and optimized for the best results from ChatGPT, Claude, Gemini, and other major AI models.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Why Prompt Engineering Matters in 2026
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            With 300 million daily ChatGPT users, the difference between average and excellent AI output is widening. Research shows that well-crafted prompts produce 340% better results than vague ones. But most people do not have time to engineer prompts from scratch. Our <strong>AI prompt library</strong> solves this by giving you ready-to-use, tested prompts for every common use case. Copy, paste, and get professional results instantly.
          </p>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            The prompts in our library follow the RISEN framework: Role, Instructions, Steps, End goal, and Narrowing. This structure ensures AI models understand exactly what you need and deliver consistent, high-quality output. Whether you are writing technical documentation, generating marketing copy, or debugging code, there is a prompt optimized for your task.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Prompt Categories Available
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">✍️ Writing & Content</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Blog posts, social media captions, email sequences, technical documentation, and creative writing prompts.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💻 Coding & Development</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Code review, debugging, algorithm explanation, documentation generation, and refactoring suggestions.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📊 Marketing & SEO</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Keyword research, meta descriptions, ad copy, landing page content, and competitor analysis prompts.</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🎯 Productivity & Career</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Meeting summaries, task prioritization, resume optimization, interview prep, and goal-setting prompts.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
            Related Tools for AI Productivity
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            <a href="/tools/ai-content-detector" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">🔍</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Content Detector</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Check if text is AI-generated</p>
              </div>
            </a>
            <a href="/tools/ai-email-assistant" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">✉️</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Email Assistant</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Write professional emails instantly</p>
              </div>
            </a>
            <a href="/tools/startup-idea-generator" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">💡</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">Startup Idea Generator</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Generate business ideas with AI</p>
              </div>
            </a>
            <a href="/blog" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <span className="text-lg">📚</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">AI Guides</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Learn prompt engineering and AI tips</p>
              </div>
            </a>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-200 mb-2">
              Start Using Better Prompts Today
            </h3>
            <p className="text-purple-800 dark:text-purple-300 text-sm mb-4">
              Stop guessing and start getting professional results. Browse 500+ tested prompts and copy the ones that fit your needs.
            </p>
            <p className="text-purple-700 dark:text-purple-400 text-xs">
              100% free. No signup. Updated for 2026 AI models.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
