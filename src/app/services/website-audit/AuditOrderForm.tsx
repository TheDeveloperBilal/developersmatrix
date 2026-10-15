'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { AUDIT_PRICING, tierPrice, type AuditTierId } from '@/lib/audit-pricing';
import {
  CONTACT_EMAIL,
  EMPTY_FORM,
  LIMITS,
  normalizeSite,
  validateForm,
  type FieldErrors,
  type FormValues,
} from '@/lib/contact-form';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'block w-full rounded-lg border bg-background px-4 py-3 text-[0.95rem] placeholder:text-muted-foreground/70 transition focus:outline-none focus:ring-4';
const ok = 'border-border focus:border-blue-600 focus:ring-blue-600/15';
const bad = 'border-red-500 focus:border-red-500 focus:ring-red-500/15';
const labelCls = 'mb-1.5 block text-sm font-semibold';

const TIER_IDS = AUDIT_PRICING.tiers.map((t) => t.id);

/** "#order-complete" preselects the Complete Audit. */
function tierFromHash(): AuditTierId | undefined {
  if (typeof window === 'undefined') return undefined;
  const id = window.location.hash.replace('#order-', '') as AuditTierId;
  return TIER_IDS.includes(id) ? id : undefined;
}

export default function AuditOrderForm() {
  const [values, setValues] = useState<FormValues>({ ...EMPTY_FORM, tier: 'complete' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [ordered, setOrdered] = useState<{ tier: string; site: string } | null>(null);
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
    const apply = () => {
      const id = tierFromHash();
      if (!id) return;
      setValues((v) => ({ ...v, tier: id }));
      setErrors((e) => ({ ...e, tier: undefined }));
      setStatus((s) => (s === 'sent' ? 'idle' : s));
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm('audit-order', values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }

    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'audit-order',
          name: values.name,
          email: values.email,
          tier: values.tier,
          siteUrl: values.siteUrl,
          message: values.message,
          website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const t = AUDIT_PRICING.tiers.find((x) => x.id === values.tier);
        setOrdered({ tier: t ? `${t.name} (${tierPrice(t)})` : 'audit', site: normalizeSite(values.siteUrl) });
        setStatus('sent');
        setValues((v) => ({ ...EMPTY_FORM, tier: v.tier }));
        startedAt.current = Date.now();
        return;
      }
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        focusFirstError(data.fieldErrors);
      }
      setServerMsg(data.error || `Your order could not be sent. Please email ${CONTACT_EMAIL}.`);
      setStatus('error');
    } catch {
      setServerMsg(`Your connection dropped before the order was sent. Please try again, or email ${CONTACT_EMAIL}.`);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40 sm:p-8">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold">Order received</h3>
        <p className="mt-2 text-muted-foreground">
          Thank you. Your {ordered?.tier} order{ordered?.site ? ` for ${ordered.site}` : ''} has reached our team, and a confirmation is on its way to your inbox.
          Within 24 hours we will email the confirmed scope and a PayPal payment link. Nothing is charged until you pay that link.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">If the confirmation does not arrive, please check your spam folder.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg border px-5 text-sm font-semibold transition hover:bg-muted border-border"
        >
          Order another audit
        </button>
      </div>
    );
  }

  const err = (k: keyof FormValues) =>
    errors[k] ? (
      <p id={`order-${k}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
        {errors[k]}
      </p>
    ) : null;

  const aria = (k: keyof FormValues) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `order-${k}-error` : undefined,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="order-website-hp">Leave this empty</label>
        <input id="order-website-hp" name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <fieldset>
        <legend className={labelCls}>Choose your audit</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {AUDIT_PRICING.tiers.map((t) => {
            const active = values.tier === t.id;
            return (
              <label
                key={t.id}
                className={`relative flex cursor-pointer flex-col rounded-lg border p-4 transition focus-within:ring-4 focus-within:ring-blue-600/15 ${
                  active ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30' : 'border-border hover:border-blue-400'
                }`}
              >
                <input
                  type="radio"
                  name="tier"
                  value={t.id}
                  checked={active}
                  onChange={set('tier')}
                  className="sr-only"
                />
                <span className="text-sm font-semibold">{t.name}</span>
                <span className="mt-1 text-lg font-bold">{tierPrice(t)}</span>
                <span className="mt-1 text-xs text-muted-foreground">{t.turnaround}</span>
                {active && (
                  <CheckCircle2 aria-hidden="true" className="absolute right-3 top-3 h-4 w-4 text-blue-600 dark:text-blue-400" />
                )}
              </label>
            );
          })}
        </div>
        {err('tier')}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="order-name" className={labelCls}>Your name</label>
          <input id="order-name" name="name" type="text" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={set('name')} className={`${field} ${errors.name ? bad : ok}`} {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="order-email" className={labelCls}>Email</label>
          <input id="order-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={set('email')} className={`${field} ${errors.email ? bad : ok}`} {...aria('email')} />
          {err('email')}
        </div>
      </div>

      <div>
        <label htmlFor="order-site" className={labelCls}>Website to audit</label>
        <input id="order-site" name="siteUrl" type="text" inputMode="url" autoComplete="url" placeholder="example.com" maxLength={LIMITS.siteUrl} value={values.siteUrl} onChange={set('siteUrl')} className={`${field} ${errors.siteUrl ? bad : ok}`} {...aria('siteUrl')} />
        {err('siteUrl')}
      </div>

      <div>
        <label htmlFor="order-notes" className={labelCls}>
          Anything we should know? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="order-notes"
          name="message"
          rows={4}
          maxLength={LIMITS.messageMax}
          placeholder="A recent traffic drop, your platform, the pages that matter most, or competitors to compare against."
          value={values.message}
          onChange={set('message')}
          className={`${field} ${errors.message ? bad : ok} resize-y`}
          {...aria('message')}
        />
        {err('message')}
      </div>

      {status === 'error' && serverMsg && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {serverMsg}
        </div>
      )}

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/25 disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending
            </>
          ) : (
            <>
              Send order <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        <p className="text-sm text-muted-foreground">
          No payment now. We reply within 24 hours with the confirmed scope and a PayPal link.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400">
          <Mail className="h-4 w-4" aria-hidden="true" /> Prefer email? {CONTACT_EMAIL}
        </a>
      </div>
    </form>
  );
}
