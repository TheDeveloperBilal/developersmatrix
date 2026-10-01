// Shared types for the interview question bank and the answer checker.

export type RoleKey =
  | 'software-developer'
  | 'frontend-developer'
  | 'backend-developer'
  | 'fullstack-developer'
  | 'devops-engineer'
  | 'data-scientist'
  | 'data-analyst'
  | 'product-manager'
  | 'engineering-manager'
  | 'mobile-developer'
  | 'qa-engineer'
  | 'system-architect';

export type Category = 'behavioral' | 'technical' | 'system';
export type Level = 'entry' | 'mid' | 'senior';

/**
 * One rubric item. `terms` is a pipe separated list of words or phrases that
 * show the candidate covered the point. Matching ignores case, punctuation and
 * simple word endings, so "invalidate" also matches "invalidation".
 */
export type KeyPoint = { label: string; terms: string };

export interface BankQuestion {
  id: string;
  /** '*' means every role. */
  roles: RoleKey[] | '*';
  category: Category;
  levels: Level[];
  question: string;
  /**
   * Words that show an answer is about this question at all. An answer that
   * hits none of these and none of the key points is treated as off topic.
   */
  anchors: string;
  points: KeyPoint[];
  /** A strong answer, shown after the candidate submits. */
  model: string;
  hints: string[];
  /** What an interviewer would most likely ask next. Shown, not scored. */
  next: string;
}

export const ROLES: { key: RoleKey; label: string }[] = [
  { key: 'software-developer', label: 'Software Developer' },
  { key: 'frontend-developer', label: 'Frontend Developer' },
  { key: 'backend-developer', label: 'Backend Developer' },
  { key: 'fullstack-developer', label: 'Full Stack Developer' },
  { key: 'devops-engineer', label: 'DevOps Engineer' },
  { key: 'mobile-developer', label: 'Mobile Developer' },
  { key: 'qa-engineer', label: 'QA Engineer' },
  { key: 'system-architect', label: 'System Architect' },
  { key: 'data-scientist', label: 'Data Scientist' },
  { key: 'data-analyst', label: 'Data Analyst' },
  { key: 'product-manager', label: 'Product Manager' },
  { key: 'engineering-manager', label: 'Engineering Manager' },
];

export const LEVELS: { key: Level; label: string; years: string; targetWords: number }[] = [
  { key: 'entry', label: 'Entry', years: '0 to 2 years', targetWords: 70 },
  { key: 'mid', label: 'Mid', years: '2 to 5 years', targetWords: 100 },
  { key: 'senior', label: 'Senior', years: '5+ years', targetWords: 130 },
];

/** The third round is a case interview for roles that do not do system design. */
export function categoryLabel(role: RoleKey, category: Category): string {
  if (category === 'behavioral') return 'Behavioral';
  if (category === 'technical') {
    if (role === 'product-manager') return 'Product sense';
    if (role === 'engineering-manager') return 'Leadership';
    return 'Technical';
  }
  if (role === 'product-manager') return 'Product case';
  if (role === 'data-analyst') return 'Analytics case';
  if (role === 'data-scientist') return 'ML system design';
  if (role === 'engineering-manager') return 'Team design';
  return 'System design';
}
