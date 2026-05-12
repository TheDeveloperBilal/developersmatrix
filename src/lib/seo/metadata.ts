import { Metadata } from 'next';
import { siteConfig } from '@/data/config';

interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

export function generatePageMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  author
}: PageMetadataOptions): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      type: type === 'article' ? 'article' : 'website',
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] })
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@developersmatrix'
    },
    alternates: {
      canonical: url
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

// Pre-defined metadata for main pages
export const pageMetadata = {
  home: {
    title: 'DevelopersMatrix - Free AI Tools & Career Hub',
    description: 'Your daily destination for AI-powered tools, career insights, productivity hacks, and market trends. Free resume builder, interview simulator, budget planner, and more.',
    keywords: ['AI tools', 'resume builder', 'career optimization', 'productivity tools', 'budget planner', 'job search', 'developer tools', 'interview preparation'],
    path: '/'
  },
  tools: {
    title: 'Free AI-Powered Tools & Resources',
    description: 'Access 15+ free AI-powered tools including Resume Builder, Cover Letter Generator, Interview Simulator, Budget Planner, and more. Boost your productivity and career today.',
    keywords: ['AI tools', 'free tools', 'productivity tools', 'career tools', 'resume builder', 'budget planner'],
    path: '/tools'
  },
  blog: {
    title: 'Blog - Tech News, Career Tips & Industry Insights',
    description: 'Stay updated with the latest tech news, career advice, productivity tips, and industry insights. Expert articles on AI, development, and professional growth.',
    keywords: ['tech blog', 'career tips', 'tech news', 'productivity tips', 'AI news', 'developer blog'],
    path: '/blog'
  },
  trends: {
    title: 'Trend Radar - Emerging Tech & Career Trends',
    description: 'Explore emerging trends in technology, career development, and business opportunities. Deep dives into AI, edge computing, cybersecurity, and more.',
    keywords: ['tech trends', 'AI trends', 'career trends', 'emerging technology', 'industry trends'],
    path: '/trends'
  },
  community: {
    title: 'Community Q&A - Ask & Answer Questions',
    description: 'Join our community of developers, entrepreneurs, and tech professionals. Ask questions, share knowledge, and connect with like-minded individuals.',
    keywords: ['tech community', 'developer community', 'Q&A', 'tech questions', 'programming help'],
    path: '/community'
  },
  gta6: {
    title: 'GTA 6 News, Rumors & Updates - Everything We Know',
    description: 'Your complete guide to GTA 6: latest news, trailer breakdowns, release date rumors, gameplay features, and everything Rockstar has revealed about Grand Theft Auto VI.',
    keywords: ['GTA 6', 'GTA 6 news', 'Grand Theft Auto 6', 'GTA VI', 'GTA 6 release date', 'GTA 6 trailer'],
    path: '/gta-6'
  },
  about: {
    title: 'About DevelopersMatrix - Our Mission & Team',
    description: 'Learn about DevelopersMatrix - our mission to empower developers, entrepreneurs, and tech professionals with AI-powered tools and curated content.',
    keywords: ['about DevelopersMatrix', 'our mission', 'tech company', 'AI tools company'],
    path: '/about'
  },
  contact: {
    title: 'Contact Us - Get in Touch',
    description: 'Have questions or feedback? Contact the DevelopersMatrix team. We are here to help with any inquiries about our tools and services.',
    keywords: ['contact', 'support', 'customer service', 'get in touch'],
    path: '/contact'
  },
  connect: {
    title: 'Connect With Us - Collaborate & Partner',
    description: 'Connect with DevelopersMatrix for collaboration opportunities, partnerships, sponsorships, or just to say hello. We would love to hear from you.',
    keywords: ['connect', 'partnership', 'collaboration', 'sponsorship', 'business inquiry'],
    path: '/connect'
  },
  learn: {
    title: 'Learn - Educational Resources & Micro-Learning',
    description: 'Access educational resources, micro-learning content, and skill development materials. Learn new technologies and enhance your professional skills.',
    keywords: ['learning', 'education', 'skills development', 'micro-learning', 'tech education'],
    path: '/learn'
  }
};

// Tool-specific metadata
export const toolMetadata: Record<string, PageMetadataOptions> = {
  'website-audit': {
    title: 'Free Website Audit Tool | SEO, Speed & Security Checker 2026',
    description: 'Free AI-powered website audit tool. Check SEO, page speed, Core Web Vitals, mobile UX, security, and accessibility. Get instant scores and actionable fixes. No signup needed.',
    keywords: [
      'free website audit tool',
      'website seo checker free',
      'site audit tool 2026',
      'website health check free',
      'seo audit tool online',
      'website performance checker',
      'free website analyzer',
      'google core web vitals checker',
      'website speed test tool',
      'technical seo audit free',
      'developersmatrix website audit',
      'seo score checker',
      'website security scanner free',
      'mobile friendly test tool',
      'accessibility audit tool free',
      'website crawler tool free',
      'page speed insights alternative',
      'seo website analysis free',
      'website audit report free',
      'full website checkup tool'
    ],
    path: '/tools/website-audit'
  },
  'ai-content-detector': {
    title: 'Free AI Content Detector — Detect AI-Generated Text Instantly | No Login 2026',
    description: 'Free AI content detector with real perplexity and burstiness analysis. Detect ChatGPT, GPT-4, Claude, and Gemini text instantly. 7 content modes, sentence-level breakdown, SEO issue detection. No signup, no credit card, 100% free.',
    keywords: [
      'ai content detector free',
      'free ai detector',
      'ai content checker',
      'detect ai generated text',
      'chatgpt detector',
      'perplexity score checker',
      'burstiness analysis tool',
      'ai text detection',
      'content authenticity checker',
      'ai generated content detector',
      'free ai content checker',
      'ai writing detector',
      'detect chatgpt text',
      'ai content analysis',
      'human vs ai text checker',
      'developersmatrix ai detector',
      'ai content detector 2026',
      'ai text authenticity',
      'content originality checker',
      'ai detection tool free'
    ],
    path: '/tools/ai-content-detector'
  },
  'ai-resume-builder': {
    title: 'Free AI Resume Builder for Developers | ATS-Friendly 2026',
    description: 'Build an ATS-friendly resume in minutes with our free AI resume builder. Tailored for developers, software engineers, and tech professionals. 2026-ready templates, keyword optimization, and instant PDF export.',
    keywords: [
      'ai resume builder free',
      'ats friendly resume builder',
      'free resume builder for developers',
      'best ai resume builder 2026',
      'resume builder for software engineers',
      'ats resume checker free',
      'developer resume template 2026',
      'ai powered resume builder',
      'online resume builder with ats optimization',
      'software developer resume format',
      'professional resume builder free',
      'resume maker for tech jobs',
      'ats optimized resume template',
      'developersmatrix resume builder',
      'free cv builder online',
      'resume builder for programmers',
      'ai resume writer',
      'resume generator for developers',
      'best free resume builder 2026',
      'create resume online free'
    ],
    path: '/tools/ai-resume-builder'
  },
  'ai-cover-letter-generator': {
    title: 'Free AI Cover Letter Generator for Tech Jobs | No Signup 2026',
    description: 'Free AI cover letter generator for developers, engineers, and tech professionals. Create personalized, ATS-friendly cover letters tailored to any job description in under 60 seconds. No signup, no credit card, unlimited use.',
    keywords: [
      'ai cover letter generator free',
      'free cover letter builder',
      'cover letter generator for tech jobs',
      'software engineer cover letter template',
      'ats friendly cover letter',
      'cover letter maker online free',
      'cover letter template 2026',
      'job application letter generator',
      'cover letter for developers',
      'personalized cover letter ai',
      'cover letter writing tool free',
      'cover letter for software engineer',
      'cover letter tips 2026',
      'cover letter generator no signup',
      'ai powered cover letter writer',
      'cover letter for data scientist',
      'cover letter for devops engineer',
      'cover letter optimization',
      'developersmatrix cover letter',
      'how to write a cover letter 2026'
    ],
    path: '/tools/ai-cover-letter-generator'
  },
  'ai-interview-simulator': {
    title: 'Free AI Interview Simulator | Mock Practice for Tech Jobs 2026',
    description: 'Free AI-powered interview simulator for developers and tech professionals. Practice behavioral, technical, and system design interviews with instant feedback. Role-specific questions for frontend, backend, DevOps, and data roles. No signup needed.',
    keywords: [
      'ai interview simulator free',
      'mock interview practice online',
      'coding interview prep 2026',
      'technical interview practice free',
      'behavioral interview questions and answers',
      'star method interview examples',
      'system design interview prep',
      'software engineer interview questions',
      'free interview preparation tool',
      'ai mock interview',
      'interview feedback tool',
      'practice coding interviews',
      'job interview simulator',
      'developersmatrix interview simulator',
      'faang interview prep 2026',
      'frontend developer interview questions',
      'backend developer interview questions',
      'full stack interview questions',
      'devops interview questions',
      'interview confidence builder'
    ],
    path: '/tools/ai-interview-simulator'
  },
  'salary-estimator': {
    title: 'Free Salary Estimator 2026 | Tech Salary Calculator by Role & Location',
    description: 'Free tech salary estimator for 2026. Calculate software engineer, developer, data scientist, and tech role salaries by city and experience. Compare compensation across San Francisco, New York, Seattle, Austin, and remote. Updated with 2026 market data. No signup needed.',
    keywords: [
      'salary estimator 2026',
      'tech salary calculator',
      'software engineer salary 2026',
      'developer salary by city',
      'free salary comparison tool',
      'compensation calculator tech',
      'data scientist salary 2026',
      'devops engineer salary',
      'frontend developer salary',
      'backend developer salary',
      'full stack developer pay',
      'product manager salary 2026',
      'tech salary remote vs onsite',
      'salary by location usa',
      'cost of living salary adjustment',
      'negotiate salary tech jobs',
      'machine learning engineer salary',
      'engineering manager compensation',
      'site reliability engineer salary',
      'developersmatrix salary tool'
    ],
    path: '/tools/salary-estimator'
  },
  'budget-planner': {
    title: 'Budget Planner - Free Personal Finance Tool',
    description: 'Take control of your finances with our free budget planner. Track income, expenses, visualize spending patterns, and reach your savings goals.',
    keywords: ['budget planner', 'expense tracker', 'personal finance', 'money management', 'savings calculator', 'free budget tool'],
    path: '/tools/budget-planner'
  },
  'habit-tracker': {
    title: 'Habit Tracker - Build Better Daily Habits',
    description: 'Build better habits and break bad ones with our free habit tracker. Track daily routines, build streaks, and visualize your progress.',
    keywords: ['habit tracker', 'daily habits', 'habit building', 'productivity tracker', 'routine tracker', 'free habit app'],
    path: '/tools/habit-tracker'
  },
  'productivity-planner': {
    title: 'Productivity Planner - Optimize Your Daily Workflow',
    description: 'Maximize efficiency with our AI-powered productivity planner. Smart task management, priority optimization, and intelligent scheduling.',
    keywords: ['productivity planner', 'task manager', 'daily planner', 'time management', 'work organizer', 'free planner'],
    path: '/tools/productivity-planner'
  },
  'startup-idea-generator': {
    title: 'Startup Idea Generator - AI Business Ideas',
    description: 'Spark your entrepreneurial journey with AI-generated startup ideas. Get innovative business concepts, market analysis, and implementation guidance.',
    keywords: ['startup ideas', 'business ideas', 'AI business generator', 'entrepreneur ideas', 'startup generator', 'business concept'],
    path: '/tools/startup-idea-generator'
  },
  'ai-prompt-library': {
    title: 'AI Prompt Library - 500+ Curated Prompts',
    description: 'Access 500+ curated AI prompts for ChatGPT, Claude, Midjourney, and more. Test prompts in our sandbox and discover proven prompt engineering techniques.',
    keywords: ['AI prompts', 'prompt library', 'ChatGPT prompts', 'Midjourney prompts', 'prompt engineering', 'prompt collection'],
    path: '/tools/ai-prompt-library'
  },
  'ai-email-assistant': {
    title: 'AI Email Assistant - Write Professional Emails Fast',
    description: 'Draft professional emails in seconds from brief notes. Rewrite emails to sound more professional and adjust tone for any situation.',
    keywords: ['email assistant', 'AI email writer', 'professional email', 'email drafter', 'email tone', 'email generator'],
    path: '/tools/ai-email-assistant'
  },
  'link-manager': {
    title: 'Link Manager - Branded Links & Smart Bio Pages',
    description: 'Create custom branded short links with click analytics, QR codes, and auto-updating bio pages that sync with your YouTube and Instagram content.',
    keywords: ['link shortener', 'bio link', 'QR code generator', 'link analytics', 'branded links', 'link in bio'],
    path: '/tools/link-manager'
  },
  'can-you-run-it': {
    title: 'Can You Run It? - Game System Requirements Checker',
    description: 'Check if your PC can run any game before buying. Compare your specs against requirements for 1000+ games including GTA 6, Cyberpunk 2077, and more.',
    keywords: ['can you run it', 'game requirements', 'PC specs checker', 'system requirements', 'gaming hardware', 'game compatibility'],
    path: '/tools/can-you-run-it'
  }
};
