'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Globe,
  Search,
  Shield,
  Gauge,
  Smartphone,
  Accessibility,
  FileText,
  Target,
  ArrowRight,
  Sparkles,
  BarChart3,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function WebsiteAuditSection() {
  const [url, setUrl] = useState('');

  const features = [
    { icon: Search, label: 'SEO', color: 'text-blue-500' },
    { icon: Gauge, label: 'Performance', color: 'text-orange-500' },
    { icon: Smartphone, label: 'Mobile', color: 'text-purple-500' },
    { icon: Shield, label: 'Security', color: 'text-red-500' },
    { icon: Accessibility, label: 'Accessibility', color: 'text-green-500' },
    { icon: FileText, label: 'Content', color: 'text-indigo-500' },
  ];

  const trustMetrics = [
    { value: '3,400+', label: 'Websites Audited', icon: <Globe className="w-4 h-4" /> },
    { value: '100%', label: 'Free Forever', icon: <Zap className="w-4 h-4" /> },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-200/30 dark:from-blue-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-200/20 dark:from-purple-900/10 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Popular Tool
              </span>
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs border-0 animate-pulse">
                NEW
              </Badge>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-slate-900 dark:text-white">
                AI Website
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Audit Tool
              </span>
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
              Get a comprehensive website health check in seconds. Analyze SEO, performance, 
              mobile UX, security, accessibility, and content quality — all powered by AI, 
              completely free.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Trust Metrics */}
            <div className="flex flex-wrap gap-6 mb-8">
              {trustMetrics.map((metric, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-blue-500">{metric.icon}</span>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{metric.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{metric.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link href="/tools/website-audit">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 px-8 py-6 text-lg rounded-xl group">
                Start Free Audit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Right Side - Demo Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Website Audit</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enter URL to analyze</p>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="p-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 mb-6">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                </div>

                <Link href={`/tools/website-audit${url ? `?url=${encodeURIComponent(url)}` : ''}`} className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-xl">
                    <Search className="w-5 h-5 mr-2" />
                    Audit Website Now
                  </Button>
                </Link>

                {/* Sample Score Display */}
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-3">Sample Score Preview</div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-700 dark:text-slate-300">Overall Health</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">78/100</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'SEO', score: 85, color: 'bg-green-500' },
                      { label: 'Performance', score: 62, color: 'bg-yellow-500' },
                      { label: 'Security', score: 90, color: 'bg-green-500' },
                    ].map((item, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{item.label}</div>
                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white mt-1">{item.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
