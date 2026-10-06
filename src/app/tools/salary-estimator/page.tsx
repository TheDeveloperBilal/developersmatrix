import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { JOBS, JOB_BY_CODE, TITLE_HINTS } from "@/lib/salary/jobs";
import { AREA_COUNT, AREA_COUNTS, DATA_PERIOD, DATA_RELEASED, NATIONAL } from "@/lib/salary/national";
import SalaryEstimatorClient from "./SalaryEstimatorClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata['salary-estimator']);

// Every count and figure on this page comes from the BLS data files, so the
// copy updates itself when the data is rebuilt.
const JOB_COUNT = JOBS.length;
const RELEASED = new Date(`${DATA_RELEASED}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const DATA_YEAR = Number(DATA_PERIOD.split(' ')[1]);
const usd = (n: number) => `$${n.toLocaleString('en-US')}`;

const byMedian = JOBS
  .map((j) => ({ job: j, n: NATIONAL[j.code] }))
  .filter((r) => r.n)
  .sort((a, b) => b.n.p[2] - a.n.p[2]);

const dev = NATIONAL['15-1252'];

const toolFaqs = [
  {
    question: "Where does this salary data come from?",
    answer: `From the U.S. Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics survey. The tool uses the ${DATA_PERIOD} estimates, which BLS released on ${RELEASED}. BLS builds them from pay reported by employers across the country, not from job ads or self reported salaries.`
  },
  {
    question: "How accurate are these salary figures?",
    answer: "They are the official government estimates, based on a large employer survey, so they are a solid benchmark. They are still estimates, and they describe everyone in a job category, not one company or one person. Your own pay depends on your employer, industry, skills and experience, so use the range to see what is normal rather than as a promise of what you will be offered."
  },
  {
    question: "How often is the salary data updated?",
    answer: `Once a year. BLS publishes new estimates each spring, and this tool is rebuilt from the official files when it does. The current figures are the ${DATA_PERIOD} estimates released on ${RELEASED}.`
  },
  {
    question: "Do the salaries include bonuses and stock?",
    answer: "No. The figures are pay before tax: base pay plus commissions, tips and production bonuses where a job has them. Overtime pay, other bonuses, benefits and stock are not included. At companies that pay a lot of stock or bonus, total pay can be well above these numbers."
  },
  {
    question: "Can I see salaries by experience level?",
    answer: "Not directly. BLS does not record years of experience, so there are no honest junior or senior figures to show. What you get instead is the full spread of pay, from the 10th to the 90th percentile. As a rough guide, people new to a job are more often in the lower part of that spread and people with many years in it are more often in the upper part."
  },
  {
    question: "Why can't I find my exact job title?",
    answer: `BLS sorts jobs into official categories, and some modern titles, such as DevOps engineer, product manager or machine learning engineer, do not have a category of their own. When you search one of those titles, the tool says so and shows the closest official categories. ${JOB_COUNT} categories are covered, across software, IT, data, design, marketing and business.`
  },
  {
    question: "Does it cover salaries outside the US?",
    answer: `No. The data covers the United States only: the whole country, all 50 states and DC, ${AREA_COUNTS.territories} U.S. territories, ${AREA_COUNTS.metros} metro areas and ${AREA_COUNTS.nonmetros} nonmetro areas. Pay is shown in US dollars and is not adjusted for cost of living.`
  },
  {
    question: "Is the salary estimator free?",
    answer: "Yes. It is free with no signup and no limits. Any amount you type to check an offer stays in your browser and is never sent to us."
  }
];

export default function SalaryEstimatorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Salary Estimator", url: `${siteConfig.url}/tools/salary-estimator` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Salary Estimator"
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        description={`Free salary estimator using official BLS wage data (${DATA_PERIOD}). See the pay range for ${JOB_COUNT} tech, data, design, marketing and business jobs in any US state or metro area, check an offer and compare places.`}
        url={`${siteConfig.url}/tools/salary-estimator`}
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <FAQSchema faqs={toolFaqs} />
      <HowToSchema
        name="How to Check a Salary Range for Your Job"
        description="Look up the official pay range for a job and place, then check an offer against it."
        url={`${siteConfig.url}/tools/salary-estimator`}
        totalTime="PT2M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'DevelopersMatrix Salary Estimator']}
        step={[
          { name: "Choose a job", text: `Search your job title or browse ${JOB_COUNT} job categories. If BLS does not track your title separately, the tool shows the closest official categories.` },
          { name: "Choose a place", text: "Pick the whole US, a state, or a metro area. Type a city name to find the metro area it belongs to." },
          { name: "Read the pay range", text: "See the median and the 10th, 25th, 75th and 90th percentile pay for that job and place, per year, month or hour." },
          { name: "Check an offer", text: "Type an offer or your current pay to see roughly which percentile it falls at." },
          { name: "Compare places", text: "Add up to three more places to compare the same job on one scale." }
        ]}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pb-12 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
              <Link href="/tools" className="hover:text-zinc-900 dark:hover:text-white">Tools</Link>
              <span className="mx-2 text-zinc-300 dark:text-zinc-600">/</span>
              <span className="text-zinc-700 dark:text-zinc-300">Salary Estimator</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
              Free Salary Estimator 2026
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
              See what {JOB_COUNT} tech, data, design, marketing and business jobs really pay in any US state or metro area. Every number comes from the official U.S. Bureau of Labor Statistics wage survey, not from guesses or job ads.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {[`${JOB_COUNT} jobs`, `${AREA_COUNT} places`, `BLS data, ${DATA_PERIOD}`, 'No signup'].map((t) => (
                <li key={t} className="rounded-full border border-zinc-200 bg-white px-3 py-1 font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">{t}</li>
              ))}
            </ul>
          </div>
          {/* Ruler ticks along the bottom edge */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3 bg-[repeating-linear-gradient(to_right,rgba(113,113,122,0.35)_0_1px,transparent_1px_12px)] [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] dark:bg-[repeating-linear-gradient(to_right,rgba(161,161,170,0.25)_0_1px,transparent_1px_12px)]" />
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-6xl px-2 pt-6 sm:px-6 lg:px-8">
          <div id="salary-estimator" className="scroll-mt-20">
            <SalaryEstimatorClient />
          </div>
        </div>

        <InContentAd />

        {/* Content */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Free Tech Salary Estimator: Know Your Market Value
                </h2>
                <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
                  <p className="text-lg leading-relaxed">
                    Most salary sites mix job ads, anonymous submissions and guesses. This one uses a single source: the wage survey run by the <strong>U.S. Bureau of Labor Statistics</strong>, where employers report what they actually pay. You see the same figures BLS publishes, for the job and place you choose.
                  </p>
                  <p className="leading-relaxed">
                    For example, the median pay for software developers across the US was {usd(dev.p[2])} a year in {DATA_PERIOD}. The middle half earned between {usd(dev.p[1])} and {usd(dev.p[3])}, and the top 10% earned more than {usd(dev.p[4])}. Pick a state or a metro area in the tool and the range changes to match that place.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Median Pay by Job in the US
                </h2>
                <p className="mb-6 text-sm text-zinc-500">
                  Yearly pay before tax, {DATA_PERIOD}. The middle half is the 25th to the 75th percentile. Select a job to open it in the estimator.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full min-w-[34rem] text-left text-sm">
                    <thead className="bg-zinc-50 text-[12px] uppercase tracking-[0.08em] text-zinc-500 dark:bg-zinc-900">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Job</th>
                        <th scope="col" className="px-4 py-3 text-right font-medium">Median</th>
                        <th scope="col" className="px-4 py-3 text-right font-medium">Middle half</th>
                        <th scope="col" className="px-4 py-3 text-right font-medium">Jobs in the US</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {byMedian.map(({ job, n }) => (
                        <tr key={job.code} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50">
                          <th scope="row" className="px-4 py-2.5 font-medium text-zinc-900 dark:text-white">
                            <a href={`?job=${job.code}#salary-estimator`} className="hover:text-teal-700 hover:underline dark:hover:text-teal-400">{job.name}</a>
                          </th>
                          <td className="px-4 py-2.5 text-right font-mono tabular-nums text-zinc-900 dark:text-white">{usd(n.p[2])}</td>
                          <td className="whitespace-nowrap px-4 py-2.5 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{usd(n.p[1])} to {usd(n.p[3])}</td>
                          <td className="px-4 py-2.5 text-right font-mono tabular-nums text-zinc-600 dark:text-zinc-400">{n.emp ? n.emp.toLocaleString('en-US') : 'n/a'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12.5px] text-zinc-500">
                  Source: U.S. Bureau of Labor Statistics, Occupational Employment and Wage Statistics, {DATA_PERIOD}. Job counts exclude the self employed.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Where This Salary Data Comes From
                </h2>
                <div className="space-y-4 leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <p>
                    The Occupational Employment and Wage Statistics survey, run by BLS with state workforce agencies, asks employers how many people they employ in each job and what they pay them. Each set of estimates pools six survey rounds collected over three years, from a sample of about 1.1 million workplaces.
                  </p>
                  <p>
                    BLS publishes new estimates once a year. The {DATA_PERIOD} figures used here came out on {RELEASED}, and they are the newest official pay data available. When BLS releases the next set, the tool is rebuilt from the new files, so the numbers always match what BLS publishes.
                  </p>
                  <p>
                    BLS only publishes an estimate when enough employers report a job in an area. That is why a small metro area sometimes has no figure for a specialized job. When that happens, the tool tells you and suggests a larger area.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  What the Numbers Include and Leave Out
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="mb-3 font-semibold text-zinc-900 dark:text-white">Included</h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      <li>Base pay before tax</li>
                      <li>Commissions and production bonuses</li>
                      <li>Tips, where a job has them</li>
                      <li>Full time and part time employees on a payroll</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <h3 className="mb-3 font-semibold text-zinc-900 dark:text-white">Not included</h3>
                    <ul className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      <li>Overtime pay and other bonuses</li>
                      <li>Stock, equity and benefits</li>
                      <li>Freelancers and the self employed</li>
                      <li>Any adjustment for cost of living</li>
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Because stock and most bonuses are left out, these figures can sit well below total pay at large tech companies. They are a fair picture of base pay across all employers, from small firms to large ones.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  How to Use Salary Data When You Negotiate
                </h2>
                <ol className="space-y-6">
                  {[
                    ["Find the right job category", "Pick the category that matches what you do every day, not just your title. A \"web developer\" building complex applications may fit Software developers better than Web developers."],
                    ["Use the place you will work", "Pay differs a lot between metro areas. Check the metro area of the job, and for a remote role check both where you live and where the company is based."],
                    ["Place yourself on the range", "Decide honestly where your experience and skills put you. Someone new to the field and someone with ten years in it should not anchor on the same number."],
                    ["Check the offer before you answer", "Type the offer into the tool. If it lands well below where you placed yourself, you have a clear, sourced reason to ask for more."],
                    ["Talk about total pay", "These figures leave out bonuses, stock and benefits. Ask what the full package is worth, and compare like with like."],
                  ].map(([t, p], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-zinc-900 dark:text-white">{t}</h3>
                        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{p}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Job Titles BLS Does Not Track Separately
                </h2>
                <p className="mb-6 leading-relaxed text-zinc-700 dark:text-zinc-300">
                  Some common tech titles have no official category of their own. Search one of them in the tool and it shows these closest categories. Pick the one that fits your daily work.
                </p>
                <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {TITLE_HINTS.filter((h) => !h.note).map((h) => (
                      <div key={h.title} className="grid gap-1 px-4 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                        <dt className="font-medium text-zinc-900 dark:text-white">{h.title}</dt>
                        <dd className="text-sm text-zinc-600 dark:text-zinc-400">{h.codes.map((c) => JOB_BY_CODE[c]?.name).filter(Boolean).join(', ')}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Frequently Asked Questions About the Salary Estimator
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
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
                  Related Career Tools
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/ai-resume-builder", "AI Resume Builder", "Write an ATS friendly resume with a live check on every bullet."],
                    ["/tools/ai-cover-letter-generator", "Cover Letter Generator", "Build a cover letter around the job posting and your own experience."],
                    ["/tools/ai-interview-simulator", "Interview Simulator", "Practice interview questions and see what your answers covered and missed."],
                    ["/tools/budget-planner", "Budget Planner", "Plan your spending and savings around a new salary."],
                    ["/tools/ai-prompt-library", "AI Prompt Library", "Ready prompts for salary negotiation scripts, follow up emails and more."],
                    ["/tools", "View all free tools", "Planners, checkers, calculators and more."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-teal-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-teal-700">
                      <h3 className="mb-2 font-semibold text-zinc-900 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-400">{t}</h3>
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
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">About the data</h3>
                  <dl className="space-y-2.5 text-sm">
                    {[
                      ["Source", "U.S. Bureau of Labor Statistics"],
                      ["Survey", "Occupational Employment and Wage Statistics"],
                      ["Period", DATA_PERIOD],
                      ["Released", RELEASED],
                      ["Jobs covered", String(JOB_COUNT)],
                      ["Places", `${AREA_COUNT} in the US`],
                      ["Next update", `When BLS releases ${DATA_PERIOD.split(' ')[0]} ${DATA_YEAR + 1} data`],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-zinc-500">{k}</dt>
                        <dd className="text-right font-medium text-zinc-900 dark:text-white">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline dark:text-teal-400">
                    BLS wage survey home
                  </a>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">Related Resources</h3>
                  <ul className="space-y-3 text-sm">
                    {[
                      ["/trends/tech-skills-demand-2026", "Most In Demand Tech Skills for 2026"],
                      ["/trends/remote-tech-jobs-guide-2026", "Remote Tech Jobs Guide"],
                      ["/trends/tech-interview-preparation-2026", "Tech Interview Trends 2026"],
                      ["/tools/ai-resume-builder", "AI Resume Builder"],
                    ].map(([href, t]) => (
                      <li key={href}>
                        <Link href={href} className="text-teal-700 hover:underline dark:text-teal-400">{t}</Link>
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
