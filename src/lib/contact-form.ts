/**
 * Shared rules for the Contact and Connect forms.
 *
 * The browser and /api/contact both import this file, so a message that
 * passes the checks on the page also passes them on the server, and the
 * visitor sees the same wording in both places.
 */

export const CONTACT_EMAIL = 'info@developersmatrix.com';

export type FormKind = 'general' | 'collaboration';

export const SERVICES = [
  { value: 'sponsored-post', label: 'Sponsored or guest post' },
  { value: 'tool-feature', label: 'AI tool or product feature' },
  { value: 'advertising', label: 'Banner ads and placements' },
  { value: 'website-audit', label: 'Manual website audit' },
  { value: 'web-development', label: 'Web development or SEO work' },
  { value: 'other', label: 'Something else' },
] as const;

export const BUDGETS = [
  { value: 'under-500', label: 'Under $500' },
  { value: '500-1000', label: '$500 to $1,000' },
  { value: '1000-2500', label: '$1,000 to $2,500' },
  { value: '2500-5000', label: '$2,500 to $5,000' },
  { value: '5000-plus', label: '$5,000 or more' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export type ServiceValue = (typeof SERVICES)[number]['value'];
export type BudgetValue = (typeof BUDGETS)[number]['value'];

export const LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  company: 120,
  messageMin: 20,
  messageMax: 5000,
} as const;

/** A person cannot read and fill the form faster than this. Bots usually do. */
export const MIN_FILL_MS = 2000;

export interface FormValues {
  name: string;
  email: string;
  subject: string;
  company: string;
  service: string;
  budget: string;
  message: string;
}

export const EMPTY_FORM: FormValues = {
  name: '',
  email: '',
  subject: '',
  company: '',
  service: '',
  budget: '',
  message: '',
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function serviceLabel(value: string | undefined): string {
  return SERVICES.find((s) => s.value === value)?.label ?? 'Not specified';
}

export function budgetLabel(value: string | undefined): string {
  return BUDGETS.find((b) => b.value === value)?.label ?? 'Not specified';
}

/** Returns an empty object when the form is good to send. */
export function validateForm(kind: FormKind, v: FormValues): FieldErrors {
  const e: FieldErrors = {};
  const name = v.name.trim();
  const email = v.email.trim();
  const message = v.message.trim();

  if (!name) e.name = 'Please add your name.';
  else if (name.length > LIMITS.name) e.name = `Please keep your name under ${LIMITS.name} characters.`;

  if (!email) e.email = 'Please add your email so I can reply.';
  else if (email.length > LIMITS.email || !isEmail(email)) e.email = 'That email address does not look right.';

  if (kind === 'general') {
    if (!v.subject.trim()) e.subject = 'Please add a short subject.';
    else if (v.subject.trim().length > LIMITS.subject) e.subject = `Please keep the subject under ${LIMITS.subject} characters.`;
  }

  if (kind === 'collaboration') {
    if (!SERVICES.some((s) => s.value === v.service)) e.service = 'Please pick what you are interested in.';
    if (v.budget && !BUDGETS.some((b) => b.value === v.budget)) e.budget = 'Please pick a budget from the list.';
    if (v.company.trim().length > LIMITS.company) e.company = `Please keep this under ${LIMITS.company} characters.`;
  }

  if (!message) e.message = 'Please write a message.';
  else if (message.length < LIMITS.messageMin) e.message = `Please add a little more detail (at least ${LIMITS.messageMin} characters).`;
  else if (message.length > LIMITS.messageMax) e.message = `Please keep the message under ${LIMITS.messageMax} characters.`;

  return e;
}
