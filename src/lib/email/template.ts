// Email templates use [Label] for blanks, the same way as the prompt library.
// "[Their name, e.g. Ms Khan]" shows "e.g. Ms Khan" as the placeholder, and the
// value is stored under "Their name", so it carries across tones.

export type Tone = 'friendly' | 'professional' | 'formal';

export const TONES: { id: Tone; name: string; hint: string }[] = [
  { id: 'friendly', name: 'Friendly', hint: 'Warm and relaxed, for people you know' },
  { id: 'professional', name: 'Professional', hint: 'Clear and polite, for most work email' },
  { id: 'formal', name: 'Formal', hint: 'Official, for HR, legal or first contact' },
];

export type ScenarioGroup = 'Job search' | 'At work' | 'Clients and freelance' | 'Everyday';

export const GROUPS: ScenarioGroup[] = ['Job search', 'At work', 'Clients and freelance', 'Everyday'];

export interface EmailDraft {
  subject: string;
  body: string;
}

export interface Scenario {
  id: string;
  name: string;
  group: ScenarioGroup;
  blurb: string;
  tones: Record<Tone, EmailDraft>;
}

const BLANK = /\[([^\]\n]{1,80})\]/g;

export function splitLabel(raw: string): { key: string; hint: string } {
  const i = raw.indexOf(', e.g. ');
  return i === -1 ? { key: raw.trim(), hint: raw.trim() } : { key: raw.slice(0, i).trim(), hint: raw.slice(i + 2).trim() };
}

export type Part = { kind: 'text'; text: string } | { kind: 'blank'; key: string; hint: string };

export function parts(text: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(BLANK)) {
    if (m.index! > last) out.push({ kind: 'text', text: text.slice(last, m.index) });
    out.push({ kind: 'blank', ...splitLabel(m[1]) });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', text: text.slice(last) });
  return out;
}

// Unique blanks in reading order, subject first.
export function blanksOf(draft: EmailDraft): { key: string; hint: string }[] {
  const seen = new Set<string>();
  const out: { key: string; hint: string }[] = [];
  for (const p of [...parts(draft.subject), ...parts(draft.body)]) {
    if (p.kind === 'blank' && !seen.has(p.key)) {
      seen.add(p.key);
      out.push({ key: p.key, hint: p.hint });
    }
  }
  return out;
}

// Fills the blanks. A value that starts a sentence gets a capital first letter.
export function fill(text: string, values: Record<string, string>): string {
  let out = '';
  for (const p of parts(text)) {
    if (p.kind === 'text') {
      out += p.text;
      continue;
    }
    let v = values[p.key]?.trim() || `[${p.key}]`;
    if (/(^|[.!?]\s+|\n)$/.test(out)) v = v.charAt(0).toUpperCase() + v.slice(1);
    out += v;
  }
  return out;
}
