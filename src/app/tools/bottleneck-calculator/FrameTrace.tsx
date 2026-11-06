// The moving strip along the bottom of the hero. It looks like the frame time
// graph in a GPU overlay: tall violet bars for graphics card frames, the odd
// blue spike where the processor held a frame up. Pure decoration, so it is
// hidden from screen readers and stands still for people who turn motion off.
// No client JavaScript: two copies of the same strip slide left by exactly one
// copy's width, so the loop has no seam.

const BARS = Array.from({ length: 120 }, (_, i) => {
  const h = 7 + ((i * 37) % 15) + (i % 9 === 0 ? 7 : 0) + (i % 29 === 0 ? 6 : 0);
  return { h, cpu: i % 7 === 3 || i % 29 === 0 };
});

const CSS = `
@keyframes dm-trace { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.dm-trace { animation: dm-trace 40s linear infinite; }
@media (prefers-reduced-motion: reduce) { .dm-trace { animation: none; } }
`;

function Strip() {
  return (
    <svg viewBox="0 0 480 40" preserveAspectRatio="none" className="h-full w-1/2 shrink-0">
      {BARS.map((b, i) => (
        <rect
          key={i}
          x={i * 4 + 1}
          y={40 - b.h}
          width="2"
          height={b.h}
          rx="0.6"
          className={b.cpu ? "fill-sky-500/75" : "fill-brand-300/70"}
        />
      ))}
    </svg>
  );
}

export default function FrameTrace() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-14 lg:h-16">
      <style>{CSS}</style>
      <div className="absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <div className="dm-trace flex h-full w-[320%] sm:w-[200%]">
          <Strip />
          <Strip />
        </div>
      </div>
      {/* A frame budget line, like the 60 fps guide in an overlay */}
      <div className="absolute inset-x-0 top-1/3 border-t border-dashed border-ink-300/70" />
      <div className="absolute -top-6 right-4 flex items-center gap-3 font-mono text-[0.625rem] uppercase tracking-wider text-ink-400 sm:right-6 lg:right-8">
        <span>Frame time</span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-0.5 rounded-sm bg-brand-400" /> GPU
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-0.5 rounded-sm bg-sky-500" /> CPU
        </span>
      </div>
    </div>
  );
}
