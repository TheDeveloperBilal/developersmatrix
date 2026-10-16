# DevelopersMatrix

Source code for [developersmatrix.com](https://developersmatrix.com): free browser tools, trend reports and practical guides for developers, job seekers, site owners and creators.

## Stack

Next.js (App Router), React, TypeScript and Tailwind CSS, deployed on Vercel.

## Run locally

```
bun install
bun run dev
```

## Where things live

- `src/app` pages, layouts and API routes
- `src/components` shared UI and page sections
- `src/data` blog posts, trend reports, tools and site config
- `src/lib` tool logic (website audit, salary data, interview bank and more)
- `public` images, icons, robots.txt, llms.txt and ads.txt
- `scripts/build-salary-data.py` rebuilds the salary data in `public/data/salary` from BLS files in `data-src/` (not committed)
- `seo/` disavow file and SEO notes

## Environment variables

Set in Vercel, never committed: `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `NOTIFY_EMAIL` for the contact and order forms, and `PAGESPEED_API_KEY` for the website audit tool.
