"use client";

import { useId, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import type { RateSource } from "@/lib/hardware/frame-rates";

export type PickerItem = {
  name: string;
  brand: string;
  source: RateSource;
  integrated?: boolean;
};

const compact = (s: string) =>
  s
    .toLowerCase()
    // "r5 5600" is how many people write Ryzen 5 5600
    .replace(/\br([3579])\b/g, "ryzen $1")
    .replace(/[^a-z0-9]/g, "");

const SOURCE_LABEL: Record<RateSource, string> = {
  measured: "Review data",
  sibling: "Scaled",
  estimated: "Estimate",
};

const SOURCE_DOT: Record<RateSource, string> = {
  measured: "bg-emerald-500",
  sibling: "bg-sky-500",
  estimated: "bg-ink-300",
};

type Props = {
  label: string;
  /** Short tag shown before the label, such as CPU or GPU. */
  tag: string;
  tagClass: string;
  items: PickerItem[];
  value: string;
  onChange: (name: string) => void;
};

/**
 * Type to filter, arrow keys to move, Enter to pick. Only names from the list
 * can be chosen, so every result maps to a part we have figures for.
 */
export default function HardwareCombobox({ label, tag, tagClass, items, value, onChange }: Props) {
  const id = useId();
  const listId = `${id}-list`;
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const words = query.trim().split(/\s+/).map(compact).filter(Boolean);
    if (words.length === 0) return items;
    const matches = items.filter((item) => {
      const n = compact(item.name);
      return words.every((w) => n.includes(w));
    });
    // "rtx 3060" should offer the RTX 3060 before the faster 3060 Ti, so a name
    // that ends with exactly what was typed goes to the top.
    const whole = words.join("");
    const exact = (name: string) => compact(name).endsWith(whole);
    return [...matches.filter((m) => exact(m.name)), ...matches.filter((m) => !exact(m.name))];
  }, [items, query]);

  const choose = (name: string) => {
    onChange(name);
    setOpen(false);
    setQuery("");
  };

  const move = (to: number) => {
    const next = Math.max(0, Math.min(results.length - 1, to));
    setActive(next);
    const el = listRef.current?.children[next] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      move(open ? active + 1 : 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(active - 1);
    } else if (e.key === "Enter") {
      if (open && results[active]) {
        e.preventDefault();
        choose(results[active].name);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative">
      <label htmlFor={id} className="mb-1.5 flex items-center gap-2 text-[0.8125rem] font-medium text-ink-700">
        <span className={`rounded-md px-1.5 py-0.5 font-mono text-[0.625rem] font-semibold tracking-wider ${tagClass}`}>{tag}</span>
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          value={open ? query : value}
          placeholder={open ? value : "Type to search"}
          onFocus={() => {
            setOpen(true);
            setQuery("");
            setActive(Math.max(0, items.findIndex((i) => i.name === value)));
          }}
          onBlur={() => {
            setOpen(false);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          className="h-12 w-full rounded-xl border border-ink-200 bg-white pl-3.5 pr-10 text-[0.9375rem] text-ink-950 shadow-sm outline-none transition-colors placeholder:text-ink-400 focus:border-ink-400 focus:ring-4 focus:ring-ink-100"
        />
        <ChevronsUpDown aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      </div>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto overscroll-contain rounded-xl border border-ink-200 bg-white p-1 shadow-menu"
        >
          {results.length === 0 && (
            <li className="px-3 py-3 text-sm text-ink-500" role="presentation">
              No match. Try just the model number, such as 4060 or 5600.
            </li>
          )}
          {results.map((item, i) => (
            <li
              key={item.name}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={item.name === value}
              // Keep focus in the input so blur does not close the list first.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(item.name)}
              onMouseMove={() => active !== i && setActive(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                i === active ? "bg-ink-100 text-ink-950" : "text-ink-700"
              }`}
            >
              <span className="min-w-0 truncate">
                {item.name}
                {item.integrated && <span className="ml-2 text-[0.6875rem] text-ink-400">integrated</span>}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-[0.6875rem] text-ink-400">
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${SOURCE_DOT[item.source]}`} />
                {SOURCE_LABEL[item.source]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
