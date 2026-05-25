'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Wrench, TrendingUp, Shield, Users, Cookie, BookOpen, Globe } from 'lucide-react';
import { tools } from '@/data/tools';
import { getAllBlogPosts } from '@/data/blog';
import { getAllTrendSlugs, getTrendBySlug } from '@/data/trends-data';

export function SiteMapHub() {
  const allTools = tools;
  const allBlogPosts = getAllBlogPosts().slice(0, 10);
  const allTrendSlugs = getAllTrendSlugs();
  const allTrends = allTrendSlugs.map(slug => getTrendBySlug(slug)).filter(Boolean);

  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Browse Everything
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Explore Our Complete Collection
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover all free AI tools, tech trend reports, career guides, and resources — no signup required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Tools Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">All Free Tools</h3>
            </div>
            <ul className="space-y-2">
              {allTools.map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Blog Posts Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Latest Blog Posts</h3>
            </div>
            <ul className="space-y-2">
              {allBlogPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1">{post.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/blog"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mt-3 inline-block"
            >
              View all blog posts →
            </Link>
          </motion.div>

          {/* Trends Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Tech Trends 2026</h3>
            </div>
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {allTrends.map((trend) => (
                <li key={trend!.slug}>
                  <Link
                    href={`/trends/${trend!.slug}`}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    <span className="line-clamp-1">{trend!.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/trends"
              className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline mt-3 inline-block"
            >
              View all trends →
            </Link>
          </motion.div>

          {/* Info & Research Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Research & Resources</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Original Research</span>
              </li>
              <li>
                <Link
                  href="/research/website-audit-statistics-2026"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Website Audit Statistics 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/research/developer-salary-guide-2026"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Developer Salary Guide 2026
                </Link>
              </li>
              <li>
                <Link
                  href="/research/ats-resume-optimization-guide-2026"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  ATS Resume Optimization Guide
                </Link>
              </li>
              <li>
                <Link
                  href="/research/developer-habits-productivity-guide-2026"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Developer Habits & Productivity
                </Link>
              </li>
              <li>
                <Link
                  href="/research/developer-financial-planning-guide-2026"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Developer Financial Planning
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Legal & Info</span>
              </li>
              <li>
                <Link
                  href="/community"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3 h-3 shrink-0" />
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3 h-3 shrink-0" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3 shrink-0" />
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Cookie className="w-3 h-3 shrink-0" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
