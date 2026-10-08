'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Loader2, Mail } from 'lucide-react';
import {
  BUDGETS,
  CONTACT_EMAIL,
  EMPTY_FORM,
  LIMITS,
  SERVICES,
  validateForm,
  type FieldErrors,
  type FormKind,
  type FormValues,
} from '@/lib/contact-form';

interface Props {
  kind: FormKind;
  /** Lets the page preselect a service. Change `nonce` to apply it again. */
  preset?: { service: string; nonce: number };
  submitLabel?: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const field =
  'block w-full rounded-xl border bg-white px-4 py-3 text-[0.95rem] text-ink-950 placeholder:text-ink-400 transition focus:outline-none focus:ring-4 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500';
const ok = 'border-ink-300 focus:border-brand-600 focus:ring-brand-600/15 dark:border-ink-700 dark:focus:border-brand-400';
const bad = 'border-red-500 focus:border-red-500 focus:ring-red-500/15 dark:border-red-400';
const labelCls = 'mb-1.5 block text-sm font-semibold text-ink-800 dark:text-ink-100';

export default function ContactForm({ kind, preset, submitLabel }: Props) {
  const [values, setValues] = useState<FormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (!preset?.service) return;
    setValues((v) => ({ ...v, service: preset.service }));
    setErrors((e) => ({ ...e, service: undefined }));
    setStatus((s) => (s === 'sent' ? 'idle' : s));
  }, [preset?.service, preset?.nonce]);

  const set = (key: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateForm(kind, values);
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
          type: kind,
          ...values,
          website: honeypot,
          elapsedMs: Date.now() - startedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus('sent');
        setValues(EMPTY_FORM);
        startedAt.current = Date.now();
        return;
      }
      if (data.fieldErrors) {
        setErrors(data.fieldErrors);
        focusFirstError(data.fieldErrors);
      }
      setServerMsg(data.error || `Your message could not be sent. Please email ${CONTACT_EMAIL}.`);
      setStatus('error');
    } catch {
      setServerMsg(`Your connection dropped before the message was sent. Please try again, or email ${CONTACT_EMAIL}.`);
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950/40 sm:p-8">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
        <h3 className="mt-4 font-sora text-xl font-semibold text-ink-950 dark:text-white">Message sent</h3>
        <p className="mt-2 text-ink-700 dark:text-ink-300">
          Thanks. A confirmation is on its way to your inbox, and I will reply within 24 to 48 hours. If the confirmation does not arrive, check your spam folder.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 inline-flex min-h-[44px] items-center rounded-xl border border-ink-300 px-5 text-sm font-semibold text-ink-800 transition hover:border-ink-950 dark:border-ink-700 dark:text-ink-100 dark:hover:border-white"
        >
          Send another message
        </button>
      </div>
    );
  }

  const err = (k: keyof FormValues) =>
    errors[k] ? (
      <p id={`${kind}-${k}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
        {errors[k]}
      </p>
    ) : null;

  const aria = (k: keyof FormValues) => ({
    'aria-invalid': errors[k] ? true : undefined,
    'aria-describedby': errors[k] ? `${kind}-${k}-error` : undefined,
  });

  const id = (k: string) => `${kind}-${k}`;
  const messageLength = values.message.trim().length;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>Leave this empty</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className={labelCls}>Your name</label>
          <input id={id('name')} name="name" type="text" autoComplete="name" maxLength={LIMITS.name} value={values.name} onChange={set('name')} className={`${field} ${errors.name ? bad : ok}`} {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor={id('email')} className={labelCls}>Email</label>
          <input id={id('email')} name="email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={values.email} onChange={set('email')} className={`${field} ${errors.email ? bad : ok}`} {...aria('email')} />
          {err('email')}
        </div>
      </div>

      {kind === 'general' && (
        <div>
          <label htmlFor={id('subject')} className={labelCls}>Subject</label>
          <input id={id('subject')} name="subject" type="text" maxLength={LIMITS.subject} placeholder="A bug, an idea, a question" value={values.subject} onChange={set('subject')} className={`${field} ${errors.subject ? bad : ok}`} {...aria('subject')} />
          {err('subject')}
        </div>
      )}

      {kind === 'collaboration' && (
        <>
          <div>
            <label htmlFor={id('company')} className={labelCls}>
              Company or website <span className="font-normal text-ink-500 dark:text-ink-400">(optional)</span>
            </label>
            <input id={id('company')} name="company" type="text" autoComplete="organization" maxLength={LIMITS.company} value={values.company} onChange={set('company')} className={`${field} ${errors.company ? bad : ok}`} {...aria('company')} />
            {err('company')}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={id('service')} className={labelCls}>Interested in</label>
              <div className="relative">
                <select id={id('service')} name="service" value={values.service} onChange={set('service')} className={`${field} ${errors.service ? bad : ok} appearance-none pr-10`} {...aria('service')}>
                <option value="">Choose one</option>
                {SERVICES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              </div>
              {err('service')}
            </div>
            <div>
              <label htmlFor={id('budget')} className={labelCls}>
                Budget <span className="font-normal text-ink-500 dark:text-ink-400">(optional)</span>
              </label>
              <div className="relative">
                <select id={id('budget')} name="budget" value={values.budget} onChange={set('budget')} className={`${field} ${errors.budget ? bad : ok} appearance-none pr-10`} {...aria('budget')}>
                <option value="">Choose a range</option>
                {BUDGETS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
              </div>
              {err('budget')}
            </div>
          </div>
        </>
      )}

      <div>
        <label htmlFor={id('message')} className={labelCls}>
          {kind === 'collaboration' ? 'Tell me about it' : 'Message'}
        </label>
        <textarea
          id={id('message')}
          name="message"
          rows={6}
          maxLength={LIMITS.messageMax}
          placeholder={kind === 'collaboration' ? 'What you want to promote or build, a link if you have one, and your timeline.' : 'How can I help?'}
          value={values.message}
          onChange={set('message')}
          className={`${field} ${errors.message ? bad : ok} resize-y`}
          {...aria('message')}
        />
        <div className="mt-1.5 flex items-start justify-between gap-4">
          <div className="min-w-0">{err('message')}</div>
          <span className="shrink-0 text-xs tabular-nums text-ink-400 dark:text-ink-500">
            {messageLength}/{LIMITS.messageMax}
          </span>
        </div>
      </div>

      {status === 'error' && serverMsg && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {serverMsg}
        </div>
      )}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-600/25 disabled:cursor-wait disabled:opacity-70"
        >
          {status === 'sending' ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Sending
            </>
          ) : (
            <>
              {submitLabel || 'Send message'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
        <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center gap-2 text-sm text-ink-600 hover:text-brand-700 dark:text-ink-300 dark:hover:text-brand-300">
          <Mail className="h-4 w-4" aria-hidden="true" /> or email {CONTACT_EMAIL}
        </a>
      </div>
    </form>
  );
}
