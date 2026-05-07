'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Lightbulb, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Cloud,
  Newspaper,
  Quote,
  Calendar,
  ArrowRight,
  Brain,
  Target,
  Clock,
  Wrench
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHotTrends, getTrendingTrends } from '@/data/trends-data';
import { tools } from '@/data/tools';

const allQuotes = [
  { text: '"Stay hungry, stay foolish."', author: 'Steve Jobs' },
  { text: '"The only way to do great work is to love what you do."', author: 'Steve Jobs' },
  { text: '"Innovation distinguishes between a leader and a follower."', author: 'Steve Jobs' },
  { text: '"First, solve the problem. Then, write the code."', author: 'John Johnson' },
  { text: '"Simplicity is the soul of efficiency."', author: 'Austin Freeman' },
  { text: '"Make it work, make it right, make it fast."', author: 'Kent Beck' },
  { text: '"The best time to plant a tree was 20 years ago. The second best time is now."', author: 'Chinese Proverb' },
  { text: '"Success is not final, failure is not fatal: it is the courage to continue that counts."', author: 'Winston Churchill' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function DashboardSection() {
  const [currentQuote, setCurrentQuote] = useState(allQuotes[0]);
  const [currentDate, setCurrentDate] = useState('');
  const [currentDay, setCurrentDay] = useState('');
  const [hotTrends, setHotTrends] = useState<ReturnType<typeof getHotTrends>>([]);
  const [trendingTools, setTrendingTools] = useState<typeof tools>([]);
  const [activeInsight, setActiveInsight] = useState(0);

  // Initialize real data on mount
  useEffect(() => {
    // Date
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long' }));

    // Hot trends from real data
    const trends = getHotTrends(10);
    const shuffledTrends = [...trends].sort(() => 0.5 - Math.random());
    setHotTrends(shuffledTrends.slice(0, 3));

    // Real tools
    const shuffledTools = [...tools].sort(() => 0.5 - Math.random());
    setTrendingTools(shuffledTools.slice(0, 3));

    // Random quote
    setCurrentQuote(allQuotes[Math.floor(Math.random() * allQuotes.length)]);
  }, []);

  // Rotate insights every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % 3);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quote every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(allQuotes[Math.floor(Math.random() * allQuotes.length)]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const insights = [
    {
      category: 'TRENDING NOW',
      title: hotTrends[0]?.title || 'AI Revolution 2026',
      description: hotTrends[0]?.subtitle || 'Discover the latest trends shaping the future of technology and business.',
      icon: TrendingUp,
      iconBg: 'bg-green-100 dark:bg-green-500/10',
      iconColor: 'text-green-600 dark:text-green-500',
      href: hotTrends[0] ? `/trends/${hotTrends[0].slug}` : '/trends',
    },
    {
      category: 'FEATURED TOOL',
      title: trendingTools[0]?.name || 'AI Resume Builder',
      description: trendingTools[0]?.shortDescription || 'Build professional resumes with AI assistance.',
      icon: Wrench,
      iconBg: 'bg-blue-100 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-500',
      href: trendingTools[0]?.path || '/tools',
    },
    {
      category: 'MARKET INSIGHT',
      title: hotTrends[1]?.title || 'Remote Work Trends',
      description: hotTrends[1]?.subtitle || 'Stay informed with the latest market movements and opportunities.',
      icon: Lightbulb,
      iconBg: 'bg-purple-100 dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-500',
      href: hotTrends[1] ? `/trends/${hotTrends[1].slug}` : '/trends',
    },
  ];

  const widgets = [
    {
      title: 'Today',
      icon: Calendar,
      gradient: 'from-blue-500/10 to-cyan-500/10',
      lightGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-500',
      borderColor: 'border-blue-200 dark:border-slate-700/30',
    },
    {
      title: 'Hot Trends',
      icon: TrendingUp,
      gradient: 'from-purple-500/10 to-violet-500/10',
      lightGradient: 'from-purple-50 to-violet-50',
      iconBg: 'bg-purple-100 dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-500',
      borderColor: 'border-purple-200 dark:border-slate-700/30',
    },
    {
      title: 'Daily Quote',
      icon: Quote,
      gradient: 'from-orange-500/10 to-amber-500/10',
      lightGradient: 'from-orange-50 to-amber-50',
      iconBg: 'bg-orange-100 dark:bg-orange-500/10',
      iconColor: 'text-orange-600 dark:text-orange-500',
      borderColor: 'border-orange-200 dark:border-slate-700/30',
    },
    {
      title: 'Free Tools',
      icon: Wrench,
      gradient: 'from-green-500/10 to-emerald-500/10',
      lightGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100 dark:bg-green-500/10',
      iconColor: 'text-green-600 dark:text-green-500',
      borderColor: 'border-green-200 dark:border-slate-700/30',
    },
  ];

  const widgetValues = [
    { value: currentDate || 'Loading...', subtitle: currentDay || '' },
    { value: `${hotTrends.length || 3}+ Hot`, subtitle: 'Trending Now' },
    { value: currentQuote.text.length > 25 ? currentQuote.text.substring(0, 22) + '...' : currentQuote.text, subtitle: currentQuote.author },
    { value: `${tools.length}+ Tools`, subtitle: '100% Free' },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-100/70 dark:from-purple-900/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600 dark:text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-500 uppercase tracking-wider">Live Updates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Your Daily Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Real-time insights, trending topics, and fresh tools — refreshed throughout your day.
          </p>
        </motion.div>

        {/* Dashboard Preview - Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Widgets Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-1 grid grid-cols-2 gap-4"
          >
            {widgets.map((widget, index) => (
              <motion.div 
                key={widget.title}
                variants={itemVariants}
                className="group"
              >
                <div className={`p-5 rounded-2xl bg-gradient-to-br ${widget.lightGradient} dark:bg-gradient-to-br dark:${widget.gradient} border ${widget.borderColor} shadow-sm backdrop-blur-sm hover:shadow-md transition-all duration-300 h-full`}>
                  <widget.icon className={`w-6 h-6 ${widget.iconColor} mb-3`} />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{widget.title}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{widgetValues[index].value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">{widgetValues[index].subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Insights */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-2 space-y-4"
          >
            {insights.map((insight, index) => (
              <motion.div 
                key={insight.category}
                variants={itemVariants}
                className={`transition-all duration-500 ${index === activeInsight ? 'ring-2 ring-purple-500/30 rounded-2xl' : ''}`}
              >
                <Link href={insight.href}>
                  <div className="group p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 shadow-sm hover:shadow-md backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${insight.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <insight.icon className={`w-6 h-6 ${insight.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${insight.iconColor} mb-1`}>{insight.category}</p>
                        <h3 className="font-semibold mb-1 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{insight.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {insight.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-all shrink-0" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mini Trend Ticker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10"
        >
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Trending Topics Right Now</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hotTrends.map((trend) => (
                <Link key={trend.id} href={`/trends/${trend.slug}`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <TrendingUp className="w-3 h-3" />
                    {trend.title.length > 40 ? trend.title.substring(0, 38) + '...' : trend.title}
                  </span>
                </Link>
              ))}
              {hotTrends.length === 0 && (
                <span className="text-sm text-slate-500 dark:text-slate-400">Loading trends...</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/tools">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 h-12 rounded-xl shadow-lg shadow-purple-500/25 group">
              Explore All Tools 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
