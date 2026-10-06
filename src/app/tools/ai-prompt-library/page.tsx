import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { PROMPTS } from "@/lib/prompts/library";
import { CATEGORIES } from "@/lib/prompts/types";
import AIPromptLibraryClient from "./AIPromptLibraryClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-prompt-library']);

// Counts come from the library itself, so the page never claims more than it has.
const TOTAL = PROMPTS.length;
const CATEGORY_COUNT = CATEGORIES.length;
const IMAGE_COUNT = PROMPTS.filter((p) => p.kind === 'image').length;

const toolFaqs = [
  {
    question: "Is the AI Prompt Library free?",
    answer: `Yes. All ${TOTAL} prompts are free to use, with no signup and no limits. You can browse, fill in, copy and save as many as you like.`
  },
  {
    question: "What is the AI Prompt Library?",
    answer: `A collection of ${TOTAL} ready to use prompts for ChatGPT, Claude, Gemini and image tools like Midjourney, grouped into ${CATEGORY_COUNT} categories: Coding, Writing, Marketing, Business, Career, Learning, Productivity and Creative. Each prompt gives the AI a clear role, the context it needs, the steps to follow and the format to answer in.`
  },
  {
    question: "How does the prompt builder work?",
    answer: "Each prompt has a few blanks in square brackets, such as [Topic] or [Paste your code]. When you open a prompt, every blank becomes a field. As you type, the prompt updates and highlights what you have filled in and what is still empty. When you are done, copy it or open it straight in ChatGPT or Claude."
  },
  {
    question: "Can I open a prompt directly in ChatGPT or Claude?",
    answer: "Yes. For chat prompts, the Open in ChatGPT and Open in Claude buttons open a new tab with your filled in prompt already in place. Very long prompts, for example with a lot of pasted code, are too long to send in a link, so the tool asks you to copy and paste those instead. Image prompts are meant to be copied into Midjourney, DALL·E, Stable Diffusion or a similar tool."
  },
  {
    question: "Can I save prompts?",
    answer: "Yes. Use the bookmark on any prompt to add it to your Saved list. Saved prompts are stored in your own browser, so they stay on this device and are not uploaded anywhere. You can also copy a link to any prompt to share it."
  },
  {
    question: "Is what I type into the blanks private?",
    answer: "What you type stays in your browser. Nothing is sent to DevelopersMatrix. It only leaves your device when you copy the prompt or choose to open it in ChatGPT or Claude, which then works under that service's own privacy rules. Avoid pasting passwords, keys or personal data about other people into any AI tool."
  },
  {
    question: "Do I need to know prompt engineering to use this?",
    answer: "No. The prompts already follow the habits that make AI answers better: a role, specific context, clear steps and an output format. You only fill in your details. Using them for a while is also a good way to learn how strong prompts are put together."
  },
  {
    question: "Will these prompts work with every AI model?",
    answer: "The chat prompts are written in plain language and work with ChatGPT, Claude, Gemini, Copilot and other chat assistants. Results vary between models and versions, so treat the first answer as a draft, check facts that matter and ask follow up questions to refine it."
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
        description={`Free library of ${TOTAL} ready to use AI prompts for ChatGPT, Claude, Gemini and Midjourney, with a builder that fills in the blanks. No signup.`}
        url={`${siteConfig.url}/tools/ai-prompt-library`}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <FAQSchema faqs={toolFaqsForSchema} />

      <HowToSchema
        name="How to Use the AI Prompt Library"
        description="Find a prompt, fill in the blanks and use it in ChatGPT, Claude or another AI tool."
        url={`${siteConfig.url}/tools/ai-prompt-library`}
        totalTime="PT2M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'AI Prompt Library']}
        step={[
          {
            name: "Find a prompt",
            text: `Search the library or browse the ${CATEGORY_COUNT} categories. Use the Chat and Image filter to see prompts for chat assistants or for image generators.`
          },
          {
            name: "Fill in the blanks",
            text: "Open the prompt. Each blank in square brackets becomes a field. Type your details and watch the prompt update as you go."
          },
          {
            name: "Copy it or open it in an AI tool",
            text: "Copy the finished prompt, or open it directly in ChatGPT or Claude with your details already filled in."
          },
          {
            name: "Refine the answer",
            text: "Treat the first answer as a draft. Ask a follow up question, add an example or change one detail and run it again."
          },
          {
            name: "Save the prompts you use often",
            text: "Bookmark a prompt to keep it in your Saved list in this browser, or copy its link to share it."
          }
        ]}
      />

      <main className="pt-16">
        {/* Hero: dotted grid with a sample prompt card */}
        <section className="relative isolate border-b border-zinc-200 dark:border-zinc-800">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-zinc-50 [background-image:radial-gradient(rgba(113,113,122,0.28)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)] dark:bg-zinc-950 dark:[background-image:radial-gradient(rgba(161,161,170,0.16)_1px,transparent_1px)]"
          />
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:px-8 lg:pb-14 lg:pt-12">
            <div className="min-w-0">
              <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
                <Link href="/tools" className="hover:text-zinc-900 dark:hover:text-white">Tools</Link>
                <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
                <span className="text-zinc-700 dark:text-zinc-300">AI Prompt Library</span>
              </nav>
              <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                Free AI Prompt Library for ChatGPT and Claude
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                {TOTAL} ready to use prompts for coding, writing, marketing, careers and more. Fill in the blanks, then copy the prompt or open it straight in ChatGPT or Claude.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2 text-sm">
                {[
                  `${TOTAL} prompts`,
                  `${CATEGORY_COUNT} categories`,
                  `${IMAGE_COUNT} image prompts`,
                  'No signup',
                ].map((t) => (
                  <li key={t} className="rounded-full border border-zinc-200 bg-white px-3 py-1 font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <figure aria-hidden="true" className="hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:block">
              <figcaption className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Writing</span>
                <span className="text-zinc-400">2 of 3 filled</span>
              </figcaption>
              <p className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">Write a Professional Email</p>
              <p className="mt-3 whitespace-pre-line rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-[12.5px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                Write an email to{' '}
                <mark className="rounded bg-emerald-100 px-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">my landlord, Mr Patel</mark>.
                {'\n\n'}What I need to say:{'\n'}
                <mark className="rounded bg-emerald-100 px-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200">the kitchen tap has leaked for a week</mark>
                {'\n\n'}What I want them to do:{' '}
                <mark className="rounded bg-amber-100 px-0.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200">[The action you want]</mark>
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-medium">
                <span className="rounded-lg bg-zinc-900 py-2 text-white dark:bg-white dark:text-zinc-900">Copy prompt</span>
                <span className="rounded-lg border border-zinc-300 py-2 text-zinc-700 dark:border-zinc-700 dark:text-zinc-200">Open in ChatGPT</span>
              </div>
            </figure>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-[1400px] px-2 pt-6 sm:px-6 lg:px-8">
          <div id="ai-prompt-library" className="scroll-mt-20">
            <AIPromptLibraryClient />
          </div>
        </div>

        <InContentAd />

        {/* SEO Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  Why Prompt Quality Determines Your AI Results in 2026
                </h2>
                <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 space-y-4">
                  <p className="text-lg leading-relaxed">
                    The same AI model can give you a generic answer or a genuinely useful one, and the difference is mostly the prompt. A vague request like "write a blog post about productivity" gets safe, forgettable text. A prompt that gives the model a role, your real context, clear steps and the format you want gets something you can actually use.
                  </p>
                  <p className="leading-relaxed">
                    Writing prompts like that every time is slow. The <strong>DevelopersMatrix AI Prompt Library</strong> gives you {TOTAL} prompts that already have that structure. You pick one, fill in a few blanks with your details and use it in ChatGPT, Claude, Gemini or an image tool.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  What You Can Do With the Prompt Library
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    ["Fill in the blanks", "Every blank in square brackets becomes a field. The prompt updates as you type, with filled parts highlighted in green and empty ones in amber, so nothing gets sent half finished."],
                    ["Open it in ChatGPT or Claude", "Send a finished chat prompt straight to ChatGPT or Claude in a new tab, already filled in. Or copy it for Gemini, Copilot or any other assistant."],
                    [`Search ${TOTAL} prompts`, `Search by task or keyword, browse ${CATEGORY_COUNT} categories, and switch between chat prompts and image prompts for Midjourney, DALL·E and Stable Diffusion.`],
                    ["Save and share", "Bookmark the prompts you use often. They are kept in your browser, not on our servers. Copy a link to any prompt to send it to a teammate."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">{t}</h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  Five Prompt Mistakes That Waste Your AI Subscription
                </h2>
                <ol className="space-y-6">
                  {[
                    ["Vague, open ended requests", "\"Write something good about marketing\" gives the AI nothing to work with. It has no idea of your industry, audience, tone or goal, so it falls back on safe generalisations.", "Give it a role, context, a format and limits. \"You are a SaaS marketing lead. Write a 500 word post about onboarding emails for B2B software, with three examples, in a plain and friendly tone.\""],
                    ["Not assigning a role", "Without a role, the AI answers as a general assistant. That is fine for simple questions but weak for specialist work.", "Start with who it should be: \"You are an experienced Python developer who works with Django REST APIs.\" The role shapes the knowledge, tone and level of detail."],
                    ["Forgetting the output format", "You wanted a table and got a wall of text. You wanted a checklist and got paragraphs.", "Say exactly how you want the answer laid out, for example \"a table with columns for Feature, Option A and Option B\". Most prompts in this library already include a format."],
                    ["No examples for complex tasks", "For writing in your brand voice or producing structured data, the AI has to guess your preferences, and it often guesses wrong.", "Include one to three short examples of what good looks like. Even a single example changes the output a lot."],
                    ["Treating the first answer as final", "The first answer is a draft. Most people accept it, tweak a few words and move on.", "Reply with what to change: \"shorter\", \"more specific to small shops\", \"use simpler words\". Two or three rounds usually beat the first draft by a clear margin."],
                  ].map(([t, p, fix], i) => (
                    <li key={t} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{t}</h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{p}</p>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mt-1"><strong className="text-zinc-900 dark:text-white">Fix:</strong> {fix}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  Who Benefits From the AI Prompt Library
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ["Developers", "Debugging, code review, unit tests, refactoring, SQL, regular expressions and documentation, with blanks for your language and code."],
                    ["Writers and content creators", "Blog outlines, editing, proofreading, tone rewrites, summaries and headline ideas that keep your own voice."],
                    ["Marketers", "SEO titles and meta descriptions, ad copy variations, landing pages, newsletters, personas and keyword clusters."],
                    ["Founders and managers", "SWOT analysis, business plan sections, pricing options, pitch deck outlines, decision matrices and cold outreach."],
                    ["Job seekers", "Tailored resume bullets, STAR interview answers, mock interviews, salary negotiation scripts and follow up emails."],
                    ["Students and lifelong learners", "Study plans, Socratic tutoring, practice quizzes, flashcards and plain language guides to research papers."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{t}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  Complete Your AI Toolkit
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 mb-6 leading-relaxed">
                  Other free tools from DevelopersMatrix that pair well with a good prompt:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    ["/tools/ai-content-detector", "AI Content Detector", "Check whether a piece of text reads as AI written before you publish it."],
                    ["/tools/ai-email-assistant", "AI Email Assistant", "Draft and rewrite emails for different tones and situations."],
                    ["/tools/ai-resume-builder", "AI Resume Builder", "Write an ATS friendly resume with a live check on every bullet."],
                    ["/tools/ai-cover-letter-generator", "Cover Letter Generator", "Build a cover letter around the job posting and your own experience."],
                    ["/tools/ai-interview-simulator", "Interview Simulator", "Practise interview questions and see what your answers covered and missed."],
                    ["/tools", "View all free tools", "Planners, trackers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-emerald-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700">
                      <h3 className="font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 mb-2">{t}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{d}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  How to Use Any Prompt in 60 Seconds
                </h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    ["Find it", "Search for your task or open a category. Each card tells you what the prompt does and how many blanks it has."],
                    ["Fill it", "Type your details into the fields. \"Write a blog post about [Topic] for [Reader]\" becomes \"Write a blog post about Kubernetes for junior developers\"."],
                    ["Use it", "Copy it or open it in ChatGPT or Claude. Read the answer, then reply with one change to make it better."],
                  ].map(([t, d], i) => (
                    <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold mb-3">{i + 1}</span>
                      <h3 className="font-semibold text-zinc-900 dark:text-white mb-2">{t}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
                  Frequently Asked Questions About the AI Prompt Library
                </h2>
                <div className="space-y-3">
                  {toolFaqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-zinc-900 dark:text-white">
                        {faq.question}
                        <span aria-hidden="true" className="text-zinc-400 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <div className="border-t border-zinc-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <div className="rounded-3xl bg-zinc-900 p-8 text-center text-white dark:bg-zinc-800">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Stop Writing Prompts From Scratch
                  </h2>
                  <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
                    Pick a prompt, fill in your details and get a better first answer. Free, no signup.
                  </p>
                  <a
                    href="#ai-prompt-library"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-zinc-900 transition-colors hover:bg-zinc-100"
                  >
                    Browse the prompts
                  </a>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">A strong prompt has</h3>
                  <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <li><span className="font-semibold text-zinc-900 dark:text-white">A role.</span> Who the AI should be.</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Context.</span> Your situation, audience and goal.</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Steps.</span> What to do, in order.</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">A format.</span> How the answer should look.</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Limits.</span> Length, tone and what to avoid.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-4">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/trends/chatgpt-advanced-prompts-2026", "ChatGPT Advanced Prompts 2026"],
                      ["/blog/ai-tools-developers-2026", "AI Tools for Developers 2026"],
                      ["/trends/ai-coding-assistants-comparison-2026", "AI Coding Assistants Compared"],
                      ["/tools/startup-idea-generator", "Startup Idea Generator"],
                      ["/tools/ai-content-detector", "AI Content Detector"],
                    ].map(([href, t]) => (
                      <li key={href}>
                        <Link href={href} className="text-emerald-700 hover:underline dark:text-emerald-400">{t}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SEO Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-6">
            Free AI Prompt Library: {TOTAL} Ready Prompts for ChatGPT, Claude, and Gemini
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            Our <strong>free AI prompt library</strong> collects {TOTAL} prompts for real tasks: fixing code, editing writing, planning campaigns, preparing for interviews, studying and creating images. Each one is written in plain language so it works across ChatGPT, Claude, Gemini and other assistants, and each one comes with a short tip for getting a better answer.
          </p>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-8 mb-4">
            How the Prompts Are Built
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
            Every chat prompt follows the same pattern. It tells the AI who to be, gives it the context you fill in, lists the steps to follow and sets the format of the answer. Where a model might be tempted to make things up, the prompt tells it to ask you or to mark the gap instead. That pattern is what turns a generic reply into one you can use.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            The {IMAGE_COUNT} image prompts work differently. Image tools respond best to a short list of visual details, so those prompts are a chain of subject, setting, light, style, colour and camera view that you swap out to get the picture you want.
          </p>

          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mt-8 mb-4">
            Prompt Categories Available
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <h4 className="font-semibold text-zinc-900 dark:text-white">
                  {c.name} <span className="font-normal text-zinc-500">({PROMPTS.filter((p) => p.category === c.id).length})</span>
                </h4>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{c.blurb}.</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/30">
            <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200 mb-2">
              Start Using Better Prompts Today
            </h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              Browse the prompts, fill in your details and copy the ones that fit your work. Free and no signup.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
