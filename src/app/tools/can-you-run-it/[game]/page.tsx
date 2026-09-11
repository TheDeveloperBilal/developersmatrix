import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Cpu,
  MemoryStick,
  MonitorSmartphone,
  HardDrive,
  Layers,
  Gauge,
  ArrowRight,
  ChevronRight,
  CalendarDays,
  Building2,
} from 'lucide-react';
import { gamesDatabase, type Game, type GameRequirement } from '@/data/games-database';
import { siteConfig } from '@/data/config';
import { FAQSchema, BreadcrumbSchema } from '@/components/seo/SchemaMarkup';

interface GamePageProps {
  params: Promise<{ game: string }>;
}

export async function generateStaticParams() {
  return gamesDatabase.map((g) => ({ game: g.id }));
}

function getGame(id: string): Game | undefined {
  return gamesDatabase.find((g) => g.id === id);
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { game: id } = await params;
  const game = getGame(id);
  if (!game) return { title: 'Game Not Found' };

  const url = `${siteConfig.url}/tools/can-you-run-it/${game.id}`;
  const short = game.searchName || game.name;

  if (game.requirementsStatus === 'unannounced') {
    return {
      title: `${short} PC System Requirements Explained`,
      description: `${game.developer} has not published PC specs for ${short}, and no PC version is announced. Here is what is confirmed, and the real ${game.developer} PC baselines to judge your machine against.`,
      keywords: [
        `${short.toLowerCase()} system requirements`,
        `${short.toLowerCase()} pc requirements`,
        `${short.toLowerCase()} pc specs`,
        `can i run ${short.toLowerCase()}`,
        `${short.toLowerCase()} minimum requirements`,
        `${short.toLowerCase()} pc release date`,
      ],
      alternates: { canonical: url },
      openGraph: {
        title: `${short} PC System Requirements: What Is Actually Confirmed`,
        description: `No PC specs have been published for ${short}. Here is the confirmed information and how to judge your own PC.`,
        url,
        type: 'article',
      },
    };
  }

  return {
    title: `Can You Run ${game.name}?`,
    description: `${game.name} PC system requirements. Minimum and recommended specs side by side, plus a free check to see whether your computer can run it.`,
    keywords: [
      `can i run ${game.name.toLowerCase()}`,
      `${game.name.toLowerCase()} system requirements`,
      `${game.name.toLowerCase()} pc requirements`,
      `${game.name.toLowerCase()} minimum specs`,
      `${game.name.toLowerCase()} recommended specs`,
    ],
    alternates: { canonical: url },
    openGraph: {
      title: `Can You Run ${game.name}? System Requirements`,
      description: `Minimum and recommended PC specs for ${game.name}, with a free compatibility check.`,
      url,
      type: 'article',
    },
  };
}

// Verified PC requirements Rockstar has actually published, used as a reference
// point on pages where a title has no announced PC specs. Both figures come from
// Rockstar's own support site. Do not add estimates to this list.
const ROCKSTAR_PC_BASELINES = [
  {
    game: 'Grand Theft Auto V (Enhanced)',
    year: '2025',
    minimum: 'Core i7-4770 / FX-9590, 8 GB RAM, GTX 1630 4GB / RX 6400, 105 GB SSD',
    recommended: 'Core i5-9600K / Ryzen 5 3600, 16 GB RAM, RTX 3060 8GB / RX 6600 XT, 105 GB',
    source: 'https://support.rockstargames.com/articles/lMQXeP2Z1mN3g9oZiBZFR/grand-theft-auto-v-pc-system-requirements',
  },
  {
    game: 'Red Dead Redemption 2',
    year: '2019',
    minimum: 'Core i5-2500K / FX-6300, 8 GB RAM, GTX 770 2GB / R9 280 3GB, 150 GB',
    recommended: 'Core i7-4770K / Ryzen 5 1500X, 12 GB RAM, GTX 1060 6GB / RX 480 4GB, 150 GB',
    source: 'https://support.rockstargames.com/articles/1LqwiYbHeiSyo3dtcVyS1N/red-dead-redemption-2-pc-system-requirements',
  },
];

const SPEC_ROWS: { key: keyof GameRequirement; label: string; Icon: typeof Cpu }[] = [
  { key: 'os', label: 'Operating system', Icon: MonitorSmartphone },
  { key: 'processor', label: 'Processor', Icon: Cpu },
  { key: 'memory', label: 'Memory', Icon: MemoryStick },
  { key: 'graphics', label: 'Graphics', Icon: Layers },
  { key: 'directX', label: 'DirectX', Icon: Gauge },
  { key: 'storage', label: 'Storage', Icon: HardDrive },
];

function SpecCard({
  title, note, req, accent,
}: { title: string; note: string; req: GameRequirement; accent: 'slate' | 'brand' }) {
  const isBrand = accent === 'brand';
  return (
    <div
      className={[
        'rounded-2xl border p-6 sm:p-7 h-full',
        isBrand
          ? 'border-purple-200 dark:border-purple-500/30 bg-purple-50/60 dark:bg-purple-500/5'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50',
      ].join(' ')}
    >
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
        <span
          className={[
            'text-[0.7rem] font-semibold uppercase tracking-wider px-2 py-1 rounded-md',
            isBrand
              ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
          ].join(' ')}
        >
          {isBrand ? 'Smooth play' : 'Bare minimum'}
        </span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">{note}</p>

      <dl className="space-y-3">
        {SPEC_ROWS.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="flex items-start gap-3 rounded-xl bg-white/70 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/60 px-3.5 py-3"
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            <div className="min-w-0">
              <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {label}
              </dt>
              <dd className="text-sm font-medium text-gray-900 dark:text-white break-words">
                {req[key]}
              </dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}

function UnannouncedGamePage({ game }: { game: Game }) {
  const short = game.searchName || game.name;
  const pageUrl = `${siteConfig.url}/tools/can-you-run-it/${game.id}`;
  const sourceUrl = game.requirementsSource?.url;
  const maker = game.developer;

  const quickAnswer =
    `${maker} has not published PC system requirements for ${short}. There is no announced PC version at all. ` +
    `${game.name} is listed for ${game.platforms.join(' and ')} on ${game.releaseDate}. ` +
    `Every minimum and recommended spec chart you have seen for ${short} on PC is somebody's estimate, including the ones formatted to look official.`;

  const confirmed = [
    { label: 'Release date', value: game.releaseDate },
    { label: 'Announced platforms', value: game.platforms.join(', ') },
    { label: 'PC version', value: 'Not announced' },
    { label: 'PC system requirements', value: 'Not published' },
    { label: 'PC store listing', value: 'None on Steam, Epic or the Rockstar Store' },
  ];

  const faqs = [
    {
      question: `What are the ${short} system requirements for PC?`,
      answer: `There are none yet. ${maker} has not published minimum or recommended PC specs for ${short}, because no PC version has been announced. Any chart showing a specific processor, graphics card or memory figure for ${short} on PC was written by a third party working backwards from console hardware. ${maker} publishes real PC specs on its own support site, as it did for Grand Theft Auto V and Red Dead Redemption 2, and nothing exists there for this title.`,
    },
    {
      question: `Is ${short} coming to PC?`,
      answer: `${maker} has not said so. The announced platform list is ${game.platforms.join(' and ')}, with no PC entry. Previous Rockstar titles did reach PC eventually: Grand Theft Auto V arrived on consoles in September 2013 and on PC in April 2015, and Red Dead Redemption 2 arrived on consoles in October 2018 and on PC in November 2019. Both gaps ran to roughly thirteen months. That pattern is a reasonable expectation, not an announcement.`,
    },
    {
      question: `When is the ${short} PC release date?`,
      answer: `Unknown. No date, platform listing or pre-order exists for a PC version. If anyone offers you a PC key, a beta place or early access for ${short}, treat it as a scam, because there is nothing to sell. Watch ${maker}'s own newswire and support site rather than resellers.`,
    },
    {
      question: `Will my PC run ${short}?`,
      answer: `Nobody can answer that yet, including us, because the target has not been published. What you can do is measure your machine against what Rockstar asks for today. Its most recent PC release, Grand Theft Auto V Enhanced, recommends a Core i5-9600K or Ryzen 5 3600, 16 GB of memory and an RTX 3060 or RX 6600 XT, and it requires an SSD even at minimum. A PC that clears that comfortably is in sensible shape.`,
    },
    {
      question: `How much storage will ${short} need?`,
      answer: `Not published. For scale, Red Dead Redemption 2 asks for 150 GB and Grand Theft Auto V Enhanced asks for 105 GB on an SSD. Planning for at least 150 GB of free SSD space is reasonable. Rockstar moved to requiring solid state storage for the Enhanced release, so a mechanical drive is the part of an older build most likely to fall short.`,
    },
    {
      question: `Should I upgrade my PC now for ${short}?`,
      answer: `Not for this game specifically. Buying hardware against a spec sheet that does not exist is how people overspend. If you are upgrading anyway, the safe targets are 16 GB of memory, an SSD with 150 GB free, and a graphics card at or above the RTX 3060 or RX 6600 XT class, because that is what Rockstar already asks for on its current PC titles.`,
    },
  ];

  const videoGameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    alternateName: short,
    description: game.description,
    url: pageUrl,
    genre: game.genre,
    gamePlatform: game.platforms,
    datePublished: game.releaseDate,
    author: { '@type': 'Organization', name: game.developer },
    publisher: { '@type': 'Organization', name: game.publisher },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Tools', url: `${siteConfig.url}/tools` },
          { name: 'Can You Run It', url: `${siteConfig.url}/tools/can-you-run-it` },
          { name: game.name, url: pageUrl },
        ]}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li><Link href="/tools/can-you-run-it" className="hover:text-purple-600 dark:hover:text-purple-400">Can You Run It</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-gray-900 dark:text-white font-medium">{short}</li>
            </ol>
          </nav>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {game.genre.slice(0, 3).map((g) => (
                <span key={g} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  {g}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              {short} PC System Requirements
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              What {maker} has actually confirmed, and how to judge your own machine while the real specs do not exist.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-4 h-4" aria-hidden="true" />{game.developer}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" aria-hidden="true" />{game.releaseDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MonitorSmartphone className="w-4 h-4" aria-hidden="true" />{game.platforms.join(', ')}
              </span>
            </div>
          </header>

          <section
            aria-label="Quick answer"
            className="mb-12 rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 to-white dark:from-amber-500/10 dark:to-gray-900 p-6 sm:p-7"
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300 mb-2">
              Short answer
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-100">
              {quickAnswer}
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What {maker} has confirmed
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {confirmed.map((row) => (
                    <tr key={row.label} className="bg-white dark:bg-gray-800/50">
                      <th scope="row" className="text-left font-semibold text-gray-600 dark:text-gray-300 px-5 py-3.5 w-1/2 align-top">
                        {row.label}
                      </th>
                      <td className="px-5 py-3.5 text-gray-900 dark:text-white font-medium">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sourceUrl && (
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Source:{' '}
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 underline underline-offset-2">
                  {game.requirementsSource?.label}
                </a>
                . {game.platformNote}
              </p>
            )}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Why every {short} PC spec chart you have seen is a guess
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Search for {short} system requirements and you will find dozens of tidy tables listing a
                minimum graphics card and a recommended processor. They disagree with each other, which is
                the first clue. None of them cite {maker}, which is the second.
              </p>
              <p>
                {maker} publishes PC specs itself, on its own support site, once a PC build has a date.
                It did that for Grand Theft Auto V and for Red Dead Redemption 2. For this title there is
                no such page, because there is no announced PC version to write one about.
              </p>
              <p>
                The people making those charts are reasoning from the PlayStation 5, which has eight
                Zen 2 cores, sixteen gigabytes of shared memory and a custom solid state drive. That is a
                sensible thing to reason from. It is not a specification, and presenting it as one is how
                readers end up buying a graphics card they did not need.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What {maker} really asks for on PC today
            </h2>
            <p className="mb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
              These are published specs from {maker}&rsquo;s own support pages. They are the closest thing to
              evidence available, and they are worth more than any prediction chart.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="text-left font-semibold text-gray-700 dark:text-gray-200 px-5 py-3">Title</th>
                    <th scope="col" className="text-left font-semibold text-gray-700 dark:text-gray-200 px-5 py-3">Minimum</th>
                    <th scope="col" className="text-left font-semibold text-gray-700 dark:text-gray-200 px-5 py-3">Recommended</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {ROCKSTAR_PC_BASELINES.map((b) => (
                    <tr key={b.game} className="bg-white dark:bg-gray-800/50 align-top">
                      <td className="px-5 py-4">
                        <a href={b.source} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-700 dark:text-purple-300 underline underline-offset-2">
                          {b.game}
                        </a>
                        <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">PC release {b.year}</span>
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{b.minimum}</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-gray-300">{b.recommended}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What that tells you, and what it does not
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Read across those two rows and the direction is clear. In 2019 Rockstar asked for 8 GB of
                memory and a GTX 770 at minimum. By 2025 the minimum had moved to a GTX 1630 with a
                mandatory SSD, and the recommendation had moved to an RTX 3060 with 16 GB of memory.
                Six years pushed the floor up by roughly two graphics card generations and made solid
                state storage compulsory.
              </p>
              <p>
                A build that meets the Grand Theft Auto V Enhanced recommendation is therefore a
                defensible preparation target. It is what Rockstar considers comfortable on its current
                engine, on hardware that shipped this year.
              </p>
              <p className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 px-5 py-4">
                To be explicit about what this is: reasoning from Rockstar&rsquo;s published history, not a
                specification. When Rockstar announces a PC version, the real numbers will replace this
                section and they may sit above or below it.
              </p>
            </div>
          </section>

          <section className="mb-12 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-purple-50/60 dark:bg-purple-500/5 p-6 sm:p-7">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Check where your PC stands right now
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5">
              You cannot test against {short} yet, but you can test against the Rockstar titles that do
              have published specs. Run your machine against Grand Theft Auto V or Red Dead Redemption 2
              in our free checker and you will see exactly which component is closest to falling short.
              That is the component to spend money on, whenever the real requirements arrive.
            </p>
            <Link
              href="/tools/can-you-run-it"
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition-colors"
            >
              Check my PC free <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 dark:text-white flex items-center justify-between gap-4">
                    {f.question}
                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Games you can check today
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {gamesDatabase
                .filter((g) => g.id !== game.id && g.requirementsStatus !== 'unannounced')
                .slice(0, 6)
                .map((g) => (
                  <Link
                    key={g.id}
                    href={`/tools/can-you-run-it/${g.id}`}
                    className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-3.5 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-sm transition-all"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 truncate">
                      {g.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                      {g.genre[0]} · {g.releaseDate}
                    </p>
                  </Link>
                ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

export default async function GamePage({ params }: GamePageProps) {
  const { game: id } = await params;
  const game = getGame(id);
  if (!game) notFound();

  if (game.requirementsStatus === 'unannounced') {
    return <UnannouncedGamePage game={game} />;
  }

  const min = game.minimumRequirements;
  const rec = game.recommendedRequirements;

  const quickAnswer =
    `To run ${game.name} at minimum settings you need ${min.processor.split('/')[0].trim()} or better, ` +
    `${min.memory.replace(' RAM', '')} of memory, and ${min.graphics.split('/')[0].trim()}. ` +
    `For comfortable frame rates aim for ${rec.graphics.split('/')[0].trim()} with ${rec.memory.replace(' RAM', '')}. ` +
    `Set aside ${min.storage.replace(' available space', '')} of drive space.`;

  const faqs = [
    {
      question: `Can I run ${game.name} on my PC?`,
      answer: `${quickAnswer} Enter your own specs in the checker above and you will get a compatibility score with an estimated frame rate rather than a simple yes or no.`,
    },
    {
      question: `What are the minimum requirements for ${game.name}?`,
      answer: `${min.os}, ${min.processor}, ${min.memory}, ${min.graphics}, DirectX ${min.directX.replace('Version ', '')} and ${min.storage}. Minimum specs mean the game launches and runs, usually at low settings and around 30 frames per second.`,
    },
    {
      question: `What are the recommended requirements for ${game.name}?`,
      answer: `${rec.os}, ${rec.processor}, ${rec.memory}, ${rec.graphics}, DirectX ${rec.directX.replace('Version ', '')} and ${rec.storage}. Recommended specs target a smooth experience at higher settings.`,
    },
    {
      question: `How much storage does ${game.name} need?`,
      answer: `${game.name} needs ${min.storage.replace(' available space', '')} of free space. Install it on an SSD if you can. Modern games stream assets while you play, and a mechanical drive causes texture pop in and longer loading even when every other component is strong enough.`,
    },
    {
      question: `Does ${game.name} run on a laptop?`,
      answer: `It can, but compare the actual laptop GPU rather than the desktop card with a similar name. Laptop graphics chips typically run 15 to 30 percent slower than their desktop counterparts because of power and cooling limits, so a laptop card that matches the recommended spec on paper often performs closer to the minimum.`,
    },
  ];

  const related = gamesDatabase.filter((g) => g.id !== game.id).slice(0, 6);

  const videoGameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.name,
    description: game.description,
    url: `${siteConfig.url}/tools/can-you-run-it/${game.id}`,
    genre: game.genre,
    gamePlatform: game.platforms,
    applicationCategory: 'Game',
    author: { '@type': 'Organization', name: game.developer },
    publisher: { '@type': 'Organization', name: game.publisher },
    processorRequirements: min.processor,
    memoryRequirements: min.memory,
    storageRequirements: min.storage,
    operatingSystem: min.os,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }}
      />
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'Tools', url: `${siteConfig.url}/tools` },
          { name: 'Can You Run It', url: `${siteConfig.url}/tools/can-you-run-it` },
          { name: game.name, url: `${siteConfig.url}/tools/can-you-run-it/${game.id}` },
        ]}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li><Link href="/tools/can-you-run-it" className="hover:text-purple-600 dark:hover:text-purple-400">Can You Run It</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-gray-900 dark:text-white font-medium">{game.name}</li>
            </ol>
          </nav>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {game.genre.slice(0, 3).map((g) => (
                <span key={g} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
                  {g}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
              Can You Run {game.name}?
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              Minimum and recommended PC requirements, side by side, with a free check against your own hardware.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-4 h-4" aria-hidden="true" />{game.developer}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" aria-hidden="true" />Released {game.releaseDate}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MonitorSmartphone className="w-4 h-4" aria-hidden="true" />{game.platforms.join(', ')}
              </span>
            </div>
          </header>

          <section
            aria-label="Quick answer"
            className="mb-12 rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-br from-purple-50 to-white dark:from-purple-500/10 dark:to-gray-900 p-6 sm:p-7"
          >
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-purple-700 dark:text-purple-300 mb-2">
              Quick answer
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-800 dark:text-gray-100">
              {quickAnswer}
            </p>
            <Link
              href="/tools/can-you-run-it"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition-colors"
            >
              Check your own PC <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {game.name} system requirements
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <SpecCard
                title="Minimum"
                note="The game launches and runs, usually low settings around 30 frames per second"
                req={min}
                accent="slate"
              />
              <SpecCard
                title="Recommended"
                note="Comfortable frame rates at higher settings"
                req={rec}
                accent="brand"
              />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              What these numbers mean in practice
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                Minimum requirements are the floor, not a target. Meeting them means {game.name} will
                start and remain playable, typically at low settings and roughly 30 frames per second.
                If your hardware only just clears the minimum, expect to lower the resolution before you
                lower anything else, since resolution costs more performance than almost any other setting.
              </p>
              <p>
                The graphics card matters more than any other component here. In our scoring the GPU
                carries 40 percent of the compatibility result, the processor 30 percent, and memory and
                storage speed 15 percent each. A strong processor cannot rescue a card that falls below the
                minimum, though a weak processor can hold back a strong card at lower resolutions.
              </p>
              <p>
                Storage speed is the most commonly overlooked requirement. {game.name} lists{' '}
                {min.storage.replace(' available space', '')} of space, and modern titles stream assets
                from disk while you play. On a mechanical drive you get texture pop in and longer loading
                even when every other part of your system is comfortably above spec.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-semibold text-gray-900 dark:text-white flex items-center justify-between gap-4">
                    {f.question}
                    <ChevronRight className="w-4 h-4 shrink-0 text-gray-400 transition-transform group-open:rotate-90" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Check another game
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map((g) => (
                <Link
                  key={g.id}
                  href={`/tools/can-you-run-it/${g.id}`}
                  className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-4 py-3.5 hover:border-purple-300 dark:hover:border-purple-500/40 hover:shadow-sm transition-all"
                >
                  <p className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 truncate">
                    {g.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {g.genre[0]} · {g.releaseDate}
                  </p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
