import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          // Security headers, added 22 Oct 2026. Kept deliberately light so
          // nothing breaks: Google Tag Manager, Analytics and AdSense still
          // load, AdSense's own iframes are unaffected, and the interview
          // simulator can still ask for the microphone on our own pages.
          // A full script-src policy needs nonces on every page, which would
          // stop pages being served from cache, so it is not set here.
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=(self), usb=(), payment=()",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
      {
        source: "/favicon.png",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
  redirects: async () => {
    return [
      // Round 30 (30 Oct 2026): thin or duplicate pages merged into the strongest
      // page on the same topic. Each is a single hop to a live 200 page.
      {
        source: "/trends/ai-agents-autonomous-systems-2026",
        destination: "/blog/autonomous-ai-agents-examples-2026",
        permanent: true,
      },
      {
        source: "/trends/multi-agent-systems-enterprise",
        destination: "/blog/autonomous-ai-agents-examples-2026",
        permanent: true,
      },
      {
        source: "/trends/tech-interview-preparation-2026",
        destination: "/blog/technical-interview-prep-2026",
        permanent: true,
      },
      {
        source: "/blog/developer-tools-news-june-2026",
        destination: "/blog/ai-tools-developers-2026",
        permanent: true,
      },
      {
        source: "/blog/make-money-chatgpt-2026",
        destination: "/trends/ai-side-hustles-make-money-2026",
        permanent: true,
      },
      {
        source: "/blog/how-to-make-money-with-ai-2026",
        destination: "/trends/ai-side-hustles-make-money-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-freelancing-2026-six-figure-guide",
        destination: "/trends/ai-side-hustles-make-money-2026",
        permanent: true,
      },
      // GTA 6: one page before the 19 Nov launch. The /gta-6 hub keeps the URL
      // (countdown, news feed, PC check, linked from the header and footer).
      {
        source: "/trends/gta-6-release-everything-we-know",
        destination: "/gta-6",
        permanent: true,
      },
      {
        source: "/blog/gta-6-release-date-delayed-november-2026",
        destination: "/gta-6",
        permanent: true,
      },
      // TikTok posts merged on 28 Oct 2026. The trend page held the stronger
      // positions for the algorithm queries, so it keeps the URL. The old alias
      // points straight at it so there is no redirect chain.
      {
        source: "/blog/how-tiktok-algorithm-works-2026",
        destination: "/trends/tiktok-algorithm-2026-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/tiktok-algorithm-guide-2026",
        destination: "/trends/tiktok-algorithm-2026-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/how-to-audit-my-website-2026",
        destination: "/blog/website-audit-checklist-2026",
        permanent: true,
      },
      {
        source: "/blog/how-to-audit-website-2026-guide",
        destination: "/blog/website-audit-checklist-2026",
        permanent: true,
      },
      // AI agents posts merged on 15 Oct 2026. The examples post held the stronger
      // positions for the shared agent queries, so it keeps the URL and now covers
      // all twelve industries plus the implementation plan from the old post.
      {
        source: "/blog/autonomous-ai-agents-by-industry",
        destination: "/blog/autonomous-ai-agents-examples-2026",
        permanent: true,
      },
      // AI side hustle cluster merged on 2 Oct 2026. Both posts competed with the
      // trend page for the same queries; the trend page held the stronger positions
      // (9.5 average vs 14.3 and 16.7) and almost all impressions, so it keeps the URL.
      {
        source: "/blog/ai-side-hustles-2026-make-money",
        destination: "/trends/ai-side-hustles-make-money-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-side-hustles-beginners-2026",
        destination: "/trends/ai-side-hustles-make-money-2026",
        permanent: true,
      },
      // Game pages removed on 30 Sept 2026. "Strands" by Heart Machine does not
      // exist, and Pokemon Legends Z-A has no PC version, so neither page could
      // answer "can my PC run it". Neither ever earned a search impression.
      {
        source: "/tools/can-you-run-it/strands",
        destination: "/tools/can-you-run-it",
        permanent: true,
      },
      {
        source: "/tools/can-you-run-it/pokemon-legends-za",
        destination: "/tools/can-you-run-it",
        permanent: true,
      },
      // Community paused on 8 Oct 2026. The old page showed sample threads stored
      // only in each visitor's browser. Temporary redirect (not permanent) because
      // a real community may come back at the same URL.
      {
        source: "/community",
        destination: "/contact",
        permanent: false,
      },
      {
        source: "/community/:path*",
        destination: "/contact",
        permanent: false,
      },
      // Link Manager retired on 7 Oct 2026. It promised short links, click
      // analytics and bio pages, but nothing was ever saved: the database it
      // relied on does not exist on Vercel. A new tool may take its place later.
      {
        source: "/tools/link-manager",
        destination: "/tools",
        permanent: true,
      },
      {
        source: "/l/:path*",
        destination: "/tools",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
