import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRecentBlogPosts, getAllBlogSlugs } from "@/data/blog";
import { siteConfig } from "@/data/config";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogContent } from "@/components/blog/BlogContent";
import { TableOfContents, TableOfContentsDrawer } from "@/components/blog/TableOfContents";
import { FloatingSocialShare } from "@/components/blog/SocialShare";
import { AuthorCard } from "@/components/blog/AuthorCard";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { NewsletterCard } from "@/components/blog/BlogSidebar";
import { CTABanner } from "@/components/blog/CTABanner";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `${siteConfig.url}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRecentBlogPosts(6).filter(p => p.id !== post.id).slice(0, 3);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  return (
    <>
      <ArticleSchema
        headline={post.title}
        description={post.excerpt}
        author={post.author}
        datePublished={post.publishedAt}
        url={postUrl}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: post.title, url: postUrl }
        ]}
      />

      <ReadingProgress />
      <FloatingSocialShare title={post.title} url={postUrl} />

      <article className="min-h-screen bg-background">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <BlogHero
            title={post.title}
            excerpt={post.excerpt}
            category={post.category}
            tags={post.tags}
            author={post.author}
            publishedAt={post.publishedAt}
            readTime={post.readTime}
            image={post.image}
            url={postUrl}
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Article */}
            <div className="lg:col-span-8 xl:col-span-8">
              <div className="max-w-[780px]">
                <BlogContent content={post.content} />

                {/* Mid-article CTA */}
                <CTABanner
                  title="Audit Your Website in 60 Seconds"
                  description="Check SEO, speed, mobile UX, and security — completely free."
                  buttonText="Run Free Audit"
                  href="/tools/website-audit"
                />

                <AuthorCard
                  author={post.author}
                  publishedAt={post.publishedAt}
                  readTime={post.readTime}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-4">
              <div className="sticky top-24 space-y-6">
                <TableOfContents content={post.content} />
                <BlogSidebar currentSlug={post.slug} />
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-16 pt-12 border-t">
            <RelatedPosts posts={relatedPosts} />
          </div>

          {/* Newsletter */}
          <div className="mt-16 max-w-xl mx-auto">
            <NewsletterCard />
          </div>
        </div>

        {/* Mobile TOC Drawer */}
        <TableOfContentsDrawer content={post.content} />
      </article>
    </>
  );
}
