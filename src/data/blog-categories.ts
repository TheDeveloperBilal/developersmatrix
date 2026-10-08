// Kept in its own file so client components can read the category list without
// importing src/data/blog.ts, which pulls the entire blog corpus into the bundle.
export const blogCategories = [
  'Gaming',
  'Technology',
  'Politics',
  'World News',
  'Entertainment',
  'Career',
  'Productivity',
  'Startup',
  'Finance',
  'Health',
  'Education',
  'Environment',
  'Science',
  'SEO',
];

// The list above is the old fixed set. Most of it had no posts, so the blog
// showed empty categories. Pages now build their lists from the real posts.
export interface CategoryCount {
  name: string;
  count: number;
}

export function categoriesFrom(posts: { category: string }[]): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    const name = p.category?.trim();
    if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function topTagsFrom(posts: { tags?: string[] }[], limit = 12): string[] {
  const counts = new Map<string, { label: string; count: number }>();
  for (const p of posts) {
    for (const raw of p.tags ?? []) {
      const label = raw.trim();
      if (!label || /^\d{4}$/.test(label)) continue;
      const key = label.toLowerCase();
      const hit = counts.get(key);
      if (hit) hit.count += 1;
      else counts.set(key, { label, count: 1 });
    }
  }
  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit)
    .map((t) => t.label);
}
