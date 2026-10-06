import Link from "next/link";
import { ArrowRight, Gauge, Sparkles } from "lucide-react";
import ToolMatrix from "./tool-matrix";

// Numbers are rendered on the server. The old count up started at 0, so search
// engines and anyone without JavaScript saw "0+ Free AI tools".
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-sora text-2xl font-bold tracking-tight text-ink-950 sm:text-[1.7rem]">
        {value}
        <span className="text-brand-600">+</span>
      </p>
      <p className="mt-0.5 text-xs font-medium text-ink-400">{label}</p>
    </div>
  );
}

export default function HeroDiscovery({
  toolsLabel,
  guideCount,
  trendCount,
}: {
  toolsLabel: string;
  guideCount: number;
  trendCount: number;
}) {
  const toolsNumber = toolsLabel.replace(/\+$/, "");

  return (
    <section className="relative overflow-hidden bg-ink-50/50">
      <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_0%,black,transparent)]" />
      <div aria-hidden="true" className="absolute -top-40 right-0 h-96 w-[40rem] rounded-full bg-brand-100/60 blur-3xl" />

      <div className="shell relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-24 overflow-hidden">
        {/* Copy */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Free tools, trend reports and practical guides
          </div>

          <h1 className="mt-6 font-sora text-[2.6rem] font-bold leading-[1.06] tracking-tight text-ink-950 sm:text-5xl lg:text-[3.5rem]">
            {toolsLabel} Free AI Tools for{" "}
            <span className="text-brand-600">Developers, Marketers</span> & Career Builders
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-500 sm:text-lg">
            DevelopersMatrix combines {toolsLabel} free AI tools, in depth technology trend reports
            and practical career guides into one platform. Everything free, everything in your
            browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link href="/tools" className="btn-primary">
              Explore the platform <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/tools/website-audit" className="btn-secondary">
              <Gauge className="h-4 w-4 text-brand-600" />
              Run a free audit
            </Link>
          </div>

          <div className="mt-10 flex gap-8 border-t border-ink-100/40 pt-6 sm:gap-10">
            <Stat value={toolsNumber} label="Free tools" />
            <Stat value={String(guideCount)} label="Guides published" />
            <Stat value={String(trendCount)} label="Trend reports" />
          </div>
        </div>

        {/* Interactive tool matrix */}
        <div className="relative animate-fade-up [animation-delay:120ms]">
          <ToolMatrix />
        </div>
      </div>
    </section>
  );
}
