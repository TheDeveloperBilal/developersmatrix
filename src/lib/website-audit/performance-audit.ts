// Performance Audit Module
//
// What we can tell from one HTML response: how fast the server answered our
// request, how big the HTML document is, which scripts block rendering, image
// markup, compression and caching headers. Real loading speed in a browser
// (Core Web Vitals) comes from Google PageSpeed in the speed section.

import * as cheerio from 'cheerio';
import type { PageData, AuditIssue, AuditScore, ScriptInfo } from './types';

/** Script types a browser actually runs. Everything else (JSON, templates) is data. */
const EXECUTABLE_TYPES = new Set(['', 'text/javascript', 'application/javascript', 'module', 'text/ecmascript', 'application/ecmascript']);

/** Inline scripts that only carry framework data, such as Next.js flight payloads. */
const FRAMEWORK_DATA = /^\s*\(?\s*(self|window)\.(__next_f|__NEXT_DATA__|__NUXT__|__APOLLO_STATE__|__remixContext|__staticRouterHydrationData)/;

const COMPRESSED_ENCODINGS = /\b(gzip|br|zstd|deflate|compress)\b/i;

/** File endings of image formats that have smaller modern replacements. */
const LEGACY_EXTENSION = /\.(jpe?g|png|gif|bmp)$/i;

/**
 * Image addresses that a CDN or framework already serves as WebP or AVIF to
 * browsers that support it, so the file ending says nothing about what arrives.
 */
const MODERN_FORMAT_HINTS = [
  '/_next/image',
  'f_auto',
  'auto=format',
  'fm=webp',
  'fm=avif',
  'format=webp',
  'format=auto',
  '/cdn-cgi/image/',
  'imagekit',
  // Shopify's CDN and WordPress.com's image service pick WebP for browsers that accept it.
  'cdn.shopify.com',
  '.wp.com/',
  // Shopify themes now serve the same CDN from the store's own domain.
  '/cdn/shop/',
  // Wix, Vercel, Netlify, Cloudflare Images and Nuxt image services.
  'enc_auto',
  'wixstatic.com',
  '/_vercel/image',
  '/.netlify/images',
  'imagedelivery.net',
  '/_ipx/',
];

export class PerformanceAuditor {
  private docs = new WeakMap<PageData, cheerio.CheerioAPI>();

  private doc(page: PageData): cheerio.CheerioAPI {
    let $ = this.docs.get(page);
    if (!$) {
      $ = cheerio.load(page.html || '');
      this.docs.set(page, $);
    }
    return $;
  }

  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];

    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // HTML document size
    this.analyzePageSize(pages, issues);

    // Server response time
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

    // Number of HTML elements
    this.analyzeDomSize(pages, issues);

    // JPEG, PNG and GIF images that could be WebP or AVIF
    this.analyzeImageFormats(pages, issues);

    // Calculate score
    const totalChecks = 15;
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

  /** page.size is the HTML document only, not images, scripts or styles. */
  private analyzePageSize(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const sizeKB = page.size / 1024;
      if (sizeKB <= 500) return;

      const severity = sizeKB > 1536 ? 'medium' : 'low';
      const sizeText = sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB.toFixed(0)} KB`;
      issues.push({
        id: `large_page_${page.url}`,
        category: 'performance',
        type: 'large_page_size',
        severity,
        title: 'Large HTML Document',
        description: `The HTML of ${page.url} is ${sizeText} on its own, before any images, scripts or styles load.`,
        impact: 'The browser has to download and parse all of this HTML before it can finish the page. Most pages need well under 500 KB of HTML. Large documents usually come from inlined data, inlined images or very long lists.',
        suggestion: 'Look for big inline data blobs (for example framework state or JSON), base64 images and inline SVGs, and move them out of the HTML or load them only when needed. Paginate very long lists.',
        url: page.url,
        priority: severity === 'medium' ? 5 : 3,
        affectedUrls: [page.url],
        fixInstructions: [
          { step: 1, title: 'Find what makes the HTML large', description: 'View the page source and look for large <script> data blocks, data: URLs and long inline SVGs.' },
          { step: 2, title: 'Move data out of the HTML', description: 'Load large data with a separate request, or send only what the first screen needs.' },
          { step: 3, title: 'Make sure compression is on', description: 'gzip or Brotli shrinks HTML a lot on the wire, though the browser still has to parse the full size.' }
        ],
        difficulty: 'medium',
      });
    });
  }

  /** page.loadTime is the time until the server answered, measured from our server. */
  private analyzeLoadTime(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const ms = page.loadTime;
      if (ms <= 800) return;

      const severity = ms > 3000 ? 'high' : ms > 1800 ? 'medium' : 'low';
      const seconds = (ms / 1000).toFixed(1);
      issues.push({
        id: `slow_load_${page.url}`,
        category: 'performance',
        type: 'slow_load_time',
        severity,
        title: 'Slow Server Response (measured from our server)',
        description: `${page.url} took ${seconds} seconds (${ms} ms) to answer our request. This is the time until the server answered, measured from our server, not the full page load in a browser.`,
        impact: 'Nothing can appear on screen until the server answers, so a slow response delays everything else. The figure depends on where our server is and how busy yours was at that moment, so check the speed section, where Google PageSpeed shows real loading data.',
        suggestion: 'Cache pages at the server or a CDN, speed up slow database queries or API calls, and check that your hosting plan is not overloaded. Run the audit again to see whether the slow answer repeats.',
        url: page.url,
        priority: severity === 'high' ? 7 : severity === 'medium' ? 5 : 3,
        affectedUrls: [page.url],
        fixInstructions: [
          { step: 1, title: 'Confirm it repeats', description: 'Response times vary. Test again, and compare with the server response time in Google PageSpeed.' },
          { step: 2, title: 'Cache the page', description: 'Serve pages from a cache or CDN where the content allows it, so the server does not rebuild them for every visitor.' },
          { step: 3, title: 'Find slow work', description: 'Look at server logs or monitoring for slow database queries and external API calls on this page.' }
        ],
        difficulty: 'medium',
      });
    });
  }

  private analyzeScripts(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const externalScripts = page.scripts.filter((s) => s.src);

      // A script blocks rendering only when it sits in <head>, loads a file and
      // has none of async, defer or type="module".
      const blocking: string[] = [];
      $('head script[src]').each((_, el) => {
        const $s = $(el);
        const type = ($s.attr('type') || '').trim().toLowerCase();
        if (!EXECUTABLE_TYPES.has(type) || type === 'module') return;
        if ($s.attr('async') !== undefined || $s.attr('defer') !== undefined) return;
        // nomodule scripts are legacy polyfills. Every modern browser skips
        // them without downloading, so they block nothing. Next.js adds one.
        if ($s.attr('nomodule') !== undefined) return;
        blocking.push($s.attr('src') || '');
      });

      // Many async chunks are normal for modern frameworks. Only a very large number is worth a note.
      if (externalScripts.length > 40) {
        issues.push({
          id: `many_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'low',
          title: 'Very Many Script Files',
          description: `${externalScripts.length} script files load on ${page.url}.`,
          impact: 'Even when they load in the background, every script has to be downloaded, parsed and run, which keeps the phone busy and can delay interaction.',
          suggestion: 'Check for scripts that this page does not need, such as old tracking tags or widgets, and remove them or load them only where they are used.',
          url: page.url,
          priority: 3,
        });
      }

      if (blocking.length > 0) {
        const severity = blocking.length >= 3 ? 'medium' : 'low';
        issues.push({
          id: `blocking_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity,
          title: 'Render Blocking Scripts',
          description: `${blocking.length} ${blocking.length === 1 ? 'script' : 'scripts'} in the <head> of ${page.url} ${blocking.length === 1 ? 'loads' : 'load'} without async, defer or type="module".`,
          impact: 'The browser stops building the page until each of these scripts has downloaded and run, so visitors look at a blank screen for longer.',
          suggestion: 'Add defer to scripts that need to run in order, or async to independent ones such as analytics. Move scripts that are not needed for the first screen to the end of the page.',
          url: page.url,
          priority: severity === 'medium' ? 6 : 4,
          affectedUrls: [page.url],
          affectedElements: blocking.slice(0, 5).map((src) => ({
            tag: 'script',
            attributes: { src },
            outerHTML: `<script src="${src}"></script>`,
            selector: `script[src="${src}"]`,
          })),
          codeSnippet: `<!-- BEFORE: blocks rendering -->\n<script src="${blocking[0] || 'app.js'}"></script>\n\n<!-- AFTER: does not block -->\n<script src="${blocking[0] || 'app.js'}" defer></script>`,
          fixInstructions: [
            { step: 1, title: 'Find scripts that can wait', description: 'Analytics, chat widgets and social embeds are rarely needed before the page shows.' },
            { step: 2, title: 'Add defer or async', description: 'Use defer for scripts that depend on each other, and async for scripts that stand alone.' }
          ],
          timeToFix: '30 minutes',
          difficulty: 'medium',
        });
      }

      // Inline scripts that the browser runs. JSON-LD, JSON, import maps and
      // framework data blocks are data, not code, so they do not count.
      const inlineExecutable = page.scripts.filter((s) => this.isExecutableInline(s));
      if (inlineExecutable.length > 15) {
        issues.push({
          id: `inline_scripts_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'low',
          title: 'Many Inline Scripts',
          description: `${inlineExecutable.length} inline scripts run on ${page.url}, not counting structured data or framework data blocks.`,
          impact: 'Each inline script runs as soon as the parser reaches it, which pauses page building while it runs.',
          suggestion: 'Combine small snippets where it is easy, and move code that is not needed straight away into a deferred file.',
          url: page.url,
          priority: 2,
        });
      }
    });
  }

  private isExecutableInline(s: ScriptInfo): boolean {
    if (s.src || !s.content || !s.content.trim()) return false;
    const type = (s.type || '').trim().toLowerCase();
    if (!EXECUTABLE_TYPES.has(type)) return false;
    if (FRAMEWORK_DATA.test(s.content)) return false;
    return true;
  }

  private analyzeStyles(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      // Stylesheets in <head> block the first paint unless they only apply to print.
      const blockingStyles = $('head link[rel~="stylesheet"][href]').filter((_, el) => {
        const media = ($(el).attr('media') || '').trim().toLowerCase();
        return media !== 'print';
      }).length;

      if (blockingStyles > 5) {
        issues.push({
          id: `many_styles_${page.url}`,
          category: 'performance',
          type: 'render_blocking',
          severity: 'low',
          title: 'Many Render Blocking Stylesheets',
          description: `${blockingStyles} stylesheets load in the <head> of ${page.url}.`,
          impact: 'The browser waits for every stylesheet in the <head> before it paints anything.',
          suggestion: 'Remove stylesheets this page does not use, inline the small amount of CSS the first screen needs, and load the rest later.',
          url: page.url,
          priority: 3,
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
          title: 'Images Without Lazy Loading',
          description: `${imagesWithoutLazyLoading.length} images on ${page.url} have no loading="lazy". Some of these may be at the top of the page, where eager loading is correct.`,
          impact: 'Images further down the page download straight away, competing with the content visitors see first, which matters most on mobile data.',
          suggestion: 'Add loading="lazy" to images below the first screen. Keep hero images and logos loading normally.',
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
            { step: 1, title: 'Find images below the first screen', description: 'Images that only appear after scrolling can load later.' },
            { step: 2, title: 'Add loading="lazy"', description: 'Add the attribute to those images.' },
            { step: 3, title: 'Leave the first screen alone', description: 'Hero images and logos should not use loading="lazy", or they will appear later.' }
          ],
          timeToFix: '10 minutes',
          difficulty: 'easy',
        });
      }

      // Check for images without dimensions
      const imagesWithoutDimensions = images.filter(
        (img) => (!img.width || !img.height) && !img.src?.includes('data:') && !img.sizedByContainer
      );

      if (imagesWithoutDimensions.length > 3) {
        issues.push({
          id: `no_dimensions_${page.url}`,
          category: 'performance',
          type: 'large_image',
          severity: 'low',
          title: 'Images Without Width and Height',
          description: `${imagesWithoutDimensions.length} images on ${page.url} have no width and height attributes.`,
          impact: 'This may cause layout shift: without a size the browser cannot reserve space, so text can jump as images arrive. It is fine if your CSS already reserves the space, for example with aspect-ratio.',
          suggestion: 'Add width and height attributes that match each image, or set an aspect-ratio in CSS.',
          url: page.url,
          priority: 3,
          affectedUrls: [page.url],
          affectedElements: imagesWithoutDimensions.slice(0, 5).map(img => ({
            tag: 'img',
            attributes: { src: img.src || '', alt: img.alt || '' },
            outerHTML: `<img src="${img.src || ''}" alt="${img.alt || ''}" />`,
            selector: `img[src="${img.src}"]`,
          })),
          codeSnippet: `<!-- BEFORE: may cause layout shift -->
<img src="photo.jpg" alt="Description" />

<!-- AFTER: space is reserved -->
<img src="photo.jpg" alt="Description" width="800" height="600" />`,
          fixInstructions: [
            { step: 1, title: 'Get image dimensions', description: 'Check the actual pixel dimensions of each image file.' },
            { step: 2, title: 'Add width and height', description: 'Add attributes matching those dimensions. CSS can still resize the image.' }
          ],
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
          severity: 'low',
          title: 'Many Images on the Page',
          description: `${images.length} images found on ${page.url}.`,
          impact: 'Every image is a download. On a long page that is fine if most of them load lazily and are well compressed.',
          suggestion: 'Lazy load images below the first screen, serve them in WebP or AVIF at the size they are shown, and remove any that add nothing.',
          url: page.url,
          priority: 2,
        });
      }
    });
  }

  private analyzeCompression(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const contentType = page.headers['content-type'] || page.contentType || '';
      const contentEncoding = page.headers['content-encoding'] || '';

      // Tiny documents gain almost nothing from compression.
      if (contentType.includes('text/html') && page.size > 2048 && !COMPRESSED_ENCODINGS.test(contentEncoding)) {
        issues.push({
          id: `no_compression_${page.url}`,
          category: 'performance',
          type: 'missing_compression',
          severity: 'medium',
          title: 'HTML Not Compressed',
          description: `The HTML of ${page.url} (${(page.size / 1024).toFixed(0)} KB) was sent without gzip, Brotli or zstd compression.`,
          impact: 'Uncompressed HTML is usually several times larger on the wire, so it takes longer to arrive, especially on mobile connections.',
          suggestion: 'Turn on gzip or Brotli compression for HTML, CSS and JavaScript on your server or CDN. Most hosts have a single setting for it.',
          url: page.url,
          priority: 6,
        });
      }
    });
  }

  private analyzeCache(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // no-cache and no-store are normal for HTML that changes, so we do not flag them.
      // A page with ETag or Last-Modified can still be revalidated cheaply.
      const cacheControl = page.headers['cache-control'];
      const validator = page.headers['etag'] || page.headers['last-modified'];

      if (!cacheControl && !validator) {
        issues.push({
          id: `no_cache_${page.url}`,
          category: 'performance',
          type: 'slow_load_time',
          severity: 'low',
          title: 'No Caching Headers on the Page',
          description: `${page.url} sends no Cache-Control, ETag or Last-Modified header.`,
          impact: 'Without these, browsers and CDNs have to guess how long to keep the page, and cannot cheaply check whether it changed.',
          suggestion: 'Send a Cache-Control header that fits the page, for example "public, max-age=0, must-revalidate" with an ETag for pages that change, or a longer max-age for pages that rarely do.',
          url: page.url,
          priority: 2,
        });
      }
    });
  }

  /** Elements in the HTML the server sent. Elements added later by scripts are not counted. */
  private analyzeDomSize(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      // Lighthouse counts the elements inside <body>.
      const count = $('body *').length;
      if (count <= 1400) return;

      const severity = count > 3000 ? 'medium' : 'low';
      const countText = count.toLocaleString('en-US');
      issues.push({
        id: `dom_size_${page.url}`,
        category: 'performance',
        type: 'dom_size',
        severity,
        title: 'Very Many HTML Elements on the Page',
        description: `The HTML that ${page.url} sends contains ${countText} elements. Google's Lighthouse flags pages above about 1,400 elements. We count the HTML the server sends, so elements that scripts add after the page loads are not included.`,
        impact: 'A large page makes the browser work harder for layout, styling and every script that touches the page. Phones feel this most: scrolling, tapping and typing can lag.',
        suggestion: 'Look for repeated or hidden blocks: big menus with every item written out, hidden tabs and sliders, the same SVG icon pasted many times, long lists and deeply nested wrapper elements from page builders. Load hidden parts when they are opened, and paginate long lists.',
        url: page.url,
        priority: severity === 'medium' ? 4 : 2,
        affectedUrls: [page.url],
        fixInstructions: [
          { step: 1, title: 'Find the biggest sections', description: 'Open the page in Chrome DevTools, run Lighthouse and read the DOM size item ("Optimize DOM size" in current versions). It names the deepest and widest parts of the page.' },
          { step: 2, title: 'Trim repeated markup', description: 'Reuse SVG icons with <use>, remove wrapper elements that do nothing, and keep menus to the links people need.' },
          { step: 3, title: 'Load hidden content later', description: 'Render tabs, accordions, modals and long lists when they are opened or scrolled into view, not all at once.' }
        ],
        timeToFix: '1 to 3 hours',
        difficulty: 'medium',
      });
    });
  }

  /** JPEG, PNG, GIF and BMP images that are not already served as WebP or AVIF by a <picture> or an image CDN. */
  private analyzeImageFormats(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const base = page.finalUrl || page.url;
      const legacy: string[] = [];

      $('img').each((_, el) => {
        const $img = $(el);
        let src = ($img.attr('src') || '').trim();
        if (!src) src = (($img.attr('srcset') || '').trim().split(',')[0] || '').trim().split(/\s+/)[0] || '';
        if (!src || /^data:/i.test(src)) return;

        const lower = src.toLowerCase();
        if (MODERN_FORMAT_HINTS.some((hint) => lower.includes(hint))) return;

        // A <picture> with a WebP or AVIF <source> already gives modern browsers a modern file.
        const picture = $img.closest('picture');
        if (picture.length > 0) {
          const modern = picture.find('source').filter((__, s) =>
            /image\/(webp|avif)/i.test($(s).attr('type') || '') || /\.(webp|avif)(\?|\s|,|$)/i.test($(s).attr('srcset') || '')
          ).length > 0;
          if (modern) return;
        }

        let path = '';
        try {
          path = new URL(src, base).pathname;
        } catch {
          path = src.split(/[?#]/)[0];
        }
        if (!LEGACY_EXTENSION.test(path)) return;
        legacy.push(path);
      });

      if (legacy.length < 3) return;

      const names = [...new Set(legacy.map((p) => {
        const name = p.split('/').filter(Boolean).pop() || p;
        try {
          return decodeURIComponent(name);
        } catch {
          return name;
        }
      }))];
      issues.push({
        id: `legacy_images_${page.url}`,
        category: 'performance',
        type: 'legacy_image_format',
        severity: 'low',
        title: 'Images Not Served in WebP or AVIF',
        description: `${legacy.length} images on ${page.url} are JPEG, PNG, GIF or BMP files, for example ${names.slice(0, 5).join(', ')}.`,
        impact: 'WebP and AVIF files are usually much smaller than JPEG or PNG at the same visual quality, so images arrive sooner, especially on mobile data. Some hosts and CDNs convert formats automatically for browsers that support them; if yours does, you can ignore this.',
        suggestion: 'Convert photos and large graphics to WebP or AVIF, or serve them through a <picture> element with a WebP or AVIF <source> and the original file as a fallback. Many hosts, CDNs and image plugins can do this for you.',
        url: page.url,
        priority: 3,
        affectedUrls: [page.url],
        affectedElements: legacy.slice(0, 5).map((p) => ({
          tag: 'img',
          attributes: { src: p },
          outerHTML: `<img src="${p}">`,
          selector: `img[src*="${p.split('/').pop() || p}"]`,
        })),
        codeSnippet: '<picture>\n  <source srcset="photo.avif" type="image/avif">\n  <source srcset="photo.webp" type="image/webp">\n  <img src="photo.jpg" alt="Description" width="800" height="600">\n</picture>',
        fixInstructions: [
          { step: 1, title: 'Check what your host already does', description: 'Open the image address in Chrome DevTools, Network tab, and look at the Content-Type of the response. If it says image/webp or image/avif, the CDN already converts it and nothing needs to change.' },
          { step: 2, title: 'Convert the files', description: 'Use your image plugin, build tool or a converter such as Squoosh to make WebP or AVIF versions.' },
          { step: 3, title: 'Serve them with a fallback', description: 'Use a <picture> element with the new formats first and the original as the <img>, so older browsers still get a picture.' }
        ],
        timeToFix: '30 minutes',
        difficulty: 'easy',
      });
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
