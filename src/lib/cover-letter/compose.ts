/**
 * Builds the letter from the candidate's own facts. Every sentence comes from
 * something they typed or from the job description. Nothing is invented: if
 * a reason to join the company is missing, the letter says so in a bracket
 * the candidate has to replace, rather than filling the gap with flattery.
 */

import { CONTEXT_SKILLS, findSkills, parseSkillList, type SkillHit } from './skills';
import type { LetterInput } from './validate';

export type JobMatch = {
  /** Skills the posting mentions, most mentioned first. */
  posting: string[];
  /** Posting skills the candidate also listed or described. */
  matched: string[];
  /** Posting skills the candidate did not mention. Never added to the letter. */
  missing: string[];
};

export function analyseJob(input: LetterInput): JobMatch | null {
  if (!input.jobDescription.trim()) return null;
  const posting: SkillHit[] = findSkills(input.jobDescription);
  const mine = new Set(
    [
      ...parseSkillList(input.skills),
      ...findSkills(`${input.skills}\n${input.currentRole}\n${input.achievement1}\n${input.achievement2}`).map((h) => h.name),
    ].map((s) => s.toLowerCase())
  );
  const matched = posting.filter((h) => mine.has(h.name.toLowerCase())).map((h) => h.name);
  const missing = posting.filter((h) => !mine.has(h.name.toLowerCase()) && !CONTEXT_SKILLS.has(h.name)).map((h) => h.name);
  return { posting: posting.map((h) => h.name), matched, missing };
}

/* ------------------------------------------------------------- helpers */

const PAST_VERBS = new Set(
  (
    'built rebuilt led ran made wrote rewrote grew cut won set drove took shipped launched created designed developed ' +
    'reduced increased improved raised lowered saved delivered managed migrated moved automated scaled optimised optimized ' +
    'introduced implemented redesigned refactored owned started founded closed sold hired mentored trained coached taught ' +
    'negotiated organised organized published produced replaced fixed resolved halved doubled tripled boosted streamlined ' +
    'simplified deployed integrated analysed analyzed researched tested wrote spoke presented secured earned generated ' +
    'helped supported partnered collaborated coordinated planned prioritised prioritized reorganised reorganized rolled ' +
    'turned brought kept got gave made opened recovered prevented caught found spotted shortened sped trimmed'
  ).split(' ')
);

function clean(text: string): string {
  return text.trim().replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1');
}

function endSentence(text: string): string {
  const t = clean(text);
  if (!t) return t;
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

function upperFirst(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

function lowerFirst(text: string): string {
  // Keep acronyms and names as typed: only lower a capital followed by a lower case letter.
  return /^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

function article(word: string): string {
  const w = word.trim().toLowerCase();
  if (/^(hour|honest|heir)/.test(w)) return 'an';
  if (/^(uni|use|usu|euro|one)/.test(w)) return 'a';
  if (/^U[A-Z]/.test(word.trim())) return 'a';
  if (/^[aeiou]/.test(w)) return 'an';
  // Acronyms read letter by letter: an SRE, an ML engineer, a QA lead.
  if (/^[FHLMNRSX][A-Z]/.test(word.trim())) return 'an';
  return 'a';
}

function list(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/** Turn an achievement the candidate typed into a first person sentence. */
export function achievementSentence(text: string): string {
  const t = clean(text).replace(/^[-*•]\s*/, '');
  if (!t) return '';
  const first = t.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  if (/^(i|i'm|i've|my|we|our|in|at|while|during|after|when|as|last|this|over|within|across)$/.test(first)) {
    return endSentence(upperFirst(t));
  }
  if (PAST_VERBS.has(first) || (/ed$/.test(first) && first.length > 4)) {
    return endSentence(`I ${lowerFirst(t)}`);
  }
  if (DUTY_VERBS.has(first) || /^(was|am|have|had|became|got)$/.test(first)) return endSentence(`I ${lowerFirst(t)}`);
  return endSentence(`One result I am proud of: ${lowerFirst(t)}`);
}

function roleSentence(role: string, years: string): string {
  const r = clean(role).replace(/\.$/, '');
  const asA = /^(a|an|the)\s/i.test(r) ? r : `${article(r)} ${r}`;
  if (/student|graduate|intern|bootcamp|studying/i.test(r)) return `I am currently ${lowerFirst(asA)}.`;
  if (years === '0') return `I am early in my career and currently work as ${asA}.`;
  if (years === '1') return `For the past year I have worked as ${asA}.`;
  if (years === '10+') return `I have more than ten years of experience, most recently as ${asA}.`;
  const spelled = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][Number(years)] || years;
  if (years) return `For the past ${spelled} years I have worked as ${asA}.`;
  return `I currently work as ${asA}.`;
}

/* ------------------------------------------------ job description lines */

const GERUND_EXCEPTIONS: Record<string, string> = {
  run: 'running', plan: 'planning', ship: 'shipping', set: 'setting', get: 'getting', debug: 'debugging', map: 'mapping',
};

const DUTY_VERBS = new Set(
  (
    'build design develop maintain improve write work collaborate partner mentor lead own drive create ship deliver scale ' +
    'optimize optimise implement support help run manage analyze analyse plan define launch test review automate monitor ' +
    'migrate architect contribute research champion establish grow measure report present coordinate operate deploy ' +
    'integrate troubleshoot debug map craft shape execute prioritize prioritise produce set get'
  ).split(' ')
);

function gerund(verb: string): string {
  const v = verb.toLowerCase();
  if (GERUND_EXCEPTIONS[v]) return GERUND_EXCEPTIONS[v];
  if (v.endsWith('e') && !v.endsWith('ee')) return `${v.slice(0, -1)}ing`;
  return `${v}ing`;
}

/**
 * Pick one duty from the posting that the candidate clearly matches, and
 * turn "Build fast UIs with React" into "building fast UIs with React".
 */
export function dutyFromPosting(jd: string, matched: string[]): string | null {
  if (!jd.trim() || matched.length === 0) return null;
  const candidates = jd
    .split(/\n|(?<=[.;])\s+/)
    .map((l) => l.replace(/^[\s\-*•·▪◦>\d.)]+/, '').trim().replace(/[.;:,]+$/, ''))
    .filter((l) => {
      const n = l.split(/\s+/).length;
      return n >= 4 && n <= 22;
    })
    .map((l) => {
      const first = l.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
      const hits = findSkills(l).filter((h) => matched.includes(h.name)).length;
      return { l, first, hits };
    })
    .filter((c) => c.hits > 0 && DUTY_VERBS.has(c.first))
    .sort((a, b) => b.hits - a.hits);
  const best = candidates[0];
  if (!best) return null;
  const rest = best.l.slice(best.l.indexOf(' ') + 1);
  const phrase = `${gerund(best.first)} ${rest}`
    .replace(/\bour\b/gi, 'your')
    .replace(/\bwe\b/gi, 'you')
    .replace(/\bus\b/g, 'you');
  return phrase;
}

const DUTY_LINES: Record<LetterInput['tone'], (duty: string) => string> = {
  professional: (d) => `The posting mentions ${d}, which is very close to my current work.`,
  warm: (d) => `I noticed the role involves ${d}, which is exactly the kind of work I enjoy.`,
  direct: (d) => `The role involves ${d}. That is my day job now.`,
};

function extraSentence(text: string): string {
  const t = clean(text);
  if (!t) return '';
  const first = t.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, '');
  if (/^(i|my|i'm|i've)$/.test(first)) return endSentence(upperFirst(t));
  if (PAST_VERBS.has(first) || DUTY_VERBS.has(first) || /ed$/.test(first)) return endSentence(`I also ${lowerFirst(t)}`);
  return endSentence(upperFirst(t));
}

/* ------------------------------------------------------------- compose */

const OPENINGS: Record<LetterInput['tone'], ((job: string, company: string) => string)[]> = {
  professional: [
    (j, c) => `I am applying for the ${j} position at ${c}.`,
    (j, c) => `Please consider my application for the ${j} role at ${c}.`,
    (j, c) => `I would like to be considered for the ${j} role at ${c}.`,
  ],
  warm: [
    (j, c) => `I was glad to see the ${j} opening at ${c}, and I would love to be considered.`,
    (j, c) => `The ${j} role at ${c} lines up closely with the work I enjoy most, so I wanted to apply.`,
    (j, c) => `I have been hoping a role like the ${j} position at ${c} would open up, and I am excited to apply.`,
  ],
  direct: [
    (j, c) => `I am applying for the ${j} role at ${c}. Here is the short version of why I fit.`,
    (j, c) => `You are hiring ${article(j)} ${j}, and I think I can help ${c} from the first month.`,
    (j, c) => `I would like to join ${c} as your next ${j}.`,
  ],
};

const SKILL_LINES: Record<LetterInput['tone'], (skills: string, fromPosting: boolean) => string> = {
  professional: (s, p) => (p ? `Most of that work has been with ${s}, which your posting lists as core to the role.` : `My main tools are ${s}.`),
  warm: (s, p) => (p ? `Day to day I work with ${s}, which I noticed are central to this role too.` : `Day to day I work with ${s}.`),
  direct: (s, p) => (p ? `I use ${s} every week, and your posting asks for exactly that.` : `I work mainly with ${s}.`),
};

const CLOSINGS: Record<LetterInput['tone'], (company: string) => string[]> = {
  professional: (c) => [
    `Thank you for your time and consideration. It would be a pleasure to discuss how I could contribute to ${c}.`,
    `Thank you for considering my application. I would be glad to talk through any of this in more detail.`,
  ],
  warm: (c) => [
    `Thank you for reading. If it sounds like a good fit, it would be great to hear more about what the team at ${c} is working on.`,
    `If this sounds like a good match, a conversation would be wonderful. Thank you for your time.`,
  ],
  direct: (c) => [
    `I would be happy to walk you through this work on a short call. Thanks for your time.`,
    `If this sounds useful to ${c}, I am available for a call this week. Thanks for reading.`,
  ],
};

const SIGN_OFF: Record<LetterInput['tone'], string> = {
  professional: 'Kind regards,',
  warm: 'Best wishes,',
  direct: 'Thanks,',
};

/** Add a lead in to a sentence that starts with "I ", for variety. */
function withLead(lead: string, sentence: string): string {
  if (!/^I\s/.test(sentence)) return sentence;
  return `${lead}${sentence}`;
}

export const WHY_PLACEHOLDER_PREFIX = '[Add one line on why ';

export function composeLetter(input: LetterInput, variant = 0, today = new Date()): string {
  const job = clean(input.jobTitle);
  const company = clean(input.company);
  const match = analyseJob(input);

  const mySkills = parseSkillList(input.skills);
  // Lead with skills the posting asks for, in the posting's order.
  const canonical = (skill: string) => (findSkills(skill)[0]?.name ?? skill).toLowerCase();
  const matchedSet = new Set((match?.matched ?? []).map((m) => m.toLowerCase()));
  // Use the candidate's own wording, but put the skills the posting asks for first.
  const ordered = match
    ? [...mySkills.filter((s) => matchedSet.has(canonical(s))), ...mySkills.filter((s) => !matchedSet.has(canonical(s)))]
    : mySkills;
  const featured = ordered.slice(0, input.length === 'short' ? 3 : 4);
  const fromPosting = !!match && featured.length >= 2 && featured.slice(0, 2).every((s) => matchedSet.has(canonical(s)));

  const opening = OPENINGS[input.tone][variant % OPENINGS[input.tone].length](job, company);
  const why = input.whyCompany.trim()
    ? endSentence(upperFirst(clean(input.whyCompany)))
    : `${WHY_PLACEHOLDER_PREFIX}${company}: a product you use, a recent launch, or something their team has written.]`;

  const p1 = `${opening} ${why}`;

  const p2Parts = [roleSentence(input.currentRole, input.years)];
  if (featured.length > 0) p2Parts.push(SKILL_LINES[input.tone](list(featured), fromPosting));
  p2Parts.push(withLead('In that role, ', achievementSentence(input.achievement1)));
  const p2 = p2Parts.join(' ');

  const paragraphs = [p1, p2];

  if (input.length === 'standard') {
    const p3: string[] = [];
    const duty = match ? dutyFromPosting(input.jobDescription, match.matched) : null;
    if (duty) p3.push(DUTY_LINES[input.tone](duty));
    if (input.achievement2.trim()) p3.push(withLead('On another project, ', achievementSentence(input.achievement2)));
    if (input.extra.trim()) p3.push(extraSentence(input.extra));
    if (input.achievement2.trim()) {
      p3.push(
        input.tone === 'direct'
          ? `That is the kind of result I would aim for at ${company}.`
          : input.tone === 'warm'
            ? `I would bring the same care to the work at ${company}.`
            : `I would bring the same approach to this role at ${company}.`
      );
    }
    if (p3.length > 0) paragraphs.push(p3.join(' '));
  } else {
    const more = [input.achievement2.trim() ? withLead('On another project, ', achievementSentence(input.achievement2)) : '', extraSentence(input.extra)]
      .filter(Boolean)
      .join(' ');
    if (more) paragraphs[1] = `${p2} ${more}`;
  }

  const closings = CLOSINGS[input.tone](company);
  paragraphs.push(closings[variant % closings.length]);

  const contact = [clean(input.email), clean(input.phone), clean(input.link)].filter(Boolean).join(' | ');
  const date = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const greeting = input.manager.trim() ? `Dear ${clean(input.manager)},` : `Dear ${company} hiring team,`;

  return [
    clean(input.name),
    contact,
    '',
    date,
    '',
    `Re: ${job}`,
    '',
    greeting,
    '',
    paragraphs.join('\n\n'),
    '',
    SIGN_OFF[input.tone],
    clean(input.name),
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n');
}
