/**
 * Builds a summary suggestion from what the person already entered. It only
 * rearranges their own facts: title, time in the field, main skills and their
 * strongest numbered result. If something is missing, it says so instead of
 * filling the gap.
 */

import { bulletLines, monthsOfExperience, type Resume } from './types';

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

function lowerFirst(t: string) {
  return /^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t;
}

function list(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function article(word: string) {
  const w = word.trim();
  if (/^U[A-Z]/.test(w) || /^(uni|use|usu|euro|one)/i.test(w)) return 'a';
  if (/^[aeiou]/i.test(w) || /^[FHLMNRSX][A-Z]/.test(w)) return 'an';
  return 'a';
}

export interface SummaryDraft {
  text: string;
  missing: string[];
}

export function draftSummary(r: Resume, now = new Date()): SummaryDraft {
  const missing: string[] = [];
  const latest = r.roles.find((x) => x.current) ?? r.roles.find((x) => x.title.trim());
  const title = (r.contact.headline || latest?.title || '').trim();
  if (!title) missing.push('a headline or job title');

  const months = monthsOfExperience(r.roles, now);
  const years = Math.floor(months / 12);
  let opener = '';
  if (title) {
    const t = title.charAt(0).toUpperCase() + title.slice(1);
    if (years >= 1) {
      const y = years <= 10 ? NUMBER_WORDS[years] : String(years);
      opener = `${t} with ${y} year${years === 1 ? '' : 's'} of experience`;
    } else if (months > 0) {
      opener = `Early career ${t}`;
    } else {
      opener = t;
      missing.push('dates on your roles');
    }
  }

  const skills = r.skills.slice(0, 3);
  if (skills.length === 0) missing.push('skills');

  const bullets = [...r.roles.flatMap((x) => bulletLines(x.bullets)), ...r.projects.flatMap((x) => bulletLines(x.bullets))];
  const best = bullets.find((b) => /\d/.test(b)) ?? bullets[0];
  if (!best) missing.push('at least one result in your experience');

  const sentences: string[] = [];
  if (opener) sentences.push(skills.length ? `${opener}, working mainly with ${list(skills)}.` : `${opener}.`);
  else if (skills.length) sentences.push(`Works mainly with ${list(skills)}.`);

  if (best) {
    const clean = best.replace(/[.;]+$/, '');
    const first = clean.split(/\s+/)[0];
    if (/ed$/i.test(first) || /^(built|led|cut|grew|ran|won|made|shipped|wrote|rebuilt|set|drove|took|brought)$/i.test(first)) {
      sentences.push(`Most recently ${lowerFirst(clean)}.`);
    } else {
      sentences.push(`Recent result: ${lowerFirst(clean)}.`);
    }
  }

  if (latest?.company && latest.current && title) {
    sentences.push(`Currently at ${latest.company.trim()}, looking for ${article(title)} ${title.toLowerCase()} role where that experience counts.`);
  }

  return { text: sentences.join(' '), missing };
}
