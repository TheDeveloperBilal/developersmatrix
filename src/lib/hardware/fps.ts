// Frame rate maths for /tools/fps-calculator. Built on the same review data
// and the same blend as the bottleneck calculator (src/lib/hardware/bottleneck.ts),
// so the two tools never disagree about a PC.

import { BLEND_K, CPU_RATES, GPU_RATES, REFERENCE_CPU_FPS, type CpuRate, type GpuRate } from './frame-rates';
import { CURRENT_CPU, CURRENT_GPU, RESOLUTIONS, balance, bandFor, blend, cpuByName, type Balance, type ResolutionId } from './bottleneck';
import { GAME_RATES, SUITE_LOW_SHARE, type GameRate } from './game-rates';

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

/* ---------------- Per-game frame rates ---------------- */

export type RowSource = 'measured' | 'scaled' | 'estimated';

export interface FpsRow extends Balance {
  /** Estimated 1% low, or null when the game's measured lows were too uneven to estimate from. */
  low: number | null;
  /** Milliseconds per frame at the average frame rate. */
  frameMs: number;
  /** measured: Tom's Hardware tested this card in this game. scaled: the card's
   *  review average scaled by the game's results. estimated: the card itself has
   *  no review figure. */
  source: RowSource;
  /** The game was tested with ray tracing and this card has no ray tracing hardware. */
  untested: boolean;
}

export const GAMES: GameRate[] = GAME_RATES;
export const gameById = (id: string | null | undefined): GameRate | undefined => (id ? GAME_RATES.find((g) => g.id === id) : undefined);

/** Ray tracing tests only speak for cards that have ray tracing hardware. */
export function rayTracingReady(gpu: GpuRate): boolean {
  if (gpu.integrated) return false;
  if (/RTX/.test(gpu.name)) return true;
  if (/Radeon RX (6|7|9)\d{3}/.test(gpu.name)) return true;
  return /Intel Arc/.test(gpu.name);
}

/** RX 6000 and 7000 cards lose more with ray tracing than the RX 9000 cards that were tested. */
export const olderRadeonRayTracing = (gpu: GpuRate) => /Radeon RX (6|7)\d{3}/.test(gpu.name);

const RES_I: Record<ResolutionId, 0 | 1 | 2> = { '1080p': 0, '1440p': 1, '4k': 2 };

/** The card's own frame rate behind a measured result, with the test processor taken out. */
function unblend(measured: number, ceiling: number): number | null {
  const x = measured ** -BLEND_K - ceiling ** -BLEND_K;
  if (x <= 0) return null;
  const g = x ** (-1 / BLEND_K);
  return g < measured * 3 ? g : null;
}

function withLow(b: Balance, share: number | null, source: RowSource, untested = false): FpsRow {
  return { ...b, low: share === null ? null : b.expected * share, frameMs: b.expected > 0 ? 1000 / b.expected : 0, source, untested };
}

/** The 11 game average, as the calculator has always shown it, plus 1% low and frame time. */
export function suiteRow(cpu: CpuRate, gpu: GpuRate, res: ResolutionId): FpsRow {
  const b = balance(cpu, gpu, res);
  const share = b.limit === 'cpu' && b.band !== 'matched' ? SUITE_LOW_SHARE.cpu : SUITE_LOW_SHARE.gpu;
  return withLow(b, share, gpu.source === 'measured' ? 'measured' : gpu.source === 'sibling' ? 'scaled' : 'estimated');
}

/**
 * One game at one resolution. Tested cards start from Tom's Hardware's own
 * result in that game; other cards scale their review average by how the
 * game compares with it. The processor side is the game's measured ceiling
 * scaled by your processor.
 */
export function gameRow(cpu: CpuRate, gpu: GpuRate, res: ResolutionId, game: GameRate): FpsRow {
  const i = RES_I[res];
  const factor = (game.rayTracing ? game.factor[gpu.brand] : undefined) ?? game.factor.all ?? game.factor.NVIDIA!;
  const cpuFps = (game.cpuCeiling * cpu.fps) / REFERENCE_CPU_FPS;
  if (game.rayTracing && !rayTracingReady(gpu)) {
    return { res, cpuFps, gpuFps: 0, expected: 0, limit: 'gpu', gap: 0, band: 'matched', low: null, frameMs: 0, source: 'estimated', untested: true };
  }
  const m = game.measured[gpu.name]?.[i];
  let gpuFps = factor[i] * gpu.fps[i];
  let source: RowSource = gpu.source === 'measured' ? 'scaled' : 'estimated';
  if (m) {
    source = 'measured';
    const capped = game.fpsCap !== undefined && m[0] >= game.fpsCap * 0.98;
    // A result at the game's own cap only proves the card can reach the cap,
    // so the card is treated as comfortably above it.
    const own = capped ? Math.max(gpuFps, game.fpsCap! * 2) : unblend(m[0], game.cpuCeiling);
    if (own) gpuFps = own;
  }
  let expected = blend(cpuFps, gpuFps);
  if (game.fpsCap) expected = Math.min(expected, game.fpsCap);
  const limit = cpuFps < gpuFps ? 'cpu' : 'gpu';
  const gap = 1 - Math.min(cpuFps, gpuFps) / Math.max(cpuFps, gpuFps);
  const b: Balance = { res, cpuFps, gpuFps, expected, limit, gap, band: bandFor(gap) };
  if (game.lowShare.gpu === null) return withLow(b, null, source);
  const share = m ? m[1] / m[0] : limit === 'cpu' && b.band !== 'matched' ? game.lowShare.cpu ?? game.lowShare.gpu : game.lowShare.gpu;
  return withLow(b, share, source);
}

/** All three resolutions, for one game or (no game) the 11 game average. */
export function fpsRows(cpu: CpuRate, gpu: GpuRate, game?: GameRate | null): FpsRow[] {
  return RESOLUTIONS.map((r) => (game ? gameRow(cpu, gpu, r.id, game) : suiteRow(cpu, gpu, r.id)));
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

export function compareUpgrade(cpu: CpuRate, gpu: GpuRate, nextCpu: CpuRate, nextGpu: GpuRate, game?: GameRate | null): UpgradeRow[] {
  const before = fpsRows(cpu, gpu, game);
  const after = fpsRows(nextCpu, nextGpu, game);
  return before.map((b, i) => {
    const a = after[i];
    const cardGain = b.gpuFps > 0 ? a.gpuFps / b.gpuFps - 1 : 0;
    const realGain = b.expected > 0 ? a.expected / b.expected - 1 : 0;
    return {
      res: b.res,
      before: b.expected,
      after: a.expected,
      gain: a.expected - b.expected,
      gainPct: realGain,
      // A new card that is at least 15% faster but gives back less than half of that.
      cpuCapped: nextGpu !== gpu && cardGain > 0.15 && realGain < cardGain / 2,
      cardAlone: a.gpuFps,
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
