// Cross-linking system: maps trends to relevant tools and blog posts
// This creates the hub-and-spoke internal linking architecture

import { getAllTrends, getTrendBySlug } from './trends-data';
import { blogPosts } from './blog';
import { tools } from './tools';

export interface RelatedTool {
  slug: string;
  name: string;
  description: string;
  path: string;
  relevance: 'high' | 'medium';
}

export interface RelatedBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  path: string;
  relevance: 'high' | 'medium';
}

// Explicit topic cluster mappings for top trends
const trendToToolsMap: Record<string, string[]> = {
  // AI trends → AI tools
  'ai-agents-autonomous-systems-2026': ['ai-prompt-library', 'ai-email-assistant'],
  'chatgpt-advanced-prompts-2026': ['ai-prompt-library', 'ai-content-detector'],
  'ai-coding-assistants-comparison-2026': ['ai-resume-builder'],
  'ai-side-hustles-make-money-2026': ['startup-idea-generator', 'budget-planner'],
  
  // Gaming trends → gaming/career tools
  'gta-6-release-everything-we-know': ['can-you-run-it'],
  
  // Career trends → career tools
  'learn-programming-2026-complete-guide': ['ai-resume-builder', 'ai-interview-simulator', 'salary-estimator'],
  'tech-skills-demand-2026': ['salary-estimator', 'ai-resume-builder'],
  
  // Productivity trends → productivity tools
  'productivity-ai-tools-2026': ['productivity-planner', 'habit-tracker', 'ai-email-assistant'],
  
  // Website/SEO trends → audit tool
  'website-speed-optimization-2026': ['website-audit'],
  'seo-trends-2026': ['website-audit'],
  'web-development-trends-2026': ['website-audit'],
  'mobile-first-design-2026': ['website-audit'],
};

const trendToBlogsMap: Record<string, string[]> = {
  'ai-coding-assistants-comparison-2026': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'learn-programming-2026-complete-guide': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'tech-skills-demand-2026': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'ai-side-hustles-make-money-2026': ['startup-funding-guide-2026'],
};

// Tag-based matching for trends without explicit mappings
const tagToToolMap: Record<string, string[]> = {
  'artificial intelligence': ['ai-prompt-library', 'ai-content-detector', 'ai-email-assistant'],
  'ai': ['ai-prompt-library', 'ai-content-detector', 'ai-email-assistant'],
  'chatgpt': ['ai-prompt-library', 'ai-content-detector'],
  'programming': ['ai-resume-builder', 'ai-interview-simulator'],
  'coding': ['ai-resume-builder', 'ai-interview-simulator'],
  'career': ['ai-resume-builder', 'ai-interview-simulator', 'salary-estimator', 'ai-cover-letter-generator'],
  'job search': ['ai-resume-builder', 'ai-interview-simulator', 'salary-estimator', 'ai-cover-letter-generator'],
  'resume': ['ai-resume-builder', 'ai-cover-letter-generator'],
  'interview': ['ai-interview-simulator'],
  'salary': ['salary-estimator'],
  'startup': ['startup-idea-generator', 'budget-planner'],
  'finance': ['budget-planner', 'salary-estimator'],
  'budget': ['budget-planner'],
  'gaming': ['can-you-run-it'],
  'gta': ['can-you-run-it'],
  'productivity': ['productivity-planner', 'habit-tracker'],
  'habits': ['habit-tracker'],
  'email': ['ai-email-assistant'],
  'seo': ['website-audit'],
  'website': ['website-audit'],
  'audit': ['website-audit'],
  'performance': ['website-audit'],
  'speed': ['website-audit'],
  'optimization': ['website-audit'],
  'links': ['link-manager'],
};

const tagToBlogMap: Record<string, string[]> = {
  'programming': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'coding': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'career': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'interview': ['faang-interview-playbook-2026'],
  'resume': ['ats-resume-guide-2026'],
  'startup': ['startup-funding-guide-2026'],
  'seo': ['how-to-audit-website-2026-guide'],
  'website': ['how-to-audit-website-2026-guide'],
  'audit': ['how-to-audit-website-2026-guide'],
};

export function getRelatedToolsForTrend(slug: string): RelatedTool[] {
  const trend = getTrendBySlug(slug);
  if (!trend) return [];

  const toolSlugs = new Set<string>();
  const relevanceMap = new Map<string, 'high' | 'medium'>();

  // Explicit mappings (high relevance)
  const explicit = trendToToolsMap[slug] || [];
  explicit.forEach(s => {
    toolSlugs.add(s);
    relevanceMap.set(s, 'high');
  });

  // Tag-based matches (medium relevance)
  trend.tags.forEach(tag => {
    const matchedTools = tagToToolMap[tag.toLowerCase()] || [];
    matchedTools.forEach(s => {
      if (!toolSlugs.has(s)) {
        toolSlugs.add(s);
        relevanceMap.set(s, 'medium');
      }
    });
  });

  // Category-based fallback for career/gaming/productivity
  const categoryToolMap: Record<string, string[]> = {
    'career': ['ai-resume-builder', 'ai-interview-simulator', 'salary-estimator'],
    'gaming': ['can-you-run-it'],
    'productivity': ['productivity-planner', 'habit-tracker'],
    'technology': ['ai-prompt-library', 'website-audit'],
    'finance': ['budget-planner', 'salary-estimator'],
  };
  const categoryTools = categoryToolMap[trend.category] || [];
  categoryTools.forEach(s => {
    if (!toolSlugs.has(s)) {
      toolSlugs.add(s);
      relevanceMap.set(s, 'medium');
    }
  });

  // Convert to RelatedTool objects, limit to 4
  return Array.from(toolSlugs)
    .slice(0, 4)
    .map(toolSlug => {
      const tool = tools.find(t => t.slug === toolSlug);
      if (!tool) return null;
      return {
        slug: tool.slug,
        name: tool.name,
        description: tool.shortDescription || tool.description,
        path: tool.path,
        relevance: relevanceMap.get(toolSlug) || 'medium',
      };
    })
    .filter((t): t is RelatedTool => t !== null);
}

export function getRelatedBlogPostsForTrend(slug: string): RelatedBlogPost[] {
  const trend = getTrendBySlug(slug);
  if (!trend) return [];

  const blogSlugs = new Set<string>();
  const relevanceMap = new Map<string, 'high' | 'medium'>();

  // Explicit mappings
  const explicit = trendToBlogsMap[slug] || [];
  explicit.forEach(s => {
    blogSlugs.add(s);
    relevanceMap.set(s, 'high');
  });

  // Tag-based matches
  trend.tags.forEach(tag => {
    const matchedBlogs = tagToBlogMap[tag.toLowerCase()] || [];
    matchedBlogs.forEach(s => {
      if (!blogSlugs.has(s)) {
        blogSlugs.add(s);
        relevanceMap.set(s, 'medium');
      }
    });
  });

  // Category-based fallback
  const categoryBlogMap: Record<string, string[]> = {
    'career': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
    'technology': ['how-to-audit-website-2026-guide'],
    'gaming': [],
  };
  const categoryBlogs = categoryBlogMap[trend.category] || [];
  categoryBlogs.forEach(s => {
    if (!blogSlugs.has(s)) {
      blogSlugs.add(s);
      relevanceMap.set(s, 'medium');
    }
  });

  return Array.from(blogSlugs)
    .slice(0, 3)
    .map(blogSlug => {
      const post = blogPosts.find(p => p.slug === blogSlug);
      if (!post) return null;
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        path: `/blog/${post.slug}`,
        relevance: relevanceMap.get(blogSlug) || 'medium',
      };
    })
    .filter((p): p is RelatedBlogPost => p !== null);
}

// Also export reverse mappings (tool → trends, blog → trends) for use on tool/blog pages
export function getRelatedTrendsForTool(toolSlug: string) {
  const allTrends = getAllTrends();
  const related: { slug: string; title: string; category: string }[] = [];

  allTrends.forEach(trend => {
    const mappedTools = trendToToolsMap[trend.slug] || [];
    if (mappedTools.includes(toolSlug)) {
      related.push({ slug: trend.slug, title: trend.title, category: trend.category });
      return;
    }

    // Tag-based check
    const toolEntry = tools.find(t => t.slug === toolSlug);
    if (!toolEntry) return;
    
    const toolTags = [
      toolEntry.category,
      ...(toolEntry.keywords || []),
    ].map(t => t.toLowerCase());
    
    const hasMatch = trend.tags.some(tag => 
      toolTags.some(toolTag => toolTag.includes(tag.toLowerCase()) || tag.toLowerCase().includes(toolTag))
    );
    
    if (hasMatch) {
      related.push({ slug: trend.slug, title: trend.title, category: trend.category });
    }
  });

  return related.slice(0, 4);
}
