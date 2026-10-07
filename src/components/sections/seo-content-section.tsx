"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Gauge, Sparkles, TrendingUp, Wallet } from "lucide-react";
import Reveal from "@/components/reveal";
import { homeFaqs } from "@/lib/home-data";

const topicClusters = [
  {
    icon: FileText,
    title: "Career Tools",
    text: "Build an ATS friendly resume with a live check on every bullet, practice interview questions with instant feedback, and write cover letters around the job posting. Every tool is free and runs in your browser.",
    links: [
      { label: "AI Resume Builder", href: "/tools/ai-resume-builder" },
      { label: "Interview Simulator", href: "/tools/ai-interview-simulator" },
      { label: "Salary Estimator", href: "/tools/salary-estimator" },
    ],
  },
  {
    icon: Gauge,
    title: "SEO & Website Tools",
    text: "Run around 150 checks across SEO, performance, security, mobile, accessibility and content. Get a prioritized fix list you can act on the same day.",
    links: [
      { label: "AI Website Audit", href: "/tools/website-audit" },
      { label: "Website Audit Services", href: "/services/website-audit" },
      { label: "AI Content Detector", href: "/tools/ai-content-detector" },
    ],
  },
  {
    icon: Wallet,
    title: "Productivity & Finance",
    text: "Plan income, spending and savings goals with the Budget Planner, keep a daily habit checklist with the Habit Tracker, and plan your week with the Productivity Planner.",
    links: [
      { label: "Budget Planner", href: "/tools/budget-planner" },
      { label: "Habit Tracker", href: "/tools/habit-tracker" },
      { label: "Productivity Planner", href: "/tools/productivity-planner" },
    ],
  },
  {
    icon: Sparkles,
    title: "AI & Automation",
    text: "Fill in ready made prompts for ChatGPT and Claude in the AI Prompt Library, check whether text reads as human or machine written, and find business ideas with first steps to test them.",
    links: [
      { label: "AI Prompt Library", href: "/tools/ai-prompt-library" },
      { label: "Startup Idea Generator", href: "/tools/startup-idea-generator" },
      { label: "AI Email Assistant", href: "/tools/ai-email-assistant" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Trends & Insights",
    text: "Read in depth trend reports on AI, careers, security and gaming, each with the date it was last updated, plus practical guides on interviews, resumes and SEO.",
    links: [
      { label: "Trend Radar", href: "/trends" },
      { label: "Blog", href: "/blog" },
      { label: "GTA 6 Hub", href: "/gta-6" },
      { label: "AI Cybersecurity Threats 2026", href: "/trends/ai-cybersecurity-threats-protection-2026" },
      { label: "Best AI Developer Tools 2026", href: "/blog/ai-tools-developers-2026" },
      { label: "Cybersecurity AI Automation 2026", href: "/blog/cybersecurity-ai-automation-2026" },
    ],
  },
];

const faqs = homeFaqs;

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
              Free AI tools that do what they say
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              DevelopersMatrix brings free browser tools, in depth trend reports and practical
              career guides together in one place. Whether you are fixing your resume, auditing a
              website or planning a budget, each tool is built to save you time, with no signup.
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
