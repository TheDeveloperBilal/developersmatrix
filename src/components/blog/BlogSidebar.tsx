'use client';

import Link from 'next/link';
import { Rss, ArrowRight, TrendingUp, Tag, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BlogPost } from '@/types';
import { blogCategories, getRecentBlogPosts } from '@/data/blog';

interface BlogSidebarProps {
  currentSlug?: string;
  className?: string;
}

export function BlogSidebar({ currentSlug, className }: BlogSidebarProps) {
  const recentPosts = getRecentBlogPosts(4).filter(p => p.slug !== currentSlug).slice(0, 3);

  // Popular tags based on actual data
  const popularTags = [
    'AI', 'Career', 'Productivity', 'JavaScript', 'Startup',
    'Finance', 'Remote Work', 'Skills', 'Gaming', 'Technology',
    'SEO', 'Interview', 'Resume', 'Next.js', 'React'
  ];

  return (
    <aside className={`space-y-6 ${className || ''}`}>
      {/* Newsletter Card */}
      <NewsletterCard />

      {/* Related / Recent Posts */}
      {recentPosts.length > 0 && (
        <Card className="border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-violet-500" />
              Recent Articles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPosts.map((post, index) => (
              <div key={post.id}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <p className="font-medium text-sm group-hover:text-violet-600 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{post.readTime} min read</span>
                    <span>•</span>
                    <span>{post.category}</span>
                  </div>
                </Link>
                {index < recentPosts.length - 1 && (
                  <Separator className="mt-3" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Categories */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-500" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {blogCategories.map((category) => {
              return (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors group text-sm"
                >
                  <span className="text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {category}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Popular Tags */}
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-500" />
            Popular Topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag} href={`/blog?q=${encodeURIComponent(tag)}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:text-violet-300 dark:hover:border-violet-800 transition-all text-xs font-normal"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA Card */}
      <Card className="border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-violet-600 to-purple-700 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <CardContent className="p-5 relative">
          <h3 className="font-bold text-lg mb-2">Website Audit Tool</h3>
          <p className="text-sm text-violet-100 mb-4 leading-relaxed">
            Check your site&apos;s SEO, speed, and mobile performance in 60 seconds.
          </p>
          <Link href="/tools/website-audit">
            <Button
              variant="secondary"
              size="sm"
              className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold"
            >
              Run Free Audit
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </aside>
  );
}

export function NewsletterCard({ className }: { className?: string }) {
  return (
    <Card className={`border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/40 dark:to-purple-950/30 border border-violet-100/50 dark:border-violet-800/20 ${className || ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Rss className="w-4 h-4 text-violet-500" />
          Weekly Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Get curated articles on tech careers, AI tools, and productivity hacks — delivered every Tuesday.
        </p>
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            className="bg-background/80 backdrop-blur-sm border-violet-200/50 dark:border-violet-800/30 min-h-[44px]"
          />
          <Button
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium min-h-[44px]"
          >
            Subscribe Free
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground/70 text-center">
          No spam. Unsubscribe anytime. Join 12,000+ developers.
        </p>
      </CardContent>
    </Card>
  );
}
