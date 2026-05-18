// Mobile UX Audit Module
// Analyzes mobile-friendliness and responsive design

import type { PageData, AuditIssue, AuditScore } from './types';

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
    
    // Font Size Analysis
    this.analyzeFontSize(pages, issues);
    
    // Touch Target Analysis
    this.analyzeTouchTargets(pages, issues);
    
    // Responsive Layout Analysis
    this.analyzeResponsiveLayout(pages, issues);
    
    // Mobile Meta Tags
    this.analyzeMobileMeta(pages, issues);
    
    // Calculate score
    const totalChecks = 10;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'high' || i.severity === 'critical').length;
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
      const viewport = page.meta.viewport;
      
      if (!viewport) {
        issues.push({
          id: `no_viewport_${page.url}`,
          category: 'mobile',
          type: 'missing_viewport',
          severity: 'critical',
          title: 'Missing Viewport Meta Tag',
          description: `No viewport meta tag found on ${page.url}`,
          impact: 'Without a viewport tag, mobile browsers display the desktop version scaled down, making text unreadable and buttons impossible to tap. Over 60% of web traffic is mobile.',
          suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the <head> section.',
          url: page.url,
          priority: 10,
          affectedUrls: [page.url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no viewport meta tag...</head>', selector: 'head' }],
          codeSnippet: '<!-- Add this inside <head> -->\n<meta name="viewport" content="width=device-width, initial-scale=1">',
          fixInstructions: [
            { step: 1, title: 'Add the viewport meta tag', description: 'Place <meta name="viewport" content="width=device-width, initial-scale=1"> inside your <head> section.' },
            { step: 2, title: 'Test on mobile', description: 'Check that the page renders properly on mobile devices without horizontal scrolling.' }
          ],
          estimatedImpact: 'Essential for mobile usability. Without it, mobile users will have a terrible experience.',
          timeToFix: '1 minute',
          difficulty: 'easy',
        });
      } else {
        // Check viewport content
        if (!viewport.includes('width=device-width')) {
          issues.push({
            id: `viewport_width_${page.url}`,
            category: 'mobile',
            type: 'missing_viewport',
            severity: 'high',
            title: 'Viewport Missing Device Width',
            description: `Viewport doesn\'t include width=device-width: ${viewport}`,
            impact: 'Page may not adapt properly to different screen sizes.',
            suggestion: 'Add width=device-width to your viewport meta tag.',
            url: page.url,
            priority: 8,
            affectedUrls: [page.url],
            affectedElements: [{ tag: 'meta', attributes: { name: 'viewport', content: viewport }, outerHTML: `<meta name="viewport" content="${viewport}">`, selector: 'meta[name="viewport"]' }],
            codeSnippet: `<!-- BEFORE -->
<meta name="viewport" content="${viewport}">

<!-- AFTER -->
<meta name="viewport" content="width=device-width, initial-scale=1">`,
            fixInstructions: [
              { step: 1, title: 'Add width=device-width', description: 'Change your viewport tag to include width=device-width.' }
            ],
            estimatedImpact: 'Ensures proper responsive rendering on all screen sizes',
            timeToFix: '1 minute',
            difficulty: 'easy',
          });
        }
        
        if (viewport.includes('user-scalable=no') || viewport.includes('maximum-scale=1')) {
          issues.push({
            id: `viewport_scale_${page.url}`,
            category: 'mobile',
            type: 'missing_viewport',
            severity: 'medium',
            title: 'Viewport Prevents Scaling',
            description: `Viewport disables user scaling: ${viewport}`,
            impact: 'Preventing zoom can cause accessibility issues for users who need larger text.',
            suggestion: 'Allow user scaling by removing user-scalable=no and maximum-scale restrictions.',
            url: page.url,
            priority: 5,
            affectedUrls: [page.url],
            affectedElements: [{ tag: 'meta', attributes: { name: 'viewport', content: viewport }, outerHTML: `<meta name="viewport" content="${viewport}">`, selector: 'meta[name="viewport"]' }],
            codeSnippet: `<!-- BEFORE: Prevents zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1">

<!-- AFTER: Allows zoom (accessible) -->
<meta name="viewport" content="width=device-width, initial-scale=1">`,
            fixInstructions: [
              { step: 1, title: 'Remove scaling restrictions', description: 'Remove user-scalable=no and maximum-scale=1 from your viewport tag.' }
            ],
            estimatedImpact: 'Improves accessibility for users with vision impairments',
            timeToFix: '1 minute',
            difficulty: 'easy',
          });
        }
      }
    });
  }

  private analyzeFontSize(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // Check for potential small font issues in inline styles
      const smallFontPatterns = [
        /font-size:\s*8px/i,
        /font-size:\s*9px/i,
        /font-size:\s*10px/i,
        /font-size:\s*11px/i,
      ];
      
      let smallFontCount = 0;
      smallFontPatterns.forEach((pattern) => {
        const matches = page.html.match(pattern);
        if (matches) smallFontCount += matches.length;
      });
      
      if (smallFontCount > 5) {
        issues.push({
          id: `small_fonts_${page.url}`,
          category: 'mobile',
          type: 'text_too_small',
          severity: 'medium',
          title: 'Small Font Sizes Detected',
          description: `${smallFontCount} instances of small font sizes (8-11px) found on ${page.url}`,
          impact: 'Small fonts are hard to read on mobile devices.',
          suggestion: 'Use a minimum font size of 16px for body text on mobile.',
          url: page.url,
          priority: 5,
        });
      }
    });
  }

  private analyzeTouchTargets(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // Count interactive elements
      const buttons = (page.html.match(/<button/gi) || []).length;
      const links = page.links.length;
      const inputs = page.forms.reduce((sum, form) => sum + form.inputs.length, 0);
      
      const interactiveElements = buttons + links + inputs;
      
      // Check for potential touch target issues
      const smallTargets = (page.html.match(/padding:\s*[0-2]px/gi) || []).length;
      const smallButtons = (page.html.match(/height:\s*[0-9]{1,2}px/gi) || []).length;
      
      if (smallTargets > 3 || smallButtons > 3) {
        issues.push({
          id: `small_targets_${page.url}`,
          category: 'mobile',
          type: 'touch_target_small',
          severity: 'medium',
          title: 'Small Touch Targets',
          description: 'Potential small touch targets detected.',
          impact: 'Touch targets under 44x44 pixels are hard to tap on mobile devices.',
          suggestion: 'Ensure all interactive elements are at least 44x44 pixels.',
          url: page.url,
          priority: 6,
        });
      }
      
      // Check for closely packed links
      const inlineLinks = (page.html.match(/>\s*<a\s/gi) || []).length;
      if (inlineLinks > 5) {
        issues.push({
          id: `close_links_${page.url}`,
          category: 'mobile',
          type: 'touch_target_small',
          severity: 'low',
          title: 'Closely Spaced Links',
          description: 'Multiple links in close proximity detected.',
          impact: 'Links too close together are hard to tap accurately on mobile.',
          suggestion: 'Add sufficient spacing between links (at least 8px).',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeResponsiveLayout(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // Check for fixed-width layouts
      const fixedWidth = page.html.match(/width:\s*[0-9]{3,4}px/gi);
      
      if (fixedWidth && fixedWidth.length > 5) {
        issues.push({
          id: `fixed_width_${page.url}`,
          category: 'mobile',
          type: 'touch_target_small',
          severity: 'medium',
          title: 'Fixed Width Layout',
          description: 'Fixed width elements detected which may not adapt to mobile screens.',
          impact: 'Fixed width layouts can cause horizontal scrolling on mobile devices.',
          suggestion: 'Use responsive units (%, rem, vw/vh) instead of fixed pixels.',
          url: page.url,
          priority: 5,
        });
      }
      
      // Check for overflow-x hidden (potential mobile issue)
      const overflowHidden = page.html.match(/overflow-x:\s*hidden/gi);
      if (overflowHidden && overflowHidden.length > 2) {
        issues.push({
          id: `overflow_hidden_${page.url}`,
          category: 'mobile',
          type: 'touch_target_small',
          severity: 'low',
          title: 'Horizontal Overflow Hidden',
          description: 'overflow-x: hidden may indicate content overflow issues.',
          impact: 'This may hide content that doesn\'t fit on narrow screens.',
          suggestion: 'Ensure content is properly responsive instead of hiding overflow.',
          url: page.url,
          priority: 2,
        });
      }
    });
  }

  private analyzeMobileMeta(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    
    if (!mainPage) return;
    
    // Check for theme-color
    const themeColor = mainPage.html.match(/<meta\s+name=["']theme-color["']/i);
    
    if (!themeColor) {
      issues.push({
        id: 'no_theme_color',
        category: 'mobile',
        type: 'missing_viewport',
        severity: 'low',
        title: 'Missing Theme Color',
        description: 'No theme-color meta tag found.',
        impact: 'Mobile browsers won\'t customize the address bar color to match your brand.',
        suggestion: 'Add <meta name="theme-color" content="#your-color"> for a better mobile experience.',
        url: mainPage.url,
        priority: 2,
      });
    }
    
    // Check for apple-mobile-web-app-capable
    const appleCapable = mainPage.html.match(/apple-mobile-web-app-capable/i);
    
    if (!appleCapable) {
      issues.push({
        id: 'no_apple_capable',
        category: 'mobile',
        type: 'missing_viewport',
        severity: 'low',
        title: 'Missing iOS Web App Meta',
        description: 'No apple-mobile-web-app meta tags found.',
        impact: 'iOS users won\'t get the full-screen app-like experience when adding to home screen.',
        suggestion: 'Add apple-mobile-web-app-capable and apple-mobile-web-app-status-bar-style meta tags.',
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
