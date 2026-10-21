// Content & Conversion Audit Module
// Analyzes content quality, calls to action, trust signals and readability.
//
// Everything here reads the HTML the server sent, without running scripts.
// Word counts, readability and keyword figures come from the main content
// (page.mainText), so menus, footers and cookie banners do not distort them.

import * as cheerio from 'cheerio';
import type { PageData, AuditIssue, AuditScore, ContentAnalysis } from './types';

/** Buttons, button styled links and form submits count as calls to action. */
const CTA_SELECTOR =
  'button, a[role="button"], a[class*="btn"], a[class*="button"], input[type="submit"], input[type="image"]';

/** Link text that reads as a call to action even without button styling. */
const CTA_PHRASES = /\b(buy now|sign up|subscribe|get started|contact us|call now|order now|join now|register|download|try (it )?free|start (your )?free|shop now|book now|book a (call|demo)|apply now|donate|get a quote|request a (quote|demo)|start trial|free trial)\b/i;

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that',
  'these', 'those', 'it', 'its', 'they', 'them', 'their', 'theirs', 'we', 'our', 'ours', 'you',
  'your', 'yours', 'he', 'she', 'him', 'her', 'his', 'hers', 'about', 'above', 'after', 'again',
  'also', 'because', 'before', 'below', 'between', 'both', 'down', 'during', 'each', 'even',
  'every', 'further', 'here', 'there', 'into', 'just', 'like', 'make', 'many', 'more', 'most',
  'much', 'need', 'once', 'only', 'other', 'over', 'same', 'some', 'such', 'than', 'then',
  'through', 'under', 'until', 'upon', 'very', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'whose', 'why', 'with', 'within', 'without', 'yourself', 'ourselves', 'themselves',
  'well', 'into', 'onto', 'off', 'out', 'own', 'any', 'all', 'not', 'no', 'nor', 'so', 'too',
  'how', 'get', 'got', 'use', 'used', 'using', 'one', 'two', 'new', 'way', 'want', 'know',
]);

/** Abbreviations whose full stop does not end a sentence. */
const ABBREVIATIONS = /\b(e\.g|i\.e|etc|vs|approx|mr|mrs|ms|dr|prof|inc|ltd|co|corp|jr|sr|st|no|fig|vol|dept|est)\./gi;

function wordsOf(text: string): string[] {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
}

/**
 * Splits one line of text into sentences. A sentence ends at . ! or ? that is
 * followed by whitespace and a capital letter, or by the end of the line.
 * Decimals, URLs and common abbreviations do not end a sentence.
 */
function splitSentences(line: string): string[] {
  const prepared = line
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, 'link')
    .replace(/\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g, 'email')
    .replace(ABBREVIATIONS, (m) => m.replace(/\./g, ''));
  return prepared
    .split(/(?<=[.!?])["'”’)\]]*\s+(?=["'“‘(\[]?\p{Lu})/u)
    .map((s) => s.trim())
    .filter((s) => wordsOf(s).length > 0);
}

function nonEmptyLines(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
}

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

    return { issues, score, contentAnalysis };
  }

  /** Readability was measured: an English page with enough sentence like text. */
  private readabilityMeasured = false;
  /** The page declares English or no language. Stop word lists are English. */
  private pageIsEnglish = true;

  private analyzeContent(page: PageData): ContentAnalysis {
    const text = page.mainText || page.text;
    const lines = nonEmptyLines(text);
    const words = wordsOf(text);
    const wordCount = words.length;

    // A paragraph is a block of text with at least 8 words. Short lines are
    // headings, buttons and labels.
    const paragraphs = lines.filter((l) => wordsOf(l).length >= 8);
    const paragraphCount = paragraphs.length;
    const paragraphWords = paragraphs.reduce((sum, p) => sum + wordsOf(p).length, 0);

    // Sentences only come from lines that look like prose (5 or more words).
    const proseLines = lines.filter((l) => wordsOf(l).length >= 5);
    const sentences = proseLines.flatMap((l) => splitSentences(l));
    const sentenceCount = sentences.length;
    const sentenceWords = sentences.reduce((sum, s) => sum + wordsOf(s).length, 0);

    const avgSentenceLength = sentenceCount > 0 ? sentenceWords / sentenceCount : 0;
    const avgParagraphLength = paragraphCount > 0 ? paragraphWords / paragraphCount : 0;

    // Flesch Reading Ease is an English formula, so it only runs on pages that
    // declare English or declare no language, and only on prose.
    const lang = (page.meta.lang || '').trim().toLowerCase();
    const isEnglish = lang === '' || lang.startsWith('en');
    let fleschEase = 0;
    this.readabilityMeasured = false;
    this.pageIsEnglish = isEnglish;
    if (isEnglish && sentenceCount >= 3 && sentenceWords >= 50) {
      const sentenceWordList = sentences.flatMap((s) => wordsOf(s));
      const syllableCount = sentenceWordList.reduce((sum, word) => sum + this.countSyllables(word), 0);
      fleschEase = 206.835 - 1.015 * (sentenceWords / sentenceCount) - 84.6 * (syllableCount / sentenceWords);
      this.readabilityMeasured = true;
    }

    // Vocabulary diversity (unique words / total words). Reported only: it falls
    // naturally as pages get longer, so no finding is raised from it.
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyDiversity = wordCount > 0 ? (uniqueWords.size / wordCount) * 100 : 0;

    // Keyword density
    const keywordDensity = this.calculateKeywordDensity(words);

    // Repeated phrases, inside prose lines of the main content only
    const repeatedPhrases = this.findRepeatedPhrases(proseLines);

    // Passive voice, active voice and sentiment are rough pattern counts. They
    // are kept for the report but no finding is raised from them.
    const passivePatterns = /\b(is|are|was|were|been|being|have|has|had)\s+\w+ed\b/gi;
    const passiveMatches = text.match(passivePatterns) || [];
    const passiveVoice = passiveMatches.length;

    const activePatterns = /\b\w+s?\s+\w+ed\b/gi;
    const activeMatches = text.match(activePatterns) || [];
    const activeVoice = Math.max(0, activeMatches.length - passiveMatches.length);

    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'best', 'love', 'happy', 'beautiful', 'perfect'];
    const negativeWords = ['bad', 'terrible', 'awful', 'worst', 'hate', 'poor', 'horrible', 'ugly', 'wrong', 'fail'];
    let sentimentScore = 0;
    words.forEach(word => {
      const w = word.toLowerCase().replace(/[^\p{L}]/gu, '');
      if (positiveWords.includes(w)) sentimentScore++;
      if (negativeWords.includes(w)) sentimentScore--;
    });

    // Calls to action, read from the HTML structure
    const ctaCount = this.countCallsToAction(page.html);
    const hasCTA = ctaCount > 0;

    // Trust signals
    const trustSignals = this.findTrustSignals(page);

    // Value proposition (the first H1)
    const valueProposition = this.findValueProposition(page);

    // Reading time (average 200 words per minute)
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Readability grade
    const readabilityGrade = this.readabilityMeasured
      ? this.getReadabilityGrade(fleschEase)
      : (isEnglish ? 'Not measured (not enough sentences)' : 'Not measured (page is not in English)');

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

  /**
   * Counts buttons, links with role="button" or a btn or button class, form
   * submits, and links whose text reads as a call to action. Menu toggles
   * (aria-expanded, aria-controls, aria-haspopup) and reset buttons are not
   * calls to action.
   */
  private countCallsToAction(html: string): number {
    const $ = cheerio.load(html);
    const found = new Set<unknown>();
    $(CTA_SELECTOR).each((_, el) => {
      const $el = $(el);
      if ($el.closest('template, noscript').length > 0) return;
      if ($el.attr('aria-expanded') !== undefined || $el.attr('aria-controls') !== undefined || $el.attr('aria-haspopup') !== undefined) return;
      if (($el.attr('type') || '').toLowerCase() === 'reset') return;
      found.add(el);
    });
    $('a[href]').each((_, el) => {
      const label = ($(el).text() || $(el).attr('aria-label') || '').replace(/\s+/g, ' ').trim();
      if (label.length > 0 && label.length <= 40 && CTA_PHRASES.test(label)) found.add(el);
    });
    return found.size;
  }

  private countSyllables(raw: string): number {
    let word = raw.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length === 0) return 1;
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');

    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
  }

  /** Top terms of 4 or more letters that are not stop words, as a share of all words. */
  private calculateKeywordDensity(words: string[]): Record<string, number> {
    const density: Record<string, number> = {};
    const wordCount = words.length;
    const counts: Record<string, number> = {};

    words.forEach(word => {
      const lower = word.toLowerCase().replace(/[^\p{L}]/gu, '');
      if (lower.length >= 4 && !STOP_WORDS.has(lower)) {
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

  /**
   * Phrases of 3 to 5 words that repeat 3 or more times inside prose lines of
   * the main content. Phrases never cross a line, so repeated menu items,
   * card buttons and footer links are not counted.
   */
  private findRepeatedPhrases(proseLines: string[]): string[] {
    const phrases: Record<string, number> = {};
    for (const line of proseLines) {
      const words = line.toLowerCase().split(/\s+/).map((w) => w.replace(/[^\p{L}\p{N}']/gu, '')).filter((w) => w.length > 0);
      for (let len = 3; len <= 5; len++) {
        for (let i = 0; i <= words.length - len; i++) {
          const slice = words.slice(i, i + len);
          const contentWords = slice.filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
          if (contentWords.length < 2) continue;
          const phrase = slice.join(' ');
          phrases[phrase] = (phrases[phrase] || 0) + 1;
        }
      }
    }

    return Object.entries(phrases)
      .filter(([, count]) => count > 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([phrase]) => phrase.substring(0, 50));
  }

  /**
   * Conservative trust signal detection on the visible text. Generic words such
   * as "secure", "safe" or "review" appear on almost any page, and a copyright
   * year is not a founding year, so neither counts.
   */
  private findTrustSignals(page: PageData): string[] {
    const signals: string[] = [];
    // Copyright lines carry a year that says nothing about when a business started.
    const text = nonEmptyLines(page.text)
      .filter((l) => !/©|&copy;|\bcopyright\b/i.test(l))
      .join('\n');
    const html = page.html;

    const trustPatterns: { pattern: RegExp; name: string }[] = [
      { pattern: /\b(\d{1,3}(?:,\d{3})+|\d{3,}|\d+(?:\.\d+)?\s?[km])\+?\s+(?:happy\s+|satisfied\s+|active\s+)?(customers|clients|users|businesses|companies|subscribers|members|downloads)\b/i, name: 'Customer count' },
      { pattern: /\b\d{1,3}(?:,\d{3})*\+?\s+(reviews|ratings)\b|\brated\s+\d(?:\.\d)?\b|★|\b\d(?:\.\d)?\s*(?:\/\s*5|out of 5)\b/i, name: 'Reviews or rating' },
      { pattern: /\b24\/7\b|\b24 hours? (a day )?support\b/i, name: 'Support availability' },
      { pattern: /\bmoney[\s-]?back guarantee\b|\b\d+[\s-]day (money[\s-]?back|refund|guarantee)\b|\bsatisfaction guarantee(d)?\b|\bfull refund\b/i, name: 'Money back guarantee' },
      { pattern: /\b(certified|accredited|award[\s-]winning|awards?)\b/i, name: 'Certification or award' },
      { pattern: /\b(as seen (on|in)|featured (on|in))\b/i, name: 'Media mention' },
      { pattern: /\btrusted by\b/i, name: 'Trusted by statement' },
      { pattern: /\b(free trial|no credit card( required)?|cancel any ?time)\b/i, name: 'Risk free offer' },
      { pattern: /\b(since|established in|founded in|est\.?)\s+(19|20)\d{2}\b/i, name: 'Established year' },
    ];

    for (const { pattern, name } of trustPatterns) {
      if (pattern.test(text)) signals.push(name);
    }

    // A testimonials section: a heading or class that says so, a quote with a
    // named source, or review structured data.
    const hasReviewSchema = page.structured_data.some((sd) => /^(Review|AggregateRating)$/i.test(sd.type)) ||
      /"@type"\s*:\s*"(Review|AggregateRating)"/.test(html);
    if (
      /\btestimonials?\b/i.test(text) ||
      /(class|id)\s*=\s*["'][^"']*testimonial/i.test(html) ||
      /<blockquote\b[^>]*>[\s\S]{0,2000}?<cite\b/i.test(html) ||
      hasReviewSchema
    ) {
      signals.push('Testimonials or reviews section');
    }

    // Client or partner logos: a class or id that names them, or text that says so.
    if (
      /(class|id)\s*=\s*["'][^"']*(client|customer|partner)s?[-_ ]?logos?/i.test(html) ||
      /\b(our (clients|partners)|clients include|companies we work with)\b/i.test(text)
    ) {
      signals.push('Client or partner logos');
    }

    return [...new Set(signals)];
  }

  private findValueProposition(page: PageData): string | null {
    const h1 = page.meta.h1[0];
    return h1 ? h1.substring(0, 100) : null;
  }

  private getReadabilityGrade(score: number): string {
    if (score >= 90) return 'Very Easy (5th grade)';
    if (score >= 80) return 'Easy (6th grade)';
    if (score >= 70) return 'Fairly Easy (7th grade)';
    if (score >= 60) return 'Standard (8th to 9th grade)';
    if (score >= 50) return 'Fairly Difficult (10th to 12th grade)';
    if (score >= 30) return 'Difficult (College)';
    return 'Very Difficult (Graduate)';
  }

  /**
   * The page seems to build its text in the browser: almost no visible text in
   * the HTML, plus many scripts or an empty app root.
   */
  private looksJsRendered(page: PageData): boolean {
    const visibleWords = wordsOf(page.text).length;
    if (visibleWords >= 50) return false;
    const scriptTags = (page.html.match(/<script\b/gi) || []).length;
    const hasAppRoot = /\bid\s*=\s*["'](root|app|__next)["']/i.test(page.html);
    return scriptTags >= 5 || (hasAppRoot && visibleWords < 5);
  }

  private analyzeContentQuality(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    // Content built by JavaScript: the word count would be meaningless.
    if (this.looksJsRendered(mainPage)) {
      issues.push({
        id: 'js_rendered_content',
        category: 'content',
        type: 'thin_content',
        severity: 'medium',
        title: 'Content Appears to Be Built by JavaScript',
        description: `The HTML we received has almost no visible text (about ${wordsOf(mainPage.text).length} words) but loads scripts that probably build the page in the browser.`,
        impact: 'This audit reads the HTML without running scripts, so it cannot see that content, and content checks on this page are not reliable. Search engines also have to render the page to see the text, which can delay or limit what they index.',
        suggestion: 'Use server side rendering or static generation for important text, such as headings, product details and articles, so it is in the HTML from the first response.',
        url: mainPage.url,
        priority: 6,
        affectedUrls: [mainPage.url],
        fixInstructions: [
          { step: 1, title: 'Check what the server sends', description: 'Open the page with "View source" (not the inspector). If your main text is missing there, it is added by JavaScript.' },
          { step: 2, title: 'Render important text on the server', description: 'In Next.js, Nuxt, SvelteKit or Astro, render the page on the server or at build time. In a single page app, consider prerendering key pages.' },
          { step: 3, title: 'Run the audit again', description: 'Once the text is in the HTML, this audit can measure it.' }
        ],
        timeToFix: 'Varies by framework',
        difficulty: 'hard',
      });
      return;
    }

    // Low visible text. There is no word count Google requires; this is a prompt
    // to check the page does its job, not a ranking rule.
    if (analysis.wordCount < 300) {
      const veryLow = analysis.wordCount < 50;
      issues.push({
        id: 'thin_content',
        category: 'content',
        type: 'thin_content',
        severity: veryLow ? 'medium' : 'low',
        title: 'Low Visible Text',
        description: `We found about ${analysis.wordCount} words in the main content of this page. That is not a problem by itself, but it is worth checking the page fully answers what visitors came for.`,
        impact: 'Google has no minimum word count. What matters is whether the page answers what people searched for. Very short pages often leave questions unanswered, which gives search engines and visitors little to work with.',
        suggestion: 'Check the page fully answers what visitors came for. Add detail only where it helps, such as steps, examples or answers to common questions. A short page that does its job is fine.',
        url: mainPage.url,
        priority: veryLow ? 6 : 3,
        affectedUrls: [mainPage.url],
        fixInstructions: [
          { step: 1, title: 'List the questions visitors bring', description: 'What does someone landing here want to know or do? Check each one is answered on the page.' },
          { step: 2, title: 'Fill real gaps', description: 'Add sections with clear headings for anything missing, such as how it works, pricing, or common questions.' },
          { step: 3, title: 'Keep it useful', description: 'Do not pad the page to reach a word count. Extra text that says nothing new does not help.' }
        ],
        timeToFix: '30 to 90 minutes',
        difficulty: 'medium',
      });
    }

    // Repeated phrases in the main content (menus and footers are excluded).
    if (this.pageIsEnglish && analysis.repeatedPhrases.length > 2 && analysis.wordCount >= 300) {
      issues.push({
        id: 'repeated_phrases',
        category: 'content',
        type: 'generic_content',
        severity: 'low',
        title: 'Some Phrases Repeat in the Main Content',
        description: `These phrases appear three or more times in the body text: ${analysis.repeatedPhrases.slice(0, 3).join(', ')}`,
        impact: 'Some repetition is normal, for example a product name. Heavy repetition can make text read as written for search engines rather than people.',
        suggestion: 'Check whether each repeat is needed. Where it is not, use related terms and natural variations.',
        url: mainPage.url,
        priority: 2,
        affectedUrls: [mainPage.url],
        fixInstructions: [
          { step: 1, title: 'Find the repeats', description: `These phrases appear several times: ${analysis.repeatedPhrases.slice(0, 3).join(', ')}` },
          { step: 2, title: 'Rewrite where it helps', description: 'Keep names and terms people search for. Vary the wording around them.' }
        ],
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    }

    // Readability, an estimate for English prose only
    if (this.readabilityMeasured && analysis.readabilityScore < 50 && analysis.wordCount > 100) {
      issues.push({
        id: 'low_readability',
        category: 'content',
        type: 'generic_content',
        severity: 'low',
        title: 'Text May Be Hard to Read',
        description: `Estimated reading ease: ${analysis.readabilityScore.toFixed(0)} out of 100 (${analysis.readabilityGrade}). This is an estimate from the Flesch formula, which only looks at sentence length and word length.`,
        impact: 'Long sentences and long words take more effort to read, especially on a phone. Technical audiences may be fine with it, so treat this as a guide.',
        suggestion: 'Where it suits your readers, shorten long sentences and swap long words for everyday ones.',
        url: mainPage.url,
        priority: 2,
        affectedUrls: [mainPage.url],
        fixInstructions: [
          { step: 1, title: 'Break long sentences', description: 'Split sentences over about 20 words into two.' },
          { step: 2, title: 'Use simpler words', description: 'Replace complex words with everyday alternatives where the meaning stays the same.' }
        ],
        timeToFix: '30 to 45 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeCTAs(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    if (this.looksJsRendered(mainPage)) return;

    if (!analysis.hasCTA) {
      issues.push({
        id: 'no_cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'No Button or Call to Action Found',
        description: 'We did not find a button, a button styled link or a form submit on this page.',
        impact: 'If the page has a goal, such as a sign up, a purchase or a contact request, a clear button helps visitors take that step. If its job is only to inform, you can ignore this.',
        suggestion: 'Add a clear button for the main next step, using plain action words such as "Get a quote" or "Start free".',
        url: mainPage.url,
        priority: 3,
        affectedUrls: [mainPage.url],
        codeSnippet: `<!-- A clear call to action -->
<section class="cta-section">
  <h2>Ready to get started?</h2>
  <a href="/signup" class="btn-primary">Get started</a>
</section>`,
        fixInstructions: [
          { step: 1, title: 'Decide the main next step', description: 'Pick the one action you most want visitors to take on this page.' },
          { step: 2, title: 'Use action words', description: 'Words like "Get", "Start", "Try" or "Book" say what happens next better than "Submit" or "Click here".' },
          { step: 3, title: 'Repeat it where people decide', description: 'Place it again after the sections that answer the main questions.' }
        ],
        timeToFix: '20 minutes',
        difficulty: 'easy',
      });
    } else if (analysis.ctaCount < 2) {
      issues.push({
        id: 'few_ctas',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'Only One Call to Action Found',
        description: `We found ${analysis.ctaCount} button or call to action on this page.`,
        impact: 'Visitors decide at different points. On a long page, repeating the main action lower down saves them scrolling back.',
        suggestion: 'If the page is long, consider repeating the main call to action after key sections.',
        url: mainPage.url,
        priority: 2,
        affectedUrls: [mainPage.url],
        fixInstructions: [
          { step: 1, title: 'Map where people decide', description: 'Find the points where a visitor has enough information to act.' },
          { step: 2, title: 'Repeat the action there', description: 'Place the same call to action after benefits, proof or pricing sections.' }
        ],
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeTrustSignals(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    if (this.looksJsRendered(mainPage)) return;

    if (analysis.trustSignals.length < 3) {
      issues.push({
        id: 'few_trust_signals',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: analysis.trustSignals.length === 0 ? 'medium' : 'low',
        title: 'Few Trust Signals Found',
        description: `We found ${analysis.trustSignals.length} trust signal${analysis.trustSignals.length === 1 ? '' : 's'}: ${analysis.trustSignals.join(', ') || 'none'}. We only count clear signals, such as review counts, named testimonials or guarantees.`,
        impact: 'Visitors who do not know you yet look for proof that real people use and recommend you.',
        suggestion: 'Where you have them, show real reviews, named clients or verifiable credentials. Only show what is true and you can back up.',
        url: mainPage.url,
        priority: analysis.trustSignals.length === 0 ? 4 : 2,
        affectedUrls: [mainPage.url],
        codeSnippet: `// Trust signals found: ${analysis.trustSignals.join(', ') || 'None'}\n// Ideas, where true:\n// - Testimonials with a name and company\n// - Review count and rating from a review platform\n// - Client logos used with permission\n// - Guarantees you actually offer\n// - Certifications you hold`,
        fixInstructions: [
          { step: 1, title: 'Add real social proof', description: 'Testimonials with names, reviews from a platform visitors can check, or client logos you have permission to use.' },
          { step: 2, title: 'Show real reviews, named clients or verifiable credentials', description: 'Link certifications or memberships to the body that issued them, so visitors can verify them.' },
          { step: 3, title: 'State your policies', description: 'If you offer a guarantee, refund or free trial, say so clearly and link the terms.' }
        ],
        timeToFix: '30 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeValueProposition(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    if (this.looksJsRendered(mainPage)) return;

    if (!analysis.valueProposition && mainPage.meta.h1.length === 0) {
      issues.push({
        id: 'no_value_prop',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'low',
        title: 'No Main Headline Found',
        description: 'We did not find an H1 headline on this page, so we could not see a clear statement of what you offer.',
        impact: 'A clear headline near the top tells visitors in a few words whether they are in the right place.',
        suggestion: 'Consider a headline that says what you offer and who it is for.',
        url: mainPage.url,
        priority: 3,
        affectedUrls: [mainPage.url],
        codeSnippet: `<!-- A clear headline -->
<h1>The easiest way to [solve problem]</h1>
<p>[Product name] helps [audience] [achieve outcome].</p>`,
        fixInstructions: [
          { step: 1, title: 'Name the main benefit', description: 'What outcome do you deliver for the people you serve?' },
          { step: 2, title: 'Write a short headline', description: 'Say it in about 10 words. Example: "Send invoices in two clicks".' },
          { step: 3, title: 'Support it with one line', description: 'Explain how you deliver it in one sentence below the headline.' }
        ],
        timeToFix: '20 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeKeywords(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    // Density on its own is meaningless on a short page: a 30 word page that
    // says "example" twice reads as 6.7%. Require enough text and enough
    // repetitions before raising anything. Only terms of 4 or more letters that
    // are not stop words are counted (see calculateKeywordDensity). The stop
    // word list is English, so other languages are not judged.
    const MIN_WORDS_FOR_DENSITY = 300;
    const MIN_OCCURRENCES = 10;

    const topKeyword = Object.entries(analysis.keywordDensity)[0];
    const topOccurrences = topKeyword
      ? Math.round((topKeyword[1] / 100) * analysis.wordCount)
      : 0;

    if (
      this.pageIsEnglish &&
      topKeyword &&
      topKeyword[1] > 3 &&
      analysis.wordCount >= MIN_WORDS_FOR_DENSITY &&
      topOccurrences >= MIN_OCCURRENCES
    ) {
      const strong = topKeyword[1] > 5;
      issues.push({
        id: 'keyword_stuffing',
        category: 'content',
        type: 'keyword_stuffing',
        severity: strong ? 'medium' : 'low',
        title: 'One Word Is Repeated Often',
        description: `The word "${topKeyword[0]}" makes up ${topKeyword[1]}% of the main content (about ${topOccurrences} times in ${analysis.wordCount} words).`,
        impact: 'Google has no target density, but text that repeats a word unnaturally reads badly and can look like it was written for search engines.',
        suggestion: 'Read the page aloud. Where the word feels forced, use related terms and natural variations, or a pronoun.',
        url: mainPage.url,
        priority: strong ? 4 : 2,
        affectedUrls: [mainPage.url],
        codeSnippet: `// "${topKeyword[0]}" is ${topKeyword[1]}% of the main content\n// Use related terms and natural variations, for example:\n// - "web design" -> "website design", "site layout"\n// - "SEO" -> "search optimization", "organic search"`,
        fixInstructions: [
          { step: 1, title: 'Find the overused word', description: `"${topKeyword[0]}" appears about ${topOccurrences} times.` },
          { step: 2, title: 'Vary the wording', description: 'Use related terms and natural variations where the repeat adds nothing.' },
          { step: 3, title: 'Write for people first', description: 'Keep the word where it is the clearest choice. It should read naturally.' }
        ],
        timeToFix: '20 minutes',
        difficulty: 'easy',
      });
    }
  }

  private analyzeReadability(pages: PageData[], issues: AuditIssue[], analysis: ContentAnalysis): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    // Very long sentences, measured on English prose with enough sentences
    if (this.readabilityMeasured && analysis.sentenceCount >= 5 && analysis.avgSentenceLength > 25) {
      issues.push({
        id: 'long_sentences',
        category: 'content',
        type: 'generic_content',
        severity: 'low',
        title: 'Sentences Are Long on Average',
        description: `Sentences in the main content average about ${analysis.avgSentenceLength.toFixed(1)} words (an estimate from ${analysis.sentenceCount} sentences).`,
        impact: 'Long sentences can be harder to follow, especially on a phone.',
        suggestion: 'Where it helps, break long sentences into shorter ones.',
        url: mainPage.url,
        priority: 2,
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
