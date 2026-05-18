import { Metadata } from "next";
import { siteConfig } from "@/data/config";
import { OrganizationSchema, WebApplicationSchema } from "@/components/seo/SchemaMarkup";
import { HorizontalAd, InContentAd } from "@/components/ads/AdBanner";
import { SEOContentSection } from "@/components/home/SEOContentSection";
import { 
  HeroSection, 
  CategoriesSection, 
  FeaturedToolsSection, 
  WebsiteAuditSection,
  TrendingSection, 
  DashboardSection, 
  BlogSection, 
  GTA6Section, 
  CTASection 
} from "@/components/home";

export const metadata: Metadata = {
  title: "DevelopersMatrix - 20+ Free AI Tools for Career, Finance, Productivity & Gaming News 2026",
  description: "Discover 20+ free AI-powered tools for resume building, budget planning, interview prep, website audits, and more. Read latest tech trends, career insights, and GTA 6 news. No signup required.",
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

      {/* Hero Section */}
      <HeroSection />

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HorizontalAd />
      </div>

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured AI Tools Section */}
      <FeaturedToolsSection />

      {/* Website Audit Section */}
      <WebsiteAuditSection />

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <InContentAd />
      </div>

      {/* Trending Section */}
      <TrendingSection />

      {/* Daily Dashboard Section */}
      <DashboardSection />

      {/* Ad Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HorizontalAd />
      </div>

      {/* GTA 6 Featured Section */}
      <GTA6Section />

      {/* Blog Preview Section */}
      <BlogSection />

      {/* CTA Section */}
      <CTASection />

      {/* SEO Content Section */}
      <SEOContentSection />

      {/* Footer Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HorizontalAd />
      </div>
    </>
  );
}
