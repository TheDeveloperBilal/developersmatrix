export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
  company?: string;
  service?: string;
  budget?: string;
  type: 'general' | 'collaboration' | 'newsletter';
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildGeneralEmail(data: ContactFormData): { subject: string; html: string; text: string } {
  const subject = `New Message from DevelopersMatrix Contact Form — ${escapeHtml(data.subject || 'General Inquiry')}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7c3aed, #9333ea); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #7c3aed; margin-bottom: 6px; }
    .field-value { font-size: 15px; color: #1a1a2e; background: #f8f7ff; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #7c3aed; }
    .message-box { background: #f8f7ff; padding: 16px; border-radius: 8px; border-left: 3px solid #7c3aed; white-space: pre-wrap; font-size: 15px; line-height: 1.7; }
    .footer { padding: 20px 32px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6b7280; }
    .badge { display: inline-block; background: #7c3aed; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">New Contact</span>
      <h1 style="margin-top:12px;">New Message Received</h1>
      <p>Someone reached out via your Contact page</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Name</div>
        <div class="field-value">${escapeHtml(data.name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">${escapeHtml(data.email)}</div>
      </div>
      <div class="field">
        <div class="field-label">Subject</div>
        <div class="field-value">${escapeHtml(data.subject || 'General Inquiry')}</div>
      </div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-box">${escapeHtml(data.message)}</div>
      </div>
    </div>
    <div class="footer">
      Sent from DevelopersMatrix Contact Form • ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
    </div>
  </div>
</body>
</html>`;

  const text = `New Message from DevelopersMatrix Contact Form

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject || 'General Inquiry'}
Message:
${data.message}

Sent: ${new Date().toLocaleString()}`;

  return { subject, html, text };
}

export function buildCollaborationEmail(data: ContactFormData): { subject: string; html: string; text: string } {
  const serviceLabel = data.service ? data.service.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'General Partnership';
  const subject = `New Collaboration Inquiry — ${serviceLabel}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 32px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .field-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #7c3aed; margin-bottom: 6px; }
    .field-value { font-size: 15px; color: #1a1a2e; background: #f8f7ff; padding: 12px 16px; border-radius: 8px; border-left: 3px solid #7c3aed; }
    .message-box { background: #f8f7ff; padding: 16px; border-radius: 8px; border-left: 3px solid #7c3aed; white-space: pre-wrap; font-size: 15px; line-height: 1.7; }
    .badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .badge { display: inline-block; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px; }
    .badge-purple { background: #7c3aed; color: #fff; }
    .badge-pink { background: #ec4899; color: #fff; }
    .badge-gray { background: #f3f4f6; color: #374151; }
    .footer { padding: 20px 32px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge-row" style="justify-content:center;">
        <span class="badge badge-purple">New Collab</span>
        <span class="badge badge-pink">${escapeHtml(serviceLabel)}</span>
      </div>
      <h1 style="margin-top:8px;">Partnership Inquiry Received</h1>
      <p>Someone wants to work with DevelopersMatrix</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Name</div>
        <div class="field-value">${escapeHtml(data.name)}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">${escapeHtml(data.email)}</div>
      </div>
      <div class="field">
        <div class="field-label">Company</div>
        <div class="field-value">${escapeHtml(data.company || 'Not provided')}</div>
      </div>
      <div class="field">
        <div class="field-label">Service Interested In</div>
        <div class="field-value">${escapeHtml(serviceLabel)}</div>
      </div>
      <div class="field">
        <div class="field-label">Budget Range</div>
        <div class="field-value">${escapeHtml(data.budget ? data.budget.replace(/-/g, '–').replace(/plus/, '+').replace(/\b\w/g, c => c.toUpperCase()) : 'Not specified')}</div>
      </div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-box">${escapeHtml(data.message)}</div>
      </div>
    </div>
    <div class="footer">
      Sent from DevelopersMatrix Connect Page • ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
    </div>
  </div>
</body>
</html>`;

  const text = `New Collaboration Inquiry — ${serviceLabel}

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Service: ${serviceLabel}
Budget: ${data.budget || 'Not specified'}
Message:
${data.message}

Sent: ${new Date().toLocaleString()}`;

  return { subject, html, text };
}

export function buildNewsletterEmail(data: ContactFormData): { subject: string; html: string; text: string } {
  const subject = 'New Newsletter Subscription — DevelopersMatrix';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7c3aed, #9333ea); padding: 28px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; }
    .content { padding: 28px; text-align: center; }
    .email-display { font-size: 18px; font-weight: 600; color: #7c3aed; background: #f8f7ff; padding: 16px 20px; border-radius: 12px; margin: 16px 0; word-break: break-all; }
    .footer { padding: 16px 28px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6b7280; }
    .badge { display: inline-block; background: #10b981; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">New Subscriber</span>
      <h1 style="margin-top:12px;">Newsletter Signup</h1>
    </div>
    <div class="content">
      <p style="font-size:15px; color:#4b5563;">A new user subscribed to the DevelopersMatrix newsletter.</p>
      <div class="email-display">${escapeHtml(data.email)}</div>
      <p style="font-size:13px; color:#9ca3af; margin-top:8px;">Subscribed on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
    </div>
    <div class="footer">
      DevelopersMatrix Newsletter • Footer Signup Form
    </div>
  </div>
</body>
</html>`;

  const text = `New Newsletter Subscription — DevelopersMatrix

Email: ${data.email}
Subscribed: ${new Date().toLocaleString()}

Source: Footer signup form on developersmatrix.com`;

  return { subject, html, text };
}

export function buildAutoReply(data: ContactFormData): { subject: string; html: string; text: string } {
  const isCollab = data.type === 'collaboration';
  const subject = isCollab
    ? 'We received your partnership inquiry — DevelopersMatrix'
    : 'Thanks for reaching out — DevelopersMatrix';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #7c3aed, #9333ea); padding: 36px; text-align: center; }
    .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 15px; }
    .content { padding: 36px; }
    .content p { font-size: 15px; color: #374151; line-height: 1.7; margin-bottom: 16px; }
    .highlight { background: #f8f7ff; padding: 16px 20px; border-radius: 10px; border-left: 4px solid #7c3aed; margin: 20px 0; }
    .highlight p { margin: 0; font-size: 14px; color: #4b5563; }
    .cta { text-align: center; margin: 28px 0 16px; }
    .cta a { display: inline-block; background: linear-gradient(135deg, #7c3aed, #9333ea); color: #fff; font-weight: 600; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px; }
    .footer { padding: 20px 36px; background: #f8f9fa; text-align: center; font-size: 12px; color: #6b7280; }
    .footer a { color: #7c3aed; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thanks for reaching out!</h1>
      <p>We've received your message and will respond shortly.</p>
    </div>
    <div class="content">
      <p>Hi ${escapeHtml(data.name)},</p>
      <p>Thanks for getting in touch with us at <strong>DevelopersMatrix</strong>. We've received your ${isCollab ? 'partnership inquiry' : 'message'} and our team is reviewing it.</p>
      <div class="highlight">
        <p><strong>What happens next?</strong><br>
        We typically respond to all inquiries within <strong>24–48 hours</strong>. If your request is urgent, feel free to reply directly to this email.</p>
      </div>
      <div class="cta">
        <a href="https://developersmatrix.com">Explore Our Tools →</a>
      </div>
      <p style="font-size:13px; color:#9ca3af;">In the meantime, check out our free <a href="https://developersmatrix.com/tools/website-audit" style="color:#7c3aed;">Website Audit Tool</a> or browse the <a href="https://developersmatrix.com/blog" style="color:#7c3aed;">latest articles</a> on our blog.</p>
    </div>
    <div class="footer">
      <p>DevelopersMatrix • Free AI-Powered Tools for Everyone</p>
      <p style="margin-top:8px;"><a href="https://developersmatrix.com">developersmatrix.com</a></p>
    </div>
  </div>
</body>
</html>`;

  const text = `Thanks for reaching out — DevelopersMatrix

Hi ${data.name},

Thanks for getting in touch with us at DevelopersMatrix. We've received your ${isCollab ? 'partnership inquiry' : 'message'} and our team is reviewing it.

We typically respond to all inquiries within 24–48 hours. If your request is urgent, feel free to reply directly to this email.

Explore our tools: https://developersmatrix.com/tools
Read our blog: https://developersmatrix.com/blog

DevelopersMatrix • Free AI-Powered Tools for Everyone`;

  return { subject, html, text };
}
