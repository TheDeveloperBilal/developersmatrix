// Deep Technical SEO Audit Module
// Analyzes robots.txt, sitemaps, hreflang, canonical chains, redirects, internal linking structure

import type { PageData, AuditIssue, AuditScore } from './types';

export class TechnicalAuditor {
  private baseUrl: string = '';
  private domain: string = '';

  analyze(pages: PageData[], robotsTxt: string | null, sitemapUrls: string[]): { issues: AuditIssue[]; score: AuditScore } {
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
    this.analyzeRobotsTxt(issues, robotsTxt, pages);
    
    // Sitemap Validation
    this.analyzeSitemap(issues, sitemapUrls, pages);
    
    // Hreflang Detection
    this.analyzeHreflang(pages, issues);
    
    // Canonical Chain Analysis
    this.analyzeCanonicalChains(pages, issues);
    
    // Redirect Chain Detection
    this.analyzeRedirects(pages, issues);
    
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

    // Calculate score
    const totalChecks = 32;
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const passedChecks = Math.max(0, totalChecks - criticalCount * 3 - highCount * 2);
    
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  // --- robots.txt Deep Analysis ---

  private analyzeRobotsTxt(issues: AuditIssue[], robotsTxt: string | null, pages: PageData[]) {
    // Missing robots.txt
    if (!robotsTxt) {
      issues.push({
        id: 'tech-missing-robots',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'high',
        title: 'robots.txt File Not Found',
        description: 'No robots.txt file was found at /robots.txt. This file tells search engine crawlers which pages they can and cannot access. Without it, crawlers may waste resources on non-essential pages.',
        impact: 'Missing robots.txt can cause search engines to crawl unnecessary pages (admin panels, search results, filters), wasting crawl budget and potentially indexing pages you do not want public.',
        suggestion: 'Create a robots.txt file at your domain root. Start with: User-agent: *\nDisallow: /admin/\nDisallow: /search/\nDisallow: /login/\nAllow: /\nSitemap: https://yourdomain.com/sitemap.xml',
        priority: 8,
        affectedUrls: [pages[0]?.url],
        timeToFix: '10-15 minutes',
        difficulty: 'easy',
        estimatedImpact: '+15-25% crawl budget efficiency',
      });
      return;
    }
    
    // Parse robots.txt
    const lines = robotsTxt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const userAgents: string[] = [];
    const disallows: string[] = [];
    const allows: string[] = [];
    const sitemaps: string[] = [];
    const crawlDelays: number[] = [];
    let hasWildcardUA = false;
    
    let currentUA: string | null = null;
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      
      if (lowerLine.startsWith('user-agent:')) {
        currentUA = line.split(':')[1]?.trim() || '';
        userAgents.push(currentUA);
        if (currentUA === '*') hasWildcardUA = true;
      }
      else if (lowerLine.startsWith('disallow:') && currentUA) {
        const path = line.split(':')[1]?.trim() || '';
        disallows.push(path);
      }
      else if (lowerLine.startsWith('allow:') && currentUA) {
        const path = line.split(':')[1]?.trim() || '';
        allows.push(path);
      }
      else if (lowerLine.startsWith('sitemap:')) {
        const url = line.split(':').slice(1).join(':').trim();
        sitemaps.push(url);
      }
      else if (lowerLine.startsWith('crawl-delay:') && currentUA) {
        const delay = parseFloat(line.split(':')[1]?.trim() || '0');
        if (!isNaN(delay)) crawlDelays.push(delay);
      }
    }
    
    // No wildcard User-agent
    if (!hasWildcardUA) {
      issues.push({
        id: 'tech-robots-no-wildcard',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'medium',
        title: 'robots.txt Lacks Wildcard User-agent Directive',
        description: `Your robots.txt has ${userAgents.length} specific user-agent rule${userAgents.length > 1 ? 's' : ''} but no "User-agent: *" catch-all directive. This means unspecified crawlers have no explicit instructions.`,
        impact: 'Without a wildcard directive, unknown crawlers (including new search engines and SEO tools) may crawl unrestricted. This wastes server resources.',
        suggestion: 'Add "User-agent: *\nAllow: /" to the top of your robots.txt to explicitly define default behavior for all unspecified crawlers.',
        priority: 5,
        affectedUrls: [pages[0]?.url],
        timeToFix: '5 minutes',
        difficulty: 'easy',
        estimatedImpact: '+10-15% crawl budget control',
      });
    }
    
    // Missing sitemap in robots.txt
    if (sitemaps.length === 0) {
      issues.push({
        id: 'tech-robots-no-sitemap',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'medium',
        title: 'Sitemap Not Referenced in robots.txt',
        description: 'Your robots.txt file does not reference an XML sitemap. While search engines can find sitemaps through other means, robots.txt is the most reliable discovery path.',
        impact: 'Without a robots.txt sitemap reference, search engines rely on sitemap submission via Search Console or discovery through internal links. This delays indexing of new pages.',
        suggestion: 'Add "Sitemap: https://yourdomain.com/sitemap.xml" (or your actual sitemap URL) to the end of your robots.txt. You can list multiple sitemaps if needed.',
        priority: 6,
        affectedUrls: [pages[0]?.url],
        timeToFix: '2 minutes',
        difficulty: 'easy',
        estimatedImpact: '+5-10% faster new page indexing',
      });
    }
    
    // Disallow conflicts
    const rootDisallowed = disallows.some(d => d === '/' || d === '');
    if (rootDisallowed) {
      // Check if there are Allow rules that might conflict
      const hasRootAllow = allows.some(a => a === '/' || a === '');
      if (!hasRootAllow) {
        issues.push({
          id: 'tech-robots-root-disallowed',
          category: 'seo',
          type: 'missing_robots_txt',
          severity: 'critical',
          title: 'CRITICAL: robots.txt Disallows All Crawling',
          description: 'Your robots.txt contains "Disallow: /" which blocks ALL search engine crawlers from accessing your entire website. This will remove your site from search results.',
          impact: 'This is an emergency-level issue. Your site will be completely de-indexed from Google, Bing, and all other search engines within days. No pages will appear in search results.',
          suggestion: 'REMOVE "Disallow: /" immediately. If you need to block specific directories, use targeted disallows like "Disallow: /admin/", "Disallow: /private/", etc.',
          priority: 10,
          affectedUrls: [pages[0]?.url],
          timeToFix: '2 minutes',
          difficulty: 'easy',
          estimatedImpact: 'Prevents complete search de-indexing',
        });
      }
    }
    
    // Overly broad disallows
    const broadDisallows = disallows.filter(d => d.length <= 3 && d !== '/' && d !== '');
    if (broadDisallows.length > 2) {
      issues.push({
        id: 'tech-robots-broad-disallows',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'medium',
        title: `${broadDisallows.length} Overly Broad Disallow Rules Found`,
        description: `Found ${broadDisallows.length} short disallow rules (${broadDisallows.join(', ')}). Short disallow paths can accidentally block important content.`,
        impact: 'Broad disallows like "/a" block /about, /articles, /assets, etc. This can prevent indexing of valuable content pages.',
        suggestion: 'Review each short disallow rule. Use complete directory names (e.g., "/admin/" not "/a"). Test with Google Search Console robots.txt tester.',
        priority: 5,
        affectedUrls: [pages[0]?.url],
        timeToFix: '10-20 minutes',
        difficulty: 'easy',
        estimatedImpact: '+10-20% crawl coverage improvement',
      });
    }
    
    // Crawl delay too high
    const highCrawlDelays = crawlDelays.filter(d => d > 5);
    if (highCrawlDelays.length > 0) {
      issues.push({
        id: 'tech-robots-high-crawl-delay',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'low',
        title: `High Crawl Delay (${Math.max(...highCrawlDelays)}s) Detected`,
        description: `robots.txt sets a crawl delay of ${Math.max(...highCrawlDelays)} seconds. This significantly slows how often search engines can crawl your site.`,
        impact: 'High crawl delays mean search engines index your new content much slower. Google typically ignores crawl-delay but Bing and others respect it.',
        suggestion: 'Remove Crawl-delay entirely unless you have server capacity issues. Modern servers handle crawler traffic easily. If needed, use server-side rate limiting instead.',
        priority: 3,
        affectedUrls: [pages[0]?.url],
        timeToFix: '2 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-40% faster indexing of new content',
      });
    }
    
    // Missing sitemap reference but sitemap exists elsewhere
    if (sitemaps.length === 0 && sitemapUrls.length > 0) {
      issues.push({
        id: 'tech-robots-sitemap-mismatch',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'low',
        title: 'Sitemap Exists But Not Referenced in robots.txt',
        description: `Found ${sitemapUrls.length} sitemap URL${sitemapUrls.length > 1 ? 's' : ''} (${sitemapUrls.join(', ')}) but robots.txt does not reference them.`,
        impact: 'Sitemap discovery is slower without robots.txt reference. Search engines must find sitemaps through other methods.',
        suggestion: 'Add sitemap references to robots.txt: "Sitemap: [URL]" for each sitemap file.',
        priority: 4,
        affectedUrls: [pages[0]?.url],
        timeToFix: '2 minutes',
        difficulty: 'easy',
        estimatedImpact: '+5-10% faster sitemap discovery',
      });
    }
  }

  // --- Sitemap Validation ---

  private analyzeSitemap(issues: AuditIssue[], sitemapUrls: string[], pages: PageData[]) {
    if (sitemapUrls.length === 0) {
      issues.push({
        id: 'tech-missing-sitemap',
        category: 'seo',
        type: 'missing_sitemap',
        severity: 'high',
        title: 'XML Sitemap Not Found',
        description: 'No XML sitemap was detected. Sitemaps help search engines discover, crawl, and index your pages efficiently. Without one, search engines rely entirely on internal links.',
        impact: 'Missing sitemaps delay indexing of new pages by 3-7 days on average. Search engines may miss deep pages entirely if internal linking is weak.',
        suggestion: 'Create an XML sitemap at /sitemap.xml. Include all indexable pages. Update it automatically when pages are added/removed. Reference it in robots.txt and submit to Google Search Console.',
        priority: 8,
        affectedUrls: [pages[0]?.url],
        timeToFix: '15-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+25-40% faster new page indexing',
      });
      return;
    }
    
    // Check for common sitemap issues (based on sitemap URL patterns)
    for (const sitemapUrl of sitemapUrls) {
      // Sitemap size warning (if URL suggests a large sitemap)
      if (sitemapUrl.includes('index') || sitemapUrl.includes('sitemap-index')) {
        issues.push({
          id: 'tech-sitemap-index',
          category: 'seo',
          type: 'missing_sitemap',
          severity: 'low',
          title: 'Sitemap Index Detected — Validate Child Sitemaps',
          description: `A sitemap index file was found (${sitemapUrl}). While sitemap indexes are correct for large sites, ensure all referenced child sitemaps are valid and updated.`,
          impact: 'Sitemap indexes with broken child sitemaps silently fail. Search engines ignore the entire index if any child is invalid.',
          suggestion: 'Validate each child sitemap referenced in the index. Ensure URLs are correct, not 404, and within the 50,000 URL / 50MB limit per child sitemap.',
          priority: 3,
          affectedUrls: [sitemapUrl],
          timeToFix: '15-30 minutes',
          difficulty: 'easy',
          estimatedImpact: 'Prevents silent sitemap indexing failures',
        });
      }
    }
    
    // Check if pages match sitemap coverage
    const pageCount = pages.length;
    if (pageCount > 1) {
      // Estimate sitemap coverage (rough heuristic)
      const hasMultipleSitemaps = sitemapUrls.length > 1 || sitemapUrls.some(u => u.includes('index'));
      if (!hasMultipleSitemaps && pageCount > 5) {
        issues.push({
          id: 'tech-sitemap-coverage',
          category: 'seo',
          type: 'missing_sitemap',
          severity: 'low',
          title: 'Sitemap Coverage May Be Incomplete',
          description: `Only ${sitemapUrls.length} sitemap file${sitemapUrls.length > 1 ? 's' : ''} found but ${pageCount} pages were crawled. Large sites should split sitemaps into logical categories (posts, products, pages).`,
          impact: 'Large single sitemaps are harder to manage and may exceed the 50,000 URL / 50MB limit. Google prioritizes recently updated pages in smaller sitemaps.',
          suggestion: 'Split into category sitemaps: sitemap-posts.xml, sitemap-pages.xml, sitemap-products.xml. Each under 50,000 URLs. Include lastmod dates on frequently changed pages.',
          priority: 3,
          affectedUrls: sitemapUrls,
          timeToFix: '1-2 hours',
          difficulty: 'medium',
          estimatedImpact: '+10-15% crawl efficiency for large sites',
        });
      }
    }
  }

  // --- Hreflang Analysis ---

  private analyzeHreflang(pages: PageData[], issues: AuditIssue[]) {
    const mainPage = pages[0];
    const html = mainPage.html.toLowerCase();
    
    // Check for hreflang tags
    const hreflangPattern = /<link[^>]*hreflang=["']([^"']*)["'][^>]*>/gi;
    const hreflangs: { lang: string; href: string }[] = [];
    let match;
    
    while ((match = hreflangPattern.exec(mainPage.html)) !== null) {
      const fullTag = match[0];
      const langMatch = fullTag.match(/hreflang=["']([^"']*)["']/i);
      const hrefMatch = fullTag.match(/href=["']([^"']*)["']/i);
      if (langMatch && hrefMatch) {
        hreflangs.push({ lang: langMatch[1], href: hrefMatch[1] });
      }
    }
    
    // Also check for x-default
    const hasXDefault = hreflangs.some(h => h.lang === 'x-default');
    
    // Multi-language sites should have hreflang
    const langIndicators = [
      mainPage.meta.lang,
      ...pages.map(p => p.meta.lang),
    ].filter(Boolean);
    
    const uniqueLangs = [...new Set(langIndicators)];
    
    if (uniqueLangs.length > 1 && hreflangs.length === 0) {
      issues.push({
        id: 'tech-missing-hreflang',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'high',
        title: 'Multi-Language Site Missing hreflang Tags',
        description: `Detected ${uniqueLangs.length} languages (${uniqueLangs.join(', ')}) but no hreflang tags found. Hreflang tells Google which language version to show to which user.`,
        impact: 'Without hreflang, search engines may show the wrong language version to users. This causes 20-40% higher bounce rates from international visitors.',
        suggestion: 'Add hreflang tags in the <head> section for each language variant. Include an x-default fallback. Example: <link rel="alternate" hreflang="en" href="https://example.com/en/page" /> <link rel="alternate" hreflang="x-default" href="https://example.com/page" />',
        priority: 8,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '2-4 hours',
        difficulty: 'hard',
        estimatedImpact: '+20-40% international organic traffic improvement',
      });
    }
    
    // Hreflang present but missing x-default
    if (hreflangs.length > 0 && !hasXDefault) {
      issues.push({
        id: 'tech-hreflang-no-xdefault',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'medium',
        title: 'hreflang Tags Missing x-default Fallback',
        description: `Found ${hreflangs.length} hreflang tag${hreflangs.length > 1 ? 's' : ''} but no "x-default" fallback. The x-default hreflang tells search engines which page to show when no language matches.`,
        impact: 'Without x-default, users with unsupported languages may get a suboptimal or broken experience. Google recommends x-default for all international sites.',
        suggestion: 'Add an x-default hreflang pointing to your main/global landing page: <link rel="alternate" hreflang="x-default" href="https://example.com/" />',
        priority: 5,
        affectedUrls: [mainPage.url],
        timeToFix: '10-20 minutes',
        difficulty: 'easy',
        estimatedImpact: '+5-10% international user experience improvement',
      });
    }
    
    // Hreflang self-referencing check
    if (hreflangs.length > 0) {
      const selfRef = hreflangs.some(h => {
        try {
          const resolved = new URL(h.href, mainPage.url).href;
          return resolved === mainPage.url;
        } catch {
          return false;
        }
      });
      
      if (!selfRef) {
        issues.push({
          id: 'tech-hreflang-no-self-ref',
          category: 'seo',
          type: 'missing_robots_txt',
          severity: 'medium',
          title: 'hreflang Missing Self-Referencing Tag',
          description: 'The current page does not have a self-referencing hreflang tag. Every page with hreflang must reference itself among the alternate versions.',
          impact: 'Missing self-referencing hreflang causes validation errors in Google Search Console. It signals an incomplete hreflang implementation.',
          suggestion: 'Add a self-referencing hreflang tag to this page. If this is the English version, add: <link rel="alternate" hreflang="en" href="[this page URL]" />',
          priority: 6,
          affectedUrls: [mainPage.url],
          timeToFix: '10 minutes',
          difficulty: 'easy',
          estimatedImpact: 'Fixes hreflang validation errors',
        });
      }
    }
    
    // Invalid hreflang codes
    const validLangPattern = /^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/;
    const invalidLangs = hreflangs.filter(h => !validLangPattern.test(h.lang) && h.lang !== 'x-default');
    if (invalidLangs.length > 0) {
      issues.push({
        id: 'tech-hreflang-invalid',
        category: 'seo',
        type: 'missing_robots_txt',
        severity: 'high',
        title: `${invalidLangs.length} Invalid hreflang Language Code${invalidLangs.length > 1 ? 's' : ''}`,
        description: `Found invalid hreflang code${invalidLangs.length > 1 ? 's' : ''}: "${invalidLangs.map(h => h.lang).join(', ')}". Valid codes follow ISO 639-1 format (e.g., "en", "en-US", "fr").`,
        impact: 'Invalid hreflang codes are completely ignored by search engines. This breaks your entire international SEO strategy for affected pages.',
        suggestion: 'Replace invalid codes with valid ISO 639-1 language codes. Use "en" for English, "en-US" for US English, "en-GB" for UK English, etc. Avoid underscores — use hyphens.',
        priority: 9,
        affectedUrls: [mainPage.url],
        timeToFix: '10-20 minutes',
        difficulty: 'easy',
        estimatedImpact: 'Restores international SEO functionality',
      });
    }
  }

  // --- Canonical Chain Analysis ---

  private analyzeCanonicalChains(pages: PageData[], issues: AuditIssue[]) {
    const mainPage = pages[0];
    
    // Multiple canonicals per page
    const canonicalPattern = /<link[^>]*rel=["']canonical["'][^>]*>/gi;
    const canonicalMatches = [...mainPage.html.matchAll(canonicalPattern)];
    
    if (canonicalMatches.length > 1) {
      issues.push({
        id: 'tech-multiple-canonicals',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'high',
        title: `Multiple Canonical Tags Found (${canonicalMatches.length})`,
        description: `This page has ${canonicalMatches.length} canonical link tags. Search engines ignore multiple canonicals, which can lead to indexing of the wrong URL or duplicate content issues.`,
        impact: 'Multiple canonicals confuse search engines. Google typically ignores ALL canonicals when there are multiple, leading to unpredictable indexing behavior.',
        suggestion: 'Remove all but one canonical tag. Keep the canonical that points to the preferred version of this page. If using a CMS plugin, check for duplicate canonical injection.',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '10-15 minutes',
        difficulty: 'easy',
        estimatedImpact: 'Prevents canonical conflicts and duplicate content',
      });
    }
    
    // Canonical points to different domain
    if (mainPage.meta.canonical) {
      try {
        const canonicalDomain = new URL(mainPage.meta.canonical).hostname;
        const pageDomain = new URL(mainPage.url).hostname;
        
        if (canonicalDomain !== pageDomain) {
          issues.push({
            id: 'tech-canonical-cross-domain',
            category: 'seo',
            type: 'missing_canonical',
            severity: 'high',
            title: 'Canonical Tag Points to Different Domain',
            description: `Canonical URL (${mainPage.meta.canonical}) points to a different domain (${canonicalDomain}) than this page (${pageDomain}). Cross-domain canonicals are only valid for legitimate content syndication.`,
            impact: 'If not intentional, this tells search engines that the other domain owns this content. Your page may be de-indexed in favor of the canonical domain.',
            suggestion: 'If this IS your content on another domain (syndication), keep the cross-domain canonical. Otherwise, change the canonical to point to the same-domain URL.',
            priority: 8,
            affectedUrls: [mainPage.url],
            timeToFix: '5 minutes',
            difficulty: 'easy',
            estimatedImpact: 'Prevents accidental content attribution to another domain',
          });
        }
      } catch {
        // Invalid canonical URL
        issues.push({
          id: 'tech-canonical-invalid',
          category: 'seo',
          type: 'missing_canonical',
          severity: 'medium',
          title: 'Invalid Canonical URL Format',
          description: `The canonical URL "${mainPage.meta.canonical}" is not a valid URL format. Malformed canonicals are ignored by search engines.`,
          impact: 'Invalid canonical URLs are ignored entirely. This page may be indexed with its current URL instead of the intended canonical version.',
          suggestion: 'Fix the canonical URL to be a valid absolute URL: https://yourdomain.com/page-path/. Use your domain, not relative paths.',
          priority: 6,
          affectedUrls: [mainPage.url],
          timeToFix: '5 minutes',
          difficulty: 'easy',
          estimatedImpact: 'Ensures canonical directive is respected',
        });
      }
    }
    
    // Canonicalized page missing self-reference on non-canonical pages
    const pagesWithCanonical = pages.filter(p => p.meta.canonical);
    const pagesWithoutCanonical = pages.filter(p => !p.meta.canonical);
    
    if (pagesWithoutCanonical.length > 0 && pages.length > 1) {
      issues.push({
        id: 'tech-missing-canonical-pages',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'medium',
        title: `${pagesWithoutCanonical.length} Page${pagesWithoutCanonical.length > 1 ? 's' : ''} Missing Canonical Tag`,
        description: `${pagesWithoutCanonical.length} page${pagesWithoutCanonical.length > 1 ? 's' : ''} scanned do not have canonical tags. Every indexable page should have a self-referencing canonical to prevent parameter-based duplicate content.`,
        impact: 'Pages without canonicals are vulnerable to duplicate content issues from URL parameters (UTM codes, session IDs, sort orders) creating multiple URLs for the same content.',
        suggestion: 'Add self-referencing canonical tags to all pages: <link rel="canonical" href="https://yourdomain.com/this-exact-url/" />. This prevents parameter-based duplicate content.',
        priority: 6,
        affectedUrls: pagesWithoutCanonical.map(p => p.url),
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+15-25% duplicate content prevention',
      });
    }
    
    // Check for non-HTTPS canonicals on HTTPS site
    if (mainPage.url.startsWith('https://') && mainPage.meta.canonical?.startsWith('http://')) {
      issues.push({
        id: 'tech-canonical-http-on-https',
        category: 'seo',
        type: 'missing_canonical',
        severity: 'high',
        title: 'Canonical Uses HTTP on HTTPS Site',
        description: `This page is served over HTTPS but its canonical tag points to HTTP (${mainPage.meta.canonical}). This creates a mixed-content signal and can cause indexing issues.`,
        impact: 'HTTP canonicals on HTTPS pages confuse search engines about which version to index. It also triggers mixed-content warnings and may reduce ranking signals.',
        suggestion: 'Update all canonical tags to use HTTPS URLs. Also ensure all internal links use HTTPS to prevent unnecessary redirects.',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '10-15 minutes',
        difficulty: 'easy',
        estimatedImpact: '+10-15% ranking signal consolidation',
      });
    }
  }

  // --- Redirect Chain Detection ---

  private analyzeRedirects(pages: PageData[], issues: AuditIssue[]) {
    // Check status codes for redirect patterns
    const redirectPages = pages.filter(p => p.statusCode >= 300 && p.statusCode < 400);
    
    if (redirectPages.length > 0) {
      issues.push({
        id: 'tech-redirect-chains',
        category: 'seo',
        type: 'redirect_chain',
        severity: 'medium',
        title: `${redirectPages.length} Redirect${redirectPages.length > 1 ? 's' : ''} Detected in Crawled Pages`,
        description: `Found ${redirectPages.length} page${redirectPages.length > 1 ? 's' : ''} returning 3xx redirect status codes. Redirects pass less ranking power (link equity) than direct links and add latency.`,
        impact: 'Each redirect in a chain reduces passed link equity by 10-15%. Multiple redirects (chains) compound this loss. Redirects also add 100-500ms latency per hop.',
        suggestion: 'Update internal links to point directly to final destination URLs. Audit your redirect rules to eliminate chains (A → B → C should be A → C). Use 301 for permanent, 302 only for temporary.',
        priority: 6,
        affectedUrls: redirectPages.map(p => p.url),
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+10-20% link equity preservation, faster load times',
      });
    }
    
    // HTTP to HTTPS redirect (important but not necessarily bad)
    const httpPages = pages.filter(p => p.url.startsWith('http://'));
    if (httpPages.length > 0) {
      issues.push({
        id: 'tech-http-redirects',
        category: 'seo',
        type: 'redirect_chain',
        severity: 'low',
        title: `${httpPages.length} HTTP URL${httpPages.length > 1 ? 's' : ''} Still in Use`,
        description: `${httpPages.length} page${httpPages.length > 1 ? 's' : ''} were crawled using HTTP. These redirect to HTTPS, adding an unnecessary redirect hop.`,
        impact: 'Every HTTP→HTTPS redirect adds latency and wastes crawl budget. Internal links should use the HTTPS version directly.',
        suggestion: 'Update all internal links, sitemaps, and canonical tags to use HTTPS URLs. Implement HSTS (Strict-Transport-Security) header to force HTTPS at the browser level.',
        priority: 4,
        affectedUrls: httpPages.map(p => p.url),
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+5-10% crawl efficiency improvement',
      });
    }
    
    // 404 pages in crawl
    const notFoundPages = pages.filter(p => p.statusCode === 404 || p.statusCode === 410);
    if (notFoundPages.length > 0) {
      issues.push({
        id: 'tech-404-in-crawl',
        category: 'seo',
        type: 'broken_link',
        severity: 'high',
        title: `${notFoundPages.length} Page${notFoundPages.length > 1 ? 's' : ''} Returning 404`,
        description: `${notFoundPages.length} crawled page${notFoundPages.length > 1 ? 's' : ''} return 404 Not Found. These broken pages waste crawl budget and create poor user experience.`,
        impact: '404 pages linked from your site waste Google\'s crawl budget. Users encountering 404s from internal links have a 73% higher bounce rate.',
        suggestion: 'Fix or remove internal links to 404 pages. If the content moved, implement 301 redirects to the new location. Create a custom 404 page with search and navigation options.',
        priority: 8,
        affectedUrls: notFoundPages.map(p => p.url),
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+15-25% crawl budget recovery, better UX',
      });
    }
  }

  // --- Internal Linking Structure ---

  private analyzeInternalLinking(pages: PageData[], issues: AuditIssue[]) {
    if (pages.length < 2) return;
    
    // Build link graph
    const linkGraph: Map<string, Set<string>> = new Map();
    const allInternalUrls = new Set<string>();
    
    for (const page of pages) {
      linkGraph.set(page.url, new Set());
      allInternalUrls.add(page.url);
      
      for (const link of page.links) {
        if (link.isInternal) {
          linkGraph.get(page.url)?.add(link.href);
          allInternalUrls.add(link.href);
        }
      }
    }
    
    // Find orphan pages (pages with 0 incoming internal links)
    const incomingLinks: Map<string, number> = new Map();
    for (const [source, targets] of linkGraph) {
      for (const target of targets) {
        incomingLinks.set(target, (incomingLinks.get(target) || 0) + 1);
      }
    }
    
    const orphanPages: string[] = [];
    for (const url of allInternalUrls) {
      // Only check URLs we actually crawled
      if (pages.some(p => p.url === url)) {
        const incoming = incomingLinks.get(url) || 0;
        if (incoming === 0 && url !== this.baseUrl) {
          orphanPages.push(url);
        }
      }
    }
    
    if (orphanPages.length > 0) {
      issues.push({
        id: 'tech-orphan-pages',
        category: 'seo',
        type: 'internal_linking',
        severity: 'high',
        title: `${orphanPages.length} Orphan Page${orphanPages.length > 1 ? 's' : ''} Detected`,
        description: `Found ${orphanPages.length} page${orphanPages.length > 1 ? 's' : ''} with zero incoming internal links. Orphan pages are only discoverable via sitemap or external links, severely limiting their visibility.`,
        impact: 'Orphan pages receive minimal ranking signals. They are often de-indexed over time because search engines cannot discover them through normal crawling.',
        suggestion: 'Add internal links to orphan pages from related content pages, navigation menus, or category pages. Each important page should have at least 3-5 contextual internal links pointing to it.',
        priority: 8,
        affectedUrls: orphanPages,
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+50-100% indexing probability for orphan pages',
      });
    }
    
    // Pages with too few internal links (under 3)
    const lowLinkPages: string[] = [];
    for (const [url, count] of incomingLinks) {
      if (count < 3 && pages.some(p => p.url === url) && url !== this.baseUrl) {
        lowLinkPages.push(url);
      }
    }
    
    if (lowLinkPages.length > 0) {
      issues.push({
        id: 'tech-low-internal-links',
        category: 'seo',
        type: 'internal_linking',
        severity: 'medium',
        title: `${lowLinkPages.length} Page${lowLinkPages.length > 1 ? 's' : ''} with Few Internal Links`,
        description: `${lowLinkPages.length} page${lowLinkPages.length > 1 ? 's' : ''} have fewer than 3 incoming internal links. Pages with weak internal link profiles receive less ranking authority.`,
        impact: 'Google uses internal links as a primary ranking signal. Pages with few internal links are treated as less important, even if their content is high quality.',
        suggestion: 'Build a topic cluster strategy: create pillar pages that link to related sub-pages, and ensure sub-pages link back to the pillar. Add contextual links in blog posts and content.',
        priority: 6,
        affectedUrls: lowLinkPages.slice(0, 10),
        timeToFix: '1-2 hours',
        difficulty: 'medium',
        estimatedImpact: '+20-40% ranking authority distribution improvement',
      });
    }
    
    // Excessive outgoing links on a page
    const highOutgoingPages = pages.filter(p => {
      const internalLinks = p.links.filter(l => l.isInternal).length;
      return internalLinks > 150;
    });
    
    if (highOutgoingPages.length > 0) {
      issues.push({
        id: 'tech-too-many-links',
        category: 'seo',
        type: 'internal_linking',
        severity: 'low',
        title: `${highOutgoingPages.length} Page${highOutgoingPages.length > 1 ? 's' : ''} with Excessive Internal Links`,
        description: `Found ${highOutgoingPages.length} page${highOutgoingPages.length > 1 ? 's' : ''} with more than 150 internal links. Excessive links dilute page authority passed to each target.`,
        impact: 'Google may not follow all links on pages with 150+ links. Link equity is divided among all links, so each target receives very little authority.',
        suggestion: 'Reduce links to 100 per page maximum. Use category/archive pages to group related content. Prioritize linking to your most important pages (money pages, pillar content).',
        priority: 3,
        affectedUrls: highOutgoingPages.map(p => p.url),
        timeToFix: '1-2 hours',
        difficulty: 'medium',
        estimatedImpact: '+15-25% link equity concentration on priority pages',
      });
    }
  }

  // --- Pagination Analysis ---

  private analyzePagination(pages: PageData[], issues: AuditIssue[]) {
    // Check for rel=next/prev (deprecated but still good to know)
    const hasRelNextPrev = pages.some(p => 
      p.html.includes('rel="next"') || 
      p.html.includes('rel="prev"') ||
      p.html.includes("rel='next'") ||
      p.html.includes("rel='prev'")
    );
    
    // Check for pagination parameters in URLs
    const paginationUrls = pages.filter(p => 
      /[?&](page|p|offset|start|from)=\d+/.test(p.url) ||
      /\/page\/[0-9]+/.test(p.url) ||
      /\/p\/[0-9]+/.test(p.url)
    );
    
    if (paginationUrls.length > 0 && !hasRelNextPrev) {
      issues.push({
        id: 'tech-pagination-no-rel',
        category: 'seo',
        type: 'internal_linking',
        severity: 'low',
        title: 'Paginated Content Missing Pagination Hints',
        description: `Found ${paginationUrls.length} paginated URL${paginationUrls.length > 1 ? 's' : ''} but no pagination relationship markup. While Google deprecated rel=next/prev, proper pagination handling still matters for crawl efficiency.`,
        impact: 'Without pagination handling, search engines may crawl infinite pagination loops or waste crawl budget on paginated content that does not need indexing.',
        suggestion: 'Implement one of: (1) View-all canonical page, (2) Infinite scroll with proper history API, or (3) Use canonical self-referencing on paginated pages to consolidate ranking signals. Block paginated pages from indexing if they have no unique content.',
        priority: 4,
        affectedUrls: paginationUrls.map(p => p.url),
        timeToFix: '1-2 hours',
        difficulty: 'medium',
        estimatedImpact: '+10-20% crawl budget savings',
      });
    }
    
    // Infinite scroll without proper handling
    const hasInfiniteScroll = pages.some(p => 
      p.html.includes('infinite') || 
      p.html.includes('scroll') || 
      p.html.includes('loadmore') ||
      p.html.includes('load-more')
    );
    
    if (hasInfiniteScroll && paginationUrls.length === 0) {
      issues.push({
        id: 'tech-infinite-scroll',
        category: 'seo',
        type: 'internal_linking',
        severity: 'medium',
        title: 'Infinite Scroll Detected — Ensure Proper SEO Implementation',
        description: 'Infinite scroll was detected but no pagination URLs or proper pushState implementation was found. Standard infinite scroll makes content invisible to search engines.',
        impact: 'Content loaded via infinite scroll without proper implementation is never discovered by search engines. All content beyond the first viewport becomes invisible to crawlers.',
        suggestion: 'Implement Google\'s recommended infinite scroll pattern: (1) Create paginated URL structure (/page/1, /page/2), (2) Use History API (pushState) to update URL on scroll, (3) Ensure each page is independently accessible and has unique content.',
        priority: 7,
        affectedUrls: [pages[0]?.url],
        timeToFix: '2-4 hours',
        difficulty: 'hard',
        estimatedImpact: '+50-100% of scroll-loaded content becomes indexable',
      });
    }
  }

  // --- Duplicate Content Detection ---

  private analyzeDuplicateContent(pages: PageData[], issues: AuditIssue[]) {
    if (pages.length < 2) return;
    
    // Check for duplicate titles
    const titleMap: Map<string, string[]> = new Map();
    for (const page of pages) {
      const title = page.meta.title?.trim() || '';
      if (title) {
        const existing = titleMap.get(title) || [];
        existing.push(page.url);
        titleMap.set(title, existing);
      }
    }
    
    const duplicateTitles = [...titleMap.entries()].filter(([_, urls]) => urls.length > 1);
    if (duplicateTitles.length > 0) {
      const totalDupPages = duplicateTitles.reduce((sum, [_, urls]) => sum + urls.length, 0);
      issues.push({
        id: 'tech-duplicate-titles',
        category: 'seo',
        type: 'duplicate_content',
        severity: 'high',
        title: `${duplicateTitles.length} Duplicate Title${duplicateTitles.length > 1 ? 's' : ''} Across ${totalDupPages} Pages`,
        description: `Found ${duplicateTitles.length} duplicate title tag${duplicateTitles.length > 1 ? 's' : ''} used on ${totalDupPages} pages. Duplicate titles confuse search engines about which page to rank for each query.`,
        impact: 'Pages with duplicate titles compete against each other in search results (keyword cannibalization). Search engines may choose the wrong page to rank or suppress all variants.',
        suggestion: 'Make every title unique and descriptive. Pattern: [Page-Specific Content] | [Site Name]. Example: "Pricing Plans — Start Free" vs "Features — Product Tour" vs "Blog — Latest Updates".',
        priority: 8,
        affectedUrls: duplicateTitles.flatMap(([_, urls]) => urls).slice(0, 10),
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-35% reduction in keyword cannibalization',
      });
    }
    
    // Check for duplicate meta descriptions
    const descMap: Map<string, string[]> = new Map();
    for (const page of pages) {
      const desc = page.meta.description?.trim() || '';
      if (desc) {
        const existing = descMap.get(desc) || [];
        existing.push(page.url);
        descMap.set(desc, existing);
      }
    }
    
    const duplicateDescs = [...descMap.entries()].filter(([_, urls]) => urls.length > 1);
    if (duplicateDescs.length > 0) {
      const totalDupPages = duplicateDescs.reduce((sum, [_, urls]) => sum + urls.length, 0);
      issues.push({
        id: 'tech-duplicate-descriptions',
        category: 'seo',
        type: 'duplicate_content',
        severity: 'medium',
        title: `${duplicateDescs.length} Duplicate Meta Description${duplicateDescs.length > 1 ? 's' : ''} Across ${totalDupPages} Pages`,
        description: `Found ${duplicateDescs.length} duplicate meta description${duplicateDescs.length > 1 ? 's' : ''} used on ${totalDupPages} pages. Unique descriptions improve CTR by making each result distinct in SERPs.`,
        impact: 'Duplicate descriptions make search results look identical. Users cannot distinguish between your pages, reducing click-through rates by 5-15%.',
        suggestion: 'Write unique meta descriptions for each page (150-160 characters). Summarize the specific content of that page, include a call-to-action, and use the primary keyword naturally.',
        priority: 6,
        affectedUrls: duplicateDescs.flatMap(([_, urls]) => urls).slice(0, 10),
        timeToFix: '30-60 minutes',
        difficulty: 'easy',
        estimatedImpact: '+5-15% SERP click-through rate improvement',
      });
    }
    
    // Near-duplicate content (high text similarity between pages)
    if (pages.length > 2) {
      const similarPairs: { url1: string; url2: string; similarity: number }[] = [];
      
      for (let i = 0; i < pages.length; i++) {
        for (let j = i + 1; j < pages.length; j++) {
          const similarity = this.calculateTextSimilarity(pages[i].text, pages[j].text);
          if (similarity > 0.7) {
            similarPairs.push({
              url1: pages[i].url,
              url2: pages[j].url,
              similarity: Math.round(similarity * 100),
            });
          }
        }
      }
      
      if (similarPairs.length > 0) {
        issues.push({
          id: 'tech-near-duplicate',
          category: 'seo',
          type: 'duplicate_content',
          severity: 'medium',
          title: `${similarPairs.length} Near-Duplicate Content Pair${similarPairs.length > 1 ? 's' : ''} Detected`,
          description: `Found ${similarPairs.length} page pair${similarPairs.length > 1 ? 's' : ''} with ${similarPairs[0].similarity}% or higher text similarity. Near-duplicate content splits ranking signals between pages.`,
          impact: 'Near-duplicate pages compete for the same keywords. Google typically chooses one and suppresses the others, wasting the SEO potential of suppressed pages.',
          suggestion: 'Choose one primary version and canonicalize others to it. Merge similar pages into comprehensive guides. Use noindex on thin variants (sort/filter pages). Differentiate content with unique angles, examples, and depth.',
          priority: 6,
          affectedUrls: [similarPairs[0].url1, similarPairs[0].url2],
          timeToFix: '1-3 hours',
          difficulty: 'medium',
          estimatedImpact: '+30-50% ranking signal consolidation',
        });
      }
    }
  }

  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 3));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  // --- URL Parameter Analysis ---

  private analyzeURLParameters(pages: PageData[], issues: AuditIssue[]) {
    const paramUrls = pages.filter(p => p.url.includes('?'));
    
    if (paramUrls.length === 0) return;
    
    // Check for session/tracking parameters
    const sessionParams = ['sessionid', 'jsessionid', 'phpsessid', 'sid', 'utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid', 'ref'];
    const pagesWithSessionParams = paramUrls.filter(p => {
      const urlParams = new URL(p.url).searchParams;
      return sessionParams.some(sp => urlParams.has(sp));
    });
    
    if (pagesWithSessionParams.length > 0) {
      issues.push({
        id: 'tech-session-params',
        category: 'seo',
        type: 'url_structure',
        severity: 'medium',
        title: `${pagesWithSessionParams.length} URL${pagesWithSessionParams.length > 1 ? 's' : ''} with Session/Tracking Parameters`,
        description: `Found session IDs or tracking parameters (UTM, fbclid, gclid) in ${pagesWithSessionParams.length} internal URL${pagesWithSessionParams.length > 1 ? 's' : ''}. These create duplicate content and waste crawl budget.`,
        impact: 'Session parameters create infinite URL variations of the same content. Search engines may crawl thousands of duplicate URLs, exhausting your crawl budget.',
        suggestion: 'Configure URL parameter handling in Google Search Console. Add canonical tags that strip parameters. For UTM codes, ensure they only appear on external links, never internal. Use session cookies instead of URL session IDs.',
        priority: 6,
        affectedUrls: pagesWithSessionParams.map(p => p.url).slice(0, 5),
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+20-40% crawl budget savings',
      });
    }
    
    // Check for sort/filter parameters
    const filterParams = ['sort', 'order', 'filter', 'category', 'brand', 'price', 'size', 'color', 'page'];
    const pagesWithFilterParams = paramUrls.filter(p => {
      const urlParams = new URL(p.url).searchParams;
      return filterParams.some(fp => urlParams.has(fp));
    });
    
    if (pagesWithFilterParams.length > 0) {
      issues.push({
        id: 'tech-filter-params',
        category: 'seo',
        type: 'url_structure',
        severity: 'low',
        title: `${pagesWithFilterParams.length} Filter/Sort Parameter URL${pagesWithFilterParams.length > 1 ? 's' : ''} Detected`,
        description: `Found ${pagesWithFilterParams.length} URL${pagesWithFilterParams.length > 1 ? 's' : ''} with sort/filter parameters. These often create duplicate or near-duplicate content.`,
        impact: 'E-commerce sites can have thousands of filter combinations. Without proper handling, Google crawls every combination, wasting crawl budget on thin content.',
        suggestion: 'Add noindex meta robots to filtered/sorted pages. Use faceted navigation with AJAX (no URL change) for non-essential filters. Canonicalize filtered pages to the base category page. Block unimportant filter combinations in robots.txt.',
        priority: 4,
        affectedUrls: pagesWithFilterParams.map(p => p.url).slice(0, 5),
        timeToFix: '1-2 hours',
        difficulty: 'hard',
        estimatedImpact: '+30-60% crawl budget savings for e-commerce',
      });
    }
  }

  // --- HTTP Status Code Analysis ---

  private analyzeStatusCodes(pages: PageData[], issues: AuditIssue[]) {
    // Server errors
    const serverErrors = pages.filter(p => p.statusCode >= 500);
    if (serverErrors.length > 0) {
      issues.push({
        id: 'tech-server-errors',
        category: 'seo',
        type: 'broken_link',
        severity: 'critical',
        title: `${serverErrors.length} Server Error${serverErrors.length > 1 ? 's' : ''} (5xx) Detected`,
        description: `Found ${serverErrors.length} page${serverErrors.length > 1 ? 's' : ''} returning server errors (5xx). These indicate server-side problems that prevent search engines and users from accessing content.`,
        impact: '5xx errors cause immediate ranking drops. Google reduces crawl rate for sites with frequent server errors. Users encountering 500 errors have a 90%+ bounce rate.',
        suggestion: 'Investigate server logs to identify the root cause. Common causes: database connection issues, memory limits, PHP/Node.js errors, or traffic spikes overwhelming the server. Implement monitoring with uptime alerts.',
        priority: 10,
        affectedUrls: serverErrors.map(p => p.url),
        timeToFix: '30 minutes - 4 hours',
        difficulty: 'hard',
        estimatedImpact: 'Prevents immediate ranking loss and reputation damage',
      });
    }
    
    // Slow load times
    const slowPages = pages.filter(p => p.loadTime > 3000);
    if (slowPages.length > 0) {
      issues.push({
        id: 'tech-slow-response',
        category: 'seo',
        type: 'slow_load_time',
        severity: 'high',
        title: `${slowPages.length} Page${slowPages.length > 1 ? 's' : ''} with Slow Server Response (>3s)`,
        description: `${slowPages.length} page${slowPages.length > 1 ? 's' : ''} took more than 3 seconds for the server to respond. Slow TTFB (Time to First Byte) hurts both rankings and user experience.`,
        impact: 'Each 1-second delay in TTFB reduces conversions by 7%. Google uses page speed as a confirmed ranking factor. Slow pages are crawled less frequently.',
        suggestion: 'Optimize server response time: (1) Enable server-side caching (Redis/Memcached), (2) Optimize database queries, (3) Use a CDN for static assets, (4) Enable gzip/Brotli compression, (5) Consider upgrading hosting or using edge computing.',
        priority: 8,
        affectedUrls: slowPages.map(p => `${p.url} (${p.loadTime}ms)`).slice(0, 5),
        timeToFix: '1-4 hours',
        difficulty: 'hard',
        estimatedImpact: '+15-25% page speed improvement, better rankings',
      });
    }
  }

  // --- Structured Data Validation ---

  private analyzeStructuredData(pages: PageData[], issues: AuditIssue[]) {
    const mainPage = pages[0];
    
    if (mainPage.structured_data.length === 0) {
      // Already flagged by SEO auditor, skip
      return;
    }
    
    // Check for required properties in common schema types
    for (const schema of mainPage.structured_data) {
      const type = schema.type.toLowerCase();
      const json = schema.json;
      
      // Organization schema validation
      if (type.includes('organization') || type.includes('localbusiness')) {
        const required = ['name', 'url'];
        const missing = required.filter(r => !json[r] && !json['@' + r]);
        
        if (missing.length > 0) {
          issues.push({
            id: `tech-schema-org-${missing.join('-')}`,
            category: 'seo',
            type: 'missing_schema',
            severity: 'medium',
            title: `Organization Schema Missing Required Fields`,
            description: `Organization/LocalBusiness schema is missing required properties: ${missing.join(', ')}. Incomplete schema may not generate rich results in search.`,
            impact: 'Incomplete Organization schema prevents rich results like knowledge panels and local business listings. Google requires minimum fields to validate schema.',
            suggestion: `Add the missing required fields to your Organization schema: "name", "url". Recommended additions: "logo", "sameAs" (social profiles), "contactPoint" (phone/email), "address".`,
            priority: 6,
            affectedUrls: [mainPage.url],
            timeToFix: '15-30 minutes',
            difficulty: 'easy',
            estimatedImpact: '+10-20% rich result eligibility',
          });
        }
      }
      
      // Article/BlogPosting validation
      if (type.includes('article') || type.includes('blogposting')) {
        const required = ['headline', 'author', 'datePublished'];
        const missing = required.filter(r => !json[r] && !json['@' + r]);
        
        if (missing.length > 0) {
          issues.push({
            id: `tech-schema-article-${missing.join('-')}`,
            category: 'seo',
            type: 'missing_schema',
            severity: 'medium',
            title: `Article Schema Missing Required Fields`,
            description: `Article/BlogPosting schema is missing required properties: ${missing.join(', ')}. These fields are essential for Google News and article rich results.`,
            impact: 'Articles without complete schema do not qualify for Google News, Top Stories carousels, or article rich snippets. DatePublished is critical for news content.',
            suggestion: `Add the missing fields: "headline", "author" (name or Organization), "datePublished" (ISO 8601 format). Also include: "image" (min 1200px wide), "dateModified", "publisher" (Organization).`,
            priority: 6,
            affectedUrls: [mainPage.url],
            timeToFix: '15-30 minutes',
            difficulty: 'easy',
            estimatedImpact: '+15-25% article rich result eligibility',
          });
        }
      }
      
      // Product schema validation
      if (type.includes('product')) {
        const required = ['name', 'offers'];
        const missing = required.filter(r => !json[r] && !json['@' + r]);
        
        if (missing.length > 0) {
          issues.push({
            id: `tech-schema-product-${missing.join('-')}`,
            category: 'seo',
            type: 'missing_schema',
            severity: 'medium',
            title: `Product Schema Missing Required Fields`,
            description: `Product schema is missing required properties: ${missing.join(', ')}. Product rich results (price, availability, ratings) require complete schema.`,
            impact: 'Incomplete Product schema prevents rich results showing price, availability, and ratings directly in search results. These rich results increase CTR by 20-35%.',
            suggestion: `Add: "name", "offers" (with price, priceCurrency, availability), "image", "description". For reviews: "aggregateRating" (ratingValue, reviewCount). For brands: "brand" (Organization or name).`,
            priority: 6,
            affectedUrls: [mainPage.url],
            timeToFix: '20-40 minutes',
            difficulty: 'easy',
            estimatedImpact: '+20-35% product search CTR improvement',
          });
        }
      }
    }
    
    // Check for nested schema issues
    const schemasWithErrors = mainPage.structured_data.filter(sd => {
      const json = JSON.stringify(sd.json);
      return json.includes('undefined') || json.includes('null') || json.includes('""');
    });
    
    if (schemasWithErrors.length > 0) {
      issues.push({
        id: 'tech-schema-empty-values',
        category: 'seo',
        type: 'missing_schema',
        severity: 'medium',
        title: `${schemasWithErrors.length} Schema${schemasWithErrors.length > 1 ? 's' : ''} with Empty/Null Values`,
        description: `Found ${schemasWithErrors.length} structured data markup${schemasWithErrors.length > 1 ? 's' : ''} containing null, undefined, or empty string values. These invalidate the entire schema block.`,
        impact: 'Schema with empty values fails validation entirely. Google ignores the entire schema block, not just the empty field. Rich results are disabled for the page.',
        suggestion: 'Fix your schema generation logic to skip empty values entirely rather than outputting null/undefined. Use conditional rendering: only include a field if it has a value. Test with Google\'s Rich Results Test tool.',
        priority: 6,
        affectedUrls: [mainPage.url],
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: 'Restores rich result eligibility for affected schema types',
      });
    }
  }

  // --- Link Depth Analysis ---

  private analyzeLinkDepth(pages: PageData[], issues: AuditIssue[]) {
    if (pages.length < 2) return;
    
    // Estimate link depth from base URL
    const baseUrl = new URL(this.baseUrl);
    
    const deepPages = pages.filter(p => {
      const url = new URL(p.url);
      const pathSegments = url.pathname.split('/').filter(s => s);
      return pathSegments.length > 4; // More than 4 directory levels deep
    });
    
    if (deepPages.length > 0) {
      issues.push({
        id: 'tech-deep-pages',
        category: 'seo',
        type: 'internal_linking',
        severity: 'low',
        title: `${deepPages.length} Deep Page${deepPages.length > 1 ? 's' : ''} (>4 URL Levels)`,
        description: `Found ${deepPages.length} page${deepPages.length > 1 ? 's' : ''} nested more than 4 directory levels deep. Deep pages receive less crawl priority and ranking authority.`,
        impact: 'Google assigns less crawl priority to deep pages. Each additional directory level reduces the likelihood of frequent re-crawling by approximately 15%.',
        suggestion: 'Flatten URL structure: aim for 2-3 levels maximum. Use descriptive URLs like /category/subcategory/page/ instead of /a/b/c/d/e/page/. Add breadcrumbs for deep pages and link to them from higher-level category pages.',
        priority: 3,
        affectedUrls: deepPages.map(p => p.url).slice(0, 5),
        timeToFix: '2-4 hours',
        difficulty: 'hard',
        estimatedImpact: '+15-25% crawl frequency for deep pages',
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
        title: `${longUrls.length} Excessively Long URL${longUrls.length > 1 ? 's' : ''}`,
        description: `Found ${longUrls.length} URL${longUrls.length > 1 ? 's' : ''} longer than 100 characters. Long URLs are harder to share, less memorable, and may be truncated in search results.`,
        impact: 'URLs over 100 characters may be truncated in search results, hiding important keywords. They are less likely to be shared on social media and in emails.',
        suggestion: 'Shorten URLs by removing unnecessary parameters, abbreviating long words, and flattening directory structure. Aim for 50-75 characters including the domain.',
        priority: 3,
        affectedUrls: longUrls.map(p => p.url).slice(0, 5),
        timeToFix: '1-2 hours',
        difficulty: 'medium',
        estimatedImpact: '+5-10% shareability and SERP display improvement',
      });
    }
  }

  // --- Helpers ---

  private createScore(score: number, totalChecks: number, passedChecks: number, issues: number): AuditScore {
    return {
      category: 'seo',
      score: Math.min(100, Math.max(0, Math.round(score))),
      maxScore: 100,
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
