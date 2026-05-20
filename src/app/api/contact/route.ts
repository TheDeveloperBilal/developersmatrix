import { NextResponse } from 'next/server';
import { sendEmail, isEmailConfigured } from '@/lib/email';
import {
  buildGeneralEmail,
  buildCollaborationEmail,
  buildNewsletterEmail,
  buildAutoReply,
} from '@/lib/email-templates';

const RECIPIENT = process.env.NOTIFY_EMAIL || 'sy.bilalshah@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, name, email, message, subject, company, service, budget } = body;

    // ── Newsletter (footer) ────────────────────────────────────────────
    if (type === 'newsletter') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
      }

      const { subject: subj, html, text } = buildNewsletterEmail({
        type: 'newsletter',
        email,
        name: '',
        message: '',
      });

      const sent = await trySend({ subject: subj, html, text });

      if (!sent) {
        return NextResponse.json(
          { error: 'Email service not configured. Please set GMAIL_APP_PASSWORD in environment variables.' },
          { status: 503 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Subscribed successfully! Welcome to the newsletter.',
      });
    }

    // ── General Contact ────────────────────────────────────────────────
    if (type === 'general') {
      if (!name || !email || !message) {
        return NextResponse.json(
          { error: 'Name, email, and message are required' },
          { status: 400 }
        );
      }

      const { subject: subj, html, text } = buildGeneralEmail({
        type: 'general',
        name,
        email,
        message,
        subject,
      });

      const sent = await trySend({ subject: subj, html, text });
      if (!sent) return notConfigured();

      // Auto-reply to the user
      const autoReply = buildAutoReply({ type: 'general', name, email, message });
      await trySend({ ...autoReply, to: email });

      return NextResponse.json({
        success: true,
        message: 'Message sent! We will get back to you within 24–48 hours.',
      });
    }

    // ── Collaboration / Connect ────────────────────────────────────────
    if (type === 'collaboration') {
      if (!name || !email || !service || !message) {
        return NextResponse.json(
          { error: 'Name, email, service, and message are required' },
          { status: 400 }
        );
      }

      const { subject: subj, html, text } = buildCollaborationEmail({
        type: 'collaboration',
        name,
        email,
        message,
        company,
        service,
        budget,
      });

      const sent = await trySend({ subject: subj, html, text });
      if (!sent) return notConfigured();

      // Auto-reply to the user
      const autoReply = buildAutoReply({ type: 'collaboration', name, email, message });
      await trySend({ ...autoReply, to: email });

      return NextResponse.json({
        success: true,
        message: 'Partnership inquiry sent! We will review it and respond within 24–48 hours.',
      });
    }

    return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    );
  }
}

async function trySend(payload: { subject: string; html: string; text: string; to?: string }): Promise<boolean> {
  if (!isEmailConfigured()) return false;
  try {
    await sendEmail({ ...payload, to: payload.to || RECIPIENT });
    return true;
  } catch (err) {
    console.error('Email send failed:', err);
    return false;
  }
}

function notConfigured() {
  return NextResponse.json(
    { error: 'Email service not configured. Please set GMAIL_APP_PASSWORD in environment variables.' },
    { status: 503 }
  );
}
