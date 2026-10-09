import { Metadata } from "next";
import { siteConfig } from "@/data/config";
import { articles, guideCount, newestGuides } from "@/lib/home-articles";
import { getIndexableTrends, getTrendBySlug, trendCategories } from "@/data/trends-data";
import { TOOLS_LABEL, featuredTrendPicks, homeFaqs, toolUpdates, type TrendCard, type UpdateItem } from "@/lib/home-data";
import { WebApplicationSchema, FAQSchema } from "@/components/seo/SchemaMarkup";
import SeoContentSection from "@/components/sections/seo-content-section";
import LiveTicker from "@/components/sections/live-ticker";
import HeroDiscovery from "@/components/sections/hero-discovery";
import FeaturedGrid from "@/components/sections/featured-grid";
import ToolExplorer from "@/components/sections/tool-explorer";
import TrendingNow from "@/components/sections/trending-now";
import ExploreByGoal from "@/components/sections/explore-by-goal";
import ArticlesCarousel from "@/components/sections/articles-carousel";
import ToolStack from "@/components/sections/tool-stack";
import LatestUpdates from "@/components/sections/latest-updates";
import { Newsletter, FinalCta } from "@/components/sections/newsletter-cta";

export const metadata: Metadata = {
  title: "Free AI Tools, Resources & Trends | DevelopersMatrix",
  description: "Free AI tools for developers, marketers, and career builders. Cover letter generator, website auditor, interview simulator, and 20+ more. No signup needed.",
  keywords: [
    "free AI tools",
    "AI resume builder",
    "free resume maker",
    "cover letter generator",
    "interview preparation",
    "FAANG interview preparation roadmap 2026",
    "salary estimator",
    "budget planner",
    "expense tracker",
    "career tools",
    "productivity tools",
    "free finance tools",
    "job search tools",
    "GTA 6 release date november 19 2026",
    "tech trends 2026",
    "AI content detector",
    "website audit tool",
    "audit website",
    "audit a website",
    "habit tracker",
    "personal finance",
    "money management",
    "startup ideas"
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Free AI Tools, Resources & Trends | DevelopersMatrix",
    description: "Free AI tools for developers, marketers, and career builders. Cover letter generator, website auditor, interview simulator, and 20+ more. No signup needed.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "DevelopersMatrix - Free AI Tools Platform"
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Tools, Resources & Trends | DevelopersMatrix',
    description: 'Free AI tools for developers, marketers, and career builders. Cover letter generator, website auditor, interview simulator, and 20+ more. No signup needed.',
    images: [siteConfig.ogImage],
    creator: '@developersmatrix',
  },
};

const fmt = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

const categoryName = (id: string) => trendCategories.find((c) => c.id === id)?.name ?? id;

// Short labels for cards, so category names fit on one line.
const SHORT_CATEGORY: Record<string, string> = {
  "make-money": "Make money",
  "ai-agents": "AI agents",
  "ai-tools": "AI tools",
  gaming: "Gaming",
  cybersecurity: "Security",
  coding: "Coding",
  "social-media": "Social media",
  "future-tech": "Future tech",
  "green-tech": "Green tech",
  "career-growth": "Careers",
};
const shortCategory = (id: string) => SHORT_CATEGORY[id] ?? categoryName(id);

export default function HomePage() {
  // Every number and date on the homepage comes from the real data below.
  const trends = getIndexableTrends();
  const trendCount = trends.length;

  const trendCards: TrendCard[] = featuredTrendPicks.flatMap((pick) => {
    const t = getTrendBySlug(pick.slug);
    if (!t || t.noindex) return [];
    return [{
      title: t.title,
      href: `/trends/${t.slug}`,
      category: shortCategory(t.category),
      summary: pick.summary,
      updated: fmt(t.updatedAt),
      readTime: t.readTime,
      related: pick.related,
    }];
  });

  // Topic index: real counts per topic, each linking to that topic's newest report.
  const topics = Object.values(
    trends.reduce<Record<string, { label: string; count: number; href: string; updatedAt: string }>>((acc, t) => {
      const cur = acc[t.category];
      if (!cur) acc[t.category] = { label: shortCategory(t.category), count: 1, href: `/trends/${t.slug}`, updatedAt: t.updatedAt };
      else {
        cur.count += 1;
        if (+new Date(t.updatedAt) > +new Date(cur.updatedAt)) {
          cur.href = `/trends/${t.slug}`;
          cur.updatedAt = t.updatedAt;
        }
      }
      return acc;
    }, {})
  )
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .map(({ label, count, href }) => ({ label, count, href }));

  const updates: (UpdateItem & { shown: string })[] = [
    ...toolUpdates,
    ...newestGuides(4).map((g) => ({ kind: "New" as const, title: `Guide: ${g.title}`, meta: `Blog · ${g.category}`, href: g.href, date: g.date })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .map((u) => ({ ...u, shown: fmt(u.date) }));

  return (
    <>
      {/* Organization schema comes from the root layout (one entity, one @id). */}
      <WebApplicationSchema
        name={siteConfig.name}
        description={siteConfig.description}
        url={siteConfig.url}
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        offers={{ price: "0", priceCurrency: "USD" }}
      />
      <FAQSchema faqs={homeFaqs} />

      <LiveTicker />
      <HeroDiscovery toolsLabel={TOOLS_LABEL} guideCount={guideCount} trendCount={trendCount} />
      <FeaturedGrid />
      <ToolExplorer />
      <TrendingNow cards={trendCards} topics={topics} trendCount={trendCount} />
      <ExploreByGoal />
      <ArticlesCarousel articles={articles} />
      <ToolStack />
      <LatestUpdates items={updates} />
      <SeoContentSection />
      <Newsletter />
      <FinalCta />
    </>
  );
}
