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
          impact: 'Large pages take significantly longer to load, especially on mobile connections. Users typically abandon pages over 3 seconds. Google uses page speed as a ranking factor.',
          suggestion: 'Reduce page size by optimizing images (compress to WebP), minifying CSS/JS, removing unused code, and enabling compression.',
          url: page.url,
          priority: 9,
          affectedUrls: [page.url],
          affectedElements: [{ tag: 'html', attributes: {}, outerHTML: `<html>...page size ${sizeKB.toFixed(0)}KB...</html>`, selector: 'html' }],
          codeSnippet: `// Largest resources:\n// Images: ${page.images.length} files\n// Scripts: ${page.scripts.length} files\n// Styles: ${page.styles.length} files`,
          fixInstructions: [
            { step: 1, title: 'Compress images', description: 'Convert JPEG/PNG to WebP or AVIF. Use tools like Squoosh or ImageOptim.' },
            { step: 2, title: 'Minify CSS and JS', description: 'Remove whitespace, comments, and unused code. Use build tools like Webpack or Vite.' },
            { step: 3, title: 'Enable gzip/brotli', description: 'Configure your server to compress text-based assets.' },
            { step: 4, title: 'Remove unused resources', description: 'Audit and remove scripts/stylesheets that are not needed on this page.' }
          ],
          estimatedImpact: `Reducing from ${sizeMB.toFixed(1)}MB to under 1MB can improve load time by ${(sizeMB * 0.5).toFixed(1)} seconds`,
          timeToFix: '1-2 hours',
          difficulty: 'medium',
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
          impact: 'Users typically abandon pages that take more than 3 seconds to load. Slow pages hurt SEO rankings, conversions, and user satisfaction. Google explicitly uses page speed as a ranking factor.',
          suggestion: 'Optimize server response time, enable caching, compress images, minify CSS/JS, and consider using a CDN.',
          url: page.url,
          priority: 10,
          affectedUrls: [page.url],
          affectedElements: [{ tag: 'html', attributes: {}, outerHTML: `<html>...load time ${(loadTime/1000).toFixed(1)}s...</html>`, selector: 'html' }],
          codeSnippet: `// Server response: ${page.loadTime}ms\n// Resources: ${page.scripts.length + page.styles.length + page.images.length} total\n// Blocking scripts: ${page.scripts.filter(s => s.src && !s.async && !s.defer).length}`,
          fixInstructions: [
            { step: 1, title: 'Check server response time', description: 'Your server took too long to respond. Upgrade hosting or optimize database queries.' },
            { step: 2, title: 'Compress and optimize images', description: 'Large images are the #1 cause of slow pages. Compress and use modern formats.' },
            { step: 3, title: 'Minify CSS and JavaScript', description: 'Remove unnecessary characters from code files.' },
            { step: 4, title: 'Enable browser caching', description: 'Set Cache-Control headers so repeat visitors load faster.' },
            { step: 5, title: 'Use a CDN', description: 'Serve static assets from servers closer to your users.' }
          ],
          estimatedImpact: `Reducing load time from ${(loadTime/1000).toFixed(1)}s to under 2s can reduce bounce rate by 30-50%`,
          timeToFix: '2-4 hours',
          difficulty: 'medium',
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
        const blockingSrcs = blockingScripts.slice(0, 5).map(s => s.src || 'inline').join(', ');
        issues.push({
          id: `blocking_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'medium',
          title: 'Render-Blocking Scripts',
          description: `${blockingScripts.length} scripts may block rendering on ${page.url}`,
          impact: 'Render-blocking scripts delay the first paint of the page. The browser must download and execute these scripts before showing any content to the user.',
          suggestion: 'Add async or defer attributes to non-critical scripts. Move critical CSS inline and load non-critical CSS asynchronously.',
          url: page.url,
          priority: 6,
          affectedUrls: [page.url],
          affectedElements: blockingScripts.slice(0, 5).map(s => ({
            tag: 'script',
            attributes: { src: s.src || 'inline', async: String(s.async), defer: String(s.defer) },
            outerHTML: `<script${s.src ? ` src="${s.src}"` : ''}${s.async ? ' async' : ''}${s.defer ? ' defer' : ''}></script>`,
            selector: `script[src="${s.src}"]`,
          })),
          codeSnippet: `<!-- BEFORE: Blocking -->\n<script src="${blockingScripts[0]?.src || 'app.js'}"></script>\n\n<!-- AFTER: Non-blocking -->\n<script src="${blockingScripts[0]?.src || 'app.js'}" defer></script>`,
          fixInstructions: [
            { step: 1, title: 'Identify non-critical scripts', description: 'Scripts for analytics, chat widgets, and social media are usually not needed immediately.' },
            { step: 2, title: 'Add defer or async', description: 'Add defer to scripts that need to run in order. Add async to independent scripts.' },
            { step: 3, title: 'Inline critical CSS', description: 'Put above-the-fold CSS directly in <style> in <head>.' }
          ],
          estimatedImpact: 'Can improve First Contentful Paint by 0.5-2 seconds',
          timeToFix: '30 minutes',
          difficulty: 'medium',
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
          impact: 'Images below the fold load immediately, consuming bandwidth and slowing the initial page render. This hurts Core Web Vitals, especially on mobile.',
          suggestion: 'Add loading="lazy" to images below the fold. Only eagerly load images in the initial viewport.',
          url: page.url,
          priority: 5,
          affectedUrls: [page.url],
          affectedElements: imagesWithoutLazyLoading.slice(0, 5).map(img => ({
            tag: 'img',
            attributes: { src: img.src || '', alt: img.alt || '' },
            outerHTML: `<img src="${img.src || ''}" alt="${img.alt || ''}" />`,
            selector: `img[src="${img.src}"]`,
          })),
          codeSnippet: `<!-- BEFORE -->
<img src="below-fold-image.jpg" alt="Description" />

<!-- AFTER -->
<img src="below-fold-image.jpg" alt="Description" loading="lazy" />`,
          fixInstructions: [
            { step: 1, title: 'Identify below-fold images', description: 'Images that appear after the initial viewport should use lazy loading.' },
            { step: 2, title: 'Add loading="lazy"', description: 'Add the attribute to all non-critical images.' },
            { step: 3, title: 'Keep above-fold images eager', description: 'Hero images and logos should NOT have loading="lazy".' }
          ],
          estimatedImpact: 'Can improve initial page load time by 15-30% on image-heavy pages',
          timeToFix: '10 minutes',
          difficulty: 'easy',
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
          impact: 'Images without width and height attributes cause layout shifts (CLS) as the browser does not know how much space to reserve. This hurts Core Web Vitals and user experience.',
          suggestion: 'Add width and height attributes to all images, or use aspect-ratio CSS.',
          url: page.url,
          priority: 3,
          affectedUrls: [page.url],
          affectedElements: imagesWithoutDimensions.slice(0, 5).map(img => ({
            tag: 'img',
            attributes: { src: img.src || '', alt: img.alt || '' },
            outerHTML: `<img src="${img.src || ''}" alt="${img.alt || ''}" />`,
            selector: `img[src="${img.src}"]`,
          })),
          codeSnippet: `<!-- BEFORE: Causes layout shift -->
<img src="photo.jpg" alt="Description" />

<!-- AFTER: Prevents layout shift -->
<img src="photo.jpg" alt="Description" width="800" height="600" />`,
          fixInstructions: [
            { step: 1, title: 'Get image dimensions', description: 'Check the actual pixel dimensions of each image file.' },
            { step: 2, title: 'Add width and height', description: 'Add attributes matching the actual dimensions.' }
          ],
          estimatedImpact: 'Eliminates layout shifts and improves CLS score significantly',
          timeToFix: '15 minutes',
          difficulty: 'easy',
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
