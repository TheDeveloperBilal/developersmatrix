// Budget Planner logic. Pure functions so the numbers can be tested.

export type Freq = 'week' | 'fortnight' | 'month' | 'quarter' | 'year';
export type Kind = 'need' | 'want' | 'save';

export interface Line {
  id: string;
  name: string;
  amount: number;
  freq: Freq;
  /** Only used for money out. */
  kind?: Kind;
}

export interface Goal {
  name: string;
  target: number;
  saved: number;
  /** Amount set aside each month. Null means "use what is left over". */
  monthly: number | null;
}

export interface Budget {
  v: 1;
  currency: string;
  income: Line[];
  spending: Line[];
  goal: Goal;
}

export const FREQS: { id: Freq; label: string; perMonth: number }[] = [
  { id: 'week', label: 'Weekly', perMonth: 52 / 12 },
  { id: 'fortnight', label: 'Every 2 weeks', perMonth: 26 / 12 },
  { id: 'month', label: 'Monthly', perMonth: 1 },
  { id: 'quarter', label: 'Every 3 months', perMonth: 1 / 3 },
  { id: 'year', label: 'Yearly', perMonth: 1 / 12 },
];

export const KINDS: { id: Kind; label: string; hint: string }[] = [
  { id: 'need', label: 'Need', hint: 'Bills you must pay: housing, food, utilities, transport, insurance, minimum debt payments' },
  { id: 'want', label: 'Want', hint: 'Things you could cut: eating out, streaming, hobbies, holidays' },
  { id: 'save', label: 'Saving', hint: 'Savings, investing and extra debt payments' },
];

export const CURRENCIES: { code: string; label: string }[] = [
  { code: 'USD', label: 'US dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British pound' },
  { code: 'CAD', label: 'Canadian dollar' },
  { code: 'AUD', label: 'Australian dollar' },
  { code: 'INR', label: 'Indian rupee' },
  { code: 'PKR', label: 'Pakistani rupee' },
  { code: 'AED', label: 'UAE dirham' },
  { code: 'SAR', label: 'Saudi riyal' },
  { code: 'NGN', label: 'Nigerian naira' },
  { code: 'ZAR', label: 'South African rand' },
  { code: 'PHP', label: 'Philippine peso' },
  { code: 'BRL', label: 'Brazilian real' },
  { code: 'MXN', label: 'Mexican peso' },
  { code: 'JPY', label: 'Japanese yen' },
];

/** Common lines people forget, offered as one click starters. */
export const STARTERS: { name: string; kind: Kind; freq: Freq }[] = [
  { name: 'Rent or mortgage', kind: 'need', freq: 'month' },
  { name: 'Groceries', kind: 'need', freq: 'month' },
  { name: 'Electricity, gas and water', kind: 'need', freq: 'month' },
  { name: 'Phone and internet', kind: 'need', freq: 'month' },
  { name: 'Transport and fuel', kind: 'need', freq: 'month' },
  { name: 'Insurance', kind: 'need', freq: 'year' },
  { name: 'Loan or card payments', kind: 'need', freq: 'month' },
  { name: 'Eating out', kind: 'want', freq: 'month' },
  { name: 'Subscriptions', kind: 'want', freq: 'month' },
  { name: 'Clothes', kind: 'want', freq: 'month' },
  { name: 'Gifts and holidays', kind: 'want', freq: 'year' },
  { name: 'Emergency fund', kind: 'save', freq: 'month' },
];

export const EMPTY_BUDGET: Budget = {
  v: 1,
  currency: 'USD',
  income: [],
  spending: [],
  goal: { name: 'Emergency fund', target: 0, saved: 0, monthly: null },
};

const FREQ_IDS = new Set(FREQS.map((f) => f.id));
const KIND_IDS = new Set(KINDS.map((k) => k.id));

function isLine(v: unknown): v is Line {
  if (!v || typeof v !== 'object') return false;
  const l = v as Record<string, unknown>;
  return typeof l.id === 'string' && typeof l.name === 'string' && typeof l.amount === 'number' && Number.isFinite(l.amount)
    && FREQ_IDS.has(l.freq as Freq) && (l.kind === undefined || KIND_IDS.has(l.kind as Kind));
}

export function isBudget(v: unknown): v is Budget {
  if (!v || typeof v !== 'object') return false;
  const b = v as Record<string, unknown>;
  const g = b.goal as Record<string, unknown> | undefined;
  return b.v === 1 && typeof b.currency === 'string'
    && Array.isArray(b.income) && b.income.every(isLine)
    && Array.isArray(b.spending) && b.spending.every(isLine)
    && !!g && typeof g.name === 'string' && typeof g.target === 'number' && typeof g.saved === 'number'
    && (g.monthly === null || typeof g.monthly === 'number');
}

export function perMonth(line: Pick<Line, 'amount' | 'freq'>): number {
  const f = FREQS.find((x) => x.id === line.freq);
  return (line.amount || 0) * (f ? f.perMonth : 1);
}

export function sumMonthly(lines: Line[]): number {
  return lines.reduce((s, l) => s + perMonth(l), 0);
}

export interface Summary {
  income: number;
  spending: number;
  left: number;
  byKind: Record<Kind, number>;
  /** Share of income for needs, wants and savings. Savings include money left over. */
  split: Record<Kind, number> | null;
}

export function summarize(b: Budget): Summary {
  const income = sumMonthly(b.income);
  const spending = sumMonthly(b.spending);
  const byKind: Record<Kind, number> = { need: 0, want: 0, save: 0 };
  for (const l of b.spending) byKind[l.kind ?? 'need'] += perMonth(l);
  const left = income - spending;
  const split = income > 0
    ? {
        need: byKind.need / income,
        want: byKind.want / income,
        save: (byKind.save + Math.max(0, left)) / income,
      }
    : null;
  return { income, spending, left, byKind, split };
}

export interface GoalPlan {
  remaining: number;
  monthly: number;
  months: number | null;
}

export function goalPlan(goal: Goal, left: number): GoalPlan {
  const remaining = Math.max(0, goal.target - goal.saved);
  const monthly = goal.monthly === null ? Math.max(0, left) : Math.max(0, goal.monthly);
  if (remaining === 0) return { remaining, monthly, months: 0 };
  if (monthly <= 0) return { remaining, monthly, months: null };
  return { remaining, monthly, months: Math.ceil(remaining / monthly - 1e-9) };
}

const formatters = new Map<string, Intl.NumberFormat>();

function formatter(currency: string, whole: boolean): Intl.NumberFormat {
  const key = `${currency}:${whole}`;
  let f = formatters.get(key);
  if (f) return f;
  try {
    // Use the currency's own decimals (2 for most, 0 for yen) unless the amount is whole.
    const digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
    const d = whole ? 0 : digits;
    f = new Intl.NumberFormat('en', { style: 'currency', currency, minimumFractionDigits: d, maximumFractionDigits: d });
  } catch {
    f = new Intl.NumberFormat('en', { maximumFractionDigits: whole ? 0 : 2 });
  }
  formatters.set(key, f);
  return f;
}

/** Money with no decimals when the amount is whole, the currency's usual decimals when it is not. */
export function money(n: number, currency: string): string {
  const rounded = Math.round(n * 100) / 100;
  return formatter(currency, Number.isInteger(rounded)).format(rounded);
}

export function percent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function budgetCsv(b: Budget, cell: (v: string | number) => string): string {
  const s = summarize(b);
  const rows: (string | number)[][] = [['Type', 'Name', 'Amount', 'How often', 'Per month', 'Group']];
  const freqLabel = (f: Freq) => FREQS.find((x) => x.id === f)?.label ?? f;
  const kindLabel = (k?: Kind) => KINDS.find((x) => x.id === (k ?? 'need'))?.label ?? '';
  for (const l of b.income) rows.push(['Money in', l.name, l.amount, freqLabel(l.freq), round2(perMonth(l)), '']);
  for (const l of b.spending) rows.push(['Money out', l.name, l.amount, freqLabel(l.freq), round2(perMonth(l)), kindLabel(l.kind)]);
  rows.push([]);
  rows.push(['Total money in per month', '', '', '', round2(s.income), '']);
  rows.push(['Total money out per month', '', '', '', round2(s.spending), '']);
  rows.push(['Left over per month', '', '', '', round2(s.left), '']);
  rows.push(['Currency', b.currency, '', '', '', '']);
  return rows.map((r) => r.map(cell).join(',')).join('\r\n');
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
