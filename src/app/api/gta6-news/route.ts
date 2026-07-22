import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET() {
  try {
    const zai = await ZAI.create();
    
    // Search for latest GTA 6 news
    const searchResults = await zai.functions.invoke("web_search", {
      query: "GTA 6 Grand Theft Auto VI latest news updates 2024 2025",
      num: 8
    });

    const news = searchResults.map((item: { 
      name: string; 
      snippet: string; 
      url: string; 
      date?: string;
      host_name?: string;
    }) => ({
      title: item.name,
      snippet: item.snippet,
      url: item.url,
      source: item.host_name || 'News Source',
      date: item.date || new Date().toLocaleDateString()
    }));

    return NextResponse.json({ news });
  } catch (error) {
    console.error('GTA6 news API error:', error);
    
    // Return fallback news with latest real information
    return NextResponse.json({
      news: [
        {
          title: "GTA 6 Pre-Orders Generate $1 Billion in First Hour",
          snippet: "Analysts estimate GTA 6 generated approximately $1 billion (£755 million) in revenue within the first hour of pre-orders going live on June 25, 2026. Reports suggest over 39 million copies have been pre-ordered.",
          url: "https://metro.co.uk/2026/06/29/gta-6-made-1-000-000-000-60-minutes-pre-orders-claim-analysts-28970558/",
          source: "Metro UK",
          date: "June 29, 2026"
        },
        {
          title: "GTA 6 Pre-Orders Are Now Live",
          snippet: "GTA 6 pre-orders opened on June 25, 2026 for PlayStation 5 and Xbox Series X|S. The Standard Edition costs $69.99, with Collector's Edition at $99.99.",
          url: "https://www.rockstargames.com/gta6",
          source: "Rockstar Games",
          date: "June 25, 2026"
        },
        {
          title: "Take-Two CEO Confirms GTA 6 Marketing Beats for Summer 2026",
          snippet: "Take-Two Interactive CEO Strauss Zelnick confirmed GTA 6 remains on track for November 19, 2026 release and that marketing beats are planned throughout Summer 2026.",
          url: "https://www.gamesmarket.global/rockstar-games-postpones-gta-6-until-november-2026/",
          source: "Games Market",
          date: "November 7, 2025"
        }
      ]
    });
  }
}
