// Data model for the resume builder. Kept plain so it can be saved to
// localStorage and restored without any conversion.

export type TemplateKey = 'classic' | 'modern' | 'compact';

export interface Contact {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

export interface Role {
  id: string;
  title: string;
  company: string;
  location: string;
  start: string; // YYYY-MM
  end: string; // YYYY-MM, empty when current
  current: boolean;
  bullets: string; // one bullet per line
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  link: string;
  bullets: string;
}

export interface School {
  id: string;
  school: string;
  degree: string;
  field: string;
  end: string; // YYYY-MM
  detail: string;
}

export interface Resume {
  contact: Contact;
  summary: string;
  roles: Role[];
  projects: Project[];
  education: School[];
  skills: string[];
  certifications: string;
  template: TemplateKey;
  accent: string;
}

export const ACCENTS = ['#0f172a', '#1e3a8a', '#065f46', '#7c2d12', '#581c87'] as const;

let counter = 0;
export function uid(prefix: string) {
  counter += 1;
  return `${prefix}${Date.now().toString(36)}${counter}`;
}

export const emptyRole = (): Role => ({ id: uid('r'), title: '', company: '', location: '', start: '', end: '', current: false, bullets: '' });
export const emptyProject = (): Project => ({ id: uid('p'), name: '', tech: '', link: '', bullets: '' });
export const emptySchool = (): School => ({ id: uid('e'), school: '', degree: '', field: '', end: '', detail: '' });

export const EMPTY_RESUME: Resume = {
  contact: { name: '', headline: '', email: '', phone: '', location: '', linkedin: '', website: '' },
  summary: '',
  roles: [emptyRole()],
  projects: [],
  education: [emptySchool()],
  skills: [],
  certifications: '',
  template: 'classic',
  accent: ACCENTS[0],
};

/** A filled example so people can see what good looks like. Clearly fictional. */
export const EXAMPLE_RESUME: Resume = {
  contact: {
    name: 'Sara Malik',
    headline: 'Frontend Engineer',
    email: 'sara.malik@example.com',
    phone: '+1 555 010 0142',
    location: 'Austin, TX',
    linkedin: 'linkedin.com/in/saramalik',
    website: 'saramalik.dev',
  },
  summary:
    'Frontend engineer with six years of experience building fast, accessible React and TypeScript apps for consumer products. Most recently cut checkout drop off from 38% to 21% by rebuilding the payment flow. Comfortable owning features from design review to production monitoring.',
  roles: [
    {
      id: 'ex1',
      title: 'Frontend Engineer',
      company: 'Brightcart',
      location: 'Austin, TX',
      start: '2022-03',
      end: '',
      current: true,
      bullets:
        'Rebuilt the checkout flow in React and TypeScript, cutting drop off from 38% to 21% within two months\nLed the move from Webpack to Vite, making local builds four times faster for a team of 30 engineers\nIntroduced automated accessibility checks in CI, fixing 120 WCAG issues across the main purchase path',
    },
    {
      id: 'ex2',
      title: 'Junior Web Developer',
      company: 'Northfield Media',
      location: 'Remote',
      start: '2020-06',
      end: '2022-02',
      current: false,
      bullets:
        'Built 14 marketing landing pages in Next.js, lifting average Lighthouse performance from 62 to 94\nCreated a shared component library used by 4 product teams, removing about 3,000 lines of duplicate code',
    },
  ],
  projects: [
    {
      id: 'exp1',
      name: 'Pocket Budget',
      tech: 'React Native, Supabase',
      link: 'github.com/saramalik/pocket-budget',
      bullets: 'Open source budgeting app with offline sync, used by around 1,200 people each month',
    },
  ],
  education: [
    { id: 'exe1', school: 'University of Texas at Austin', degree: 'BSc', field: 'Computer Science', end: '2020-05', detail: '' },
  ],
  skills: ['React', 'TypeScript', 'Next.js', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Jest', 'Playwright', 'Accessibility', 'Vite', 'Git'],
  certifications: '',
  template: 'classic',
  accent: ACCENTS[0],
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(value: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(value || '');
  if (!m) return value || '';
  return `${MONTHS[Number(m[2]) - 1] ?? ''} ${m[1]}`.trim();
}

export function dateRange(start: string, end: string, current: boolean): string {
  const a = formatMonth(start);
  const b = current ? 'Present' : formatMonth(end);
  if (a && b) return `${a} to ${b}`;
  return a || b;
}

export function bulletLines(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.replace(/^\s*[-*•·]\s*/, '').trim())
    .filter(Boolean);
}

/** Total months of experience across roles, overlaps counted once. */
export function monthsOfExperience(roles: Role[], now = new Date()): number {
  const toIndex = (v: string) => {
    const m = /^(\d{4})-(\d{2})$/.exec(v);
    return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : null;
  };
  const nowIndex = now.getFullYear() * 12 + now.getMonth();
  const ranges = roles
    .map((r) => [toIndex(r.start), r.current ? nowIndex : toIndex(r.end)] as const)
    .filter((x): x is [number, number] => x[0] !== null && x[1] !== null && x[1] >= x[0])
    .sort((a, b) => a[0] - b[0]);
  let total = 0;
  let curStart = -1;
  let curEnd = -1;
  for (const [s, e] of ranges) {
    if (s > curEnd) {
      if (curEnd >= curStart && curStart >= 0) total += curEnd - curStart + 1;
      curStart = s;
      curEnd = e;
    } else curEnd = Math.max(curEnd, e);
  }
  if (curStart >= 0) total += curEnd - curStart + 1;
  return total;
}
