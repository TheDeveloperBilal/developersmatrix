import { Metadata } from "next";
import { generatePageMetadata, toolMetadata } from '@/lib/seo/metadata';
import { SidebarAd, InContentAd } from "@/components/ads/AdBanner";
import { FAQSchema, BreadcrumbSchema, SoftwareApplicationSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";
import CanYouRunItClient from "./CanYouRunItClient";
import { gamesDatabase } from "@/data/games-database";

export const metadata: Metadata = generatePageMetadata(toolMetadata['can-you-run-it']);

const toolFaqs = [
  {
    question: "Can my PC run it?",
    answer: "Pick the game in the checker above, choose your processor and graphics card from the list, and add your memory and storage. The tool compares each part with the minimum and recommended specs the publisher released and tells you whether your PC passes, partly passes or falls short, with an estimated frame rate. It is free and needs no signup. For games whose publisher has not released PC specs, such as GTA 6, it says so instead of guessing."
  },
  {
    question: "Will my PC run GTA 6?",
    answer: "Nobody can answer that yet. Rockstar has published no PC system requirements for GTA 6, and no PC version has been announced. Grand Theft Auto VI is listed for PlayStation 5 and Xbox Series X|S on 19 November 2026. Every GTA 6 PC spec chart online is a third party estimate. What you can do is measure your machine against what Rockstar asks for today: Grand Theft Auto V Enhanced recommends a Core i5-9600K or Ryzen 5 3600, 16GB of memory and an RTX 3060 or RX 6600 XT, and it requires an SSD even at minimum. Both that game and Red Dead Redemption 2 are in the checker above."
  },
  {
    question: "Will my PC run Cyberpunk 2077?",
    answer: "These are the current PC requirements from the Cyberpunk 2077 Steam listing. Minimum: an Intel Core i7-6700 or AMD Ryzen 5 1600, 12GB of memory, and a GeForce GTX 1060 6GB, Radeon RX 580 8GB or Arc A380. Recommended: an Intel Core i7-12700 or AMD Ryzen 7 7800X3D, 16GB of memory, and a GeForce RTX 2060 Super, Radeon RX 5700 XT or Arc A770. An SSD with 70GB free is required at both tiers."
  },
  {
    question: "How do I check if my PC will run a game before buying?",
    answer: "Use our free Can You Run It tool above. Enter your CPU, GPU, and RAM, select the game, and get an instant verdict. The tool compares your hardware against official minimum and recommended requirements, shows estimated FPS at different settings, and names the part to upgrade first if you fall short. This saves you from buying games your PC cannot handle and wasting money on unnecessary upgrades."
  },
  {
    question: "Is the PC Requirements Checker completely free?",
    answer: "Yes, 100 percent free with no signup required. Check unlimited games against your hardware specs. Unlike premium system requirement tools that charge for detailed analysis, we believe gamers should have access to clear, actionable hardware compatibility information without cost barriers."
  },
  {
    question: "How accurate are the hardware requirements?",
    answer: "Requirements come from the specs the publisher published for each game. For every title you see the minimum requirements, meaning what you need to launch the game at all, and the recommended requirements, meaning what you need for a smooth session at higher settings. The checker then estimates frame rates from your hardware, which tells you more than a plain yes or no."
  },
  {
    question: "Can I check if my laptop can run a specific game?",
    answer: "Absolutely. The checker works for both desktop and laptop hardware. Simply enter your CPU, GPU, and RAM specifications. The tool compares them against the game's requirements and gives a clear verdict. The checker rates the desktop version of each graphics card, so on a laptop treat the result as a best case: laptop chips usually run noticeably slower than the desktop cards they share a name with."
  },
  {
    question: "What if my PC does not meet the minimum requirements?",
    answer: "The checker tells you which part falls short and names the part the publisher lists as the minimum, or the recommendation when you only just scrape through. That tells you exactly what to aim for, so you do not replace parts that were never the problem."
  },
  {
    question: "Does this work for console games too?",
    answer: "The checker is designed for PC hardware. Console games have fixed hardware, so checking requirements is not applicable. Many of the listed games are also on consoles, but the requirements shown are the PC ones. GTA 6 is listed too, and because Rockstar has published no PC specs, the checker points you to GTA V Enhanced as the closest real target instead of inventing a score."
  },
  {
    question: "How often is the game database updated?",
    answer: "The database is refreshed when publishers release new titles or revise the specs on existing ones. Every game page links to the publisher listing its figures came from and shows the date they were last checked."
  },
  {
    question: "Do I need to know my exact hardware model?",
    answer: "The more precise your input, the more accurate the check. Entering 'NVIDIA GeForce RTX 3060' gives better results than 'some NVIDIA card.' If you are unsure of your exact specs, press Windows + R, type dxdiag and press Enter: the processor and memory are on the first tab and the graphics card is on the Display tab. Start typing in the checker and pick your model from the list. Only real models are accepted, so a typo cannot produce a fake result."
  },
  {
    question: "What is the difference between minimum and recommended requirements?",
    answer: "Minimum requirements mean the game will run, but often at low settings with reduced resolution and inconsistent frame rates. This is for players who just want to experience the game regardless of visual quality. Recommended requirements mean you can play at medium to high settings with stable 60 FPS at 1080p. This is the target for most players who want a good experience without needing top tier hardware. The checker explains which category your hardware falls into for each game."
  }
];

// Most searched first: GTA 6 and the games whose pages already earn impressions.
const POPULAR_IDS = ['gta-6', 'counter-strike-2', 'battlefield-6', 'starfield', 'cyberpunk-2077', 'arc-raiders'];
const popularGames = POPULAR_IDS
  .map((id) => gamesDatabase.find((g) => g.id === id))
  .filter((g): g is (typeof gamesDatabase)[number] => Boolean(g));
const otherGames = gamesDatabase
  .filter((g) => !POPULAR_IDS.includes(g.id))
  .sort((a, b) => a.name.localeCompare(b.name));

/** "12 GB RAM" and "70 GB storage", skipping anything the publisher did not list. */
function cardSpec(game: (typeof gamesDatabase)[number]) {
  const parts = [game.minimumRequirements.memory.replace(/\s*\(.*?\)/g, '').trim()];
  const storage = game.minimumRequirements.storage;
  if (/available space/i.test(storage)) parts.push(storage.replace(/\s*available space.*$/i, ' storage'));
  return parts.join(', ');
}

export default function CanYouRunItPage() {
  return (
    <>
      <FAQSchema faqs={toolFaqs.map(faq => ({ question: faq.question, answer: faq.answer }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Can You Run It", url: `${siteConfig.url}/tools/can-you-run-it` }
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Can You Run It"
        applicationCategory="GameApplication"
        operatingSystem="Web"
        description="Free PC game requirements checker. Compare your hardware specs against game requirements and get upgrade recommendations."
        url={`${siteConfig.url}/tools/can-you-run-it`}
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
      />
      <HowToSchema
        name="How to Check If Your PC Can Run a Game"
        description="Step-by-step guide to checking game compatibility with your PC hardware using the DevelopersMatrix Can You Run It tool."
        url={`${siteConfig.url}/tools/can-you-run-it`}
        totalTime="PT2M"
        estimatedCost={{ currency: 'USD', value: '0' }}
        step={[
          {
            name: "Find your PC hardware specs",
            text: "Identify your CPU model, GPU model, and RAM amount. On Windows, search 'System Information' in the Start menu, or use free tools like CPU-Z and GPU-Z for detailed specs. For laptops, check the manufacturer's website or system settings. Note whether you have a desktop or laptop GPU. Laptop versions are typically 15-30% slower.",
            url: `${siteConfig.url}/tools/can-you-run-it`
          },
          {
            name: "Search for the game",
            text: "Enter the game name in the search box. The tool checks a curated database of major AAA releases and upcoming launches like GTA 6. Select the correct game from the dropdown to view its official minimum and recommended requirements.",
            url: `${siteConfig.url}/tools/can-you-run-it`
          },
          {
            name: "Compare your hardware to requirements",
            text: "Enter your CPU, GPU, and RAM into the comparison fields. The tool automatically evaluates whether each component meets minimum requirements, recommended requirements, or exceeds them. You get a clear verdict with a score out of 100, a likely preset and an estimated frame rate range.",
            url: `${siteConfig.url}/tools/can-you-run-it`
          },
          {
            name: "Review upgrade recommendations",
            text: "If your hardware falls short, the tool provides specific upgrade recommendations. Instead of a generic 'your PC is too weak' message, you get actionable guidance: which component to upgrade first, what specific models to consider, and the expected performance improvement. This helps you avoid buying unnecessary upgrades."
          }
        ]}
      />

      <main className="min-h-screen bg-background">
        {/* Hero + Tool */}
        <section className="relative isolate border-b border-slate-900/[0.06] dark:border-white/[0.06]">
          {/* Background: a quiet grid and two soft light fields for the glass to sit on.
              The clipping lives on this layer only. If the section itself clipped, the
              browser could scroll it sideways when a form field inside takes focus,
              which shows up on phones as the whole tool sliding off screen.
              The light fields are radial gradients rather than blurred circles: the
              same soft glow, without a 150px blur filter for phones to paint. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-clip">
            <div className="absolute inset-0 bg-[#f5f6fa] dark:bg-[#07080c]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
            <div className="absolute -top-[28rem] left-[-6%] h-[64rem] w-[64rem] rounded-full bg-[radial-gradient(closest-side,rgba(165,180,252,0.42),rgba(165,180,252,0.12)_55%,transparent)] dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),rgba(99,102,241,0.05)_55%,transparent)]" />
            <div className="absolute -top-28 right-[-8%] h-[56rem] w-[56rem] rounded-full bg-[radial-gradient(closest-side,rgba(186,230,253,0.5),rgba(186,230,253,0.15)_55%,transparent)] dark:bg-[radial-gradient(closest-side,rgba(14,165,233,0.1),rgba(14,165,233,0.03)_55%,transparent)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              PC requirements checker
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white text-balance">
              Can You Run It? Free PC Game Requirements Checker
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
              Can my PC run it? Pick a game, enter your processor, graphics card and memory, and see how your PC compares with the specs the publisher released, with an estimated frame rate. Each game page also shows the cheapest upgrade if you fall short.
            </p>
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ["Games", `${gamesDatabase.filter((g) => g.requirementsStatus !== "unannounced").length} with published specs`],
                ["Sources", "Linked on every game page"],
                ["Price", "Free, no signup"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-slate-500 dark:text-slate-400">{k}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <div id="can-you-run-it" className="scroll-mt-24">
                <CanYouRunItClient />
              </div>

              {/* Every game page as a real link, most searched first. These pages were
                  orphaned before: in the sitemap with no internal link pointing at them. */}
              <section id="games" aria-labelledby="games-title" className="mt-12 scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Popular game checks</p>
                    <h2 id="games-title" className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">Check a Specific Game</h2>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{gamesDatabase.length} games, each with its own requirements page</p>
                </div>
                <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-300">
                  Every game below has its own page with the publisher stated minimum and recommended specs, what each requirement actually means, and the cheapest upgrade if your machine falls short.
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {popularGames.map((game) => (
                    <li key={game.id}>
                      <a
                        href={`/tools/can-you-run-it/${game.id}`}
                        className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-slate-900/[0.07] bg-white p-5 transition-colors hover:border-slate-900/25 dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-white/30 sm:bg-white/80"
                      >
                        <span>
                          <span className="block text-base font-semibold text-slate-900 dark:text-white">
                            Can you run {game.name}?
                          </span>
                          <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">
                            {game.requirementsStatus === 'unannounced'
                              ? 'No PC specs published yet'
                              : `Minimum: ${cardSpec(game)}`}
                          </span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
                          See the requirements
                          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-4">
                  {otherGames.map((game) => (
                    <li key={game.id}>
                      <a
                        href={`/tools/can-you-run-it/${game.id}`}
                        className="flex items-center justify-between gap-3 border-b border-slate-900/[0.06] py-2.5 text-sm text-slate-700 transition-colors hover:text-slate-900 dark:border-white/[0.06] dark:text-slate-300 dark:hover:text-white"
                      >
                        <span className="truncate">Can you run {game.name}?</span>
                        <span aria-hidden="true" className="shrink-0 text-slate-400">&rarr;</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <aside className="mt-10">
                <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-white/[0.08] dark:bg-slate-900/60 dark:shadow-none sm:bg-white/55 sm:backdrop-blur-xl sm:dark:bg-slate-900/40">
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400 mb-3">Related resources</h3>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {[
                      ["/trends/gta-6-release-everything-we-know", "GTA 6 news"],
                      ["/tools/salary-estimator", "Salary Estimator"],
                      ["/tools/budget-planner", "Budget Planner"],
                      ["/tools/habit-tracker", "Habit Tracker"],
                      ["/tools/website-audit", "Website Audit"],
                    ].map(([href, label]) => (
                      <a
                        key={href}
                        href={href}
                        className="rounded-lg border border-slate-900/[0.07] bg-white/70 px-3 py-1.5 text-slate-700 transition-colors hover:border-slate-900/20 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:text-white"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-16">

              {/* Direct answer */}
              <section>
                <h2 className="text-2xl font-bold mb-4">Can My PC Handle This Game?</h2>
                <div className="rounded-xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/60 dark:bg-purple-500/5 p-6 mb-6">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-purple-300 mb-2">
                    Short answer
                  </p>
                  <p className="text-base leading-relaxed text-gray-800 dark:text-gray-100">
                    Can my PC run it? Four things decide it: your graphics card, your processor, how much memory you have, and whether your storage is solid state. Enter those four above and you get a pass, partial or fail against the specs the publisher actually released, plus an estimated frame rate. Most machines that fail do so on one component, not four, and it is often memory or the drive rather than the graphics card people assume.
                  </p>
                </div>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    A minimum requirement is a floor, not a target. Hitting it means the game starts and stays playable, normally at low settings and somewhere near 30 frames per second. If your hardware only just clears the minimum, drop the resolution before you touch anything else, because resolution costs more performance than almost any other setting you can change.
                  </p>
                  <p>
                    The graphics card carries the most weight in our scoring at 40 percent, the processor 30 percent, and memory and storage speed 15 percent each. A fast processor cannot rescue a card that sits below the minimum. A slow processor can hold back a strong card, but only at lower resolutions where the card is waiting on the rest of the system.
                  </p>
                  <p>
                    Storage is the requirement people skip. Games stream textures and world data off the drive while you play, so a mechanical hard disk produces stuttering and texture pop in even when every other component is comfortably above spec. If you are running a hard drive, that is the cheapest fix on the list and usually the one you feel most.
                  </p>
                  <p>
                    On a laptop, compare the actual mobile chip rather than the desktop card with a similar name. Laptop graphics run roughly 15 to 30 percent slower than their desktop namesakes because of power and heat limits, so a laptop card that matches the recommended spec on paper often behaves closer to the minimum in practice.
                  </p>
                </div>
              </section>

              {/* GTA 6 Section */}
              <section>
                <h2 className="text-2xl font-bold mb-4">GTA 6 System Requirements: What Rockstar Has Actually Published</h2>
                <div className="rounded-2xl p-6 border border-amber-500/20 bg-amber-500/[0.05] mb-6">
                  <div className="flex items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">No PC specs exist yet, and no PC version has been announced</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                        Rockstar lists Grand Theft Auto VI for PlayStation 5 and Xbox Series X|S on 19 November 2026. PC is not on that list, and Rockstar has published no minimum or recommended PC requirements. Every GTA 6 PC spec table circulating online is a third party estimate.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <p className="font-medium text-gray-900 dark:text-white">Confirmed by Rockstar</p>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">Release: 19 November 2026</p>
                          <p className="text-gray-600 dark:text-gray-400">Platforms: PS5, Xbox Series X|S</p>
                          <p className="text-gray-600 dark:text-gray-400">PC version: not announced</p>
                          <p className="text-gray-600 dark:text-gray-400">PC specs: not published</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                          <p className="font-medium text-gray-900 dark:text-white">What Rockstar asks for today</p>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">From GTA V Enhanced, recommended:</p>
                          <p className="text-gray-600 dark:text-gray-400">CPU: Core i5-9600K / Ryzen 5 3600</p>
                          <p className="text-gray-600 dark:text-gray-400">RAM: 16GB</p>
                          <p className="text-gray-600 dark:text-gray-400">GPU: RTX 3060 8GB / RX 6600 XT</p>
                          <p className="text-gray-600 dark:text-gray-400">Storage: 105GB, SSD required</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                  <p>
                    We are not going to invent a spec sheet for you. What we can do is show you the numbers Rockstar has actually published for its current PC titles, and let you measure your machine against those. Grand Theft Auto V Enhanced and Red Dead Redemption 2 both have real requirements on Rockstar&rsquo;s support site, and both are in our checker.
                  </p>
                  <p>
                    Rockstar has brought its last two big titles to PC roughly thirteen months after console launch. Grand Theft Auto V reached consoles in September 2013 and PC in April 2015. Red Dead Redemption 2 reached consoles in October 2018 and PC in November 2019. That is a pattern worth knowing, not a promise, and Rockstar has committed to nothing.
                  </p>
                  <p>
                    If you want to prepare anyway, put the money where Rockstar has already moved the floor: 16GB of memory, an SSD with at least 150GB free, and a graphics card at or above the RTX 3060 class. Those three cover the gap on almost every older build.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="/tools/can-you-run-it/gta-6" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                    Full GTA 6 PC requirements breakdown
                  </a>
                  <a href="/gta-6" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Latest GTA 6 news
                  </a>
                </div>
              </section>

              {/* Workflow */}
              <section>
                <h2 className="text-2xl font-bold mb-6">How to Check Your PC in 60 Seconds</h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    { num: "1", title: "Choose Your Game (10 seconds)", text: "Pick the game from the list or search for it by name. Every game uses the minimum and recommended specs its publisher released, and the source is linked on that game's own page." },
                    { num: "2", title: "Add Your Parts (30 seconds)", text: "Start typing your processor and graphics card and pick the match from the list, so 'i5 12400F' or 'RTX 3060' is enough. Then choose your memory and enter the free space on your drive. Not sure what you have? Press Win + R, type dxdiag and press Enter." },
                    { num: "3", title: "Read the Verdict (20 seconds)", text: "You get a score out of 100, a plain answer such as Yes, comfortably or Not at minimum spec, a rough frame rate range and a settings preset to start with. Each part is compared with the requirement, and if one of them holds you back, the tool names it so you know what to upgrade first." },
                  ].map((w) => (
                    <div key={w.num} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{w.num}</div>
                      <h3 className="font-semibold mb-3 pt-2">{w.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{w.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Score: merged from the old features list and the compatibility score section */}
              <section>
                <h2 className="text-2xl font-bold mb-4">How the Can You Run It Score Works</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Most requirement checkers stop at a yes or no. Ours scores each part of your PC against the specs the publisher released, weights each part by how much it affects frame rate and playability, and turns that into one number with the reasoning behind it. Nothing is more frustrating than downloading 80GB and finding out your PC cannot run the game, so the score is built to tell you before you buy.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">0 to 100</div>
                    <h3 className="font-semibold mb-2">Compatibility Score Range</h3>
                    <p className="text-sm text-muted-foreground">80 and above means comfortable headroom. 60 to 79 is playable with settings adjustments. Below 60 means you will struggle.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">40%</div>
                    <h3 className="font-semibold mb-2">GPU Weight</h3>
                    <p className="text-sm text-muted-foreground">The graphics card is the single most important component for gaming performance. It carries the highest weight in our scoring.</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">4</div>
                    <h3 className="font-semibold mb-2">Components Scored</h3>
                    <p className="text-sm text-muted-foreground">Your GPU, CPU, RAM and storage speed are each scored against the game requirements, then weighted into one number.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-4">How the Score Is Calculated</h3>
                <ol className="space-y-3 text-muted-foreground mb-8">
                  {[
                    ["Component comparison", "Your CPU, GPU and RAM are compared against the game's minimum and recommended requirements using our relative performance rating for each model. Only real models are accepted, so a typo cannot produce a fake result."],
                    ["Weighted scoring", "The GPU contributes 40% of the score, the CPU 30%, RAM 15% and storage speed 15%."],
                    ["Frame rate estimate", "You get a likely preset and a frame rate range based on how far your graphics card sits above the game's minimum. It is an estimate, not a benchmark."],
                    ["Bottleneck and upgrade", "The tool shows which component falls short and names the part the publisher lists as the minimum, so you know exactly what to aim for. Often it is one part, such as going from 8GB to 16GB of memory."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">{i + 1}</span>
                      <span><strong className="text-foreground">{t}:</strong> {d}</span>
                    </li>
                  ))}
                </ol>

                <h3 className="text-xl font-semibold mb-3">Where the Requirements Come From</h3>
                <p className="text-muted-foreground leading-relaxed">
                  The database covers major PC releases across genres, from long running classics to titles that have not shipped yet. Each entry lists the minimum and recommended specs the publisher released, links to that source on the game&rsquo;s own page, and shows the date the figures were last checked. When a publisher has not released PC specs, the page says so instead of guessing.
                </p>
              </section>

              <InContentAd />

              {/* Hardware: merged from the mistakes, use cases and 2026 hardware sections */}
              <section>
                <h2 className="text-2xl font-bold mb-4">What Hardware Matters for PC Games in 2026</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  New releases keep asking for more, but they rarely ask for everything at once. Fix the part that holds you back, in this order, and you avoid paying for upgrades you do not need.
                </p>

                <h3 className="text-xl font-semibold mb-4">Upgrade Priority for New Releases</h3>
                <ol className="space-y-3 mb-10">
                  {[
                    ["Memory: 16GB", "Many big releases now list 16GB as the recommended amount, and several ask for it even at minimum. Too little memory causes constant swapping to disk and stuttering far worse than a low frame rate. 16GB of DDR4 usually costs 30 to 50 dollars."],
                    ["Storage: an SSD with room to spare", "Open world games stream data while you play. A hard drive causes stuttering and texture pop in that no graphics card can fix, and many publishers now require an SSD."],
                    ["Graphics memory: check the recommended spec", "Cards with 8GB of video memory can run short at high texture settings in recent releases. Before buying a card, compare its memory with the recommended spec of the games you play most."],
                    ["Graphics card: aim for the recommended tier", "Upgrade the card after memory and storage are covered, and aim for the recommended spec rather than the minimum so the next few releases still run well."],
                  ].map(([t, d], i) => (
                    <li key={t} className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                      <span className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-lg px-2 py-1 text-xs flex-shrink-0">{i + 1}</span>
                      <span>
                        <span className="block font-medium text-sm">{t}</span>
                        <span className="block text-sm text-muted-foreground mt-0.5">{d}</span>
                      </span>
                    </li>
                  ))}
                </ol>

                <h3 className="text-xl font-semibold mb-4">Five Hardware Mistakes That Waste Your Money</h3>
                <div className="space-y-4 mb-10">
                  {[
                    { num: "1", title: "Ignoring Storage Speed", text: "Modern games stream assets in real time. A hard disk drive creates stuttering, texture pop in, and long load times. Many players blame their GPU when the real bottleneck is a slow HDD.", fix: "Each game page says when the publisher requires an SSD. If your storage is a hard drive, upgrade to an SSD first. It is usually the cheapest change on the list and the one you notice most." },
                    { num: "2", title: "Trusting Minimum Requirements", text: "Minimum specs mean the game will launch, not that it will be enjoyable. At minimum settings you often get below 30 FPS, blurry textures and input lag.", fix: "The checker scores you against the published minimum and gives a likely preset and frame rate range. Each game page shows the recommended spec beside it, so you can see how much headroom you really have." },
                    { num: "3", title: "Buying Before Checking", text: "Buying a game in a sale and then finding out your PC cannot handle it is a common and expensive mistake. Steam refunds help, but only if you have played less than 2 hours, which is not always enough to find performance problems.", fix: "Check requirements before every purchase, especially for big releases. Thirty seconds in the checker saves hours of downloading and the disappointment of an unplayable game." },
                    { num: "4", title: "Neglecting Driver Updates", text: "Outdated graphics drivers can cost new releases a noticeable amount of performance. NVIDIA, AMD and Intel often ship game specific driver updates for major titles on launch day.", fix: "Update your graphics driver before judging your hardware. Sometimes a driver update is the difference between unplayable and smooth." },
                    { num: "5", title: "Underestimating RAM", text: "8GB of RAM was enough for most games a few years ago. Many big releases now list 16GB as the recommended amount, and several ask for it even at minimum.", fix: "If you have 8GB and the game recommends 16GB, the memory upgrade is almost always the priority over a new graphics card." },
                  ].map((m) => (
                    <div key={m.num} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm font-bold">{m.num}</div>
                        <h4 className="font-semibold">{m.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-2">{m.text}</p>
                      <p className="text-sm leading-relaxed"><strong className="text-foreground">Fix:</strong> {m.fix}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold mb-4">When to Run a Check</h3>
                <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                  {[
                    { title: "Before every purchase", text: "Especially for pre orders and anything over 30 dollars. The check takes less time than reading the store page." },
                    { title: "Planning an upgrade", text: "Check your target games first. The result shows which component is the bottleneck, so you spend on the part that matters." },
                    { title: "Building a new PC", text: "Test your parts list against the games you want to play before you buy any components." },
                    { title: "Free weekends and trials", text: "Make sure the game runs before you spend a limited free period downloading it." },
                    { title: "Gaming on a budget", text: "Find the games that already run well on your current machine instead of upgrading for every release." },
                    { title: "Gaming on a laptop", text: "Laptop graphics chips usually run slower than the desktop cards they share a name with. Treat a pass as a best case and a borderline result as a likely fail." },
                  ].map((u) => (
                    <div key={u.title}>
                      <dt className="font-semibold">{u.title}</dt>
                      <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{u.text}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <InContentAd />

              {/* FAQ */}
              <section>
                <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {toolFaqs.map((faq, index) => (
                    <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer text-sm sm:text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors list-none">
                        {faq.question}
                        <svg className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
                <p className="text-2xl font-bold mb-3">Know Before You Buy</p>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Check your specs first. Free, instant, and saves you from unplayable games.
                </p>
                <a href="#can-you-run-it" className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">
                  Check Your PC Now <span aria-hidden="true" className="ml-1">&rarr;</span>
                </a>
              </div>

              {/* Related: merged from the two old link grids */}
              <nav aria-label="More from DevelopersMatrix">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">More from DevelopersMatrix</p>
                <ul className="flex flex-wrap gap-2 text-sm">
                  {[
                    ["/gta-6", "GTA 6 hub"],
                    ["/trends/gta-6-release-everything-we-know", "GTA 6 news"],
                    ["/trends", "Tech trends 2026"],
                    ["/tools/budget-planner", "Budget Planner"],
                    ["/tools/salary-estimator", "Salary Estimator"],
                    ["/tools/habit-tracker", "Habit Tracker"],
                    ["/tools/productivity-planner", "Productivity Planner"],
                    ["/tools/website-audit", "Website Audit"],
                    ["/blog", "Guides"],
                    ["/tools", "All tools"],
                  ].map(([href, label]) => (
                    <li key={href}>
                      <a href={href} className="inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-gray-700 transition-colors hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-white">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:w-80 flex-shrink-0 space-y-6">
              <div className="sticky top-24 space-y-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border border-purple-100 dark:border-purple-800">
                  <h3 className="font-semibold text-sm mb-2 text-purple-900 dark:text-purple-100">Pro tip</h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                    A 500GB SSD costs roughly 40 to 60 dollars and removes the stuttering caused by slow hard drives. Before upgrading your GPU, check if your storage is the real bottleneck. Storage is usually the best improvement per dollar you can make.
                  </p>
                </div>
                <SidebarAd />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
