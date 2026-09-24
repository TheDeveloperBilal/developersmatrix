# PageSpeed Insights: get your API key

Two minutes. Without a key the API is shared-IP rate limited and returns 429
under any real traffic, which I confirmed while testing.

## Steps

1. Go to https://console.cloud.google.com/
2. Create a project, or pick an existing one. Name does not matter.
3. Open **APIs and Services > Library**
4. Search **PageSpeed Insights API**, open it, click **Enable**
5. Open **APIs and Services > Credentials**
6. **Create credentials > API key**
7. Copy the key
8. Click **Restrict key** and under **API restrictions** choose
   **Restrict key** then tick only **PageSpeed Insights API**.
   Do this. An unrestricted key works on every Google API on that project.

## Add it to Vercel

Vercel dashboard > your project > **Settings > Environment Variables**

```
Name:   PAGESPEED_API_KEY
Value:  <the key>
Scope:  Production, Preview, Development
```

Redeploy after saving. Vercel does not apply new env vars to existing builds.

## For local development

Add to `.env.local` in the project root:

```
PAGESPEED_API_KEY=your_key_here
```

`.env.local` is already gitignored by Next.js. Never commit the key.

## Quota

The free tier is 25,000 requests per day, which is far more than this tool
will use. There is no billing attached to the PageSpeed Insights API.

## What happens without the key

The tool still works. The PageSpeed section shows a message saying the data
is unavailable and why, and every other check runs normally. It degrades, it
does not break.
