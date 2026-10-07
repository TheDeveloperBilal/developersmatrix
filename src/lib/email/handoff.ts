import type { Tone } from './template';

// Builds a ready prompt for ChatGPT or Claude. The page never sends the text
// anywhere itself; the visitor chooses to open it in one of those tools.

export type AiTask = 'reply' | 'rewrite';

export const REPLY_GOALS = [
  { id: 'yes', label: 'Say yes' },
  { id: 'no', label: 'Say no politely' },
  { id: 'question', label: 'Ask a question first' },
  { id: 'later', label: 'Confirm and reply later' },
  { id: 'conditions', label: 'Yes, with conditions' },
] as const;

export const REWRITE_GOALS = [
  { id: 'shorter', label: 'Shorter' },
  { id: 'clearer', label: 'Clearer' },
  { id: 'polite', label: 'More polite' },
  { id: 'direct', label: 'More direct' },
  { id: 'grammar', label: 'Fix grammar and spelling' },
  { id: 'english', label: 'More natural English' },
] as const;

export type Length = 'short' | 'medium' | 'keep';

export const LENGTHS: { id: Length; label: string }[] = [
  { id: 'short', label: 'Short' },
  { id: 'medium', label: 'Medium' },
  { id: 'keep', label: 'Any length' },
];

const TONE_WORDS: Record<Tone, string> = {
  friendly: 'friendly and warm, but still clear',
  professional: 'professional, clear and polite',
  formal: 'formal and respectful',
};

const LENGTH_WORDS: Record<Length, string> = {
  short: 'Keep it under 80 words.',
  medium: 'Keep it under 150 words.',
  keep: '',
};

const REPLY_WORDS: Record<string, string> = {
  yes: 'say yes to what they asked',
  no: 'politely say no, without over apologizing',
  question: 'ask the questions I need answered before I can decide',
  later: 'confirm I received it and say when I will reply in full',
  conditions: 'say yes, with the conditions in my notes',
};

const REWRITE_WORDS: Record<string, string> = {
  shorter: 'make it shorter',
  clearer: 'make it clearer and easier to scan',
  polite: 'make it more polite',
  direct: 'make it more direct',
  grammar: 'fix grammar and spelling',
  english: 'make the English sound natural, as a fluent speaker would write it',
};

const RULES = [
  'Keep every name, date, number and fact exactly as given.',
  'Do not invent details, promises or deadlines. If something important is missing, put it in [square brackets] for me to fill in.',
  'Avoid stock phrases such as "I hope this email finds you well".',
  'Return a subject line on the first line, then the email.',
];

export function buildPrompt(opts: {
  task: AiTask;
  text: string;
  tone: Tone;
  length: Length;
  replyGoal: string;
  rewriteGoals: string[];
  notes: string;
}): string {
  const { task, text, tone, length, replyGoal, rewriteGoals, notes } = opts;
  const lines: string[] = [];
  if (task === 'reply') {
    lines.push(`Write a reply to the email below. I want to ${REPLY_WORDS[replyGoal] || REPLY_WORDS.yes}.`);
    if (notes.trim()) lines.push(`Points to include: ${notes.trim()}`);
  } else {
    const goals = rewriteGoals.map((g) => REWRITE_WORDS[g]).filter(Boolean);
    lines.push(`Rewrite my email draft below${goals.length ? ` to ${goals.join(', ')}` : ''}.`);
    if (notes.trim()) lines.push(`Also: ${notes.trim()}`);
  }
  lines.push(`Tone: ${TONE_WORDS[tone]}.`);
  if (LENGTH_WORDS[length]) lines.push(LENGTH_WORDS[length]);
  lines.push('', 'Rules:', ...RULES.map((r, i) => `${i + 1}. ${r}`), '');
  lines.push(task === 'reply' ? 'The email I received:' : 'My draft:');
  lines.push('"""', text.trim(), '"""');
  return lines.join('\n');
}

// Links that open the visitor's own mail app or webmail with a draft.
export function mailLinks(to: string, subject: string, body: string) {
  const e = encodeURIComponent;
  return {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${e(to)}&su=${e(subject)}&body=${e(body)}`,
    outlook: `https://outlook.office.com/mail/deeplink/compose?to=${e(to)}&subject=${e(subject)}&body=${e(body)}`,
    mailto: `mailto:${e(to)}?subject=${e(subject)}&body=${e(body)}`,
  };
}
