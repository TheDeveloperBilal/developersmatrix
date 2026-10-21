// Mobile UX Audit Module
//
// Only checks we can measure from the HTML: the viewport meta tag and the
// theme colour. Font sizes, tap target sizes, spacing and horizontal overflow
// depend on the CSS (usually in external files) and on how the page renders,
// so we leave those to the speed section, where Google PageSpeed loads the
// page in a real mobile browser.

import type { PageData, AuditIssue, AuditScore } from './types';

/** Parses "width=device-width, initial-scale=1" into a lower case key/value map. */
function parseViewport(content: string): Map<string, string> {
  const map = new Map<string, string>();
  content.split(/[,;]/).forEach((part) => {
    const eq = part.indexOf('=');
    const key = (eq === -1 ? part : part.slice(0, eq)).trim().toLowerCase();
    const value = eq === -1 ? '' : part.slice(eq + 1).trim().toLowerCase();
    if (key) map.set(key, value.replace(/^["']|["']$/g, ''));
  });
  return map;
}

export class MobileAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];

    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // Viewport Analysis
    this.analyzeViewport(pages, issues);

    // Mobile Meta Tags
    this.analyzeMobileMeta(pages, issues);

    // Calculate score
    const totalChecks = 10;
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

  private analyzeViewport(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const viewport = (page.meta.viewport || '').trim();

      if (!viewport) {
        issues.push({
          id: `no_viewport_${page.url}`,
          category: 'mobile',
          type: 'missing_viewport',
          severity: 'high',
          title: 'Missing Viewport Meta Tag',
          description: `We found no viewport meta tag on ${page.url}.`,
          impact: 'Without a viewport tag, phones show the desktop layout shrunk down to fit the screen, so text is tiny and visitors have to pinch and zoom to read or tap anything.',
          suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head> section.',
          url: page.url,
          priority: 9,
          affectedUrls: [page.url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no viewport meta tag...</head>', selector: 'head' }],
          codeSnippet: '<!-- Add this inside <head> -->\n<meta name="viewport" content="width=device-width, initial-scale=1">',
          fixInstructions: [
            { step: 1, title: 'Add the viewport meta tag', description: 'Place <meta name="viewport" content="width=device-width, initial-scale=1"> inside your <head> section.' },
            { step: 2, title: 'Test on a phone', description: 'Check that the page fits the screen without sideways scrolling.' }
          ],
          timeToFix: '1 minute',
          difficulty: 'easy',
        });
        return;
      }

      const parsed = parseViewport(viewport);
      const selector = 'meta[name="viewport"]';
      const element = { tag: 'meta', attributes: { name: 'viewport', content: viewport }, outerHTML: `<meta name="viewport" content="${viewport}">`, selector };

      if (parsed.get('width') !== 'device-width') {
        issues.push({
          id: `viewport_width_${page.url}`,
          category: 'mobile',
          type: 'missing_viewport',
          severity: 'medium',
          title: 'Viewport Missing width=device-width',
          description: `The viewport tag on ${page.url} does not set width=device-width: "${viewport}".`,
          impact: 'Without width=device-width the page may be laid out at a fixed width and then scaled, instead of fitting the phone screen.',
          suggestion: 'Set the viewport to width=device-width, initial-scale=1.',
          url: page.url,
          priority: 6,
          affectedUrls: [page.url],
          affectedElements: [element],
          codeSnippet: `<!-- BEFORE -->\n<meta name="viewport" content="${viewport}">\n\n<!-- AFTER -->\n<meta name="viewport" content="width=device-width, initial-scale=1">`,
          timeToFix: '1 minute',
          difficulty: 'easy',
        });
      }

      // user-scalable=no (or 0), or a maximum-scale below 2, stops people zooming in.
      const userScalable = parsed.get('user-scalable');
      const blocksScaling = userScalable === 'no' || userScalable === '0' || userScalable === 'false';
      const maxScaleRaw = parsed.get('maximum-scale');
      const maxScale = maxScaleRaw !== undefined && maxScaleRaw !== '' ? parseFloat(maxScaleRaw) : NaN;
      const lowMaxScale = Number.isFinite(maxScale) && maxScale < 2;

      if (blocksScaling || lowMaxScale) {
        const reasons = [
          blocksScaling ? `user-scalable=${userScalable}` : '',
          lowMaxScale ? `maximum-scale=${maxScaleRaw}` : '',
        ].filter(Boolean).join(' and ');
        issues.push({
          id: `viewport_scale_${page.url}`,
          category: 'mobile',
          type: 'missing_viewport',
          severity: 'medium',
          title: 'Viewport Prevents Zoom',
          description: `The viewport tag on ${page.url} uses ${reasons}, which prevents zoom.`,
          impact: 'People with low vision rely on pinch to zoom to read small text. Blocking it fails WCAG 2.1 success criterion 1.4.4 (Resize Text).',
          suggestion: 'Remove user-scalable=no and any maximum-scale below 5 from the viewport tag.',
          url: page.url,
          priority: 5,
          affectedUrls: [page.url],
          affectedElements: [element],
          codeSnippet: `<!-- BEFORE: prevents zoom -->\n<meta name="viewport" content="${viewport}">\n\n<!-- AFTER: allows zoom -->\n<meta name="viewport" content="width=device-width, initial-scale=1">`,
          fixInstructions: [
            { step: 1, title: 'Remove the zoom limits', description: 'Delete user-scalable=no and maximum-scale from the viewport tag.' }
          ],
          timeToFix: '1 minute',
          difficulty: 'easy',
        });
      }
    });
  }

  private analyzeMobileMeta(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];

    if (!mainPage) return;

    // A cosmetic suggestion only: some mobile browsers tint their toolbar with it.
    const themeColor = /<meta\s[^>]*name=["']?theme-color["']?/i.test(mainPage.html);

    if (!themeColor) {
      issues.push({
        id: 'no_theme_color',
        category: 'mobile',
        type: 'missing_viewport',
        severity: 'low',
        title: 'No Theme Color (optional)',
        description: 'The homepage has no theme-color meta tag.',
        impact: 'This is cosmetic. Some mobile browsers use it to tint the address bar in your brand colour. It has no effect on rankings or usability.',
        suggestion: 'If you want the browser toolbar to match your brand, add <meta name="theme-color" content="#1a73e8"> with your own brand colour.',
        url: mainPage.url,
        priority: 1,
      });
    }
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
      category: 'mobile',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0,
      passed,
      failed: maxScore - passed,
    };
  }
}
