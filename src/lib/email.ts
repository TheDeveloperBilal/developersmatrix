import nodemailer from 'nodemailer';

// Gmail SMTP with an app password. Values live in Vercel env, set for both
// Production and Preview:
//   GMAIL_APP_PASSWORD  required, the 16 character app password
//   GMAIL_USER          the Gmail account that app password belongs to
//   NOTIFY_EMAIL        where form messages are delivered
// GMAIL_USER falls back to the account the form has always used, so the form
// keeps working if that variable was never added.
const GMAIL_USER = process.env.GMAIL_USER || 'sy.bilalshah@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
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
    from: `"DevelopersMatrix" <${GMAIL_USER}>`,
    to: payload.to || NOTIFY_TO,
    replyTo: payload.replyTo,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

export function isEmailConfigured(): boolean {
  return !!process.env.GMAIL_APP_PASSWORD;
}
