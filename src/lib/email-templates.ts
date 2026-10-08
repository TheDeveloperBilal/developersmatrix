/**
 * Emails sent by /api/contact.
 *
 * Every value that came from the visitor goes through esc() before it lands in
 * HTML, and through oneLine() before it lands in a subject line.
 */
import { budgetLabel, serviceLabel } from '@/lib/contact-form';

export interface ContactFormData {
  type: 'general' | 'collaboration';
  name: string;
  email: string;
  message: string;
  subject?: string;
  company?: string;
  service?: string;
  budget?: string;
}

type Built = { subject: string; html: string; text: string };

function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function oneLine(text: string, max = 120): string {
  return text.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);
}

function stamp(): string {
  return new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
}

const BRAND = '#6d28d9';

function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:24px;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937;line-height:1.6;">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="padding:20px 28px;border-bottom:1px solid #e5e7eb;">
      <span style="font-weight:700;font-size:16px;color:#111827;">Developers<span style="color:${BRAND};">Matrix</span></span>
    </div>
    <div style="padding:28px;">
      ${body}
    </div>
    <div style="padding:16px 28px;background:#fafafa;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
      <a href="https://developersmatrix.com" style="color:${BRAND};text-decoration:none;">developersmatrix.com</a>
    </div>
  </div>
</body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
  <td style="padding:8px 12px 8px 0;font-size:13px;color:#6b7280;vertical-align:top;white-space:nowrap;">${esc(label)}</td>
  <td style="padding:8px 0;font-size:14px;color:#111827;">${esc(value)}</td>
</tr>`;
}

function messageBlock(message: string): string {
  return `<div style="margin-top:20px;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;font-size:14px;white-space:pre-wrap;">${esc(message)}</div>`;
}

const replyHint = `<p style="margin:20px 0 0;font-size:13px;color:#6b7280;">Press Reply to answer the sender directly.</p>`;

/** Message from the Contact page, delivered to you. */
export function buildGeneralEmail(data: ContactFormData): Built {
  const topic = oneLine(data.subject || 'General question');
  const subject = `Contact form: ${topic}`;

  const html = shell(subject, `
    <p style="margin:0 0 16px;font-size:15px;font-weight:600;">New message from the Contact page</p>
    <table style="border-collapse:collapse;width:100%;">
      ${row('Name', data.name)}
      ${row('Email', data.email)}
      ${row('Subject', topic)}
    </table>
    ${messageBlock(data.message)}
    ${replyHint}
  `);

  const text = `New message from the Contact page

Name: ${data.name}
Email: ${data.email}
Subject: ${topic}

${data.message}

Sent ${stamp()}`;

  return { subject, html, text };
}

/** Enquiry from the Connect page, delivered to you. */
export function buildCollaborationEmail(data: ContactFormData): Built {
  const service = serviceLabel(data.service);
  const budget = budgetLabel(data.budget);
  const who = oneLine(data.company ? `${data.name}, ${data.company}` : data.name, 80);
  const subject = `Connect enquiry: ${service} from ${who}`;

  const html = shell(subject, `
    <p style="margin:0 0 16px;font-size:15px;font-weight:600;">New enquiry from the Connect page</p>
    <table style="border-collapse:collapse;width:100%;">
      ${row('Name', data.name)}
      ${row('Email', data.email)}
      ${row('Company', data.company || 'Not given')}
      ${row('Interested in', service)}
      ${row('Budget', budget)}
    </table>
    ${messageBlock(data.message)}
    ${replyHint}
  `);

  const text = `New enquiry from the Connect page

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not given'}
Interested in: ${service}
Budget: ${budget}

${data.message}

Sent ${stamp()}`;

  return { subject, html, text };
}

/**
 * Short receipt sent to the visitor. It deliberately does not repeat their
 * message, so the form cannot be used to send someone else arbitrary text.
 */
export function buildAutoReply(data: ContactFormData): Built {
  const isCollab = data.type === 'collaboration';
  const first = oneLine(data.name, 60).split(' ')[0] || 'there';
  const subject = isCollab
    ? 'I received your enquiry | DevelopersMatrix'
    : 'I received your message | DevelopersMatrix';

  const what = isCollab ? 'enquiry' : 'message';

  const html = shell(subject, `
    <p style="margin:0 0 16px;font-size:15px;">Hi ${esc(first)},</p>
    <p style="margin:0 0 16px;font-size:15px;">Thanks for getting in touch. Your ${what} reached me and I read every one myself. I usually reply within 24 to 48 hours.</p>
    <p style="margin:0 0 16px;font-size:15px;">If you need to add something, just reply to this email.</p>
    <p style="margin:0 0 4px;font-size:15px;">Syed Bilal Shah</p>
    <p style="margin:0;font-size:13px;color:#6b7280;">Founder, DevelopersMatrix</p>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">You received this because someone used this address on the DevelopersMatrix ${isCollab ? 'Connect' : 'Contact'} page. If that was not you, you can ignore this email.</p>
  `);

  const text = `Hi ${first},

Thanks for getting in touch. Your ${what} reached me and I read every one myself. I usually reply within 24 to 48 hours.

If you need to add something, just reply to this email.

Syed Bilal Shah
Founder, DevelopersMatrix
https://developersmatrix.com

You received this because someone used this address on the DevelopersMatrix ${isCollab ? 'Connect' : 'Contact'} page. If that was not you, you can ignore this email.`;

  return { subject, html, text };
}
