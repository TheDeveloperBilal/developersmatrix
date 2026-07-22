"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Search, Wrench, FileText, TrendingUp, X } from "lucide-react";
import { featuredTools, moreTools } from "@/lib/data";
import { getAllBlogPosts } from "@/data/blog";
import { allTrends } from "@/data/trends-data";

type SearchTab = "all" | "tools" | "articles" | "trends";

interface SearchItem {
  id: string;
  name: string;
  href: string;
  category: string;
  type: SearchTab;
  description?: string;
}

const allTools = [...featuredTools, ...moreTools];
const allArticles = getAllBlogPosts();
const allTrendsData = allTrends;

function useSearchData() {
  return useMemo(() => {
    const tools: SearchItem[] = allTools.map((t, i) => ({
      id: `tool-${i}`,
      name: t.name,
      href: t.href,
      category: "TOOLS",
      type: "tools" as SearchTab,
      description: t.description,
    }));

    const articles: SearchItem[] = allArticles.map((a, i) => ({
      id: `article-${i}`,
      name: a.title,
      href: `/blog/${a.slug}`,
      category: (a.category || "ARTICLE").toUpperCase(),
      type: "articles" as SearchTab,
      description: a.excerpt?.slice(0, 80) + "...",
    }));

    const trends: SearchItem[] = allTrendsData.map((t, i) => ({
      id: `trend-${i}`,
      name: t.title,
      href: `/trends/${t.slug}`,
      category: t.category?.toUpperCase().replace(/-/g, " ") || "TRENDS",
      type: "trends" as SearchTab,
      description: t.subtitle?.slice(0, 80) + "...",
    }));

    return { tools, articles, trends, all: [...tools, ...articles, ...trends] };
  }, []);
}

function filterItems(items: SearchItem[], query: string) {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
  );
}

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const data = useSearchData();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveTab("all");
      // Focus input after animation
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const source =
      activeTab === "all"
        ? data.all
        : activeTab === "tools"
        ? data.tools
        : activeTab === "articles"
        ? data.articles
        : data.trends;
    return filterItems(source, query);
  }, [activeTab, query, data]);

  const tabs: { key: SearchTab; label: string }[] = [
    { key: "all", label: "ALL" },
    { key: "tools", label: "TOOLS" },
    { key: "articles", label: "ARTICLES" },
    { key: "trends", label: "TRENDS" },
  ];

  const getIcon = (type: SearchTab) => {
    switch (type) {
      case "tools":
        return <Wrench className="h-[1rem] w-[1rem] text-brand-500" strokeWidth={1.8} />;
      case "articles":
        return <FileText className="h-[1rem] w-[1rem] text-brand-500" strokeWidth={1.8} />;
      case "trends":
        return <TrendingUp className="h-[1rem] w-[1rem] text-brand-500" strokeWidth={1.8} />;
      default:
        return <Wrench className="h-[1rem] w-[1rem] text-brand-500" strokeWidth={1.8} />;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl mx-4 rounded-2xl border border-ink-100 bg-white shadow-[0_24px_80px_-16px_rgba(20,26,38,0.25)] animate-menu-in overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-ink-100">
          <Search className="h-4 w-4 text-ink-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools, articles, trends and guides"
            className="flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="shrink-0 rounded-full p-1 hover:bg-ink-100 transition-colors"
            >
              <X className="h-3.5 w-3.5 text-ink-400" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-ink-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-full text-[0.6875rem] font-semibold tracking-wide transition-colors ${
                activeTab === tab.key
                  ? "bg-brand-600 text-white"
                  : "text-ink-500 hover:bg-ink-50 hover:text-ink-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-400">
              {query ? `No results for "${query}"` : "Start typing to search..."}
            </div>
          ) : (
            <div className="py-2">
              {results.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3.5 px-5 py-3 hover:bg-ink-50 transition-colors group"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                    {getIcon(item.type)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[0.6875rem] font-medium text-ink-400 mt-0.5">
                      {item.category}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2.5 border-t border-ink-100 bg-ink-50/50">
          <p className="text-[0.625rem] text-ink-400">
            Press <kbd className="rounded border border-ink-200 bg-white px-1 py-0.5 text-[0.625rem] font-semibold">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
}
