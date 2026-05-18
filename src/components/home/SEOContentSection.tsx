'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Wallet, FileText, Lightbulb, Shield, ArrowRight } from 'lucide-react';

const seoSections = [
  {
    icon: FileText,
    title: 'Free AI Resume Builder \u0026 Cover Letter Generator',
    description: 'Build professional, ATS-optimized resumes in minutes with our free AI resume builder. No signup required. Pair it with our AI cover letter generator to create matching application documents. Then practice with our AI interview simulator for FAANG and tech job preparation, covering behavioral, technical, and system design questions with instant feedback and scoring.',
    links: [
      { text: 'AI Resume Builder', href: '/tools/ai-resume-builder' },
      { text: 'Cover Letter Generator', href: '/tools/ai-cover-letter-generator' },
      { text: 'FAANG Interview Preparation', href: '/tools/ai-interview-simulator' },
    ],
    keywords: ['free resume builder', 'AI resume maker', 'cover letter generator', 'ATS resume', 'FAANG interview preparation roadmap 2026', 'AI interview simulator free', 'behavioral interview STAR method', 'mock interview practice online'],
  },
  {
    icon: Wallet,
    title: 'Budget Planner \u0026 Expense Tracker — Free Personal Finance Tools',
    description: 'Take control of your money with our free budget planner and expense tracker. Track income, monitor spending habits, set savings goals, and build better financial habits. No credit card required — completely free personal finance software.',
    links: [
      { text: 'Budget Planner', href: '/tools/budget-planner' },
      { text: 'Salary Estimator', href: '/tools/salary-estimator' },
      { text: 'Habit Tracker', href: '/tools/habit-tracker' },
    ],
    keywords: ['free budget planner', 'expense tracker', 'personal finance tools', 'money management', 'savings calculator'],
  },
  {
    icon: TrendingUp,
    title: 'Latest Tech Trends, News \u0026 GTA 6 Release Date Updates',
    description: 'Stay ahead of the curve with daily tech trend reports, career growth strategies, and industry insights. From AI agents and ChatGPT prompts to remote work tips and cybersecurity trends. We also cover the latest confirmed news including the GTA 6 release date of November 19, 2026, system requirements, PC version details, and everything you need to know about Grand Theft Auto VI.',
    links: [
      { text: 'Trend Radar', href: '/trends' },
      { text: 'Blog', href: '/blog' },
      { text: 'GTA 6 Release Date November 19 2026', href: '/gta-6' },
    ],
    keywords: ['tech trends 2026', 'AI news', 'career growth tips', 'remote work', 'GTA 6 release date november 19 2026', 'GTA 6 PC requirements', 'GTA 6 news', 'ChatGPT prompts'],
  },
  {
    icon: Lightbulb,
    title: 'AI-Powered Productivity \u0026 Startup Tools',
    description: 'Supercharge your productivity with AI-powered tools. Generate startup ideas, manage tasks with our productivity planner, create professional emails instantly, and access 500+ curated AI prompts. Everything you need to work smarter, not harder.',
    links: [
      { text: 'Startup Idea Generator', href: '/tools/startup-idea-generator' },
      { text: 'AI Prompt Library', href: '/tools/ai-prompt-library' },
      { text: 'Productivity Planner', href: '/tools/productivity-planner' },
    ],
    keywords: ['startup ideas', 'AI productivity tools', 'prompt engineering', 'business ideas generator', 'task manager'],
  },
  {
    icon: Shield,
    title: 'Website Audit Tool — Free SEO, Speed, Security \u0026 Mobile Checker',
    description: 'Audit your website for free with our comprehensive SEO analyzer. Check page speed, Core Web Vitals, mobile UX, security headers, accessibility, and content quality. Whether you need to audit a website, run a site audit, or get a website health check, our tool delivers instant scores and actionable fixes. Perfect for content creators, marketers, developers, and website owners who want better Google rankings.',
    links: [
      { text: 'Free Website Audit Tool', href: '/tools/website-audit' },
      { text: 'AI Content Detector', href: '/tools/ai-content-detector' },
      { text: 'Link Manager', href: '/tools/link-manager' },
    ],
    keywords: ['free website audit', 'audit website', 'website audit', 'audit a website', 'audit of website', 'site audit tool 2026', 'SEO checker', 'AI content detector', 'website health check', 'SEO analyzer', 'google core web vitals checker'],
  },
];

export function SEOContentSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Explore All Free AI Tools & Resources
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            DevelopersMatrix offers 20+ free AI-powered tools for career growth, personal finance, productivity, and staying informed. No signup required.
          </p>
        </motion.div>

        <div className="space-y-10">
          {seoSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-start gap-4 mb-3">
                <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-500/10 shrink-0">
                  <section.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                  {section.title}
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4 pl-[52px]">
                {section.description}
              </p>

              <div className="flex flex-wrap gap-3 pl-[52px]">
                {section.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                  >
                    {link.text}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>

              {/* Hidden keywords for SEO */}
              <div className="sr-only" aria-hidden="true">
                {section.keywords.join(', ')}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 text-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/25"
          >
            <Search className="w-5 h-5" />
            Browse All 20+ Free Tools
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
