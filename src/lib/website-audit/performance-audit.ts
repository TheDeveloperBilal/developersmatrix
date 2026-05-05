// Performance Audit Module
// Analyzes page performance without external APIs

import type { PageData, AuditIssue, AuditScore } from './types';

export class PerformanceAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];
    
    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // Page Size Analysis
    this.analyzePageSize(pages, issues);
    
    // Load Time Analysis
    this.analyzeLoadTime(pages, issues);
    
    // Script Analysis
    this.analyzeScripts(pages, issues);
    
    // CSS Analysis
    this.analyzeStyles(pages, issues);
    
    // Image Optimization
    this.analyzeImages(pages, issues);
    
    // Compression Headers
    this.analyzeCompression(pages, issues);
    
    // Cache Headers
    this.analyzeCache(pages, issues);
    
    // Calculate score
    const totalChecks = 15;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'high' || i.severity === 'critical').length;
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  private analyzePageSize(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const sizeKB = page.size / 1024;
      const sizeMB = sizeKB / 1024;
      
      if (sizeMB > 3) {
        issues.push({
          id: `large_page_${page.url}`,
          category: 'performance',
          type: 'large_page_size',
          severity: 'critical',
          title: 'Very Large Page Size',
          description: `Page size is ${sizeMB.toFixed(2)} MB (${sizeKB.toFixed(0)} KB) at ${page.url}`,
          impact: 'Large pages take significantly longer to load, especially on mobile connections.',
          suggestion: 'Reduce page size by optimizing images, minifying code, and removing unused content.',
          url: page.url,
          priority: 9,
        });
      } else if (sizeKB > 1500) {
        issues.push({
          id: `big_page_${page.url}`,
          category: 'performance',
          type: 'large_page_size',
          severity: 'high',
          title: 'Large Page Size',
          description: `Page size is ${sizeKB.toFixed(0)} KB at ${page.url}`,
          impact: 'Large pages may load slowly, especially on mobile connections.',
          suggestion: 'Consider reducing page size by optimizing images and minifying code.',
          url: page.url,
          priority: 7,
        });
      } else if (sizeKB > 1000) {
        issues.push({
          id: `moderate_page_${page.url}`,
          category: 'performance',
          type: 'large_page_size',
          severity: 'medium',
          title: 'Moderate Page Size',
          description: `Page size is ${sizeKB.toFixed(0)} KB at ${page.url}`,
          impact: 'Pages over 1 MB may affect load times on slower connections.',
          suggestion: 'Aim for page sizes under 1 MB for optimal performance.',
          url: page.url,
          priority: 5,
        });
      }
    });
  }

  private analyzeLoadTime(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const loadTime = page.loadTime;
      
      if (loadTime > 5000) {
        issues.push({
          id: `slow_load_${page.url}`,
          category: 'performance',
          type: 'slow_load_time',
          severity: 'critical',
          title: 'Very Slow Page Load',
          description: `Page loaded in ${(loadTime / 1000).toFixed(1)} seconds at ${page.url}`,
          impact: 'Users typically abandon pages that take more than 3 seconds to load.',
          suggestion: 'Optimize server response time, enable caching, and reduce page resources.',
          url: page.url,
          priority: 10,
        });
      } else if (loadTime > 3000) {
        issues.push({
          id: `moderate_load_${page.url}`,
          category: 'performance',
          type: 'slow_load_time',
          severity: 'high',
          title: 'Slow Page Load',
          description: `Page loaded in ${(loadTime / 1000).toFixed(1)} seconds at ${page.url}`,
          impact: 'Pages loading over 3 seconds may frustrate users and hurt SEO rankings.',
          suggestion: 'Optimize images, minify CSS/JS, and consider using a CDN.',
          url: page.url,
          priority: 7,
        });
      } else if (loadTime > 1500) {
        issues.push({
          id: `acceptable_load_${page.url}`,
          category: 'performance',
          type: 'slow_load_time',
          severity: 'medium',
          title: 'Acceptable Page Load',
          description: `Page loaded in ${(loadTime / 1000).toFixed(1)} seconds at ${page.url}`,
          impact: 'Load times under 2 seconds are acceptable but can be improved.',
          suggestion: 'Consider further optimizations to achieve load times under 1 second.',
          url: page.url,
          priority: 4,
        });
      }
    });
  }

  private analyzeScripts(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const scripts = page.scripts;
      const inlineScripts = scripts.filter((s) => !s.src && s.content);
      const externalScripts = scripts.filter((s) => s.src);
      const blockingScripts = externalScripts.filter((s) => !s.async && !s.defer);
      
      // Check for too many scripts
      if (externalScripts.length > 15) {
        issues.push({
          id: `many_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'high',
          title: 'Too Many External Scripts',
          description: `${externalScripts.length} external scripts found on ${page.url}`,
          impact: 'Each external script adds HTTP requests and can delay page rendering.',
          suggestion: 'Combine scripts where possible, remove unused scripts, and use async/defer.',
          url: page.url,
          priority: 7,
        });
      }
      
      // Check for render-blocking scripts
      if (blockingScripts.length > 5) {
        issues.push({
          id: `blocking_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'medium',
          title: 'Render-Blocking Scripts',
          description: `${blockingScripts.length} scripts may block rendering on ${page.url}`,
          impact: 'Render-blocking scripts delay the first paint of the page.',
          suggestion: 'Add async or defer attributes to non-critical scripts.',
          url: page.url,
          priority: 6,
        });
      }
      
      // Check for large inline scripts
      if (inlineScripts.length > 3) {
        issues.push({
          id: `inline_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'low',
          title: 'Multiple Inline Scripts',
          description: `${inlineScripts.length} inline scripts found on ${page.url}`,
          impact: 'Inline scripts can delay HTML parsing and increase page size.',
          suggestion: 'Consider moving inline scripts to external files with defer.',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeStyles(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const styles = page.styles;
      const externalStyles = styles.filter((s) => s.href);
      const inlineStyles = styles.filter((s) => s.content);
      
      // Check for too many stylesheets
      if (externalStyles.length > 5) {
        issues.push({
          id: `many_styles_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'medium',
          title: 'Multiple Stylesheets',
          description: `${externalStyles.length} external stylesheets found on ${page.url}`,
          impact: 'Multiple stylesheets add HTTP requests and can block rendering.',
          suggestion: 'Combine CSS files into one or two files to reduce requests.',
          url: page.url,
          priority: 5,
        });
      }
      
      // Check for inline styles
      if (inlineStyles.length > 3) {
        issues.push({
          id: `inline_styles_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'low',
          title: 'Multiple Inline Styles',
          description: `${inlineStyles.length} inline style blocks found on ${page.url}`,
          impact: 'Inline styles increase HTML size and may delay rendering.',
          suggestion: 'Consider moving inline styles to external CSS files.',
          url: page.url,
          priority: 2,
        });
      }
    });
  }

  private analyzeImages(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const images = page.images;
      const imagesWithoutLazyLoading = images.filter(
        (img) => img.loading !== 'lazy' && !img.src?.includes('data:')
      );
      
      // Check for missing lazy loading
      if (imagesWithoutLazyLoading.length > 5) {
        issues.push({
          id: `no_lazy_${page.url}`,
          category: 'performance',
          type: 'missing_lazy_loading',
          severity: 'medium',
          title: 'Missing Lazy Loading',
          description: `${imagesWithoutLazyLoading.length} images without lazy loading on ${page.url}`,
          impact: 'Images load immediately, potentially slowing initial page render.',
          suggestion: 'Add loading="lazy" to images below the fold.',
          url: page.url,
          priority: 5,
        });
      }
      
      // Check for images without dimensions
      const imagesWithoutDimensions = images.filter(
        (img) => (!img.width || !img.height) && !img.src?.includes('data:')
      );
      
      if (imagesWithoutDimensions.length > 3) {
        issues.push({
          id: `no_dimensions_${page.url}`,
          category: 'performance',
          type: 'large_image',
          severity: 'low',
          title: 'Images Without Dimensions',
          description: `${imagesWithoutDimensions.length} images without explicit dimensions on ${page.url}`,
          impact: 'Images without dimensions can cause layout shifts during loading.',
          suggestion: 'Add width and height attributes to all images.',
          url: page.url,
          priority: 3,
        });
      }
      
      // Check for many images (potential optimization)
      if (images.length > 20) {
        issues.push({
          id: `many_images_${page.url}`,
          category: 'performance',
          type: 'large_image',
          severity: 'medium',
          title: 'Many Images on Page',
          description: `${images.length} images found on ${page.url}`,
          impact: 'Pages with many images may load slowly.',
          suggestion: 'Consider lazy loading, image sprites, or reducing image count.',
          url: page.url,
          priority: 5,
        });
      }
    });
  }

  private analyzeCompression(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const contentType = page.headers['content-type'] || '';
      const contentEncoding = page.headers['content-encoding'];
      
      // Check for compression on HTML
      if (contentType.includes('text/html') && !contentEncoding) {
        issues.push({
          id: `no_compression_${page.url}`,
          category: 'performance',
          type: 'missing_compression',
          severity: 'medium',
          title: 'No Content Compression',
          description: `No content-encoding header detected for ${page.url}`,
          impact: 'Uncompressed content transfers more data, slowing page load.',
          suggestion: 'Enable gzip or brotli compression on your server.',
          url: page.url,
          priority: 6,
        });
      }
    });
  }

  private analyzeCache(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const cacheControl = page.headers['cache-control'];
      
      if (!cacheControl) {
        issues.push({
          id: `no_cache_${page.url}`,
          category: 'performance',
          type: 'missing_compression',
          severity: 'low',
          title: 'Missing Cache Headers',
          description: `No cache-control header found for ${page.url}`,
          impact: 'Without cache headers, browsers re-fetch resources on each visit.',
          suggestion: 'Add appropriate cache-control headers for static assets.',
          url: page.url,
          priority: 3,
        });
      } else if (cacheControl.includes('no-cache') || cacheControl.includes('no-store')) {
        issues.push({
          id: `no_cache_policy_${page.url}`,
          category: 'performance',
          type: 'missing_compression',
          severity: 'low',
          title: 'Aggressive Cache Policy',
          description: `Cache policy may be too restrictive: ${cacheControl}`,
          impact: 'Preventing caching can increase server load and slow repeat visits.',
          suggestion: 'Consider allowing caching for static assets with appropriate max-age.',
          url: page.url,
          priority: 2,
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
      category: 'performance',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0,
      passed,
      failed: maxScore - passed,
    };
  }
}
