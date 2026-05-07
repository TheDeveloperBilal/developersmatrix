'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ChevronDown,
  ChevronRight,
  Home,
  Gamepad2,
  Wrench,
  TrendingUp,
  BookOpen,
  Users,
  FileText,
  Mail,
  MessageSquare,
  DollarSign,
  Wallet,
  CheckCircle,
  Lightbulb,
  Calendar,
  BookMarked,
  Link2,
  Search,
  Monitor,
  Globe,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigation } from '@/data/config';

const emptySubscribe = () => () => {};

// Tool categories with icons for mobile menu
const toolCategories = [
  {
    name: 'Career',
    icon: FileText,
    tools: [
      { name: 'AI Resume Builder', href: '/tools/ai-resume-builder', icon: FileText },
      { name: 'Cover Letter Generator', href: '/tools/ai-cover-letter-generator', icon: Mail },
      { name: 'Interview Simulator', href: '/tools/ai-interview-simulator', icon: MessageSquare },
      { name: 'Salary Estimator', href: '/tools/salary-estimator', icon: DollarSign },
    ]
  },
  {
    name: 'Finance',
    icon: Wallet,
    tools: [
      { name: 'Budget Planner', href: '/tools/budget-planner', icon: Wallet },
    ]
  },
  {
    name: 'Productivity',
    icon: Sparkles,
    tools: [
      { name: 'AI Prompt Library', href: '/tools/ai-prompt-library', icon: BookMarked },
      { name: 'AI Email Assistant', href: '/tools/ai-email-assistant', icon: Mail },
      { name: 'Link Manager', href: '/tools/link-manager', icon: Link2 },
      { name: 'Habit Tracker', href: '/tools/habit-tracker', icon: CheckCircle },
      { name: 'Productivity Planner', href: '/tools/productivity-planner', icon: Calendar },
      { name: 'Startup Ideas', href: '/tools/startup-idea-generator', icon: Lightbulb },
    ]
  },
  {
    name: 'Gaming',
    icon: Gamepad2,
    tools: [
      { name: 'Can You Run It?', href: '/tools/can-you-run-it', icon: Monitor },
    ]
  },
  {
    name: 'Website',
    icon: Globe,
    tools: [
      { name: 'Website Audit', href: '/tools/website-audit', icon: Search },
    ]
  }
];

const mainNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'GTA 6', href: '/gta-6', icon: Gamepad2 },
  { name: 'Trends', href: '/trends', icon: TrendingUp },
  { name: 'Blog', href: '/blog', icon: BookOpen },
  { name: 'Community', href: '/community', icon: Users },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setExpandedCategory(null);
  };

  const toggleCategory = (name: string) => {
    setExpandedCategory(prev => prev === name ? null : name);
  };

  if (!mounted) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
              <Image 
                src="/logo.png" 
                alt="DevelopersMatrix" 
                width={180} 
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <div className="relative group">
                      <button className="flex items-center gap-1 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted">
                        {item.name}
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-white dark:bg-slate-900 border border-border rounded-lg shadow-xl py-2 min-w-[220px] max-h-[400px] overflow-y-auto">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <Link href="/connect" className="hidden sm:block">
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0">
                  Connect With Us
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-[380px] bg-white dark:bg-slate-950 z-50 md:hidden shadow-2xl flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold text-lg">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobileMenu}
                  className="h-10 w-10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Main Navigation */}
                <div className="p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-2">
                    Navigation
                  </p>
                  <div className="space-y-1">
                    {mainNavItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors min-h-[48px]"
                        >
                          <Icon className="w-5 h-5 text-muted-foreground" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Tools Section */}
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Tools
                    </p>
                    <Link 
                      href="/tools" 
                      onClick={closeMobileMenu}
                      className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1"
                    >
                      View All <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {toolCategories.map((category) => {
                      const CategoryIcon = category.icon;
                      const isExpanded = expandedCategory === category.name;
                      
                      return (
                        <div key={category.name} className="rounded-xl overflow-hidden">
                          <button
                            onClick={() => toggleCategory(category.name)}
                            className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[48px] rounded-xl"
                          >
                            <div className="flex items-center gap-3">
                              <CategoryIcon className="w-5 h-5 text-muted-foreground" />
                              <span>{category.name}</span>
                              <span className="text-xs text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {category.tools.length}
                              </span>
                            </div>
                            <ChevronRight 
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                isExpanded ? 'rotate-90' : ''
                              }`} 
                            />
                          </button>
                          
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 py-2">
                                  {category.tools.map((tool) => {
                                    const ToolIcon = tool.icon;
                                    return (
                                      <Link
                                        key={tool.name}
                                        href={tool.href}
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors min-h-[48px]"
                                      >
                                        <ToolIcon className="w-4 h-4" />
                                        {tool.name}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-border space-y-3">
                <Link href="/connect" onClick={closeMobileMenu} className="block">
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white border-0 h-12">
                    Connect With Us
                  </Button>
                </Link>
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border border-border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4" /> Switch to Light
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4" /> Switch to Dark
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
