import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { CURRENCIES } from "@/lib/planner/budget";
import BudgetPlannerClient from "./BudgetPlannerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['budget-planner']);

const faqs = [
  {
    question: "Is the Budget Planner completely free to use?",
    answer: "Yes. It is free with no signup, no card and no limit on how many lines you add. The site is supported by ads, not by selling your data."
  },
  {
    question: "How does the Budget Planner work?",
    answer: "You list your money in (take home pay) and your money out, each with how often it happens: weekly, every two weeks, monthly, every three months or yearly. The planner turns everything into a monthly amount, so a yearly insurance bill shows as one twelfth each month. It then shows what is left over, how every 100 you take home is split, how your needs, wants and savings compare with the 50/30/20 rule of thumb, and how many months a savings goal will take."
  },
  {
    question: "Is my financial data private and secure?",
    answer: "Your budget is saved in your own browser using local storage and is not sent to our servers. That also means anyone who uses the same browser profile can see it, and clearing your browser data deletes it. Download the CSV if you want a copy you control, and avoid using the planner on a shared computer."
  },
  {
    question: "Can I track multiple income sources?",
    answer: "Yes. Add each source as its own line, such as a salary paid every two weeks, freelance work paid monthly and a yearly bonus. Each line keeps its own frequency and the planner adds them up per month."
  },
  {
    question: "What expense categories are included?",
    answer: "There is no fixed list. You name each line yourself, and twelve quick add buttons cover the bills people most often forget, such as insurance, subscriptions and gifts. Every line is grouped as a Need, a Want or a Saving, which is what the 50/30/20 check uses."
  },
  {
    question: "Can I use this for business or freelance budgeting?",
    answer: "It is built for a personal monthly budget, and it works well for freelancers who want to know what they need to earn each month. For business accounts, invoices and tax, use proper bookkeeping software or an accountant. Keeping business costs in a separate budget from personal ones makes both easier to read."
  },
  {
    question: "Does it support multiple currencies?",
    answer: `You can show your budget in any of ${CURRENCIES.length} currencies, including the US dollar, euro, pound, rupee, dirham and naira. It does not convert between currencies, so enter every amount in the same one.`
  },
  {
    question: "What is a good savings rate to aim for?",
    answer: "The 50/30/20 rule of thumb from Elizabeth Warren and Amelia Warren Tyagi suggests putting 20 percent of take home pay toward savings and paying off debt faster. It is a starting point, not a rule you fail. If 20 percent is out of reach, start with a smaller amount you can keep up every month, and build a small emergency fund before anything else."
  }
];

export default function BudgetPlannerPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="DevelopersMatrix Budget Planner"
        applicationCategory="FinanceApplication"
        operatingSystem="Web"
        description="Free monthly budget planner. List money in and money out with any frequency, see what is left over, compare your split with the 50/30/20 rule and plan a savings goal. Saved in your browser, no signup."
        url={`${siteConfig.url}/tools/budget-planner`}
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <HowToSchema
        name="How to Make a Monthly Budget"
        description="Build a simple monthly budget from your take home pay and bills, then plan a savings goal."
        url={`${siteConfig.url}/tools/budget-planner`}
        totalTime="PT15M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        step={[
          { name: "Add your take home pay", text: "List every source of pay after tax, each with how often it arrives." },
          { name: "Add your bills and spending", text: "Use your bank statements to list rent, food, transport, subscriptions and yearly bills. Mark each one as a need, a want or a saving." },
          { name: "Check what is left over", text: "The statement shows money in, money out and the difference per month." },
          { name: "Compare with 50/30/20", text: "See how your needs, wants and savings compare with the rule of thumb and decide what to change." },
          { name: "Set a savings goal", text: "Enter a target and what you can put aside each month to see when you will reach it." }
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Budget Planner", url: `${siteConfig.url}/tools/budget-planner` }
        ]}
      />
      <FAQSchema faqs={faqs} />

      <main className="pt-16">
        {/* Hero */}
        <section className="border-b border-slate-200 bg-[#f4f2ec] dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-[1400px] px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-500 dark:text-slate-400">
              <Link href="/tools" className="hover:text-slate-900 dark:hover:text-white">Tools</Link>
              <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
              <span className="text-slate-700 dark:text-slate-300">Budget Planner</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance font-serif text-4xl text-slate-900 dark:text-slate-50 sm:text-5xl">
              Free Budget Planner & Expense Tracker
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              Build a simple monthly statement of what comes in and what goes out. Weekly pay and yearly bills are turned into monthly amounts for you, so you can see what is really left over and plan your savings.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {['Yearly bills shown monthly', '50/30/20 check', `${CURRENCIES.length} currencies`, 'CSV export', 'No signup'].map((t) => (
                <li key={t} className="rounded-full border border-slate-300 bg-white px-3 py-1 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-[1400px] px-3 pt-6 sm:px-6 lg:px-8">
          <div id="budget-planner" className="scroll-mt-20">
            <BudgetPlannerClient />
          </div>
        </div>

        <InContentAd />

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  Free Budget Planner & Expense Tracker: See Where Your Money Goes
                </h2>
                <div className="space-y-4 text-slate-700 dark:text-slate-300">
                  <p className="text-lg leading-relaxed">
                    Most budgets fail for a dull reason: they leave things out. The car insurance that renews once a year, the subscription billed every quarter, the birthday gifts in December. Each one is small next to rent, but together they are why a month that looked fine on paper ends short.
                  </p>
                  <p className="leading-relaxed">
                    This planner lays your money out like a bank statement. Money in on one side, money out on the other, every line converted to a monthly amount whatever its schedule. You see the real gap at the bottom, how each 100 you take home gets split, and how long your savings goal will take at the pace you can afford.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">How to Use the Budget Planner</h2>
                <ol className="space-y-5">
                  {[
                    ["Start with take home pay", "Use what actually lands in your account after tax and deductions, not your salary on paper. Add each source as its own line with how often it is paid."],
                    ["List your money out", "Open last month's bank statement and go line by line. Use the quick add buttons for the bills people forget. Pick yearly or every three months for bills that do not come monthly."],
                    ["Mark needs, wants and savings", "Needs are bills you must pay. Wants are things you could cut. Savings include investing and paying off debt faster than the minimum."],
                    ["Read the bottom line", "If you are short, start with the biggest want, then the biggest need you could change. If money is left over, give it a job in the savings goal."],
                    ["Keep it current", "The budget stays in this browser, so come back when your pay or bills change. Download a CSV each month if you want a record."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-800 text-sm font-bold text-white">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">{t}</h3>
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">How the 50/30/20 Rule Works</h2>
                <p className="mb-5 leading-relaxed text-slate-700 dark:text-slate-300">
                  Elizabeth Warren and Amelia Warren Tyagi described this split in their 2005 book <cite>All Your Worth</cite>. It divides take home pay into three parts:
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["50% needs", "Housing, utilities, groceries, transport, insurance and minimum debt payments."],
                    ["30% wants", "Eating out, streaming, hobbies, holidays and anything you could live without."],
                    ["20% savings", "An emergency fund, retirement, investing and paying debt off faster."],
                  ].map(([t, d]) => (
                    <div key={t} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                      <h3 className="mb-2 font-mono text-lg font-semibold text-slate-900 dark:text-white">{t}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  Treat it as a guide, not a pass or fail test. In cities where rent is high, needs often take well over half, and that does not mean you are doing something wrong. What matters is that you can see your own split and choose where to move it.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Budgeting Mistakes That Are Easy to Fix</h2>
                <div className="space-y-4">
                  {[
                    ["Forgetting bills that are not monthly", "Insurance, car tax, memberships and annual software renewals hit all at once. Enter them as yearly and the planner spreads them across the year, so you can set that amount aside each month."],
                    ["Budgeting from your salary instead of take home pay", "Tax, pension and other deductions come off first. A budget built on the bigger number will always come up short."],
                    ["No room for the unexpected", "Something breaks most months. A small line for repairs or one off costs keeps a single surprise from wrecking the plan."],
                    ["A goal with no monthly amount", "Saving for a deposit someday rarely happens. A target plus a fixed amount each month gives you a date, and the planner shows it."],
                    ["Never looking again", "Pay changes, prices rise and subscriptions creep in. A quick check each month keeps the numbers honest."],
                  ].map(([t, d], i) => (
                    <div key={t} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                      <h3 className="mb-2 font-semibold text-slate-900 dark:text-white"><span className="mr-2 font-mono text-sky-800 dark:text-sky-400">{i + 1}.</span>{t}</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Budgeting on a Freelance or Uneven Income</h2>
                <div className="space-y-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  <p>
                    If your income changes from month to month, build the budget on a low month, not an average one. Look back over the last six to twelve months and use a figure you hit in most of them. Anything you earn above it goes to savings or a buffer for quiet months.
                  </p>
                  <p>
                    Freelancers should also set aside money for tax as its own line in money out, so it never looks like spare cash. How much depends on where you live and how you are set up, so check with a local accountant.
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
                <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Related Tools for Personal Finance</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/salary-estimator", "Salary Estimator", "Check official pay ranges for your job and area before you plan."],
                    ["/tools/habit-tracker", "Habit Tracker", "Track a daily money habit, like logging what you spend."],
                    ["/tools/productivity-planner", "Productivity Planner", "Plan the day with time blocks and a Top 3."],
                    ["/tools/startup-idea-generator", "Startup Idea Generator", "Side business ideas that fit your time and budget."],
                    ["/trends/ai-side-hustles-make-money-2026", "AI Side Hustles Report", "Realistic ways to add income, with the catches."],
                    ["/tools", "View all free tools", "Planners, checkers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-sky-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-700">
                      <h3 className="mb-2 font-semibold text-slate-900 group-hover:text-sky-800 dark:text-white dark:group-hover:text-sky-400">{t}</h3>
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
                    Set up an automatic transfer to savings on the day you get paid. Money you never see in your spending account is much easier to keep.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/tools/salary-estimator", "What does your job pay?"],
                      ["/trends/ai-side-hustles-make-money-2026", "AI Side Hustles Report"],
                      ["/blog/ai-automation-business-ideas-2026", "AI Automation Business Ideas"],
                    ].map(([href, t]) => (
                      <li key={href}>
                        <Link href={href} className="text-sky-800 hover:underline dark:text-sky-400">{t}</Link>
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
