"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Loader2 } from "lucide-react";

type GameOption = { id: string; name: string; short: string | null };

type Result =
  | {
      kind: "ok";
      gameId: string;
      gameName: string;
      canRun: boolean;
      score: number;
      fps: string;
      upgrade: string | null;
      matched: { cpu: string; gpu: string };
      ram: number;
    }
  | { kind: "error"; message: string; field?: string; suggestions: string[] };

const MEMORY = [8, 16, 32, 64];
// How many of the most searched games get a one tap chip. The rest sit in "More games".
const CHIPS = 5;

// Free space is not asked here. The full checker on the game page checks it,
// and the card says so, so a large value is sent to keep storage out of the
// quick answer. The check route accepts up to 100,000 GB.
const STORAGE_NOT_CHECKED = 100000;

const label = (g: GameOption) => g.short ?? g.name;

export default function QuickPcCheck({ games }: { games: GameOption[] }) {
  const uid = useId();
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [gpu, setGpu] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState(16);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  // The 274 part names load only when someone starts using the form, so they
  // add nothing to the homepage until they are needed.
  const [parts, setParts] = useState<{ gpus: string[]; cpus: string[] } | null>(null);

  const chips = games.slice(0, CHIPS);
  const more = games.slice(CHIPS);
  const pickedFromMore = more.some((g) => g.id === gameId);

  const loadParts = () => {
    if (parts) return;
    import("@/lib/hardware/catalogue").then((m) =>
      setParts({ gpus: m.GPUS.map((p) => p.name), cpus: m.CPUS.map((p) => p.name) })
    );
  };

  const chooseGame = (id: string) => {
    setGameId(id);
    setResult(null);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!gpu.trim() || !cpu.trim()) {
      setResult({ kind: "error", message: "Add your graphics card and processor first.", suggestions: [] });
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/system-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, userSpecs: { gpu, cpu, ram, storage: STORAGE_NOT_CHECKED } }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResult({
          kind: "error",
          message: data.error ?? "Something went wrong. Please try again.",
          field: data.field,
          suggestions: Array.isArray(data.suggestions) ? data.suggestions.slice(0, 5) : [],
        });
        return;
      }
      setResult({
        kind: "ok",
        gameId: data.game.id,
        gameName: data.game.name,
        canRun: !!data.canRun,
        score: Math.max(0, Math.min(100, Number(data.performance?.score) || 0)),
        fps: data.performance?.fps_estimate ?? "",
        upgrade: Array.isArray(data.upgrades) && data.upgrades.length > 0 ? data.upgrades[0] : null,
        matched: data.matched,
        ram,
      });
    } catch {
      setResult({ kind: "error", message: "Could not reach the checker. Check your connection and try again.", suggestions: [] });
    } finally {
      setBusy(false);
    }
  };

  const pickSuggestion = (name: string) => {
    if (result?.kind !== "error") return;
    if (result.field === "cpu") setCpu(name);
    else setGpu(name);
    setResult(null);
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors ${
      active
        ? "border-white bg-white text-ink-950"
        : "border-white/15 bg-white/[0.04] text-white/80 hover:border-brand-300/60 hover:text-white"
    }`;

  const ok = result?.kind === "ok" ? result : null;
  const ringColor = ok ? (ok.canRun ? "#34d399" : "#fb7185") : "rgba(255,255,255,0.25)";
  const ringPct = ok ? ok.score : 0;

  return (
    <div className="relative min-w-0 overflow-hidden rounded-3xl bg-ink-950 p-6 text-white shadow-card sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-36 h-[24rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(124,58,237,0.42),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(black,transparent_70%)]"
      />

      <form onSubmit={submit} onFocus={loadParts} onPointerEnter={loadParts} className="relative">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-sora text-lg font-medium">Can my PC run it?</h3>
          <span className="shrink-0 rounded-full border border-white/12 bg-white/[0.07] px-2.5 py-1 text-[0.6875rem] text-brand-200">
            {games.length} games
          </span>
        </div>

        <fieldset className="mt-5 min-w-0">
          <legend className="sr-only">Game</legend>
          <div className="flex flex-wrap gap-2">
            {chips.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={gameId === g.id}
                onClick={() => chooseGame(g.id)}
                className={chip(gameId === g.id)}
              >
                {label(g)}
              </button>
            ))}
            {more.length > 0 && (
              <span className={`relative inline-flex items-center ${chip(pickedFromMore)}`}>
                <span className="pointer-events-none max-w-[11rem] truncate pr-4">
                  {pickedFromMore ? label(more.find((g) => g.id === gameId)!) : "More games"}
                </span>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 opacity-70" />
                <select
                  aria-label="More games"
                  value={pickedFromMore ? gameId : ""}
                  onChange={(e) => e.target.value && chooseGame(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  <option value="" disabled>
                    More games
                  </option>
                  {more.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </span>
            )}
          </div>
        </fieldset>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {(
            [
              ["GPU", "Graphics card", gpu, setGpu, "RTX 3060", `${uid}-gpus`],
              ["CPU", "Processor", cpu, setCpu, "Ryzen 5 5600", `${uid}-cpus`],
            ] as const
          ).map(([short, full, value, set, hint, list]) => (
            <label
              key={short}
              className="flex h-12 min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3.5 transition-colors focus-within:border-brand-300 focus-within:bg-white/[0.08]"
            >
              <span className="w-8 shrink-0 text-[0.6875rem] uppercase tracking-[0.12em] text-white/45" aria-hidden="true">
                {short}
              </span>
              <input
                value={value}
                onChange={(e) => set(e.target.value)}
                list={list}
                aria-label={full}
                placeholder={hint}
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </label>
          ))}
        </div>

        <fieldset className="mt-2.5 min-w-0">
          <legend className="sr-only">Memory</legend>
          <div className="grid grid-cols-4 gap-1.5">
            {MEMORY.map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={ram === m}
                onClick={() => setRam(m)}
                className={`h-10 rounded-xl border text-[0.8125rem] font-medium transition-colors ${
                  ram === m
                    ? "border-brand-300 bg-brand-600/35 text-white"
                    : "border-white/10 text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                {m} GB
              </button>
            ))}
          </div>
        </fieldset>

        {parts && (
          <>
            <datalist id={`${uid}-gpus`}>
              {parts.gpus.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            <datalist id={`${uid}-cpus`}>
              {parts.cpus.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(124,58,237,0.9)] transition-colors hover:bg-brand-500 disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Check my PC
        </button>
      </form>

      {/* Result. Always on screen, so the card does not jump when an answer arrives. */}
      <div
        aria-live="polite"
        className={`relative mt-4 flex items-start gap-4 rounded-2xl border p-4 sm:items-center ${
          result ? "border-white/12 bg-white/[0.05]" : "border-dashed border-white/15 bg-white/[0.03]"
        }`}
      >
        {result?.kind === "error" ? (
          <div className="min-w-0 text-sm">
            <p className="text-amber-200">{result.message}</p>
            {result.suggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div
              aria-hidden="true"
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full transition-[background] duration-500"
              style={{ background: `conic-gradient(${ringColor} ${ringPct}%, rgba(255,255,255,0.08) 0)` }}
            >
              <span className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full bg-ink-950 font-sora text-[0.95rem] font-medium">
                {ok ? ok.score : "?"}
              </span>
            </div>
            <div className="min-w-0 text-sm">
              {ok ? (
                <>
                  <p className="font-sora text-[0.95rem] font-medium">
                    {ok.canRun ? `Yes, it runs ${ok.gameName}` : `Not quite for ${ok.gameName}`}
                  </p>
                  <p className="mt-0.5 leading-relaxed text-white/60">
                    {ok.canRun ? `Our estimate: ${ok.fps}.` : ok.upgrade ?? "Part of your PC is below the minimum specs."}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Score out of 100 for {ok.matched.gpu}, {ok.matched.cpu}, {ok.ram} GB. Free space not checked.
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    <Link
                      href={`/tools/can-you-run-it/${ok.gameId}`}
                      className="inline-flex items-center gap-1 font-medium text-brand-300 hover:text-brand-200"
                    >
                      Full breakdown <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    <Link href={`/tools/can-you-run-it#game=${ok.gameId}`} className="text-white/55 hover:text-white">
                      Check storage too
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-sora text-[0.95rem] font-medium">Your result shows here</p>
                  <p className="mt-0.5 text-white/55">A score, likely settings and a frame rate estimate.</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
