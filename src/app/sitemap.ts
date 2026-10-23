import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { tools } from '@/data/tools';
import { getIndexableTrends } from '@/data/trends-data';
import { siteConfig } from '@/data/config';
import { gamesDatabase } from '@/data/games-database';

// ---------------------------------------------------------------------------
// Last meaningful content update for every page that has no date of its own.
// Blog posts and trend pages carry their own dateModified / updatedAt.
//
// Change a date here only when the words, data or features on that page
// change. Layout, styling and bug fixes do not count. Google trusts lastmod
// only while it stays accurate, and the IndexNow job submits every URL whose
// lastmod changes after a production deploy.
// ---------------------------------------------------------------------------
const PAGE_DATES: Record<string, string> = {
  '/': '2026-10-15',
  '/about': '2026-10-09',
  '/connect': '2026-10-15',
  '/contact': '2026-10-13',
  '/cookies': '2026-10-08',
  '/privacy': '2026-10-08',
  '/terms': '2026-10-08',
  '/gta-6': '2026-10-08',
  '/trends': '2026-10-15',
  '/tools': '2026-10-13',
  '/services/website-audit': '2026-10-15',

  '/tools/website-audit': '2026-10-23',
  '/tools/ai-content-detector': '2026-09-29',
  '/tools/ai-resume-builder': '2026-10-05',
  '/tools/ai-cover-letter-generator': '2026-10-02',
  '/tools/ai-interview-simulator': '2026-10-09',
  '/tools/budget-planner': '2026-10-07',
  '/tools/habit-tracker': '2026-10-07',
  '/tools/productivity-planner': '2026-10-07',
  '/tools/salary-estimator': '2026-10-06',
  '/tools/startup-idea-generator': '2026-10-07',
  '/tools/ai-email-assistant': '2026-10-07',
  '/tools/ai-prompt-library': '2026-10-06',
  '/tools/can-you-run-it': '2026-10-14',
};

// Every /tools/can-you-run-it/[game] page shares one template and one data file.
const GAME_PAGES_DATE = '2026-10-23';

// Used only if a page is added without a date above, so it never gets a fake "today".
const FALLBACK_DATE = '2026-07-24';

const dateFor = (path: string) => new Date(PAGE_DATES[path] ?? FALLBACK_DATE);
const newest = (dates: Date[]) => new Date(Math.max(...dates.map((d) => d.getTime())));

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Blog posts: real content dates, noindex posts excluded
  const posts = blogPosts.filter((post) => !post.noindex);
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Trend pages: only indexable trends, with their own updatedAt dates
  const trends = getIndexableTrends();
  const trendPages: MetadataRoute.Sitemap = trends.map((trend) => ({
    url: `${baseUrl}/trends/${trend.slug}`,
    lastModified: new Date(trend.updatedAt || trend.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: trend.featured ? 0.75 : 0.7,
  }));

  // The blog index changes whenever a post does
  const blogIndexDate = newest(blogPages.map((p) => p.lastModified as Date));
  // The trends index changes with its own layout or with any trend page
  const trendsIndexDate = newest([dateFor('/trends'), ...trendPages.map((p) => p.lastModified as Date)]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: dateFor('/'), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: dateFor('/about'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: blogIndexDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/connect`, lastModified: dateFor('/connect'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: dateFor('/contact'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/cookies`, lastModified: dateFor('/cookies'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/gta-6`, lastModified: dateFor('/gta-6'), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/trends`, lastModified: trendsIndexDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/tools`, lastModified: dateFor('/tools'), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: dateFor('/privacy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: dateFor('/terms'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: dateFor(tool.path),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Tool pages that are live but not listed in src/data/tools.ts.
  // Without these entries they never reach the sitemap even though they are
  // linked internally. Move them into tools.ts if they are ever added there.
  const unlistedToolPages: MetadataRoute.Sitemap = ['/tools/website-audit', '/tools/ai-content-detector']
    .filter((path) => !toolPages.some((page) => page.url === `${baseUrl}${path}`))
    .map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: dateFor(path),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  // Service pages
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/website-audit`,
      lastModified: dateFor('/services/website-audit'),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
  ];

  // Game requirement pages under the Can You Run It tool
  const gamePages: MetadataRoute.Sitemap = gamesDatabase.map((game) => ({
    url: `${baseUrl}/tools/can-you-run-it/${game.id}`,
    lastModified: new Date(GAME_PAGES_DATE),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...toolPages, ...unlistedToolPages, ...servicePages, ...trendPages, ...gamePages];
}
