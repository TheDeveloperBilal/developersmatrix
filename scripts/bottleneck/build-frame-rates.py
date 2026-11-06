"""Calibrate the bottleneck calculator from published review averages.

Sources (numbers copied by hand, checked against the pages on 6 Nov 2026):
  GPU: Tom's Hardware GPU benchmarks hierarchy, rasterization table, updated
       24 June 2026. 11 games, geometric mean fps, Ryzen 7 9800X3D, Ultra.
  CPU: Tom's Hardware CPU benchmarks hierarchy, updated 5 Oct 2026.
       Current table: RTX 5090, 17 games, 1080p, 9850X3D = 100.
       Legacy tables (2020 to 2022 suites) for older chips, chained to the
       current table through the chips they share (median ratio).

Run from the repo root after changing either list or the catalogue:
  python scripts/bottleneck/build-frame-rates.py
It reads src/lib/hardware/catalogue.ts and writes src/lib/hardware/frame-rates.ts.
"""
import math, re, statistics as st, sys

def log(*a):
    print(*a, file=sys.stderr)
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CATALOGUE = ROOT / 'src/lib/hardware/catalogue.ts'
OUT = ROOT / 'src/lib/hardware/frame-rates.ts'
UPDATED = '2026-11-06'

src = CATALOGUE.read_text(encoding='utf-8').replace('\r', '')
_pat = re.compile(r"name: '([^']+)', score: (\d+), brand: '(\w+)'(, integrated: true)?")
_g = src[src.index('export const GPUS'):src.index('export const CPUS')]
_c = src[src.index('export const CPUS'):src.index('// Words that carry')]
GPUS = {m[0]: (int(m[1]), m[2], bool(m[3])) for m in _pat.findall(_g)}
CPUS = {m[0]: (int(m[1]), m[2]) for m in _pat.findall(_c)}

N = 'NVIDIA GeForce '
A = 'AMD Radeon '
# card: (1080p, 1440p, 4K) average fps
TOM_GPU = {
    N+'RTX 5090': (203.8, 167.3, 110.8),
    N+'RTX 4090': (183.6, 143.4, 89.1),
    N+'RTX 5080': (166.9, 128.3, 77.4),
    A+'RX 7900 XTX': (161.5, 122.3, 70.6),
    N+'RTX 4080 Super': (158.9, 118.6, 69.4),
    N+'RTX 4080': (157.3, 117.5, 67.5),
    N+'RTX 5070 Ti': (155.4, 116.8, 68.6),
    A+'RX 9070 XT': (156.6, 116.5, 65.8),
    A+'RX 7900 XT': (145.4, 108.0, 59.8),
    N+'RTX 4070 Ti Super': (141.2, 104.0, 58.5),
    A+'RX 9070': (140.9, 104.0, 57.7),
    N+'RTX 3090 Ti': (131.7, 99.9, 59.3),
    N+'RTX 4070 Ti': (135.1, 97.9, 53.9),
    N+'RTX 5070': (132.6, 96.4, 54.3),
    N+'RTX 3090': (122.9, 91.5, 53.1),
    N+'RTX 4070 Super': (126.7, 91.2, 49.2),
    A+'RX 6950 XT': (123.3, 89.5, 48.3),
    N+'RTX 3080 Ti': (119.6, 89.1, 51.0),
    A+'RX 7800 XT': (118.4, 84.7, 45.1),
    A+'RX 6900 XT': (117.1, 83.9, 44.9),
    N+'RTX 3080': (111.6, 82.0, 43.9),
    A+'RX 6800 XT': (111.8, 79.6, 42.2),
    N+'RTX 4070': (111.5, 77.8, 41.3),
    N+'RTX 5060 Ti': (105.2, 73.4, 40.2),      # 16 GB model
    A+'RX 7700 XT': (102.9, 72.7, 38.0),
    A+'RX 9060 XT': (98.3, 67.3, 35.2),        # 16 GB model
    N+'RTX 3070 Ti': (94.6, 66.9, 26.0),
    N+'RTX 4060 Ti': (88.0, 58.9, 23.9),       # 8 GB model, the common one
    A+'RX 7600 XT': (102.1, 50.2, 25.5),
    N+'RTX 3070': (87.2, 58.2, 26.2),
    A+'RX 6750 XT': (83.2, 57.6, 29.6),
    N+'RTX 5060': (88.5, 59.8, 21.8),
    A+'RX 6700 XT': (79.2, 54.3, 28.0),
    'Intel Arc B580': (71.5, 50.7, 27.6),
    N+'RTX 3060 Ti': (74.2, 51.0, 19.4),
    N+'RTX 4060': (71.5, 47.6, 17.4),
    A+'RX 7600': (69.9, 45.4, 18.4),
    N+'RTX 5050': (69.3, 45.2, 17.0),
    'Intel Arc B570': (63.5, 44.3, 19.6),
    N+'RTX 3060': (61.5, 41.9, 22.2),          # 12 GB model
    A+'RX 6650 XT': (64.3, 38.0, 19.0),
    A+'RX 6600 XT': (62.7, 40.7, 17.3),
    A+'RX 6600': (51.9, 24.8, 14.5),
    N+'RTX 3050': (44.6, 29.8, 12.6),
}

# Current table, 1080p, 9850X3D = 100
TOM_CPU_NOW = {
    'AMD Ryzen 7 9800X3D': 97.0, 'AMD Ryzen 9 9950X3D': 95.7, 'AMD Ryzen 7 7800X3D': 85.6,
    'AMD Ryzen 9 7950X3D': 83.9, 'Intel Core i9-14900K': 78.2, 'AMD Ryzen 9 7900X3D': 77.1,
    'AMD Ryzen 9 9950X': 76.9, 'Intel Core i9-13900K': 76.8, 'Intel Core i7-14700K': 76.4,
    'Intel Core i7-13700K': 75.8, 'AMD Ryzen 9 9900X': 73.9, 'Intel Core i5-14600K': 72.8,
    'AMD Ryzen 5 9600X': 72.6, 'Intel Core Ultra 9 285K': 71.8, 'AMD Ryzen 9 7950X': 71.0,
    'Intel Core i5-13600K': 70.9, 'AMD Ryzen 7 7700X': 70.6, 'Intel Core Ultra 7 265K': 70.3,
    'AMD Ryzen 9 7900X': 69.2, 'AMD Ryzen 5 7600X': 67.3, 'Intel Core Ultra 5 245K': 67.1,
    'Intel Core i7-12700K': 65.8, 'Intel Core i5-12600K': 60.8, 'Intel Core i5-14400': 58.0,
}
# Legacy Windows 11 table, 13900K = 100 (1080p)
TOM_CPU_T1 = {
    'Intel Core i9-13900K': 100.0, 'Intel Core i7-13700K': 96.09, 'AMD Ryzen 7 5800X3D': 94.42,
    'Intel Core i5-13600K': 90.03, 'AMD Ryzen 9 7900X': 87.40, 'AMD Ryzen 9 7950X': 87.25,
    'AMD Ryzen 7 7700X': 87.13, 'AMD Ryzen 7 7700': 86.19, 'AMD Ryzen 5 7600X': 83.62,
    'AMD Ryzen 5 7600': 79.74, 'AMD Ryzen 9 5950X': 72.04, 'AMD Ryzen 9 5900X': 71.69,
    'AMD Ryzen 7 5800X': 70.90, 'AMD Ryzen 7 5700X': 69.50, 'AMD Ryzen 5 5600X': 67.52,
    'Intel Core i5-12400': 66.62,
}
# Legacy Windows 10 table, 12900K DDR4 = 100 (1080p)
TOM_CPU_T2 = {
    'Intel Core i9-11900K': 92.48, 'AMD Ryzen 9 5900X': 90.98, 'AMD Ryzen 9 5950X': 90.22,
    'AMD Ryzen 5 5600X': 88.51, 'AMD Ryzen 7 5800X': 86.85, 'Intel Core i7-11700K': 86.3,
    'Intel Core i9-10900K': 85.01, 'Intel Core i5-11600K': 84.06, 'Intel Core i5-11400': 80.98,
    'Intel Core i7-10700K': 80.66, 'AMD Ryzen 7 5700G': 76.61, 'Intel Core i5-10600K': 75.42,
    'Intel Core i7-9700K': 73.62, 'Intel Core i9-9900K': 73.41, 'AMD Ryzen 9 3950X': 72.63,
    'AMD Ryzen 5 5600G': 71.99, 'AMD Ryzen 7 3700X': 71.43, 'AMD Ryzen 7 3800X': 71.3,
    'AMD Ryzen 5 3600': 68.63, 'Intel Core i7-8700K': 68.47, 'AMD Ryzen 5 3600X': 68.41,
    'AMD Ryzen 3 3300X': 67.49, 'Intel Core i5-9600K': 67.06, 'Intel Core i5-8600K': 65.84,
    'Intel Core i7-8700': 65.57, 'Intel Core i5-9400': 64.85, 'Intel Core i5-8400': 63.96,
    'Intel Core i3-10100': 61.88, 'AMD Ryzen 7 2700X': 59.19, 'AMD Ryzen 3 3100': 57.75,
    'AMD Ryzen 5 2600X': 57.55, 'AMD Ryzen 7 1800X': 53.86, 'Intel Core i3-9100F': 51.96,
    'AMD Ryzen 5 3400G': 48.81, 'Intel Core i3-8100': 48.43, 'AMD Ryzen 3 3200G': 45.96,
    'AMD Ryzen 5 2400G': 44.84, 'AMD Ryzen 3 2200G': 42.16,
}
# Same silicon or the same chip without graphics: share the measured figure.
TWINS = {
    'Intel Core i5-14400F': 'Intel Core i5-14400', 'Intel Core i5-12400F': 'Intel Core i5-12400',
    'Intel Core i5-11400F': 'Intel Core i5-11400', 'Intel Core i5-9400F': 'Intel Core i5-9400',
    'Intel Core i3-10100F': 'Intel Core i3-10100',
}

# Close variants with no review figure of their own: the measured sibling's
# figure scaled by official max boost clock (GHz). Same architecture and the
# same performance core count in every pair.
SIBLINGS = {
    'AMD Ryzen 5 5600': ('AMD Ryzen 5 5600X', 4.4, 4.6),
    'AMD Ryzen 5 5500': ('AMD Ryzen 5 5600G', 4.2, 4.4),
    'AMD Ryzen 7 5700X3D': ('AMD Ryzen 7 5800X3D', 4.1, 4.5),
    'AMD Ryzen 5 7500F': ('AMD Ryzen 5 7600', 5.0, 5.1),
    'AMD Ryzen 7 9700X': ('AMD Ryzen 5 9600X', 5.5, 5.4),
    'AMD Ryzen 9 3900X': ('AMD Ryzen 9 3950X', 4.6, 4.7),
    'AMD Ryzen 7 2700': ('AMD Ryzen 7 2700X', 4.1, 4.3),
    'AMD Ryzen 5 2600': ('AMD Ryzen 5 2600X', 3.9, 4.2),
    'AMD Ryzen 7 1700': ('AMD Ryzen 7 1800X', 3.7, 4.0),
    'Intel Core i5-10400': ('Intel Core i5-10600K', 4.3, 4.8),
    'Intel Core i5-10400F': ('Intel Core i5-10600K', 4.3, 4.8),
    'Intel Core i5-10500': ('Intel Core i5-10600K', 4.5, 4.8),
    'Intel Core i5-10600': ('Intel Core i5-10600K', 4.8, 4.8),
    'Intel Core i7-10700': ('Intel Core i7-10700K', 4.8, 5.1),
    'Intel Core i5-13400': ('Intel Core i5-14400', 4.6, 4.7),
    'Intel Core i5-13400F': ('Intel Core i5-14400', 4.6, 4.7),
    'Intel Core i9-12900K': ('Intel Core i7-12700K', 5.2, 5.0),
    'Intel Core i7-12700': ('Intel Core i7-12700K', 4.9, 5.0),
    'Intel Core i7-9700': ('Intel Core i7-9700K', 4.7, 4.9),
    'Intel Core i5-9600': ('Intel Core i5-9600K', 4.6, 4.6),
    'Intel Core i7-11700': ('Intel Core i7-11700K', 4.9, 5.0),
    'Intel Core i5-11500': ('Intel Core i5-11400', 4.6, 4.4),
    'Intel Core i5-8500': ('Intel Core i5-8400', 4.1, 4.0),
}
for k, (sib, a, b) in SIBLINGS.items(): assert k in CPUS, k

for d in (TOM_GPU,):
    for k in d: assert k in GPUS, k
for d in (TOM_CPU_NOW, TOM_CPU_T1, TOM_CPU_T2):
    for k in d: assert k in CPUS, k
for k, v in TWINS.items(): assert k in CPUS and v in CPUS, k

def link(a, b):
    """Median ratio a/b over chips both tables share."""
    shared = [k for k in a if k in b]
    return st.median(a[k] / b[k] for k in shared), shared

r1, s1 = link(TOM_CPU_NOW, TOM_CPU_T1)
r2, s2 = link(TOM_CPU_T1, TOM_CPU_T2)
log('T1->now', round(r1, 3), len(s1), ' T2->T1', round(r2, 3), len(s2))

cpu_rel, cpu_src = {}, {}
for k, v in TOM_CPU_T2.items(): cpu_rel[k] = v * r2 * r1; cpu_src[k] = 'legacy'
for k, v in TOM_CPU_T1.items(): cpu_rel[k] = v * r1; cpu_src[k] = 'legacy'
for k, v in TOM_CPU_NOW.items(): cpu_rel[k] = v; cpu_src[k] = 'current'
cpu_sib = {}
for k, v in TWINS.items(): cpu_rel[k] = cpu_rel[v]; cpu_src[k] = cpu_src[v]; cpu_sib[k] = v
# 1600X is measured but not in our catalogue, so it only feeds the 1600.
cpu_rel['AMD Ryzen 5 1600'] = 49.99 * r2 * r1 * 3.6 / 4.0; cpu_src['AMD Ryzen 5 1600'] = 'sibling'; cpu_sib['AMD Ryzen 5 1600'] = 'AMD Ryzen 5 1600X'
for k, (sib, a, b) in SIBLINGS.items():
    assert k not in cpu_rel, k
    cpu_rel[k] = cpu_rel[sib] * a / b; cpu_src[k] = 'sibling'; cpu_sib[k] = sib

# ---- GPU: true 1080p capacity for cards that the 9800X3D holds back --------
ratios = [f[0] / f[1] for f in TOM_GPU.values() if 45 <= f[1] <= 80]
R = st.median(ratios)
log('1080/1440 ratio for GPU bound cards', round(R, 3), len(ratios))

# How sharply the slower part takes over. Games in the suite differ, so an
# average over all of them blends the two limits instead of taking a hard
# minimum. K = 3 sits in the flat part of the error curve (K 1.5 to 3 fit the
# reviews equally well; 4 and above fit worse).
K = 3.0

def blend(a, b, k=K):
    return (a ** -k + b ** -k) ** (-1 / k)

# Fit the 9800X3D frame cap C from the 12 fastest cards (16 GB or more). At 4K
# none of them is held back by the processor, so their 4K figures give each
# card's true speed relative to the RTX 5090. C and the 5090's own 1080p and
# 1440p frame rates are then chosen so the blend reproduces their measured
# 1080p and 1440p averages.
TOP = [k for k, f in TOM_GPU.items() if f[2] >= 57]
REF = TOM_GPU[N + 'RTX 5090']
def top_err(C, G1, G2):
    e = 0
    for k in TOP:
        f = TOM_GPU[k]; q = f[2] / REF[2]
        e += (math.log(blend(C, G1 * q)) - math.log(f[0])) ** 2 + (math.log(blend(C, G2 * q)) - math.log(f[1])) ** 2
    return e
err, C, G1, G2 = min((top_err(C, G1, G2), C, G1, G2) for C in range(190, 400, 1) for G1 in range(220, 400, 4) for G2 in range(170, 260, 2))
log('9800X3D frame cap', C, 'RTX 5090 own fps', G1, G2, 'err', round(err, 5), 'cards', len(TOP))

def unblend(m):
    """Invert m = blend(C, g) to get the card's own frame rate. None when the
    measured figure sits too close to the processor cap to say much."""
    x = m ** -K - C ** -K
    if x <= 0: return None
    g = x ** (-1 / K)
    return g if g < m * 1.4 else None

def gpu_capacity(k, f):
    if k in TOP:
        q = f[2] / REF[2]
        return [G1 * q, G2 * q, unblend(f[2]) or f[2]]
    g1440 = unblend(f[1]) or f[1]
    return [unblend(f[0]) or g1440 * R, g1440, unblend(f[2]) or f[2]]

gpu_fps, gpu_src = {}, {}
for k, f in TOM_GPU.items():
    gpu_fps[k] = gpu_capacity(k, f); gpu_src[k] = 'measured'

# ---- Fill the rest from our own score scale (power law fit) ---------------
def powfit(xs, ys):
    lx = [math.log(x) for x in xs]; ly = [math.log(y) for y in ys]
    mx, my = st.mean(lx), st.mean(ly)
    b = sum((a - mx) * (c - my) for a, c in zip(lx, ly)) / sum((a - mx) ** 2 for a in lx)
    a = math.exp(my - b * mx)
    return a, b

gfits = []
for i in range(3):
    xs = [GPUS[k][0] for k in TOM_GPU]; ys = [gpu_fps[k][i] for k in TOM_GPU]
    gfits.append(powfit(xs, ys))
log('gpu fits', [(round(a, 3), round(b, 3)) for a, b in gfits])
# Our score orders cards well within a generation, so an unmeasured card is
# read off the five measured cards closest to it on our scale: each one's fps,
# scaled by the score gap with the slope of a power law fitted to all measured
# cards, and the median of the five is used. The median keeps one odd result
# (the RX 6600 at 1440p) from pulling its neighbours down.
def gpu_est(sc):
    near = sorted(TOM_GPU, key=lambda k: abs(math.log(GPUS[k][0] / sc)))[:5]
    return [st.median(gpu_fps[k][i] * (sc / GPUS[k][0]) ** gfits[i][1] for k in near) for i in range(3)]
for k, (sc, b, integ) in GPUS.items():
    if k in gpu_fps: continue
    gpu_fps[k] = gpu_est(sc); gpu_src[k] = 'estimated'

xs = [CPUS[k][0] for k in cpu_rel if cpu_src[k] != 'sibling']; ys = [cpu_rel[k] for k in cpu_rel if cpu_src[k] != 'sibling']
ca, cb = powfit(xs, ys)
log('cpu fit', round(ca, 3), round(cb, 3))
for k, (s, b) in CPUS.items():
    if k in cpu_rel: continue
    cpu_rel[k] = ca * s ** cb; cpu_src[k] = 'estimated'

ref = cpu_rel['AMD Ryzen 7 9800X3D']
cpu_cap = {k: C * v / ref for k, v in cpu_rel.items()}


# ---- write the TypeScript table -------------------------------------------
SRC = {'current': 'measured', 'legacy': 'measured', 'measured': 'measured', 'sibling': 'sibling', 'estimated': 'estimated'}
def q(x): return "'" + x.replace("'", "\\'") + "'"
lines = [
    '// Generated by scripts/bottleneck/build-frame-rates.py. Do not edit by hand:',
    '// change the review figures in that script or the catalogue, then run it again.',
    '//',
    "// GPU figures: average fps at Ultra settings in Tom's Hardware's GPU benchmarks",
    '// hierarchy (11 games, updated 24 June 2026), with the test processor taken out.',
    "// CPU figures: Tom's Hardware's CPU benchmarks hierarchy (updated 5 October 2026),",
    '// turned into the frames a processor can prepare in the same 11 game suite.',
    '// "sibling" = a close variant scaled by boost clock, "estimated" = read off our',
    '// own score scale (src/lib/hardware/catalogue.ts) for parts with no review figure.',
    '',
    "export type RateSource = 'measured' | 'sibling' | 'estimated';",
    '',
    'export interface GpuRate {',
    '  name: string;',
    "  brand: 'NVIDIA' | 'AMD' | 'Intel';",
    '  integrated?: boolean;',
    '  /** Frames per second the card can draw at 1080p, 1440p and 4K, Ultra settings (at least 1). */',
    '  fps: [number, number, number];',
    '  source: RateSource;',
    '}',
    '',
    'export interface CpuRate {',
    '  name: string;',
    "  brand: 'NVIDIA' | 'AMD' | 'Intel';",
    '  /** Frames per second the processor can prepare in the same games. */',
    '  fps: number;',
    '  source: RateSource;',
    '  /** For a sibling: the measured chip it is scaled from. */',
    '  from?: string;',
    '}',
    '',
    f'export const RATES_UPDATED = {q(UPDATED)};',
    f'/** How sharply the slower part takes over (see the build script). */',
    f'export const BLEND_K = {K:g};',
    f'/** Frames a Ryzen 7 9800X3D can prepare in this suite (fitted). */',
    f'export const REFERENCE_CPU_FPS = {C};',
    '',
    'export const GPU_RATES: GpuRate[] = [',
]
for k, (sc, b, integ) in GPUS.items():
    f = gpu_fps[k]
    extra = ', integrated: true' if integ else ''
    lines.append(f"  {{ name: {q(k)}, brand: {q(b)}{extra}, fps: [{max(1, round(f[0]))}, {max(1, round(f[1]))}, {max(1, round(f[2]))}], source: {q(gpu_src[k])} }},")
lines += ['];', '', 'export const CPU_RATES: CpuRate[] = [']
for k, (sc, b) in CPUS.items():
    extra = f', from: {q(cpu_sib[k])}' if k in cpu_sib and cpu_src[k] == 'sibling' else ''
    lines.append(f"  {{ name: {q(k)}, brand: {q(b)}, fps: {max(1, round(cpu_cap[k]))}, source: {q(SRC[cpu_src[k]])}{extra} }},")
lines += ['];', '']
OUT.write_text('\r\n'.join(lines), encoding='utf-8')
log('wrote', OUT, len(GPUS), 'gpus', len(CPUS), 'cpus')
