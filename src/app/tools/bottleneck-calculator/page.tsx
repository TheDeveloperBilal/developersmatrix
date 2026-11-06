import { Metadata } from "next";
import Link from "next/link";
import { generatePageMetadata, toolMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/data/config";
import { InContentAd, SidebarAd } from "@/components/ads/AdBanner";
import { BreadcrumbSchema, FAQSchema, HowToSchema, SoftwareApplicationSchema } from "@/components/seo/SchemaMarkup";
import { CPU_RATES, GPU_RATES, RATES_UPDATED, REFERENCE_CPU_FPS } from "@/lib/hardware/frame-rates";
import { DEFAULT_CPU, DEFAULT_GPU, POPULAR_PAIRS, allResolutions, cpuByName, gpuByName, resolutionLabel, shortName, slugify } from "@/lib/hardware/bottleneck";
import BottleneckCalculatorClient from "./BottleneckCalculatorClient";

export const metadata: Metadata = generatePageMetadata(toolMetadata["bottleneck-calculator"]);

const PATH = "/tools/bottleneck-calculator";
const URL = `${siteConfig.url}${PATH}`;

const count = <T extends { source: string }>(list: T[], source: string) => list.filter((x) => x.source === source).length;
const CPU_COUNT = CPU_RATES.length;
const GPU_COUNT = GPU_RATES.length;
const GPU_MEASURED = count(GPU_RATES, "measured");
const CPU_MEASURED = count(CPU_RATES, "measured");
const CPU_SIBLING = count(CPU_RATES, "sibling");
const UPDATED = new Date(`${RATES_UPDATED}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const pairs = POPULAR_PAIRS.map(([c, g]) => {
  const cpu = cpuByName(c);
  const gpu = gpuByName(g);
  return { cpu, gpu, all: allResolutions(cpu, gpu) };
});

// The worked example in the copy uses the calculator's default pair, so the
// numbers on the page and in the tool always agree.
const example = allResolutions(cpuByName(DEFAULT_CPU), gpuByName(DEFAULT_GPU));
const ex1080 = example[0];
const ex1440 = example[1];
// The "What is a CPU bottleneck?" copy says the default pair is CPU limited at
// 1080p and GPU bound at 1440p. Fail the build if new data ever makes that untrue.
if (ex1080.limit !== "cpu" || ex1440.limit !== "gpu") {
  throw new Error("Bottleneck page example no longer matches the data: update the copy or DEFAULT_CPU / DEFAULT_GPU.");
}
const describe = (b: (typeof example)[number]) =>
  b.band === "matched" ? "well matched" : b.limit === "cpu" ? `about a ${Math.round(b.gap * 100)}% processor bottleneck` : "GPU bound";

const toolFaqs = [
  {
    question: "What is a good bottleneck percentage?",
    answer:
      "Under 10% means the processor and graphics card are well matched. A processor bottleneck of 10% to 20% is mild and most people never notice it. Above 20% the processor is leaving real performance on the table at that resolution. A graphics card bottleneck of any size is normal: it means the card is working at full speed, which is what you want in a gaming PC.",
  },
  {
    question: "Is it bad if my GPU is the bottleneck?",
    answer:
      "No. In most games one part always limits the frame rate, and it should be the graphics card, because it is the part you can scale with settings and resolution. Being GPU bound only matters if the frame rate is lower than you want, and then the fix is lower settings or a faster card.",
  },
  {
    question: "Does resolution change the bottleneck?",
    answer: `Yes, a lot. The processor prepares roughly the same number of frames at any resolution, while the graphics card draws fewer frames as the resolution rises. That is why a pair can be CPU limited at 1080p and GPU bound at 1440p. The ${shortName(DEFAULT_CPU)} with an ${shortName(DEFAULT_GPU)} is a good example: ${describe(ex1080)} at 1080p, and ${describe(ex1440)} at 1440p.`,
  },
  {
    question: "How accurate is this bottleneck calculator?",
    answer: `It is built on published review averages, not on guesses, and every result shows where its figures come from. ${GPU_MEASURED} of the ${GPU_COUNT} graphics cards and ${CPU_MEASURED + CPU_SIBLING} of the ${CPU_COUNT} processors use review data directly or through a close sibling chip. The results are averages for demanding games at Ultra settings, so a single game can differ, especially esports games, which lean much harder on the processor.`,
  },
  {
    question: "How do I check for a bottleneck in a game?",
    answer:
      "Turn on a performance overlay, such as the one in the NVIDIA or AMD driver app, and watch graphics card usage while you play. If usage stays near 95% to 100%, the card is the limit. If it sits well below that while the frame rate is lower than you want, the processor is holding it back.",
  },
  {
    question: "Does RAM cause a bottleneck?",
    answer:
      "It can, but less often than people think. 16 GB is enough for most games today and 32 GB gives headroom for newer ones. Speed matters more than many expect: make sure the memory profile (XMP on Intel, EXPO on AMD) is switched on in the BIOS, because without it memory runs at a slow default speed and processor bound games lose frames.",
  },
  {
    question: "Does this work for laptops?",
    answer:
      "Not well. Laptop chips share names with desktop parts but run at lower power, so they are slower. The figures here are for desktop processors and graphics cards.",
  },
  {
    question: "Is the bottleneck calculator free?",
    answer: "Yes. It is free with no signup and no limits, and it runs in your browser.",
  },
];

const steps = [
  {
    name: "Choose your processor",
    text: `Type the model, such as 5600 or 12400F, and pick it from the list. ${CPU_COUNT} desktop processors are covered.`,
  },
  {
    name: "Choose your graphics card",
    text: `Type the model, such as 4060 or 7800 XT, and pick it. ${GPU_COUNT} graphics cards are covered, including integrated graphics.`,
  },
  {
    name: "Pick your resolution and monitor",
    text: "Choose 1080p, 1440p or 4K and your monitor's refresh rate.",
  },
  {
    name: "Read the result",
    text: "See which part limits the frame rate, how big the gap is, the frame rate to expect, and which upgrade would help.",
  },
];

export default function BottleneckCalculatorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Bottleneck Calculator", url: URL },
        ]}
      />
      <SoftwareApplicationSchema
        name="DevelopersMatrix Bottleneck Calculator"
        applicationCategory="GameApplication"
        operatingSystem="Web"
        description={`Free CPU and GPU bottleneck calculator built on review benchmarks. Covers ${CPU_COUNT} processors and ${GPU_COUNT} graphics cards at 1080p, 1440p and 4K.`}
        url={URL}
        offers={{ price: "0", priceCurrency: "USD" }}
        featureList={[
          "Shows whether the processor or the graphics card limits the frame rate",
          "Bottleneck percentage at 1080p, 1440p and 4K",
          "Expected frame rate in demanding games at Ultra settings",
          "Upgrade suggestions matched to the limiting part",
          "Shows the data source behind every result",
        ]}
      />
      <FAQSchema faqs={toolFaqs} />
      <HowToSchema
        name="How to check a CPU and GPU bottleneck"
        description="Find out whether your processor or your graphics card limits your frame rate."
        url={URL}
        totalTime="PT1M"
        estimatedCost={{ currency: "USD", value: "0" }}
        tool={["Web browser", "DevelopersMatrix Bottleneck Calculator"]}
        step={steps}
      />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-ink-200 bg-[#fbfaf7]">
          <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
            <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
              <Link href="/tools" className="hover:text-ink-900">Tools</Link>
              <span className="mx-2 text-ink-300">/</span>
              <span className="text-ink-700">Bottleneck Calculator</span>
            </nav>
            <h1 className="mt-4 max-w-3xl text-balance font-sora text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
              Bottleneck Calculator
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
              Find out whether your processor or your graphics card limits your frame rate. Pick your CPU and GPU to see which part sets the pace at 1080p, 1440p and 4K, the frame rate to expect in demanding games, and which upgrade would actually help.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm">
              {[`${CPU_COUNT} processors`, `${GPU_COUNT} graphics cards`, "Built on review benchmarks", "No signup"].map((t) => (
                <li key={t} className="rounded-full border border-ink-200 bg-white px-3 py-1 font-medium text-ink-700">{t}</li>
              ))}
            </ul>
          </div>
          {/* A frame time trace along the bottom edge: amber for the processor, violet for the card */}
          <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 h-8 w-full" preserveAspectRatio="none" viewBox="0 0 400 32">
            {Array.from({ length: 100 }, (_, i) => {
              const h = 6 + ((i * 37) % 17) + (i % 9 === 0 ? 8 : 0);
              return <rect key={i} x={i * 4} y={32 - h} width="2" height={h} className={i % 7 === 3 ? "fill-amber-400/70" : "fill-brand-300/60"} />;
            })}
          </svg>
        </section>

        {/* Tool */}
        <div className="mx-auto max-w-6xl px-2 pt-6 sm:px-6 lg:px-8">
          <div id="calculator" className="scroll-mt-20">
            <BottleneckCalculatorClient />
          </div>
        </div>

        <InContentAd />

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="min-w-0 flex-1">
              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">What is a CPU bottleneck?</h2>
                <div className="space-y-4 text-ink-700">
                  <p className="text-lg leading-relaxed">
                    A CPU bottleneck happens when your processor cannot prepare frames as fast as your graphics card can draw them, so the card sits waiting and you get fewer frames than it could deliver. A GPU bottleneck is the opposite: the card is the slower part, which is normal and usually what you want.
                  </p>
                  <p className="leading-relaxed">
                    Every frame needs both parts. The processor runs the game logic, physics and draw calls, and the graphics card turns that into pixels. Whichever part takes longer sets your frame rate. For example, a {shortName(DEFAULT_CPU)} can prepare about {Math.round(ex1080.cpuFps)} frames a second in demanding games, while an {shortName(DEFAULT_GPU)} can draw about {Math.round(ex1080.gpuFps)} at 1080p. At 1080p the processor is the limit. At 1440p the card can only draw about {Math.round(ex1440.gpuFps)}, so the card becomes the limit and the processor has room to spare.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Bottleneck Results for Popular CPU and GPU Pairs</h2>
                <p className="mb-6 text-sm text-ink-500">
                  Expected average frame rate in demanding games at Ultra settings. Select a pair to open it in the calculator.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-ink-200">
                  <table className="table-stack table-stack--grid w-full text-left text-sm sm:min-w-[40rem]">
                    <thead className="bg-ink-50 text-[12px] uppercase tracking-[0.08em] text-ink-500">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-medium">Processor and graphics card</th>
                        {["1080p", "1440p", "4K"].map((r) => (
                          <th key={r} scope="col" className="px-4 py-3 text-right font-medium">{r}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {pairs.map(({ cpu, gpu, all }) => (
                        <tr key={cpu.name + gpu.name} className="hover:bg-ink-50/70">
                          <th scope="row" className="px-4 py-2.5 font-medium text-ink-900">
                            <a href={`?cpu=${slugify(cpu.name)}&gpu=${slugify(gpu.name)}#calculator`} className="hover:text-brand-700 hover:underline">
                              {shortName(cpu.name)} with {shortName(gpu.name)}
                            </a>
                          </th>
                          {all.map((b) => (
                            <td key={b.res} data-label={resolutionLabel(b.res)} className="whitespace-nowrap px-4 py-2.5 text-right">
                              <span className="font-mono tabular-nums text-ink-900">{Math.round(b.expected)} fps</span>
                              <span className={`ml-2 text-[12px] ${b.band !== "matched" && b.limit === "cpu" ? "text-amber-700" : "text-ink-400"}`}>
                                {b.band === "matched" ? "balanced" : b.limit === "cpu" ? `CPU ${Math.round(b.gap * 100)}%` : "GPU bound"}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-[12.5px] text-ink-500">
                  &quot;CPU 14%&quot; means the processor leaves about 14% of the card&apos;s speed unused at that resolution. Figures updated {UPDATED}.
                </p>
              </section>

              <section id="how-it-works" className="mb-12 scroll-mt-24">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">How This Bottleneck Calculator Works</h2>
                <p className="mb-6 leading-relaxed text-ink-700">
                  Most bottleneck calculators give one percentage and never say where it comes from. This one is built from published benchmark averages, and every result tells you whether its figures were measured or estimated.
                </p>
                <ol className="space-y-6">
                  {[
                    [
                      "Graphics card speed from review benchmarks",
                      `Frame rates for ${GPU_MEASURED} graphics cards come from Tom's Hardware's GPU benchmarks hierarchy: the average of 11 demanding games at Ultra settings, tested at 1080p, 1440p and 4K. The fastest cards are partly held back by the test processor at 1080p, so that effect is taken out to get each card's own speed.`,
                    ],
                    [
                      "Processor speed from the same kind of data",
                      `Processor results come from Tom's Hardware's CPU benchmarks hierarchy, tested at 1080p with an RTX 5090 so the card rarely holds them back. Older chips come from earlier tables in the same hierarchy, linked through the chips the tables share. They are turned into frames a second on the same scale as the cards, with a Ryzen 7 9800X3D preparing about ${REFERENCE_CPU_FPS} frames a second.`,
                    ],
                    [
                      "Close variants and missing parts",
                      `${CPU_SIBLING} processors with no review figure of their own, such as the Ryzen 5 5600, use their closest measured sibling scaled by boost clock. Parts with neither are estimated from our own hardware scale and marked as estimates in the list and in the result.`,
                    ],
                    [
                      "Putting the two together",
                      "Your frame rate is close to the slower of the two numbers. Because the figures average many games, and some games lean on the processor while others lean on the card, the slower part does not cut in like a wall. The calculator blends the two the way the review results do, which is why the expected frame rate sits a little under the lower number.",
                    ],
                    [
                      "The bottleneck percentage",
                      "The percentage is how much of the faster part goes unused: 1 minus the slower number divided by the faster one. A processor that prepares 100 frames for a card that could draw 125 leaves 20% of the card's speed unused.",
                    ],
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
              </section>

              <InContentAd />

              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">How to Fix a CPU Bottleneck</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Raise the resolution or settings", "Higher resolution and heavier graphics settings move work onto the card. If the processor is the limit, you can often turn quality up for free."],
                    ["Switch on your memory profile", "Enable XMP (Intel) or EXPO (AMD) in the BIOS. Without it, memory runs at a slow default speed, and processor bound games lose frames."],
                    ["Close background apps", "Browsers, launchers and recording software all take processor time. Closing them helps most on processors with four or six cores."],
                    ["Upgrade on the same socket", "Many boards take a faster chip from the same family. On AM4, a Ryzen 7 5700X3D is a common drop in upgrade for older Ryzen systems. Check your board's support list first."],
                  ].map(([t, p]) => (
                    <div key={t} className="rounded-2xl border border-ink-200 bg-white p-5">
                      <h3 className="mb-2 font-semibold text-ink-900">{t}</h3>
                      <p className="text-sm leading-relaxed text-ink-600">{p}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-12">
                <h2 className="mb-5 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">What the Numbers Do Not Tell You</h2>
                <ul className="space-y-3 leading-relaxed text-ink-700">
                  <li><strong className="text-ink-900">They are averages for demanding games.</strong> Esports games such as Counter-Strike 2 or Valorant run at far higher frame rates and lean much harder on the processor.</li>
                  <li><strong className="text-ink-900">Ray tracing and upscaling are not included.</strong> Ray tracing lowers the card number a lot. DLSS, FSR and XeSS raise it, which can turn a GPU bound pair into a CPU limited one.</li>
                  <li><strong className="text-ink-900">Video memory is only partly covered.</strong> Cards with 8 GB fall behind at 4K in the review data, and that shows up here, but individual games vary.</li>
                  <li><strong className="text-ink-900">They describe averages, not smoothness.</strong> Stutter and frame time spikes are not measured.</li>
                </ul>
                <p className="mt-4 leading-relaxed text-ink-700">
                  To check one game rather than an average, use the{" "}
                  <Link href="/tools/can-you-run-it" className="font-medium text-brand-700 hover:underline">Can You Run It checker</Link>, which compares your PC with the specs a publisher released for that game.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">Frequently Asked Questions About Bottlenecks</h2>
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
                    ["/tools/can-you-run-it", "Can You Run It?", "Check your PC against the specs publishers released for popular games."],
                    ["/tools/can-you-run-it/cyberpunk-2077", "Cyberpunk 2077 PC requirements", "Minimum and recommended specs with a check for your PC."],
                    ["/tools/can-you-run-it/fortnite", "Fortnite PC requirements", "What Fortnite needs, from low settings to Epic."],
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
                  <h3 className="mb-4 font-semibold text-ink-900">About the data</h3>
                  <dl className="space-y-2.5 text-sm">
                    {[
                      ["Card figures", "Tom's Hardware GPU hierarchy"],
                      ["Card data date", "June 24, 2026"],
                      ["Processor figures", "Tom's Hardware CPU hierarchy"],
                      ["Processor data date", "October 5, 2026"],
                      ["Games averaged", "11, Ultra settings"],
                      ["Processors", `${CPU_COUNT} (${CPU_MEASURED + CPU_SIBLING} from reviews)`],
                      ["Graphics cards", `${GPU_COUNT} (${GPU_MEASURED} from reviews)`],
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
