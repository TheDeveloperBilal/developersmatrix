import nodemailer from 'nodemailer';

// Gmail SMTP with an app password. The three values live in Vercel env:
// GMAIL_USER (the sending Gmail account), GMAIL_APP_PASSWORD and NOTIFY_EMAIL
// (where form messages are delivered).
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const NOTIFY_TO = process.env.NOTIFY_EMAIL || 'info@developersmatrix.com';

export interface EmailPayload {
  to?: string;
  /** Where a reply should go. For form messages this is the visitor. */
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  await transporter.sendMail({
    from: `"DevelopersMatrix" <${process.env.GMAIL_USER}>`,
    to: payload.to || NOTIFY_TO,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

export function isEmailConfigured(): boolean {
  return !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;
}
