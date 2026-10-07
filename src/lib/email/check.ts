// Rule based email checker. It runs in the browser and only reports things it
// can actually see in the text. No score is invented: it lists what to fix.

export type Severity = 'fix' | 'improve' | 'note';

export interface Issue {
  id: string;
  severity: Severity;
  title: string;
  detail: string;
  // Character ranges in the body to highlight.
  ranges?: [number, number][];
  // The text that triggered it, for quoting.
  quote?: string;
}

export interface CheckResult {
  issues: Issue[];
  words: number;
  sentences: number;
  counts: Record<Severity, number>;
}

const VAGUE_SUBJECTS = new Set([
  'update', 'question', 'quick question', 'hi', 'hello', 'hey', 'follow up', 'following up', 'checking in',
  'request', 'important', 'urgent', 'fyi', 'info', 'information', 'help', 'meeting', 'email', 'note', 're', 'fw', 'fwd',
]);

const GREETING = /^(hi|hello|hey|dear|good (morning|afternoon|evening)|greetings|to whom it may concern)\b/i;
const SIGN_OFF = /^(best|best regards|kind regards|regards|warm regards|many thanks|thanks|thank you|thanks again|thanks either way|thanks for understanding|thanks for your patience|cheers|sincerely|yours sincerely|yours faithfully|yours truly|all the best|take care|talk soon|respectfully|with thanks|hope it goes well|thanks in advance)\b[,.!]?$/i;
const ASK = /\?|\b(could you|can you|would you|will you|please|let me know|are you (free|available|open)|i would (like|appreciate)|would it be possible|do you have|is there|when can|if you could)\b/i;

// Phrases worth cutting or replacing, with a plain suggestion.
const PHRASES: { re: RegExp; tip: string }[] = [
  { re: /\bi (just )?wanted to (reach out|touch base|check in|follow up)\b/gi, tip: 'Say the point directly, for example "I am following up on..."' },
  { re: /\bjust wanted to\b/gi, tip: '"Just" makes the request sound smaller than it is. Cut it.' },
  { re: /\bi was wondering if\b/gi, tip: 'Ask directly: "Could you..."' },
  { re: /\bsorry to bother you\b/gi, tip: 'Cut it. A clear, polite request is not a bother.' },
  { re: /\bi hope this (email|message) finds you well\b/gi, tip: 'A very common opener that readers skip. Start with your point or a specific line.' },
  { re: /\bper my last email\b/gi, tip: 'Can read as passive aggressive. Try "As I mentioned on [date]..."' },
  { re: /\bkindly do the needful\b/gi, tip: 'Say exactly what you need done and by when.' },
  { re: /\bplease advise\b/gi, tip: 'Ask the actual question you need answered.' },
  { re: /\bat your earliest convenience\b/gi, tip: 'Vague. Give a date if timing matters.' },
  { re: /\b(touch base|circle back)\b/gi, tip: 'Jargon. Say what you will actually do, for example "talk on Tuesday".' },
  { re: /\bneedless to say\b/gi, tip: 'If it is needless to say, cut it.' },
  { re: /\bthanks in advance\b/gi, tip: 'Can sound like the answer is assumed. "Thank you" or "Thanks for considering it" is softer.' },
  { re: /\bas soon as possible\b|\basap\b/gi, tip: 'Give a real date or time instead.' },
];

const HEDGES = /\b(i think|i feel like|i guess|maybe|perhaps|sort of|kind of|a bit|a little bit|just|actually|basically|literally|really|very|quite)\b/gi;
const ACRONYMS = new Set(['ASAP', 'FYI', 'CEO', 'CTO', 'CFO', 'HR', 'API', 'PDF', 'URL', 'USA', 'UK', 'EU', 'NDA', 'SEO', 'AI', 'IT', 'QA', 'UX', 'UI', 'ETA', 'EOD', 'OK', 'SQL', 'AWS', 'CSV', 'KPI', 'ROI', 'SLA', 'GDPR', 'PTO', 'ID']);

function words(s: string) {
  return (s.match(/[A-Za-z0-9']+/g) || []).length;
}

function sentencesOf(s: string) {
  return s
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => words(x) > 0);
}

function findAll(body: string, re: RegExp): [number, number][] {
  const out: [number, number][] = [];
  const r = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  for (const m of body.matchAll(r)) out.push([m.index!, m.index! + m[0].length]);
  return out;
}

export function checkEmail(subjectRaw: string, bodyRaw: string): CheckResult {
  const subject = subjectRaw.trim();
  const body = bodyRaw.replace(/\r\n/g, '\n');
  const issues: Issue[] = [];
  const add = (i: Issue) => issues.push(i);

  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  const totalWords = words(body);
  const sents = sentencesOf(body);

  // Placeholders left in
  const blanks = findAll(body + '\n' + subject, /\[[^\]\n]{1,80}\]/g);
  if (blanks.length) {
    add({
      id: 'placeholders',
      severity: 'fix',
      title: `${blanks.length} blank${blanks.length === 1 ? '' : 's'} still in brackets`,
      detail: 'Replace every [bracketed] part before sending.',
      ranges: findAll(body, /\[[^\]\n]{1,80}\]/g),
    });
  }

  // Subject line
  if (!subject) {
    add({ id: 'subject-empty', severity: 'fix', title: 'No subject line', detail: 'Emails without a subject are easy to ignore and hard to find later. Say what the email is about in a few words.' });
  } else {
    const plain = subject.toLowerCase().replace(/^(re|fw|fwd):\s*/i, '').replace(/[^a-z\s]/g, '').trim();
    if (VAGUE_SUBJECTS.has(plain) || words(subject) < 2) {
      add({ id: 'subject-vague', severity: 'improve', title: 'Subject line is vague', detail: `"${subject}" does not tell the reader what this is about. Add the topic, for example "Invoice 1042 due Friday".` });
    }
    if (subject.length > 70 || words(subject) > 10) {
      add({ id: 'subject-long', severity: 'improve', title: 'Subject line is long', detail: 'Long subjects get cut off in most inboxes, especially on phones. Keep the key words near the start.' });
    }
    if (subject.length > 6 && subject === subject.toUpperCase() && /[A-Z]/.test(subject)) {
      add({ id: 'subject-caps', severity: 'fix', title: 'Subject line is all capitals', detail: 'All capitals reads as shouting. Use normal capitalization.' });
    }
    if (/\burgent\b/i.test(subject)) {
      add({ id: 'subject-urgent', severity: 'note', title: '"Urgent" in the subject', detail: 'Use it only when it truly is. Saying why and by when in the subject works better.' });
    }
  }

  if (!totalWords) {
    return { issues, words: 0, sentences: 0, counts: tally(issues) };
  }

  // Greeting and sign off
  if (lines.length && !GREETING.test(lines[0])) {
    add({ id: 'greeting', severity: 'improve', title: 'No greeting', detail: 'Starting with "Hi [name]," or "Dear [name]," makes the email feel addressed to a person.' });
  }
  const tail = lines.slice(-3);
  if (!tail.some((l) => SIGN_OFF.test(l))) {
    add({ id: 'sign-off', severity: 'improve', title: 'No sign off', detail: 'End with a short sign off such as "Best regards," followed by your name.' });
  }

  // Length
  if (totalWords < 25) {
    add({ id: 'too-short', severity: 'improve', title: 'Very short', detail: `${totalWords} words can feel abrupt and may leave out the context the reader needs.` });
  } else if (totalWords > 250) {
    add({ id: 'too-long', severity: 'improve', title: 'Long email', detail: `${totalWords} words. Long emails are easy to skim past. Move background to the end or a link, and lead with what you need.` });
  }

  // Clear next step
  if (!ASK.test(body)) {
    add({ id: 'no-ask', severity: 'note', title: 'No clear next step', detail: 'If you need something from the reader, say what and by when. Fine to ignore for thank you notes and announcements.' });
  }

  // Phrases to replace
  const taken: [number, number][] = [];
  for (const p of PHRASES) {
    const ranges = findAll(body, p.re).filter(([a, b]) => !taken.some(([x, y]) => a < y && b > x));
    if (ranges.length) {
      taken.push(...ranges);
      const quote = body.slice(ranges[0][0], ranges[0][1]);
      add({ id: `phrase-${quote.toLowerCase()}`, severity: 'improve', title: `"${quote}"`, detail: p.tip, ranges, quote });
    }
  }

  // Hedging words
  const hedges = findAll(body, HEDGES);
  if (hedges.length >= 4 || (totalWords < 120 && hedges.length >= 3)) {
    const sample = Array.from(new Set(hedges.map(([a, b]) => body.slice(a, b).toLowerCase()))).slice(0, 5);
    add({ id: 'hedges', severity: 'improve', title: `${hedges.length} softening words`, detail: `Words like ${sample.map((s) => `"${s}"`).join(', ')} make the email sound unsure. Cut the ones that do not change the meaning.`, ranges: hedges });
  }

  // Apologies
  const sorry = findAll(body, /\b(sorry|apologi[sz]e|apologies)\b/gi);
  if (sorry.length >= 3) {
    add({ id: 'sorry', severity: 'improve', title: `Apologizes ${sorry.length} times`, detail: 'One clear apology is stronger than several. Keep one and focus on the fix.', ranges: sorry });
  }

  // Exclamation marks
  const bangs = findAll(body, /!+/g);
  if (/!!/.test(body)) {
    add({ id: 'double-bang', severity: 'fix', title: 'Double exclamation marks', detail: 'Use one at most.', ranges: findAll(body, /!{2,}/g) });
  } else if (bangs.length > 2) {
    add({ id: 'bangs', severity: 'improve', title: `${bangs.length} exclamation marks`, detail: 'More than one or two can read as over excited in a work email.', ranges: bangs });
  }

  // Shouting
  const caps = findAll(body, /\b[A-Z]{4,}\b/g).filter(([a, b]) => !ACRONYMS.has(body.slice(a, b)));
  if (caps.length >= 2) {
    add({ id: 'caps', severity: 'improve', title: 'Words in all capitals', detail: 'Capitals read as shouting. Use bold or a short sentence for emphasis instead.', ranges: caps });
  }

  // Long sentences
  const long = sents.filter((s) => words(s) > 35);
  if (long.length) {
    add({ id: 'long-sentence', severity: 'improve', title: `${long.length} very long sentence${long.length === 1 ? '' : 's'}`, detail: 'Over 35 words. Split it into two so the reader does not lose the thread.', quote: long[0].slice(0, 90) + (long[0].length > 90 ? '…' : '') });
  }

  // Long paragraphs
  const paras = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const bigPara = paras.find((p) => words(p) > 90);
  if (bigPara) {
    add({ id: 'long-paragraph', severity: 'improve', title: 'Wall of text', detail: 'A paragraph over 90 words is hard to read on a phone. Break it up, one idea per paragraph.' });
  }

  // Passive voice with "by", the clearest case
  const passive = findAll(body, /\b(was|were|is|are|been|being)\s+\w+ed\s+by\b/gi);
  if (passive.length) {
    add({ id: 'passive', severity: 'note', title: 'Passive phrasing', detail: 'Saying who did what reads more directly, for example "Sam approved the budget" instead of "the budget was approved by Sam".', ranges: passive });
  }

  // Repeated word typo
  const dup = findAll(body, /\b(\w+)\s+\1\b/gi).filter(([a, b]) => !/^(that that|had had)$/i.test(body.slice(a, b)));
  if (dup.length) {
    add({ id: 'repeat', severity: 'fix', title: 'Repeated word', detail: `"${body.slice(dup[0][0], dup[0][1])}" looks like a typo.`, ranges: dup });
  }

  // Attachment reminder
  if (/\b(attached|attachment|enclosed)\b/i.test(body)) {
    add({ id: 'attachment', severity: 'note', title: 'Mentions an attachment', detail: 'Remember to attach the file before you send.' });
  }

  const order: Record<Severity, number> = { fix: 0, improve: 1, note: 2 };
  issues.sort((a, b) => order[a.severity] - order[b.severity]);
  return { issues, words: totalWords, sentences: sents.length, counts: tally(issues) };
}

function tally(issues: Issue[]): Record<Severity, number> {
  return {
    fix: issues.filter((i) => i.severity === 'fix').length,
    improve: issues.filter((i) => i.severity === 'improve').length,
    note: issues.filter((i) => i.severity === 'note').length,
  };
}

// Merge overlapping ranges and split the body into plain and marked pieces.
export function highlight(body: string, issues: Issue[]): { text: string; severity?: Severity; title?: string }[] {
  const marks: { a: number; b: number; severity: Severity; title: string }[] = [];
  for (const i of issues) for (const [a, b] of i.ranges || []) if (b <= body.length) marks.push({ a, b, severity: i.severity, title: i.title });
  marks.sort((x, y) => x.a - y.a || y.b - x.b);
  const out: { text: string; severity?: Severity; title?: string }[] = [];
  let pos = 0;
  for (const m of marks) {
    if (m.a < pos) continue;
    if (m.a > pos) out.push({ text: body.slice(pos, m.a) });
    out.push({ text: body.slice(m.a, m.b), severity: m.severity, title: m.title });
    pos = m.b;
  }
  if (pos < body.length) out.push({ text: body.slice(pos) });
  return out;
}
