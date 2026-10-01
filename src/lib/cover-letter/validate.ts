/**
 * Input checks. The letter is only as good as what goes in, so random
 * letters, placeholder words and one word answers are caught before
 * anything is written.
 */

export type FieldKey =
  | 'jobTitle'
  | 'company'
  | 'manager'
  | 'jobDescription'
  | 'name'
  | 'email'
  | 'phone'
  | 'link'
  | 'currentRole'
  | 'skills'
  | 'achievement1'
  | 'achievement2'
  | 'whyCompany'
  | 'extra';

export type Errors = Partial<Record<FieldKey, string>>;

const KEYBOARD_RUNS = ['qwer', 'wert', 'erty', 'rtyu', 'tyui', 'yuio', 'uiop', 'asdf', 'sdfg', 'dfgh', 'fghj', 'ghjk', 'hjkl', 'zxcv', 'xcvb', 'cvbn', 'vbnm'];

const PLACEHOLDER = new Set([
  'test', 'testing', 'asdf', 'qwerty', 'lorem', 'ipsum', 'dolor', 'dummy', 'sample', 'example', 'abc', 'xyz', 'foo', 'bar', 'baz',
  'hello', 'hi', 'na', 'n/a', 'none', 'nothing', 'something', 'whatever', 'idk', 'blah', 'random', 'text', 'aaa', 'xxx',
]);

/** Short everyday words. Real sentences always contain some of these. */
const FUNCTION_WORDS = new Set(
  (
    'a an the and or but so to of in on at by for from with into over as than then that this these those it its i me my we our ' +
    'you your they their he she his her is are was were be been being have has had do did done will would can could should may ' +
    'not no more most less after before while when where which who what how all each every both about through across up down out ' +
    'per new two three four five ten first last year years month months week weeks day days team teams time'
  ).split(' ')
);

function words(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).map((w) => w.replace(/'/g, ''));
}

export function looksMashed(token: string): boolean {
  const t = token.toLowerCase();
  if (/^\d+$/.test(t)) return false;
  if (t.length > 24) return true;
  if (/(.)\1\1/.test(t)) return true;
  if (t.length >= 5 && !/[aeiouy]/.test(t)) return true;
  if (/[bcdfghjklmnpqrstvwxz]{5,}/.test(t)) return true;
  if (t.length >= 4 && KEYBOARD_RUNS.some((r) => t.includes(r))) return true;
  if (/^(\w{2,3})\1{2,}$/.test(t)) return true;
  return false;
}

/** For short labels such as a job title, company or name. */
function badLabel(value: string): string | null {
  const ws = words(value);
  if (ws.length === 0) return 'Use letters, not just numbers or symbols.';
  if (ws.every((w) => PLACEHOLDER.has(w))) return 'This looks like placeholder text.';
  if (ws.filter(looksMashed).length / ws.length >= 0.5) return 'This looks like random letters.';
  return null;
}

/** For sentences such as an achievement or a reason. */
function badSentence(value: string, minWords: number): string | null {
  const ws = words(value);
  const letters = ws.filter((w) => /[a-z]/.test(w));
  if (letters.length < minWords) return `Write at least ${minWords} words so there is something real to use.`;
  if (/\blorem\b|\bipsum\b/.test(value.toLowerCase())) return 'This looks like placeholder text.';
  if (letters.filter((w) => PLACEHOLDER.has(w)).length / letters.length >= 0.5) return 'This looks like placeholder text.';
  if (letters.filter(looksMashed).length / letters.length >= 0.25) return 'This looks like random letters. Write it as a normal sentence.';
  if (new Set(letters).size / letters.length < 0.4) return 'The same words are repeated. Write it as a normal sentence.';
  if (letters.length >= 6 && letters.filter((w) => FUNCTION_WORDS.has(w)).length === 0) {
    return 'Write this as a full sentence, not a list of keywords.';
  }
  return null;
}

export type LetterInput = {
  jobTitle: string;
  company: string;
  manager: string;
  jobDescription: string;
  name: string;
  email: string;
  phone: string;
  link: string;
  currentRole: string;
  years: string;
  skills: string;
  achievement1: string;
  achievement2: string;
  whyCompany: string;
  extra: string;
  tone: 'professional' | 'warm' | 'direct';
  length: 'short' | 'standard';
};

export const EMPTY_INPUT: LetterInput = {
  jobTitle: '',
  company: '',
  manager: '',
  jobDescription: '',
  name: '',
  email: '',
  phone: '',
  link: '',
  currentRole: '',
  years: '',
  skills: '',
  achievement1: '',
  achievement2: '',
  whyCompany: '',
  extra: '',
  tone: 'professional',
  length: 'standard',
};

export function validate(input: LetterInput): Errors {
  const e: Errors = {};
  const required = (key: FieldKey, label: string) => {
    if (!(input[key as keyof LetterInput] as string).trim()) e[key] = `Add ${label}.`;
  };

  required('jobTitle', 'the job title');
  required('company', 'the company name');
  required('name', 'your name');
  required('currentRole', 'your current or most recent role');
  required('achievement1', 'one achievement');

  if (!e.jobTitle) {
    const bad = badLabel(input.jobTitle);
    if (bad) e.jobTitle = bad;
    else if (input.jobTitle.trim().length < 2) e.jobTitle = 'That is too short for a job title.';
  }
  if (!e.company) {
    const bad = badLabel(input.company);
    if (bad) e.company = bad;
  }
  if (input.manager.trim()) {
    const bad = badLabel(input.manager);
    if (bad) e.manager = bad;
  }
  if (!e.name) {
    const bad = badLabel(input.name);
    if (bad) e.name = bad;
    else if (/\d/.test(input.name)) e.name = 'Names do not usually contain numbers.';
  }
  if (!e.currentRole) {
    const bad = badLabel(input.currentRole);
    if (bad) e.currentRole = bad;
  }
  if (input.email.trim() && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.email.trim())) {
    e.email = 'That does not look like an email address.';
  }
  if (input.phone.trim() && (input.phone.replace(/\D/g, '').length < 7 || /[a-z]/i.test(input.phone))) {
    e.phone = 'That does not look like a phone number.';
  }
  if (input.link.trim() && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(input.link.trim())) {
    e.link = 'That does not look like a web address.';
  }
  if (input.skills.trim()) {
    const items = input.skills.split(/[,;\n|]+/).map((s) => s.trim()).filter(Boolean);
    const junk = items.filter((s) => badLabel(s));
    if (junk.length > 0 && junk.length >= items.length / 2) e.skills = 'Some of these do not look like real skills.';
  }
  if (!e.achievement1) {
    const bad = badSentence(input.achievement1, 6);
    if (bad) e.achievement1 = bad;
  }
  if (input.achievement2.trim()) {
    const bad = badSentence(input.achievement2, 6);
    if (bad) e.achievement2 = bad;
  }
  if (input.whyCompany.trim()) {
    const bad = badSentence(input.whyCompany, 5);
    if (bad) e.whyCompany = bad;
  }
  if (input.extra.trim()) {
    const bad = badSentence(input.extra, 5);
    if (bad) e.extra = bad;
  }
  if (input.jobDescription.trim()) {
    const ws = words(input.jobDescription);
    if (ws.length < 25) e.jobDescription = 'Paste the full job description, or leave this empty. A few words are not enough to match against.';
    else {
      const bad = badSentence(input.jobDescription, 25);
      if (bad) e.jobDescription = 'This does not look like a job description.';
    }
  }
  return e;
}
