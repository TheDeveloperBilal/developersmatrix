import { BlogPost } from '@/types';
import generatedBlogs from './generated-blogs.json';
import highQualityBlogs from './high-quality-blogs.json';

// High-quality blog posts (prepended to appear first)
const hqBlogPosts: BlogPost[] = highQualityBlogs as BlogPost[];

// Static blog posts
const staticBlogPosts: BlogPost[] = [
  {
    id: '3',
    slug: 'startup-funding-guide-2026',
    title: 'The Complete Guide to Startup Funding in 2026: From Bootstrapping to Series A',
    excerpt: 'Navigate the complex world of startup funding with this comprehensive guide covering all stages.',
    content: `
# The Complete Guide to Startup Funding in 2026

Securing funding remains one of the most challenging aspects of building a startup. This guide provides a roadmap for entrepreneurs at every stage.

## Understanding Your Funding Needs

Before pursuing any funding source, honestly assess your capital requirements, runway needs, and growth goals.

## Bootstrapping: The Foundation

Bootstrapping offers complete ownership retention and forced discipline.

## Angel Investors

Angel investors typically provide $25,000 to $500,000 and bring valuable mentorship.

## Series A: Scaling Up

Series A funding marks the transition from startup to scale-up.
    `,
    author: 'Jennifer Walsh',
    category: 'Startup',
    tags: ['Startup', 'Funding', 'Investment', 'Entrepreneurship'],
    publishedAt: '2026-01-10',
    readTime: 12,
    image: '/images/blog/chatgpt-ai.jpg'
  }
];

// Get all blog posts (generated + high-quality + static)
export function getAllBlogPosts(): BlogPost[] {
  return [...(generatedBlogs as BlogPost[]), ...hqBlogPosts, ...staticBlogPosts];
}

// Export merged blog posts
export const blogPosts = getAllBlogPosts();

export const blogCategories = ['Gaming', 'Technology', 'Politics', 'World News', 'Entertainment', 'Career', 'Productivity', 'Startup', 'Finance', 'Health', 'Education', 'Environment', 'Science'];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map(post => post.slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export function getRecentBlogPosts(count: number = 3): BlogPost[] {
  return blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}
