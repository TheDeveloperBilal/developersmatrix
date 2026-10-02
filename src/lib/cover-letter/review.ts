/**
 * Checks the finished letter, including any edits the candidate makes in the
 * text box. These are the problems recruiters actually notice.
 */

import { findSkills } from './skills';
import type { JobMatch } from './compose';

export type Check = { id: string; ok: boolean; label: string; detail: string };

/** Phrases that make a letter sound like every other letter. */
const CLICHES = [
  'i am writing to express',
  'to whom it may concern',
  'team player',
  'hard worker',
  'hardworking',
  'go getter',
  'think outside the box',
  'results driven',
  'results oriented',
  'detail oriented',
  'self starter',
  'dynamic',
  'synergy',
  'passionate about',
  'leverage my skills',
  'leveraging my skills',
  'perfect fit',
  'ideal candidate',
  'fast paced environment',
  'proven track record',
  'excellent communication skills',
  'reputation for innovation',
  'i believe i would be',
  'i am confident that',
];

function norm(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9%]+/g, ' ');
}

export function letterWords(text: string): number {
  return (text.match(/[A-Za-z0-9][A-Za-z0-9'%.]*/g) || []).length;
}

/** Body words only, so the header and sign off do not count towards length. */
function bodyOf(text: string): string {
  const lines = text.split('\n');
  const start = lines.findIndex((l) => /^dear\b/i.test(l.trim()));
  let end = -1;
  for (let i = lines.length - 1; i > start; i--) {
    if (/^(kind regards|best wishes|thanks|best regards|sincerely|regards|thank you|warm regards|yours sincerely),?$/i.test(lines[i].trim())) {
      end = i;
      break;
    }
  }
  return lines.slice(start >= 0 ? start + 1 : 0, end > 0 ? end : undefined).join('\n');
}

export function reviewLetter(
  text: string,
  ctx: { company: string; jobTitle: string; length: 'short' | 'standard'; match: JobMatch | null }
): Check[] {
  const body = bodyOf(text);
  const n = norm(body);
  const words = letterWords(body);
  const [min, max] = ctx.length === 'short' ? [100, 250] : [150, 400];
  const checks: Check[] = [];

  checks.push({
    id: 'length',
    ok: words >= min && words <= max,
    label: `Length: ${words} words`,
    detail:
      words < min
        ? `Short for this format. Aim for ${min} to ${max} words so there is room for real evidence.`
        : words > max
          ? `Long. Recruiters skim, so cut it back to ${max} words or fewer.`
          : 'A length recruiters will actually read.',
  });

  const placeholder = /\[[^\]]{3,}\]/.test(body);
  checks.push({
    id: 'placeholder',
    ok: !placeholder,
    label: placeholder ? 'Placeholder still in the letter' : 'No placeholders left',
    detail: placeholder
      ? 'Replace the text in square brackets with your own words before you send it.'
      : 'Everything in the letter is your own content.',
  });

  const company = ctx.company.trim().toLowerCase();
  const mentionsCompany = company.length > 0 && body.toLowerCase().includes(company);
  checks.push({
    id: 'company',
    ok: mentionsCompany,
    label: mentionsCompany ? `Names ${ctx.company.trim()}` : 'Company name missing',
    detail: mentionsCompany ? 'The letter is clearly written for this company.' : 'Mention the company by name so it does not read like a template.',
  });

  const hasNumber = /\d/.test(body.replace(/\b(19|20)\d{2}\b/g, '')) || /\b(half|doubled|tripled|twice)\b/i.test(body);
  checks.push({
    id: 'numbers',
    ok: hasNumber,
    label: hasNumber ? 'Backs claims with numbers' : 'No numbers yet',
    detail: hasNumber
      ? 'Specific results make the letter believable.'
      : 'Add one measurable result: time saved, users reached, revenue, a percentage.',
  });

  const found = CLICHES.filter((c) => ` ${n} `.includes(` ${c} `));
  checks.push({
    id: 'cliches',
    ok: found.length === 0,
    label: found.length === 0 ? 'No stock phrases' : `${found.length} stock phrase${found.length > 1 ? 's' : ''}`,
    detail: found.length === 0 ? 'It does not lean on lines every recruiter has read before.' : `Rewrite or remove: "${found.join('", "')}".`,
  });

  if (ctx.match && ctx.match.posting.length > 0) {
    const inLetter = new Set(findSkills(body).map((h) => h.name));
    const top = ctx.match.matched.slice(0, 5);
    const used = top.filter((s) => inLetter.has(s));
    const ok = top.length === 0 ? false : used.length >= Math.min(2, top.length);
    checks.push({
      id: 'keywords',
      ok,
      label: top.length === 0 ? 'No overlap with the posting' : `Uses ${used.length} of your ${top.length} matching skills`,
      detail:
        top.length === 0
          ? 'None of your listed skills appear in the job description. Check whether you use the tools they ask for under another name.'
          : ok
            ? 'The words the recruiter searches for are in the letter, in context.'
            : `Work these into the letter: ${top.filter((s) => !inLetter.has(s)).join(', ')}.`,
    });
  }

  const sentences = body.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
  const iStarts = sentences.filter((s) => /^I\b/.test(s.trim())).length;
  const tooManyI = sentences.length >= 5 && iStarts / sentences.length > 0.6;
  checks.push({
    id: 'variety',
    ok: !tooManyI,
    label: tooManyI ? 'Too many sentences start with "I"' : 'Varied sentence openings',
    detail: tooManyI ? 'Start a few sentences with the result or the context instead.' : 'It reads like a person, not a list of claims.',
  });

  return checks;
}
