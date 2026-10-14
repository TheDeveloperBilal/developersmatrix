"use client";

import Link from "next/link";
import { useEffect, useState, type ComponentType } from "react";
import { ToolIcon } from "@/lib/tool-icons";
import { TOOLS_LABEL } from "@/lib/home-data";
import { FACE, FLOOR_CLASS, GRID_CLASS, INK, STAGE_CLASS, TOOL_AT } from "./tool-matrix-shared";

/*
 * Tool matrix: a tilted 6 x 6 grid where every tile with an icon is a real
 * tool. Every tool tile is a normal link, so it works without JavaScript and
 * search engines can follow it.
 *
 * This file renders the grid still, with no animation code at all. Phones and
 * touch screens keep it that way. On devices with a mouse, the motion version
 * (hover lift, a short idle wave) is downloaded once the page is idle and
 * swapped in; it uses the same markup and sizes, so nothing moves on the swap.
 */

type Loaded = ComponentType | null;

export default function ToolMatrix() {
  const [Motion, setMotion] = useState<Loaded>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setTouch(!fine);
    if (!fine) return;

    let cancelled = false;
    const load = () =>
      import("./tool-matrix-motion").then((m) => {
        if (!cancelled) setMotion(() => m.default);
      });
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(load, { timeout: 3000 });
    else timer = setTimeout(load, 1500);
    return () => {
      cancelled = true;
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (Motion) return <Motion />;

  return (
    <div className={STAGE_CLASS}>
      <div aria-hidden="true" className={FLOOR_CLASS} />

      <div className={GRID_CLASS} role="list" aria-label="Free tools">
        {TOOL_AT.map((tool, i) => {
          const face = (
            <span
              className="absolute inset-0 flex items-center justify-center rounded-[22%] border border-ink-200/80 shadow-[inset_0_-2px_0_rgba(15,23,42,0.06)]"
              style={{ backgroundColor: FACE, color: INK }}
            >
              {tool && (
                <span className="flex h-full w-full rotate-45 items-center justify-center">
                  <ToolIcon tool={tool.href} fallback={tool.icon} wrapClassName="h-[46%] w-[46%]" className="h-full w-full" />
                </span>
              )}
            </span>
          );
          return (
            <div key={i} role={tool ? "listitem" : "presentation"} className="[transform-style:preserve-3d]">
              <div className="relative h-[var(--tile)] w-[var(--tile)] [transform-style:preserve-3d]">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[22%] bg-brand-950 blur-[6px]"
                  style={{ opacity: 0.1, transform: "scale(0.94)" }}
                />
                {tool ? (
                  <Link
                    href={tool.href}
                    aria-label={`Open ${tool.name}`}
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
            </div>
          );
        })}
      </div>

      <div className="absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-5" aria-live="polite">
        <p className="text-center text-xs font-medium text-ink-400">
          {TOOLS_LABEL} free tools · {touch ? "Tap a tile to open a tool" : "Point at a tile to see what it does"}
        </p>
      </div>
    </div>
  );
}
