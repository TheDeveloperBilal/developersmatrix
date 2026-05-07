'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Brain, Code, Cpu, Leaf, Shield, Settings, Rocket, Gamepad2, DollarSign, Bot, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTrendingTrends, getHotTrends, type TrendItem, type TrendCategory } from '@/data/trends-data';

const iconMap: Record<string, React.ElementType> = {
  'ai-tools': Brain,
  'ai-agents': Bot,
  'make-money': DollarSign,
  'gaming': Gamepad2,
  'future-tech': Rocket,
  'cybersecurity': Shield,
  'social-media': Share2,
  'coding': Code,
  'green-tech': Leaf,
  'career-growth': TrendingUp,
};

const categoryStyles: Record<string, { bg: string; text: string; iconBg: string }> = {
  'ai-tools': { bg: 'bg-purple-500/10', text: 'text-purple-500', iconBg: 'from-purple-500/20 to-blue-500/20' },
  'ai-agents': { bg: 'bg-violet-500/10', text: 'text-violet-500', iconBg: 'from-violet-500/20 to-purple-500/20' },
  'make-money': { bg: 'bg-green-500/10', text: 'text-green-500', iconBg: 'from-green-500/20 to-emerald-500/20' },
  'gaming': { bg: 'bg-pink-500/10', text: 'text-pink-500', iconBg: 'from-pink-500/20 to-rose-500/20' },
  'future-tech': { bg: 'bg-blue-500/10', text: 'text-blue-500', iconBg: 'from-blue-500/20 to-cyan-500/20' },
  'cybersecurity': { bg: 'bg-red-500/10', text: 'text-red-500', iconBg: 'from-red-500/20 to-orange-500/20' },
  'social-media': { bg: 'bg-cyan-500/10', text: 'text-cyan-500', iconBg: 'from-cyan-500/20 to-blue-500/20' },
  'coding': { bg: 'bg-orange-500/10', text: 'text-orange-500', iconBg: 'from-orange-500/20 to-amber-500/20' },
  'green-tech': { bg: 'bg-emerald-500/10', text: 'text-emerald-500', iconBg: 'from-emerald-500/20 to-green-500/20' },
  'career-growth': { bg: 'bg-amber-500/10', text: 'text-amber-500', iconBg: 'from-amber-500/20 to-yellow-500/20' },
};

const categoryDisplayNames: Record<string, string> = {
  'ai-tools': 'AI Tools',
  'ai-agents': 'AI Agents',
  'make-money': 'Make Money',
  'gaming': 'Gaming',
  'future-tech': 'Future Tech',
  'cybersecurity': 'Security',
  'social-media': 'Social Media',
  'coding': 'Coding',
  'green-tech': 'Green Tech',
  'career-growth': 'Career',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function TrendingSection() {
  const [trendingTopics, setTrendingTopics] = useState<TrendItem[]>([]);

  useEffect(() => {
    // Shuffle and rotate topics every time component mounts for freshness
    const trends = getTrendingTrends(20);
    const shuffled = [...trends].sort(() => 0.5 - Math.random());
    setTrendingTopics(shuffled.slice(0, 6));
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-purple-500 uppercase tracking-wider">Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-2">
              What is Hot in Tech
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">
              Stay ahead with the latest trends shaping the industry.
            </p>
          </div>
          <Link href="/trends" className="hidden sm:block">
            <Button variant="outline" className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl group">
              Explore all trends 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Trending Grid - Bento Style */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {trendingTopics.map((topic, index) => {
            const styles = categoryStyles[topic.category] || categoryStyles['ai-tools'];
            const IconComponent = iconMap[topic.category] || Brain;
            const displayName = categoryDisplayNames[topic.category] || topic.category;
            return (
              <motion.div key={topic.id} variants={itemVariants}>
                <Link href={`/trends/${topic.slug}`}>
                  <div className="group relative p-6 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 shadow-sm backdrop-blur-sm hover:shadow-lg dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-purple-500/5 hover:-translate-y-1 h-full">
                    {/* Top Row */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${styles.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.bg} ${styles.text}`}>
                          {displayName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-green-500 text-sm font-bold">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +{topic.popularityScore}%
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 dark:group-hover:text-white transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors mb-4">
                      {topic.subtitle}
                    </p>

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-sm font-medium text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Rank Badge */}
                    <div className="absolute top-4 right-4 text-xs font-bold text-slate-400 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      #{index + 1}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile View All */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center sm:hidden"
        >
          <Link href="/trends">
            <Button variant="outline" className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              Explore all trends <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
