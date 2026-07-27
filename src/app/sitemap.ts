import { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { tools } from '@/data/tools';
import { getIndexableTrends, getIndexableTrendSlugs } from '@/data/trends-data';
import { siteConfig } from '@/data/config';

// Stable dates reflecting actual last meaningful updates — NOT regenerated per build
const DATES = {
  // Pages actively updated during July 2026 SEO sprint
  recent: new Date('2026-07-24'),
  // Pages updated during May 2026 content push
  may2026: new Date('2026-05-25'),
  // Stable pages rarely changed
  stable: new Date('2026-01-01'),
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static pages — each with a date reflecting actual last meaningful update
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: DATES.recent,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: DATES.stable,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: DATES.recent,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: DATES.recent,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/connect`,
      lastModified: DATES.stable,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: DATES.stable,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: DATES.stable,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/gta-6`,
      lastModified: DATES.recent,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: DATES.recent,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/trends`,
      lastModified: DATES.recent,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: DATES.recent,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: DATES.stable,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/research/website-audit-statistics-2026`,
      lastModified: DATES.may2026,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/research/developer-salary-guide-2026`,
      lastModified: DATES.may2026,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/research/ats-resume-optimization-guide-2026`,
      lastModified: DATES.may2026,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/research/developer-habits-productivity-guide-2026`,
      lastModified: DATES.may2026,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/research/developer-financial-planning-guide-2026`,
      lastModified: DATES.may2026,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
  ];

  // Blog pages — use real content dates
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified || post.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Tool pages — use stable recent date (all reviewed during July 2026 SEO sprint)
  const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: `${baseUrl}${tool.path}`,
    lastModified: DATES.recent,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Trend pages — ONLY indexable trends, using their actual updatedAt dates
  const indexableTrends = getIndexableTrends();
  const trendPages: MetadataRoute.Sitemap = indexableTrends.map((trend) => ({
    url: `${baseUrl}/trends/${trend.slug}`,
    lastModified: new Date(trend.updatedAt || trend.publishedAt),
    changeFrequency: 'weekly' as const,
    priority: trend.featured ? 0.75 : 0.7,
  }));

  return [...staticPages, ...blogPages, ...toolPages, ...trendPages];
}
