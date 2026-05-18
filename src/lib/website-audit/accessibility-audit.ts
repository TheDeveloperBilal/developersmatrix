// Accessibility Audit Module
// Analyzes web accessibility (WCAG compliance indicators)

import type { PageData, AuditIssue, AuditScore } from './types';

export class AccessibilityAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];
    
    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // Image Alt Text Analysis
    this.analyzeAltText(pages, issues);
    
    // Heading Hierarchy Analysis
    this.analyzeHeadingHierarchy(pages, issues);
    
    // Form Accessibility Analysis
    this.analyzeFormAccessibility(pages, issues);
    
    // Language Attribute Analysis
    this.analyzeLanguageAttribute(pages, issues);
    
    // ARIA Analysis
    this.analyzeARIA(pages, issues);
    
    // Link Text Analysis
    this.analyzeLinkText(pages, issues);
    
    // Skip Link Analysis
    this.analyzeSkipLinks(pages, issues);
    
    // Calculate score
    const totalChecks = 14;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'high' || i.severity === 'critical').length;
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  private analyzeAltText(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const images = page.images;
      const imagesWithoutAlt = images.filter((img) => !img.alt || img.alt.trim() === '');
      const imagesWithEmptyAlt = images.filter((img) => img.alt === '');
      const imagesWithBadAlt = images.filter((img) => {
        const alt = img.alt?.toLowerCase() || '';
        return alt.includes('image') || alt.includes('picture') || alt.includes('photo') || 
               alt.endsWith('.jpg') || alt.endsWith('.png') || alt.endsWith('.gif');
      });
      
      // Critical: Images without any alt attribute
      if (imagesWithoutAlt.length > imagesWithEmptyAlt.length) {
        const missingAlt = imagesWithoutAlt.filter((img) => img.alt === undefined || img.alt === null);
        if (missingAlt.length > 0) {
          issues.push({
            id: `missing_alt_${page.url}`,
            category: 'accessibility',
            type: 'missing_alt_text',
            severity: missingAlt.length > 5 ? 'critical' : 'high',
            title: 'Images Missing Alt Text',
            description: `${missingAlt.length} images without alt attribute on ${page.url}`,
            impact: 'Screen readers cannot describe these images to visually impaired users. This violates WCAG 2.1 Level A requirements and can result in ADA lawsuits.',
            suggestion: 'Add descriptive alt text to all meaningful images. Use empty alt="" for decorative images.',
            url: page.url,
            priority: missingAlt.length > 5 ? 9 : 7,
            affectedUrls: [page.url],
            affectedElements: missingAlt.slice(0, 5).map((img, i) => ({
              tag: 'img',
              attributes: { src: img.src || '', alt: img.alt || '' },
              outerHTML: `<img src="${img.src || ''}"${img.width ? ` width="${img.width}"` : ''}${img.height ? ` height="${img.height}"` : ''} />`,
              selector: `img[src="${img.src}"]`,
            })),
            codeSnippet: missingAlt.slice(0, 3).map(img => `<img src="${img.src}" alt="ADD DESCRIPTIVE TEXT HERE" />`).join('\n'),
            fixInstructions: [
              { step: 1, title: 'Identify meaningful vs decorative', description: 'Decorative images (borders, backgrounds) use alt="". Content images need descriptive text.' },
              { step: 2, title: 'Write descriptive alt text', description: 'Describe what the image shows. Example: "Bar chart showing Q3 revenue growth" not "image1.jpg".' },
              { step: 3, title: 'Add alt attributes', description: 'Update each <img> tag with appropriate alt text.' }
            ],
            estimatedImpact: 'Essential for WCAG 2.1 compliance and prevents ADA legal liability',
            timeToFix: `${Math.max(5, missingAlt.length * 0.5)} minutes`,
            difficulty: 'easy',
          });
        }
      }
      
      // Medium: Images with generic alt text
      if (imagesWithBadAlt.length > 0) {
        issues.push({
          id: `bad_alt_${page.url}`,
          category: 'accessibility',
          type: 'missing_alt_text',
          severity: 'medium',
          title: 'Generic Alt Text Detected',
          description: `${imagesWithBadAlt.length} images have generic or unhelpful alt text.`,
          impact: 'Generic alt text like "image" or filenames doesn\'t help screen reader users.',
          suggestion: 'Replace generic alt text with meaningful descriptions.',
          url: page.url,
          priority: 5,
        });
      }
    });
  }

  private analyzeHeadingHierarchy(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const { h1, h2, h3, h4, h5, h6 } = page.meta;
      
      // Check for missing H1
      if (h1.length === 0) {
        issues.push({
          id: `no_h1_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'high',
          title: 'Missing H1 Heading',
          description: `No H1 heading found on ${page.url}`,
          impact: 'Screen readers use H1 to understand page structure. Missing H1 confuses navigation.',
          suggestion: 'Add exactly one H1 heading that describes the main topic of the page.',
          url: page.url,
          priority: 8,
        });
      }
      
      // Check for multiple H1s
      if (h1.length > 1) {
        issues.push({
          id: `multiple_h1_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'medium',
          title: 'Multiple H1 Headings',
          description: `${h1.length} H1 headings found on ${page.url}`,
          impact: 'Multiple H1s can confuse screen reader users about the page structure.',
          suggestion: 'Use only one H1 per page. Convert additional H1s to H2.',
          url: page.url,
          priority: 6,
        });
      }
      
      // Check for skipped heading levels
      if (h1.length > 0 && h2.length === 0 && h3.length > 0) {
        issues.push({
          id: `skipped_h2_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'medium',
          title: 'Skipped Heading Level (H2)',
          description: 'H3 headings found without H2 headings.',
          impact: 'Skipping heading levels creates poor navigation structure for screen readers.',
          suggestion: 'Maintain proper heading hierarchy: H1 -> H2 -> H3.',
          url: page.url,
          priority: 5,
        });
      }
      
      if (h2.length > 0 && h3.length === 0 && h4.length > 0) {
        issues.push({
          id: `skipped_h3_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'low',
          title: 'Skipped Heading Level (H3)',
          description: 'H4 headings found without H3 headings.',
          impact: 'Minor heading hierarchy issue that may affect screen reader navigation.',
          suggestion: 'Consider adding H3 headings to maintain proper hierarchy.',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeFormAccessibility(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      page.forms.forEach((form, formIndex) => {
        // Check inputs without labels
        const inputsWithoutLabels = form.inputs.filter((input) => {
          return !input.hasLabel && !input.placeholder && input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button';
        });
        
        if (inputsWithoutLabels.length > 0) {
          issues.push({
            id: `no_label_${page.url}_${formIndex}`,
            category: 'accessibility',
            type: 'missing_label',
            severity: 'high',
            title: 'Form Inputs Without Labels',
            description: `${inputsWithoutLabels.length} form inputs without labels on ${page.url}`,
            impact: 'Screen reader users cannot understand what each input field is for.',
            suggestion: 'Add <label> elements with for="input-id" attributes for all inputs.',
            url: page.url,
            priority: 7,
          });
        }
        
        // Check for placeholder-only labels
        const placeholderOnlyInputs = form.inputs.filter((input) => {
          return !input.hasLabel && input.placeholder && input.type !== 'hidden';
        });
        
        if (placeholderOnlyInputs.length > 0) {
          issues.push({
            id: `placeholder_only_${page.url}_${formIndex}`,
            category: 'accessibility',
            type: 'missing_label',
            severity: 'medium',
            title: 'Inputs Relying Only on Placeholders',
            description: `${placeholderOnlyInputs.length} inputs use only placeholders as labels.`,
            impact: 'Placeholders disappear when users type, and may not be read by all screen readers.',
            suggestion: 'Add visible labels in addition to placeholders.',
            url: page.url,
            priority: 5,
          });
        }
      });
    });
  }

  private analyzeLanguageAttribute(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      if (!page.meta.lang) {
        issues.push({
          id: `no_lang_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'medium',
          title: 'Missing Language Attribute',
          description: `No lang attribute on <html> element on ${page.url}`,
          impact: 'Screen readers need to know the language to pronounce content correctly.',
          suggestion: 'Add lang="en" (or appropriate language code) to the <html> element.',
          url: page.url,
          priority: 6,
        });
      }
    });
  }

  private analyzeARIA(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    // Check for ARIA landmarks
    const hasLandmarks = 
      mainPage.html.includes('role="main"') || 
      mainPage.html.includes('role="navigation"') ||
      mainPage.html.includes('<main') ||
      mainPage.html.includes('<nav') ||
      mainPage.html.includes('<header') ||
      mainPage.html.includes('<footer');
    
    if (!hasLandmarks) {
      issues.push({
        id: 'no_landmarks',
        category: 'accessibility',
        type: 'heading_hierarchy',
        severity: 'medium',
        title: 'Missing ARIA Landmarks',
        description: 'No semantic landmarks (main, nav, header, footer) detected.',
        impact: 'Screen reader users rely on landmarks to navigate pages efficiently.',
        suggestion: 'Use semantic HTML5 elements (header, nav, main, footer) or ARIA roles.',
        url: mainPage.url,
        priority: 5,
      });
    }
    
    // Check for potentially misused ARIA
    const ariaHiddenCount = (mainPage.html.match(/aria-hidden="true"/g) || []).length;
    const focusableElements = (mainPage.html.match(/<a\s|<button\s|<input\s/gi) || []).length;
    
    if (ariaHiddenCount > 5 && focusableElements > 10) {
      issues.push({
        id: 'aria_hidden_check',
        category: 'accessibility',
        type: 'heading_hierarchy',
        severity: 'low',
        title: 'High Use of aria-hidden',
        description: `${ariaHiddenCount} elements with aria-hidden="true" detected.`,
        impact: 'Ensure aria-hidden elements don\'t contain focusable content that keyboard users can\'t access.',
        suggestion: 'Verify that aria-hidden elements don\'t contain interactive elements.',
        url: mainPage.url,
        priority: 3,
      });
    }
  }

  private analyzeLinkText(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const vagueLinkTexts = ['click here', 'read more', 'more', 'here', 'link', 'download', 'learn more'];
      const vagueLinks: string[] = [];
      
      page.links.forEach((link) => {
        const text = link.text.toLowerCase().trim();
        if (vagueLinkTexts.includes(text) || text.length < 3) {
          vagueLinks.push(link.text);
        }
      });
      
      if (vagueLinks.length > 3) {
        issues.push({
          id: `vague_links_${page.url}`,
          category: 'accessibility',
          type: 'missing_label',
          severity: 'medium',
          title: 'Vague Link Text',
          description: `${vagueLinks.length} links with vague text like "click here" or "read more".`,
          impact: 'Screen reader users navigating by links won\'t understand the destination.',
          suggestion: 'Use descriptive link text that indicates the destination or action.',
          url: page.url,
          priority: 5,
        });
      }
      
      // Check for links that open in new window without warning
      const newWindowLinks = page.links.filter((link) => link.target === '_blank');
      const linksWithoutWarning = newWindowLinks.filter((link) => {
        return !link.text.toLowerCase().includes('new window') && 
               !link.text.toLowerCase().includes('opens in') &&
               !link.text.toLowerCase().includes('new tab');
      });
      
      if (linksWithoutWarning.length > 3) {
        issues.push({
          id: `new_window_links_${page.url}`,
          category: 'accessibility',
          type: 'missing_label',
          severity: 'low',
          title: 'Links Opening in New Window',
          description: `${linksWithoutWarning.length} links open in new window without warning.`,
          impact: 'Screen reader users may be confused when focus moves to a new window unexpectedly.',
          suggestion: 'Warn users when links open in new windows, e.g., "(opens in new tab)".',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeSkipLinks(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    // Check for skip navigation link
    const hasSkipLink = 
      mainPage.html.includes('skip') || 
      mainPage.html.includes('#main') ||
      mainPage.html.includes('#content') ||
      mainPage.html.includes('href="#') && mainPage.links[0]?.href.includes('#');
    
    if (!hasSkipLink && mainPage.links.length > 10) {
      issues.push({
        id: 'no_skip_link',
        category: 'accessibility',
        type: 'heading_hierarchy',
        severity: 'medium',
        title: 'Missing Skip Navigation Link',
        description: 'No skip navigation link found on a page with many links.',
        impact: 'Keyboard users must tab through all navigation to reach main content.',
        suggestion: 'Add a "Skip to main content" link at the beginning of the page.',
        url: mainPage.url,
        priority: 5,
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
      category: 'accessibility',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0,
      passed,
      failed: maxScore - passed,
    };
  }
}
