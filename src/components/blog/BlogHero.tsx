'use client';

import Link from 'next/link';
import { Clock, User, Calendar, ChevronRight, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SocialShare } from './SocialShare';

interface BlogHeroProps {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt: string;
  dateModified?: string;
  readTime: number;
  image?: string;
  url: string;
}

export function BlogHero({
  title,
  excerpt,
  category,
  tags,
  author,
  publishedAt,
  dateModified,
  readTime,
  image,
  url
}: BlogHeroProps) {
  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5 hidden sm:block" />
        <span className="text-foreground font-medium hidden sm:inline-block max-w-[200px] truncate" title={title}>
          {title}
        </span>
      </nav>

      {/* Featured Image - Full Width */}
      {image && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[21/9] md:aspect-[2.4/1] rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-violet-500/10 to-purple-600/10 shadow-lg shadow-violet-500/5">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      )}

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge className="bg-violet-600 hover:bg-violet-700 text-white font-medium">
          {category}
        </Badge>
        {tags.slice(0, 4).map(tag => (
          <Badge key={tag} variant="outline" className="text-xs font-normal">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-[1.15]">
        {title}
      </h1>

      {/* Summary / Excerpt */}
      <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-6 max-w-3xl">
        {excerpt}
      </p>

      {/* Author + Meta Row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground mb-8 pb-8 border-b">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            {author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-medium text-foreground">{author}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          {dateModified && dateModified !== publishedAt && (
            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
              Updated {new Date(dateModified).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{readTime} min read</span>
        </div>
      </div>

      {/* Social Share */}
      <SocialShare title={title} url={url} className="mb-2" />
    </div>
  );
}
