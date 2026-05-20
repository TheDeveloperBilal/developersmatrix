'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, Copy, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const headings = content.match(/^#{2,3}\s+.+$/gm) || [];
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/^#{2,3}/)?.[0].length || 2;
      const text = heading.replace(/^#{2,3}\s+/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 60) || `heading-${index}`;
      return { id: `${id}-${index}`, text, level };
    });
    setItems(tocItems);
  }, [content]);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: [0, 0.5, 1] }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  const handleCopyLink = useCallback(async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  if (items.length === 0) return null;

  return (
    <nav className={cn('space-y-1', className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Table of Contents
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="group relative"
          >
            <button
              onClick={() => handleClick(item.id)}
              className={cn(
                'w-full text-left text-sm transition-colors duration-150 rounded-md px-2 py-1.5 flex items-center gap-1.5',
                item.level === 3 && 'pl-5',
                activeId === item.id
                  ? 'text-violet-600 font-medium bg-violet-50 dark:bg-violet-950/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <ChevronRight
                className={cn(
                  'w-3 h-3 shrink-0 transition-transform duration-150',
                  activeId === item.id ? 'text-violet-500 rotate-90' : 'opacity-0 group-hover:opacity-50'
                )}
              />
              <span className="line-clamp-2">{item.text}</span>
            </button>
            <button
              onClick={(e) => handleCopyLink(item.id, e)}
              className={cn(
                'absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md',
                'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
              title="Copy link to heading"
            >
              {copiedId === item.id ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Link className="w-3 h-3" />
              )}
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
}

export function TableOfContentsDrawer({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<TOCItem[]>([]);

  useEffect(() => {
    const headings = content.match(/^#{2,3}\s+.+$/gm) || [];
    const tocItems = headings.map((heading, index) => {
      const level = heading.match(/^#{2,3}/)?.[0].length || 2;
      const text = heading.replace(/^#{2,3}\s+/, '');
      const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 60) || `heading-${index}`;
      return { id: `${id}-${index}`, text, level };
    });
    setItems(tocItems);
  }, [content]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:bg-violet-700 transition-colors md:hidden"
        aria-label="Table of contents"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-20 right-4 left-4 bg-background rounded-xl shadow-2xl border p-4 max-h-[60vh] overflow-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Table of Contents</p>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className={cn(
                    'w-full text-left text-sm transition-colors rounded-md px-2 py-2',
                    item.level === 3 && 'pl-5 text-muted-foreground',
                    'text-foreground hover:bg-muted'
                  )}
                >
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
