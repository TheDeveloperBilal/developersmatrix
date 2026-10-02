/**
 * Resume check. Plain rules a recruiter or an applicant tracking system would
 * trip over. Every finding points at the exact line it is about, so the person
 * can fix it, and nothing is rewritten for them behind their back.
 */

import { findSkills, CONTEXT_SKILLS } from '@/lib/cover-letter/skills';
import { looksMashed } from '@/lib/cover-letter/validate';
import { bulletLines, type Resume } from './types';

export type Severity = 'fix' | 'improve' | 'good';

export interface Finding {
  id: string;
  severity: Severity;
  area: 'Contact' | 'Summary' | 'Experience' | 'Projects' | 'Education' | 'Skills' | 'Overall';
  title: string;
  detail: string;
  /** The text the finding is about, when there is one. */
  quote?: string;
}

export interface CheckResult {
  score: number;
  findings: Finding[];
  bulletCount: number;
  bulletsWithNumbers: number;
  wordCount: number;
}

export const ACTION_VERBS = [
  'Built', 'Led', 'Designed', 'Shipped', 'Reduced', 'Increased', 'Cut', 'Launched', 'Automated', 'Migrated',
  'Improved', 'Created', 'Owned', 'Rebuilt', 'Scaled', 'Mentored', 'Delivered', 'Introduced', 'Grew', 'Saved',
];

const WEAK_OPENERS: [RegExp, string][] = [
  [/^responsible for\b/i, 'Responsible for'],
  [/^(worked|working) on\b/i, 'Worked on'],
  [/^helped( with| to)?\b/i, 'Helped'],
  [/^assisted( with| in)?\b/i, 'Assisted'],
  [/^involved in\b/i, 'Involved in'],
  [/^participated in\b/i, 'Participated in'],
  [/^tasked with\b/i, 'Tasked with'],
  [/^duties included\b/i, 'Duties included'],
  [/^in charge of\b/i, 'In charge of'],
];

const FILLER = [
  'team player', 'hard working', 'hardworking', 'detail oriented', 'self starter', 'go getter', 'results driven',
  'results oriented', 'passionate', 'synergy', 'think outside the box', 'dynamic', 'motivated individual',
  'proven track record', 'excellent communication skills', 'various', 'etc',
];

const PRESENT_TENSE_START = /^(build|lead|design|ship|reduce|increase|manage|develop|create|maintain|write|work|help|own|improve)\b/i;

function words(text: string) {
  return (text.match(/[A-Za-z0-9][A-Za-z0-9'%.+#]*/g) || []).length;
}

function hasNumber(text: string) {
  return /\d/.test(text) || /\b(half|doubled|tripled|twice|dozens?|hundreds?|thousands?|millions?)\b/i.test(text);
}

function clip(text: string, n = 70) {
  return text.length > n ? `${text.slice(0, n - 1)}…` : text;
}

export function resumeText(r: Resume): string {
  const parts = [
    r.contact.name,
    r.contact.headline,
    r.summary,
    ...r.roles.flatMap((x) => [x.title, x.company, x.bullets]),
    ...r.projects.flatMap((x) => [x.name, x.tech, x.bullets]),
    ...r.education.flatMap((x) => [x.school, x.degree, x.field, x.detail]),
    r.skills.join(', '),
    r.certifications,
  ];
  return parts.filter(Boolean).join('\n');
}

export function checkResume(r: Resume, opts: { pages: number }): CheckResult {
  const f: Finding[] = [];
  const add = (x: Finding) => f.push(x);

  /* ---------------- Contact ---------------- */
  const c = r.contact;
  if (!c.name.trim()) {
    add({ id: 'name', severity: 'fix', area: 'Contact', title: 'Add your name', detail: 'It is the first thing a recruiter and the tracking system read.' });
  } else {
    const ws = c.name.toLowerCase().match(/[a-z]+/g) || [];
    if (/\d/.test(c.name) || ws.length === 0 || ws.filter(looksMashed).length / ws.length >= 0.5 || /^(test|asdf|name|your name|john doe)$/i.test(c.name.trim())) {
      add({ id: 'name-junk', severity: 'fix', area: 'Contact', title: 'This does not look like a real name', detail: 'Use the name you want on the job offer.', quote: c.name });
    }
  }
  if (!c.email.trim()) add({ id: 'email', severity: 'fix', area: 'Contact', title: 'Add an email address', detail: 'Without it nobody can invite you to interview.' });
  else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(c.email.trim())) add({ id: 'email-bad', severity: 'fix', area: 'Contact', title: 'Email address looks wrong', detail: 'Check for a missing @ or domain.', quote: c.email });
  else if (/^(cool|hot|sexy|babe|xx|420|69)|[._](cool|hot|xx)\b/i.test(c.email)) add({ id: 'email-casual', severity: 'improve', area: 'Contact', title: 'Use a plain, professional email', detail: 'A firstname.lastname style address reads better.', quote: c.email });
  if (!c.phone.trim()) add({ id: 'phone', severity: 'improve', area: 'Contact', title: 'Add a phone number', detail: 'Many recruiters call before they email.' });
  if (!c.location.trim()) add({ id: 'location', severity: 'improve', area: 'Contact', title: 'Add your city and country', detail: 'Tracking systems often filter by location, and remote roles still check time zones.' });
  if (!c.linkedin.trim() && !c.website.trim()) add({ id: 'links', severity: 'improve', area: 'Contact', title: 'Add LinkedIn, GitHub or a portfolio', detail: 'One link where your work can be checked builds trust quickly.' });

  /* ---------------- Summary ---------------- */
  const sw = words(r.summary);
  if (!r.summary.trim()) {
    add({ id: 'summary', severity: 'improve', area: 'Summary', title: 'Add a short summary', detail: 'Two or three sentences: who you are, what you build, one result. Use the summary helper if you are stuck.' });
  } else {
    if (sw < 25) add({ id: 'summary-short', severity: 'improve', area: 'Summary', title: `Summary is short (${sw} words)`, detail: 'Aim for 30 to 70 words with one concrete result.' });
    if (sw > 90) add({ id: 'summary-long', severity: 'improve', area: 'Summary', title: `Summary is long (${sw} words)`, detail: 'Recruiters skim. Cut it to 70 words or fewer.' });
    if (/\b(I|me|my)\b/.test(r.summary)) add({ id: 'summary-i', severity: 'improve', area: 'Summary', title: 'Summary uses I or my', detail: 'Resumes are written without pronouns: "Frontend engineer with five years..." rather than "I am a frontend engineer".' });
    if (!hasNumber(r.summary)) add({ id: 'summary-num', severity: 'improve', area: 'Summary', title: 'Summary has no number', detail: 'Add years of experience or one measurable result.' });
  }

  /* ---------------- Experience ---------------- */
  const roles = r.roles.filter((x) => x.title.trim() || x.company.trim() || x.bullets.trim());
  let bulletCount = 0;
  let bulletsWithNumbers = 0;
  const verbUse = new Map<string, number>();

  const checkBullets = (area: 'Experience' | 'Projects', label: string, text: string) => {
    const lines = bulletLines(text);
    for (const line of lines) {
      bulletCount++;
      if (hasNumber(line)) bulletsWithNumbers++;
      const first = line.split(/\s+/)[0].replace(/[^A-Za-z]/g, '');
      if (first) verbUse.set(first.toLowerCase(), (verbUse.get(first.toLowerCase()) ?? 0) + 1);
      const weak = WEAK_OPENERS.find(([re]) => re.test(line));
      if (weak) {
        add({ id: `weak-${bulletCount}`, severity: 'fix', area, title: `Weak opener: "${weak[1]}"`, detail: `Start with what you did and what changed, for example "${ACTION_VERBS[bulletCount % ACTION_VERBS.length]}..." (${label}).`, quote: clip(line) });
      } else if (/^(i|my|we|our)\b/i.test(line)) {
        add({ id: `pron-${bulletCount}`, severity: 'improve', area, title: 'Bullet starts with a pronoun', detail: `Drop "I" or "We" and lead with the verb (${label}).`, quote: clip(line) });
      } else if (PRESENT_TENSE_START.test(line) && area === 'Experience') {
        const role = r.roles.find((x) => x.bullets.includes(line));
        if (role && !role.current) add({ id: `tense-${bulletCount}`, severity: 'improve', area, title: 'Past role written in present tense', detail: `Use past tense for jobs you have left (${label}).`, quote: clip(line) });
      }
      const n = words(line);
      if (n < 6) add({ id: `short-${bulletCount}`, severity: 'improve', area, title: 'Bullet is too thin', detail: `Say what you did, how, and what changed (${label}).`, quote: clip(line) });
      if (n > 35) add({ id: `long-${bulletCount}`, severity: 'improve', area, title: `Bullet runs ${n} words`, detail: `Split it or cut it to about 25 words (${label}).`, quote: clip(line) });
      const filler = FILLER.find((p) => new RegExp(`\\b${p}\\b`, 'i').test(line));
      if (filler) add({ id: `fill-${bulletCount}`, severity: 'improve', area, title: `Filler phrase: "${filler}"`, detail: `Replace it with a specific result (${label}).`, quote: clip(line) });
    }
    return lines.length;
  };

  if (roles.length === 0) {
    add({ id: 'no-roles', severity: 'fix', area: 'Experience', title: 'Add at least one role', detail: 'Internships, freelance work and serious side projects all count. Use Projects if you have no jobs yet.' });
  }
  roles.forEach((role, i) => {
    const label = role.title || role.company || `role ${i + 1}`;
    if (!role.title.trim()) add({ id: `rt-${role.id}`, severity: 'fix', area: 'Experience', title: 'Role is missing a job title', detail: `Add the title you held (${label}).` });
    if (!role.company.trim()) add({ id: `rc-${role.id}`, severity: 'fix', area: 'Experience', title: 'Role is missing a company', detail: `Add the employer or "Freelance" (${label}).` });
    if (!role.start) add({ id: `rs-${role.id}`, severity: 'improve', area: 'Experience', title: 'Add a start date', detail: `Month and year are enough (${label}).` });
    if (!role.current && !role.end && role.start) add({ id: `re-${role.id}`, severity: 'improve', area: 'Experience', title: 'Add an end date or tick "I work here now"', detail: `(${label})` });
    if (role.start && role.end && !role.current && role.end < role.start) add({ id: `rd-${role.id}`, severity: 'fix', area: 'Experience', title: 'End date is before start date', detail: `Check the dates for ${label}.` });
    const n = checkBullets('Experience', label, role.bullets);
    if (n === 0) add({ id: `rb-${role.id}`, severity: 'fix', area: 'Experience', title: 'Role has no bullet points', detail: `Add two to four results for ${label}.` });
    else if (n === 1) add({ id: `rb1-${role.id}`, severity: 'improve', area: 'Experience', title: 'Only one bullet', detail: `Two to four is the norm for ${label}.` });
    else if (n > 6) add({ id: `rb6-${role.id}`, severity: 'improve', area: 'Experience', title: `${n} bullets in one role`, detail: `Keep the four strongest for ${label}.` });
  });

  r.projects.forEach((p, i) => {
    if (!p.name.trim() && !p.bullets.trim()) return;
    checkBullets('Projects', p.name || `project ${i + 1}`, p.bullets);
  });

  if (bulletCount >= 3) {
    const ratio = bulletsWithNumbers / bulletCount;
    if (ratio < 0.4) {
      add({ id: 'numbers', severity: 'fix', area: 'Overall', title: `Only ${bulletsWithNumbers} of ${bulletCount} bullets have a number`, detail: 'Numbers make results believable: time saved, users, revenue, percentages. Aim for at least half.' });
    } else {
      add({ id: 'numbers-ok', severity: 'good', area: 'Overall', title: `${bulletsWithNumbers} of ${bulletCount} bullets include a number`, detail: 'Specific results like these are what recruiters remember.' });
    }
    const repeated = [...verbUse.entries()].filter(([, n]) => n >= 3).map(([v]) => v);
    if (repeated.length > 0) add({ id: 'verbs', severity: 'improve', area: 'Overall', title: `"${repeated[0]}" opens ${verbUse.get(repeated[0])} bullets`, detail: 'Vary your verbs so each bullet reads as a different achievement.' });
  }

  /* ---------------- Education ---------------- */
  const schools = r.education.filter((e) => e.school.trim() || e.degree.trim());
  if (schools.length === 0) add({ id: 'edu', severity: 'improve', area: 'Education', title: 'Add education or training', detail: 'A degree, bootcamp or course. Leave it out only if your experience is long and strong.' });
  schools.forEach((s) => {
    if (s.school.trim() && !s.degree.trim() && !s.field.trim()) add({ id: `ed-${s.id}`, severity: 'improve', area: 'Education', title: 'Add what you studied', detail: `Degree or field for ${s.school}.` });
  });

  /* ---------------- Skills ---------------- */
  if (r.skills.length === 0) add({ id: 'skills', severity: 'fix', area: 'Skills', title: 'Add your skills', detail: 'Tracking systems match this list against the job posting.' });
  else if (r.skills.length < 5) add({ id: 'skills-few', severity: 'improve', area: 'Skills', title: `Only ${r.skills.length} skills`, detail: 'Most tech resumes list 8 to 15 relevant skills.' });
  else if (r.skills.length > 25) add({ id: 'skills-many', severity: 'improve', area: 'Skills', title: `${r.skills.length} skills is a lot`, detail: 'Keep the ones you would be happy to be interviewed on.' });
  const softOnly = r.skills.filter((s) => /^(communication|teamwork|leadership|problem solving|time management|hard working|team player)$/i.test(s.trim()));
  if (softOnly.length >= 3) add({ id: 'soft', severity: 'improve', area: 'Skills', title: 'Soft skills in the skills list', detail: 'Show communication and leadership in your bullets instead. Keep this list for tools and methods.' });

  /* ---------------- Overall ---------------- */
  if (opts.pages > 2) add({ id: 'pages', severity: 'fix', area: 'Overall', title: `Runs to ${opts.pages} pages`, detail: 'Keep it to one page, two at most for senior roles.' });
  else if (opts.pages === 2 && roles.length <= 2) add({ id: 'pages2', severity: 'improve', area: 'Overall', title: 'Two pages for a short career', detail: 'With one or two roles, one page reads stronger.' });

  const fixes = f.filter((x) => x.severity === 'fix').length;
  const improves = f.filter((x) => x.severity === 'improve').length;
  const score = Math.max(0, Math.min(100, Math.round(100 - fixes * 9 - improves * 3)));
  const wordCount = words(resumeText(r));
  return { score, findings: f, bulletCount, bulletsWithNumbers, wordCount };
}

/* ---------------- Job description match ---------------- */

export interface JobMatch {
  posting: string[];
  matched: string[];
  missing: string[];
}

export function matchJob(r: Resume, posting: string): JobMatch | null {
  if (posting.trim().split(/\s+/).length < 25) return null;
  const wanted = findSkills(posting).map((h) => h.name).filter((s) => !CONTEXT_SKILLS.has(s));
  const have = new Set(findSkills(resumeText(r)).map((h) => h.name));
  return {
    posting: wanted,
    matched: wanted.filter((s) => have.has(s)),
    missing: wanted.filter((s) => !have.has(s)),
  };
}
