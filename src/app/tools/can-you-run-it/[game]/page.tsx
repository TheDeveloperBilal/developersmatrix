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

export default async function GamePage({ params }: GamePageProps) {
  const { game: id } = await params;
  const game = getGame(id);
  if (!game) notFound();

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
