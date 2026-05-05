# 🚀 Deploy DevelopersMatrix to Vercel - Step by Step Guide

## Prerequisites
- GitHub account (free)
- Vercel account (free)

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Recommended)

1. Go to **https://github.com/new**
2. Fill in:
   - **Repository name**: `developersmatrix`
   - **Description**: `AI-Powered Career & Life Optimization Hub`
   - **Visibility**: Public (required for free Vercel)
   - **Don't** initialize with README, .gitignore, or license
3. Click **"Create repository"**

### Option B: Using GitHub CLI (if installed)
```bash
gh repo create developersmatrix --public --source=. --push
```

---

## Step 2: Push Code to GitHub

After creating the repository, run these commands:

```bash
cd /home/z/my-project

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/developersmatrix.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/developersmatrix.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### Option A: Using Vercel Website (Easiest)

1. Go to **https://vercel.com**
2. Click **"Sign Up"** → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub
4. Click **"Add New..."** → **"Project"**
5. Find `developersmatrix` in the list
6. Click **"Import"**
7. Configure (Vercel auto-detects Next.js):
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `bun run build` (or `npm run build`)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `bun install` (or `npm install`)
8. Click **"Deploy"**
9. Wait 2-3 minutes for deployment
10. 🎉 **Done!** Your site is live!

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd /home/z/my-project
vercel

# For production deployment
vercel --prod
```

---

## Step 4: Add Custom Domain (Optional)

### In Vercel:
1. Go to your project dashboard
2. Click **"Settings"** → **"Domains"**
3. Add domain: `developersmatrix.com`
4. Vercel will show DNS records to add

### In Hostinger DNS:
1. Login to Hostinger hPanel
2. Go to **Domains** → **DNS Zone Editor**
3. Add these records:

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

4. Wait 24-48 hours for DNS propagation

---

## Environment Variables (If Needed)

If your app uses environment variables:

1. In Vercel dashboard → **Settings** → **Environment Variables**
2. Add variables from your `.env` file:
   - `OPENAI_API_KEY` (if applicable)
   - Any other API keys

---

## Your Live URLs

After deployment:
- **Vercel URL**: `https://developersmatrix.vercel.app` (or similar)
- **Custom Domain**: `https://developersmatrix.com` (after DNS setup)

---

## Automatic Deployments

✅ Every push to `main` branch automatically deploys to Vercel

---

## Troubleshooting

### Build Error?
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### Domain Not Working?
- Wait for DNS propagation (up to 48 hours)
- Verify DNS records are correct
- Check Vercel domain settings

### Environment Variables Missing?
- Add them in Vercel dashboard → Settings → Environment Variables
- Redeploy after adding

---

## Quick Reference Commands

```bash
# Check git status
git status

# Add changes
git add .

# Commit changes
git commit -m "Update message"

# Push to GitHub
git push origin main

# Vercel auto-deploys on push!
```

---

## Cost: $0/month

Vercel free tier includes:
- ✅ 100GB bandwidth
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Custom domain
- ✅ Preview deployments

Perfect for your website! 🎉
