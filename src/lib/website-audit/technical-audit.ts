// Deep Technical SEO Audit Module
// Analyzes robots.txt, sitemaps, hreflang, canonical chains, redirects, internal linking structure

import type { PageData, AuditIssue, AuditScore, SiteContext } from './types';
import { rulesFor, isAllowed, type ParsedRobots } from './robots';

export class TechnicalAuditor {
  private baseUrl: string = '';
  private domain: string = '';

  analyze(pages: PageData[], site: SiteContext, robots: ParsedRobots | null): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    
    if (!pages || pages.length === 0) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    const mainPage = pages[0];
    this.baseUrl = mainPage.url;
    this.domain = new URL(mainPage.url).hostname;
    
    // robots.txt Analysis
    this.analyzeRobotsTxt(issues, site, robots, pages);
    
    // Sitemap Validation
    this.analyzeSitemap(issues, site, pages);
    
    // Hreflang Detection
    this.analyzeHreflang(pages, issues);
    
    // Canonical Chain Analysis
    this.analyzeCanonicalChains(pages, issues);
    
    // Redirect Chain Detection
    this.analyzeRedirects(pages, site, issues);
    
    // Internal Linking Structure
    this.analyzeInternalLinking(pages, issues);
    
    // Pagination Handling
    this.analyzePagination(pages, issues);
    
    // Duplicate Content Detection
    this.analyzeDuplicateContent(pages, issues);
    
    // URL Parameter Analysis
    this.analyzeURLParameters(pages, issues);
    
    // HTTP Status Code Analysis
    this.analyzeStatusCodes(pages, issues);
    
    // Structured Data Validation
    this.analyzeStructuredData(pages, issues);
    
    // Link Depth Analysis
    this.analyzeLinkDepth(pages, issues);

    // Analytics tag on the homepage (a tip, never scored)
    this.analyzeAnalytics(pages, issues);

    // Calculate score
    const totalChecks = 32;
    // A check counts as passed only if it raised no finding at all. Previously this
    // applied a weighted penalty (critical x3, high x2) and ignored medium and low
    // findings entirely, so the number was not a count of passed checks.
    const passedChecks = Math.max(0, totalChecks - issues.length);
    
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  // --- robots.txt ---
  // Read the way Google reads it: only the group Googlebot would follow
  // counts, an empty "Disallow:" allows everything, and the longest matching
  // rule wins. A rule aimed at GPTBot or another single crawler is not a rule
  // for search engines.

  private analyzeRobotsTxt(issues: AuditIssue[], site: SiteContext, robots: ParsedRobots | null, pages: PageData[]) {
    const home = pages[0]?.url;
    const { status, url } = site.robots;

    if (!site.robots.found || !robots) {
      if (status !== null && status >= 500) {
        issues.push({
          id: 'tech-robots-server-error',
          category: 'technical',
          type: 'missing_robots_txt',
          severity: 'high',
          title: `robots.txt Returns a Server Error (HTTP ${status})`,
          description: `${url} answered with HTTP ${status}. Google treats a robots.txt that keeps failing with a server error as a reason to stop crawling the site until it can be read.`,
          impact: 'While robots.txt returns 5xx errors, Google may pause crawling, so new and updated pages are not picked up.',
          suggestion: 'Make /robots.txt return 200 with plain text, or 404 if you do not want one. Check server logs for why it fails.',
          priority: 8,
          affectedUrls: [url],
          timeToFix: '15 minutes',
          difficulty: 'easy',
        });
        return;
      }
      if (status === null) {
        issues.push({
          id: 'tech-robots-unreachable',
          category: 'technical',
          type: 'missing_robots_txt',
          severity: 'low',
          title: 'robots.txt Could Not Be Read',
          description: `The request for ${url} failed (timeout or connection error), so robots.txt rules could not be checked.`,
          impact: 'If Google has the same trouble reaching robots.txt, it may crawl the site less often.',
          suggestion: 'Open /robots.txt in a browser to confirm it loads quickly. Run the audit again later.',
          priority: 3,
          affectedUrls: [url],
          timeToFix: '5 minutes',
          difficulty: 'easy',
        });
        return;
      }
      issues.push({
        id: 'tech-missing-robots',
        category: 'technical',
        type: 'missing_robots_txt',
        severity: 'low',
        title: 'No robots.txt File',
        description: `${url} returned ${status === 200 ? 'an HTML page instead of a robots.txt file' : `HTTP ${status}`}. Without a robots.txt file, crawlers may fetch every page, which is fine for most small sites.`,
        impact: 'Nothing is blocked, so this does not hurt indexing. A robots.txt is still the standard place to list your sitemap and to keep crawlers out of areas such as internal search results or admin pages.',
        suggestion: 'Add a plain text file at /robots.txt, for example:\nUser-agent: *\nDisallow:\nSitemap: https://yourdomain.com/sitemap.xml',
        priority: 3,
        affectedUrls: [home],
        timeToFix: '10 minutes',
        difficulty: 'easy',
      });
      return;
    }

    const google = rulesFor(robots, 'Googlebot');

    // The whole site blocked for Google
    if (!isAllowed(robots, 'Googlebot', '/')) {
      issues.push({
        id: 'tech-robots-root-disallowed',
        category: 'technical',
        type: 'missing_robots_txt',
        severity: 'critical',
        title: 'robots.txt Blocks Google From the Whole Site',
        description: `The robots.txt group that Googlebot follows (User-agent: ${google.matched}) disallows "/". Google cannot crawl any page.`,
        impact: 'Pages cannot be crawled, so new content will not be indexed and existing pages will drop out of search results over time.',
        suggestion: `Remove "Disallow: /" from the "User-agent: ${google.matched}" group. To block only some areas, list them, for example "Disallow: /admin/".`,
        priority: 10,
        affectedUrls: [url],
        timeToFix: '2 minutes',
        difficulty: 'easy',
      });
    } else {
      // Crawled pages that Google is not allowed to fetch
      const blocked = pages.filter((p) => {
        try {
          const u = new URL(p.url);
          return !isAllowed(robots, 'Googlebot', u.pathname + u.search);
        } catch {
          return false;
        }
      });
      if (blocked.length > 0) {
        issues.push({
          id: 'tech-robots-blocks-pages',
          category: 'technical',
          type: 'missing_robots_txt',
          severity: 'high',
          title: `${blocked.length} Linked Page${blocked.length > 1 ? 's' : ''} Blocked by robots.txt`,
          description: `Your navigation links to ${blocked.length > 1 ? 'pages' : 'a page'} that robots.txt does not let Googlebot crawl.`,
          impact: 'Blocked pages cannot be crawled, so their content cannot rank. If this is intentional, it is fine.',
          suggestion: 'If these pages should appear in Google, remove the matching Disallow rule. If they should not, consider a noindex tag instead and allow crawling so Google can see it.',
          priority: 7,
          affectedUrls: blocked.map((p) => p.url),
          timeToFix: '5 minutes',
          difficulty: 'easy',
        });
      }
    }

    // Crawl-delay, which Google ignores but Bing and Yandex honour
    if (google.crawlDelay !== undefined && google.crawlDelay > 5) {
      issues.push({
        id: 'tech-robots-high-crawl-delay',
        category: 'technical',
        type: 'missing_robots_txt',
        severity: 'low',
        title: `High Crawl-delay (${google.crawlDelay}s)`,
        description: `robots.txt sets Crawl-delay: ${google.crawlDelay}. Google ignores this directive, but Bing and Yandex wait that long between requests.`,
        impact: 'Bing and Yandex will crawl the site slowly, so changes reach those engines later.',
        suggestion: 'Remove Crawl-delay unless your server genuinely struggles with crawler traffic. Bing Webmaster Tools has its own crawl rate setting.',
        priority: 3,
        affectedUrls: [url],
        timeToFix: '2 minutes',
        difficulty: 'easy',
      });
    }

    // No sitemap listed
    if (robots.sitemaps.length === 0) {
      issues.push({
        id: 'tech-robots-no-sitemap',
        category: 'technical',
        type: 'missing_robots_txt',
        severity: 'low',
        title: 'Sitemap Not Listed in robots.txt',
        description: 'robots.txt has no "Sitemap:" line. Search engines can still find a sitemap you submit in Search Console or Bing Webmaster Tools, but listing it here helps every crawler find it.',
        impact: 'Crawlers that never see a submitted sitemap rely on links alone to discover pages.',
        suggestion: 'Add a line such as "Sitemap: https://yourdomain.com/sitemap.xml" to robots.txt.',
        priority: 3,
        affectedUrls: [url],
        timeToFix: '2 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Sitemap Validation ---
  // The sitemap is fetched and read, not just looked for in robots.txt.

  private analyzeSitemap(issues: AuditIssue[], site: SiteContext, pages: PageData[]) {
    const sitemaps = site.sitemaps;
    const listed = sitemaps.filter((s) => s.source === 'robots');

    if (sitemaps.length === 0) {
      issues.push({
        id: 'tech-missing-sitemap',
        category: 'technical',
        type: 'missing_sitemap',
        severity: 'medium',
        title: 'XML Sitemap Not Found',
        description: `No sitemap is listed in robots.txt, and nothing was found at ${site.origin}/sitemap.xml or ${site.origin}/sitemap_index.xml.`,
        impact: 'Search engines can still find pages through links, but a sitemap helps them discover new and deep pages sooner, and shows you indexing reports in Search Console.',
        suggestion: 'Create an XML sitemap that lists every page you want indexed (most CMS platforms and frameworks can generate one), list it in robots.txt and submit it in Google Search Console.',
        priority: 6,
        affectedUrls: [pages[0]?.url],
        timeToFix: '15 to 30 minutes',
        difficulty: 'easy',
      });
      return;
    }

    // A sitemap that answers 401, 403, 429 or 503 refused our scanner. Google
    // may still be allowed in, so this is a note to check, not a broken file.
    const refused = (s: (typeof listed)[number]) => s.status !== null && [401, 403, 429, 503].includes(s.status);
    const blocked = listed.filter((s) => !s.ok && refused(s));
    if (blocked.length > 0) {
      issues.push({
        id: 'tech-sitemap-blocked',
        category: 'technical',
        type: 'missing_sitemap',
        severity: 'low',
        informational: true,
        title: 'Sitemap Refused Our Request',
        description: blocked.map((s) => `${s.url} answered HTTP ${s.status} to our scanner.`).join(' '),
        impact: 'Sites often block automated tools while still letting Google in, so this may be fine. If Google is blocked too, it cannot read your page list.',
        suggestion: 'Open Search Console, Sitemaps, and check that Google reports the sitemap as read successfully.',
        priority: 3,
        affectedUrls: blocked.map((s) => s.url),
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    const broken = listed.filter((s) => !s.ok && !refused(s));
    if (broken.length > 0) {
      issues.push({
        id: 'tech-sitemap-broken',
        category: 'technical',
        type: 'missing_sitemap',
        severity: 'high',
        title: `Sitemap Listed in robots.txt ${broken.length > 1 ? 'Do' : 'Does'} Not Load`,
        description: broken
          .map((s) =>
            s.status === null
              ? `${s.url} could not be reached.`
              : s.status >= 400
                ? `${s.url} returned HTTP ${s.status}.`
                : `${s.url} loaded but is not a valid XML sitemap.`
          )
          .join(' '),
        impact: 'Search engines that follow this robots.txt line get an error instead of your page list.',
        suggestion: 'Fix the address in robots.txt so it points at the real sitemap, and make sure it returns XML with a <urlset> or <sitemapindex> root.',
        priority: 7,
        affectedUrls: broken.map((s) => s.url),
        timeToFix: '10 minutes',
        difficulty: 'easy',
      });
    }

    const empty = sitemaps.filter((s) => s.ok && s.kind === 'urlset' && s.urlCount === 0);
    if (empty.length > 0) {
      issues.push({
        id: 'tech-sitemap-empty',
        category: 'technical',
        type: 'missing_sitemap',
        severity: 'medium',
        title: 'Sitemap Lists No Pages',
        description: `${empty.map((s) => s.url).join(', ')} is a valid sitemap but contains no <url> entries.`,
        impact: 'An empty sitemap gives search engines nothing to discover.',
        suggestion: 'Check the sitemap generator settings so every indexable page is included.',
        priority: 5,
        affectedUrls: empty.map((s) => s.url),
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Hreflang Analysis ---
  // Only hreflang in the HTML head is read. Hreflang can also live in HTTP
  // Link headers or in the XML sitemap, which this check does not see.

  private analyzeHreflang(pages: PageData[], issues: AuditIssue[]) {
    // An ISO 639-1 (or 639-2) language, an optional ISO 15924 script and an
    // optional ISO 3166-1 region (or UN M.49 number), or x-default.
    const validLangPattern = /^([a-z]{2,3})(-[A-Za-z]{4})?(-([A-Za-z]{2}|\d{3}))?$|^x-default$/i;

    const perPage = pages.map((page) => ({ page, hreflangs: extractHreflangs(page.html || '') }));
    const anyHreflang = perPage.some((p) => p.hreflangs.length > 0);

    // Different primary languages across crawled pages, with no hreflang anywhere.
    // en and en-US count as the same language.
    const primaryLangs = [
      ...new Set(
        pages
          .map((p) => (p.meta.lang || '').trim().split('-')[0].toLowerCase())
          .filter(Boolean)
      ),
    ];

    if (primaryLangs.length > 1 && !anyHreflang) {
      issues.push({
        id: 'tech-missing-hreflang',
        category: 'seo',
        type: 'url_structure',
        severity: 'medium',
        title: 'Pages in Different Languages Without hreflang',
        description: `The crawled pages declare ${primaryLangs.length} languages (${primaryLangs.join(', ')}) but none has hreflang tags. Hreflang tells Google which language version to show to which searcher.`,
        impact: 'This only matters if these pages are translations of each other. If they are, Google may show searchers the version in the wrong language.',
        suggestion: 'If these pages are translations of each other, add hreflang tags in the <head> of every version, each listing all versions including itself. Example: <link rel="alternate" hreflang="en" href="https://example.com/en/page" /> <link rel="alternate" hreflang="x-default" href="https://example.com/page" />. If they are unrelated pages, ignore this.',
        priority: 5,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '2 to 4 hours',
        difficulty: 'hard',
      });
    }

    const noXDefault: string[] = [];
    const noSelfRef: string[] = [];
    const invalid: { url: string; lang: string }[] = [];

    for (const { page, hreflangs } of perPage) {
      if (hreflangs.length === 0) continue;

      if (!hreflangs.some((h) => h.lang.toLowerCase() === 'x-default')) noXDefault.push(page.url);

      const self = urlKey(page.url);
      const selfRef = hreflangs.some((h) => urlKey(h.href, page.url) === self);
      if (!selfRef) noSelfRef.push(page.url);

      for (const h of hreflangs) {
        if (!validLangPattern.test(h.lang.trim())) invalid.push({ url: page.url, lang: h.lang });
      }
    }

    // Hreflang present but missing x-default
    if (noXDefault.length > 0) {
      issues.push({
        id: 'tech-hreflang-no-xdefault',
        category: 'seo',
        type: 'url_structure',
        severity: 'low',
        title: 'hreflang Tags Missing x-default Fallback',
        description: `${noXDefault.length} page${noXDefault.length > 1 ? 's have' : ' has'} hreflang tags but no "x-default" entry. x-default tells Google which page to show when none of the listed languages matches the searcher.`,
        impact: 'Searchers whose language you do not list get whichever version Google picks. x-default is optional but useful.',
        suggestion: 'Add an x-default hreflang pointing to your main or language picker page: <link rel="alternate" hreflang="x-default" href="https://example.com/" />',
        priority: 3,
        affectedUrls: noXDefault,
        timeToFix: '10 to 20 minutes',
        difficulty: 'easy',
      });
    }

    // Hreflang self-referencing check
    if (noSelfRef.length > 0) {
      issues.push({
        id: 'tech-hreflang-no-self-ref',
        category: 'seo',
        type: 'url_structure',
        severity: 'medium',
        title: 'hreflang Missing Self Referencing Tag',
        description: `${noSelfRef.length} page${noSelfRef.length > 1 ? 's' : ''} with hreflang ${noSelfRef.length > 1 ? 'do' : 'does'} not list ${noSelfRef.length > 1 ? 'themselves' : 'itself'}. Google expects each version to list every version, including itself.`,
        impact: 'Google may ignore hreflang sets that are incomplete, so searchers can be shown the wrong language version.',
        suggestion: 'Add a hreflang tag that points to the page\'s own URL. If this is the English version, add: <link rel="alternate" hreflang="en" href="[this page URL]" />',
        priority: 6,
        affectedUrls: noSelfRef,
        timeToFix: '10 minutes',
        difficulty: 'easy',
      });
    }

    // Invalid hreflang codes
    if (invalid.length > 0) {
      const codes = [...new Set(invalid.map((h) => h.lang))];
      issues.push({
        id: 'tech-hreflang-invalid',
        category: 'seo',
        type: 'url_structure',
        severity: 'high',
        title: `${codes.length} Invalid hreflang Language Code${codes.length > 1 ? 's' : ''}`,
        description: `Found invalid hreflang code${codes.length > 1 ? 's' : ''}: "${codes.join(', ')}". A valid code is an ISO 639-1 language code, an optional ISO 15924 script and an optional ISO 3166-1 region (for example "en", "en-US", "zh-Hant", "zh-Hant-TW"), or "x-default".`,
        impact: 'Google ignores hreflang tags with codes it cannot read, so those language versions are not connected.',
        suggestion: 'Replace each invalid code with a valid one. Use "en" for English, "en-US" for US English, "en-GB" for UK English. Separate parts with a hyphen, not an underscore, and do not use a region on its own.',
        priority: 7,
        affectedUrls: [...new Set(invalid.map((h) => h.url))],
        timeToFix: '10 to 20 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Canonical Chain Analysis ---

  private analyzeCanonicalChains(pages: PageData[], issues: AuditIssue[]) {
    const conflicting: string[] = [];
    const repeated: string[] = [];
    const crossDomain: { url: string; canonical: string }[] = [];
    const otherUrl: { url: string; canonical: string }[] = [];
    const invalid: { url: string; canonical: string }[] = [];
    const httpOnHttps: { url: string; canonical: string }[] = [];
    const missing: string[] = [];

    for (const page of pages) {
      // Error pages and noindex pages do not need a canonical.
      const indexable = page.statusCode < 400 && !isNoindex(page);

      // Multiple canonicals per page. rel can hold several tokens.
      const tags = extractCanonicalHrefs(page.html || '');
      if (tags.length > 1) {
        const distinct = new Set(tags.map((href) => urlKey(href, page.url, true)));
        if (distinct.size > 1) conflicting.push(page.url);
        else repeated.push(page.url);
      }

      const raw = page.meta.canonical?.trim();
      if (!raw) {
        if (indexable) missing.push(page.url);
        continue;
      }

      // Relative canonicals are valid. Resolve them against the page URL.
      let canonical: URL;
      let pageUrl: URL;
      try {
        canonical = new URL(raw, page.url);
        pageUrl = new URL(page.url);
      } catch {
        invalid.push({ url: page.url, canonical: raw });
        continue;
      }
      if (canonical.protocol !== 'http:' && canonical.protocol !== 'https:') {
        invalid.push({ url: page.url, canonical: raw });
        continue;
      }

      if (pageUrl.protocol === 'https:' && canonical.protocol === 'http:') {
        httpOnHttps.push({ url: page.url, canonical: canonical.href });
      }

      if (registrableDomain(canonical.hostname) !== registrableDomain(pageUrl.hostname)) {
        crossDomain.push({ url: page.url, canonical: canonical.href });
      } else if (urlKey(canonical.href) !== urlKey(page.url)) {
        otherUrl.push({ url: page.url, canonical: canonical.href });
      }
    }

    if (conflicting.length > 0 || repeated.length > 0) {
      const isConflict = conflicting.length > 0;
      const affected = isConflict ? conflicting : repeated;
      issues.push({
        id: 'tech-multiple-canonicals',
        category: 'seo',
        type: 'missing_canonical',
        severity: isConflict ? 'high' : 'low',
        title: isConflict
          ? `Conflicting Canonical Tags on ${affected.length} Page${affected.length > 1 ? 's' : ''}`
          : `Repeated Canonical Tag on ${affected.length} Page${affected.length > 1 ? 's' : ''}`,
        description: isConflict
          ? `${affected.length > 1 ? 'These pages have' : 'This page has'} more than one canonical tag, pointing at different URLs.`
          : `${affected.length > 1 ? 'These pages have' : 'This page has'} more than one canonical tag, all pointing at the same URL.`,
        impact: isConflict
          ? 'When canonical tags disagree, Google ignores them and picks the main URL on its own.'
          : 'Harmless while they agree, but a later change to only one of them would create a conflict.',
        suggestion: 'Keep a single canonical tag in the <head>. If you use a CMS plugin or framework metadata, check that only one of them outputs a canonical.',
        priority: isConflict ? 8 : 2,
        affectedUrls: affected,
        timeToFix: '10 to 15 minutes',
        difficulty: 'easy',
      });
    }

    // Canonical points to a different registrable domain
    if (crossDomain.length > 0) {
      issues.push({
        id: 'tech-canonical-cross-domain',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'medium',
        title: 'Canonical Tag Points to Another Domain',
        description: crossDomain.map((c) => `${c.url} → ${c.canonical}`).join('; '),
        impact: 'A cross domain canonical asks Google to index the other site\'s URL instead of yours. That is right for syndicated content and wrong almost everywhere else. Make sure this is intentional.',
        suggestion: 'If the content is syndicated from that domain, keep it. Otherwise point the canonical at this page\'s own URL.',
        priority: 7,
        affectedUrls: crossDomain.map((c) => c.url),
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    // Canonical points to another URL on the same site
    if (otherUrl.length > 0) {
      issues.push({
        id: 'tech-canonical-other-url',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'low',
        title: `${otherUrl.length} Page${otherUrl.length > 1 ? 's' : ''} Canonicalised to Another URL`,
        description: otherUrl.map((c) => `${c.url} → ${c.canonical}`).join('; '),
        impact: 'This page asks Google to index another URL instead; fine for duplicates. If this page has its own content, it will not show in search.',
        suggestion: 'If this page should rank on its own, change the canonical to the page\'s own URL.',
        priority: 3,
        affectedUrls: otherUrl.map((c) => c.url),
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    if (invalid.length > 0) {
      issues.push({
        id: 'tech-canonical-invalid',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'medium',
        title: 'Canonical URL Cannot Be Read',
        description: invalid.map((c) => `${c.url}: "${c.canonical}"`).join('; '),
        impact: 'Google ignores a canonical it cannot turn into a web address, and picks the main URL on its own.',
        suggestion: 'Use a full address such as https://yourdomain.com/page-path or a valid relative path such as /page-path.',
        priority: 6,
        affectedUrls: invalid.map((c) => c.url),
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    // Pages without a canonical (noindex and error pages are skipped)
    if (missing.length > 0 && pages.length > 1) {
      issues.push({
        id: 'tech-missing-canonical-pages',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'medium',
        title: `${missing.length} Page${missing.length > 1 ? 's' : ''} Missing Canonical Tag`,
        description: `${missing.length} indexable page${missing.length > 1 ? 's' : ''} scanned ${missing.length > 1 ? 'have' : 'has'} no canonical tag.`,
        impact: 'When a page is reachable at several addresses (tracking parameters, with or without www), Google has to pick the main one itself. A self referencing canonical makes your choice explicit. There is no penalty for duplicate URLs; canonicals consolidate them.',
        suggestion: 'Add a self referencing canonical to each indexable page: <link rel="canonical" href="https://yourdomain.com/this-exact-url" />. Use HTTPS, and whichever host and trailing slash style you use consistently.',
        priority: 5,
        affectedUrls: missing,
        timeToFix: '20 to 40 minutes',
        difficulty: 'easy',
      });
    }

    // Check for HTTP canonicals on HTTPS pages
    if (httpOnHttps.length > 0) {
      issues.push({
        id: 'tech-canonical-http-on-https',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'medium',
        title: 'Canonical Uses HTTP on HTTPS Page',
        description: httpOnHttps.map((c) => `${c.url} → ${c.canonical}`).join('; '),
        impact: 'The canonical asks Google to index the insecure HTTP address. Google usually prefers HTTPS anyway, but the mixed signal can lead to the wrong version being chosen.',
        suggestion: 'Change canonical tags to use HTTPS URLs, and make sure internal links use HTTPS too.',
        priority: 6,
        affectedUrls: httpOnHttps.map((c) => c.url),
        timeToFix: '10 to 15 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Redirects ---
  // Every request follows redirects by hand, so the chain for each page is
  // known exactly. Google passes full ranking signals through 301, 302 and 308
  // redirects; the costs are an extra round trip for visitors and slower
  // crawling when chains get long.

  private analyzeRedirects(pages: PageData[], site: SiteContext, issues: AuditIssue[]) {
    const chains = pages.filter((p) => p.redirectChain.length >= 2);
    if (chains.length > 0) {
      issues.push({
        id: 'tech-redirect-chains',
        category: 'technical',
        type: 'redirect_chain',
        severity: 'medium',
        title: `${chains.length} Redirect Chain${chains.length > 1 ? 's' : ''} Found`,
        description: chains
          .map((p) => [...p.redirectChain.map((h) => `${h.url} (${h.status})`), p.finalUrl].join(' → '))
          .join('; '),
        impact: 'Each extra hop adds a round trip before the page starts loading, and long chains slow down crawling. Google follows up to 10 hops.',
        suggestion: 'Point the first URL straight at the final one, and update internal links to use the final URL.',
        priority: 5,
        affectedUrls: chains.map((p) => p.redirectChain[0].url),
        timeToFix: '15 to 30 minutes',
        difficulty: 'medium',
      });
    }

    const temporary = pages.filter((p) => p.redirectChain.some((h) => h.status === 302 || h.status === 307));
    if (temporary.length > 0) {
      issues.push({
        id: 'tech-temporary-redirects',
        category: 'technical',
        type: 'redirect_chain',
        severity: 'low',
        title: `${temporary.length} Temporary Redirect${temporary.length > 1 ? 's' : ''} (302 or 307)`,
        description: `These URLs use a temporary redirect: ${temporary.map((p) => p.redirectChain[0].url).join(', ')}.`,
        impact: 'A temporary redirect tells search engines the original URL may come back, so they may keep it as the indexed address for longer.',
        suggestion: 'If the move is permanent, use a 301 or 308 redirect.',
        priority: 3,
        affectedUrls: temporary.map((p) => p.redirectChain[0].url),
        timeToFix: '10 minutes',
        difficulty: 'easy',
      });
    }

    // Links on the site that point at a URL which redirects
    const redirectingUrls = new Set(
      pages.filter((p) => p.redirectChain.length > 0).map((p) => p.redirectChain[0].url.replace(/\/$/, ''))
    );
    redirectingUrls.delete(site.enteredUrl.replace(/\/$/, ''));
    if (redirectingUrls.size > 0) {
      const linkingPages = pages.filter((p) => p.links.some((l) => redirectingUrls.has(l.href.replace(/\/$/, ''))));
      if (linkingPages.length > 0) {
        issues.push({
          id: 'tech-links-to-redirects',
          category: 'technical',
          type: 'redirect_chain',
          severity: 'low',
          title: 'Internal Links Point at Redirecting URLs',
          description: `Internal links go to ${[...redirectingUrls].join(', ')}, which redirect${redirectingUrls.size > 1 ? '' : 's'} elsewhere.`,
          impact: 'Every click and every crawl of these links costs an extra round trip.',
          suggestion: 'Update the links to point at the final URL directly.',
          priority: 3,
          affectedUrls: linkingPages.map((p) => p.url),
          timeToFix: '15 minutes',
          difficulty: 'easy',
        });
      }
    }

    // 404 pages in crawl
    const notFoundPages = pages.filter(p => p.statusCode === 404 || p.statusCode === 410);
    if (notFoundPages.length > 0) {
      issues.push({
        id: 'tech-404-in-crawl',
        category: 'technical',
        type: 'broken_link',
        severity: 'high',
        title: `${notFoundPages.length} Linked Page${notFoundPages.length > 1 ? 's' : ''} Return${notFoundPages.length > 1 ? '' : 's'} 404`,
        description: `${notFoundPages.length > 1 ? 'These pages are' : 'This page is'} linked from your homepage but return${notFoundPages.length > 1 ? '' : 's'} "not found".`,
        impact: 'Visitors who click these links hit a dead end, and crawlers spend time on pages that do not exist.',
        suggestion: 'Fix or remove the links. If the content moved, add a 301 redirect to the new address.',
        priority: 8,
        affectedUrls: notFoundPages.map(p => p.url),
        timeToFix: '15 to 30 minutes',
        difficulty: 'medium',
      });
    }
  }

  // --- Internal Linking Structure ---
  // Only a handful of pages are crawled, all found through homepage links, so
  // orphan pages and incoming link counts cannot be measured. What can be
  // measured is how many internal links each crawled page carries.

  private analyzeInternalLinking(pages: PageData[], issues: AuditIssue[]) {
    const highOutgoingPages = pages
      .map((p) => ({
        url: p.url,
        count: new Set(p.links.filter((l) => l.isInternal).map((l) => urlKey(l.href, p.url))).size,
      }))
      .filter((p) => p.count > 300);

    if (highOutgoingPages.length > 0) {
      issues.push({
        id: 'tech-too-many-links',
        category: 'seo',
        type: 'internal_linking',
        severity: 'low',
        title: `${highOutgoingPages.length} Page${highOutgoingPages.length > 1 ? 's' : ''} with Very Many Internal Links`,
        description: highOutgoingPages.map((p) => `${p.url} links to ${p.count} different internal URLs.`).join(' '),
        impact: 'Internal links help discovery and show which pages matter. Very long link lists dilute focus; keep navigation purposeful.',
        suggestion: 'Check whether every link helps visitors. Group long lists into category or hub pages and link prominently to the pages that matter most.',
        priority: 2,
        affectedUrls: highOutgoingPages.map((p) => p.url),
        timeToFix: '1 to 2 hours',
        difficulty: 'medium',
      });
    }
  }

  // --- Pagination Analysis ---
  // Google no longer uses rel=next/prev, and keyword scans for "scroll" or
  // "infinite" in the HTML cannot tell whether content is crawlable, so there
  // is nothing reliable to report here from a small HTML crawl.

  private analyzePagination(_pages: PageData[], _issues: AuditIssue[]) {
    return;
  }

  // --- Duplicate Content Detection ---
  // There is no duplicate content penalty. Duplicates split signals between
  // URLs and make Google pick one version to show.

  private analyzeDuplicateContent(pages: PageData[], issues: AuditIssue[]) {
    // One entry per real page: two crawled URLs that ended up at the same
    // address are the same page, not duplicates.
    const seen = new Set<string>();
    const crawledKeys = new Set(pages.map((p) => urlKey(p.finalUrl || p.url)));
    const unique = pages.filter((p) => {
      const key = urlKey(p.finalUrl || p.url);
      if (seen.has(key)) return false;
      seen.add(key);
      // A page whose canonical points to another crawled page has already
      // told Google it is a copy, so it is not a duplicate problem.
      const canonical = (p.meta.canonical || '').trim();
      if (canonical) {
        const target = urlKey(canonical, p.finalUrl || p.url);
        if (target !== key && crawledKeys.has(target)) return false;
      }
      return true;
    });

    if (unique.length < 2) return;

    // Check for duplicate titles
    const titleMap: Map<string, string[]> = new Map();
    for (const page of unique) {
      const title = (page.title || page.meta.title || '').trim();
      if (title) {
        const existing = titleMap.get(title) || [];
        existing.push(page.url);
        titleMap.set(title, existing);
      }
    }

    const duplicateTitles = [...titleMap.entries()].filter(([, urls]) => urls.length > 1);
    if (duplicateTitles.length > 0) {
      const totalDupPages = duplicateTitles.reduce((sum, [, urls]) => sum + urls.length, 0);
      issues.push({
        id: 'tech-duplicate-titles',
        category: 'seo',
        type: 'duplicate_content',
        severity: 'high',
        title: `${duplicateTitles.length} Duplicate Title${duplicateTitles.length > 1 ? 's' : ''} Across ${totalDupPages} Pages`,
        description: `Found ${duplicateTitles.length} title${duplicateTitles.length > 1 ? 's' : ''} used on more than one page, ${totalDupPages} pages in all.`,
        impact: 'Pages with the same title look identical in search results, and Google has a harder time telling which page answers which search. Google may rewrite the titles.',
        suggestion: 'Make every title unique and descriptive. Pattern: [What this page is about] | [Site name]. Example: "Pricing Plans | Brand" vs "Features | Brand" vs "Blog | Brand".',
        priority: 8,
        affectedUrls: duplicateTitles.flatMap(([, urls]) => urls).slice(0, 10),
        timeToFix: '20 to 40 minutes',
        difficulty: 'easy',
      });
    }

    // Check for duplicate meta descriptions
    const descMap: Map<string, string[]> = new Map();
    for (const page of unique) {
      const desc = page.meta.description?.trim() || '';
      if (desc) {
        const existing = descMap.get(desc) || [];
        existing.push(page.url);
        descMap.set(desc, existing);
      }
    }

    const duplicateDescs = [...descMap.entries()].filter(([, urls]) => urls.length > 1);
    if (duplicateDescs.length > 0) {
      const totalDupPages = duplicateDescs.reduce((sum, [, urls]) => sum + urls.length, 0);
      issues.push({
        id: 'tech-duplicate-descriptions',
        category: 'seo',
        type: 'duplicate_content',
        severity: 'medium',
        title: `${duplicateDescs.length} Duplicate Meta Description${duplicateDescs.length > 1 ? 's' : ''} Across ${totalDupPages} Pages`,
        description: `Found ${duplicateDescs.length} meta description${duplicateDescs.length > 1 ? 's' : ''} used on more than one page, ${totalDupPages} pages in all.`,
        impact: 'When Google uses these descriptions, your results look the same, so searchers cannot tell which page fits what they want.',
        suggestion: 'Write a unique meta description for each page, about 120 to 160 characters, that summarises what that page offers.',
        priority: 5,
        affectedUrls: duplicateDescs.flatMap(([, urls]) => urls).slice(0, 10),
        timeToFix: '30 to 60 minutes',
        difficulty: 'easy',
      });
    }

    // Near duplicate content: high word overlap in the main content, on pages
    // long enough for the comparison to mean something.
    const MIN_WORDS = 200;
    const bodies = unique.map((p) => {
      const text = (p.mainText || p.text || '').trim();
      return { url: p.url, text, words: text ? text.split(/\s+/).length : 0 };
    });

    const similarPairs: { url1: string; url2: string; similarity: number }[] = [];
    for (let i = 0; i < bodies.length; i++) {
      if (bodies[i].words < MIN_WORDS) continue;
      for (let j = i + 1; j < bodies.length; j++) {
        if (bodies[j].words < MIN_WORDS) continue;
        const similarity = this.calculateTextSimilarity(bodies[i].text, bodies[j].text);
        if (similarity > 0.7) {
          similarPairs.push({
            url1: bodies[i].url,
            url2: bodies[j].url,
            similarity: Math.round(similarity * 100),
          });
        }
      }
    }

    if (similarPairs.length > 0) {
      similarPairs.sort((a, b) => b.similarity - a.similarity);
      issues.push({
        id: 'tech-near-duplicate',
        category: 'seo',
        type: 'duplicate_content',
        severity: 'medium',
        title: `${similarPairs.length} Near Duplicate Page Pair${similarPairs.length > 1 ? 's' : ''}`,
        description: similarPairs.map((p) => `${p.url1} and ${p.url2} share ${p.similarity}% of their main content words.`).join(' '),
        impact: 'There is no penalty, but when pages are this similar Google usually shows only one of them, and you do not get to choose which.',
        suggestion: 'If the pages serve the same purpose, merge them or point the weaker one\'s canonical at the stronger one. If they serve different searches, give each its own angle, examples and detail.',
        priority: 5,
        affectedUrls: [...new Set(similarPairs.flatMap((p) => [p.url1, p.url2]))].slice(0, 10),
        timeToFix: '1 to 3 hours',
        difficulty: 'medium',
      });
    }
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));

    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);

    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  // --- URL Parameter Analysis ---

  private analyzeURLParameters(pages: PageData[], issues: AuditIssue[]) {
    const parsed = pages
      .map((p) => {
        try {
          return { url: p.url, params: new URL(p.url).searchParams };
        } catch {
          return null;
        }
      })
      .filter((p): p is { url: string; params: URLSearchParams } => p !== null && [...p.params.keys()].length > 0);

    if (parsed.length === 0) return;

    // Check for session/tracking parameters
    const sessionParams = ['sessionid', 'jsessionid', 'phpsessid', 'sid', 'utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid', 'ref'];
    const hasParam = (params: URLSearchParams, names: string[]) =>
      [...params.keys()].some((k) => names.includes(k.toLowerCase()));
    const pagesWithSessionParams = parsed.filter((p) => hasParam(p.params, sessionParams));

    if (pagesWithSessionParams.length > 0) {
      issues.push({
        id: 'tech-session-params',
        category: 'seo',
        type: 'url_structure',
        severity: 'medium',
        title: `${pagesWithSessionParams.length} URL${pagesWithSessionParams.length > 1 ? 's' : ''} with Session or Tracking Parameters`,
        description: `Internal links lead to ${pagesWithSessionParams.length} URL${pagesWithSessionParams.length > 1 ? 's' : ''} carrying session IDs or tracking parameters (UTM, fbclid, gclid).`,
        impact: 'Each variation is a separate address for the same content, so crawlers may fetch many copies and your analytics campaign data gets polluted by internal clicks.',
        suggestion: 'Point canonicals at the clean URL and keep tracking parameters off internal links. Use cookies for sessions instead of IDs in the URL.',
        priority: 6,
        affectedUrls: pagesWithSessionParams.map(p => p.url).slice(0, 5),
        timeToFix: '30 to 60 minutes',
        difficulty: 'medium',
      });
    }

    // Check for sort/filter parameters. Pagination (?page=2) is not a filter:
    // paginated pages are normal, indexable pages.
    const filterParams = ['sort', 'order', 'filter', 'category', 'brand', 'price', 'size', 'color'];
    const pagesWithFilterParams = parsed.filter((p) => hasParam(p.params, filterParams));

    if (pagesWithFilterParams.length > 0) {
      issues.push({
        id: 'tech-filter-params',
        category: 'seo',
        type: 'url_structure',
        severity: 'low',
        title: `${pagesWithFilterParams.length} Filter or Sort Parameter URL${pagesWithFilterParams.length > 1 ? 's' : ''} Detected`,
        description: `Found ${pagesWithFilterParams.length} URL${pagesWithFilterParams.length > 1 ? 's' : ''} with sort or filter parameters. These often show the same or nearly the same content as the unfiltered page.`,
        impact: 'Sites with many filters can produce a very large number of URL combinations, and crawlers can spend their time on them instead of your main pages.',
        suggestion: 'Pick one approach per URL: a canonical or noindex for thin filter pages, or a robots.txt Disallow for crawl waste, never both. Google cannot see a canonical or noindex on a page robots.txt blocks.',
        priority: 3,
        affectedUrls: pagesWithFilterParams.map(p => p.url).slice(0, 5),
        timeToFix: '1 to 2 hours',
        difficulty: 'hard',
      });
    }
  }

  // --- HTTP Status Code Analysis ---

  private analyzeStatusCodes(pages: PageData[], issues: AuditIssue[]) {
    const serverErrors = pages.filter(p => p.statusCode >= 500);
    if (serverErrors.length > 0) {
      // One failing subpage can be a passing glitch. Most of the site failing is not.
      const widespread = serverErrors.length * 2 >= pages.length;
      issues.push({
        id: 'tech-server-errors',
        category: 'technical',
        type: 'broken_link',
        severity: widespread ? 'critical' : 'high',
        title: `${serverErrors.length} Server Error${serverErrors.length > 1 ? 's' : ''} (5xx)`,
        description: `${serverErrors.length > 1 ? 'These pages' : 'This page'} returned a server error when we requested ${serverErrors.length > 1 ? 'them' : 'it'}.`,
        impact: 'Visitors and crawlers get an error page. If 5xx errors persist, Google slows its crawling and can eventually drop the affected pages.',
        suggestion: 'Check the server or hosting logs for the error at the time of the audit. Common causes are application errors, database timeouts and memory limits. Set up uptime monitoring so you hear about it first.',
        priority: 10,
        affectedUrls: serverErrors.map(p => `${p.url} (HTTP ${p.statusCode})`),
        timeToFix: '30 minutes to a few hours',
        difficulty: 'hard',
      });
    }
  }

  // --- Structured Data Validation ---
  // Google's own rules: Organization and Article have only recommended
  // properties. Product needs a name plus at least one of offers, review or
  // aggregateRating for a product snippet.

  private analyzeStructuredData(pages: PageData[], issues: AuditIssue[]) {
    // JSON-LD blocks that could not be parsed at all
    const unreadable = pages.filter((p) => (p.structuredDataErrors || 0) > 0);
    if (unreadable.length > 0) {
      const blocks = unreadable.reduce((sum, p) => sum + p.structuredDataErrors, 0);
      issues.push({
        id: 'tech-schema-invalid-json',
        category: 'seo',
        type: 'missing_schema',
        severity: 'medium',
        title: 'Structured data block could not be read (invalid JSON)',
        description: `${blocks} JSON-LD block${blocks > 1 ? 's' : ''} on ${unreadable.length} page${unreadable.length > 1 ? 's' : ''} could not be parsed. A stray comma, an unescaped quote or a template placeholder usually causes this.`,
        impact: 'Search engines skip a JSON-LD block they cannot parse, so none of the markup in it counts.',
        suggestion: 'Paste the page into Google\'s Rich Results Test or the Schema Markup Validator to find the syntax error, then fix the template that writes the block.',
        priority: 6,
        affectedUrls: unreadable.map((p) => p.url),
        timeToFix: '15 to 30 minutes',
        difficulty: 'easy',
      });
    }

    // Findings are grouped by id so a problem repeated across pages is reported once.
    const found = new Map<string, AuditIssue>();
    const add = (issue: AuditIssue, url: string) => {
      const existing = found.get(issue.id);
      if (existing) {
        if (!existing.affectedUrls?.includes(url)) existing.affectedUrls = [...(existing.affectedUrls || []), url];
        return;
      }
      found.set(issue.id, { ...issue, affectedUrls: [url] });
    };
    const isMissing = (json: Record<string, unknown>, key: string) => {
      const v = json[key];
      return v === undefined || v === null || (typeof v === 'string' && v.trim() === '') || (Array.isArray(v) && v.length === 0);
    };
    const emptyValues: { url: string; count: number }[] = [];

    for (const page of pages) {
      let emptyOnPage = 0;

      for (const schema of page.structured_data) {
        // JSON-LD allows @type to be a string OR an array of strings, and some
        // sites emit neither. Normalise before touching it.
        const type = normaliseSchemaType(schema.type);
        const json = schema.json;

        // Empty values, counted by walking the JSON-LD tree. Microdata items
        // are skipped: their values come from text and are often empty by design.
        if ('@type' in json || '@context' in json) emptyOnPage += countEmptyValues(json);

        if (!type) continue;

        // Organization schema
        if (type.includes('organization') || type.includes('localbusiness')) {
          const missing = ['name', 'url'].filter((r) => isMissing(json, r));
          if (missing.length > 0) {
            add({
              id: `tech-schema-org-${missing.join('-')}`,
              category: 'seo',
              type: 'missing_schema',
              severity: 'low',
              title: 'Organization Schema Missing Recommended Fields',
              description: `Organization or LocalBusiness schema has no ${missing.join(' or ')}. Google lists these as recommended properties, not required ones.`,
              impact: 'Recommended properties help Google connect the markup to your business, for example for the logo and name it shows.',
              suggestion: 'Add "name" and "url". Other useful recommended properties: "logo", "sameAs" (social profiles), "contactPoint" and "address".',
              priority: 3,
              timeToFix: '15 to 30 minutes',
              difficulty: 'easy',
            }, page.url);
          }
        }

        // Article/BlogPosting schema
        if (type.includes('article') || type.includes('blogposting')) {
          const missing = ['headline', 'author', 'datePublished'].filter((r) => isMissing(json, r));
          if (missing.length > 0) {
            add({
              id: `tech-schema-article-${missing.join('-')}`,
              category: 'seo',
              type: 'missing_schema',
              severity: 'low',
              title: 'Article Schema Missing Recommended Fields',
              description: `Article or BlogPosting schema has no ${missing.join(', ')}. Google lists these as recommended properties for article markup.`,
              impact: 'Without them Google has to work out the headline, author and date from the page itself, and may get them wrong.',
              suggestion: 'Add "headline", "author" (a Person or Organization with a name) and "datePublished" in ISO 8601 format. "image" and "dateModified" are also recommended.',
              priority: 3,
              timeToFix: '15 to 30 minutes',
              difficulty: 'easy',
            }, page.url);
          }
        }

        // Product schema: name, plus at least one of offers, review or aggregateRating
        if (type.includes('product')) {
          const missing: string[] = [];
          if (isMissing(json, 'name')) missing.push('name');
          if (['offers', 'review', 'aggregateRating'].every((r) => isMissing(json, r))) missing.push('offers');
          if (missing.length > 0) {
            add({
              id: `tech-schema-product-${missing.join('-')}`,
              category: 'seo',
              type: 'missing_schema',
              severity: 'medium',
              title: 'Product Schema Missing Required Fields',
              description: `Product schema is missing ${missing.includes('name') ? '"name"' : ''}${missing.length > 1 ? ' and ' : ''}${missing.includes('offers') ? 'all of "offers", "review" and "aggregateRating"' : ''}. Google needs a name plus at least one of offers, review or aggregateRating for a product snippet.`,
              impact: 'Without these, the page is not eligible for product snippets showing price, availability or ratings in search results.',
              suggestion: 'Add "name" and an "offers" block with price, priceCurrency and availability. Add "aggregateRating" or "review" only if real reviews show on the page.',
              priority: 6,
              timeToFix: '20 to 40 minutes',
              difficulty: 'easy',
            }, page.url);
          }
        }
      }

      if (emptyOnPage > 0) emptyValues.push({ url: page.url, count: emptyOnPage });
    }

    issues.push(...found.values());

    if (emptyValues.length > 0) {
      const total = emptyValues.reduce((sum, e) => sum + e.count, 0);
      issues.push({
        id: 'tech-schema-empty-values',
        category: 'seo',
        type: 'missing_schema',
        severity: 'low',
        title: `${total} Empty Structured Data Value${total > 1 ? 's' : ''}`,
        description: emptyValues.map((e) => `${e.url}: ${e.count} propert${e.count > 1 ? 'ies are' : 'y is'} null or an empty string.`).join(' '),
        impact: 'Empty optional fields cause warnings in the Rich Results Test; fill or remove them. An empty required field can make the page ineligible for that rich result.',
        suggestion: 'Change the code that writes the schema so it leaves out a property when there is no value, instead of writing null or "". Then check the page in Google\'s Rich Results Test.',
        priority: 3,
        affectedUrls: emptyValues.map((e) => e.url),
        timeToFix: '20 to 40 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Link Depth Analysis ---
  // Click depth matters, not folder depth. A small crawl that starts from
  // homepage links cannot measure click depth, so only URL shape is reported,
  // at low severity.

  private analyzeLinkDepth(pages: PageData[], issues: AuditIssue[]) {
    if (pages.length < 2) return;

    const deepPages = pages.filter(p => {
      try {
        const pathSegments = new URL(p.url).pathname.split('/').filter(s => s);
        return pathSegments.length > 4; // More than 4 directory levels deep
      } catch {
        return false;
      }
    });

    if (deepPages.length > 0) {
      issues.push({
        id: 'tech-deep-pages',
        category: 'seo',
        type: 'internal_linking',
        severity: 'low',
        title: `${deepPages.length} Page${deepPages.length > 1 ? 's' : ''} More Than 4 Folders Deep`,
        description: `Found ${deepPages.length} URL${deepPages.length > 1 ? 's' : ''} with more than 4 folder levels in the path.`,
        impact: 'Folder depth itself is not a ranking problem; make sure important pages are linked within a few clicks of the homepage.',
        suggestion: 'Link important pages from the homepage, main navigation or hub pages, and add breadcrumbs. Do not change live URLs just to flatten them.',
        priority: 2,
        affectedUrls: deepPages.map(p => p.url).slice(0, 5),
        timeToFix: '30 minutes',
        difficulty: 'easy',
      });
    }

    // Check URL length
    const longUrls = pages.filter(p => p.url.length > 100);
    if (longUrls.length > 0) {
      issues.push({
        id: 'tech-long-urls',
        category: 'seo',
        type: 'url_structure',
        severity: 'low',
        title: `${longUrls.length} Long URL${longUrls.length > 1 ? 's' : ''}`,
        description: `Found ${longUrls.length} URL${longUrls.length > 1 ? 's' : ''} longer than 100 characters.`,
        impact: 'Long URLs are harder to read, remember and share. Google usually shows a shortened breadcrumb in results, so this is a minor issue.',
        suggestion: 'Use short, readable slugs for new pages. Do not change live URLs just to shorten them; if you do, add 301 redirects.',
        priority: 2,
        affectedUrls: longUrls.map(p => p.url).slice(0, 5),
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Analytics ---
  // A tip only. Analytics does not affect rankings, and tags loaded later by a
  // tag manager or by scripts, or analytics run on the server, are invisible
  // in the HTML, so a missing tag here proves nothing.

  private analyzeAnalytics(pages: PageData[], issues: AuditIssue[]) {
    const home = pages[0];
    if (!home || !(home.html || '').trim()) return;
    if (detectAnalytics(home.html).length > 0) return;

    issues.push({
      id: 'no_analytics',
      category: 'technical',
      type: 'missing_analytics',
      severity: 'low',
      informational: true,
      title: 'No Analytics Tag Found',
      description: 'We did not find a common analytics tag in the homepage HTML.',
      impact: 'Analytics has no effect on rankings, but without it you cannot see how many people visit, where they come from or what they do. Tags loaded later by a tag manager or by other scripts, and analytics that runs on the server, are invisible to us, so ignore this if you already measure traffic.',
      suggestion: 'If you do not measure visits yet, add an analytics tool such as Google Analytics, Plausible, Fathom, Matomo, Cloudflare Web Analytics or Vercel Web Analytics, and connect Google Search Console to see search traffic. If you already measure traffic, ignore this.',
      url: home.url,
      priority: 2,
      affectedUrls: [home.url],
      fixInstructions: [
        { step: 1, title: 'Check whether you already measure traffic', description: 'Look in your host dashboard, CDN and tag manager. Many hosts offer simple visitor stats that need no tag in the page.' },
        { step: 2, title: 'Pick a tool', description: 'Choose one that fits your privacy needs. Cookie free tools such as Plausible or Cloudflare Web Analytics often need no cookie banner; Google Analytics usually does in the EU and UK.' },
        { step: 3, title: 'Add the tag to every page', description: 'Put the snippet in your shared layout so it loads on every page, then check the tool shows your own visit.' },
        { step: 4, title: 'Connect Search Console', description: 'Google Search Console shows the searches that bring people to your site, which no analytics tag can.' }
      ],
      timeToFix: '20 minutes',
      difficulty: 'easy',
    });
  }

  // --- Helpers ---

  private createScore(score: number, totalChecks: number, passedChecks: number, issues: number): AuditScore {
    return {
      category: 'technical',
      score: Math.min(100, Math.max(0, Math.round(score))),
      maxScore: totalChecks,
      issues,
      criticalIssues: 0,
      passed: passedChecks,
      failed: totalChecks - passedChecks,
    };
  }

  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'critical': return 20;
      case 'high': return 12;
      case 'medium': return 6;
      case 'low': return 2;
      default: return 0;
    }
  }
}


/**
 * Turn whatever a page put in @type into a single lowercase string.
 * Accepts "Organization", ["Organization","LocalBusiness"], or junk.
 * Returns '' when there is nothing usable, so callers can skip the entry.
 */
function normaliseSchemaType(raw: unknown): string {
  if (typeof raw === 'string') return raw.toLowerCase();
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === 'string').join(' ').toLowerCase();
  }
  return '';
}

/** Same site when the host matches, with or without "www.". */
function siteKey(host: string): string {
  return host.toLowerCase().replace(/^www\./, '');
}

/**
 * Compare URLs the way a person would: no fragment, no trailing slash, www
 * and the bare host treated as one. The protocol is ignored unless asked for.
 */
function urlKey(href: string, base?: string, keepProtocol = false): string {
  try {
    const u = new URL(href, base);
    const path = u.pathname.replace(/\/+$/, '') || '/';
    const port = u.port ? `:${u.port}` : '';
    return `${keepProtocol ? `${u.protocol}//` : ''}${siteKey(u.hostname)}${port}${path}${u.search}`;
  } catch {
    return href.trim();
  }
}

/** Second level suffixes such as co.uk or com.au, where the registrable domain has three labels. */
const SECOND_LEVEL_SUFFIXES = new Set(['co', 'com', 'net', 'org', 'gov', 'edu', 'ac', 'ne', 'or', 'go', 'gob', 'nic']);

/** Approximate registrable domain: example.com, or example.co.uk. Good enough to tell sites apart. */
function registrableDomain(host: string): string {
  const labels = siteKey(host).split('.').filter(Boolean);
  if (labels.length <= 2) return labels.join('.');
  const tld = labels[labels.length - 1];
  const second = labels[labels.length - 2];
  const take = tld.length === 2 && SECOND_LEVEL_SUFFIXES.has(second) ? 3 : 2;
  return labels.slice(-take).join('.');
}

/** Directives that take a value after a colon, so "max-snippet: 50" is not a user agent. */
const VALUED_ROBOTS_DIRECTIVES = new Set(['unavailable_after', 'max-snippet', 'max-image-preview', 'max-video-preview']);

/** True when meta robots, meta googlebot or an X-Robots-Tag aimed at Google says noindex (or none). */
function isNoindex(page: PageData): boolean {
  const hit = (directive: string) => {
    const d = directive.trim().toLowerCase();
    return d === 'noindex' || d === 'none';
  };
  for (const value of [page.meta.robots, page.meta.googlebot]) {
    if (value && value.split(',').some(hit)) return true;
  }
  const header = page.meta.xRobotsTag;
  if (header) {
    let agent: string | null = null;
    for (const raw of header.split(',')) {
      let part = raw.trim();
      const scoped = part.match(/^([a-z0-9_.-]+)\s*:\s*(.*)$/i);
      if (scoped && !VALUED_ROBOTS_DIRECTIVES.has(scoped[1].toLowerCase())) {
        agent = scoped[1].toLowerCase();
        part = scoped[2];
      }
      if ((agent === null || agent === 'googlebot') && hit(part)) return true;
    }
  }
  return false;
}

/** HTML with scripts removed, so markup quoted inside JavaScript is not read as tags. */
function htmlWithoutScripts(html: string): string {
  return html.replace(/<script\b[\s\S]*?<\/script\s*>/gi, '');
}

function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!m) return undefined;
  return (m[1] ?? m[2] ?? m[3] ?? '').replace(/&amp;/g, '&');
}

/** href of every <link> whose rel tokens include "canonical". */
function extractCanonicalHrefs(html: string): string[] {
  const tags = htmlWithoutScripts(html).match(/<link\b[^>]*>/gi) || [];
  return tags
    .filter((tag) => (attr(tag, 'rel') || '').toLowerCase().split(/\s+/).includes('canonical'))
    .map((tag) => (attr(tag, 'href') || '').trim());
}

/** Every <link rel="alternate" hreflang="..." href="..."> in the HTML. */
function extractHreflangs(html: string): { lang: string; href: string }[] {
  const tags = htmlWithoutScripts(html).match(/<link\b[^>]*>/gi) || [];
  const out: { lang: string; href: string }[] = [];
  for (const tag of tags) {
    const lang = attr(tag, 'hreflang');
    const href = attr(tag, 'href');
    const rel = (attr(tag, 'rel') || '').toLowerCase().split(/\s+/);
    if (lang !== undefined && href && rel.includes('alternate')) out.push({ lang: lang.trim(), href: href.trim() });
  }
  return out;
}

/** Count properties anywhere in a JSON-LD tree whose value is null or an empty string. */
function countEmptyValues(value: unknown, depth = 0): number {
  if (depth > 20 || value === null || typeof value !== 'object') return 0;
  let count = 0;
  const children = Array.isArray(value) ? value : Object.values(value as Record<string, unknown>);
  for (const child of children) {
    if (child === null || (typeof child === 'string' && child.trim() === '')) {
      if (!Array.isArray(value)) count++;
    } else if (typeof child === 'object') {
      count += countEmptyValues(child, depth + 1);
    }
  }
  return count;
}

/**
 * Where to look for each analytics signature.
 * html: anywhere in the HTML. These are addresses that only appear when the tag is there.
 * script: script src addresses and inline scripts that are code, not page data.
 *   Used for plain words such as "umami" or "mixpanel" that could also be page text.
 * src: script src addresses only.
 */
type AnalyticsScope = 'html' | 'script' | 'src';

const ANALYTICS_SIGNATURES: { name: string; scope: AnalyticsScope; patterns: string[] }[] = [
  { name: 'Google Tag Manager', scope: 'html', patterns: ['googletagmanager.com/gtm.js', 'gtm.js?id=', 'googletagmanager.com/ns.html'] },
  { name: 'Google Analytics', scope: 'html', patterns: ['googletagmanager.com/gtag/js', 'google-analytics.com/analytics.js', 'google-analytics.com/ga.js'] },
  { name: 'Plausible', scope: 'html', patterns: ['plausible.io/js'] },
  { name: 'Fathom', scope: 'html', patterns: ['usefathom.com'] },
  { name: 'Matomo', scope: 'html', patterns: ['matomo.js', 'piwik.js'] },
  { name: 'Cloudflare Web Analytics', scope: 'html', patterns: ['static.cloudflareinsights.com'] },
  { name: 'Vercel Web Analytics', scope: 'html', patterns: ['/_vercel/insights', 'va.vercel-scripts.com'] },
  { name: 'Microsoft Clarity', scope: 'html', patterns: ['clarity.ms'] },
  { name: 'Shopify Analytics', scope: 'html', patterns: ['trekkie', 'shopifyanalytics', 'monorail-edge'] },
  { name: 'Meta Pixel', scope: 'html', patterns: ['connect.facebook.net/en_us/fbevents.js', '/fbevents.js'] },
  { name: 'Yandex Metrica', scope: 'html', patterns: ['mc.yandex.ru'] },
  { name: 'Adobe Analytics', scope: 'html', patterns: ['assets.adobedtm.com'] },
  { name: 'HubSpot', scope: 'html', patterns: ['js.hs-scripts.com', 'js.hs-analytics.net'] },
  { name: 'LinkedIn Insight', scope: 'html', patterns: ['snap.licdn.com'] },
  { name: 'Wix Analytics', scope: 'html', patterns: ['static.parastorage.com/services/wix-thunderbolt'] },
  { name: 'Squarespace Analytics', scope: 'html', patterns: ['static1.squarespace.com/static/vta'] },
  { name: 'Segment', scope: 'html', patterns: ['cdn.segment.com'] },
  { name: 'PostHog', scope: 'script', patterns: ['posthog'] },
  { name: 'Hotjar', scope: 'html', patterns: ['static.hotjar.com'] },
  { name: 'Simple Analytics', scope: 'script', patterns: ['simpleanalytics'] },
  { name: 'Umami', scope: 'html', patterns: ['cloud.umami.is'] },
  { name: 'Umami', scope: 'script', patterns: ['umami'] },
  { name: 'Jetpack Stats', scope: 'html', patterns: ['stats.wp.com'] },
  { name: 'Gauges', scope: 'script', patterns: ['gauges'] },
  { name: 'Heap', scope: 'html', patterns: ['heapanalytics.com'] },
  { name: 'Heap', scope: 'src', patterns: ['heap-'] },
  { name: 'Mixpanel', scope: 'html', patterns: ['cdn.mxpnl.com'] },
  { name: 'Mixpanel', scope: 'script', patterns: ['mixpanel'] },
];

/** Inline scripts that carry page data rather than code, such as Next.js flight data. */
const DATA_SCRIPT = /^\s*\(?\s*(self|window)\.(__next_f|__NEXT_DATA__|__NUXT__|__APOLLO_STATE__|__remixContext|__staticRouterHydrationData)/i;
const DATA_SCRIPT_TYPES = /^(application\/(ld\+)?json|importmap|speculationrules|text\/template|text\/x-template)$/i;

/**
 * Names of the analytics tools whose tags appear in this HTML, for example
 * ['Google Tag Manager', 'Plausible']. Tags that a tag manager or another
 * script adds later are not in the HTML, so an empty list is not proof.
 */
export function detectAnalytics(html: string): string[] {
  const lowerHtml = (html || '').toLowerCase();
  const srcs: string[] = [];
  const code: string[] = [];
  const scriptTag = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let m: RegExpExecArray | null;
  while ((m = scriptTag.exec(lowerHtml)) !== null) {
    const attrs = m[1];
    const src = attr(` ${attrs}`, 'src');
    if (src) srcs.push(src);
    const type = (attr(` ${attrs}`, 'type') || '').trim();
    const body = m[2];
    if (body.trim() && !DATA_SCRIPT_TYPES.test(type) && !DATA_SCRIPT.test(body)) code.push(body);
  }
  const srcText = srcs.join('\n');
  const scriptText = `${srcText}\n${code.join('\n')}`;

  const found: string[] = [];
  for (const sig of ANALYTICS_SIGNATURES) {
    if (found.includes(sig.name)) continue;
    const haystack = sig.scope === 'html' ? lowerHtml : sig.scope === 'script' ? scriptText : srcText;
    if (sig.patterns.some((p) => haystack.includes(p))) found.push(sig.name);
  }
  return found;
}
