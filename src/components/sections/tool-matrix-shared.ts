import { explorerTools, type ExplorerTool } from "@/lib/home-data";

/* Shared by the still grid (tool-matrix.tsx) and the desktop motion version
 * (tool-matrix-motion.tsx), so the swap between them never moves a pixel. */

export const COLS = 6;
export const ROWS = 6;
export const MAX_LIFT = 46;
/** How long the idle wave runs after the motion version loads. */
export const WAVE_MS = 6000;

// Where the tools sit in the grid, chosen so they spread evenly.
const SLOTS = [1, 3, 4, 8, 10, 13, 15, 17, 20, 22, 25, 27, 30, 32];
export const TOOL_AT: (ExplorerTool | null)[] = Array.from({ length: COLS * ROWS }, (_, i) => {
  const k = SLOTS.indexOf(i);
  return k > -1 && explorerTools[k] ? explorerTools[k] : null;
});

export const FACE = "#ffffff";
export const BRAND = "#7c3aed";
export const BRAND_SOFT = "#ede9fe";
export const INK = "#647084";

export const STAGE_CLASS =
  "relative mx-auto flex h-[300px] w-full max-w-[34rem] items-center justify-center overflow-hidden [--gap:clamp(4px,1.2vw,9px)] [--tile:clamp(26px,9.2vw,64px)] [perspective:1600px] sm:h-[440px] lg:max-w-none";

// A radial gradient instead of a blur-3xl ellipse: the same soft floor without
// a large blur filter to paint.
export const FLOOR_CLASS =
  "pointer-events-none absolute left-1/2 top-[52%] h-[70%] w-[100%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(221,212,254,0.55),rgba(221,212,254,0.2)_60%,transparent)]";

export const GRID_CLASS =
  "relative -mt-14 grid grid-cols-6 gap-[var(--gap)] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-45deg)]";
