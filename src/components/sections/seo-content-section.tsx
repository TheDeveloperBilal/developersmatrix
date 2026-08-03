"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Gauge, Sparkles, TrendingUp, Wallet } from "lucide-react";
import Reveal from "@/components/reveal";

const topicClusters = [
  {
    icon: FileText,
    title: "Career Tools",
    text: "Build an ATS-friendly resume with our AI Resume Builder, practice interviews with the Interview Simulator, and generate cover letters matched to any job posting. Every tool is free and runs in your browser.",
    links: [
      { label: "AI Resume Builder", href: "/tools/ai-resume-builder" },
      { label: "Interview Simulator", href: "/tools/ai-interview-simulator" },
      { label: "Salary Estimator", href: "/tools/salary-estimator" },
    ],
  },
  {
    icon: Gauge,
    title: "SEO & Website Tools",
    text: "Run a full website health check covering SEO, performance, security, mobile UX, and content quality. Get a prioritized fix list you can act on the same day. Over 3,400 sites audited.",
    links: [
      { label: "AI Website Audit", href: "/tools/website-audit" },
      { label: "AI Content Detector", href: "/tools/ai-content-detector" },
      { label: "Link Manager", href: "/tools/link-manager" },
    ],
  },
  {
    icon: Wallet,
    title: "Productivity & Finance",
    text: "Track income, spending, and savings goals with the Budget Planner. Build habits that stick with the Habit Tracker, and plan focused weeks with the Productivity Planner.",
    links: [
      { label: "Budget Planner", href: "/tools/budget-planner" },
      { label: "Habit Tracker", href: "/tools/habit-tracker" },
      { label: "Productivity Planner", href: "/tools/productivity-planner" },
    ],
  },
  {
    icon: Sparkles,
    title: "AI & Automation",
    text: "Browse 500+ curated prompts in the AI Prompt Library, verify human vs machine-written text with the AI Content Detector, and discover business ideas with market angles.",
    links: [
      { label: "AI Prompt Library", href: "/tools/ai-prompt-library" },
      { label: "Startup Idea Generator", href: "/tools/startup-idea-generator" },
      { label: "AI Email Assistant", href: "/tools/ai-email-assistant" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Trends & Insights",
    text: "Stay ahead with daily trend radar covering AI, careers, SEO, and gaming. Read original guides on technical interview prep, resume optimization, and the latest technology shifts.",
    links: [
      { label: "Trend Radar", href: "/trends" },
      { label: "Blog", href: "/blog" },
      { label: "GTA 6 Hub", href: "/gta-6" },
      { label: "AI Cybersecurity Threats 2026", href: "/trends/ai-cybersecurity-threats-protection-2026" },
    ],
  },
];

const faqs = [
  {
    question: "What is DevelopersMatrix?",
    answer: "DevelopersMatrix is a free platform with 20+ AI-powered tools for resume building, website auditing, budget planning, interview preparation, and more. No signup required.",
  },
  {
    question: "Are the AI tools on DevelopersMatrix really free?",
    answer: "Yes. All core tools are free to use with no credit card required. The platform is supported by advertising to keep tools accessible to everyone.",
  },
  {
    question: "How does the AI Resume Builder work?",
    answer: "Enter your details section by section. The AI helps write bullet points, optimize for ATS scanners, and format your resume in a professional layout. Over 8,900 resumes have been created.",
  },
  {
    question: "What does the Website Audit Tool check?",
    answer: "It analyzes six dimensions: SEO, performance, security, mobile UX, accessibility, and content quality. You get a score out of 100 plus a prioritized list of fixes.",
  },
  {
    question: "Is the Interview Simulator accurate?",
    answer: "The simulator covers behavioral, technical, and system design questions. Answers are scored on relevance, quality, and depth using an AI evaluation engine calibrated against real interview standards.",
  },
];

export default function SeoContentSection() {
  return (
    <section className="bg-ink-50/40 py-16 lg:py-20" aria-labelledby="seo-content-heading">
      <div className="shell">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-ink-300" />
              Why developers and professionals choose us
            </p>
            <h2
              id="seo-content-heading"
              className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
            >
              Free AI tools that actually get results
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              DevelopersMatrix combines AI-powered utilities, real-time trend tracking, and
              practical career guides into one free platform. Whether you are optimizing your
              resume, auditing a website, or tracking spending, every tool is designed to save
              time and deliver measurable outcomes.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topicClusters.map((cluster) => (
            <Reveal key={cluster.title}>
              <div className="card h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <cluster.icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <h3 className="mt-4 font-sora text-lg font-bold text-ink-950">
                  {cluster.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{cluster.text}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cluster.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center gap-1 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FAQ for SEO + GEO */}
        <div className="mt-16">
          <Reveal>
            <h3 className="text-center font-sora text-2xl font-bold text-ink-950">
              Frequently asked questions
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq) => (
              <Reveal key={faq.question}>
                <div className="card h-full p-6">
                  <h4 className="font-sora text-sm font-bold text-ink-950">{faq.question}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{faq.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
