// Article cards for the homepage, derived from the blog corpus.
//
// This lives apart from home-data.ts on purpose. Importing the blog JSON pulls
// roughly 830 KB into whatever bundle touches it, and several homepage sections
// are client components that import home-data.ts. Keeping the derivation here
// means only server code reads the corpus; the sections receive finished cards
// as props instead.
import blogsJson from "@/data/high-quality-blogs.json";

export type Article = {
  title: string;
  description: string;
  category: string;
  categoryStyle: string;
  readTime: string;
  updated: string;
  image: string;
  href: string;
};

// Category style map for article cards
const categoryStyles: Record<string, string> = {
  Career: "bg-brand-100 text-brand-700",
  SEO: "bg-emerald-50 text-emerald-600",
  Productivity: "bg-amber-50 text-amber-600",
  AI: "bg-brand-100 text-brand-700",
  "Artificial Intelligence": "bg-brand-100 text-brand-700",
  Technology: "bg-sky-50 text-sky-600",
  Gaming: "bg-rose-50 text-rose-600",
  Startup: "bg-violet-50 text-violet-600",
  "Web Development": "bg-indigo-50 text-indigo-600",
  "Social Media Marketing": "bg-pink-50 text-pink-600",
  "Social Media": "bg-pink-50 text-pink-600",
};

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Build articles dynamically from all real blogs, newest first
const rawBlogs = blogsJson as Array<{
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  publishedAt: string;
  dateModified?: string;
  image: string;
}>;

export const articles: Article[] = rawBlogs
  .slice()
  .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
  .map((b) => ({
    title: b.title,
    description: b.excerpt,
    category: b.category,
    categoryStyle: categoryStyles[b.category] || "bg-sky-50 text-sky-600",
    readTime: `${b.readTime} min read`,
    updated: `Updated ${fmtDate(b.dateModified || b.publishedAt)}`,
    image: b.image,
    href: `/blog/${b.slug}`,
  }));

// The single newest blog (for featured right-side card)
export const latestArticle = articles[0];
