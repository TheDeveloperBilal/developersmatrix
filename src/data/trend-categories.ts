// Category metadata for the trend radar.
//
// Split out of trends-data.ts so client components can read the category list
// without importing that file, which carries every trend body and weighs 268 KB.

export type TrendCategory = 
  | 'ai-tools'
  | 'ai-agents'
  | 'make-money'
  | 'gaming'
  | 'future-tech'
  | 'cybersecurity'
  | 'social-media'
  | 'coding'
  | 'green-tech'
  | 'career-growth';

export interface TrendCategoryInfo {
  id: TrendCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  lightBg: string;
  darkBg: string;
}

export const trendCategories: TrendCategoryInfo[] = [
  {
    id: 'ai-tools',
    name: 'AI Tools & Automation',
    description: 'Latest AI tools, automation platforms, and productivity boosters',
    icon: 'Brain',
    color: 'violet',
    lightBg: 'bg-violet-100',
    darkBg: 'dark:bg-violet-500/10'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents & Future Automation',
    description: 'Autonomous AI systems, agents, and the future of work',
    icon: 'Bot',
    color: 'purple',
    lightBg: 'bg-purple-100',
    darkBg: 'dark:bg-purple-500/10'
  },
  {
    id: 'make-money',
    name: 'Make Money Online with AI',
    description: 'Side hustles, income streams, and AI-powered opportunities',
    icon: 'DollarSign',
    color: 'green',
    lightBg: 'bg-green-100',
    darkBg: 'dark:bg-green-500/10'
  },
  {
    id: 'gaming',
    name: 'Trending Games & Gaming Tech',
    description: 'Latest games, gaming hardware, and esports trends',
    icon: 'Gamepad2',
    color: 'pink',
    lightBg: 'bg-pink-100',
    darkBg: 'dark:bg-pink-500/10'
  },
  {
    id: 'future-tech',
    name: 'Future Technology',
    description: 'AI, Web3, XR, Quantum computing, and emerging tech',
    icon: 'Rocket',
    color: 'blue',
    lightBg: 'bg-blue-100',
    darkBg: 'dark:bg-blue-500/10'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Online Safety',
    description: 'Security trends, privacy tools, and threat awareness',
    icon: 'Shield',
    color: 'red',
    lightBg: 'bg-red-100',
    darkBg: 'dark:bg-red-500/10'
  },
  {
    id: 'social-media',
    name: 'Social Media Trends',
    description: 'Platform updates, creator economy, and viral trends',
    icon: 'Share2',
    color: 'cyan',
    lightBg: 'bg-cyan-100',
    darkBg: 'dark:bg-cyan-500/10'
  },
  {
    id: 'coding',
    name: 'Coding, No-Code & AI Development',
    description: 'Programming trends, no-code tools, and AI-assisted dev',
    icon: 'Code',
    color: 'orange',
    lightBg: 'bg-orange-100',
    darkBg: 'dark:bg-orange-500/10'
  },
  {
    id: 'green-tech',
    name: 'Green Tech & Sustainability',
    description: 'Clean energy, sustainable tech, and environmental innovation',
    icon: 'Leaf',
    color: 'emerald',
    lightBg: 'bg-emerald-100',
    darkBg: 'dark:bg-emerald-500/10'
  },
  {
    id: 'career-growth',
    name: 'Tech Skills & Career Growth',
    description: 'In-demand skills, career paths, and professional development',
    icon: 'TrendingUp',
    color: 'amber',
    lightBg: 'bg-amber-100',
    darkBg: 'dark:bg-amber-500/10'
  }
];
