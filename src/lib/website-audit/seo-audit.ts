// Technical SEO Audit Module
// Analyzes SEO-related issues on web pages

import type { PageData, AuditIssue, AuditScore } from './types';

/** Rough average width of one title character in Google's desktop results, in pixels. */
const TITLE_PX_PER_CHAR = 9.5;
/** Google cuts desktop titles at roughly this width. */
const TITLE_MAX_PX = 580;

/** Directives that take a value after a colon, so "max-snippet: 50" is not a user agent. */
const VALUED_ROBOTS_DIRECTIVES = new Set([
  'unavailable_after',
  'max-snippet',
  'max-image-preview',
  'max-video-preview',
]);

/**
 * Read robots directives the way Google does: meta robots, meta googlebot and
 * the X-Robots-Tag header all count. The header can hold several comma
 * separated directives and can be scoped to one crawler ("googlebot: noindex").
 * "none" means noindex plus nofollow.
 */
function robotsFlags(page: PageData): { noindex: boolean; nofollow: boolean; sources: string[] } {
  let noindex = false;
  let nofollow = false;
  const sources: string[] = [];

  const apply = (directive: string, source: string) => {
    const d = directive.trim().toLowerCase();
    if (d === 'noindex' || d === 'none') {
      noindex = true;
      if (!sources.includes(source)) sources.push(source);
    }
    if (d === 'nofollow' || d === 'none') nofollow = true;
  };

  const fromMeta = (value: string | undefined, source: string) => {
    if (!value) return;
    value.split(',').forEach((part) => apply(part, source));
  };

  fromMeta(page.meta.robots, `meta robots ("${page.meta.robots}")`);
  fromMeta(page.meta.googlebot, `meta googlebot ("${page.meta.googlebot}")`);

  const header = page.meta.xRobotsTag;
  if (header) {
    const source = `X-Robots-Tag header ("${header}")`;
    // null means the directives apply to every crawler.
    let agent: string | null = null;
    for (const raw of header.split(',')) {
      let part = raw.trim();
      const scoped = part.match(/^([a-z0-9_.-]+)\s*:\s*(.*)$/i);
      if (scoped && !VALUED_ROBOTS_DIRECTIVES.has(scoped[1].toLowerCase())) {
        agent = scoped[1].toLowerCase();
        part = scoped[2];
      }
      if (agent === null || agent === 'googlebot') apply(part, source);
    }
  }

  return { noindex, nofollow, sources };
}

/** Common tracking pixel and beacon addresses. "soundtrack.jpg" does not match. */
const TRACKING_PIXEL_PATTERN = /(^|[/._?=&-])(pixel|track|tracking|beacon)([/._?=&-]|$)|facebook\.com\/tr\b|doubleclick\.net|google-analytics\.com/i;

/** src values of images marked decorative with role="presentation", role="none" or aria-hidden="true". */
function decorativeImageSources(html: string): Set<string> {
  const found = new Set<string>();
  const tags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const decorative =
      /\brole\s*=\s*["']?\s*(presentation|none)\b/i.test(tag) ||
      /\baria-hidden\s*=\s*["']?\s*true\b/i.test(tag);
    if (!decorative) continue;
    const src = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const dataSrc = tag.match(/\bdata-src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    for (const m of [src, dataSrc]) {
      const value = m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
      if (value) found.add(value.replace(/&amp;/g, '&'));
    }
  }
  return found;
}

export class SEOAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];

    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // Title Analysis
    this.analyzeTitle(pages, issues);

    // Meta Description Analysis
    this.analyzeMetaDescription(pages, issues);

    // Heading Structure Analysis
    this.analyzeHeadings(pages, issues);

    // Canonical Tags
    this.analyzeCanonical(pages, issues);

    // Robots Directives
    this.analyzeRobots(pages, issues);

    // URL Structure
    this.analyzeURLStructure(pages, issues);

    // Internal Linking
    this.analyzeInternalLinking(pages, issues);

    // Schema Markup
    this.analyzeSchema(pages, issues);

    // Open Graph Tags
    this.analyzeOpenGraph(pages, issues);

    // Sitemaps are checked properly by the technical module, which fetches them.

    // Alt Tags
    this.analyzeAltTags(pages, issues);

    // These are reported by another module that checks them across the whole
    // crawl, so reporting them here as well counted one problem twice:
    // duplicate titles and descriptions, missing canonicals, long URLs and
    // URL parameters (technical module), skipped heading levels (accessibility,
    // which walks the real heading order).
    const reportedElsewhere = ['duplicate_title_', 'duplicate_meta_', 'missing_canonical_', 'long_url_', 'query_params_', 'heading_hierarchy_'];
    const own = issues.filter((i) => !reportedElsewhere.some((prefix) => i.id.startsWith(prefix)));
    issues.length = 0;
    issues.push(...own);

    // Calculate score
    const totalChecks = 25;
    // A check counts as passed only if it raised no finding at all. Previously this
    // subtracted high and critical issues only, so a site with a dozen medium
    // findings still reported every check as passing.
    const passedChecks = Math.max(0, totalChecks - issues.length);
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  private analyzeTitle(pages: PageData[], issues: AuditIssue[]): void {
    const titles = new Map<string, string[]>();

    pages.forEach((page) => {
      const title = (page.title || page.meta.title || '').trim();
      const url = page.url;

      if (page.titleCount > 1) {
        issues.push({
          id: `multiple_title_${url}`,
          category: 'seo',
          type: 'missing_title',
          severity: 'medium',
          title: 'More than one <title> tag',
          description: `The page at ${url} has ${page.titleCount} <title> tags in its <head>. Browsers and search engines use only one of them, and which one is not guaranteed.`,
          impact: 'Search engines may show a title you did not intend. This usually happens when a theme, a plugin and a framework each add their own title.',
          suggestion: 'Keep exactly one <title> in the <head>. Check your layout, SEO plugin and framework metadata settings for the extra one.',
          url,
          priority: 6,
          affectedUrls: [url],
          timeToFix: '10 minutes',
          difficulty: 'easy',
        });
      }

      if (!title) {
        issues.push({
          id: `missing_title_${url}`,
          category: 'seo',
          type: 'missing_title',
          severity: 'high',
          title: 'Missing Page Title',
          description: `The page at ${url} has no title tag.`,
          impact: 'The title is the main clickable line of your search result and one of the strongest clues to what the page is about. Without one, Google has to make a title up from the page.',
          suggestion: 'Add a unique, descriptive title that says what the page is about, ideally around 30 to 60 characters.',
          url,
          priority: 10,
          affectedUrls: [url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no <title> found...</head>', selector: 'head' }],
          codeSnippet: '<head>\n  <meta charset="UTF-8">\n  <!-- MISSING: <title>Your Page Title</title> -->\n</head>',
          fixInstructions: [
            { step: 1, title: 'Open the page HTML', description: `Edit the HTML file or template for ${url}` },
            { step: 2, title: 'Add title tag', description: 'Inside the <head> section, add: <title>Main Topic | Brand Name</title>' },
            { step: 3, title: 'Keep it short enough to show in full', description: 'Google cuts titles by pixel width (about 580px on desktop), which is roughly 50 to 60 characters.' }
          ],
          timeToFix: '2 minutes',
          difficulty: 'easy',
        });
      } else {
        titles.set(title, [...(titles.get(title) || []), url]);

        const estimatedPx = Math.round(title.length * TITLE_PX_PER_CHAR);

        // Check title length
        if (title.length < 15) {
          issues.push({
            id: `short_title_${url}`,
            category: 'seo',
            type: 'missing_title',
            severity: 'low',
            title: 'Title Too Short',
            description: `The title "${title}" is only ${title.length} characters.`,
            impact: 'A very short title gives searchers little reason to click and gives Google little context about the page.',
            suggestion: 'Describe the page in a few more words, for example the main topic followed by your brand name.',
            url,
            priority: 4,
          });
        } else if (estimatedPx > TITLE_MAX_PX) {
          issues.push({
            id: `long_title_${url}`,
            category: 'seo',
            type: 'missing_title',
            severity: 'low',
            title: 'Title May Be Cut Short in Search Results',
            description: `The title is ${title.length} characters, roughly ${estimatedPx}px wide in Google's desktop results.`,
            impact: 'Google cuts titles by pixel width (about 580px) and may rewrite them. The end of this title may not show.',
            suggestion: 'Put the most important words first so they show even if the end is cut. Shorten it if the ending matters.',
            url,
            priority: 3,
            affectedUrls: [url],
            affectedElements: [{ tag: 'title', attributes: {}, outerHTML: `<title>${title.substring(0, 40)}...</title>`, selector: 'title' }],
            codeSnippet: `<title>${title}</title>`,
            fixInstructions: [
              { step: 1, title: 'Identify the key message', description: 'Decide what the page is about in a few words.' },
              { step: 2, title: 'Rewrite the title', description: 'Lead with that message and keep it to about 50 to 60 characters. Example: "Main Topic | Brand"' }
            ],
            timeToFix: '2 minutes',
            difficulty: 'easy',
          });
        }
      }
    });

    // Check for duplicate titles
    titles.forEach((urls, title) => {
      if (urls.length > 1) {
        issues.push({
          id: `duplicate_title_${title.substring(0, 20)}`,
          category: 'seo',
          type: 'duplicate_title',
          severity: 'high',
          title: 'Duplicate Page Titles',
          description: `${urls.length} pages share the same title: "${title.substring(0, 50)}..."`,
          impact: 'When several pages share a title, searchers cannot tell them apart and Google has a harder time picking the right page for a query. Google may also rewrite the titles.',
          suggestion: 'Give each page a unique title that reflects its own content.',
          element: urls.join(', '),
          priority: 8,
          affectedUrls: urls,
          affectedElements: urls.map(() => ({ tag: 'title', attributes: {}, outerHTML: `<title>${title.substring(0, 30)}...</title>`, selector: 'title' })),
          codeSnippet: `<title>${title}</title>`,
          fixInstructions: [
            { step: 1, title: 'Identify each page\'s unique value', description: 'Decide what makes each page different and what a searcher would look for to find it.' },
            { step: 2, title: 'Rewrite each title', description: 'Example: "Services" → "Web Design Services in Austin | YourBrand" vs "Pricing" → "Web Design Pricing | YourBrand"' }
          ],
          timeToFix: '10 minutes',
          difficulty: 'easy',
        });
      }
    });
  }

  private analyzeMetaDescription(pages: PageData[], issues: AuditIssue[]): void {
    const descriptions = new Map<string, string[]>();

    pages.forEach((page, index) => {
      const description = page.meta.description?.trim() || '';
      const url = page.url;
      const isHome = index === 0;

      if (!description) {
        issues.push({
          id: `missing_meta_${url}`,
          category: 'seo',
          type: 'missing_meta_description',
          severity: isHome ? 'medium' : 'low',
          title: 'Missing Meta Description',
          description: `The page at ${url} has no meta description tag.`,
          impact: 'Google often uses the meta description as the snippet under your result. Without one, it picks text from the page, which may be less useful to searchers. It is not a ranking factor.',
          suggestion: 'Write a short, accurate summary of the page, about 120 to 160 characters, that tells searchers what they will get.',
          url,
          priority: isHome ? 6 : 4,
          affectedUrls: [url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no meta description found...</head>', selector: 'head' }],
          codeSnippet: '<head>\n  <meta charset="UTF-8">\n  <!-- MISSING: <meta name="description" content="..."> -->\n</head>',
          fixInstructions: [
            { step: 1, title: 'Write a clear description', description: 'Say what the page offers and why it is useful, in plain words. Keep it to about 120 to 160 characters.' },
            { step: 2, title: 'Add the meta tag', description: '<meta name="description" content="Learn how our web design services help Austin businesses grow. Free consultation.">' }
          ],
          timeToFix: '3 minutes',
          difficulty: 'easy',
        });
      } else {
        descriptions.set(description, [...(descriptions.get(description) || []), url]);

        // Check description length
        if (description.length < 50) {
          issues.push({
            id: `short_meta_${url}`,
            category: 'seo',
            type: 'missing_meta_description',
            severity: 'low',
            title: 'Meta Description Too Short',
            description: `The meta description is only ${description.length} characters.`,
            impact: 'A very short description may not tell searchers enough, so Google is more likely to replace it with text from the page.',
            suggestion: 'Expand it into one or two full sentences that summarise the page.',
            url,
            priority: 3,
          });
        } else if (description.length > 160) {
          issues.push({
            id: `long_meta_${url}`,
            category: 'seo',
            type: 'missing_meta_description',
            severity: 'low',
            title: 'Meta Description May Be Cut Short',
            description: `The meta description is ${description.length} characters.`,
            impact: 'This is not an error. Google cuts snippets by pixel width (around 920px on desktop, roughly 150 to 160 characters) and often rewrites them anyway, so the end may not show.',
            suggestion: 'Put the most useful information in the first 150 characters.',
            url,
            priority: 2,
          });
        }
      }
    });

    // Check for duplicate descriptions
    descriptions.forEach((urls, description) => {
      if (urls.length > 1) {
        issues.push({
          id: `duplicate_meta_${description.substring(0, 20)}`,
          category: 'seo',
          type: 'duplicate_meta_description',
          severity: 'medium',
          title: 'Duplicate Meta Descriptions',
          description: `${urls.length} pages share the same meta description.`,
          impact: 'Identical snippets make your results look the same, so searchers cannot tell which page fits what they want.',
          suggestion: 'Write a unique description for each page.',
          element: urls.join(', '),
          priority: 5,
        });
      }
    });
  }

  private analyzeHeadings(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const url = page.url;
      const h1s = page.meta.h1.filter((text) => text.trim() !== '');
      const h1Count = h1s.length;

      // Check for missing H1
      if (h1Count === 0) {
        issues.push({
          id: `missing_h1_${url}`,
          category: 'seo',
          type: 'missing_h1',
          severity: 'medium',
          title: 'Missing H1 Tag',
          description: `The page at ${url} has no H1 heading with text.`,
          impact: 'A clear main heading tells visitors and screen reader users what the page is about, and it is one of the clues Google uses to understand the topic.',
          suggestion: 'Add a main H1 heading near the top of the content that describes the page topic in plain words.',
          url,
          priority: 6,
          affectedUrls: [url],
          affectedElements: [{ tag: 'body', attributes: {}, outerHTML: '<body>...no <h1> found...</body>', selector: 'body' }],
          codeSnippet: '<!-- MISSING -->\n<h1>Your Main Topic Heading</h1>\n<p>Your content starts here...</p>',
          fixInstructions: [
            { step: 1, title: 'Identify the main topic', description: 'What is the single most important topic of this page?' },
            { step: 2, title: 'Write an H1', description: 'Add <h1>Main Topic</h1> as the first heading in your content area.' },
            { step: 3, title: 'Keep it natural', description: 'Write it for people first. Use the words a searcher would use, without forcing keywords in.' }
          ],
          timeToFix: '3 minutes',
          difficulty: 'easy',
        });
      }

      // Check for multiple H1s
      if (h1Count > 1) {
        issues.push({
          id: `multiple_h1_${url}`,
          category: 'seo',
          type: 'multiple_h1',
          severity: 'low',
          title: 'Multiple H1 Tags',
          description: `The page has ${h1Count} H1 tags: ${h1s.slice(0, 3).join(', ')}${h1Count > 3 ? '...' : ''}`,
          impact: 'Multiple H1s are fine for Google. For people, one clear main heading makes the page easier to scan and easier to follow with a screen reader.',
          suggestion: 'Keep one clear main heading for people. If the other H1s are really section titles, consider making them H2s.',
          url,
          priority: 2,
          affectedUrls: [url],
          affectedElements: h1s.map((text, i) => ({ tag: 'h1', attributes: {}, outerHTML: `<h1>${text.substring(0, 40)}${text.length > 40 ? '...' : ''}</h1>`, selector: `h1:nth-of-type(${i + 1})` })),
          codeSnippet: `<h1>${h1s[0]}</h1>\n<h1>${h1s[1] || 'Second H1'}</h1>\n<!-- Optional: change the second H1 to an H2 -->`,
          fixInstructions: [
            { step: 1, title: 'Pick the main heading', description: 'Decide which H1 best describes the whole page.' },
            { step: 2, title: 'Review the others', description: 'If another H1 introduces a section, an H2 usually reads better.' }
          ],
          timeToFix: '5 minutes',
          difficulty: 'easy',
        });
      }

      // Check heading hierarchy
      const hasH2 = page.meta.h2.length > 0;
      const hasH3 = page.meta.h3.length > 0;

      if (h1Count > 0 && !hasH2 && hasH3) {
        issues.push({
          id: `heading_hierarchy_${url}`,
          category: 'seo',
          type: 'heading_hierarchy',
          severity: 'medium',
          title: 'Skipped Heading Level',
          description: 'H3 tags found without H2 tags.',
          impact: 'Skipping heading levels makes the outline harder to follow for screen reader users.',
          suggestion: 'Use H2 before H3 to keep a logical heading order.',
          url,
          priority: 4,
        });
      }
    });
  }

  private analyzeCanonical(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // A noindex page does not need a canonical: it is not meant to be indexed at all.
      if (robotsFlags(page).noindex) return;
      if (!page.meta.canonical?.trim()) {
        issues.push({
          id: `missing_canonical_${page.url}`,
          category: 'seo',
          type: 'missing_canonical',
          severity: 'medium',
          title: 'Missing Canonical URL',
          description: `The page at ${page.url} has no canonical tag.`,
          impact: 'When the same page can be reached at several addresses (with or without www, with tracking parameters), Google picks the main one itself. A self referencing canonical makes your choice clear and keeps ranking signals on one URL. There is no penalty for duplicate URLs.',
          suggestion: 'Add a canonical tag that points to the preferred address of this page.',
          url: page.url,
          priority: 5,
          affectedUrls: [page.url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no canonical link found...</head>', selector: 'head' }],
          codeSnippet: '<!-- ADD THIS -->\n<link rel="canonical" href="https://example.com/page-url" />',
          fixInstructions: [
            { step: 1, title: 'Determine the preferred URL', description: 'Use HTTPS, and whichever host (with or without www) and trailing slash style you use consistently across the site.' },
            { step: 2, title: 'Add the canonical tag', description: 'Place <link rel="canonical" href="PREFERRED_URL" /> inside <head>.' }
          ],
          timeToFix: '2 minutes',
          difficulty: 'easy',
        });
      }
    });
  }

  private analyzeRobots(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page, index) => {
      const flags = robotsFlags(page);
      if (!flags.noindex) return;

      const isHome = index === 0;
      const where = flags.sources.join(' and ');
      issues.push({
        id: isHome ? 'noindex_home' : `noindex_page_${page.url}`,
        category: 'seo',
        type: 'url_structure',
        severity: isHome ? 'critical' : 'medium',
        title: isHome ? 'Homepage Blocked from Indexing' : 'Page Blocked from Indexing',
        description: `${page.url} carries a noindex directive in the ${where}.`,
        impact: isHome
          ? 'Google will drop the homepage from search results. This is almost never intended on a live site.'
          : 'This page will not appear in Google search results. If this is intentional, ignore it.',
        suggestion: isHome
          ? 'Remove noindex (or "none") from the meta robots tag, the meta googlebot tag and the X-Robots-Tag header. Check SEO plugin settings and any "discourage search engines" option left on from staging.'
          : 'If this page should be found in Google, remove noindex from the meta robots tag, the meta googlebot tag and the X-Robots-Tag header. If this is intentional, ignore it.',
        url: page.url,
        priority: isHome ? 10 : 5,
        affectedUrls: [page.url],
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    });
  }

  private analyzeURLStructure(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      let url: URL;
      try {
        url = new URL(page.url);
      } catch {
        return;
      }
      const path = url.pathname;

      // Check for URL length
      if (path.length > 100) {
        issues.push({
          id: `long_url_${page.url}`,
          category: 'seo',
          type: 'url_structure',
          severity: 'low',
          title: 'Long URL Structure',
          description: `URL path is ${path.length} characters: ${path.substring(0, 50)}...`,
          impact: 'Very long URLs are harder to read and share.',
          suggestion: 'Use short, descriptive slugs for new pages. Do not change live URLs just to shorten them.',
          url: page.url,
          priority: 2,
        });
      }

      // Check for query parameters
      if (url.search.length > 0 && !url.search.includes('?page=')) {
        issues.push({
          id: `query_params_${page.url}`,
          category: 'seo',
          type: 'url_structure',
          severity: 'low',
          title: 'URL Contains Query Parameters',
          description: `URL has query parameters: ${url.search}`,
          impact: 'URLs with many parameters can create several addresses for the same content.',
          suggestion: 'Use clean URLs where you can, and point the canonical at the clean version.',
          url: page.url,
          priority: 2,
        });
      }

      // Check for underscores in URL
      if (path.includes('_')) {
        issues.push({
          id: `underscore_url_${page.url}`,
          category: 'seo',
          type: 'url_structure',
          severity: 'low',
          title: 'URL Contains Underscores',
          description: 'URL path contains underscores instead of hyphens.',
          impact: 'Google recommends hyphens to separate words in URLs, because it reads them as word breaks.',
          suggestion: 'Use hyphens (-) instead of underscores (_) in new URLs. Do not change live URLs just for this; if you do, add 301 redirects.',
          url: page.url,
          priority: 1,
        });
      }
    });
  }

  private analyzeInternalLinking(pages: PageData[], issues: AuditIssue[]): void {
    // Only a handful of pages are crawled, all found through homepage links, so
    // orphan pages cannot be measured here. Only the link count per page is.
    let totalInternalLinks = 0;

    pages.forEach((page) => {
      page.links.forEach((link) => {
        if (link.isInternal) {
          totalInternalLinks++;
        }
      });
    });

    const avgLinksPerPage = pages.length > 0 ? totalInternalLinks / pages.length : 0;

    if (avgLinksPerPage < 3) {
      issues.push({
        id: 'low_internal_links',
        category: 'seo',
        type: 'internal_linking',
        severity: 'medium',
        title: 'Low Internal Linking',
        description: `Average of ${avgLinksPerPage.toFixed(1)} internal links per page.`,
        impact: 'Internal links help discovery and show which pages matter.',
        suggestion: 'Add more internal links to connect related pages and improve navigation.',
        priority: 5,
      });
    }
  }

  private analyzeSchema(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];

    if (!mainPage || mainPage.structured_data.length === 0) {
      issues.push({
        id: 'missing_schema',
        category: 'seo',
        type: 'missing_schema',
        severity: 'medium',
        title: 'No Structured Data Found',
        description: 'No JSON-LD or microdata structured data was detected on the main page.',
        impact: 'Structured data helps search engines understand your content and makes some pages eligible for rich results.',
        suggestion: 'Add relevant schema markup (Organization, LocalBusiness, Article, etc.) that matches what the page shows.',
        url: mainPage?.url,
        priority: 5,
      });
    }
  }

  private analyzeOpenGraph(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];

    if (!mainPage) return;

    if (!mainPage.meta.ogTitle) {
      issues.push({
        id: 'missing_og_title',
        category: 'seo',
        type: 'missing_og_tags',
        severity: 'low',
        title: 'Missing Open Graph Title',
        description: 'No og:title tag found on the main page.',
        impact: 'When the page is shared on Facebook, LinkedIn or X, the platform has to guess the title, so the preview may look wrong.',
        suggestion: 'Add og:title, og:description, and og:image meta tags for better social sharing.',
        url: mainPage.url,
        priority: 4,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no og:title found...</head>', selector: 'head' }],
        codeSnippet: '<meta property="og:title" content="Your Compelling Title Here" />\n<meta property="og:description" content="Brief description for social sharing" />\n<meta property="og:image" content="https://example.com/og-image.jpg" />',
        fixInstructions: [
          { step: 1, title: 'Add og:title', description: 'Add <meta property="og:title" content="Your Title"> to <head>.' },
          { step: 2, title: 'Add og:description', description: 'Add a clear description of one or two sentences.' },
          { step: 3, title: 'Add og:image', description: 'Use a 1200x630px image for the best display.' }
        ],
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    if (!mainPage.meta.ogDescription) {
      issues.push({
        id: 'missing_og_description',
        category: 'seo',
        type: 'missing_og_tags',
        severity: 'low',
        title: 'Missing Open Graph Description',
        description: 'No og:description tag found on the main page.',
        impact: 'Shared links may not show a description on social platforms.',
        suggestion: 'Add an og:description tag to control how your content appears when shared.',
        url: mainPage.url,
        priority: 3,
      });
    }

    if (!mainPage.meta.ogImage) {
      issues.push({
        id: 'missing_og_image',
        category: 'seo',
        type: 'missing_og_tags',
        severity: 'low',
        title: 'Missing Open Graph Image',
        description: 'No og:image tag found on the main page.',
        impact: 'Shared links will not display an image preview on social platforms.',
        suggestion: 'Add an og:image tag with a relevant, high quality image (1200x630 recommended).',
        url: mainPage.url,
        priority: 4,
      });
    }
  }

  private analyzeAltTags(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const decorative = decorativeImageSources(page.html || '');
      const imagesWithoutAlt = page.images.filter((img) => {
        // alt="" is the correct markup for a decorative image. Only a missing attribute is a problem.
        if (img.alt !== undefined) return false;
        // Tracking pixels are not content.
        if ((img.width !== undefined && img.width <= 2) || (img.height !== undefined && img.height <= 2)) return false;
        if (img.src && TRACKING_PIXEL_PATTERN.test(img.src)) return false;
        // Marked decorative with role="presentation" or aria-hidden="true".
        if (img.src && decorative.has(img.src)) return false;
        return true;
      });

      if (imagesWithoutAlt.length > 0) {
        const severity = imagesWithoutAlt.length > 2 ? 'medium' : 'low';
        const count = imagesWithoutAlt.length;

        issues.push({
          id: `missing_alt_${page.url}`,
          category: 'seo',
          type: 'missing_alt_text',
          severity,
          title: 'Images Missing Alt Text',
          description: `${count} image${count > 1 ? 's' : ''} on ${page.url} ${count > 1 ? 'have' : 'has'} no alt attribute at all.`,
          impact: 'Screen reader users get nothing useful, or the file name, for these images, and search engines have less to go on for image search.',
          suggestion: 'Add descriptive alt text to meaningful images. Use an empty alt="" for decorative images.',
          url: page.url,
          priority: severity === 'medium' ? 5 : 3,
          affectedUrls: [page.url],
          affectedElements: imagesWithoutAlt.slice(0, 5).map((img) => ({
            tag: 'img',
            attributes: { src: img.src || '' },
            outerHTML: `<img src="${img.src || ''}"${img.width ? ` width="${img.width}"` : ''}${img.height ? ` height="${img.height}"` : ''} />`,
            selector: `img[src="${img.src}"]`,
          })),
          codeSnippet: imagesWithoutAlt.slice(0, 3).map(img => `<img src="${img.src}" alt="ADD DESCRIPTIVE TEXT HERE" />`).join('\n'),
          fixInstructions: [
            { step: 1, title: 'Identify meaningful images', description: 'Decorative images (borders, backgrounds) should use alt="".' },
            { step: 2, title: 'Write descriptive alt text', description: 'Describe what the image shows. Example: "Team meeting in modern office" not "image1.jpg".' },
            { step: 3, title: 'Add alt attributes', description: 'Update each <img> tag with appropriate alt text.' }
          ],
          timeToFix: `${Math.max(2, Math.ceil(count * 0.5))} minutes`,
          difficulty: 'easy',
        });
      }
    });
  }

  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'critical': return 15;
      case 'high': return 10;
      case 'medium': return 5;
      case 'low': return 2;
      default: return 1;
    }
  }

  private createScore(score: number, maxScore: number, passed: number, issues: number): AuditScore {
    return {
      category: 'seo',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0, // Will be counted separately
      passed,
      failed: maxScore - passed,
    };
  }
}
