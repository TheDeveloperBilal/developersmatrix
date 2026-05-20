'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Rss, ArrowRight, TrendingUp, Tag, BookOpen, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/shared/Cards';
import { InContentAd } from '@/components/ads/AdBanner';
import { blogPosts, blogCategories } from '@/data/blog';
import { BlogCardSkeleton } from '@/components/blog/BlogCardSkeleton';

const POSTS_PER_PAGE = 6;

interface BlogClientProps {
  initialPosts: typeof blogPosts;
}

export default function BlogClient({ initialPosts }: BlogClientProps) {
  const [visiblePosts, setVisiblePosts] = useState(POSTS_PER_PAGE + 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    let result = [...initialPosts];

    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [initialPosts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1, visiblePosts);
  const hasMore = visiblePosts < filteredPosts.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisiblePosts(prev => Math.min(prev + POSTS_PER_PAGE, filteredPosts.length + 1));
      setIsLoading(false);
    }, 400);
  };

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category);
    setVisiblePosts(POSTS_PER_PAGE + 1);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(0.55_0.25_270/0.08),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Badge className="mb-4 bg-violet-600/10 text-violet-700 hover:bg-violet-600/20 dark:bg-violet-400/10 dark:text-violet-300 border-0 text-xs font-semibold tracking-wide uppercase px-3 py-1">
            Insights & Guides
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight">
            <span className="gradient-text">Blog</span> & Insights
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Expert insights, practical guides, and industry analysis to help you
            navigate your career and stay ahead in tech.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisiblePosts(POSTS_PER_PAGE + 1);
              }}
              className="pl-9 sm:pl-10 h-11 sm:h-12 bg-background/50 backdrop-blur-sm min-h-[44px] rounded-xl border-muted-foreground/20 focus-visible:ring-violet-500"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-3">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className={`cursor-pointer min-h-[36px] px-4 rounded-full transition-all ${selectedCategory === null ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200'}`}
                onClick={() => handleCategoryClick(null)}
              >
                All Posts
              </Badge>
              {blogCategories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`cursor-pointer min-h-[36px] px-4 rounded-full transition-all ${selectedCategory === category ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200'}`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>

            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blog/${featuredPost.slug}`} className="block mb-8 sm:mb-10">
                <Card className="overflow-hidden hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-500 group border-0 ring-1 ring-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="aspect-video md:aspect-auto relative overflow-hidden">
                      <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6 lg:p-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-violet-600/10 text-violet-700 hover:bg-violet-600/20 dark:text-violet-300 border-0">
                          {featuredPost.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {featuredPost.readTime} min read
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 group-hover:text-violet-600 transition-colors line-clamp-2 leading-tight">
                        {featuredPost.title}
                      </h2>
                      <p className="text-muted-foreground mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{featuredPost.author}</span>
                        <span>•</span>
                        <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            {isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <BlogCardSkeleton count={3} />
              </div>
            )}

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-lg font-medium mb-2">No articles found</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search or filters.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Load More */}
            {hasMore && filteredPosts.length > 0 && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  className="min-h-[48px] px-8 rounded-full hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all"
                >
                  Load More Articles
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  {filteredPosts.length - visiblePosts + 1} remaining
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Newsletter */}
            <Card className="border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-violet-50 to-purple-50/50 dark:from-violet-950/40 dark:to-purple-950/30 border border-violet-100/50 dark:border-violet-800/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Rss className="w-4 h-4 text-violet-500" />
                  Weekly Newsletter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get curated articles on tech careers, AI tools, and productivity hacks — delivered every Tuesday.
                </p>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-background/80 backdrop-blur-sm border-violet-200/50 dark:border-violet-800/30 min-h-[44px] rounded-lg"
                  />
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium min-h-[44px] rounded-lg">
                    Subscribe Free
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground/70 text-center">
                  No spam. Unsubscribe anytime. Join 12,000+ developers.
                </p>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-violet-500" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {blogCategories.map(category => {
                    const count = initialPosts.filter(p => p.category === category).length;
                    return (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors text-left group"
                      >
                        <span className={`text-sm ${selectedCategory === category ? 'text-violet-700 font-medium' : 'text-foreground group-hover:text-violet-700'}`}>
                          {category}
                        </span>
                        <Badge variant="secondary" className="text-xs font-normal">
                          {count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-violet-500" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['AI', 'Career', 'Productivity', 'JavaScript', 'Startup', 'Finance', 'Remote Work', 'Skills', 'Gaming', 'Politics', 'Technology'].map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 dark:hover:bg-violet-950/30 dark:hover:text-violet-300 transition-all text-xs font-normal rounded-full px-3 py-1 min-h-[32px]"
                      onClick={() => {
                        setSearchQuery(tag);
                        setSelectedCategory(null);
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="border-0 shadow-lg overflow-hidden relative bg-gradient-to-br from-violet-600 to-purple-700 text-white">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
              <CardContent className="p-5 relative">
                <h3 className="font-bold text-lg mb-2">Website Audit Tool</h3>
                <p className="text-sm text-violet-100 mb-4 leading-relaxed">
                  Check your site&apos;s SEO, speed, and mobile performance in 60 seconds.
                </p>
                <Link href="/tools/website-audit">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full bg-white text-violet-700 hover:bg-violet-50 font-semibold"
                  >
                    Run Free Audit
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <InContentAd />
          </div>
        </div>
      </div>
    </>
  );
}
