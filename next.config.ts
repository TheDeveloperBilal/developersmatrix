import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
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
      {
        source: "/blog/how-tiktok-algorithm-works-2026",
        destination: "/blog/tiktok-algorithm-guide-2026",
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
