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
  name: 'Syed Bilal Shah',
  slug: 'syed-bilal-shah',
  jobTitle: 'Founder & Lead Developer',
  bio: 'Syed Bilal Shah is the founder of DevelopersMatrix and co-founder of OviTech Global, a software and digital solutions company with 20+ team members. With over 7 years of experience in full-stack development, SEO, and digital marketing, Bilal has worked with local businesses and international clients across multiple industries. He built DevelopersMatrix to democratize access to professional-grade AI tools after seeing how expensive subscriptions lock out freelancers, students, and small businesses. His work spans Next.js, React, WordPress, Shopify, Magento, and modern AI integrations.',
  credentials: [
    'Full-Stack Developer',
    'Co-Founder, OviTech Global',
    'SEO & Digital Marketing Specialist',
    '7+ Years Industry Experience'
  ],
  image: '/images/about/bilal-1.jpg',
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
    'Career Growth',
    'Digital Marketing',
    'E-commerce Development'
  ],
  sameAs: [
    'https://www.linkedin.com/in/thedeveloperbilal/',
    'https://github.com/TheDeveloperBilal',
    'https://x.com/Developer_Bilal',
    'https://www.behance.net/thedeveloperbilal'
  ],
  joinedDate: '2018-01-01'
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
    image: '/images/about/bilal-1.jpg',
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
