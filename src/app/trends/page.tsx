import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";
import { siteConfig } from "@/data/config";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/SchemaMarkup";
import TrendNewsroom, { type NewsroomTrend } from "@/components/trends/TrendNewsroom";
import { getTrendSummaries } from "@/data/trends-data";

export const metadata: Metadata = generatePageMetadata(pageMetadata.trends);

export default function TrendsPage() {
  // Only the fields the page shows, so the browser gets a small payload.
  const trends: NewsroomTrend[] = getTrendSummaries().map((t) => ({
    slug: t.slug,
    title: t.title,
    subtitle: t.subtitle,
    category: t.category,
    readTime: t.readTime,
    updatedAt: t.updatedAt || t.publishedAt,
    popularityScore: t.popularityScore,
    featured: t.featured,
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Trends", url: `${siteConfig.url}/trends` }
        ]}
      />
      <ItemListSchema
        name="DevelopersMatrix Trend Reports"
        description="Detailed reports on AI, careers, coding, gaming, security and the creator economy"
        itemListElement={trends.map((t) => ({ name: t.title, description: t.subtitle, url: `${siteConfig.url}/trends/${t.slug}` }))}
      />

      <TrendNewsroom trends={trends} />
    </>
  );
}
