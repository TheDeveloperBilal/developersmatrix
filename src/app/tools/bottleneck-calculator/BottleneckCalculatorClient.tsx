"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { CPU_RATES, GPU_RATES, type CpuRate, type GpuRate } from "@/lib/hardware/frame-rates";
import {
  BAND_LABEL,
  DEFAULT_CPU,
  DEFAULT_GPU,
  REFRESH_RATES,
  RESOLUTIONS,
  advice,
  allResolutions,
  balance,
  cpuByName,
  cpuBySlug,
  gpuByName,
  gpuBySlug,
  resolutionLabel,
  shortName,
  slugify,
  type Balance,
  type RefreshRate,
  type ResolutionId,
} from "@/lib/hardware/bottleneck";
import HardwareCombobox, { type PickerItem } from "./HardwareCombobox";

const DEFAULT_RES: ResolutionId = "1080p";
const DEFAULT_TARGET: RefreshRate = 144;

const byFps = <T extends { fps: number | number[] }>(list: T[], at: (x: T) => number) => [...list].sort((a, b) => at(b) - at(a));
const CPU_ITEMS: PickerItem[] = byFps(CPU_RATES, (c) => c.fps);
const GPU_ITEMS: PickerItem[] = byFps(GPU_RATES, (g) => g.fps[1]);

const round = (n: number) => Math.round(n);
const pct = (n: number) => `${Math.round(n * 100)}%`;
const joinOr = (names: string[]) => names.map(shortName).join(" or ");

/** Where a figure comes from, in plain words. */
function sourceLine(part: CpuRate | GpuRate): string {
  if (part.source === "measured") return "review benchmark";
  if (part.source === "sibling" && "from" in part && part.from) return `scaled from the ${shortName(part.from)} by boost clock`;
  return "estimate from our hardware scale, no review figure yet";
}

function verdict(b: Balance, cpu: CpuRate, gpu: GpuRate) {
  const res = resolutionLabel(b.res);
  if (b.band === "matched") {
    return {
      title: `Well matched at ${res}`,
      chip: "Balanced",
      chipClass: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      body: `Neither part waits long for the other. Your ${shortName(cpu.name)} can prepare about ${round(b.cpuFps)} frames a second and your ${shortName(gpu.name)} can draw about ${round(b.gpuFps)} at ${res}.`,
    };
  }
  if (b.limit === "cpu") {
    return {
      title: `Your processor holds the card back at ${res}`,
      chip: `CPU bottleneck ${pct(b.gap)}, ${BAND_LABEL[b.band].toLowerCase()}`,
      chipClass:
        b.band === "slight" ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-rose-50 text-rose-700 ring-rose-200",
      body: `Your ${shortName(gpu.name)} could draw about ${round(b.gpuFps)} frames a second here, but your ${shortName(cpu.name)} can only prepare about ${round(b.cpuFps)}. Roughly ${pct(b.gap)} of the card's speed goes unused at ${res}.`,
    };
  }
  const headroom = b.cpuFps / b.gpuFps - 1;
  const room =
    headroom < 1
      ? `so it would keep up with a card around ${pct(headroom)} faster than your ${shortName(gpu.name)}`
      : `more than twice what your ${shortName(gpu.name)} draws, so at ${res} the card does nearly all the work`;
  return {
    title: `Your graphics card sets the pace at ${res}`,
    chip: "GPU bound, which is normal",
    chipClass: "bg-brand-50 text-brand-700 ring-brand-200",
    body: `This is the usual result for a gaming PC. Your ${shortName(cpu.name)} could prepare about ${round(b.cpuFps)} frames a second, ${room}.`,
  };
}

/** A tidy top for the scale: a multiple of 30 up to 180, then of 60. */
function scaleTop(n: number) {
  const step = n <= 180 ? 30 : 60;
  return Math.max(60, Math.ceil((n * 1.08) / step) * step);
}

// Strong colour for the part that sets the pace, a pale tint of the same hue
// for the other one, so the limit reads at a glance. Text on every bar passes
// WCAG AA: white on the dark bars, ink on the pale ones.
const LANE_TONE = {
  cpu: { strong: "bg-sky-700", soft: "bg-sky-100 ring-1 ring-inset ring-sky-200" },
  gpu: { strong: "bg-brand-600", soft: "bg-brand-100 ring-1 ring-inset ring-brand-200" },
  result: { strong: "bg-ink-900", soft: "bg-ink-900" },
} as const;

/** Motion for the pipeline: a slow light sweep across the part doing the work. */
const MOTION_CSS = `
@keyframes dm-sheen { 0% { transform: translateX(-120%); } 60%, 100% { transform: translateX(420%); } }
.dm-sheen { animation: dm-sheen 3.2s cubic-bezier(0.45, 0, 0.25, 1) infinite; }
@media (prefers-reduced-motion: reduce) { .dm-sheen { animation: none; opacity: 0; } }
`;

function Lane({ label, sub, value, top, tone, strong, valueLabel }: { label: string; sub: string; value: number; top: number; tone: keyof typeof LANE_TONE; strong: boolean; valueLabel: string }) {
  const w = Math.min(100, (value / top) * 100);
  const inside = w > 62;
  const dark = strong || tone === "result";
  return (
    <div className="grid grid-cols-[5.75rem_1fr] items-center gap-3 sm:grid-cols-[7.5rem_1fr]">
      <div className="min-w-0">
        <p className="text-[0.8125rem] font-medium text-ink-900">{label}</p>
        <p className="hidden truncate text-[0.6875rem] text-ink-400 sm:block">{sub}</p>
      </div>
      <div className="relative h-10 rounded-lg bg-ink-50 ring-1 ring-inset ring-ink-100">
        <div
          className={`relative z-10 h-full overflow-hidden rounded-lg transition-[width,background-color] duration-500 ease-out ${dark ? LANE_TONE[tone].strong : LANE_TONE[tone].soft}`}
          style={{ width: `${w}%` }}
        >
          {strong && tone !== "result" && (
            <span className="dm-sheen absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          )}
        </div>
        <span
          className={`absolute top-1/2 z-20 -translate-y-1/2 whitespace-nowrap font-mono text-[0.8125rem] font-semibold tabular-nums ${
            inside ? `pr-2.5 ${dark ? "text-white" : "text-ink-900"}` : "ml-1.5 rounded bg-ink-50 px-1 text-ink-800"
          }`}
          style={inside ? { right: `${100 - w}%` } : { left: `${w}%` }}
        >
          {valueLabel}
        </span>
      </div>
    </div>
  );
}

function Pipeline({ b, target }: { b: Balance; target: number }) {
  const top = scaleTop(Math.max(b.cpuFps, b.gpuFps, target));
  const step = top <= 180 ? 30 : 60;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const targetLeft = (target / top) * 100;
  return (
    <div aria-hidden="true" className="mt-6">
      <style>{MOTION_CSS}</style>
      <div className="relative">
        <div className="space-y-2.5">
          <Lane label="Processor" sub="frames it can prepare" value={b.cpuFps} top={top} valueLabel={`${round(b.cpuFps)} fps`} tone="cpu" strong={b.limit === "cpu"} />
          <Lane label="Graphics card" sub="frames it can draw" value={b.gpuFps} top={top} valueLabel={`${round(b.gpuFps)} fps`} tone="gpu" strong={b.limit === "gpu"} />
          <Lane label="You get" sub="both working together" value={b.expected} top={top} valueLabel={`about ${round(b.expected)} fps`} tone="result" strong={false} />
        </div>
        {/* Monitor target: over the empty track, under the bars and labels */}
        <div className="pointer-events-none absolute z-[5] inset-y-0 left-[calc(5.75rem+0.75rem)] right-0 sm:left-[calc(7.5rem+0.75rem)]">
          <div className="absolute -top-5 bottom-0 border-l-2 border-dashed border-emerald-500/80" style={{ left: `${targetLeft}%` }}>
            <span className="absolute -top-0.5 left-1.5 whitespace-nowrap text-[0.6875rem] font-medium text-emerald-700">{target} Hz</span>
          </div>
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-[5.75rem_1fr] gap-3 sm:grid-cols-[7.5rem_1fr]">
        <span />
        <div className="relative h-4 text-[0.625rem] text-ink-400">
          {ticks.map((t) => (
            <span key={t} className="absolute -translate-x-1/2 font-mono tabular-nums first:translate-x-0 last:-translate-x-full" style={{ left: `${(t / top) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Segmented<T extends string | number>({ label, options, value, onChange, render }: { label: string; options: readonly T[]; value: T; onChange: (v: T) => void; render: (v: T) => React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-[0.8125rem] font-medium text-ink-700">{label}</legend>
      <div className="grid rounded-xl bg-ink-100/80 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => (
          <label
            key={String(o)}
            className={`cursor-pointer rounded-lg px-2 py-2 text-center text-[0.8125rem] font-medium transition-colors focus-within:ring-2 focus-within:ring-ink-300 ${
              o === value ? "bg-white text-ink-950 shadow-sm" : "text-ink-500 hover:text-ink-900"
            }`}
          >
            <input type="radio" className="sr-only" name={label} checked={o === value} onChange={() => onChange(o)} />
            {render(o)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function BottleneckCalculatorClient() {
  const [cpuName, setCpuName] = useState(DEFAULT_CPU);
  const [gpuName, setGpuName] = useState(DEFAULT_GPU);
  const [res, setRes] = useState<ResolutionId>(DEFAULT_RES);
  const [target, setTarget] = useState<RefreshRate>(DEFAULT_TARGET);
  const [copied, setCopied] = useState(false);
  const ready = useRef(false);

  // Read a shared link once, then keep the address bar in step so any result
  // can be copied and sent.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = cpuBySlug(p.get("cpu"));
    const g = gpuBySlug(p.get("gpu"));
    const r = RESOLUTIONS.find((x) => x.id === p.get("res"))?.id;
    const t = REFRESH_RATES.find((x) => String(x) === p.get("hz"));
    if (c) setCpuName(c.name);
    if (g) setGpuName(g.name);
    if (r) setRes(r);
    if (t) setTarget(t);
    ready.current = true;
  }, []);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams({ cpu: slugify(cpuName), gpu: slugify(gpuName), res, hz: String(target) });
    window.history.replaceState(null, "", `${window.location.pathname}?${p}${window.location.hash}`);
    setCopied(false);
  }, [cpuName, gpuName, res, target]);

  const cpu = useMemo(() => cpuByName(cpuName), [cpuName]);
  const gpu = useMemo(() => gpuByName(gpuName), [gpuName]);
  const b = balance(cpu, gpu, res);
  const all = allResolutions(cpu, gpu);
  const v = verdict(b, cpu, gpu);
  const help = advice(cpu, gpu, res, target);
  const resLabel = resolutionLabel(res);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
      <div className="grid lg:grid-cols-[21rem_1fr]">
        {/* Inputs */}
        <div className="space-y-5 border-b border-ink-100 bg-[#fbfaf7] p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">Your build</p>
          <HardwareCombobox label="Processor" tag="CPU" tagClass="bg-sky-100 text-sky-800" items={CPU_ITEMS} value={cpuName} onChange={setCpuName} />
          <HardwareCombobox label="Graphics card" tag="GPU" tagClass="bg-brand-100 text-brand-700" items={GPU_ITEMS} value={gpuName} onChange={setGpuName} />
          <Segmented label="Resolution" options={RESOLUTIONS.map((r) => r.id)} value={res} onChange={setRes} render={(o) => resolutionLabel(o)} />
          <Segmented label="Monitor refresh rate" options={REFRESH_RATES} value={target} onChange={setTarget} render={(o) => `${o} Hz`} />
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-ink-950"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Link copied" : "Copy a link to this result"}
          </button>
        </div>

        {/* Result */}
        <div className="min-w-0 p-5 sm:p-7">
          <div aria-live="polite">
            <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.75rem] font-medium ring-1 ring-inset ${v.chipClass}`}>{v.chip}</span>
            <h3 className="mt-3 font-sora text-2xl font-semibold tracking-tight text-ink-950 sm:text-[1.65rem]">{v.title}</h3>
            <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-600">{v.body}</p>
            <p className="sr-only">
              Processor {round(b.cpuFps)} frames a second, graphics card {round(b.gpuFps)}, together about {round(b.expected)} at {resLabel}.
            </p>
          </div>

          <Pipeline b={b} target={target} />

          {/* Other resolutions */}
          <div className="mt-7">
            <p className="text-[0.75rem] font-medium text-ink-500">Same pair at each resolution</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {all.map((x) => (
                <button
                  key={x.res}
                  type="button"
                  onClick={() => setRes(x.res)}
                  aria-pressed={x.res === res}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                    x.res === res ? "border-ink-900 bg-ink-950 text-white" : "border-ink-200 bg-white text-ink-900 hover:border-ink-400"
                  }`}
                >
                  <span className={`block text-[0.6875rem] ${x.res === res ? "text-ink-300" : "text-ink-400"}`}>{resolutionLabel(x.res)}</span>
                  <span className="block font-mono text-lg font-semibold tabular-nums">{round(x.expected)} fps</span>
                  <span className={`block text-[0.6875rem] ${x.res === res ? "text-ink-300" : "text-ink-500"}`}>
                    {x.band === "matched" ? "Balanced" : x.limit === "cpu" ? `CPU limit ${pct(x.gap)}` : "GPU bound"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Advice */}
          <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/60 p-4 sm:p-5">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">What would help</p>
            <ul className="mt-2.5 space-y-2.5 text-[0.875rem] leading-relaxed text-ink-700">
              {help.cpuMatch.length > 0 && (
                <li>
                  A faster processor would free the card at {resLabel}. The {joinOr(help.cpuMatch)} would keep up with it. Check your motherboard socket first, because a newer processor family often needs a new board.
                </li>
              )}
              <li>
                {help.target.reached
                  ? `This pair should average ${target} fps or more at ${resLabel} on Ultra in demanding games, so it suits a ${target} Hz monitor.`
                  : help.target.cpuShort
                    ? `Your ${shortName(cpu.name)} tops out near ${round(cpu.fps)} fps in these games, so averaging ${target} fps at Ultra needs a faster processor before a faster card.`
                    : help.target.gpuNames.length > 0
                      ? `To average ${target} fps at ${resLabel} on Ultra, the card needs to draw about ${round(help.target.gpuNeeded ?? 0)} fps on its own. The ${joinOr(help.target.gpuNames)} would get there with your processor.`
                      : `No current card gets this pair to an average of ${target} fps at ${resLabel} on Ultra in these games. Lower settings or lighter games will.`}
              </li>
              <li>Lowering graphics settings mostly lifts the graphics card number. The processor number barely moves.</li>
            </ul>
          </div>

          <p className="mt-4 text-[0.75rem] leading-relaxed text-ink-400">
            Averages for 11 demanding games at Ultra settings, without ray tracing or upscaling. Processor figure: {sourceLine(cpu)}. Graphics card figure: {sourceLine(gpu)}.{gpu.note ? ` ${gpu.note}` : ""}{" "}
            <a href="#how-it-works" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-700">How this works</a>
          </p>

          <Link
            href={`/tools/can-you-run-it#cpu=${slugify(cpu.name)}&gpu=${slugify(gpu.name)}`}
            className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700 hover:text-brand-800"
          >
            Check this PC against a specific game <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
