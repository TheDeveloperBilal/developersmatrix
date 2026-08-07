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
  'gaming-tech-trends-2026': ['can-you-run-it'],

  // Career trends → career tools
  'learn-programming-2026-complete-guide': ['ai-resume-builder', 'ai-interview-simulator', 'salary-estimator'],
  'tech-skills-demand-2026': ['salary-estimator', 'ai-resume-builder'],
  'tech-interview-preparation-2026': ['ai-interview-simulator', 'ai-resume-builder'],
  'remote-tech-jobs-guide-2026': ['ai-resume-builder', 'salary-estimator', 'ai-cover-letter-generator'],

  // Website/SEO trends → audit tool
  'website-speed-optimization-2026': ['website-audit'],
  'seo-trends-2026': ['website-audit'],
  'web-development-trends-2026': ['website-audit', 'ai-prompt-library'],
  'mobile-first-design-2026': ['website-audit'],

  // NEW: Additional trend → tool mappings for internal linking blitz
  'cybersecurity-skills-gap-2026': ['website-audit'],
  'cloud-computing-trends-2026': ['website-audit', 'ai-email-assistant'],
  'devops-automation-2026': ['website-audit', 'productivity-planner'],
  'quantum-computing-explained-2026': ['ai-prompt-library'],
  'creator-economy-trends-2026': ['link-manager', 'ai-content-detector'],
  'green-tech-sustainability-2026': ['budget-planner'],
};

const trendToBlogsMap: Record<string, string[]> = {
  'ai-agents-autonomous-systems-2026': ['autonomous-ai-agents-by-industry'],
  'ai-coding-assistants-comparison-2026': ['ai-tools-developers-2026', 'faang-interview-playbook-2026'],
  'learn-programming-2026-complete-guide': ['faang-interview-playbook-2026', 'ats-resume-guide-2026'],
  'tech-skills-demand-2026': ['faang-interview-playbook-2026', 'ats-resume-guide-2026', '5-job-offers-30-days-ai'],
  'tech-interview-preparation-2026': ['technical-interview-prep-2026', 'faang-interview-playbook-2026'],
  'ai-side-hustles-make-money-2026': ['ai-side-hustles-2026-make-money', 'ai-freelancing-2026-six-figure-guide'],
  'tiktok-algorithm-2026-complete-guide': ['tiktok-algorithm-guide-2026'],
  'creator-economy-trends-2026': ['ai-content-creation-business-2026'],

  // NEW: Additional trend → blog mappings for internal linking blitz
  'cybersecurity-skills-gap-2026': ['ai-cybersecurity-guide-2026'],
  'web-development-trends-2026': ['website-code-audit-guide'],
  'cloud-computing-trends-2026': ['ai-automation-business-ideas-2026'],
  'devops-automation-2026': ['website-code-audit-guide'],
  'quantum-computing-explained-2026': ['ai-tools-developers-2026'],
  'green-tech-sustainability-2026': ['ai-automation-business-ideas-2026'],
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
  'content': ['ai-content-detector'],
  'prompt': ['ai-prompt-library'],
  'cover letter': ['ai-cover-letter-generator'],

  // NEW: Additional tag → tool mappings for internal linking blitz
  'cybersecurity': ['website-audit'],
  'cloud': ['website-audit', 'ai-email-assistant'],
  'devops': ['productivity-planner', 'website-audit'],
  'quantum': ['ai-prompt-library'],
  'creator': ['link-manager', 'ai-content-detector'],
  'green tech': ['budget-planner'],
  'sustainability': ['budget-planner'],
  'social media': ['link-manager', 'ai-content-detector'],
  'mobile': ['website-audit'],
  'security': ['website-audit'],
};

const tagToBlogMap: Record<string, string[]> = {
  'ai': ['autonomous-ai-agents-by-industry', 'ai-tools-developers-2026'],
  'artificial intelligence': ['autonomous-ai-agents-by-industry', 'ai-tools-developers-2026'],
  'agent': ['autonomous-ai-agents-by-industry'],
  'automation': ['autonomous-ai-agents-by-industry', 'ai-automation-business-ideas-2026'],
  'programming': ['faang-interview-playbook-2026', 'ats-resume-guide-2026', 'technical-interview-prep-2026'],
  'coding': ['faang-interview-playbook-2026', 'ats-resume-guide-2026', 'technical-interview-prep-2026'],
  'career': ['faang-interview-playbook-2026', 'ats-resume-guide-2026', 'technical-interview-prep-2026', '5-job-offers-30-days-ai'],
  'interview': ['faang-interview-playbook-2026', 'technical-interview-prep-2026'],
  'resume': ['ats-resume-guide-2026', 'best-free-resume-builders-2026', 'built-resume-builder-48-hours'],
  'startup': ['startup-funding-guide-2026', 'ai-automation-business-ideas-2026'],
  'seo': ['how-to-audit-website-2026-guide', 'website-audit-checklist-2026', 'on-site-seo-guide-2026'],
  'website': ['how-to-audit-website-2026-guide', 'website-audit-checklist-2026', 'website-code-audit-guide'],
  'audit': ['how-to-audit-website-2026-guide', 'website-audit-checklist-2026', 'website-code-audit-guide'],
  'side hustle': ['ai-side-hustles-2026-make-money', 'ai-freelancing-2026-six-figure-guide'],
  'freelance': ['ai-freelancing-2026-six-figure-guide', 'ai-side-hustles-2026-make-money'],
  'tiktok': ['tiktok-algorithm-guide-2026'],
  'content creation': ['ai-content-creation-business-2026'],

  // NEW: Additional tag → blog mappings for internal linking blitz
  'cybersecurity': ['ai-cybersecurity-guide-2026'],
  'cloud': ['ai-automation-business-ideas-2026'],
  'devops': ['website-code-audit-guide'],
  'quantum': ['ai-tools-developers-2026'],
  'creator': ['ai-content-creation-business-2026'],
  'green tech': ['ai-automation-business-ideas-2026'],
  'sustainability': ['ai-automation-business-ideas-2026'],
  'social media': ['tiktok-algorithm-guide-2026'],
  'mobile': ['website-code-audit-guide'],
  'security': ['ai-cybersecurity-guide-2026'],
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

// NEW: Get related blog posts for a tool (reverse of trend→blog mapping)
export function getRelatedBlogPostsForTool(toolSlug: string): RelatedBlogPost[] {
  const toolEntry = tools.find(t => t.slug === toolSlug);
  if (!toolEntry) return [];

  const toolTags = [
    toolEntry.category,
    ...(toolEntry.keywords || []),
  ].map(t => t.toLowerCase());

  const blogSlugs = new Set<string>();
  const relevanceMap = new Map<string, 'high' | 'medium'>();

  // Check each trend→blog mapping: if the trend maps to this tool, include its blogs
  Object.entries(trendToToolsMap).forEach(([trendSlug, mappedTools]) => {
    if (mappedTools.includes(toolSlug)) {
      const blogs = trendToBlogsMap[trendSlug] || [];
      blogs.forEach(s => {
        if (!blogSlugs.has(s)) {
          blogSlugs.add(s);
          relevanceMap.set(s, 'high');
        }
      });
    }
  });

  // Tag-based matching
  toolTags.forEach(toolTag => {
    Object.entries(tagToBlogMap).forEach(([tag, matchedBlogs]) => {
      if (toolTag.includes(tag.toLowerCase()) || tag.toLowerCase().includes(toolTag)) {
        matchedBlogs.forEach(s => {
          if (!blogSlugs.has(s)) {
            blogSlugs.add(s);
            relevanceMap.set(s, 'medium');
          }
        });
      }
    });
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

// NEW: Get related trends for a tool (with full trend data)
export function getRelatedTrendPagesForTool(toolSlug: string) {
  const toolEntry = tools.find(t => t.slug === toolSlug);
  if (!toolEntry) return [];

  const related: { slug: string; title: string; description: string; category: string }[] = [];
  const allTrends = getAllTrends();

  allTrends.forEach(trend => {
    // Skip noindex trends
    if (trend.noindex) return;

    const mappedTools = trendToToolsMap[trend.slug] || [];
    if (mappedTools.includes(toolSlug)) {
      related.push({
        slug: trend.slug,
        title: trend.title,
        description: trend.description,
        category: trend.category,
      });
      return;
    }

    const toolTags = [
      toolEntry.category,
      ...(toolEntry.keywords || []),
    ].map(t => t.toLowerCase());

    const hasMatch = trend.tags.some(tag =>
      toolTags.some(toolTag => toolTag.includes(tag.toLowerCase()) || tag.toLowerCase().includes(toolTag))
    );

    if (hasMatch) {
      related.push({
        slug: trend.slug,
        title: trend.title,
        description: trend.description,
        category: trend.category,
      });
    }
  });

  return related.slice(0, 3);
}
