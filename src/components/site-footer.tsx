import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin } from "lucide-react";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M9.2 20.2c.7-2.4 1.6-6.2 1.6-6.2" strokeLinecap="round" />
      <path d="M10.8 14s.5 1 1.9 1c2.3 0 3.6-2.1 3.6-4.3 0-2.2-1.7-3.9-4.1-3.9a4.4 4.4 0 0 0-4.6 4.4c0 .9.3 1.7 1 2.2" strokeLinecap="round" />
    </svg>
  );
}

const columns = [
  {
    title: "Tools",
    links: [
      { name: "AI Website Audit", href: "/tools/website-audit" },
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder" },
      { name: "Cover Letter Generator", href: "/tools/ai-cover-letter-generator" },
      { name: "Interview Simulator", href: "/tools/ai-interview-simulator" },
      { name: "Budget Planner", href: "/tools/budget-planner" },
      { name: "All 20+ tools", href: "/tools" },
    ],
  },
  {
    title: "Content",
    links: [
      { name: "Trend Radar", href: "/trends" },
      { name: "Blog", href: "/blog" },
      { name: "GTA 6 hub", href: "/gta-6" },
      { name: "Community", href: "/community" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socials = [
  { name: "LinkedIn", href: "https://linkedin.com/company/developersmatrix", icon: Linkedin },
  { name: "Facebook", href: "https://www.facebook.com/developersmatrix/", icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/developermatrix/", icon: Instagram },
  { name: "Pinterest", href: "https://www.pinterest.com/developersmatrix/", icon: PinterestIcon },
];

export default function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-ink-950">
      {/* Background decoration matching Explore by goal */}
      <div
        aria-hidden="true"
        className="dot-grid absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,rgba(255,255,255,0.6)_1px,transparent_1px)]"
      />
      <div aria-hidden="true" className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-brand-600/25 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-brand-800/30 blur-3xl" />

      <div className="shell relative py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="DevelopersMatrix home">
              <Image
                src="/logo.webp"
                alt="DevelopersMatrix"
                width={160}
                height={36}
                className="h-8 w-auto brightness-0 invert"
                priority
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Free AI tools, daily tech trends and practical guides for developers, creators and
              professionals building better careers and businesses.
            </p>
            <div className="mt-6 flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-sora text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/40">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} DevelopersMatrix. All rights reserved.
          </p>
          <p className="text-xs text-white/40">Made for the global community</p>
        </div>
      </div>
    </footer>
  );
}
