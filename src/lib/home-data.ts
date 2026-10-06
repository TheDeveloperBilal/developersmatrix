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
  AtSign,
  type LucideIcon,
} from "lucide-react";

/* ---------------- Live ticker ---------------- */

export type TickerTag = "NEW" | "TRENDING" | "HOT" | "LATEST" | "UPDATED";

export const liveTickerItems: { tag: TickerTag; label: string; href: string }[] = [
  { tag: "UPDATED", label: "Prompt Library rebuilt with 64 prompts and a prompt builder", href: "/tools/ai-prompt-library" },
  { tag: "HOT", label: "GTA 6 launches November 19, 2026 on PS5 and Xbox Series X|S", href: "/gta-6" },
  { tag: "UPDATED", label: "Resume Builder rebuilt with a live resume check", href: "/tools/ai-resume-builder" },
  { tag: "LATEST", label: "No official GTA 6 PC specs yet: what is confirmed", href: "/tools/can-you-run-it/gta-6" },
  { tag: "UPDATED", label: "Interview Simulator now checks what your answer covered", href: "/tools/ai-interview-simulator" },
  { tag: "UPDATED", label: "Can You Run It specs checked against publishers", href: "/tools/can-you-run-it" },
  { tag: "LATEST", label: "AI side hustles in 2026: one updated guide", href: "/trends/ai-side-hustles-make-money-2026" },
  { tag: "UPDATED", label: "Cover Letter Generator rebuilt around the job posting", href: "/tools/ai-cover-letter-generator" },
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
  "Gaming",
];

// Only tools that exist. The homepage counts tools from this list.
export const explorerTools: ExplorerTool[] = [
  {
    name: "AI Website Audit",
    href: "/tools/website-audit",
    description: "Around 150 checks across SEO, speed, security, mobile and more, with a prioritized fix list.",
    category: "SEO",
    icon: Gauge,
  },
  {
    name: "AI Content Detector",
    href: "/tools/ai-content-detector",
    description: "Check whether text reads as human or machine written, with a full breakdown.",
    category: "AI Tools",
    icon: ScanSearch,
  },
  {
    name: "AI Resume Builder",
    href: "/tools/ai-resume-builder",
    description: "ATS friendly resume on a live page, with a check on every bullet. No signup.",
    category: "Career",
    icon: FileText,
    badge: "UPDATED",
  },
  {
    name: "Interview Simulator",
    href: "/tools/ai-interview-simulator",
    description: "Behavioral, technical and system design questions with instant feedback on your answer.",
    category: "Career",
    icon: MessagesSquare,
    badge: "UPDATED",
  },
  {
    name: "Cover Letter Generator",
    href: "/tools/ai-cover-letter-generator",
    description: "A letter built around the job posting and your own experience, with a length check.",
    category: "Career",
    icon: Mail,
    badge: "UPDATED",
  },
  {
    name: "AI Prompt Library",
    href: "/tools/ai-prompt-library",
    description: "64 ready prompts for coding, writing, marketing and careers, with a fill in the blanks builder.",
    category: "AI Tools",
    icon: Sparkles,
    badge: "UPDATED",
  },
  {
    name: "AI Email Assistant",
    href: "/tools/ai-email-assistant",
    description: "Starting drafts for common work emails that you can adjust and send.",
    category: "Business",
    icon: AtSign,
  },
  {
    name: "Link Manager & Smart Bio",
    href: "/tools/link-manager",
    description: "Keep the links you share in one simple page.",
    category: "SEO",
    icon: Link2,
  },
  {
    name: "Budget Planner",
    href: "/tools/budget-planner",
    description: "Plan monthly income, spending and savings goals in one view.",
    category: "Productivity",
    icon: Wallet,
  },
  {
    name: "Habit Tracker",
    href: "/tools/habit-tracker",
    description: "A simple, visual checklist for the habits you want to build.",
    category: "Productivity",
    icon: CalendarCheck,
  },
  {
    name: "Productivity Planner",
    href: "/tools/productivity-planner",
    description: "Plan your week with priorities and time blocks.",
    category: "Productivity",
    icon: ListChecks,
  },
  {
    name: "Startup Idea Generator",
    href: "/tools/startup-idea-generator",
    description: "Business ideas with a target market and first steps to test them.",
    category: "Business",
    icon: Lightbulb,
  },
  {
    name: "Salary Estimator",
    href: "/tools/salary-estimator",
    description: "Look up real pay ranges for your role and location.",
    category: "Business",
    icon: CircleDollarSign,
  },
  {
    name: "Can You Run It",
    href: "/tools/can-you-run-it",
    description: "Check your PC against the requirements publishers list for popular games.",
    category: "Gaming",
    icon: Gamepad2,
    badge: "UPDATED",
  },
];

export const TOOL_COUNT = explorerTools.length;

// How the site describes its tool count. Change this one line when new tools ship.
export const TOOLS_LABEL = "20+";

/* ---------------- Trending now ---------------- */

// Cards are built on the server from the real trend reports (see app/page.tsx),
// so dates and titles always match what the reports say.
export type TrendCard = {
  title: string;
  href: string;
  category: string; // short, human label such as "Gaming"
  summary: string;
  updated: string;
  readTime: number;
  related?: { label: string; href: string };
};

// Which reports to feature on the homepage, with a short summary of each and
// the tool that pairs with it.
export const featuredTrendPicks: { slug: string; summary: string; related?: { label: string; href: string } }[] = [
  {
    slug: "ai-side-hustles-make-money-2026",
    summary: "AI side hustles that pay in 2026, what each one involves and how to start without big upfront costs.",
    related: { label: "AI Prompt Library", href: "/tools/ai-prompt-library" },
  },
  {
    slug: "ai-agents-autonomous-systems-2026",
    summary: "How AI agents plan and carry out tasks, where businesses use them and where they still need a human.",
    related: { label: "AI Prompt Library", href: "/tools/ai-prompt-library" },
  },
  {
    slug: "gta-6-release-everything-we-know",
    summary: "The confirmed release date, platforms, story and characters, plus what is still unannounced.",
    related: { label: "Can You Run It", href: "/tools/can-you-run-it/gta-6" },
  },
  {
    slug: "ai-coding-assistants-comparison-2026",
    summary: "GitHub Copilot, Cursor, Claude and ChatGPT compared for everyday development work.",
    related: { label: "AI Prompt Library", href: "/tools/ai-prompt-library" },
  },
  {
    slug: "tech-skills-demand-2026",
    summary: "The technical skills worth learning this year and how to show them on a resume.",
    related: { label: "Resume Builder", href: "/tools/ai-resume-builder" },
  },
];

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
      { name: "Link Manager & Smart Bio", href: "/tools/link-manager", icon: Link2, note: "Your links in one page" },
    ],
    content: [
      { label: "Website audit checklist: 47 checks", href: "/blog/website-audit-checklist-2026", type: "Guide" },
      { label: "On page SEO checklist", href: "/blog/on-site-seo-guide-2026", type: "Guide" },
    ],
  },
  {
    id: "ai-tools",
    label: "Find AI tools",
    icon: Sparkles,
    headline: "The useful AI stack, curated",
    tools: [
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: Sparkles, note: "Fill in the blanks, then copy" },
      { name: "AI Content Detector", href: "/tools/ai-content-detector", icon: ScanSearch, note: "Verify what you publish" },
      { name: "Startup Idea Generator", href: "/tools/startup-idea-generator", icon: Lightbulb, note: "Ideas plus first steps" },
    ],
    content: [
      { label: "AI agents in 2026", href: "/trends/ai-agents-autonomous-systems-2026", type: "Trend" },
      { label: "AI coding assistants compared", href: "/trends/ai-coding-assistants-comparison-2026", type: "Trend" },
    ],
  },
  {
    id: "career",
    label: "Build my career",
    icon: MessagesSquare,
    headline: "From application to signed offer",
    tools: [
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder", icon: FileText, note: "ATS friendly, no signup" },
      { name: "Interview Simulator", href: "/tools/ai-interview-simulator", icon: MessagesSquare, note: "Instant answer feedback" },
      { name: "Salary Estimator", href: "/tools/salary-estimator", icon: CircleDollarSign, note: "Check a salary range" },
    ],
    content: [
      { label: "Technical interview prep 2026", href: "/blog/technical-interview-prep-2026", type: "Guide" },
      { label: "Remote tech jobs guide", href: "/trends/remote-tech-jobs-guide-2026", type: "Trend" },
    ],
  },
  {
    id: "resume",
    label: "Create a resume",
    icon: FileText,
    headline: "A resume that passes the bots",
    tools: [
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder", icon: FileText, note: "Live check on every bullet" },
      { name: "Cover Letter Generator", href: "/tools/ai-cover-letter-generator", icon: Mail, note: "Matched to each posting" },
    ],
    content: [
      { label: "7 resume builders tested", href: "/blog/best-free-resume-builders-2026", type: "Comparison" },
      { label: "How to write a cover letter", href: "/blog/how-to-write-cover-letter-2026", type: "Guide" },
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
      { label: "AI automation business ideas", href: "/blog/ai-automation-business-ideas-2026", type: "Guide" },
      { label: "AI side hustles in 2026", href: "/trends/ai-side-hustles-make-money-2026", type: "Trend" },
    ],
  },
  {
    id: "productivity",
    label: "Improve productivity",
    icon: CalendarCheck,
    headline: "Systems that make weeks focused",
    tools: [
      { name: "Habit Tracker", href: "/tools/habit-tracker", icon: CalendarCheck, note: "Daily habit checklist" },
      { name: "Productivity Planner", href: "/tools/productivity-planner", icon: ListChecks, note: "Priorities and time blocks" },
      { name: "Budget Planner", href: "/tools/budget-planner", icon: Wallet, note: "See where money goes" },
    ],
    content: [
      { label: "Best AI developer tools for 2026", href: "/blog/ai-tools-developers-2026", type: "Guide" },
    ],
  },
  {
    id: "learn",
    label: "Learn about technology",
    icon: Code2,
    headline: "Micro lessons, real skills",
    tools: [
      { name: "Learn Hub", href: "/learn", icon: Code2, note: "Short coding lessons" },
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: Sparkles, note: "Learn by prompting" },
    ],
    content: [
      { label: "Learn programming in 2026", href: "/trends/learn-programming-2026-complete-guide", type: "Guide" },
      { label: "Most in demand tech skills", href: "/trends/tech-skills-demand-2026", type: "Trend" },
    ],
  },
  {
    id: "trends",
    label: "Find the latest trends",
    icon: Gamepad2,
    headline: "In depth reports, kept current",
    tools: [
      { name: "Trend Radar", href: "/trends", icon: Gamepad2, note: "Reports by topic" },
      { name: "Can You Run It", href: "/tools/can-you-run-it", icon: Gamepad2, note: "Check your PC" },
    ],
    content: [
      { label: "GTA 6 launch hub", href: "/gta-6", type: "Hub" },
      { label: "Gaming tech trends 2026", href: "/trends/gaming-tech-trends-2026", type: "Trend" },
    ],
  },
];

/* ---------------- Latest updates feed ---------------- */

export type UpdateItem = {
  kind: "New" | "Updated";
  title: string;
  meta: string;
  href: string;
  date: string; // ISO date, shown as "Oct 6"
};

// A real, dated log of changes. Newest guides are added from the blog on the server.
export const toolUpdates: UpdateItem[] = [
  { kind: "Updated", title: "Prompt Library rebuilt with 64 prompts and a prompt builder", meta: "Tool · AI", href: "/tools/ai-prompt-library", date: "2026-10-06" },
  { kind: "Updated", title: "Resume Builder rebuilt with a live resume check", meta: "Tool · Career", href: "/tools/ai-resume-builder", date: "2026-10-05" },
  { kind: "Updated", title: "AI side hustle guides merged into one updated report", meta: "Trend · Make money", href: "/trends/ai-side-hustles-make-money-2026", date: "2026-10-02" },
  { kind: "Updated", title: "Cover Letter Generator rebuilt around the job posting", meta: "Tool · Career", href: "/tools/ai-cover-letter-generator", date: "2026-10-01" },
  { kind: "Updated", title: "Interview Simulator rebuilt with answer feedback", meta: "Tool · Career", href: "/tools/ai-interview-simulator", date: "2026-10-01" },
  { kind: "Updated", title: "Can You Run It: 26 games checked against publisher specs", meta: "Tool · Gaming", href: "/tools/can-you-run-it", date: "2026-09-30" },
  { kind: "New", title: "GTA 6 PC requirements: what is actually confirmed", meta: "Guide · Gaming", href: "/tools/can-you-run-it/gta-6", date: "2026-09-11" },
];

/* ---------------- Homepage FAQ ---------------- */

export const homeFaqs = [
  {
    question: "What is DevelopersMatrix?",
    answer: `DevelopersMatrix is a free platform with ${TOOLS_LABEL} browser tools for resumes, cover letters, interview practice, website audits, prompts, budgeting and more, plus in depth trend reports and guides. No signup required.`,
  },
  {
    question: "Are the tools on DevelopersMatrix really free?",
    answer: "Yes. The tools are free to use with no credit card and no account. The site is supported by advertising.",
  },
  {
    question: "How does the Resume Builder work?",
    answer: "You fill in your resume section by section and see it on a real A4 page as you type. A built in check flags weak bullets, missing numbers and gaps, and you download a clean single column PDF. Your data stays in your browser.",
  },
  {
    question: "What does the Website Audit Tool check?",
    answer: "It runs around 150 checks across eight areas: SEO, technical setup, performance, mobile, security, accessibility, content and conversion. You get a score out of 100 plus a prioritized list of fixes.",
  },
  {
    question: "How does the Interview Simulator give feedback?",
    answer: "It asks real behavioral, technical and system design questions, then checks your answer against the key points a strong answer covers and tells you what you covered and what you missed. It is a practice tool, not a prediction of what a real interviewer will decide.",
  },
];
