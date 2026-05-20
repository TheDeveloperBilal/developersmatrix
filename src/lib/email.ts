import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'sy.bilalshah@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface EmailPayload {
  to?: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const to = payload.to || process.env.NOTIFY_EMAIL || 'sy.bilalshah@gmail.com';

  await transporter.sendMail({
    from: `"DevelopersMatrix" <${process.env.GMAIL_USER || 'sy.bilalshah@gmail.com'}>`,
    to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

export function isEmailConfigured(): boolean {
  return !!process.env.GMAIL_APP_PASSWORD;
}
