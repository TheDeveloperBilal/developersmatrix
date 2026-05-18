// Security Audit Module
// Analyzes website security indicators

import type { PageData, AuditIssue, AuditScore } from './types';

export class SecurityAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];
    
    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // HTTPS Analysis
    this.analyzeHTTPS(pages, issues);
    
    // Security Headers Analysis
    this.analyzeSecurityHeaders(pages, issues);
    
    // Mixed Content Analysis
    this.analyzeMixedContent(pages, issues);
    
    // External Resource Security
    this.analyzeExternalResources(pages, issues);
    
    // Form Security
    this.analyzeFormSecurity(pages, issues);
    
    // Calculate score
    const totalChecks = 12;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'high' || i.severity === 'critical').length;
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  private analyzeHTTPS(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      try {
        const url = new URL(page.url);
        
        if (url.protocol !== 'https:') {
          issues.push({
            id: `no_https_${page.url}`,
            category: 'security',
            type: 'missing_https',
            severity: 'critical',
            title: 'Not Using HTTPS',
            description: `Page is served over HTTP instead of HTTPS: ${page.url}`,
            impact: 'All data transmitted over HTTP is unencrypted and can be intercepted by attackers. Google penalizes non-HTTPS sites in rankings. Browsers show "Not Secure" warnings that scare visitors.',
            suggestion: 'Install an SSL certificate and redirect all HTTP traffic to HTTPS. Most hosting providers offer free SSL via Let\'s Encrypt.',
            url: page.url,
            priority: 10,
            affectedUrls: [page.url],
            affectedElements: [{ tag: 'html', attributes: {}, outerHTML: `<html>...served over HTTP...</html>`, selector: 'html' }],
            codeSnippet: `// Server config (nginx)\nserver {\n  listen 80;\n  return 301 https://$host$request_uri;\n}`,
            fixInstructions: [
              { step: 1, title: 'Get an SSL certificate', description: 'Use Let\'s Encrypt (free) or purchase from your hosting provider.' },
              { step: 2, title: 'Install the certificate', description: 'Follow your server/hosting provider\'s SSL setup instructions.' },
              { step: 3, title: 'Force HTTPS redirect', description: 'Configure your server to redirect all HTTP requests to HTTPS.' },
              { step: 4, title: 'Update internal links', description: 'Change all internal links from http:// to https://.' }
            ],
            estimatedImpact: 'Essential for SEO, user trust, and data security. Required for modern websites.',
            timeToFix: '30 minutes',
            difficulty: 'medium',
          });
        }
      } catch {
        // Invalid URL
      }
    });
  }

  private analyzeSecurityHeaders(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    const headers = mainPage.headers;
    
    // Check for X-Frame-Options
    if (!headers['x-frame-options']) {
      issues.push({
        id: 'no_x_frame_options',
        category: 'security',
        type: 'missing_security_header',
        severity: 'medium',
        title: 'Missing X-Frame-Options Header',
        description: 'The X-Frame-Options header is not set.',
        impact: 'Your site may be vulnerable to clickjacking attacks where malicious sites embed your pages in invisible iframes to trick users into clicking hidden elements.',
        suggestion: 'Add X-Frame-Options: DENY or SAMEORIGIN to your server headers.',
        url: mainPage.url,
        priority: 6,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no X-Frame-Options header...</head>', selector: 'head' }],
        codeSnippet: '# Apache\nHeader always set X-Frame-Options "SAMEORIGIN"\n\n# nginx\nadd_header X-Frame-Options "SAMEORIGIN" always;',
        fixInstructions: [
          { step: 1, title: 'Choose your policy', description: 'DENY blocks all framing. SAMEORIGIN allows your own site to frame pages.' },
          { step: 2, title: 'Add to server config', description: 'Configure your web server to send the header with every response.' }
        ],
        estimatedImpact: 'Prevents clickjacking attacks and protects your users',
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }
    
    // Check for X-Content-Type-Options
    if (!headers['x-content-type-options']) {
      issues.push({
        id: 'no_x_content_type',
        category: 'security',
        type: 'missing_security_header',
        severity: 'medium',
        title: 'Missing X-Content-Type-Options Header',
        description: 'The X-Content-Type-Options header is not set.',
        impact: 'Browsers may MIME-sniff content, leading to security vulnerabilities.',
        suggestion: 'Add X-Content-Type-Options: nosniff to your server headers.',
        url: mainPage.url,
        priority: 5,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no X-Content-Type-Options header...</head>', selector: 'head' }],
        codeSnippet: '# Apache\nHeader always set X-Content-Type-Options "nosniff"\n\n# nginx\nadd_header X-Content-Type-Options "nosniff" always;',
        fixInstructions: [
          { step: 1, title: 'Add to server config', description: 'Configure your web server to send X-Content-Type-Options: nosniff with every response.' }
        ],
        estimatedImpact: 'Prevents MIME-sniffing attacks and XSS vectors',
        timeToFix: '2 minutes',
        difficulty: 'easy',
      });
    }
    
    // Check for Strict-Transport-Security (HSTS)
    if (!headers['strict-transport-security']) {
      issues.push({
        id: 'no_hsts',
        category: 'security',
        type: 'missing_security_header',
        severity: 'medium',
        title: 'Missing HSTS Header',
        description: 'The Strict-Transport-Security header is not set.',
        impact: 'Browsers may initially connect over HTTP before being redirected to HTTPS.',
        suggestion: 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains.',
        url: mainPage.url,
        priority: 6,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no HSTS header...</head>', selector: 'head' }],
        codeSnippet: '# Apache\nHeader always set Strict-Transport-Security "max-age=31536000; includeSubDomains"\n\n# nginx\nadd_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;',
        fixInstructions: [
          { step: 1, title: 'Add HSTS header', description: 'Configure your server to send Strict-Transport-Security with every HTTPS response.' },
          { step: 2, title: 'Test carefully', description: 'Start with a short max-age (e.g., 300) to test before committing to a year.' }
        ],
        estimatedImpact: 'Prevents downgrade attacks and ensures HTTPS is always used',
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }
    
    // Check for Content-Security-Policy
    if (!headers['content-security-policy']) {
      issues.push({
        id: 'no_csp',
        category: 'security',
        type: 'missing_security_header',
        severity: 'medium',
        title: 'Missing Content-Security-Policy Header',
        description: 'The Content-Security-Policy header is not set.',
        impact: 'Without CSP, your site is more vulnerable to XSS attacks.',
        suggestion: 'Implement a Content-Security-Policy to restrict resource sources.',
        url: mainPage.url,
        priority: 5,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no CSP header...</head>', selector: 'head' }],
        codeSnippet: '# Start with a restrictive policy and relax as needed\nContent-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'; img-src \'self\' data: https:;',
        fixInstructions: [
          { step: 1, title: 'Start with a basic policy', description: 'Begin with default-src \'self\' and add exceptions as needed.' },
          { step: 2, title: 'Monitor violations', description: 'Use Content-Security-Policy-Report-Only first to catch issues.' },
          { step: 3, title: 'Enforce the policy', description: 'Switch to Content-Security-Policy once violations are resolved.' }
        ],
        estimatedImpact: 'Significantly reduces XSS attack surface and prevents unauthorized resource loading',
        timeToFix: '1 hour',
        difficulty: 'hard',
      });
    }
    
    // Check for X-XSS-Protection (legacy but still useful)
    if (!headers['x-xss-protection']) {
      issues.push({
        id: 'no_xss_protection',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Missing X-XSS-Protection Header',
        description: 'The X-XSS-Protection header is not set.',
        impact: 'Older browsers may not have XSS filtering enabled for your site.',
        suggestion: 'Add X-XSS-Protection: 1; mode=block for legacy browser support.',
        url: mainPage.url,
        priority: 3,
      });
    }
    
    // Check for Referrer-Policy
    if (!headers['referrer-policy']) {
      issues.push({
        id: 'no_referrer_policy',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Missing Referrer-Policy Header',
        description: 'The Referrer-Policy header is not set.',
        impact: 'Full URLs may be leaked to external sites via the Referer header.',
        suggestion: 'Add Referrer-Policy: strict-origin-when-cross-origin.',
        url: mainPage.url,
        priority: 3,
      });
    }
    
    // Check for Permissions-Policy (formerly Feature-Policy)
    if (!headers['permissions-policy'] && !headers['feature-policy']) {
      issues.push({
        id: 'no_permissions_policy',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Missing Permissions-Policy Header',
        description: 'The Permissions-Policy header is not set.',
        impact: 'Browser features like camera, microphone may be accessible without explicit permission.',
        suggestion: 'Add Permissions-Policy to control access to browser features.',
        url: mainPage.url,
        priority: 2,
      });
    }
  }

  private analyzeMixedContent(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      try {
        const url = new URL(page.url);
        
        if (url.protocol === 'https:') {
          // Check for HTTP resources in HTML
          const httpResources: string[] = [];
          
          // Check scripts
          page.scripts.forEach((script) => {
            if (script.src && script.src.startsWith('http://')) {
              httpResources.push(`Script: ${script.src}`);
            }
          });
          
          // Check styles
          page.styles.forEach((style) => {
            if (style.href && style.href.startsWith('http://')) {
              httpResources.push(`Style: ${style.href}`);
            }
          });
          
          // Check images
          page.images.forEach((img) => {
            if (img.src && img.src.startsWith('http://')) {
              httpResources.push(`Image: ${img.src}`);
            }
          });
          
          // Check links
          page.links.forEach((link) => {
            if (link.href.startsWith('http://')) {
              httpResources.push(`Link: ${link.href}`);
            }
          });
          
          if (httpResources.length > 0) {
            const severity = httpResources.length > 5 ? 'high' : httpResources.length > 2 ? 'medium' : 'low';
            
            issues.push({
              id: `mixed_content_${page.url}`,
              category: 'security',
              type: 'mixed_content',
              severity,
              title: 'Mixed Content Detected',
              description: `${httpResources.length} insecure HTTP resources found on HTTPS page: ${httpResources.slice(0, 3).join(', ')}...`,
              impact: 'Mixed content can be blocked by browsers and creates security vulnerabilities.',
              suggestion: 'Update all HTTP URLs to HTTPS.',
              url: page.url,
              priority: severity === 'high' ? 8 : severity === 'medium' ? 6 : 4,
            });
          }
        }
      } catch {
        // Invalid URL
      }
    });
  }

  private analyzeExternalResources(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    // Check for external scripts without SRI
    const externalScripts = mainPage.scripts.filter((s) => s.src && !s.src.startsWith('data:'));
    const scriptsWithoutSRI = externalScripts.filter((s) => {
      // SRI would be in an integrity attribute which we'd need to parse from HTML
      return s.src && (s.src.includes('http') || s.src.startsWith('//'));
    });
    
    if (scriptsWithoutSRI.length > 3) {
      issues.push({
        id: 'no_sri',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'External Scripts Without SRI',
        description: `${scriptsWithoutSRI.length} external scripts without Subresource Integrity.`,
        impact: 'If external sources are compromised, malicious code could be injected.',
        suggestion: 'Add integrity attributes to external scripts for SRI protection.',
        url: mainPage.url,
        priority: 3,
      });
    }
    
    // Check for inline event handlers (potential XSS)
    const inlineHandlers = mainPage.html.match(/on(click|load|error|mouseover|submit|focus|blur)=/gi);
    
    if (inlineHandlers && inlineHandlers.length > 10) {
      issues.push({
        id: 'inline_handlers',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Many Inline Event Handlers',
        description: `${inlineHandlers.length} inline event handlers found.`,
        impact: 'Inline handlers can be a XSS vector if user content is not properly escaped.',
        suggestion: 'Move event handlers to external JavaScript files.',
        url: mainPage.url,
        priority: 2,
      });
    }
  }

  private analyzeFormSecurity(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      page.forms.forEach((form, index) => {
        // Check for forms without HTTPS action
        if (form.action && form.action.startsWith('http://')) {
          issues.push({
            id: `insecure_form_${page.url}_${index}`,
            category: 'security',
            type: 'missing_https',
            severity: 'high',
            title: 'Form Submits Over HTTP',
            description: `Form on ${page.url} submits to insecure HTTP URL: ${form.action}`,
            impact: 'Form data is transmitted unencrypted and can be intercepted.',
            suggestion: 'Update form action to use HTTPS.',
            url: page.url,
            priority: 8,
          });
        }
        
        // Check for password fields without autocomplete off consideration
        const hasPasswordField = form.inputs.some((input) => input.type === 'password');
        if (hasPasswordField && !page.url.startsWith('https://')) {
          issues.push({
            id: `password_http_${page.url}_${index}`,
            category: 'security',
            type: 'missing_https',
            severity: 'critical',
            title: 'Password Field on HTTP Page',
            description: `Password field found on insecure HTTP page: ${page.url}`,
            impact: 'Passwords transmitted over HTTP can be intercepted.',
            suggestion: 'Move all password forms to HTTPS pages immediately.',
            url: page.url,
            priority: 10,
          });
        }
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
      category: 'security',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0,
      passed,
      failed: maxScore - passed,
    };
  }
}
