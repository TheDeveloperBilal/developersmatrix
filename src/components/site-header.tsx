"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";
import { categories, featuredTools, moreTools } from "@/lib/data";
import SearchModal from "@/components/search-modal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Free Website Audit", href: "/tools/website-audit" },
  { name: "Trends", href: "/trends" },
  { name: "Blog", href: "/blog" },
  { name: "Community", href: "/community" },
];

function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="DevelopersMatrix home">
      <Image
        src="/logo.webp"
        alt="DevelopersMatrix"
        width={160}
        height={36}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}

function MegaMenu() {
  return (
    <div className="fixed left-1/2 top-[4.5rem] z-50 w-[56rem] max-w-[calc(100vw-2.5rem)] -translate-x-1/2">
      <div className="animate-menu-in overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-menu">
        <div className="grid grid-cols-[1.25fr_1fr_0.9fr]">
          {/* Featured tools */}
          <div className="border-r border-ink-100 p-6">
            <p className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
              <span className="h-px w-6 bg-ink-300" /> Featured tools
            </p>
            <ul className="space-y-1">
              {featuredTools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="group flex gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-brand-50"
                  >
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                      <tool.icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.8} />
                    </span>
                    <span>
                      <span className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                        {tool.name}
                        {tool.badge && (
                          <span
                            className={`chip ${
                              tool.badge === "NEW"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-brand-100 text-brand-700"
                            }`}
                          >
                            {tool.badge}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[0.8125rem] leading-snug text-ink-500">
                        {tool.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More tools */}
          <div className="border-r border-ink-100 p-6">
            <p className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
              <span className="h-px w-6 bg-ink-300" /> More tools
            </p>
            <ul className="space-y-0.5">
              {moreTools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="group flex items-center gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-brand-50"
                  >
                    <tool.icon
                      className="h-[1.05rem] w-[1.05rem] shrink-0 text-brand-500"
                      strokeWidth={1.8}
                    />
                    <span className="text-sm font-medium text-ink-700 transition-colors group-hover:text-ink-900">
                      {tool.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* By category */}
          <div className="bg-ink-50/60 p-6">
            <p className="mb-4 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
              <span className="h-px w-6 bg-ink-300" /> By category
            </p>
            <ul className="space-y-0.5">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={cat.href}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors hover:bg-white"
                  >
                    <span className="text-sm font-medium text-ink-700 transition-colors group-hover:text-brand-700">
                      {cat.name}
                    </span>
                    <span className="text-[0.6875rem] font-medium text-ink-400">{cat.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/tools"
              className="mt-4 inline-flex items-center gap-1.5 px-2.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Browse all tools
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Menu footer strip */}
        <div className="flex items-center justify-between border-t border-ink-100 bg-white px-6 py-3">
          <p className="text-xs text-ink-400">
            20+ free tools · No signup · Works in your browser
          </p>
          <Link
            href="/tools/website-audit"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            Run a free website audit <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openTools = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setToolsOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setToolsOpen(false), 140);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toolsOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToolsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [toolsOpen]);

  return (
    <header className="sticky top-0 z-40">
      {/* Blurred background layer (kept separate so fixed panels are not trapped by backdrop-filter) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 border-b bg-white/85 backdrop-blur-xl transition-all duration-300 ${
          scrolled
            ? "border-ink-100 shadow-[0_8px_30px_-18px_rgba(20,26,38,0.25)]"
            : "border-transparent"
        }`}
      />
      <div className="shell relative flex h-[4.25rem] items-center justify-between gap-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={openTools}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              onClick={(e) => {
                // Mouse click keeps the hover-opened menu open; keyboard click toggles.
                if (e.detail === 0) setToolsOpen((v) => !v);
                else setToolsOpen(true);
              }}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                toolsOpen ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-ink-50 hover:text-ink-900"
              }`}
            >
              Tools
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {toolsOpen && <MegaMenu />}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 rounded-full border border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
          >
            <Search className="h-3.5 w-3.5" />
            Search
            <kbd className="rounded border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[0.625rem] font-semibold text-ink-400">
              ⌘K
            </kbd>
          </button>
          <Link href="/tools" className="btn-primary !px-5 !py-2.5">
            Explore tools
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 text-ink-800 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-[4.25rem] bottom-0 z-40 overflow-y-auto border-t border-ink-100 bg-white lg:hidden">
          <div className="shell space-y-1 py-6">
            <button
              type="button"
              onClick={() => { setMobileOpen(false); setSearchOpen(true); }}
              className="flex w-full items-center gap-3 rounded-xl border border-ink-200 bg-ink-50/70 px-4 py-3 text-sm font-medium text-ink-700"
            >
              <Search className="h-4 w-4" />
              Search tools, articles...
            </button>

            <button
              type="button"
              onClick={() => setMobileToolsOpen((v) => !v)}
              aria-expanded={mobileToolsOpen}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 font-sora text-lg font-semibold text-ink-900"
            >
              Tools
              <ChevronDown
                className={`h-5 w-5 text-ink-400 transition-transform ${mobileToolsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileToolsOpen && (
              <div className="space-y-5 rounded-2xl bg-ink-50/70 p-4">
                <div>
                  <p className="mb-2 px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                    Featured
                  </p>
                  {[...featuredTools, ...moreTools].map((tool) => (
                    <Link
                      key={tool.name}
                      href={tool.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-2 py-2.5"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-ink-100">
                        <tool.icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <span className="text-sm font-medium text-ink-800">{tool.name}</span>
                      {tool.badge && (
                        <span
                          className={`chip ${
                            tool.badge === "NEW"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-brand-100 text-brand-700"
                          }`}
                        >
                          {tool.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                <div>
                  <p className="mb-2 px-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                    By category
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={cat.href}
                        onClick={() => setMobileOpen(false)}
                        className="rounded-lg bg-white px-3 py-2.5 text-sm font-medium text-ink-700 ring-1 ring-ink-100"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3.5 font-sora text-lg font-semibold text-ink-900"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4">
              <Link href="/tools" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                Explore free tools <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
