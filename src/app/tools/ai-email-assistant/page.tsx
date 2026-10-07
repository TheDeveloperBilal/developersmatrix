import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SCENARIOS } from "@/lib/email/scenarios";
import { GROUPS, TONES } from "@/lib/email/template";
import AIEmailAssistantClient from "./AIEmailAssistantClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-email-assistant']);

// Counts come from the template library, so the copy never claims more than exists.
const SCENARIO_COUNT = SCENARIOS.length;
const TONE_COUNT = TONES.length;
const EMAIL_COUNT = SCENARIO_COUNT * TONE_COUNT;

const toolFaqs = [
  {
    question: "Is the AI Email Assistant completely free to use?",
    answer: `Yes. It is free with no signup and no limits. You can use all ${SCENARIO_COUNT} email templates, check as many drafts as you like and build as many AI prompts as you need.`
  },
  {
    question: "How does the AI Email Assistant actually work?",
    answer: `It has three parts. Write gives you ${SCENARIO_COUNT} common work emails, each written by hand in ${TONE_COUNT} tones, with the blanks right inside the email for you to fill in. Check reads a draft you paste and points out problems such as a vague subject line, no clear ask, stock phrases or blanks left in brackets. Use AI builds a careful prompt from your email, the tone and what you want to say, and opens it in ChatGPT or Claude, where the actual rewriting or replying happens. The templates and the checker run in your browser and do not use AI.`
  },
  {
    question: "Will people know I used AI to write my emails?",
    answer: "The templates are plain, natural emails written by a person, and you fill in the real details, so they read like you wrote them. If you use the AI option, read the answer before you send it, add details only you know and change anything that does not sound like you. The prompt asks the AI not to invent facts and to leave gaps in brackets instead."
  },
  {
    question: "Can I use this for job applications and cold outreach?",
    answer: "Yes. The templates include thanking someone after an interview, following up on an application, accepting or declining an offer, asking for a referral, resigning and introducing yourself to a new contact. For a full cover letter, the AI Cover Letter Generator on this site is built for that format."
  },
  {
    question: "Does it support multiple languages?",
    answer: "The templates and the draft checker are in English only. If you need an email in another language, use the Use AI option and add the language to the notes, for example \"write the reply in Spanish\". ChatGPT and Claude can both write in many languages, but check the result with a fluent speaker for anything important."
  },
  {
    question: "Is my email content private and secure?",
    answer: "Writing from a template and checking a draft both happen in your browser. Nothing you type there is sent to DevelopersMatrix. The only thing remembered is your own name and preferred tone, saved in this browser so you do not have to retype them. If you click Open in ChatGPT or Open in Claude, your text is placed in that service's address bar and handled under its privacy rules, so remove private details first if you need to."
  },
  {
    question: "What are the most common email mistakes this tool catches?",
    answer: "The draft checker flags a missing or vague subject line, a missing greeting or sign off, no clear next step for the reader, stock phrases such as \"just wanted to touch base\" or \"please advise\", too many softening words like \"maybe\" and \"I think\", repeated apologies, shouting in capitals, extra exclamation marks, very long sentences or paragraphs, repeated words and blanks left in brackets. It also reminds you to attach a file when the email mentions an attachment."
  },
  {
    question: "How much time can this tool realistically save me?",
    answer: "It depends on how you write now, so we do not put a number on it. Where it helps most is the emails people put off: declining something, chasing a late invoice, apologizing or asking for more time. Starting from a clear structure and only filling in your details is usually much quicker than starting from a blank screen."
  }
];

const mistakes = [
  ["Vague Subject Lines", "Subject lines like \"Update\" or \"Question\" give the reader no reason to open the email now and make it hard to find later.", "Name the topic and, if it matters, the date: \"Invoice 1042 due Friday\" or \"Launch plan: need your sign off\". The checker flags vague and very long subjects."],
  ["Wrong Tone for the Relationship", "Writing too casually to someone senior can read as careless. Writing too formally to a teammate can read as cold.", "Pick the tone for the person, not the topic. Every template comes in Friendly, Professional and Formal, and your answers stay when you switch."],
  ["Missing Call to Action", "An email that ends without a next step leaves the reader guessing what you want, so often nothing happens.", "Say what you need and by when: \"Could you approve this by Thursday?\" The checker notes when an email has no clear ask."],
  ["Hedging and Filler Words", "\"I was just wondering if maybe you could possibly...\" makes a reasonable request sound unsure.", "Ask directly and politely. The checker highlights softening words and stock phrases and suggests what to say instead."],
  ["Too Long or Too Short", "A wall of text gets skimmed. A one line email can feel abrupt and leave out what the reader needs.", "Lead with the point, keep one idea per paragraph and move background to the end. The checker flags very short emails, very long ones and paragraphs over 90 words."],
  ["Forgetting to Proofread", "Repeated words, blanks left in brackets and a missing attachment are easy to miss when you are in a hurry.", "Run the draft through the checker, then read it once out loud before you send it."],
];

const scenariosByGroup = GROUPS.map((g) => ({ group: g, list: SCENARIOS.filter((s) => s.group === g) }));

export default function AIEmailAssistantPage() {
  return (
    <>
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
        description={`Free email assistant with ${SCENARIO_COUNT} email templates in ${TONE_COUNT} tones, a draft checker, and ready prompts to reply or rewrite in ChatGPT or Claude. No signup.`}
        url={`${siteConfig.url}/tools/ai-email-assistant`}
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <FAQSchema faqs={toolFaqs} />
      <HowToSchema
        name="How to Write a Professional Email With the AI Email Assistant"
        description="Pick a situation, fill in the blanks inside the email, check it, then copy it or open it in your mail app."
        url={`${siteConfig.url}/tools/ai-email-assistant`}
        totalTime="PT3M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'AI Email Assistant']}
        step={[
          { name: "Pick a situation", text: `Choose one of ${SCENARIO_COUNT} situations, such as asking for more time, following up on an application or reminding a client about an invoice.` },
          { name: "Choose a tone", text: "Pick Friendly, Professional or Formal. The email changes, and anything you already filled in stays." },
          { name: "Fill in the blanks", text: "Type your details straight into the highlighted blanks in the subject and the email. The side panel shows which blanks are left." },
          { name: "Check it", text: "Read the checks in the side panel, or paste any draft into Check a draft to see problems marked in the text." },
          { name: "Send it", text: "Copy the email, or open it as a draft in Gmail, Outlook or your mail app. To reply to or rewrite a different email, use the AI option to open a ready prompt in ChatGPT or Claude." }
        ]}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
              <Link href="/tools" className="hover:text-zinc-900 dark:hover:text-white">Tools</Link>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
              <span className="text-zinc-700 dark:text-zinc-300">AI Email Assistant</span>
            </nav>
            <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
                  AI Email Assistant
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Write a clear work email in a few minutes. Pick a situation and fill in the blanks right inside the email, check any draft for common mistakes, or hand a reply or rewrite to ChatGPT or Claude with a ready prompt.
                </p>
              </div>
              <ul className="flex flex-wrap gap-2 text-sm lg:justify-end">
                {[`${SCENARIO_COUNT} situations`, `${TONE_COUNT} tones each`, 'Draft checker', 'No signup'].map((t) => (
                  <li key={t} className="rounded-full border border-zinc-200 bg-white px-3 py-1 font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-[1400px] px-2 pt-6 sm:px-6 lg:px-8">
          <div id="ai-email-assistant" className="scroll-mt-20">
            <AIEmailAssistantClient />
          </div>
        </div>

        <InContentAd />

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Free AI Email Assistant: Write Professional Emails Faster
                </h2>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                  <p className="text-lg leading-relaxed">
                    Most work emails follow a pattern. A follow up needs a reminder of what you asked and a polite nudge. A request for more time needs a reason and a new date. The hard part is usually the wording, not the content.
                  </p>
                  <p className="leading-relaxed">
                    This assistant gives you {EMAIL_COUNT} ready emails ({SCENARIO_COUNT} situations in {TONE_COUNT} tones) with the structure already right, so you only add your details. When you need something a template cannot do, like answering a long email you received, it builds a careful prompt for ChatGPT or Claude that tells the AI to keep your facts and not make anything up.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Three Ways to Use the Email Assistant
                </h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Write from a template", "Pick a situation and a tone. The blanks sit inside the email, so you see the finished message as you type. Copy it or open it as a draft in Gmail, Outlook or your mail app."],
                    ["Check a draft", "Paste any email you wrote. The checker marks problems in the text and explains each one. It runs in your browser and does not use AI."],
                    ["Reply or rewrite with AI", "Paste an email, choose what you want to say, the tone and length. You get a prompt you can open in ChatGPT or Claude, or copy into any assistant."],
                  ].map(([t, d], i) => (
                    <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                      <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{i + 1}</span>
                      <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{t}</h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Email Templates Included
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {scenariosByGroup.map(({ group, list }) => (
                    <div key={group} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="mb-3 font-semibold text-zinc-900 dark:text-white">{group}</h3>
                      <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
                        {list.map((s) => <li key={s.id}>{s.name}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Six Email Mistakes That Cost You Opportunities
                </h2>
                <ol className="space-y-6">
                  {mistakes.map(([t, p, fix], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t}</h3>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{p}</p>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"><strong className="text-zinc-900 dark:text-white">Fix:</strong> {fix}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Six Professional Scenarios Where This Tool Shines
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["Job Application Follow Up", "Heard nothing after a week or two? The follow up template reminds them when you applied and adds one new reason you fit, without sounding pushy."],
                    ["Cold Outreach", "The introduction template keeps it short: who you are, something specific about them, one piece of proof and one easy ask."],
                    ["Saying No", "Decline a request with a reason and an alternative, so the answer is clear and the relationship stays intact."],
                    ["Meeting Requests", "Say why you want to meet, how long it takes and offer real times, so the reply can be a simple yes."],
                    ["Chasing an Invoice", "Lead with the facts: invoice number, amount, due date and how to pay. Polite, firm and easy to act on."],
                    ["Writing in Your Second Language", "Start from a natural template, then use the checker. For anything else, the AI option can ask for \"more natural English\" while keeping your facts."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{t}</h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Frequently Asked Questions About the AI Email Assistant
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

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Complete Your Professional Toolkit
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/ai-cover-letter-generator", "Cover Letter Generator", "Build a cover letter around the job posting and your own experience."],
                    ["/tools/ai-resume-builder", "AI Resume Builder", "Write an ATS friendly resume with a live check on every bullet."],
                    ["/tools/ai-interview-simulator", "Interview Simulator", "Practice interview questions and see what your answers covered and missed."],
                    ["/tools/salary-estimator", "Salary Estimator", "Check official pay ranges before you reply to an offer."],
                    ["/tools/ai-prompt-library", "AI Prompt Library", "Ready prompts for writing, career and business tasks."],
                    ["/tools", "View all free tools", "Planners, checkers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700">
                      <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-400">{t}</h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{d}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="flex-shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">Before you hit send</h3>
                  <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Subject.</span> Would they know what this is from the subject alone?</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Ask.</span> Is it clear what you need and by when?</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Facts.</span> Names, dates, amounts and links all correct?</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Attachment.</span> If you mention one, is it attached?</li>
                    <li><span className="font-semibold text-zinc-900 dark:text-white">Recipient.</span> Right person, and nobody copied by mistake?</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/tools/ai-cover-letter-generator", "Cover Letter Generator"],
                      ["/tools/ai-content-detector", "AI Content Detector"],
                      ["/tools/productivity-planner", "Productivity Planner"],
                      ["/trends/remote-tech-jobs-guide-2026", "Remote Tech Jobs Guide"],
                    ].map(([href, t]) => (
                      <li key={href}>
                        <Link href={href} className="text-indigo-700 hover:underline dark:text-indigo-400">{t}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
