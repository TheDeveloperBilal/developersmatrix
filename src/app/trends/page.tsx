import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";
import { siteConfig } from "@/data/config";
import { OrganizationSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { TrendRadarClient } from "@/components/trends/TrendRadarClient";
import { getTrendSummaries } from "@/data/trends-data";

export const metadata: Metadata = generatePageMetadata(pageMetadata.trends);

export default function TrendsPage() {
  return (
    <>
      <OrganizationSchema
        name={siteConfig.name}
        url={siteConfig.url}
        description={siteConfig.description}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Trends", url: `${siteConfig.url}/trends` }
        ]}
      />
      
      <TrendRadarClient trends={getTrendSummaries()} />
    </>
  );
}
