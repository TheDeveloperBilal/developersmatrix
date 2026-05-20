'use client';

import { useCallback, useState } from 'react';
import { Twitter, Linkedin, Facebook, Link2, Check, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SocialShareProps {
  title: string;
  url: string;
  className?: string;
}

export function SocialShare({ title, url, className }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-muted-foreground mr-1">Share:</span>
      <Button
        variant="outline"
        size="sm"
        className="min-h-[40px] gap-1.5 text-sm hover:bg-sky-500/10 hover:text-sky-600 hover:border-sky-500/30 transition-colors"
        onClick={() => window.open(shareUrls.twitter, '_blank', 'width=600,height=400')}
      >
        <Twitter className="w-4 h-4" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="min-h-[40px] gap-1.5 text-sm hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/30 transition-colors"
        onClick={() => window.open(shareUrls.linkedin, '_blank', 'width=600,height=400')}
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="min-h-[40px] gap-1.5 text-sm hover:bg-indigo-500/10 hover:text-indigo-600 hover:border-indigo-500/30 transition-colors"
        onClick={() => window.open(shareUrls.facebook, '_blank', 'width=600,height=400')}
      >
        <Facebook className="w-4 h-4" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="min-h-[40px] gap-1.5 text-sm hover:bg-violet-500/10 hover:text-violet-600 hover:border-violet-500/30 transition-colors"
        onClick={handleCopy}
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Link'}</span>
      </Button>
    </div>
  );
}

export function FloatingSocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  };

  return (
    <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-2">
      <div className="flex flex-col gap-2 p-2 rounded-xl bg-background/80 backdrop-blur-md border shadow-sm">
        <button
          onClick={() => window.open(shareUrls.twitter, '_blank', 'width=600,height=400')}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-sky-500 hover:bg-sky-500/10 transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.open(shareUrls.linkedin, '_blank', 'width=600,height=400')}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-4 h-4" />
        </button>
        <button
          onClick={handleCopy}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-violet-600 hover:bg-violet-500/10 transition-colors"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
