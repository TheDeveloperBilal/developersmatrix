// Deep Conversion Audit Module
// Analyzes conversion optimization, CTAs, trust signals, forms, and landing page structure

import type { PageData, AuditIssue, AuditScore } from './types';

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

    const html = mainPage.html.toLowerCase();
    const text = mainPage.text.toLowerCase();
    const $ = this.createCheerioProxy(html);
    
    // Deep CTA Analysis
    this.analyzeCTADepth(pages, issues, html, text, $);
    
    // Trust Signals Deep Scan
    this.analyzeTrustSignalsDeep(pages, issues, html, text, $);
    
    // Social Proof Detection
    this.analyzeSocialProof(pages, issues, html, text, $);
    
    // Form Conversion Optimization
    this.analyzeFormConversion(pages, issues, html, $);
    
    // Value Proposition Clarity
    this.analyzeValueProposition(pages, issues, html, text, $);
    
    // FOMO / Urgency Detection
    this.analyzeFOMO(pages, issues, html, text);
    
    // Navigation & Footer Completeness
    this.analyzeNavigationConversion(pages, issues, html, $);
    
    // Landing Page Structure
    this.analyzeLandingStructure(pages, issues, html, text, $);
    
    // Mobile Conversion Elements
    this.analyzeMobileConversion(pages, issues, html, $);

    // Calculate score
    const totalChecks = 28;
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    const highCount = issues.filter(i => i.severity === 'high').length;
    const passedChecks = Math.max(0, totalChecks - criticalCount * 3 - highCount * 2);
    
    const score = this.createScore(
      Math.max(0, 100 - (issues.reduce((sum, i) => sum + this.getSeverityWeight(i.severity), 0))),
      totalChecks,
      passedChecks,
      issues.length
    );

    return { issues, score };
  }

  // --- CTA Depth Analysis ---

  private analyzeCTADepth(pages: PageData[], issues: AuditIssue[], html: string, text: string, $: CheerioProxy) {
    const mainPage = pages[0];
    
    // Detect all CTA buttons and links
    const ctaKeywords = [
      'buy now', 'get started', 'sign up', 'sign up free', 'start free', 'try free',
      'download', 'subscribe', 'join now', 'register', 'create account', 'add to cart',
      'checkout', 'learn more', 'see pricing', 'get demo', 'book demo', 'contact us',
      'get quote', 'start trial', 'upgrade', 'claim', 'grab', 'unlock', 'discover',
      'explore', 'watch demo', 'schedule', 'request', 'apply now', 'enroll',
    ];
    
    const allButtons = $.find('button, a.btn, a[class*="button"], a[class*="cta"], [class*="cta"]');
    const allLinks = $.find('a');
    
    let ctaCount = 0;
    let weakCTAs = 0;
    const ctaElements: { text: string; href?: string; classes: string }[] = [];
    
    allLinks.each((_: number, el: any) => {
      const linkText = (el.text || '').toLowerCase().trim();
      const href = el.attrs["href"] || '';
      const classes = (el.attrs["class"] || '').toLowerCase();
      
      const isCTA = ctaKeywords.some(kw => linkText.includes(kw)) || 
                    classes.includes('btn') || 
                    classes.includes('button') ||
                    classes.includes('cta');
      
      if (isCTA && linkText.length > 0) {
        ctaCount++;
        ctaElements.push({ text: linkText, href, classes });
        
        // Check for weak CTA text
        const weakWords = ['click here', 'read more', 'more info', 'details', 'link', 'here'];
        if (weakWords.some(w => linkText.includes(w))) {
          weakCTAs++;
        }
      }
    });
    
    allButtons.each((_: number, el: any) => {
      const btnText = (el.text || '').toLowerCase().trim();
      if (btnText.length > 0) {
        ctaCount++;
        ctaElements.push({ text: btnText, classes: (el.attrs["class"] || '').toLowerCase() });
      }
    });

    // No CTA at all
    if (ctaCount === 0) {
      issues.push({
        id: 'conv-no-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'critical',
        title: 'No Clear Call-to-Action Found',
        description: 'Your homepage contains no recognizable call-to-action buttons or links. Without a clear CTA, visitors have no direction on what to do next.',
        impact: 'Conversion rates typically drop 80-90% when no CTA is present. Visitors leave without taking any action.',
        suggestion: 'Add at least 2-3 prominent CTAs above the fold: one primary (e.g., "Get Started Free") and one secondary (e.g., "Watch Demo").',
        priority: 10,
        affectedUrls: [mainPage.url],
        timeToFix: '15-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+40-60% conversion rate improvement',
      });
    }
    
    // Too few CTAs (only 1)
    else if (ctaCount === 1) {
      issues.push({
        id: 'conv-single-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'high',
        title: 'Only One Call-to-Action Found',
        description: `Only 1 CTA was detected on the homepage. Multiple CTAs at different decision points guide users through your funnel.`,
        impact: 'Single CTAs capture only visitors ready to convert immediately. You lose prospects who need more information first.',
        suggestion: 'Add secondary CTAs like "Learn More", "See Pricing", or "Watch Demo" alongside your primary CTA. Place CTAs after each major section.',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+25-35% improvement in engagement',
      });
    }
    
    // Weak CTA text
    if (weakCTAs > 0) {
      issues.push({
        id: 'conv-weak-cta-text',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'high',
        title: `${weakCTAs} Weak Call-to-Action Text${weakCTAs > 1 ? 's' : ''} Detected`,
        description: `Found ${weakCTAs} CTA${weakCTAs > 1 ? 's' : ''} using generic text like "Click Here" or "Read More" instead of action-oriented, benefit-driven language.`,
        impact: 'Generic CTAs reduce click-through rates by 30-50%. Users need to understand the benefit before clicking.',
        suggestion: 'Replace generic text with benefit-driven verbs: "Start My Free Trial" instead of "Sign Up", "Get My Audit Report" instead of "Submit".',
        priority: 7,
        affectedUrls: [mainPage.url],
        timeToFix: '10-20 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-30% CTR improvement',
      });
    }
    
    // CTA above the fold check
    const bodyStart = html.indexOf('<body');
    const firstScreen = bodyStart >= 0 ? html.substring(bodyStart, bodyStart + 3000) : html.substring(0, 3000);
    const hasCTAAboveFold = ctaKeywords.some(kw => firstScreen.includes(kw)) || 
                            firstScreen.includes('btn') || 
                            firstScreen.includes('button');
    
    if (!hasCTAAboveFold && ctaCount > 0) {
      issues.push({
        id: 'conv-cta-below-fold',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'high',
        title: 'Primary CTA Not Visible Above the Fold',
        description: 'No clear call-to-action appears in the first visible screen area. Users must scroll to find how to convert.',
        impact: '57% of page viewing time happens above the fold. Hidden CTAs miss the majority of attention.',
        suggestion: 'Place your primary CTA in the hero section, visible without scrolling. Use contrasting colors to make it stand out.',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '15-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+35-50% conversion rate improvement',
      });
    }
  }

  // --- Trust Signals Deep Scan ---

  private analyzeTrustSignalsDeep(pages: PageData[], issues: AuditIssue[], html: string, text: string, $: CheerioProxy) {
    const mainPage = pages[0];
    const allText = pages.map(p => p.text.toLowerCase()).join(' ');
    const allHtml = pages.map(p => p.html.toLowerCase()).join(' ');
    
    // Check for specific trust pages
    const trustPages = [
      { keyword: 'privacy policy', label: 'Privacy Policy' },
      { keyword: 'terms of service', label: 'Terms of Service' },
      { keyword: 'terms and conditions', label: 'Terms & Conditions' },
      { keyword: 'refund policy', label: 'Refund Policy' },
      { keyword: 'shipping policy', label: 'Shipping Policy' },
      { keyword: 'cookie policy', label: 'Cookie Policy' },
      { keyword: 'about us', label: 'About Us' },
      { keyword: 'contact us', label: 'Contact Page' },
      { keyword: 'help center', label: 'Help Center' },
      { keyword: 'faq', label: 'FAQ' },
      { keyword: 'support', label: 'Support' },
    ];
    
    const missingTrustPages: string[] = [];
    const foundTrustPages: string[] = [];
    
    for (const tp of trustPages) {
      const hasPage = allText.includes(tp.keyword) || allHtml.includes(tp.keyword.replace(/ /g, '-')) || allHtml.includes(tp.keyword.replace(/ /g, '_'));
      if (hasPage) {
        foundTrustPages.push(tp.label);
      } else {
        missingTrustPages.push(tp.label);
      }
    }
    
    // Privacy policy is critical
    if (!foundTrustPages.includes('Privacy Policy')) {
      issues.push({
        id: 'conv-missing-privacy',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'critical',
        title: 'Privacy Policy Page Not Found',
        description: 'No privacy policy page was detected. This is legally required in most jurisdictions and essential for user trust.',
        impact: 'Missing privacy policies reduce conversions by 15-25% and may violate GDPR, CCPA, and other privacy regulations.',
        suggestion: 'Create a comprehensive privacy policy page. Link it in your footer and near any form that collects personal data.',
        priority: 10,
        affectedUrls: [mainPage.url],
        timeToFix: '1-2 hours',
        difficulty: 'medium',
        estimatedImpact: '+15-25% trust increase, legal compliance',
      });
    }
    
    // Contact info visibility
    const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(mainPage.text) || 
                     /\+?\d[\d\s-]{8,}\d/.test(mainPage.text);
    const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(mainPage.text);
    const hasAddress = /\d+\s+\w+\s+(street|st|avenue|ave|road|rd|blvd|drive|dr|lane|ln|way)\b/i.test(mainPage.text);
    
    if (!hasPhone && !hasEmail && !hasAddress) {
      issues.push({
        id: 'conv-no-contact-info',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'high',
        title: 'No Visible Contact Information',
        description: 'No phone number, email address, or physical address was found on the homepage. Users need contact info to verify legitimacy.',
        impact: '44% of users will leave a website if there is no contact information. It is a major trust signal.',
        suggestion: 'Add a phone number, email, or physical address to your footer or header. Consider adding a live chat widget.',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '10-15 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-30% trust improvement',
      });
    }
    
    // SSL/TLS badge or trust seal mentions
    const hasTrustSeal = /(norton|mcafee|truste|bbb|ssl|secure|verified|guarantee|money.back)/i.test(allHtml);
    if (!hasTrustSeal && foundTrustPages.length < 3) {
      issues.push({
        id: 'conv-low-trust-signals',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'medium',
        title: 'Limited Trust Signals Detected',
        description: `Only ${foundTrustPages.length} trust element${foundTrustPages.length === 1 ? '' : 's'} found (${foundTrustPages.join(', ')}). Strong trust signals are critical for conversion.`,
        impact: 'Websites with 5+ trust signals convert 37% better than those with fewer than 3.',
        suggestion: 'Add: security badges near forms, customer count ("Trusted by 10,000+ users"), money-back guarantees, and social proof elements.',
        priority: 6,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '30-60 minutes',
        difficulty: 'easy',
        estimatedImpact: '+25-37% conversion improvement',
      });
    }
    
    // About Us page
    if (!foundTrustPages.includes('About Us')) {
      issues.push({
        id: 'conv-missing-about',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'medium',
        title: 'About Us Page Not Found',
        description: 'No About Us page was detected. Visitors want to know who they are doing business with before converting.',
        impact: 'The About page is typically one of the most visited pages on conversion-focused websites. Missing it reduces transparency.',
        suggestion: 'Create an About page with team photos, company story, mission, and values. Link it prominently in your navigation.',
        priority: 5,
        affectedUrls: [mainPage.url],
        timeToFix: '1-2 hours',
        difficulty: 'medium',
        estimatedImpact: '+10-20% trust improvement',
      });
    }
  }

  // --- Social Proof Detection ---

  private analyzeSocialProof(pages: PageData[], issues: AuditIssue[], html: string, text: string, $: CheerioProxy) {
    const mainPage = pages[0];
    const allHtml = pages.map(p => p.html.toLowerCase()).join(' ');
    
    // Detect social proof elements
    const socialProofIndicators = [
      { pattern: /testimonial|review|rating|star/i, name: 'Testimonials/Reviews', weight: 3 },
      { pattern: /client|customer|logo|partner|trusted by/i, name: 'Client Logos', weight: 2 },
      { pattern: /\d{1,3}(,\d{3})*\s*(user|customer|download|subscriber|member|client)/i, name: 'User Count Stats', weight: 3 },
      { pattern: /case stud|success stor/i, name: 'Case Studies', weight: 2 },
      { pattern: /\d+\s*(star|out of|5|10)|rating|rated/i, name: 'Ratings', weight: 2 },
      { pattern: /award|recognized|featured in|as seen on/i, name: 'Awards/Press', weight: 2 },
    ];
    
    let socialProofScore = 0;
    const foundProof: string[] = [];
    
    for (const indicator of socialProofIndicators) {
      if (indicator.pattern.test(allHtml)) {
        socialProofScore += indicator.weight;
        foundProof.push(indicator.name);
      }
    }
    
    // No social proof at all
    if (socialProofScore === 0) {
      issues.push({
        id: 'conv-no-social-proof',
        category: 'conversion',
        type: 'missing_social_proof',
        severity: 'high',
        title: 'No Social Proof Elements Found',
        description: 'No testimonials, reviews, client logos, user counts, or trust badges were detected. Social proof is one of the strongest conversion drivers.',
        impact: '92% of consumers read online reviews before converting. Without social proof, visitors have no reassurance about quality.',
        suggestion: 'Add: 3-5 customer testimonials with photos, "Trusted by X companies" with client logos, user/download counters, and any awards or press mentions.',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '1-3 hours',
        difficulty: 'easy',
        estimatedImpact: '+34% average conversion increase',
      });
    }
    // Weak social proof (score < 4)
    else if (socialProofScore < 4) {
      issues.push({
        id: 'conv-weak-social-proof',
        category: 'conversion',
        type: 'missing_social_proof',
        severity: 'medium',
        title: 'Limited Social Proof Detected',
        description: `Only basic social proof found (${foundProof.join(', ')}). Strong conversion pages use multiple layers of social proof throughout the page.`,
        impact: 'Pages with rich social proof (testimonials + stats + logos + case studies) convert 2.5x better than pages with just one type.',
        suggestion: 'Add more social proof types: specific testimonials with results, "As seen in" press logos, real-time activity notifications, and detailed case studies.',
        priority: 6,
        affectedUrls: [mainPage.url],
        timeToFix: '1-2 hours',
        difficulty: 'easy',
        estimatedImpact: '+40-60% improvement with layered social proof',
      });
    }
    
    // Check for testimonial quality (real names, photos, specifics)
    const hasTestimonialDetails = /\b(john|jane|michael|sarah|david|emily|alex|chris|james|robert|lisa|mary|jennifer|daniel|matthew)\b/i.test(allHtml) &&
                                  (/ceo|founder|manager|director|head of|lead|engineer|designer|analyst|consultant/i.test(allHtml) ||
                                   /\d+%|\$\d+|increased|decreased|improved|saved|grew|doubled|tripled/i.test(allHtml));
    
    if (foundProof.includes('Testimonials/Reviews') && !hasTestimonialDetails) {
      issues.push({
        id: 'conv-generic-testimonials',
        category: 'conversion',
        type: 'missing_social_proof',
        severity: 'low',
        title: 'Testimonials Appear Generic',
        description: 'Testimonials were found but lack specific details like full names, job titles, company names, or quantified results. Generic testimonials are less credible.',
        impact: 'Testimonials with photos and specific results are 3x more effective than anonymous or vague quotes.',
        suggestion: 'Update testimonials to include: full name, job title, company, photo, and a specific quantified result (e.g., "Increased conversions by 47%").',
        priority: 4,
        affectedUrls: [mainPage.url],
        timeToFix: '30-60 minutes',
        difficulty: 'easy',
        estimatedImpact: '+15-25% testimonial effectiveness',
      });
    }
  }

  // --- Form Conversion Optimization ---

  private analyzeFormConversion(pages: PageData[], issues: AuditIssue[], html: string, $: CheerioProxy) {
    const mainPage = pages[0];
    let totalFormFields = 0;
    let formsWithRequiredOnly = 0;
    let formsWithoutLabels = 0;
    let longForms = 0;
    
    for (const page of pages) {
      const page$ = this.createCheerioProxy(page.html.toLowerCase());
      
      page$.find('form').each((_: number, form: any) => {
        const inputs = page$.find('input:not([type="hidden"]), textarea, select');
        const fieldCount = inputs.length;
        totalFormFields += fieldCount;
        
        if (fieldCount > 7) {
          longForms++;
        }
        
        // Check labels
        const hasLabels = page$.find('label').length > 0;
        if (!hasLabels && fieldCount > 0) {
          formsWithoutLabels++;
        }
        
        // Check placeholders as label substitutes
        const hasPlaceholders = page$.find('[placeholder]').length > 0;
        if (!hasLabels && !hasPlaceholders) {
          formsWithoutLabels++;
        }
      });
    }
    
    // Long forms kill conversion
    if (longForms > 0) {
      issues.push({
        id: 'conv-long-forms',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'high',
        title: `${longForms} Form${longForms > 1 ? 's' : ''} with Too Many Fields Detected`,
        description: `Found form${longForms > 1 ? 's' : ''} with ${totalFormFields} total fields. Each additional form field reduces conversion by approximately 11%.`,
        impact: 'Forms with more than 5 fields see a 50%+ drop in completion rates. Multi-step forms convert 2x better than long single-page forms.',
        suggestion: 'Reduce fields to essentials only. Use multi-step forms for complex data collection. Use smart defaults and auto-fill. Consider social login options.',
        priority: 7,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+30-50% form completion rate',
      });
    }
    
    // Forms without proper labels
    if (formsWithoutLabels > 0) {
      issues.push({
        id: 'conv-forms-no-labels',
        category: 'conversion',
        type: 'missing_label',
        severity: 'medium',
        title: `${formsWithoutLabels} Form${formsWithoutLabels > 1 ? 's' : ''} Missing Proper Labels`,
        description: 'Forms detected without proper label elements. Placeholder-only forms are confusing and hurt accessibility and conversion.',
        impact: 'Forms without labels have 23% lower completion rates. Users often forget what field they are in after typing starts.',
        suggestion: 'Add visible labels above each field. Use placeholders as hints only, not replacements for labels. Float labels are an acceptable modern alternative.',
        priority: 5,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '15-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+15-23% form completion',
      });
    }
    
    // No form validation indicators
    const hasValidation = html.includes('required') || html.includes('pattern') || html.includes('validate');
    if (!hasValidation && totalFormFields > 0) {
      issues.push({
        id: 'conv-no-form-validation',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'Form Validation Not Detected',
        description: 'Forms may lack client-side validation. Users submit forms with errors and only find out after page reload, causing frustration.',
        impact: 'Real-time validation reduces form abandonment by 22%. Error messages after submission cause 30% of users to abandon.',
        suggestion: 'Add HTML5 validation attributes (required, type="email", pattern) and real-time JavaScript validation with clear inline error messages.',
        priority: 4,
        affectedUrls: pages.map(p => p.url),
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+15-22% form completion',
      });
    }
  }

  // --- Value Proposition ---

  private analyzeValueProposition(pages: PageData[], issues: AuditIssue[], html: string, text: string, $: CheerioProxy) {
    const mainPage = pages[0];
    
    // Check hero heading
    const h1Text = (mainPage.meta.h1[0] || '').toLowerCase();
    const h2Texts = (mainPage.meta.h2 || []).slice(0, 3).join(' ').toLowerCase();
    
    // Weak value prop indicators
    const weakHeadings = [
      'welcome', 'home', 'hello', 'hi there', 'we are', 'about us',
      'our company', 'introduction', 'welcome to', 'this is',
    ];
    
    const isWeakHeading = weakHeadings.some(wh => h1Text.includes(wh));
    
    if (isWeakHeading || h1Text.length < 10) {
      issues.push({
        id: 'conv-weak-hero',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'high',
        title: 'Hero Headline Does Not Communicate Value',
        description: `Your H1 heading ("${mainPage.meta.h1[0] || 'none found'}") does not clearly state the benefit users get. It reads like a greeting rather than a value proposition.`,
        impact: 'Users form an opinion about your site in 0.05 seconds. A weak headline fails the "what\'s in it for me?" test immediately.',
        suggestion: 'Rewrite your H1 to state the primary benefit: "[Product] helps [audience] [achieve result] in [timeframe]." Example: "Build Production-Ready Apps 10x Faster with AI-Powered Code Generation."',
        priority: 8,
        affectedUrls: [mainPage.url],
        timeToFix: '15-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-40% engagement increase',
      });
    }
    
    // Check for benefit-focused language
    const benefitWords = ['save', 'faster', 'easier', 'better', 'more', 'increase', 'reduce', 'boost',
                          'improve', 'automate', 'generate', 'free', 'instant', 'unlimited', 'proven',
                          'guaranteed', 'results', 'roi', 'revenue', 'growth', 'scale'];
    
    const heroSection = text.substring(0, 800);
    const hasBenefitLanguage = benefitWords.some(bw => heroSection.includes(bw));
    
    if (!hasBenefitLanguage && mainPage.meta.h1.length > 0) {
      issues.push({
        id: 'conv-no-benefits',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'medium',
        title: 'Hero Section Lacks Benefit-Focused Language',
        description: 'The first visible content area does not clearly articulate what benefit the user receives. Features are mentioned but outcomes are missing.',
        impact: 'Benefit-focused copy converts 25% better than feature-focused copy. Users care about outcomes, not specifications.',
        suggestion: 'Restate features as benefits. Instead of "Advanced Analytics Dashboard" use "See Exactly What\'s Driving Your Revenue in Real-Time." Add a 3-benefit bullet list under the hero.',
        priority: 6,
        affectedUrls: [mainPage.url],
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-30% conversion improvement',
      });
    }
    
    // Pricing visibility
    const hasPricingPage = pages.some(p => p.url.toLowerCase().includes('pric')) ||
                           text.includes('pricing') || text.includes('plan') || text.includes('subscription');
    const hasPricingCTA = text.includes('see pricing') || text.includes('view plans') || text.includes('pricing');
    
    if (!hasPricingPage && !hasPricingCTA) {
      const isLikelyProduct = ctaKeywords.some(kw => text.includes(kw));
      if (isLikelyProduct) {
        issues.push({
          id: 'conv-no-pricing-visibility',
          category: 'conversion',
          type: 'missing_cta',
          severity: 'low',
          title: 'Pricing Information Not Prominently Accessible',
          description: 'No clear pricing page or pricing CTA was found. Users need pricing transparency before making a purchase decision.',
          impact: 'Hidden pricing is the #1 reason for cart abandonment. 61% of users consider price the most important factor.',
          suggestion: 'Add a "Pricing" link to your main navigation. Include pricing anchors on your homepage hero ("Starting at $X/mo"). Show a pricing table with clear tiers.',
          priority: 5,
          affectedUrls: [mainPage.url],
          timeToFix: '1-2 hours',
          difficulty: 'medium',
          estimatedImpact: '+25-35% reduction in pricing-related bounce',
        });
      }
    }
  }

  // --- FOMO / Urgency ---

  private analyzeFOMO(pages: PageData[], issues: AuditIssue[], html: string, text: string) {
    const fomoPatterns = [
      /\b\d+\s*(spot|seat|slot|place|copy|item|unit)\s*left/i,
      /limited\s*(time|quantity|offer|edition)/i,
      /countdown|timer|expir/i,
      /\bonly\s+\d+\s+remaining/i,
      /ends?\s*(tonight|today|soon|soon)|last\s*chance/i,
      /\d+%\s*off\s*(today|now|only)/i,
      /while\s*(supplies|stock)\s*last/i,
    ];
    
    const hasFOMO = fomoPatterns.some(p => p.test(text));
    
    if (!hasFOMO) {
      issues.push({
        id: 'conv-no-fomo',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'No Urgency or Scarcity Elements Found',
        description: 'No countdown timers, limited availability messaging, or time-sensitive offers were detected. These elements create conversion momentum.',
        impact: 'Urgency tactics can increase conversions by 9-30% when used authentically. They reduce decision paralysis.',
        suggestion: 'Add authentic urgency: "Free trial ends in 24 hours", "Only 3 spots left at this price", seasonal offers, or flash sale banners. Avoid fake urgency — it damages trust.',
        priority: 3,
        affectedUrls: [pages[0]?.url],
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+9-30% conversion lift',
      });
    }
  }

  // --- Navigation Conversion ---

  private analyzeNavigationConversion(pages: PageData[], issues: AuditIssue[], html: string, $: CheerioProxy) {
    const mainPage = pages[0];
    const navLinks = $.find('nav a, header a, [role="navigation"] a');
    const navItemCount = navLinks.length;
    
    // Too many nav items
    if (navItemCount > 9) {
      issues.push({
        id: 'conv-nav-too-many',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'medium',
        title: `Navigation Contains ${navItemCount} Items — Too Many Choices`,
        description: `Your navigation has ${navItemCount} links. Hick's Law states: more choices = slower decisions. Overloaded navigation distracts from conversion goals.`,
        impact: 'Navigation with 7+ items reduces focus on primary CTAs by 40%. Users experience decision fatigue.',
        suggestion: 'Limit primary navigation to 5-7 items. Use dropdowns for secondary pages. Prioritize: Product, Pricing, Features, Resources, About, Contact.',
        priority: 5,
        affectedUrls: [mainPage.url],
        timeToFix: '15-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+15-25% focus on primary CTAs',
      });
    }
    
    // Footer completeness
    const footerLinks = $.find('footer a').length;
    if (footerLinks < 4) {
      issues.push({
        id: 'conv-sparse-footer',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'Footer Contains Too Few Links',
        description: `Only ${footerLinks} link${footerLinks === 1 ? '' : 's'} found in the footer. The footer is where users look for trust and legal information before converting.`,
        impact: '24% of users scroll to the footer before making a purchase decision. A sparse footer looks incomplete and reduces trust.',
        suggestion: 'Add to footer: About, Pricing, Blog, Contact, Privacy Policy, Terms, Social Links, and optionally a newsletter signup.',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '20-30 minutes',
        difficulty: 'easy',
        estimatedImpact: '+10-15% footer engagement',
      });
    }
  }

  // --- Landing Page Structure ---

  private analyzeLandingStructure(pages: PageData[], issues: AuditIssue[], html: string, text: string, $: CheerioProxy) {
    const mainPage = pages[0];
    
    // Check for feature/benefit sections
    const hasFeatureSection = text.includes('feature') || text.includes('benefit') || text.includes('why') || 
                               html.includes('feature') || $.find('section').length > 2;
    
    if (!hasFeatureSection) {
      issues.push({
        id: 'conv-no-features-section',
        category: 'conversion',
        type: 'weak_value_proposition',
        severity: 'medium',
        title: 'No Features or Benefits Section Found',
        description: 'The page lacks a dedicated section explaining what the product/service does and why users should care. The homepage appears to be just a hero with no supporting content.',
        impact: 'Homepages with 3+ content sections (features, benefits, testimonials, pricing) convert 3x better than single-section pages.',
        suggestion: 'Add sections: 3 Key Benefits (with icons), How It Works (3-4 steps), Social Proof, and a Final CTA. Each section should have its own heading and brief description.',
        priority: 6,
        affectedUrls: [mainPage.url],
        timeToFix: '2-4 hours',
        difficulty: 'medium',
        estimatedImpact: '+50-200% conversion improvement',
      });
    }
    
    // Check for FAQ section
    const hasFAQ = text.includes('frequently asked') || text.includes('faq') || html.includes('faq');
    if (!hasFAQ) {
      issues.push({
        id: 'conv-no-faq',
        category: 'conversion',
        type: 'missing_trust_signals',
        severity: 'low',
        title: 'FAQ Section Not Found',
        description: 'No FAQ section detected. FAQs address objections before they become barriers to conversion.',
        impact: 'Pages with FAQs see 17% higher conversion rates. They reduce support tickets by 25%.',
        suggestion: 'Add an FAQ section with 5-8 common questions: pricing, refunds, data security, cancellation, support response time, and integration questions.',
        priority: 3,
        affectedUrls: [mainPage.url],
        timeToFix: '30-60 minutes',
        difficulty: 'easy',
        estimatedImpact: '+10-17% conversion improvement',
      });
    }
    
    // Check for final CTA section before footer
    const hasFinalCTA = text.includes('get started') || text.includes('sign up') || text.includes('start free') || 
                        text.includes('try now') || text.includes('join');
    const footerIndex = html.lastIndexOf('</footer>');
    const lastCTAIndex = Math.max(
      html.lastIndexOf('get started'),
      html.lastIndexOf('sign up'),
      html.lastIndexOf('try free')
    );
    
    if (hasFinalCTA && footerIndex > 0 && lastCTAIndex > 0 && footerIndex - lastCTAIndex > 3000) {
      issues.push({
        id: 'conv-no-final-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'medium',
        title: 'No Final Call-to-Action Before Footer',
        description: 'The last CTA appears far from the footer. Users who scroll through your entire page need a final conversion opportunity at the bottom.',
        impact: 'Final CTAs before the footer capture 12-18% of scrollers who are ready to convert after consuming all content.',
        suggestion: 'Add a "Final CTA" section before the footer with a compelling headline, brief value recap, and prominent button. Use a contrasting background to make it stand out.',
        priority: 5,
        affectedUrls: [mainPage.url],
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+12-18% additional conversions',
      });
    }
  }

  // --- Mobile Conversion ---

  private analyzeMobileConversion(pages: PageData[], issues: AuditIssue[], html: string, $: CheerioProxy) {
    const mainPage = pages[0];
    
    // Check for sticky CTA on mobile
    const hasStickyCTA = html.includes('position: fixed') || html.includes('sticky') || html.includes('fixed-bottom');
    if (!hasStickyCTA) {
      issues.push({
        id: 'conv-no-sticky-mobile-cta',
        category: 'conversion',
        type: 'missing_cta',
        severity: 'low',
        title: 'No Sticky Mobile CTA Bar Detected',
        description: 'No fixed/sticky call-to-action element found for mobile users. Mobile users scroll extensively and need persistent access to the primary action.',
        impact: 'Sticky mobile CTAs increase mobile conversions by 15-25%. They eliminate the need to scroll back to the top to convert.',
        suggestion: 'Add a fixed bottom bar on mobile with your primary CTA (e.g., "Start Free Trial"). Keep it minimal: button + brief text. Dismissible on scroll up.',
        priority: 4,
        affectedUrls: [mainPage.url],
        timeToFix: '30-60 minutes',
        difficulty: 'medium',
        estimatedImpact: '+15-25% mobile conversion improvement',
      });
    }
    
    // Check for tap targets too small (already covered in mobile-audit but conversion angle)
    const smallTapTargets = $.find('a, button').filter((_: number, el: any) => {
      const style = (el.attrs["style"] || '').toLowerCase();
      const classes = (el.attrs["class"] || '').toLowerCase();
      const hasSmallClass = classes.includes('sm') || classes.includes('xs') || classes.includes('tiny');
      const hasSmallStyle = style.includes('width') && (style.includes('24') || style.includes('20') || style.includes('16'));
      return hasSmallClass || hasSmallStyle;
    }).length;
    
    if (smallTapTargets > 5) {
      issues.push({
        id: 'conv-small-tap-targets',
        category: 'conversion',
        type: 'text_too_small',
        severity: 'medium',
        title: `${smallTapTargets} Small Tap Targets Detected`,
        description: 'Multiple buttons and links appear too small for reliable mobile tapping. This frustrates users and causes accidental clicks.',
        impact: 'Small tap targets cause 32% of mobile form abandonment. Google recommends minimum 48x48px touch targets.',
        suggestion: 'Ensure all clickable elements are at least 48x48px. Increase padding on small buttons. Use larger font sizes for mobile (min 16px for inputs).',
        priority: 6,
        affectedUrls: [mainPage.url],
        timeToFix: '20-40 minutes',
        difficulty: 'easy',
        estimatedImpact: '+20-30% mobile UX improvement',
      });
    }
  }

  // --- Helpers ---

  private createCheerioProxy(html: string): CheerioProxy {
    // Simple DOM proxy using regex for server-side use without cheerio
    // This is a lightweight alternative that works in the server environment
    const elements: { tag: string; attrs: Record<string, string>; text: string }[] = [];
    
    // Extract all elements with their attributes
    const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/gi;
    let match;
    while ((match = tagRegex.exec(html)) !== null) {
      const tag = match[1].toLowerCase();
      const attrStr = match[2];
      const attrs: Record<string, string> = {};
      
      const attrRegex = /([a-zA-Z-]+)=["']([^"']*)["']/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
        attrs[attrMatch[1].toLowerCase()] = attrMatch[2];
      }
      
      elements.push({ tag, attrs, text: '' });
    }
    
    return {
      find: (selector: string) => {
        const parts = selector.split(/[\s>]/).filter(p => p);
        const matched = elements.filter(el => {
          return parts.some(part => {
            const tagMatch = el.tag === part.toLowerCase();
            const classMatch = part.startsWith('.') && (el.attrs['class'] || '').includes(part.slice(1));
            const idMatch = part.startsWith('#') && el.attrs['id'] === part.slice(1);
            const attrMatch = part.startsWith('[') && part.includes(']');
            const roleMatch = part.startsWith('[role=') && (el.attrs['role'] || '').includes(part.replace(/[\[\]"]/g, '').split('=')[1]);
            return tagMatch || classMatch || idMatch || roleMatch;
          });
        });
        
        return {
          length: matched.length,
          each: (fn: (index: number, el: any) => void) => {
            matched.forEach((el, i) => fn(i, { ...el, text: el.text }));
          },
          filter: (fn: (index: number, el: any) => boolean) => {
            const filtered = matched.filter((el, i) => fn(i, { ...el, text: el.text }));
            return {
              length: filtered.length,
            };
          },
          text: () => matched.map(el => el.text).join(' '),
          attr: (name: string) => matched.length > 0 ? matched[0].attrs[name] : undefined,
        };
      },
      text: () => '',
      attr: () => undefined,
    };
  }

  private createScore(score: number, totalChecks: number, passedChecks: number, issues: number): AuditScore {
    return {
      category: 'conversion',
      score: Math.min(100, Math.max(0, Math.round(score))),
      maxScore: 100,
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

// CTA keywords for value proposition check
const ctaKeywords = [
  'buy now', 'get started', 'sign up', 'sign up free', 'start free', 'try free',
  'download', 'subscribe', 'join now', 'register', 'create account', 'add to cart',
  'checkout', 'learn more', 'see pricing', 'get demo', 'book demo', 'contact us',
  'get quote', 'start trial', 'upgrade', 'claim', 'grab', 'unlock', 'discover',
  'explore', 'watch demo', 'schedule', 'request', 'apply now', 'enroll',
];

interface CheerioProxy {
  find: (selector: string) => ProxyResult;
  text: () => string;
  attr: (name: string) => string | undefined;
}

interface ProxyResult {
  length: number;
  each: (fn: (index: number, el: any) => void) => void;
  filter: (fn: (index: number, el: any) => boolean) => { length: number };
  text: () => string;
  attr: (name: string) => string | undefined;
}
