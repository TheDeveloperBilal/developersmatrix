import { Tool, FAQ } from '@/types';

const resumeBuilderFaqs: FAQ[] = [
  {
    question: "How does the AI Resume Builder work?",
    answer: "You fill in each section and see your resume on a live A4 page as you type. A built in check flags weak openers, bullets without numbers, pronouns, tense mistakes and missing details, and a summary helper drafts a summary from your own details. Paste a job posting to see which of its skills your resume already shows. Then download a PDF or copy the text."
  },
  {
    question: "Is this resume builder suitable for all industries?",
    answer: "It works for any role, and it is tuned for tech: the skills matching knows around 150 tech, product, data and marketing skills, and the check rules (a verb first, a result with a number, one idea per line) apply to every industry."
  },
  {
    question: "Can I customize the generated resume?",
    answer: "Yes. Everything on the resume is your own text, and you can switch between three templates and five accent colours at any time. The builder never rewrites your bullets; it shows you what to fix."
  },
  {
    question: "What formats can I export my resume in?",
    answer: "You can download a PDF, download a plain text file, or copy the text. PDF is recommended for most applications. If an employer asks for Word, paste the text into Word and save it as DOCX."
  }
];

const coverLetterFaqs: FAQ[] = [
  {
    question: "How do I write an effective cover letter with AI?",
    answer: "Paste the job posting, add your current role, one or two results with numbers and why you want the job. The tool matches the skills in the posting against yours, writes the letter from your details, and then checks it for stock phrases, missing numbers and placeholders."
  },
  {
    question: "What makes a cover letter stand out to employers?",
    answer: "A standout cover letter is personalized to the company, demonstrates knowledge of the role, highlights relevant achievements with specific examples, and shows enthusiasm for the position. The tool asks for each of these, and its letter check tells you which one is missing."
  },
  {
    question: "Should I customize my cover letter for each application?",
    answer: "Yes, absolutely! Each cover letter should be tailored to the specific role and company. Paste each new job description and the letter is rebuilt around the skills that posting asks for, while your saved details stay filled in."
  }
];

const interviewFaqs: FAQ[] = [
  {
    question: "How does the AI Interview Simulator work?",
    answer: "It picks a question written for your role and level. When you answer, it checks your answer against a rubric for that question, its structure and its detail, then shows what you covered, what you missed, a model answer and the follow up an interviewer would likely ask."
  },
  {
    question: "What types of interview questions are included?",
    answer: "Behavioral questions, technical questions for your role, and a third round that is system design for engineers or a product, analytics or team case for other roles. You choose the role, the round and an entry, mid or senior level."
  },
  {
    question: "Can I practice for specific companies?",
    answer: "Not yet. The questions are organised by role and level rather than by company. They cover the behavioral, technical and system design patterns that large tech companies use, so they are still useful for company preparation, but there are no company specific tracks."
  }
];

const budgetPlannerFaqs: FAQ[] = [
  {
    question: "How does the Budget Planner help with financial planning?",
    answer: "Our Budget Planner provides a comprehensive view of your income and expenses, helping you identify spending patterns, set savings goals, and make informed financial decisions. Visual charts make it easy to understand your financial health."
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. All data is stored locally in your browser and never sent to external servers. Your financial information remains completely private and under your control."
  },
  {
    question: "Can I track multiple income sources?",
    answer: "Yes! The Budget Planner supports multiple income streams and expense categories. Whether you have a salary, freelance income, investments, or side hustles, you can track everything in one place."
  }
];

const habitTrackerFaqs: FAQ[] = [
  {
    question: "How does habit tracking improve productivity?",
    answer: "Habit tracking creates accountability and visual progress feedback. Seeing your streaks grow motivates continued behavior, while the data helps identify patterns and optimize your daily routines for maximum productivity."
  },
  {
    question: "What types of habits can I track?",
    answer: "You can track any habit - from health routines like exercise and water intake, to productivity habits like reading, coding practice, or meditation. Custom categories let you organize habits your way."
  },
  {
    question: "Does the app send reminders?",
    answer: "Yes, you can set custom reminders for each habit. Choose the time and frequency that works best for your schedule to ensure you never miss a day."
  }
];

const salaryEstimatorFaqs: FAQ[] = [
  {
    question: "Where does the salary data come from?",
    answer: "From the U.S. Bureau of Labor Statistics (BLS) Occupational Employment and Wage Statistics survey, where employers report what they pay. The tool shows the latest official estimates, not job ads or self reported salaries."
  },
  {
    question: "How accurate are the salary figures?",
    answer: "They are the official government estimates from a large employer survey, so they make a solid benchmark. They describe everyone in a job category, so your own pay still depends on your employer, industry, skills and experience."
  },
  {
    question: "How often is the salary data updated?",
    answer: "Once a year. BLS publishes new estimates each spring and the tool is rebuilt from the official files when it does."
  },
  {
    question: "Do the salaries include bonuses and stock?",
    answer: "No. The figures are pay before tax: base pay plus commissions, tips and production bonuses. Overtime, other bonuses, benefits and stock are not included."
  },
  {
    question: "Can I see salaries by experience level?",
    answer: "Not directly, because BLS does not record years of experience. The tool shows the full spread from the 10th to the 90th percentile instead, so you can see where people early or late in their career tend to sit."
  },
  {
    question: "Which jobs and places are covered?",
    answer: "35 job categories across software, IT, data, design, marketing and business, for the whole US, every state, DC, US territories and every metro and nonmetro area BLS publishes. Titles BLS does not track separately, such as DevOps engineer, point you to the closest official categories."
  },
  {
    question: "Is this salary estimator free to use?",
    answer: "Yes. It is free with no signup and no limits."
  }
];

const startupIdeaFaqs: FAQ[] = [
  {
    question: "How does the Startup Idea Generator work?",
    answer: "Answer five questions about your skills, an industry you know, how you want to earn, your hours and your budget. It combines hand written business models with industries and ranks the ideas by how well they fit you. Each idea opens as a one page canvas with a 7 day test plan."
  },
  {
    question: "Are the ideas validated?",
    answer: "No tool can validate an idea for you, so there are no viability scores or market sizes. Each idea comes with a 7 day plan to test it with real customers before you build."
  },
  {
    question: "Can I save ideas?",
    answer: "Yes. Saved ideas and your answers are kept in your own browser. You can also copy the canvas or share a link to an idea."
  },
  {
    question: "Is it free?",
    answer: "Yes. Free with no signup and no limits."
  }
];

const productivityPlannerFaqs: FAQ[] = [
  {
    question: "What makes this productivity planner different?",
    answer: "Our AI-powered planner combines task management with intelligent scheduling suggestions, priority optimization, and productivity insights. It learns from your patterns to help you work smarter, not harder."
  },
  {
    question: "Can I integrate this with other tools?",
    answer: "The planner is designed to work standalone or alongside your existing tools. Export options and future integrations with popular calendars and project management tools are planned."
  },
  {
    question: "How does the AI help with prioritization?",
    answer: "The AI analyzes task urgency, importance, dependencies, and your historical productivity patterns to suggest optimal task ordering and time allocation for maximum efficiency."
  }
];

export const tools: Tool[] = [
  {
    id: 'ai-resume-builder',
    slug: 'ai-resume-builder',
    name: 'AI Resume Builder',
    description: 'Write your resume on a live A4 page with three ATS friendly templates. A built in check flags weak bullets and missing numbers, a job posting comparison shows skill gaps, and you download a clean PDF.',
    shortDescription: 'Build ATS-optimized resumes with AI assistance',
    icon: 'FileText',
    category: 'career',
    features: [
      'Live A4 preview with page breaks',
      'Three ATS friendly templates',
      'Resume check on every bullet',
      'Job posting skill matching',
      'Summary helper from your own details',
      'PDF, text and copy export'
    ],
    benefits: [
      'Save hours of resume writing time',
      'Catch weak bullets before a recruiter does',
      'Pass ATS screening systems',
      'Professional formatting automatically'
    ],
    faqs: resumeBuilderFaqs,
    keywords: ['resume builder', 'AI resume', 'ATS resume', 'professional resume', 'resume maker', 'job application'],
    path: '/tools/ai-resume-builder'
  },
  {
    id: 'ai-cover-letter-generator',
    slug: 'ai-cover-letter-generator',
    name: 'AI Cover Letter Generator',
    description: 'Paste the job description, add your best results, and get a tailored cover letter built from your own experience. It leads with the skills the posting asks for and checks the letter for stock phrases, missing numbers and gaps.',
    shortDescription: 'Generate personalized cover letters for any job',
    icon: 'Mail',
    category: 'career',
    features: [
      'Job description skill matching',
      'Built only from your own results',
      'Formal, warm and direct tones',
      'Short and standard lengths',
      'Live letter check as you edit',
      'Copy, download as text or print to PDF'
    ],
    benefits: [
      'Stand out from other applicants',
      'Save time on each application',
      'Tailored content for every job',
      'No invented skills or claims'
    ],
    faqs: coverLetterFaqs,
    keywords: ['cover letter generator', 'AI cover letter', 'job application letter', 'cover letter maker'],
    path: '/tools/ai-cover-letter-generator'
  },
  {
    id: 'ai-interview-simulator',
    slug: 'ai-interview-simulator',
    name: 'AI Interview Simulator',
    description: 'Practice interviews with our AI-powered simulator. Get realistic questions, practice your responses, and receive instant feedback to improve your interview performance and confidence.',
    shortDescription: 'Practice interviews with AI feedback',
    icon: 'MessageSquare',
    category: 'career',
    features: [
      'Role-specific questions',
      'Real-time feedback',
      'Session score tracking',
      'Multiple interview types',
      'Model answers for every question',
      'Speak your answer where supported'
    ],
    benefits: [
      'Build interview confidence',
      'Identify improvement areas',
      'Practice anywhere, anytime',
      'See exactly what your answer is missing'
    ],
    faqs: interviewFaqs,
    keywords: ['interview simulator', 'interview practice', 'AI interview', 'mock interview', 'job interview prep'],
    path: '/tools/ai-interview-simulator'
  },
  {
    id: 'budget-planner',
    slug: 'budget-planner',
    name: 'Budget Planner',
    description: 'Take control of your finances with our comprehensive budget planner. Track income and expenses, visualize spending patterns, set savings goals, and make smarter financial decisions.',
    shortDescription: 'Track finances and optimize spending',
    icon: 'Wallet',
    category: 'finance',
    features: [
      'Income and expense tracking',
      'Visual spending charts',
      'Savings goal setting',
      'Budget alerts',
      'Multiple currency support',
      'Export financial reports'
    ],
    benefits: [
      'Understand your spending habits',
      'Reach savings goals faster',
      'Make informed financial decisions',
      'Reduce financial stress'
    ],
    faqs: budgetPlannerFaqs,
    keywords: ['budget planner', 'expense tracker', 'personal finance', 'money management', 'savings calculator'],
    path: '/tools/budget-planner'
  },
  {
    id: 'habit-tracker',
    slug: 'habit-tracker',
    name: 'Daily Habit Tracker',
    description: 'Build better habits and break bad ones with our intuitive habit tracker. Track daily routines, build streaks, visualize progress, and develop the consistency needed for personal growth.',
    shortDescription: 'Build lasting habits with streak tracking',
    icon: 'CheckCircle',
    category: 'productivity',
    features: [
      'Daily habit logging',
      'Streak tracking',
      'Progress visualization',
      'Custom categories',
      'Reminder notifications',
      'Weekly/monthly reviews'
    ],
    benefits: [
      'Build consistency in daily routines',
      'Visual motivation through streaks',
      'Identify patterns in behavior',
      'Achieve personal growth goals'
    ],
    faqs: habitTrackerFaqs,
    keywords: ['habit tracker', 'daily habits', 'habit building', 'productivity tracker', 'routine tracker'],
    path: '/tools/habit-tracker'
  },
  {
    id: 'salary-estimator',
    slug: 'salary-estimator',
    name: 'Salary Estimator',
    description: 'See what a job really pays using official U.S. Bureau of Labor Statistics wage data. Get the median and full pay range for 35 jobs in any US state or metro area, check an offer and compare places.',
    shortDescription: 'Official pay ranges by job and US location',
    icon: 'DollarSign',
    category: 'career',
    features: [
      'Official BLS wage data',
      'Pay range from the 10th to the 90th percentile',
      'Every US state and metro area',
      'Offer check by percentile',
      'Compare up to four places',
      'Yearly, monthly and hourly pay'
    ],
    benefits: [
      'Negotiate with a sourced number',
      'Compare places fairly',
      'Understand what is normal for your job',
      'Make informed career decisions'
    ],
    faqs: salaryEstimatorFaqs,
    keywords: ['salary estimator', 'salary calculator', 'pay comparison', 'salary range', 'compensation calculator'],
    path: '/tools/salary-estimator'
  },
  {
    id: 'startup-idea-generator',
    slug: 'startup-idea-generator',
    name: 'Startup Idea Generator',
    description: 'Answer five questions and get startup and side business ideas matched to your skills, time and budget. Each idea opens as a one page canvas with risks and a 7 day plan to test it with real customers.',
    shortDescription: 'Business ideas matched to your skills, with a test plan',
    icon: 'Lightbulb',
    category: 'productivity',
    features: [
      'Ideas matched to your skills, time and budget',
      'Twenty industries and five ways to earn',
      'One page idea canvas',
      'Seven day customer test plan',
      'Pressure test prompt for ChatGPT or Claude',
      'Saved ideas and share links'
    ],
    benefits: [
      'Start from what you already know',
      'Compare ideas against your real time and budget',
      'Test with customers before you build',
      'See the risks early'
    ],
    faqs: startupIdeaFaqs,
    keywords: ['startup ideas', 'business ideas', 'AI business generator', 'entrepreneur ideas', 'startup generator'],
    path: '/tools/startup-idea-generator'
  },
  {
    id: 'productivity-planner',
    slug: 'productivity-planner',
    name: 'Productivity Planner',
    description: 'Maximize your efficiency with our AI-powered productivity planner. Smart task management, priority optimization, and intelligent scheduling help you accomplish more in less time.',
    shortDescription: 'Optimize your daily productivity with AI',
    icon: 'Calendar',
    category: 'productivity',
    features: [
      'Smart task prioritization',
      'Time blocking',
      'Progress tracking',
      'Daily/weekly views',
      'AI scheduling suggestions',
      'Goal alignment'
    ],
    benefits: [
      'Accomplish more daily',
      'Reduce decision fatigue',
      'Build productive habits',
      'Achieve work-life balance'
    ],
    faqs: productivityPlannerFaqs,
    keywords: ['productivity planner', 'task manager', 'daily planner', 'time management', 'work organizer'],
    path: '/tools/productivity-planner'
  },
  {
    id: 'can-you-run-it',
    slug: 'can-you-run-it',
    name: 'Can You Run It?',
    description: 'Check if your PC can run any game before buying. Compare your hardware specs against minimum and recommended requirements for popular games including GTA 6, Cyberpunk 2077, and more.',
    shortDescription: 'Check if your PC can run any game',
    icon: 'Gamepad2',
    category: 'gaming',
    features: [
      'Compare PC specs to game requirements',
      'Minimum & recommended specs check',
      'Games database',
      'Performance prediction',
      'Hardware upgrade suggestions',
      'FPS estimator'
    ],
    benefits: [
      'Save money on games you can\'t run',
      'Know what upgrades you need',
      'Make informed purchase decisions',
      'Avoid disappointment'
    ],
    faqs: [
      { question: "How does the checker work?", answer: "Enter your PC specs and select a game. We compare your hardware against official requirements." },
      { question: "Is it accurate?", answer: "We use official game requirements and benchmark data for accurate comparisons." }
    ],
    keywords: ['can you run it', 'game requirements', 'PC specs checker', 'system requirements', 'gaming hardware'],
    path: '/tools/can-you-run-it'
  },
  {
    id: 'ai-prompt-library',
    slug: 'ai-prompt-library',
    name: 'AI Prompt Library',
    description: 'Free library of ready to use AI prompts for ChatGPT, Claude, Gemini and Midjourney. Fill in the blanks, then copy the prompt or open it in ChatGPT or Claude.',
    shortDescription: 'Ready prompts with a fill in the blanks builder',
    icon: 'BookOpen',
    category: 'productivity',
    features: [
      '64 prompts in 8 categories',
      'Fill in the blanks prompt builder',
      'Open in ChatGPT or Claude',
      'Chat and image prompts',
      'Save prompts in your browser',
      'Copy or share a link to any prompt'
    ],
    benefits: [
      'Get a better first answer from AI',
      'Learn how strong prompts are built',
      'Save time writing prompts',
      'Keep your favourite prompts in one place'
    ],
    faqs: [
      { question: "What is the AI Prompt Library?", answer: "A free collection of ready to use prompts for ChatGPT, Claude, Gemini and image tools, with a builder that turns each blank into a field you fill in." },
      { question: "Can I save prompts?", answer: "Yes. Bookmark any prompt to keep it in your Saved list. It is stored in your browser, and you can copy a link to share any prompt." }
    ],
    keywords: ['AI prompts', 'prompt library', 'ChatGPT prompts', 'Midjourney prompts', 'prompt engineering'],
    path: '/tools/ai-prompt-library'
  },
  {
    id: 'ai-email-assistant',
    slug: 'ai-email-assistant',
    name: 'AI Email Assistant',
    description: 'Write clear work emails from 18 hand written templates in three tones, check any draft for common mistakes, and open ready prompts in ChatGPT or Claude to reply or rewrite.',
    shortDescription: 'Email templates, a draft checker and AI prompts',
    icon: 'Mail',
    category: 'productivity',
    features: [
      '18 email templates in three tones',
      'Blanks you fill in right inside the email',
      'Draft checker with problems marked in the text',
      'Open as a draft in Gmail, Outlook or your mail app',
      'Ready prompts for ChatGPT and Claude to reply or rewrite',
      'Runs in your browser, no signup'
    ],
    benefits: [
      'Start from a clear structure',
      'Pick the right tone for the person',
      'Catch common mistakes before you send',
      'Hand harder emails to AI with a careful prompt'
    ],
    faqs: [
      { question: "What can it do?", answer: "Write an email from 18 templates in three tones, check a draft you paste for common mistakes, and build a prompt to reply or rewrite in ChatGPT or Claude." },
      { question: "Is my email private?", answer: "Templates and the draft checker run in your browser and nothing is sent to us. If you choose to open a prompt in ChatGPT or Claude, your text goes to that service." }
    ],
    keywords: ['email assistant', 'AI email writer', 'professional email', 'email drafter', 'email tone'],
    path: '/tools/ai-email-assistant'
  },
  {
    id: 'link-manager',
    slug: 'link-manager',
    name: 'Link Manager & Smart Bio',
    description: 'Create custom branded short links with click analytics, QR codes, and auto-updating bio pages that sync with your YouTube and Instagram content.',
    shortDescription: 'Branded links with analytics & smart bios',
    icon: 'Link',
    category: 'productivity',
    features: [
      'Custom branded links',
      'Click analytics dashboard',
      'Auto-update latest YouTube/Instagram',
      'Link scheduling',
      'QR code generator',
      'Bio page builder'
    ],
    benefits: [
      'Track link performance',
      'Build professional bio pages',
      'Schedule campaign links',
      'Grow your audience'
    ],
    faqs: [
      { question: "What is this tool?", answer: "Create short branded links, track clicks, and build smart bio pages." },
      { question: "Can I track analytics?", answer: "Yes! Get detailed analytics including clicks, locations, and devices." }
    ],
    keywords: ['link shortener', 'bio link', 'QR code generator', 'link analytics', 'branded links'],
    path: '/tools/link-manager'
  }
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getToolsByCategory(category: Tool['category']): Tool[] {
  return tools.filter(tool => tool.category === category);
}

export function getAllToolSlugs(): string[] {
  return tools.map(tool => tool.slug);
}
