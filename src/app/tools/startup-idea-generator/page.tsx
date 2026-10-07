import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { INDUSTRIES, MODELS, PATTERNS } from "@/lib/ideas/data";
import { IDEA_COUNT } from "@/lib/ideas/match";
import StartupIdeaClient from "./StartupIdeaClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['startup-idea-generator']);

// Counts come from the idea data, so the page never claims more than exists.
const PATTERN_COUNT = PATTERNS.length;
const INDUSTRY_COUNT = INDUSTRIES.length;

const faqs = [
  {
    question: "How does the AI Startup Idea Generator work?",
    answer: `You answer five quick questions: your skills, an industry you know, how you want to earn, how many hours you have and how much you can spend. The generator combines ${PATTERN_COUNT} hand written business models with ${INDUSTRY_COUNT} industries, which gives ${IDEA_COUNT} concrete ideas, and ranks them by how well they fit your answers. Each idea opens as a one page canvas with the problem, the customer, the smallest first version, how it makes money, costs, risks and a 7 day plan to test it. The matching runs in your browser with clear rules, not a language model. The optional pressure test opens a prompt in ChatGPT or Claude.`
  },
  {
    question: "Are the generated ideas actually viable in 2026?",
    answer: "No tool can tell you that in advance, and we do not pretend to. That is why there are no viability scores or market sizes here: they would be guesses. Every idea is a sensible starting point built from business models that people already run, and each one comes with a 7 day test so you can find out from real customers whether it is worth your time."
  },
  {
    question: "Can I refine or expand on a generated idea?",
    answer: "Yes. Change your answers at any time and the shortlist updates. Save the ideas you like in your browser, copy the full canvas into your notes, or share a link to it. The pressure test button opens a prompt in ChatGPT or Claude that lists likely risks, competitors to check and questions to ask customers."
  },
  {
    question: "What industries are covered?",
    answer: `${INDUSTRY_COUNT} industries where small businesses have everyday problems worth solving: ${INDUSTRIES.map((i) => i.name.toLowerCase()).join(', ')}. You can pick the one you know best or keep it open.`
  },
  {
    question: "Does each idea include an MVP timeline?",
    answer: "Each idea shows a rough time to a first version, such as days to a first offer for a service or a few months for software, and a rough start up cost band. They are there to help you compare ideas against your time and budget, not forecasts. The 7 day test plan is the part to act on first."
  },
  {
    question: "Is this startup idea generator free to use?",
    answer: "Yes. It is free with no signup and no limits. Your answers and saved ideas are kept in your own browser and are not sent to us."
  },
  {
    question: "How can I validate these ideas before building?",
    answer: "Follow the 7 day plan on each idea: list 20 people you could sell to, talk to at least five about how they handle the problem today, write a one page offer with a price, send it out, and ask for a real commitment such as a deposit, a preorder or a booked first job. Money or a firm date is a signal. Compliments are not."
  },
  {
    question: "What makes these ideas different from generic lists?",
    answer: "They are matched to you: your skills, the industry you know, your time and your budget. Each one names a specific customer and problem, starts with a small first version you can actually build or sell, and leaves out the invented numbers that many idea lists use to look convincing."
  }
];

const modelRows: [string, string, string, string][] = [
  ["A service", "Low", "Days to weeks", "Your income is tied to your hours"],
  ["A digital product", "Low", "Weeks", "Hard to sell without an audience"],
  ["Software", "Medium", "Months", "Takes longest to learn if anyone will pay"],
  ["Content and audience", "Low", "Many months", "Slow and uncertain growth"],
  ["A marketplace", "Medium to high", "Months", "You need buyers and sellers at the same time"],
];

export default function StartupIdeaPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="DevelopersMatrix Startup Idea Generator"
        description={`Free startup and business idea generator. Answer five questions and get ideas matched to your skills, time and budget, each with a one page canvas and a 7 day test plan. ${IDEA_COUNT} idea combinations across ${INDUSTRY_COUNT} industries.`}
        url={`${siteConfig.url}/tools/startup-idea-generator`}
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <HowToSchema
        name="How to Find a Startup Idea That Fits You"
        description="Answer five questions, compare a shortlist of matched ideas, and test the best one with real customers in seven days."
        url={`${siteConfig.url}/tools/startup-idea-generator`}
        totalTime="PT10M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        step={[
          { name: "Answer five questions", text: "Pick your skills, an industry you know, how you want to earn, your hours per week and your starting budget. You can skip any question." },
          { name: "Compare your shortlist", text: "Ideas that fit your answers come first, each with the reasons it fits and anything you would need to learn or add." },
          { name: "Open the idea canvas", text: "See the problem, customer, first version, angle, channels, revenue, costs, the number to track and your edge on one page." },
          { name: "Pressure test it", text: "Open a ready prompt in ChatGPT or Claude that lists risks, competitors to check and questions to ask customers." },
          { name: "Run the 7 day test", text: "Talk to real customers, send a one page offer and ask for a commitment before you build anything." }
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Tools', url: `${siteConfig.url}/tools` },
          { name: 'Startup Idea Generator', url: `${siteConfig.url}/tools/startup-idea-generator` }
        ]}
      />
      <FAQSchema faqs={faqs} />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-stone-200 bg-[#f7f5f0] dark:border-stone-800 dark:bg-stone-950">
          <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-stone-500 dark:text-stone-400">
              <Link href="/tools" className="hover:text-stone-900 dark:hover:text-white">Tools</Link>
              <span className="mx-2 text-stone-300 dark:text-stone-600">/</span>
              <span className="text-stone-700 dark:text-stone-300">Startup Idea Generator</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-stone-900 dark:text-stone-50 sm:text-5xl">
              Free AI Startup Idea Generator 2026
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600 dark:text-stone-300">
              Answer five quick questions and get startup and side business ideas that fit your skills, time and budget. Each idea opens as a one page canvas with a plan to test it on real customers in seven days.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {[`${IDEA_COUNT} idea combinations`, `${INDUSTRY_COUNT} industries`, `${MODELS.length} ways to earn`, 'No signup'].map((t) => (
                <li key={t} className="rounded-full border border-stone-300 bg-white px-3 py-1 font-medium text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200">{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-[1400px] px-3 pt-6 sm:px-6 lg:px-8">
          <div id="startup-idea-generator" className="scroll-mt-20">
            <StartupIdeaClient />
          </div>
        </div>

        <InContentAd />

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">
                  Free Startup Idea Generator: Find a Business That Fits You
                </h2>
                <div className="space-y-4 text-stone-700 dark:text-stone-300">
                  <p className="text-lg leading-relaxed">
                    Most idea lists hand everyone the same ideas, often dressed up with market sizes and scores nobody can check. The ideas worth your time are the ones you can actually start: they use skills you have, serve people you understand, and fit the hours and money you can spare.
                  </p>
                  <p className="leading-relaxed">
                    This generator starts with you. It matches {PATTERN_COUNT} proven ways of earning money, from services and templates to software and newsletters, with {INDUSTRY_COUNT} industries full of small businesses that have real, everyday problems. Then it gives you a small first step and a quick way to test it.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">How to Use the Startup Idea Generator</h2>
                <ol className="space-y-5">
                  {[
                    ["Answer the five questions", "Skills, an industry you know, how you want to earn, hours and budget. Skip any you are unsure about."],
                    ["Read the shortlist", "Ideas that fit best come first. Each shows why it fits and what you would need to add, such as a skill or a partner."],
                    ["Open the canvas", "One page with the problem, the customer, the smallest first version, your angle, where to find customers, revenue, costs, the number to track and your edge."],
                    ["Pressure test it", "Open the ready prompt in ChatGPT or Claude to hear the strongest reasons it could fail."],
                    ["Run the 7 day test", "Talk to real customers and ask for a real commitment before you spend months building."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-600 text-sm font-bold text-white">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-stone-900 dark:text-white">{t}</h3>
                        <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">How the Ideas Are Built</h2>
                <div className="space-y-4 leading-relaxed text-stone-700 dark:text-stone-300">
                  <p>
                    Every idea is a combination of a business model and an industry. The models were written by hand, each with a first version, a revenue model, likely costs and honest risks. The industries describe who pays, who they serve and a common headache, such as missed appointments for clinics or chasing invoices for trades.
                  </p>
                  <p>
                    Ideas are ranked with simple rules you can see: they move up when they use your skills, match the way you want to earn or sit in the industry you know, and move down when they need more money or hours than you have. The reasons are shown on every idea.
                  </p>
                  <p>
                    What you will not find are viability scores, market sizes or growth rates. For an idea this early, those numbers would be invented. A week of talking to customers tells you far more.
                  </p>
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">Business Models Compared</h2>
                <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
                  <table className="w-full min-w-[34rem] text-left text-sm">
                    <thead className="bg-stone-50 text-[12px] uppercase tracking-[0.08em] text-stone-500 dark:bg-stone-900">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Model</th>
                        <th scope="col" className="px-4 py-3 font-medium">Start up cost</th>
                        <th scope="col" className="px-4 py-3 font-medium">Time to first income</th>
                        <th scope="col" className="px-4 py-3 font-medium">Main catch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {modelRows.map(([m, c, t, r]) => (
                        <tr key={m}>
                          <th scope="row" className="px-4 py-3 font-medium text-stone-900 dark:text-white">{m}</th>
                          <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{c}</td>
                          <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{t}</td>
                          <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{r}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[13px] text-stone-500">General guidance, not data. Your costs and timing depend on the idea and on you.</p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">Turning an Idea into a Real Business</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Start with a service", "Doing the work by hand for a few paying customers teaches you the problem fast, and shows you what is worth turning into software later."],
                    ["Talk before you build", "Ask people how they solve the problem today and what it costs them. Past behavior tells you more than opinions about the future."],
                    ["Ask for money early", "A deposit, a preorder or a paid pilot is the clearest sign of demand. Friendly interest is not."],
                    ["Keep the first version small", "Build only what your first customers need to get the result. Everything else can wait."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
                      <h3 className="mb-2 font-semibold text-stone-900 dark:text-white">{t}</h3>
                      <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-stone-900 dark:text-white">
                        {faq.question}
                        <span aria-hidden="true" className="text-stone-400 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <div className="border-t border-stone-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-stone-600 dark:border-stone-800 dark:text-stone-400">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-stone-900 dark:text-white sm:text-3xl">Related Tools for Entrepreneurs</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/budget-planner", "Budget Planner", "Plan what you can afford to spend while you test an idea."],
                    ["/tools/ai-email-assistant", "AI Email Assistant", "Templates for cold introductions, follow ups and proposals."],
                    ["/tools/ai-prompt-library", "AI Prompt Library", "Ready prompts for customer research, outreach and planning."],
                    ["/tools/website-audit", "Website Audit", "Check the landing page for your offer before you share it."],
                    ["/tools/productivity-planner", "Productivity Planner", "Plan your test week around the hours you have."],
                    ["/tools", "View all free tools", "Planners, checkers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-stone-200 bg-white p-5 transition hover:border-orange-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-orange-700">
                      <h3 className="mb-2 font-semibold text-stone-900 group-hover:text-orange-700 dark:text-white dark:group-hover:text-orange-400">{t}</h3>
                      <p className="text-sm text-stone-600 dark:text-stone-400">{d}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="flex-shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />
                <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="mb-2 font-semibold text-stone-900 dark:text-white">Founder tip</h3>
                  <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                    The best ideas often come from problems you have seen up close. Use the generator for a starting point, then ask people in that industry what annoys them every week.
                  </p>
                </div>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
                  <h3 className="mb-4 font-semibold text-stone-900 dark:text-white">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/trends/ai-side-hustles-make-money-2026", "AI Side Hustles Report"],
                      ["/blog/ai-automation-business-ideas-2026", "AI Automation Business Ideas"],
                      ["/blog/how-to-start-an-ai-automation-agency-2026", "How to Start an AI Automation Agency"],
                    ].map(([href, t]) => (
                      <li key={href}>
                        <Link href={href} className="text-orange-700 hover:underline dark:text-orange-400">{t}</Link>
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
