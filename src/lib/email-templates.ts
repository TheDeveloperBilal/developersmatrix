/**
 * Emails sent by /api/contact.
 *
 * Every value that came from the visitor goes through esc() before it lands in
 * HTML, and through oneLine() before it lands in a subject line.
 */
import { budgetLabel, serviceLabel } from '@/lib/contact-form';
import { AUDIT_PRICING, REFUND_WINDOW_DAYS, findTier, tierPrice } from '@/lib/audit-pricing';

export interface ContactFormData {
  type: 'general' | 'collaboration' | 'audit-order';
  name: string;
  email: string;
  message: string;
  subject?: string;
  company?: string;
  service?: string;
  budget?: string;
  /** Audit orders only. `site` is already reduced to a bare host name. */
  tier?: string;
  site?: string;
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

/** Order from the Website Audit Services page, delivered to you. */
export function buildAuditOrderEmail(data: ContactFormData): Built {
  const tier = findTier(data.tier);
  const tierName = tier ? tier.name : 'Unknown audit';
  const price = tier ? tierPrice(tier) : 'Unknown';
  const site = data.site || 'Not given';
  const subject = `Audit order: ${tierName} (${price}) for ${oneLine(site, 80)}`;
  const notes = data.message.trim() || 'No notes added.';

  const html = shell(subject, `
    <p style="margin:0 0 16px;font-size:15px;font-weight:600;">New audit order from the services page</p>
    <table style="border-collapse:collapse;width:100%;">
      ${row('Audit', tierName)}
      ${row('Price', price)}
      ${row('Website', site)}
      ${row('Name', data.name)}
      ${row('Email', data.email)}
    </table>
    ${messageBlock(notes)}
    <p style="margin:20px 0 0;font-size:13px;color:#6b7280;">Next: confirm the scope and send the PayPal link within 24 hours. Press Reply to answer the customer directly.</p>
  `);

  const text = `New audit order from the services page

Audit: ${tierName}
Price: ${price}
Website: ${site}
Name: ${data.name}
Email: ${data.email}

${notes}

Next: confirm the scope and send the PayPal link within 24 hours.

Sent ${stamp()}`;

  return { subject, html, text };
}

/** Receipt for an audit order, with the steps that follow. */
function buildAuditOrderReceipt(data: ContactFormData, first: string): Built {
  const tier = findTier(data.tier) ?? AUDIT_PRICING.tiers[0];
  const label = `${tier.name} (${tierPrice(tier)})`;
  const site = data.site || 'your website';
  const subject = 'We received your audit order | DevelopersMatrix';
  const delivery = tier.period
    ? 'We send your first report after the first full re audit, and then one report every month.'
    : `Your report arrives within ${tier.turnaround}.`;
  const steps = [
    `Within 24 hours we confirm the scope for ${site} and email you a PayPal payment link. Nothing is charged before then.`,
    'Once you pay, you give us read access to Search Console and Analytics. Our email explains how.',
    delivery,
  ];
  const refund = `If the report is late, or you are not satisfied and tell us within ${REFUND_WINDOW_DAYS} days of delivery, we refund the full amount.`;

  const html = shell(subject, `
    <p style="margin:0 0 16px;font-size:15px;">Hi ${esc(first)},</p>
    <p style="margin:0 0 16px;font-size:15px;">Thank you for your ${esc(label)} order for ${esc(site)}. Here is what happens next:</p>
    <ol style="margin:0 0 16px;padding-left:20px;font-size:15px;">
      ${steps.map((st) => `<li style="margin:0 0 8px;">${esc(st)}</li>`).join('')}
    </ol>
    <p style="margin:0 0 16px;font-size:15px;">${esc(refund)}</p>
    <p style="margin:0 0 16px;font-size:15px;">If you need to add something, just reply to this email.</p>
    <p style="margin:0 0 4px;font-size:15px;">The DevelopersMatrix Team</p>
    <p style="margin:0;font-size:13px;color:#6b7280;">developersmatrix.com</p>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">You received this because someone used this address to order a website audit on DevelopersMatrix. If that was not you, you can ignore this email and nothing will be charged.</p>
  `);

  const text = `Hi ${first},

Thank you for your ${label} order for ${site}. Here is what happens next:

${steps.map((st, i) => `${i + 1}. ${st}`).join('\n')}

${refund}

If you need to add something, just reply to this email.

The DevelopersMatrix Team
https://developersmatrix.com

You received this because someone used this address to order a website audit on DevelopersMatrix. If that was not you, you can ignore this email and nothing will be charged.`;

  return { subject, html, text };
}

/**
 * Short receipt sent to the visitor. It deliberately does not repeat their
 * message, so the form cannot be used to send someone else arbitrary text.
 */
export function buildAutoReply(data: ContactFormData): Built {
  const isCollab = data.type === 'collaboration';
  const first = oneLine(data.name, 60).split(' ')[0] || 'there';
  if (data.type === 'audit-order') return buildAuditOrderReceipt(data, first);
  const subject = isCollab
    ? 'We received your enquiry | DevelopersMatrix'
    : 'We received your message | DevelopersMatrix';

  const what = isCollab ? 'enquiry' : 'message';

  const html = shell(subject, `
    <p style="margin:0 0 16px;font-size:15px;">Hi ${esc(first)},</p>
    <p style="margin:0 0 16px;font-size:15px;">Thank you for getting in touch. Your ${what} has reached our team, and we will reply within 24 hours.</p>
    <p style="margin:0 0 16px;font-size:15px;">If you need to add something, just reply to this email.</p>
    <p style="margin:0 0 4px;font-size:15px;">The DevelopersMatrix Team</p>
    <p style="margin:0;font-size:13px;color:#6b7280;">developersmatrix.com</p>
    <p style="margin:24px 0 0;font-size:12px;color:#9ca3af;">You received this because someone used this address on the DevelopersMatrix ${isCollab ? 'Connect' : 'Contact'} page. If that was not you, you can ignore this email.</p>
  `);

  const text = `Hi ${first},

Thank you for getting in touch. Your ${what} has reached our team, and we will reply within 24 hours.

If you need to add something, just reply to this email.

The DevelopersMatrix Team
https://developersmatrix.com

You received this because someone used this address on the DevelopersMatrix ${isCollab ? 'Connect' : 'Contact'} page. If that was not you, you can ignore this email.`;

  return { subject, html, text };
}
