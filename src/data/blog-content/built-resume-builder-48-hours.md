# I Built an AI Resume Builder in 48 Hours — Here is the Honest Truth

No funding. No team. Just me, a coffee addiction, and a Next.js template. Here is what worked, what broke, and what I would do differently.

## The Backstory

It was a Tuesday at 2 AM. I was helping a friend format her resume for the 47th time and thought: *"This should not be this hard."*

48 hours later, I had a working AI resume builder. Not a perfect one. A working one.

Here is the honest breakdown — revenue numbers, technical failures, and the feature nobody asked for but everyone uses.

## Hour 0-8: The MVP

**Tech stack:**
- Next.js 14 (App Router)
- Tailwind CSS
- OpenAI API (GPT-4)
- Vercel (deployment)
- Supabase (database, because I did not want to set up Postgres)

**What I built:**
1. Single-page form (name, experience, skills)
2. "Generate" button that called GPT-4 with a structured prompt
3. PDF export using `react-pdf`
4. Stripe payment for $5/resume

**The prompt that actually worked:**

```
You are an expert resume writer. Create a professional resume for:
Name: {name}
Role: {role}
Experience: {experience}
Skills: {skills}

Rules:
- Use action verbs with metrics
- One page maximum
- ATS-friendly format
- Modern but not flashy
- Include a summary tailored to the role

Output as markdown.
```

**First mistake:** I tried to get GPT to output HTML directly. It broke constantly. Markdown → HTML conversion was far more reliable.

## Hour 8-16: The Launch

I posted on:
- My Twitter (2,400 followers)
- Hacker News "Show HN"
- Reddit r/webdev
- Indie Hackers

**Results in 24 hours:**

| Platform | Traffic | Signups | Paid |
|----------|---------|---------|------|
| Hacker News | 1,847 | 89 | 3 |
| Reddit r/webdev | 432 | 31 | 1 |
| Twitter | 298 | 22 | 0 |
| Indie Hackers | 156 | 12 | 0 |
| Direct | 67 | 8 | 0 |

**Total:** 2,800 visitors, 162 signups, 4 paid conversions. **$20 revenue.**

Not life-changing. But proof that people wanted it.

## Hour 16-24: The Iteration

Based on user feedback, I built three features in 8 hours:

### 1. Real-Time Preview

Users wanted to see the resume as they typed. I added a split-screen layout with a live preview updating every 2 seconds.

**Tech:** React state + debounced re-render. No complex state management needed.

### 2. Multiple Templates

Turns out "modern but not flashy" means different things to different people. I added 3 templates:
- **Minimal:** Clean, single column, lots of white space
- **Professional:** Two column, skills sidebar, traditional feel
- **Creative:** Color accents, modern typography (for design roles)

**The surprise:** 67% of users chose "Minimal." Even for creative roles. The data contradicted my assumptions.

### 3. ATS Score

This was the feature nobody asked for but everyone shared. After generating a resume, the tool gives an "ATS Score" (0-100) based on:
- Keyword density vs. job description
- Formatting compatibility
- Section completeness
- Length optimization

**How it works:**
1. User pastes a job description
2. Tool extracts keywords using simple TF-IDF
3. Compares against resume content
4. Generates a score + specific suggestions

**Result:** Users screenshot their scores and post them on LinkedIn. Free marketing.

## Hour 24-48: The Reality Check

By hour 30, the site had 400 signups and 12 paid users. **$60 total.**

Here is what I learned:

### What Worked

1. **Fast iteration.** I shipped 6 updates in 48 hours. Users noticed and appreciated it.
2. **Public building.** Tweeting the journey in real-time built an audience that cared.
3. **Simple pricing.** $5 flat fee. No tiers, no subscriptions. Decision fatigue = zero.
4. **PDF export.** This was the killer feature. Google Docs export was requested but barely used.

### What Broke

1. **OpenAI costs.** 400 resume generations at ~$0.02 each = $8. Plus my own testing = $12 total. Fine at this scale, but would be a problem at 10,000 users.
2. **No auth system.** I used anonymous sessions. Users could not save or edit later. 34% of support emails were "I lost my resume."
3. **Mobile was terrible.** 60% of traffic was mobile. The builder was desktop-only. Conversions on mobile were 1/10th of desktop.
4. **Stripe tax.** I did not set up tax collection. Technically illegal in some states. Had to fix later.

### What I Would Do Differently

1. **Start with auth.** Even simple email/password would have saved hours of support.
2. **Mobile-first design.** I built desktop because I was on a laptop. Wrong call.
3. **Use a cheaper model.** GPT-3.5-turbo produced resumes 90% as good at 1/10th the cost. I switched after day 3.
4. **Add analytics from hour 0.** I retrofitted Mixpanel on day 2 and lost data.

## The Numbers After 30 Days

- **Total visitors:** 12,400
- **Signups:** 687
- **Paid conversions:** 54
- **Revenue:** $270
- **OpenAI costs:** $89
- **Stripe fees:** $13
- **Domain + hosting:** $12
- **Net:** $156

Not quit-your-job money. But a working product, 687 emails, and proof of demand.

## The Code (Simplified)

Here is the core generation logic, abstracted:

```typescript
async function generateResume(data: ResumeData): Promise<string> {
  const prompt = buildPrompt(data);
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 2000,
  });
  return response.choices[0].message.content;
}
```

The real code handles retries, streaming, and error states. But this is the heart of it.

## Why I Am Telling You This

Because most "I built X in 48 hours" posts are humblebrags. This is not. I made $156. I broke things. I ignored mobile. I overpaid for AI.

But I also learned that:
- Shipping beats perfection
- Users care more about solving their problem than your tech stack
- Simple businesses can be built in a weekend
- The hardest part is not coding — it is getting people to care

If you are thinking about building something, do it. Use a weekend. Use a template. Use AI to move faster. The worst case is you learn something. The best case is you build income.

## Tools I Used

- [DevelopersMatrix AI Resume Builder](/tools/ai-resume-builder) — The evolved version of what I built
- Next.js — React framework
- Tailwind CSS — Styling
- Vercel — Hosting
- Supabase — Database + auth (after day 2)
- OpenAI API — Resume generation
- Stripe — Payments
- react-pdf — PDF export

## What Is Next

I am turning the 48-hour project into a proper product. The current version at [DevelopersMatrix](/tools/ai-resume-builder) has:
- User accounts and save functionality
- 10+ templates
- ATS scoring
- Job description matching
- Cover letter generation
- LinkedIn import

**Revenue target:** $1,000 MRR by end of 2026.

## References

- OpenAI API Pricing (2026). https://openai.com/pricing
- Stripe Documentation (2026). https://stripe.com/docs
- Next.js Documentation (2026). https://nextjs.org/docs
- Indie Hackers Revenue Reports (2025). https://indiehackers.com
- "The Minimalist Entrepreneur" by Sahil Lavingia (2021). Gumroad Press.
