import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  Share2, 
  Bookmark,
  Lightbulb,
  BookOpen,
  Rocket,
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  getTrendBySlug, 
  getAllTrendSlugs, 
  getRelatedTrends, 
  getAllCategories,
  getHotTrends
} from '@/data/trends-data';
import { getRelatedToolsForTrend, getRelatedBlogPostsForTrend } from '@/data/cross-links';
import { siteConfig } from '@/data/config';

interface TrendPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllTrendSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: TrendPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const trend = getTrendBySlug(resolvedParams.slug);

  if (!trend) {
    return {
      title: 'Trend Not Found',
    };
  }

  return {
    title: trend.metaTitle,
    description: trend.metaDescription,
    keywords: trend.keywords,
    alternates: {
      canonical: `${siteConfig.url}/trends/${resolvedParams.slug}`,
    },
    openGraph: {
      title: trend.title,
      description: trend.subtitle,
      type: 'article',
      tags: trend.tags,
      publishedTime: trend.publishedAt,
      modifiedTime: trend.updatedAt,
      authors: [trend.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: trend.title,
      description: trend.subtitle,
    },
  };
}

export default async function TrendPage({ params }: TrendPageProps) {
  const resolvedParams = await params;
  const trend = getTrendBySlug(resolvedParams.slug);

  if (!trend) {
    notFound();
  }

  const relatedTrends = getRelatedTrends(resolvedParams.slug, 4);
  const relatedTools = getRelatedToolsForTrend(resolvedParams.slug);
  const relatedBlogPosts = getRelatedBlogPostsForTrend(resolvedParams.slug);
  const categories = getAllCategories();
  const categoryInfo = categories.find(c => c.id === trend.category);
  const hotTrends = getHotTrends(3);

  const colorMap: Record<string, string> = {
    violet: 'text-violet-600 dark:text-violet-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
    pink: 'text-pink-600 dark:text-pink-400',
    blue: 'text-blue-600 dark:text-blue-400',
    red: 'text-red-600 dark:text-red-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    orange: 'text-orange-600 dark:text-orange-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
    amber: 'text-amber-600 dark:text-amber-400'
  };

  const bgColorMap: Record<string, string> = {
    violet: 'bg-violet-100 dark:bg-violet-500/10',
    purple: 'bg-purple-100 dark:bg-purple-500/10',
    green: 'bg-green-100 dark:bg-green-500/10',
    pink: 'bg-pink-100 dark:bg-pink-500/10',
    blue: 'bg-blue-100 dark:bg-blue-500/10',
    red: 'bg-red-100 dark:bg-red-500/10',
    cyan: 'bg-cyan-100 dark:bg-cyan-500/10',
    orange: 'bg-orange-100 dark:bg-orange-500/10',
    emerald: 'bg-emerald-100 dark:bg-emerald-500/10',
    amber: 'bg-amber-100 dark:bg-amber-500/10'
  };

  const categoryColor = colorMap[categoryInfo?.color || 'violet'];
  const categoryBg = bgColorMap[categoryInfo?.color || 'violet'];

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6">
            <Link href="/trends" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Trend Radar
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className={categoryColor}>{categoryInfo?.name}</span>
          </nav>

          {/* Category & Status */}
          <div className="flex items-center gap-3 mb-4">
            <Badge className={`${categoryBg} ${categoryColor} border-0`}>
              {categoryInfo?.name}
            </Badge>
            {trend.trending && (
              <Badge className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-0">
                Trending
              </Badge>
            )}
            {trend.hot && (
              <Badge className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-0">
                🔥 Hot
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {trend.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            {trend.subtitle}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{trend.readTime} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Updated {new Date(trend.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>By {trend.author}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {trend.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction */}
            <section className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                {trend.description}
              </p>
            </section>

            {/* Why It Matters */}
            <section className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-500/5 border border-purple-100 dark:border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Why This Matters in 2026</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {trend.content.whyItMatters}
              </p>
            </section>

            {/* Beginner Explanation */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Getting Started</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {trend.content.beginnerExplanation}
              </p>
            </section>

            {/* Advanced Insights */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                  <Rocket className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Advanced Insights</h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {trend.content.advancedInsights}
              </p>
            </section>

            {/* Real World Examples */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Real-World Examples</h2>
              <div className="space-y-3">
                {trend.content.realWorldExamples.map((example, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-slate-700 dark:text-slate-300">{example}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tools & Platforms */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Tools & Platforms</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trend.content.tools.map((tool) => (
                  <div 
                    key={tool.name} 
                    className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
                      {tool.url && (
                        <a 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Future Scope */}
            <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/5 dark:to-purple-500/5 border border-blue-100 dark:border-blue-500/20">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Looking Ahead</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {trend.content.futureScope}
              </p>
            </section>

        {/* FAQ Section */}
            {trend.content.faqs && trend.content.faqs.length > 0 && (
              <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {trend.content.faqs.map((faq, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Industry Statistics */}
            {trend.content.statistics && trend.content.statistics.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Industry Statistics 2026</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trend.content.statistics.map((stat, index) => (
                    <div key={index} className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-500/5 dark:to-blue-500/5 border border-purple-100 dark:border-purple-500/20">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{stat.value}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{stat.label}</p>
                      {stat.source && <p className="text-xs text-slate-400 mt-2">Source: {stat.source}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Expert Commentary */}
            {trend.content.expertCommentary && (
              <section className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Expert Perspective</h2>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {trend.content.expertCommentary}
                </p>
              </section>
            )}

            {/* Comparison Section */}
            {trend.content.comparisons && trend.content.comparisons.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Detailed Comparison</h2>
                <div className="space-y-4">
                  {trend.content.comparisons.map((item, index) => (
                    <div key={index} className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-3">{item.name}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Pros</p>
                          <ul className="space-y-1">
                            {item.pros.map((pro, i) => (
                              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-green-500 shrink-0">+</span> {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-red-500 dark:text-red-400 mb-2">Cons</p>
                          <ul className="space-y-1">
                            {item.cons.map((con, i) => (
                              <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                                <span className="text-red-400 shrink-0">-</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Action Steps */}
            {trend.content.actionSteps && trend.content.actionSteps.length > 0 && (
              <section className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-500/5 dark:to-green-500/5 border border-emerald-100 dark:border-emerald-500/20">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Action Steps: Get Started Today</h2>
                <div className="space-y-3">
                  {trend.content.actionSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Takeaways */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Takeaways</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {trend.content.keyTakeaways.map((takeaway, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-500/5 border border-green-100 dark:border-green-500/20"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">{takeaway}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Resources */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Learn More</h2>
              <div className="space-y-3">
                {trend.content.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {resource.type}
                      </Badge>
                      <span className="text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {resource.title}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Related Trends */}
            <div className="sticky top-24 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Related Trends</h3>
                <div className="space-y-4">
                  {relatedTrends.map((related) => {
                    const relatedCategory = categories.find(c => c.id === related.category);
                    const relatedColor = colorMap[relatedCategory?.color || 'violet'];
                    
                    return (
                      <Link 
                        key={related.id}
                        href={`/trends/${related.slug}`}
                        className="block group"
                      >
                        <p className={`text-xs font-medium ${relatedColor} mb-1`}>
                          {relatedCategory?.name}
                        </p>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Recommended Tools */}
              {relatedTools.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5 border border-blue-100 dark:border-blue-500/20">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">🛠️ Try These Free Tools</h3>
                  <div className="space-y-4">
                    {relatedTools.map((tool) => (
                      <Link 
                        key={tool.slug}
                        href={tool.path}
                        className="block group"
                      >
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {tool.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {tool.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Articles */}
              {relatedBlogPosts.length > 0 && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-100 dark:border-emerald-500/20">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4">📚 Related Guides</h3>
                  <div className="space-y-4">
                    {relatedBlogPosts.map((post) => (
                      <Link 
                        key={post.slug}
                        href={post.path}
                        className="block group"
                      >
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hot Trends */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/5 dark:to-red-500/5 border border-orange-100 dark:border-orange-500/20">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">🔥 Hot Right Now</h3>
                <div className="space-y-3">
                  {hotTrends.map((hot) => (
                    <Link 
                      key={hot.id}
                      href={`/trends/${hot.slug}`}
                      className="block text-sm text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    >
                      {hot.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                <h3 className="font-bold mb-2">Stay Updated</h3>
                <p className="text-sm text-purple-100 mb-4">Get daily trend alerts delivered to your inbox.</p>
                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50">
                  Subscribe Free
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Related Trends Full Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Explore More Trends</h2>
            <Link href="/trends">
              <Button variant="outline">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTrends.map((related) => {
              const relatedCategory = categories.find(c => c.id === related.category);
              const relatedBg = bgColorMap[relatedCategory?.color || 'violet'];
              const relatedColor = colorMap[relatedCategory?.color || 'violet'];
              
              return (
                <Link 
                  key={related.id}
                  href={`/trends/${related.slug}`}
                >
                  <div className="h-full p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <Badge className={`mb-3 ${relatedBg} ${relatedColor} border-0`}>
                      {relatedCategory?.name}
                    </Badge>
                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-2 mb-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {related.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
