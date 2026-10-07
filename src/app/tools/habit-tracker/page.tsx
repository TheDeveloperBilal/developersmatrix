import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import HabitTrackerClient from "./HabitTrackerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['habit-tracker']);

const LALLY_URL = "https://doi.org/10.1002/ejsp.674";

const faqs = [
  {
    question: "Is the Habit Tracker completely free?",
    answer: "Yes. It is free with no signup and no paid tier. You can track up to 12 daily habits at once. The site is supported by ads."
  },
  {
    question: "How does habit tracking actually work?",
    answer: "Each day you tick the habits you did. Every tick is saved against a real date, so your streak is the number of days in a row you actually ticked, and your 30 day rate is how many of the last 30 days you did it. Forgot to tick yesterday? Tap that day in the 7 day strip or the 12 week wall to fix it. The point is not the numbers themselves but seeing the pattern, so a missed day becomes a nudge rather than a surprise."
  },
  {
    question: "What types of habits can I track?",
    answer: "Anything you can answer with a yes or no once a day: read 10 pages, walk for 20 minutes, practice coding, no phone in bed. It works best for daily habits. It does not track amounts, such as glasses of water, or weekly targets, such as the gym three times a week."
  },
  {
    question: "How long does it take to build a habit?",
    answer: "Longer than 21 days for most people. In a 2010 study at University College London, Phillippa Lally and colleagues asked volunteers to repeat one new daily behavior for 12 weeks. The median time for it to feel automatic was 66 days, and the range ran from 18 to 254 days depending on the person and the habit. Simple habits got there faster. The same study found that missing a single day did not undo the progress."
  },
  {
    question: "Can I track bad habits I want to break?",
    answer: "Yes, by tracking the day you did not do it. Name the habit as the result you want, such as no social media before 10am or no snacks after dinner, and tick each day you managed it. Your streak then counts good days rather than slips."
  },
  {
    question: "Is my habit data private?",
    answer: "Your habits are saved in your own browser and are not sent to our servers. Clearing your browser data deletes them, and they do not sync between devices on their own. Use Backup to download a file and Restore to load it on another device or browser."
  },
  {
    question: "How is this different from Loop, Habitica, or Streaks?",
    answer: "Those are apps you install, with features this page does not have, such as reminders, widgets and in the case of Habitica, game rewards. This tracker runs in any browser with nothing to install and no account, and puts your full history on one wall you can see at a glance. If you want phone reminders, an app is the better choice. If you want something quick and private, this is enough."
  },
  {
    question: "What is the best way to start with habit tracking?",
    answer: "Start with one or two habits that are small enough to do on a bad day, and tie each one to something you already do, like reading after dinner or stretching after you brush your teeth. Tick it the same time each day. Add a new habit only when the first one feels easy."
  }
];

export default function HabitTrackerPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="DevelopersMatrix Habit Tracker"
        applicationCategory="LifestyleApplication"
        operatingSystem="Web"
        description="Free daily habit tracker with date based streaks, a 7 day check in strip and a 12 week wall for every habit. Saved in your browser with backup and restore. No signup."
        url={`${siteConfig.url}/tools/habit-tracker`}
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <HowToSchema
        name="How to Track a Daily Habit"
        description="Pick a small habit, tick it each day and use your streak and 12 week wall to stay consistent."
        url={`${siteConfig.url}/tools/habit-tracker`}
        totalTime="PT2M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        step={[
          { name: "Add one small habit", text: "Type a habit or pick a suggestion. Keep it small enough to do on a busy day." },
          { name: "Tick it each day", text: "Tap the check button when you have done it. Each tick is saved against today's date." },
          { name: "Fix missed check ins", text: "Tap any of the last seven days, or any past day on the 12 week wall, to correct it." },
          { name: "Watch the wall fill in", text: "Your streak, best streak and 30 day rate update from the dates you ticked." },
          { name: "Back it up", text: "Download a backup file now and then so you can restore your habits on another device." }
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Habit Tracker", url: `${siteConfig.url}/tools/habit-tracker` }
        ]}
      />
      <FAQSchema faqs={faqs} />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
              <Link href="/tools" className="hover:text-zinc-900 dark:hover:text-white">Tools</Link>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
              <span className="text-zinc-700 dark:text-zinc-300">Habit Tracker</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              Free Habit Tracker: Build Better Daily Routines
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              Tick off your daily habits and watch a 12 week wall fill in. Streaks are counted from real dates, missed check ins are easy to fix, and everything stays in your browser.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {['Real date streaks', '12 week wall', 'Backup and restore', 'No signup'].map((t) => (
                <li key={t} className="rounded-full border border-zinc-300 bg-white px-3 py-1 font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-[1400px] px-3 pt-6 sm:px-6 lg:px-8">
          <div id="habit-tracker" className="scroll-mt-20">
            <HabitTrackerClient />
          </div>
        </div>

        <InContentAd />

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  A Free Daily Habit Tracker with Honest Streaks
                </h2>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                  <p className="text-lg leading-relaxed">
                    A habit tracker has one job: show you, without excuses, which days you did the thing. That only works if the record is real. Here every tick is tied to a date, so a streak means days in a row, not how many times you pressed a button.
                  </p>
                  <p className="leading-relaxed">
                    The wall at the top shows the last 12 weeks of all your habits together. Darker squares are days you did fewer of them, brighter ones are days you did them all. Open any habit to see its own wall, its current streak, its best streak and how many of the last 30 days you managed.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">How to Use the Habit Tracker</h2>
                <ol className="space-y-5">
                  {[
                    ["Add a habit", "Type your own or tap a suggestion. Pick habits you can answer with a yes or no once a day."],
                    ["Tick it when it is done", "The big check button marks today. Your streak keeps counting until the day is over, so you have until midnight."],
                    ["Fix the days you forgot", "Did it yesterday but forgot to tick? Tap that day in the 7 day strip. Older days can be fixed on the 12 week wall."],
                    ["Read the wall, not just the streak", "A broken streak hides a lot of good days. The 30 day rate and the wall show the bigger picture."],
                    ["Keep a backup", "Your habits live in this browser. Download a backup now and then, and restore it on a new phone or laptop."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-zinc-950">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t}</h3>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">How Long Does It Take to Build a Habit?</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["66 days", "Median time for a new daily habit to feel automatic"],
                    ["18 to 254", "Range of days across the people in the study"],
                    ["1 miss", "Did not undo the progress people had made"],
                  ].map(([n, d]) => (
                    <div key={n} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                      <p className="font-mono text-2xl font-semibold text-zinc-900 dark:text-white">{n}</p>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{d}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <p>
                    The popular 21 day figure has little evidence behind it. The best known study on the question comes from Phillippa Lally and her team at University College London, published in the <cite>European Journal of Social Psychology</cite> in 2010. Volunteers chose one new daily behavior, such as eating fruit with lunch or going for a run before dinner, and reported each day for 12 weeks how automatic it felt.
                  </p>
                  <p>
                    It took a median of 66 days to level off, with a very wide range from 18 to 254 days. Simple habits settled sooner than harder ones. Just as useful: missing one day did not reset the process. So if your streak breaks, the right move is simply to tick it again tomorrow.
                  </p>
                  <p className="text-sm text-zinc-500">
                    Source: Lally, van Jaarsveld, Potts and Wardle, How are habits formed: Modelling habit formation in the real world, European Journal of Social Psychology, 2010.{' '}
                    <a href={LALLY_URL} target="_blank" rel="noopener noreferrer" className="text-lime-700 underline dark:text-lime-400">Read the paper</a>
                  </p>
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Tips That Make Habits Stick</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Make it small", "Two pages, not two chapters. A habit you can do on your worst day survives the weeks when life gets busy."],
                    ["Tie it to something you already do", "After coffee, after brushing your teeth, when you sit down at your desk. A fixed cue makes the habit easier to remember."],
                    ["Do it at the same time", "Doing it in the same place and at the same time each day helps it become automatic."],
                    ["Restart without guilt", "One missed day is normal and does not wipe out your progress. Ticking it again tomorrow matters more than the streak."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">{t}</h3>
                      <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Habit Ideas to Start With</h2>
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full min-w-[30rem] text-left text-sm">
                    <thead className="bg-zinc-50 text-[12px] uppercase tracking-[0.08em] text-zinc-500 dark:bg-zinc-900">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Area</th>
                        <th scope="col" className="px-4 py-3 font-medium">Small daily habits</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {[
                        ["Health", "Walk for 20 minutes, drink a glass of water after waking, in bed by 11"],
                        ["Learning", "Read 10 pages, practice coding for 30 minutes, review 10 flashcards"],
                        ["Work", "Plan tomorrow before you log off, one hour without notifications"],
                        ["Money", "Write down what you spent today, no takeaway on weekdays"],
                        ["Mind", "Five minutes of quiet, write one line in a journal, no phone in bed"],
                      ].map(([a, h]) => (
                        <tr key={a}>
                          <th scope="row" className="px-4 py-3 font-medium text-zinc-900 dark:text-white">{a}</th>
                          <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">{h}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqs.map((faq) => (
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
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">Tools That Pair Well with Habit Tracking</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/productivity-planner", "Productivity Planner", "Give your habits a slot in the day with time blocks."],
                    ["/tools/budget-planner", "Budget Planner", "Pair a daily spending log with a monthly budget."],
                    ["/tools/ai-prompt-library", "AI Prompt Library", "Prompts for planning, learning and reflection."],
                    ["/tools/ai-interview-simulator", "Interview Simulator", "Make interview practice a daily habit."],
                    ["/tools/ai-resume-builder", "AI Resume Builder", "Turn the skills you build into a stronger resume."],
                    ["/tools", "View all free tools", "Planners, checkers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-lime-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-lime-700">
                      <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-lime-700 dark:text-white dark:group-hover:text-lime-400">{t}</h3>
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
                  <h3 className="mb-2 font-semibold text-zinc-900 dark:text-white">Quick tip</h3>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    Start with two habits at most. When both feel easy for a couple of weeks, add the next one.
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/tools/productivity-planner", "Plan your day with time blocks"],
                      ["/tools/budget-planner", "Build a monthly budget"],
                      ["/trends", "Latest trend reports"],
                    ].map(([href, t]) => (
                      <li key={href}>
                        <Link href={href} className="text-lime-700 hover:underline dark:text-lime-400">{t}</Link>
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
