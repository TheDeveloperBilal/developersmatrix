// Frame rate maths for /tools/fps-calculator. Built on the same review data
// and the same blend as the bottleneck calculator (src/lib/hardware/bottleneck.ts),
// so the two tools never disagree about a PC.

import { CPU_RATES, GPU_RATES, REFERENCE_CPU_FPS, type CpuRate, type GpuRate } from './frame-rates';
import { CURRENT_CPU, CURRENT_GPU, RESOLUTIONS, allResolutions, blend, cpuByName, type Balance, type ResolutionId } from './bottleneck';

export const MONITOR_RATES = [60, 144, 165, 240] as const;
export type MonitorRate = (typeof MONITOR_RATES)[number];

export type Fit = 'holds' | 'close' | 'below';

// Frame rates are shown rounded, so every threshold test uses the rounded
// figure too. Otherwise a card shown as "60 fps" could be called under 60.

/** How a frame rate sits against the monitor: at or above it, within 20% of it, or further below. */
export function fitFor(fps: number, hz: number): Fit {
  const shown = Math.round(fps);
  if (shown >= hz) return 'holds';
  if (shown >= hz * 0.8) return 'close';
  return 'below';
}

export interface BestFit {
  /** The resolution the advice is about. */
  res: ResolutionId | null;
  /**
   * monitor: the highest resolution that keeps up with the monitor.
   * close: nothing keeps up, but the fastest resolution is within 20% of it.
   * sixty: nothing comes close, so the highest resolution at 60 fps or more.
   * none: nothing reaches 60.
   */
  reason: 'monitor' | 'close' | 'sixty' | 'none';
  /** Highest resolution at 60 fps or more, whatever the reason. */
  sixty: ResolutionId | null;
  /** Rounded fps at the fastest resolution (1080p). */
  fastest: number;
}

/**
 * Someone with a high refresh monitor wants to know which resolution gets
 * nearest to it, so that comes before the plain 60 fps answer.
 */
export function bestFit(rows: Balance[], hz: number): BestFit {
  const order = [...rows].reverse(); // 4K first
  const top = rows.reduce((a, b) => (b.expected > a.expected ? b : a));
  const fastest = Math.round(top.expected);
  const sixty = order.find((r) => Math.round(r.expected) >= 60)?.res ?? null;
  const monitor = order.find((r) => Math.round(r.expected) >= hz);
  if (monitor) return { res: monitor.res, reason: 'monitor', sixty, fastest };
  if (fitFor(top.expected, hz) === 'close') return { res: top.res, reason: 'close', sixty, fastest };
  if (sixty) return { res: sixty, reason: 'sixty', sixty, fastest };
  return { res: null, reason: 'none', sixty, fastest };
}

/* ---------------- Upgrade comparison ---------------- */

export type UpgradeKind = 'gpu' | 'cpu';

export interface UpgradeRow {
  res: ResolutionId;
  before: number;
  after: number;
  gain: number;
  /** after / before minus 1. */
  gainPct: number;
  /** The processor stops the new card from giving most of its speed here. */
  cpuCapped: boolean;
  /** What the new card could draw if nothing held it back. */
  cardAlone: number;
}

export function compareUpgrade(cpu: CpuRate, gpu: GpuRate, nextCpu: CpuRate, nextGpu: GpuRate): UpgradeRow[] {
  const before = allResolutions(cpu, gpu);
  const after = allResolutions(nextCpu, nextGpu);
  return before.map((b, i) => {
    const a = after[i];
    const cardGain = nextGpu.fps[i] / gpu.fps[i] - 1;
    const realGain = a.expected / b.expected - 1;
    return {
      res: b.res,
      before: b.expected,
      after: a.expected,
      gain: a.expected - b.expected,
      gainPct: realGain,
      // A new card that is at least 15% faster but gives back less than half of that.
      cpuCapped: nextGpu !== gpu && cardGain > 0.15 && realGain < cardGain / 2,
      cardAlone: nextGpu.fps[i],
    };
  });
}

/**
 * A sensible part to compare against first: the slowest current part that is
 * clearly faster than what the visitor has (50% faster for a card at 1440p,
 * 25% for a processor). Falls back to the fastest current part.
 */
export function suggestedUpgrade(kind: UpgradeKind, cpu: CpuRate, gpu: GpuRate): string | null {
  if (kind === 'gpu') {
    const pool = GPU_RATES.filter((g) => g.source === 'measured' && CURRENT_GPU.test(g.name)).sort((a, b) => a.fps[1] - b.fps[1]);
    const pick = pool.find((g) => g.fps[1] >= gpu.fps[1] * 1.5) ?? pool.at(-1);
    return pick && pick.name !== gpu.name ? pick.name : null;
  }
  const pool = CPU_RATES.filter((c) => c.source !== 'estimated' && CURRENT_CPU.test(c.name)).sort((a, b) => a.fps - b.fps);
  const pick = pool.find((c) => c.fps >= cpu.fps * 1.25) ?? pool.at(-1);
  return pick && pick.name !== cpu.name ? pick.name : null;
}

/* ---------------- Page tables ---------------- */

/** The processor the review data was measured with. */
export const TEST_CPU = 'AMD Ryzen 7 9800X3D';

/** Average frame rate of a card at each resolution with the review test processor, as the reviews would show it. */
export function cardWithTestCpu(gpu: GpuRate): [number, number, number] {
  const c = cpuByName(TEST_CPU).fps;
  return [blend(c, gpu.fps[0]), blend(c, gpu.fps[1]), blend(c, gpu.fps[2])];
}

/** Measured, current graphics cards, fastest first at 1440p. */
export function currentCardsByFps(): { gpu: GpuRate; fps: [number, number, number] }[] {
  return GPU_RATES.filter((g) => g.source === 'measured' && CURRENT_GPU.test(g.name))
    .map((gpu) => ({ gpu, fps: cardWithTestCpu(gpu) }))
    .sort((a, b) => b.fps[1] - a.fps[1]);
}

export { RESOLUTIONS, REFERENCE_CPU_FPS };
