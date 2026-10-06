"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { explorerTools, TOOLS_LABEL, type ExplorerTool } from "@/lib/home-data";

/*
 * Tool matrix: a tilted 6 x 6 grid where every tile with an icon is a real
 * tool. Tiles rise toward the cursor on desktop, run a slow idle wave when
 * nobody is pointing at them, and stay still for people who prefer reduced
 * motion. Every tool tile is a normal link, so it works without JavaScript
 * and search engines can follow it.
 */

const COLS = 6;
const ROWS = 6;
const MAX_LIFT = 46;
// Where the tools sit in the grid, chosen so they spread evenly.
const SLOTS = [1, 3, 4, 8, 10, 13, 15, 17, 20, 22, 25, 27, 30, 32];
const TOOL_AT: (ExplorerTool | null)[] = Array.from({ length: COLS * ROWS }, (_, i) => {
  const k = SLOTS.indexOf(i);
  return k > -1 && explorerTools[k] ? explorerTools[k] : null;
});

const FACE = "#ffffff";
const BRAND = "#7c3aed";
const BRAND_SOFT = "#ede9fe";
const INK = "#647084";

function Tile({
  index,
  tool,
  register,
  setEl,
  onFocusTile,
  onBlurTile,
}: {
  index: number;
  tool: ExplorerTool | null;
  register: (i: number, mv: MotionValue<number>) => void;
  setEl: (i: number, el: HTMLDivElement | null) => void;
  onFocusTile: (i: number) => void;
  onBlurTile: () => void;
}) {
  const target = useMotionValue(0);
  const z = useSpring(target, { stiffness: 240, damping: 22, mass: 0.6 });
  useEffect(() => register(index, target), [index, register, target]);

  const lit = useTransform(z, [8, MAX_LIFT * 0.72], [0, 1], { clamp: true });
  const bg = useTransform(lit, [0, 1], [FACE, tool ? BRAND : BRAND_SOFT]);
  const iconColor = useTransform(lit, [0, 1], [INK, "#ffffff"]);
  const shadowOpacity = useTransform(z, [0, MAX_LIFT], [0.1, 0.32]);
  const shadowScale = useTransform(z, [0, MAX_LIFT], [0.94, 1.12]);

  const face = (
    <motion.span
      className="absolute inset-0 flex items-center justify-center rounded-[22%] border border-ink-200/80 shadow-[inset_0_-2px_0_rgba(15,23,42,0.06)]"
      style={{ z, backgroundColor: bg, color: iconColor }}
    >
      {tool && (
        <span className="flex h-full w-full rotate-45 items-center justify-center">
          <tool.icon className="h-[46%] w-[46%]" strokeWidth={1.9} aria-hidden="true" />
        </span>
      )}
    </motion.span>
  );

  return (
    <div
      ref={(el) => setEl(index, el)}
      className="relative h-[var(--tile)] w-[var(--tile)] [transform-style:preserve-3d]"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-[22%] bg-brand-950 blur-[6px]"
        style={{ opacity: shadowOpacity, scale: shadowScale }}
      />
      {tool ? (
        <Link
          href={tool.href}
          aria-label={`Open ${tool.name}`}
          onFocus={() => onFocusTile(index)}
          onBlur={onBlurTile}
          className="absolute inset-0 rounded-[22%] outline-none [transform-style:preserve-3d] focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          {face}
        </Link>
      ) : (
        <span aria-hidden="true" className="absolute inset-0 [transform-style:preserve-3d]">
          {face}
        </span>
      )}
    </div>
  );
}

export default function ToolMatrix() {
  const stageRef = useRef<HTMLDivElement>(null);
  const tileEls = useRef<(HTMLDivElement | null)[]>([]);
  const targets = useRef<(MotionValue<number> | null)[]>([]);
  const centers = useRef<{ x: number; y: number }[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const activeRef = useRef<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [touch, setTouch] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(stageRef, { margin: "120px" });

  const register = useCallback((i: number, mv: MotionValue<number>) => {
    targets.current[i] = mv;
  }, []);
  const setEl = useCallback((i: number, el: HTMLDivElement | null) => {
    tileEls.current[i] = el;
  }, []);

  // Tile centres relative to the stage, measured on the flat (unlifted) tiles.
  const measure = useCallback(() => {
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;
    centers.current = tileEls.current.map((el) => {
      const r = el?.getBoundingClientRect();
      return r ? { x: r.left + r.width / 2 - stage.left, y: r.top + r.height / 2 - stage.top } : { x: -1e4, y: -1e4 };
    });
  }, []);

  useEffect(() => {
    measure();
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useAnimationFrame((t) => {
    if (!inView) return;
    const p = pointer.current;
    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < COLS * ROWS; i++) {
      const mv = targets.current[i];
      if (!mv) continue;
      let z = 0;
      if (p) {
        const c = centers.current[i];
        const d = c ? Math.hypot(c.x - p.x, c.y - p.y) : Infinity;
        z = reduce ? (d < 30 ? MAX_LIFT * 0.6 : 0) : Math.max(0, MAX_LIFT - d * 0.28);
        if (TOOL_AT[i] && d < bestDist) {
          bestDist = d;
          best = i;
        }
      } else if (!reduce) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        z = 7 + 7 * Math.sin(t / 950 + (col + row) * 0.55);
      }
      if (Math.abs(mv.get() - z) > 0.1) mv.set(z);
    }
    const next = p && bestDist < 64 ? best : null;
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  });

  const activeTool = active !== null ? TOOL_AT[active] : null;

  return (
    <div
      ref={stageRef}
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const r = stageRef.current?.getBoundingClientRect();
        if (r) pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => {
        pointer.current = null;
      }}
      className="relative mx-auto flex h-[300px] w-full max-w-[34rem] items-center justify-center overflow-hidden [--gap:clamp(4px,1.2vw,9px)] [--tile:clamp(26px,9.2vw,64px)] [perspective:1600px] sm:h-[440px] lg:max-w-none"
    >
      {/* Soft floor under the grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[52%] h-[46%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-brand-200/40 blur-3xl"
      />

      <div
        className="relative -mt-14 grid grid-cols-6 gap-[var(--gap)] [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-45deg)]"
        role="list"
        aria-label="Free tools"
      >
        {TOOL_AT.map((tool, i) => (
          <div key={i} role={tool ? "listitem" : "presentation"} className="[transform-style:preserve-3d]">
            <Tile
              index={i}
              tool={tool}
              register={register}
              setEl={setEl}
              onFocusTile={(idx) => {
                pointer.current = centers.current[idx] ?? null;
              }}
              onBlurTile={() => {
                pointer.current = null;
              }}
            />
          </div>
        ))}
      </div>

      {/* Caption: names the tool under the cursor */}
      <div className="absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-5" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {activeTool ? (
            <motion.div
              key={activeTool.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <Link
                href={activeTool.href}
                className="card flex items-center gap-3 !rounded-2xl px-4 py-3 transition-shadow hover:shadow-card-hover"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <activeTool.icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sora text-sm font-bold text-ink-950">{activeTool.name}</span>
                  <span className="block truncate text-xs text-ink-500">{activeTool.description}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
              </Link>
            </motion.div>
          ) : (
            <motion.p
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-center text-xs font-medium text-ink-400"
            >
              {TOOLS_LABEL} free tools · {touch ? "Tap a tile to open a tool" : "Point at a tile to see what it does"}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
