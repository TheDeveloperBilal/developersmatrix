/**
 * Shared rules for the Contact form, the Connect form and the audit order form.
 *
 * The browser and /api/contact both import this file, so a message that
 * passes the checks on the page also passes them on the server, and the
 * visitor sees the same wording in both places.
 */

import { findTier } from '@/lib/audit-pricing';

export const CONTACT_EMAIL = 'info@developersmatrix.com';

export type FormKind = 'general' | 'collaboration' | 'audit-order';

export const SERVICES = [
  { value: 'sponsored-post', label: 'Sponsored or guest post' },
  { value: 'tool-feature', label: 'AI tool or product feature' },
  { value: 'advertising', label: 'Banner ads and placements' },
  { value: 'website-audit', label: 'Manual website audit' },
  { value: 'web-development', label: 'Web development or SEO work' },
  { value: 'other', label: 'Something else' },
] as const;

export const BUDGETS = [
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 to $100' },
  { value: '100-250', label: '$100 to $250' },
  { value: '250-500', label: '$250 to $500' },
  { value: '500-1000', label: '$500 to $1,000' },
  { value: '1000-plus', label: '$1,000 or more' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const;

export type ServiceValue = (typeof SERVICES)[number]['value'];
export type BudgetValue = (typeof BUDGETS)[number]['value'];

export const LIMITS = {
  name: 100,
  email: 200,
  subject: 150,
  company: 120,
  siteUrl: 200,
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
  /** Audit order form only. */
  tier: string;
  siteUrl: string;
}

export const EMPTY_FORM: FormValues = {
  name: '',
  email: '',
  subject: '',
  company: '',
  service: '',
  budget: '',
  message: '',
  tier: '',
  siteUrl: '',
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

const HOST_RE = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/**
 * Turns whatever was typed ("https://www.Example.com/shop?x=1") into a bare
 * host name ("www.example.com"). Returns an empty string when it is not a
 * real looking domain, so only a clean host ever reaches an email.
 */
export function normalizeSite(value: string): string {
  const host = value
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, '')
    .split(/[/?#\s]/)[0]
    .replace(/:\d+$/, '')
    .replace(/\.$/, '');
  return HOST_RE.test(host) ? host : '';
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

  if (!email) e.email = 'Please add your email so we can reply.';
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

  if (kind === 'audit-order') {
    if (!findTier(v.tier)) e.tier = 'Please choose an audit.';
    if (!v.siteUrl.trim()) e.siteUrl = 'Please add the website you want audited.';
    else if (v.siteUrl.trim().length > LIMITS.siteUrl || !normalizeSite(v.siteUrl)) e.siteUrl = 'That does not look like a website address. Try something like example.com.';
    // Notes are optional on an order.
    if (message.length > LIMITS.messageMax) e.message = `Please keep this under ${LIMITS.messageMax} characters.`;
    return e;
  }

  if (!message) e.message = 'Please write a message.';
  else if (message.length < LIMITS.messageMin) e.message = `Please add a little more detail (at least ${LIMITS.messageMin} characters).`;
  else if (message.length > LIMITS.messageMax) e.message = `Please keep the message under ${LIMITS.messageMax} characters.`;

  return e;
}
