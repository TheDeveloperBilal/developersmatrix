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
    title: 'Free Budget Planner 2026 | Personal Finance Calculator & Expense Tracker',
    description: 'Free AI-powered budget planner for 2026. Track income and expenses, visualize spending patterns, calculate savings goals, and get personalized financial insights. Perfect for developers, freelancers, and professionals managing variable income. No signup needed.',
    keywords: [
      'free budget planner 2026',
      'personal budget calculator',
      'expense tracker free',
      'monthly budget planner',
      'income tracker tool',
      'savings goal calculator',
      'freelance budget planner',
      'developer finance tool',
      'spending analysis free',
      'budget vs actual tracker',
      'personal finance app free',
      'money management tool',
      'variable income budget',
      'budget breakdown tool',
      'financial planning free',
      'expense categorization tool',
      'developersmatrix budget planner',
      'simple budget tracker',
      'household budget calculator'
    ],
    path: '/tools/budget-planner'
  },
  'habit-tracker': {
    title: 'Free Habit Tracker 2026 | Build Better Daily Routines & Streaks',
    description: 'Free habit tracker for 2026. Build positive daily routines, break bad habits, track streaks, and visualize your progress with beautiful charts. Perfect for developers and professionals seeking consistency. No signup needed, works offline.',
    keywords: [
      'free habit tracker',
      'daily habit tracker',
      'habit building app free',
      'streak tracker tool',
      'routine tracker online',
      'habit streak calculator',
      'productivity habits tracker',
      'developer daily routine',
      'break bad habits tool',
      'habit visualization free',
      'daily checklist tracker',
      'consistency tracker',
      'habit progress chart',
      'morning routine tracker',
      'coding habit tracker',
      'habit reminder tool free',
      'developersmatrix habit tracker',
      'goal tracking free',
      'personal development tracker'
    ],
    path: '/tools/habit-tracker'
  },
  'productivity-planner': {
    title: 'Free Productivity Planner 2026 | AI Task Manager & Daily Workflow',
    description: 'Free AI-powered productivity planner for 2026. Smart task management, priority optimization, intelligent scheduling, and deep work blocks. Perfect for developers, freelancers, and remote workers. No signup, no credit card, unlimited use.',
    keywords: [
      'free productivity planner',
      'ai task manager free',
      'daily planner tool',
      'time management app free',
      'task priority optimizer',
      'developer productivity tool',
      'remote work planner',
      'deep work scheduler',
      'daily workflow optimizer',
      'smart to do list',
      'project task planner free',
      'focus time tracker',
      'work schedule generator',
      'productivity dashboard free',
      'task batching tool',
      'weekly planner online free',
      'developersmatrix productivity planner',
      'pomodoro alternative free',
      'ai powered planner 2026'
    ],
    path: '/tools/productivity-planner'
  },
  'startup-idea-generator': {
    title: 'Free AI Startup Idea Generator 2026 | Business Ideas by Industry',
    description: 'Free AI startup idea generator for 2026. Discover innovative business ideas across AI, SaaS, FinTech, HealthTech, Climate Tech, Robotics, and more. Each idea includes market analysis, monetization strategy, competition level, and MVP timeline. No signup needed.',
    keywords: [
      'startup idea generator free',
      'ai business ideas 2026',
      'startup ideas by industry',
      'tech startup concepts',
      'business idea generator',
      'ai startup ideas',
      'saas startup ideas 2026',
      'fintech business ideas',
      'climate tech startups',
      'healthtech startup ideas',
      'robotics startup concepts',
      'entrepreneur ideas generator',
      'startup validation tool',
      'business concept generator',
      'mvp timeline calculator',
      'market analysis tool free',
      'startup monetization ideas',
      'developersmatrix startup generator',
      'innovative business ideas 2026',
      'tech entrepreneurship ideas'
    ],
    path: '/tools/startup-idea-generator'
  },
  'ai-prompt-library': {
    title: 'Free AI Prompt Library 2026 | 500+ Prompts for ChatGPT, Claude & Midjourney',
    description: 'Free AI prompt library with 500+ tested prompts for ChatGPT, Claude, Midjourney, DALL-E, and more. Organized by category with copy-paste ease. Test prompts in our live sandbox. No signup needed. Updated for 2026 AI models.',
    keywords: [
      'ai prompt library free',
      'free chatgpt prompts',
      'midjourney prompts free',
      'claude prompts library',
      'prompt engineering examples',
      'ai prompt collection',
      'dalle prompt ideas',
      'prompt library 2026',
      'best chatgpt prompts',
      'free prompt engineering guide',
      'coding prompts chatgpt',
      'marketing prompts ai',
      'creative writing prompts ai',
      'prompt testing tool free',
      'ai prompt sandbox',
      'prompt engineering techniques',
      'system prompts examples',
      'developersmatrix prompt library',
      'ai prompt templates free',
      'prompt generator tool'
    ],
    path: '/tools/ai-prompt-library'
  },
  'ai-email-assistant': {
    title: 'Free AI Email Assistant 2026 | Professional Emails in Seconds — No Signup',
    description: 'Free AI email assistant that writes professional emails from brief notes in seconds. Rewrite for tone, draft follow-ups, and generate cold outreach. Perfect for developers, freelancers, and professionals. No signup, no credit card, unlimited use.',
    keywords: [
      'ai email assistant free',
      'free email writer ai',
      'professional email generator',
      'ai email drafter',
      'cold email generator free',
      'email tone rewriter',
      'follow up email writer ai',
      'business email generator',
      'email writing assistant',
      'formal email generator free',
      'ai email composer',
      'professional email template 2026',
      'developer email assistant',
      'freelance email generator',
      'job application email ai',
      'email reply generator',
      'email formatting assistant',
      'developersmatrix email assistant',
      'ai email writing tool',
      'smart email writer free'
    ],
    path: '/tools/ai-email-assistant'
  },
  'link-manager': {
    title: 'Free Link Shortener & Bio Link Page 2026 | Branded Links + Analytics',
    description: 'Free branded link shortener with click analytics, QR codes, and smart bio pages. Create custom short links, track clicks in real-time, and build auto-updating link-in-bio pages. Perfect for creators, developers, and businesses. No signup needed.',
    keywords: [
      'free link shortener',
      'bio link page free',
      'branded link shortener',
      'link in bio tool free',
      'url shortener with analytics',
      'qr code generator free',
      'custom short links free',
      'link tracking tool',
      'link manager free',
      'click analytics tool',
      'social media link page',
      'url shortener no signup',
      'free url tracker',
      'developer link tools',
      'portfolio link page',
      'link shortener 2026',
      'bio page generator',
      'developersmatrix link manager',
      'smart link tool free',
      'link analytics dashboard'
    ],
    path: '/tools/link-manager'
  },
  'can-you-run-it': {
    title: 'Can You Run It? 2026 | Free PC Game Requirements Checker & FPS Estimator',
    description: 'Free PC game requirements checker for 2026. Compare your hardware specs against minimum and recommended requirements for 1000+ games including GTA 6, Cyberpunk, Elden Ring, and more. Get FPS estimates and upgrade suggestions. No signup needed.',
    keywords: [
      'can you run it free',
      'pc game requirements checker',
      'system requirements checker',
      'game compatibility test',
      'fps estimator tool',
      'gta 6 requirements check',
      'cyberpunk 2077 specs check',
      'pc hardware checker',
      'game performance predictor',
      'gpu requirements checker',
      'cpu compatibility tool',
      'ram requirements game',
      'upgrade suggestions pc gaming',
      'can my pc run this game',
      'free system spec checker',
      'gaming pc analyzer',
      'developersmatrix can you run it',
      '2026 game requirements',
      'pc build checker free'
    ],
    path: '/tools/can-you-run-it'
  },
};
