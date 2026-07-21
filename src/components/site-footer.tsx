import Link from "next/link";
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
      { name: "Learn", href: "/learn" },
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
    <footer className="border-t border-ink-100 bg-ink-50/50">
      <div className="shell py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5" aria-label="DevelopersMatrix home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-sora text-sm font-bold text-white">
                DM
              </span>
              <span className="font-sora text-[1.05rem] font-bold tracking-tight text-ink-900">
                Developers<span className="text-brand-600">Matrix</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
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
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-500 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-600"
                >
                  <s.icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-600 transition-colors hover:text-brand-700"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200/70 pt-6 sm:flex-row">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} DevelopersMatrix. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">Made for the global community</p>
        </div>
      </div>
    </footer>
  );
}
