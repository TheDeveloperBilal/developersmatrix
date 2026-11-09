import { Metadata } from 'next';
import GTA6Client from './GTA6Client';
import { FAQSchema, BreadcrumbSchema, ArticleSchema } from '@/components/seo/SchemaMarkup';
import { siteConfig } from '@/data/config';
import Link from 'next/link';

const LAUNCH_DESCRIPTION = "GTA 6 unlocks at midnight local time on November 19, 2026 on PS5 and Xbox Series X|S. Preload opens November 10 and needs up to 212 GB of space.";

export const metadata: Metadata = {
  title: "GTA 6 Release Date and Time, Preload Date and File Size",
  description: LAUNCH_DESCRIPTION,
  keywords: ['GTA 6 preload date', 'GTA 6 release time', 'GTA 6 unlock time', 'GTA 6 file size', 'GTA 6 download size', 'GTA 6 collectors edition', 'GTA 6 pre order live', 'GTA 6 release date november 19 2026', 'GTA 6 release date confirmed', 'GTA 6 PC requirements', 'GTA 6 gameplay', 'Grand Theft Auto 6', 'GTA 6 news 2026', 'GTA 6 system requirements', 'when is GTA 6 coming out', 'GTA 6 release date november 2026', 'GTA VI confirmed', 'GTA 6 price', 'GTA 6 editions'],
  alternates: {
    canonical: 'https://developersmatrix.com/gta-6'
  },
  openGraph: {
    title: "GTA 6 Release Date and Time, Preload Date and File Size",
    description: LAUNCH_DESCRIPTION,
    images: ['/images/blog/gta6-news.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: "GTA 6 Release Date and Time, Preload Date and File Size",
    description: LAUNCH_DESCRIPTION,
    images: ['/images/blog/gta6-news.jpg'],
  },
};

// Xbox opens preload at one moment worldwide: 12:00 a.m. GMT on November 10.
// Rows are that moment in local time (November, so no US or UK daylight saving).
const XBOX_PRELOAD_TIMES = [
  ['US Pacific', '4:00 p.m., November 9'],
  ['US Eastern', '7:00 p.m., November 9'],
  ['UK', '12:00 a.m., November 10'],
  ['Central Europe', '1:00 a.m., November 10'],
  ['Pakistan', '5:00 a.m., November 10'],
  ['India', '5:30 a.m., November 10'],
  ['Japan', '9:00 a.m., November 10'],
  ['Sydney and Melbourne', '11:00 a.m., November 10'],
];

const KEY_DATES = [
  ['Preload opens on PS5', 'November 10, midnight local time'],
  ['Preload opens on Xbox Series X|S', 'November 10, 12:00 a.m. GMT (one moment worldwide)'],
  ['Boxed copies (download code in the box)', 'November 12'],
  ['GTA 6 unlocks', 'November 19, midnight local time in each region'],
];

/** Launch week answers, shown right under the hero. Server rendered so the text is in the HTML. */
function LaunchWeek() {
  return (
    <section aria-labelledby="launch-week" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-10">
      <div className="rounded-2xl border border-purple-200 dark:border-purple-500/30 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-700 dark:text-purple-300">Updated November 9, 2026</p>
          <h2 id="launch-week" className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            GTA 6 Launch Week: Release Time, Preload and File Size
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
            GTA 6 unlocks at midnight local time on Thursday, November 19, 2026, on PS5 and Xbox Series X|S. If you bought a digital copy, you can preload it from November 10. Rockstar says you need up to 212 GB of free space, and the exact size depends on your console. Boxed copies contain a download code, not a disc, and reach shops on November 12. There is still no PC version.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key dates</h3>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {KEY_DATES.map(([what, when]) => (
                      <tr key={what}>
                        <th scope="row" className="text-left font-medium text-gray-600 dark:text-gray-300 px-4 py-2.5 align-top">{what}</th>
                        <td className="px-4 py-2.5 text-gray-900 dark:text-white">{when}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Xbox preload start in your time zone</h3>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {XBOX_PRELOAD_TIMES.map(([region, time]) => (
                      <tr key={region}>
                        <th scope="row" className="text-left font-medium text-gray-600 dark:text-gray-300 px-4 py-2 align-top">{region}</th>
                        <td className="px-4 py-2 text-gray-900 dark:text-white tabular-nums">{time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">On PS5 there is nothing to convert: preload and launch both follow midnight where you live.</p>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-semibold text-gray-900 dark:text-white">Get ready in four steps</h3>
          <ol className="mt-3 space-y-2 text-gray-700 dark:text-gray-300 list-decimal pl-5">
            <li>Free up 212 GB on your console&rsquo;s internal drive or a supported external drive.</li>
            <li>Turn on automatic downloads and leave the console in rest mode.</li>
            <li>Bought a boxed copy? Redeem the code from November 12 to start the download.</li>
            <li>Want a printed cover or map? Rockstar&rsquo;s site offers a free printable cover and a map of Leonida on November 19.</li>
          </ol>

          <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
            Playing on PC? There is no PC version or date yet.{' '}
            <Link href="/tools/can-you-run-it/gta-6" className="font-medium text-purple-700 dark:text-purple-300 hover:underline">
              See what PC you will likely need
            </Link>{' '}
            based on Rockstar&rsquo;s current PC games.
          </p>
        </div>
      </div>
    </section>
  );
}

const gta6Faqs = [
  {
    question: "When can I preload GTA 6?",
    answer: "From November 10, 2026, if you bought a digital copy. On PS5 it starts at midnight local time. On Xbox it starts at 12:00 a.m. GMT worldwide, which is 7:00 p.m. Eastern on November 9. Boxed copies hold a code you can redeem from November 12."
  },
  {
    question: "What time does GTA 6 unlock?",
    answer: "Midnight local time on November 19, 2026. Each region unlocks at its own midnight, so players in New Zealand and Australia start first and the US West Coast starts last."
  },
  {
    question: "How big is the GTA 6 download?",
    answer: "Rockstar says up to 212 GB, and the exact size depends on your console. Clear that space before preload starts so the download does not stop halfway."
  },
  {
    question: "Does the GTA 6 Collector's Edition include the game?",
    answer: "No. The $399.99 Goodtime State: Vice City Collection on the Rockstar Store is merchandise only. You need to buy the Standard ($79.99) or Ultimate ($99.99) edition separately."
  },
  {
    question: "When did GTA 6 preorders go live?",
    answer: "GTA 6 preorders opened on June 25, 2026 on PlayStation 5 and Xbox Series X|S. The Standard Edition costs $79.99 and the Ultimate Edition $99.99 in the US. Purchases made before November 20, 2026 include the Vintage Vice City Pack, and digital preorders add one month of GTA+."
  },
  {
    question: "How much money did GTA 6 make from preorders?",
    answer: "Nobody outside Rockstar and Take-Two knows. Take-Two has not published a preorder figure. On its August 2026 earnings call it said preorder demand was very strong but shared no number. Headlines claiming $1 billion in the first hour or 39 million copies came from outside estimates, not from the company."
  },
  {
    question: "Is the GTA 6 release date November 19, 2026 confirmed?",
    answer: "Yes. Rockstar set November 19, 2026 for PlayStation 5 and Xbox Series X|S in November 2025, after moving the game from May 26, 2026. Take-Two repeated the date on its May and August 2026 earnings calls. Digital preloading starts on November 10, and boxed copies reach shops on November 12."
  },
  {
    question: "When is the GTA 6 PC release date?",
    answer: "Rockstar has not announced a PC version, so there is no date. What exists is a pattern. Grand Theft Auto V reached consoles in September 2013 and PC in April 2015, a gap of nineteen months. Red Dead Redemption 2 reached consoles in October 2018 and PC in November 2019, a gap of thirteen months. Applying the same range to a 19 November 2026 console launch points somewhere between late 2027 and mid 2028. That is arithmetic on past releases, not information from Rockstar, and the company has committed to nothing."
  },
  {
    question: "What are the GTA 6 system requirements for PC?",
    answer: "There are none. Rockstar has published no PC system requirements for GTA 6, because no PC version has been announced. Any spec chart you find online, including ones formatted to look official, is a third party estimate. The useful comparison is what Rockstar asks for on its current PC titles: Grand Theft Auto V Enhanced recommends a Core i5-9600K or Ryzen 5 3600, 16GB of memory and an RTX 3060 or RX 6600 XT, and it requires an SSD even at minimum. Red Dead Redemption 2 asks for 150GB of space. A machine that clears those comfortably is in sensible shape."
  },
  {
    question: "How much will GTA 6 cost?",
    answer: "In the US the Standard Edition costs $79.99 and the Ultimate Edition costs $99.99. Rockstar announced both prices when preorders opened on June 25, 2026. The Ultimate Edition adds vehicles, weapons, outfits and other extras tied to the story. Boxed copies contain a download code rather than a disc."
  },
  {
    question: "Will GTA 6 be on Xbox Game Pass?",
    answer: "Neither Rockstar nor Microsoft has announced GTA 6 for Xbox Game Pass, and it is not part of PlayStation Plus either. At launch it is a paid game on PS5 and Xbox Series X|S."
  },
  {
    question: "What platforms will GTA 6 launch on?",
    answer: "Rockstar lists PlayStation 5 and Xbox Series X|S, launching 19 November 2026. That is the entire announced platform list. There is no PlayStation 4, Xbox One or Nintendo Switch version, and no PC version has been announced either. If Rockstar follows the pattern it set with Grand Theft Auto V and Red Dead Redemption 2, a PC release would land roughly thirteen to nineteen months after the console launch, but the company has said nothing on the subject."
  },
  {
    question: "Who are the main characters in GTA 6?",
    answer: "Lucia Caminos and Jason Duval, a couple drawn into crime in Leonida. Rockstar's official site also introduces Cal Hampton, Boobie Ike, Dre'Quan Priest, Real Dimez, Raul Bautista and Brian Heder."
  },
  {
    question: "What city is GTA 6 set in?",
    answer: "GTA 6 is set in Leonida, Rockstar's version of Florida. The main city is Vice City, its take on Miami, last seen in 2002's Grand Theft Auto: Vice City. Rockstar's site also shows the Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga National Park. Rockstar has not said how big the map is."
  },
  {
    question: "Will my GTA 5 Online progress carry over to GTA 6?",
    answer: "Rockstar has not said anything about carrying GTA Online progress into GTA 6, and it has not shared details or timing for GTA 6's online side. GTA Online for GTA V keeps running. The only link so far is the free month of GTA+ that comes with digital preorders."
  }
];

export default function GTA6Page() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: siteConfig.url },
          { name: 'GTA 6 Release Date & News', url: `${siteConfig.url}/gta-6` }
        ]}
      />
      <ArticleSchema
        headline="GTA 6 Release Date November 19 2026 Confirmed"
        description="Official confirmation, system requirements, gameplay features, and latest news about Grand Theft Auto VI releasing November 19, 2026."
        image={`${siteConfig.url}/images/blog/gta6-news.jpg`}
        url={`${siteConfig.url}/gta-6`}
        datePublished="2026-05-08T00:00:00+00:00"
        dateModified="2026-11-09T00:00:00+00:00"
        author="Syed Bilal Shah"
        authorUrl={`${siteConfig.url}/about`}
        authorJobTitle="Founder & Lead Editor"
        articleSection="Gaming News"
      />
      <FAQSchema faqs={gta6Faqs} />
      <GTA6Client launchBlock={<LaunchWeek />} />
      
      {/* SEO Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            GTA 6 Preorders: Prices, Editions and What Is Confirmed
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="text-lg leading-relaxed">
              GTA 6 preorders opened on June 25, 2026 for PlayStation 5 and Xbox Series X|S. In the US the Standard Edition costs $79.99 and the Ultimate Edition costs $99.99. The Ultimate Edition adds a collection of vehicles, weapons, outfits and other extras tied to Jason and Lucia&rsquo;s story.
            </p>
            <p className="leading-relaxed">
              Anything bought before November 20, 2026 includes the Vintage Vice City Pack, and digital preorders come with a free month of GTA+. Digital preloading starts on November 10, 2026, two days earlier than Rockstar first said. Boxed copies reach shops on November 12. The box holds a download code rather than a disc, so you will still need to download the game, which takes up to 212 GB.
            </p>
            <p className="leading-relaxed">
              You may have seen headlines about $1 billion in the first hour or tens of millions of copies preordered. Those were outside estimates. Take-Two has not published a preorder figure. On its August 2026 earnings call it described demand as very strong and repeated the November 19 date, but it shared no number.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            GTA 6 Release Date November 19, 2026: Everything Confirmed So Far
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="text-lg leading-relaxed">
              Rockstar Games has officially confirmed the GTA 6 release date as November 19, 2026. This is not a rumor or a leak. The date appears in official trailers, press releases, and across Rockstar's verified marketing channels. The date has moved twice: Rockstar first aimed for fall 2025, then May 26, 2026, and in November 2025 it settled on November 19, 2026.
            </p>
            <p className="leading-relaxed">
              The November 19, 2026 release puts GTA 6 squarely in the holiday shopping season, the same season Rockstar picked for Red Dead Redemption 2 in October 2018. GTA V, released in September 2013, has now sold more than 230 million copies according to Take-Two.
            </p>
            <p className="leading-relaxed">
              What makes this release particularly significant is the platform strategy. GTA 6 is launching on PlayStation 5 and Xbox Series X|S only. There is no PlayStation 4 or Xbox One version, and no PC version has been announced.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            How the GTA 6 Release Date Moved
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              GTA 6 has moved twice. The first trailer, in December 2023, gave a 2025 window. In May 2025 Rockstar moved the game to May 26, 2026. In November 2025 it moved it again, to November 19, 2026, saying the extra time would let it finish the game with the level of polish players expect. Take-Two repeated the November date on its May and August 2026 earnings calls.
            </p>
            <p className="leading-relaxed">
              Interest has held up through both delays. The first trailer drew 93 million YouTube views in its first 24 hours, and Rockstar says the second trailer, released on May 6, 2025, passed 475 million views across all platforms in its first day. Take-Two&rsquo;s results for the quarter to June 30, 2026 put GTA V at more than 230 million copies and Red Dead Redemption 2 at more than 87 million.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            GTA 6 Story, Characters and Setting
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              The story follows Lucia Caminos and Jason Duval, a couple pulled into crime in the state of Leonida. Rockstar&rsquo;s official site also introduces Cal Hampton, Boobie Ike, Dre&rsquo;Quan Priest, Real Dimez, Raul Bautista and Brian Heder.
            </p>
            <p className="leading-relaxed">
              Leonida is Rockstar&rsquo;s version of Florida, and Vice City, its take on Miami, is the main city. Vice City was last the setting of a main game in 2002&rsquo;s Grand Theft Auto: Vice City. Rockstar has not said how big the map is.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Rockstar Has Confirmed and What It Has Not
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              <strong>Confirmed by Rockstar or Take-Two:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The November 19, 2026 release on PlayStation 5 and Xbox Series X|S</li>
              <li>Two editions: Standard at $79.99 and Ultimate at $99.99 in the US</li>
              <li>Preorders from June 25, 2026, digital preloading from November 10 and boxed copies from November 12</li>
              <li>A download of up to 212 GB, depending on the console</li>
              <li>The launch trailer, released October 15, 2026</li>
              <li>Boxed copies that hold a download code rather than a disc</li>
              <li>The Vintage Vice City Pack for purchases before November 20, and a free month of GTA+ with digital preorders</li>
              <li>The main characters and the Leonida setting</li>
            </ul>
            <p className="leading-relaxed">
              <strong>Not announced:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A PC version or PC system requirements</li>
              <li>The size of the map</li>
              <li>Details or timing of the online side of the game</li>
            </ul>
            <p className="leading-relaxed">
              An insider has reported a December disc release, but Rockstar has not confirmed it. If a claim does not trace back to Rockstar Newswire, Rockstar&rsquo;s official site or Take-Two&rsquo;s investor releases, treat it as a rumor.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Dates to Watch Before Launch
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>November 10, 2026:</strong> digital preloading opens (PS5 at midnight local time, Xbox at 12:00 a.m. GMT)</li>
              <li><strong>November 12, 2026:</strong> boxed copies with a download code reach shops</li>
              <li><strong>November 19, 2026:</strong> GTA 6 unlocks on PS5 and Xbox Series X|S</li>
              <li><strong>Before November 20, 2026:</strong> buy by then to get the Vintage Vice City Pack</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            GTA 6 PC Release Date: What We Know About the PC Version
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              PC players are asking the same question they ask before every Rockstar release: when do we get ours? The honest answer is that nobody outside Rockstar knows, because no PC version has been announced. What we have is the pattern. Grand Theft Auto V hit consoles in September 2013 and PC in April 2015, a gap of nineteen months. Red Dead Redemption 2 hit consoles in October 2018 and PC in November 2019, a gap of thirteen months. Apply that range to 19 November 2026 and you land somewhere between late 2027 and mid 2028. Treat that as arithmetic, not as news.
            </p>
            <p className="leading-relaxed">
              Going further back, Grand Theft Auto IV reached PC about seven months after consoles. Three games, three different gaps, which is why nobody can give you a real PC date yet.
            </p>
            <p className="leading-relaxed">
              Rockstar has not explained its PC plans for GTA 6. Until it does, ignore anyone selling PC keys, beta access or early downloads. None of those exist, and offers like that are scams.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            GTA 6 System Requirements: Can Your PC Run It?
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              Rockstar has published nothing here, and we are not going to invent it. There are no official GTA 6 PC requirements because there is no announced PC version. What we can give you is the real thing: the specs Rockstar publishes for the titles it already sells on PC.
            </p>
            <p className="leading-relaxed">
              Grand Theft Auto V Enhanced, released in 2025, asks for a Core i7-4770 or FX-9590 with 8GB of memory and a GTX 1630 at minimum, and recommends a Core i5-9600K or Ryzen 5 3600 with 16GB and an RTX 3060 or RX 6600 XT. It needs 105GB and will not install on a mechanical drive. Red Dead Redemption 2, from 2019, asks for 150GB of space and recommends a GTX 1060 with 12GB of memory. Six years moved Rockstar&rsquo;s floor up roughly two graphics card generations and made solid state storage compulsory.
            </p>
            <p className="leading-relaxed">
              If you want to prepare, that direction of travel is the only honest guide: 16GB of memory, an SSD with well over 200GB free (the console version needs up to 212GB, and Rockstar&rsquo;s PC versions are usually larger), and a graphics card at or above the RTX 3060 class. Read the full breakdown on our <Link href="/tools/can-you-run-it/gta-6" className="text-blue-600 dark:text-blue-400 hover:underline">GTA 6 PC requirements page</Link>, or test your machine against the Rockstar games that do have published specs in the <Link href="/tools/can-you-run-it" className="text-blue-600 dark:text-blue-400 hover:underline">Can You Run It tool</Link>.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Key Features and What Makes GTA 6 Different
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              GTA 6 returns to Vice City, Rockstar's fictional version of Miami, but expands far beyond the city limits into Leonida State. Rockstar&rsquo;s official site shows the Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia and Mount Kalaga National Park alongside the city, though it has not said how big the map is. The story follows Lucia Caminos and Jason Duval, a couple pulled into crime.
            </p>
            <p className="leading-relaxed">
              The two trailers show crowded beaches, swamps, highways and nightlife, plus plenty of in game social media clips that parody the real thing. Rockstar has not published a feature list, so anything beyond what the trailers show, including talk of new engines, weather systems or NPC memory, is guesswork for now.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            GTA 6 Price and Editions
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <p className="leading-relaxed">
              There are two editions. The Standard Edition costs $79.99 and the Ultimate Edition costs $99.99 in the US, with local prices set by each store. Boxed copies contain a download code. Rockstar also sells a $399.99 box called The Goodtime State: Vice City Collection on its store, but it holds merchandise only and does not include the game. For comparison, GTA V launched at $59.99 in 2013.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions About GTA 6
          </h2>
          <div className="space-y-4">
            {gta6Faqs.map((faq, index) => (
              <details key={index} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sources
          </h2>
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://www.rockstargames.com/newswire" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Rockstar Newswire</a>, Rockstar&rsquo;s official news page</li>
              <li><a href="https://www.rockstargames.com/VI" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Grand Theft Auto VI official site</a>: trailers, characters, places and editions</li>
              <li><a href="https://www.rockstargames.com/newswire/article/517oa135328155/grand-theft-auto-vi-pre-orders-begin-on-june-25" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Rockstar: Grand Theft Auto VI preorders begin on June 25</a></li>
              <li><a href="https://www.rockstargames.com/newswire/article/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Rockstar: Grand Theft Auto VI pre-load begins on November 10</a></li>
              <li><a href="https://www.rockstargames.com/VI/launch-trailer" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Rockstar: Grand Theft Auto VI launch trailer</a></li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Related Resources
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/tools/can-you-run-it" className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can You Run It Tool</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check your PC against the specs publishers released for big PC games, including GTA 5 Enhanced.</p>
            </Link>
            <Link href="/trends" className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tech and Gaming Trends 2026</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Explore the biggest gaming releases, hardware launches, and industry shifts happening this year.</p>
            </Link>
            <Link href="/blog" className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Gaming News and Guides</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deep dives into the biggest releases, hardware reviews, and gaming industry analysis.</p>
            </Link>
            <Link href="/tools/website-audit" className="block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Website Audit Tool</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Check if your gaming blog or streaming site is optimized for Google search and page speed.</p>
            </Link>
          </div>
        </section>

        <section>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Check If Your PC Can Run GTA 6</h2>
            <p className="text-purple-100 mb-6 max-w-xl mx-auto">Enter your CPU, GPU, and RAM to get an instant compatibility score and personalized upgrade suggestions.</p>
            <Link href="/tools/can-you-run-it" className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg">
              Test My PC Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
