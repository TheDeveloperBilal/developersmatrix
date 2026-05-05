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
  Coffee,
  Brain,
  Target,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const allQuotes = [
  { text: '"Stay hungry, stay foolish."', author: 'Steve Jobs' },
  { text: '"The only way to do great work is to love what you do."', author: 'Steve Jobs' },
  { text: '"Innovation distinguishes between a leader and a follower."', author: 'Steve Jobs' },
  { text: '"Code is poetry."', author: 'WordPress' },
  { text: '"First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: '"Simplicity is the soul of efficiency."', author: 'Austin Freeman' },
  { text: '"Make it work, make it right, make it fast."', author: 'Kent Beck' },
  { text: '"The best error message is the one that never shows up."', author: 'Thomas Fuchs' },
];

const allProductivityTips = [
  { title: 'The 2-Minute Rule', description: 'If a task takes less than 2 minutes, do it immediately. This prevents small tasks from piling up.' },
  { title: 'Time Blocking', description: 'Schedule specific blocks of time for different tasks. This helps maintain focus and reduces context switching.' },
  { title: 'Eat the Frog First', description: 'Start your day with the most challenging task. Your willpower is highest in the morning.' },
  { title: 'The Pomodoro Technique', description: 'Work in 25-minute focused sessions followed by 5-minute breaks to maintain peak productivity.' },
  { title: 'Single-Tasking', description: 'Focus on one task at a time. Multitasking reduces efficiency and increases errors.' },
  { title: 'Weekly Review', description: 'Spend 30 minutes each week reviewing accomplishments and planning ahead for better organization.' },
];

const allSkills = [
  { title: 'React Server Components', description: 'New rendering model for React that renders components on the server for better performance.' },
  { title: 'TypeScript Generics', description: 'Master generics to create reusable, type-safe components and functions in TypeScript.' },
  { title: 'Edge Computing', description: 'Deploy code closer to users with edge functions for faster response times globally.' },
  { title: 'AI Prompt Engineering', description: 'Learn to craft effective prompts for AI models to get better, more accurate responses.' },
  { title: 'WebAssembly', description: 'Run high-performance code in the browser with WebAssembly for compute-intensive tasks.' },
  { title: 'GraphQL APIs', description: 'Query exactly the data you need with GraphQL for more efficient API communication.' },
];

const allMarketInsights = [
  { title: 'AI Agents & Automation', description: 'Companies are racing to integrate AI agents that can autonomously complete complex tasks.' },
  { title: 'Remote-First Companies', description: 'The shift to remote work continues. Companies offering flexibility attract top talent.' },
  { title: 'Cybersecurity Demand', description: 'With increasing cyber threats, security professionals are in high demand across all industries.' },
  { title: 'Green Tech Revolution', description: 'Sustainable technology and green energy solutions are attracting massive investment.' },
  { title: 'Low-Code Platforms', description: 'Low-code and no-code tools are democratizing software development for non-technical teams.' },
  { title: 'Edge AI', description: 'Running AI models on edge devices is becoming more popular for privacy and latency benefits.' },
];

const widgets = [
  {
    title: 'Weather',
    icon: Cloud,
    gradient: 'from-blue-500/10 to-cyan-500/10',
    lightGradient: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-100 dark:bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-500',
    borderColor: 'border-blue-200 dark:border-slate-700/30',
  },
  {
    title: 'Tech News',
    icon: Newspaper,
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
    title: 'Upcoming',
    icon: Calendar,
    gradient: 'from-green-500/10 to-emerald-500/10',
    lightGradient: 'from-green-50 to-emerald-50',
    iconBg: 'bg-green-100 dark:bg-green-500/10',
    iconColor: 'text-green-600 dark:text-green-500',
    borderColor: 'border-green-200 dark:border-slate-700/30',
  },
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
  const [currentTip, setCurrentTip] = useState(allProductivityTips[0]);
  const [currentSkill, setCurrentSkill] = useState(allSkills[0]);
  const [currentInsight, setCurrentInsight] = useState(allMarketInsights[0]);
  const [widgetData, setWidgetData] = useState({
    weather: { temp: '72°F', condition: 'Partly Cloudy' },
    news: { count: '5 Stories', category: 'AI & Startups' },
    events: { count: '3 Events', period: 'This Week' },
  });

  // Randomize content on mount and every 30 seconds
  useEffect(() => {
    const randomize = () => {
      setCurrentQuote(allQuotes[Math.floor(Math.random() * allQuotes.length)]);
      setCurrentTip(allProductivityTips[Math.floor(Math.random() * allProductivityTips.length)]);
      setCurrentSkill(allSkills[Math.floor(Math.random() * allSkills.length)]);
      setCurrentInsight(allMarketInsights[Math.floor(Math.random() * allMarketInsights.length)]);
      
      // Simulate dynamic widget data
      const temps = ['68°F', '72°F', '75°F', '65°F', '70°F'];
      const conditions = ['Sunny', 'Partly Cloudy', 'Clear', 'Overcast'];
      const newsCounts = ['3 Stories', '5 Stories', '7 Stories', '4 Stories'];
      const newsCats = ['AI & Startups', 'Web Dev', 'Cloud Computing', 'Mobile Dev'];
      const eventCounts = ['2 Events', '3 Events', '4 Events', '5 Events'];
      
      setWidgetData({
        weather: { 
          temp: temps[Math.floor(Math.random() * temps.length)], 
          condition: conditions[Math.floor(Math.random() * conditions.length)] 
        },
        news: { 
          count: newsCounts[Math.floor(Math.random() * newsCounts.length)], 
          category: newsCats[Math.floor(Math.random() * newsCats.length)] 
        },
        events: { 
          count: eventCounts[Math.floor(Math.random() * eventCounts.length)], 
          period: 'This Week' 
        },
      });
    };

    randomize();
    const interval = setInterval(randomize, 30000); // Change every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const insights = [
    {
      category: 'PRODUCTIVITY TIP',
      title: currentTip.title,
      description: currentTip.description,
      icon: Lightbulb,
      iconBg: 'bg-purple-100 dark:bg-purple-500/10',
      iconColor: 'text-purple-600 dark:text-purple-500',
      href: '/learn',
    },
    {
      category: 'SKILL OF THE DAY',
      title: currentSkill.title,
      description: currentSkill.description,
      icon: BookOpen,
      iconBg: 'bg-blue-100 dark:bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-500',
      href: '/learn',
    },
    {
      category: 'MARKET INSIGHT',
      title: currentInsight.title,
      description: currentInsight.description,
      icon: TrendingUp,
      iconBg: 'bg-green-100 dark:bg-green-500/10',
      iconColor: 'text-green-600 dark:text-green-500',
      href: '/trends',
    },
  ];

  const widgetValues = [
    { value: widgetData.weather.temp, subtitle: widgetData.weather.condition },
    { value: widgetData.news.count, subtitle: widgetData.news.category },
    { value: currentQuote.text.length > 20 ? currentQuote.text.substring(0, 20) + '...' : currentQuote.text, subtitle: currentQuote.author },
    { value: widgetData.events.count, subtitle: widgetData.events.period },
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
            <span className="text-sm font-medium text-purple-600 dark:text-purple-500 uppercase tracking-wider">Personalized</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Your Daily Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            Start your day with personalized insights, tips, and updates all in one glance.
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
            {insights.map((insight) => (
              <motion.div 
                key={insight.category}
                variants={itemVariants}
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

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link href="/learn">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 px-8 h-12 rounded-xl shadow-lg shadow-purple-500/25 group">
              Start Learning 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
