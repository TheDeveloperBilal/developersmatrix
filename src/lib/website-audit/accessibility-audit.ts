// Accessibility Audit Module
//
// These are checks we can detect from the HTML alone: alt text, labels,
// headings, the lang attribute, landmarks, link names and a few ARIA misuses.
// They are not a full WCAG audit. Colour contrast, focus order, keyboard traps
// and anything that depends on CSS or JavaScript need a real browser and a
// person, so we do not claim to measure them here.

import * as cheerio from 'cheerio';
import type { PageData, AuditIssue, AuditScore } from './types';

type Doc = cheerio.CheerioAPI;

/** Whole alt values that tell a screen reader user nothing. "logo" is fine. */
const GENERIC_ALT = new Set(['image', 'photo', 'picture', 'img', 'graphic']);
/** Alt text that is just a file name, or a camera style name such as IMG_1234. */
const FILE_NAME_ALT = /\.(jpe?g|png|gif|webp|svg|avif)$/i;
const CAMERA_NAME_ALT = /^(img|dsc|dscn|dscf|pxl|photo|image|screenshot)[_\- ]?\d{2,}$/i;

/** Link names that say nothing about where the link goes. */
const VAGUE_LINK_TEXT = new Set(['click here', 'here', 'read more', 'more', 'learn more', 'link']);

/** Elements a keyboard user can tab to. */
const FOCUSABLE =
  'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

/** Rough BCP 47 shape: en, en-GB, zh-Hant-TW. */
const LANG_PATTERN = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/i;

export class AccessibilityAuditor {
  private docs = new WeakMap<PageData, Doc>();

  private doc(page: PageData): Doc {
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

  private analyzeAltText(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const missingAlt: { src: string; width?: string; height?: string }[] = [];
      const genericAlt: { src: string; alt: string }[] = [];

      $('img').each((_, el) => {
        const $img = $(el);
        const role = ($img.attr('role') || '').trim().toLowerCase();
        // Hidden from assistive technology on purpose, so no alt is needed.
        if (role === 'presentation' || role === 'none') return;
        if ($img.closest('[aria-hidden="true"]').length > 0) return;

        // Tracking pixels and spacers.
        const w = parseInt($img.attr('width') || '', 10);
        const h = parseInt($img.attr('height') || '', 10);
        if ((Number.isFinite(w) && w <= 2) || (Number.isFinite(h) && h <= 2)) return;

        const src = $img.attr('src') || $img.attr('data-src') || '';
        const alt = $img.attr('alt');
        if (alt === undefined) {
          missingAlt.push({ src, width: $img.attr('width'), height: $img.attr('height') });
          return;
        }
        const value = alt.trim().toLowerCase();
        if (GENERIC_ALT.has(value) || FILE_NAME_ALT.test(value) || CAMERA_NAME_ALT.test(value)) {
          genericAlt.push({ src, alt });
        }
      });

      // Images with no alt attribute at all. An empty alt="" is correct for decoration.
      if (missingAlt.length > 0) {
        issues.push({
          id: `missing_alt_${page.url}`,
          category: 'accessibility',
          type: 'missing_alt_text',
          severity: missingAlt.length > 5 ? 'high' : 'medium',
          title: 'Images Missing Alt Text',
          description: `${missingAlt.length} ${missingAlt.length === 1 ? 'image' : 'images'} on ${page.url} ${missingAlt.length === 1 ? 'has' : 'have'} no alt attribute.`,
          impact: 'Screen readers cannot describe these images, and some read out the file name instead. A missing alt attribute fails WCAG 2.1 success criterion 1.1.1 (Level A).',
          suggestion: 'Add descriptive alt text to every meaningful image. Use an empty alt="" for decorative images so screen readers skip them.',
          url: page.url,
          priority: missingAlt.length > 5 ? 9 : 7,
          affectedUrls: [page.url],
          affectedElements: missingAlt.slice(0, 5).map((img) => ({
            tag: 'img',
            attributes: { src: img.src },
            outerHTML: `<img src="${img.src}"${img.width ? ` width="${img.width}"` : ''}${img.height ? ` height="${img.height}"` : ''} />`,
            selector: `img[src="${img.src}"]`,
          })),
          codeSnippet: missingAlt.slice(0, 3).map((img) => `<img src="${img.src}" alt="ADD DESCRIPTIVE TEXT HERE" />`).join('\n'),
          fixInstructions: [
            { step: 1, title: 'Sort meaningful from decorative', description: 'Decorative images such as borders and background shapes get alt="". Images that carry information need a description.' },
            { step: 2, title: 'Write the alt text', description: 'Describe what the image shows, for example "Bar chart of revenue by quarter", not "image1.jpg".' },
            { step: 3, title: 'Add the attributes', description: 'Update each <img> tag with its alt text.' }
          ],
          timeToFix: `${Math.max(5, Math.ceil(missingAlt.length * 0.5))} minutes`,
          difficulty: 'easy',
        });
      }

      // Alt text that is only a generic word or a file name.
      if (genericAlt.length > 0) {
        issues.push({
          id: `bad_alt_${page.url}`,
          category: 'accessibility',
          type: 'missing_alt_text',
          severity: 'low',
          title: 'Generic Alt Text',
          description: `${genericAlt.length} ${genericAlt.length === 1 ? 'image' : 'images'} on ${page.url} ${genericAlt.length === 1 ? 'has' : 'have'} alt text that is only a generic word or a file name, for example "${genericAlt[0].alt}".`,
          impact: 'A screen reader user hears "image" or a file name, which tells them nothing about what the picture shows.',
          suggestion: 'Replace these with a short description of what each image shows, or use alt="" if the image is purely decorative.',
          url: page.url,
          priority: 3,
          affectedUrls: [page.url],
          affectedElements: genericAlt.slice(0, 5).map((img) => ({
            tag: 'img',
            attributes: { src: img.src, alt: img.alt },
            outerHTML: `<img src="${img.src}" alt="${img.alt}" />`,
            selector: `img[src="${img.src}"]`,
          })),
        });
      }
    });
  }

  private analyzeHeadingHierarchy(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const { h1 } = page.meta;

      // A missing H1 is a best practice issue, not a WCAG failure.
      if (h1.length === 0) {
        issues.push({
          id: `no_h1_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'low',
          title: 'No H1 Heading (best practice)',
          description: `We found no H1 heading on ${page.url}.`,
          impact: 'Many screen reader users jump to the H1 to find where the main content starts. WCAG does not require an H1, but it is a widely followed best practice.',
          suggestion: 'Add one H1 that names the main topic of the page.',
          url: page.url,
          priority: 4,
        });
      }

      // Several H1s are allowed by WCAG and by HTML. One is still the clearer choice.
      if (h1.length > 1) {
        issues.push({
          id: `multiple_h1_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'low',
          title: 'Multiple H1 Headings (best practice)',
          description: `We found ${h1.length} H1 headings on ${page.url}.`,
          impact: 'This is not a WCAG failure, but a single H1 makes it easier for screen reader users to tell which heading is the main one.',
          suggestion: 'Keep one H1 for the main topic and turn the others into H2 headings.',
          url: page.url,
          priority: 3,
        });
      }

      // Walk the headings in document order and look for downward jumps of more than one level.
      const $ = this.doc(page);
      const jumps: string[] = [];
      let previous = 0;
      $('h1, h2, h3, h4, h5, h6').each((_, el) => {
        const tag = String($(el).prop('tagName') || '').toLowerCase();
        const level = parseInt(tag.slice(1), 10);
        if (!Number.isFinite(level)) return;
        if (previous > 0 && level > previous + 1) {
          const text = $(el).text().replace(/\s+/g, ' ').trim().slice(0, 60);
          jumps.push(`H${previous} then H${level}${text ? ` ("${text}")` : ''}`);
        }
        previous = level;
      });

      if (jumps.length > 0) {
        issues.push({
          id: `skipped_heading_${page.url}`,
          category: 'accessibility',
          type: 'heading_hierarchy',
          severity: 'low',
          title: 'Skipped Heading Levels',
          description: `On ${page.url} the headings skip a level ${jumps.length === 1 ? 'once' : `${jumps.length} times`}: ${jumps.slice(0, 3).join('; ')}${jumps.length > 3 ? '; and more' : ''}.`,
          impact: 'Screen reader users often browse a page by its headings. A jump such as H2 straight to H4 can make them think they missed a section.',
          suggestion: 'Step down one level at a time (H2, then H3, then H4). Pick heading levels for structure and use CSS to change their size.',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeFormAccessibility(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // The crawler already decided which fields have an accessible name and
      // left out hidden fields and buttons.
      const unlabeledOnPage = page.forms.reduce(
        (sum, form) => sum + form.inputs.filter((input) => !input.hasLabel && !input.placeholder).length,
        0
      );

      page.forms.forEach((form, formIndex) => {
        const inputsWithoutLabels = form.inputs.filter((input) => !input.hasLabel && !input.placeholder);

        if (inputsWithoutLabels.length > 0) {
          issues.push({
            id: `no_label_${page.url}_${formIndex}`,
            category: 'accessibility',
            type: 'missing_label',
            severity: unlabeledOnPage >= 3 ? 'high' : 'medium',
            title: 'Form Fields Without Labels',
            description: `${inputsWithoutLabels.length} ${inputsWithoutLabels.length === 1 ? 'field' : 'fields'} in a form on ${page.url} ${inputsWithoutLabels.length === 1 ? 'has' : 'have'} no label, aria-label, aria-labelledby or title${inputsWithoutLabels[0].name ? `, for example "${inputsWithoutLabels[0].name}"` : ''}.`,
            impact: 'A screen reader announces these fields as just "edit text", so the user cannot tell what to type. This fails WCAG 2.1 success criteria 1.3.1 and 4.1.2 (Level A).',
            suggestion: 'Give each field a visible <label for="field-id">. If a visible label really does not fit the design, use aria-label.',
            url: page.url,
            priority: unlabeledOnPage >= 3 ? 7 : 5,
            codeSnippet: '<label for="email">Email address</label>\n<input id="email" name="email" type="email">',
          });
        }

        // A placeholder is better than nothing, but it disappears as soon as the user types.
        const placeholderOnlyInputs = form.inputs.filter((input) => !input.hasLabel && !!input.placeholder);

        if (placeholderOnlyInputs.length > 0) {
          issues.push({
            id: `placeholder_only_${page.url}_${formIndex}`,
            category: 'accessibility',
            type: 'missing_label',
            severity: 'medium',
            title: 'Fields Labelled Only by a Placeholder',
            description: `${placeholderOnlyInputs.length} ${placeholderOnlyInputs.length === 1 ? 'field uses' : 'fields use'} only placeholder text as a label on ${page.url}, for example "${placeholderOnlyInputs[0].placeholder}".`,
            impact: 'The placeholder disappears once the user starts typing, so people with memory or attention difficulties lose the prompt. Placeholder text is also often too faint to read.',
            suggestion: 'Add a visible label for each field and keep the placeholder for an example value if you like.',
            url: page.url,
            priority: 4,
          });
        }
      });
    });
  }

  private analyzeLanguageAttribute(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const lang = (page.meta.lang || '').trim();
      if (!lang) {
        issues.push({
          id: `no_lang_${page.url}`,
          category: 'accessibility',
          type: 'missing_label',
          severity: 'medium',
          title: 'Missing Language Attribute',
          description: `The <html> element on ${page.url} has no lang attribute.`,
          impact: 'Screen readers use the lang attribute to pick the right voice and pronunciation. Without it, the page fails WCAG 2.1 success criterion 3.1.1 (Level A).',
          suggestion: 'Add the language code to the <html> element, for example <html lang="en">.',
          url: page.url,
          priority: 6,
          codeSnippet: '<html lang="en">',
        });
      } else if (!LANG_PATTERN.test(lang)) {
        issues.push({
          id: `invalid_lang_${page.url}`,
          category: 'accessibility',
          type: 'missing_label',
          severity: 'low',
          title: 'Language Attribute Not a Valid Code',
          description: `The <html> element on ${page.url} has lang="${lang}", which is not a valid language code.`,
          impact: 'Screen readers only understand standard codes such as "en" or "en-GB". A value like "english" is ignored, so the page may be read in the wrong voice.',
          suggestion: 'Use a standard language code, for example lang="en", lang="en-GB" or lang="fr".',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeARIA(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    // Landmarks help screen reader users jump between parts of the page.
    const $main = this.doc(mainPage);
    const hasLandmarks =
      $main('main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]').length > 0;

    if (!hasLandmarks) {
      issues.push({
        id: 'no_landmarks',
        category: 'accessibility',
        type: 'missing_label',
        severity: 'low',
        title: 'No Page Landmarks',
        description: 'We found no landmark elements (main, nav, header, footer) or matching ARIA roles on the homepage.',
        impact: 'Screen reader users use landmarks to jump straight to the navigation or the main content. Without them they have to move through the page line by line.',
        suggestion: 'Wrap the main parts of the page in <header>, <nav>, <main> and <footer>.',
        url: mainPage.url,
        priority: 4,
      });
    }

    // aria-hidden on icons is correct. aria-hidden on something a keyboard can
    // reach is a real problem: the user tabs onto an element the screen reader
    // says nothing about.
    pages.forEach((page) => {
      const $ = this.doc(page);
      const offenders: string[] = [];
      $('[aria-hidden="true"]').each((_, el) => {
        const $el = $(el);
        if ($el.is('[hidden], [inert]') || $el.closest('[inert]').length > 0) return;
        const focusable = ($el.is(FOCUSABLE) ? $el : $el.find(FOCUSABLE))
          .filter((_, f) => $(f).attr('tabindex') !== '-1' && $(f).attr('disabled') === undefined)
          .first();
        if (focusable.length === 0) return;
        const tag = String(focusable.prop('tagName') || '').toLowerCase();
        const label = (focusable.attr('href') || focusable.attr('name') || focusable.text() || '').replace(/\s+/g, ' ').trim().slice(0, 60);
        offenders.push(`<${tag}>${label ? ` ${label}` : ''}`);
      });

      if (offenders.length > 0) {
        issues.push({
          id: `aria_hidden_focusable_${page.url}`,
          category: 'accessibility',
          type: 'missing_label',
          severity: 'medium',
          title: 'Focusable Element Inside aria-hidden',
          description: `${offenders.length} ${offenders.length === 1 ? 'element' : 'elements'} on ${page.url} can be reached with the keyboard but ${offenders.length === 1 ? 'sits' : 'sit'} inside aria-hidden="true", for example ${offenders[0]}.`,
          impact: 'Keyboard users land on a link or button that screen readers do not announce, so they hear nothing and do not know where they are. This fails WCAG 2.1 success criterion 4.1.2 (Level A).',
          suggestion: 'Remove aria-hidden from containers that hold links, buttons or fields, or take those elements out of the tab order with tabindex="-1" if they really are hidden.',
          url: page.url,
          priority: 5,
        });
      }
    });
  }

  private analyzeLinkText(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const vague: { text: string; href: string }[] = [];

      $('a[href]').each((_, el) => {
        const $a = $(el);
        // An aria-label, aria-labelledby, image alt or title gives the link a
        // better name than its visible words, so those links are fine.
        if (($a.attr('aria-label') || '').trim() || ($a.attr('aria-labelledby') || '').trim()) return;
        if (($a.attr('title') || '').trim()) return;
        if ($a.find('img[alt]').filter((_, img) => ($(img).attr('alt') || '').trim() !== '').length > 0) return;
        const text = $a.text().replace(/\s+/g, ' ').trim().toLowerCase();
        if (VAGUE_LINK_TEXT.has(text)) vague.push({ text, href: $a.attr('href') || '' });
      });

      const destinations = new Set(vague.map((v) => v.href));
      // One "Read more" is harmless. It matters when several identical names go to different places.
      if (vague.length >= 2 && destinations.size >= 2) {
        const examples = Array.from(new Set(vague.map((v) => `"${v.text}"`))).slice(0, 3).join(', ');
        issues.push({
          id: `vague_links_${page.url}`,
          category: 'accessibility',
          type: 'missing_label',
          severity: 'low',
          title: 'Vague Link Text',
          description: `${vague.length} links on ${page.url} use text such as ${examples} and go to ${destinations.size} different places.`,
          impact: 'Screen reader users often pull up a list of all links on a page. A list of identical "Read more" links that go to different pages gives them no way to tell them apart.',
          suggestion: 'Name the destination in the link, for example "Read more about our pricing", or add an aria-label that does.',
          url: page.url,
          priority: 3,
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
          title: 'Links Opening in a New Tab Without Warning',
          description: `${linksWithoutWarning.length} links on ${page.url} open in a new tab or window without saying so.`,
          impact: 'Screen reader users may not notice that a new tab opened, and the back button then seems not to work.',
          suggestion: 'Tell users when a link opens a new tab, for example with "(opens in new tab)" in the link text or its aria-label.',
          url: page.url,
          priority: 3,
        });
      }
    });
  }

  private analyzeSkipLinks(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    const $ = this.doc(mainPage);

    // A skip link is normally one of the very first links on the page.
    const hasSkipLink = $('a[href]')
      .slice(0, 5)
      .filter((_, el) => {
        const href = ($(el).attr('href') || '').trim();
        const name = `${$(el).text()} ${$(el).attr('aria-label') || ''}`.toLowerCase();
        return href.startsWith('#') && href.length > 1 && name.includes('skip');
      }).length > 0;

    // A main landmark also lets screen reader users jump past repeated
    // content, which satisfies WCAG 2.4.1 Bypass Blocks.
    const hasMainLandmark = $('main, [role="main"]').length > 0;

    if (!hasSkipLink && !hasMainLandmark && mainPage.links.length > 10) {
      issues.push({
        id: 'no_skip_link',
        category: 'accessibility',
        type: 'missing_label',
        severity: 'low',
        title: 'No Skip Link or Main Landmark',
        description: 'The homepage has no "Skip to main content" link near the top and no <main> element, so there is no quick way past the navigation.',
        impact: 'Keyboard users have to tab through every navigation link on every page before reaching the content. WCAG 2.1 success criterion 2.4.1 asks for a way to bypass repeated blocks.',
        suggestion: 'Wrap the page content in a <main> element, and ideally add a "Skip to main content" link as the first item in the page that points to it.',
        url: mainPage.url,
        priority: 3,
        codeSnippet: '<a href="#main" class="skip-link">Skip to main content</a>\n...\n<main id="main">...</main>',
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
