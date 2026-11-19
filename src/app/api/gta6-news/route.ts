import { NextResponse } from 'next/server';

// Curated, sourced GTA 6 news for the /gta-6 hub.
// This used to call an AI web search SDK that does not run on Vercel, so every
// visitor got a hardcoded fallback with wrong prices. These items are checked
// against the original announcements. Add new items at the top when Rockstar or
// Take-Two announce something.
const NEWS = [
  {
    title: 'GTA 6 is out on PS5 and Xbox Series X|S',
    snippet: 'GTA 6 unlocked at midnight local time on November 19, 2026, starting in New Zealand at 11:00 UTC on November 18. US stores unlocked at one moment nationwide, midnight Eastern, which was 9:00 p.m. Pacific. It launched as a single player game, with no PC version.',
    url: 'https://www.vice.com/en/article/gta-6-us-canada-launch-ps5-download-size-game-sharing/',
    source: 'VICE',
    date: 'November 2026',
  },
  {
    title: 'GTA 6 scores 99 on Metacritic, tying the all time record',
    snippet: 'Reviews went live on November 18. The 99 score, from 109 critic reviews on the day, ties The Legend of Zelda: Ocarina of Time for the highest Metacritic score ever and beats Grand Theft Auto IV, Rockstar\'s previous best at 98.',
    url: 'https://www.forbes.com/sites/paultassi/2026/11/18/the-gta-6-metacritic-review-score-is-in-and-ties-an-all-time-record/',
    source: 'Forbes',
    date: 'November 2026',
  },
  {
    title: 'Digital Foundry: 30 fps on every console, steadiest on PS5 Pro',
    snippet: 'Every console version targets 30 fps with no 60 fps mode. PS5, PS5 Pro and Series X render at 1440p; the Pro adds ray traced shadows and holds 30 fps best, while the base PS5 can dip to about 23 fps in heavy explosions and Series S renders at 720p.',
    url: 'https://www.gtaboom.com/digital-foundry-finds-that-gta-6-indeed-runs-best-on-ps5-pro-b72f',
    source: 'GTA BOOM on Digital Foundry',
    date: 'November 2026',
  },
  {
    title: 'Take-Two: GTA 6 development is complete and preorders are far above plan',
    snippet: 'On its November 9 earnings call, ten days before launch, Take-Two said Rockstar has finished GTA 6, preloads are rolling out and preorders are tracking far above its own expectations. It gave no preorder figure and no PC news.',
    url: 'https://www.fool.com/earnings/call-transcripts/2026/11/10/take-two-ttwo-q2-2027-earnings-call-transcript/',
    source: 'Take-Two earnings call',
    date: 'November 2026',
  },
  {
    title: 'GTA 6 preload opens November 10 and needs up to 212 GB',
    snippet: 'Rockstar moved digital preloading forward two days to November 10. PS5 preloads start at midnight local time and Xbox at 12:00 a.m. GMT. The download is up to 212 GB, and boxed copies with a code reach shops on November 12.',
    url: 'https://www.rockstargames.com/newswire/article/k4ak9okk485712/grand-theft-auto-vi-pre-load-begins-on-november-10',
    source: 'Rockstar Newswire',
    date: 'November 2026',
  },
  {
    title: 'Rockstar releases the GTA 6 launch trailer',
    snippet: 'The launch trailer arrived on October 15, 2026, five weeks before release, with new music from Justice.',
    url: 'https://www.rockstargames.com/VI/launch-trailer',
    source: 'Rockstar Games',
    date: 'October 2026',
  },
  {
    title: 'Take-Two repeats the November 19, 2026 date on its August earnings call',
    snippet: 'Take-Two kept GTA 6 on track for November 19, 2026 on PS5 and Xbox Series X|S. It described preorder demand as very strong but did not publish a figure.',
    url: 'https://www.techradar.com/gaming/gta-6-is-locked-in-for-november-19-2026-according-to-take-two-interactive-despite-delay-rumors-and-marketing-starts-soon',
    source: 'TechRadar',
    date: 'August 2026',
  },
  {
    title: 'GTA 6 preorders open with Standard and Ultimate editions',
    snippet: 'Preorders opened on June 25, 2026: Standard Edition $79.99, Ultimate Edition $99.99 in the US. Boxed copies contain a download code.',
    url: 'https://www.rockstargames.com/newswire/article/517oa135328155/grand-theft-auto-vi-pre-orders-begin-on-june-25',
    source: 'Rockstar Newswire',
    date: 'June 2026',
  },
  {
    title: 'GTA 6 moves to November 19, 2026',
    snippet: 'Rockstar moved the release from May 26, 2026 to November 19, 2026, saying it needed the extra time to finish the game to the standard players expect.',
    url: 'https://www.techradar.com/gaming/grand-theft-auto-6-delayed-again-but-itll-still-ship-in-2026',
    source: 'TechRadar',
    date: 'November 2025',
  },
  {
    title: 'Trailer 2 passes 475 million views in a day',
    snippet: 'Rockstar says the second trailer, released on May 6, 2025, reached more than 475 million views across all platforms in its first 24 hours.',
    url: 'https://www.videogameschronicle.com/news/at-nearly-half-a-billion-views-rockstar-says-gta-6s-new-trailer-is-the-biggest-video-launch-of-all-time',
    source: 'Video Games Chronicle',
    date: 'May 2025',
  },
];

export async function GET() {
  return NextResponse.json(
    { news: NEWS },
    { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } }
  );
}
