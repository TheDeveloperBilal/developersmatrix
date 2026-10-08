import { NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/email';
import { buildGeneralEmail, buildCollaborationEmail, buildAutoReply } from '@/lib/email-templates';
import { rateLimit, callerKey } from '@/lib/website-audit/rate-limit';
import {
  CONTACT_EMAIL,
  EMPTY_FORM,
  MIN_FILL_MS,
  validateForm,
  type FormKind,
  type FormValues,
} from '@/lib/contact-form';

export const runtime = 'nodejs';

// Five messages per visitor in ten minutes is plenty for a person and stops
// a script from using the auto reply to send mail to strangers.
const LIMIT = 5;
const WINDOW_MS = 10 * 60_000;

const SEND_FAILED = `Sorry, your message could not be sent just now. Please try again in a minute, or email ${CONTACT_EMAIL} directly.`;

function str(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'The form data could not be read. Please refresh the page and try again.' }, { status: 400 });
  }

  const kind = body.type;
  if (kind !== 'general' && kind !== 'collaboration') {
    return NextResponse.json({ error: 'Unknown form.' }, { status: 400 });
  }

  // Spam checks. A filled hidden field or an impossibly fast submit means a
  // bot. We answer "sent" so the bot learns nothing, and send nothing.
  const honeypot = str(body.website);
  const elapsed = typeof body.elapsedMs === 'number' ? body.elapsedMs : 0;
  if (honeypot || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ success: true });
  }

  const limit = rateLimit(`contact:${callerKey(request)}`, LIMIT, WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `You have sent several messages in a short time. Please wait a few minutes, or email ${CONTACT_EMAIL}.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const values: FormValues = {
    ...EMPTY_FORM,
    name: str(body.name).trim(),
    email: str(body.email).trim(),
    subject: str(body.subject).trim(),
    company: str(body.company).trim(),
    service: str(body.service).trim(),
    budget: str(body.budget).trim(),
    message: str(body.message).trim(),
  };

  const fieldErrors = validateForm(kind as FormKind, values);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: 'Please check the highlighted fields.', fieldErrors },
      { status: 400 }
    );
  }

  if (!isEmailConfigured()) {
    // Logged for you in Vercel, never shown to the visitor.
    console.error('Contact form: GMAIL_APP_PASSWORD is not set for this environment.');
    // `code` is not shown on the page. It shows in the browser Network tab so
    // a failed test can be diagnosed without reading server logs.
    return NextResponse.json({ error: SEND_FAILED, code: 'not_configured' }, { status: 503 });
  }

  const data = {
    type: kind as FormKind,
    name: values.name,
    email: values.email,
    message: values.message,
    subject: values.subject,
    company: values.company,
    service: values.service,
    budget: values.budget,
  };

  const notice = kind === 'general' ? buildGeneralEmail(data) : buildCollaborationEmail(data);

  try {
    await sendEmail({ ...notice, replyTo: values.email });
  } catch (err) {
    const e = err as { code?: string; responseCode?: number; message?: string };
    console.error('Contact form: send failed', e?.code, e?.responseCode, e?.message);
    const code = e?.code === 'EAUTH' || e?.responseCode === 535 ? 'smtp_login_rejected' : 'smtp_error';
    return NextResponse.json({ error: SEND_FAILED, code }, { status: 502 });
  }

  // The receipt is a courtesy. If it fails, the message still reached you.
  try {
    await sendEmail({ ...buildAutoReply(data), to: values.email, replyTo: CONTACT_EMAIL });
  } catch (err) {
    console.error('Contact form: auto reply failed', err);
  }

  return NextResponse.json({ success: true });
}
