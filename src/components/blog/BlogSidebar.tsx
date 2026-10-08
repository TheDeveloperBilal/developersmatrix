'use client';

import Link from 'next/link';
import { Rss, ArrowRight, TrendingUp, Tag, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BlogSummary } from '@/types';
import type { CategoryCount } from '@/data/blog-categories';

interface BlogSidebarProps {
  currentSlug?: string;
  className?: string;
  // Passed in from the server page. Reading the corpus here would pull every
  // article body into the client bundle of every blog post.
  recentPosts?: BlogSummary[];
  // Built on the server from the real posts, so empty categories never show.
  categories?: CategoryCount[];
  topics?: string[];
}

export function BlogSidebar({ currentSlug, className, recentPosts: recentPostsProp, categories = [], topics = [] }: BlogSidebarProps) {
  const recentPosts = (recentPostsProp ?? []).filter(p => p.slug !== currentSlug).slice(0, 3);

  const popularTags = topics;

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
      {categories.length > 0 && (
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Tag className="w-4 h-4 text-violet-500" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {categories.map(({ name: category, count }) => {
              return (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors group text-sm"
                >
                  <span className="text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {category} <span className="text-muted-foreground">({count})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-violet-500 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
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
      )}

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

// Was a "Weekly Newsletter" signup that sent nothing and claimed 12,000+ readers.
// Now it points to the real places we post updates.
const FOLLOW_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/developersmatrix/' },
  { name: 'Instagram', href: 'https://www.instagram.com/developermatrix/' },
  { name: 'Pinterest', href: 'https://www.pinterest.com/developersmatrix/' },
  { name: 'LinkedIn', href: 'https://linkedin.com/company/developersmatrix' },
];

export function NewsletterCard({ className }: { className?: string }) {
  return (
    <Card className={`border shadow-sm ${className || ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Rss className="w-4 h-4 text-violet-500" />
          Stay Updated
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground leading-relaxed">
          New guides, reports and tool updates are shared on our social pages.
        </p>
        <ul className="grid grid-cols-2 gap-2">
          {FOLLOW_LINKS.map((l) => (
            <li key={l.name}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[40px] items-center justify-center rounded-lg border text-sm font-medium transition-colors hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300"
              >
                {l.name}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">
          Questions? Email{' '}
          <a href="mailto:info@developersmatrix.com" className="text-violet-600 hover:underline dark:text-violet-400">
            info@developersmatrix.com
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
