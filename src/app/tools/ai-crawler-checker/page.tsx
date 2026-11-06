import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { BreadcrumbSchema, FAQSchema, HowToSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { AI_BOTS, BOTS_CHECKED, PURPOSES } from "@/lib/ai-crawlers/bots";
import AiCrawlerCheckerClient from "./AiCrawlerCheckerClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata["ai-crawler-checker"]);

const PATH = "/tools/ai-crawler-checker";
const URL = `${siteConfig.url}${PATH}`;
const BOT_COUNT = AI_BOTS.length;
const CHECKED = new Date(`${BOTS_CHECKED}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const ROBOTS_WORDS = { yes: "Yes", "may-ignore": "May ignore it", token: "Not a crawler" } as const;

const toolFaqs = [
  {
    question: "Does blocking GPTBot remove my site from ChatGPT?",
    answer:
      "No. GPTBot only collects pages for training OpenAI models. ChatGPT search uses a different crawler, OAI-SearchBot, so that is the one that decides whether your pages can appear there. You can block GPTBot and still appear in ChatGPT search, as long as OAI-SearchBot is allowed.",
  },
  {
    question: "Does blocking Google-Extended hurt my Google rankings?",
    answer:
      "No. Google says Google-Extended does not affect a site's inclusion in Google Search and is not a ranking signal. It only controls whether pages Googlebot already crawls may be used to train Gemini models and to ground Gemini answers.",
  },
  {
    question: "Which AI crawlers should I allow?",
    answer:
      "If you want visitors from AI search, allow the search and answer crawlers: OAI-SearchBot, Claude-SearchBot, PerplexityBot and meta-webindexer, plus Googlebot and Bingbot for normal search. Whether to allow training crawlers such as GPTBot, ClaudeBot, Google-Extended and CCBot is a separate business choice. Blocking them does not stop you appearing in AI search.",
  },
  {
    question: "Can robots.txt stop every AI bot?",
    answer:
      "No. robots.txt is a request, not a lock. The large AI companies say their crawlers follow it, but fetchers that act for a person, such as ChatGPT-User, Perplexity-User and meta-externalfetcher, may ignore it according to their own documentation. To block a bot for certain, you need a firewall rule on your server or CDN.",
  },
  {
    question: "How long do robots.txt changes take to work?",
    answer:
      "Usually up to a day. Google says it generally caches robots.txt for up to 24 hours, and Meta says the same for its crawlers. Content a bot already collected before the change is not removed.",
  },
  {
    question: "What is a Content-Signal line in robots.txt?",
    answer:
      "It is part of Cloudflare's Content Signals Policy. A line such as Content-Signal: search=yes, ai-train=no states whether content may be used for search, for AI answers (ai-input) and for AI training. Cloudflare adds search=yes, ai-train=no to sites that use its managed robots.txt. The signals state a preference; they do not block anything on their own.",
  },
  {
    question: "Do I need an llms.txt file?",
    answer:
      "Not yet. llms.txt is a proposed file that gives AI tools a short guide to a site. An Ahrefs study of 137,000 sites found 97% of llms.txt files never got a request. It does no harm to have one, but robots.txt is what AI crawlers actually read.",
  },
  {
    question: "Is the AI crawler checker free?",
    answer:
      "Yes. It is free with no signup. It reads only your public robots.txt and llms.txt files, and nothing is stored.",
  },
];

const steps = [
  { name: "Enter an address", text: "Type a domain such as example.com, or a full page address to check one page." },
  { name: "Run the check", text: "The checker reads the site's robots.txt and llms.txt and applies the rules each AI crawler follows." },
  { name: "Read each bot's result", text: "See whether each crawler is allowed or blocked and the exact robots.txt line that decides it." },
  { name: "Copy new rules if needed", text: "Pick a policy, such as allow AI search but block training, and copy the robots.txt lines." },
];

export default function AiCrawlerCheckerPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "AI Crawler Checker", url: URL },
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix AI Crawler Checker"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web"
        description={`Free AI crawler checker. See whether a site's robots.txt allows ${BOT_COUNT} AI crawlers including GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended, with the line that decides each one.`}
        url={URL}
        offers={{ price: "0", priceCurrency: "USD" }}
        featureList={[
          `Checks ${BOT_COUNT} AI crawlers and control tokens`,
          "Shows the robots.txt line that decides each crawler",
          "Separates AI search, fetches on request and model training",
          "Checks for an llms.txt file and Content-Signal lines",
          "Builds robots.txt rules to copy",
        ]}
      />
      <FAQSchema faqs={toolFaqs} />
      <HowToSchema
        name="How to check if your site blocks AI crawlers"
        description="Check which AI crawlers your robots.txt allows and blocks."
        url={URL}
        totalTime="PT1M"
        estimatedCost={{ currency: "USD", value: "0" }}
        tool={["Web browser", "DevelopersMatrix AI Crawler Checker"]}
        step={steps}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-ink-200 bg-white">
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,26,38,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,26,38,0.045)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
              <Link href="/tools" className="hover:text-ink-900">Tools</Link>
              <span className="mx-2 text-ink-300">/</span>
              <span className="text-ink-700">AI Crawler Checker</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance font-sora text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">AI Crawler Checker</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              Check whether ChatGPT, Claude, Perplexity, Google and other AI crawlers can read your website. Enter an address to see what your robots.txt tells each AI bot, the exact line that decides it, and whether you have an llms.txt file.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {[`${BOT_COUNT} AI crawlers`, "Search and training split", "Line by line reasons", "No signup"].map((t) => (
                <li key={t} className="rounded-full border border-ink-200 bg-white px-3 py-1 font-medium text-ink-700">{t}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-6xl px-2 pt-6 sm:px-6 lg:px-8">
          <div id="checker" className="scroll-mt-20">
            <AiCrawlerCheckerClient />
          </div>
        </div>

        <InContentAd />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">
              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Which AI Crawlers Should You Allow?</h2>
                <div className="space-y-4 text-ink-700">
                  <p className="text-lg leading-relaxed">
                    AI crawlers do three different jobs, and robots.txt lets you treat each one differently. Search crawlers decide whether your pages can be found and cited in AI answers. Fetchers visit a page when someone asks an assistant about it. Training crawlers collect pages to build AI models.
                  </p>
                  <p className="leading-relaxed">
                    The most common mistake is blocking a training crawler and thinking it removes you from AI search, or blocking a search crawler by accident while trying to stop training. Blocking GPTBot does not take you out of ChatGPT search, because ChatGPT search uses OAI-SearchBot. Blocking Google-Extended does not affect Google Search, because Googlebot does the crawling.
                  </p>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {PURPOSES.map((p) => (
                    <div key={p.id} className="rounded-2xl border border-ink-200 bg-white p-5">
                      <h3 className="mb-2 font-semibold text-ink-900">{p.title}</h3>
                      <p className="text-sm leading-relaxed text-ink-600">{p.blurb}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">AI Crawler User Agents and What They Do</h2>
                <p className="mb-6 text-sm text-ink-500">
                  The robots.txt name for each AI crawler, taken from each company&apos;s own documentation. Checked {CHECKED}.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-ink-200">
                  <table className="table-stack table-stack--grid w-full text-left text-sm sm:min-w-[44rem]">
                    <thead className="bg-ink-50 text-[12px] uppercase tracking-[0.08em] text-ink-500">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">robots.txt name</th>
                        <th scope="col" className="px-4 py-3 font-medium">Company</th>
                        <th scope="col" className="px-4 py-3 font-medium">Used for</th>
                        <th scope="col" className="px-4 py-3 font-medium">Follows robots.txt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {AI_BOTS.map((b) => (
                        <tr key={b.token} className="align-top hover:bg-ink-50/70">
                          <th scope="row" className="whitespace-nowrap px-4 py-2.5 font-mono text-[13px] font-semibold text-ink-900">{b.token}</th>
                          <td data-label="Company" className="whitespace-nowrap px-4 py-2.5 text-ink-700">
                            <a href={b.docs} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">{b.company}</a>
                          </td>
                          <td data-label="Used for" className="px-4 py-2.5 text-ink-600">{b.does}</td>
                          <td data-label="Follows robots.txt" className={`whitespace-nowrap px-4 py-2.5 ${b.robots === "may-ignore" ? "text-amber-700" : "text-ink-700"}`}>{ROBOTS_WORDS[b.robots]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">How to Allow AI Search but Block AI Training</h2>
                <p className="mb-4 leading-relaxed text-ink-700">
                  Put each kind of crawler in its own group. One group can list several user agents, and a blank line between groups keeps them apart:
                </p>
                <pre className="overflow-x-auto rounded-2xl bg-ink-950 p-5 font-mono text-[13px] leading-relaxed text-ink-200">{`User-agent: OAI-SearchBot
User-agent: Claude-SearchBot
User-agent: PerplexityBot
Allow: /

User-agent: GPTBot
User-agent: ClaudeBot
User-agent: Google-Extended
User-agent: CCBot
Disallow: /`}</pre>
                <p className="mt-4 leading-relaxed text-ink-700">
                  A crawler follows only the group that names it, and ignores your group for all bots (<span className="font-mono text-sm">User-agent: *</span>). So if that group blocks folders such as <span className="font-mono text-sm">/admin/</span> or <span className="font-mono text-sm">/cart/</span>, repeat those lines inside the AI groups. The rule builder in the checker above gives you the full set to copy.
                </p>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">How the Checker Reads robots.txt</h2>
                <p className="mb-4 leading-relaxed text-ink-700">
                  It follows the robots.txt standard (RFC 9309) the way Google applies it, so the answer matches what a well behaved crawler would do:
                </p>
                <ul className="space-y-3 leading-relaxed text-ink-700">
                  <li><strong className="text-ink-900">The most specific group wins.</strong> A bot uses the group that names it. Only if none does, it uses the <span className="font-mono text-sm">*</span> group.</li>
                  <li><strong className="text-ink-900">The longest matching rule wins.</strong> <span className="font-mono text-sm">Allow: /blog/</span> beats <span className="font-mono text-sm">Disallow: /</span> for a blog page, and Allow wins a tie.</li>
                  <li><strong className="text-ink-900">No file means no limits.</strong> A robots.txt that returns 404 lets every crawler in.</li>
                  <li><strong className="text-ink-900">A broken file means wait.</strong> Google treats a server error on robots.txt as a temporary block on the whole site, and other crawlers tend to do the same.</li>
                  <li><strong className="text-ink-900">A web page is not a robots.txt.</strong> Some sites answer /robots.txt with their homepage. Crawlers find no rules in that, so everything is allowed.</li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">What robots.txt Cannot Do</h2>
                <ul className="space-y-3 leading-relaxed text-ink-700">
                  <li><strong className="text-ink-900">It does not block anything by force.</strong> It asks politely. Firewalls and CDN bot settings, such as Cloudflare&apos;s, can block AI crawlers even when robots.txt allows them, and this checker cannot see those from outside.</li>
                  <li><strong className="text-ink-900">It does not remove what was already collected.</strong> A new Disallow only affects future crawling.</li>
                  <li><strong className="text-ink-900">Some fetchers may skip it.</strong> OpenAI, Perplexity and Meta say their fetchers that act for a person may not follow robots.txt.</li>
                </ul>
                <p className="mt-4 leading-relaxed text-ink-700">
                  To see how AI crawler access fits with the rest of your technical setup, run the{" "}
                  <Link href="/tools/website-audit" className="font-medium text-brand-700 hover:underline">free website audit</Link>, which includes this check alongside more than 70 others.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Frequently Asked Questions About AI Crawlers</h2>
                <div className="space-y-3">
                  {toolFaqs.map((faq) => (
                    <details key={faq.question} className="group rounded-2xl border border-ink-200 bg-white">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-ink-900">
                        {faq.question}
                        <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <div className="border-t border-ink-100 px-5 pb-5 pt-4 text-sm leading-relaxed text-ink-600">{faq.answer}</div>
                    </details>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Related SEO Tools and Guides</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/website-audit", "Website Audit", "Score any site and get a fix list ordered by impact."],
                    ["/tools/ai-content-detector", "AI Content Detector", "See whether text reads as AI or human before you publish."],
                    ["/blog/website-audit-checklist-2026", "Website audit checklist", "47 checks to run on any site, with how to fix each one."],
                    ["/tools", "View all free tools", "Checkers, calculators and planners."],
                  ].map(([href, t, d]) => (
                    <Link key={href} href={href} className="group block rounded-2xl border border-ink-200 bg-white p-5 transition hover:border-brand-300">
                      <h3 className="mb-2 font-semibold text-ink-900 group-hover:text-brand-700">{t}</h3>
                      <p className="text-sm text-ink-600">{d}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="flex-shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <h3 className="mb-4 font-semibold text-ink-900">Official crawler pages</h3>
                  <ul className="space-y-2.5 text-sm">
                    {[...new Map(AI_BOTS.map((b) => [b.docs, b.company])).entries()].map(([href, company]) => (
                      <li key={href}>
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">{company}</a>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">Bot list checked against these pages on {CHECKED}.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
