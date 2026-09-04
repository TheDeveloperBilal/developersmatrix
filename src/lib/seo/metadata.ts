import { Metadata } from 'next';
import { siteConfig } from '@/data/config';
import { siteAuthor } from '@/data/authors';

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
  const pageAuthor = author || siteAuthor.name;

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: pageAuthor, url: `${siteConfig.url}/about` }],
    creator: pageAuthor,
    publisher: siteConfig.name,
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
    title: 'Free Website Audit Tool — Check SEO, Speed & Security Instantly | DevelopersMatrix',
    description: 'Free AI-powered website audit tool. Check SEO, page speed, Core Web Vitals, mobile UX, security, and accessibility. Get instant scores and actionable fixes. No signup needed.',
    keywords: [
      'free website audit tool',
      'website seo checker free',
      'site audit online instant',
      'website health check free',
      'seo audit tool no signup',
      'website performance checker',
      'free website analyzer',
      'core web vitals checker',
      'website speed test free',
      'technical seo audit online',
      'website security scanner free',
      'mobile friendly test tool',
      'accessibility audit free',
      'page speed insights free',
      'seo score checker online'
    ],
    path: '/tools/website-audit'
  },
  'ai-content-detector': {
    title: 'Free AI Content Detector — Check Text Authenticity Instantly | DevelopersMatrix',
    description: 'Free AI content detector with real perplexity and burstiness analysis. Detect ChatGPT, GPT-4, Claude, and Gemini text instantly. 7 content modes, sentence-level breakdown, SEO issue detection. No signup, no credit card, 100% free.',
    keywords: [
      'free ai content detector',
      'ai text checker online',
      'detect ai generated text',
      'chatgpt detector free',
      'perplexity score checker',
      'burstiness analysis tool',
      'ai text detection free',
      'content authenticity checker',
      'ai generated content detector',
      'free ai writing detector',
      'detect chatgpt text',
      'ai content analysis free',
      'human vs ai text checker',
      'ai detection tool no signup',
      'content originality checker free'
    ],
    path: '/tools/ai-content-detector'
  },
  'ai-resume-builder': {
    title: 'Free AI Resume Builder — Create ATS-Friendly Resumes Online | DevelopersMatrix',
    description: 'Build an ATS-friendly resume in minutes with our free AI resume builder. Tailored for developers, software engineers, and tech professionals. 2026-ready templates, keyword optimization, and instant PDF export.',
    keywords: [
      'free resume builder online',
      'create resume free',
      'ats resume builder free',
      'ai resume builder no signup',
      'developer resume creator',
      'software engineer resume tool',
      'online cv builder free',
      'resume maker instant',
      'free resume generator',
      'ats friendly resume maker',
      'tech resume builder online',
      'build resume in minutes',
      'resume pdf export free',
      'programmer resume template',
      'free resume creator 2026'
    ],
    path: '/tools/ai-resume-builder'
  },
  'ai-cover-letter-generator': {
    title: 'Free AI Cover Letter Generator — Create Cover Letters in 60 Seconds | DevelopersMatrix',
    description: 'Free AI cover letter generator for developers, engineers, and tech professionals. Create personalized, ATS-friendly cover letters tailored to any job description in under 60 seconds. No signup, no credit card, unlimited use.',
    keywords: [
      'free cover letter generator',
      'ai cover letter creator online',
      'cover letter maker free',
      'cover letter builder instant',
      'software engineer cover letter',
      'ats friendly cover letter free',
      'cover letter for tech jobs',
      'personalized cover letter ai',
      'job application letter generator',
      'cover letter template free',
      'cover letter writer online',
      'developer cover letter tool',
      'cover letter no signup',
      'ai powered cover letter maker',
      'create cover letter fast'
    ],
    path: '/tools/ai-cover-letter-generator'
  },
  'ai-interview-simulator': {
    title: 'Free AI Interview Simulator — Practice Tech Interviews Online | DevelopersMatrix',
    description: 'Free AI-powered interview simulator for developers and tech professionals. Practice behavioral, technical, and system design interviews with instant feedback. Role-specific questions for frontend, backend, DevOps, and data roles. No signup needed.',
    keywords: [
      'free interview simulator',
      'mock interview online free',
      'practice technical interviews',
      'ai mock interview tool',
      'coding interview practice',
      'behavioral interview simulator',
      'system design practice free',
      'software engineer interview prep',
      'frontend interview questions free',
      'backend interview practice',
      'devops interview simulator',
      'data science interview prep',
      'interview feedback tool free',
      'free coding interview platform',
      'tech interview practice online'
    ],
    path: '/tools/ai-interview-simulator'
  },
  'salary-estimator': {
    title: 'Free Tech Salary Calculator — Check Salaries by Role & City | DevelopersMatrix',
    description: 'Free tech salary estimator for 2026. Calculate software engineer, developer, data scientist, and tech role salaries by city and experience. Compare compensation across San Francisco, New York, Seattle, Austin, and remote. Updated with 2026 market data. No signup needed.',
    keywords: [
      'free salary calculator',
      'tech salary checker online',
      'software engineer salary 2026',
      'developer pay calculator',
      'data scientist salary check',
      'devops salary estimator',
      'frontend developer pay',
      'backend engineer salary',
      'full stack salary calculator',
      'product manager compensation',
      'remote vs onsite salary',
      'salary by city usa',
      'cost of living calculator tech',
      'negotiate salary tool free',
      'machine learning engineer pay'
    ],
    path: '/tools/salary-estimator'
  },
  'budget-planner': {
    title: 'Free Budget Planner — Track Income, Expenses & Savings Goals | DevelopersMatrix',
    description: 'Free AI-powered budget planner for 2026. Track income and expenses, visualize spending patterns, calculate savings goals, and get personalized financial insights. Perfect for developers, freelancers, and professionals managing variable income. No signup needed.',
    keywords: [
      'free budget planner online',
      'personal budget tracker',
      'expense tracker free',
      'monthly budget calculator',
      'income tracker tool free',
      'savings goal calculator',
      'freelance budget planner',
      'developer finance tool',
      'spending analysis free',
      'budget vs actual tracker',
      'personal finance app free',
      'money management tool',
      'variable income budget',
      'budget breakdown online',
      'financial planning tool free'
    ],
    path: '/tools/budget-planner'
  },
  'habit-tracker': {
    title: 'Free Habit Tracker — Build Daily Routines & Track Streaks | DevelopersMatrix',
    description: 'Free habit tracker for 2026. Build positive daily routines, break bad habits, track streaks, and visualize your progress with beautiful charts. Perfect for developers and professionals seeking consistency. No signup needed, works offline.',
    keywords: [
      'free habit tracker online',
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
      'goal tracking free online'
    ],
    path: '/tools/habit-tracker'
  },
  'productivity-planner': {
    title: 'Free Productivity Planner — AI Task Manager & Daily Schedule | DevelopersMatrix',
    description: 'Free AI-powered productivity planner for 2026. Smart task management, priority optimization, intelligent scheduling, and deep work blocks. Perfect for developers, freelancers, and remote workers. No signup, no credit card, unlimited use.',
    keywords: [
      'free productivity planner online',
      'ai task manager free',
      'daily planner tool',
      'time management app free',
      'task priority optimizer',
      'developer productivity tool',
      'remote work planner',
      'deep work scheduler',
      'daily workflow optimizer',
      'smart to do list free',
      'project task planner online',
      'focus time tracker',
      'work schedule generator',
      'productivity dashboard free',
      'ai powered planner no signup'
    ],
    path: '/tools/productivity-planner'
  },
  'startup-idea-generator': {
    title: 'Free Startup Idea Generator — AI Business Ideas by Industry | DevelopersMatrix',
    description: 'Free AI startup idea generator for 2026. Discover innovative business ideas across AI, SaaS, FinTech, HealthTech, Climate Tech, Robotics, and more. Each idea includes market analysis, monetization strategy, competition level, and MVP timeline. No signup needed.',
    keywords: [
      'free startup idea generator',
      'ai business ideas generator',
      'startup ideas by industry',
      'tech startup concepts free',
      'business idea generator online',
      'saas startup ideas',
      'fintech business ideas',
      'climate tech startups',
      'healthtech startup ideas',
      'robotics startup concepts',
      'entrepreneur ideas generator',
      'startup validation tool free',
      'business concept generator',
      'mvp timeline calculator',
      'market analysis tool free'
    ],
    path: '/tools/startup-idea-generator'
  },
  'ai-prompt-library': {
    title: 'Free AI Prompt Library — 500+ Prompts for ChatGPT & Claude | DevelopersMatrix',
    description: 'Free AI prompt library with 500+ tested prompts for ChatGPT, Claude, Midjourney, DALL-E, and more. Organized by category with copy-paste ease. Test prompts in our live sandbox. No signup needed. Updated for 2026 AI models.',
    keywords: [
      'free ai prompt library',
      'chatgpt prompts free',
      'midjourney prompts free',
      'claude prompts library',
      'prompt engineering examples',
      'ai prompt collection free',
      'dalle prompt ideas',
      'prompt library online',
      'best chatgpt prompts free',
      'prompt engineering guide free',
      'coding prompts chatgpt',
      'marketing prompts ai free',
      'creative writing prompts ai',
      'prompt testing tool free',
      'ai prompt sandbox no signup'
    ],
    path: '/tools/ai-prompt-library'
  },
  'ai-email-assistant': {
    title: 'Free AI Email Assistant — Write Professional Emails Instantly | DevelopersMatrix',
    description: 'Free AI email assistant that writes professional emails from brief notes in seconds. Rewrite for tone, draft follow-ups, and generate cold outreach. Perfect for developers, freelancers, and professionals. No signup, no credit card, unlimited use.',
    keywords: [
      'free ai email assistant',
      'ai email writer online',
      'professional email generator',
      'ai email drafter free',
      'cold email generator free',
      'email tone rewriter',
      'follow up email writer ai',
      'business email generator',
      'email writing assistant free',
      'formal email generator',
      'ai email composer',
      'professional email template',
      'developer email assistant',
      'freelance email generator',
      'job application email ai'
    ],
    path: '/tools/ai-email-assistant'
  },
  'link-manager': {
    title: 'Free Link Shortener & Bio Page Builder — Branded Links | DevelopersMatrix',
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
      'portfolio link page free'
    ],
    path: '/tools/link-manager'
  },
  'can-you-run-it': {
    title: 'Can You Run It? — Free PC Game Requirements Checker | DevelopersMatrix',
    description: 'Free PC game requirements checker for 2026. Compare your hardware specs against minimum and recommended requirements for popular games including GTA 6, Cyberpunk, Elden Ring, and more. Get FPS estimates and upgrade suggestions. No signup needed.',
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
      'free system spec checker'
    ],
    path: '/tools/can-you-run-it'
  },
};
