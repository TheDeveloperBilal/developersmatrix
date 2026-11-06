"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { AI_BOTS, PURPOSES, type AiBot, type BotPurpose } from "@/lib/ai-crawlers/bots";
import type { BotResult, CrawlerCheck } from "@/lib/ai-crawlers/check";

const EXAMPLES = ["developersmatrix.com", "nytimes.com", "reddit.com"];

const BOT = new Map(AI_BOTS.map((b) => [b.token, b]));

/* ---------------- Policy snippets ---------------- */

const tokens = (p: BotPurpose) => AI_BOTS.filter((b) => b.purpose === p && !["Googlebot", "Bingbot", "Applebot"].includes(b.token)).map((b) => b.token);
const group = (list: string[], rule: string) => [...list.map((t) => `User-agent: ${t}`), rule].join("\n");

const POLICIES = [
  {
    id: "search",
    label: "Be found in AI answers, keep content out of training",
    code: `# AI search and answer engines\n${group([...tokens("search"), ...tokens("user")], "Allow: /")}\n\n# AI model training\n${group(tokens("training"), "Disallow: /")}`,
    note: "The most common choice for sites that want visitors from AI search. Your pages can still be quoted and linked in ChatGPT, Claude, Perplexity and Meta AI answers.",
  },
  {
    id: "all",
    label: "Allow every AI crawler",
    code: `# Every AI crawler\n${group([...tokens("search"), ...tokens("user"), ...tokens("training")], "Allow: /")}`,
    note: "With no AI rules at all, these bots are already allowed. Adding them by name only helps if your group for all bots blocks something they should see.",
  },
  {
    id: "none",
    label: "Block every AI crawler",
    code: `# Every AI crawler\n${group([...tokens("search"), ...tokens("user"), ...tokens("training")], "Disallow: /")}`,
    note: "This also keeps you out of ChatGPT search, Claude search, Perplexity and Meta AI answers. Googlebot and Bingbot are left alone, so Google and Bing search are not affected.",
  },
] as const;

/* ---------------- Wording ---------------- */

function decisionText(r: BotResult, check: CrawlerCheck): string {
  if (r.verdict === "paused") return "robots.txt could not be read, so crawlers hold off";
  if (check.robots.state === "missing") return "No robots.txt, so everything is allowed";
  if (check.robots.state === "html") return "robots.txt is a web page, so no rules apply";
  const where = r.group === "*" ? "the group for all bots" : r.group ? `its own group (User-agent: ${r.group})` : null;
  if (r.rule) return `${r.rule.type === "allow" ? "Allow" : "Disallow"}: ${r.rule.path}, line ${r.rule.line}, in ${where}`;
  if (!where) return "No group applies, so it is allowed";
  return `No rule in ${where} matches this page, so it is allowed`;
}

function summary(check: CrawlerCheck): { tone: "good" | "warn" | "bad"; text: string } {
  const v = (t: string) => check.bots.find((b) => b.token === t)?.verdict;
  if (check.robots.state === "error" || check.robots.state === "unreachable") {
    return {
      tone: "bad",
      text:
        check.robots.state === "error"
          ? `robots.txt answered with an error (${check.robots.status}). Google treats that as a temporary block on the whole site, and other crawlers tend to hold off too.`
          : "We could not reach robots.txt. If crawlers cannot reach it either, most of them hold off until they can.",
    };
  }
  if (v("Googlebot") === "blocked") return { tone: "bad", text: "Googlebot is blocked here, which keeps this page out of Google Search, including its AI features." };
  const searchBlocked = ["OAI-SearchBot", "Claude-SearchBot", "PerplexityBot", "meta-webindexer"].filter((t) => v(t) === "blocked");
  const training = check.bots.filter((b) => BOT.get(b.token)?.purpose === "training");
  const trainingBlocked = training.filter((b) => b.verdict === "blocked").length;
  if (searchBlocked.length > 0) {
    const names = searchBlocked.map((t) => BOT.get(t)?.product ?? t);
    return { tone: "warn", text: `This page is closed to ${names.join(", ")}, so it cannot be shown or linked in those AI answers.` };
  }
  if (trainingBlocked === 0) return { tone: "good", text: "Every AI crawler we check may read this page, for search answers and for training." };
  return {
    tone: "good",
    text: `AI search engines can read this page, and ${trainingBlocked} of ${training.length} training crawlers are kept out. That is the setup most sites that want AI traffic choose.`,
  };
}

const VERDICT_STYLE: Record<BotResult["verdict"], string> = {
  allowed: "text-emerald-700 ring-emerald-300 bg-emerald-50",
  blocked: "text-white ring-rose-600 bg-rose-600",
  paused: "text-amber-800 ring-amber-300 bg-amber-50",
};
const VERDICT_LABEL: Record<BotResult["verdict"], string> = { allowed: "Allowed", blocked: "Blocked", paused: "On hold" };

/* ---------------- Pieces ---------------- */

const INITIALS: Record<string, string> = { OpenAI: "OA", Anthropic: "AN", Perplexity: "PX", Meta: "ME", Google: "GO", Microsoft: "MS", Apple: "AP", "Common Crawl": "CC" };

function Monogram({ company }: { company: string }) {
  const letters = INITIALS[company] ?? company.slice(0, 2).toUpperCase();
  return (
    <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink-200 bg-white font-mono text-[0.6875rem] font-semibold text-ink-600">
      {letters}
    </span>
  );
}

function BotRow({ bot, result, check }: { bot: AiBot; result: BotResult; check: CrawlerCheck }) {
  return (
    <li className="grid gap-x-4 gap-y-2 px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <div className="flex min-w-0 gap-3">
        <Monogram company={bot.company} />
        <div className="min-w-0">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-mono text-[0.875rem] font-semibold text-ink-950">{bot.token}</span>
            <span className="text-[0.75rem] text-ink-500">{bot.company}, {bot.product}</span>
          </p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-600">{bot.does}</p>
          <p className="mt-1 font-mono text-[0.6875rem] text-ink-400">{decisionText(result, check)}</p>
          {bot.robots === "may-ignore" && (
            <p className="mt-1 text-[0.6875rem] font-medium text-amber-700">{bot.company} says this fetcher may ignore robots.txt.</p>
          )}
        </div>
      </div>
      <span className={`justify-self-start rounded-md px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-wider ring-1 ring-inset sm:justify-self-end ${VERDICT_STYLE[result.verdict]}`}>
        {VERDICT_LABEL[result.verdict]}
      </span>
    </li>
  );
}

function Pill({ label, value, tone = "plain" }: { label: string; value: string; tone?: "plain" | "good" | "warn" }) {
  const toneClass = tone === "good" ? "text-emerald-700" : tone === "warn" ? "text-amber-700" : "text-ink-900";
  return (
    <div className="min-w-0 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5">
      <p className="text-[0.6875rem] uppercase tracking-[0.12em] text-ink-400">{label}</p>
      <p className={`mt-0.5 truncate text-[0.875rem] font-medium ${toneClass}`} title={value}>{value}</p>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          setDone(false);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-800 px-2.5 py-1.5 text-[0.75rem] font-medium text-ink-100 transition-colors hover:bg-ink-700"
    >
      {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function kb(bytes: number) {
  return bytes < 1024 ? `${bytes} bytes` : `${(bytes / 1024).toFixed(1)} KB`;
}

/* ---------------- Main ---------------- */

export default function AiCrawlerCheckerClient() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [check, setCheck] = useState<CrawlerCheck | null>(null);
  const [policy, setPolicy] = useState<(typeof POLICIES)[number]["id"]>("search");
  const resultRef = useRef<HTMLDivElement>(null);

  const run = async (value: string) => {
    const url = value.trim();
    if (!url) {
      setError("Enter a website address, such as example.com.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-crawler-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "We could not check that site just now.");
      setCheck(data as CrawlerCheck);
      const host = new URL((data as CrawlerCheck).checkedUrl);
      const shown = host.pathname === "/" && !host.search ? host.hostname : host.href;
      window.history.replaceState(null, "", `${window.location.pathname}?url=${encodeURIComponent(shown)}`);
      requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
    } catch (e) {
      setCheck(null);
      setError(e instanceof Error ? e.message : "We could not check that site just now.");
    } finally {
      setLoading(false);
    }
  };

  // A shared link (?url=example.com) runs the check straight away.
  useEffect(() => {
    const u = new URLSearchParams(window.location.search).get("url");
    if (u) {
      setInput(u);
      run(u);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byPurpose = useMemo(() => {
    if (!check) return [];
    return PURPOSES.map((p) => {
      const rows = AI_BOTS.filter((b) => b.purpose === p.id).map((bot) => ({ bot, result: check.bots.find((r) => r.token === bot.token)! }));
      return { ...p, rows, allowed: rows.filter((r) => r.result.verdict === "allowed").length };
    });
  }, [check]);

  const marked = useMemo(() => {
    const set = new Set<number>();
    check?.bots.forEach((b) => {
      if (b.rule) set.add(b.rule.line);
      if (b.groupLine) set.add(b.groupLine);
    });
    check?.signals.forEach((s) => set.add(s.line));
    return set;
  }, [check]);

  const sum = check ? summary(check) : null;
  const chosen = POLICIES.find((p) => p.id === policy)!;
  const host = check ? new URL(check.checkedUrl).hostname : "";

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-card">
      {/* Input */}
      <form
        className="border-b border-ink-100 bg-[linear-gradient(to_bottom,#f8f9fb,#fff)] p-5 sm:p-7"
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
        noValidate
      >
        <label htmlFor="crawler-url" className="text-[0.8125rem] font-medium text-ink-700">
          Website or page address
        </label>
        <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
          <input
            id="crawler-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="example.com or example.com/blog/post"
            aria-invalid={!!error}
            aria-describedby={error ? "crawler-error" : "crawler-hint"}
            className={`h-12 w-full rounded-xl border bg-white px-4 font-mono text-[0.9375rem] text-ink-950 shadow-sm outline-none transition-colors placeholder:font-sans placeholder:text-ink-400 focus:ring-4 ${
              error ? "border-rose-400 focus:ring-rose-100" : "border-ink-200 focus:border-ink-400 focus:ring-ink-100"
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-ink-950 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-ink-800 disabled:cursor-wait disabled:opacity-80"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {loading ? "Checking" : "Check crawlers"}
          </button>
        </div>
        {error ? (
          <p id="crawler-error" role="alert" className="mt-2 text-[0.8125rem] text-rose-700">{error}</p>
        ) : (
          <p id="crawler-hint" className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-ink-500">
            Try
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => {
                  setInput(ex);
                  run(ex);
                }}
                className="rounded-md bg-ink-100 px-2 py-0.5 font-mono text-[0.75rem] text-ink-700 transition-colors hover:bg-ink-200"
              >
                {ex}
              </button>
            ))}
          </p>
        )}
      </form>

      {/* Empty state */}
      {!check && !loading && (
        <div className="grid gap-px bg-ink-100 sm:grid-cols-3">
          {PURPOSES.map((p) => (
            <div key={p.id} className="bg-white p-5 sm:p-6">
              <p className="font-sora text-[0.9375rem] font-semibold text-ink-900">{p.title}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-500">{p.blurb}</p>
              <p className="mt-3 font-mono text-[0.75rem] leading-relaxed text-ink-400">
                {AI_BOTS.filter((b) => b.purpose === p.id).map((b) => b.token).join("  ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div className="space-y-3 p-5 sm:p-7" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-ink-50" />
          ))}
        </div>
      )}

      {/* Results */}
      {check && sum && !loading && (
        <div ref={resultRef} tabIndex={-1} className="outline-none">
          <div className="p-5 sm:p-7">
            <p className="font-mono text-[0.75rem] text-ink-400">
              {host}
              {check.path !== "/" ? check.path : ""}
            </p>
            <p
              aria-live="polite"
              className={`mt-2 max-w-3xl font-sora text-xl font-semibold leading-snug tracking-tight sm:text-[1.4rem] ${
                sum.tone === "bad" ? "text-rose-700" : sum.tone === "warn" ? "text-amber-800" : "text-ink-950"
              }`}
            >
              {sum.text}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {byPurpose.map((p) => (
                <div key={p.id} className="rounded-xl bg-ink-50 px-3 py-3 sm:px-4">
                  <p className="font-mono text-xl font-semibold tabular-nums text-ink-950 sm:text-2xl">
                    {p.allowed}
                    <span className="text-ink-300">/{p.rows.length}</span>
                  </p>
                  <p className="mt-0.5 text-[0.6875rem] leading-tight text-ink-500 sm:text-[0.75rem]">{p.title} allowed</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Pill
                label="robots.txt"
                value={
                  check.robots.state === "ok"
                    ? `Found, ${kb(check.robots.bytes)}, ${check.robots.groupCount} ${check.robots.groupCount === 1 ? "group" : "groups"}`
                    : check.robots.state === "missing"
                      ? `Not found (${check.robots.status}), all allowed`
                      : check.robots.state === "html"
                        ? "Returns a web page, not rules"
                        : check.robots.state === "error"
                          ? `Error ${check.robots.status}`
                          : "No answer"
                }
                tone={check.robots.state === "ok" || check.robots.state === "missing" ? "plain" : "warn"}
              />
              <Pill label="llms.txt" value={check.llms.found ? (check.llms.title ? `Found: ${check.llms.title}` : `Found, ${kb(check.llms.bytes)}`) : "Not found"} tone={check.llms.found ? "good" : "plain"} />
              <Pill
                label="Content signals"
                value={check.signals.length ? check.signals.map((s) => s.raw).join("; ") : "None set"}
              />
              <Pill label="Served through" value={check.cdn ?? "No CDN detected"} />
            </div>

            {check.cdn === "Cloudflare" && (
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[0.8125rem] leading-relaxed text-amber-900">
                This site runs through Cloudflare, which can block AI crawlers at its firewall even when robots.txt lets them in. If AI search traffic matters to you, check the bot settings in your Cloudflare dashboard. We can only see robots.txt from outside.
              </p>
            )}
            {check.robots.truncated && (
              <p className="mt-3 text-[0.8125rem] text-amber-800">This robots.txt is over 500 KB. Google ignores everything after that point, and so does this check.</p>
            )}
          </div>

          {/* Roster */}
          {byPurpose.map((p) => (
            <section key={p.id} aria-labelledby={`purpose-${p.id}`} className="border-t border-ink-100">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-ink-50/70 px-4 py-3 sm:px-5">
                <h3 id={`purpose-${p.id}`} className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-600">
                  {p.title} <span className="ml-1 font-mono text-ink-400">{p.allowed}/{p.rows.length}</span>
                </h3>
                <p className="text-[0.75rem] text-ink-500">{p.blurb}</p>
              </div>
              <ul className="divide-y divide-ink-100">
                {p.rows.map(({ bot, result }) => (
                  <BotRow key={bot.token} bot={bot} result={result} check={check} />
                ))}
              </ul>
            </section>
          ))}

          {/* robots.txt viewer */}
          {check.robots.state === "ok" && check.robots.lines.length > 0 && (
            <details className="group border-t border-ink-100">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[0.875rem] font-medium text-ink-800 sm:px-5">
                <span>
                  Show robots.txt <span className="ml-1 text-ink-400">({check.robots.lines.length} lines, deciding lines marked)</span>
                </span>
                <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="max-h-96 overflow-auto border-t border-ink-100 bg-ink-950 py-3 font-mono text-[0.75rem] leading-relaxed">
                {check.robots.lines.map((l, i) => {
                  const n = i + 1;
                  const hit = marked.has(n);
                  return (
                    <div key={n} className={`flex gap-4 px-4 ${hit ? "bg-amber-400/15" : ""}`}>
                      <span className={`w-8 shrink-0 select-none text-right tabular-nums ${hit ? "text-amber-300" : "text-ink-600"}`}>{n}</span>
                      <span className={`whitespace-pre ${hit ? "text-amber-100" : "text-ink-300"}`}>{l || " "}</span>
                    </div>
                  );
                })}
                {check.robots.linesCut && <p className="px-4 pt-2 text-ink-500">Showing the first {check.robots.lines.length} lines.</p>}
              </div>
              <p className="px-4 py-3 text-[0.75rem] text-ink-500 sm:px-5">
                <a href={check.robots.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-ink-800">
                  Open the live file <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </p>
            </details>
          )}
        </div>
      )}

      {/* Policy builder, always available */}
      <div className="border-t border-ink-100 p-5 sm:p-7">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-ink-400">Build your AI rules</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="AI crawler policy">
          {POLICIES.map((p) => (
            <label
              key={p.id}
              className={`cursor-pointer rounded-xl border px-3.5 py-3 text-[0.8125rem] font-medium leading-snug transition-colors focus-within:ring-2 focus-within:ring-ink-300 ${
                policy === p.id ? "border-ink-900 bg-ink-950 text-white" : "border-ink-200 bg-white text-ink-800 hover:border-ink-400"
              }`}
            >
              <input type="radio" name="policy" className="sr-only" checked={policy === p.id} onChange={() => setPolicy(p.id)} />
              {p.label}
            </label>
          ))}
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl bg-ink-950">
          <div className="flex items-center justify-between border-b border-ink-800 px-4 py-2.5">
            <span className="font-mono text-[0.75rem] text-ink-400">robots.txt</span>
            <CopyButton text={chosen.code} />
          </div>
          <pre className="max-h-80 overflow-auto px-4 py-3 font-mono text-[0.75rem] leading-relaxed text-ink-200">{chosen.code}</pre>
        </div>
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-600">{chosen.note}</p>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-600">
          One thing to know before you paste: a bot named in its own group ignores your group for all bots. If your <span className="font-mono text-[0.75rem]">User-agent: *</span> group blocks private folders, copy those Disallow lines into the AI groups too.
        </p>
        <Link href="/tools/website-audit" className="mt-4 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-brand-700 hover:text-brand-800">
          Run a full website audit <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
