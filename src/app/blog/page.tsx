import { generatePageMetadata, pageMetadata } from '@/lib/seo/metadata';
import { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { getBlogSummaries } from "@/data/blog";
import { siteConfig } from "@/data/config";
import BlogClient from "./BlogClient";

export async function generateMetadata({ searchParams }: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const hasQueryParams = params && Object.keys(params).length > 0;

  const baseMetadata = generatePageMetadata(pageMetadata.blog);

  if (hasQueryParams) {
    return {
      ...baseMetadata,
      alternates: undefined,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return baseMetadata;
}

export default function BlogPage() {
  const posts = getBlogSummaries().filter((post) => !post.noindex);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` }
        ]}
      />
      <BlogClient initialPosts={posts} />

      {/* Server rendered index of every article.
          BlogClient paginates on the client, so without this only the first
          page of posts has a crawlable link. The rest were reachable from the
          sitemap alone, which is a much weaker signal. */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            All articles
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {posts.length} guides on AI tools, SEO, automation and developer careers.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <a
                  href={`/blog/${post.slug}`}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:underline"
                >
                  {post.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
