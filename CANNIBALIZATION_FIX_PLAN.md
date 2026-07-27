# Cannibalization Fix Plan

## Principle: Each page type has a distinct keyword territory

| Page Type | Keyword Territory | Title Pattern |
|-----------|------------------|---------------|
| **Tool** (Money Page) | Transactional: "free [tool]", "[tool] online", "instant", "no signup" | "Free [Tool] — [Action/Benefit] \| DevelopersMatrix" |
| **Trend** | News/Overview: "[topic] 2026", "trends", "what's new" | "[Topic] 2026: [Angle] \| DevelopersMatrix" |
| **Blog** | How-to/Deep Guide: "how to", "complete guide", "step by step", "review" | "How to [Action] in 2026: [Specific Angle]" |
| **Research** | Data/Report: "statistics", "data", "research", "original" | "[Topic] [Year]: [Data Angle] \| Original Research" |

## Identified Cannibalization Issues

### 1. AI Side Hustles (HIGH SEVERITY)
- **Trend** `ai-side-hustles-make-money-2026`: "AI Side Hustles 2026: 15 Proven Ways to Make Money with AI (Real Data)"
- **Blog** `ai-side-hustles-2026-make-money`: "AI Side Hustles 2026: 15 Proven Ways to Make Money with AI (Real Income Data)"
- **Problem**: Nearly identical titles, both indexed
- **Fix**: Blog title → "How to Start AI Side Hustles in 2026: A Beginner's Step-by-Step Guide" (focus on "how to start" and "beginner's guide")

### 2. TikTok Algorithm (MEDIUM SEVERITY)
- **Trend** `tiktok-algorithm-2026-complete-guide`: INDEXED — "TikTok Algorithm 2026: How to Go Viral & Rank on Search"
- **Blog** `tiktok-algorithm-guide-2026`: INDEXED — "How Does the TikTok Algorithm Work in 2026? Complete Creator Guide to More Views"
- **Blog** `how-tiktok-algorithm-works-2026`: NOINDEXED — already handled
- **Problem**: 2 indexed pages competing for "TikTok algorithm"
- **Fix**: Blog title → "TikTok Algorithm Explained for Creators: How to Get More Views in 2026" (focus on "explained" and "creators")

### 3. Interview Prep (MEDIUM SEVERITY)
- **Tool** `ai-interview-simulator`: "Free AI Interview Simulator | Practice Tech Jobs 2026"
- **Trend** `tech-interview-preparation-2026`: "Tech Interview Preparation Guide 2026"
- **Blog** `technical-interview-prep-2026`: "How to Prepare for Technical Interviews in 2026: Complete Guide"
- **Blog** `faang-interview-playbook-2026`: "How to Pass FAANG Technical Interviews in 2026: A Complete Playbook"
- **Fix**: Tool title → more transactional; Trend title → more trend-focused

### 4. Resume Builder (LOW SEVERITY — already somewhat differentiated)
- **Tool** `ai-resume-builder`: already transactional
- **Blog** `best-free-resume-builders-2026`: comparison/review angle ✓
- **Blog** `ats-resume-guide-2026`: ATS format guide ✓
- **Research** `ats-resume-optimization-guide-2026`: research report ✓
- **Fix**: Strengthen internal links from blogs to tool

### 5. Website Audit (MEDIUM SEVERITY)
- **Tool** `website-audit`: "Free Website Audit Tool | SEO, Speed & Security 2026"
- **Blog** `how-to-audit-my-website-2026`: "How to Audit My Website in 2026: A Beginner's Complete Checklist"
- **Blog** `how-to-audit-website-2026-guide`: "How to Audit a Website in 2026: Complete Step-by-Step Guide + Free Checklist"
- **Blog** `website-audit-checklist-2026`: "The Complete Website Audit Checklist: 47 Things Google Checks in 2026"
- **Blog** `website-code-audit-guide`: "Website Code Audit Guide: How to Review, Fix, and Improve Your Website Code"
- **Research** `website-audit-statistics-2026`: "2026 Website Audit Statistics Report"
- **Fix**: Differentiate blog titles more clearly; code-audit-guide is already differentiated (code focus)

### 6. AI Agents (already handled — trend is noindexed)
- **Trend** `ai-agents-autonomous-systems-2026`: NOINDEXED ✓
- **Blog** `autonomous-ai-agents-by-industry`: INDEXED ✓

### 7. AI Automation Agency (already handled — trend is noindexed)
- **Trend** `ai-automation-agency-guide`: NOINDEXED ✓
- **Blog** `ai-automation-business-ideas-2026`: INDEXED ✓

## Implementation Checklist

- [ ] Update `metadata.ts` — Tool titles more transactional
- [ ] Update `high-quality-blogs.json` — Differentiate overlapping blog titles
- [ ] Update `trends-data.ts` — Differentiate trend titles from blogs
- [ ] Update `cross-links.ts` — Expand mappings
- [ ] Update blog `[slug]/page.tsx` — Topic-aware CTAs instead of generic
- [ ] Build test
- [ ] Commit

## After Cannibalization Fix

### "Website Code Audit" Push
- Promote `/blog/website-code-audit-guide` as the authority page for code audits
- Strengthen internal links from `/tools/website-audit` to this blog
- Add code audit FAQ to the blog

### "Will It Run PC" Push
- Promote `/tools/can-you-run-it` (PC game requirements checker)
- Add "Can you run GTA 6?" content to the tool page
- Strengthen link from `/gta-6` and `/trends/gta-6-release-everything-we-know`
