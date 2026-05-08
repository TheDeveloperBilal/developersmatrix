import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/data/config";
import BlogClient from "./BlogClient";

export const metadata: Metadata = generatePageMetadata(pageMetadata.blog);

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
