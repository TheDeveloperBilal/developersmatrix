import type { LibraryPrompt } from './types';

// The prompt library. Every prompt is written for real use: a clear role,
// the context the model needs, the steps to follow and the output format.
// Blanks are written as [Label] and become fields in the builder.

export const PROMPTS: LibraryPrompt[] = [
  // Coding
  {
    id: 'debug-an-error',
    title: 'Debug an Error',
    category: 'coding',
    kind: 'chat',
    summary: 'Find the cause of an error and get a fix you can trust.',
    tip: 'Include the full error and the few lines around where it happens, not the whole project.',
    tags: ['debugging', 'errors', 'stack trace'],
    body: `You are a senior [Language] developer helping me fix a bug.

Error message:
[Paste the error message]

Relevant code:
[Paste your code]

What I expected to happen: [Expected behaviour]

Please:
1. Explain in plain words what is causing the error.
2. Show the smallest change that fixes it, with the corrected code.
3. Tell me how to confirm the fix works.
4. Mention one way to stop this type of error from coming back.

If something is missing that you need to be sure, ask me before guessing.`,
  },
  {
    id: 'code-review',
    title: 'Code Review',
    category: 'coding',
    kind: 'chat',
    summary: 'A senior style review that ranks issues by how much they matter.',
    tip: 'Say what the code is for. A review without context focuses on style instead of real risks.',
    tags: ['review', 'best practices', 'security'],
    body: `Act as a careful senior reviewer for a [Language] codebase.

What this code does: [Purpose of the code]

Code:
[Paste your code]

Review it for correctness, security, performance and readability. Group your findings under three headings:
Must fix: bugs, security holes or data loss risks.
Should fix: performance problems and confusing logic.
Nice to have: naming, structure and style.

For each finding, quote the line, explain the problem in one or two sentences and show the improved version. Skip anything that is only personal preference.`,
  },
  {
    id: 'write-unit-tests',
    title: 'Write Unit Tests',
    category: 'coding',
    kind: 'chat',
    summary: 'Tests for the happy path, edge cases and failures.',
    tip: 'Name the test framework and paste one existing test so the style matches your project.',
    tags: ['testing', 'unit tests', 'quality'],
    body: `Write unit tests for the code below using [Test framework].

Code:
[Paste your code]

Cover:
1. The normal, expected cases.
2. Edge cases such as empty input, very large input and unusual values.
3. Error handling and invalid input.
4. Any external calls, mocked so the tests run without a network or database.

Give each test a name that describes the behaviour it checks. After the code, list any behaviour you could not test and why.`,
  },
  {
    id: 'explain-code-simply',
    title: 'Explain Code Simply',
    category: 'coding',
    kind: 'chat',
    summary: 'Understand unfamiliar code without the jargon.',
    tip: 'Tell it your level honestly. The explanation changes a lot between beginner and experienced.',
    tags: ['explanation', 'beginner', 'onboarding'],
    body: `Explain this code to someone at a [Your level, e.g. beginner] level.

Code:
[Paste your code]

Structure your answer like this:
1. In one or two sentences, what the code does overall.
2. A walk through the main parts in order, in plain language.
3. Any concepts I need to know to follow it, each explained in a sentence.
4. One small change I could make to test my understanding.

Avoid jargon. When you must use a technical term, explain it the first time.`,
  },
  {
    id: 'refactor-for-readability',
    title: 'Refactor for Readability',
    category: 'coding',
    kind: 'chat',
    summary: 'Cleaner code that behaves exactly the same.',
    tip: 'Ask for the refactor in small steps if the function is long. Big rewrites are hard to review.',
    tags: ['refactoring', 'clean code', 'maintainability'],
    body: `Refactor this [Language] code to make it easier to read and maintain without changing what it does.

Code:
[Paste your code]

Rules:
Keep the same inputs, outputs and side effects.
Prefer clear names, smaller functions and early returns over clever tricks.
Do not add new libraries.

Show the refactored code, then a short list of each change and why it helps. Point out anything you were unsure about, where behaviour might change.`,
  },
  {
    id: 'write-sql-query',
    title: 'Write a SQL Query',
    category: 'coding',
    kind: 'chat',
    summary: 'Turn a plain question about your data into SQL.',
    tip: 'Paste the real table definitions. Guessed column names are the most common reason SQL fails.',
    tags: ['sql', 'database', 'query'],
    body: `You are an expert in [Database, e.g. PostgreSQL].

My tables:
[Paste table definitions]

Question I want answered: [Describe what you need from the data]

Write one SQL query that answers it. Then:
1. Explain what each part of the query does.
2. Point out any assumptions you made about the data.
3. Suggest an index if the query would be slow on a large table.`,
  },
  {
    id: 'write-documentation',
    title: 'Write Documentation',
    category: 'coding',
    kind: 'chat',
    summary: 'A clear README or docs page for a function, module or API.',
    tip: 'Say who will read it. Docs for new teammates and docs for API users look very different.',
    tags: ['documentation', 'readme', 'api'],
    body: `Write documentation for the code below. The readers are [Who will read it].

Code:
[Paste your code]

Include:
1. A one paragraph overview of what it does and when to use it.
2. Installation or setup steps, if any.
3. Each public function or endpoint with its parameters, return value and one short example.
4. Common errors and how to fix them.

Use Markdown headings. Keep sentences short and do not describe features the code does not have.`,
  },
  {
    id: 'regex-builder',
    title: 'Build a Regular Expression',
    category: 'coding',
    kind: 'chat',
    summary: 'A tested regex with a plain English breakdown.',
    tip: 'Give strings that should NOT match as well. That is where most regex bugs hide.',
    tags: ['regex', 'validation', 'parsing'],
    body: `Write a regular expression for [Language or tool] that matches: [Describe what should match]

Examples that should match:
[List matching examples]

Examples that should not match:
[List non matching examples]

Give the regex, then break it down piece by piece in plain English. Finally, test it against every example above and show which match and which do not.`,
  },

  // Writing
  {
    id: 'blog-post-outline',
    title: 'Blog Post Outline',
    category: 'writing',
    kind: 'chat',
    summary: 'A structured outline built around what readers search for.',
    tip: 'Outline first, then draft each section separately. Whole posts in one go read flat.',
    tags: ['blog', 'outline', 'seo'],
    body: `Create a detailed outline for a blog post about [Topic].

Reader: [Who the reader is]
Main search phrase: [Main keyword]
Goal of the post: [What the reader should do or know after reading]

Include:
1. Five title options under 60 characters.
2. An introduction plan: the problem, why it matters and what the post promises.
3. Five to seven sections with H2 headings, and two or three bullet points under each.
4. Questions readers often ask about this topic, for an FAQ section.
5. A conclusion with one clear next step.

Do not write the full post yet.`,
  },
  {
    id: 'edit-for-clarity',
    title: 'Edit for Clarity',
    category: 'writing',
    kind: 'chat',
    summary: 'Tighter, clearer writing that still sounds like you.',
    tip: 'Ask it to keep your voice. Otherwise every edit drifts toward the same polished tone.',
    tags: ['editing', 'clarity', 'proofreading'],
    body: `Edit the text below for clarity and flow. Keep my voice and meaning.

Text:
[Paste your text]

Rules:
Cut words that add nothing.
Break up long sentences.
Replace vague words with specific ones.
Do not add new ideas or facts.

Show the edited version first. Then list the five most important changes and why you made them.`,
  },
  {
    id: 'rewrite-in-a-tone',
    title: 'Rewrite in a Different Tone',
    category: 'writing',
    kind: 'chat',
    summary: 'The same message, adjusted for a new audience.',
    tip: 'Name the reader, not just the tone. "For my landlord" works better than "formal".',
    tags: ['tone', 'rewrite', 'audience'],
    body: `Rewrite the text below so it sounds [Tone, e.g. friendly but professional] for [Reader].

Text:
[Paste your text]

Keep every fact and request from the original. Give me two versions: one close to the original length and one about half as long.`,
  },
  {
    id: 'professional-email',
    title: 'Write a Professional Email',
    category: 'writing',
    kind: 'chat',
    summary: 'A clear email from a few rough notes.',
    tip: 'Put the one thing you need from the reader in your notes. The email will be built around it.',
    tags: ['email', 'communication', 'work'],
    body: `Write an email to [Recipient and their role].

What I need to say:
[Your notes]

What I want them to do: [The action you want]

Keep it under 150 words, put the request in the first two sentences and end with a clear next step. Give me a subject line and the email body. Do not use filler like "I hope this email finds you well".`,
  },
  {
    id: 'summarize-a-document',
    title: 'Summarize a Document',
    category: 'writing',
    kind: 'chat',
    summary: 'The key points of a long text in the length you need.',
    tip: 'Ask for quotes next to each key point so you can check the summary against the source.',
    tags: ['summary', 'reading', 'research'],
    body: `Summarize the text below for [Who the summary is for].

Text:
[Paste the text]

Give me:
1. A three sentence summary.
2. The five most important points as bullets, each with a short quote from the text that supports it.
3. Anything the text leaves unclear or does not answer.

Use only what is in the text. If something is your interpretation, say so.`,
  },
  {
    id: 'headline-options',
    title: 'Headline Options',
    category: 'writing',
    kind: 'chat',
    summary: 'Ten headlines in different styles to choose from.',
    tip: 'Read them out loud. The one you would click on yourself is usually right.',
    tags: ['headlines', 'titles', 'copywriting'],
    body: `Write ten headline options for [What the piece is about].

Audience: [Who will read it]
Where it will appear: [Blog, email subject, YouTube, etc.]

Mix the styles: two questions, two with a number, two that state a clear benefit, two that challenge a common belief and two short ones under six words. Keep every headline honest to the content and avoid clickbait.`,
  },
  {
    id: 'explain-for-a-general-reader',
    title: 'Explain a Technical Topic to Anyone',
    category: 'writing',
    kind: 'chat',
    summary: 'Make complex ideas clear for non experts.',
    tip: 'Ask for an analogy from the reader\'s world, like cooking or sport, to make it stick.',
    tags: ['explainer', 'plain language', 'technical writing'],
    body: `Explain [Technical topic] to [Reader, e.g. a small business owner] who has no technical background.

Write about 300 words. Start with why it matters to them, then explain how it works using one everyday analogy, then finish with what they should do or ask about it. No jargon, or explain it the first time you use it.`,
  },
  {
    id: 'proofread',
    title: 'Proofread Carefully',
    category: 'writing',
    kind: 'chat',
    summary: 'Catch typos and grammar mistakes without rewriting your style.',
    tip: 'Say which English you use, American or British, so it does not "fix" correct spellings.',
    tags: ['proofreading', 'grammar', 'spelling'],
    body: `Proofread the text below in [American or British] English.

Text:
[Paste your text]

Fix only spelling, grammar and punctuation mistakes. Do not change wording or style. Return the corrected text, then a list of every change in the form: original, corrected, reason.`,
  },

  // Marketing
  {
    id: 'meta-title-and-description',
    title: 'SEO Title and Meta Description',
    category: 'marketing',
    kind: 'chat',
    summary: 'Search snippets that match intent and earn the click.',
    tip: 'Paste the search phrase people actually use. Matching it is what makes the snippet bold in Google.',
    tags: ['seo', 'meta description', 'title tag'],
    body: `Write SEO titles and meta descriptions for a page about [Page topic].

Main search phrase: [Main keyword]
Who searches for it: [Audience]
What makes this page useful: [Key benefit]

Give me five pairs. Each title must be under 60 characters and include the search phrase near the start. Each description must be under 155 characters, describe what the reader gets and end with a reason to click. Do not promise anything the page does not deliver.`,
  },
  {
    id: 'ad-copy-variations',
    title: 'Ad Copy Variations',
    category: 'marketing',
    kind: 'chat',
    summary: 'Three ad angles to test against each other.',
    tip: 'Test angles, not word swaps. Very different messages tell you more than small tweaks.',
    tags: ['ads', 'copywriting', 'ab testing'],
    body: `Write ad copy for [Product or service] on [Platform].

Audience: [Who you are targeting]
Main benefit: [Main benefit]
Offer or call to action: [Offer]

Write three versions with clearly different angles:
1. Problem and solution.
2. Before and after.
3. A short customer style story.

For each, give a headline, the main text and a call to action, all within the platform's usual length limits. Do not invent reviews, numbers or results.`,
  },
  {
    id: 'customer-persona',
    title: 'Customer Persona',
    category: 'marketing',
    kind: 'chat',
    summary: 'A useful picture of your buyer, built from what you know.',
    tip: 'Feed it real customer quotes or reviews if you have them. Personas from guesses mislead.',
    tags: ['persona', 'audience', 'research'],
    body: `Build a customer persona for [Product or service].

What I know about my customers:
[Describe your customers]

Include: their goals, the problems that make them look for a solution, what they have already tried, objections they raise before buying, the words they use to describe the problem and where they look for advice.

Mark clearly which points come from my notes and which are your assumptions I should check.`,
  },
  {
    id: 'social-content-plan',
    title: 'Social Media Content Plan',
    category: 'marketing',
    kind: 'chat',
    summary: 'Two weeks of post ideas with hooks and formats.',
    tip: 'Ask for posts that teach one thing each. Narrow posts get shared more than broad ones.',
    tags: ['social media', 'content calendar', 'planning'],
    body: `Create a two week content plan for [Brand or niche] on [Platform].

Audience: [Who you want to reach]
Goal: [Goal, e.g. followers, signups, sales]

For each of 10 posts give: the format (carousel, short video, text, etc.), a hook for the first line, three points the post covers and a call to action. Mix teaching, behind the scenes and opinion posts. No hashtags unless the platform really needs them.`,
  },
  {
    id: 'landing-page-copy',
    title: 'Landing Page Copy',
    category: 'marketing',
    kind: 'chat',
    summary: 'A full landing page structure with headlines and sections.',
    tip: 'Give it your real proof points. Without them it will fill the gaps with vague claims.',
    tags: ['landing page', 'conversion', 'copywriting'],
    body: `Write landing page copy for [Product or service].

Who it is for: [Audience]
The problem it solves: [Problem]
How it works: [Describe how it works]
Proof I can show: [Real proof, e.g. results, clients, reviews]

Sections: headline and subheadline, three key benefits, how it works in three steps, proof, answers to three common objections and a final call to action. Use only the proof I gave you. Keep sentences short.`,
  },
  {
    id: 'email-newsletter',
    title: 'Email Newsletter',
    category: 'marketing',
    kind: 'chat',
    summary: 'A newsletter people actually open and read.',
    tip: 'One main idea per email. Newsletters that cover five things get skimmed.',
    tags: ['email marketing', 'newsletter', 'retention'],
    body: `Write a newsletter email for [Audience] about [Main topic].

Key points to cover:
[List your points]

Give me five subject line options, a preview line, and an email of about 250 words with a personal opening, one main idea explained with an example, and a single call to action: [Call to action].`,
  },
  {
    id: 'keyword-cluster-ideas',
    title: 'Keyword Topic Clusters',
    category: 'marketing',
    kind: 'chat',
    summary: 'Group search topics into pages so you do not compete with yourself.',
    tip: 'Check search volumes in a real keyword tool afterwards. Chat models cannot see live data.',
    tags: ['seo', 'keywords', 'content strategy'],
    body: `I run a website about [Website topic] for [Audience].

Group the following search phrases into topic clusters, where each cluster should be one page:
[List your keywords]

For each cluster give: a suggested page title, the main phrase, the supporting phrases and the search intent (learn, compare or buy). Flag any phrases that could cause two of my pages to compete for the same search.`,
  },
  {
    id: 'competitor-message-review',
    title: 'Competitor Messaging Review',
    category: 'marketing',
    kind: 'chat',
    summary: 'See how competitors position themselves and where the gaps are.',
    tip: 'Paste the actual homepage text. Asking about a competitor by name may give outdated answers.',
    tags: ['competitors', 'positioning', 'messaging'],
    body: `Compare how these competitors describe themselves.

Competitor homepage text:
[Paste competitor copy]

My product: [Describe your product]

For each competitor, summarise who they target, their main promise and their proof. Then show the messages they all repeat, and two or three angles none of them use that would suit my product.`,
  },

  // Business
  {
    id: 'swot-analysis',
    title: 'SWOT Analysis',
    category: 'business',
    kind: 'chat',
    summary: 'Strengths, weaknesses, opportunities and threats with next steps.',
    tip: 'Give it honest weaknesses. A SWOT built only on strengths is not useful.',
    tags: ['strategy', 'analysis', 'planning'],
    body: `Create a SWOT analysis for [Business or product].

Context:
[Describe the business, market and current situation]

List three to five points in each of Strengths, Weaknesses, Opportunities and Threats. For each point add one sentence on why it matters. Finish with the three actions you would take first, based on the analysis. Mark anything you assumed rather than took from my context.`,
  },
  {
    id: 'business-plan-section',
    title: 'Business Plan Section',
    category: 'business',
    kind: 'chat',
    summary: 'Draft one section of a business plan at a time.',
    tip: 'Write one section per chat. Mixing them leads to repetition and contradictions.',
    tags: ['business plan', 'startup', 'planning'],
    body: `Help me write the [Section name, e.g. market analysis] section of a business plan for [Business].

What I know:
[Your notes]

Write about 400 words in a clear, factual tone. Where a number would normally go and I have not given you one, write NEEDS DATA instead of inventing it. End with a list of questions I should answer to make the section stronger.`,
  },
  {
    id: 'pricing-options',
    title: 'Pricing Options',
    category: 'business',
    kind: 'chat',
    summary: 'Compare pricing models for a product or service.',
    tip: 'Include what customers pay competitors. Pricing in a vacuum is guesswork.',
    tags: ['pricing', 'revenue', 'strategy'],
    body: `I sell [Product or service] to [Customers].

My costs: [Your costs]
What competitors charge: [Competitor prices]
What customers value most: [Value]

Suggest three pricing models (for example flat, tiered and usage based). For each, give example price points, who it suits, the main risk and how I could test it with real customers before committing.`,
  },
  {
    id: 'meeting-agenda',
    title: 'Meeting Agenda',
    category: 'business',
    kind: 'chat',
    summary: 'A focused agenda with time boxes and decisions to make.',
    tip: 'Start from the decision you need. Meetings without one rarely end with one.',
    tags: ['meetings', 'agenda', 'management'],
    body: `Create an agenda for a [Length in minutes] minute meeting about [Topic].

Attendees: [Who is attending]
Decision we need to make: [Decision]

Give each item a time box, an owner and the outcome it should produce. Add two questions to send to attendees beforehand so they arrive prepared.`,
  },
  {
    id: 'pitch-deck-outline',
    title: 'Pitch Deck Outline',
    category: 'business',
    kind: 'chat',
    summary: 'Slide by slide content for an investor or partner pitch.',
    tip: 'Leave traction slides blank if you have no traction yet. Honest early decks still raise.',
    tags: ['pitch deck', 'startup', 'fundraising'],
    body: `Outline a pitch deck for [Startup and what it does].

Stage: [Stage, e.g. idea, early revenue]
Who I am pitching to: [Audience]
Facts I can share:
[Your facts and numbers]

Give 10 to 12 slides. For each: the slide title, the one message it must land, the content to show and a short speaker note. Use only my facts. Where a slide needs data I do not have, say what to gather instead.`,
  },
  {
    id: 'decision-matrix',
    title: 'Decision Matrix',
    category: 'business',
    kind: 'chat',
    summary: 'Compare options against weighted criteria.',
    tip: 'Set the weights yourself before reading the result, so the matrix does not just confirm a hunch.',
    tags: ['decisions', 'comparison', 'analysis'],
    body: `Help me decide between these options: [List your options]

What matters to me, most important first: [Your criteria]

Build a decision matrix as a table. Weight each criterion, score each option from 1 to 5 with a one line reason, and total the scores. Then tell me what would have to be true for the second best option to win.`,
  },
  {
    id: 'customer-feedback-analysis',
    title: 'Customer Feedback Analysis',
    category: 'business',
    kind: 'chat',
    summary: 'Find the patterns in reviews, surveys or support tickets.',
    tip: 'Remove names and emails before pasting customer feedback into any AI tool.',
    tags: ['feedback', 'reviews', 'research'],
    body: `Analyse this customer feedback for [Product or service].

Feedback:
[Paste the feedback]

Group it into themes. For each theme give how often it comes up, two representative quotes and whether it is mostly positive or negative. Finish with the three changes that would address the most feedback.`,
  },
  {
    id: 'cold-outreach-email',
    title: 'Cold Outreach Email',
    category: 'business',
    kind: 'chat',
    summary: 'A short, specific first email that does not read like spam.',
    tip: 'Mention something specific about the person. Generic cold emails are ignored.',
    tags: ['sales', 'outreach', 'email'],
    body: `Write a cold email to [Person and role] at [Company].

Why I am reaching out to them specifically: [Something specific about them]
What I offer: [Your offer]
What I want: [Small next step, e.g. a 15 minute call]

Under 120 words. Open with the specific reason, connect it to one clear benefit for them and make the request easy to say yes to. Give two subject line options. No flattery and no fake urgency.`,
  },

  // Career
  {
    id: 'tailor-resume-bullets',
    title: 'Tailor Resume Bullets to a Job',
    category: 'career',
    kind: 'chat',
    summary: 'Rewrite your bullets around what the posting asks for.',
    tip: 'Never let it add skills you do not have. Recruiters ask about everything on the page.',
    tags: ['resume', 'job search', 'ats'],
    body: `Here is a job posting:
[Paste the job posting]

Here are my current resume bullets:
[Paste your bullets]

Rewrite my bullets so they match what this posting asks for. Start each with a strong verb, keep each under 25 words and keep every fact true. Where a bullet would be stronger with a number I have not given, write ADD NUMBER in capitals. Then list the requirements from the posting that my bullets do not cover yet.`,
  },
  {
    id: 'interview-practice',
    title: 'Interview Practice',
    category: 'career',
    kind: 'chat',
    summary: 'A mock interview that asks one question at a time.',
    tip: 'Answer out loud before typing. It is much closer to the real thing.',
    tags: ['interview', 'practice', 'job search'],
    body: `Act as an interviewer for a [Job title] role at a [Type of company].

Ask me one question at a time, mixing behavioural and role specific questions. Wait for my answer each time. After each answer, give short feedback: what was strong, what was missing and a better way to structure it. After eight questions, summarise my strongest and weakest areas.

Start with the first question now.`,
  },
  {
    id: 'star-answer',
    title: 'Shape a STAR Interview Answer',
    category: 'career',
    kind: 'chat',
    summary: 'Turn a real story into a clear Situation, Task, Action, Result answer.',
    tip: 'Use a real story with a real result. Interviewers dig into details and made up ones fall apart.',
    tags: ['interview', 'star method', 'behavioural'],
    body: `Interview question: [The interview question]

My story, in rough notes:
[Your notes]

Shape this into a STAR answer (Situation, Task, Action, Result) that takes about two minutes to say. Keep the focus on what I did, not the team. Use only my facts. Then give me two follow up questions an interviewer might ask about this story.`,
  },
  {
    id: 'salary-negotiation-script',
    title: 'Salary Negotiation Script',
    category: 'career',
    kind: 'chat',
    summary: 'What to say when you ask for more, and how to answer pushback.',
    tip: 'Base your number on real market data for your role and city, not on what you earn now.',
    tags: ['salary', 'negotiation', 'offer'],
    body: `I received an offer for [Job title] at [Company].

Offer: [Offer details]
What I want: [Your target]
Why I am worth it: [Your reasons]

Write a short, polite script for asking for more, for both a phone call and an email. Then give me calm responses to these replies: "This is our best offer", "The budget is fixed" and "What are you earning now?".`,
  },
  {
    id: 'linkedin-about',
    title: 'LinkedIn About Section',
    category: 'career',
    kind: 'chat',
    summary: 'A first person summary that says what you do and for whom.',
    tip: 'The first two lines show before "see more". Put the most important thing there.',
    tags: ['linkedin', 'personal brand', 'profile'],
    body: `Write a LinkedIn About section for me.

What I do: [Your role and field]
Who I help or work with: [Audience]
Achievements I am proud of: [Your achievements]
What I want next: [Your goal]

Write it in the first person, about 200 words, in a warm and plain tone. Put the most important line first. No buzzwords like "passionate", "results driven" or "thought leader".`,
  },
  {
    id: 'career-change-plan',
    title: 'Career Change Plan',
    category: 'career',
    kind: 'chat',
    summary: 'Map the skills you have to the role you want.',
    tip: 'Ask it to find job postings language you should learn, then check real postings yourself.',
    tags: ['career change', 'skills', 'planning'],
    body: `I want to move from [Current role] to [Target role].

My experience and skills:
[Describe your experience]

Time I can give each week: [Hours per week]

Show me which of my skills transfer directly, the gaps I need to close and a 12 week plan with weekly goals. Suggest two small projects that would prove I can do the new role.`,
  },
  {
    id: 'follow-up-after-interview',
    title: 'Follow Up After an Interview',
    category: 'career',
    kind: 'chat',
    summary: 'A short thank you note that reminds them why you fit.',
    tip: 'Send it within a day and mention one specific thing from the conversation.',
    tags: ['interview', 'follow up', 'email'],
    body: `Write a follow up email after my interview for [Job title] with [Interviewer name].

Something specific we discussed: [A detail from the interview]
Why I am a good fit: [Your main strength for this role]

Under 120 words, warm and professional, with a subject line. Do not repeat my whole resume.`,
  },
  {
    id: 'job-offer-comparison',
    title: 'Compare Job Offers',
    category: 'career',
    kind: 'chat',
    summary: 'Look past salary to what each offer really gives you.',
    tip: 'Include commute, growth and the manager. They often matter more than a small pay gap.',
    tags: ['job offers', 'decisions', 'career'],
    body: `Help me compare these job offers:
[Describe each offer]

What matters most to me: [Your priorities]

Compare them in a table covering pay, benefits, growth, work style, stability and anything else I mentioned. Then ask me three questions that would help me decide, before giving your view.`,
  },

  // Learning
  {
    id: 'learn-a-new-topic',
    title: 'Learn a New Topic Fast',
    category: 'learning',
    kind: 'chat',
    summary: 'A step by step learning plan with checks along the way.',
    tip: 'Ask it to quiz you at the end of each step instead of moving on straight away.',
    tags: ['learning', 'study plan', 'self study'],
    body: `I want to learn [Topic]. My current level is [Your level] and I can spend [Time per week] on it.

Create a learning plan with:
1. The core ideas to understand first, in order.
2. For each idea, a short explanation and one practice exercise.
3. Common misconceptions to watch out for.
4. A small project that uses everything at the end.

Teach me the first idea now, then wait for me to say I am ready for the next.`,
  },
  {
    id: 'feynman-check',
    title: 'Feynman Technique Check',
    category: 'learning',
    kind: 'chat',
    summary: 'Explain it back in your own words and find the gaps.',
    tip: 'Write your explanation without notes. Gaps only show up when you cannot look things up.',
    tags: ['feynman', 'understanding', 'study'],
    body: `I am learning about [Topic]. Here is my explanation in my own words:
[Your explanation]

Act as a patient teacher. Point out anything I got wrong, anything important I left out and anything I explained in a confusing way. Do not rewrite it for me. Ask me questions that help me fix the gaps myself.`,
  },
  {
    id: 'practice-quiz',
    title: 'Practice Quiz',
    category: 'learning',
    kind: 'chat',
    summary: 'Questions that test understanding, not just memory.',
    tip: 'Ask for the answers only after you finish. Seeing them early feels like learning but is not.',
    tags: ['quiz', 'revision', 'exam prep'],
    body: `Create a 10 question quiz on [Topic] at [Level] level.

Mix multiple choice, short answer and one "explain why" question. Ask me the questions one at a time and wait for my answer. After each answer, tell me if I was right and explain briefly. At the end, list the areas I should review.`,
  },
  {
    id: 'flashcards',
    title: 'Make Flashcards',
    category: 'learning',
    kind: 'chat',
    summary: 'Clear question and answer cards from your notes.',
    tip: 'One fact per card. Cards with three facts on them are the ones you keep getting wrong.',
    tags: ['flashcards', 'memory', 'anki'],
    body: `Turn these notes into flashcards:
[Paste your notes]

Rules: one fact or idea per card, questions that make me recall rather than recognise, and answers under 20 words. Format each card as "Q: ... | A: ..." on its own line so I can import them into a flashcard app.`,
  },
  {
    id: 'compare-two-concepts',
    title: 'Compare Two Concepts',
    category: 'learning',
    kind: 'chat',
    summary: 'See exactly how two similar ideas differ.',
    tip: 'Ask for an example where picking the wrong one causes a real problem.',
    tags: ['comparison', 'concepts', 'understanding'],
    body: `Explain the difference between [Concept A] and [Concept B] for someone at [Your level] level.

Give me a short definition of each, a comparison table of the key differences, one example where each is the right choice and the most common mistake people make when mixing them up.`,
  },
  {
    id: 'socratic-tutor',
    title: 'Socratic Tutor',
    category: 'learning',
    kind: 'chat',
    summary: 'A tutor that guides you with questions instead of answers.',
    tip: 'Great for homework and problem sets, where the point is learning to solve it yourself.',
    tags: ['tutor', 'homework', 'problem solving'],
    body: `Act as a Socratic tutor. I am working on this problem:
[Paste the problem]

Do not give me the answer. Ask me one guiding question at a time, based on what I say. If I am stuck after two tries, give a small hint. Only confirm the final answer once I have worked it out.`,
  },
  {
    id: 'read-a-research-paper',
    title: 'Read a Research Paper',
    category: 'learning',
    kind: 'chat',
    summary: 'Understand a paper\'s question, method and findings quickly.',
    tip: 'Paste the abstract and conclusion first. Ask about the method only if the result matters to you.',
    tags: ['research', 'papers', 'science'],
    body: `Help me understand this research paper. I am a [Your background].

Paper text or abstract:
[Paste the paper text]

Explain: the question the authors asked, how they tried to answer it, what they found, how strong the evidence is and what the paper does not show. Keep it plain and separate the authors' claims from your own comments.`,
  },
  {
    id: 'language-practice',
    title: 'Language Conversation Practice',
    category: 'learning',
    kind: 'chat',
    summary: 'A real conversation with gentle corrections.',
    tip: 'Ask it to correct only one or two mistakes per reply so the conversation keeps flowing.',
    tags: ['languages', 'conversation', 'practice'],
    body: `Let us practise [Language]. My level is [Your level].

Have a conversation with me about [Topic]. Use vocabulary that fits my level. After each of my replies, respond naturally, then add a short note with up to two corrections and a better way to say it. Start the conversation now.`,
  },

  // Productivity
  {
    id: 'meeting-notes-to-actions',
    title: 'Meeting Notes to Action Items',
    category: 'productivity',
    kind: 'chat',
    summary: 'Turn messy notes into decisions, owners and deadlines.',
    tip: 'If an owner or date is missing, have it flag the gap instead of guessing.',
    tags: ['meetings', 'notes', 'action items'],
    body: `Turn these meeting notes into a clean summary:
[Paste your notes]

Format:
Summary: three sentences.
Decisions made: bullets.
Action items: a table with task, owner and due date.
Open questions: bullets.

If an owner or date is not in the notes, write "not set" rather than guessing.`,
  },
  {
    id: 'weekly-plan',
    title: 'Plan My Week',
    category: 'productivity',
    kind: 'chat',
    summary: 'A realistic week built around your real priorities.',
    tip: 'List fixed commitments first. Plans that ignore meetings fall apart by Tuesday.',
    tags: ['planning', 'time blocking', 'priorities'],
    body: `Help me plan my week.

Fixed commitments: [Your fixed commitments]
Tasks I need to get done: [List your tasks]
My top priority this week: [Top priority]
When I focus best: [Your best hours]

Sort the tasks by importance, estimate time for each, and place them into a day by day plan with focus blocks during my best hours. Leave buffer time each day. Tell me what to drop if the week gets busy.`,
  },
  {
    id: 'break-down-a-project',
    title: 'Break Down a Project',
    category: 'productivity',
    kind: 'chat',
    summary: 'Turn a big goal into small, clear next steps.',
    tip: 'Ask for the very first step to be something you can do in under 30 minutes.',
    tags: ['projects', 'planning', 'tasks'],
    body: `Break this project into steps: [Describe the project]

Deadline: [Deadline]
What I already have: [What is done or available]

Give me phases, then tasks inside each phase with a rough time estimate. Mark which tasks depend on others. Make the first task small enough to start today.`,
  },
  {
    id: 'prioritise-tasks',
    title: 'Prioritise My Task List',
    category: 'productivity',
    kind: 'chat',
    summary: 'Sort a long list into what matters now and what can wait.',
    tip: 'Be honest about deadlines. Everything marked urgent means nothing is.',
    tags: ['priorities', 'eisenhower', 'focus'],
    body: `Here is my task list:
[List your tasks]

My main goal right now: [Main goal]

Sort the tasks into four groups: do now, schedule, delegate and drop. Give a one line reason for each. Then pick the three tasks I should finish today.`,
  },
  {
    id: 'reply-to-a-difficult-message',
    title: 'Reply to a Difficult Message',
    category: 'productivity',
    kind: 'chat',
    summary: 'A calm, clear reply when emotions are running high.',
    tip: 'Paste the message, then wait an hour before sending your reply.',
    tags: ['communication', 'conflict', 'email'],
    body: `I received this message:
[Paste the message]

My relationship to the sender: [Relationship]
What I want to happen next: [Outcome you want]

Write a calm, respectful reply that acknowledges their point, states my position clearly and suggests a next step. Give me a short version and a fuller version.`,
  },
  {
    id: 'daily-review',
    title: 'End of Day Review',
    category: 'productivity',
    kind: 'chat',
    summary: 'Five minutes to close the day and set up tomorrow.',
    tip: 'Do it at the same time each day. The habit matters more than the exact questions.',
    tags: ['review', 'reflection', 'habits'],
    body: `Here is how my day went:
[Describe your day]

Help me review it in five minutes. Tell me what went well, what got in the way and one small change for tomorrow. Then suggest the single most important task to start with tomorrow morning.`,
  },
  {
    id: 'write-an-sop',
    title: 'Write a Standard Process',
    category: 'productivity',
    kind: 'chat',
    summary: 'Document a task so anyone can repeat it.',
    tip: 'Record yourself doing the task once and paste the transcript. It catches steps you forget.',
    tags: ['process', 'documentation', 'operations'],
    body: `Write a step by step process document for [Task].

Who will follow it: [Who will use it]
How I currently do it:
[Describe the steps]

Include the purpose, what is needed before starting, numbered steps with one action each, checks to confirm each important step worked and what to do if something goes wrong.`,
  },
  {
    id: 'turn-notes-into-a-checklist',
    title: 'Turn Notes into a Checklist',
    category: 'productivity',
    kind: 'chat',
    summary: 'A tick box checklist from any messy set of notes.',
    tip: 'Ask it to group items by when they happen, like before, during and after.',
    tags: ['checklist', 'organisation', 'notes'],
    body: `Turn these notes into a clear checklist:
[Paste your notes]

Group the items by stage, start each item with a verb and keep each to one line. Put anything that has a deadline at the top of its group with the date.`,
  },

  // Creative
  {
    id: 'story-opening',
    title: 'Story Opening',
    category: 'creative',
    kind: 'chat',
    summary: 'A first scene that hooks the reader.',
    tip: 'Give one concrete detail about your character. It anchors the whole scene.',
    tags: ['fiction', 'storytelling', 'writing'],
    body: `Write the opening scene of a [Genre] story, about 600 words.

Main character: [Describe your main character]
Setting: [Setting]
Mood: [Mood]

Start in the middle of an action, show the character through what they do rather than description, and end the scene on a question the reader wants answered. Avoid clichés like waking up or looking in a mirror.`,
  },
  {
    id: 'brainstorm-ideas',
    title: 'Brainstorm Ideas',
    category: 'creative',
    kind: 'chat',
    summary: 'Many different ideas, from safe to unusual.',
    tip: 'Ask for quantity first, then pick three and ask it to develop only those.',
    tags: ['brainstorming', 'ideas', 'creativity'],
    body: `Brainstorm 20 ideas for [What you need ideas for].

Constraints: [Any limits, e.g. budget, time, audience]

Make the first ten practical and the last ten unusual. Give each idea a short name and one sentence. Do not judge them yet. At the end, tell me which three you would explore further and why.`,
  },
  {
    id: 'character-profile',
    title: 'Character Profile',
    category: 'creative',
    kind: 'chat',
    summary: 'A rounded character with wants, flaws and history.',
    tip: 'A character\'s want and need should conflict. That conflict drives the story.',
    tags: ['fiction', 'characters', 'worldbuilding'],
    body: `Help me develop a character for a [Genre] story.

What I have so far: [Your character notes]

Build out: what they want, what they need but do not see, their biggest flaw, a secret, how they speak, a habit that shows who they are and how they might change by the end. Keep it consistent with my notes.`,
  },
  {
    id: 'image-prompt-scene',
    title: 'Image Prompt: Scene',
    category: 'creative',
    kind: 'image',
    summary: 'A detailed scene prompt for Midjourney, DALL·E or Stable Diffusion.',
    tip: 'Change one element at a time between generations so you learn what each word does.',
    tags: ['midjourney', 'image generation', 'art'],
    body: `[Main subject], [What the subject is doing], in [Setting], [Time of day] light, [Art style, e.g. watercolour, cinematic photo], [Colour palette] colours, [Camera view, e.g. wide shot, close up], highly detailed, balanced composition`,
  },
  {
    id: 'image-prompt-product-photo',
    title: 'Image Prompt: Product Photo',
    category: 'creative',
    kind: 'image',
    summary: 'A clean studio style product shot.',
    tip: 'Generated product images are for mockups and ideas. Use real photos for listings.',
    tags: ['product photography', 'image generation', 'ecommerce'],
    body: `Studio product photo of [Product], placed on [Surface], [Background colour] background, soft diffused lighting from [Light direction], subtle reflection, sharp focus, [Mood, e.g. minimal, premium, playful] style, centred composition, plenty of empty space for text`,
  },
  {
    id: 'image-prompt-logo-concept',
    title: 'Image Prompt: Logo Concept',
    category: 'creative',
    kind: 'image',
    summary: 'Simple logo ideas to explore before working with a designer.',
    tip: 'Use the results for direction only. Have a designer redraw the final logo as a vector.',
    tags: ['logo', 'branding', 'image generation'],
    body: `Simple flat vector logo for [Brand name], a [What the business does], using [Symbol or idea], [Colour 1] and [Colour 2], clean lines, no gradients, white background, minimal and memorable`,
  },
  {
    id: 'video-script',
    title: 'Short Video Script',
    category: 'creative',
    kind: 'chat',
    summary: 'A tight script for a 30 to 60 second video.',
    tip: 'Read it aloud with a timer. Most scripts are 20 percent too long the first time.',
    tags: ['video', 'script', 'social media'],
    body: `Write a script for a [Length in seconds] second video about [Topic] for [Platform].

Audience: [Audience]
One thing viewers should remember: [Key message]

Give a hook for the first three seconds, the main points with what to show on screen for each, and a closing line with a call to action. Mark the timing of each part.`,
  },
  {
    id: 'name-ideas',
    title: 'Name Ideas',
    category: 'creative',
    kind: 'chat',
    summary: 'Names for a product, business or project.',
    tip: 'Check domain names and trademarks yourself before you fall in love with a name.',
    tags: ['naming', 'branding', 'ideas'],
    body: `Suggest 20 names for [What you are naming].

What it does: [Describe it]
Feeling the name should give: [Feeling, e.g. friendly, serious, playful]
Names I like and why: [Examples you like]

Mix styles: real words, combined words, invented words and descriptive names. Keep them easy to spell and say. Add a one line reason for each.`,
  },
];
