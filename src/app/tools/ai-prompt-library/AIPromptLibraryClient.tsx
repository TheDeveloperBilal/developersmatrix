'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Link2,
  MessageSquareText,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { PROMPTS } from '@/lib/prompts/library';
import {
  CATEGORIES,
  blanksOf,
  chatLinks,
  fillPrompt,
  fillSegments,
  haystack,
  isLongBlank,
  type LibraryPrompt,
  type PromptCategory,
  type PromptKind,
} from '@/lib/prompts/types';

type Shelf = 'all' | 'saved' | PromptCategory;
type KindFilter = 'all' | PromptKind;

const SAVED_KEY = 'dm-prompt-library-saved';
const CATEGORY_NAME = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.name])) as Record<PromptCategory, string>;
const SEARCH_INDEX = new Map(PROMPTS.map((p) => [p.id, haystack(p)]));

function readSaved(): string[] {
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === 'string' && SEARCH_INDEX.has(x)) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]) {
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {
    // Private mode or storage blocked. Saving just will not persist.
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function splitLabel(label: string): { name: string; hint: string } {
  const i = label.search(/,\s*e\.g\.\s*/i);
  if (i === -1) return { name: label, hint: '' };
  return { name: label.slice(0, i), hint: label.slice(i).replace(/^,\s*/, '') };
}

export default function AIPromptLibraryClient() {
  const [shelf, setShelf] = useState<Shelf>('all');
  const [kind, setKind] = useState<KindFilter>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const asideRef = useRef<HTMLElement | null>(null);

  // Restore saved prompts and a shared #p=slug link.
  useEffect(() => {
    setSaved(readSaved());
    const fromHash = () => {
      const m = /^#p=([a-z0-9-]+)$/.exec(window.location.hash);
      if (m && SEARCH_INDEX.has(m[1])) setSelectedId(m[1]);
    };
    fromHash();
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    window.addEventListener('hashchange', fromHash);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('hashchange', fromHash);
    };
  }, []);

  const selected = useMemo(() => PROMPTS.find((p) => p.id === selectedId) ?? null, [selectedId]);
  const sheetOpen = !isDesktop && selected !== null;

  useEffect(() => {
    asideRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  // Lock page scroll behind the mobile sheet, and close it with Escape.
  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // The chat bubble sits on top of the sheet buttons on phones, so hide it while the sheet is open.
    const tawk = (window as unknown as { Tawk_API?: { hideWidget?: () => void; showWidget?: () => void } }).Tawk_API;
    try {
      tawk?.hideWidget?.();
    } catch {
      // Widget not ready yet.
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') select(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      try {
        tawk?.showWidget?.();
      } catch {
        // Ignore.
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheetOpen]);

  const showFlash = useCallback((msg: string) => {
    setFlash(msg);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 2200);
  }, []);

  function select(id: string | null) {
    setSelectedId(id);
    try {
      const url = window.location.pathname + window.location.search + (id ? `#p=${id}` : '');
      window.history.replaceState(null, '', url);
    } catch {
      // Ignore. The hash is only a convenience for sharing.
    }
  }

  function toggleSaved(id: string) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeSaved(next);
      return next;
    });
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    for (const p of PROMPTS) {
      if (kind !== 'all' && p.kind !== kind) continue;
      c.all += 1;
      c[p.category] = (c[p.category] ?? 0) + 1;
    }
    c.saved = saved.filter((id) => {
      const p = PROMPTS.find((x) => x.id === id);
      return p && (kind === 'all' || p.kind === kind);
    }).length;
    return c;
  }, [kind, saved]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return PROMPTS.filter((p) => {
      if (kind !== 'all' && p.kind !== kind) return false;
      if (shelf === 'saved' && !saved.includes(p.id)) return false;
      if (shelf !== 'all' && shelf !== 'saved' && p.category !== shelf) return false;
      const hay = SEARCH_INDEX.get(p.id) ?? '';
      return terms.every((t) => hay.includes(t));
    });
  }, [query, kind, shelf, saved]);

  const shelves: { id: Shelf; name: string }[] = [
    { id: 'all', name: 'All prompts' },
    ...CATEGORIES.map((c) => ({ id: c.id as Shelf, name: c.name })),
    { id: 'saved', name: 'Saved' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex-row sm:items-center sm:p-4">
        <label className="relative block min-w-0 flex-1">
          <span className="sr-only">Search prompts</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts, e.g. debug, email, SEO"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-9 pr-3 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </label>
        <div role="group" aria-label="Prompt type" className="flex shrink-0 rounded-xl border border-zinc-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-950">
          {(
            [
              ['all', 'All', null],
              ['chat', 'Chat', MessageSquareText],
              ['image', 'Image', ImageIcon],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              aria-pressed={kind === id}
              onClick={() => setKind(id)}
              className={`inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition sm:flex-none ${
                kind === id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
              }`}
            >
              {Icon && <Icon aria-hidden="true" className="h-4 w-4" />}
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:h-[min(860px,calc(100vh-7rem))] lg:min-h-[620px] lg:grid-cols-[200px_minmax(0,1fr)_400px]">
        {/* Category index */}
        <nav aria-label="Prompt categories" className="border-b border-zinc-200 dark:border-zinc-800 lg:min-h-0 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <ul className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:p-3">
            {shelves.map((s) => {
              const active = shelf === s.id;
              const n = counts[s.id] ?? 0;
              return (
                <li key={s.id} className="shrink-0">
                  <button
                    type="button"
                    aria-current={active ? 'true' : undefined}
                    onClick={() => setShelf(s.id)}
                    className={`flex w-full items-center justify-between gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition ${
                      active
                        ? 'bg-emerald-50 font-semibold text-emerald-800 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <span className="inline-flex items-center gap-2">
                      {s.id === 'saved' && <Bookmark aria-hidden="true" className="h-3.5 w-3.5" />}
                      {s.name}
                    </span>
                    <span className={`tabular-nums text-xs ${active ? 'text-emerald-700 dark:text-emerald-300' : 'text-zinc-400'}`}>{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Prompt cards */}
        <section aria-label="Prompts" className="min-w-0 p-3 sm:p-4 lg:min-h-0 lg:overflow-y-auto">
          <h2 className="sr-only">Browse prompts</h2>
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400" aria-live="polite">
            {results.length === 1 ? '1 prompt' : `${results.length} prompts`}
            {query.trim() ? ` for "${query.trim()}"` : ''}
          </p>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              {shelf === 'saved' && saved.length === 0
                ? 'Nothing saved yet. Use the bookmark on any prompt to keep it here.'
                : 'No prompts match. Try a shorter search or another category.'}
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {results.map((p) => (
                <PromptCard
                  key={p.id}
                  prompt={p}
                  active={p.id === selectedId}
                  saved={saved.includes(p.id)}
                  onOpen={() => select(p.id)}
                  onToggleSave={() => toggleSaved(p.id)}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Builder: sticky panel on desktop, bottom sheet on smaller screens */}
        {sheetOpen && (
          <button
            type="button"
            aria-label="Close prompt builder"
            onClick={() => select(null)}
            className="fixed inset-0 z-[60] bg-zinc-950/40 backdrop-blur-[1px] lg:hidden"
          />
        )}
        <aside
          ref={asideRef}
          aria-label="Prompt builder"
          className={
            sheetOpen
              ? 'fixed inset-x-0 bottom-0 z-[70] max-h-[88vh] overflow-y-auto rounded-t-2xl border-t border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950'
              : 'hidden border-l border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40 lg:block lg:min-h-0 lg:overflow-y-auto'
          }
        >
          <div>
            {selected ? (
              <Builder
                key={selected.id}
                prompt={selected}
                values={values[selected.id] ?? {}}
                onChange={(label, v) =>
                  setValues((prev) => ({ ...prev, [selected.id]: { ...(prev[selected.id] ?? {}), [label]: v } }))
                }
                onReset={() => setValues((prev) => ({ ...prev, [selected.id]: {} }))}
                saved={saved.includes(selected.id)}
                onToggleSave={() => toggleSaved(selected.id)}
                onClose={() => select(null)}
                isSheet={sheetOpen}
                onFlash={showFlash}
              />
            ) : (
              <EmptyBuilder onTry={() => select('debug-an-error')} />
            )}
          </div>
        </aside>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-lg transition-opacity dark:bg-white dark:text-zinc-900 ${
          flash ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {flash ?? ''}
      </div>
    </div>
  );
}

function PromptCard({
  prompt: p,
  active,
  saved,
  onOpen,
  onToggleSave,
}: {
  prompt: LibraryPrompt;
  active: boolean;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  const blanks = blanksOf(p.body).length;
  return (
    <li
      className={`group relative flex flex-col rounded-xl border bg-white p-4 transition dark:bg-zinc-950 ${
        active
          ? 'border-emerald-500 ring-4 ring-emerald-500/10'
          : 'border-zinc-200 hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
          <button type="button" onClick={onOpen} className="text-left after:absolute after:inset-0 after:rounded-xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-emerald-500">
            {p.title}
          </button>
        </h3>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${p.title} from saved` : `Save ${p.title}`}
          className="relative z-10 -m-1 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          {saved ? <BookmarkCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Bookmark className="h-4 w-4" />}
        </button>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{p.summary}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{CATEGORY_NAME[p.category]}</span>
        <span aria-hidden="true">·</span>
        <span>{blanks === 1 ? '1 blank to fill' : `${blanks} blanks to fill`}</span>
        {p.kind === 'image' && (
          <span className="inline-flex items-center gap-1 rounded-md bg-violet-50 px-1.5 py-0.5 font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
            <ImageIcon aria-hidden="true" className="h-3 w-3" />
            Image prompt
          </span>
        )}
      </div>
    </li>
  );
}

function EmptyBuilder({ onTry }: { onTry: () => void }) {
  return (
    <div className="p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">Prompt builder</p>
      <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">Pick a prompt to start</p>
      <ol className="mt-5 space-y-4 text-sm text-zinc-600 dark:text-zinc-400">
        {[
          ['Choose', 'Open any prompt from the list. Each one has a few blanks in square brackets.'],
          ['Fill the blanks', 'Type your details into the fields. The prompt updates as you type.'],
          ['Use it', 'Copy it, or open it straight in ChatGPT or Claude with everything filled in.'],
        ].map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white dark:bg-white dark:text-zinc-900">
              {i + 1}
            </span>
            <span>
              <span className="block font-medium text-zinc-900 dark:text-zinc-100">{t}</span>
              {d}
            </span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onTry}
        className="mt-6 inline-flex h-10 items-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      >
        Try it with Debug an Error
      </button>
    </div>
  );
}

function Builder({
  prompt: p,
  values,
  onChange,
  onReset,
  saved,
  onToggleSave,
  onClose,
  isSheet,
  onFlash,
}: {
  prompt: LibraryPrompt;
  values: Record<string, string>;
  onChange: (label: string, v: string) => void;
  onReset: () => void;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
  isSheet: boolean;
  onFlash: (msg: string) => void;
}) {
  const blanks = useMemo(() => blanksOf(p.body), [p.body]);
  const filledCount = blanks.filter((b) => (values[b] ?? '').trim()).length;
  const segments = useMemo(() => fillSegments(p.body, values), [p.body, values]);
  const text = useMemo(() => fillPrompt(p.body, values), [p.body, values]);
  const links = p.kind === 'chat' ? chatLinks(text) : null;
  const left = blanks.length - filledCount;
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      onFlash(left > 0 ? `Copied. ${left} blank${left === 1 ? '' : 's'} still in brackets.` : 'Prompt copied');
    } else {
      onFlash('Could not copy. Select the text and copy it manually.');
    }
  }

  async function onShare() {
    const ok = await copyText(`${window.location.origin}${window.location.pathname}#p=${p.id}`);
    onFlash(ok ? 'Link to this prompt copied' : 'Could not copy the link');
  }

  return (
    <div className="flex flex-col">
      {isSheet && <div aria-hidden="true" className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />}
      <div className="flex items-start justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-400">
            {CATEGORY_NAME[p.category]} {p.kind === 'image' ? '· Image prompt' : ''}
          </p>
          <h2 className="mt-1 text-lg font-semibold leading-snug text-zinc-900 dark:text-zinc-50">{p.title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            aria-label={saved ? 'Remove from saved' : 'Save this prompt'}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Copy a link to this prompt"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close prompt builder"
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm leading-relaxed text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <span className="font-semibold">Tip: </span>
          {p.tip}
        </p>

        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Fill the blanks</p>
            <p className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
              {filledCount} of {blanks.length} filled
            </p>
          </div>
          <div className="mb-4 h-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-[width] duration-300"
              style={{ width: `${blanks.length ? (filledCount / blanks.length) * 100 : 100}%` }}
            />
          </div>
          <div className="space-y-3">
            {blanks.map((label, i) => {
              const { name, hint } = splitLabel(label);
              const id = `blank-${p.id}-${i}`;
              const common =
                'w-full rounded-xl border border-zinc-200 bg-white px-3 text-[15px] text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100';
              return (
                <div key={label}>
                  <label htmlFor={id} className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {name}
                  </label>
                  {isLongBlank(label) ? (
                    <textarea
                      id={id}
                      rows={4}
                      value={values[label] ?? ''}
                      onChange={(e) => onChange(label, e.target.value)}
                      placeholder={hint || 'Paste or type here'}
                      className={`${common} resize-y py-2.5 leading-relaxed`}
                    />
                  ) : (
                    <input
                      id={id}
                      type="text"
                      value={values[label] ?? ''}
                      onChange={(e) => onChange(label, e.target.value)}
                      placeholder={hint}
                      className={`${common} h-11`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Your prompt</p>
            {filledCount > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <RotateCcw aria-hidden="true" className="h-3 w-3" />
                Clear
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-white p-3.5 font-mono text-[13px] leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            {segments.map((s, i) =>
              s.blank ? (
                <mark
                  key={i}
                  className={
                    s.filled
                      ? 'rounded bg-emerald-100 px-0.5 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200'
                      : 'rounded bg-amber-100 px-0.5 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200'
                  }
                >
                  {s.text}
                </mark>
              ) : (
                <span key={i}>{s.text}</span>
              )
            )}
          </div>
        </div>

        <div className="sticky bottom-0 -mx-4 space-y-2 border-t border-zinc-200 bg-white/95 px-4 pb-4 pt-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:-mx-5 sm:px-5 lg:bg-zinc-50/95 lg:dark:bg-zinc-900/95">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy prompt'}
          </button>
          {p.kind === 'chat' &&
            (links ? (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={links.chatgpt}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <span className="max-[359px]:hidden">Open in&nbsp;</span>ChatGPT
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
                <a
                  href={links.claude}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-zinc-300 bg-white px-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  <span className="max-[359px]:hidden">Open in&nbsp;</span>Claude
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                This prompt is too long to send in a link. Copy it and paste it into your AI assistant instead.
              </p>
            ))}
        </div>
        <p className="!mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          {p.kind === 'image'
            ? 'Paste this into Midjourney, DALL·E, Stable Diffusion or the image tool you use.'
            : 'Works in ChatGPT, Claude, Gemini and other chat assistants. What you type here stays in your browser until you copy it or open it in one of them.'}
          {left > 0 ? ` ${left} blank${left === 1 ? ' is' : 's are'} still empty and will stay in brackets.` : ''}
        </p>
      </div>
    </div>
  );
}
