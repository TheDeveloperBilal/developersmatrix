import {
  Gauge,
  FileText,
  ScanSearch,
  MessagesSquare,
  Mail,
  Wallet,
  Gamepad2,
  Lightbulb,
  Sparkles,
  Link2,
  ListChecks,
  CircleDollarSign,
  CalendarCheck,
  Code2,
  Braces,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";

/* ---------------- Live ticker ---------------- */

export type TickerTag = "NEW" | "TRENDING" | "HOT" | "LATEST" | "UPDATED";

export const liveTickerItems: { tag: TickerTag; label: string; href: string }[] = [
  { tag: "HOT", label: "GTA 6 releases November 19, 2026", href: "/gta-6" },
  { tag: "NEW", label: "AI Content Detector is live", href: "/tools/ai-content-detector" },
  { tag: "TRENDING", label: "AI agents move into daily workflows", href: "/trends" },
  { tag: "LATEST", label: "Guide: Technical interview prep 2026", href: "/blog/technical-interview-prep-2026" },
  { tag: "UPDATED", label: "Resume Builder now with ATS scoring", href: "/tools/ai-resume-builder" },
  { tag: "TRENDING", label: "Remote hiring rebounds for senior roles", href: "/trends" },
  { tag: "NEW", label: "Prompt Library passes 500 curated prompts", href: "/tools/ai-prompt-library" },
  { tag: "HOT", label: "Website Audit: free health checks", href: "/tools/website-audit" },
  { tag: "LATEST", label: "Best free resume builders compared", href: "/blog/best-free-resume-builders-2026" },
  { tag: "UPDATED", label: "Salary Estimator refreshed with 2026 data", href: "/tools/salary-estimator" },
];

/* ---------------- Tool explorer ---------------- */

export type ExplorerTool = {
  name: string;
  href: string;
  description: string;
  category: string;
  icon: LucideIcon;
  badge?: "NEW" | "POPULAR" | "TRENDING" | "UPDATED" | "HOT";
};

export const explorerCategories = [
  "All",
  "AI Tools",
  "Career",
  "SEO",
  "Productivity",
  "Business",
  "Developer Tools",
];

export const explorerTools: ExplorerTool[] = [
  {
    name: "AI Website Audit",
    href: "/tools/website-audit",
    description: "Full health check for any site: SEO, speed, security, mobile UX and content.",
    category: "SEO",
    icon: Gauge,
    badge: "POPULAR",
  },
  {
    name: "AI Content Detector",
    href: "/tools/ai-content-detector",
    description: "Check whether text reads as human or machine written, with a full breakdown.",
    category: "AI Tools",
    icon: ScanSearch,
    badge: "NEW",
  },
  {
    name: "AI Resume Builder",
    href: "/tools/ai-resume-builder",
    description: "ATS friendly resumes in minutes, built for developers and modern roles.",
    category: "Career",
    icon: FileText,
    badge: "POPULAR",
  },
  {
    name: "Interview Simulator",
    href: "/tools/ai-interview-simulator",
    description: "Behavioral, technical and system design rounds with instant AI scoring.",
    category: "Career",
    icon: MessagesSquare,
    badge: "TRENDING",
  },
  {
    name: "Cover Letter Generator",
    href: "/tools/ai-cover-letter-generator",
    description: "Letters matched to the exact job posting so they never read generic.",
    category: "Career",
    icon: Mail,
  },
  {
    name: "AI Prompt Library",
    href: "/tools/ai-prompt-library",
    description: "500+ curated prompts for coding, writing, marketing and analysis.",
    category: "AI Tools",
    icon: Sparkles,
    badge: "UPDATED",
  },
  {
    name: "Link Manager & Smart Bio",
    href: "/tools/link-manager",
    description: "One smart link for everything you share, with click analytics.",
    category: "SEO",
    icon: Link2,
  },
  {
    name: "Budget Planner",
    href: "/tools/budget-planner",
    description: "Track income, spending and savings goals with clear monthly views.",
    category: "Productivity",
    icon: Wallet,
  },
  {
    name: "Habit Tracker",
    href: "/tools/habit-tracker",
    description: "Build streaks and routines with a simple, visual daily tracker.",
    category: "Productivity",
    icon: CalendarCheck,
  },
  {
    name: "Productivity Planner",
    href: "/tools/productivity-planner",
    description: "Plan focused weeks with priorities, time blocks and reviews.",
    category: "Productivity",
    icon: ListChecks,
  },
  {
    name: "Startup Idea Generator",
    href: "/tools/startup-idea-generator",
    description: "AI generated business ideas with market angles and first steps.",
    category: "Business",
    icon: Lightbulb,
    badge: "TRENDING",
  },
  {
    name: "Salary Estimator",
    href: "/tools/salary-estimator",
    description: "2026 salary data for your role, level and market before you negotiate.",
    category: "Business",
    icon: CircleDollarSign,
    badge: "UPDATED",
  },
  {
    name: "Can You Run It",
    href: "/tools/can-you-run-it",
    description: "Check your PC against game requirements, including GTA 6.",
    category: "Developer Tools",
    icon: Gamepad2,
    badge: "HOT",
  },
  {
    name: "JSON Formatter",
    href: "/tools",
    description: "Format, validate and explore JSON payloads instantly in browser.",
    category: "Developer Tools",
    icon: Braces,
  },
  {
    name: "Regex Playground",
    href: "/tools",
    description: "Test regular expressions live with match highlighting and hints.",
    category: "Developer Tools",
    icon: TerminalSquare,
    badge: "NEW",
  },
  {
    name: "Code Snippet Vault",
    href: "/tools",
    description: "Save and organize reusable snippets with tags and quick copy.",
    category: "Developer Tools",
    icon: Code2,
  },
];

/* ---------------- Trending now ---------------- */

export type TrendCard = {
  topic: string;
  category: string;
  categoryStyle: string;
  status: "Rising" | "Hot" | "Stable";
  summary: string;
  freshness: string;
  activity: number; // 0-100
  spark: number[];
  href: string;
  related: { label: string; href: string };
};

export const trendCards: TrendCard[] = [
  {
    topic: "AI agents in daily workflows",
    category: "AI",
    categoryStyle: "bg-brand-100 text-brand-700",
    status: "Rising",
    summary: "Agentic tools moved from demos to production. Teams now ship task-running agents for support, research and code review.",
    freshness: "2h ago",
    activity: 92,
    spark: [12, 18, 16, 24, 30, 28, 42, 55, 61, 78],
    href: "/trends",
    related: { label: "AI Prompt Library", href: "/tools/ai-prompt-library" },
  },
  {
    topic: "GTA 6 launch countdown",
    category: "Gaming",
    categoryStyle: "bg-rose-50 text-rose-600",
    status: "Hot",
    summary: "Rockstar has locked the release for November 19, 2026. PC players are already checking hardware against the published requirements.",
    freshness: "5h ago",
    activity: 88,
    spark: [20, 22, 30, 28, 40, 52, 48, 66, 80, 95],
    href: "/gta-6",
    related: { label: "Can You Run It", href: "/tools/can-you-run-it" },
  },
  {
    topic: "Remote senior hiring rebounds",
    category: "Careers",
    categoryStyle: "bg-sky-50 text-sky-600",
    status: "Rising",
    summary: "Senior engineering postings are up for the third straight month, with remote first companies leading the recovery.",
    freshness: "1d ago",
    activity: 74,
    spark: [30, 28, 34, 32, 40, 44, 50, 54, 60, 68],
    href: "/trends",
    related: { label: "Interview Simulator", href: "/tools/ai-interview-simulator" },
  },
  {
    topic: "Google AI Overviews & SEO",
    category: "SEO",
    categoryStyle: "bg-emerald-50 text-emerald-600",
    status: "Stable",
    summary: "AI Overviews now answer most informational queries. Sites win by earning citations and strengthening technical health.",
    freshness: "1d ago",
    activity: 61,
    spark: [40, 44, 42, 48, 46, 52, 50, 55, 54, 58],
    href: "/trends",
    related: { label: "AI Website Audit", href: "/tools/website-audit" },
  },
  {
    topic: "Local AI models on laptops",
    category: "AI",
    categoryStyle: "bg-brand-100 text-brand-700",
    status: "Rising",
    summary: "Small distilled models now run well on consumer hardware, pushing privacy first AI tools into the mainstream.",
    freshness: "2d ago",
    activity: 79,
    spark: [15, 20, 26, 24, 34, 40, 52, 58, 66, 74],
    href: "/trends",
    related: { label: "AI Content Detector", href: "/tools/ai-content-detector" },
  },
];

/* ---------------- Articles (all real latest blogs from high-quality-blogs.json) ---------------- */

import blogsJson from "@/data/high-quality-blogs.json";

export type Article = {
  title: string;
  description: string;
  category: string;
  categoryStyle: string;
  readTime: string;
  updated: string;
  image: string;
  href: string;
};

// Category style map for article cards
const categoryStyles: Record<string, string> = {
  Career: "bg-brand-100 text-brand-700",
  SEO: "bg-emerald-50 text-emerald-600",
  Productivity: "bg-amber-50 text-amber-600",
  AI: "bg-brand-100 text-brand-700",
  "Artificial Intelligence": "bg-brand-100 text-brand-700",
  Technology: "bg-sky-50 text-sky-600",
  Gaming: "bg-rose-50 text-rose-600",
  Startup: "bg-violet-50 text-violet-600",
  "Web Development": "bg-indigo-50 text-indigo-600",
  "Social Media Marketing": "bg-pink-50 text-pink-600",
  "Social Media": "bg-pink-50 text-pink-600",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Build articles dynamically from all real blogs, newest first
const rawBlogs = blogsJson as Array<{
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  dateModified?: string;
  image: string;
}>;

export const articles: Article[] = rawBlogs
  .slice()
  .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  .map((b) => ({
    title: b.title,
    description: b.excerpt,
    category: b.category,
    categoryStyle: categoryStyles[b.category] || "bg-sky-50 text-sky-600",
    readTime: `${b.readTime} min read`,
    updated: `Updated ${fmtDate(b.dateModified || b.publishedAt)}`,
    image: b.image,
    href: `/blog/${b.slug}`,
  }));

// The single newest blog (for featured right-side card)
export const latestArticle = articles[0];

/* ---------------- Explore by goal ---------------- */

export type Goal = {
  id: string;
  label: string;
  icon: LucideIcon;
  headline: string;
  tools: { name: string; href: string; icon: LucideIcon; note: string }[];
  content: { label: string; href: string; type: string }[];
};

export const goals: Goal[] = [
  {
    id: "website",
    label: "Improve my website",
    icon: Gauge,
    headline: "Audit, fix and grow your site",
    tools: [
      { name: "AI Website Audit", href: "/tools/website-audit", icon: Gauge, note: "Start with a full health score" },
      { name: "AI Content Detector", href: "/tools/ai-content-detector", icon: ScanSearch, note: "Keep content human and original" },
      { name: "Link Manager & Smart Bio", href: "/tools/link-manager", icon: Link2, note: "Turn traffic into followers" },
    ],
    content: [
      { label: "Website audits explained", href: "/blog", type: "Guide" },
      { label: "SEO trends this week", href: "/trends", type: "Trend" },
    ],
  },
  {
    id: "ai-tools",
    label: "Find AI tools",
    icon: Sparkles,
    headline: "The useful AI stack, curated",
    tools: [
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: Sparkles, note: "500+ prompts that actually work" },
      { name: "AI Content Detector", href: "/tools/ai-content-detector", icon: ScanSearch, note: "Verify what you publish" },
      { name: "Startup Idea Generator", href: "/tools/startup-idea-generator", icon: Lightbulb, note: "Brainstorm with AI" },
    ],
    content: [
      { label: "AI agents trend report", href: "/trends", type: "Trend" },
      { label: "What to learn as AI eats busywork", href: "/blog", type: "Article" },
    ],
  },
  {
    id: "career",
    label: "Build my career",
    icon: MessagesSquare,
    headline: "From application to signed offer",
    tools: [
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder", icon: FileText, note: "ATS ready in minutes" },
      { name: "Interview Simulator", href: "/tools/ai-interview-simulator", icon: MessagesSquare, note: "Practice with AI scoring" },
      { name: "Salary Estimator", href: "/tools/salary-estimator", icon: CircleDollarSign, note: "Negotiate with data" },
    ],
    content: [
      { label: "Technical interview prep 2026", href: "/blog/technical-interview-prep-2026", type: "Guide" },
      { label: "Remote hiring rebounds", href: "/trends", type: "Trend" },
    ],
  },
  {
    id: "resume",
    label: "Create a resume",
    icon: FileText,
    headline: "A resume that passes the bots",
    tools: [
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder", icon: FileText, note: "AI writing help per section" },
      { name: "Cover Letter Generator", href: "/tools/ai-cover-letter-generator", icon: Mail, note: "Matched to each posting" },
    ],
    content: [
      { label: "7 resume builders tested", href: "/blog/best-free-resume-builders-2026", type: "Comparison" },
      { label: "Cover letters that convert", href: "/blog/how-to-write-cover-letter-2026", type: "Guide" },
    ],
  },
  {
    id: "ideas",
    label: "Discover business ideas",
    icon: Lightbulb,
    headline: "Ideas with a real market angle",
    tools: [
      { name: "Startup Idea Generator", href: "/tools/startup-idea-generator", icon: Lightbulb, note: "Ideas plus first steps" },
      { name: "Budget Planner", href: "/tools/budget-planner", icon: Wallet, note: "Run the numbers early" },
    ],
    content: [
      { label: "AI business trends", href: "/trends", type: "Trend" },
      { label: "Founder productivity stack", href: "/blog", type: "Article" },
    ],
  },
  {
    id: "productivity",
    label: "Improve productivity",
    icon: CalendarCheck,
    headline: "Systems that make weeks focused",
    tools: [
      { name: "Habit Tracker", href: "/tools/habit-tracker", icon: CalendarCheck, note: "Streaks that stick" },
      { name: "Productivity Planner", href: "/tools/productivity-planner", icon: ListChecks, note: "Priorities and time blocks" },
      { name: "Budget Planner", href: "/tools/budget-planner", icon: Wallet, note: "Money on autopilot" },
    ],
    content: [
      { label: "2026 developer productivity stack", href: "/blog", type: "Article" },
    ],
  },
  {
    id: "learn",
    label: "Learn about technology",
    icon: Code2,
    headline: "Micro lessons, real skills",
    tools: [
      { name: "Learn Hub", href: "/learn", icon: Code2, note: "50+ micro lessons" },
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: Sparkles, note: "Learn by prompting" },
    ],
    content: [
      { label: "System design basics", href: "/learn", type: "Course" },
      { label: "Local AI models explained", href: "/trends", type: "Trend" },
    ],
  },
  {
    id: "trends",
    label: "Find the latest trends",
    icon: Gamepad2,
    headline: "Signals before they are news",
    tools: [
      { name: "Trend Radar", href: "/trends", icon: Gamepad2, note: "Daily tracked signals" },
      { name: "Can You Run It", href: "/tools/can-you-run-it", icon: Gamepad2, note: "GTA 6 ready?" },
    ],
    content: [
      { label: "GTA 6 launch hub", href: "/gta-6", type: "Hub" },
      { label: "This week in tech", href: "/trends", type: "Radar" },
    ],
  },
];

/* ---------------- Latest updates feed ---------------- */

export type UpdateItem = {
  kind: "New" | "Updated" | "Trending" | "Popular";
  title: string;
  meta: string;
  href: string;
  date: string;
};

export const updates: UpdateItem[] = [
  { kind: "New", title: "AI Content Detector", meta: "Tool · AI", href: "/tools/ai-content-detector", date: "Jul 19" },
  { kind: "New", title: "Regex Playground", meta: "Tool · Developer", href: "/tools", date: "Jul 17" },
  { kind: "Updated", title: "Salary Estimator refreshed with 2026 market data", meta: "Tool · Career", href: "/tools/salary-estimator", date: "Jul 18" },
  { kind: "Updated", title: "Resume Builder adds ATS match scoring", meta: "Tool · Career", href: "/tools/ai-resume-builder", date: "Jul 16" },
  { kind: "Trending", title: "AI agents move into daily workflows", meta: "Signal · AI", href: "/trends", date: "Jul 19" },
  { kind: "Trending", title: "GTA 6 pre orders pass 39 million", meta: "Signal · Gaming", href: "/gta-6", date: "Jul 18" },
  { kind: "Popular", title: "AI Website Audit", meta: "Tool · 3.4k audits", href: "/tools/website-audit", date: "All time" },
  { kind: "Popular", title: "AI Resume Builder", meta: "Tool · Free, no signup", href: "/tools/ai-resume-builder", date: "All time" },
  { kind: "New", title: "Guide: Technical interview prep 2026", meta: "Blog · Career", href: "/blog/technical-interview-prep-2026", date: "Jul 14" },
  { kind: "Updated", title: "Prompt Library grows to 500+ prompts", meta: "Tool · AI", href: "/tools/ai-prompt-library", date: "Jul 13" },
  { kind: "Trending", title: "Local AI models go mainstream", meta: "Signal · AI", href: "/trends", date: "Jul 12" },
  { kind: "Popular", title: "Can You Run It: GTA 6 edition", meta: "Tool · 11k checks", href: "/tools/can-you-run-it", date: "All time" },
];
