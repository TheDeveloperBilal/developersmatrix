'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Copy, Download, FileText, Printer, RotateCcw, Shuffle, TriangleAlert, X } from 'lucide-react';
import { analyseJob, composeLetter, WHY_PLACEHOLDER_PREFIX } from '@/lib/cover-letter/compose';
import { reviewLetter } from '@/lib/cover-letter/review';
import { findSkills } from '@/lib/cover-letter/skills';
import { EMPTY_INPUT, validate, type Errors, type FieldKey, type LetterInput } from '@/lib/cover-letter/validate';

/* ------------------------------------------------------------------ */
/* Shared surfaces, same recipe as the other tools                     */
/* ------------------------------------------------------------------ */

const glass =
  'rounded-3xl border border-white/70 bg-white/60 backdrop-blur-2xl ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_30px_80px_-40px_rgba(15,23,42,0.45)] ' +
  'dark:border-white/[0.08] dark:bg-slate-900/40 ' +
  'dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-40px_rgba(0,0,0,0.9)]';

const inset = 'rounded-2xl border border-slate-900/[0.06] bg-white/70 dark:border-white/[0.06] dark:bg-white/[0.03]';

const eyebrow = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400';

const control =
  'w-full rounded-xl border bg-white/80 px-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 ' +
  'focus:ring-4 dark:bg-slate-950/40 dark:text-slate-100';

const primaryBtn =
  'inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white ' +
  'shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_10px_30px_-12px_rgba(15,23,42,0.6)] transition hover:bg-slate-800 ' +
  'disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100';

const toolBtn =
  'inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-900/10 bg-white/70 px-3 text-xs font-medium ' +
  'text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.08]';

const STORAGE_KEY = 'dm-cover-letter-profile-v1';
const PROFILE_FIELDS: (keyof LetterInput)[] = ['name', 'email', 'phone', 'link', 'currentRole', 'years', 'skills'];

const YEARS = [
  ['', 'Prefer not to say'],
  ['0', 'Less than 1 year'],
  ['1', '1 year'],
  ['2', '2 years'],
  ['3', '3 years'],
  ['4', '4 years'],
  ['5', '5 years'],
  ['6', '6 years'],
  ['7', '7 years'],
  ['8', '8 years'],
  ['9', '9 years'],
  ['10+', '10 or more years'],
] as const;

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
        {optional && <span className="text-[11px] font-normal text-slate-400">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400">
          <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

function ringFor(error?: string) {
  return error
    ? 'border-rose-400/70 focus:border-rose-500 focus:ring-rose-500/10'
    : 'border-slate-900/10 focus:border-slate-900/30 focus:ring-slate-900/5 dark:border-white/10 dark:focus:border-white/25';
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; title: string; sub?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-1 rounded-xl bg-slate-900/[0.04] p-1 dark:bg-white/[0.04] ${options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={value === o.key}
          onClick={() => onChange(o.key)}
          className={[
            'rounded-lg px-1 py-2 text-center transition-colors',
            value === o.key
              ? 'bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ].join(' ')}
        >
          <span className="block text-sm font-medium">{o.title}</span>
          {o.sub && <span className="block text-[11px] opacity-70">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}

function SectionTitle({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
      <span className="mr-2 font-mono text-slate-400">{n}</span>
      {children}
    </h3>
  );
}

function Chip({ tone, children }: { tone: 'good' | 'warn' | 'plain'; children: React.ReactNode }) {
  const cls =
    tone === 'good'
      ? 'bg-emerald-500/[0.08] text-emerald-700 ring-emerald-500/20 dark:text-emerald-300'
      : tone === 'warn'
        ? 'bg-amber-500/[0.08] text-amber-800 ring-amber-500/25 dark:text-amber-300'
        : 'bg-slate-900/[0.04] text-slate-700 ring-slate-900/10 dark:bg-white/[0.05] dark:text-slate-300 dark:ring-white/10';
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${cls}`}>{children}</span>;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'company';
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function CoverLetterClient() {
  const [input, setInput] = useState<LetterInput>(EMPTY_INPUT);
  const [errors, setErrors] = useState<Errors>({});
  const [letter, setLetter] = useState('');
  const [generatedFrom, setGeneratedFrom] = useState<LetterInput | null>(null);
  const [variant, setVariant] = useState(0);
  const [edited, setEdited] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remember, setRemember] = useState(true);
  const [restored, setRestored] = useState(false);

  const outputRef = useRef<HTMLElement>(null);
  const letterRef = useRef<HTMLTextAreaElement>(null);

  // Personal details are kept on this device only, so a second letter takes seconds.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<LetterInput>;
      setInput((prev) => {
        const next = { ...prev };
        for (const k of PROFILE_FIELDS) if (typeof saved[k] === 'string') (next[k] as string) = saved[k] as string;
        return next;
      });
      setRestored(true);
    } catch {
      /* storage blocked or corrupt: start empty */
    }
  }, []);

  // Grow the letter box with its content so the page never gets a second scrollbar.
  useEffect(() => {
    const el = letterRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [letter]);

  const set = <K extends keyof LetterInput>(key: K, value: LetterInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
    if (errors[key as FieldKey]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const postingSkills = useMemo(() => (input.jobDescription.trim().length > 80 ? findSkills(input.jobDescription).map((h) => h.name) : []), [input.jobDescription]);
  const match = useMemo(() => (generatedFrom ? analyseJob(generatedFrom) : null), [generatedFrom]);
  const checks = useMemo(
    () =>
      letter && generatedFrom
        ? reviewLetter(letter, { company: generatedFrom.company, jobTitle: generatedFrom.jobTitle, length: generatedFrom.length, match })
        : [],
    [letter, generatedFrom, match]
  );
  const passed = checks.filter((c) => c.ok).length;

  const saveProfile = (data: LetterInput) => {
    try {
      if (remember) {
        const profile: Partial<LetterInput> = {};
        for (const k of PROFILE_FIELDS) (profile[k] as string) = data[k] as string;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* ignore */
    }
  };

  const generate = (nextVariant = variant) => {
    const found = validate(input);
    const keys = Object.keys(found).filter((k) => found[k as FieldKey]) as FieldKey[];
    setErrors(found);
    if (keys.length > 0) {
      const el = document.getElementById(`cl-${keys[0]}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLInputElement | null)?.focus({ preventScroll: true });
      return;
    }
    if (edited && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    setConfirmReplace(false);
    setLetter(composeLetter(input, nextVariant));
    setGeneratedFrom({ ...input });
    setVariant(nextVariant);
    setEdited(false);
    saveProfile(input);
    requestAnimationFrame(() => {
      if (window.innerWidth < 1024) outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(letter);
    } catch {
      letterRef.current?.select();
      document.execCommand('copy');
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const download = () => {
    const blob = new Blob([letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${slug(generatedFrom?.company || 'company')}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const print = () => {
    const frame = document.createElement('iframe');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);
    const doc = frame.contentDocument;
    if (!doc) return;
    doc.open();
    doc.write(
      `<!doctype html><html><head><meta charset="utf-8"><title>Cover letter</title><style>@page{margin:22mm}body{font:11.5pt/1.55 Georgia,'Times New Roman',serif;color:#111;white-space:pre-wrap;margin:0}</style></head><body>${escapeHtml(letter)}</body></html>`
    );
    doc.close();
    window.setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => frame.remove(), 1000);
    }, 150);
  };

  const clearProfile = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setInput((prev) => {
      const next = { ...prev };
      for (const k of PROFILE_FIELDS) (next[k] as string) = '';
      return next;
    });
    setRestored(false);
  };

  const hasPlaceholder = letter.includes(WHY_PLACEHOLDER_PREFIX);

  return (
    <div className={`${glass} p-2 sm:p-3`}>
      <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        {/* ---------------- Form ---------------- */}
        <section aria-label="Your details" className={`${inset} min-w-0 p-4 sm:p-5`}>
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              generate();
            }}
            className="space-y-7"
          >
            <div className="space-y-4">
              <SectionTitle n="01">The job</SectionTitle>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="cl-jobTitle" label="Job title" error={errors.jobTitle}>
                  <input
                    id="cl-jobTitle"
                    value={input.jobTitle}
                    onChange={(e) => set('jobTitle', e.target.value)}
                    placeholder="Senior Frontend Engineer"
                    autoComplete="off"
                    aria-invalid={!!errors.jobTitle}
                    className={`${control} h-11 ${ringFor(errors.jobTitle)}`}
                  />
                </Field>
                <Field id="cl-company" label="Company" error={errors.company}>
                  <input
                    id="cl-company"
                    value={input.company}
                    onChange={(e) => set('company', e.target.value)}
                    placeholder="Stripe"
                    autoComplete="organization"
                    aria-invalid={!!errors.company}
                    className={`${control} h-11 ${ringFor(errors.company)}`}
                  />
                </Field>
              </div>
              <Field id="cl-manager" label="Hiring manager" optional hint="If you know their name. Otherwise the letter greets the hiring team." error={errors.manager}>
                <input
                  id="cl-manager"
                  value={input.manager}
                  onChange={(e) => set('manager', e.target.value)}
                  placeholder="Priya Shah"
                  autoComplete="off"
                  className={`${control} h-11 ${ringFor(errors.manager)}`}
                />
              </Field>
              <Field
                id="cl-jobDescription"
                label="Job description"
                optional
                hint="Paste the full posting. The letter then leads with the skills it asks for."
                error={errors.jobDescription}
              >
                <textarea
                  id="cl-jobDescription"
                  value={input.jobDescription}
                  onChange={(e) => set('jobDescription', e.target.value)}
                  rows={5}
                  placeholder="Paste the job posting here"
                  className={`${control} block resize-y py-3 leading-relaxed ${ringFor(errors.jobDescription)}`}
                />
              </Field>
              {postingSkills.length > 0 && !errors.jobDescription && (
                <div className="rounded-xl bg-slate-900/[0.03] p-3 dark:bg-white/[0.03]">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Found {postingSkills.length} skill{postingSkills.length === 1 ? '' : 's'} in this posting
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {postingSkills.slice(0, 14).map((s) => (
                      <Chip key={s} tone="plain">
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <SectionTitle n="02">About you</SectionTitle>
                {restored && (
                  <button type="button" onClick={clearProfile} className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline dark:hover:text-white">
                    Clear saved details
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="cl-name" label="Your name" error={errors.name}>
                  <input
                    id="cl-name"
                    value={input.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Ayesha Khan"
                    autoComplete="name"
                    className={`${control} h-11 ${ringFor(errors.name)}`}
                  />
                </Field>
                <Field id="cl-email" label="Email" optional error={errors.email}>
                  <input
                    id="cl-email"
                    type="email"
                    value={input.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={`${control} h-11 ${ringFor(errors.email)}`}
                  />
                </Field>
                <Field id="cl-phone" label="Phone" optional error={errors.phone}>
                  <input
                    id="cl-phone"
                    type="tel"
                    value={input.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+1 555 010 0199"
                    autoComplete="tel"
                    className={`${control} h-11 ${ringFor(errors.phone)}`}
                  />
                </Field>
                <Field id="cl-link" label="Portfolio link" optional error={errors.link}>
                  <input
                    id="cl-link"
                    value={input.link}
                    onChange={(e) => set('link', e.target.value)}
                    placeholder="linkedin.com/in/you"
                    autoComplete="url"
                    className={`${control} h-11 ${ringFor(errors.link)}`}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,170px)]">
                <Field id="cl-currentRole" label="Current or most recent role" error={errors.currentRole}>
                  <input
                    id="cl-currentRole"
                    value={input.currentRole}
                    onChange={(e) => set('currentRole', e.target.value)}
                    placeholder="Frontend Developer at Monzo"
                    autoComplete="organization-title"
                    className={`${control} h-11 ${ringFor(errors.currentRole)}`}
                  />
                </Field>
                <Field id="cl-years" label="Experience">
                  <select
                    id="cl-years"
                    value={input.years}
                    onChange={(e) => set('years', e.target.value)}
                    className={`${control} h-11 ${ringFor()}`}
                  >
                    {YEARS.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field id="cl-skills" label="Key skills" optional hint="Separate with commas. Only list what you would happily be tested on." error={errors.skills}>
                <input
                  id="cl-skills"
                  value={input.skills}
                  onChange={(e) => set('skills', e.target.value)}
                  placeholder="React, TypeScript, Node.js, AWS"
                  className={`${control} h-11 ${ringFor(errors.skills)}`}
                />
              </Field>
            </div>

            <div className="space-y-4">
              <SectionTitle n="03">Your evidence</SectionTitle>
              <Field id="cl-achievement1" label="Best result you can point to" hint="Start with a verb and include a number: Cut checkout errors by 40% by rebuilding the form validation." error={errors.achievement1}>
                <textarea
                  id="cl-achievement1"
                  value={input.achievement1}
                  onChange={(e) => set('achievement1', e.target.value)}
                  rows={2}
                  placeholder="Rebuilt the onboarding flow and cut drop off from 38% to 21%"
                  className={`${control} block min-h-[4.75rem] resize-y py-3 leading-relaxed [field-sizing:content] ${ringFor(errors.achievement1)}`}
                />
              </Field>
              <Field id="cl-achievement2" label="A second result" optional error={errors.achievement2}>
                <textarea
                  id="cl-achievement2"
                  value={input.achievement2}
                  onChange={(e) => set('achievement2', e.target.value)}
                  rows={2}
                  placeholder="Led the move to Vite, which made builds four times faster"
                  className={`${control} block min-h-[4.75rem] resize-y py-3 leading-relaxed [field-sizing:content] ${ringFor(errors.achievement2)}`}
                />
              </Field>
              <Field
                id="cl-whyCompany"
                label={`Why ${input.company.trim() || 'this company'}?`}
                optional
                hint="The line recruiters read most closely. A product you use, a launch, a post by their team. Leave it empty and the letter marks the spot for you to fill."
                error={errors.whyCompany}
              >
                <textarea
                  id="cl-whyCompany"
                  value={input.whyCompany}
                  onChange={(e) => set('whyCompany', e.target.value)}
                  rows={2}
                  placeholder="I have used their checkout in two side projects, and their API docs are the clearest I have read"
                  className={`${control} block min-h-[4.75rem] resize-y py-3 leading-relaxed [field-sizing:content] ${ringFor(errors.whyCompany)}`}
                />
              </Field>
              <Field id="cl-extra" label="Anything else relevant" optional hint="A side project, open source work, a certification." error={errors.extra}>
                <textarea
                  id="cl-extra"
                  value={input.extra}
                  onChange={(e) => set('extra', e.target.value)}
                  rows={2}
                  placeholder="I maintain an open source date picker used by around 400 projects"
                  className={`${control} block min-h-[4.75rem] resize-y py-3 leading-relaxed [field-sizing:content] ${ringFor(errors.extra)}`}
                />
              </Field>
            </div>

            <div className="space-y-4">
              <SectionTitle n="04">Style</SectionTitle>
              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">Tone</p>
                <Segmented
                  label="Tone"
                  value={input.tone}
                  onChange={(v) => set('tone', v)}
                  options={[
                    { key: 'professional', title: 'Formal' },
                    { key: 'warm', title: 'Warm' },
                    { key: 'direct', title: 'Direct' },
                  ]}
                />
              </div>
              <div>
                <p className="mb-1.5 text-sm font-medium text-slate-800 dark:text-slate-200">Length</p>
                <Segmented
                  label="Length"
                  value={input.length}
                  onChange={(v) => set('length', v)}
                  options={[
                    { key: 'short', title: 'Short', sub: 'Email or quick apply' },
                    { key: 'standard', title: 'Standard', sub: 'Full application' },
                  ]}
                />
              </div>
            </div>

            <div>
              {Object.values(errors).some(Boolean) && (
                <p className="mb-3 flex items-start gap-2 rounded-xl bg-rose-500/[0.07] px-3.5 py-3 text-sm text-rose-700 ring-1 ring-rose-500/20 dark:text-rose-300">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Fix the highlighted fields first. The letter is built from what you type, so it needs real details.
                </p>
              )}
              {confirmReplace && (
                <p className="mb-3 rounded-xl bg-amber-500/[0.08] px-3.5 py-3 text-sm text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-300">
                  You edited the current letter. Writing it again will replace your edits. Press the button again to continue.
                </p>
              )}
              <button type="submit" className={`${primaryBtn} w-full`}>
                {letter ? 'Write it again' : 'Write my cover letter'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <label className="mt-3 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 accent-slate-900"
                />
                Remember my name, contact details and skills on this device. Nothing is sent to our server.
              </label>
            </div>
          </form>
        </section>

        {/* ---------------- Output ---------------- */}
        <section ref={outputRef} aria-live="polite" aria-label="Your cover letter" className={`${inset} min-w-0 scroll-mt-24 p-4 sm:p-6`}>
          {!letter ? (
            <div className="lg:sticky lg:top-24">
              <EmptyState />
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className={eyebrow}>
                    <span className="mr-2 font-mono">05</span>Your letter
                  </p>
                  <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                    {generatedFrom?.jobTitle} at {generatedFrom?.company}
                    {edited && <span className="ml-2 text-xs text-slate-400">Edited</span>}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button type="button" onClick={copy} className={toolBtn}>
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button type="button" onClick={download} className={toolBtn}>
                    <Download className="h-3.5 w-3.5" aria-hidden="true" /> .txt
                  </button>
                  <button type="button" onClick={print} className={toolBtn}>
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Print or PDF
                  </button>
                </div>
              </div>

              {hasPlaceholder && (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-500/[0.08] px-3.5 py-3 text-sm text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-300">
                  <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  Replace the line in square brackets with your own reason for applying. It is the sentence that makes the letter yours.
                </p>
              )}

              <div className="mt-4 rounded-2xl border border-slate-900/[0.08] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-30px_rgba(15,23,42,0.35)] dark:border-white/[0.08] dark:bg-slate-950/60">
                <label htmlFor="cl-letter" className="sr-only">
                  Cover letter text, editable
                </label>
                <textarea
                  id="cl-letter"
                  ref={letterRef}
                  value={letter}
                  onChange={(e) => {
                    setLetter(e.target.value);
                    setEdited(true);
                  }}
                  spellCheck
                  className="block w-full resize-none overflow-hidden rounded-2xl bg-transparent px-5 py-5 font-serif text-[15px] leading-[1.7] text-slate-800 outline-none focus:ring-4 focus:ring-slate-900/5 dark:text-slate-200 sm:px-8 sm:py-7"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Click anywhere in the letter to edit it. The checks below update as you type.</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => generate(variant + 1)} className={toolBtn}>
                  <Shuffle className="h-3.5 w-3.5" aria-hidden="true" /> Try another opening
                </button>
                {edited && (
                  <button
                    type="button"
                    onClick={() => {
                      if (generatedFrom) {
                        setLetter(composeLetter(generatedFrom, variant));
                        setEdited(false);
                      }
                    }}
                    className={toolBtn}
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Undo my edits
                  </button>
                )}
              </div>

              {/* Checks */}
              <div className="mt-8 border-t border-slate-900/[0.06] pt-6 dark:border-white/[0.06]">
                <div className="flex items-baseline justify-between gap-3">
                  <p className={eyebrow}>
                    <span className="mr-2 font-mono">06</span>Letter check
                  </p>
                  <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                    {passed} of {checks.length} passed
                  </span>
                </div>
                <ul className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                  {checks.map((c) => (
                    <li key={c.id} className="flex min-w-0 gap-3 rounded-xl border border-slate-900/[0.06] p-3 dark:border-white/[0.06]">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${c.ok ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}
                        aria-hidden="true"
                      >
                        {c.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      </span>
                      <span className="min-w-0">
                        <span className="sr-only">{c.ok ? 'Passed: ' : 'Needs work: '}</span>
                        <span className="block text-sm font-medium text-slate-900 dark:text-white">{c.label}</span>
                        <span className="block text-xs leading-relaxed text-slate-500 dark:text-slate-400">{c.detail}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Job match */}
              {match && match.posting.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="min-w-0 rounded-2xl border border-slate-900/[0.06] p-4 dark:border-white/[0.06]">
                    <p className={eyebrow}>You match</p>
                    {match.matched.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">None of your listed skills appear in the posting.</p>
                    ) : (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {match.matched.map((s) => (
                          <Chip key={s} tone="good">
                            {s}
                          </Chip>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 rounded-2xl border border-slate-900/[0.06] p-4 dark:border-white/[0.06]">
                    <p className={eyebrow}>Posting also asks for</p>
                    {match.missing.length === 0 ? (
                      <p className="mt-2 text-sm text-slate-500">Nothing else we could spot.</p>
                    ) : (
                      <>
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {match.missing.slice(0, 10).map((s) => (
                            <Chip key={s} tone="warn">
                              {s}
                            </Chip>
                          ))}
                        </div>
                        <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">
                          If you have real experience with any of these, add them to your skills and write the letter again. If not, leave them out.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col">
      <p className={eyebrow}>How it works</p>
      <h3 className="mt-2 max-w-md text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        A letter built from your real results, not filler.
      </h3>
      <ol className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {[
          ['01', 'Paste the posting', 'The tool finds the skills it asks for and leads with the ones you share.'],
          ['02', 'Add your evidence', 'One or two results with numbers, and why you want this company.'],
          ['03', 'Edit and check', 'Change any line. The letter check flags stock phrases, gaps and placeholders.'],
        ].map(([n, t, d]) => (
          <li key={n} className="rounded-2xl border border-slate-900/[0.06] bg-white/60 p-4 dark:border-white/[0.06] dark:bg-white/[0.02]">
            <span className="font-mono text-xs text-slate-400">{n}</span>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{t}</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{d}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-slate-900/[0.03] p-4 dark:bg-white/[0.03]">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Every sentence comes from what you type or from the job posting. Nothing is made up, so nothing in the letter will
          surprise you in the interview. Everything runs in your browser.
        </p>
      </div>
    </div>
  );
}
