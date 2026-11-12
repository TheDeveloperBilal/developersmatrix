import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { BreadcrumbSchema, FAQSchema, HowToSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { CPU_RATES, GPU_RATES, RATES_UPDATED } from "@/lib/hardware/frame-rates";
import { allResolutions, cpuByName, gpuByName, shortName } from "@/lib/hardware/bottleneck";
import { GAMES, TEST_CPU, currentCardsByFps, fpsRows, gameById } from "@/lib/hardware/fps";
import { GAME_RATES_SOURCE_DATE } from "@/lib/hardware/game-rates";
import FpsCalculatorClient from "./FpsCalculatorClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata["fps-calculator"]);

const PATH = "/tools/fps-calculator";
const URL = `${siteConfig.url}${PATH}`;
const CPU_COUNT = CPU_RATES.length;
const GPU_COUNT = GPU_RATES.length;
const GPU_MEASURED = GPU_RATES.filter((g) => g.source === "measured").length;
const UPDATED = new Date(`${RATES_UPDATED}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const r = Math.round;
const CORRECTED = GPU_RATES.filter((g) => g.note).map((g) => shortName(g.name));

// Every number quoted in the copy is computed from the same data the tool uses.
const cards = currentCardsByFps();
// Tiers use the rounded figure shown next to each card.
const at1440 = (c: (typeof cards)[number]) => r(c.fps[1]);
const tiers = [
  { title: "144 fps or more", note: "Smooth on a 144 Hz monitor", list: cards.filter((c) => at1440(c) >= 144) },
  { title: "100 to 143 fps", note: "Very smooth, and close to 144 Hz with a few settings lowered", list: cards.filter((c) => at1440(c) >= 100 && at1440(c) < 144) },
  { title: "60 to 99 fps", note: "Smooth at 60 Hz, a good base for 1440p", list: cards.filter((c) => at1440(c) >= 60 && at1440(c) < 100) },
  { title: "Under 60 fps", note: "Lower settings or play at 1080p", list: cards.filter((c) => at1440(c) < 60) },
];
const example = allResolutions(cpuByName("AMD Ryzen 5 5600"), gpuByName("NVIDIA GeForce RTX 3060"));
const exUp = allResolutions(cpuByName("AMD Ryzen 5 5600"), gpuByName("NVIDIA GeForce RTX 5060 Ti"));

// Per game: Tom's Hardware's own results for three common current cards at 1440p.
const REF_CARDS = ["NVIDIA GeForce RTX 5060", "NVIDIA GeForce RTX 5070", "AMD Radeon RX 9070 XT"];
const GAME_DATE = new Date(`${GAME_RATES_SOURCE_DATE}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const errLow = Math.round(Math.min(...GAMES.map((g) => g.fitError[0])) * 100);
const errHigh = Math.round(Math.max(...GAMES.map((g) => g.fitError[0])) * 100);
const fortnite = gameById("fortnite")!;
const fn5060 = fortnite.measured["NVIDIA GeForce RTX 5060"];
const fn5070 = fortnite.measured["NVIDIA GeForce RTX 5070"];
const cpExample = fpsRows(cpuByName("AMD Ryzen 5 5600"), gpuByName("NVIDIA GeForce RTX 3060"), gameById("cyberpunk-2077"));

const toolFaqs = [
  {
    question: "How many FPS will I get?",
    answer: `Enter your processor and graphics card in the calculator above, and pick a game. It shows your average frame rate and 1% low at 1080p, 1440p and 4K, either in one of ${GAMES.length} popular games or across 11 demanding games on Ultra settings. For example, a Ryzen 5 5600 with an RTX 3060 averages about ${r(example[0].expected)} fps at 1080p and ${r(example[1].expected)} fps at 1440p across the 11 games, and about ${r(cpExample[0].expected)} fps at 1080p in Cyberpunk 2077 on Ultra.`,
  },
  {
    question: "What is a good FPS for gaming?",
    answer: "30 fps is playable and is what many console games run at. 60 fps is the standard for smooth PC gaming. 100 to 144 fps suits a high refresh monitor and feels noticeably smoother, and 240 fps or more matters mainly in fast competitive shooters. The best target is your monitor's refresh rate, because frames above it are never shown.",
  },
  {
    question: "Is 60 FPS good?",
    answer: "Yes. 60 fps is smooth for almost every game and matches the refresh rate of most standard monitors and TVs. Fast shooters feel better at higher frame rates, but only if your monitor can show them.",
  },
  {
    question: "How accurate is this FPS calculator?",
    answer: `It uses published review results, not guesses. ${GPU_MEASURED} of the ${GPU_COUNT} graphics cards use Tom's Hardware benchmark results directly, and every result says whether its figures are measured, scaled or estimated. For the ${GAMES.length} games with their own results, the cards Tom's Hardware tested show their measured numbers, and the model behind the other cards lands typically within ${errLow}% to ${errHigh}% of those measured results. A single mid range card can still be off by up to about 20% in one game, and lower settings run faster than the settings tested.`,
  },
  {
    question: "Does the processor affect FPS?",
    answer: "Yes, mostly at 1080p and in fast games. The processor sets a ceiling on how many frames can be prepared, and the graphics card draws them. If the processor is the lower of the two, a faster graphics card adds little. The upgrade comparison in the calculator shows when that happens.",
  },
  {
    question: "Will a new graphics card increase my FPS?",
    answer: `Usually, as long as your processor can keep up. A Ryzen 5 5600 with an RTX 3060 averages about ${r(example[1].expected)} fps at 1440p, and the same PC with an RTX 5060 Ti averages about ${r(exUp[1].expected)}. Put your own parts into the upgrade comparison to see the gain at each resolution before you buy.`,
  },
  {
    question: "Why is my FPS lower than the calculator says?",
    answer: "The most common reasons are a game that is heavier than average, ray tracing switched on, memory running at its slow default speed because XMP or EXPO is off in the BIOS, too little free video memory at high texture settings, or background apps using the processor. Laptops also run slower than desktop parts with the same name.",
  },
  {
    question: "How many FPS will I get in Fortnite?",
    answer: `It depends on your graphics card and settings. In Tom's Hardware's test at High with Lumen and Nanite on, an RTX 5060 averaged ${r(fn5060[0][0])} fps at 1080p and ${r(fn5060[1][0])} fps at 1440p, and an RTX 5070 averaged ${r(fn5070[0][0])} and ${r(fn5070[1][0])}, with a Ryzen 7 9800X3D. Competitive players often turn those features off, which runs far faster. Pick Fortnite in the calculator to see your own PC.`,
  },
  {
    question: "What is a 1% low in FPS?",
    answer: "The 1% low is the frame rate of the slowest 1% of frames. It shows how smooth a game feels: an average of 60 fps with a 1% low of 50 feels steady, while the same average with a 1% low of 30 feels choppy. The calculator takes the 1% low from the lows Tom's Hardware measured in each game.",
  },
  {
    question: "What is frame time?",
    answer: "Frame time is how long each frame takes to arrive, in milliseconds. It is 1000 divided by the frame rate, so 60 fps is about 16.7 ms a frame and 144 fps is about 6.9 ms. Lower and steadier is smoother.",
  },
  {
    question: "Is the FPS calculator free?",
    answer: "Yes. It is free with no signup and no limits, and it runs in your browser.",
  },
];

const steps = [
  { name: "Choose your processor", text: `Type the model, such as 5600 or 12400F, and pick it from the list. ${CPU_COUNT} desktop processors are covered.` },
  { name: "Choose your graphics card", text: `Type the model, such as 3060 or 7800 XT. ${GPU_COUNT} graphics cards are covered.` },
  { name: "Pick a game", text: `Choose one of ${GAMES.length} games with measured results, or keep the average of 11 demanding games.` },
  { name: "Pick your monitor's refresh rate", text: "Choose 60, 144, 165 or 240 Hz to see which resolution keeps up with it." },
  { name: "Compare an upgrade", text: "Pick a new graphics card or processor to see how many fps it would add at each resolution." },
];

export default function FpsCalculatorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "FPS Calculator", url: URL },
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix FPS Calculator"
        applicationCategory="GameApplication"
        operatingSystem="Web"
        description={`Free FPS calculator for PC games. Enter your CPU and GPU to see your average frame rate at 1080p, 1440p and 4K, and how many fps an upgrade would add. Built on review benchmarks.`}
        url={URL}
        offers={{ price: "0", priceCurrency: "USD" }}
        featureList={[
          "Average fps at 1080p, 1440p and 4K",
          `Per game fps and 1% lows for ${GAMES.length} games`,
          "Frame time in milliseconds",
          "Shows which resolution keeps up with your monitor",
          "Upgrade comparison for a new graphics card or processor",
          `${CPU_COUNT} processors and ${GPU_COUNT} graphics cards`,
          "Shows the data source behind every result",
        ]}
      />
      <FAQSchema faqs={toolFaqs} />
      <HowToSchema
        name="How to check how many FPS your PC will get"
        description="Estimate your average frame rate in demanding games and the gain from an upgrade."
        url={URL}
        totalTime="PT1M"
        estimatedCost={{ currency: "USD", value: "0" }}
        tool={["Web browser", "DevelopersMatrix FPS Calculator"]}
        step={steps}
      />

      <main className="pt-16">
        {/* Hero: a dark band like a monitor bezel, with a frame counter in the corner */}
        <section className="relative overflow-hidden border-b border-ink-900 bg-ink-950 text-white">
          <div aria-hidden="true" className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.03)_0_1px,transparent_1px_4px)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-14 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-white/50">
              <Link href="/tools" className="hover:text-white">Tools</Link>
              <span className="mx-2 text-white/25">/</span>
              <span className="text-white/75">FPS Calculator</span>
            </nav>
            <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h1 className="text-balance font-sora text-4xl font-semibold tracking-tight sm:text-5xl">FPS Calculator</h1>
                <p className="mt-4 text-lg leading-relaxed text-white/70">
                  Find out how many FPS your PC will get in games. Enter your processor and graphics card, pick a game, and see your average frame rate and 1% low at 1080p, 1440p and 4K, which resolution keeps up with your monitor, and how many fps an upgrade would add.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 text-sm">
                  {[`${GPU_COUNT} graphics cards`, `${CPU_COUNT} processors`, `${GAMES.length} games with measured results`, "No signup"].map((t) => (
                    <li key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-medium text-white/80">{t}</li>
                  ))}
                </ul>
              </div>
              <div aria-hidden="true" className="hidden shrink-0 rounded-xl border border-emerald-400/30 bg-black/40 px-4 py-3 font-mono lg:block">
                <p className="text-[0.625rem] uppercase tracking-[0.2em] text-emerald-300/70">FPS</p>
                <p className="text-4xl font-semibold tabular-nums text-emerald-300">144</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-2 pt-6 sm:px-6 lg:px-8">
          <div id="calculator" className="scroll-mt-20">
            <FpsCalculatorClient />
          </div>
        </div>

        <InContentAd />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">
              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">How Many FPS Will I Get?</h2>
                <div className="space-y-4 text-ink-700">
                  <p className="text-lg leading-relaxed">
                    Your frame rate depends mostly on your graphics card and your resolution, and partly on your processor. A Ryzen 5 5600 with an RTX 3060 averages about {r(example[0].expected)} fps at 1080p, {r(example[1].expected)} fps at 1440p and {r(example[2].expected)} fps at 4K in demanding games on Ultra settings.
                  </p>
                  <p className="leading-relaxed">
                    Each step up in resolution asks the graphics card to draw more pixels, so the frame rate falls: 1440p has about 1.8 times the pixels of 1080p, and 4K has 4 times. The processor prepares roughly the same number of frames at any resolution, so it matters most at 1080p, where the card is fastest. Lower settings, lighter games and upscaling such as DLSS or FSR all raise the numbers above.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">FPS in Popular Games</h2>
                <p className="mb-6 text-sm leading-relaxed text-ink-500">
                  Average fps and 1% low at 1440p, as Tom&apos;s Hardware measured them with a {shortName(TEST_CPU)}. Settings are the ones Tom&apos;s Hardware tested, which are often higher than players use. Pick a game in the calculator to see your own PC.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-ink-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-ink-50 text-[12px] uppercase tracking-[0.08em] text-ink-500">
                      <tr>
                        <th scope="col" className="px-3 py-3 font-medium sm:px-4">Game</th>
                        {REF_CARDS.map((c) => (
                          <th key={c} scope="col" className="px-3 py-3 text-right font-medium sm:px-4">{shortName(c)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {GAMES.map((g) => (
                        <tr key={g.id} className="align-top hover:bg-ink-50/70">
                          <th scope="row" className="px-3 py-2.5 font-medium text-ink-900 sm:px-4">
                            <Link href={`/tools/can-you-run-it/${g.id}`} className="hover:text-brand-700 hover:underline">{g.name}</Link>
                            <span className="mt-0.5 block text-[12px] font-normal text-ink-500">{g.settings}</span>
                          </th>
                          {REF_CARDS.map((c) => {
                            const m = g.measured[c][1];
                            return (
                              <td key={c} className="px-3 py-2.5 text-right font-mono tabular-nums text-ink-900 sm:px-4">
                                {r(m[0])}
                                {g.lowShare.gpu !== null && <span className="block text-[12px] text-ink-400">1% low {r(m[1])}</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
                  Source: Tom&apos;s Hardware GPU benchmarks hierarchy, per game results, read {GAME_DATE}. GTA 5 Enhanced and Assassin&apos;s Creed Shadows are tested with ray tracing on. GTA 5 1% lows are left out because they swung too much between cards to be useful. Apex Legends stops at 300 fps.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">FPS by Graphics Card at 1080p, 1440p and 4K</h2>
                <p className="mb-6 text-sm text-ink-500">
                  Average fps in 11 demanding games at Ultra settings with a {shortName(TEST_CPU)}, the processor used in the review data. Current cards with measured results, fastest first.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-ink-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-ink-50 text-[12px] uppercase tracking-[0.08em] text-ink-500">
                      <tr>
                        <th scope="col" className="px-3 py-3 font-medium sm:px-4">Graphics card</th>
                        {["1080p", "1440p", "4K"].map((x) => (
                          <th key={x} scope="col" className="px-3 py-3 text-right font-medium sm:px-4">{x}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {cards.map(({ gpu, fps }) => (
                        <tr key={gpu.name} className="hover:bg-ink-50/70">
                          <th scope="row" className="px-3 py-2.5 font-medium text-ink-900 sm:px-4">{shortName(gpu.name)}</th>
                          {fps.map((f, i) => (
                            <td key={i} className="px-3 py-2.5 text-right font-mono tabular-nums text-ink-900 sm:px-4">{r(f)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12.5px] text-ink-500">
                  Source: Tom&apos;s Hardware GPU benchmarks hierarchy, with the test processor&apos;s effect modelled as described below. Cards with 8 GB of video memory fall behind at 4K in this data.{CORRECTED.length ? ` The ${CORRECTED.join(" and ")} 1080p figure is corrected, because the published one does not fit its 1440p result.` : ""} Figures updated {UPDATED}.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Which Graphics Cards Get 144 FPS at 1440p?</h2>
                <p className="mb-6 leading-relaxed text-ink-700">
                  1440p at 144 Hz is a common target for a new gaming PC. On Ultra settings in demanding games, very few cards average 144 fps or more. Most of the rest get there with some settings lowered or upscaling switched on.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {tiers.map((t) => (
                    <div key={t.title} className="rounded-2xl border border-ink-200 bg-white p-5">
                      <h3 className="font-semibold text-ink-900">{t.title} at 1440p</h3>
                      <p className="mt-1 text-sm text-ink-500">{t.note}</p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-700">
                        {t.list.length ? t.list.map((c) => `${shortName(c.gpu.name)} (${r(c.fps[1])})`).join(", ") : "None of the current cards in our data."}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">What Is a Good FPS for Gaming?</h2>
                <div className="overflow-hidden rounded-2xl border border-ink-200">
                  <dl className="divide-y divide-ink-100">
                    {[
                      ["30 fps", "Playable. Many console games run here, but fast movement looks choppy on PC."],
                      ["60 fps", "The standard for smooth PC gaming, and what most monitors and TVs show."],
                      ["100 to 144 fps", "Clearly smoother on a high refresh monitor. A good target for 1440p."],
                      ["240 fps and up", "Matters mainly in competitive shooters on a 240 Hz monitor."],
                    ].map(([k, v]) => (
                      <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
                        <dt className="font-mono font-semibold text-ink-900">{k}</dt>
                        <dd className="text-sm leading-relaxed text-ink-600">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <p className="mt-4 leading-relaxed text-ink-700">
                  Aim for your monitor&apos;s refresh rate. A 60 Hz screen shows at most 60 frames a second, so anything above that is not seen, although it can still make the game feel a little more responsive.
                </p>
              </section>

              <section id="how-it-works" className="mb-12 scroll-mt-24">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">How This FPS Calculator Works</h2>
                <ol className="space-y-6">
                  {[
                    ["Graphics card speed from reviews", `Frame rates for ${GPU_MEASURED} graphics cards come from Tom's Hardware's GPU benchmarks hierarchy: the average of 11 demanding games at Ultra settings at 1080p, 1440p and 4K. Other cards are read off our own hardware scale and marked as estimates.`],
                    ["Processor speed from reviews", "Processor results come from Tom's Hardware's CPU benchmarks hierarchy and are turned into the number of frames each processor can prepare in the same games. Close variants without their own review, such as the Ryzen 5 5600, are scaled from their measured sibling by boost clock."],
                    ["Results for single games", `For ${GAMES.length} popular games, Tom's Hardware also publishes each game's own average and 1% low for 14 current cards. Those cards show their measured numbers. Every other card is scaled by how the game ran compared with the 11 game average, and the processor side uses the frame rate the test processor reached in that game. Checked against the measured results, the model is typically within ${errLow}% to ${errHigh}%.`],
                    ["Putting them together", "Your frame rate sits close to the lower of the two numbers. Because the figures average many games, the calculator blends the two the way the review results do, so your result is a little under the lower number. This is the same model the bottleneck calculator uses, so the two tools always agree."],
                    ["Comparing an upgrade", "The upgrade comparison runs the same sum with the new part in place of the old one, then shows the gain at each resolution. If your processor stops a new card from giving most of its speed, it says so."],
                  ].map(([t, p], i) => (
                    <li key={t} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 font-mono text-sm font-semibold text-white">{i + 1}</span>
                      <div>
                        <h3 className="mb-1 font-semibold text-ink-900">{t}</h3>
                        <p className="text-sm leading-relaxed text-ink-600">{p}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 leading-relaxed text-ink-700">
                  <strong className="text-ink-900">What it does not cover:</strong> ray tracing (apart from GTA 5 and Assassin&apos;s Creed Shadows, which are tested with it on), upscaling and frame generation, Low and Medium settings, stutter beyond the 1% low, and laptop parts. To check a game&apos;s published requirements, use the{" "}
                  <Link href="/tools/can-you-run-it" className="font-medium text-brand-700 hover:underline">Can You Run It checker</Link>. To see which part limits your frame rate, use the{" "}
                  <Link href="/tools/bottleneck-calculator" className="font-medium text-brand-700 hover:underline">bottleneck calculator</Link>.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Frequently Asked Questions About FPS</h2>
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
                <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Related PC Gaming Tools</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    ["/tools/bottleneck-calculator", "Bottleneck Calculator", "See whether your processor or graphics card limits your frame rate."],
                    ["/tools/can-you-run-it", "Can You Run It?", "Check your PC against the specs publishers released for popular games."],
                    ["/tools/can-you-run-it/gta-5", "GTA 5 Enhanced PC requirements", "Minimum and recommended specs with a check for your PC."],
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

            <div className="flex-shrink-0 lg:w-80">
              <div className="sticky top-24 space-y-6">
                <SidebarAd />
                <div className="rounded-2xl border border-ink-200 bg-white p-5">
                  <h3 className="mb-4 font-semibold text-ink-900">About the data</h3>
                  <dl className="space-y-2.5 text-sm">
                    {[
                      ["Card figures", "Tom's Hardware GPU hierarchy"],
                      ["Processor figures", "Tom's Hardware CPU hierarchy"],
                      ["Games averaged", "11, Ultra settings"],
                      ["Games with own results", String(GAMES.length)],
                      ["Game results read", GAME_DATE],
                      ["Graphics cards", `${GPU_COUNT} (${GPU_MEASURED} measured)`],
                      ["Processors", String(CPU_COUNT)],
                      ["Last updated", UPDATED],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="text-ink-500">{k}</dt>
                        <dd className="text-right font-medium text-ink-900">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-4 space-y-1.5 text-sm">
                    <a href="https://www.tomshardware.com/reviews/gpu-hierarchy,4388.html" target="_blank" rel="noopener noreferrer" className="block font-medium text-brand-700 hover:underline">GPU benchmarks hierarchy</a>
                    <a href="https://www.tomshardware.com/reviews/cpu-hierarchy,4312.html" target="_blank" rel="noopener noreferrer" className="block font-medium text-brand-700 hover:underline">CPU benchmarks hierarchy</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
