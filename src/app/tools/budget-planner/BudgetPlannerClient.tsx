'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Plus, Printer, RotateCcw, X } from 'lucide-react';
import {
  CURRENCIES, EMPTY_BUDGET, FREQS, KINDS, STARTERS, budgetCsv, goalPlan, isBudget, money, percent, perMonth, summarize,
  type Budget, type Freq, type Kind, type Line,
} from '@/lib/planner/budget';
import { csvCell, downloadFile, monthName, newId, useStoredState } from '@/lib/planner/store';

const STORE_KEY = 'dm-budget';

const INCOME_STARTERS = ['Salary', 'Freelance or side income', 'Benefits', 'Other income'];

const SEGMENT_COLORS = ['bg-sky-700', 'bg-teal-600', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-slate-500'];

const GUIDE: Record<Kind, number> = { need: 0.5, want: 0.3, save: 0.2 };

/* ---------------- Small inputs ---------------- */

function AmountInput({ value, onChange, label, id, autoFocus }: { value: number; onChange: (n: number) => void; label: string; id?: string; autoFocus?: boolean }) {
  const [draft, setDraft] = useState(value ? String(value) : '');
  useEffect(() => {
    const parsed = parseFloat(draft);
    if ((Number.isFinite(parsed) ? parsed : 0) !== value) setDraft(value ? String(value) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <input
      id={id}
      autoFocus={autoFocus}
      type="number"
      inputMode="decimal"
      min={0}
      step="any"
      aria-label={label}
      placeholder="0"
      value={draft}
      onChange={(e) => {
        setDraft(e.target.value);
        const n = parseFloat(e.target.value);
        onChange(Number.isFinite(n) && n > 0 ? n : 0);
      }}
      className="h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 font-mono text-[15px] tabular-nums text-slate-900 outline-none transition focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
    />
  );
}

const selectCls = 'h-10 min-w-0 rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200';

/* ---------------- Ledger ---------------- */

function Ledger({
  side, lines, currency, onChange, onAdd, onRemove, starters, onStarter, focusId,
}: {
  side: 'in' | 'out';
  lines: Line[];
  currency: string;
  onChange: (id: string, patch: Partial<Line>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  starters: string[];
  onStarter: (name: string) => void;
  focusId: { id: string; field: 'name' | 'amount' } | null;
}) {
  const total = lines.reduce((s, l) => s + perMonth(l), 0);
  const isIn = side === 'in';
  const headingId = isIn ? 'bp-in' : 'bp-out';
  return (
    <section aria-labelledby={headingId} className="flex min-w-0 flex-col">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-slate-900 pb-2 dark:border-slate-200">
        <div>
          <h2 id={headingId} className="text-lg font-semibold text-slate-900 dark:text-white">{isIn ? 'Money in' : 'Money out'}</h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">{isIn ? 'Take home pay, after tax' : 'Bills, spending and savings'}</p>
        </div>
        <p className={`font-mono text-lg font-semibold tabular-nums ${isIn ? 'text-teal-700 dark:text-teal-400' : 'text-rose-700 dark:text-rose-400'}`}>
          {money(total, currency)}<span className="ml-1 text-xs font-normal text-slate-500">/mo</span>
        </p>
      </div>

      {lines.length === 0 ? (
        <p className="border-b border-dashed border-slate-300 py-6 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          {isIn ? 'Add what you take home each month. Add each source of pay as its own line.' : 'Add your bills and spending. Yearly bills like insurance are turned into a monthly amount for you.'}
        </p>
      ) : (
        <ul>
          {lines.map((l) => (
            <li key={l.id} className="border-b border-dashed border-slate-300 py-3 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <input
                  id={`bp-name-${l.id}`}
                  autoFocus={focusId?.id === l.id && focusId.field === 'name'}
                  value={l.name}
                  onChange={(e) => onChange(l.id, { name: e.target.value })}
                  placeholder={isIn ? 'Where it comes from' : 'What it is for'}
                  aria-label={isIn ? 'Income name' : 'Expense name'}
                  className="h-9 min-w-0 flex-1 border-b border-transparent bg-transparent text-[15px] font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-sky-600 dark:text-white"
                />
                <span className="shrink-0 font-mono text-[15px] tabular-nums text-slate-700 dark:text-slate-300" aria-label="Per month">
                  {money(perMonth(l), currency)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemove(l.id)}
                  aria-label={`Remove ${l.name || 'line'}`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className={`mt-2 grid gap-2 ${isIn ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-[1fr_1fr_auto]'}`}>
                <AmountInput value={l.amount} autoFocus={focusId?.id === l.id && focusId.field === 'amount'} onChange={(n) => onChange(l.id, { amount: n })} label={`Amount for ${l.name || 'this line'}`} />
                <select value={l.freq} onChange={(e) => onChange(l.id, { freq: e.target.value as Freq })} aria-label="How often" className={selectCls}>
                  {FREQS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
                </select>
                {!isIn && (
                  <div role="group" aria-label="Group" className="col-span-2 flex rounded-lg border border-slate-300 p-0.5 sm:col-span-1 dark:border-slate-700">
                    {KINDS.map((k) => (
                      <button
                        key={k.id}
                        type="button"
                        title={k.hint}
                        aria-pressed={(l.kind ?? 'need') === k.id}
                        onClick={() => onChange(l.id, { kind: k.id })}
                        className={`h-[34px] flex-1 rounded-md px-2.5 text-[13px] font-medium transition ${
                          (l.kind ?? 'need') === k.id ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                        }`}
                      >
                        {k.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex h-10 items-center justify-center gap-2 self-start rounded-lg border border-slate-300 px-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-300 dark:hover:text-white"
      >
        <Plus className="h-4 w-4" /> Add a line
      </button>

      {starters.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.08em] text-slate-500">Quick add</p>
          <div className="flex flex-wrap gap-1.5">
            {starters.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStarter(s)}
                className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-[13px] text-slate-600 transition hover:border-solid hover:border-sky-600 hover:text-sky-700 dark:border-slate-700 dark:text-slate-400 dark:hover:text-sky-400"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------- Main ---------------- */

export default function BudgetPlannerClient() {
  const [budget, setBudget, ready, saved] = useStoredState<Budget>(STORE_KEY, EMPTY_BUDGET, isBudget);
  const [focusId, setFocusId] = useState<{ id: string; field: 'name' | 'amount' } | null>(null);
  const [monthLabel, setMonthLabel] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const d = new Date();
    setMonthLabel(`${monthName(d.getMonth(), true)} ${d.getFullYear()}`);
  }, []);

  const s = useMemo(() => summarize(budget), [budget]);
  const plan = useMemo(() => goalPlan(budget.goal, s.left), [budget.goal, s.left]);
  const cur = budget.currency;

  const update = (side: 'income' | 'spending', id: string, patch: Partial<Line>) =>
    setBudget((b) => ({ ...b, [side]: b[side].map((l) => (l.id === id ? { ...l, ...patch } : l)) }));
  const remove = (side: 'income' | 'spending', id: string) =>
    setBudget((b) => ({ ...b, [side]: b[side].filter((l) => l.id !== id) }));
  const add = (side: 'income' | 'spending', line?: Partial<Line>) => {
    const id = newId();
    setBudget((b) => ({
      ...b,
      [side]: [...b[side], { id, name: '', amount: 0, freq: 'month', ...(side === 'spending' ? { kind: 'need' as Kind } : {}), ...line }],
    }));
    // Quick add lines already have a name, so jump straight to the amount.
    setFocusId({ id, field: line?.name ? 'amount' : 'name' });
  };
  const setGoal = (patch: Partial<Budget['goal']>) => setBudget((b) => ({ ...b, goal: { ...b.goal, ...patch } }));

  const usedNames = new Set([...budget.income, ...budget.spending].map((l) => l.name.trim().toLowerCase()));
  const outStarters = STARTERS.filter((st) => !usedNames.has(st.name.toLowerCase()));
  const inStarters = INCOME_STARTERS.filter((n) => !usedNames.has(n.toLowerCase()));

  // Where every 100 goes: biggest lines first, the rest grouped.
  const segments = useMemo(() => {
    const lines = budget.spending
      .map((l) => ({ name: l.name.trim() || 'Unnamed', value: perMonth(l) }))
      .filter((l) => l.value > 0)
      .sort((a, b) => b.value - a.value);
    const top = lines.slice(0, 5);
    const rest = lines.slice(5).reduce((sum, l) => sum + l.value, 0);
    const out = top.map((l, i) => ({ ...l, color: SEGMENT_COLORS[i] }));
    if (rest > 0) out.push({ name: 'Everything else', value: rest, color: SEGMENT_COLORS[5] });
    if (s.left > 0) out.push({ name: 'Left over', value: s.left, color: 'bg-emerald-200 dark:bg-emerald-900' });
    return out;
  }, [budget.spending, s.left]);
  const base = Math.max(s.income, s.spending);

  const exportCsv = () => downloadFile(`budget-${new Date().toISOString().slice(0, 10)}.csv`, budgetCsv(budget, csvCell), 'text/csv;charset=utf-8');

  const clearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      if (clearTimer.current) clearTimeout(clearTimer.current);
      clearTimer.current = setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    setBudget({ ...EMPTY_BUDGET, currency: budget.currency });
    setConfirmClear(false);
  };

  const hasAny = budget.income.length + budget.spending.length > 0;
  const goalDate = (() => {
    if (plan.months === null || plan.months === 0) return '';
    const d = new Date();
    d.setMonth(d.getMonth() + plan.months);
    return `${monthName(d.getMonth(), true)} ${d.getFullYear()}`;
  })();

  return (
    <div id="bp-statement" className="overflow-hidden rounded-3xl border border-slate-300 bg-[#fcfbf8] text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <style>{`@media print { body * { visibility: hidden !important; } #bp-statement, #bp-statement * { visibility: visible !important; } #bp-statement { position: absolute; inset: 0 auto auto 0; width: 100%; border: 0; box-shadow: none; } #bp-statement .bp-noprint { display: none !important; } }`}</style>

      {/* Statement header */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-300 bg-white px-4 py-5 sm:px-8 dark:border-slate-800 dark:bg-slate-950">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-sky-800 dark:text-sky-400">Monthly statement</p>
          <p className="mt-1 font-serif text-2xl text-slate-900 dark:text-white sm:text-3xl">{monthLabel || 'This month'}</p>
        </div>
        <div className="bp-noprint flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="bp-currency">Currency</label>
          <select
            id="bp-currency"
            value={cur}
            onChange={(e) => setBudget((b) => ({ ...b, currency: e.target.value }))}
            className={selectCls}
          >
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} · {c.label}</option>)}
          </select>
          <button type="button" onClick={exportCsv} disabled={!hasAny} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Download className="h-4 w-4" /> CSV
          </button>
          <button type="button" onClick={() => window.print()} disabled={!hasAny} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-900 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Printer className="h-4 w-4" /> Print
          </button>
          <button type="button" onClick={clearAll} disabled={!hasAny} className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition disabled:opacity-40 ${confirmClear ? 'border-rose-600 bg-rose-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-rose-600 hover:text-rose-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'}`}>
            <RotateCcw className="h-4 w-4" /> {confirmClear ? 'Tap again to clear' : 'Start over'}
          </button>
        </div>
      </div>

      {/* Totals */}
      <dl className="grid grid-cols-3 divide-x divide-slate-300 border-b border-slate-300 dark:divide-slate-800 dark:border-slate-800">
        {[
          { label: 'Money in', value: s.income, cls: 'text-teal-700 dark:text-teal-400' },
          { label: 'Money out', value: s.spending, cls: 'text-rose-700 dark:text-rose-400' },
          { label: s.left < 0 ? 'Short by' : 'Left over', value: Math.abs(s.left), cls: s.left < 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-900 dark:text-white' },
        ].map((t) => (
          <div key={t.label} className="px-3 py-4 sm:px-8 sm:py-5">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-[12px]">{t.label}</dt>
            <dd className={`mt-1 truncate font-mono text-lg font-semibold tabular-nums sm:text-3xl ${t.cls}`}>{money(t.value, cur)}</dd>
            <dd className="text-[11px] text-slate-500 sm:text-xs">per month</dd>
          </div>
        ))}
      </dl>

      {/* Ledgers */}
      <div className="grid gap-10 px-4 py-6 sm:px-8 lg:grid-cols-2">
        <Ledger
          side="in"
          lines={budget.income}
          currency={cur}
          onChange={(id, p) => update('income', id, p)}
          onAdd={() => add('income')}
          onRemove={(id) => remove('income', id)}
          starters={inStarters}
          onStarter={(name) => add('income', { name })}
          focusId={focusId}
        />
        <Ledger
          side="out"
          lines={budget.spending}
          currency={cur}
          onChange={(id, p) => update('spending', id, p)}
          onAdd={() => add('spending')}
          onRemove={(id) => remove('spending', id)}
          starters={outStarters.map((st) => st.name)}
          onStarter={(name) => {
            const st = STARTERS.find((x) => x.name === name);
            add('spending', { name, kind: st?.kind ?? 'need', freq: st?.freq ?? 'month' });
          }}
          focusId={focusId}
        />
      </div>

      {/* Where every 100 goes */}
      <section aria-labelledby="bp-share" className="border-t border-slate-300 px-4 py-6 sm:px-8 dark:border-slate-800">
        <h2 id="bp-share" className="text-lg font-semibold text-slate-900 dark:text-white">Where every 100 goes</h2>
        {s.income <= 0 || segments.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add money in and money out to see how each 100 you take home is split.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              For every 100 you take home{s.left < 0 ? `, you spend ${Math.round((s.spending / s.income) * 100)}. The bar shows your spending, which is more than comes in.` : '.'}
            </p>
            <div className="mt-4 flex h-6 w-full overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800" role="img" aria-label={segments.map((g) => `${g.name} ${Math.round((g.value / s.income) * 100)}`).join(', ')}>
              {segments.map((g) => (
                <div key={g.name} className={`${g.color} h-full border-r border-white/70 last:border-0 dark:border-slate-900`} style={{ width: `${(g.value / base) * 100}%` }} />
              ))}
            </div>
            <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {segments.map((g) => (
                <li key={g.name} className="flex items-center gap-2">
                  <span className={`h-3 w-3 shrink-0 rounded-sm ${g.color}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate text-slate-700 dark:text-slate-300">{g.name}</span>
                  <span className="font-mono tabular-nums text-slate-900 dark:text-white">{Math.round((g.value / s.income) * 100)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Rule of thumb and goal */}
      <div className="grid border-t border-slate-300 lg:grid-cols-2 dark:border-slate-800">
        <section aria-labelledby="bp-rule" className="px-4 py-6 sm:px-8 lg:border-r lg:border-slate-300 dark:lg:border-slate-800">
          <h2 id="bp-rule" className="text-lg font-semibold text-slate-900 dark:text-white">50/30/20 check</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Needs, wants and savings as a share of take home pay. Money left over counts as saving.</p>
          {!s.split ? (
            <p className="mt-4 text-sm text-slate-500">Add your take home pay first.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {KINDS.map((k) => {
                const share = s.split![k.id];
                const guide = GUIDE[k.id];
                const off = k.id === 'save' ? share < guide - 0.005 : share > guide + 0.005;
                return (
                  <li key={k.id}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{k.id === 'need' ? 'Needs' : k.id === 'want' ? 'Wants' : 'Savings'}</span>
                      <span className="font-mono tabular-nums">
                        <span className={off ? 'font-semibold text-amber-700 dark:text-amber-400' : 'font-semibold text-slate-900 dark:text-white'}>{percent(share)}</span>
                        <span className="text-slate-500"> / guide {percent(guide)}</span>
                      </span>
                    </div>
                    <div className="relative mt-1.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800">
                      <div className={`h-full rounded-full ${off ? 'bg-amber-500' : 'bg-sky-700 dark:bg-sky-500'}`} style={{ width: `${Math.min(100, share * 100)}%` }} />
                      <div className="absolute -top-1 h-[18px] w-0.5 bg-slate-900 dark:bg-white" style={{ left: `${guide * 100}%` }} aria-hidden="true" />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-5 text-[13px] leading-relaxed text-slate-500 dark:text-slate-400">
            The 50/30/20 split comes from the book <cite>All Your Worth</cite> by Elizabeth Warren and Amelia Warren Tyagi (2005). It is a rule of thumb, not a test. Where rent is high, needs often take more than half.
          </p>
        </section>

        <section aria-labelledby="bp-goal" className="border-t border-slate-300 px-4 py-6 sm:px-8 lg:border-t-0 dark:border-slate-800">
          <h2 id="bp-goal" className="text-lg font-semibold text-slate-900 dark:text-white">Savings goal</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="mb-1 block text-[13px] font-medium text-slate-600 dark:text-slate-400">Saving for</span>
              <input
                value={budget.goal.name}
                onChange={(e) => setGoal({ name: e.target.value })}
                placeholder="Emergency fund"
                className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-[15px] outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-600/20 dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <label>
              <span className="mb-1 block text-[13px] font-medium text-slate-600 dark:text-slate-400">Target</span>
              <AmountInput value={budget.goal.target} onChange={(n) => setGoal({ target: n })} label="Goal target" />
            </label>
            <label>
              <span className="mb-1 block text-[13px] font-medium text-slate-600 dark:text-slate-400">Saved so far</span>
              <AmountInput value={budget.goal.saved} onChange={(n) => setGoal({ saved: n })} label="Saved so far" />
            </label>
          </div>

          <fieldset className="mt-4">
            <legend className="mb-2 text-[13px] font-medium text-slate-600 dark:text-slate-400">Each month I put aside</legend>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="bp-monthly" checked={budget.goal.monthly === null} onChange={() => setGoal({ monthly: null })} className="h-4 w-4 accent-sky-700" />
                What is left over <span className="font-mono tabular-nums text-slate-500">({money(Math.max(0, s.left), cur)})</span>
              </label>
              <label className="flex flex-wrap items-center gap-2">
                <input type="radio" name="bp-monthly" checked={budget.goal.monthly !== null} onChange={() => setGoal({ monthly: Math.max(0, Math.round(s.left)) })} className="h-4 w-4 accent-sky-700" />
                A set amount
                {budget.goal.monthly !== null && (
                  <span className="w-36"><AmountInput value={budget.goal.monthly} onChange={(n) => setGoal({ monthly: n })} label="Amount each month" /></span>
                )}
              </label>
            </div>
          </fieldset>

          <div className="mt-5 rounded-xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-950" aria-live="polite">
            {budget.goal.target <= 0 ? (
              <p className="text-sm text-slate-500">Set a target to see how long it will take.</p>
            ) : (
              <>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.min(100, (budget.goal.saved / budget.goal.target) * 100)}%` }} />
                </div>
                <p className="mt-2 text-[13px] text-slate-500">{money(budget.goal.saved, cur)} of {money(budget.goal.target, cur)}</p>
                <p className="mt-3 text-[15px] text-slate-800 dark:text-slate-200">
                  {plan.months === 0
                    ? 'You have already reached this goal.'
                    : plan.months === null
                      ? `Nothing is being put aside yet, so the remaining ${money(plan.remaining, cur)} has no end date.`
                      : <>At {money(plan.monthly, cur)} a month you reach it in <strong>{plan.months} {plan.months === 1 ? 'month' : 'months'}</strong>{goalDate ? `, around ${goalDate}` : ''}.</>}
                </p>
              </>
            )}
          </div>
        </section>
      </div>

      <p className="bp-noprint border-t border-slate-300 px-4 py-3 text-[12px] text-slate-500 sm:px-8 dark:border-slate-800">
        {!ready ? 'Loading your saved budget…' : saved ? 'Saved in this browser only. Nothing is sent to our servers.' : 'Your browser is blocking storage, so this budget will not be kept after you close the page. Download the CSV to keep a copy.'}
      </p>
    </div>
  );
}
