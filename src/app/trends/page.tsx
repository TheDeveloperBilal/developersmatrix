import { Metadata } from "next";
import { siteConfig } from "@/data/config";
import { OrganizationSchema } from "@/components/seo/SchemaMarkup";
import { TrendRadarClient } from "@/components/trends/TrendRadarClient";

export const metadata: Metadata = {
  title: "Trend Radar 2026 - Tech Trends, AI Insights & Future Technology",
  description: "Your daily source for trending tech topics, AI insights, career opportunities, and future technology. Updated every 24 hours with fresh, SEO-optimized content on AI tools, gaming, cybersecurity, and more.",
  keywords: [
    "tech trends 2026",
    "AI trends",
    "future technology",
    "tech news daily",
    "AI tools",
    "cybersecurity trends",
    "programming trends",
    "career growth tech",
    "gaming technology",
    "Web3 trends",
    "quantum computing",
    "AI agents",
    "make money online AI",
    "green technology"
  ],
  openGraph: {
    title: "Trend Radar 2026 - Daily Tech Trends & Insights | DevelopersMatrix",
    description: "Stay ahead with daily tech trends, AI insights, and future technology. Your personalized radar for what's trending in tech.",
    url: `${siteConfig.url}/trends`,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Trend Radar - DevelopersMatrix"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Trend Radar 2026 - Daily Tech Trends & AI Insights",
    description: "Your daily source for trending tech topics, AI insights, and future technology. Updated every 24 hours.",
  },
  alternates: {
    canonical: `${siteConfig.url}/trends`,
  },
};

export default function TrendsPage() {
  return (
    <>
      <OrganizationSchema
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
      />
      
      <TrendRadarClient />
    </>
  );
}
