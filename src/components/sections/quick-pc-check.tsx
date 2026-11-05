"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { ToolIcon } from "@/lib/tool-icons";

type GameOption = { id: string; name: string };

type Result =
  | {
      kind: "ok";
      gameId: string;
      gameName: string;
      canRun: boolean;
      settings: string;
      fps: string;
      matched: { cpu: string; gpu: string };
      upgrade: string | null;
      ram: number;
    }
  | { kind: "error"; message: string; field?: string; suggestions: string[] };

const MEMORY = [8, 16, 32, 64];

// Free space is not asked here. The full checker on the game page checks it,
// and the card says so, so a large value is sent to keep storage out of the
// quick answer. The check route accepts up to 100,000 GB.
const STORAGE_NOT_CHECKED = 100000;

export default function QuickPcCheck({ games }: { games: GameOption[] }) {
  const uid = useId();
  const [gameId, setGameId] = useState(games[0]?.id ?? "");
  const [gpu, setGpu] = useState("");
  const [cpu, setCpu] = useState("");
  const [ram, setRam] = useState(16);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  // The 274 part names load only when someone starts filling the form in,
  // so they add nothing to the homepage until they are needed.
  const [parts, setParts] = useState<{ gpus: string[]; cpus: string[] } | null>(null);

  const loadParts = () => {
    if (parts) return;
    import("@/lib/hardware/catalogue").then((m) =>
      setParts({ gpus: m.GPUS.map((p) => p.name), cpus: m.CPUS.map((p) => p.name) })
    );
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
        settings: data.performance?.settings ?? "",
        fps: data.performance?.fps_estimate ?? "",
        matched: data.matched,
        upgrade: Array.isArray(data.upgrades) && data.upgrades.length > 0 ? data.upgrades[0] : null,
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

  const field =
    "mt-1.5 h-11 w-full min-w-0 rounded-xl border border-ink-100 bg-white px-3 text-sm text-ink-900 shadow-sm outline-none transition-colors placeholder:text-ink-300 focus:border-brand-400 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="card flex min-w-0 flex-col p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <ToolIcon tool="can-you-run-it" className="h-5 w-5" />
        </span>
        <h3 className="font-sora text-xl font-bold text-ink-950">Can my PC run it?</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-500">
        Pick a game, then type your graphics card and processor and choose one from the list. We
        compare them with the specs the publisher released.
      </p>

      <form onSubmit={submit} onFocus={loadParts} onPointerEnter={loadParts} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-ink-700 sm:col-span-2">
          Game
          <select value={gameId} onChange={(e) => { setGameId(e.target.value); setResult(null); }} className={field}>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-xs font-semibold text-ink-700 sm:col-span-2">
          Graphics card
          <input
            value={gpu}
            onChange={(e) => setGpu(e.target.value)}
            list={`${uid}-gpus`}
            placeholder="For example RTX 3060"
            autoComplete="off"
            className={field}
          />
        </label>

        <label className="block text-xs font-semibold text-ink-700">
          Processor
          <input
            value={cpu}
            onChange={(e) => setCpu(e.target.value)}
            list={`${uid}-cpus`}
            placeholder="For example Ryzen 5 5600"
            autoComplete="off"
            className={field}
          />
        </label>

        <label className="block text-xs font-semibold text-ink-700">
          Memory
          <select value={ram} onChange={(e) => setRam(Number(e.target.value))} className={field}>
            {MEMORY.map((m) => (
              <option key={m} value={m}>
                {m} GB
              </option>
            ))}
          </select>
        </label>

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

        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Check my PC
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-5">
        {result?.kind === "error" && (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            <p>{result.message}</p>
            {result.suggestions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {result.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => pickSuggestion(s)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink-800 shadow-sm hover:text-brand-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {result?.kind === "ok" && (
          <div className={`rounded-2xl p-4 text-sm ${result.canRun ? "bg-emerald-50 text-emerald-950" : "bg-rose-50 text-rose-950"}`}>
            <p className="flex items-start gap-2 font-semibold">
              {result.canRun ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              )}
              {result.canRun
                ? `Yes, your PC meets the minimum specs for ${result.gameName}.`
                : `Not quite. Part of your PC is below the minimum specs for ${result.gameName}.`}
            </p>
            {result.canRun && (
              <p className="mt-2 leading-relaxed">
                Likely settings: {result.settings}. Our estimate: {result.fps}.
              </p>
            )}
            {!result.canRun && result.upgrade && <p className="mt-2 leading-relaxed">{result.upgrade}</p>}
            <p className="mt-2 text-xs opacity-70">
              Checked {result.matched.gpu} and {result.matched.cpu} with {result.ram} GB of memory. Free space is not
              checked here.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href={`/tools/can-you-run-it/${result.gameId}`}
                className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
              >
                Full breakdown for {result.gameName} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={`/tools/can-you-run-it#game=${result.gameId}`}
                className="inline-flex items-center gap-1 font-semibold text-ink-600 hover:text-brand-700"
              >
                Check storage and more
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
