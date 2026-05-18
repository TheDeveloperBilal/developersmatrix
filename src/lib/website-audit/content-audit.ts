// Content & Conversion Audit Module
// Analyzes content quality, CTAs, trust signals, and conversion optimization

import type { PageData, AuditIssue, AuditScore, ContentAnalysis } from './types';

export class ContentAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore; contentAnalysis: ContentAnalysis } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];
    
    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
        contentAnalysis: this.createEmptyAnalysis(),
      };
    }

    // Analyze content
    const contentAnalysis = this.analyzeContent(mainPage);
    
    // Content Quality Issues
    this.analyzeContentQuality(pages, issues, contentAnalysis);
    
    // CTA Analysis
    this.analyzeCTAs(pages, issues, contentAnalysis);
    
    // Trust Signals Analysis
    this.analyzeTrustSignals(pages, issues, contentAnalysis);
    
    // Value Proposition Analysis
    this.analyzeValueProposition(pages, issues, contentAnalysis);
    
    // Keyword Analysis
    this.analyzeKeywords(pages, issues, contentAnalysis);
    
    // Readability Analysis
    this.analyzeReadability(pages, issues, contentAnalysis);
    
    // Calculate score
    const totalChecks = 16;
    const passedChecks = totalChecks - issues.filter(i => i.severity === 'high' || i.severity === 'critical').length;
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score, contentAnalysis };
  }

  private analyzeContent(page: PageData): ContentAnalysis {
    const text = page.text;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const paragraphCount = paragraphs.length;
    
    const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const avgParagraphLength = paragraphCount > 0 ? wordCount / paragraphCount : 0;
    
    // Flesch Reading Ease (simplified)
    const syllableCount = words.reduce((sum, word) => sum + this.countSyllables(word), 0);
    const fleschEase = sentenceCount > 0 && wordCount > 0
      ? 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount)
      : 0;
    
    // Vocabulary diversity (unique words / total words)
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyDiversity = wordCount > 0 ? (uniqueWords.size / wordCount) * 100 : 0;
    
    // Keyword density
    const keywordDensity = this.calculateKeywordDensity(words);
    
    // Repeated phrases (3+ words)
    const repeatedPhrases = this.findRepeatedPhrases(text);
    
    // Passive voice detection (simplified)
    const passivePatterns = /\b(is|are|was|were|been|being|have|has|had)\s+\w+ed\b/gi;
    const passiveMatches = text.match(passivePatterns) || [];
    const passiveVoice = passiveMatches.length;
    
    // Active voice estimation
    const activePatterns = /\b\w+s?\s+\w+ed\b/gi;
    const activeMatches = text.match(activePatterns) || [];
    const activeVoice = Math.max(0, activeMatches.length - passiveMatches.length);
    
    // Sentiment (very simplified)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'happy', 'beautiful', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'hate', 'poor', 'horrible', 'ugly', 'wrong', 'fail'];
    let sentimentScore = 0;
    words.forEach(word => {
      if (positiveWords.includes(word.toLowerCase())) sentimentScore++;
      if (negativeWords.includes(word.toLowerCase())) sentimentScore--;
    });
    
    // CTA detection
    const ctaPatterns = /\b(buy now|sign up|subscribe|learn more|get started|contact us|call now|order now|join|register|download|try free|shop now|book now|apply now|donate)\b/gi;
    const ctaMatches = text.match(ctaPatterns) || [];
    const hasCTA = ctaMatches.length > 0;
    const ctaCount = ctaMatches.length;
    
    // Trust signals
    const trustSignals = this.findTrustSignals(text, page.html);
    
    // Value proposition (simplified - look for hero section claims)
    const valueProposition = this.findValueProposition(page);
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    // Readability grade
    const readabilityGrade = this.getReadabilityGrade(fleschEase);
    
    return {
      wordCount,
      sentenceCount,
      paragraphCount,
      avgSentenceLength,
      avgParagraphLength,
      readabilityScore: Math.max(0, Math.min(100, fleschEase)),
      readabilityGrade,
      vocabularyDiversity,
      keywordDensity,
      repeatedPhrases,
      passiveVoice,
      activeVoice,
      sentimentScore,
      hasCTA,
      ctaCount,
      trustSignals,
      valueProposition,
      readingTime,
    };
  }

  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  private calculateKeywordDensity(words: string[]): Record<string, number> {
    const density: Record<string, number> = {};
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'you', 'your', 'he', 'she', 'him', 'her', 'his']);
    
    const wordCount = words.length;
    const counts: Record<string, number> = {};
    
    words.forEach(word => {
      const lower = word.toLowerCase().replace(/[^a-z]/g, '');
      if (lower.length > 3 && !stopWords.has(lower)) {
        counts[lower] = (counts[lower] || 0) + 1;
      }
    });
    
    Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([word, count]) => {
        density[word] = Math.round((count / wordCount) * 100 * 100) / 100;
      });
    
    return density;
  }

  private findRepeatedPhrases(text: string): string[] {
    const phrases: Record<string, number> = {};
    const words = text.toLowerCase().split(/\s+/);
    
    // Check 3-5 word phrases
    for (let len = 3; len <= 5; len++) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(' ');
        if (phrase.length > 10 && !phrase.match(/^[a-z\s]{1,15}$/)) {
          phrases[phrase] = (phrases[phrase] || 0) + 1;
        }
      }
    }
    
    return Object.entries(phrases)
      .filter(([_, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([phrase]) => phrase.substring(0, 50));
  }

  private findTrustSignals(text: string, html: string): string[] {
    const signals: string[] = [];
    
    const trustPatterns = [
      { pattern: /\b(\d{4}|\d{,3},\d{3})\+?\s*(customers|clients|users|reviews|ratings|downloads|sales)\b/gi, name: 'Customer count' },
      { pattern: /\b(24\/7|24\/7 support|24 hour|same day)\b/gi, name: 'Support availability' },
      { pattern: /\b(money.back|guarantee|warranty|refund)\b/gi, name: 'Money-back guarantee' },
      { pattern: /\b(ssl|secure|encrypted|safe)\b/gi, name: 'Security mention' },
      { pattern: /\b(award|winner|certified|accredited|verified)\b/gi, name: 'Certification/Award' },
      { pattern: /\b(as seen on|featured in|mentioned in)\b/gi, name: 'Media mention' },
      { pattern: /\b(trusted by|used by|chosen by)\b/gi, name: 'Social proof' },
      { pattern: /\d(\.\d)?\s*(star|★|rating)/gi, name: 'Star rating' },
      { pattern: /\b(free trial|free demo|no credit card|cancel anytime)\b/gi, name: 'Risk-free offer' },
      { pattern: /\b(20\d{2}|19\d{2})\b/g, name: 'Established year' },
    ];
    
    trustPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(text) || pattern.test(html)) {
        signals.push(name);
      }
    });
    
    // Check for testimonial indicators
    if (html.includes('testimonial') || html.includes('review') || html.includes('rating')) {
      signals.push('Testimonials/Reviews section');
    }
    
    // Check for logo indicators
    if (html.includes('client') && (html.includes('logo') || html.includes('partner'))) {
      signals.push('Client/partner logos');
    }
    
    return [...new Set(signals)];
  }

  private findValueProposition(page: PageData): string | null {
    // Look for hero section or first H1 content
    const h1 = page.meta.h1[0];
    const firstParagraph = page.text.split('\n')[0]?.substring(0, 200);
    
    // Check for value proposition keywords
    const valueKeywords = ['we help', 'we provide', 'our mission', 'the best', 'simple', 'easy', 'fast', 'affordable', 'save', 'increase', 'improve', 'transform'];
    
    const heroText = (h1 + ' ' + firstParagraph).toLowerCase();
    const hasValue = valueKeywords.some(kw => heroText.includes(kw));
    
    if (hasValue && h1) {
      return h1.substring(0, 100);
    }
    
    return h1 ? h1.substring(0, 100) : null;
  }

  private getReadabilityGrade(score: number): string {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th-9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
    if (score >= 30) return 'Difficult (College)';
    return 'Very Difficult (Graduate)';
  }

  private analyzeContentQuality(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    // Thin content check
    if (analysis.wordCount < 300) {
      issues.push({
        id: 'thin_content',
        category: 'content',
        type: 'thin_content',
        severity: analysis.wordCount < 150 ? 'high' : 'medium',
        title: 'Thin Content',
        description: `Page has only ${analysis.wordCount} words of content.`,
        impact: 'Pages with under 300 words rarely rank well because they do not provide enough value to satisfy search intent. Google prefers comprehensive content that fully answers user questions.',
        suggestion: 'Expand your content to at least 500+ words. Cover the topic thoroughly with subheadings, examples, and actionable advice.',
        url: mainPage.url,
        priority: analysis.wordCount < 150 ? 8 : 5,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...${analysis.wordCount} words of content...</body>`, selector: 'body' }],
        codeSnippet: `// Current: ${analysis.wordCount} words\n// Target: 500+ words\n\n// Add sections:\n// 1. Introduction (100 words)\n// 2. Main points with examples (300 words)\n// 3. Actionable tips (100 words)\n// 4. Conclusion (50 words)`,
        fixInstructions: [
          { step: 1, title: 'Identify content gaps', description: 'What questions does your audience have that this page does not answer?' },
          { step: 2, title: 'Add subsections', description: 'Break the topic into 3-5 subtopics with H2 headings.' },
          { step: 3, title: 'Include examples', description: 'Add real examples, case studies, or data to support your points.' },
          { step: 4, title: 'Write a strong conclusion', description: 'Summarize key takeaways and include a call to action.' }
        ],
        estimatedImpact: 'Comprehensive content (500+ words) typically ranks 3-5x better than thin pages',
        timeToFix: '1-2 hours',
        difficulty: 'medium',
      });
    }
    
    // Low vocabulary diversity
    if (analysis.vocabularyDiversity < 30 && analysis.wordCount > 100) {
      issues.push({
        id: 'low_vocabulary',
        category: 'content',
        type: 'generic_content',
        severity: 'medium',
        title: 'Low Vocabulary Diversity',
        description: `Vocabulary diversity is ${analysis.vocabularyDiversity.toFixed(1)}%.`,
        impact: 'Repetitive vocabulary may indicate low-quality or AI-generated content.',
        suggestion: 'Use more varied vocabulary and synonyms to improve content quality.',
        url: mainPage.url,
        priority: 5,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...repetitive vocabulary detected...</body>`, selector: 'body' }],
        codeSnippet: `// Repetitive phrases detected: ${analysis.repeatedPhrases.length}\n// Use synonyms and restructure sentences to improve variety.`,
        fixInstructions: [
          { step: 1, title: 'Identify repeated phrases', description: 'Look for phrases used 3+ times in the content.' },
          { step: 2, title: 'Use synonyms', description: 'Replace repeated words with alternatives. "Good" → "excellent", "beneficial", "advantageous".' },
          { step: 3, title: 'Restructure sentences', description: 'Vary sentence structure to avoid repetitive patterns.' }
        ],
        estimatedImpact: 'Improves content quality signals and user engagement',
        timeToFix: '30 minutes',
        difficulty: 'easy',
      });
    }
    
    // Repeated phrases
    if (analysis.repeatedPhrases.length > 2) {
      issues.push({
        id: 'repeated_phrases',
        category: 'content',
        type: 'generic_content',
        severity: 'low',
        title: 'Repeated Phrases Detected',
        description: `Phrases repeated: ${analysis.repeatedPhrases.slice(0, 3).join(', ')}`,
        impact: 'Repeated phrases can make content feel repetitive and unoriginal.',
        suggestion: 'Vary your phrasing to keep content engaging.',
        url: mainPage.url,
        priority: 3,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...repeated phrases detected...</body>`, selector: 'body' }],
        codeSnippet: `// Repeated phrases: ${analysis.repeatedPhrases.slice(0, 3).join(', ')}\n// Rewrite each occurrence with unique phrasing.`,
        fixInstructions: [
          { step: 1, title: 'Find repeated phrases', description: `These phrases appear multiple times: ${analysis.repeatedPhrases.slice(0, 3).join(', ')}` },
          { step: 2, title: 'Rewrite with variety', description: 'Use different words and sentence structures for each occurrence.' }
        ],
        estimatedImpact: 'Improves user engagement and content originality signals',
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    }
    
    // Readability issues
    if (analysis.readabilityScore < 50 && analysis.wordCount > 100) {
      issues.push({
        id: 'low_readability',
        category: 'content',
        type: 'generic_content',
        severity: 'medium',
        title: 'Complex Content',
        description: `Readability score: ${analysis.readabilityScore.toFixed(0)} (${analysis.readabilityGrade})`,
        impact: 'Complex content may be difficult for average readers to understand.',
        suggestion: 'Simplify sentences and use shorter words to improve readability.',
        url: mainPage.url,
        priority: 4,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...complex readability detected...</body>`, selector: 'body' }],
        codeSnippet: `// Current readability: ${analysis.readabilityScore.toFixed(0)} (${analysis.readabilityGrade})\n// Target: 60+ (8th grade level)\n\n// Tips:\n// - Break long sentences into two\n// - Replace complex words with simple ones\n// - Use active voice`,
        fixInstructions: [
          { step: 1, title: 'Break long sentences', description: 'Split sentences over 20 words into two shorter sentences.' },
          { step: 2, title: 'Use simpler words', description: 'Replace complex vocabulary with everyday alternatives.' },
          { step: 3, title: 'Use active voice', description: 'Change passive sentences to active voice. "The ball was thrown by John" → "John threw the ball".' }
        ],
        estimatedImpact: 'Improves user comprehension and engagement, especially on mobile',
        timeToFix: '45 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeCTAs(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    if (!analysis.hasCTA) {
      issues.push({
        id: 'no_cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'high',
        title: 'No Clear Call-to-Action',
        description: 'No obvious call-to-action phrases detected on the page.',
        impact: 'Visitors may not know what action to take, reducing conversion rates.',
        suggestion: 'Add clear CTAs like "Sign Up", "Get Started", or "Contact Us" above the fold.',
        url: mainPage.url,
        priority: 8,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...no CTA detected...</body>`, selector: 'body' }],
        codeSnippet: `<!-- Add a prominent CTA button -->
<div class="cta-section">
  <h2>Ready to get started?</h2>
  <a href="/signup" class="btn-primary">Get Started Free</a>
</div>`,
        fixInstructions: [
          { step: 1, title: 'Add a primary CTA above the fold', description: 'Place your main CTA in the hero section where visitors see it immediately.' },
          { step: 2, title: 'Use action-oriented text', description: 'Use verbs like "Get", "Start", "Try", "Join" instead of generic "Submit" or "Click Here".' },
          { step: 3, title: 'Add secondary CTAs', description: 'Place additional CTAs at natural decision points throughout the page.' }
        ],
        estimatedImpact: 'Clear CTAs can increase conversion rates by 2-5x',
        timeToFix: '20 minutes',
        difficulty: 'easy',
      });
    } else if (analysis.ctaCount < 2) {
      issues.push({
        id: 'few_ctas',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'medium',
        title: 'Limited Call-to-Action Presence',
        description: `Only ${analysis.ctaCount} CTA phrase(s) found.`,
        impact: 'More CTAs throughout the page can guide users toward conversion.',
        suggestion: 'Add CTAs at natural conversion points in the page.',
        url: mainPage.url,
        priority: 5,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...only ${analysis.ctaCount} CTA found...</body>`, selector: 'body' }],
        codeSnippet: `// Only ${analysis.ctaCount} CTA found\n// Add CTAs at:\n// - After benefits section\n// - After testimonials\n// - At end of page\n// - In navigation`,
        fixInstructions: [
          { step: 1, title: 'Map the user journey', description: 'Identify where users make decisions on your page.' },
          { step: 2, title: 'Add CTAs at decision points', description: 'Place CTAs after benefits, social proof, and pricing sections.' }
        ],
        estimatedImpact: 'Multiple CTAs can increase conversion opportunities by 30-50%',
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeTrustSignals(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    if (analysis.trustSignals.length < 3) {
      issues.push({
        id: 'few_trust_signals',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: analysis.trustSignals.length === 0 ? 'high' : 'medium',
        title: 'Limited Trust Signals',
        description: `Only ${analysis.trustSignals.length} trust signal(s) detected: ${analysis.trustSignals.join(', ') || 'None'}`,
        impact: 'Without trust signals, visitors may hesitate to take action.',
        suggestion: 'Add testimonials, customer counts, guarantees, certifications, or media mentions.',
        url: mainPage.url,
        priority: analysis.trustSignals.length === 0 ? 7 : 5,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...${analysis.trustSignals.length} trust signals found...</body>`, selector: 'body' }],
        codeSnippet: `// Trust signals found: ${analysis.trustSignals.join(', ') || 'None'}\n// Add more:\n// - Customer testimonials\n// - "Trusted by X companies"\n// - Security badges\n// - Money-back guarantee\n// - Industry certifications`,
        fixInstructions: [
          { step: 1, title: 'Add social proof', description: 'Include testimonials, customer logos, or user counts.' },
          { step: 2, title: 'Add security signals', description: 'Show SSL badges, security certifications, or compliance logos.' },
          { step: 3, title: 'Add guarantees', description: 'Money-back guarantees or free trial offers reduce purchase anxiety.' }
        ],
        estimatedImpact: 'Trust signals can increase conversion rates by 10-30%',
        timeToFix: '30 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeValueProposition(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    if (!analysis.valueProposition && mainPage.meta.h1.length === 0) {
      issues.push({
        id: 'no_value_prop',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'high',
        title: 'Missing Value Proposition',
        description: 'No clear value proposition detected in hero section.',
        impact: 'Visitors may not understand what makes your offering unique or valuable.',
        suggestion: 'Add a compelling headline that clearly states your unique value proposition.',
        url: mainPage.url,
        priority: 7,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...no value proposition detected...</body>`, selector: 'body' }],
        codeSnippet: `<!-- Add a clear value proposition -->
<h1>The easiest way to [solve problem]</h1>
<p>[Product name] helps [target audience] [achieve outcome] in [timeframe].</p>
<a href="/signup" class="cta">Get Started Free</a>`,
        fixInstructions: [
          { step: 1, title: 'Identify your unique benefit', description: 'What specific outcome do you deliver that competitors do not?' },
          { step: 2, title: 'Write a clear headline', description: 'State the benefit in 10 words or less. Example: "The fastest way to send invoices".' },
          { step: 3, title: 'Support with a subheadline', description: 'Explain how you deliver the benefit in one sentence.' }
        ],
        estimatedImpact: 'A strong value proposition can increase conversion rates by 2-3x',
        timeToFix: '20 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeKeywords(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    // Check for keyword stuffing
    const topKeyword = Object.entries(analysis.keywordDensity)[0];
    if (topKeyword && topKeyword[1] > 3) {
      issues.push({
        id: 'keyword_stuffing',
        category: 'content',
        type: 'keyword_stuffing',
        severity: topKeyword[1] > 5 ? 'high' : 'medium',
        title: 'Potential Keyword Stuffing',
        description: `Keyword "${topKeyword[0]}" appears with ${topKeyword[1]}% density.`,
        impact: 'Overusing keywords can harm SEO and make content feel unnatural.',
        suggestion: 'Aim for keyword density under 2-3% for natural-sounding content.',
        url: mainPage.url,
        priority: topKeyword[1] > 5 ? 6 : 4,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'body', attributes: {}, outerHTML: `<body>...keyword "${topKeyword[0]}" used ${topKeyword[1]}%...</body>`, selector: 'body' }],
        codeSnippet: `// Keyword "${topKeyword[0]}" density: ${topKeyword[1]}%\n// Target: under 2-3%\n\n// Fix: Use synonyms and LSI keywords\n// - "web design" → "website design", "site development"\n// - "SEO" → "search optimization", "organic traffic"`,
        fixInstructions: [
          { step: 1, title: 'Identify overused keywords', description: `The keyword "${topKeyword[0]}" appears too frequently (${topKeyword[1]}%).` },
          { step: 2, title: 'Use synonyms', description: 'Replace some instances with related terms (LSI keywords).' },
          { step: 3, title: 'Read naturally', description: 'Write for humans first. Keywords should fit naturally in the text.' }
        ],
        estimatedImpact: 'Natural keyword usage improves SEO and user experience',
        timeToFix: '20 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeReadability(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    
    // Check for very long sentences
    if (analysis.avgSentenceLength > 25) {
      issues.push({
        id: 'long_sentences',
        category: 'content',
        type: 'generic_content',
        severity: 'low',
        title: 'Long Average Sentence Length',
        description: `Average sentence length is ${analysis.avgSentenceLength.toFixed(1)} words.`,
        impact: 'Long sentences can be harder to read and understand.',
        suggestion: 'Break long sentences into shorter ones for better readability.',
        url: mainPage.url,
        priority: 3,
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
      category: 'content',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0,
      passed,
      failed: maxScore - passed,
    };
  }

  private createEmptyAnalysis(): ContentAnalysis {
    return {
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      avgSentenceLength: 0,
      avgParagraphLength: 0,
      readabilityScore: 0,
      readabilityGrade: 'Unknown',
      vocabularyDiversity: 0,
      keywordDensity: {},
      repeatedPhrases: [],
      passiveVoice: 0,
      activeVoice: 0,
      sentimentScore: 0,
      hasCTA: false,
      ctaCount: 0,
      trustSignals: [],
      valueProposition: null,
      readingTime: 0,
    };
  }
}
