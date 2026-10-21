// Security Audit Module
//
// Checks we can make from the homepage response and its HTML: HTTPS, the
// common security headers, mixed content, Subresource Integrity on third
// party scripts, cookies and version disclosure. This is not a penetration
// test and says nothing about the server software itself.

import * as cheerio from 'cheerio';
import type { PageData, AuditIssue, AuditScore } from './types';

/** Third party hosts whose scripts change on purpose, so SRI cannot be used with them. */
const DYNAMIC_SCRIPT_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'pagead2.googlesyndication.com',
  'connect.facebook.net',
  'js.stripe.com',
  'challenges.cloudflare.com',
  'embed.tawk.to',
];

/** Second level labels used under country code domains, for example example.co.uk. */
const SECOND_LEVEL = new Set(['co', 'com', 'org', 'net', 'gov', 'ac', 'edu', 'ltd', 'plc', 'me', 'or', 'ne', 'go']);

/** 180 days, the minimum HSTS max-age most guidance accepts. */
const HSTS_MIN_SECONDS = 15552000;

function finalUrlOf(page: PageData): string {
  return page.finalUrl || page.url;
}

function isHttps(url: string): boolean {
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

/** A rough registrable domain: www.example.com and example.com give example.com. */
function siteOf(host: string): string {
  const labels = host.toLowerCase().replace(/^www\./, '').split('.').filter(Boolean);
  if (labels.length <= 2) return labels.join('.');
  const tld = labels[labels.length - 1];
  const second = labels[labels.length - 2];
  const take = tld.length === 2 && SECOND_LEVEL.has(second) ? 3 : 2;
  return labels.slice(-take).join('.');
}

function hostMatches(host: string, domain: string): boolean {
  const h = host.toLowerCase();
  return h === domain || h.endsWith(`.${domain}`);
}

/** Splits a header that may hold several Set-Cookie values joined by ", ". */
function splitSetCookie(raw: string): string[] {
  // A comma starts a new cookie only when "name=" follows it. Commas inside
  // Expires dates ("Wed, 21 Oct 2026") are followed by a space and digits.
  return raw
    .split(/,(?=\s*[^;,=\s]+=)/)
    .map((c) => c.trim())
    .filter((c) => c.includes('='));
}

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

    // Server version and cookie flags
    this.analyzeServerAndCookies(pages, issues);

    // Calculate score
    const totalChecks = 12;
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

  private analyzeHTTPS(pages: PageData[], issues: AuditIssue[]): void {
    // One finding for the site, listing every page that ended up on http.
    const insecure = pages.map(finalUrlOf).filter((u) => {
      try {
        return new URL(u).protocol === 'http:';
      } catch {
        return false;
      }
    });
    if (insecure.length === 0) return;

    const first = insecure[0];
    const homeInsecure = !isHttps(finalUrlOf(pages[0]));
    issues.push({
      id: `no_https_${first}`,
      category: 'security',
      type: 'missing_https',
      severity: 'critical',
      title: 'Not Using HTTPS',
      description: homeInsecure
        ? `The site is served over plain HTTP: ${first}${insecure.length > 1 ? ` and ${insecure.length - 1} more pages` : ''} did not redirect to HTTPS.`
        : `${insecure.length} ${insecure.length === 1 ? 'page ends' : 'pages end'} up on plain HTTP after redirects, for example ${first}.`,
      impact: 'Anything sent over HTTP can be read or changed on the way, for example on public wifi. Browsers mark these pages "Not secure", and Google prefers HTTPS pages.',
      suggestion: 'Install a TLS certificate (most hosts offer a free one through Let\'s Encrypt) and redirect every HTTP address to its HTTPS version with a 301.',
      url: first,
      priority: 10,
      affectedUrls: insecure.slice(0, 20),
      codeSnippet: `# nginx\nserver {\n  listen 80;\n  return 301 https://$host$request_uri;\n}`,
      fixInstructions: [
        { step: 1, title: 'Get a certificate', description: 'Use Let\'s Encrypt (free) or the certificate option your host provides.' },
        { step: 2, title: 'Install it', description: 'Follow your host\'s steps to turn on HTTPS for the domain.' },
        { step: 3, title: 'Redirect HTTP to HTTPS', description: 'Send a 301 redirect from every http:// address to the matching https:// address.' },
        { step: 4, title: 'Update internal links', description: 'Change internal links, canonicals and sitemap entries to https://.' }
      ],
      timeToFix: '30 minutes',
      difficulty: 'medium',
    });
  }

  private analyzeSecurityHeaders(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    const headers = mainPage.headers;
    const pageUrl = finalUrlOf(mainPage);
    const https = isHttps(pageUrl);
    const $ = cheerio.load(mainPage.html || '');

    const cspHeader = (headers['content-security-policy'] || '').trim();
    const cspMeta = $('meta')
      .filter((_, el) => ($(el).attr('http-equiv') || '').trim().toLowerCase() === 'content-security-policy')
      .map((_, el) => ($(el).attr('content') || '').trim())
      .get()
      .filter(Boolean)
      .join('; ');
    const cspReportOnly = (headers['content-security-policy-report-only'] || '').trim();

    // Clickjacking: X-Frame-Options, or frame-ancestors in a CSP header.
    // frame-ancestors is ignored when the CSP comes from a meta tag.
    const xfo = (headers['x-frame-options'] || '').trim().toUpperCase();
    const xfoOk = xfo === 'DENY' || xfo === 'SAMEORIGIN';
    const frameAncestors = /(^|;|,)\s*frame-ancestors\s/i.test(cspHeader);
    if (!xfoOk && !frameAncestors) {
      issues.push({
        id: 'no_x_frame_options',
        category: 'security',
        type: 'missing_security_header',
        severity: 'medium',
        title: 'No Clickjacking Protection',
        description: xfo
          ? `X-Frame-Options is set to "${headers['x-frame-options']}", which browsers do not accept, and there is no frame-ancestors rule in a Content-Security-Policy header.`
          : 'Neither X-Frame-Options nor a Content-Security-Policy frame-ancestors rule is set.',
        impact: 'Another site could load your pages in a hidden frame and trick visitors into clicking buttons they cannot see (clickjacking).',
        suggestion: 'Add frame-ancestors \'self\' to a Content-Security-Policy header. This is the modern option. X-Frame-Options: SAMEORIGIN still works as a fallback for old browsers.',
        url: mainPage.url,
        priority: 6,
        affectedUrls: [mainPage.url],
        codeSnippet: '# Modern option\nContent-Security-Policy: frame-ancestors \'self\'\n\n# Fallback for old browsers\nX-Frame-Options: SAMEORIGIN\n\n# nginx\nadd_header Content-Security-Policy "frame-ancestors \'self\'" always;\nadd_header X-Frame-Options "SAMEORIGIN" always;',
        fixInstructions: [
          { step: 1, title: 'Choose who may frame your pages', description: '\'none\' blocks all framing, \'self\' allows only your own site.' },
          { step: 2, title: 'Send the header', description: 'Configure your server, CDN or framework to send it with every page.' }
        ],
        timeToFix: '5 minutes',
        difficulty: 'easy',
      });
    }

    // X-Content-Type-Options must be exactly nosniff.
    const xcto = (headers['x-content-type-options'] || '').trim().toLowerCase();
    if (xcto !== 'nosniff') {
      issues.push({
        id: 'no_x_content_type',
        category: 'security',
        type: 'missing_security_header',
        severity: 'medium',
        title: xcto ? 'X-Content-Type-Options Has the Wrong Value' : 'Missing X-Content-Type-Options Header',
        description: xcto
          ? `X-Content-Type-Options is "${headers['x-content-type-options']}". The only valid value is nosniff.`
          : 'The X-Content-Type-Options header is not set.',
        impact: 'Without nosniff, a browser may guess a file\'s type from its contents, which can let an uploaded file run as a script.',
        suggestion: 'Send X-Content-Type-Options: nosniff with every response.',
        url: mainPage.url,
        priority: 5,
        affectedUrls: [mainPage.url],
        codeSnippet: '# Apache\nHeader always set X-Content-Type-Options "nosniff"\n\n# nginx\nadd_header X-Content-Type-Options "nosniff" always;',
        timeToFix: '2 minutes',
        difficulty: 'easy',
      });
    }

    // HSTS only means something on HTTPS pages.
    if (https) {
      const hsts = (headers['strict-transport-security'] || '').trim();
      const maxAgeMatch = hsts.match(/max-age\s*=\s*"?(\d+)"?/i);
      const maxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : NaN;
      const hstsSnippet = '# Apache\nHeader always set Strict-Transport-Security "max-age=31536000"\n\n# nginx\nadd_header Strict-Transport-Security "max-age=31536000" always;\n\n# Add includeSubDomains only if every subdomain serves HTTPS';

      if (!hsts || !Number.isFinite(maxAge)) {
        issues.push({
          id: 'no_hsts',
          category: 'security',
          type: 'missing_security_header',
          severity: 'medium',
          title: hsts ? 'HSTS Header Has No Valid max-age' : 'Missing HSTS Header',
          description: hsts
            ? `Strict-Transport-Security is set to "${hsts}" but has no valid max-age, so browsers ignore it.`
            : 'The Strict-Transport-Security header is not set.',
          impact: 'Without HSTS, a visitor who types your address or follows an old http:// link makes a first request over plain HTTP, which an attacker on the same network could intercept.',
          suggestion: 'Send Strict-Transport-Security: max-age=31536000 on HTTPS responses. Add includeSubDomains only if all subdomains serve HTTPS.',
          url: mainPage.url,
          priority: 6,
          affectedUrls: [mainPage.url],
          codeSnippet: hstsSnippet,
          fixInstructions: [
            { step: 1, title: 'Start short', description: 'Begin with a small max-age such as 300 seconds and check nothing breaks.' },
            { step: 2, title: 'Raise it', description: 'Move up to at least 15552000 (180 days), ideally 31536000 (one year).' },
            { step: 3, title: 'Subdomains', description: 'Add includeSubDomains only once every subdomain works over HTTPS.' }
          ],
          timeToFix: '5 minutes',
          difficulty: 'easy',
        });
      } else if (maxAge < HSTS_MIN_SECONDS) {
        issues.push({
          id: 'no_hsts',
          category: 'security',
          type: 'missing_security_header',
          severity: 'low',
          title: maxAge === 0 ? 'HSTS Is Switched Off (max-age=0)' : 'HSTS max-age Is Short',
          description: maxAge === 0
            ? 'Strict-Transport-Security is sent with max-age=0, which tells browsers to forget the HSTS rule.'
            : `Strict-Transport-Security has max-age=${maxAge} (${maxAge < 86400 ? 'less than a day' : `about ${Math.round(maxAge / 86400)} ${Math.round(maxAge / 86400) === 1 ? 'day' : 'days'}`}). Most guidance asks for at least 180 days.`,
          impact: 'A short max-age means browsers soon forget to insist on HTTPS, so returning visitors can again make a first request over plain HTTP.',
          suggestion: 'Raise max-age to at least 15552000 (180 days), ideally 31536000 (one year). Add includeSubDomains only if all subdomains serve HTTPS.',
          url: mainPage.url,
          priority: 3,
          affectedUrls: [mainPage.url],
          codeSnippet: hstsSnippet,
          timeToFix: '5 minutes',
          difficulty: 'easy',
        });
      }
    }

    // Content-Security-Policy, from a header or a meta tag.
    const cspSnippet = [
      '# Step 1: test without breaking anything',
      'Content-Security-Policy-Report-Only: script-src \'nonce-{RANDOM}\' \'strict-dynamic\'; object-src \'none\'; base-uri \'self\'; frame-ancestors \'self\'',
      '',
      '# Each inline or external script then carries the nonce:',
      '<script nonce="{RANDOM}" src="/app.js"></script>',
      '',
      '# A safe minimum while you work on the full policy',
      'Content-Security-Policy: frame-ancestors \'self\'; object-src \'none\'; base-uri \'self\'',
    ].join('\n');

    if (!cspHeader && !cspMeta) {
      const testing = !!cspReportOnly;
      issues.push({
        id: 'no_csp',
        category: 'security',
        type: 'missing_security_header',
        severity: testing ? 'low' : 'medium',
        title: testing ? 'Content-Security-Policy Is Only in Testing' : 'Missing Content-Security-Policy',
        description: testing
          ? 'The site sends Content-Security-Policy-Report-Only, so the policy is being tested and reports problems, but it does not block anything yet.'
          : 'We found no Content-Security-Policy header or meta tag.',
        impact: 'A Content-Security-Policy limits which scripts can run, which stops many cross site scripting (XSS) attacks from working even if one gets into the page.',
        suggestion: testing
          ? 'Once the reports are clean, send the same policy as Content-Security-Policy so the browser enforces it.'
          : 'Start with Content-Security-Policy-Report-Only and a nonce or hash based policy, then enforce it once reports are clean. At minimum send frame-ancestors \'self\'; object-src \'none\'; base-uri \'self\'. Avoid script-src \'unsafe-inline\', which cancels most of the protection.',
        url: mainPage.url,
        priority: testing ? 3 : 5,
        affectedUrls: [mainPage.url],
        codeSnippet: cspSnippet,
        fixInstructions: [
          { step: 1, title: 'Test first', description: 'Send the policy as Content-Security-Policy-Report-Only and collect the reports.' },
          { step: 2, title: 'Use nonces or hashes', description: 'Mark allowed scripts with a nonce (a new random value per response) or a hash, instead of allowing all inline scripts.' },
          { step: 3, title: 'Enforce', description: 'Switch the header to Content-Security-Policy once no legitimate script is reported.' }
        ],
        timeToFix: '1 to 3 hours',
        difficulty: 'hard',
      });
    }

    // X-XSS-Protection: the old filter was removed from browsers and could itself leak data.
    const xxss = (headers['x-xss-protection'] || '').trim();
    if (/^1\b/.test(xxss)) {
      issues.push({
        id: 'xss_protection_legacy',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Outdated X-XSS-Protection Header',
        description: `X-XSS-Protection is set to "${xxss}".`,
        impact: 'Modern browsers have removed the old XSS filter this header controlled. In older browsers that still have it, the filter could be abused to leak information from the page.',
        suggestion: 'Set X-XSS-Protection: 0 or remove the header, and rely on a Content-Security-Policy for XSS protection instead.',
        url: mainPage.url,
        priority: 2,
      });
    }

    // Referrer-Policy: browsers default to strict-origin-when-cross-origin, which is fine.
    // When several values are given, the last one the browser understands wins.
    const referrerValues = (headers['referrer-policy'] || '')
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
    const referrer = referrerValues[referrerValues.length - 1] || '';
    if (referrer === 'unsafe-url' || referrer === 'no-referrer-when-downgrade') {
      issues.push({
        id: 'no_referrer_policy',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Referrer-Policy Shares Full URLs',
        description: `Referrer-Policy is set to "${referrer}".`,
        impact: 'With this value, the full address of the page, including any query string, is sent to every other site your page links to or loads from. That can leak search terms, IDs or tokens.',
        suggestion: 'Use Referrer-Policy: strict-origin-when-cross-origin (the browser default), or remove the header.',
        url: mainPage.url,
        priority: 3,
      });
    }

    // Permissions-Policy (formerly Feature-Policy)
    if (!headers['permissions-policy'] && !headers['feature-policy']) {
      issues.push({
        id: 'no_permissions_policy',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'No Permissions-Policy Header',
        description: 'The Permissions-Policy header is not set.',
        impact: 'This is optional. A Permissions-Policy lets you limit which features embedded third party content can request, such as the camera, microphone or location. Browsers still ask the visitor before granting any of them.',
        suggestion: 'If your pages embed third party content, add a Permissions-Policy that turns off the features you do not use.',
        url: mainPage.url,
        priority: 2,
        codeSnippet: 'Permissions-Policy: camera=(), microphone=(), geolocation=()',
      });
    }
  }

  private analyzeMixedContent(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const pageUrl = finalUrlOf(page);
      if (!isHttps(pageUrl)) return;

      const $ = cheerio.load(page.html || '');
      const active: string[] = [];
      const passive: string[] = [];
      const isHttp = (value: string | undefined) => !!value && /^\s*http:\/\//i.test(value);
      const srcsetHttp = (value: string | undefined): string[] =>
        (value || '')
          .split(',')
          .map((part) => part.trim().split(/\s+/)[0] || '')
          .filter((u) => isHttp(u));

      // Plain <a href="http://..."> links are not mixed content: nothing loads until a visitor clicks.
      $('script[src]').each((_, el) => { const v = $(el).attr('src'); if (isHttp(v)) active.push(`Script: ${v}`); });
      $('link[rel~="stylesheet"][href]').each((_, el) => { const v = $(el).attr('href'); if (isHttp(v)) active.push(`Stylesheet: ${v}`); });
      $('iframe[src]').each((_, el) => { const v = $(el).attr('src'); if (isHttp(v)) active.push(`Frame: ${v}`); });
      $('object[data]').each((_, el) => { const v = $(el).attr('data'); if (isHttp(v)) active.push(`Object: ${v}`); });
      $('embed[src]').each((_, el) => { const v = $(el).attr('src'); if (isHttp(v)) active.push(`Embed: ${v}`); });

      $('img').each((_, el) => {
        const v = $(el).attr('src');
        if (isHttp(v)) passive.push(`Image: ${v}`);
        srcsetHttp($(el).attr('srcset')).forEach((u) => passive.push(`Image: ${u}`));
      });
      $('source').each((_, el) => {
        const v = $(el).attr('src');
        if (isHttp(v)) passive.push(`Media: ${v}`);
        srcsetHttp($(el).attr('srcset')).forEach((u) => passive.push(`Image: ${u}`));
      });
      $('video[src], audio[src]').each((_, el) => { const v = $(el).attr('src'); if (isHttp(v)) passive.push(`Media: ${v}`); });

      if (active.length > 0) {
        issues.push({
          id: `mixed_content_${page.url}`,
          category: 'security',
          type: 'mixed_content',
          severity: 'high',
          title: 'Insecure Scripts or Styles on a Secure Page',
          description: `${active.length} ${active.length === 1 ? 'script, stylesheet or frame loads' : 'scripts, stylesheets or frames load'} over plain HTTP on the HTTPS page ${page.url}: ${active.slice(0, 3).join(', ')}${active.length > 3 ? ' and more' : ''}.`,
          impact: 'Browsers block these files outright, so parts of the page may break. If they did load, anyone on the network could change them and take control of the page.',
          suggestion: 'Change these addresses to https://. If the other server does not support HTTPS, host the file yourself or find another source.',
          url: page.url,
          priority: 8,
          affectedUrls: [page.url],
        });
      }

      if (passive.length > 0) {
        issues.push({
          id: `mixed_content_passive_${page.url}`,
          category: 'security',
          type: 'mixed_content',
          severity: 'low',
          title: 'Images or Media Linked Over HTTP',
          description: `${passive.length} ${passive.length === 1 ? 'image or media file is' : 'images or media files are'} referenced with http:// on the HTTPS page ${page.url}: ${passive.slice(0, 3).join(', ')}${passive.length > 3 ? ' and more' : ''}.`,
          impact: 'Modern browsers upgrade these requests to HTTPS automatically, or block them if the other server does not support HTTPS, in which case the image is missing.',
          suggestion: 'Change these addresses to https:// so they load reliably everywhere.',
          url: page.url,
          priority: 3,
          affectedUrls: [page.url],
        });
      }
    });
  }

  private analyzeExternalResources(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;

    const pageUrl = finalUrlOf(mainPage);
    let pageSite = '';
    try {
      pageSite = siteOf(new URL(pageUrl).hostname);
    } catch {
      return;
    }

    // Third party scripts without an integrity attribute.
    const $ = cheerio.load(mainPage.html || '');
    const withoutSri: string[] = [];
    $('script[src]').each((_, el) => {
      const $s = $(el);
      if (($s.attr('integrity') || '').trim()) return;
      let host = '';
      try {
        host = new URL($s.attr('src') || '', pageUrl).hostname.toLowerCase();
      } catch {
        return;
      }
      if (!host || siteOf(host) === pageSite) return;
      if (DYNAMIC_SCRIPT_HOSTS.some((d) => hostMatches(host, d))) return;
      withoutSri.push($s.attr('src') || host);
    });

    if (withoutSri.length > 0) {
      issues.push({
        id: 'no_sri',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Third Party Scripts Without Subresource Integrity',
        description: `${withoutSri.length} ${withoutSri.length === 1 ? 'script loads' : 'scripts load'} from another site without an integrity hash, for example ${withoutSri[0]}.`,
        impact: 'If that other site were hacked, the changed script would run on your pages with full access. An integrity hash makes the browser refuse a file that has changed.',
        suggestion: 'For scripts with a fixed version (for example from a CDN), add integrity="sha384-..." and crossorigin="anonymous". Scripts that change on purpose, such as tag managers, cannot use this.',
        url: mainPage.url,
        priority: 3,
        affectedUrls: [mainPage.url],
        codeSnippet: '<script src="https://cdn.example.com/lib@1.2.3/lib.min.js"\n        integrity="sha384-{HASH}"\n        crossorigin="anonymous"></script>',
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
        impact: 'Inline handlers can be an XSS route if user content is not properly escaped, and they make a strict Content-Security-Policy harder to adopt.',
        suggestion: 'Move event handlers into your JavaScript files.',
        url: mainPage.url,
        priority: 2,
      });
    }
  }

  private analyzeFormSecurity(pages: PageData[], issues: AuditIssue[]): void {
    pages.forEach((page) => {
      const pageUrl = finalUrlOf(page);
      page.forms.forEach((form, index) => {
        // Check for forms without HTTPS action
        if (form.action && /^\s*http:\/\//i.test(form.action)) {
          issues.push({
            id: `insecure_form_${page.url}_${index}`,
            category: 'security',
            type: 'missing_https',
            severity: 'high',
            title: 'Form Submits Over HTTP',
            description: `A form on ${page.url} sends its data to an insecure HTTP address: ${form.action}`,
            impact: 'Whatever visitors type into this form travels unencrypted and can be read on the way.',
            suggestion: 'Change the form action to an https:// address.',
            url: page.url,
            priority: 8,
          });
        }

        // Password fields on a page that is not HTTPS
        const hasPasswordField = form.inputs.some((input) => input.type === 'password');
        if (hasPasswordField && !isHttps(pageUrl)) {
          issues.push({
            id: `password_http_${page.url}_${index}`,
            category: 'security',
            type: 'missing_https',
            severity: 'critical',
            title: 'Password Field on an HTTP Page',
            description: `${page.url} asks for a password but is not served over HTTPS.`,
            impact: 'Passwords typed here can be read by anyone on the same network.',
            suggestion: 'Serve this page, and every login page, over HTTPS.',
            url: page.url,
            priority: 10,
          });
        }
      });
    });
  }

  /** Version numbers in Server or X-Powered-By, and cookie flags. */
  private analyzeServerAndCookies(pages: PageData[], issues: AuditIssue[]): void {
    const mainPage = pages[0];
    if (!mainPage) return;
    const headers = mainPage.headers;

    // (a) Version disclosure, for example "Apache/2.4.41" or "PHP/7.4.3".
    const disclosed: string[] = [];
    for (const name of ['server', 'x-powered-by']) {
      const value = (headers[name] || '').trim();
      if (/\/\s*v?\d+(\.\d+)+/i.test(value)) disclosed.push(`${name === 'server' ? 'Server' : 'X-Powered-By'}: ${value}`);
    }
    for (const name of ['x-aspnet-version', 'x-aspnetmvc-version']) {
      const value = (headers[name] || '').trim();
      if (value) disclosed.push(`${name === 'x-aspnet-version' ? 'X-AspNet-Version' : 'X-AspNetMvc-Version'}: ${value}`);
    }
    if (disclosed.length > 0) {
      issues.push({
        id: 'server_version_disclosed',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Server Version Disclosed',
        description: `Response headers name exact software versions: ${disclosed.join('; ')}.`,
        impact: 'Version numbers tell attackers which known bugs to try. Hiding them does not fix anything, but it stops your site turning up in automated scans for that version.',
        suggestion: 'Turn off version details in your server settings (for example ServerTokens Prod in Apache, server_tokens off in nginx, expose_php = Off in PHP) and keep the software up to date.',
        url: mainPage.url,
        priority: 2,
      });
    }

    // (b) Cookie flags. Several Set-Cookie headers may have been joined with ", ",
    // so we split carefully and only judge what we can parse.
    const raw = headers['set-cookie'] || '';
    if (!raw) return;
    const https = isHttps(finalUrlOf(mainPage));
    const problems: string[] = [];
    for (const cookie of splitSetCookie(raw)) {
      const parts = cookie.split(';').map((p) => p.trim());
      const name = (parts[0].split('=')[0] || '').trim();
      if (!name) continue;
      const attrs = new Set(parts.slice(1).map((p) => p.split('=')[0].trim().toLowerCase()));
      const missing: string[] = [];
      const prefixedSecure = name.startsWith('__Secure-') || name.startsWith('__Host-');
      if (https && !attrs.has('secure') && !prefixedSecure) missing.push('Secure');
      // Only session style cookies need HttpOnly. Cookies read by scripts cannot use it.
      if (!attrs.has('httponly') && /(sess|sid|auth|token|login|jwt)/i.test(name)) missing.push('HttpOnly');
      if (!attrs.has('samesite')) missing.push('SameSite');
      if (missing.length > 0) problems.push(`${name} (no ${missing.join(', ')})`);
    }
    if (problems.length > 0) {
      issues.push({
        id: 'insecure_cookie_flags',
        category: 'security',
        type: 'missing_security_header',
        severity: 'low',
        title: 'Cookies Missing Security Flags',
        description: `The homepage sets ${problems.length === 1 ? 'a cookie' : 'cookies'} without some security flags: ${problems.slice(0, 5).join('; ')}${problems.length > 5 ? '; and more' : ''}.`,
        impact: 'Without Secure a cookie can travel over plain HTTP. Without HttpOnly a session cookie can be read by any script on the page, including injected ones. Without SameSite the browser falls back to its own default, which varies.',
        suggestion: 'Set Secure on every cookie on an HTTPS site, HttpOnly on session and login cookies, and SameSite=Lax (or Strict) unless the cookie must work across sites.',
        url: mainPage.url,
        priority: 2,
        codeSnippet: 'Set-Cookie: session=abc123; Path=/; Secure; HttpOnly; SameSite=Lax',
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
