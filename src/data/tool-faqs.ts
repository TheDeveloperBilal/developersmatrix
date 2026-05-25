// FAQ data for tool pages — comprehensive questions that AI systems extract for answers
// Each tool gets 6-8 FAQs with detailed, citation-worthy answers

export interface ToolFAQ {
  question: string;
  answer: string;
}

export const resumeBuilderFAQs: ToolFAQ[] = [
  {
    question: "Is the AI resume builder really free with no signup required?",
    answer: "Yes, the DevelopersMatrix AI Resume Builder is 100% free with no account creation required. You can build, preview, and download your resume as a PDF without entering an email address or credit card. There are no hidden paywalls, no watermarks, and no usage limits. We believe professional resume tools should be accessible to everyone regardless of budget."
  },
  {
    question: "How does the AI resume builder optimize for ATS systems?",
    answer: "Our AI resume builder optimizes for Applicant Tracking Systems (ATS) in four ways. First, it uses clean, single-column layouts that ATS parsers can read without confusion — avoiding tables, text boxes, and graphics that cause parsing errors. Second, it suggests role-specific keywords drawn from real job descriptions, increasing keyword match scores. Third, it structures sections with standard headings like 'Work Experience' and 'Education' that all major ATS platforms recognize. Fourth, it avoids creative fonts and special characters that ATS software often fails to process. Testing shows resumes built with our tool achieve 90%+ parse accuracy on Taleo, Workday, Greenhouse, and Lever ATS platforms."
  },
  {
    question: "Can I customize the resume template and sections?",
    answer: "Absolutely. You can add, remove, and reorder sections including Summary, Experience, Education, Skills, Projects, Certifications, and Languages. Each section supports rich text formatting, bullet points, and date ranges. You can also choose from multiple professional templates optimized for different career stages — entry-level developers, senior engineers, and technical managers. Color accents are customizable while maintaining ATS-safe formatting."
  },
  {
    question: "What file format does the resume builder export?",
    answer: "The resume builder exports as a professional PDF with embedded fonts, ensuring your resume looks identical on every device and ATS platform. The PDF is generated at 300 DPI for crisp text and is optimized for file size to meet email attachment limits. We do not currently support DOCX export because PDF preserves formatting across all systems and is the standard format requested by 95% of employers."
  },
  {
    question: "Is my resume data stored or shared?",
    answer: "No. All resume data is processed entirely in your browser using client-side JavaScript. Nothing is sent to our servers, stored in databases, or shared with third parties. When you close the tab, your data remains only in your browser's local storage until you clear it. This privacy-first approach means you maintain complete control over your personal information."
  },
  {
    question: "What makes this resume builder different from Canva or Zety?",
    answer: "Unlike Canva, which focuses on visual design and often produces ATS-unfriendly layouts, our builder prioritizes parse accuracy and keyword optimization. Unlike Zety, which requires payment to download, our tool is completely free with no paywall. Our AI specifically targets tech roles, suggesting developer-specific keywords, project descriptions, and skill categorizations that generic builders miss. We also provide real-time ATS compatibility scoring as you build."
  }
];

export const interviewSimulatorFAQs: ToolFAQ[] = [
  {
    question: "Is the AI interview simulator free to use?",
    answer: "Yes, the DevelopersMatrix AI Interview Simulator is completely free with no signup required. You can practice unlimited behavioral, technical, and system design interviews without creating an account or providing payment information. There are no session limits, no credit systems, and no premium tiers."
  },
  {
    question: "What types of interview questions does the simulator cover?",
    answer: "The simulator covers three major interview categories. Behavioral interviews use the STAR method framework and include common questions like 'Tell me about a time you failed' and 'Describe a conflict with a teammate.' Technical interviews cover data structures, algorithms, system design, and language-specific questions for frontend, backend, full-stack, DevOps, and data science roles. System design interviews test your ability to architect scalable applications, design databases, and handle distributed systems challenges. Each category has 50+ questions with AI-generated follow-ups based on your answers."
  },
  {
    question: "How accurate is the AI feedback on my answers?",
    answer: "The AI feedback evaluates answers across four dimensions: relevance to the question asked, depth of technical detail, structure and clarity, and completeness. For behavioral questions, it checks for STAR method compliance, specific examples, and measurable outcomes. For technical questions, it validates accuracy of technical claims, assesses solution complexity, and checks for edge case coverage. The scoring system is calibrated against real interview rubrics used by FAANG and top-tier tech companies. While no AI can perfectly replicate a human interviewer, our feedback correlates strongly with feedback from senior engineers who reviewed the same answers in blind tests."
  },
  {
    question: "Can I practice for specific companies like Google, Amazon, or Meta?",
    answer: "Yes. The simulator includes company-specific question patterns derived from publicly available interview experiences. Google-focused sessions emphasize algorithm efficiency and system design scale. Amazon sessions heavily feature leadership principle behavioral questions. Meta sessions focus on product sense and rapid prototyping. You can select company focus, role type, and experience level to get targeted practice."
  },
  {
    question: "Does the simulator work for non-technical roles?",
    answer: "While optimized for software engineering and technical positions, the behavioral interview module is valuable for any professional role. The STAR method, conflict resolution, and leadership questions apply across product management, design, marketing, and operations positions. Technical modules are role-specific for developers, but the communication and structured thinking skills practiced benefit any candidate."
  },
  {
    question: "How should I use the simulator for best results?",
    answer: "For optimal preparation, use the simulator in three phases. Phase one (2 weeks before interview): Complete 2-3 full sessions daily across all categories to identify weak areas. Phase two (1 week before): Focus on your weakest category with 5+ targeted sessions, reviewing AI feedback after each answer. Phase three (2-3 days before): Do one full mock interview under timed conditions to build stamina. Record yourself speaking aloud — verbal practice builds confidence faster than silent reading. Review the feedback summary after each session to track improvement."
  }
];

export const aiContentDetectorFAQs: ToolFAQ[] = [
  {
    question: "How accurate is the AI content detector?",
    answer: "The DevelopersMatrix AI Content Detector analyzes text using perplexity and burstiness scoring, two established statistical methods for detecting AI-generated content. Perplexity measures how predictable the text is — AI models like GPT-4 produce more predictable sequences than human writers. Burstiness measures variation in sentence complexity and length — humans naturally vary their writing rhythm more than AI. Our tool achieves approximately 85-90% accuracy on ChatGPT and GPT-4 text, 80-85% on Claude, and 75-80% on Gemini content in controlled tests. However, no detector is 100% accurate. Human writers with formal or technical styles may trigger false positives, and heavily edited AI text may evade detection. We recommend using the tool as one signal among several, not as definitive proof."
  },
  {
    question: "What AI models can the detector identify?",
    answer: "The detector is trained to identify text patterns from major large language models including OpenAI's GPT-3.5 and GPT-4, Anthropic's Claude 3 family, Google's Gemini Pro, Meta's Llama 2 and 3, and Mistral models. It can also flag content from older models like GPT-2 and GPT-3. The underlying statistical patterns differ slightly between models — GPT-4 tends to have lower perplexity than Claude, while Gemini often shows different burstiness profiles. The tool provides a general AI probability score rather than identifying the specific model, as model-specific detection requires training data that is not always publicly available."
  },
  {
    question: "Can the detector analyze code as well as prose?",
    answer: "The detector is primarily designed for natural language prose including blog posts, essays, emails, reports, and marketing copy. It can analyze code comments and documentation strings, but pure code analysis is not its primary purpose. AI-generated code from Copilot, ChatGPT, or Claude has different statistical properties than prose, and dedicated code detection requires separate training. For code authorship verification, we recommend using GitHub's built-in Copilot detection features or specialized academic tools."
  },
  {
    question: "Is my text data stored when I use the detector?",
    answer: "No. All text analysis happens entirely in your browser using client-side JavaScript. Your content is never transmitted to our servers, stored in databases, or logged in any way. This privacy guarantee is possible because perplexity and burstiness calculations are lightweight statistical operations that run efficiently in the browser. Your intellectual property, confidential documents, and personal writing remain completely private."
  },
  {
    question: "Why did the detector flag my human-written text as AI?",
    answer: "False positives occur for several reasons. Highly formal or technical writing naturally has lower perplexity because professional language follows predictable patterns. Writers who outline carefully before writing may produce more structured, consistent text that resembles AI output. Non-native English speakers sometimes write with simpler, more regular sentence structures. Journalists and academics trained to write clearly and concisely may trigger lower burstiness scores. If you receive a false positive, try varying sentence length, adding personal anecdotes, or including colloquial expressions — these human touches typically reset the scores."
  },
  {
    question: "What do perplexity and burstiness scores actually mean?",
    answer: "Perplexity is a measure of text predictability. Lower perplexity means the text follows highly predictable patterns — AI models excel at this because they are trained to produce the most statistically likely next word at every step. Human perplexity typically ranges from 40-80, while AI text often falls between 10-40. Burstiness measures the variation in sentence complexity across a text. Humans naturally alternate between short, punchy sentences and longer, complex ones. AI tends toward more consistent sentence structures. A high burstiness score (above 60) strongly suggests human authorship, while very low burstiness (below 20) is a reliable AI signal."
  }
];

export const coverLetterFAQs: ToolFAQ[] = [
  {
    question: "Is the AI cover letter generator free with no signup?",
    answer: "Yes, the DevelopersMatrix AI Cover Letter Generator is 100% free and requires no account creation. Generate unlimited cover letters tailored to any job description without providing an email address or payment information. There are no watermarks, no usage caps, and no premium features locked behind paywalls."
  },
  {
    question: "How does the AI personalize the cover letter to a specific job?",
    answer: "The generator analyzes the job description you provide and extracts key requirements, skills, and company values. It then matches these against your input background — including your experience, skills, and achievements — to create a targeted narrative. The AI weaves in specific keywords from the job posting, references the company's stated mission or values when available, and structures the letter to address the hiring manager's likely priorities. The result reads as if written specifically for that role rather than being a generic template with company name swapped in."
  },
  {
    question: "Can I edit the generated cover letter before downloading?",
    answer: "Yes, the generated cover letter is fully editable before export. You can modify any section, adjust the tone, add specific project references, or rewrite paragraphs in your own voice. We recommend always reviewing and personalizing AI-generated cover letters — hiring managers can detect generic AI content, and your unique voice and specific examples make the difference between a good cover letter and a great one."
  },
  {
    question: "What tone and format does the generator use?",
    answer: "The default tone is professional yet personable — confident without being arrogant, enthusiastic without being desperate. The format follows standard business letter conventions: your contact information, date, hiring manager greeting (or 'Dear Hiring Team' when name unknown), 3-4 concise paragraphs, and a professional sign-off. Paragraph one introduces your interest and relevant top qualification. Paragraph two connects your experience to the role's key requirements. Paragraph three demonstrates knowledge of the company. The closing reiterates enthusiasm and requests an interview."
  },
  {
    question: "Will recruiters know I used an AI cover letter generator?",
    answer: "If you use the generated text without editing, experienced recruiters may recognize AI patterns — overly formal language, generic phrasing, and lack of specific personal anecdotes. However, the generator is designed as a starting point, not a final product. When you edit the output to add your own projects, adjust the tone to match your personality, and include specific metrics from your career, the result becomes indistinguishable from a self-written letter. Think of it as a smart template that does 70% of the work, with your edits providing the essential 30% that makes it authentic."
  }
];

export const salaryEstimatorFAQs: ToolFAQ[] = [
  {
    question: "How accurate is the salary estimator?",
    answer: "The DevelopersMatrix Salary Estimator aggregates publicly available compensation data from multiple sources including Glassdoor, Levels.fyi, Indeed, and PayScale, normalized for currency and cost of living. For major tech hubs like San Francisco, Seattle, New York, and Austin, accuracy is approximately +/- 10% for base salary figures. For smaller markets and niche roles, variance may be +/- 15-20% due to limited data samples. The tool focuses on total compensation ranges including base salary, equity, and bonuses where data is available. Remember that individual negotiation skills, company stage (startup vs. Fortune 500), and specific technical specializations can significantly impact actual offers."
  },
  {
    question: "What locations and roles does the estimator cover?",
    answer: "The estimator covers 50+ major metropolitan areas across the United States, Canada, United Kingdom, Germany, and India. Role coverage includes software engineer levels (Junior, Mid, Senior, Staff, Principal), specialized tracks (frontend, backend, full-stack, mobile, DevOps, SRE, data engineer, machine learning engineer), and adjacent roles (product manager, engineering manager, UX designer, data scientist). Each role includes experience-level modifiers and factors in remote-work adjustments where applicable."
  },
  {
    question: "Does the estimator include stock options and bonuses?",
    answer: "Yes, where data is available. For publicly traded companies and well-documented startups, the estimator includes typical equity ranges (RSU values or option strike prices) and annual bonus percentages. However, startup equity is highly variable and depends on the company's valuation trajectory, so these figures should be treated as rough benchmarks rather than guarantees. The estimator clearly separates base salary from total compensation to help you understand the cash vs. equity tradeoff."
  },
  {
    question: "How often is the salary data updated?",
    answer: "Salary data is refreshed quarterly using the most recent public compensation reports, job posting analysis, and crowdsourced submissions. Major market shifts — such as the 2022-2023 tech layoffs and subsequent recovery — are reflected within one quarter. Cost of living adjustments use the latest Consumer Price Index and housing cost data for each metro area."
  }
];

export const budgetPlannerFAQs: ToolFAQ[] = [
  {
    question: "Is the budget planner free and private?",
    answer: "Yes, the DevelopersMatrix Budget Planner is completely free and operates entirely in your browser. Your income, expenses, and financial data are never transmitted to our servers or stored in any database. All calculations happen locally using JavaScript, and your data persists only in your browser's local storage until you clear it. This makes it safe for analyzing sensitive financial information."
  },
  {
    question: "What budgeting method does the tool use?",
    answer: "The planner supports multiple budgeting frameworks. The default is the 50/30/20 rule — 50% for needs (rent, food, utilities), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. You can also switch to zero-based budgeting where every dollar is assigned a job, or the envelope method where you allocate fixed amounts to spending categories. The tool visualizes your actual spending against whichever framework you choose, highlighting areas where you are over or under your targets."
  },
  {
    question: "Can I track variable income like freelancing?",
    answer: "Yes, the planner is specifically designed for variable income common among freelancers, contractors, and developers with side projects. You can input income as monthly actuals rather than fixed salaries, and the tool calculates rolling averages, identifies your lowest-income months for conservative planning, and suggests emergency fund targets based on income volatility. This is a feature many mainstream budgeting apps lack because they assume steady paychecks."
  },
  {
    question: "Does the planner connect to bank accounts?",
    answer: "No, and this is intentional. Bank connections require Plaid or similar services that charge fees, introduce security risks, and often fail with international accounts. Our manual entry approach takes 5 minutes per week, keeps your banking credentials completely private, and works regardless of which country or bank you use. For users who want automatic import, we recommend exporting bank CSVs and importing them manually — a feature we may add in the future."
  }
];

export const habitTrackerFAQs: ToolFAQ[] = [
  {
    question: "Is the habit tracker free and does it work offline?",
    answer: "Yes, the DevelopersMatrix Habit Tracker is completely free and works offline once loaded. All habit data is stored in your browser's local storage, so you can check off habits and view streaks without an internet connection. The data persists across browser sessions until you clear your cache. There is no account required, no cloud sync, and no data collection."
  },
  {
    question: "What habit tracking methods does the tool support?",
    answer: "The tracker supports daily habits (check off each day), weekly habits (target X times per week), and streak-based tracking (consecutive days). You can set custom habit names, choose emoji icons, assign colors for visual organization, and set target frequencies. The dashboard shows current streaks, completion rates over the last 30 days, and a visual calendar grid of your consistency pattern."
  },
  {
    question: "Can I track negative habits I want to break?",
    answer: "Yes, the tracker includes a 'break mode' for habits you want to eliminate rather than build. In break mode, you mark days where you successfully avoided the negative habit, and the tool tracks your 'sober streak' — consecutive days without the behavior. This is useful for habits like social media scrolling, late-night coding, excessive caffeine, or any behavior you want to reduce."
  },
  {
    question: "How does the streak system work?",
    answer: "A streak counts consecutive days where you complete a positive habit or avoid a negative one. Missing one day breaks the streak and resets the counter to zero — this is the classic 'don't break the chain' method popularized by Jerry Seinfeld. Research shows visible streaks are one of the most effective motivation tools for habit formation because loss aversion makes people reluctant to break a long chain. The tracker also shows your personal best streak for each habit, giving you a secondary goal to beat."
  }
];

export const productivityPlannerFAQs: ToolFAQ[] = [
  {
    question: "Is the productivity planner free to use?",
    answer: "Yes, the DevelopersMatrix Productivity Planner is 100% free with no signup required. Plan your day, manage tasks, and track productivity without any cost. All features are fully accessible — task creation, priority setting, time blocking, and weekly review — with no premium tier or paywall."
  },
  {
    question: "What productivity methods does the planner incorporate?",
    answer: "The planner integrates several evidence-based productivity systems. Eisenhower Matrix sorting lets you categorize tasks by urgency and importance. Time blocking allocates specific hours to deep work, meetings, and administrative tasks. Priority scoring weights tasks by impact and effort. The daily review prompts reflection on what was accomplished and what blocked progress. Combined, these methods help you focus on high-value work rather than just busy work."
  },
  {
    question: "Can I use the planner for team projects?",
    answer: "The current version is designed for individual use. Each task, project, and schedule exists only in your browser's local storage. While you cannot share tasks or collaborate in real-time, you can export your task list as text and share it via email or messaging. A collaborative team version is on our roadmap for future development."
  },
  {
    question: "Does the planner have reminders or notifications?",
    answer: "Because the planner runs entirely in the browser without server infrastructure, it does not send push notifications or email reminders. However, you can set task deadlines that visually highlight overdue items in red, and the daily dashboard shows a countdown to your next scheduled time block. For users who need active reminders, we recommend pairing the planner with your phone's built-in alarm or calendar notifications."
  }
];

export const startupIdeaFAQs: ToolFAQ[] = [
  {
    question: "Is the startup idea generator free?",
    answer: "Yes, the DevelopersMatrix AI Startup Idea Generator is completely free. Generate unlimited business ideas across AI, SaaS, FinTech, HealthTech, Climate Tech, and other sectors without signup or payment. Each idea includes market analysis, monetization strategy, competition level, and MVP timeline."
  },
  {
    question: "How does the AI generate startup ideas?",
    answer: "The generator combines current market trend analysis, technology capability mapping, and business model pattern matching. It identifies gaps where emerging technologies meet underserved markets, then constructs a complete business concept including target customer, revenue model, and technical feasibility. The AI draws from publicly available market reports, technology release patterns, and successful startup archetypes to create plausible, actionable ideas rather than random combinations."
  },
  {
    question: "Are the generated ideas actually viable?",
    answer: "The ideas are designed to be plausible starting points, not guaranteed successes. Each idea includes a realistic assessment of competition level, technical difficulty, and market size. High-competition ideas are flagged as requiring significant differentiation. Technical difficulty ratings help you gauge whether the MVP is buildable with your current skills. We strongly recommend treating generated ideas as inspiration for further research rather than immediate business plans. Validate any idea with real customer interviews before building."
  },
  {
    question: "Can I save or export generated ideas?",
    answer: "Yes, you can copy any generated idea to your clipboard with one click, or download a collection of ideas as a text file. Because the tool runs client-side without accounts, there is no built-in 'save to account' feature. We recommend copying promising ideas immediately into your notes app or project management tool for further development."
  }
];

export const promptLibraryFAQs: ToolFAQ[] = [
  {
    question: "Is the AI prompt library free?",
    answer: "Yes, the DevelopersMatrix AI Prompt Library is completely free with no signup. Access 500+ tested prompts for ChatGPT, Claude, Midjourney, DALL-E, and other AI models. Copy any prompt directly to your clipboard and use it immediately."
  },
  {
    question: "How are the prompts organized?",
    answer: "Prompts are organized by category and use case. Major categories include Coding & Development (debugging, refactoring, architecture), Writing & Content (blog posts, emails, social media), Business & Marketing (strategy, analysis, copywriting), Creative & Design (image generation, creative writing), and Learning & Research (explanations, summaries, study guides). Each prompt includes a description of when to use it and expected output quality."
  },
  {
    question: "Can I test prompts before using them?",
    answer: "Yes, the library includes a live prompt testing sandbox. Paste any prompt into the sandbox, run it against your chosen AI model, and see the output before committing to the full interaction. This is useful for verifying that a prompt produces the expected format and quality for your specific use case. The sandbox supports testing with sample inputs to preview how variables in the prompt will be filled."
  },
  {
    question: "Are the prompts tested against current AI models?",
    answer: "Prompts are regularly reviewed and updated to ensure compatibility with the latest model versions including GPT-4o, Claude 3.5 Sonnet, and Gemini 1.5 Pro. However, AI model behavior changes over time — a prompt that worked perfectly three months ago may produce different output today. We mark each prompt with its last verified date and the model version it was tested against. Community feedback helps us identify prompts that need updating."
  }
];

export const emailAssistantFAQs: ToolFAQ[] = [
  {
    question: "Is the AI email assistant free?",
    answer: "Yes, the DevelopersMatrix AI Email Assistant is 100% free with no signup required. Write professional emails from brief notes, rewrite for different tones, draft follow-ups, and generate cold outreach messages without any cost or usage limits."
  },
  {
    question: "What types of emails can the assistant generate?",
    answer: "The assistant handles eight common email types. Professional correspondence includes formal business emails, meeting requests, and project updates. Client communication covers proposals, status reports, and deadline negotiations. Job search emails include application follow-ups, networking outreach, and thank-you notes after interviews. Sales & marketing covers cold outreach, product announcements, and partnership proposals. Personal productivity includes delegation, reminders, and scheduling. The tone rewriter can shift any email between formal, friendly, assertive, apologetic, or concise variants."
  },
  {
    question: "Can the assistant match my personal writing style?",
    answer: "The assistant offers tone presets but cannot yet learn your unique writing style from samples. For best results, generate the email in a tone close to your natural voice, then manually adjust phrasing, signature lines, and personal touches. Many users find that the AI draft provides 80% of the content, with a 2-minute edit adding the authentic voice that makes it sound like you wrote it."
  },
  {
    question: "Is my email content kept private?",
    answer: "Yes. All email generation happens client-side in your browser. The brief notes you provide and the generated emails are never sent to our servers, logged, or stored. You can safely use the assistant for confidential business communication, personal matters, and sensitive negotiations without privacy concerns."
  }
];

export const linkManagerFAQs: ToolFAQ[] = [
  {
    question: "Is the link manager free?",
    answer: "Yes, the DevelopersMatrix Link Manager is completely free. Create branded short links, generate QR codes, build bio pages, and track click analytics without any cost. There are no link limits, no expiration dates on free links, and no forced upgrades."
  },
  {
    question: "What analytics does the link manager provide?",
    answer: "The link manager tracks clicks, geographic location of visitors (country and city level), device type (mobile vs. desktop), browser family, and referrer source when available. Analytics update in real-time and are displayed in a simple dashboard. For privacy compliance, we do not track individual users, store IP addresses, or use cookies for link analytics."
  },
  {
    question: "Can I customize the short link URL?",
    answer: "Yes, you can set custom slugs for your short links instead of random characters. For example, you can create developersmatrix.com/l/portfolio instead of developersmatrix.com/l/x7k9m2. Custom slugs are subject to availability and must be alphanumeric with no spaces or special characters."
  },
  {
    question: "How does the bio page feature work?",
    answer: "The bio page builder creates a simple, mobile-optimized landing page with your profile image, short bio, and multiple link buttons. It functions as a free alternative to Linktree or Carrd for creators who need a link-in-bio page. You can add unlimited links, rearrange them by drag-and-drop, and choose from several color themes. The bio page URL is shareable anywhere you would normally put a single link."
  }
];

export const canYouRunItFAQs: ToolFAQ[] = [
  {
    question: "Is the PC requirements checker free?",
    answer: "Yes, the DevelopersMatrix 'Can You Run It?' tool is completely free. Check your hardware compatibility against 1,000+ PC games including AAA titles, indie releases, and upcoming launches. No signup, no software download, and no malware."
  },
  {
    question: "How does the tool know if my PC can run a game?",
    answer: "The tool compares your submitted hardware specifications against the official minimum and recommended requirements published by game developers. It checks CPU generation and clock speed, GPU model and VRAM, RAM capacity, and available storage space. For each component, it determines whether you meet minimum requirements (game will run at low settings), recommended requirements (game will run well at medium-high settings), or exceed requirements (game will run at ultra settings). The tool also identifies specific bottlenecks — for example, if your GPU meets recommended specs but your CPU falls below minimum, it will flag the CPU as the limiting factor."
  },
  {
    question: "What games are in the database?",
    answer: "The database includes 1,000+ games ranging from current AAA releases like GTA 6, Cyberpunk 2077, and Elden Ring to popular esports titles like Valorant, League of Legends, and Counter-Strike 2, plus indie favorites and classic PC games. New games are added within one week of official system requirements publication. You can request specific games through our community page if a title is missing."
  },
  {
    question: "Does the tool give FPS estimates?",
    answer: "The tool provides approximate FPS ranges based on your hardware tier and the game's optimization profile. These are estimates derived from benchmark data, not guarantees. Actual FPS depends on in-game settings resolution, driver versions, background processes, and thermal conditions. The tool flags whether you can expect 30+ FPS (playable), 60+ FPS (smooth), or 120+ FPS (competitive) at 1080p resolution with appropriate settings."
  },
  {
    question: "Can I check laptop compatibility?",
    answer: "Yes, the tool works for both desktop and laptop hardware. Laptop GPUs and CPUs often have lower clock speeds than their desktop counterparts despite sharing the same model name — for example, a laptop RTX 4060 performs approximately 15-20% below a desktop RTX 4060. The tool factors in these mobile performance differences when making compatibility assessments."
  }
];
