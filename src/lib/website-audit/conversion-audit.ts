// Conversion Suggestions Module
// Looks at calls to action, trust pages, social proof, forms and page structure.
//
// These findings are suggestions. They do not affect the overall score (the
// engine gives this category weight 0), so every finding is at most 'medium'
// and worded as something to consider, not a failure. We do not quote
// conversion statistics: the effect of any change depends on the site.

import * as cheerio from 'cheerio';
import type { Cheerio, CheerioAPI } from 'cheerio';
import type { PageData, AuditIssue, AuditScore } from './types';

/** Buttons, button styled links and form submits count as calls to action. */
const CTA_SELECTOR =
  'button, a[role="button"], a[class*="btn"], a[class*="button"], input[type="submit"], input[type="image"]';

/** Link text that reads as a call to action even without button styling. */
const CTA_PHRASES = /\b(buy now|get started|sign up|start free|try (it )?free|subscribe|join now|register|create (an )?account|add to (cart|basket)|checkout|see pricing|view plans|get (a )?demo|book (a )?(call|demo)|contact us|get (a )?quote|request a (quote|demo)|start (your )?(free )?trial|free trial|apply now|enroll|download)\b/i;

/** Link text that does not say where the link goes. */
const VAGUE_LINK_TEXT = new Set(['click here', 'here', 'click', 'link', 'this link', 'more info', 'read more', 'more']);

/** Signs the page sells something directly, used to decide whether pricing is relevant. */
const COMMERCE_PHRASES = /\b(buy now|add to (cart|basket)|checkout|start (your )?(free )?trial|free trial|subscribe now|get (a )?quote|book (a )?demo|request a demo|see pricing|view plans|order now)\b/i;

const pathOf = (href: string): string => {
  try {
    return new URL(href).pathname.toLowerCase();
  } catch {
    return href.toLowerCase();
  }
};

const textOf = ($: CheerioAPI, el: Parameters<CheerioAPI>[0]): string => {
  const $el = $(el);
  return (
    $el.text() ||
    $el.attr('aria-label') ||
    $el.attr('value') ||
    $el.attr('title') ||
    $el.find('img[alt]').first().attr('alt') ||
    ''
  ).replace(/\s+/g, ' ').trim();
};

/**
 * Calls to action inside a scope: buttons, links with role="button" or a btn
 * or button class, form submits, and links whose text reads as a call to
 * action. Menu toggles (aria-expanded, aria-controls, aria-haspopup) and reset
 * buttons are left out.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function findCtas($: CheerioAPI, scope?: Cheerio<any>): { el: unknown; text: string }[] {
  const root = scope ?? $.root();
  const seen = new Set<unknown>();
  const out: { el: unknown; text: string }[] = [];
  root.find(CTA_SELECTOR).each((_, el) => {
    const $el = $(el);
    if ($el.closest('template, noscript').length > 0) return;
    if ($el.attr('aria-expanded') !== undefined || $el.attr('aria-controls') !== undefined || $el.attr('aria-haspopup') !== undefined) return;
    if (($el.attr('type') || '').toLowerCase() === 'reset') return;
    if (seen.has(el)) return;
    seen.add(el);
    out.push({ el, text: textOf($, el) });
  });
  root.find('a[href]').each((_, el) => {
    if (seen.has(el)) return;
    const label = textOf($, el);
    if (label.length > 0 && label.length <= 40 && CTA_PHRASES.test(label)) {
      seen.add(el);
      out.push({ el, text: label });
    }
  });
  return out;
}

export class ConversionAuditor {
  analyze(pages: PageData[]): { issues: AuditIssue[]; score: AuditScore } {
    const issues: AuditIssue[] = [];
    const mainPage = pages[0];

    if (!mainPage) {
      return {
        issues: [],
        score: this.createScore(0, 0, 0, 0),
      };
    }

    // When the HTML has almost no visible text and many scripts, the page is
    // built in the browser and none of these checks can see it. The content
    // audit raises js_rendered_content for that case, so we stay quiet here.
    const visibleWords = mainPage.text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    const scriptTags = (mainPage.html.match(/<script\b/gi) || []).length;
    const hasAppRoot = /\bid\s*=\s*["'](root|app|__next)["']/i.test(mainPage.html);
    if (visibleWords < 50 && (scriptTags >= 5 || (hasAppRoot && visibleWords < 5))) {
      return { issues: [], score: this.createScore(100, 28, 28, 0) };
    }

    const $ = cheerio.load(mainPage.html);
    const text = mainPage.text.toLowerCase();
    const mainText = (mainPage.mainText || mainPage.text).toLowerCase();
    const ctas = findCtas($);

    // Calls to action
    this.analyzeCTADepth(pages, issues, $, ctas);

    // Trust pages and contact details
    this.analyzeTrustSignalsDeep(pages, issues, $);

    // Social proof
    this.analyzeSocialProof(pages, issues);

    // Forms
    this.analyzeFormConversion(pages, issues);

    // Value proposition and pricing
    this.analyzeValueProposition(pages, issues, text, mainText, ctas);

    // Navigation and footer
    this.analyzeNavigationConversion(pages, issues, $);

    // Page structure
    this.analyzeLandingStructure(pages, issues, $, text, ctas);

    // Mobile call to action
    this.analyzeMobileConversion(pages, issues, $);

    // Calculate score
    const totalChecks = 28;
    // A check counts as passed only if it raised no finding at all. Previously this
    // applied a weighted penalty (critical x3, high x2) and ignored medium and low
    // findings entirely, so the number was not a count of passed checks.
    const passedChecks = Math.max(0, totalChecks - issues.length);

    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  // --- Calls to action ---

  private analyzeCTADepth(pages: PageData[], issues: AuditIssue[], $: CheerioAPI, ctas: { el: unknown; text: string }[]) {
    const mainPage = pages[0];
    const ctaCount = ctas.length;

    if (ctaCount === 0) {
      issues.push({
        id: 'conv-no-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'medium',
        title: 'Consider Adding a Clear Call to Action',
        description: 'We did not find a button, a button styled link or a form submit on your homepage. If your main action is a plain text link, you can ignore this.',
        impact: 'If the page has a goal, such as a sign up, a purchase or a contact request, a clear button makes the next step obvious.',
        suggestion: 'Add one clear button for your main action near the top, with plain action words such as "Get a quote" or "Start free".',
        priority: 5,
        affectedUrls: [mainPage.url],
        timeToFix: '15 to 30 minutes',
        difficulty: 'easy',
      });
    } else if (ctaCount === 1) {
      issues.push({
        id: 'conv-single-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'You Could Repeat Your Call to Action',
        description: `We found one call to action on your homepage ("${ctas[0].text.substring(0, 60) || 'button'}").`,
        impact: 'Visitors decide at different points. On a long page, repeating the main action lower down saves them scrolling back.',
        suggestion: 'If the page is long, consider repeating the main call to action after key sections, or adding a softer second option such as "See how it works".',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '20 to 40 minutes',
        difficulty: 'easy',
      });
    }

    // Vague link and button text, checked on calls to action and all links
    const vague = new Set<string>();
    let vagueCount = 0;
    const checkVague = (label: string) => {
      const normalized = label.toLowerCase().replace(/[^\p{L}\s]/gu, '').replace(/\s+/g, ' ').trim();
      if (VAGUE_LINK_TEXT.has(normalized)) {
        vagueCount++;
        vague.add(label);
      }
    };
    const checked = new Set<unknown>();
    for (const c of ctas) {
      checked.add(c.el);
      checkVague(c.text);
    }
    $('a[href]').each((_, el) => {
      if (checked.has(el)) return;
      checkVague(textOf($, el));
    });

    if (vagueCount > 0) {
      issues.push({
        id: 'conv-weak-cta-text',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'low',
        title: `${vagueCount} Link${vagueCount > 1 ? 's' : ''} or Button${vagueCount > 1 ? 's' : ''} With Vague Text`,
        description: `We found ${vagueCount} link${vagueCount > 1 ? 's' : ''} or button${vagueCount > 1 ? 's' : ''} with text such as ${[...vague].slice(0, 3).map((v) => `"${v}"`).join(', ')}, which does not say what happens on click.`,
        impact: 'Clear text tells visitors and screen reader users where a link goes. Search engines also use link text to understand the page it points to.',
        suggestion: 'Say what the visitor gets, for example "Read the pricing guide" instead of "Read more", or "Get my audit report" instead of "Click here".',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '10 to 20 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Trust pages and contact details ---

  private analyzeTrustSignalsDeep(pages: PageData[], issues: AuditIssue[], $: CheerioAPI) {
    const mainPage = pages[0];
    const allLinks = pages.flatMap((p) => p.links);
    const crawledPaths = pages.map((p) => pathOf(p.finalUrl || p.url));

    const linkMatches = (pathRe: RegExp, textRe: RegExp): boolean =>
      allLinks.some((l) => pathRe.test(pathOf(l.href)) || textRe.test(l.text)) ||
      crawledPaths.some((p) => pathRe.test(p));

    const hasPrivacy = linkMatches(/privacy/, /privacy/i);
    const hasAbout = linkMatches(/^\/(about|about-us|company|our-story|who-we-are)(\/|\.|$)/, /\babout\b/i);
    const hasContactPage = linkMatches(/^\/(contact|contact-us|get-in-touch)(\/|\.|$)/, /\bcontact\b/i);
    const hasTerms = linkMatches(/terms|conditions|\/legal(\/|$)/, /\bterms\b/i);
    const hasHelp = linkMatches(/^\/(faq|faqs|help|support)(\/|\.|$)/, /\b(faq|faqs|help center|help centre|support)\b/i);

    const foundTrustPages: string[] = [];
    if (hasAbout) foundTrustPages.push('About');
    if (hasContactPage) foundTrustPages.push('Contact');
    if (hasPrivacy) foundTrustPages.push('Privacy policy');
    if (hasTerms) foundTrustPages.push('Terms');
    if (hasHelp) foundTrustPages.push('Help or FAQ');

    if (!hasPrivacy) {
      issues.push({
        id: 'conv-missing-privacy',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'medium',
        title: 'Privacy Policy Link Not Found',
        description: 'We did not find a link to a privacy policy on the pages we checked. Most sites that collect personal data or use analytics need a privacy policy; ask a legal adviser for your situation.',
        impact: 'Visitors about to share an email address or payment details often look for it, usually in the footer.',
        suggestion: 'If you have a privacy policy, link it from the footer of every page and near forms that collect personal data. If you do not, ask a legal adviser what yours should cover.',
        priority: 5,
        affectedUrls: [mainPage.url],
        timeToFix: '10 minutes to link, longer to write',
        difficulty: 'medium',
      });
    }

    // Contact details: a tel: or mailto: link, an email address, a phone number
    // with separators, a street address, a contact page link, or a contact form.
    const hasTelOrMail = $('a[href^="tel:"], a[href^="mailto:"]').length > 0;
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(mainPage.text);
    const hasPhone = this.hasPhoneNumber(mainPage.text);
    const hasAddress = /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|blvd|drive|dr|lane|ln|way)\b/i.test(mainPage.text);
    const hasContactForm = pages.some((p) =>
      p.forms.some((f) => f.inputs.some((i) => i.type === 'email') && f.inputs.some((i) => i.type === 'textarea'))
    );

    if (!hasTelOrMail && !hasEmail && !hasPhone && !hasAddress && !hasContactPage && !hasContactForm) {
      issues.push({
        id: 'conv-no-contact-info',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'Contact Details Not Found',
        description: 'We did not find a phone number, email address, street address, contact page link or contact form on the pages we checked.',
        impact: 'Being easy to reach helps visitors trust that there is a real business behind the site.',
        suggestion: 'Consider linking a contact page from the header or footer, or showing an email address or phone number.',
        priority: 4,
        affectedUrls: [mainPage.url],
        timeToFix: '10 to 15 minutes',
        difficulty: 'easy',
      });
    }

    if (foundTrustPages.length < 2) {
      issues.push({
        id: 'conv-low-trust-signals',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'Few Trust Pages Linked',
        description: `We found links to ${foundTrustPages.length === 0 ? 'none' : foundTrustPages.join(', ')} of these pages: About, Contact, Privacy policy, Terms, Help or FAQ.`,
        impact: 'These pages help visitors check who runs the site and how it treats them.',
        suggestion: 'Link the pages that apply to you from the footer. Real reviews, named clients or verifiable credentials also help.',
        priority: 3,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '30 to 60 minutes',
        difficulty: 'easy',
      });
    }

    if (!hasAbout) {
      issues.push({
        id: 'conv-missing-about',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'About Page Link Not Found',
        description: 'We did not find a link to an About page on the pages we checked.',
        impact: 'Many visitors want to know who they are dealing with before they get in touch or buy.',
        suggestion: 'Consider an About page with who you are, what you do and how to reach you, linked from the menu or footer.',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '1 to 2 hours',
        difficulty: 'medium',
      });
    }
  }

  /**
   * Phone numbers: groups of digits with separators, 7 to 15 digits in all.
   * Runs of years ("2023 2024 2025") and dates are not phone numbers.
   */
  private hasPhoneNumber(text: string): boolean {
    const candidates = text.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(\d{1,5}\)[\s.-]?)?\d{2,5}(?:[\s.-]\d{2,5}){1,4}/g) || [];
    const isYear = (g: string) => /^(19|20)\d{2}$/.test(g);
    for (const raw of candidates) {
      const candidate = raw.trim();
      const digits = candidate.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) continue;
      if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(candidate)) continue;
      const groups = candidate.replace(/[+()]/g, ' ').split(/[\s.-]+/).filter((g) => g.length > 0);
      if (groups.every(isYear)) continue;
      const international = candidate.startsWith('+') || candidate.startsWith('(');
      if (international) return true;
      // Without a country code or area code in brackets, require three or more
      // groups and no group that looks like a year.
      if (groups.length >= 3 && !groups.some(isYear)) return true;
    }
    return false;
  }

  // --- Social proof ---

  private analyzeSocialProof(pages: PageData[], issues: AuditIssue[]) {
    const mainPage = pages[0];
    const found = new Set<string>();

    for (const page of pages) {
      const text = page.text;
      const html = page.html;
      if (
        /\btestimonials?\b/i.test(text) ||
        /(class|id)\s*=\s*["'][^"']*testimonial/i.test(html) ||
        /<blockquote\b[^>]*\bcite\s*=|<blockquote\b[^>]*>[\s\S]{0,2000}?<cite\b/i.test(html)
      ) found.add('Testimonials');
      if (
        /\b\d{1,3}(?:,\d{3})*\+?\s+reviews\b|\brated\s+\d(?:\.\d)?\b|★|\b\d(?:\.\d)?\s*(?:\/\s*5|out of 5)\b/i.test(text) ||
        page.structured_data.some((sd) => /^(Review|AggregateRating)$/i.test(sd.type)) ||
        /"@type"\s*:\s*"(Review|AggregateRating)"/.test(html)
      ) found.add('Reviews or ratings');
      if (/\btrusted by\b/i.test(text)) found.add('Trusted by statement');
      if (/\bcase stud(y|ies)\b|\bsuccess stor(y|ies)\b/i.test(text)) found.add('Case studies');
      if (/\b(as seen (on|in)|featured (on|in)|award[\s-]winning|winner of)\b/i.test(text)) found.add('Press or awards');
      if (/\b(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?\s?[km])\+?\s+(?:happy\s+|satisfied\s+|active\s+)?(users|customers|clients|businesses|companies|subscribers|members|downloads)\b/i.test(text)) found.add('User counts');
    }

    if (found.size === 0) {
      issues.push({
        id: 'conv-no-social-proof',
        category: 'conversion',
        type: 'missing_social_proof',
        severity: 'low',
        title: 'Consider Showing Social Proof',
        description: 'We did not find testimonials, reviews, ratings, case studies or "trusted by" statements on the pages we checked.',
        impact: 'Visitors who do not know you yet often look for signs that other people use and recommend you. Not every site needs this, for example a personal blog.',
        suggestion: 'Where you have them, show real reviews, named clients or verifiable credentials. Only show proof that is genuine and that you have permission to use.',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '1 to 3 hours',
        difficulty: 'easy',
      });
    }
  }

  // --- Forms ---

  private analyzeFormConversion(pages: PageData[], issues: AuditIssue[]) {
    const mainPage = pages[0];
    let longForms = 0;
    let longestForm = 0;
    let fieldsWithoutLabels = 0;
    const pagesWithUnlabelled = new Set<string>();
    let formsWithFields = 0;
    let formsWithValidation = 0;

    for (const page of pages) {
      for (const form of page.forms) {
        const fields = form.inputs;
        if (fields.length === 0) continue;
        // A single search box is not a conversion form.
        const isSearch = fields.length === 1 &&
          (fields[0].type === 'search' || /^(q|s|search|query)$/i.test(fields[0].name || ''));
        const unlabelled = fields.filter((i) => !i.hasLabel).length;
        if (unlabelled > 0) {
          fieldsWithoutLabels += unlabelled;
          pagesWithUnlabelled.add(page.url);
        }
        if (isSearch) continue;
        formsWithFields++;
        if (fields.length > 7) longForms++;
        longestForm = Math.max(longestForm, fields.length);
        if (fields.some((i) => i.required || ['email', 'tel', 'url', 'number'].includes(i.type))) {
          formsWithValidation++;
        }
      }
    }

    if (longForms > 0) {
      issues.push({
        id: 'conv-long-forms',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: `Consider Shortening ${longForms > 1 ? `${longForms} Long Forms` : 'a Long Form'}`,
        description: `We found ${longForms} form${longForms > 1 ? 's' : ''} with more than 7 fields (the longest has ${longestForm}).`,
        impact: 'Every field is something a visitor has to think about. Asking only for what you need makes a form quicker to finish.',
        suggestion: 'Check which fields you really need at this step. Optional details can often be asked later, or the form can be split into short steps.',
        priority: 3,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '30 to 60 minutes',
        difficulty: 'medium',
      });
    }

    if (fieldsWithoutLabels > 0) {
      issues.push({
        id: 'conv-forms-no-labels',
        category: 'conversion',
        type: 'missing_label',
        severity: 'medium',
        title: `${fieldsWithoutLabels} Form Field${fieldsWithoutLabels > 1 ? 's' : ''} Without a Label`,
        description: `We found ${fieldsWithoutLabels} form field${fieldsWithoutLabels > 1 ? 's' : ''} with no label, aria-label, aria-labelledby or title. A placeholder alone disappears once typing starts.`,
        impact: 'Screen reader users cannot tell what the field is for, and other visitors can lose track of what they were asked.',
        suggestion: 'Give each field a visible label linked with label for="id". Use placeholders only as hints.',
        priority: 4,
        affectedUrls: [...pagesWithUnlabelled],
        timeToFix: '15 to 30 minutes',
        difficulty: 'easy',
      });
    }

    if (formsWithFields > 0 && formsWithValidation === 0) {
      issues.push({
        id: 'conv-no-form-validation',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'Consider Adding Form Validation Hints',
        description: 'We did not see required fields or input types such as type="email" in your forms. If you validate with JavaScript, you can ignore this.',
        impact: 'Browser validation catches simple mistakes, such as a missing @ in an email address, before the form is sent.',
        suggestion: 'Add required to fields you need and use matching input types (email, tel, url) so browsers and phone keyboards can help.',
        priority: 2,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '15 to 30 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Value proposition and pricing ---

  private analyzeValueProposition(pages: PageData[], issues: AuditIssue[], text: string, mainText: string, ctas: { el: unknown; text: string }[]) {
    const mainPage = pages[0];

    // Benefit words near the top of the main content
    const benefitWords = ['save', 'faster', 'easier', 'better', 'more', 'increase', 'reduce', 'boost',
                          'improve', 'automate', 'generate', 'free', 'instant', 'unlimited', 'proven',
                          'guaranteed', 'results', 'roi', 'revenue', 'growth', 'scale', 'help', 'without'];
    const heroSection = mainText.substring(0, 800);
    const hasBenefitLanguage = benefitWords.some(bw => new RegExp(`\\b${bw}`).test(heroSection));

    if (!hasBenefitLanguage && mainPage.meta.h1.length > 0 && heroSection.trim().length > 0) {
      issues.push({
        id: 'conv-no-benefits',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'low',
        title: 'Consider Stating the Main Benefit Near the Top',
        description: 'The start of your main content does not seem to say what visitors gain. This is a rough check based on common benefit words, so read the top of the page yourself.',
        impact: 'Visitors decide quickly whether a page is for them. Saying the outcome they get, not just what the product is, helps them decide.',
        suggestion: 'Under the headline, say in one sentence what the visitor gets. For example, instead of "Analytics dashboard", try "See what drives your sales, in one view".',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '20 to 40 minutes',
        difficulty: 'easy',
      });
    }

    // Pricing: only relevant when the page sells something directly.
    const sellsDirectly = COMMERCE_PHRASES.test(text) || ctas.some((c) => COMMERCE_PHRASES.test(c.text));
    const mentionsPricing = pages.some((p) => /pric/.test(pathOf(p.url))) ||
      pages.some((p) => p.links.some((l) => /pric|plans/.test(pathOf(l.href)) || /\b(pricing|prices|plans)\b/i.test(l.text))) ||
      /\b(pricing|price|prices|plans)\b|[$£€]\s?\d/.test(text);

    if (sellsDirectly && !mentionsPricing) {
      issues.push({
        id: 'conv-no-pricing-visibility',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'Consider Making Pricing Easy to Find',
        description: 'Your homepage asks visitors to buy, subscribe or request a quote, but we did not find prices or a pricing link.',
        impact: 'Many visitors want a rough idea of cost before they commit or get in touch.',
        suggestion: 'If you can, add a pricing page or a "starting from" price. If pricing is custom, explain briefly how it works.',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '1 to 2 hours',
        difficulty: 'medium',
      });
    }
  }

  // --- Navigation and footer ---

  private analyzeNavigationConversion(pages: PageData[], issues: AuditIssue[], $: CheerioAPI) {
    const mainPage = pages[0];

    // Top level links of the main menu: the first nav inside the header, or
    // the first nav on the page. Links in nested dropdown lists are not counted.
    let nav = $('header nav').first();
    if (nav.length === 0) nav = $('nav').first();
    if (nav.length > 0) {
      const items = new Set<string>();
      nav.find('a[href]').each((_, el) => {
        const $el = $(el);
        if ($el.parentsUntil(nav, 'ul, ol').length > 1) return;
        items.add(`${($el.attr('href') || '').trim()}|${textOf($, el).toLowerCase()}`);
      });
      const navItemCount = items.size;

      if (navItemCount > 9) {
        issues.push({
          id: 'conv-nav-too-many',
          category: 'conversion',
          type: 'missing_cta',
          severity: 'low',
          title: `Main Menu Has ${navItemCount} Top Level Links`,
          description: `The main menu shows ${navItemCount} top level links. A shorter menu can make your most important pages easier to spot.`,
          impact: 'This is a judgement call. Shops and content sites often need more links, and dropdowns can group them.',
          suggestion: 'Consider keeping the pages most visitors need in the main menu and grouping the rest under a few headings.',
          priority: 2,
          affectedUrls: [mainPage.url],
          timeToFix: '15 to 30 minutes',
          difficulty: 'easy',
        });
      }
    }

    // Footer links
    const footer = $('footer').last();
    const footerLinks = footer.length > 0 ? footer.find('a[href]').length : 0;
    if (footerLinks < 4) {
      issues.push({
        id: 'conv-sparse-footer',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: footer.length > 0 ? 'Footer Has Few Links' : 'No Footer Found',
        description: footer.length > 0
          ? `We found ${footerLinks} link${footerLinks === 1 ? '' : 's'} in the footer.`
          : 'We did not find a footer element on your homepage.',
        impact: 'Visitors often scroll to the footer to find contact details, policies and other key pages.',
        suggestion: 'Consider adding the pages that apply to you: About, Contact, Privacy policy, Terms and your main sections.',
        priority: 2,
        affectedUrls: [mainPage.url],
        timeToFix: '20 to 30 minutes',
        difficulty: 'easy',
      });
    }
  }

  // --- Page structure ---

  private analyzeLandingStructure(pages: PageData[], issues: AuditIssue[], $: CheerioAPI, text: string, ctas: { el: unknown; text: string }[]) {
    const mainPage = pages[0];

    // Supporting sections below the hero
    const hasFeatureSection = /\b(features?|benefits?|why|how it works)\b/.test(text) ||
      $('section').length > 2 || mainPage.meta.h2.length >= 2;

    if (!hasFeatureSection) {
      issues.push({
        id: 'conv-no-features-section',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'low',
        title: 'Consider Adding Sections That Explain Your Offer',
        description: 'We found few headings or sections below the top of your homepage, so there may be little explaining what you offer and why it matters.',
        impact: 'Visitors who are not ready to act yet look for details: what it is, how it works, and who it is for.',
        suggestion: 'Consider short sections with their own headings, such as key benefits, how it works, and proof from customers.',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '2 to 4 hours',
        difficulty: 'medium',
      });
    }

    // FAQ
    const hasFAQ = /\b(frequently asked|faqs?)\b/.test(text) ||
      $('details summary').length >= 3 ||
      mainPage.structured_data.some((sd) => /^FAQPage$/i.test(sd.type)) ||
      pages.some((p) => p.links.some((l) => /^\/(faq|faqs|help)(\/|$)/.test(pathOf(l.href))));
    if (!hasFAQ) {
      issues.push({
        id: 'conv-no-faq',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'Consider Answering Common Questions',
        description: 'We did not find an FAQ section or FAQ page link.',
        impact: 'Answering the questions people ask before they buy or get in touch, such as price, timing or refunds, can remove doubts early.',
        suggestion: 'If visitors often ask the same questions, consider a short FAQ section with honest answers.',
        priority: 2,
        affectedUrls: [mainPage.url],
        timeToFix: '30 to 60 minutes',
        difficulty: 'easy',
      });
    }

    // A call to action near the end of the main content
    const main = $('main').first().length > 0 ? $('main').first() : $('body').first();
    const blocks = main.children().filter((_, el) => !$(el).is('script, style, noscript, template, header, footer, nav'));
    if (ctas.length > 0 && blocks.length >= 4) {
      const lastBlocks = blocks.slice(-2);
      const hasLateCta = findCtas($, lastBlocks).length > 0 || lastBlocks.find('form').length > 0 || lastBlocks.is('form');
      if (!hasLateCta) {
        issues.push({
          id: 'conv-no-final-cta',
          category: 'conversion',
          type: 'missing_cta',
          severity: 'low',
          title: 'You Could Add a Call to Action Near the End',
          description: 'We did not find a button or form in the last sections of your main content.',
          impact: 'Visitors who read to the end are often the most interested. A closing call to action saves them scrolling back up.',
          suggestion: 'Consider a short closing section before the footer that repeats your main call to action.',
          priority: 2,
          affectedUrls: [mainPage.url],
          timeToFix: '20 to 40 minutes',
          difficulty: 'easy',
        });
      }
    }
  }

  // --- Mobile call to action ---

  private analyzeMobileConversion(pages: PageData[], issues: AuditIssue[], $: CheerioAPI) {
    const mainPage = pages[0];

    // An element that stays on screen (fixed or sticky) and holds a call to action.
    const pinned = $('[class*="sticky"], [class*="fixed"], [style*="position: fixed"], [style*="position:fixed"], [style*="position: sticky"], [style*="position:sticky"]');
    let hasStickyCTA = false;
    pinned.each((_, el) => {
      if (hasStickyCTA) return;
      const $el = $(el);
      if ($el.is(CTA_SELECTOR) || findCtas($, $el).length > 0) hasStickyCTA = true;
    });

    if (!hasStickyCTA) {
      issues.push({
        id: 'conv-no-sticky-mobile-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'Optional: Keep a Call to Action on Screen on Phones',
        description: 'We did not find a sticky or fixed element with a button in your HTML. This is optional, and we cannot see styles that are added only in CSS files.',
        impact: 'On long pages, a small bar or sticky header with your main action saves phone users scrolling back to the top. It can also feel intrusive, so test it.',
        suggestion: 'If it suits your site, consider a sticky header or a slim bottom bar with your main call to action on small screens. Keep it small so it does not cover content.',
        priority: 1,
        affectedUrls: [mainPage.url],
        timeToFix: '30 to 60 minutes',
        difficulty: 'medium',
      });
    }
  }

  // --- Helpers ---

  private createScore(score: number, totalChecks: number, passedChecks: number, issues: number): AuditScore {
    return {
      category: 'conversion',
      score: Math.min(100, Math.max(0, Math.round(score))),
      maxScore: totalChecks,
      issues,
      criticalIssues: 0,
      passed: passedChecks,
      failed: totalChecks - passedChecks,
    };
  }

  private getSeverityWeight(severity: string): number {
    switch (severity) {
      case 'critical': return 25;
      case 'high': return 15;
      case 'medium': return 8;
      case 'low': return 3;
      default: return 0;
    }
  }
}
