import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getRecentBlogPosts, getAllBlogSlugs } from "@/data/blog";
import { siteConfig } from "@/data/config";
import { ArticleSchema, BreadcrumbSchema, FAQSchema } from "@/components/seo/SchemaMarkup";

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
import { ArrowRight, Sparkles, FileText, Wrench } from "lucide-react";
import Link from "next/link";

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
      canonical: post.canonicalUrl || `${siteConfig.url}/blog/${post.slug}`,
    },
    robots: post.noindex
      ? { index: false, follow: true }
      : undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.image ? [`${siteConfig.url}${post.image}`] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [`${siteConfig.url}${post.image}`] : undefined,
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
        dateModified={post.dateModified || post.publishedAt}
        url={postUrl}
        image={`${siteConfig.url}${post.image}`}
        wordCount={post.content.split(/\s+/).length}
        articleSection={post.category}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: post.title, url: postUrl }
        ]}
      />
      {post.faqs && post.faqs.length > 0 && (
        <FAQSchema faqs={post.faqs} />
      )}

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
            dateModified={post.dateModified}
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

                {/* Top CTA - Tool Recommendation */}
                <div className="mb-8 p-5 rounded-xl border border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/80 to-purple-50/60 dark:from-violet-950/40 dark:to-purple-950/30">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-900/50 shrink-0">
                      <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground mb-1">Want to improve your content quality?</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use our AI tools to create better content, optimize your strategy, and grow faster.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Link href="/tools/ai-content-detector" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                          <FileText className="w-4 h-4" />
                          AI Content Detector
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <span className="text-muted-foreground">·</span>
                        <Link href="/tools/ai-prompt-library" className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                          <Wrench className="w-4 h-4" />
                          AI Prompt Library
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <BlogContent content={post.content} />

                {/* Mid-article CTA */}
                <div className="my-10">
                  <CTABanner
                    title="Audit Your Website in 60 Seconds"
                    description="Check SEO, speed, mobile UX, and security — completely free. Get actionable fixes to improve your rankings."
                    buttonText="Run Free Audit →"
                    href="/tools/website-audit"
                    variant="accent"
                  />
                </div>

                <AuthorCard
                  author={post.author}
                  publishedAt={post.publishedAt}
                  readTime={post.readTime}
                />

                {/* Bottom CTA - Related Tools */}
                <div className="mt-8 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/40 dark:to-teal-950/30">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 shrink-0">
                      <Wrench className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground mb-1">Explore more tools</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Discover 20+ free AI tools to boost your productivity, career, and content creation.
                      </p>
                      <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                        Browse All Tools
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
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
