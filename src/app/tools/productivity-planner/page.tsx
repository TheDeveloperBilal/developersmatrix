import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import ProductivityPlannerClient from "./ProductivityPlannerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['productivity-planner']);

const faqs = [
  {
    question: "Is the Productivity Planner completely free?",
    answer: "Yes. It is free with no signup, no card and no task limit. The site is supported by ads."
  },
  {
    question: "How does the AI prioritization actually work?",
    answer: "There is no hidden AI ranking your tasks inside the planner. You set the priorities: each task is a Must, Should or Could, and you star up to three as your Top 3. The timeline places the Top 3 first, then the rest in your list order, each in the earliest free slot around meetings you pinned to a fixed time, so a short task can fill a gap before a call. If you want a second opinion, the Plan my day with AI button opens your list as a ready prompt in ChatGPT or Claude, which suggests an order, flags estimates that look too tight and tells you what to drop."
  },
  {
    question: "Can developers and remote workers benefit from this?",
    answer: "Yes. If your day mixes deep work with standups, reviews and calls, pin the calls to their times and let the planner fit focused work into the gaps. The overbooked warning is useful when you are tempted to promise more than a day can hold."
  },
  {
    question: "Does it work for teams or just individuals?",
    answer: "It is a personal planner. Your plan lives in your own browser and there are no shared boards or accounts. You can share a plan by exporting it as a calendar file, but for team projects a shared tool like a task board works better."
  },
  {
    question: "What is time blocking and why does it matter?",
    answer: "Time blocking means giving each task its own slot in the day instead of working down an open list. You decide the order once, in the morning, instead of every time you finish something, and you find out early if the day is overbooked. Writers on focused work, such as Cal Newport in Deep Work, have recommended it for years. The planner builds the blocks for you from your estimates."
  },
  {
    question: "How is this different from Todoist, Notion, or Trello?",
    answer: "Those are full task and project tools with accounts, syncing, shared projects and long term lists. This planner does one thing: it turns today's tasks into a realistic timeline. There is nothing to install or sign up for. Many people keep their long list in another tool and use this to plan the day."
  },
  {
    question: "Can I export my tasks or sync with my calendar?",
    answer: "You can export the day as an .ics calendar file, which Google Calendar, Outlook and Apple Calendar can import. It is a one time copy, so changes you make later are not synced. Your plan is also saved in your browser until you change it."
  },
  {
    question: "What is the best way to use this planner daily?",
    answer: "Take five minutes at the start of the day. Add your tasks with honest estimates, pin meetings to their times and star the three that matter most. If the planner says you are overbooked, move something to tomorrow before you start. At the end of the day, use Move unfinished to tomorrow so nothing gets lost."
  }
];

export default function ProductivityPlannerPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="DevelopersMatrix Productivity Planner"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description="Free daily planner that turns your tasks into an hour by hour timeline with a Top 3, fixed time meetings, an overbooked warning, calendar export and an optional AI planning prompt. Saved in your browser, no signup."
        url={`${siteConfig.url}/tools/productivity-planner`}
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <HowToSchema
        name="How to Plan Your Day with Time Blocks"
        description="Turn a task list into a realistic timeline in about five minutes."
        url={`${siteConfig.url}/tools/productivity-planner`}
        totalTime="PT5M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        step={[
          { name: "Set your working hours", text: "Enter when your day starts and ends, and how much breathing room you want after each task." },
          { name: "Add tasks with estimates", text: "Add each task with how long you think it will take and whether it is a Must, Should or Could." },
          { name: "Pin fixed meetings", text: "Give meetings and appointments a fixed start time so other tasks fit around them." },
          { name: "Star your Top 3", text: "Pick up to three tasks that would make today a good day. They go first." },
          { name: "Fix an overbooked day", text: "If the plan runs past the end of the day, move tasks to tomorrow or cut estimates before you start." }
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Productivity Planner", url: `${siteConfig.url}/tools/productivity-planner` }
        ]}
      />
      <FAQSchema faqs={faqs} />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-gradient-to-b from-indigo-50/70 to-white dark:border-slate-800 dark:from-slate-950 dark:to-slate-950">
          <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
              <Link href="/tools" className="hover:text-slate-900 dark:hover:text-white">Tools</Link>
              <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-700 dark:text-slate-300">Productivity Planner</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Free AI Productivity Planner
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Turn today&apos;s task list into an hour by hour plan. Pick your Top 3, pin your meetings, see straight away if the day is overbooked, and ask ChatGPT or Claude for a second opinion when you want one.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {['Hour by hour timeline', 'Top 3 first', 'Calendar export', 'Optional AI prompt', 'No signup'].map((t) => (
                <li key={t} className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-[1400px] px-3 pt-6 sm:px-6 lg:px-8">
          <div id="productivity-planner" className="scroll-mt-20">
            <ProductivityPlannerClient />
          </div>
        </div>

        <InContentAd />

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  A Free Productivity Planner and Daily Task Manager
                </h2>
                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <p className="text-lg leading-relaxed">
                    A to do list tells you what to do. It does not tell you whether it fits. That is why so many days end with half the list still open and a feeling that you got nothing done.
                  </p>
                  <p className="leading-relaxed">
                    This planner adds the missing piece: time. Give each task a rough estimate and it lays them out on a timeline from the start of your day, fitting work around your meetings. If the plan runs past the end of the day, you see it before you start, while you can still choose what to move.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">How to Plan Your Day in Five Minutes</h2>
                <ol className="space-y-5">
                  {[
                    ["Set your hours", "Enter when you start and finish, and pick a short gap after each task for breaks and switching."],
                    ["Add everything on your plate", "Each task gets a time estimate and a priority: Must, Should or Could."],
                    ["Pin your meetings", "Use Fixed time for calls and appointments. Flexible tasks are fitted into the gaps."],
                    ["Star your Top 3", "The three tasks that would make today a good day go first, while your energy is highest."],
                    ["Check the finish time", "If you are overbooked, move a task to tomorrow or cut an estimate now, not at 5pm."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">{t}</h3>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Time Blocking: Decide the Day Before It Starts</h2>
                <div className="space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    Time blocking means giving every task its own slot instead of working down an open list. The order is decided once, in the morning, so you are not choosing what to do next every time you finish something.
                  </p>
                  <p>
                    It also makes trade offs visible. When the blocks do not fit between 9 and 5, something has to give, and it is better to decide that on purpose than to find out at the end of the day. The planner rebuilds the blocks every time you change a task, so the plan keeps up when the day changes.
                  </p>
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Must, Should, Could: Picking What Matters</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Must", "Has to happen today. A deadline, a promise to someone, or something that blocks other people."],
                    ["Should", "Important, but the world does not end if it moves to tomorrow."],
                    ["Could", "Worth doing if there is time. The first thing to drop on a busy day."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">{t}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  The labels are borrowed from the MoSCoW method used in project planning. Keep Musts few. If everything is a Must, nothing is.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Why Tasks Take Longer Than You Plan</h2>
                <div className="space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    Psychologists Daniel Kahneman and Amos Tversky named this the planning fallacy: we picture the task going smoothly and forget the interruptions, the setup and the bit that turns out harder than expected. Nearly everyone does it, even with plenty of experience.
                  </p>
                  <p>
                    Two simple fixes help. Keep the gap after each task so the plan has slack, and when a task always runs long, raise its estimate next time. A plan that finishes early beats one that runs into the evening.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-slate-900 dark:text-white">
                        {faq.question}
                        <span aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <div className="border-t border-slate-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-400">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Complete Your Productivity Toolkit</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/habit-tracker", "Habit Tracker", "Build the daily routines that make planning easier."],
                    ["/tools/budget-planner", "Budget Planner", "Plan your money the same way you plan your day."],
                    ["/tools/ai-email-assistant", "AI Email Assistant", "Templates for the emails that eat your morning."],
                    ["/tools/ai-prompt-library", "AI Prompt Library", "Ready prompts for planning, writing and coding."],
                    ["/tools/startup-idea-generator", "Startup Idea Generator", "Ideas that fit the hours you actually have."],
                    ["/tools", "View all free tools", "Planners, checkers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700">
                      <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-400">{t}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{d}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="flex-shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-2 font-semibold text-slate-900 dark:text-white">Quick tip</h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Plan tomorrow before you finish today. Moving unfinished tasks forward takes one click and you start the morning knowing your Top 3.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/tools/habit-tracker", "Track a daily planning habit"],
                      ["/tools/ai-prompt-library", "Prompts for planning your week"],
                      ["/trends", "Latest trend reports"],
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
