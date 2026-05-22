export interface Author {
  name: string;
  slug: string;
  bio: string;
  role: string;
  credentials: string[];
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export const authors: Record<string, Author> = {
  'developersmatrix-team': {
    name: 'DevelopersMatrix Team',
    slug: 'developersmatrix-team',
    bio: 'A collective of developers, product managers, and tech writers building free AI tools and publishing researched guides for the tech community. Every article is fact checked and updated regularly.',
    role: 'Editorial Team',
    credentials: ['Tech Industry Analysts', 'Open Source Contributors', 'AI Tool Builders'],
  },
  'jennifer-walsh': {
    name: 'Jennifer Walsh',
    slug: 'jennifer-walsh',
    bio: 'Startup advisor and venture analyst with eight years of experience guiding early stage companies through funding rounds. Previously worked at two seed stage funds and advised over forty startups on pitch strategy and financial modeling.',
    role: 'Startup Finance Contributor',
    credentials: ['Former VC Analyst', 'Startup Advisor', 'Financial Modeling Expert'],
  },
};

export function getAuthorByName(name: string): Author | undefined {
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  return authors[slug] || authors['developersmatrix-team'];
}
