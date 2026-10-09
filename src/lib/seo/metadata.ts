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
    description: 'Browse 20+ free tools for your career, website and money: resume builder, cover letter generator, website audit, interview practice, budget planner and more.',
    keywords: ['AI tools', 'free tools', 'productivity tools', 'career tools', 'resume builder', 'budget planner'],
    path: '/tools'
  },
  blog: {
    title: 'Blog: Tech News and Career Insights',
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
    title: 'Community Q&A: Ask and Answer',
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
    title: 'Connect: Collaborate and Partner',
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
    title: 'Free Website Audit Tool: SEO and Speed Check',
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
    title: 'Free AI Content Detector: Check Any Text',
    description: 'Free AI content detector. See whether text reads like ChatGPT or human writing, which sentences carry AI patterns, and why. Honest results, no signup.',
    keywords: [
      'free ai content detector',
      'ai text checker online',
      'detect ai generated text',
      'chatgpt detector free',
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
    title: 'Free AI Resume Builder for ATS Resumes',
    description: 'Free resume builder for ATS friendly resumes. Three clean templates, a resume check that flags weak bullets, job match keywords and PDF export. No signup.',
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
    title: 'Free AI Cover Letter Generator',
    description: 'Free cover letter generator that writes from your experience and the job posting. Three tones, a live check for weak lines, then copy, download or print.',
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
    title: 'Free AI Interview Simulator for Tech Jobs',
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
    title: 'Free Tech Salary Calculator by Role and City',
    description: 'Free salary estimator with official BLS pay data. See the median and pay range for 35 tech, data, design and marketing jobs in any US state or metro area.',
    keywords: [
      'free salary calculator',
      'salary estimator',
      'tech salary checker online',
      'software engineer salary 2026',
      'developer pay calculator',
      'data scientist salary check',
      'devops salary estimator',
      'frontend developer pay',
      'backend engineer salary',
      'salary by city usa',
      'salary range by job',
      'bls salary data',
      'salary percentile calculator',
      'negotiate salary tool free',
      'machine learning engineer pay'
    ],
    path: '/tools/salary-estimator'
  },
  'budget-planner': {
    title: 'Free Budget Planner: Income and Savings',
    description: 'Free budget planner: add take home pay and bills, turn yearly costs into monthly ones, see what is left over, check 50/30/20 and plan savings. No signup.',
    keywords: [
      'free budget planner online',
      'monthly budget planner',
      'expense tracker free',
      'monthly budget calculator',
      '50/30/20 budget calculator',
      'savings goal calculator',
      'take home pay budget',
      'freelance budget planner',
      'budget planner no signup',
      'personal budget template online'
    ],
    path: '/tools/budget-planner'
  },
  'habit-tracker': {
    title: 'Free Habit Tracker with Daily Streaks',
    description: 'Free habit tracker with streaks counted from real dates, a 12 week wall and a 30 day rate. Fix missed days and back up your habits. No signup needed.',
    keywords: [
      'free habit tracker online',
      'daily habit tracker',
      'habit streak tracker',
      'habit tracker no signup',
      'habit grid tracker',
      'routine tracker online',
      'how long to build a habit',
      'break bad habits tracker',
      'daily checklist tracker',
      'habit tracker with backup'
    ],
    path: '/tools/habit-tracker'
  },
  'productivity-planner': {
    title: 'Free Productivity Planner and Task Manager',
    description: 'Free productivity planner: turn tasks into an hour by hour plan with a Top 3, fixed meetings and an overbooked warning. Export to your calendar. No signup.',
    keywords: [
      'free productivity planner online',
      'daily planner tool',
      'time blocking planner',
      'hour by hour day planner',
      'daily task manager free',
      'top 3 priorities planner',
      'plan my day tool',
      'day planner with calendar export',
      'to do list with time estimates',
      'ai day planner prompt'
    ],
    path: '/tools/productivity-planner'
  },
  'startup-idea-generator': {
    title: 'Free Startup Idea Generator by Industry',
    description: 'Free startup idea generator: answer five questions and get business ideas matched to your skills, time and budget, with an idea canvas and a 7 day test plan.',
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
    title: 'Free AI Prompt Library for ChatGPT and Claude',
    // Keep the number in line with PROMPTS.length in src/lib/prompts/library.ts
    description: 'Free AI prompt library with 64 ready prompts for ChatGPT, Claude, Gemini and Midjourney. Fill in the blanks, then copy or open in ChatGPT or Claude.',
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
    title: 'Free AI Email Assistant for Fast Replies',
    description: 'Free AI email assistant with 18 email templates in 3 tones, a draft checker, and ready prompts to reply or rewrite in ChatGPT or Claude. No signup.',
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
  'can-you-run-it': {
    title: 'Can You Run It? Free PC Requirements Checker',
    description: 'Can my PC run it? Enter your CPU, GPU and RAM and compare them with the specs publishers released for Cyberpunk 2077, Elden Ring, Battlefield 6 and more. Free, no signup.',
    keywords: [
      'can you run it',
      'can you run it free',
      'can my pc handle this game',
      'can my pc run it',
      'can i run it',
      'can my pc run this game',
      'pc game requirements checker',
      'system requirements checker',
      'game compatibility test',
      'fps estimator tool',
      'cyberpunk 2077 specs check',
      'pc hardware checker',
      'game performance predictor',
      'gpu requirements checker',
      'cpu compatibility tool',
      'ram requirements game',
      'upgrade suggestions pc gaming',
      'free system spec checker'
    ],
    path: '/tools/can-you-run-it'
  },
};
