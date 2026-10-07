import { INDUSTRIES, MODELS, PATTERNS, SKILLS, type Industry, type Level, type Model, type Pattern, type Skill } from './data';

export interface Answers {
  skills: Skill[];
  industry: string; // industry id or 'any'
  models: Model[];
  hours: Level;
  budget: Level;
}

export const DEFAULT_ANSWERS: Answers = { skills: [], industry: 'any', models: [], hours: 0, budget: 0 };

export interface Idea {
  id: string; // pattern.industry
  pattern: Pattern;
  industry: Industry;
  title: string;
  pitch: string;
  problem: string;
  firstVersion: string;
  angle: string;
  channels: string;
  revenue: string;
  costs: string;
  metric: string;
  risks: string[];
  reasons: string[];
  gaps: string[];
  score: number;
}

const SKILL_LABEL = Object.fromEntries(SKILLS.map((s) => [s.id, s.label.toLowerCase()])) as Record<Skill, string>;
const MODEL_LABEL = Object.fromEntries(MODELS.map((m) => [m.id, m.label.toLowerCase()])) as Record<Model, string>;
export const INDUSTRY_BY_ID: Record<string, Industry> = Object.fromEntries(INDUSTRIES.map((i) => [i.id, i]));
const PATTERN_BY_ID: Record<string, Pattern> = Object.fromEntries(PATTERNS.map((p) => [p.id, p]));

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function fillText(text: string, ind: Industry): string {
  const map: Record<string, string> = { customers: ind.customers, clients: ind.clients, work: ind.work, pain: ind.pain };
  return text.replace(/\{(customers|clients|work|pain|Customers|Clients|Work|Pain)\}/g, (_, k: string) => {
    const v = map[k.toLowerCase()];
    return k[0] === k[0].toUpperCase() ? cap(v) : v;
  });
}

function list(items: string[]) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function fits(p: Pattern, ind: Industry) {
  if (p.bookingOnly && !ind.booking) return false;
  if (p.skip?.includes(ind.id)) return false;
  return true;
}

export function buildIdea(p: Pattern, ind: Industry, a: Answers): Idea {
  const reasons: string[] = [];
  const gaps: string[] = [];
  let score = 0;

  const have = a.skills;
  const needHit = p.needs.filter((s) => have.includes(s));
  const helpHit = p.helps.filter((s) => have.includes(s));
  if (have.length) {
    if (needHit.length) {
      reasons.push(`Uses your ${list(needHit.map((s) => SKILL_LABEL[s]))} skills`);
      score += 4 + needHit.length * 2;
    } else {
      gaps.push(`Needs ${list(p.needs.map((s) => SKILL_LABEL[s]))}: learn it or find a partner`);
    }
    if (helpHit.length) score += helpHit.length;
  }
  if (a.models.length) {
    if (a.models.includes(p.model)) {
      reasons.push(`Matches your choice: ${MODEL_LABEL[p.model]}`);
      score += 4;
    } else {
      gaps.push(`A ${MODEL_LABEL[p.model]}, not what you picked`);
      score -= 3;
    }
  }
  if (a.industry === ind.id) {
    reasons.push(`Builds on what you know about ${ind.customers}`);
    score += 3;
  }
  if (p.minBudget <= a.budget) {
    if (p.minBudget === 0) reasons.push('Can start with very little money');
    score += 1;
  } else {
    gaps.push('Likely needs more money than you planned');
    score -= 5;
  }
  if (p.minHours <= a.hours) {
    if (p.minHours === 0) reasons.push('Can start on a few hours a week');
    score += 1;
  } else {
    gaps.push('Likely needs more hours than you have');
    score -= 5;
  }

  return {
    id: `${p.id}.${ind.id}`,
    pattern: p,
    industry: ind,
    title: fillText(p.title, ind),
    pitch: fillText(p.pitch, ind),
    problem: fillText(p.problem, ind),
    firstVersion: fillText(p.firstVersion, ind),
    angle: fillText(p.angle, ind),
    channels: fillText(p.channels, ind),
    revenue: fillText(p.revenue, ind),
    costs: fillText(p.costs, ind),
    metric: fillText(p.metric, ind),
    risks: p.risks.map((r) => fillText(r, ind)),
    reasons,
    gaps,
    score,
  };
}

// All matching ideas, best fit first. When no industry is chosen, each idea
// pattern is paired with industries in a fixed rotation so the list is varied
// and the same answers always give the same list.
export function rankIdeas(a: Answers): Idea[] {
  const industries = a.industry !== 'any' && INDUSTRY_BY_ID[a.industry] ? [INDUSTRY_BY_ID[a.industry]] : INDUSTRIES;
  const out: Idea[] = [];
  PATTERNS.forEach((p, pi) => {
    const usable = industries.filter((ind) => fits(p, ind));
    if (!usable.length) return;
    const ordered = industries.length === 1 ? usable : [...usable.slice(pi % usable.length), ...usable.slice(0, pi % usable.length)];
    ordered.forEach((ind, k) => {
      const idea = buildIdea(p, ind, a);
      idea.score -= k * 0.01; // keep the rotation order stable
      out.push(idea);
    });
  });
  out.sort((x, y) => y.score - x.score);
  // Show each pattern once before repeating it with another industry.
  const first: Idea[] = [];
  const rest: Idea[] = [];
  const seen = new Set<string>();
  for (const i of out) {
    if (seen.has(i.pattern.id)) rest.push(i);
    else {
      seen.add(i.pattern.id);
      first.push(i);
    }
  }
  return [...first, ...rest];
}

export function ideaById(id: string, a: Answers): Idea | null {
  const [pid, iid] = id.split('.');
  const p = PATTERN_BY_ID[pid];
  const ind = INDUSTRY_BY_ID[iid];
  if (!p || !ind || !fits(p, ind)) return null;
  return buildIdea(p, ind, a);
}

export const IDEA_COUNT = PATTERNS.reduce((n, p) => n + INDUSTRIES.filter((i) => fits(p, i)).length, 0);

export function testPlan(i: Idea): { day: string; text: string }[] {
  const c = i.industry.customers;
  const ask: Record<Model, string> = {
    service: 'Ask two or three of them to book a first paid job or a paid pilot at a set date.',
    product: 'Open a simple preorder page and ask the people you spoke to whether they will buy it at that price.',
    software: 'Ask for a paid pilot or a deposit, or at least a firm date to try a first version you set up by hand.',
    content: 'Publish three issues, videos or posts and ask readers what they would pay for next.',
    marketplace: 'Make three matches by hand over email or chat, before building anything.',
  };
  return [
    { day: 'Day 1', text: `List 20 ${c} you can actually reach, and how you will contact each one.` },
    { day: 'Days 2 and 3', text: `Talk to at least five of them. Ask how they handle ${i.industry.work} today, what it costs them and what they have already tried. Listen more than you pitch.` },
    { day: 'Day 4', text: 'Write a one page offer: who it is for, the result, what is included and the price.' },
    { day: 'Day 5', text: 'Send the offer to everyone you spoke to and to 15 more on your list.' },
    { day: 'Day 6', text: ask[i.pattern.model] },
    { day: 'Day 7', text: 'Decide. Money or a firm commitment from a few people is a good sign to start. Polite interest is not. If it is a no, change one thing (who, problem or price) and run the week again.' },
  ];
}

export function pressureTestPrompt(i: Idea, a: Answers): string {
  const skills = a.skills.length ? a.skills.map((s) => SKILL_LABEL[s]).join(', ') : 'not stated';
  return [
    'Act as an experienced, skeptical advisor to first time founders. Pressure test this business idea before I spend time on it.',
    '',
    `Idea: ${i.title}`,
    `Pitch: ${i.pitch}`,
    `Problem: ${i.problem}`,
    `First version: ${i.firstVersion}`,
    `How it makes money: ${i.revenue}`,
    `My skills: ${skills}`,
    '',
    'Please give me:',
    '1. The five biggest reasons this could fail, most likely first.',
    '2. The kinds of existing products or services I would compete with, and what to search for to check them myself.',
    '3. Eight questions to ask potential customers that do not lead them toward a yes.',
    '4. The cheapest test I could run this week, and what result should make me stop.',
    '',
    'Rules: do not invent statistics, market sizes or company facts. If you are unsure whether something exists, tell me to check it.',
  ].join('\n');
}
