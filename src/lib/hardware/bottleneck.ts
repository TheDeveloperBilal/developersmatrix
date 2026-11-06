// Bottleneck maths for /tools/bottleneck-calculator.
//
// A processor can prepare a certain number of frames a second and a graphics
// card can draw a certain number. The game runs at roughly the lower of the
// two. Because the figures are averages over many games, the slower part does
// not cut in like a hard wall, so the two are blended (BLEND_K, fitted to the
// reviews in scripts/bottleneck/build-frame-rates.py).
//
// The "gap" is how much of the faster part goes unused: 1 minus slower/faster.

import { BLEND_K, CPU_RATES, GPU_RATES, type CpuRate, type GpuRate } from './frame-rates';

export const RESOLUTIONS = [
  { id: '1080p', label: '1080p', pixels: '1920 x 1080' },
  { id: '1440p', label: '1440p', pixels: '2560 x 1440' },
  { id: '4k', label: '4K', pixels: '3840 x 2160' },
] as const;

export type ResolutionId = (typeof RESOLUTIONS)[number]['id'];

export const REFRESH_RATES = [60, 144, 240] as const;
export type RefreshRate = (typeof REFRESH_RATES)[number];

/** The pair the calculator opens with. The page copy quotes its numbers. */
export const DEFAULT_CPU = 'AMD Ryzen 5 5600';
export const DEFAULT_GPU = 'NVIDIA GeForce RTX 5070';

const RES_INDEX: Record<ResolutionId, 0 | 1 | 2> = { '1080p': 0, '1440p': 1, '4k': 2 };

export function resolutionLabel(res: ResolutionId): string {
  return RESOLUTIONS.find((r) => r.id === res)?.label ?? res;
}

export function blend(a: number, b: number): number {
  return (a ** -BLEND_K + b ** -BLEND_K) ** (-1 / BLEND_K);
}

export type Band = 'matched' | 'slight' | 'noticeable' | 'large';

export const BAND_LABEL: Record<Band, string> = {
  matched: 'Well matched',
  slight: 'Slight gap',
  noticeable: 'Noticeable gap',
  large: 'Large gap',
};

export function bandFor(gap: number): Band {
  if (gap < 0.1) return 'matched';
  if (gap < 0.2) return 'slight';
  if (gap < 0.35) return 'noticeable';
  return 'large';
}

export interface Balance {
  res: ResolutionId;
  cpuFps: number;
  gpuFps: number;
  /** What the game should run at with both parts working together. */
  expected: number;
  /** The slower part. */
  limit: 'cpu' | 'gpu';
  /** Share of the faster part that goes unused, 0 to 1. */
  gap: number;
  band: Band;
}

export function balance(cpu: CpuRate, gpu: GpuRate, res: ResolutionId): Balance {
  const cpuFps = cpu.fps;
  const gpuFps = gpu.fps[RES_INDEX[res]];
  const limit = cpuFps < gpuFps ? 'cpu' : 'gpu';
  const gap = 1 - Math.min(cpuFps, gpuFps) / Math.max(cpuFps, gpuFps);
  return { res, cpuFps, gpuFps, expected: blend(cpuFps, gpuFps), limit, gap, band: bandFor(gap) };
}

export function allResolutions(cpu: CpuRate, gpu: GpuRate): Balance[] {
  return RESOLUTIONS.map((r) => balance(cpu, gpu, r.id));
}

/* ---------------- Lookup ---------------- */

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const CPU_BY_SLUG = new Map(CPU_RATES.map((c) => [slugify(c.name), c]));
const GPU_BY_SLUG = new Map(GPU_RATES.map((g) => [slugify(g.name), g]));

export function cpuBySlug(slug: string | null | undefined): CpuRate | undefined {
  return slug ? CPU_BY_SLUG.get(slug) : undefined;
}

export function gpuBySlug(slug: string | null | undefined): GpuRate | undefined {
  return slug ? GPU_BY_SLUG.get(slug) : undefined;
}

export function cpuByName(name: string): CpuRate {
  const c = CPU_RATES.find((x) => x.name === name);
  if (!c) throw new Error(`Unknown processor: ${name}`);
  return c;
}

export function gpuByName(name: string): GpuRate {
  const g = GPU_RATES.find((x) => x.name === name);
  if (!g) throw new Error(`Unknown graphics card: ${name}`);
  return g;
}

/** "NVIDIA GeForce RTX 4060" reads as "RTX 4060" in sentences. */
export function shortName(name: string): string {
  return name.replace(/^NVIDIA GeForce /, '').replace(/^AMD Radeon /, 'Radeon ').replace(/^Intel Core /, 'Core ').replace(/^AMD /, '');
}

/* ---------------- Upgrade suggestions ---------------- */

// Only parts still sold new are suggested, so the advice is something a
// person can act on. Older parts can still be checked, just not recommended.
const CURRENT_CPU = /Ryzen \d (5\d{3}X3D|7\d{3}|9\d{3})|Core i[3579]-1[234]\d{3}|Core Ultra/;
const CURRENT_GPU = /RTX 50\d0|RTX 40\d0|RX 9\d{3}|RX 7\d{3}|Arc B\d{3}/;

export interface Advice {
  /** Current processors that would keep up with this card at this resolution. */
  cpuMatch: string[];
  target: {
    fps: number;
    /** The pair already averages at least the target. */
    reached: boolean;
    /** The processor itself tops out below the target, so no card fixes it. */
    cpuShort: boolean;
    /** Frames the card would need to draw for the pair to reach the target. */
    gpuNeeded: number | null;
    /** Current cards that draw that many at this resolution. Empty when none do,
     *  which means the processor sits too close to the target. */
    gpuNames: string[];
  };
}

function cheapestPerBrand<T extends { brand: string; name: string }>(list: T[], brands: readonly string[], value: (x: T) => number, need: number): string[] {
  return brands
    .map((brand) => list.filter((x) => x.brand === brand && value(x) >= need).sort((a, b) => value(a) - value(b))[0])
    .filter((x): x is T => !!x)
    .map((x) => x.name);
}

/**
 * What would change the picture. Being limited by the graphics card is normal
 * and is not treated as a problem; a processor that holds the card back is.
 * The refresh rate target decides whether a faster card is worth suggesting.
 */
export function advice(cpu: CpuRate, gpu: GpuRate, res: ResolutionId, targetFps: number): Advice {
  const b = balance(cpu, gpu, res);
  const i = RES_INDEX[res];

  const cpuMatch =
    b.limit === 'cpu' && b.band !== 'matched'
      ? cheapestPerBrand(
          CPU_RATES.filter((c) => c.source !== 'estimated' && CURRENT_CPU.test(c.name) && c.fps > cpu.fps),
          ['AMD', 'Intel'],
          (c) => c.fps,
          b.gpuFps,
        )
      : [];

  // A pair can never average more than its slower part, and the blend keeps
  // it a little under even that, so the processor needs real headroom.
  const reached = b.expected >= targetFps;
  const x = targetFps ** -BLEND_K - cpu.fps ** -BLEND_K;
  const cpuShort = !reached && x <= 0;
  const gpuNeeded = reached || cpuShort ? null : x ** (-1 / BLEND_K);
  const gpuNames =
    gpuNeeded === null
      ? []
      : cheapestPerBrand(
          GPU_RATES.filter((g) => g.source === 'measured' && CURRENT_GPU.test(g.name) && g.fps[i] > gpu.fps[i]),
          ['NVIDIA', 'AMD'],
          (g) => g.fps[i],
          gpuNeeded,
        );

  return { cpuMatch, target: { fps: targetFps, reached, cpuShort, gpuNeeded, gpuNames } };
}

/* ---------------- Popular pairs (shown on the page) ---------------- */

export const POPULAR_PAIRS: [string, string][] = [
  ['AMD Ryzen 5 5600', 'NVIDIA GeForce RTX 4060'],
  ['AMD Ryzen 5 5600', 'NVIDIA GeForce RTX 5070'],
  ['AMD Ryzen 5 3600', 'NVIDIA GeForce RTX 4070 Super'],
  ['Intel Core i5-12400F', 'NVIDIA GeForce RTX 3060'],
  ['Intel Core i5-13400F', 'AMD Radeon RX 7800 XT'],
  ['AMD Ryzen 5 7600', 'NVIDIA GeForce RTX 5060 Ti'],
  ['Intel Core i5-14600K', 'NVIDIA GeForce RTX 5070 Ti'],
  ['AMD Ryzen 7 7800X3D', 'AMD Radeon RX 9070 XT'],
  ['AMD Ryzen 7 9800X3D', 'NVIDIA GeForce RTX 5090'],
  ['Intel Core i7-8700K', 'NVIDIA GeForce RTX 4070'],
];
