import { Metadata } from "next";
import { siteConfig } from "@/data/config";
import { OrganizationSchema, WebApplicationSchema } from "@/components/seo/SchemaMarkup";
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
  title: "20+ Free AI Tools for Resumes, Budgets & Career Growth | DevelopersMatrix",
  description: "Discover 20+ free AI-powered tools for resume building, budget planning, interview preparation, and more. Read latest tech trends. No signup needed.",
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
    title: "DevelopersMatrix - 20+ Free AI Tools for Everyone",
    description: "Discover 20+ free AI-powered tools for resume building, budget planning, interview preparation, and more. Read latest tech trends.",
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
    title: 'DevelopersMatrix - 20+ Free AI Tools for Everyone',
    description: 'Discover free AI-powered tools for resume building, budget planning, interview prep, and more.',
    images: [siteConfig.ogImage],
    creator: '@developersmatrix',
  },
};

export default function HomePage() {
  return (
    <>
      <OrganizationSchema
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
      />
      <WebApplicationSchema
        name={siteConfig.name}
        description={siteConfig.description}
        url={siteConfig.url}
        applicationCategory="BusinessApplication"
        operatingSystem="Web"
        offers={{ price: "0", priceCurrency: "USD" }}
      />

      <LiveTicker />
      <HeroDiscovery />
      <FeaturedGrid />
      <ToolExplorer />
      <TrendingNow />
      <ExploreByGoal />
      <ArticlesCarousel />
      <ToolStack />
      <LatestUpdates />
      <Newsletter />
      <FinalCta />
    </>
  );
}
