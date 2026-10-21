// Technical SEO Audit Module
// Analyzes SEO-related issues on web pages

import * as cheerio from 'cheerio';
import type { PageData, AuditIssue, AuditScore } from './types';

/** Rough average width of one title character in Google's desktop results, in pixels. */
const TITLE_PX_PER_CHAR = 9.5;
/** Google cuts desktop titles at roughly this width. */
const TITLE_MAX_PX = 580;

/** Directives that take a value after a colon, so "max-snippet: 50" is not a user agent. */
const VALUED_ROBOTS_DIRECTIVES = new Set([
  'unavailable_after',
  'max-snippet',
  'max-image-preview',
  'max-video-preview',
]);

/**
 * Read robots directives the way Google does: meta robots, meta googlebot and
 * the X-Robots-Tag header all count. The header can hold several comma
 * separated directives and can be scoped to one crawler ("googlebot: noindex").
 * "none" means noindex plus nofollow.
 */
function robotsFlags(page: PageData): { noindex: boolean; nofollow: boolean; sources: string[]; nofollowSources: string[]; viaNone: boolean } {
  let noindex = false;
  let nofollow = false;
  let viaNone = false;
  const sources: string[] = [];
  const nofollowSources: string[] = [];

  const apply = (directive: string, source: string) => {
    const d = directive.trim().toLowerCase();
    if (d === 'noindex' || d === 'none') {
      noindex = true;
      if (!sources.includes(source)) sources.push(source);
    }
    if (d === 'nofollow' || d === 'none') {
      nofollow = true;
      if (d === 'none') viaNone = true;
      if (!nofollowSources.includes(source)) nofollowSources.push(source);
    }
  };

  const fromMeta = (value: string | undefined, source: string) => {
    if (!value) return;
    value.split(',').forEach((part) => apply(part, source));
  };

  fromMeta(page.meta.robots, `meta robots ("${page.meta.robots}")`);
  fromMeta(page.meta.googlebot, `meta googlebot ("${page.meta.googlebot}")`);

  const header = page.meta.xRobotsTag;
  if (header) {
    const source = `X-Robots-Tag header ("${header}")`;
    // null means the directives apply to every crawler.
    let agent: string | null = null;
    for (const raw of header.split(',')) {
      let part = raw.trim();
      const scoped = part.match(/^([a-z0-9_.-]+)\s*:\s*(.*)$/i);
      if (scoped && !VALUED_ROBOTS_DIRECTIVES.has(scoped[1].toLowerCase())) {
        agent = scoped[1].toLowerCase();
        part = scoped[2];
      }
      if (agent === null || agent === 'googlebot') apply(part, source);
    }
  }

  return { noindex, nofollow, sources, nofollowSources, viaNone };
}

/** Common tracking pixel and beacon addresses. "soundtrack.jpg" does not match. */
const TRACKING_PIXEL_PATTERN = /(^|[/._?=&-])(pixel|track|tracking|beacon)([/._?=&-]|$)|facebook\.com\/tr\b|doubleclick\.net|google-analytics\.com/i;

/** src values of images marked decorative with role="presentation", role="none" or aria-hidden="true". */
function decorativeImageSources(html: string): Set<string> {
  const found = new Set<string>();
  const tags = html.match(/<img\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const decorative =
      /\brole\s*=\s*["']?\s*(presentation|none)\b/i.test(tag) ||
      /\baria-hidden\s*=\s*["']?\s*true\b/i.test(tag);
    if (!decorative) continue;
    const src = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    const dataSrc = tag.match(/\bdata-src\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
    for (const m of [src, dataSrc]) {
      const value = m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
      if (value) found.add(value.replace(/&amp;/g, '&'));
    }
  }
  return found;
}

/** Elements that were removed from HTML. Browsers still draw most of them, but CSS or a modern element does the job. */
const OBSOLETE_ELEMENTS = ['font', 'center', 'marquee', 'blink', 'big', 'strike', 'tt', 'frame', 'frameset', 'applet', 'basefont', 'dir', 'acronym'];

/** What to use instead of each obsolete element, in plain words. */
const OBSOLETE_REPLACEMENTS: Record<string, string> = {
  font: 'Replace <font> with CSS (color, font-family, font-size) on the surrounding element.',
  center: 'Replace <center> with CSS text-align: center, or margin: 0 auto for blocks.',
  marquee: 'Remove <marquee>. Moving text is hard to read; if you really need motion, use a CSS animation that respects prefers-reduced-motion.',
  blink: 'Remove <blink>. No current browser shows it anyway.',
  big: 'Replace <big> with CSS font-size.',
  strike: 'Replace <strike> with <s> for text that is no longer accurate, or <del> for removed text.',
  tt: 'Replace <tt> with <code> for code, <kbd> for keyboard input, or <samp> for program output.',
  frame: 'Replace frames with normal pages, or an <iframe> where you really need to embed another page.',
  frameset: 'Replace the frameset with normal pages. Search engines and screen readers handle framesets badly.',
  applet: 'Remove <applet>. Java applets no longer run in any current browser.',
  basefont: 'Replace <basefont> with CSS on the body element.',
  dir: 'Replace <dir> with <ul>.',
  acronym: 'Replace <acronym> with <abbr>.',
};

/**
 * Common English words, plus words every site repeats in menus and footers.
 * They say nothing about what a page is about, so the word count skips them.
 */
const STOPWORDS = new Set(`
a about above after again against all almost along already also although always am among an and another any anyone anything are around as at
back be became because become been before being below best better between both but by
came can cannot come could did does doing done down during each either else enough etc even ever every everyone everything
few find first for from further get gets getting give given goes going got had has have having her here hers herself him himself his how however
into its itself just keep know last least less let lets like made make makes making many may maybe me might mine more most much must my myself
near need needs never next nobody none nor not nothing now off often once one only onto other others otherwise our ours ourselves out over own
per perhaps please put quite rather really right said same say says see seem seen several shall she should show shows since some someone something sometimes
still such sure take than that the their theirs them themselves then there these they thing things think this those though through thus
together too toward towards two under until upon use used uses using very via want wants was way ways well were what whatever when where whether which
while who whom whose why will with within without would yes yet you your yours yourself yourselves
three four five six seven eight nine ten first second third
day days time times year years today
home menu click read more page pages learn contact privacy policy cookie cookies terms copyright rights reserved skip content search login log sign
free new view next previous prev share follow subscribe submit toggle navigation footer header here button accept
price prices regular sale unit cart add sold quantity shop buy item items product products review reviews rated stars star
comment comments posted author category categories tags tag uncategorized min continue reading sort filter results result
january february march april may june july august september october november december
monday tuesday wednesday thursday friday saturday sunday
`.split(/\s+/).filter(Boolean));

/** Very common English function words, used to tell whether a page is really in English. */
const ENGLISH_MARKERS = new Set(['the', 'and', 'of', 'to', 'a', 'in', 'is', 'for', 'that', 'on', 'with', 'as', 'it', 'are', 'you', 'this', 'be', 'or', 'by', 'at', 'from', 'your', 'we', 'an', 'our', 'can', 'not', 'have', 'will', 'more']);

/** True when the word, or its simple singular or plural form, appears as a whole word. */
function containsWord(haystack: string | undefined, word: string): boolean {
  if (!haystack) return false;
  const forms = new Set([word]);
  if (word.endsWith('ies') && word.length > 4) forms.add(`${word.slice(0, -3)}y`);
  else if (word.endsWith('es') && word.length > 4) forms.add(word.slice(0, -2));
  if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) forms.add(word.slice(0, -1));
  if (word.endsWith('y') && word.length > 3) forms.add(`${word.slice(0, -1)}ies`);
  const alternatives = [...forms].join('|');
  return new RegExp(`\\b(?:${alternatives})(?:s|es)?\\b`, 'i').test(haystack);
}

/** Lowercase words of letters only, at least 3 letters, without stopwords or contractions. */
function contentWords(text: string): string[] {
  const raw = text.toLowerCase().match(/\p{L}+(?:['\u2019]\p{L}+)*/gu) || [];
  const words: string[] = [];
  for (let w of raw) {
    // "lamp's" counts as "lamp". Other contractions (don't, we're) are function words.
    w = w.replace(/['\u2019]s$/, '');
    if (/['\u2019]/.test(w)) continue;
    if (w.length < 3 || STOPWORDS.has(w)) continue;
    words.push(w);
  }
  return words;
}

function joinWords(words: string[]): string {
  if (words.length <= 1) return words.join('');
  return `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`;
}

export class SEOAuditor {
  private docs = new WeakMap<PageData, cheerio.CheerioAPI>();

  private doc(page: PageData): cheerio.CheerioAPI {
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

    // Title Analysis
    this.analyzeTitle(pages, issues);

    // Meta Description Analysis
    this.analyzeMetaDescription(pages, issues);

    // Heading Structure Analysis
    this.analyzeHeadings(pages, issues);

    // Canonical Tags
    this.analyzeCanonical(pages, issues);

    // Robots Directives
    this.analyzeRobots(pages, issues);

    // URL Structure
    this.analyzeURLStructure(pages, issues);

    // Internal Linking
    this.analyzeInternalLinking(pages, issues);

    // Schema Markup
    this.analyzeSchema(pages, issues);

    // Open Graph Tags
    this.analyzeOpenGraph(pages, issues);

    // Sitemaps are checked properly by the technical module, which fetches them.

    // Alt Tags
    this.analyzeAltTags(pages, issues);

    // Document basics: doctype, character set, meta refresh, obsolete tags
    this.analyzeDoctype(pages, issues);
    this.analyzeCharset(pages, issues);
    this.analyzeMetaRefresh(pages, issues);
    this.analyzeDeprecatedHtml(pages, issues);

    // Do the words the homepage uses most appear in its title?
    this.analyzeKeywordUsage(pages, issues);

    // Robots nofollow
    this.analyzeNofollow(pages, issues);

    // These are reported by another module that checks them across the whole
    // crawl, so reporting them here as well counted one problem twice:
    // duplicate titles and descriptions, missing canonicals, long URLs and
    // URL parameters (technical module), skipped heading levels (accessibility,
    // which walks the real heading order).
    const reportedElsewhere = ['duplicate_title_', 'duplicate_meta_', 'missing_canonical_', 'long_url_', 'query_params_', 'heading_hierarchy_'];
    const own = issues.filter((i) => !reportedElsewhere.some((prefix) => i.id.startsWith(prefix)));
    issues.length = 0;
    issues.push(...own);

    // Calculate score
    const totalChecks = 25;
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

  private analyzeTitle(pages: PageData[], issues: AuditIssue[]): void {
    const titles = new Map<string, string[]>();

    pages.forEach((page) => {
      const title = (page.title || page.meta.title || '').trim();
      const url = page.url;

      if (page.titleCount > 1) {
        issues.push({
          id: `multiple_title_${url}`,
          category: 'seo',
          type: 'missing_title',
          severity: 'medium',
          title: 'More than one <title> tag',
          description: `The page at ${url} has ${page.titleCount} <title> tags in its <head>. Browsers and search engines use only one of them, and which one is not guaranteed.`,
          impact: 'Search engines may show a title you did not intend. This usually happens when a theme, a plugin and a framework each add their own title.',
          suggestion: 'Keep exactly one <title> in the <head>. Check your layout, SEO plugin and framework metadata settings for the extra one.',
          url,
          priority: 6,
          affectedUrls: [url],
          timeToFix: '10 minutes',
          difficulty: 'easy',
        });
      }

      if (!title) {
        issues.push({
          id: `missing_title_${url}`,
          category: 'seo',
          type: 'missing_title',
          severity: 'high',
          title: 'Missing Page Title',
          description: `The page at ${url} has no title tag.`,
          impact: 'The title is the main clickable line of your search result and one of the strongest clues to what the page is about. Without one, Google has to make a title up from the page.',
          suggestion: 'Add a unique, descriptive title that says what the page is about, ideally around 30 to 60 characters.',
          url,
          priority: 10,
          affectedUrls: [url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no <title> found...</head>', selector: 'head' }],
          codeSnippet: '<head>\n  <meta charset="UTF-8">\n  <!-- MISSING: <title>Your Page Title</title> -->\n</head>',
          fixInstructions: [
            { step: 1, title: 'Open the page HTML', description: `Edit the HTML file or template for ${url}` },
            { step: 2, title: 'Add title tag', description: 'Inside the <head> section, add: <title>Main Topic | Brand Name</title>' },
            { step: 3, title: 'Keep it short enough to show in full', description: 'Google cuts titles by pixel width (about 580px on desktop), which is roughly 50 to 60 characters.' }
          ],
          timeToFix: '2 minutes',
          difficulty: 'easy',
        });
      } else {
        titles.set(title, [...(titles.get(title) || []), url]);

        const estimatedPx = Math.round(title.length * TITLE_PX_PER_CHAR);

        // Check title length
        if (title.length < 15) {
          issues.push({
            id: `short_title_${url}`,
            category: 'seo',
            type: 'missing_title',
            severity: 'low',
            title: 'Title Too Short',
            description: `The title "${title}" is only ${title.length} characters.`,
            impact: 'A very short title gives searchers little reason to click and gives Google little context about the page.',
            suggestion: 'Describe the page in a few more words, for example the main topic followed by your brand name.',
            url,
            priority: 4,
          });
        } else if (estimatedPx > TITLE_MAX_PX) {
          issues.push({
            id: `long_title_${url}`,
            category: 'seo',
            type: 'missing_title',
            severity: 'low',
            title: 'Title May Be Cut Short in Search Results',
            description: `The title is ${title.length} characters, roughly ${estimatedPx}px wide in Google's desktop results.`,
            impact: 'Google cuts titles by pixel width (about 580px) and may rewrite them. The end of this title may not show.',
            suggestion: 'Put the most important words first so they show even if the end is cut. Shorten it if the ending matters.',
            url,
            priority: 3,
            affectedUrls: [url],
            affectedElements: [{ tag: 'title', attributes: {}, outerHTML: `<title>${title.substring(0, 40)}...</title>`, selector: 'title' }],
            codeSnippet: `<title>${title}</title>`,
            fixInstructions: [
              { step: 1, title: 'Identify the key message', description: 'Decide what the page is about in a few words.' },
              { step: 2, title: 'Rewrite the title', description: 'Lead with that message and keep it to about 50 to 60 characters. Example: "Main Topic | Brand"' }
            ],
            timeToFix: '2 minutes',
            difficulty: 'easy',
          });
        }
      }
    });

    // Check for duplicate titles
    titles.forEach((urls, title) => {
      if (urls.length > 1) {
        issues.push({
          id: `duplicate_title_${title.substring(0, 20)}`,
          category: 'seo',
          type: 'duplicate_title',
          severity: 'high',
          title: 'Duplicate Page Titles',
          description: `${urls.length} pages share the same title: "${title.substring(0, 50)}..."`,
          impact: 'When several pages share a title, searchers cannot tell them apart and Google has a harder time picking the right page for a query. Google may also rewrite the titles.',
          suggestion: 'Give each page a unique title that reflects its own content.',
          element: urls.join(', '),
          priority: 8,
          affectedUrls: urls,
          affectedElements: urls.map(() => ({ tag: 'title', attributes: {}, outerHTML: `<title>${title.substring(0, 30)}...</title>`, selector: 'title' })),
          codeSnippet: `<title>${title}</title>`,
          fixInstructions: [
            { step: 1, title: 'Identify each page\'s unique value', description: 'Decide what makes each page different and what a searcher would look for to find it.' },
            { step: 2, title: 'Rewrite each title', description: 'Example: "Services" → "Web Design Services in Austin | YourBrand" vs "Pricing" → "Web Design Pricing | YourBrand"' }
          ],
          timeToFix: '10 minutes',
          difficulty: 'easy',
        });
      }
    });
  }

  private analyzeMetaDescription(pages: PageData[], issues: AuditIssue[]): void {
    const descriptions = new Map<string, string[]>();

    pages.forEach((page, index) => {
      const description = page.meta.description?.trim() || '';
      const url = page.url;
      const isHome = index === 0;

      if (!description) {
        issues.push({
          id: `missing_meta_${url}`,
          category: 'seo',
          type: 'missing_meta_description',
          severity: isHome ? 'medium' : 'low',
          title: 'Missing Meta Description',
          description: `The page at ${url} has no meta description tag.`,
          impact: 'Google often uses the meta description as the snippet under your result. Without one, it picks text from the page, which may be less useful to searchers. It is not a ranking factor.',
          suggestion: 'Write a short, accurate summary of the page, about 120 to 160 characters, that tells searchers what they will get.',
          url,
          priority: isHome ? 6 : 4,
          affectedUrls: [url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no meta description found...</head>', selector: 'head' }],
          codeSnippet: '<head>\n  <meta charset="UTF-8">\n  <!-- MISSING: <meta name="description" content="..."> -->\n</head>',
          fixInstructions: [
            { step: 1, title: 'Write a clear description', description: 'Say what the page offers and why it is useful, in plain words. Keep it to about 120 to 160 characters.' },
            { step: 2, title: 'Add the meta tag', description: '<meta name="description" content="Learn how our web design services help Austin businesses grow. Free consultation.">' }
          ],
          timeToFix: '3 minutes',
          difficulty: 'easy',
        });
      } else {
        descriptions.set(description, [...(descriptions.get(description) || []), url]);

        // Check description length
        if (description.length < 50) {
          issues.push({
            id: `short_meta_${url}`,
            category: 'seo',
            type: 'missing_meta_description',
            severity: 'low',
            title: 'Meta Description Too Short',
            description: `The meta description is only ${description.length} characters.`,
            impact: 'A very short description may not tell searchers enough, so Google is more likely to replace it with text from the page.',
            suggestion: 'Expand it into one or two full sentences that summarise the page.',
            url,
            priority: 3,
          });
        } else if (description.length > 160) {
          issues.push({
            id: `long_meta_${url}`,
            category: 'seo',
            type: 'missing_meta_description',
            severity: 'low',
            title: 'Meta Description May Be Cut Short',
            description: `The meta description is ${description.length} characters.`,
            impact: 'This is not an error. Google cuts snippets by pixel width (around 920px on desktop, roughly 150 to 160 characters) and often rewrites them anyway, so the end may not show.',
            suggestion: 'Put the most useful information in the first 150 characters.',
            url,
            priority: 2,
          });
        }
      }
    });

    // Check for duplicate descriptions
    descriptions.forEach((urls, description) => {
      if (urls.length > 1) {
        issues.push({
          id: `duplicate_meta_${description.substring(0, 20)}`,
          category: 'seo',
          type: 'duplicate_meta_description',
          severity: 'medium',
          title: 'Duplicate Meta Descriptions',
          description: `${urls.length} pages share the same meta description.`,
          impact: 'Identical snippets make your results look the same, so searchers cannot tell which page fits what they want.',
          suggestion: 'Write a unique description for each page.',
          element: urls.join(', '),
          priority: 5,
        });
      }
    });
  }

  private analyzeHeadings(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const url = page.url;
      const h1s = page.meta.h1.filter((text) => text.trim() !== '');
      const h1Count = h1s.length;

      // Check for missing H1
      if (h1Count === 0) {
        issues.push({
          id: `missing_h1_${url}`,
          category: 'seo',
          type: 'missing_h1',
          severity: 'medium',
          title: 'Missing H1 Tag',
          description: `The page at ${url} has no H1 heading with text.`,
          impact: 'A clear main heading tells visitors and screen reader users what the page is about, and it is one of the clues Google uses to understand the topic.',
          suggestion: 'Add a main H1 heading near the top of the content that describes the page topic in plain words.',
          url,
          priority: 6,
          affectedUrls: [url],
          affectedElements: [{ tag: 'body', attributes: {}, outerHTML: '<body>...no <h1> found...</body>', selector: 'body' }],
          codeSnippet: '<!-- MISSING -->\n<h1>Your Main Topic Heading</h1>\n<p>Your content starts here...</p>',
          fixInstructions: [
            { step: 1, title: 'Identify the main topic', description: 'What is the single most important topic of this page?' },
            { step: 2, title: 'Write an H1', description: 'Add <h1>Main Topic</h1> as the first heading in your content area.' },
            { step: 3, title: 'Keep it natural', description: 'Write it for people first. Use the words a searcher would use, without forcing keywords in.' }
          ],
          timeToFix: '3 minutes',
          difficulty: 'easy',
        });
      }

      // Check for multiple H1s
      if (h1Count > 1) {
        issues.push({
          id: `multiple_h1_${url}`,
          category: 'seo',
          type: 'multiple_h1',
          severity: 'low',
          title: 'Multiple H1 Tags',
          description: `The page has ${h1Count} H1 tags: ${h1s.slice(0, 3).join(', ')}${h1Count > 3 ? '...' : ''}`,
          impact: 'Multiple H1s are fine for Google. For people, one clear main heading makes the page easier to scan and easier to follow with a screen reader.',
          suggestion: 'Keep one clear main heading for people. If the other H1s are really section titles, consider making them H2s.',
          url,
          priority: 2,
          affectedUrls: [url],
          affectedElements: h1s.map((text, i) => ({ tag: 'h1', attributes: {}, outerHTML: `<h1>${text.substring(0, 40)}${text.length > 40 ? '...' : ''}</h1>`, selector: `h1:nth-of-type(${i + 1})` })),
          codeSnippet: `<h1>${h1s[0]}</h1>\n<h1>${h1s[1] || 'Second H1'}</h1>\n<!-- Optional: change the second H1 to an H2 -->`,
          fixInstructions: [
            { step: 1, title: 'Pick the main heading', description: 'Decide which H1 best describes the whole page.' },
            { step: 2, title: 'Review the others', description: 'If another H1 introduces a section, an H2 usually reads better.' }
          ],
          timeToFix: '5 minutes',
          difficulty: 'easy',
        });
      }

      // Check heading hierarchy
      const hasH2 = page.meta.h2.length > 0;
      const hasH3 = page.meta.h3.length > 0;

      if (h1Count > 0 && !hasH2 && hasH3) {
        issues.push({
          id: `heading_hierarchy_${url}`,
          category: 'seo',
          type: 'heading_hierarchy',
          severity: 'medium',
          title: 'Skipped Heading Level',
          description: 'H3 tags found without H2 tags.',
          impact: 'Skipping heading levels makes the outline harder to follow for screen reader users.',
          suggestion: 'Use H2 before H3 to keep a logical heading order.',
          url,
          priority: 4,
        });
      }
    });
  }

  private analyzeCanonical(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      // A noindex page does not need a canonical: it is not meant to be indexed at all.
      if (robotsFlags(page).noindex) return;
      if (!page.meta.canonical?.trim()) {
        issues.push({
          id: `missing_canonical_${page.url}`,
          category: 'seo',
          type: 'missing_canonical',
          severity: 'medium',
          title: 'Missing Canonical URL',
          description: `The page at ${page.url} has no canonical tag.`,
          impact: 'When the same page can be reached at several addresses (with or without www, with tracking parameters), Google picks the main one itself. A self referencing canonical makes your choice clear and keeps ranking signals on one URL. There is no penalty for duplicate URLs.',
          suggestion: 'Add a canonical tag that points to the preferred address of this page.',
          url: page.url,
          priority: 5,
          affectedUrls: [page.url],
          affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no canonical link found...</head>', selector: 'head' }],
          codeSnippet: '<!-- ADD THIS -->\n<link rel="canonical" href="https://example.com/page-url" />',
          fixInstructions: [
            { step: 1, title: 'Determine the preferred URL', description: 'Use HTTPS, and whichever host (with or without www) and trailing slash style you use consistently across the site.' },
            { step: 2, title: 'Add the canonical tag', description: 'Place <link rel="canonical" href="PREFERRED_URL" /> inside <head>.' }
          ],
          timeToFix: '2 minutes',
          difficulty: 'easy',
        });
      }
    });
  }

  private analyzeRobots(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page, index) => {
      const flags = robotsFlags(page);
      if (!flags.noindex) return;

      const isHome = index === 0;
      const where = flags.sources.join(' and ');
      issues.push({
        id: isHome ? 'noindex_home' : `noindex_page_${page.url}`,
        category: 'seo',
        type: 'url_structure',
        severity: isHome ? 'critical' : 'medium',
        title: isHome ? 'Homepage Blocked from Indexing' : 'Page Blocked from Indexing',
        description: `${page.url} carries a noindex directive in the ${where}.`,
        impact: isHome
          ? 'Google will drop the homepage from search results. This is almost never intended on a live site.'
          : 'This page will not appear in Google search results. If this is intentional, ignore it.',
        suggestion: isHome
          ? 'Remove noindex (or "none") from the meta robots tag, the meta googlebot tag and the X-Robots-Tag header. Check SEO plugin settings and any "discourage search engines" option left on from staging.'
          : 'If this page should be found in Google, remove noindex from the meta robots tag, the meta googlebot tag and the X-Robots-Tag header. If this is intentional, ignore it.',
        url: page.url,
        priority: isHome ? 10 : 5,
        affectedUrls: [page.url],
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    });
  }

  private analyzeURLStructure(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      let url: URL;
      try {
        url = new URL(page.url);
      } catch {
        return;
      }
      const path = url.pathname;

      // Check for URL length
      if (path.length > 100) {
        issues.push({
          id: `long_url_${page.url}`,
          category: 'seo',
          type: 'url_structure',
          severity: 'low',
          title: 'Long URL Structure',
          description: `URL path is ${path.length} characters: ${path.substring(0, 50)}...`,
          impact: 'Very long URLs are harder to read and share.',
          suggestion: 'Use short, descriptive slugs for new pages. Do not change live URLs just to shorten them.',
          url: page.url,
          priority: 2,
        });
      }

      // Check for query parameters
      if (url.search.length > 0 && !url.search.includes('?page=')) {
        issues.push({
          id: `query_params_${page.url}`,
          category: 'seo',
          type: 'url_structure',
          severity: 'low',
          title: 'URL Contains Query Parameters',
          description: `URL has query parameters: ${url.search}`,
          impact: 'URLs with many parameters can create several addresses for the same content.',
          suggestion: 'Use clean URLs where you can, and point the canonical at the clean version.',
          url: page.url,
          priority: 2,
        });
      }

      // Check for underscores in URL
      if (path.includes('_')) {
        issues.push({
          id: `underscore_url_${page.url}`,
          category: 'seo',
          type: 'url_structure',
          severity: 'low',
          title: 'URL Contains Underscores',
          description: 'URL path contains underscores instead of hyphens.',
          impact: 'Google recommends hyphens to separate words in URLs, because it reads them as word breaks.',
          suggestion: 'Use hyphens (-) instead of underscores (_) in new URLs. Do not change live URLs just for this; if you do, add 301 redirects.',
          url: page.url,
          priority: 1,
        });
      }
    });
  }

  private analyzeInternalLinking(pages: PageData[], issues: AuditIssue[]): void {
    // Only a handful of pages are crawled, all found through homepage links, so
    // orphan pages cannot be measured here. Only the link count per page is.
    let totalInternalLinks = 0;

    pages.forEach((page) => {
      page.links.forEach((link) => {
        if (link.isInternal) {
          totalInternalLinks++;
        }
      });
    });

    const avgLinksPerPage = pages.length > 0 ? totalInternalLinks / pages.length : 0;

    if (avgLinksPerPage < 3) {
      issues.push({
        id: 'low_internal_links',
        category: 'seo',
        type: 'internal_linking',
        severity: 'medium',
        title: 'Low Internal Linking',
        description: `Average of ${avgLinksPerPage.toFixed(1)} internal links per page.`,
        impact: 'Internal links help discovery and show which pages matter.',
        suggestion: 'Add more internal links to connect related pages and improve navigation.',
        priority: 5,
      });
    }
  }

  private analyzeSchema(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];

    if (!mainPage || mainPage.structured_data.length === 0) {
      issues.push({
        id: 'missing_schema',
        category: 'seo',
        type: 'missing_schema',
        severity: 'medium',
        title: 'No Structured Data Found',
        description: 'No JSON-LD or microdata structured data was detected on the main page.',
        impact: 'Structured data helps search engines understand your content and makes some pages eligible for rich results.',
        suggestion: 'Add relevant schema markup (Organization, LocalBusiness, Article, etc.) that matches what the page shows.',
        url: mainPage?.url,
        priority: 5,
      });
    }
  }

  private analyzeOpenGraph(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];

    if (!mainPage) return;

    if (!mainPage.meta.ogTitle) {
      issues.push({
        id: 'missing_og_title',
        category: 'seo',
        type: 'missing_og_tags',
        severity: 'low',
        title: 'Missing Open Graph Title',
        description: 'No og:title tag found on the main page.',
        impact: 'When the page is shared on Facebook, LinkedIn or X, the platform has to guess the title, so the preview may look wrong.',
        suggestion: 'Add og:title, og:description, and og:image meta tags for better social sharing.',
        url: mainPage.url,
        priority: 4,
        affectedUrls: [mainPage.url],
        affectedElements: [{ tag: 'head', attributes: {}, outerHTML: '<head>...no og:title found...</head>', selector: 'head' }],
        codeSnippet: '<meta property="og:title" content="Your Compelling Title Here" />\n<meta property="og:description" content="Brief description for social sharing" />\n<meta property="og:image" content="https://example.com/og-image.jpg" />',
        fixInstructions: [
          { step: 1, title: 'Add og:title', description: 'Add <meta property="og:title" content="Your Title"> to <head>.' },
          { step: 2, title: 'Add og:description', description: 'Add a clear description of one or two sentences.' },
          { step: 3, title: 'Add og:image', description: 'Use a 1200x630px image for the best display.' }
        ],
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    if (!mainPage.meta.ogDescription) {
      issues.push({
        id: 'missing_og_description',
        category: 'seo',
        type: 'missing_og_tags',
        severity: 'low',
        title: 'Missing Open Graph Description',
        description: 'No og:description tag found on the main page.',
        impact: 'Shared links may not show a description on social platforms.',
        suggestion: 'Add an og:description tag to control how your content appears when shared.',
        url: mainPage.url,
        priority: 3,
      });
    }

    if (!mainPage.meta.ogImage) {
      issues.push({
        id: 'missing_og_image',
        category: 'seo',
        type: 'missing_og_tags',
        severity: 'low',
        title: 'Missing Open Graph Image',
        description: 'No og:image tag found on the main page.',
        impact: 'Shared links will not display an image preview on social platforms.',
        suggestion: 'Add an og:image tag with a relevant, high quality image (1200x630 recommended).',
        url: mainPage.url,
        priority: 4,
      });
    }
  }

  private analyzeAltTags(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const decorative = decorativeImageSources(page.html || '');
      const imagesWithoutAlt = page.images.filter((img) => {
        // alt="" is the correct markup for a decorative image. Only a missing attribute is a problem.
        if (img.alt !== undefined) return false;
        // Tracking pixels are not content.
        if ((img.width !== undefined && img.width <= 2) || (img.height !== undefined && img.height <= 2)) return false;
        if (img.src && TRACKING_PIXEL_PATTERN.test(img.src)) return false;
        // Marked decorative with role="presentation" or aria-hidden="true".
        if (img.src && decorative.has(img.src)) return false;
        return true;
      });

      if (imagesWithoutAlt.length > 0) {
        const severity = imagesWithoutAlt.length > 2 ? 'medium' : 'low';
        const count = imagesWithoutAlt.length;

        issues.push({
          id: `missing_alt_${page.url}`,
          category: 'seo',
          type: 'missing_alt_text',
          severity,
          title: 'Images Missing Alt Text',
          description: `${count} image${count > 1 ? 's' : ''} on ${page.url} ${count > 1 ? 'have' : 'has'} no alt attribute at all.`,
          impact: 'Screen reader users get nothing useful, or the file name, for these images, and search engines have less to go on for image search.',
          suggestion: 'Add descriptive alt text to meaningful images. Use an empty alt="" for decorative images.',
          url: page.url,
          priority: severity === 'medium' ? 5 : 3,
          affectedUrls: [page.url],
          affectedElements: imagesWithoutAlt.slice(0, 5).map((img) => ({
            tag: 'img',
            attributes: { src: img.src || '' },
            outerHTML: `<img src="${img.src || ''}"${img.width ? ` width="${img.width}"` : ''}${img.height ? ` height="${img.height}"` : ''} />`,
            selector: `img[src="${img.src}"]`,
          })),
          codeSnippet: imagesWithoutAlt.slice(0, 3).map(img => `<img src="${img.src}" alt="ADD DESCRIPTIVE TEXT HERE" />`).join('\n'),
          fixInstructions: [
            { step: 1, title: 'Identify meaningful images', description: 'Decorative images (borders, backgrounds) should use alt="".' },
            { step: 2, title: 'Write descriptive alt text', description: 'Describe what the image shows. Example: "Team meeting in modern office" not "image1.jpg".' },
            { step: 3, title: 'Add alt attributes', description: 'Update each <img> tag with appropriate alt text.' }
          ],
          timeToFix: `${Math.max(2, Math.ceil(count * 0.5))} minutes`,
          difficulty: 'easy',
        });
      }
    });
  }

  /** The doctype must come first. Only a BOM, whitespace, comments and an XML declaration may come before it. */
  private analyzeDoctype(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const html = page.html || '';
      if (!html.trim()) return;

      let rest = html.replace(/^\uFEFF/, '');
      for (;;) {
        const before = rest;
        rest = rest.replace(/^\s+/, '').replace(/^<!--[\s\S]*?-->/, '').replace(/^<\?xml\b[^>]*\?>/i, '');
        if (rest === before) break;
      }
      if (/^<!doctype\s+html\b/i.test(rest)) return;

      const firstLine = rest.split(/\r?\n/)[0].slice(0, 120);
      issues.push({
        id: `no_doctype_${page.url}`,
        category: 'seo',
        type: 'missing_doctype',
        severity: 'medium',
        title: 'Missing HTML Doctype',
        description: `The HTML of ${page.url} does not start with <!DOCTYPE html>.${firstLine ? ` It starts with: ${firstLine}` : ''}`,
        impact: 'Without a doctype, browsers fall back to quirks mode, an old compatibility mode that can change how sizes, spacing and tables are drawn. The page may look different from browser to browser.',
        suggestion: 'Put <!DOCTYPE html> as the very first line of the page, before the <html> tag.',
        url: page.url,
        priority: 5,
        affectedUrls: [page.url],
        codeSnippet: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="utf-8">\n    ...',
        fixInstructions: [
          { step: 1, title: 'Open the main layout or template', description: 'Find the file that writes the opening <html> tag for this page. In most sites this is one shared layout.' },
          { step: 2, title: 'Add the doctype', description: 'Put <!DOCTYPE html> on the very first line, with nothing but whitespace or comments before it.' },
          { step: 3, title: 'Check the layout', description: 'Open the page in a browser afterwards. Pages built in quirks mode sometimes shift a little once standards mode is on.' }
        ],
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    });
  }

  /** A charset can come from <meta charset>, <meta http-equiv="Content-Type"> or the Content-Type header. */
  private analyzeCharset(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const metaCharset = $('meta[charset]').filter((_, el) => ($(el).attr('charset') || '').trim() !== '').length > 0;
      const httpEquiv = $('meta[http-equiv]').filter((_, el) =>
        ($(el).attr('http-equiv') || '').trim().toLowerCase() === 'content-type' &&
        /charset\s*=/i.test($(el).attr('content') || '')
      ).length > 0;
      const header = /charset\s*=/i.test(page.headers['content-type'] || page.contentType || '');
      if (metaCharset || httpEquiv || header) return;

      issues.push({
        id: `no_charset_${page.url}`,
        category: 'seo',
        type: 'missing_charset',
        severity: 'low',
        title: 'Character Encoding Not Declared',
        description: `${page.url} does not say which character encoding it uses: there is no <meta charset> tag and the Content-Type header has no charset.`,
        impact: 'Browsers then have to guess the encoding. A wrong guess turns accented letters, quotes and symbols into strange characters.',
        suggestion: 'Add <meta charset="utf-8"> as the first tag inside <head>, or send "Content-Type: text/html; charset=utf-8" from the server. Doing both is fine.',
        url: page.url,
        priority: 3,
        affectedUrls: [page.url],
        codeSnippet: '<head>\n  <meta charset="utf-8">\n  <title>...</title>\n</head>',
        fixInstructions: [
          { step: 1, title: 'Add the meta tag', description: 'Put <meta charset="utf-8"> as the first element in <head>. It must sit within the first 1024 bytes of the page.' },
          { step: 2, title: 'Or set the header', description: 'Configure the server to send Content-Type: text/html; charset=utf-8 for HTML pages.' }
        ],
        timeToFix: '2 minutes',
        difficulty: 'easy',
      });
    });
  }

  private analyzeMetaRefresh(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const tag = $('meta[http-equiv]').filter((_, el) => ($(el).attr('http-equiv') || '').trim().toLowerCase() === 'refresh').first();
      if (tag.length === 0) return;

      const content = tag.attr('content') || '';
      const m = content.match(/^\s*(\d*(?:\.\d+)?)\s*(?:[;,]\s*)?([\s\S]*)$/);
      const seconds = m && m[1] ? Math.floor(parseFloat(m[1])) : 0;
      let target = (m ? m[2] : '').trim().replace(/^url\s*=\s*/i, '').trim();
      const quote = target.charAt(0);
      if (quote === '"' || quote === "'") {
        const end = target.indexOf(quote, 1);
        target = end === -1 ? target.slice(1) : target.slice(1, end);
      }
      target = target.trim();
      const secondsText = `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
      const outerHTML = $.html(tag).slice(0, 300);

      issues.push({
        id: `meta_refresh_${page.url}`,
        category: 'seo',
        type: 'meta_refresh',
        severity: 'medium',
        title: target ? 'Page Redirects with a Meta Refresh' : 'Page Reloads Itself with a Meta Refresh',
        description: target
          ? `${page.url} uses a meta refresh tag to send visitors to ${target} after ${secondsText}.`
          : `${page.url} uses a meta refresh tag that reloads the page every ${secondsText}.`,
        impact: target
          ? 'Google does follow meta refresh redirects, but a server redirect is faster, works for every crawler and tool, and makes it clear which address should rank. A delayed redirect can also send people away before they have finished reading.'
          : 'Reloading on a timer can throw away what someone is reading or typing, and it is hard to follow with a screen reader. Search engines get nothing from it.',
        suggestion: target
          ? `Replace the meta refresh with a 301 redirect from the server to ${target}, and update links that point to the old address.`
          : 'Remove the meta refresh. If part of the page needs fresh data, update just that part with JavaScript instead of reloading the whole page.',
        url: page.url,
        priority: 5,
        affectedUrls: [page.url],
        affectedElements: [{
          tag: 'meta',
          attributes: { ...(tag.attr() || {}) },
          outerHTML,
          selector: 'meta[http-equiv="refresh"]',
        }],
        codeSnippet: target
          ? `<!-- BEFORE -->\n${outerHTML}\n\n# AFTER: a server redirect, for example in nginx\nlocation = ${(() => { try { return new URL(page.url).pathname; } catch { return '/old-page'; } })()} {\n  return 301 ${target};\n}`
          : `<!-- REMOVE -->\n${outerHTML}`,
        fixInstructions: target
          ? [
              { step: 1, title: 'Set up a server redirect', description: 'Add a 301 redirect from this address to the new one in your host, CDN, framework config or .htaccess file.' },
              { step: 2, title: 'Remove the meta tag', description: 'Delete the <meta http-equiv="refresh"> tag once the server redirect works.' },
              { step: 3, title: 'Update links', description: 'Point menus, internal links and the sitemap straight at the new address.' }
            ]
          : [
              { step: 1, title: 'Remove the meta tag', description: 'Delete the <meta http-equiv="refresh"> tag from the page or template.' },
              { step: 2, title: 'Refresh only what changes', description: 'If a price, score or feed needs to stay current, fetch new data for that part of the page with JavaScript.' }
            ],
        timeToFix: '15 minutes',
        difficulty: 'easy',
      });
    });
  }

  private analyzeDeprecatedHtml(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const $ = this.doc(page);
      const counts: { tag: string; count: number }[] = [];
      const samples: { tag: string; outerHTML: string }[] = [];

      for (const tag of OBSOLETE_ELEMENTS) {
        // <font> also exists inside SVG, where it is not the obsolete HTML element.
        const found = $(tag).filter((_, el) => $(el).closest('svg').length === 0);
        if (found.length === 0) continue;
        counts.push({ tag, count: found.length });
        found.slice(0, 2).each((_, el) => {
          if (samples.length < 5) samples.push({ tag, outerHTML: $.html(el).slice(0, 200) });
        });
      }

      const total = counts.reduce((sum, c) => sum + c.count, 0);
      if (total < 1) return;

      counts.sort((a, b) => b.count - a.count);
      const listed = counts.slice(0, 6).map((c) => `<${c.tag}> (${c.count})`).join(', ');
      issues.push({
        id: `deprecated_html_${page.url}`,
        category: 'seo',
        type: 'deprecated_html',
        severity: 'low',
        title: 'Obsolete HTML Elements',
        description: `We found ${total} obsolete HTML ${total === 1 ? 'element' : 'elements'} on ${page.url}: ${listed}${counts.length > 6 ? ' and more' : ''}.`,
        impact: 'These elements were removed from the HTML standard. Browsers still show most of them, so this is rarely urgent, but they mix styling into the content, can behave differently between browsers, and usually point to old templates or pasted content.',
        suggestion: 'Replace them with CSS or modern elements. For example, <center> becomes CSS text-align, <font> becomes CSS, <big> becomes CSS font-size, <tt> becomes <code> or <kbd>, <acronym> becomes <abbr>, and <strike> becomes <s> or <del>.',
        url: page.url,
        priority: 2,
        affectedUrls: [page.url],
        affectedElements: samples.map((s) => ({ tag: s.tag, attributes: {}, outerHTML: s.outerHTML, selector: s.tag })),
        codeSnippet: '<!-- BEFORE -->\n<center><font color="red" size="5">Sale</font></center>\n\n<!-- AFTER -->\n<p class="sale">Sale</p>\n<style>.sale { text-align: center; color: red; font-size: 1.5rem; }</style>',
        fixInstructions: [
          { step: 1, title: 'Find where they come from', description: 'Search your templates, theme and saved page content for these tags. Old page builders and content pasted from word processors are common sources.' },
          ...counts.slice(0, 6).map((c, i) => ({ step: i + 2, title: `Replace <${c.tag}>`, description: OBSOLETE_REPLACEMENTS[c.tag] })),
        ],
        timeToFix: '30 minutes',
        difficulty: 'easy',
      });
    });
  }

  /**
   * A plain word count on the homepage: do the words it uses most show up in
   * the title? This is not keyword research, only a sanity check that the
   * title matches what the page talks about.
   */
  private analyzeKeywordUsage(pages: PageData[], issues: AuditIssue[]): void {
    const home = pages[0];
    if (!home) return;
    const lang = (home.meta.lang || '').trim().toLowerCase();
    if (lang && !lang.startsWith('en')) return;

    const text = (home.mainText || '').trim() || home.text || '';
    const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length < 150) return;
    // Many non English sites keep the default lang="en". English text is full
    // of short function words; when they make up little of the page, skip.
    const english = tokens.filter((t) => ENGLISH_MARKERS.has(t.replace(/[^\p{L}']/gu, ''))).length;
    if (english / tokens.length < 0.15) return;

    const title = (home.title || home.meta.title || '').trim();
    // A missing title is reported on its own.
    if (!title) return;

    const freq = new Map<string, number>();
    for (const w of contentWords(text)) freq.set(w, (freq.get(w) || 0) + 1);
    // Map keeps first appearance order, and sort is stable, so ties keep page order.
    const main = [...freq.entries()]
      .filter(([, n]) => n >= 3)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    if (main.length < 3) return;

    const top3 = main.slice(0, 3).map(([w]) => w);
    if (top3.some((w) => containsWord(title, w))) return;

    const description = (home.meta.description || '').trim();
    const h1 = home.meta.h1.find((t) => t.trim() !== '')?.trim() || '';
    const inDescription = top3.filter((w) => containsWord(description, w));
    const inH1 = top3.filter((w) => containsWord(h1, w));

    const descriptionSentence = !description
      ? 'The page has no meta description.'
      : inDescription.length > 0
        ? `The meta description uses ${joinWords(inDescription)}.`
        : 'The meta description does not use them either.';
    const h1Sentence = !h1
      ? 'The page has no H1 heading.'
      : inH1.length > 0
        ? `The main H1 heading uses ${joinWords(inH1)}.`
        : 'The main H1 heading does not use them either.';

    issues.push({
      id: 'keyword_usage',
      category: 'seo',
      type: 'keyword_usage',
      severity: 'low',
      title: 'Homepage Title Does Not Use Its Most Common Words',
      description: `The words that appear most on your homepage are: ${main.map(([w, n]) => `${w} (${n})`).join(', ')}. None of the top three appear in the title tag. ${descriptionSentence} ${h1Sentence}`,
      impact: 'The title is the strongest on page hint about what a page is about. When the words the page uses most are missing from it, the title may not match what people search for. This can be fine for a brand name page, and it is a simple word count, not keyword research.',
      suggestion: `If ${joinWords(top3)} describe what you offer, work the most important one into the title in a natural way, for example "Main Topic | Brand". If they are just words the page happens to repeat, ignore this.`,
      url: home.url,
      priority: 3,
      affectedUrls: [home.url],
      affectedElements: [{ tag: 'title', attributes: {}, outerHTML: `<title>${title.slice(0, 120)}</title>`, selector: 'title' }],
      codeSnippet: `<!-- NOW -->\n<title>${title.slice(0, 120)}</title>\n\n<!-- IDEA -->\n<title>${top3[0].charAt(0).toUpperCase()}${top3[0].slice(1)} ... | Your Brand</title>`,
      fixInstructions: [
        { step: 1, title: 'Decide what the homepage should rank for', description: 'Pick the one or two phrases a new visitor would type to find you. A keyword tool or Google Search Console will tell you more than this word count.' },
        { step: 2, title: 'Check the title', description: 'Put the most important phrase near the start of the title, followed by your brand name. Keep it readable.' },
        { step: 3, title: 'Line up the H1 and description', description: 'Use the same words, naturally, in the main heading and the meta description so all three tell the same story.' }
      ],
      timeToFix: '10 minutes',
      difficulty: 'easy',
    });
  }

  /** nofollow, or "none", in meta robots, meta googlebot or the X-Robots-Tag header. */
  private analyzeNofollow(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page, index) => {
      const flags = robotsFlags(page);
      if (!flags.nofollow) return;
      // A noindex page is already reported, and its links matter less once the page is out of Google.
      if (flags.noindex) return;

      const isHome = index === 0;
      const where = flags.nofollowSources.join(' and ');
      issues.push({
        id: `nofollow_${page.url}`,
        category: 'seo',
        type: 'nofollow',
        severity: isHome ? 'medium' : 'low',
        title: isHome ? 'Homepage Tells Search Engines Not to Follow Its Links' : 'Page Tells Search Engines Not to Follow Its Links',
        description: `${page.url} carries a nofollow directive in the ${where}.${flags.viaNone ? ' The value "none" means noindex and nofollow together.' : ''}`,
        impact: isHome
          ? 'Google does not follow the links on this page, so pages that are linked only from the homepage may not be discovered, and the homepage passes no signals to the rest of the site.'
          : 'Google does not follow the links on this page, so pages linked only from here may not be discovered. If this is intentional, ignore it.',
        suggestion: 'If search engines should follow the links on this page, remove nofollow (and "none") from the meta robots tag, the meta googlebot tag and the X-Robots-Tag header. To hold back a single link, use rel="nofollow" on that link instead.',
        url: page.url,
        priority: isHome ? 6 : 3,
        affectedUrls: [page.url],
        codeSnippet: '<!-- BEFORE -->\n<meta name="robots" content="index, nofollow">\n\n<!-- AFTER -->\n<meta name="robots" content="index, follow">\n<!-- or remove the tag: index, follow is the default -->',
        fixInstructions: [
          { step: 1, title: 'Find where it is set', description: 'Check the meta robots and meta googlebot tags in the page source, and the X-Robots-Tag header in your server, CDN or framework config.' },
          { step: 2, title: 'Check SEO plugin settings', description: 'Plugins and staging settings often add nofollow to whole sections of a site.' },
          { step: 3, title: 'Remove the directive', description: 'Delete nofollow, or the tag altogether, since following links is the default.' }
        ],
        timeToFix: '5 minutes',
        difficulty: 'easy',
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
      category: 'seo',
      score: Math.min(100, Math.max(0, score)),
      maxScore,
      issues,
      criticalIssues: 0, // Will be counted separately
      passed,
      failed: maxScore - passed,
    };
  }
}
