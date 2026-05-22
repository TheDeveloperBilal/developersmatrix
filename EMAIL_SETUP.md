# Email Setup for DevelopersMatrix Forms

## What Was Done
All 3 forms are now wired and ready:
- **Contact page** (`/contact`) → sends `type: 'general'` emails
- **Connect page** (`/connect`) → sends `type: 'collaboration'` emails
- **Footer newsletter** (every page) → sends `type: 'newsletter'` emails

All emails go to `sy.bilalshah@gmail.com` with professional HTML templates.
Users also get an auto-reply confirmation.

## Step 1: Generate a Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with `sy.bilalshah@gmail.com`
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → type "DevelopersMatrix"
5. Click **Generate**
6. Copy the 16-character password (looks like `abcd efgh ijkl mnop`)

## Step 2: Add to Vercel Environment Variables

1. Go to https://vercel.com/dashboard → select your project
2. Click **Settings** → **Environment Variables**
3. Add:
   - Name: `GMAIL_APP_PASSWORD`
   - Value: *(paste the 16-char app password, no spaces)*
4. Click **Save**
5. **Redeploy** the site (Vercel → Deployments → click the latest → Redeploy)

That's it. All 3 forms will start sending real emails immediately after redeploy.
