import { Metadata } from 'next';
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { siteConfig } from '@/data/config';
import { SoftwareApplicationSchema, BreadcrumbSchema, FAQSchema, HowToSchema } from '@/components/seo/SchemaMarkup';
import { InContentAd, SidebarAd } from '@/components/ads/AdBanner';
import AIContentDetectorClient from './AIContentDetectorClient';

export const metadata: Metadata = generatePageMetadata(toolMetadata['ai-content-detector']);

const STANFORD_URL = 'https://ee.stanford.edu/james-zou-et-al-warn-objectivity-ai-detectors';

const faqs = [
  {
    question: 'How does this AI content detector work?',
    answer:
      'It measures ten writing signals that separate human and AI text: how evenly vocabulary is spread, how often AI favourite words appear, how many sentences open with stock transitions, how much sentence length varies, and human traces such as brackets, quotations, contractions and the small marks people leave when typing. Each signal is compared with typical human and AI writing, and the results are combined into one AI signal score from 0 to 100. It is a statistical style check. It does not run a large language model, and it tells you which signals drove the score.',
  },
  {
    question: 'How accurate is it?',
    answer:
      'In our September 2026 test on 57 texts, it gave a clear verdict on 34 and all 34 were right. The other 23 came back as unclear, which is the tool refusing to guess. No human text was called AI and no AI text was called human. That test was small, and every AI sample came from one model family, so expect more unclear results on text from other models and on AI drafts that someone has edited. No detector, free or paid, is proof of authorship.',
  },
  {
    question: 'Can it tell which AI tool wrote my text?',
    answer:
      'No. It estimates whether the writing style looks more like AI or more like a person. It cannot tell ChatGPT from Claude or Gemini, and any tool that claims to name the model from a few paragraphs should be treated with suspicion.',
  },
  {
    question: 'Is my text stored?',
    answer:
      'No. Your text is sent to our server, checked in a few milliseconds and discarded. It is not saved, logged or passed to any third party service.',
  },
  {
    question: 'How much text do I need?',
    answer:
      'At least 80 words. Results get steadier from about 150 words, and the tool asks for a stronger signal before saying AI on anything shorter than that. You can check up to 50,000 characters at once.',
  },
  {
    question: 'Why was my own writing marked unclear or AI?',
    answer:
      'Formal writing, technical documentation, templates and non native English all share traits with AI text: tidy grammar, even sentence length and few informal marks. A Stanford study in 2023 found that seven popular detectors flagged 61 percent of essays by non native English writers as AI, while essays by native speakers were judged almost perfectly. That is why this tool has a wide unclear band and never treats a score as proof.',
  },
  {
    question: 'Does it work in other languages?',
    answer:
      'It is built and tested for English only. Text in other languages will produce scores, but they are not meaningful.',
  },
  {
    question: 'Can AI text be made undetectable?',
    answer:
      'Heavily edited AI text often lands in the unclear band here, and it fools paid detectors too. The better goal is writing that is genuinely yours: add what only you know, cut stock phrases, and let your natural rhythm show. Readers notice the difference even when detectors do not.',
  },
];

export default function AIContentDetectorPage() {
  return (
    <>
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Content Detector"
        description="Free AI content detector. Paste English text to see whether it reads like AI writing or human writing, which sentences carry AI style patterns, and why. An estimate with an honest unclear band, never proof."
        url={`${siteConfig.url}/tools/ai-content-detector`}
        applicationCategory="UtilityApplication"
        operatingSystem="Web"
        offers={{ price: '0', priceCurrency: 'USD' }}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Tools', url: `${siteConfig.url}/tools` },
          { name: 'AI Content Detector', url: `${siteConfig.url}/tools/ai-content-detector` },
        ]}
      />
      <FAQSchema faqs={faqs} />

      <HowToSchema
        name="How to check whether text was written by AI"
        description="Use the free DevelopersMatrix AI Content Detector to see whether text reads like AI writing, which sentences carry AI patterns, and how much weight to give the result."
        url={`${siteConfig.url}/tools/ai-content-detector`}
        totalTime="PT1M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        tool={['Web browser', 'DevelopersMatrix AI Content Detector']}
        step={[
          {
            name: 'Paste the text',
            text: 'Paste at least 80 words of English text into the detector. Results are steadier from about 150 words.',
          },
          {
            name: 'Read the verdict and score',
            text: 'The tool shows Likely human, Unclear or Likely AI, with an AI signal score from 0 to 100. Under 35 is likely human, 35 to 69 is unclear, and 70 or more is likely AI. Texts under 150 words need 75 or more.',
          },
          {
            name: 'Check why',
            text: 'Read the list of signals that drove the score, then open the highlighted text to see which sentences carry stock AI patterns.',
          },
          {
            name: 'Weigh it as evidence, not proof',
            text: 'Treat the result as one signal among several. Formal writing and non native English can look AI like. Never use a single score to accuse anyone.',
          },
        ]}
      />

      <main className="pt-16" id="ai-content-detector">
        <AIContentDetectorClient />

        <InContentAd />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1">
              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                  A free AI content detector that shows its working
                </h2>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  Most free AI checkers give you a single percentage and nothing else. You cannot see why the number is
                  high, so you cannot judge whether to trust it. This one tells you which writing signals pushed the
                  score up or down, highlights the sentences that carry stock AI patterns, and says plainly when the
                  evidence is mixed.
                </p>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  It is built for editors checking freelance work, teachers who want a second opinion before a
                  conversation, SEO teams reviewing drafts before they publish, and writers who want their own work to
                  read less like a machine. It is free, needs no signup, and does not store what you paste.
                </p>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  A note on honesty. Until September 2026 this page ran an older method. When we tested it properly, it
                  scored almost every text around 30 percent, whoever wrote it, so it could not tell people from AI at
                  all. We threw it out and rebuilt the detector around signals that held up on text they had never seen.
                  The results of that test are below.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">What the detector looks at</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    [
                      'Word choice',
                      'AI models lean on words like additionally, crucial, enhance and ultimately far more than people do. They also spread vocabulary unusually evenly, where people keep returning to the words their topic needs.',
                    ],
                    [
                      'Sentence rhythm',
                      'People mix very short sentences with long, winding ones. AI models tend to settle into a tidy middle length. The tool measures how much your sentence lengths vary.',
                    ],
                    [
                      'Human traces',
                      'Brackets, quotations, contractions like don’t, colons, and the small marks people leave when typing fast are all far more common in human writing.',
                    ],
                    [
                      'Stock patterns',
                      'Sentences that open with However, Additionally or In conclusion, and phrases such as it is important to note, are highlighted so you can see exactly where they sit.',
                    ],
                  ].map(([title, body]) => (
                    <div key={title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">{title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{body}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 leading-relaxed text-gray-700 dark:text-gray-300">
                  It does not run a large language model. Paid detectors such as GPTZero and Grammarly train machine learning
                  models on large collections of human and AI writing, which is how they reach higher accuracy. This tool is a transparent statistical
                  check that runs in milliseconds, and it is upfront about where that stops.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">How accurate is it? Our own test</h2>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  In September 2026 we ran the detector on 57 texts. The 30 human samples were all written before
                  modern AI chatbots existed: Wikipedia articles from 2019, Hacker News comments from 2015 and Stack
                  Exchange answers from 2010 to 2016. The 27 AI samples covered essays, emails, product copy, stories,
                  listicles, technical explainers and blog posts. We tuned the tool on 23 of them and then checked it on
                  34 it had never seen.
                </p>
                <div className="mb-4 overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 text-left dark:border-gray-700">
                        <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-white">All 57 texts</th>
                        <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-white">Likely human</th>
                        <th className="py-2 pr-4 font-semibold text-gray-900 dark:text-white">Unclear</th>
                        <th className="py-2 font-semibold text-gray-900 dark:text-white">Likely AI</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-gray-300">
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 pr-4">30 human texts</td>
                        <td className="py-2 pr-4">18</td>
                        <td className="py-2 pr-4">12</td>
                        <td className="py-2">0</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">27 AI texts</td>
                        <td className="py-2 pr-4">0</td>
                        <td className="py-2 pr-4">11</td>
                        <td className="py-2">16</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  Whenever it gave a clear verdict, it was right. It declined to decide on 23 of the 57 texts,
                  and that is deliberate: a wrong accusation does more harm than an honest shrug.
                </p>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Read these numbers with care. The test was small, and every AI sample came from one model family, so
                  text from other models and AI drafts that a person has edited will land in the unclear band more often.
                  Your results will vary with the kind of writing you check.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Why no AI detector is proof</h2>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  In 2023, researchers at Stanford tested seven popular AI detectors on essays written by people. The
                  detectors flagged 61 percent of TOEFL essays by non native English speakers as AI, and 89 of the 91
                  essays were flagged by at least one detector. Essays by native speakers were judged almost perfectly.{' '}
                  <a href={STANFORD_URL} className="text-blue-600 underline dark:text-blue-400" rel="noopener noreferrer" target="_blank">
                    Read the Stanford summary
                  </a>
                  .
                </p>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  The reason is simple. Careful, formal and second language writing shares traits with AI text: clean
                  grammar, even sentences, few informal marks. Edited AI text blurs the other way. Even Grammarly
                  describes its own detector as a starting point for review, not final proof.
                </p>
                <p className="mb-2 leading-relaxed text-gray-700 dark:text-gray-300">This tool builds that caution in:</p>
                <ul className="list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300">
                  <li>A wide unclear band from 35 to 69, where it draws no conclusion.</li>
                  <li>Texts under 150 words need a score of 75, not 70, before it says AI.</li>
                  <li>It refuses to check fewer than 80 words.</li>
                  <li>Reliability is shown as Low or Moderate. It never claims High.</li>
                </ul>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">How to use the result well</h2>
                <h3 className="mb-2 mt-2 text-lg font-semibold text-gray-900 dark:text-white">If you are checking someone else&apos;s work</h3>
                <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
                  Use a high score as a reason to talk, not a verdict. Ask about the process, look at earlier drafts or
                  version history, and compare with writing you know is theirs. An unclear result means the tool cannot
                  tell, not that someone is hiding something.
                </p>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">If you are checking your own writing</h3>
                <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                  Open the highlighted sentences and the writing tips. Cut stock openers, swap AI favourite words for
                  plainer ones, vary your sentence length, and add something only you know: a number from your own work,
                  a quote, a short aside. Those edits make writing better for readers, which matters more than any score.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">More free writing and SEO tools</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ['/tools/ai-resume-builder', 'AI Resume Builder', 'Build an ATS friendly resume, then read it back here to make sure it sounds like you.'],
                    ['/tools/ai-cover-letter-generator', 'AI Cover Letter Generator', 'Draft a cover letter, then check it here before you send it.'],
                    ['/tools/ai-email-assistant', 'AI Email Assistant', 'Draft professional emails and check that they still sound like you.'],
                    ['/tools/website-audit', 'Website Audit Tool', 'Check your site for SEO, speed and security problems.'],
                    ['/tools/ai-prompt-library', 'AI Prompt Library', 'Better prompts for better first drafts.'],
                    ['/tools', 'All free tools', 'Interview practice, salary estimates, budget planning and more.'],
                  ].map(([href, title, body]) => (
                    <a
                      key={href}
                      href={href}
                      className="group block rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700"
                    >
                      <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{body}</p>
                    </a>
                  ))}
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">Frequently asked questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                      <summary className="flex cursor-pointer list-none items-center justify-between p-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40">
                        <span className="pr-4 font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm text-gray-500 transition-transform group-open:rotate-180 dark:bg-gray-700 dark:text-gray-400">
                          ▼
                        </span>
                      </summary>
                      <div className="border-t border-gray-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-gray-600 dark:border-gray-700 dark:text-gray-400">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            <div className="flex-shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Our test in numbers</h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">57</span>
                      <span>texts tested, September 2026</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">34</span>
                      <span>clear verdicts, all 34 correct</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">23</span>
                      <span>marked unclear rather than guessed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">0</span>
                      <span>human texts called AI</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-xs text-gray-500">Small test, one AI model family. Treat as a guide.</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Related reading</h3>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <a href="/blog/ai-content-creation-business-2026" className="text-blue-600 hover:underline dark:text-blue-400">
                        AI content creation business
                      </a>
                    </li>
                    <li>
                      <a href="/trends/creator-economy-trends-2026" className="text-blue-600 hover:underline dark:text-blue-400">
                        Creator economy trends
                      </a>
                    </li>
                    <li>
                      <a href="/trends/chatgpt-advanced-prompts-2026" className="text-blue-600 hover:underline dark:text-blue-400">
                        ChatGPT prompts guide
                      </a>
                    </li>
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
