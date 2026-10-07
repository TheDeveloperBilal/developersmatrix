'use client';

import { useEffect, useRef, useState } from 'react';

// Shared helpers for the Budget Planner, Habit Tracker and Productivity Planner.
// Everything is saved in the visitor's own browser. Nothing is sent to a server.

export function readStored<T>(key: string, check: (v: unknown) => v is T): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return check(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStored(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage blocked: nothing to remove */
  }
}

/**
 * State that loads from localStorage after the first render (so the server
 * HTML and the first client render match) and saves on every change.
 * `ready` is false until the saved copy has been read.
 */
export function useStoredState<T>(key: string, initial: T, check: (v: unknown) => v is T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(true);
  const checkRef = useRef(check);

  useEffect(() => {
    const stored = readStored(key, checkRef.current);
    if (stored) setValue(stored);
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    setSaved(writeStored(key, value));
  }, [key, value, ready]);

  return [value, setValue, ready, saved] as const;
}

export function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* ---------------- Dates (local time, YYYY-MM-DD keys) ---------------- */

const pad = (n: number) => String(n).padStart(2, '0');

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, n: number): string {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

/** Whole days from a to b (b later gives a positive number). */
export function daysBetween(a: string, b: string): number {
  return Math.round((parseKey(b).getTime() - parseKey(a).getTime()) / 86400000);
}

export function isDateKey(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function shortDate(key: string): string {
  const d = parseKey(key);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function weekdayLetter(key: string): string {
  return DAYS[parseKey(key).getDay()].slice(0, 1);
}

export function weekday(key: string): number {
  return parseKey(key).getDay();
}

export function monthName(index: number, long = false): string {
  return (long ? MONTHS_LONG : MONTHS)[((index % 12) + 12) % 12];
}
