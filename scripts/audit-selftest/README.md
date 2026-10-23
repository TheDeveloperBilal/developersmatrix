# Website audit self test

Run before any change to `src/lib/website-audit` or the audit page:

```
bun run audit:test
```

What it covers, without touching the network:

- `engine.test.ts`: address safety (private IPs, ports, credentials), robots.txt rules, scoring, a full fake site (redirects, sitemap, 404s, forms, crawl choices), refusals (bot check page, 404 homepage, redirect to a private address), Next.js false positives.
- `page-checks.test.ts`: doctype, charset, meta refresh, deprecated HTML, keyword usage, nofollow, DOM size, image formats, plain text emails, new tab links, analytics detection.
- `site-checks.test.ts`: broken links, 404 page, favicon, www and http redirects, HTTP/2, SPF and DMARC, ads.txt, caching, minification, responsive CSS, directory listing, AI crawlers, bot walls, time budget.
- `round-d.test.ts`: social profiles, CDN detection, inline CSS, audit history.

Every check in a suite has a case that should trigger it and one that should not. A failing line starts with `FAIL`.
