'use client';

import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types';

interface RelatedPostsProps {
  posts: BlogPost[];
  className?: string;
}

export function RelatedPosts({ posts, className }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className={`${className || ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-sora), ui-sans-serif, system-ui, sans-serif' }}>
          Related Articles
        </h2>
        <Link
          href="/blog"
          className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className="h-full rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl border border-white/40 dark:border-white/[0.08] shadow-[0_1px_2px_rgba(20,26,38,0.04),0_8px_24px_-12px_rgba(20,26,38,0.12)] hover:shadow-[0_4px_12px_rgba(20,26,38,0.06),0_20px_48px_-16px_rgba(124,58,237,0.18)]">
              <div className="aspect-[16/10] relative overflow-hidden bg-gradient-to-br from-violet-100/50 to-purple-100/50 dark:from-violet-950/30 dark:to-purple-950/20">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-5">
                <Badge variant="secondary" className="mb-2.5 text-xs font-medium bg-violet-50/80 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border-0">
                  {post.category}
                </Badge>
                <h3 className="font-semibold text-[15px] leading-snug line-clamp-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors mb-3" style={{ fontFamily: 'var(--font-sora), ui-sans-serif, system-ui, sans-serif' }}>
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime} min read
                  </span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
