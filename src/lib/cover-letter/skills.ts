/**
 * Skills the cover letter tool can recognise in a job description and in the
 * candidate's own details. Each entry is a display name plus the ways people
 * write it. Matching is case insensitive unless an alias starts with "=",
 * which means "match this exact casing" (used for short words like Go).
 */

export type Skill = { name: string; aliases: string[] };

const S = (name: string, ...aliases: string[]): Skill => ({ name, aliases: [name.toLowerCase(), ...aliases] });

export const SKILLS: Skill[] = [
  // Languages
  S('JavaScript', 'js', 'es6', 'ecmascript'),
  S('TypeScript', 'ts'),
  S('Python'),
  S('Java'),
  S('C#', 'c sharp', 'csharp'),
  S('C++', 'cpp'),
  { name: 'Go', aliases: ['golang', '=Go'] },
  S('Rust'),
  S('Ruby'),
  S('PHP'),
  S('Kotlin'),
  { name: 'Swift', aliases: ['=Swift', 'swift language'] },
  S('Scala'),
  S('Dart'),
  S('SQL'),
  S('Bash', 'shell scripting'),
  // Frontend
  S('React', 'react.js', 'reactjs'),
  S('Next.js', 'nextjs', 'next js'),
  S('Vue', 'vue.js', 'vuejs'),
  S('Nuxt', 'nuxt.js'),
  S('Angular', 'angularjs'),
  S('Svelte', 'sveltekit'),
  S('Astro'),
  S('Redux'),
  S('HTML', 'html5'),
  S('CSS', 'css3'),
  S('Sass', 'scss'),
  S('Tailwind CSS', 'tailwind', 'tailwindcss'),
  S('Webpack'),
  S('Vite'),
  S('Accessibility', 'a11y', 'wcag'),
  S('Web performance', 'core web vitals', 'page speed', 'lighthouse'),
  S('Responsive design', 'mobile first'),
  // Backend
  S('Node.js', 'node', 'nodejs', 'node js'),
  { name: 'Express', aliases: ['=Express', 'express.js', 'expressjs'] },
  S('NestJS', 'nest.js'),
  S('Django'),
  S('Flask'),
  S('FastAPI'),
  { name: 'Spring', aliases: ['=Spring', 'spring boot'] },
  S('.NET', 'dotnet', 'asp.net'),
  S('Laravel'),
  S('Ruby on Rails', 'rails'),
  S('REST APIs', 'restful', 'rest api'),
  S('GraphQL'),
  S('gRPC'),
  S('Microservices', 'microservice'),
  S('PostgreSQL', 'postgres'),
  S('MySQL'),
  S('MongoDB', 'mongo'),
  S('Redis'),
  S('Elasticsearch'),
  S('DynamoDB'),
  S('Kafka', 'apache kafka'),
  S('RabbitMQ'),
  S('System design', 'distributed systems', 'scalability'),
  // Cloud and DevOps
  S('AWS', 'amazon web services'),
  S('Azure', 'microsoft azure'),
  S('Google Cloud', 'gcp', 'google cloud platform'),
  S('Docker', 'containers', 'containerization'),
  S('Kubernetes', 'k8s'),
  S('Terraform'),
  S('CI/CD', 'ci cd', 'continuous integration', 'continuous delivery', 'continuous deployment'),
  S('GitHub Actions'),
  S('Jenkins'),
  S('Linux'),
  S('Git', 'github', 'gitlab'),
  S('Observability', 'monitoring', 'prometheus', 'grafana', 'datadog'),
  S('Serverless', 'lambda'),
  S('Vercel'),
  // Mobile
  S('React Native'),
  S('Flutter'),
  S('iOS'),
  S('Android'),
  S('SwiftUI'),
  S('Jetpack Compose'),
  // Data and ML
  S('Machine learning', 'ml'),
  S('Deep learning'),
  S('PyTorch'),
  S('TensorFlow'),
  S('scikit-learn', 'sklearn', 'scikit learn'),
  S('Pandas'),
  S('NumPy'),
  { name: 'Spark', aliases: ['=Spark', 'apache spark', 'pyspark'] },
  S('Airflow'),
  S('dbt'),
  S('Snowflake'),
  S('BigQuery'),
  S('Data analysis', 'data analytics'),
  S('Data visualization', 'data visualisation', 'dashboards'),
  S('Tableau'),
  S('Power BI', 'powerbi'),
  S('Looker'),
  { name: 'Excel', aliases: ['=Excel', 'microsoft excel', 'spreadsheets'] },
  S('Statistics', 'statistical'),
  S('A/B testing', 'ab testing', 'a b testing', 'experimentation'),
  S('LLMs', 'llm', 'large language models', 'generative ai', 'genai'),
  S('NLP', 'natural language processing'),
  // Testing and quality
  S('Unit testing', 'unit tests'),
  S('Jest'),
  S('Cypress'),
  S('Playwright'),
  S('Selenium'),
  S('Test automation', 'automated testing'),
  S('QA', 'quality assurance'),
  // Security
  S('Security', 'application security', 'appsec', 'owasp'),
  S('OAuth', 'oauth2', 'openid connect', 'sso'),
  // Product, design, marketing
  S('Figma'),
  S('UX research', 'user research'),
  S('UI design', 'interface design'),
  S('Product management', 'product strategy'),
  S('Roadmapping', 'roadmap', 'roadmaps'),
  S('SEO', 'search engine optimization', 'search engine optimisation'),
  S('Content strategy', 'content marketing'),
  S('Copywriting'),
  S('Google Analytics', 'ga4'),
  S('Email marketing'),
  S('Social media', 'social media marketing'),
  S('Paid ads', 'google ads', 'ppc', 'paid media'),
  S('HubSpot'),
  S('Salesforce'),
  S('CRM'),
  S('WordPress'),
  S('Shopify'),
  S('Webflow'),
  // Ways of working
  S('Agile', 'scrum', 'kanban'),
  S('Jira'),
  S('Project management'),
  S('Stakeholder management', 'stakeholders'),
  S('Mentoring', 'mentorship', 'coaching'),
  S('Leadership', 'team lead', 'leading teams'),
  S('Hiring', 'recruiting', 'interviewing'),
  S('Customer support', 'customer success'),
  S('Sales'),
  S('Budgeting', 'forecasting'),
  S('Technical writing', 'documentation'),
  S('Communication', 'written communication', 'verbal communication'),
];

/**
 * Skills that describe context more than a hard requirement. They still count
 * as matches, but the tool never nags a candidate to add them.
 */
export const CONTEXT_SKILLS = new Set([
  'Communication', 'Sales', 'Customer support', 'Stakeholder management', 'Leadership', 'Hiring',
  'Budgeting', 'Project management', 'Mentoring', 'Technical writing', 'Security', 'Agile', 'Jira',
]);

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

type Compiled = { skill: Skill; patterns: RegExp[] };

let COMPILED: Compiled[] | null = null;

function compiled(): Compiled[] {
  if (COMPILED) return COMPILED;
  COMPILED = SKILLS.map((skill) => ({
    skill,
    patterns: skill.aliases.map((alias) => {
      const exact = alias.startsWith('=');
      const body = escapeRegex(exact ? alias.slice(1) : alias).replace(/\\? /g, '[\\s-]+');
      // Boundaries that respect symbols such as C++, C#, .NET and Node.js.
      return new RegExp(`(?<![A-Za-z0-9+#.])${body}(?![A-Za-z0-9+#])`, exact ? 'g' : 'gi');
    }),
  }));
  return COMPILED;
}

export type SkillHit = { name: string; count: number; first: number };

/** Skills found in a piece of text, most mentioned first. */
export function findSkills(text: string): SkillHit[] {
  if (!text.trim()) return [];
  const hits: SkillHit[] = [];
  for (const { skill, patterns } of compiled()) {
    let count = 0;
    let first = Infinity;
    for (const re of patterns) {
      re.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = re.exec(text))) {
        // "Go" as a verb is far more common than the language. Only count the
        // exact cased word when it sits next to another tech word or a list.
        if (skill.name === 'Go' && m[0] === 'Go') {
          const around = text.slice(Math.max(0, m.index - 20), m.index + 20);
          if (!/[,/]|\b(and|or|in|with|using)\b/.test(around) || /\bGo (to|ahead|live|beyond|through)\b/.test(around)) continue;
        }
        count++;
        first = Math.min(first, m.index);
      }
    }
    if (count > 0) hits.push({ name: skill.name, count, first });
  }
  // "React Native" also contains "React". Drop the shorter one if every
  // mention was part of the longer name.
  const names = new Set(hits.map((h) => h.name));
  const filtered = hits.filter((h) => {
    if (h.name === 'React' && names.has('React Native')) {
      const rn = hits.find((x) => x.name === 'React Native')!;
      return h.count > rn.count;
    }
    return true;
  });
  return filtered.sort((a, b) => b.count - a.count || a.first - b.first);
}

/** Turn a comma separated skills field into display names, keeping unknown skills as typed. */
export function parseSkillList(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(/[,;\n|]+/)) {
    const item = raw.trim().replace(/\s+/g, ' ');
    if (!item) continue;
    const known = findSkills(item)[0];
    const flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9+#]/g, '');
    // Tidy obvious variants (nodejs, k8s, js) but keep the candidate's own wording otherwise.
    const name = known && (flat(known.name) === flat(item) || item.length <= 6) ? known.name : item;
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(name);
    }
  }
  return out;
}
