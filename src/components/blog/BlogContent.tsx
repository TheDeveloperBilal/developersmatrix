'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, Copy, Check, Quote, Info, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  // Handle copy button clicks for code blocks
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleCopy = async (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
      const preBody = btn.closest('.blog-pre')?.querySelector('.blog-pre-body');
      const code = preBody?.querySelector('code');
      if (!code) return;
      
      try {
        await navigator.clipboard.writeText(code.textContent || '');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:text-bottom;margin-right:4px;flex-shrink:0;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy';
          btn.classList.remove('copied');
        }, 2000);
      } catch {
        // ignore
      }
    };

    const buttons = containerRef.current.querySelectorAll('.blog-pre-copy-btn');
    buttons.forEach(btn => btn.addEventListener('click', handleCopy));
    
    return () => {
      buttons.forEach(btn => btn.removeEventListener('click', handleCopy));
    };
  }, [content]);

  // Scroll animations — fade in elements as they enter viewport
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('blog-animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    const targets = containerRef.current.querySelectorAll(
      '.blog-p, .blog-ul, .blog-ol, .blog-img, .blog-table, .blog-blockquote, .blog-pre, h2, h3, h4'
    );
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [content]);

  // Add copy-link buttons to headings
  useEffect(() => {
    if (!containerRef.current) return;
    
    const headings = containerRef.current.querySelectorAll('h2.blog-h2, h3.blog-h3, h4.blog-h4');
    
    headings.forEach((heading) => {
      if (heading.querySelector('.blog-heading-copy-btn')) return;
      
      const btn = document.createElement('button');
      btn.className = 'blog-heading-copy-btn';
      btn.type = 'button';
      btn.title = 'Copy link to section';
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
      
      btn.addEventListener('click', async () => {
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`;
        await navigator.clipboard.writeText(url);
        btn.classList.add('copied');
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
        }, 2000);
      });
      
      heading.appendChild(btn);
    });
  }, [content]);

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
    // Helper to generate VS Code-style code block HTML
    const generateCodeBlock = (code: string, lang?: string): string => {
      const language = lang || 'code';
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      
      return `<div class="blog-pre">
        <div class="blog-pre-header">
          <div class="blog-pre-header-left">
            <span class="blog-pre-dot red"></span>
            <span class="blog-pre-dot yellow"></span>
            <span class="blog-pre-dot green"></span>
            <span class="blog-pre-lang">${language}</span>
          </div>
          <button class="blog-pre-copy-btn" type="button" title="Copy code">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:text-bottom;margin-right:4px;"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy
          </button>
        </div>
        <div class="blog-pre-body">
          <code class="blog-precode">${escapedCode}</code>
        </div>
      </div>`;
    };

    // Normalize line endings to \n for consistent parsing
    let html = rawContent
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Escape HTML entities first (but we'll handle code blocks specially)
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
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Handle code blocks specially — need to do this before inline code since code blocks contain backticks
    // First, temporarily replace code blocks with placeholders
    const codeBlocks: Array<{ placeholder: string; html: string }> = [];
    html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
      codeBlocks.push({ placeholder, html: generateCodeBlock(code, lang) });
      return placeholder;
    });

    // Now safe to process inline code
    html = html.replace(/`([^`]+)`/g, '<code class="blog-code">$1</code>');

    // Restore code blocks
    codeBlocks.forEach(({ placeholder, html: blockHtml }) => {
      html = html.replace(placeholder, blockHtml);
    });

    html = html
      // Unordered lists
      .replace(/^(-|\*)\s+(.+)$/gm, '<li class="blog-li">$2</li>')
      // Ordered lists
      .replace(/^(\d+)\.\s+(.+)$/gm, '<li class="blog-oli" data-num="$1">$2</li>')
      // Links [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="blog-link" target="_blank" rel="noopener noreferrer">$1</a>')
      // Auto-link bare URLs (not already in <a> tags)
      .replace(/(?<!["\'>]|href=\")(https?:\/\/[^\s<>"{}|\^`\[\]]+)/g, '<a href="$1" class="blog-link" target="_blank" rel="noopener noreferrer">$1</a>')
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
        return `<div class="overflow-x-auto"><table class="blog-table"><thead class="blog-thead"><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`;
      })
      // Line breaks
      .replace(/\n\n/g, '\n')
      // Paragraphs - but not lines that already start with HTML tags
      .replace(/^(?!<[hbltcsrpid a]|$)(.+)$/gm, '<p class="blog-p">$1</p>');

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

  const [feedbackState, setFeedbackState] = useState<'idle' | 'yes' | 'no'>('idle');

  return (
    <>
      <div
        ref={containerRef}
        className="blog-content-wrapper"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
      
      {/* Was this helpful? feedback section */}
      <div className="blog-feedback">
        <p className="blog-feedback-label">Was this article helpful?</p>
        <div className="blog-feedback-buttons">
          <button
            className={`blog-feedback-btn ${feedbackState === 'yes' ? 'active' : ''}`}
            onClick={() => setFeedbackState('yes')}
            disabled={feedbackState !== 'idle'}
          >
            {feedbackState === 'yes' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Thanks for your feedback!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                Yes, it helped
              </>
            )}
          </button>
          <button
            className={`blog-feedback-btn ${feedbackState === 'no' ? 'active' : ''}`}
            onClick={() => setFeedbackState('no')}
            disabled={feedbackState !== 'idle'}
          >
            {feedbackState === 'no' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Thanks for your feedback!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 2.7l1.38 9a2 2 0 0 0 2 1.3H10M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/></svg>
                Not really
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
