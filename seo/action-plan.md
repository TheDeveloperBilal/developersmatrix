# developersmatrix.com action plan
### 18 September 2026

---

## Step 1. Check for a manual action first (5 minutes, do this before anything)

Search Console left sidebar, **Security and Manual Actions**, then **Manual actions**.

This single screen decides how much the rest matters.

| What it says | What it means | What to do |
|---|---|---|
| "No issues detected" | Google has not penalised you. The spam links are being ignored automatically. | Upload the disavow anyway as hygiene, then put your energy into Step 3. |
| Anything listed, especially "Unnatural links to your site" | Google has acted against the domain. This is the reason nothing ranks. | Upload the disavow, then file a reconsideration request. Tell me and I will write it. |

Tell me what it says.

---

## Step 2. Upload the disavow file (10 minutes)

1. Go to https://search.google.com/search-console/disavow-links
2. Select the property **sc-domain:developersmatrix.com**
3. Upload `disavow.txt`
4. Confirm

Notes:
- Uploading replaces the previous file completely. Always upload the full list, never a partial one.
- 34 domains are disavowed. The file explains every block in comments, and lists what I deliberately left in.
- One entry needs your decision: `tottori-u.ac.jp`. Read the note at the bottom of the file.
- Google takes weeks to reprocess. Nothing visible happens on day one.

---

## Step 3. Turn off the AdSense overlays (5 minutes)

This has been outstanding for weeks and it affects every mobile visitor you have.

AdSense, **Ads**, **By site**, select developersmatrix.com, pencil icon, then in **Auto ads**:

- **Anchor ads**: OFF
- **Related search**: OFF
- Vignette ads: your call, they are less intrusive but still interrupt

Leave in page ads on. Save.

Why: anchor ads and related search inject `google-anno` overlay elements on top of your content. On a site whose main product is free tools, an overlay covering the tool is a conversion problem and a Core Web Vitals problem, in exchange for pennies at your current traffic.

---

## Step 4. Links. This is the actual bottleneck. (ongoing)

You have 56 referring domains. Roughly 34 of those are junk being disavowed. That leaves about 20 real ones, several of which are automated crawlers that publish a page for every site they find.

Realistically you have a handful of genuine editorial links. That is the ceiling, and no amount of content fixes it.

Target: **10 real referring domains in the next 8 weeks.** Concrete sources, in the order I would work them:

1. **Qwoted and Featured** (free tiers). You are a working developer with an SEO and web dev background. Journalist requests on AI tools, developer productivity and web performance come up daily. Two or three placements here are worth more than everything in your current profile combined.
2. **Dev.to, Hashnode, Medium** cross posts with a canonical tag pointing back to your original. Not strong links, but they are real and they drive referral traffic.
3. **Tool directories that actually vet submissions**: There's An AI For That, Futurepedia, ToolPilot, AlternativeTo. Submit the audit tool and the Can You Run It tool separately.
4. **Product Hunt** launch for the website audit tool. One launch, prepared properly, not a drive by.
5. **Guest posts**. Three or four on real dev and marketing blogs beats thirty on anything else. Pitch the angle you actually have evidence for: what you learned rebuilding a site's technical SEO from scratch.
6. **Reddit and Hacker News**: nofollow, but they generate the secondary coverage that becomes followed links.

What to avoid, permanently: anything sold as a link package, anything with "PBN" in the description, fiverr gigs, comment links, and any more UGC social network profiles.

---

## Step 5. Content, but only two pieces

Do not publish more until Step 4 is moving. Two genuine gaps:

| Target keyword | Volume | KD | Why it is winnable |
|---|---|---|---|
| website grader | 1,300 | 25 | Your audit tool already does this. You need the page that names it. |
| best ai coding tools | 720 | 24 | You have the subject matter. Nobody on your site owns this term. |

Everything else on the site is already covered or already cannibalised.

---

## What to measure, and what to ignore

**Ignore raw impressions.** Your impression count is dominated by AI agents and scrapers issuing machine queries. The June and late August spikes were bot waves. The September collapse was the wave ending, not a ranking loss.

Machine queries look like this in your GSC query list:

```
"claude vs chatgpt" -site:reddit.com -site:twitter.com -site:x.com ...
%latest advancements in quantum computing applications august 2026
+latest advancements in quantum computing applications 2026
```

Leading `%` or `+`, chains of `-site:` exclusions, date stamped strings. No human types these.

**Watch these instead:**

| Metric | Today (18 Sept) | Target by 15 Nov |
|---|---|---|
| Referring domains, real ones | ~20 | 30 |
| Queries at position 1 to 20 with real volume | 0 | 3 |
| Clicks per week | 0 | 5 |
| Position for `audit a website` | 96.3 | under 40 |
| Position for `gta 6 pc release date` | 70.3 | under 30 |

---

## Monthly maintenance

Spam links will keep arriving. That is normal and it is fine, because disavowed domains are ignored.

Once a month: pull the new referring domains, add any junk to `disavow.txt`, re upload the complete file. Ask me and I will do it in one pass.

---

## Honest expectations

The domain has an Authority Score of 2 and roughly 20 real referring domains. September queries show the site now appears for `audit a website`, `google analytics audit checklist` and `gta 6 pc release date`, all between position 70 and 96.

That means the targeting worked and the authority is not there to back it.

First meaningful clicks: **6 to 10 weeks**, and only if Step 4 actually happens. Steps 1 through 3 are hygiene. Step 4 is the one that moves rankings. If nobody works Step 4, nothing in this plan changes your traffic.
