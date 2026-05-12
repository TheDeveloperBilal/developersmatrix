'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  RefreshCw, 
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Copy,
  Bookmark,
  Check,
  Zap,
  Rocket,
  Shield,
  Brain,
  Globe,
  Leaf,
  Cpu,
  Heart,
  ShoppingCart,
  GraduationCap,
  Wrench,
  UserCircle,
  Video,
  Bot,
  Dna,
  Satellite
} from 'lucide-react';

interface StartupIdea {
  title: string;
  description: string;
  problem: string;
  solution: string;
  market: string;
  monetization: string;
  competition: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToMvp: string;
  year: 2025 | 2026;
  viabilityScore: number;
}

interface Industry {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const industries: Industry[] = [
  { id: 'ai-agents', name: 'AI Agents', icon: <Bot className="w-4 h-4" /> },
  { id: 'ai-ml', name: 'AI/ML', icon: <Brain className="w-4 h-4" /> },
  { id: 'saas', name: 'SaaS', icon: <CloudIcon /> },
  { id: 'fintech', name: 'FinTech', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'healthtech', name: 'HealthTech', icon: <Heart className="w-4 h-4" /> },
  { id: 'robotics', name: 'Robotics', icon: <Cpu className="w-4 h-4" /> },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: <Shield className="w-4 h-4" /> },
  { id: 'biotech', name: 'Biotech', icon: <Dna className="w-4 h-4" /> },
  { id: 'climatetech', name: 'Climate Tech', icon: <Leaf className="w-4 h-4" /> },
  { id: 'space', name: 'Space Tech', icon: <Satellite className="w-4 h-4" /> },
  { id: 'edtech', name: 'EdTech', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'ecommerce', name: 'E-commerce', icon: <ShoppingCart className="w-4 h-4" /> },
  { id: 'creator', name: 'Creator Economy', icon: <Video className="w-4 h-4" /> },
  { id: 'devtools', name: 'DevTools', icon: <Wrench className="w-4 h-4" /> },
  { id: 'hrtech', name: 'HR Tech', icon: <UserCircle className="w-4 h-4" /> },
];

function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19c0-1.7-1.3-3-3-3h-11a4 4 0 0 1 0-8 2.5 2.5 0 0 1 2.5-2.5 4 4 0 0 1 7.6 1.5 3 3 0 0 1 1.4 5.5" />
    </svg>
  );
}

const startupIdeas: Record<string, StartupIdea[]> = {
  'ai-agents': [
    {
      title: "Autonomous Email Agent for Sales Teams",
      description: "An AI agent that reads your CRM, researches prospects, drafts personalized outreach emails, follows up automatically based on engagement, and books meetings on your calendar without human intervention.",
      problem: "Sales reps spend 60% of their time on non-selling activities like research, drafting, and follow-ups. Lead response time directly correlates with conversion rates.",
      solution: "An agentic AI system that operates end-to-end: prospect research from LinkedIn and company websites, hyper-personalized email generation, smart follow-up sequencing with engagement-based triggers, and calendar booking. Integrates with Salesforce, HubSpot, and Gmail.",
      market: "Sales engagement software market at $8.2B in 2026, growing 14% annually. AI agent segment is the fastest growing subcategory.",
      monetization: "$49 per user monthly for Pro, $199 for teams with CRM integration, enterprise custom pricing with API access.",
      competition: "Medium - Lavender and Lavender AI do parts of this, but no one has full agentic workflow yet. Huge whitespace for end-to-end automation.",
      tags: ['AI Agents', 'Sales', 'B2B', '2026'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 92
    },
    {
      title: "AI Accounting Agent for Small Business",
      description: "An autonomous agent that connects to bank accounts, categorizes transactions, reconciles books, chases unpaid invoices, and files tax reports with zero manual input from the business owner.",
      problem: "Small business owners spend 15+ hours monthly on bookkeeping and still make costly errors. 40% of SMBs do not have dedicated accounting staff.",
      solution: "Agentic AI that operates like a virtual accountant: reads bank feeds, categorizes with learning, flags anomalies, sends payment reminders, generates P&L and balance sheets, and prepares tax filings. Integrates with QuickBooks, Stripe, and major banks.",
      market: "SMB accounting software market at $22B globally. AI automation is the top requested feature for 2026 product roadmaps.",
      monetization: "$29 monthly base, $79 for multi-entity, white-label for accountants at $199 monthly.",
      competition: "Medium - Bench and Botkeeper offer human + AI hybrid. Pure AI agent approach is novel and cheaper to deliver at scale.",
      tags: ['AI Agents', 'FinTech', 'SMB', '2026'],
      difficulty: 'Medium',
      timeToMvp: '4 months',
      year: 2026,
      viabilityScore: 88
    },
    {
      title: "Social Media Agent for Content Creators",
      description: "An AI agent that monitors trending topics in your niche, drafts posts, schedules optimal publish times, replies to comments, and analyzes performance to iterate content strategy automatically.",
      problem: "Creators and brands spend 15+ hours weekly on social media management, often missing optimal posting windows and engagement opportunities.",
      solution: "Fully autonomous social agent: trend detection via real-time monitoring, content drafting with brand voice training, auto-scheduling based on audience activity, comment moderation and replies, and weekly strategy reports. Supports X, LinkedIn, Instagram, and TikTok.",
      market: "Social media management tools at $19B in 2026. AI automation segment growing 35% YoY as creator economy matures.",
      monetization: "$39 monthly for creators, $149 for brands managing 5+ accounts, agency tier at $499.",
      competition: "Medium-High - Buffer and Hootsuite adding AI, but none offer full agentic automation. First-mover advantage available.",
      tags: ['AI Agents', 'Creator', 'Social Media', '2026'],
      difficulty: 'Medium',
      timeToMvp: '3 months',
      year: 2026,
      viabilityScore: 85
    }
  ],
  'ai-ml': [
    {
      title: "Vertical AI for Construction Safety",
      description: "Computer vision AI that monitors construction sites via existing cameras, detects safety violations in real-time, and alerts supervisors before accidents occur.",
      problem: "Construction remains one of the most dangerous industries with over 1,000 fatalities annually in the US alone. Safety inspections are sporadic and reactive.",
      solution: "Deploys on existing site cameras without new hardware. Detects missing hard hats, unsafe scaffolding, proximity to heavy machinery, and restricted zone violations. Real-time alerts to safety managers with photo evidence.",
      market: "Construction technology market at $15B, safety solutions segment growing 20% annually due to insurance pressure and regulation.",
      monetization: "$299 per camera monthly, site-wide licenses at $2,999, insurance partnership revenue sharing.",
      competition: "Low-Medium - Procore and Autodesk focus on project management. Pure safety AI is underserved despite clear ROI.",
      tags: ['AI', 'Construction', 'Safety', 'Computer Vision'],
      difficulty: 'Hard',
      timeToMvp: '5-6 months',
      year: 2026,
      viabilityScore: 90
    },
    {
      title: "AI Legal Document Review for Startups",
      description: "Narrow AI trained specifically on startup legal documents: SAFEs, term sheets, employment agreements, and vendor contracts. Flags risks and suggests redlines in minutes.",
      problem: "Startup founders spend $10K-$50K on legal review for standard documents. Most cannot afford experienced startup counsel for every contract.",
      solution: "Vertical AI fine-tuned on thousands of startup legal documents. Upload a contract, get risk flags, unfavorable clause identification, and suggested redlines. Covers SAFE, SAFE+, term sheets, NDAs, employment, and service agreements.",
      market: "Legal tech market at $35B, startup-specific tools are a fast-growing niche as venture formation accelerates.",
      monetization: "$49 per document, $199 monthly unlimited for startups, law firm white-label at $499.",
      competition: "Medium - Ironclad and ContractPodAi target enterprise. Startup-focused vertical AI has no dominant player yet.",
      tags: ['AI', 'Legal', 'Startups', 'Vertical AI'],
      difficulty: 'Hard',
      timeToMvp: '5 months',
      year: 2026,
      viabilityScore: 87
    },
    {
      title: "AI-Powered Quality Control for Manufacturing",
      description: "Real-time defect detection using computer vision for manufacturing lines. Identifies product flaws at conveyor speed with 99.5%+ accuracy.",
      problem: "Manual quality inspection misses 15-20% of defects. Defective products reaching customers cost manufacturers billions in recalls and reputation damage.",
      solution: "Edge AI vision system that installs above existing production lines. Detects scratches, dimensional errors, color mismatches, and assembly issues instantly. Integrates with MES and ERP systems for automatic quarantine and reporting.",
      market: "Manufacturing AI market at $4.5B, quality inspection segment growing 28% annually as reshoring accelerates.",
      monetization: "$5,000 setup + $1,200 per line monthly, enterprise licensing for multi-factory deployments.",
      competition: "Medium - Cognex and Keyence dominate hardware. Software-only AI solution with faster deployment is a differentiator.",
      tags: ['AI', 'Manufacturing', 'Computer Vision', 'Industrial'],
      difficulty: 'Hard',
      timeToMvp: '6 months',
      year: 2026,
      viabilityScore: 89
    }
  ],
  'saas': [
    {
      title: "AI-Powered Customer Support Platform",
      description: "Automated customer support system that uses AI to handle 80% of common queries, escalating complex issues to human agents with full context.",
      problem: "Companies spend 30-40% of support budget on answering repetitive questions that could be automated.",
      solution: "AI chatbot that learns from past tickets, integrates with existing tools, and provides seamless handoff to humans when needed.",
      market: "Customer support software market valued at $15B, growing 11% annually.",
      monetization: "Per-conversation pricing starting at $49/month, enterprise plans at $500+/month.",
      competition: "Medium - Intercom and Zendesk adding AI, but specialized solutions still have room.",
      tags: ['AI', 'SaaS', 'B2B'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 84
    },
    {
      title: "Team Knowledge Base with AI Search",
      description: "Smart documentation platform that uses semantic search to find answers across all company tools and docs instantly.",
      problem: "Employees waste 20% of their time searching for information across scattered tools and documents.",
      solution: "AI-powered search that indexes Slack, Google Drive, Notion, and more to provide instant answers.",
      market: "Knowledge management market worth $500B+ globally.",
      monetization: "Free tier for small teams, $8/user/month for businesses, enterprise custom pricing.",
      competition: "Medium - Glean and Guru exist, but many companies still unsatisfied.",
      tags: ['AI', 'Productivity', 'B2B'],
      difficulty: 'Medium',
      timeToMvp: '2-3 months',
      year: 2026,
      viabilityScore: 82
    },
    {
      title: "Automated Invoice & Payment Reminder System",
      description: "B2B invoicing tool that automatically sends payment reminders, offers multiple payment options, and predicts late payments.",
      problem: "Small businesses spend 15+ hours/month chasing payments and managing cash flow.",
      solution: "Smart invoicing with automated reminders, payment prediction AI, and integrated payment processing.",
      market: "Small business accounting software market at $12B annually.",
      monetization: "Free tier, $19/month Pro, 1% transaction fee on payments processed.",
      competition: "Low-Medium - Many invoicing tools, few with smart prediction features.",
      tags: ['FinTech', 'SaaS', 'SMB'],
      difficulty: 'Easy',
      timeToMvp: '2 months',
      year: 2026,
      viabilityScore: 80
    }
  ],
  'fintech': [
    {
      title: "Freelancer Tax & Finance OS",
      description: "All-in-one financial platform for freelancers: automatic tax calculation, expense tracking, invoicing, and retirement planning.",
      problem: "60M+ US freelancers struggle with inconsistent income, tax planning, and lack of benefits.",
      solution: "AI-powered finance platform that automates tax savings, predicts cash flow, and provides benefits access.",
      market: "Freelance economy at $1.2T in the US alone, growing 8% annually.",
      monetization: "Free tier, $12/month Premium, financial services revenue share.",
      competition: "Low-Medium - Most tools target traditional employees, freelancer-specific solutions lacking.",
      tags: ['FinTech', 'Freelance', 'AI'],
      difficulty: 'Medium',
      timeToMvp: '4 months',
      year: 2026,
      viabilityScore: 86
    },
    {
      title: "Micro-Investment for Gen Z",
      description: "Investment app that rounds up purchases and invests spare change into diversified portfolios, NFTs, or crypto.",
      problem: "Young people struggle to start investing with limited funds and financial knowledge.",
      solution: "Frictionless micro-investing with educational content and community features.",
      market: "Retail investing market exploded post-2020, Gen Z investor segment growing 40% YoY.",
      monetization: "Monthly subscription $1-3, premium features, and asset management fees.",
      competition: "High - Acorns, Robinhood, and Public dominant, differentiation needed.",
      tags: ['FinTech', 'Gen Z', 'Investing'],
      difficulty: 'Hard',
      timeToMvp: '6+ months',
      year: 2026,
      viabilityScore: 72
    },
    {
      title: "B2B Payments & Cash Flow Platform",
      description: "Simplified B2B payments with instant transfers, credit options, and cash flow prediction for small businesses.",
      problem: "Small businesses wait 30-90 days for payments, causing cash flow crises.",
      solution: "Instant B2B payments with built-in financing options and AI cash flow forecasting.",
      market: "B2B payments market at $125T globally, digital adoption still under 10%.",
      monetization: "Transaction fees 0.5-1%, financing interest, premium features.",
      competition: "Medium - Stripe and Melio growing, but many markets underserved.",
      tags: ['FinTech', 'B2B', 'Payments'],
      difficulty: 'Hard',
      timeToMvp: '6+ months',
      year: 2026,
      viabilityScore: 81
    }
  ],
  'healthtech': [
    {
      title: "AI Mental Health Companion",
      description: "AI-powered mental health app providing 24/7 emotional support, CBT exercises, and connection to therapists when needed.",
      problem: "60% of people with mental health issues can't access therapy due to cost or availability.",
      solution: "AI chatbot trained on therapeutic techniques, with human therapist escalation.",
      market: "Mental health apps market at $4.2B, growing 16% annually.",
      monetization: "Free tier, $15/month Premium, enterprise wellness partnerships.",
      competition: "Medium - BetterHelp and Talkspace for therapy, Woebot for AI, opportunity in hybrid.",
      tags: ['HealthTech', 'AI', 'Mental Health'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 85
    },
    {
      title: "Personalized Nutrition & Supplement Platform",
      description: "AI platform that analyzes health data to recommend personalized nutrition plans and supplement stacks.",
      problem: "People waste billions on ineffective supplements and generic diet advice.",
      solution: "AI analyzes blood work, DNA, lifestyle to create personalized supplement and nutrition recommendations.",
      market: "Personalized nutrition market at $16B, growing 15% annually.",
      monetization: "Subscription $29/month, supplement subscriptions, lab testing partnerships.",
      competition: "Medium - Care/of and Rootine exist, but market still fragmented.",
      tags: ['HealthTech', 'AI', 'Personalization'],
      difficulty: 'Hard',
      timeToMvp: '6 months',
      year: 2026,
      viabilityScore: 78
    },
    {
      title: "Remote Patient Monitoring Dashboard",
      description: "Platform for healthcare providers to monitor chronic patients remotely using wearables and connected devices.",
      problem: "Chronic disease management costs $3.7T annually in the US with poor patient outcomes.",
      solution: "Real-time monitoring dashboard with AI alerts for concerning trends and easy patient communication.",
      market: "Remote patient monitoring market at $117B by 2025.",
      monetization: "Per-patient monthly fee, device partnerships, insurance reimbursement.",
      competition: "Medium - Growing market with regulatory barriers creating moats.",
      tags: ['HealthTech', 'IoT', 'AI'],
      difficulty: 'Hard',
      timeToMvp: '8+ months',
      year: 2026,
      viabilityScore: 83
    }
  ],
  'robotics': [
    {
      title: "Autonomous Warehouse Sorting Robot",
      description: "Compact robotic arm system for warehouses that sorts packages by destination using computer vision and AI path planning, requiring no infrastructure changes.",
      problem: "E-commerce growth has overwhelmed warehouse labor capacity. Sorting is repetitive, injury-prone work with 100%+ annual turnover in some facilities.",
      solution: "Plug-and-play robotic sorting cells that identify packages via barcode and vision, pick them up, and place them in correct destination bins. No conveyor modifications needed. Deploys in under a day.",
      market: "Warehouse automation market at $25B in 2026, growing 18% annually as labor shortages persist.",
      monetization: "Robot-as-a-Service at $3,500 monthly per cell, including maintenance and software updates.",
      competition: "Medium - Berkshire Grey and Locus Robotics target large facilities. SMB warehouse segment is underserved.",
      tags: ['Robotics', 'Warehouse', 'Automation', '2026'],
      difficulty: 'Hard',
      timeToMvp: '8+ months',
      year: 2026,
      viabilityScore: 88
    },
    {
      title: "Food Service Robot for Quick Service Restaurants",
      description: "Robotic kitchen assistant that handles frying, grilling, and plating for fast food and fast-casual restaurants.",
      problem: "QSRs face 150% annual turnover, rising wages, and inconsistent food quality. Labor represents 30% of operating costs.",
      solution: "Compact robotic station that integrates into existing kitchen lines. Handles repetitive tasks: french fries, burger patties, chicken tenders. Consistent quality, 24/7 operation, and easy sanitization.",
      market: "Food service robotics market at $1.2B, expected to reach $8B by 2030 as labor costs rise.",
      monetization: "$5,000 monthly lease per station, revenue share model for franchise chains.",
      competition: "Medium - Miso Robotics and Flippy exist, but high cost limits adoption. Lower-cost compact design opens SMB market.",
      tags: ['Robotics', 'Food Service', 'Automation', '2026'],
      difficulty: 'Hard',
      timeToMvp: '8+ months',
      year: 2026,
      viabilityScore: 84
    },
    {
      title: "Home Maintenance Drone Service",
      description: "Drone-based home inspection and maintenance service for gutters, roof checks, and exterior cleaning.",
      problem: "Homeowners delay maintenance due to cost and difficulty accessing roofs and gutters. Water damage from clogged gutters costs insurers billions.",
      solution: "Autonomous drone fleet that performs scheduled inspections, gutter cleaning via suction, and roof condition assessments. Subscribers get quarterly flyovers with photo reports and maintenance alerts.",
      market: "Home services market at $650B in the US. Drone services are emerging but not yet mainstream for residential.",
      monetization: "$99 per inspection, $299 annual subscription with quarterly checks, insurance partnership discounts.",
      competition: "Low - Few residential drone maintenance services. Regulatory clarity in 2026 makes this viable.",
      tags: ['Robotics', 'Drones', 'Home Services', '2026'],
      difficulty: 'Medium',
      timeToMvp: '5-6 months',
      year: 2026,
      viabilityScore: 79
    }
  ],
  'cybersecurity': [
    {
      title: "AI-Powered Phishing Simulation & Training",
      description: "Continuous phishing simulation platform that uses AI to generate increasingly convincing attacks, then trains employees in real-time when they fall for them.",
      problem: "90% of data breaches start with phishing. Annual training is ineffective because employees forget. Simulated attacks are too predictable.",
      solution: "AI generates personalized phishing emails based on each employee's role, communication style, and current projects. When someone clicks, immediate micro-training appears. Adaptive difficulty increases over time.",
      market: "Security awareness training market at $2.5B, growing 20% annually as breach costs average $4.5M per incident.",
      monetization: "$5/employee/month, enterprise at $3/employee with 500+ seats, insurance discount partnerships.",
      competition: "Medium - KnowBe4 dominates but uses templates. AI-generated dynamic attacks are a clear differentiator.",
      tags: ['Cybersecurity', 'AI', 'Training', '2026'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 91
    },
    {
      title: "Cloud Infrastructure Drift Detection",
      description: "AI system that continuously monitors cloud infrastructure for unauthorized changes, misconfigurations, and compliance violations.",
      problem: "Cloud environments change constantly. 73% of companies have at least one critical cloud misconfiguration. Manual audits are too slow.",
      solution: "Real-time drift detection using AI baselining. Identifies unauthorized IAM changes, open security groups, unencrypted storage, and compliance deviations. Integrates with AWS, Azure, GCP, and Terraform.",
      market: "Cloud security market at $18B, growing 25% annually as multi-cloud adoption accelerates.",
      monetization: "$499/month per cloud account, enterprise unlimited at $4,999. SOC 2 compliance package add-on.",
      competition: "Medium - Bridgecrew and Prisma Cloud exist, but AI-native drift detection with lower false positives is a gap.",
      tags: ['Cybersecurity', 'Cloud', 'AI', 'DevOps'],
      difficulty: 'Hard',
      timeToMvp: '5-6 months',
      year: 2026,
      viabilityScore: 87
    },
    {
      title: "Small Business Security Posture Scanner",
      description: "One-click security scanner for SMBs that assesses their entire digital footprint and generates a prioritized fix list with cost estimates.",
      problem: "Small businesses are victims of 43% of cyberattacks but lack resources for security teams. They do not know what to fix first.",
      solution: "External scanner plus lightweight agent that checks DNS, email security, website vulnerabilities, endpoint protection, password policies, and backup status. Produces a prioritized scorecard with specific fix instructions and cost estimates.",
      market: "SMB cybersecurity market at $12B, underserved because enterprise tools are too complex and expensive.",
      monetization: "Free basic scan, $99 detailed report, $299 ongoing monitoring, MSP white-label at $49 per client.",
      competition: "Low-Medium - SecurityScorecard targets enterprise. SMB-focused simple scanner with actionable fixes is a whitespace.",
      tags: ['Cybersecurity', 'SMB', 'Scanner', '2026'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 86
    }
  ],
  'biotech': [
    {
      title: "At-Home Biomarker Testing Platform",
      description: "Subscription-based at-home testing for key biomarkers: cholesterol, inflammation, vitamin D, hormones. Results in 48 hours with AI-powered health insights.",
      problem: "Preventive health monitoring is reactive. People wait for symptoms before testing. Traditional lab visits are inconvenient and expensive.",
      solution: "Finger-prick test kits mailed monthly. Lab partner network processes samples. AI analyzes trends across results, suggesting diet, exercise, and supplement adjustments. Integrates with Apple Health and wearable data.",
      market: "Direct-to-consumer health testing market at $8B, growing 22% annually as consumers demand more health ownership.",
      monetization: "$49 per test, $99 monthly subscription for quarterly panels, premium $199 with genetic analysis add-on.",
      competition: "Medium - Everlywell and LetsGetChecked exist, but AI trend analysis and wearable integration create stickiness.",
      tags: ['Biotech', 'Health', 'D2C', '2026'],
      difficulty: 'Hard',
      timeToMvp: '6-8 months',
      year: 2026,
      viabilityScore: 82
    },
    {
      title: "AI Drug Repurposing Discovery Engine",
      description: "AI platform that identifies new therapeutic uses for existing FDA-approved drugs, dramatically reducing development time and cost.",
      problem: "Developing a new drug costs $2.6B and takes 10-15 years. Many existing drugs have untapped therapeutic potential that AI can predict.",
      solution: "Machine learning models trained on molecular structures, clinical trial data, and biological pathways. Identifies drug-disease matches with high probability of efficacy. Partners with pharma for clinical validation.",
      market: "Drug repurposing market accelerating with AI. Potential to save billions in R&D costs.",
      monetization: "Licensing fees per validated candidate, milestone payments, and revenue share on successful repurposed drugs.",
      competition: "Medium-High - Insilico Medicine and Atomwise operate in AI drug discovery. Repurposing focus is a narrower niche with clearer path to revenue.",
      tags: ['Biotech', 'AI', 'Drug Discovery', '2026'],
      difficulty: 'Hard',
      timeToMvp: '8+ months',
      year: 2026,
      viabilityScore: 75
    },
    {
      title: "Personalized Probiotic Formulation Service",
      description: "Microbiome testing service that analyzes gut bacteria and creates custom probiotic blends shipped monthly.",
      problem: "Generic probiotics have limited efficacy because everyone's microbiome is different. 70% of immune system is gut-linked.",
      solution: "At-home microbiome test (stool sample). AI analysis of bacterial composition. Custom probiotic formulation targeting specific deficiencies. Monthly refills adjusted based on retest results.",
      market: "Probiotics market at $77B globally, personalized segment growing 30% annually as microbiome science advances.",
      monetization: "$199 initial test + formulation, $79 monthly refills, annual retest included in year plan.",
      competition: "Low-Medium - Viome and DayTwo do testing, but custom probiotic manufacturing at scale is a manufacturing moat.",
      tags: ['Biotech', 'Microbiome', 'Personalization', '2026'],
      difficulty: 'Hard',
      timeToMvp: '6-8 months',
      year: 2026,
      viabilityScore: 80
    }
  ],
  'climatetech': [
    {
      title: "Carbon Footprint Tracker for Businesses",
      description: "Platform that automatically calculates and helps reduce corporate carbon emissions across supply chain.",
      problem: "Companies need to track and report emissions but manual calculation is expensive and inaccurate.",
      solution: "Automated emissions tracking from financial data, with reduction recommendations.",
      market: "Carbon management software at $15B, growing 30% annually.",
      monetization: "SaaS $500-5000/month based on company size, consulting services.",
      competition: "Medium - Watershed and Persefoni growing, market still early.",
      tags: ['ClimateTech', 'SaaS', 'B2B'],
      difficulty: 'Medium',
      timeToMvp: '4 months',
      year: 2026,
      viabilityScore: 85
    },
    {
      title: "Circular Economy Marketplace",
      description: "B2B platform for buying/selling surplus materials, byproducts, and waste between industries.",
      problem: "Manufacturers waste billions in materials that could be used by other industries.",
      solution: "AI-powered matching of waste streams with potential buyers, logistics coordination.",
      market: "Circular economy market at $4.5T opportunity globally.",
      monetization: "Transaction fees 5-10%, premium listings, logistics partnerships.",
      competition: "Low - Few digital platforms connecting industrial waste streams.",
      tags: ['ClimateTech', 'Marketplace', 'B2B'],
      difficulty: 'Medium',
      timeToMvp: '4-5 months',
      year: 2026,
      viabilityScore: 78
    },
    {
      title: "Personal Carbon Offset Platform",
      description: "App that calculates personal carbon footprint and enables easy offsetting through verified projects.",
      problem: "Individuals want to offset their impact but it's complicated and trust is low.",
      solution: "Automatic tracking, transparent offsets with verification, and community features.",
      market: "Voluntary carbon market at $2B, expected to grow 15x by 2030.",
      monetization: "Small markup on offsets, premium features $5/month, corporate partnerships.",
      competition: "Medium - Wren and Tomorrow's Air exist, mainstream adoption still early.",
      tags: ['ClimateTech', 'Consumer', 'Offsets'],
      difficulty: 'Easy',
      timeToMvp: '2-3 months',
      year: 2026,
      viabilityScore: 73
    }
  ],
  'space': [
    {
      title: "Satellite Data Analytics for Agriculture",
      description: "Platform that processes satellite imagery to provide farmers with crop health monitoring, yield prediction, and irrigation optimization.",
      problem: "Farmers lack real-time data on crop conditions across large fields. Traditional scouting is labor-intensive and misses early stress signals.",
      solution: "Satellite imagery analysis using multispectral data to detect water stress, pest infestations, and nutrient deficiencies 2-3 weeks before visible symptoms. Provides zone-specific irrigation and fertilization recommendations.",
      market: "Precision agriculture market at $12B, satellite data segment growing 25% annually as launch costs drop.",
      monetization: "$2 per acre monthly, cooperative pricing for large farms, crop insurance partnership data sales.",
      competition: "Medium - Farmers Edge and Granular exist, but lower-cost satellite-only approach opens developing markets.",
      tags: ['Space Tech', 'Agriculture', 'Satellite', '2026'],
      difficulty: 'Medium',
      timeToMvp: '4-5 months',
      year: 2026,
      viabilityScore: 83
    },
    {
      title: "Orbital Debris Tracking Service",
      description: "Commercial space situational awareness platform that tracks orbital debris and provides collision avoidance alerts for satellite operators.",
      problem: "Low Earth orbit has 30,000+ trackable debris objects and millions of smaller fragments. Collision risk is rising as mega-constellations launch.",
      solution: "Combines radar, optical, and satellite data sources. Provides real-time conjunction alerts, maneuver recommendations, and long-term risk assessment. API for satellite operators and insurers.",
      market: "Space situational awareness market at $1.4B, growing 35% annually as satellite launches accelerate.",
      monetization: "$10K monthly per satellite fleet, insurance risk assessment reports at $50K, government contracts.",
      competition: "Medium - LeoLabs and Numerica exist, but commercial pricing and ease of API access remain pain points.",
      tags: ['Space Tech', 'Satellite', 'Safety', '2026'],
      difficulty: 'Hard',
      timeToMvp: '6-8 months',
      year: 2026,
      viabilityScore: 77
    },
    {
      title: "Space Tourism Booking Platform",
      description: "Marketplace for suborbital and orbital space tourism experiences, connecting consumers with providers like Space Perspective, Virgin Galactic, and emerging competitors.",
      problem: "Space tourism is fragmented across multiple providers with different pricing, safety records, and experience types. Consumers cannot easily compare options.",
      solution: "Kayak-style comparison platform for space tourism. Aggregates providers, prices, safety data, training requirements, and reviews. Handles booking, insurance, and payment plans.",
      market: "Space tourism projected at $8B by 2030. First mover in aggregation has strong positioning as market expands.",
      monetization: "10-15% commission per booking, premium concierge service at $5K, corporate event packages.",
      competition: "Low - No dominant aggregator exists yet. Booking directly with providers is the only current option.",
      tags: ['Space Tech', 'Tourism', 'Marketplace', '2026'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 76
    }
  ],
  'edtech': [
    {
      title: "AI Tutor & Study Companion",
      description: "Personalized AI tutor that adapts to learning style, creates study plans, and provides instant help with any subject.",
      problem: "1-on-1 tutoring costs $50-150/hour, unaffordable for most students.",
      solution: "AI tutor available 24/7 that explains concepts, quizzes students, and adapts to their pace.",
      market: "Online tutoring market at $17B, growing 14% annually.",
      monetization: "Free tier, $9.99/month Premium, school/district licenses.",
      competition: "Medium - Khan Academy and Chegg dominant, AI-native solutions emerging.",
      tags: ['EdTech', 'AI', 'Learning'],
      difficulty: 'Medium',
      timeToMvp: '3 months',
      year: 2026,
      viabilityScore: 81
    },
    {
      title: "Micro-Learning Platform for Professionals",
      description: "Bite-sized learning modules (5-15 min) tailored for busy professionals, with AI curation based on career goals.",
      problem: "Professionals lack time for traditional courses, leading to skill gaps.",
      solution: "AI-curated micro-lessons delivered at optimal times, with practical exercises.",
      market: "Corporate training market at $370B globally.",
      monetization: "B2B licensing $5-15/employee/month, individual $9.99/month.",
      competition: "Medium - LinkedIn Learning and Coursera exist, micro-format differentiator.",
      tags: ['EdTech', 'AI', 'Professional Development'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 79
    },
    {
      title: "Learn-by-Building Platform",
      description: "Interactive platform where users learn by building real projects with AI guidance and peer collaboration.",
      problem: "Traditional courses have 10-15% completion rate; learners need hands-on practice.",
      solution: "Project-based learning with AI assistance, code review, and community feedback.",
      market: "Online coding education at $2B, expanding to other skills.",
      monetization: "Free tier, $19/month Pro, career services fees.",
      competition: "Medium - Codecademy and freeCodeCamp exist, AI-guided building is new.",
      tags: ['EdTech', 'AI', 'Skills'],
      difficulty: 'Medium',
      timeToMvp: '4-5 months',
      year: 2026,
      viabilityScore: 80
    }
  ],
  'ecommerce': [
    {
      title: "AI-Powered E-commerce Personalization",
      description: "Plugin that personalizes product recommendations, search results, and content for each shopper in real-time.",
      problem: "Generic shopping experiences lead to 97% cart abandonment rates.",
      solution: "AI that analyzes behavior to show personalized products, prices, and content.",
      market: "E-commerce personalization market at $1.2B, growing 25% annually.",
      monetization: "SaaS $99-499/month based on traffic, plus performance fees.",
      competition: "Medium - Dynamic Yield and Bloomreach dominant, SMB market underserved.",
      tags: ['E-commerce', 'AI', 'Personalization'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 83
    },
    {
      title: "Social Commerce Enabler",
      description: "Platform that helps small businesses sell directly on social media with one-click checkout and analytics.",
      problem: "Small businesses struggle to convert social media followers into customers.",
      solution: "Tools for social selling: shoppable posts, DM automation, and conversion analytics.",
      market: "Social commerce at $1.2T globally by 2025.",
      monetization: "Transaction fees 2-3%, subscription tiers $29-199/month.",
      competition: "Medium - Shopify and Instagram Shopping exist, niche tools emerging.",
      tags: ['E-commerce', 'Social', 'SMB'],
      difficulty: 'Medium',
      timeToMvp: '3 months',
      year: 2026,
      viabilityScore: 78
    },
    {
      title: "Sustainable Shopping Assistant",
      description: "Browser extension that shows sustainability scores and alternatives while shopping online.",
      problem: "Consumers want sustainable options but lack information to make informed choices.",
      solution: "Real-time sustainability ratings, ethical alternatives, and carbon footprint info.",
      market: "Sustainable e-commerce growing 3x faster than traditional retail.",
      monetization: "Affiliate commissions on alternatives, premium features $5/month.",
      competition: "Low-Medium - Few consumer-facing sustainability tools at scale.",
      tags: ['E-commerce', 'Sustainability', 'Consumer'],
      difficulty: 'Easy',
      timeToMvp: '2 months',
      year: 2026,
      viabilityScore: 74
    }
  ],
  'creator': [
    {
      title: "All-in-One Creator Business OS",
      description: "Platform managing finances, sponsorships, contracts, and analytics for content creators.",
      problem: "Creators spend 40% of time on business tasks instead of creating content.",
      solution: "Unified dashboard for revenue tracking, sponsor management, contracts, and performance analytics.",
      market: "Creator economy at $104B, 50M+ creators globally.",
      monetization: "Free tier, Pro $29/month, Agency $199/month.",
      competition: "Medium - Fragmented tools, opportunity for consolidation.",
      tags: ['Creator Economy', 'SaaS', 'Business Tools'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 82
    },
    {
      title: "AI Thumbnail & Title Generator",
      description: "AI tool that generates optimized YouTube thumbnails and titles to maximize click-through rates.",
      problem: "Creators spend hours on thumbnails and often pick suboptimal titles.",
      solution: "AI analyzes video content and competitor performance to generate optimized assets.",
      market: "YouTube creators alone represent 51M channels, growing 40% YoY.",
      monetization: "Free tier with watermarks, $19/month Pro, API for enterprise.",
      competition: "Medium - TubeBuddy and VidIQ have some features, dedicated tools emerging.",
      tags: ['Creator Economy', 'AI', 'YouTube'],
      difficulty: 'Medium',
      timeToMvp: '2-3 months',
      year: 2026,
      viabilityScore: 80
    },
    {
      title: "Creator Community & Monetization Platform",
      description: "Platform for creators to build paid communities with courses, exclusive content, and direct support.",
      problem: "Platforms take 30-50% of creator revenue and limit audience ownership.",
      solution: "White-label community platform with low fees (5-10%), owned audience, and flexible monetization.",
      market: "Creator economy platforms at $5B+, growing 25% annually.",
      monetization: "5-10% platform fee, premium features, white-label licensing.",
      competition: "Medium - Patreon, Gumroad, and Substack exist, niche opportunities remain.",
      tags: ['Creator Economy', 'Monetization', 'Community'],
      difficulty: 'Medium',
      timeToMvp: '4-5 months',
      year: 2026,
      viabilityScore: 77
    }
  ],
  'devtools': [
    {
      title: "AI-Powered Documentation Generator",
      description: "Tool that automatically generates and maintains API documentation from code with examples.",
      problem: "Developers hate writing docs, leading to outdated or missing documentation.",
      solution: "AI analyzes code to generate comprehensive docs with examples, keeping them in sync.",
      market: "Developer tools market at $29B, documentation segment underserved.",
      monetization: "Free for open source, $15/developer/month for teams.",
      competition: "Medium - ReadMe and Swagger exist, AI-native solutions emerging.",
      tags: ['DevTools', 'AI', 'Documentation'],
      difficulty: 'Medium',
      timeToMvp: '3 months',
      year: 2026,
      viabilityScore: 84
    },
    {
      title: "Feature Flag & Experimentation Platform",
      description: "Open-core feature flagging platform with A/B testing and gradual rollout capabilities.",
      problem: "Deploying new features is risky; teams need safe rollout and rollback mechanisms.",
      solution: "Easy-to-use feature flags with analytics, A/B testing, and instant rollback.",
      market: "Feature management market at $2B, growing 25% annually.",
      monetization: "Open core with cloud tier starting at $49/month, enterprise licenses.",
      competition: "Medium - LaunchDarkly dominant, open-source alternatives gaining traction.",
      tags: ['DevTools', 'Open Source', 'DevOps'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 81
    },
    {
      title: "Developer Environment in the Cloud",
      description: "Instant, cloud-based development environments that work from any device with zero setup.",
      problem: "Developers waste 1-2 hours weekly on environment setup and configuration.",
      solution: "Pre-configured cloud environments that sync with repos and work from browser.",
      market: "Cloud IDE market at $1.5B, growing 30% annually.",
      monetization: "Free tier, $20/developer/month Pro, enterprise with self-hosting.",
      competition: "Medium - GitHub Codespaces and Gitpod growing, niche opportunities.",
      tags: ['DevTools', 'Cloud', 'Productivity'],
      difficulty: 'Hard',
      timeToMvp: '6+ months',
      year: 2026,
      viabilityScore: 79
    }
  ],
  'hrtech': [
    {
      title: "AI Recruiting Assistant",
      description: "AI that screens candidates, schedules interviews, and provides bias-reduced shortlists for hiring teams.",
      problem: "Recruiters spend 30% of time on screening and scheduling, bias affects hiring.",
      solution: "AI-powered screening, automated scheduling, and structured interview coordination.",
      market: "Recruitment software at $28B, growing 7% annually.",
      monetization: "Per-hire fee $50-200, or SaaS $100-500/month based on volume.",
      competition: "Medium - Greenhouse and Lever adding AI, specialized tools emerging.",
      tags: ['HR Tech', 'AI', 'Recruiting'],
      difficulty: 'Medium',
      timeToMvp: '3-4 months',
      year: 2026,
      viabilityScore: 83
    },
    {
      title: "Employee Feedback & Engagement Platform",
      description: "Continuous feedback platform with pulse surveys, 1:1 tools, and AI-powered insights for managers.",
      problem: "Annual reviews are outdated; companies need real-time engagement data.",
      solution: "Lightweight feedback tools with AI analysis of trends and manager coaching suggestions.",
      market: "Employee engagement software at $1.5B, growing 12% annually.",
      monetization: "$3-8/employee/month, enterprise with custom features.",
      competition: "Medium - Culture Amp and Lattice dominant, SMB market underserved.",
      tags: ['HR Tech', 'AI', 'Engagement'],
      difficulty: 'Medium',
      timeToMvp: '3 months',
      year: 2026,
      viabilityScore: 80
    },
    {
      title: "Skills & Career Path Platform",
      description: "Platform that maps employee skills, suggests learning paths, and shows internal mobility opportunities.",
      problem: "Companies lose talent because employees can't see growth paths or skill gaps.",
      solution: "AI-powered skills mapping with personalized development plans and internal job matching.",
      market: "Learning & development market at $370B, skills-based hiring trend growing.",
      monetization: "$5-15/employee/month, integration with HRIS systems.",
      competition: "Medium - Degreed and Eightfold.ai exist, mid-market opportunity.",
      tags: ['HR Tech', 'AI', 'Career Development'],
      difficulty: 'Medium',
      timeToMvp: '4-5 months',
      year: 2026,
      viabilityScore: 78
    }
  ]
};

export default function StartupIdeaClient() {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [currentIdea, setCurrentIdea] = useState<StartupIdea | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedIdeas, setSavedIdeas] = useState<StartupIdea[]>([]);
  const [copied, setCopied] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const getIdeasForIndustry = () => {
    if (!selectedIndustry || !startupIdeas[selectedIndustry]) {
      const allIdeas = Object.values(startupIdeas).flat();
      return allIdeas;
    }
    return startupIdeas[selectedIndustry];
  };

  const generateIdea = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const ideas = getIdeasForIndustry();
    let randomIdea;
    
    // Try to avoid showing the same idea twice in a row
    if (currentIdea && ideas.length > 1) {
      const filtered = ideas.filter(i => i.title !== currentIdea.title);
      randomIdea = filtered[Math.floor(Math.random() * filtered.length)];
    } else {
      randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
    }
    
    setCurrentIdea(randomIdea);
    setGeneratedCount(prev => prev + 1);
    setIsGenerating(false);
  };

  const saveIdea = () => {
    if (currentIdea && !savedIdeas.find(i => i.title === currentIdea.title)) {
      setSavedIdeas([...savedIdeas, currentIdea]);
    }
  };

  const copyIdea = () => {
    if (!currentIdea) return;
    const text = `
${currentIdea.title}

${currentIdea.description}

Problem: ${currentIdea.problem}
Solution: ${currentIdea.solution}
Market: ${currentIdea.market}
Monetization: ${currentIdea.monetization}
Competition: ${currentIdea.competition}
Difficulty: ${currentIdea.difficulty}
Time to MVP: ${currentIdea.timeToMvp}
Viability Score: ${currentIdea.viabilityScore}/100
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Hard': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getViabilityColor = (score: number) => {
    if (score >= 85) return 'text-emerald-500';
    if (score >= 75) return 'text-blue-500';
    return 'text-orange-500';
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          2026 Startup Idea Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Industry (Optional)</label>
              <div className="grid grid-cols-2 gap-2">
                {industries.map(ind => (
                  <Button
                    key={ind.id}
                    variant={selectedIndustry === ind.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedIndustry(selectedIndustry === ind.id ? '' : ind.id);
                      setCurrentIdea(null);
                    }}
                    className={`justify-start ${selectedIndustry === ind.id ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
                  >
                    <span className="mr-2">{ind.icon}</span>
                    {ind.name}
                  </Button>
                ))}
              </div>
            </div>

            <Button 
              onClick={generateIdea}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating 2026 Idea...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Generate Idea
                </>
              )}
            </Button>

            {generatedCount > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                {generatedCount} idea{generatedCount !== 1 ? 's' : ''} generated
              </p>
            )}

            {/* Saved Ideas */}
            {savedIdeas.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Saved Ideas ({savedIdeas.length})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedIdeas.map((idea, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIdea(idea)}
                      className="w-full p-2 bg-muted/50 rounded text-xs text-left hover:bg-muted/70 transition-colors"
                    >
                      <div className="font-medium truncate">{idea.title}</div>
                      <div className="text-muted-foreground flex gap-1 mt-1">
                        {idea.tags.slice(0, 2).map(t => (
                          <span key={t} className="bg-background px-1 rounded">{t}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Output */}
          <div className="lg:col-span-2">
            {currentIdea ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{currentIdea.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {currentIdea.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                      <Badge className={getDifficultyColor(currentIdea.difficulty)}>
                        {currentIdea.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        {currentIdea.timeToMvp}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-2xl font-bold ${getViabilityColor(currentIdea.viabilityScore)}`}>
                      {currentIdea.viabilityScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Viability Score</div>
                    <div className="flex gap-2 mt-1">
                      <Button variant="outline" size="sm" onClick={saveIdea}>
                        <Bookmark className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyIdea}>
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{currentIdea.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-red-500" />
                      <span className="font-semibold text-sm">Problem</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{currentIdea.problem}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      <span className="font-semibold text-sm">Solution</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{currentIdea.solution}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-sm">Market</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{currentIdea.market}</p>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-sm">Monetization</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{currentIdea.monetization}</p>
                  </Card>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold text-sm">Competition</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{currentIdea.competition}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-muted/30 rounded-xl">
                <div className="text-center text-muted-foreground">
                  <Rocket className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Select an industry or generate a random idea</p>
                  <p className="text-sm mt-1">50+ curated 2026 startup ideas with market analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
