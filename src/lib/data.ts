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
  Briefcase,
  Bot,
  Globe,
  PiggyBank,
  ListChecks,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
  badge?: "POPULAR" | "NEW";
};

export const featuredTools: Tool[] = [
  {
    name: "AI Website Audit",
    href: "/tools/website-audit",
    description:
      "Run a full health check on any website. SEO, speed, security, mobile UX and content quality scored in seconds.",
    icon: Gauge,
    badge: "POPULAR",
  },
  {
    name: "AI Resume Builder",
    href: "/tools/ai-resume-builder",
    description:
      "Create an ATS friendly resume in minutes. Built for developers, designers and every modern role.",
    icon: FileText,
    badge: "POPULAR",
  },
  {
    name: "AI Content Detector",
    href: "/tools/ai-content-detector",
    description:
      "Check whether text reads as human or machine written, with a detailed breakdown you can act on.",
    icon: ScanSearch,
    badge: "NEW",
  },
  {
    name: "Interview Simulator",
    href: "/tools/ai-interview-simulator",
    description:
      "Practice behavioral, technical and system design questions with instant AI feedback and scoring.",
    icon: MessagesSquare,
  },
];

export const moreTools: Tool[] = [
  {
    name: "Cover Letter Generator",
    href: "/tools/ai-cover-letter-generator",
    description: "Matched to the exact job posting.",
    icon: Mail,
  },
  {
    name: "Budget Planner",
    href: "/tools/budget-planner",
    description: "Track spending and savings goals.",
    icon: Wallet,
  },
  {
    name: "Can You Run It",
    href: "/tools/can-you-run-it",
    description: "Check PC game requirements.",
    icon: Gamepad2,
  },
  {
    name: "Startup Idea Generator",
    href: "/tools/startup-idea-generator",
    description: "AI generated business ideas.",
    icon: Lightbulb,
  },
  {
    name: "AI Prompt Library",
    href: "/tools/ai-prompt-library",
    description: "500+ curated prompts.",
    icon: Sparkles,
  },
  {
    name: "Link Manager and Smart Bio",
    href: "/tools/link-manager",
    description: "One link for everything you share.",
    icon: Link2,
  },
];

export type Category = {
  name: string;
  href: string;
  description: string;
  count: string;
  icon: LucideIcon;
};

export const categories: Category[] = [
  {
    name: "Career",
    href: "/tools?category=career",
    description: "Resumes, cover letters, interview practice and salary data",
    count: "4+ tools",
    icon: Briefcase,
  },
  {
    name: "AI Tools",
    href: "/tools?category=ai",
    description: "Content detection, prompts and smart writing assistants",
    count: "5+ tools",
    icon: Bot,
  },
  {
    name: "SEO and Web",
    href: "/tools/website-audit",
    description: "Website audits, health checks and link management",
    count: "3+ tools",
    icon: Globe,
  },
  {
    name: "Finance",
    href: "/tools?category=finance",
    description: "Budget planning, expense tracking and savings goals",
    count: "2+ tools",
    icon: PiggyBank,
  },
  {
    name: "Productivity",
    href: "/tools?category=productivity",
    description: "Habit tracking, planning and idea generation",
    count: "3+ tools",
    icon: ListChecks,
  },
  {
    name: "Learning",
    href: "/learn",
    description: "Micro courses and skill building resources",
    count: "50+ lessons",
    icon: GraduationCap,
  },
];

export const tickerItems = [
  { tag: "TOOL", label: "AI Website Audit", href: "/tools/website-audit" },
  { tag: "TREND", label: "AI Agents in 2026", href: "/trends" },
  { tag: "TOOL", label: "Resume Builder", href: "/tools/ai-resume-builder" },
  { tag: "GUIDE", label: "Technical Interview Prep", href: "/blog/technical-interview-prep-2026" },
  { tag: "TOOL", label: "Interview Simulator", href: "/tools/ai-interview-simulator" },
  { tag: "TREND", label: "GTA 6 · Nov 19 2026", href: "/gta-6" },
  { tag: "TOOL", label: "Budget Planner", href: "/tools/budget-planner" },
  { tag: "GUIDE", label: "Cover Letters That Convert", href: "/blog/how-to-write-cover-letter-2026" },
  { tag: "TOOL", label: "AI Content Detector", href: "/tools/ai-content-detector" },
  { tag: "LEARN", label: "System Design Basics", href: "/learn" },
];
