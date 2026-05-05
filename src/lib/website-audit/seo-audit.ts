// Technical SEO Audit Module
// Analyzes SEO-related issues on web pages

import type { PageData, AuditIssue, AuditScore } from './types';

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
    
    // Sitemap Detection
    this.analyzeSitemap(pages, issues);
    
    // Alt Tags
    this.analyzeAltTags(pages, issues);
    
    // Calculate score
    const totalChecks = 25;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'high' || i.severity === 'critical').length;
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
      const title = page.meta.title?.trim() || '';
      const url = page.url;
      
      if (!title) {
        issues.push({
          id: `missing_title_${url}`,
          category: 'seo',
          type: 'missing_title',
          severity: 'critical',
          title: 'Missing Page Title',
          description: `The page at ${url} has no title tag.`,
          impact: 'Search engines use titles to understand page content. Missing titles severely hurt SEO.',
          suggestion: 'Add a unique, descriptive title tag between 30-60 characters.',
          url,
          priority: 10,
        });
      } else {
        titles.set(title, [...(titles.get(title) || []), url]);
        
        // Check title length
        if (title.length < 30) {
          issues.push({
            id: `short_title_${url}`,
            category: 'seo',
            type: 'missing_title',
            severity: 'medium',
            title: 'Title Too Short',
            description: `The title "${title.substring(0, 30)}..." is only ${title.length} characters.`,
            impact: 'Short titles may not provide enough context for search engines.',
            suggestion: 'Expand the title to 30-60 characters for better SEO.',
            url,
            priority: 5,
          });
        } else if (title.length > 60) {
          issues.push({
            id: `long_title_${url}`,
            category: 'seo',
            type: 'missing_title',
            severity: 'low',
            title: 'Title Too Long',
            description: `The title is ${title.length} characters, exceeding the recommended 60.`,
            impact: 'Titles over 60 characters may be truncated in search results.',
            suggestion: 'Keep titles between 30-60 characters for optimal display.',
            url,
            priority: 3,
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
          impact: 'Duplicate titles confuse search engines about which page to rank.',
          suggestion: 'Create unique titles for each page that reflect their specific content.',
          element: urls.join(', '),
          priority: 8,
        });
      }
    });
  }

  private analyzeMetaDescription(pages: PageData[], issues: AuditIssue[]): void {
    const descriptions = new Map<string, string[]>();
    
    pages.forEach((page) => {
      const description = page.meta.description?.trim() || '';
      const url = page.url;
      
      if (!description) {
        issues.push({
          id: `missing_meta_${url}`,
          category: 'seo',
          type: 'missing_meta_description',
          severity: 'high',
          title: 'Missing Meta Description',
          description: `The page at ${url} has no meta description.`,
          impact: 'Meta descriptions influence click-through rates from search results.',
          suggestion: 'Add a compelling meta description between 120-160 characters.',
          url,
          priority: 7,
        });
      } else {
        descriptions.set(description, [...(descriptions.get(description) || []), url]);
        
        // Check description length
        if (description.length < 120) {
          issues.push({
            id: `short_meta_${url}`,
            category: 'seo',
            type: 'missing_meta_description',
            severity: 'medium',
            title: 'Meta Description Too Short',
            description: `The meta description is only ${description.length} characters.`,
            impact: 'Short descriptions may not fully utilize search result space.',
            suggestion: 'Expand to 120-160 characters for better visibility.',
            url,
            priority: 4,
          });
        } else if (description.length > 160) {
          issues.push({
            id: `long_meta_${url}`,
            category: 'seo',
            type: 'missing_meta_description',
            severity: 'low',
            title: 'Meta Description Too Long',
            description: `The meta description is ${description.length} characters, exceeding the recommended 160.`,
            impact: 'Descriptions over 160 characters may be truncated in search results.',
            suggestion: 'Keep descriptions between 120-160 characters.',
            url,
            priority: 3,
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
          impact: 'Duplicate descriptions reduce the uniqueness of your pages in search results.',
          suggestion: 'Create unique descriptions for each page.',
          element: urls.join(', '),
          priority: 5,
        });
      }
    });
  }

  private analyzeHeadings(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const url = page.url;
      const h1Count = page.meta.h1.length;
      
      // Check for missing H1
      if (h1Count === 0) {
        issues.push({
          id: `missing_h1_${url}`,
          category: 'seo',
          type: 'missing_h1',
          severity: 'critical',
          title: 'Missing H1 Tag',
          description: `The page at ${url} has no H1 heading.`,
          impact: 'H1 tags are crucial for SEO and accessibility. They tell search engines what the page is about.',
          suggestion: 'Add a single H1 tag that describes the main topic of the page.',
          url,
          priority: 9,
        });
      }
      
      // Check for multiple H1s
      if (h1Count > 1) {
        issues.push({
          id: `multiple_h1_${url}`,
          category: 'seo',
          type: 'multiple_h1',
          severity: 'high',
          title: 'Multiple H1 Tags',
          description: `The page has ${h1Count} H1 tags: ${page.meta.h1.slice(0, 3).join(', ')}...`,
          impact: 'Multiple H1 tags can confuse search engines about the main topic.',
          suggestion: 'Use only one H1 per page. Convert additional H1s to H2 or lower.',
          url,
          priority: 7,
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
          impact: 'Skipping heading levels creates a poor structure for screen readers and SEO.',
          suggestion: 'Use H2 before H3 to maintain proper heading hierarchy.',
          url,
          priority: 4,
        });
      }
    });
  }

  private analyzeCanonical(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      if (!page.meta.canonical) {
        issues.push({
          id: `missing_canonical_${page.url}`,
          category: 'seo',
          type: 'missing_canonical',
          severity: 'medium',
          title: 'Missing Canonical URL',
          description: `The page at ${page.url} has no canonical tag.`,
          impact: 'Without a canonical URL, duplicate content issues may arise.',
          suggestion: 'Add a canonical tag to specify the preferred URL for this content.',
          url: page.url,
          priority: 5,
        });
      }
    });
  }

  private analyzeRobots(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const robots = page.meta.robots?.toLowerCase() || '';
      
      if (robots.includes('noindex')) {
        issues.push({
          id: `noindex_${page.url}`,
          category: 'seo',
          type: 'missing_robots_txt',
          severity: 'high',
          title: 'Page Blocked from Indexing',
          description: `The page has a noindex directive: "${page.meta.robots}"`,
          impact: 'This page will not appear in search engine results.',
          suggestion: 'Remove the noindex directive if you want this page indexed.',
          url: page.url,
          priority: 8,
        });
      }
    });
  }

  private analyzeURLStructure(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const url = new URL(page.url);
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
          impact: 'Very long URLs may be truncated in search results and are harder to share.',
          suggestion: 'Keep URLs under 100 characters and use descriptive, short slugs.',
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
          impact: 'URLs with many parameters may be harder for search engines to crawl.',
          suggestion: 'Consider using clean URLs without parameters when possible.',
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
          impact: 'Hyphens are preferred over underscores for SEO.',
          suggestion: 'Use hyphens (-) instead of underscores (_) in URLs.',
          url: page.url,
          priority: 1,
        });
      }
    });
  }

  private analyzeInternalLinking(pages: PageData[], issues: AuditIssue[]): void {
    const allInternalLinks = new Set<string>();
    let totalInternalLinks = 0;
    
    pages.forEach((page) => {
      page.links.forEach((link) => {
        if (link.isInternal) {
          allInternalLinks.add(link.href);
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
        impact: 'Internal links help search engines discover and understand your site structure.',
        suggestion: 'Add more internal links to connect related pages and improve navigation.',
        priority: 5,
      });
    }
    
    // Check for orphan pages (pages with no incoming internal links)
    const linkedPages = new Set<string>();
    pages.forEach((page) => {
      page.links.forEach((link) => {
        if (link.isInternal) {
          linkedPages.add(link.href);
        }
      });
    });
    
    pages.forEach((page) => {
      if (!linkedPages.has(page.url) && page.url !== pages[0]?.url) {
        issues.push({
          id: `orphan_page_${page.url}`,
          category: 'seo',
          type: 'internal_linking',
          severity: 'medium',
          title: 'Potential Orphan Page',
          description: `The page at ${page.url} may not have incoming internal links.`,
          impact: 'Orphan pages are harder to discover and may not be indexed.',
          suggestion: 'Add internal links to this page from other relevant pages.',
          url: page.url,
          priority: 5,
        });
      }
    });
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
        impact: 'Structured data helps search engines understand your content and enables rich results.',
        suggestion: 'Add relevant schema markup (Organization, LocalBusiness, Article, etc.) to improve search visibility.',
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
        severity: 'medium',
        title: 'Missing Open Graph Title',
        description: 'No og:title tag found on the main page.',
        impact: 'Content may not display optimally when shared on social media.',
        suggestion: 'Add og:title, og:description, and og:image meta tags for better social sharing.',
        url: mainPage.url,
        priority: 4,
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
        severity: 'medium',
        title: 'Missing Open Graph Image',
        description: 'No og:image tag found on the main page.',
        impact: 'Shared links will not display an image preview on social platforms.',
        suggestion: 'Add an og:image tag with a relevant, high-quality image (1200x630 recommended).',
        url: mainPage.url,
        priority: 4,
      });
    }
  }

  private analyzeSitemap(pages: PageData[], issues: AuditIssue[]): void {
    // Check if robots.txt exists or if sitemap is referenced
    const mainPage = pages[0];
    
    // Note: This is a simplified check. In production, we'd check robots.txt content
    issues.push({
      id: 'check_sitemap',
      category: 'seo',
      type: 'missing_sitemap',
      severity: 'low',
      title: 'Verify XML Sitemap',
      description: 'Ensure an XML sitemap exists at /sitemap.xml and is referenced in robots.txt.',
      impact: 'Sitemaps help search engines discover and index your pages.',
      suggestion: 'Create and submit an XML sitemap to Google Search Console.',
      url: mainPage?.url,
      priority: 2,
    });
  }

  private analyzeAltTags(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const imagesWithoutAlt = page.images.filter((img) => !img.alt || img.alt.trim() === '');
      
      if (imagesWithoutAlt.length > 0) {
        const severity = imagesWithoutAlt.length > 5 ? 'high' : imagesWithoutAlt.length > 2 ? 'medium' : 'low';
        
        issues.push({
          id: `missing_alt_${page.url}`,
          category: 'seo',
          type: 'missing_alt_text',
          severity,
          title: 'Images Missing Alt Text',
          description: `${imagesWithoutAlt.length} images on ${page.url} are missing alt attributes.`,
          impact: 'Alt text improves accessibility and helps search engines understand images.',
          suggestion: 'Add descriptive alt text to all images. Example: "Team meeting in conference room" not "image1.jpg"',
          url: page.url,
          priority: severity === 'high' ? 7 : severity === 'medium' ? 5 : 3,
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
