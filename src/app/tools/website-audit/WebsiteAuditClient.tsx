'use client';

import { useState, useCallback, useRef } from 'react';
import {
  trackAuditCompleted,
  trackAuditFailed,
  trackReportExported,
  safeHost,
} from '@/lib/analytics';
import AuditReport from './AuditReport';
import { generateTextReport, generateHTMLReport } from './generate-report';
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
  AlertTriangle,
  CheckCircle2,
  Download,
  RefreshCw,
  Sparkles,
  Terminal,
  Target,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { WebsiteAuditResult, AuditIssue, AuditScore, ContentAnalysis } from '@/lib/website-audit/types';

// Category icons and colors
const categoryConfig = {
  seo: { icon: Search, color: 'blue', label: 'SEO' },
  technical: { icon: Terminal, color: 'cyan', label: 'Technical SEO' },
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
  const [activeTab, setActiveTab] = useState('all-issues');
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const [psiStatus, setPsiStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle');
  const [progressLog, setProgressLog] = useState<string[]>([]);



  const [stats] = useState<AuditStats>({
    totalAudits: 3427,
    avgScore: 68.5,
    websitesChecked: 2841,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // The crawl route now budgets 45s and the function is capped at 60s. The
  // browser gives it a little more than that, so a network stall still ends in
  // a real error instead of a spinner that never stops.
  const CLIENT_TIMEOUT_MS = 70000;

  // Handle audit
  const handleAudit = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    const startedAt = Date.now();
    const targetHost = safeHost(url.trim());

    setIsAuditing(true);
    setError(null);
    setResult(null);
    setPsiStatus('idle');
    setProgressLog(['Initializing audit engine...', `Targeting ${url.trim()}...`]);

    const auditSteps = [
      'Fetching homepage...',
      'Parsing HTML structure...',
      'Checking robots.txt...',
      'Analyzing SEO meta tags...',
      'Scanning heading hierarchy...',
      'Checking images for alt text...',
      'Analyzing page performance...',
      'Checking security headers...',
      'Scanning accessibility...',
      'Analyzing content quality...',
      'Checking mobile responsiveness...',
      'Generating report...',
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < auditSteps.length) {
        setProgressLog(prev => [...prev, auditSteps[stepIndex]]);
        stepIndex++;
      }
    }, 400);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch('/api/website-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
        signal: controller.signal,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data || !data.success) {
        throw new Error(
          (data && data.error) ||
            `The audit service returned an error (${response.status}). Please try again.`
        );
      }

      clearInterval(progressInterval);
      setProgressLog(prev => [...prev, 'Done! Analysis complete.']);
      setResult(data.result);
      setActiveTab('all-issues');

      // PageSpeed comes from Google and can take 40 seconds on its own. The
      // report is already on screen by now, so it fills its section in when it
      // arrives. If it never does, every other section still works.
      const auditedUrl = data.result?.url || url.trim();
      setPsiStatus('loading');

      // 50s ceiling. Google can simply not answer, and a spinner that spins
      // for ever is worse than saying the data did not arrive.
      const psiController = new AbortController();
      const psiTimeout = setTimeout(() => psiController.abort(), 50000);

      fetch(`/api/website-audit/pagespeed?url=${encodeURIComponent(auditedUrl)}`, {
        signal: psiController.signal,
      })
        .then((res) => res.json())
        .then((psi) => {
          if (psi?.success && psi.pagespeed) {
            setResult((prev) => (prev ? { ...prev, pagespeed: psi.pagespeed } : prev));
            setPsiStatus('ready');
          } else {
            setPsiStatus('failed');
          }
        })
        .catch(() => setPsiStatus('failed'))
        .finally(() => clearTimeout(psiTimeout));

      trackAuditCompleted({
        targetHost,
        score: data.result?.overallScore ?? 0,
        durationMs: Date.now() - startedAt,
        issueCount: Array.isArray(data.result?.issues) ? data.result.issues.length : 0,
      });
    } catch (err) {
      clearInterval(progressInterval);
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      const message = aborted
        ? 'This site took too long to analyse and the audit was stopped. Large or slow sites can exceed the limit. Try again, or try a single page URL.'
        : err instanceof Error
          ? err.message
          : 'Audit failed. Please try again.';
      setError(message);
      trackAuditFailed({ targetHost, reason: aborted ? 'timeout' : message });
    } finally {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      abortRef.current = null;
      setIsAuditing(false);
    }
  }, [url]);

  // Handle copy
  const handleCopy = useCallback(async () => {
    if (!result) return;

    const report = generateTextReport(result);
    setCopyFailed(false);

    try {
      await navigator.clipboard.writeText(report);
    } catch {
      // The clipboard API refuses when the document is not focused, and some
      // browsers block it outright. Fall back to the old selection trick
      // rather than telling the user it worked when it did not.
      try {
        const area = document.createElement('textarea');
        area.value = report;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(area);
        if (!ok) throw new Error('copy-rejected');
      } catch {
        setCopyFailed(true);
        setTimeout(() => setCopyFailed(false), 4000);
        return;
      }
    }

    trackReportExported({ format: 'text', score: result.overallScore ?? 0 });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  // Handle PDF export
  const handleExportPDF = useCallback(() => {
    if (!result) return;

    // This used to call window.open, which popup blockers stop, and then
    // print() before the page had rendered, which produced a blank sheet on
    // the browsers that did let it through. A hidden iframe is never blocked
    // and we wait for its load event before printing.
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.position = 'fixed';
    frame.style.right = '0';
    frame.style.bottom = '0';
    frame.style.width = '0';
    frame.style.height = '0';
    frame.style.border = '0';

    frame.onload = () => {
      try {
        frame.contentWindow?.focus();
        frame.contentWindow?.print();
      } catch {
        // Nothing useful to do; the frame is cleaned up either way.
      }
      // Give the print dialog time to take its snapshot before removal.
      setTimeout(() => frame.remove(), 60000);
    };

    document.body.appendChild(frame);

    const doc = frame.contentDocument;
    if (!doc) {
      frame.remove();
      return;
    }

    doc.open();
    doc.write(generateHTMLReport(result));
    doc.close();

    trackReportExported({ format: 'pdf', score: result.overallScore ?? 0 });
  }, [result]);

  // Handle clear
  const handleClear = useCallback(() => {
    abortRef.current?.abort();
    setUrl('');
    setResult(null);
    setError(null);
    setActiveTab('all-issues');
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
          {/* No entrance animation here on purpose. This block holds the H1,
              which is the Largest Contentful Paint element. Fading it in from
              opacity 0 means Google cannot record the paint until the JS has
              downloaded, hydrated and finished animating. */}
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Free AI-Powered Website Analysis
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent">
                Free Website{' '}
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Audit Tool Online
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
              Run a free website audit and site health check online with our comprehensive SEO, performance, mobile UX, security, 
              accessibility, and content quality analyzer. Get instant scores and actionable fixes from our online website auditor. No signup needed.
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
                        <span className="hidden sm:inline">Scanning Website...</span>
                        <span className="sm:hidden">Scanning...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Audit Website</span>
                        <span className="sm:hidden">Audit</span>
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

              {/* Terminal Loading Animation */}
              <AnimatePresence>
                {isAuditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-6"
                  >
                    <div className="rounded-xl bg-slate-900 dark:bg-black border border-slate-700 dark:border-slate-800 overflow-hidden shadow-2xl">
                      {/* Terminal Header */}
                      <div className="flex items-center gap-2 px-4 py-3 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500" />
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="flex-1 text-center text-xs text-slate-400 font-mono">
                          DevelopersMatrix Audit Engine
                        </div>
                        <Terminal className="w-4 h-4 text-slate-500" />
                      </div>
                      {/* Terminal Body */}
                      <div className="p-4 font-mono text-sm min-h-[200px]">
                        {progressLog.map((line, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-start gap-2 py-0.5"
                          >
                            <span className="text-green-400 flex-shrink-0">➜</span>
                            <span className="text-slate-300">{line}</span>
                            {i === progressLog.length - 1 && isAuditing && (
                              <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1" />
                            )}
                          </motion.div>
                        ))}
                        {progressLog.length > 0 && !isAuditing && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 py-2 mt-2 border-t border-slate-700"
                          >
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Audit complete. {result?.issues.length} issues found.</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {result && !isAuditing && (
        <section className="relative bg-[#f5f6f8] dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <AuditReport
              result={result}
              onReset={handleClear}
              onExportPdf={handleExportPDF}
              onCopy={handleCopy}
              copyFailed={copyFailed}
              psiStatus={psiStatus}
              copied={copied}
            />
          </div>
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
                Our free AI-powered website audit tool analyzes around 150 technical and on-page factors 
                that search engines like Google use to rank your site. From broken links and slow page speeds 
                to missing meta tags and poor mobile usability. We catch issues that could be holding 
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
                  <span><strong>Around 150 Checks:</strong> SEO, technical, speed, mobile, security, accessibility, content, conversion</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  <span><strong>Quick Wins:</strong> Focus on high-impact, easy-to-implement fixes first</span>
                </li>
              </ul>
            </div>
          </div>

          {/* The FAQ section lives in page.tsx so the answers render server side
              and match the FAQPage schema exactly. Do not add a second set here. */}
          <div>
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
