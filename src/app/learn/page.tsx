import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { siteConfig } from "@/data/config";
import LearnClient from "./LearnClient";

export const metadata: Metadata = {
  title: "Short Tech Lessons",
  description: "Ten short lessons on core developer topics such as REST API design, TypeScript, SQL and Docker. Each one takes about 15 to 20 minutes.",
  // Kept out of search until the lessons are rebuilt: ten lessons, no search
  // traffic, and the old copy promised a new lesson every day.
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${siteConfig.url}/learn`,
  },
  keywords: ["micro-learning", "daily lessons", "tech tutorials", "learn programming", "quick lessons"],
  openGraph: {
    title: "Short Tech Lessons | DevelopersMatrix",
    description: "Ten short lessons on core developer topics.",
    url: `${siteConfig.url}/learn`,
  },
};

export default function LearnPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Learn", url: `${siteConfig.url}/learn` }
        ]}
      />
      <LearnClient />
    </>
  );
}
