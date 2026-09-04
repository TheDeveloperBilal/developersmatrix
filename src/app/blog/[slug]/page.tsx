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
import { ArrowRight, Sparkles, FileText, Wrench, Briefcase, Code, Gamepad2, Wallet, Rocket, Mail, Link2, Search, CheckCircle } from "lucide-react";
import Link from "next/link";

// Topic-aware tool recommendations based on blog post tags
interface ToolRecommendation {
  slug: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

function getToolRecommendations(tags: string[]): ToolRecommendation[] {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (tagStr.includes('resume') || tagStr.includes('ats') || tagStr.includes('cv') || tagStr.includes('cover letter')) {
    return [
      { slug: '/tools/ai-resume-builder', name: 'AI Resume Builder', description: 'Create an ATS-friendly resume in minutes', icon: <FileText className="w-4 h-4" /> },
      { slug: '/tools/ai-cover-letter-generator', name: 'Cover Letter Generator', description: 'Generate tailored cover letters instantly', icon: <Mail className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('interview') || tagStr.includes('faang') || tagStr.includes('coding interview')) {
    return [
      { slug: '/tools/ai-interview-simulator', name: 'AI Interview Simulator', description: 'Practice tech interviews with AI feedback', icon: <Briefcase className="w-4 h-4" /> },
      { slug: '/tools/ai-resume-builder', name: 'AI Resume Builder', description: 'Build a resume that gets interviews', icon: <FileText className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('website') || tagStr.includes('seo') || tagStr.includes('audit') || tagStr.includes('performance')) {
    return [
      { slug: '/tools/website-audit', name: 'Free Website Audit', description: 'Check SEO, speed & security instantly', icon: <Search className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('salary') || tagStr.includes('compensation') || tagStr.includes('pay')) {
    return [
      { slug: '/tools/salary-estimator', name: 'Salary Estimator', description: 'Check tech salaries by role & city', icon: <Wallet className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('budget') || tagStr.includes('finance') || tagStr.includes('money') || tagStr.includes('income')) {
    return [
      { slug: '/tools/budget-planner', name: 'Budget Planner', description: 'Track income, expenses & savings goals', icon: <Wallet className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('productivity') || tagStr.includes('habit') || tagStr.includes('routine')) {
    return [
      { slug: '/tools/productivity-planner', name: 'Productivity Planner', description: 'AI task manager & daily schedule', icon: <CheckCircle className="w-4 h-4" /> },
      { slug: '/tools/habit-tracker', name: 'Habit Tracker', description: 'Build daily routines & track streaks', icon: <Sparkles className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('gaming') || tagStr.includes('gta') || tagStr.includes('pc game') || tagStr.includes('requirements')) {
    return [
      { slug: '/tools/can-you-run-it', name: 'Can You Run It?', description: 'Check PC game requirements free', icon: <Gamepad2 className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('startup') || tagStr.includes('business') || tagStr.includes('entrepreneur')) {
    return [
      { slug: '/tools/startup-idea-generator', name: 'Startup Idea Generator', description: 'AI business ideas by industry', icon: <Rocket className="w-4 h-4" /> },
      { slug: '/tools/budget-planner', name: 'Budget Planner', description: 'Plan your startup finances', icon: <Wallet className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('email') || tagStr.includes('outreach') || tagStr.includes('communication')) {
    return [
      { slug: '/tools/ai-email-assistant', name: 'AI Email Assistant', description: 'Write professional emails instantly', icon: <Mail className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('link') || tagStr.includes('bio') || tagStr.includes('url')) {
    return [
      { slug: '/tools/link-manager', name: 'Link Shortener', description: 'Branded links & bio pages free', icon: <Link2 className="w-4 h-4" /> },
    ];
  }
  
  if (tagStr.includes('content') || tagStr.includes('prompt') || tagStr.includes('chatgpt') || tagStr.includes('ai tool')) {
    return [
      { slug: '/tools/ai-prompt-library', name: 'AI Prompt Library', description: '500+ prompts for ChatGPT & Claude', icon: <Code className="w-4 h-4" /> },
      { slug: '/tools/ai-content-detector', name: 'AI Content Detector', description: 'Check text authenticity instantly', icon: <FileText className="w-4 h-4" /> },
    ];
  }
  
  // Default fallback
  return [
    { slug: '/tools/ai-content-detector', name: 'AI Content Detector', description: 'Check text authenticity instantly', icon: <FileText className="w-4 h-4" /> },
    { slug: '/tools/ai-prompt-library', name: 'AI Prompt Library', description: '500+ prompts for ChatGPT & Claude', icon: <Code className="w-4 h-4" /> },
  ];
}

function getMidArticleCTA(tags: string[]): { title: string; description: string; buttonText: string; href: string } {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (tagStr.includes('resume') || tagStr.includes('ats') || tagStr.includes('interview') || tagStr.includes('career') || tagStr.includes('job')) {
    return {
      title: 'Land Your Dream Job Faster',
      description: 'Build an ATS-optimized resume and practice interviews with our free AI tools.',
      buttonText: 'Start Your Career Toolkit →',
      href: '/tools/ai-resume-builder',
    };
  }
  
  if (tagStr.includes('website') || tagStr.includes('seo') || tagStr.includes('audit')) {
    return {
      title: 'Audit Your Website in 60 Seconds',
      description: 'Check SEO, speed, mobile UX, and security — completely free. Get actionable fixes.',
      buttonText: 'Run Free Audit →',
      href: '/tools/website-audit',
    };
  }
  
  if (tagStr.includes('gaming') || tagStr.includes('gta') || tagStr.includes('pc')) {
    return {
      title: 'Can Your PC Run the Latest Games?',
      description: 'Compare your specs against popular games including GTA 6. Get FPS estimates instantly.',
      buttonText: 'Check Your PC →',
      href: '/tools/can-you-run-it',
    };
  }
  
  if (tagStr.includes('startup') || tagStr.includes('business') || tagStr.includes('side hustle')) {
    return {
      title: 'Validate Your Business Idea in Seconds',
      description: 'Get AI-generated startup ideas with market analysis and MVP timelines.',
      buttonText: 'Generate Ideas →',
      href: '/tools/startup-idea-generator',
    };
  }
  
  if (tagStr.includes('budget') || tagStr.includes('finance') || tagStr.includes('salary')) {
    return {
      title: 'Plan Your Finances Smarter',
      description: 'Track income, expenses, and savings goals with our free budget planner.',
      buttonText: 'Start Budgeting →',
      href: '/tools/budget-planner',
    };
  }
  
  if (tagStr.includes('productivity') || tagStr.includes('habit')) {
    return {
      title: 'Build Better Habits & Routines',
      description: 'Track streaks, plan your day, and boost productivity with AI-powered tools.',
      buttonText: 'Start Tracking →',
      href: '/tools/productivity-planner',
    };
  }
  
  // Default
  return {
    title: 'Audit Your Website in 60 Seconds',
    description: 'Check SEO, speed, mobile UX, and security — completely free. Get actionable fixes to improve your rankings.',
    buttonText: 'Run Free Audit →',
    href: '/tools/website-audit',
  };
}

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
  const toolRecs = getToolRecommendations(post.tags);
  const midCTA = getMidArticleCTA(post.tags);

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

                {/* Top CTA - Topic-aware Tool Recommendations */}
                <div className="mb-8 p-5 rounded-xl border border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/80 to-purple-50/60 dark:from-violet-950/40 dark:to-purple-950/30">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-900/50 shrink-0">
                      <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground mb-1">Related tools for this topic</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        Use our free AI tools to apply what you just read — no signup required.
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {toolRecs.map((tool, i) => (
                          <span key={tool.slug} className="inline-flex items-center gap-1">
                            <Link href={tool.slug} className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                              {tool.icon}
                              {tool.name}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            {i < toolRecs.length - 1 && <span className="text-muted-foreground hidden sm:inline">·</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <BlogContent content={post.content} />

                {/* Mid-article CTA - Topic-aware */}
                <div className="my-10">
                  <CTABanner
                    title={midCTA.title}
                    description={midCTA.description}
                    buttonText={midCTA.buttonText}
                    href={midCTA.href}
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
