'use client';

import { useEffect, useRef } from 'react';
import { Link, Copy, Check, Quote, Info, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';

function HeadingWithCopy({ level, children, id }: { level: number; children: React.ReactNode; id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [id]);

  const baseClasses = 'group relative flex items-start gap-2 scroll-mt-24';
  const textClasses = {
    1: 'text-3xl font-bold mt-10 mb-5',
    2: 'text-2xl font-bold mt-10 mb-4',
    3: 'text-xl font-semibold mt-8 mb-3',
    4: 'text-lg font-semibold mt-6 mb-2'
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={cn(baseClasses, textClasses[level as keyof typeof textClasses] || textClasses[2])}>
      <span className="flex-1">{children}</span>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 mt-0.5"
        title="Copy link to heading"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link className="w-4 h-4" />}
      </button>
    </Tag>
  );
}

interface InfoBoxProps {
  type?: 'info' | 'warning' | 'tip' | 'success';
  children: React.ReactNode;
}

export function InfoBox({ type = 'info', children }: InfoBoxProps) {
  const styles = {
    info: {
      border: 'border-blue-200 dark:border-blue-800',
      bg: 'bg-blue-50/60 dark:bg-blue-950/30',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
      label: 'Note'
    },
    warning: {
      border: 'border-amber-200 dark:border-amber-800',
      bg: 'bg-amber-50/60 dark:bg-amber-950/30',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
      label: 'Warning'
    },
    tip: {
      border: 'border-violet-200 dark:border-violet-800',
      bg: 'bg-violet-50/60 dark:bg-violet-950/30',
      icon: <Lightbulb className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />,
      label: 'Quick Tip'
    },
    success: {
      border: 'border-emerald-200 dark:border-emerald-800',
      bg: 'bg-emerald-50/60 dark:bg-emerald-950/30',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
      label: 'Success'
    }
  };

  const style = styles[type];

  return (
    <div className={cn('rounded-xl border p-5 my-6', style.border, style.bg)}>
      <div className="flex gap-3">
        {style.icon}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1 text-foreground">{style.label}</p>
          <div className="text-sm leading-relaxed text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function BlockQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="relative my-6 pl-6 py-2 border-l-4 border-violet-500 rounded-r-xl bg-gradient-to-r from-violet-50/60 to-transparent dark:from-violet-950/20 dark:to-transparent">
      <Quote className="absolute left-2 -top-2 w-5 h-5 text-violet-400 opacity-50" />
      <p className="text-lg font-medium italic text-foreground leading-relaxed">
        {children}
      </p>
    </blockquote>
  );
}

export function BlogContent({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Auto-assign IDs to headings for anchor links
    const headings = containerRef.current.querySelectorAll('h2, h3, h4');
    headings.forEach((heading, index) => {
      if (!heading.id) {
        const text = heading.textContent || '';
        const id = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 60) || `heading-${index}`;
        heading.id = `${id}-${index}`;
      }
    });
  }, [content]);

  // Parse markdown-like content to HTML
  const parseContent = (rawContent: string): string => {
    let html = rawContent
      // Escape HTML entities first to prevent XSS
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Blockquotes (> text)
      .replace(/^&gt;\s*(.+?)$/gm, '<blockquote class="quote-block">$1</blockquote>')
      // H1
      .replace(/^# (.+)$/gm, '<h1 class="blog-h1">$1</h1>')
      // H2
      .replace(/^## (.+)$/gm, '<h2 class="blog-h2">$1</h2>')
      // H3
      .replace(/^### (.+)$/gm, '<h3 class="blog-h3">$1</h3>')
      // H4
      .replace(/^#### (.+)$/gm, '<h4 class="blog-h4">$1</h4>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="blog-strong">$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="blog-code">$1</code>')
      // Code blocks
      .replace(/```(?:\w+)?\n?([\s\S]*?)```/g, '<pre class="blog-pre"><code class="blog-precode">$1</code></pre>')
      // Unordered lists
      .replace(/^(-|\*)\s+(.+)$/gm, '<li class="blog-li">$2</li>')
      // Ordered lists
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="blog-oli" data-num="$1">$2</li>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="blog-link" target="_blank" rel="noopener noreferrer">$1</a>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="blog-hr" />')
      // Images ![alt](src)
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="blog-img" loading="lazy" />')
      // Tables - simple parsing for | col1 | col2 |
      .replace(/(\|[^\n]+\|\n)(\|[-:\s|]+\|\n)((?:\|[^\n]+\|\n?)+)/g, (match, header, separator, rows) => {
        const ths = header.split('|').filter(Boolean).map(h => `<th class="blog-th">${h.trim()}</th>`).join('');
        const trs = rows.trim().split('\n').map(row => {
          const tds = row.split('|').filter(Boolean).map(d => `<td class="blog-td">${d.trim()}</td>`).join('');
          return `<tr class="blog-tr">${tds}</tr>`;
        }).join('');
        return `<table class="blog-table"><thead class="blog-thead"><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
      })
      // Line breaks
      .replace(/\n\n/g, '\n')
      // Paragraphs
      .replace(/^(?!<[hbltcsrpi]|$)(.+)$/gm, '<p class="blog-p">$1</p>');

    // Wrap adjacent li elements in ul/ol
    html = html.replace(/(<li class="blog-li">.*?<\/li>\n?)+/g, (match) => {
      const items = match.trim();
      return `<ul class="blog-ul">${items}</ul>`;
    });

    html = html.replace(/(<li class="blog-oli".*?<\/li>\n?)+/g, (match) => {
      const items = match.trim();
      return `<ol class="blog-ol">${items}</ol>`;
    });

    // Wrap adjacent blockquote elements
    html = html.replace(/(<blockquote class="quote-block">.*?<\/blockquote>\n?)+/g, (match) => {
      const items = match.replace(/<blockquote class="quote-block">(.*?)<\/blockquote>/g, '$1\n').trim();
      return `<blockquote class="blog-blockquote">${items}</blockquote>`;
    });

    return html;
  };

  const htmlContent = parseContent(content);

  return (
    <div
      ref={containerRef}
      className="blog-content-wrapper"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
