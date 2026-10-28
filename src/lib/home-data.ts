import { Briefcase, Code2, Sparkles, type LucideIcon } from "lucide-react";
import { TOOL_ICONS, TREND_RADAR_ICON } from "@/lib/tool-icons";

/* ---------------- Live ticker ---------------- */

export type TickerTag = "NEW" | "TRENDING" | "HOT" | "LATEST" | "UPDATED";

export const liveTickerItems: { tag: TickerTag; label: string; href: string }[] = [
  { tag: "UPDATED", label: "Budget Planner rebuilt as a monthly statement that saves your budget", href: "/tools/budget-planner" },
  { tag: "UPDATED", label: "Habit Tracker now counts streaks from real dates", href: "/tools/habit-tracker" },
  { tag: "UPDATED", label: "Productivity Planner turns your tasks into a timed day plan", href: "/tools/productivity-planner" },
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
    name: "Website Audit",
    href: "/tools/website-audit",
    description: "Over 70 named checks across SEO, speed, security, mobile and more, with a prioritized fix list.",
    category: "SEO",
    icon: TOOL_ICONS["website-audit"],
  },
  {
    name: "AI Content Detector",
    href: "/tools/ai-content-detector",
    description: "Check whether text reads as human or machine written, with a full breakdown.",
    category: "AI Tools",
    icon: TOOL_ICONS["ai-content-detector"],
  },
  {
    name: "AI Resume Builder",
    href: "/tools/ai-resume-builder",
    description: "ATS friendly resume on a live page, with a check on every bullet. No signup.",
    category: "Career",
    icon: TOOL_ICONS["ai-resume-builder"],
    badge: "UPDATED",
  },
  {
    name: "Interview Simulator",
    href: "/tools/ai-interview-simulator",
    description: "Behavioral, technical and system design questions with instant feedback on your answer.",
    category: "Career",
    icon: TOOL_ICONS["ai-interview-simulator"],
    badge: "UPDATED",
  },
  {
    name: "Cover Letter Generator",
    href: "/tools/ai-cover-letter-generator",
    description: "A letter built around the job posting and your own experience, with a length check.",
    category: "Career",
    icon: TOOL_ICONS["ai-cover-letter-generator"],
    badge: "UPDATED",
  },
  {
    name: "AI Prompt Library",
    href: "/tools/ai-prompt-library",
    description: "64 ready prompts for coding, writing, marketing and careers, with a fill in the blanks builder.",
    category: "AI Tools",
    icon: TOOL_ICONS["ai-prompt-library"],
    badge: "UPDATED",
  },
  {
    name: "AI Email Assistant",
    href: "/tools/ai-email-assistant",
    description: "Email templates in three tones, a draft checker and AI prompts.",
    category: "Business",
    icon: TOOL_ICONS["ai-email-assistant"],
    badge: "UPDATED",
  },
  {
    name: "Budget Planner",
    href: "/tools/budget-planner",
    description: "A monthly statement of money in and out, with a 50/30/20 check and a savings goal.",
    category: "Productivity",
    icon: TOOL_ICONS["budget-planner"],
    badge: "UPDATED",
  },
  {
    name: "Habit Tracker",
    href: "/tools/habit-tracker",
    description: "Daily habits with streaks from real dates and a 12 week wall.",
    category: "Productivity",
    icon: TOOL_ICONS["habit-tracker"],
    badge: "UPDATED",
  },
  {
    name: "Productivity Planner",
    href: "/tools/productivity-planner",
    description: "Turn today's tasks into an hour by hour plan with a Top 3.",
    category: "Productivity",
    icon: TOOL_ICONS["productivity-planner"],
    badge: "UPDATED",
  },
  {
    name: "Startup Idea Generator",
    href: "/tools/startup-idea-generator",
    description: "Business ideas matched to your skills, with a plan to test them in a week.",
    category: "Business",
    icon: TOOL_ICONS["startup-idea-generator"],
    badge: "UPDATED",
  },
  {
    name: "Salary Estimator",
    href: "/tools/salary-estimator",
    description: "Look up real pay ranges for your role and location.",
    category: "Business",
    icon: TOOL_ICONS["salary-estimator"],
    badge: "UPDATED",
  },
  {
    name: "Can You Run It",
    href: "/tools/can-you-run-it",
    description: "Check your PC against the requirements publishers list for popular games.",
    category: "Gaming",
    icon: TOOL_ICONS["can-you-run-it"],
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
    icon: TOOL_ICONS["website-audit"],
    headline: "Audit, fix and grow your site",
    tools: [
      { name: "Website Audit", href: "/tools/website-audit", icon: TOOL_ICONS["website-audit"], note: "Start with a full health score" },
      { name: "AI Content Detector", href: "/tools/ai-content-detector", icon: TOOL_ICONS["ai-content-detector"], note: "Keep content human and original" },
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: TOOL_ICONS["ai-prompt-library"], note: "Prompts for SEO and content" },
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
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: TOOL_ICONS["ai-prompt-library"], note: "Fill in the blanks, then copy" },
      { name: "AI Content Detector", href: "/tools/ai-content-detector", icon: TOOL_ICONS["ai-content-detector"], note: "Verify what you publish" },
      { name: "Startup Idea Generator", href: "/tools/startup-idea-generator", icon: TOOL_ICONS["startup-idea-generator"], note: "Ideas plus a test plan" },
    ],
    content: [
      { label: "AI agents in 2026", href: "/trends/ai-agents-autonomous-systems-2026", type: "Trend" },
      { label: "AI coding assistants compared", href: "/trends/ai-coding-assistants-comparison-2026", type: "Trend" },
    ],
  },
  {
    id: "career",
    label: "Build my career",
    icon: Briefcase,
    headline: "From application to signed offer",
    tools: [
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder", icon: TOOL_ICONS["ai-resume-builder"], note: "ATS friendly, no signup" },
      { name: "Interview Simulator", href: "/tools/ai-interview-simulator", icon: TOOL_ICONS["ai-interview-simulator"], note: "Instant answer feedback" },
      { name: "Salary Estimator", href: "/tools/salary-estimator", icon: TOOL_ICONS["salary-estimator"], note: "Check a salary range" },
    ],
    content: [
      { label: "Technical interview prep 2026", href: "/blog/technical-interview-prep-2026", type: "Guide" },
      { label: "Remote tech jobs guide", href: "/trends/remote-tech-jobs-guide-2026", type: "Trend" },
    ],
  },
  {
    id: "resume",
    label: "Create a resume",
    icon: TOOL_ICONS["ai-resume-builder"],
    headline: "A resume that passes the bots",
    tools: [
      { name: "AI Resume Builder", href: "/tools/ai-resume-builder", icon: TOOL_ICONS["ai-resume-builder"], note: "Live check on every bullet" },
      { name: "Cover Letter Generator", href: "/tools/ai-cover-letter-generator", icon: TOOL_ICONS["ai-cover-letter-generator"], note: "Matched to each posting" },
    ],
    content: [
      { label: "7 resume builders tested", href: "/blog/best-free-resume-builders-2026", type: "Comparison" },
      { label: "How to write a cover letter", href: "/blog/how-to-write-cover-letter-2026", type: "Guide" },
    ],
  },
  {
    id: "ideas",
    label: "Discover business ideas",
    icon: TOOL_ICONS["startup-idea-generator"],
    headline: "Ideas with a real market angle",
    tools: [
      { name: "Startup Idea Generator", href: "/tools/startup-idea-generator", icon: TOOL_ICONS["startup-idea-generator"], note: "Ideas plus a test plan" },
      { name: "Budget Planner", href: "/tools/budget-planner", icon: TOOL_ICONS["budget-planner"], note: "Run the numbers early" },
    ],
    content: [
      { label: "AI automation business ideas", href: "/blog/ai-automation-business-ideas-2026", type: "Guide" },
      { label: "AI side hustles in 2026", href: "/trends/ai-side-hustles-make-money-2026", type: "Trend" },
    ],
  },
  {
    id: "productivity",
    label: "Improve productivity",
    icon: TOOL_ICONS["productivity-planner"],
    headline: "Systems that make weeks focused",
    tools: [
      { name: "Habit Tracker", href: "/tools/habit-tracker", icon: TOOL_ICONS["habit-tracker"], note: "Daily habit checklist" },
      { name: "Productivity Planner", href: "/tools/productivity-planner", icon: TOOL_ICONS["productivity-planner"], note: "Priorities and time blocks" },
      { name: "Budget Planner", href: "/tools/budget-planner", icon: TOOL_ICONS["budget-planner"], note: "See where money goes" },
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
      { name: "AI Prompt Library", href: "/tools/ai-prompt-library", icon: TOOL_ICONS["ai-prompt-library"], note: "Learn by prompting" },
    ],
    content: [
      { label: "Learn programming in 2026", href: "/trends/learn-programming-2026-complete-guide", type: "Guide" },
      { label: "Most in demand tech skills", href: "/trends/tech-skills-demand-2026", type: "Trend" },
    ],
  },
  {
    id: "trends",
    label: "Find the latest trends",
    icon: TREND_RADAR_ICON,
    headline: "Detailed reports, kept current",
    tools: [
      { name: "Trend Radar", href: "/trends", icon: TREND_RADAR_ICON, note: "Reports by topic" },
      { name: "Can You Run It", href: "/tools/can-you-run-it", icon: TOOL_ICONS["can-you-run-it"], note: "Check your PC" },
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
  { kind: "Updated", title: "Can You Run It: The Sims 4, Modern Warfare 4, Forza Horizon 6 and 3 more games added", meta: "Tool · Gaming", href: "/tools/can-you-run-it", date: "2026-10-28" },
  { kind: "Updated", title: "Can You Run It: Resident Evil Requiem, Crimson Desert and 3 more games added", meta: "Tool · Gaming", href: "/tools/can-you-run-it", date: "2026-10-23" },
  { kind: "Updated", title: "Productivity Planner rebuilt as an hour by hour day timeline", meta: "Tool · Productivity", href: "/tools/productivity-planner", date: "2026-10-07" },
  { kind: "Updated", title: "Habit Tracker rebuilt with real date streaks and a 12 week wall", meta: "Tool · Productivity", href: "/tools/habit-tracker", date: "2026-10-07" },
  { kind: "Updated", title: "Budget Planner rebuilt as a monthly statement with a savings goal", meta: "Tool · Finance", href: "/tools/budget-planner", date: "2026-10-07" },
  { kind: "Updated", title: "Startup Idea Generator rebuilt around your skills, time and budget", meta: "Tool · Business", href: "/tools/startup-idea-generator", date: "2026-10-07" },
  { kind: "Updated", title: "Email Assistant rebuilt with 18 templates and a draft checker", meta: "Tool · Business", href: "/tools/ai-email-assistant", date: "2026-10-07" },
  { kind: "Updated", title: "TikTok algorithm report fact checked against TikTok sources", meta: "Trend · Social media", href: "/trends/tiktok-algorithm-2026-complete-guide", date: "2026-10-07" },
  { kind: "Updated", title: "Salary Estimator rebuilt on official BLS pay data", meta: "Tool · Career", href: "/tools/salary-estimator", date: "2026-10-06" },
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
    answer: `DevelopersMatrix is a free platform with ${TOOLS_LABEL} browser tools for resumes, cover letters, interview practice, website audits, prompts, budgeting and more, plus detailed trend reports and guides. No signup required.`,
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
    answer: "It runs over 70 named checks across seven scored areas: SEO, technical setup, performance, mobile, security, accessibility and content, plus conversion tips that do not change the score. You get a score out of 100 plus a prioritized list of fixes.",
  },
  {
    question: "How does the Interview Simulator give feedback?",
    answer: "It asks real behavioral, technical and system design questions, then checks your answer against the key points a strong answer covers and tells you what you covered and what you missed. It is a practice tool, not a prediction of what a real interviewer will decide.",
  },
];
