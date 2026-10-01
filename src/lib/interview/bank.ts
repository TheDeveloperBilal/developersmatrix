import type { BankQuestion, Category, Level, RoleKey } from './bank-types';
import { ROLES } from './bank-types';
import { BEHAVIORAL } from './bank-behavioral';
import { TECHNICAL_ENGINEERING } from './bank-technical-eng';
import { TECHNICAL_OTHER } from './bank-technical-other';
import { SYSTEM } from './bank-system';

export const BANK: BankQuestion[] = [...BEHAVIORAL, ...TECHNICAL_ENGINEERING, ...TECHNICAL_OTHER, ...SYSTEM];

const BY_ID = new Map(BANK.map((q) => [q.id, q]));

export function getQuestion(id: string): BankQuestion | undefined {
  return BY_ID.get(id);
}

export function isRole(value: unknown): value is RoleKey {
  return typeof value === 'string' && ROLES.some((r) => r.key === value);
}

export function isCategory(value: unknown): value is Category {
  return value === 'behavioral' || value === 'technical' || value === 'system';
}

export function isLevel(value: unknown): value is Level {
  return value === 'entry' || value === 'mid' || value === 'senior';
}

const LEVEL_ORDER: Level[] = ['entry', 'mid', 'senior'];

/** Nearest levels first, so a mid candidate falls back to senior or entry, not both at once. */
function levelFallback(level: Level): Level[][] {
  const i = LEVEL_ORDER.indexOf(level);
  const neighbours = LEVEL_ORDER.filter((_, j) => Math.abs(j - i) === 1);
  const far = LEVEL_ORDER.filter((_, j) => Math.abs(j - i) === 2);
  return [[level], neighbours, far].filter((group) => group.length > 0);
}

function fitsRole(q: BankQuestion, role: RoleKey) {
  return q.roles === '*' || q.roles.includes(role);
}

/** Every question this role could see in this round, whatever the level. */
export function poolFor(role: RoleKey, category: Category): BankQuestion[] {
  return BANK.filter((q) => q.category === category && fitsRole(q, role));
}

/**
 * Pick a question for the round. Prefers the chosen level, then the nearest
 * level, and skips anything already asked. When every question has been
 * asked it starts over rather than failing.
 */
export function pickQuestion(
  role: RoleKey,
  category: Category,
  level: Level,
  exclude: string[] = [],
  random: () => number = Math.random
): BankQuestion | undefined {
  const pool = poolFor(role, category);
  if (pool.length === 0) return undefined;

  const skip = new Set(exclude);
  for (const levels of levelFallback(level)) {
    const fresh = pool.filter((q) => !skip.has(q.id) && q.levels.some((l) => levels.includes(l)));
    if (fresh.length > 0) return fresh[Math.floor(random() * fresh.length)];
  }

  const atLevel = pool.filter((q) => q.levels.includes(level));
  const restart = atLevel.length > 0 ? atLevel : pool;
  return restart[Math.floor(random() * restart.length)];
}
