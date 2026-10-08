import { NextResponse } from 'next/server';

// Curated, sourced GTA 6 news for the /gta-6 hub.
// This used to call an AI web search SDK that does not run on Vercel, so every
// visitor got a hardcoded fallback with wrong prices. These items are checked
// against the original announcements. Add new items at the top when Rockstar or
// Take-Two announce something.
const NEWS = [
  {
    title: 'Take-Two repeats the November 19, 2026 date on its August earnings call',
    snippet: 'Take-Two kept GTA 6 on track for November 19, 2026 on PS5 and Xbox Series X|S. It described preorder demand as very strong but did not publish a figure.',
    url: 'https://www.techradar.com/gaming/gta-6-is-locked-in-for-november-19-2026-according-to-take-two-interactive-despite-delay-rumors-and-marketing-starts-soon',
    source: 'TechRadar',
    date: 'August 2026',
  },
  {
    title: 'GTA 6 preorders open with Standard and Ultimate editions',
    snippet: 'Preorders opened on June 25, 2026: Standard Edition $79.99, Ultimate Edition $99.99 in the US. Boxed copies contain a download code. Digital preloading starts November 12.',
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
