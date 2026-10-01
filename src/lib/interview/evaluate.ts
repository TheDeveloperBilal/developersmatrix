/**
 * Answer checker for the interview simulator.
 *
 * What it does: compares an answer with the rubric written for that exact
 * question, checks the shape of the answer (STAR for behavioral, reasoning and
 * examples for technical, requirements to failure modes for design), and
 * rejects input that is not a real attempt at all.
 *
 * What it does not do: it cannot tell whether every sentence is true. It
 * checks what you covered, not whether each claim is correct. The UI says so.
 */

import type { BankQuestion, Category, Level, RoleKey } from './bank-types';
import { LEVELS } from './bank-types';
import { BANK } from './bank';
import { MISCONCEPTIONS, MYTH_MARKERS } from './misconceptions';

// ------------------------------------------------------------------ Types

export type RejectReason = 'too_short' | 'gibberish' | 'copied' | 'repetitive' | 'off_topic';
export type Tone = 'strong' | 'good' | 'partial' | 'weak';

export interface StructureCheck {
  label: string;
  passed: boolean;
  tip: string;
}

export interface Evaluation {
  status: 'scored' | 'rejected';
  reason?: RejectReason;
  title: string;
  message: string;
  score: number | null;
  tone: Tone | null;
  verdict: string | null;
  breakdown: { coverage: number; structure: number; specificity: number } | null;
  covered: string[];
  missed: string[];
  /** Statements in the answer that look factually wrong. */
  incorrect: string[];
  structure: StructureCheck[];
  strengths: string[];
  improvements: string[];
  flags: string[];
  wordCount: number;
  targetWords: number;
  modelAnswer: string;
  hints: string[];
  next: string;
}

// ------------------------------------------------------------ Text helpers

const STOPWORDS = new Set(
  (
    'a about above after again against all also am an and any are as at be because been before being below between both but by ' +
    'can could did do does doing done down during each either else even ever every few for from further get gets got had has have ' +
    'having he her here hers him his how however i if in into is it its itself just let lets like made make makes many may me might ' +
    'more most much must my myself no nor not now of off often on once one only or other our ours ourselves out over own per quite ' +
    'rather really same she should so some such than that thats the their theirs them themselves then there these they thing things ' +
    'this those through to too under until up upon us very via was way we well were what when where whether which while who whom ' +
    'whose why will with within without would yet you your yours yourself im ive id dont doesnt didnt isnt wasnt cant wont its'
  ).split(' ')
);

/**
 * Everyday English words that are not in the question bank. Together with the
 * bank vocabulary this lets the checker tell real sentences from key mashing.
 */
const COMMON = (
  'able across actually add added after age ago ahead almost alone along already always among amount another answer anyone ' +
  'anything apart area around ask asked away back bad based basic become becomes before began begin behind believe best better ' +
  'big bit book both break bring brought build built business busy call called came care career case cause certain chance change ' +
  'changed check child choose city clear close come comes coming common company complete consider continue control cost could ' +
  'country couple course create current customer day days deal decide decided deep design detail different difficult direct ' +
  'done easy early end enough entire especially example experience explain face fact fail fair family far fast feel felt final ' +
  'find fine first focus follow food found friend friends front full game gave general give given go goal going good great group ' +
  'grow guess hand happen happened happy hard head hear held help high hold home hope hour hours house idea important improve ' +
  'include instead interest interview issue job keep kept kind knew know known large last late later lead learn least leave left ' +
  'less level life likely line list little live long look looked lot love low main manage manager mean meant meet member mind ' +
  'minute moment money month months move name need needed never new next nice night number offer office old open order others ' +
  'part past pay people person place plan play point possible power pretty problem process product project put question quick ' +
  'quickly raise reach read ready real reason result right role room run said saw say second see seem seen sense set several share ' +
  'short show side simple since small social someone something sometimes soon sort speak specific spend start started state stay ' +
  'step still stop story strong student study sure system take taken talk task team tell term test thank think thought three time ' +
  'times today together told took top tried true try trying turn two type understand use used useful user usually value want ' +
  'wanted watch week weekend weeks went whole wife word words work worked working world worry write wrong year years yes young ' +
  'pizza cheese movie music weather today tomorrow yesterday morning evening friend dog cat car beach holiday football cricket'
).split(' ');

const KEYBOARD_RUNS = [
  'qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop', 'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'zxcv', 'xcvb', 'cvbn', 'vbnm',
  'qaz', 'wsx', 'edc', 'rfv', 'tgb', 'yhn', 'ujm',
];
const FILLER = new Set(['lorem', 'ipsum', 'dolor', 'amet', 'consectetur', 'adipiscing', 'blah', 'blahblah', 'asdf', 'test', 'testing', 'abc', 'xyz', 'foo', 'bar', 'baz', 'hello', 'hi', 'ok', 'okay', 'dummy', 'sample', 'random', 'text', 'something', 'whatever', 'idk', 'na', 'nothing']);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘'`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  const n = normalize(text);
  return n ? n.split(' ') : [];
}

const SUFFIXES: [string, string][] = [
  ['ational', 'ate'], ['ization', 'ize'], ['isation', 'ize'], ['ations', 'ate'], ['ation', 'ate'],
  ['ings', ''], ['ing', ''], ['ies', 'y'], ['ied', 'y'], ['ness', ''], ['ments', 'ment'],
  ['sed', 'se'], ['ses', 'se'], ['es', ''], ['ed', ''], ['s', ''], ['ly', ''],
];

/** Very light stemmer. Applied to both sides, so it only has to be consistent. */
export function stem(word: string): string {
  if (word.length <= 3 || /^\d+$/.test(word)) return word;
  let w = word;
  if (w.endsWith('ise') || w.endsWith('ised') || w.endsWith('ising') || w.endsWith('ises')) w = w.replace(/is(e|ed|ing|es)$/, 'iz$1');
  for (const [suffix, replacement] of SUFFIXES) {
    if (w.endsWith(suffix)) {
      const candidate = w.slice(0, -suffix.length) + replacement;
      if (candidate.length >= 3) {
        w = candidate;
        if ((suffix === 'ing' || suffix === 'ed') && /([b-df-hj-np-tv-z])\1$/.test(w) && !/(ll|ss|zz|ff)$/.test(w)) w = w.slice(0, -1);
        break;
      }
    }
  }
  if (w.length >= 4 && w.endsWith('e')) w = w.slice(0, -1);
  return w;
}

type Prepared = {
  raw: string[];
  stems: string[];
  stemSet: Set<string>;
  joined: string; // stems joined with single spaces and padded, for phrase search
};

function prepare(text: string): Prepared {
  const raw = tokenize(text);
  const stems = raw.map(stem);
  return { raw, stems, stemSet: new Set(stems), joined: ` ${stems.join(' ')} ` };
}

type CompiledTerm = { stems: string[]; phrase: string; prefix: string | null };

const termCache = new Map<string, CompiledTerm[]>();

function compileTerms(list: string): CompiledTerm[] {
  const cached = termCache.get(list);
  if (cached) return cached;
  const compiled = list
    .split('|')
    .map((t) => tokenize(t))
    .filter((tokens) => tokens.length > 0)
    .map((tokens) => {
      const stems = tokens.map(stem);
      // Single words of six letters or more also match as a prefix, so
      // "monitor" catches "monitoring" and "priorit" catches "prioritize".
      const prefix = tokens.length === 1 && tokens[0].length >= 6 ? tokens[0] : null;
      return { stems, phrase: ` ${stems.join(' ')} `, prefix };
    });
  termCache.set(list, compiled);
  return compiled;
}

/** Returns the terms from the list that appear in the answer. */
function matchTerms(list: string, answer: Prepared): string[] {
  const hits: string[] = [];
  for (const term of compileTerms(list)) {
    let found = false;
    if (term.stems.length === 1) {
      found = answer.stemSet.has(term.stems[0]);
      if (!found && term.prefix) {
        const p = term.prefix;
        found = answer.raw.some((t) => t.startsWith(p));
      }
    } else {
      found = answer.joined.includes(term.phrase);
    }
    if (found) hits.push(term.phrase.trim());
  }
  return hits;
}

function hasAny(list: string, answer: Prepared): boolean {
  return matchTerms(list, answer).length > 0;
}

// ---------------------------------------------------------- Vocabulary

let VOCAB: Set<string> | null = null;

function vocabulary(): Set<string> {
  if (VOCAB) return VOCAB;
  const v = new Set<string>();
  const addText = (s: string) => tokenize(s).forEach((t) => v.add(stem(t)));
  STOPWORDS.forEach((w) => v.add(stem(w)));
  COMMON.forEach((w) => v.add(stem(w)));
  for (const q of BANK) {
    addText(q.question);
    addText(q.model);
    addText(q.anchors.replace(/\|/g, ' '));
    addText(q.next);
    q.hints.forEach(addText);
    q.points.forEach((p) => {
      addText(p.label);
      addText(p.terms.replace(/\|/g, ' '));
    });
  }
  VOCAB = v;
  return v;
}

function looksLikeMashing(token: string): boolean {
  if (/^\d+$/.test(token)) return false;
  if (token.length > 24) return true;
  if (/(.)\1\1/.test(token)) return true; // three identical letters in a row
  if (token.length >= 4 && !/[aeiouy]/.test(token)) return true;
  if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(token)) return true;
  if (token.length >= 4 && KEYBOARD_RUNS.some((run) => token.includes(run))) return true;
  if (/^(\w{2,3})\1{2,}$/.test(token)) return true; // lalala, abcabcabc
  return false;
}

// ----------------------------------------------------------- Structure

type Profile = 'behavioral' | 'technical' | 'system' | 'case' | 'ml';

function profileFor(category: Category, role: RoleKey | null): Profile {
  if (category === 'behavioral') return 'behavioral';
  if (category === 'technical') return 'technical';
  if (role === 'data-scientist') return 'ml';
  if (role === 'product-manager' || role === 'data-analyst' || role === 'engineering-manager') return 'case';
  return 'system';
}

/** Which profile a question uses when the role is not known. */
function profileForQuestion(q: BankQuestion, role: RoleKey | null): Profile {
  if (role) return profileFor(q.category, role);
  if (q.category !== 'system') return q.category;
  const id = q.id;
  if (id.startsWith('ml-')) return 'ml';
  if (id.startsWith('pc-') || id.startsWith('ac-') || id.startsWith('tm-')) return 'case';
  return 'system';
}

function sentenceCount(text: string): number {
  return text
    .split(/[.!?]+(?:\s|$)|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3).length;
}

function hasNumber(text: string): boolean {
  return /\d/.test(text) || /\b(percent|half|double|doubled|twice|triple|tripled|thousand|million|hundred|dozen)\b/i.test(text);
}

function structureChecks(profile: Profile, text: string, a: Prepared): StructureCheck[] {
  const iCount = a.raw.filter((t) => t === 'i' || t === 'im' || t === 'ive' || t === 'id' || t === 'my' || t === 'me' || t === 'myself').length;
  const sentences = sentenceCount(text);

  switch (profile) {
    case 'behavioral':
      return [
        {
          label: 'Situation: a specific moment, project or place',
          passed: hasAny('when i|when we|when my|at my|in my|on a|on the|on our|at a|last year|last month|last quarter|previous|project|at work|our team|my team|we were|i was|i joined|a client|a customer|once|in 20|during|while|years ago|my first|a few months|we had to|i had to|we needed|i needed|reported|a long time|one of our|our only', a),
          tip: 'Open with one real situation: where you were and what was at stake.',
        },
        {
          label: 'Action: what you personally did',
          passed: iCount >= 2,
          tip: 'Say "I" and describe your own actions, not only what the team did.',
        },
        {
          label: 'Result: what changed because of it',
          passed:
            hasAny('result|as a result|outcome|led to|ended up|in the end|finally|so we|shipped|launched|delivered|reduced|increased|improved|saved|cut|grew|fixed|resolved|went live|on time|promoted|praised|thanked|later|turned out|never needed|worked out|paid off|dropped|fell|went from|renewed|joined|faster', a) ||
            /\d+\s?(%|percent)/i.test(text),
          tip: 'Finish with the result, ideally measurable, such as time saved or a number that moved.',
        },
        {
          label: 'Reflection: what you learned',
          passed: hasAny('learned|learnt|lesson|taught me|realized|realised|next time|since then|now i|i would|i still|i always|differently|takeaway|from then on|going forward|ever since|showed me|it reminded|these days|today i', a),
          tip: 'Close with one line on what you learned or would do differently.',
        },
      ];
    case 'technical':
      return [
        {
          label: 'Explains the reasoning, not just the facts',
          passed: hasAny('because|so that|which means|this means|that means|since|the reason|so the|so it|so you|so we|so i|otherwise|in order to|that way|which is why|this is why|that is why|this lets|which lets|so nothing|so a', a),
          tip: 'Say why, not only what. Words like "because" and "which means" show reasoning.',
        },
        {
          label: 'Gives a concrete example',
          passed: hasAny('for example|for instance|such as|e g|say we|say you|say i|imagine|in my|i used|we used|i would|on a project|like when|consider|if you|if a|if the|when a|when the|let us say|suppose|picture', a) || /\d/.test(text),
          tip: 'Add one concrete example or a case from your own work.',
        },
        {
          label: 'Mentions a tradeoff, pitfall or when not to use it',
          passed: hasAny('tradeoff|trade off|downside|drawback|pitfall|mistake|mistakes|avoid|however|but|instead|depends|cost|risk|careful|catch|limitation|unless|not always|never|only when|rather than|trap|wrong|problem|breaks|fail|danger|worse|slower', a),
          tip: 'Mention a tradeoff, a common mistake, or when you would choose something else.',
        },
        {
          label: 'Developed over several sentences',
          passed: sentences >= 3,
          tip: 'Build the answer over at least three full sentences.',
        },
      ];
    case 'system':
      return [
        {
          label: 'Requirements and scale stated',
          passed: hasAny('requirement|requirements|clarify|confirm|assume|assumption|scale|users|user|per second|rps|qps|read heavy|write heavy|latency|traffic|million|billion|thousand|must|should support|need to|first i|i would ask', a),
          tip: 'Start by stating requirements and rough scale before drawing boxes.',
        },
        {
          label: 'Main components and data flow',
          passed: matchTerms('service|database|cache|queue|api|load balancer|server|servers|client|storage|gateway|worker|workers|cdn|component|components|store|index|widget|library|thread|threads|pipeline|module|layer|browser|device|sqlite|redis|s3|kafka|websocket', a).length >= 3,
          tip: 'Name the main components and walk one request through them.',
        },
        {
          label: 'How it scales',
          passed: hasAny('scale|scaling|shard|sharding|replica|replicas|horizontal|horizontally|partition|cdn|cache|parallel|stateless|autoscal', a),
          tip: 'Say how it handles ten times the load: caching, sharding, replicas or stateless servers.',
        },
        {
          label: 'Tradeoffs named',
          passed: hasAny('tradeoff|trade off|instead|versus|vs|downside|cost|but|however|rather than|on the other hand|simpler|worse|because|so that|otherwise|never|only|exception', a),
          tip: 'Call out at least one tradeoff and why you chose your side of it.',
        },
        {
          label: 'Failure handling',
          passed: hasAny('fail|failure|fails|failed|retry|retries|down|outage|fallback|backup|redundan|failover|timeout|dead letter|idempotent|recover|monitor|alert|error|errors|dropped|lost|conflict|rollback|cancel|cancelled|placeholder|offline', a),
          tip: 'Explain what happens when a part fails and how the system recovers.',
        },
      ];
    case 'case':
      return [
        {
          label: 'Clarifies the goal or problem first',
          passed: hasAny('goal|first|clarify|understand|define|what success|objective|problem|ask|why|start by|start with|plan for|the question|too many|is too', a),
          tip: 'Open by clarifying the goal and what success means.',
        },
        {
          label: 'Uses data or evidence',
          passed: hasAny('data|funnel|metric|analytics|numbers|research|interview|survey|segment|look at|dashboard|sql|evidence|history|historical|feedback|talk to|learn|check', a),
          tip: 'Show where your evidence comes from: data, research or a segment breakdown.',
        },
        {
          label: 'Proposes specific options or a plan',
          passed: hasAny('option|options|propose|recommend|i would|plan|solution|idea|ideas|fix|test|experiment|start with|then', a),
          tip: 'Give specific options and say which you would do first.',
        },
        {
          label: 'Defines how to measure success',
          passed: hasAny('measure|metric|metrics|kpi|success|target|track|retention|conversion|a b test|ab test|experiment|review|watch|numbers|survey|check', a),
          tip: 'Say which metric would tell you it worked.',
        },
        {
          label: 'Considers risks or tradeoffs',
          passed: hasAny('risk|risks|tradeoff|trade off|downside|guardrail|careful|but|however|watch|side effect|concern', a),
          tip: 'Mention one risk or tradeoff and how you would watch for it.',
        },
      ];
    case 'ml':
      return [
        {
          label: 'Goal and success metric',
          passed: hasAny('goal|metric|metrics|objective|success|business|precision|recall|auc|conversion|click', a),
          tip: 'Start with the goal and how you would measure the model offline and online.',
        },
        {
          label: 'Data and features',
          passed: hasAny('data|feature|features|label|labels|training|signals|history|interactions', a),
          tip: 'Describe the data, labels and main features.',
        },
        {
          label: 'Model choice with a reason',
          passed: hasAny('model|gradient boosting|xgboost|neural|embedding|embeddings|logistic|tree|trees|baseline|collaborative|ranking|classifier', a),
          tip: 'Name a model and why it fits, starting from a simple baseline.',
        },
        {
          label: 'Evaluation plan',
          passed: hasAny('evaluate|evaluation|validation|test|a b test|ab test|offline|online|holdout|backtest|cross validation', a),
          tip: 'Explain how you would evaluate it offline and then in a live test.',
        },
        {
          label: 'Serving and monitoring',
          passed: hasAny('serve|serving|latency|real time|batch|monitor|monitoring|drift|retrain|retraining|production|deploy', a),
          tip: 'Cover how it runs in production and how you would catch drift.',
        },
      ];
  }
}

// -------------------------------------------------------------- Verdicts

function verdictFor(score: number): { tone: Tone; verdict: string } {
  if (score >= 8.5) return { tone: 'strong', verdict: 'Strong answer' };
  if (score >= 7) return { tone: 'good', verdict: 'Good answer, small gaps' };
  if (score >= 5) return { tone: 'partial', verdict: 'Partial answer' };
  return { tone: 'weak', verdict: 'Needs work' };
}

// Share of the key points needed for full coverage. Senior answers are
// expected to cover more of the ground.
const COVERAGE_FACTOR: Record<Level, number> = { entry: 0.5, mid: 0.65, senior: 0.8 };

const REJECTIONS: Record<RejectReason, { title: string; message: string }> = {
  too_short: {
    title: 'That answer is too short to score',
    message: 'Interviewers expect a few full sentences. Write at least two or three sentences that answer the question directly.',
  },
  gibberish: {
    title: 'This does not read as a real answer',
    message: 'The text looks like random letters or placeholder words. Answer the question in plain English, the way you would say it in the interview.',
  },
  copied: {
    title: 'This mostly repeats the question',
    message: 'Restating the question is a fine opener, but the answer itself is missing. Add what you actually know or did.',
  },
  repetitive: {
    title: 'The same words are repeated too much',
    message: 'The answer repeats a few words over and over. Write it as connected sentences that explain your thinking.',
  },
  off_topic: {
    title: 'This answer does not address the question',
    message: 'None of the key ideas this question is looking for appear in your answer. Read the question again and answer that exact question.',
  },
};

function rejected(q: BankQuestion, reason: RejectReason, wordCount: number, targetWords: number): Evaluation {
  return {
    status: 'rejected',
    reason,
    title: REJECTIONS[reason].title,
    message: REJECTIONS[reason].message,
    score: null,
    tone: null,
    verdict: null,
    breakdown: null,
    covered: [],
    missed: [],
    incorrect: [],
    structure: [],
    strengths: [],
    improvements: [],
    flags: [reason],
    wordCount,
    targetWords,
    modelAnswer: q.model,
    hints: q.hints,
    next: q.next,
  };
}

// ----------------------------------------------------------------- Main

export function evaluateAnswer(q: BankQuestion, answerText: string, level: Level, role: RoleKey | null = null): Evaluation {
  const text = answerText.trim();
  const a = prepare(text);
  const words = a.raw.filter((t) => /[a-z]/.test(t));
  const wordCount = words.length;
  const targetWords = LEVELS.find((l) => l.key === level)?.targetWords ?? 100;

  if (wordCount === 0) return rejected(q, 'too_short', wordCount, targetWords);

  // Gate 1: key mashing, filler or placeholder text. Checked before length so
  // a short burst of junk is called what it is.
  const vocab = vocabulary();
  const known = words.filter((w) => vocab.has(stem(w))).length;
  const mashed = words.filter(looksLikeMashing).length;
  const filler = words.filter((w) => FILLER.has(w)).length;
  const lorem = /\blorem\b|\bipsum\b/.test(a.joined);
  if (lorem || known / wordCount < 0.4 || mashed / wordCount >= 0.3 || filler / wordCount >= 0.5) {
    return rejected(q, 'gibberish', wordCount, targetWords);
  }

  // Gate 2: nothing to score yet.
  if (wordCount < 8) return rejected(q, 'too_short', wordCount, targetWords);

  // Gate 3: the same few words again and again.
  const unique = new Set(a.stems).size;
  if (wordCount >= 15 && unique / a.stems.length < 0.3) return rejected(q, 'repetitive', wordCount, targetWords);
  const sentencesList = text.split(/[.!?\n]+/).map((s) => normalize(s)).filter((s) => s.split(' ').length >= 4);
  if (sentencesList.length >= 3 && new Set(sentencesList).size / sentencesList.length <= 0.5) {
    return rejected(q, 'repetitive', wordCount, targetWords);
  }

  // Gate 4: the question pasted back.
  const qPrep = prepare(q.question);
  const qContent = new Set(qPrep.stems.filter((s, i) => !STOPWORDS.has(qPrep.raw[i])));
  const aContent = a.stems.filter((s, i) => !STOPWORDS.has(a.raw[i]));
  const novel = new Set(aContent.filter((s) => !qContent.has(s)));
  const fromQuestion = aContent.filter((s) => qContent.has(s)).length;
  if (aContent.length > 0 && fromQuestion / aContent.length >= 0.6 && novel.size < 6) {
    return rejected(q, 'copied', wordCount, targetWords);
  }

  // Rubric coverage. Terms that only echo the question do not count, so
  // pasting the question plus filler does not earn points.
  const novelPrep: Prepared = a;
  const covered: string[] = [];
  const missed: string[] = [];
  const allTermHits = new Set<string>();
  for (const point of q.points) {
    const hits = matchTerms(point.terms, novelPrep).filter((hit) => {
      const content = hit.split(' ').filter((s) => !STOPWORDS.has(s));
      return content.length === 0 || !content.every((s) => qContent.has(s));
    });
    if (hits.length > 0) {
      covered.push(point.label);
      hits.forEach((h) => allTermHits.add(h));
    } else {
      missed.push(point.label);
    }
  }

  // Gate 5: nothing the question is looking for. If most of the words come
  // from the question itself, say so; otherwise it is off topic.
  if (covered.length === 0) {
    const echo = aContent.length > 0 ? fromQuestion / aContent.length : 0;
    return rejected(q, echo >= 0.35 ? 'copied' : 'off_topic', wordCount, targetWords);
  }

  // Known wrong statements for this question.
  const sentenceTexts = text
    .split(/[.!?;\n]+/)
    .map((s) => normalize(s))
    .filter((s) => s.length > 0 && !MYTH_MARKERS.test(s));
  const incorrect = (MISCONCEPTIONS[q.id] ?? [])
    .filter((m) => sentenceTexts.some((s) => m.test.test(s)))
    .map((m) => m.label);

  const needed = Math.max(1, Math.ceil(q.points.length * COVERAGE_FACTOR[level]));
  // Reaching the level's bar earns most of the credit; the last few percent
  // need every point, so a perfect 10 means nothing was missed.
  const coverage = 0.85 * Math.min(1, covered.length / needed) + 0.15 * (covered.length / q.points.length);

  const profile = profileForQuestion(q, role);
  const structure = structureChecks(profile, text, a);
  // One structure item can be missed without penalty. Real answers rarely tick every box.
  const structureScore = Math.min(1, structure.filter((s) => s.passed).length / Math.max(1, structure.length - 1));

  const lengthScore = Math.min(1, wordCount / targetWords);
  const numbers = hasNumber(text) ? 1 : 0;
  const concrete = Math.min(1, allTermHits.size / 6);
  const specificity = 0.45 * lengthScore + 0.2 * numbers + 0.35 * concrete;

  let score = 10 * (0.55 * coverage + 0.25 * structureScore + 0.2 * specificity);
  const flags: string[] = [];

  // Caps for answers that game the formula.
  const stopRatio = a.raw.filter((t) => STOPWORDS.has(t)).length / a.raw.length;
  if (wordCount >= 12 && stopRatio < 0.18) {
    score = Math.min(score, 3);
    flags.push('keyword_list');
  }
  if (wordCount < 25) {
    score = Math.min(score, 3);
    flags.push('too_brief');
  } else if (wordCount < targetWords * 0.45) {
    score = Math.min(score, 6);
    flags.push('short');
  }
  if (incorrect.length > 0) {
    // One wrong claim is what an interviewer remembers. Two or more sink it.
    score = Math.min(score - 2 * incorrect.length, incorrect.length === 1 ? 6 : 4);
    flags.push('incorrect');
  }

  const weCount = a.raw.filter((t) => t === 'we' || t === 'our' || t === 'us').length;
  const iCount = a.raw.filter((t) => t === 'i' || t === 'my' || t === 'me').length;
  if (profile === 'behavioral' && weCount >= 3 && weCount > iCount * 2) {
    // The interviewer cannot score what you did if you only describe the team.
    flags.push('team_language');
    score = Math.min(score, 7);
  }

  score = Math.round(Math.max(0, Math.min(10, score)) * 10) / 10;
  const { tone, verdict } = verdictFor(score);

  // Plain language feedback.
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (covered.length > 0) {
    strengths.push(
      covered.length === q.points.length
        ? 'You covered every key point this question is looking for.'
        : `You covered ${covered.length} of ${q.points.length} key points.`
    );
  }
  for (const check of structure) if (check.passed) strengths.push(check.label + '.');
  if (numbers && profile === 'behavioral') strengths.push('You used numbers, which makes the result believable.');

  for (const wrong of incorrect) improvements.push(`Check this: ${wrong}`);
  if (flags.includes('keyword_list')) {
    improvements.push('This reads like a list of keywords. Interviewers want connected sentences that explain how the ideas fit together.');
  }
  if (flags.includes('too_brief') || flags.includes('short')) {
    improvements.push(`At about ${wordCount} words this is short for a ${level} level answer. Aim for roughly ${targetWords} words, which is about a minute spoken.`);
  }
  if (flags.includes('team_language')) {
    improvements.push('You say "we" much more than "I". Interviewers are scoring you, so make your own part clear.');
  }
  for (const point of missed.slice(0, 3)) improvements.push(`Add: ${point.charAt(0).toLowerCase()}${point.slice(1)}.`);
  for (const check of structure) if (!check.passed) improvements.push(check.tip);
  if (!numbers && profile !== 'technical') improvements.push('Add a number where you can, such as scale, a percentage or time saved.');

  const message =
    incorrect.length > 0
      ? 'Part of this answer is factually wrong. An interviewer would notice, so fix that first.'
      : tone === 'strong'
      ? 'This would land well in a real interview. Compare it with the model answer for any detail you could add.'
      : tone === 'good'
        ? 'A solid answer. Close the gaps below and it becomes a strong one.'
        : tone === 'partial'
          ? 'You are on the right track, but an interviewer would expect more. Work through the gaps below.'
          : 'This answer is missing most of what the interviewer is listening for. Read the model answer, then try again.';

  return {
    status: 'scored',
    title: verdict,
    message,
    score,
    tone,
    verdict,
    breakdown: {
      coverage: Math.round(coverage * 100),
      structure: Math.round(structureScore * 100),
      specificity: Math.round(specificity * 100),
    },
    covered,
    missed,
    incorrect,
    structure,
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 7),
    flags,
    wordCount,
    targetWords,
    modelAnswer: q.model,
    hints: q.hints,
    next: q.next,
  };
}
