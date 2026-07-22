import Link from "next/link";
import {
  FileText,
  Mail,
  MessagesSquare,
  Gauge,
  ScanSearch,
  BookOpen,
  ArrowRight,
  Layers,
} from "lucide-react";
import Reveal from "@/components/reveal";

const stacks = [
  {
    title: "Build your career",
    outcome: "Land the offer",
    href: "/tools?category=career",
    steps: [
      { name: "Resume Builder", href: "/tools/ai-resume-builder", icon: FileText },
      { name: "Cover Letter Generator", href: "/tools/ai-cover-letter-generator", icon: Mail },
      { name: "Interview Simulator", href: "/tools/ai-interview-simulator", icon: MessagesSquare },
    ],
  },
  {
    title: "Grow your website",
    outcome: "Earn more traffic",
    href: "/tools/website-audit",
    steps: [
      { name: "Website Audit", href: "/tools/website-audit", icon: Gauge },
      { name: "AI Content Detector", href: "/tools/ai-content-detector", icon: ScanSearch },
      { name: "SEO Guides", href: "/blog", icon: BookOpen },
    ],
  },
];

function Connector() {
  return (
    <div className="relative flex items-center justify-center py-1 lg:h-full lg:w-14 lg:py-0" aria-hidden="true">
      {/* vertical on mobile, horizontal on desktop */}
      <svg className="h-8 w-8 lg:h-10 lg:w-14" viewBox="0 0 56 40" fill="none">
        <path
          d="M4 20 H52"
          stroke="#c3b2fd"
          strokeWidth="2"
          strokeDasharray="5 6"
          strokeLinecap="round"
          className="hidden lg:block [animation:dashmove_1.2s_linear_infinite]"
        />
        <path
          d="M28 2 V38"
          stroke="#c3b2fd"
          strokeWidth="2"
          strokeDasharray="5 6"
          strokeLinecap="round"
          className="lg:hidden [animation:dashmove_1.2s_linear_infinite]"
        />
        <path d="M46 14 L54 20 L46 26" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="hidden lg:block" />
        <path d="M22 32 L28 40 L34 32" stroke="#8b5cf6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lg:hidden" />
      </svg>
    </div>
  );
}

export default function ToolStack() {
  return (
    <section className="py-16 overflow-hidden lg:py-20" aria-labelledby="stack-heading">
      <div className="shell">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">
            <Layers className="h-3.5 w-3.5 text-brand-600" /> Tool stacks
          </p>
          <h2
            id="stack-heading"
            className="mt-4 font-sora text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl"
          >
            Tools that work better together
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Each tool is useful alone. Chained into a stack, they carry you from start to finish.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {stacks.map((stack, si) => (
            <Reveal key={stack.title} delay={si * 100}>
              <div className="card group h-full p-7 sm:p-8">
                <div className="flex items-center justify-between">
                  <h3 className="font-sora text-lg font-bold text-ink-950">{stack.title}</h3>
                  <span className="chip bg-brand-50 text-brand-700">
                    {stack.outcome}
                  </span>
                </div>

                <div className="mt-6 flex flex-col items-stretch lg:flex-row lg:items-center">
                  {stack.steps.map((step, i) => (
                    <div key={step.name} className="contents">
                      <Link
                        href={step.href}
                        className="flex flex-1 items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-card lg:flex-col lg:items-center lg:gap-2.5 lg:p-5 lg:text-center"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                          <step.icon className="h-5 w-5" strokeWidth={1.8} />
                        </span>
                        <span className="text-sm font-semibold leading-snug text-ink-900">
                          {step.name}
                        </span>
                      </Link>
                      {i < stack.steps.length - 1 && <Connector />}
                    </div>
                  ))}
                </div>

                <Link
                  href={stack.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
                >
                  Start this stack
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
