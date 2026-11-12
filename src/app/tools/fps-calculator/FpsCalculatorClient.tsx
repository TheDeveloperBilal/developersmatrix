"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Link2 } from "lucide-react";
import { CPU_RATES, GPU_RATES, type CpuRate, type GpuRate } from "@/lib/hardware/frame-rates";
import { cpuByName, cpuBySlug, gpuByName, gpuBySlug, resolutionLabel, shortName, slugify } from "@/lib/hardware/bottleneck";
import {
  GAMES,
  MONITOR_RATES,
  TEST_CPU,
  bestFit,
  compareUpgrade,
  fitFor,
  fpsRows,
  gameById,
  olderRadeonRayTracing,
  suggestedUpgrade,
  type FpsRow,
  type MonitorRate,
  type UpgradeKind,
} from "@/lib/hardware/fps";
import type { GameRate } from "@/lib/hardware/game-rates";
import HardwareCombobox, { type PickerItem } from "../bottleneck-calculator/HardwareCombobox";

const DEFAULT_CPU = "AMD Ryzen 5 5600";
const DEFAULT_GPU = "NVIDIA GeForce RTX 3060";
const DEFAULT_HZ: MonitorRate = 144;

const byFps = <T,>(list: T[], at: (x: T) => number) => [...list].sort((a, b) => at(b) - at(a));
const CPU_ITEMS: PickerItem[] = byFps(CPU_RATES, (c) => c.fps);
const GPU_ITEMS: PickerItem[] = byFps(GPU_RATES, (g) => g.fps[1]);

const round = (n: number) => Math.round(n);
const pct = (n: number) => `${n >= 0 ? "+" : ""}${Math.round(n * 100)}%`;

/** Where the graphics card side of a per-game result comes from. */
function gameSourceLine(row: FpsRow, game: GameRate, cpu: CpuRate, gpu: GpuRate): string {
  const tested = `Tom's Hardware tested the ${shortName(gpu.name)} in ${game.short} at ${game.settings}`;
  if (row.source === "measured") return cpu.name === TEST_CPU ? `${tested}, with this processor. These are its measured results.` : `${tested} with a ${shortName(TEST_CPU)}; the numbers are scaled to your processor.`;
  if (row.source === "scaled") return `The ${shortName(gpu.name)} was not in Tom's Hardware's ${game.short} test, so its review average is scaled by how ${game.short} ran on the 14 cards that were (${game.settings}).`;
  return `The ${shortName(gpu.name)} has no review figure, so this is an estimate scaled by how ${game.short} ran on the cards Tom's Hardware tested.`;
}

function sourceLine(part: CpuRate | GpuRate): string {
  if (part.source === "measured") return "review benchmark";
  if (part.source === "sibling" && "from" in part && part.from) return `scaled from the ${shortName(part.from)} by boost clock`;
  return "estimate from our hardware scale, no review figure yet";
}

/* ---------------- Motion ---------------- */

const MOTION_CSS = `
.dm-osd-scan { background-image: repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0 1px, transparent 1px 3px); }
`;

/** Counts a number towards its new value, like a frame counter settling. Instant with reduced motion. */
function useTween(value: number, ms = 450) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const start = from.current;
    if (reduce || start === value || typeof requestAnimationFrame === "undefined") {
      from.current = value;
      setShown(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      const eased = 1 - (1 - k) ** 3;
      const v = start + (value - start) * eased;
      from.current = v;
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return shown;
}

/* ---------------- Pieces ---------------- */

const FIT_STYLE = {
  holds: { text: "text-emerald-300", bar: "bg-emerald-400" },
  close: { text: "text-amber-300", bar: "bg-amber-300" },
  below: { text: "text-rose-300", bar: "bg-rose-400" },
} as const;

function Readout({ row, hz }: { row: FpsRow; hz: number }) {
  const shown = useTween(row.expected);
  if (row.untested) {
    return (
      <div className="min-w-0 border-white/10 px-4 py-4 sm:px-5 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0">
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-white/50">{resolutionLabel(row.res)}</span>
        <p className="mt-3 font-mono text-2xl font-semibold text-white/40">Not tested</p>
        <p className="mt-2 text-[0.8125rem] text-white/45">Needs ray tracing hardware.</p>
      </div>
    );
  }
  const fit = fitFor(row.expected, hz);
  const style = FIT_STYLE[fit];
  const label =
    fit === "holds" ? `Holds ${hz} Hz` : fit === "close" ? `Close to ${hz} Hz` : `About ${round(row.expected)} of ${hz}`;
  return (
    <div className="min-w-0 border-white/10 px-4 py-4 sm:px-5 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-white/50">{resolutionLabel(row.res)}</span>
        <span className="font-mono text-[0.6875rem] text-white/35">{row.limit === "cpu" && row.band !== "matched" ? "CPU limited" : "GPU bound"}</span>
      </div>
      <p className="mt-1 flex items-baseline gap-2">
        <span className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-white sm:text-6xl">{round(shown)}</span>
        <span className="font-mono text-sm text-white/45">fps</span>
      </p>
      <p className="mt-1 font-mono text-[0.75rem] text-white/50">
        {row.low !== null ? (
          <>
            1% low <span className="text-white/80">{round(row.low)}</span>
            <span className="mx-1.5 text-white/20">·</span>
          </>
        ) : null}
        <span className="text-white/80">{row.frameMs.toFixed(1)}</span> ms a frame
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full transition-[width] duration-500 ${style.bar}`} style={{ width: `${Math.min(100, (row.expected / hz) * 100)}%` }} />
      </div>
      <p className={`mt-2 text-[0.8125rem] font-medium ${style.text}`}>{label}</p>
    </div>
  );
}

function Segmented<T extends string | number>({ label, name, options, value, onChange, render }: { label: string; name: string; options: readonly T[]; value: T; onChange: (v: T) => void; render: (v: T) => React.ReactNode }) {
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
            <input type="radio" className="sr-only" name={name} checked={o === value} onChange={() => onChange(o)} />
            {render(o)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/* ---------------- Main ---------------- */

export default function FpsCalculatorClient() {
  const [cpuName, setCpuName] = useState(DEFAULT_CPU);
  const [gpuName, setGpuName] = useState(DEFAULT_GPU);
  const [hz, setHz] = useState<MonitorRate>(DEFAULT_HZ);
  const [kind, setKind] = useState<UpgradeKind>("gpu");
  const [toName, setToName] = useState<string | null>(null);
  const [gameId, setGameId] = useState("");
  const [copied, setCopied] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const c = cpuBySlug(p.get("cpu"));
    const g = gpuBySlug(p.get("gpu"));
    const h = MONITOR_RATES.find((x) => String(x) === p.get("hz"));
    const k = p.get("up") === "cpu" ? "cpu" : p.get("up") === "gpu" ? "gpu" : null;
    if (c) setCpuName(c.name);
    if (g) setGpuName(g.name);
    if (h) setHz(h);
    const gm = gameById(p.get("game"));
    if (gm) setGameId(gm.id);
    if (k) {
      setKind(k);
      const to = k === "cpu" ? cpuBySlug(p.get("to")) : gpuBySlug(p.get("to"));
      if (to) setToName(to.name);
    }
    ready.current = true;
  }, []);

  const cpu = useMemo(() => cpuByName(cpuName), [cpuName]);
  const gpu = useMemo(() => gpuByName(gpuName), [gpuName]);

  // The comparison part: the visitor's pick, else a sensible suggestion.
  const target = useMemo(() => {
    const valid = toName && (kind === "gpu" ? GPU_RATES.some((g) => g.name === toName) : CPU_RATES.some((c) => c.name === toName));
    return valid ? toName : suggestedUpgrade(kind, cpu, gpu);
  }, [toName, kind, cpu, gpu]);

  useEffect(() => {
    if (!ready.current) return;
    const p = new URLSearchParams({ cpu: slugify(cpuName), gpu: slugify(gpuName), hz: String(hz), up: kind });
    if (target) p.set("to", slugify(target));
    if (gameId) p.set("game", gameId);
    window.history.replaceState(null, "", `${window.location.pathname}?${p}${window.location.hash}`);
    setCopied(false);
  }, [cpuName, gpuName, hz, kind, target, gameId]);

  const game = gameById(gameId) ?? null;
  const rows = fpsRows(cpu, gpu, game);
  const untested = rows.some((r) => r.untested);
  const fit = bestFit(rows, hz);
  // Where the numbers apply, for the sentences below.
  const where = game ? `in ${game.short} at ${game.settings}` : "on Ultra in demanding games";
  const nextCpu = kind === "cpu" && target ? cpuByName(target) : cpu;
  const nextGpu = kind === "gpu" && target ? gpuByName(target) : gpu;
  const upgrade = target ? compareUpgrade(cpu, gpu, nextCpu, nextGpu, game) : null;
  const upgradeUntested = !!game && fpsRows(nextCpu, nextGpu, game).some((r) => r.untested);
  const capped = upgrade?.filter((r) => r.cpuCapped) ?? [];
  const current = kind === "gpu" ? gpu.name : cpu.name;
  const slower = upgrade?.some((r) => r.gainPct < -0.01) ?? false;

  const fitLine = untested
    ? `Tom's Hardware tested ${game!.short} with ray tracing on, and the ${shortName(gpu.name)} has no ray tracing hardware, so there is no measured basis for a number. Pick another game or the 11 game average.`
    : fit.reason === "monitor"
      ? `Best match for this PC: ${resolutionLabel(fit.res!)} keeps up with your ${hz} Hz monitor ${where}.`
      : fit.reason === "close"
        ? `No resolution quite holds your ${hz} Hz monitor ${where}, but ${resolutionLabel(fit.res!)} comes close at about ${fit.fastest} fps.` +
          (fit.sixty && fit.sixty !== fit.res ? ` For a steady 60 fps or more, you can go up to ${resolutionLabel(fit.sixty)}.` : "")
      : fit.reason === "sixty"
        ? fit.sixty === "1080p"
          ? `Best match for this PC: 1080p, at about ${fit.fastest} fps. To get closer to ${hz} fps, lower some settings.`
          : `Best match for this PC: ${resolutionLabel(fit.res!)} for a steady 60 fps or more. For the most frames on your ${hz} Hz monitor, 1080p gives about ${fit.fastest} fps.`
        : `This PC averages under 60 fps at every resolution ${where}. Lower settings${game ? "" : " or lighter games"} will run faster.`;

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
      <style>{MOTION_CSS}</style>
      <div className="grid lg:grid-cols-[20rem_1fr]">
        {/* Inputs */}
        <div className="space-y-5 border-b border-ink-100 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-ink-400">Your PC</p>
          <HardwareCombobox label="Processor" tag="CPU" tagClass="bg-sky-100 text-sky-800" items={CPU_ITEMS} value={cpuName} onChange={setCpuName} />
          <HardwareCombobox label="Graphics card" tag="GPU" tagClass="bg-brand-100 text-brand-700" items={GPU_ITEMS} value={gpuName} onChange={setGpuName} />
          <div>
            <label htmlFor="fps-game" className="mb-1.5 block text-[0.8125rem] font-medium text-ink-700">
              Game
            </label>
            <select
              id="fps-game"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="h-12 w-full cursor-pointer rounded-xl border border-ink-200 bg-white px-3.5 text-[0.9375rem] text-ink-950 shadow-sm outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">Average of 11 games</option>
              {GAMES.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-[0.75rem] text-ink-400">
              {game ? `Tested at ${game.settings}.` : "Ultra settings, no ray tracing."} {GAMES.length} games have measured results.
            </p>
          </div>
          <Segmented label="Monitor refresh rate" name="fps-hz" options={MONITOR_RATES} value={hz} onChange={setHz} render={(o) => `${o}`} />
          <p className="-mt-3 text-[0.75rem] text-ink-400">In Hz. Most monitors are 60, 144 or 165.</p>
          <button type="button" onClick={copy} className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink-600 transition-colors hover:text-ink-950">
            {copied ? <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
            {copied ? "Link copied" : "Copy a link to this result"}
          </button>
        </div>

        {/* On screen counter */}
        <div className="min-w-0 p-3 sm:p-5">
          <div className="dm-osd-scan overflow-hidden rounded-2xl bg-ink-950 ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5 sm:px-5">
              <span className="min-w-0 truncate font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-white/50">
                {game ? `${game.short} · ${game.settings}` : "Average fps · 11 games · Ultra"}
              </span>
              <span className="shrink-0 font-mono text-[0.6875rem] text-white/50">{hz} Hz monitor</span>
            </div>
            <div className="grid md:grid-cols-3" aria-live="polite">
              {rows.map((r) => (
                <Readout key={r.res} row={r} hz={hz} />
              ))}
            </div>
          </div>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-700">{fitLine}</p>
          <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-400">
            {game ? (
              <>
                {untested ? `${game.short} was tested at ${game.settings}.` : gameSourceLine(rows[1], game, cpu, gpu)}
                {game.lowShare.gpu === null ? ` 1% lows are not shown for ${game.short}: in testing they swung too much to estimate.` : " The 1% low comes from the lows measured in this game."}
                {game.rayTracing && olderRadeonRayTracing(gpu) ? " Radeon RX 6000 and 7000 cards lose more with ray tracing than the RX 9000 cards tested, so expect a little less." : ""}{" "}
                Processor figure: {sourceLine(cpu)}.
              </>
            ) : (
              <>
                Averages for 11 demanding games at Ultra settings, without ray tracing or upscaling. The 1% low comes from the lows measured in the same games. Processor figure: {sourceLine(cpu)}. Graphics card figure: {sourceLine(gpu)}.{gpu.note ? ` ${gpu.note}` : ""}
              </>
            )}{" "}
            <a href="#how-it-works" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-700">How this works</a>
          </p>
        </div>
      </div>

      {/* Upgrade comparison */}
      <div className="border-t border-ink-100 bg-[#fbfaf7] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h3 className="font-sora text-lg font-semibold text-ink-950">How many fps would an upgrade add?</h3>
            <p className="mt-0.5 text-[0.8125rem] text-ink-500">Pick a new part and compare it with your PC at each resolution.</p>
          </div>
          <div className="w-full sm:w-72">
            <Segmented
              label="Change"
              name="fps-kind"
              options={["gpu", "cpu"] as const}
              value={kind}
              onChange={(k) => {
                setKind(k);
                setToName(null);
              }}
              render={(o) => (o === "gpu" ? "Graphics card" : "Processor")}
            />
          </div>
        </div>

        <div className="mt-4 max-w-md">
          <HardwareCombobox
            key={kind}
            label={kind === "gpu" ? "New graphics card" : "New processor"}
            tag="NEW"
            tagClass="bg-emerald-100 text-emerald-800"
            items={kind === "gpu" ? GPU_ITEMS : CPU_ITEMS}
            value={target ?? ""}
            onChange={setToName}
          />
        </div>

        {upgrade && target && (untested || upgradeUntested) ? (
          <p className="mt-4 text-[0.875rem] text-ink-500">
            {game!.short} was tested with ray tracing on, and one of these cards has no ray tracing hardware. Pick another game to compare.
          </p>
        ) : upgrade && target ? (
          <>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {upgrade.map((r) => {
                const top = Math.max(r.before, r.after, 1);
                return (
                  <div key={r.res} className="rounded-2xl border border-ink-200 bg-white p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-ink-500">{resolutionLabel(r.res)}</span>
                      <span className={`font-mono text-[0.875rem] font-semibold ${r.gainPct >= 0.1 ? "text-emerald-700" : r.gainPct > -0.01 ? "text-ink-500" : "text-rose-700"}`}>
                        {pct(r.gainPct)}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-ink-950">
                      {round(r.before)} <span className="text-ink-300">to</span> {round(r.after)}
                      <span className="ml-1 text-sm font-normal text-ink-400">fps</span>
                    </p>
                    <div className="mt-3 space-y-1.5" aria-hidden="true">
                      <div className="h-2 rounded-full bg-ink-100">
                        <div className="h-full rounded-full bg-ink-400 transition-[width] duration-500" style={{ width: `${(r.before / top) * 100}%` }} />
                      </div>
                      <div className="h-2 rounded-full bg-ink-100">
                        <div className="h-full rounded-full bg-emerald-500 transition-[width] duration-500" style={{ width: `${(r.after / top) * 100}%` }} />
                      </div>
                    </div>
                    {r.cpuCapped && (
                      <p className="mt-2 text-[0.75rem] leading-snug text-amber-800">
                        Your processor holds this card back here. On its own the card could draw about {round(r.cardAlone)} fps.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-700">
              {target === current
                ? `That is the ${kind === "gpu" ? "graphics card" : "processor"} you already have. Pick a different one to compare.`
                : slower
                  ? `The ${shortName(target)} is slower than your ${shortName(current)} in some or all of these, so your frame rate would drop.`
                : kind === "gpu"
                ? capped.length > 0
                  ? `The ${shortName(target)} is held back by your ${shortName(cpu.name)} at ${capped.map((r) => resolutionLabel(r.res)).join(" and ")}. Pair it with a faster processor to get the full gain, or play at a higher resolution.`
                  : `Swapping your ${shortName(gpu.name)} for the ${shortName(target)} lifts every resolution, and your ${shortName(cpu.name)} keeps up with it.`
                : upgrade.every((r) => r.gainPct < 0.05)
                  ? `A faster processor barely changes anything here, because your ${shortName(gpu.name)} is already the limit. A new graphics card is the better spend.`
                  : `The ${shortName(target)} helps most at ${resolutionLabel(upgrade.reduce((a, b) => (b.gainPct > a.gainPct ? b : a)).res)}, where your current processor was holding the card back.`}{" "}
              <Link
                href={`/tools/bottleneck-calculator?cpu=${slugify(nextCpu.name)}&gpu=${slugify(nextGpu.name)}&res=1440p`}
                className="font-medium text-brand-700 hover:underline"
              >
                Check the new pair for a bottleneck
              </Link>
              .
            </p>
          </>
        ) : (
          <p className="mt-4 text-[0.875rem] text-ink-500">You already have the fastest part in our list. Pick any other part to compare.</p>
        )}

        <Link href={`/tools/can-you-run-it#cpu=${slugify(cpu.name)}&gpu=${slugify(gpu.name)}`} className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700 hover:text-brand-800">
          Check this PC against a specific game <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
