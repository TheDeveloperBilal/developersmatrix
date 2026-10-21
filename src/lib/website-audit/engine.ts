// Main Website Audit Engine
// Orchestrates all audit modules and generates comprehensive results

import type { 
  WebsiteAuditResult, 
  AuditConfig, 
  PageData, 
  AuditIssue, 
  AuditScore,
  CrawlProgress,
  ContentAnalysis
} from './types';
import { WebsiteCrawler } from './crawler';
import { SEOAuditor } from './seo-audit';
import { PerformanceAuditor } from './performance-audit';
import { MobileAuditor } from './mobile-audit';
import { SecurityAuditor } from './security-audit';
import { AccessibilityAuditor } from './accessibility-audit';
import { ContentAuditor } from './content-audit';
import { ConversionAuditor } from './conversion-audit';
import { TechnicalAuditor } from './technical-audit';
import { scoreCategory, overallScore, CATEGORY_WEIGHTS } from './scoring';
import { buildReport } from './check-catalogue';
import type { AuditCategory } from './types';

/**
 * Named checks this engine cannot measure from raw HTML, so the report shows
 * "Not checked" instead of a pass it never earned.
 * - broken-links: links are not requested one by one yet.
 * - font-size and tap-targets: need the rendered page and its CSS.
 */
const NOT_MEASURED = ['broken-links', 'font-size', 'tap-targets'];

export class WebsiteAuditEngine {
  private crawler: WebsiteCrawler;
  private config: Required<AuditConfig>;

  constructor(config: AuditConfig) {
    this.config = {
      maxPages: config.maxPages ?? 5,
      timeout: config.timeout ?? 12000,
      userAgent: config.userAgent ?? 'Mozilla/5.0 (compatible; DevelopersMatrixAudit/1.1; +https://developersmatrix.com/tools/website-audit)',
      followRedirects: config.followRedirects ?? true,
      ...config,
    };
    
    this.crawler = new WebsiteCrawler(this.config);
  }

  async audit(
    onProgress?: (progress: CrawlProgress) => void
  ): Promise<WebsiteAuditResult> {
    const startTime = Date.now();
    
    // Crawl website
    const pages = await this.crawler.crawl(onProgress);
    
    if (pages.length === 0) {
      throw new Error('Failed to fetch any pages from the website');
    }
    // Every page module reads the address that actually answered.
    for (const p of pages) p.url = p.finalUrl || p.url;
    // Error pages (a linked 404, a 500) are reported once by the technical
    // module. Auditing their content as well would blame the error page for a
    // missing title, H1 and viewport that the real pages have.
    const contentPages = pages.filter((p) => p.statusCode >= 200 && p.statusCode < 300);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing technical SEO...',
      progress: 65,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    // Run all audits
    const seoAuditor = new SEOAuditor();
    const seoResult = seoAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing advanced technical SEO...',
      progress: 68,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const technicalAuditor = new TechnicalAuditor();
    const site = this.crawler.getSiteContext();
    const technicalResult = technicalAuditor.analyze(pages, site, this.crawler.getParsedRobots());
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing performance...',
      progress: 70,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const performanceAuditor = new PerformanceAuditor();
    const performanceResult = performanceAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing mobile experience...',
      progress: 75,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const mobileAuditor = new MobileAuditor();
    const mobileResult = mobileAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing security...',
      progress: 80,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const securityAuditor = new SecurityAuditor();
    const securityResult = securityAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing accessibility...',
      progress: 85,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const accessibilityAuditor = new AccessibilityAuditor();
    const accessibilityResult = accessibilityAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing content quality...',
      progress: 90,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const contentAuditor = new ContentAuditor();
    const contentResult = contentAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing conversion optimization...',
      progress: 93,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const conversionAuditor = new ConversionAuditor();
    const conversionResult = conversionAuditor.analyze(contentPages);
    
    onProgress?.({
      status: 'scoring',
      message: 'Calculating scores...',
      progress: 95,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    // Combine all issues
    const allIssues: AuditIssue[] = [
      ...seoResult.issues,
      ...technicalResult.issues,
      ...performanceResult.issues,
      ...mobileResult.issues,
      ...securityResult.issues,
      ...accessibilityResult.issues,
      ...contentResult.issues,
      ...conversionResult.issues,
    ];
    
    // Two modules can report the very same finding (same id, for example
    // missing alt text from SEO and accessibility). Show it once.
    const seen = new Set<string>();
    const uniqueIssues = allIssues.filter((issue) => {
      if (seen.has(issue.id)) return false;
      seen.add(issue.id);
      return true;
    });
    allIssues.length = 0;
    allIssues.push(...uniqueIssues);

    // Sort issues by priority
    allIssues.sort((a, b) => b.priority - a.priority);
    
    // Score every category from the final, de-duplicated findings. The
    // modules' own scores used fixed check counts and let per page findings
    // stack, so they are replaced here. See scoring.ts.
    const categories: AuditCategory[] = ['seo', 'technical', 'performance', 'mobile', 'security', 'accessibility', 'content', 'conversion'];
    const named = buildReport({ issues: allIssues, notMeasured: NOT_MEASURED } as unknown as WebsiteAuditResult);
    const namedChecks = named.groups.flatMap((g) => g.checks);
    const pageCount = Math.max(1, contentPages.length);
    let hasCritical = false;
    const scores = Object.fromEntries(
      categories.map((category) => {
        const own = allIssues.filter((i) => i.category === category);
        const result = scoreCategory(own, pageCount);
        const scored = CATEGORY_WEIGHTS[category] > 0;
        if (scored && result.critical) hasCritical = true;
        const checks = namedChecks.filter((c) => c.definition.category === category && c.status !== 'not-run');
        const passed = checks.filter((c) => c.status === 'pass').length;
        const score: AuditScore = {
          category,
          score: result.score,
          maxScore: 100,
          issues: own.length,
          criticalIssues: own.filter((i) => i.severity === 'critical').length,
          passed,
          failed: checks.length - passed,
          scored,
        };
        return [category, score];
      })
    ) as WebsiteAuditResult['scores'];

    const overall = overallScore(
      Object.fromEntries(categories.map((c) => [c, scores[c].score])) as Record<AuditCategory, number>,
      hasCritical
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(allIssues);
    
    // Find quick wins (high impact, easy to fix)
    const quickWins = allIssues.filter(issue => 
      issue.priority >= 5 && issue.priority <= 8 && issue.severity !== 'low'
    ).slice(0, 10);
    
    // Find critical issues
    const criticalIssues = allIssues.filter(issue => 
      issue.severity === 'critical' || issue.severity === 'high'
    ).slice(0, 15);
    
    // Generate summary
    const summary = this.generateSummary(scores, allIssues, contentResult.contentAnalysis);
    
    const scanDuration = Date.now() - startTime;
    
    onProgress?.({
      status: 'complete',
      message: 'Audit complete!',
      progress: 100,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    // Raw HTML and full text stay on the server. Sending them back made each
    // response about 2 MB, and the browser never used them.
    const pageData = pages.map((p) => ({
      url: p.url,
      finalUrl: p.finalUrl,
      statusCode: p.statusCode,
      title: p.title,
      loadTime: p.loadTime,
      size: p.size,
    }));

    return {
      url: site.finalUrl || this.config.url,
      domain: this.crawler.getDomain(),
      scannedAt: new Date().toISOString(),
      scanDuration,
      pagesScanned: pages.length,
      overallScore: overall,
      scores,
      issues: allIssues,
      recommendations,
      pageData,
      site: {
        enteredUrl: site.enteredUrl,
        finalUrl: site.finalUrl,
        origin: site.origin,
        host: site.host,
        homeRedirects: site.homeRedirects,
        robots: { url: site.robots.url, status: site.robots.status, found: site.robots.found },
        sitemaps: site.sitemaps,
      },
      notMeasured: NOT_MEASURED,
      contentAnalysis: contentResult.contentAnalysis,
      quickWins,
      criticalIssues,
      summary,
    };
  }

  private generateRecommendations(issues: AuditIssue[]): string[] {
    const recommendations: string[] = [];
    
    // Get top issues by priority
    const topIssues = issues
      .filter(i => i.severity === 'critical' || i.severity === 'high')
      .slice(0, 10);
    
    topIssues.forEach(issue => {
      recommendations.push(issue.suggestion);
    });
    
    // Add general recommendations based on patterns
    const categories = new Set(issues.map(i => i.category));
    
    if (categories.has('seo')) {
      recommendations.push('Optimize title tags and meta descriptions for better search visibility.');
    }
    if (categories.has('performance')) {
      recommendations.push('Implement image optimization and lazy loading for faster page loads.');
    }
    if (categories.has('accessibility')) {
      recommendations.push('Add proper alt text and labels to improve accessibility compliance.');
    }
    if (categories.has('security')) {
      recommendations.push('Implement security headers to protect against common vulnerabilities.');
    }
    if (categories.has('conversion')) {
      recommendations.push('Review the conversion tips: they do not change the score, but clear calls to action and contact details help visitors act.');
    }
    
    return [...new Set(recommendations)].slice(0, 15);
  }

  private generateSummary(
    scores: Record<string, AuditScore>, 
    issues: AuditIssue[],
    analysis: ContentAnalysis
  ): WebsiteAuditResult['summary'] {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const opportunities: string[] = [];
    
    // Identify strengths (high scores)
    Object.entries(scores).forEach(([category, score]) => {
      // Conversion is tips only, so it is neither a strength nor a weakness.
      if (score.scored === false) return;
      if (score.score >= 80) {
        strengths.push(`Strong ${category} performance (${score.score}/100)`);
      } else if (score.score < 50) {
        weaknesses.push(`Low ${category} score (${score.score}/100)`);
      }
    });
    
    // Add content strengths
    if (analysis.wordCount > 500) {
      strengths.push('Comprehensive content coverage');
    }
    if (analysis.trustSignals.length >= 3) {
      strengths.push('Good trust signal presence');
    }
    if (analysis.hasCTA) {
      strengths.push('Clear calls-to-action present');
    }
    
    // Add content weaknesses
    if (analysis.wordCount < 300) {
      weaknesses.push('Thin content that may not rank well');
    }
    if (!analysis.hasCTA) {
      weaknesses.push('Missing clear calls-to-action');
    }
    if (analysis.trustSignals.length < 2) {
      weaknesses.push('Limited trust signals for visitors');
    }
    
    // Identify opportunities from medium priority issues
    issues
      .filter(i => i.severity === 'medium' || i.severity === 'low')
      .slice(0, 5)
      .forEach(issue => {
        opportunities.push(issue.title);
      });
    
    // Add general opportunities
    if (scores.seo.score < 90) {
      opportunities.push('Improve SEO optimization for better search rankings');
    }
    if (scores.performance.score < 90) {
      opportunities.push('Optimize page speed for better user experience');
    }
    if (scores.accessibility.score < 90) {
      opportunities.push('Enhance accessibility for broader audience reach');
    }
    
    return {
      strengths: strengths.slice(0, 5),
      weaknesses: weaknesses.slice(0, 5),
      opportunities: [...new Set(opportunities)].slice(0, 5),
    };
  }
}

// Export types
export type { 
  WebsiteAuditResult, 
  AuditConfig, 
  PageData, 
  AuditIssue, 
  AuditScore,
  CrawlProgress,
  ContentAnalysis,
  AuditHistoryItem,
} from './types';
