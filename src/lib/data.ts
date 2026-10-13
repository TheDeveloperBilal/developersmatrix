import {
  Briefcase,
  Bot,
  Globe,
  PiggyBank,
  ListChecks,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { TOOL_ICONS } from "@/lib/tool-icons";

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
    icon: TOOL_ICONS["website-audit"],
    badge: "POPULAR",
  },
  {
    name: "AI Resume Builder",
    href: "/tools/ai-resume-builder",
    description:
      "Create an ATS friendly resume in minutes. Built for developers, designers and every modern role.",
    icon: TOOL_ICONS["ai-resume-builder"],
    badge: "POPULAR",
  },
  {
    name: "AI Content Detector",
    href: "/tools/ai-content-detector",
    description:
      "Check whether text reads as human or machine written, with a detailed breakdown you can act on.",
    icon: TOOL_ICONS["ai-content-detector"],
    badge: "NEW",
  },
  {
    name: "Interview Simulator",
    href: "/tools/ai-interview-simulator",
    description:
      "Practice behavioral, technical and system design questions with instant scored feedback.",
    icon: TOOL_ICONS["ai-interview-simulator"],
  },
];

export const moreTools: Tool[] = [
  {
    name: "Cover Letter Generator",
    href: "/tools/ai-cover-letter-generator",
    description: "Matched to the exact job posting.",
    icon: TOOL_ICONS["ai-cover-letter-generator"],
  },
  {
    name: "Budget Planner",
    href: "/tools/budget-planner",
    description: "Monthly budget with savings goals.",
    icon: TOOL_ICONS["budget-planner"],
  },
  {
    name: "Can You Run It",
    href: "/tools/can-you-run-it",
    description: "Check PC game requirements.",
    icon: TOOL_ICONS["can-you-run-it"],
  },
  {
    name: "Startup Idea Generator",
    href: "/tools/startup-idea-generator",
    description: "Business ideas matched to your skills.",
    icon: TOOL_ICONS["startup-idea-generator"],
  },
  {
    name: "AI Prompt Library",
    href: "/tools/ai-prompt-library",
    description: "64 ready to use AI prompts.",
    icon: TOOL_ICONS["ai-prompt-library"],
  },
  {
    name: "Habit Tracker",
    href: "/tools/habit-tracker",
    description: "Daily habits with real streaks.",
    icon: TOOL_ICONS["habit-tracker"],
  },
  {
    name: "Productivity Planner",
    href: "/tools/productivity-planner",
    description: "Turn tasks into a timed day plan.",
    icon: TOOL_ICONS["productivity-planner"],
  },
  {
    name: "Salary Estimator",
    href: "/tools/salary-estimator",
    description: "Official pay ranges by job and location.",
    icon: TOOL_ICONS["salary-estimator"],
  },
  {
    name: "AI Email Assistant",
    href: "/tools/ai-email-assistant",
    description: "Email templates and a draft checker.",
    icon: TOOL_ICONS["ai-email-assistant"],
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
    href: "/tools#career",
    description: "Resumes, cover letters, interview practice and salary data",
    count: "4 tools",
    icon: Briefcase,
  },
  {
    name: "AI and Writing",
    href: "/tools#ai",
    description: "Ready prompts and email writing help",
    count: "2 tools",
    icon: Bot,
  },
  {
    name: "SEO and Web",
    href: "/tools#seo",
    description: "Website audits and AI content detection",
    count: "2 tools",
    icon: Globe,
  },
  {
    name: "Productivity",
    href: "/tools#productivity",
    description: "Habit tracking, day planning and business ideas",
    count: "3 tools",
    icon: ListChecks,
  },
  {
    name: "Finance and Gaming",
    href: "/tools#finance",
    description: "Budget planning and PC game requirement checks",
    count: "2 tools",
    icon: PiggyBank,
  },
  {
    name: "Learning",
    href: "/learn",
    description: "Short lessons on core developer topics",
    count: "7 lessons",
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
