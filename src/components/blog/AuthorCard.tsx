'use client';

import { User } from 'lucide-react';

interface AuthorCardProps {
  author: string;
  publishedAt: string;
  readTime: number;
  className?: string;
}

export function AuthorCard({ author, publishedAt, readTime, className }: AuthorCardProps) {
  const initials = author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className={`flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-950/30 dark:to-purple-950/20 border border-violet-100/50 dark:border-violet-800/30 ${className || ''}`}>
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md shadow-violet-500/20">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">
          Writer & Technologist at DevelopersMatrix
        </p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>
            {new Date(publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>
      </div>
    </div>
  );
}
