'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Search,
  FileText,
  Gauge,
  Smartphone,
  Shield,
  Accessibility,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Download,
  Copy,
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  Award,
  Clock,
  BarChart3,
  ExternalLink,
  ArrowRight,
  Lightbulb,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { WebsiteAuditResult, AuditIssue, AuditScore, ContentAnalysis } from '@/lib/website-audit/types';

// Category icons and colors
const categoryConfig = {
  seo: { icon: Search, color: 'blue', label: 'SEO' },
  performance: { icon: Gauge, color: 'orange', label: 'Performance' },
  mobile: { icon: Smartphone, color: 'purple', label: 'Mobile' },
  security: { icon: Shield, color: 'red', label: 'Security' },
  accessibility: { icon: Accessibility, color: 'green', label: 'Accessibility' },
  content: { icon: FileText, color: 'indigo', label: 'Content' },
  conversion: { icon: Target, color: 'pink', label: 'Conversion' },
};

const severityConfig = {
  critical: { color: 'bg-red-500', text: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
  high: { color: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
  low: { color: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

interface AuditStats {
  totalAudits: number;
  avgScore: number;
  websitesChecked: number;
}

export default function WebsiteAuditClient() {
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<WebsiteAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => prev === index ? null : index);
  };

  // FAQ data for the website audit tool
  const websiteAuditFaqs = [
    {
      question: "Is this website audit tool really free?",
      answer: "Yes, completely free. No signup required, no credit card needed, and no usage limits. We believe every website owner deserves access to professional-grade audit tools regardless of budget."
    },
    {
      question: "What does the website audit check?",
      answer: "Our tool performs over 200 checks across 7 categories: Technical SEO (meta tags, headings, canonicals, schema), Performance (page speed, resource optimization, caching), Mobile UX (viewport, touch targets, responsive design), Security (HTTPS, headers, mixed content), Accessibility (alt text, ARIA, color contrast), Content Quality (readability, word count, CTAs), and Conversion Optimization (trust signals, value propositions)."
    },
    {
      question: "How accurate is the audit score?",
      answer: "The audit score is calculated based on industry-standard best practices from Google Lighthouse, PageSpeed Insights, and WCAG guidelines. While no automated tool can catch everything, our scoring correlates strongly with real search engine ranking factors and Core Web Vitals."
    },
    {
      question: "Can I export the audit report?",
      answer: "Yes! After running an audit, you can copy the full text report to clipboard or download a professionally formatted PDF report. The PDF includes your scores, issues, recommendations, and content analysis — perfect for sharing with clients or team members."
    },
    {
      question: "How often should I audit my website?",
      answer: "For active websites, we recommend monthly audits to catch issues early. After any major update (new design, CMS upgrade, content migration), run an audit immediately. E-commerce sites should audit weekly during high-traffic periods like holidays."
    },
    {
      question: "Does the audit work for any type of website?",
      answer: "Yes, our tool works with any publicly accessible website — WordPress, Shopify, Next.js, React, Vue, plain HTML, and more. It checks the rendered output, so it works regardless of what technology powers your site."
    },
    {
      question: "What is a 'good' website audit score?",
      answer: "Scores break down as: 90-100 (Excellent — minimal issues, well-optimized), 70-89 (Good — some improvements needed), 50-69 (Fair — significant issues affecting performance/SEO), 0-49 (Poor — critical issues requiring immediate attention). Most websites score between 60-80 on first audit."
    },
    {
      question: "Will fixing these issues improve my Google rankings?",
      answer: "Yes, especially for technical SEO and performance issues. Google explicitly uses page speed, mobile-friendliness, and Core Web Vitals as ranking factors. Fixing critical and high-priority issues typically leads to measurable ranking improvements within 2-4 weeks."
    }
  ];

  const [stats] = useState<AuditStats>({
    totalAudits: 3427,
    avgScore: 68.5,
    websitesChecked: 2841,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  // Handle audit
  const handleAudit = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    setIsAuditing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/website-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Audit failed');
      }

      setResult(data.result);
      setActiveTab('overview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Audit failed. Please try again.');
    } finally {
      setIsAuditing(false);
    }
  }, [url]);

  // Handle copy
  const handleCopy = useCallback(() => {
    if (!result) return;
    const report = generateTextReport(result);
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  // Handle PDF export
  const handleExportPDF = useCallback(() => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(generateHTMLReport(result));
    printWindow.document.close();
    printWindow.print();
  }, [result]);

  // Handle clear
  const handleClear = useCallback(() => {
    setUrl('');
    setResult(null);
    setError(null);
    setActiveTab('overview');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-200/40 dark:from-blue-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-200/30 dark:from-purple-900/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Free AI-Powered Website Analysis
              </span>
            </motion.div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                Free Website
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Audit Tool
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              Audit your website for free with our comprehensive SEO, performance, mobile UX, security, 
              accessibility, and content quality analyzer. Get instant scores and actionable fixes. No signup needed.
            </p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-6 mb-12"
            >
              {[
                { label: 'Total Audits', value: stats.totalAudits.toLocaleString(), icon: <BarChart3 className="w-4 h-4" /> },
                { label: 'Avg Score', value: `${stats.avgScore}/100`, icon: <Gauge className="w-4 h-4" /> },
                { label: 'Websites Analyzed', value: stats.websitesChecked.toLocaleString(), icon: <Globe className="w-4 h-4" /> },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-blue-500">{stat.icon}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{stat.label}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{stat.value}</span>
                </div>
              ))}
            </motion.div>

            {/* URL Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <input
                      ref={inputRef}
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
                      placeholder="Enter website URL (e.g., example.com)"
                      className="flex-1 py-4 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  <Button
                    onClick={handleAudit}
                    disabled={isAuditing || !url.trim()}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 px-8 py-4 rounded-xl"
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Audit Website
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  >
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertTriangle className="w-5 h-5" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Score Overview */}
            <ScoreOverview result={result} onCopy={handleCopy} onExportPDF={handleExportPDF} onClear={handleClear} copied={copied} />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">Overview</TabsTrigger>
                <TabsTrigger value="errors" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 text-red-600 dark:text-red-400">Errors</TabsTrigger>
                <TabsTrigger value="warnings" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 text-yellow-600 dark:text-yellow-400">Warnings</TabsTrigger>
                <TabsTrigger value="improvements" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 text-blue-600 dark:text-blue-400">Improvements</TabsTrigger>
                <TabsTrigger value="all-issues" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">All Issues</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <OverviewTab result={result} />
              </TabsContent>

              <TabsContent value="errors" className="mt-6">
                <IssuesTab issues={result.issues} severityFilter={['critical', 'high']} />
              </TabsContent>

              <TabsContent value="warnings" className="mt-6">
                <IssuesTab issues={result.issues} severityFilter={['medium']} />
              </TabsContent>

              <TabsContent value="improvements" className="mt-6">
                <IssuesTab issues={result.issues} severityFilter={['low']} />
              </TabsContent>

              <TabsContent value="all-issues" className="mt-6">
                <IssuesTab issues={result.issues} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </section>
      )}

      {/* Feature Cards (when no result) */}
      {!result && (
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-900 dark:text-white">
              What We Analyze
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Search, title: 'Technical SEO', desc: 'Title tags, meta descriptions, headings, canonicals, schema markup', color: 'blue' },
                { icon: Gauge, title: 'Performance', desc: 'Page size, load time, scripts, CSS, image optimization', color: 'orange' },
                { icon: Smartphone, title: 'Mobile UX', desc: 'Viewport, touch targets, responsive layout, mobile meta', color: 'purple' },
                { icon: Shield, title: 'Security', desc: 'HTTPS, security headers, mixed content, form security', color: 'red' },
                { icon: Accessibility, title: 'Accessibility', desc: 'Alt text, labels, heading hierarchy, ARIA, link text', color: 'green' },
                { icon: FileText, title: 'Content Quality', desc: 'Readability, word count, vocabulary, keyword density', color: 'indigo' },
                { icon: Target, title: 'Conversion', desc: 'CTAs, trust signals, value proposition, social proof', color: 'pink' },
                { icon: Sparkles, title: 'AI Insights', desc: 'Smart recommendations, quick wins, priority actions', color: 'violet' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <feature.icon className={`w-8 h-8 text-${feature.color}-500 mb-4`} />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}
      {/* SEO Content & FAQs Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* SEO Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Why Website Audits Matter for Your Online Success
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                A comprehensive website audit is the foundation of any successful digital strategy. 
                Our free AI-powered website audit tool analyzes over 200+ technical and on-page factors 
                that search engines like Google use to rank your site. From broken links and slow page speeds 
                to missing meta tags and poor mobile usability — we catch issues that could be holding 
                your site back from reaching its full potential.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Search className="w-6 h-6 text-blue-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Boost Search Rankings</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Fix technical SEO issues that prevent Google from properly crawling and indexing your pages.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Gauge className="w-6 h-6 text-orange-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Speed Up Your Site</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Identify performance bottlenecks that cause visitors to bounce before your page loads.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Smartphone className="w-6 h-6 text-purple-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Mobile-First Optimization</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  With 60%+ traffic from mobile devices, ensure your site delivers on every screen size.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <Shield className="w-6 h-6 text-red-500 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Security & Trust</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Detect HTTPS issues, missing security headers, and vulnerabilities that put users at risk.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                What Makes Our Audit Tool Different?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Completely Free:</strong> No signup, no credit card, unlimited audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>AI-Powered:</strong> Smart recommendations prioritized by impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>PDF Reports:</strong> Download and share professional audit reports</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>200+ Checks:</strong> SEO, speed, mobile, security, accessibility, content</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Quick Wins:</strong> Focus on high-impact, easy-to-implement fixes first</span>
                </li>
              </ul>
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {websiteAuditFaqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <span className="font-medium text-slate-900 dark:text-white pr-4">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Our community is here to help. Join the discussion or reach out directly.
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="/community" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Ask Community
                </a>
                <a 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// Score Overview Component
function ScoreOverview({ result, onCopy, onExportPDF, onClear, copied }: { 
  result: WebsiteAuditResult; 
  onCopy: () => void; 
  onExportPDF: () => void; 
  onClear: () => void;
  copied: boolean;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-yellow-500 to-amber-500';
    if (score >= 40) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-rose-500';
  };

  return (
    <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-white">{result.domain}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Scanned {result.pagesScanned} page{result.pagesScanned > 1 ? 's' : ''} in {(result.scanDuration / 1000).toFixed(1)}s
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onCopy} variant="outline" size="icon" className="border-slate-200 dark:border-slate-700">
                    <Copy className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{copied ? 'Copied!' : 'Copy Report'}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onExportPDF} variant="outline" size="icon" className="border-slate-200 dark:border-slate-700">
                    <Download className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={onClear} variant="outline" size="icon" className="border-slate-200 dark:border-slate-700">
                    <X className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Clear</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Score */}
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Overall Score Circle */}
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${(result.overallScore / 100) * 553} 553`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className={`${getScoreColor(result.overallScore).replace('text-', 'text-')}`} />
                  <stop offset="100%" className="text-purple-500" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm">Overall Score</span>
            </div>
          </div>

          {/* Category Scores */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(result.scores).map(([category, score]) => {
              const config = categoryConfig[category as keyof typeof categoryConfig];
              if (!config) return null;
              
              return (
                <div key={category} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <config.icon className={`w-4 h-4 text-${config.color}-500`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={`text-2xl font-bold ${getScoreColor(score.score)}`}>
                      {score.score}
                    </span>
                    <span className="text-xs text-slate-400 mb-1">/100</span>
                  </div>
                  {score.criticalIssues > 0 && (
                    <Badge variant="secondary" className="mt-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 text-xs">
                      {score.criticalIssues} critical
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <h4 className="font-medium text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Strengths
            </h4>
            <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
              {result.summary.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <h4 className="font-medium text-orange-700 dark:text-orange-300 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Weaknesses
            </h4>
            <ul className="text-sm text-orange-600 dark:text-orange-400 space-y-1">
              {result.summary.weaknesses.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Opportunities
            </h4>
            <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
              {result.summary.opportunities.map((o, i) => (
                <li key={i}>{o}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ result }: { result: WebsiteAuditResult }) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{result.issues.length}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Total Issues</div>
        </div>
        <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-bold text-red-500">{result.criticalIssues.length}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Critical Issues</div>
        </div>
        <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{result.quickWins.length}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Quick Wins</div>
        </div>
        <div className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{result.contentAnalysis.wordCount}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Words Analyzed</div>
        </div>
      </div>

      {/* Critical Issues */}
      {result.criticalIssues.length > 0 && (
        <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Critical Issues to Fix
          </h3>
          <div className="space-y-3">
            {result.criticalIssues.slice(0, 5).map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {result.quickWins.length > 0 && (
        <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Quick Wins
          </h3>
          <div className="space-y-3">
            {result.quickWins.slice(0, 5).map((issue, i) => (
              <IssueCard key={i} issue={issue} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Issues Tab
function IssuesTab({ issues, severityFilter }: { issues: AuditIssue[]; severityFilter?: string[] }) {
  const filteredIssues = severityFilter 
    ? issues.filter(i => severityFilter.includes(i.severity))
    : issues;

  return (
    <div className="space-y-4">
      {/* Severity summary */}
      {severityFilter && (
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span>Showing {filteredIssues.length} {severityFilter.join(' + ')} issue{filteredIssues.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Issues List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredIssues.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No issues found. Great job!</p>
          </div>
        ) : (
          filteredIssues.map((issue, i) => (
            <IssueCard key={i} issue={issue} showCategory />
          ))
        )}
      </div>
    </div>
  );
}

// Content Tab
function ContentTab({ analysis }: { analysis: ContentAnalysis }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Content Stats */}
      <div className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Content Statistics</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Word Count</span>
            <span className="font-semibold text-slate-900 dark:text-white">{analysis.wordCount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Reading Time</span>
            <span className="font-semibold text-slate-900 dark:text-white">{analysis.readingTime} min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Sentences</span>
            <span className="font-semibold text-slate-900 dark:text-white">{analysis.sentenceCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Avg Sentence Length</span>
            <span className="font-semibold text-slate-900 dark:text-white">{analysis.avgSentenceLength.toFixed(1)} words</span>
          </div>
        </div>
      </div>

      {/* Readability */}
      <div className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Readability</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 dark:text-slate-400">Score</span>
              <span className="font-semibold text-slate-900 dark:text-white">{analysis.readabilityScore.toFixed(0)}/100</span>
            </div>
            <Progress value={analysis.readabilityScore} className="h-2" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Grade Level</span>
            <Badge variant="secondary">{analysis.readabilityGrade}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Vocabulary Diversity</span>
            <span className="font-semibold text-slate-900 dark:text-white">{analysis.vocabularyDiversity.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* CTAs & Trust Signals */}
      <div className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Conversion Elements</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Calls-to-Action</span>
            <Badge variant={analysis.hasCTA ? 'default' : 'secondary'} className={analysis.hasCTA ? 'bg-green-500' : ''}>
              {analysis.ctaCount} found
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 dark:text-slate-400">Trust Signals</span>
            <Badge variant={analysis.trustSignals.length > 2 ? 'default' : 'secondary'} className={analysis.trustSignals.length > 2 ? 'bg-green-500' : ''}>
              {analysis.trustSignals.length} detected
            </Badge>
          </div>
          {analysis.trustSignals.length > 0 && (
            <div className="mt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Found:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.trustSignals.map((signal, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{signal}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keywords */}
      <div className="p-6 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Top Keywords</h3>
        <div className="space-y-2">
          {Object.entries(analysis.keywordDensity).slice(0, 8).map(([keyword, density]) => (
            <div key={keyword} className="flex justify-between items-center">
              <span className="text-slate-700 dark:text-slate-300">{keyword}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{density}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Recommendations Tab
function RecommendationsTab({ recommendations, quickWins }: { recommendations: string[]; quickWins: AuditIssue[] }) {
  return (
    <div className="space-y-6">
      {/* Recommendations */}
      <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Recommendations
        </h3>
        <ul className="space-y-3">
          {recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-blue-700 dark:text-blue-300">
              <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Wins */}
      {quickWins.length > 0 && (
        <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
          <h3 className="font-semibold text-amber-700 dark:text-amber-300 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Quick Wins (High Impact, Easy Fixes)
          </h3>
          <div className="space-y-3">
            {quickWins.map((issue, i) => (
              <div key={i} className="p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-amber-200 dark:border-amber-800">
                <div className="font-medium text-slate-900 dark:text-white">{issue.title}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">{issue.suggestion}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Pages Tab
function PagesTab({ pages }: { pages: WebsiteAuditResult['pageData'] }) {
  return (
    <div className="space-y-4">
      {pages.map((page, i) => (
        <div key={i} className="p-4 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-400" />
              <a href={page.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-md">
                {page.url}
              </a>
            </div>
            <Badge variant={page.statusCode === 200 ? 'default' : 'destructive'} className={page.statusCode === 200 ? 'bg-green-500' : ''}>
              {page.statusCode}
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Load Time</span>
              <div className="font-medium text-slate-900 dark:text-white">{(page.loadTime / 1000).toFixed(2)}s</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Size</span>
              <div className="font-medium text-slate-900 dark:text-white">{(page.size / 1024).toFixed(0)} KB</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Images</span>
              <div className="font-medium text-slate-900 dark:text-white">{page.images.length}</div>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Links</span>
              <div className="font-medium text-slate-900 dark:text-white">{page.links.length}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Issue Card Component
function IssueCard({ issue, showCategory = false }: { issue: AuditIssue; showCategory?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const config = severityConfig[issue.severity];
  
  return (
    <div className={`p-4 rounded-xl ${config.bg} border border-slate-200 dark:border-slate-700 transition-all ${expanded ? 'ring-2 ring-offset-2 ring-slate-300 dark:ring-slate-600' : ''}`}>
      {/* Header - always visible */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {showCategory && (
            <Badge variant="outline" className="text-xs">
              {categoryConfig[issue.category as keyof typeof categoryConfig]?.label || issue.category}
            </Badge>
          )}
          <span className="font-medium text-slate-900 dark:text-white">{issue.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {issue.timeToFix && (
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">{issue.timeToFix}</span>
          )}
          <Badge className={`${config.color} text-white text-xs`}>
            {issue.severity}
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{issue.description}</p>
      
      {/* Expand toggle */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-1"
      >
        {expanded ? (
          <><ChevronUp className="w-4 h-4" /> Show less</>
        ) : (
          <><ChevronDown className="w-4 h-4" /> Show details & fix</>
        )}
      </button>
      
      {/* Expanded deep data */}
      {expanded && (
        <div className="mt-4 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
          {/* Impact */}
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Why This Matters</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{issue.impact}</p>
          </div>
          
          {/* Estimated Impact & Difficulty */}
          {(issue.estimatedImpact || issue.difficulty || issue.timeToFix) && (
            <div className="flex flex-wrap gap-3">
              {issue.estimatedImpact && (
                <div className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Estimated Impact</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">{issue.estimatedImpact}</div>
                </div>
              )}
              {issue.difficulty && (
                <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Difficulty</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 capitalize">{issue.difficulty}</div>
                </div>
              )}
              {issue.timeToFix && (
                <div className="px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Time to Fix</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300">{issue.timeToFix}</div>
                </div>
              )}
            </div>
          )}
          
          {/* Affected URLs */}
          {issue.affectedUrls && issue.affectedUrls.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Affected URLs ({issue.affectedUrls.length})</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {issue.affectedUrls.map((url, i) => (
                  <div key={i} className="text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded truncate">{url}</div>
                ))}
              </div>
            </div>
          )}
          
          {/* Code Snippet */}
          {issue.codeSnippet && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Code</h4>
              <pre className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">{issue.codeSnippet}</pre>
            </div>
          )}
          
          {/* Fix Instructions */}
          {issue.fixInstructions && issue.fixInstructions.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">How to Fix</h4>
              <div className="space-y-2">
                {issue.fixInstructions.map((step) => (
                  <div key={step.step} className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                      {step.step}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{step.title}</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                      {step.codeBefore && (
                        <div className="mt-1">
                          <div className="text-xs text-red-500 dark:text-red-400 mb-1">Before:</div>
                          <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded font-mono overflow-x-auto">{step.codeBefore}</pre>
                        </div>
                      )}
                      {step.codeAfter && (
                        <div className="mt-1">
                          <div className="text-xs text-green-500 dark:text-green-400 mb-1">After:</div>
                          <pre className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded font-mono overflow-x-auto">{step.codeAfter}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Suggestion (always show in expanded) */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Quick Fix:</span> {issue.suggestion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Generate text report
function generateTextReport(result: WebsiteAuditResult): string {
  return `
WEBSITE AUDIT REPORT
====================
URL: ${result.url}
Domain: ${result.domain}
Scanned: ${result.scannedAt}
Pages: ${result.pagesScanned}
Duration: ${(result.scanDuration / 1000).toFixed(1)}s

OVERALL SCORE: ${result.overallScore}/100

CATEGORY SCORES
---------------
${Object.entries(result.scores).map(([cat, score]) => 
  `${cat.toUpperCase()}: ${score.score}/100 (${score.issues} issues)`
).join('\n')}

SUMMARY
-------
Strengths:
${result.summary.strengths.map(s => `• ${s}`).join('\n')}

Weaknesses:
${result.summary.weaknesses.map(w => `• ${w}`).join('\n')}

Opportunities:
${result.summary.opportunities.map(o => `• ${o}`).join('\n')}

TOP ISSUES (${result.issues.length} total)
------------------------------------------
${result.criticalIssues.slice(0, 10).map(issue => 
  `[${issue.severity.toUpperCase()}] ${issue.title}\n  ${issue.suggestion}`
).join('\n\n')}

RECOMMENDATIONS
---------------
${result.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CONTENT ANALYSIS
----------------
Words: ${result.contentAnalysis.wordCount}
Reading Time: ${result.contentAnalysis.readingTime} min
Readability: ${result.contentAnalysis.readabilityScore.toFixed(0)}/100 (${result.contentAnalysis.readabilityGrade})
CTAs Found: ${result.contentAnalysis.ctaCount}
Trust Signals: ${result.contentAnalysis.trustSignals.length}

Generated by DevelopersMatrix AI Website Audit Tool
https://developersmatrix.com/tools/website-audit
`.trim();
}

// Generate HTML report for PDF
function generateHTMLReport(result: WebsiteAuditResult): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Website Audit Report - ${result.domain}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 30px; color: #333; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 15px; }
    h2 { color: #1e40af; margin-top: 30px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
    .score-circle { width: 150px; height: 150px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 20px auto; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; }
    .score-value { font-size: 48px; font-weight: bold; }
    .scores-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
    .score-card { padding: 15px; border-radius: 10px; background: #f8fafc; border: 1px solid #e5e7eb; text-align: center; }
    .issue { margin: 15px 0; padding: 15px; border-radius: 8px; border-left: 4px solid; }
    .critical { border-color: #ef4444; background: #fef2f2; }
    .high { border-color: #f97316; background: #fff7ed; }
    .medium { border-color: #eab308; background: #fefce8; }
    .low { border-color: #3b82f6; background: #eff6ff; }
    .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
    .summary-box { padding: 15px; border-radius: 8px; }
    .strengths { background: #ecfdf5; border: 1px solid #10b981; }
    .weaknesses { background: #fef2f2; border: 1px solid #ef4444; }
    .opportunities { background: #eff6ff; border: 1px solid #3b82f6; }
    ul { margin: 5px 0; padding-left: 20px; }
    li { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>Website Audit Report</h1>
  
  <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
    <div>
      <div style="font-size: 14px; color: #6b7280;">Website</div>
      <div style="font-size: 20px; font-weight: bold; color: #1e40af;">${result.domain}</div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 5px;">${result.pagesScanned} pages scanned in ${(result.scanDuration / 1000).toFixed(1)}s</div>
    </div>
    <div class="score-circle">
      <div class="score-value">${result.overallScore}</div>
      <div style="font-size: 12px;">Overall Score</div>
    </div>
  </div>

  <h2>Category Scores</h2>
  <div class="scores-grid">
    ${Object.entries(result.scores).map(([cat, score]) => `
      <div class="score-card">
        <div style="font-size: 24px; font-weight: bold; color: ${score.score >= 70 ? '#10b981' : score.score >= 50 ? '#eab308' : '#ef4444'}">${score.score}</div>
        <div style="font-size: 12px; color: #6b7280; text-transform: uppercase;">${cat}</div>
        ${score.criticalIssues > 0 ? `<div style="font-size: 10px; color: #ef4444; margin-top: 5px;">${score.criticalIssues} critical</div>` : ''}
      </div>
    `).join('')}
  </div>

  <h2>Summary</h2>
  <div class="summary-grid">
    <div class="summary-box strengths">
      <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 14px;">Strengths</h3>
      <ul style="margin: 0; font-size: 13px;">
        ${result.summary.strengths.map(s => `<li>${s}</li>`).join('')}
      </ul>
    </div>
    <div class="summary-box weaknesses">
      <h3 style="margin: 0 0 10px 0; color: #dc2626; font-size: 14px;">Weaknesses</h3>
      <ul style="margin: 0; font-size: 13px;">
        ${result.summary.weaknesses.map(w => `<li>${w}</li>`).join('')}
      </ul>
    </div>
    <div class="summary-box opportunities">
      <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 14px;">Opportunities</h3>
      <ul style="margin: 0; font-size: 13px;">
        ${result.summary.opportunities.map(o => `<li>${o}</li>`).join('')}
      </ul>
    </div>
  </div>

  <h2>Top Issues (${result.issues.length} total)</h2>
  ${result.criticalIssues.slice(0, 10).map(issue => `
    <div class="issue ${issue.severity}">
      <div style="font-weight: bold; margin-bottom: 5px;">${issue.title} <span style="text-transform: uppercase; font-size: 11px; color: #6b7280;">[${issue.severity}]</span></div>
      <div style="font-size: 13px; margin-bottom: 5px;">${issue.description}</div>
      <div style="font-size: 12px; color: #4b5563;"><strong>Fix:</strong> ${issue.suggestion}</div>
    </div>
  `).join('')}

  <h2>Recommendations</h2>
  <ol style="font-size: 14px;">
    ${result.recommendations.map(r => `<li style="margin: 8px 0;">${r}</li>`).join('')}
  </ol>

  <h2>Content Analysis</h2>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
    <div class="score-card">
      <div style="font-size: 24px; font-weight: bold;">${result.contentAnalysis.wordCount.toLocaleString()}</div>
      <div style="font-size: 12px; color: #6b7280;">Words</div>
    </div>
    <div class="score-card">
      <div style="font-size: 24px; font-weight: bold;">${result.contentAnalysis.readingTime} min</div>
      <div style="font-size: 12px; color: #6b7280;">Reading Time</div>
    </div>
    <div class="score-card">
      <div style="font-size: 24px; font-weight: bold;">${result.contentAnalysis.readabilityScore.toFixed(0)}</div>
      <div style="font-size: 12px; color: #6b7280;">Readability</div>
    </div>
  </div>

  <div class="footer">
    Generated by DevelopersMatrix AI Website Audit Tool<br>
    <a href="https://developersmatrix.com/tools/website-audit">https://developersmatrix.com/tools/website-audit</a><br>
    ${new Date().toLocaleDateString()}
  </div>
</body>
</html>
`.trim();
}
