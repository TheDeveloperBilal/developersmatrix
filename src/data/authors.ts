// Author/Person data for GEO and EEAT signals
// AI systems need verifiable named authors, not anonymous "Team" bylines

export interface Author {
  name: string;
  slug: string;
  jobTitle: string;
  bio: string;
  credentials: string[];
  image: string;
  knowsAbout: string[];
  sameAs: string[];
  joinedDate: string;
}

export const siteAuthor: Author = {
  name: 'Bilal Ahmad',
  slug: 'bilal-ahmad',
  jobTitle: 'Founder & Lead Editor',
  bio: 'Bilal Ahmad is the founder of DevelopersMatrix and a full-stack developer with expertise in building AI-powered tools for developers and tech professionals. He has built and scaled multiple web applications using Next.js, React, and modern AI APIs. His work focuses on making professional-grade tools accessible to everyone, regardless of budget.',
  credentials: [
    'Full-Stack Developer',
    'AI Tool Builder',
    'Career Development Writer',
    'Open Source Contributor'
  ],
  image: 'https://developersmatrix.com/author-bilal.jpg',
  knowsAbout: [
    'Software Development',
    'Web Development',
    'Next.js',
    'React',
    'TypeScript',
    'AI Integration',
    'Technical Interview Preparation',
    'Resume Optimization',
    'SEO',
    'Career Growth'
  ],
  sameAs: [
    'https://github.com/TheDeveloperBilal',
    'https://linkedin.com/in/bilalahmad',
    'https://twitter.com/developersmatrix'
  ],
  joinedDate: '2024-01-01'
};

export const editorialTeam: Author[] = [
  siteAuthor,
  {
    name: 'DevelopersMatrix Editorial Team',
    slug: 'editorial-team',
    jobTitle: 'Content Review Board',
    bio: 'The DevelopersMatrix editorial team reviews all technical content for accuracy, relevance, and usefulness. Articles are fact-checked against primary sources and updated quarterly to maintain freshness.',
    credentials: [
      'Technical Review',
      'Fact-Checking',
      'Content Strategy'
    ],
    image: 'https://developersmatrix.com/team-editorial.jpg',
    knowsAbout: [
      'Technical Writing',
      'Content Quality Assurance',
      'Developer Education'
    ],
    sameAs: [
      'https://developersmatrix.com/about'
    ],
    joinedDate: '2024-01-01'
  }
];

export function getAuthorBySlug(slug: string): Author | undefined {
  return editorialTeam.find(a => a.slug === slug);
}

export function getAuthorByName(name: string): Author | undefined {
  return editorialTeam.find(a =>
    a.name.toLowerCase() === name.toLowerCase() ||
    a.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(a.name.toLowerCase())
  );
}

export function getAuthorSchema(author: Author) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle,
    description: author.bio,
    image: author.image,
    knowsAbout: author.knowsAbout,
    sameAs: author.sameAs
  };
}
