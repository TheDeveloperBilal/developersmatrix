import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/data/config";
import BlogClient from "./BlogClient";

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const hasQueryParams = params && Object.keys(params).length > 0;

  const baseMetadata = generatePageMetadata(pageMetadata.blog);

  if (hasQueryParams) {
    return {
      ...baseMetadata,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return baseMetadata;
}

export default function BlogPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` }
        ]}
      />
      <BlogClient initialPosts={blogPosts} />
    </>
  );
}
