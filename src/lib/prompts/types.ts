// Shared types and helpers for the AI Prompt Library.
// Blanks in a prompt are written as [Label]. The builder turns each distinct
// label into one field, so a label used twice is filled once.

export type PromptCategory =
  | 'coding'
  | 'writing'
  | 'marketing'
  | 'business'
  | 'career'
  | 'learning'
  | 'productivity'
  | 'creative';

/** chat = any chat assistant (ChatGPT, Claude, Gemini). image = image generators. */
export type PromptKind = 'chat' | 'image';

export interface LibraryPrompt {
  id: string; // url safe slug, also used in the share link
  title: string;
  category: PromptCategory;
  kind: PromptKind;
  summary: string; // one line shown on the card
  tip: string; // one practical tip for better results
  tags: string[];
  body: string;
}

export const CATEGORIES: { id: PromptCategory; name: string; blurb: string }[] = [
  { id: 'coding', name: 'Coding', blurb: 'Debug, review, test and explain code' },
  { id: 'writing', name: 'Writing', blurb: 'Drafts, edits and rewrites' },
  { id: 'marketing', name: 'Marketing', blurb: 'Copy, SEO and campaigns' },
  { id: 'business', name: 'Business', blurb: 'Strategy, plans and analysis' },
  { id: 'career', name: 'Career', blurb: 'Jobs, interviews and growth' },
  { id: 'learning', name: 'Learning', blurb: 'Understand and remember anything' },
  { id: 'productivity', name: 'Productivity', blurb: 'Plans, notes and decisions' },
  { id: 'creative', name: 'Creative', blurb: 'Stories, ideas and images' },
];

const BLANK = /\[([^\[\]\n]{1,60})\]/g;

/** Distinct blank labels in the order they first appear. */
export function blanksOf(body: string): string[] {
  const seen: string[] = [];
  for (const m of body.matchAll(BLANK)) {
    const label = m[1].trim();
    if (label && !seen.includes(label)) seen.push(label);
  }
  return seen;
}

/** Labels that usually need more than one line get a textarea. */
export function isLongBlank(label: string): boolean {
  return /^(paste|describe|list|notes|your notes|your draft|the text)/i.test(label);
}

export interface Segment {
  text: string;
  blank?: string; // set when this segment is a blank (filled or not)
  filled?: boolean;
}

/** Splits a prompt into plain text and blank segments, filling what we can. */
export function fillSegments(body: string, values: Record<string, string>): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of body.matchAll(BLANK)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: body.slice(last, at) });
    const label = m[1].trim();
    const v = (values[label] ?? '').trim();
    out.push(v ? { text: v, blank: label, filled: true } : { text: m[0], blank: label, filled: false });
    last = at + m[0].length;
  }
  if (last < body.length) out.push({ text: body.slice(last) });
  return out;
}

export function fillPrompt(body: string, values: Record<string, string>): string {
  return fillSegments(body, values)
    .map((s) => s.text)
    .join('');
}

/** Lower case search text for a prompt. */
export function haystack(p: LibraryPrompt): string {
  return [p.title, p.summary, p.tags.join(' '), p.body, p.category].join(' ').toLowerCase();
}

// Prefilled chat links. Both services read the q parameter. Very long URLs
// break in some browsers, so the builder only offers these under this size.
export const MAX_LINK_LENGTH = 6000;

export function chatLinks(text: string): { chatgpt: string; claude: string } | null {
  const q = encodeURIComponent(text);
  const chatgpt = `https://chatgpt.com/?q=${q}`;
  const claude = `https://claude.ai/new?q=${q}`;
  if (claude.length > MAX_LINK_LENGTH) return null;
  return { chatgpt, claude };
}
