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

export class WebsiteAuditEngine {
  private crawler: WebsiteCrawler;
  private config: Required<AuditConfig>;

  constructor(config: AuditConfig) {
    this.config = {
      maxPages: config.maxPages ?? 5,
      timeout: config.timeout ?? 30000,
      userAgent: config.userAgent ?? 'DevelopersMatrix-Audit-Bot/1.0',
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
    const seoResult = seoAuditor.analyze(pages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing performance...',
      progress: 70,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const performanceAuditor = new PerformanceAuditor();
    const performanceResult = performanceAuditor.analyze(pages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing mobile experience...',
      progress: 75,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const mobileAuditor = new MobileAuditor();
    const mobileResult = mobileAuditor.analyze(pages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing security...',
      progress: 80,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const securityAuditor = new SecurityAuditor();
    const securityResult = securityAuditor.analyze(pages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing accessibility...',
      progress: 85,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const accessibilityAuditor = new AccessibilityAuditor();
    const accessibilityResult = accessibilityAuditor.analyze(pages);
    
    onProgress?.({
      status: 'analyzing',
      message: 'Analyzing content quality...',
      progress: 90,
      pagesScanned: pages.length,
      totalPages: pages.length,
      errors: [],
    });
    
    const contentAuditor = new ContentAuditor();
    const contentResult = contentAuditor.analyze(pages);
    
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
      ...performanceResult.issues,
      ...mobileResult.issues,
      ...securityResult.issues,
      ...accessibilityResult.issues,
      ...contentResult.issues,
    ];
    
    // Sort issues by priority
    allIssues.sort((a, b) => b.priority - a.priority);
    
    // Calculate overall score
    const conversionScore = this.calculateConversionScore(allIssues, contentResult.contentAnalysis);
    const overallScore = this.calculateOverallScore({
      seo: seoResult.score,
      performance: performanceResult.score,
      mobile: mobileResult.score,
      security: securityResult.score,
      accessibility: accessibilityResult.score,
      content: contentResult.score,
      conversion: { 
        category: 'conversion' as const, 
        score: conversionScore,
        maxScore: 100,
        issues: allIssues.filter(i => i.category === 'conversion').length,
        criticalIssues: allIssues.filter(i => i.category === 'conversion' && i.severity === 'critical').length,
        passed: 7,
        failed: 3,
      },
    });
    
    // Update critical issue counts
    const scores = {
      seo: { ...seoResult.score, criticalIssues: seoResult.issues.filter(i => i.severity === 'critical').length },
      performance: { ...performanceResult.score, criticalIssues: performanceResult.issues.filter(i => i.severity === 'critical').length },
      mobile: { ...mobileResult.score, criticalIssues: mobileResult.issues.filter(i => i.severity === 'critical').length },
      security: { ...securityResult.score, criticalIssues: securityResult.issues.filter(i => i.severity === 'critical').length },
      accessibility: { ...accessibilityResult.score, criticalIssues: accessibilityResult.issues.filter(i => i.severity === 'critical').length },
      content: { ...contentResult.score, criticalIssues: contentResult.issues.filter(i => i.severity === 'critical').length },
      conversion: { 
        category: 'conversion' as const, 
        score: conversionScore,
        maxScore: 100,
        issues: allIssues.filter(i => i.category === 'conversion').length,
        criticalIssues: allIssues.filter(i => i.category === 'conversion' && i.severity === 'critical').length,
        passed: 7,
        failed: 3,
      },
    };
    
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
    
    return {
      url: this.config.url,
      domain: this.crawler.getDomain(),
      scannedAt: new Date().toISOString(),
      scanDuration,
      pagesScanned: pages.length,
      overallScore,
      scores,
      issues: allIssues,
      recommendations,
      pageData: pages,
      contentAnalysis: contentResult.contentAnalysis,
      quickWins,
      criticalIssues,
      summary,
    };
  }

  private calculateOverallScore(scores: Record<string, AuditScore>): number {
    // Weighted average based on category importance
    const weights: Record<string, number> = {
      seo: 0.20,
      performance: 0.15,
      mobile: 0.15,
      security: 0.15,
      accessibility: 0.10,
      content: 0.15,
      conversion: 0.10,
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(scores).forEach(([category, score]) => {
      const weight = weights[category] || 0.1;
      totalScore += score.score * weight;
      totalWeight += weight;
    });
    
    return Math.round(totalScore / totalWeight);
  }

  private calculateConversionScore(issues: AuditIssue[], analysis: ContentAnalysis): number {
    let score = 70; // Base score
    
    // Adjust for CTAs
    if (analysis.hasCTA) score += 10;
    if (analysis.ctaCount >= 3) score += 5;
    
    // Adjust for trust signals
    score += Math.min(10, analysis.trustSignals.length * 2);
    
    // Adjust for value proposition
    if (analysis.valueProposition) score += 5;
    
    // Subtract for conversion issues
    const conversionIssues = issues.filter(i => i.category === 'conversion');
    conversionIssues.forEach(issue => {
      if (issue.severity === 'critical') score -= 15;
      else if (issue.severity === 'high') score -= 10;
      else if (issue.severity === 'medium') score -= 5;
      else score -= 2;
    });
    
    return Math.max(0, Math.min(100, score));
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
      recommendations.push('Add clear calls-to-action and trust signals to improve conversions.');
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
