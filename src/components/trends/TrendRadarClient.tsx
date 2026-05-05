'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  TrendingUp, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Clock,
  Filter,
  ChevronRight,
  Brain,
  Bot,
  DollarSign,
  Gamepad2,
  Rocket,
  Shield,
  Share2,
  Code,
  Leaf,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  getShuffledTrends, 
  getHotTrends, 
  getFeaturedTrends, 
  getAllCategories,
  TrendItem,
  TrendCategoryInfo,
  getTrendsByCategory
} from '@/data/trends-data';

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
  DollarSign: <DollarSign className="w-5 h-5" />,
  Gamepad2: <Gamepad2 className="w-5 h-5" />,
  Rocket: <Rocket className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Share2: <Share2 className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Leaf: <Leaf className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />
};

const colorMap: Record<string, { bg: string; text: string; border: string; lightBg: string }> = {
  violet: { bg: 'bg-violet-500', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-200 dark:border-violet-500/30', lightBg: 'bg-violet-50 dark:bg-violet-500/10' },
  purple: { bg: 'bg-purple-500', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/30', lightBg: 'bg-purple-50 dark:bg-purple-500/10' },
  green: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-500/30', lightBg: 'bg-green-50 dark:bg-green-500/10' },
  pink: { bg: 'bg-pink-500', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-500/30', lightBg: 'bg-pink-50 dark:bg-pink-500/10' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/30', lightBg: 'bg-blue-50 dark:bg-blue-500/10' },
  red: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-500/30', lightBg: 'bg-red-50 dark:bg-red-500/10' },
  cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-500/30', lightBg: 'bg-cyan-50 dark:bg-cyan-500/10' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-500/30', lightBg: 'bg-orange-50 dark:bg-orange-500/10' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/30', lightBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/30', lightBg: 'bg-amber-50 dark:bg-amber-500/10' }
};

// Animated text cycle
const heroTexts = [
  "Trending Now in Tech",
  "What's Hot Today",
  "Future Tech Insights",
  "AI & Innovation Daily"
];

export function TrendRadarClient() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentHeroText, setCurrentHeroText] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  const trends = useMemo(() => getShuffledTrends(), []);
  const hotTrends = useMemo(() => getHotTrends(5), []);
  const featuredTrends = useMemo(() => getFeaturedTrends(6), []);
  const categories = useMemo(() => getAllCategories(), []);
  
  const filteredTrends = useMemo(() => {
    if (!selectedCategory) return trends;
    return getTrendsByCategory(selectedCategory as any);
  }, [trends, selectedCategory]);

  // Hero text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentHeroText((prev) => (prev + 1) % heroTexts.length);
        setIsVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900 pt-16 lg:pt-24 pb-12">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 px-4 py-2 bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20">
              <TrendingUp className="w-3.5 h-3.5 mr-2 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-700 dark:text-purple-400">Updates Daily • Fresh Content</span>
            </Badge>
          </motion.div>

          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 h-12"
          >
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentHeroText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold"
              >
                <span className="text-slate-900 dark:text-white">{heroTexts[currentHeroText].split(' ').slice(0, -1).join(' ')}</span>{' '}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {heroTexts[currentHeroText].split(' ').slice(-1)}
                </span>
              </motion.h1>
            </AnimatePresence>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8"
          >
            Your daily source for tech trends, AI insights, career opportunities, and future technology. 
            Curated content that matters, updated every 24 hours.
          </motion.p>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">{trends.length}+ Trending Topics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">{hotTrends.length} Hot Today</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Updated 24h</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Ticker */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-3 overflow-hidden">
        <div className="flex animate-ticker">
          {[...hotTrends, ...hotTrends].map((trend, index) => (
            <Link
              key={`${trend.id}-${index}`}
              href={`/trends/${trend.slug}`}
              className="flex items-center gap-2 px-6 whitespace-nowrap hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{trend.title}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          ))}
        </div>
      </section>

      {/* Hot This Week */}
      <section className="py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hot This Week</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Most searched trends right now</p>
              </div>
            </div>
            <Link href="/trends">
              <Button variant="ghost" className="text-purple-600 dark:text-purple-400">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {hotTrends.map((trend, index) => {
              const categoryInfo = categories.find(c => c.id === trend.category);
              const colors = colorMap[categoryInfo?.color || 'violet'];
              
              return (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/trends/${trend.slug}`}>
                    <div className="group relative h-full">
                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2 z-10 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {index + 1}
                      </div>
                      
                      <div className={`h-full p-5 rounded-2xl ${colors.lightBg} border ${colors.border} hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${colors.bg} text-white`}>
                            {iconMap[categoryInfo?.icon || 'Zap']}
                          </div>
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2">
                          {trend.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {trend.subtitle}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-y border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 sticky top-16 z-20 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap ${selectedCategory === null ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
            >
              <Filter className="w-4 h-4 mr-2" />
              All Trends
            </Button>
            {categories.map((category) => {
              const colors = colorMap[category.color];
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap ${selectedCategory === category.id ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  {iconMap[category.icon]}
                  <span className="ml-2">{category.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      {!selectedCategory && (
        <section className="py-12 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-100 dark:bg-purple-500/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Trends</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Editor's picks for you</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTrends.map((trend, index) => (
                <TrendCardLarge key={trend.id} trend={trend} categories={categories} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Trends Grid */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Trends'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {filteredTrends.length} trends • Updated every 24 hours
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrends.map((trend, index) => (
              <TrendCardMedium key={trend.id} trend={trend} categories={categories} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
              Stay Ahead of the Curve
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Get personalized trend alerts delivered to your inbox. Never miss what's important in tech.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:flex-1 h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Get Alerts
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}

// Large Trend Card Component
function TrendCardLarge({ trend, categories, index }: { trend: TrendItem; categories: TrendCategoryInfo[]; index: number }) {
  const categoryInfo = categories.find(c => c.id === trend.category);
  const colors = colorMap[categoryInfo?.color || 'violet'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/trends/${trend.slug}`}>
        <div className="group h-full p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge className={`${colors.lightBg} ${colors.text} ${colors.border}`}>
                {categoryInfo?.name}
              </Badge>
              {trend.hot && (
                <Badge className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                  <Flame className="w-3 h-3 mr-1" /> Hot
                </Badge>
              )}
            </div>
            <div className={`p-2 rounded-lg ${colors.lightBg}`}>
              {iconMap[categoryInfo?.icon || 'Zap']}
            </div>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
            {trend.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
            {trend.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>{trend.readTime} min read</span>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:gap-2 transition-all">
              Read More <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Medium Trend Card Component
function TrendCardMedium({ trend, categories, index }: { trend: TrendItem; categories: TrendCategoryInfo[]; index: number }) {
  const categoryInfo = categories.find(c => c.id === trend.category);
  const colors = colorMap[categoryInfo?.color || 'violet'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
    >
      <Link href={`/trends/${trend.slug}`}>
        <div className="group h-full p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="outline" className={`${colors.text} ${colors.border}`}>
              {categoryInfo?.name}
            </Badge>
            {trend.trending && (
              <TrendingUp className="w-4 h-4 text-green-500" />
            )}
          </div>

          {/* Content */}
          <h3 className="font-semibold mb-2 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
            {trend.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {trend.subtitle}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {trend.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-700">
            <span className="text-xs text-slate-500">{trend.readTime} min</span>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              Explore Trend →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default TrendRadarClient;
