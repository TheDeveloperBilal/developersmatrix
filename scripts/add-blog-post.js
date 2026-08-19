const fs = require('fs');

// Read the article
const article = fs.readFileSync('/root/.openclaw/workspace/downloads/1a019653-2502-857c-8000-00008745c6a3_article-quantum-computing-advancements-2026.md', 'utf8');
const lines = article.split('\n');

// Find content start (after second --- or first --- if only one)
let contentStart = 0;
let separatorCount = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '---') {
    separatorCount++;
    if (separatorCount === 2) {
      contentStart = i + 1;
      break;
    }
  }
}
if (separatorCount < 2) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      contentStart = i + 1;
      break;
    }
  }
}

// Get content lines
let contentLines = lines.slice(contentStart);

// Remove HTML comment line
contentLines = contentLines.filter(line => !line.includes('<!-- QUICK ANSWER BLOCK') && !line.includes('<!-- SCHEMA'));

// Remove empty lines at start
while (contentLines.length > 0 && contentLines[0].trim() === '') {
  contentLines.shift();
}

// Find where to end content (before schema, about author, last updated, or closing ```)
let contentEnd = contentLines.length;
for (let i = 0; i < contentLines.length; i++) {
  const line = contentLines[i].trim();
  if (line === '```json' || line === '## About the Author' || line.startsWith('*Last updated:') || line.startsWith('```')) {
    contentEnd = i;
    break;
  }
}
contentLines = contentLines.slice(0, contentEnd);

// Remove trailing empty lines
while (contentLines.length > 0 && contentLines[contentLines.length - 1].trim() === '') {
  contentLines.pop();
}

const content = contentLines.join('\n');

// Extract FAQs
const faqs = [];
let inFAQSection = false;
let currentQuestion = null;
let currentAnswer = [];

for (const line of contentLines) {
  if (line.trim() === '## Frequently Asked Questions') {
    inFAQSection = true;
    continue;
  }
  if (!inFAQSection) continue;
  
  if (line.startsWith('### ')) {
    if (currentQuestion) {
      faqs.push({
        question: currentQuestion,
        answer: currentAnswer.join('\n').trim()
      });
    }
    currentQuestion = line.replace('### ', '').trim();
    currentAnswer = [];
  } else if (currentQuestion !== null) {
    currentAnswer.push(line);
  }
}

if (currentQuestion) {
  faqs.push({
    question: currentQuestion,
    answer: currentAnswer.join('\n').trim()
  });
}

// Find next hq ID
const blogs = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/projects/developersmatrix/src/data/high-quality-blogs.json', 'utf8'));
let maxId = 0;
for (const blog of blogs) {
  const match = blog.id.match(/hq-(\d+)/);
  if (match) {
    maxId = Math.max(maxId, parseInt(match[1]));
  }
}
const nextId = `hq-${maxId + 1}`;

// Build blog post
const blogPost = {
  id: nextId,
  slug: 'quantum-computing-advancements-2026',
  title: 'Latest Quantum Computing Advancements in 2026: What Actually Changed',
  excerpt: 'Quantum computing moved fast in 2026. Here are the real breakthroughs in error correction, qubit counts, and enterprise applications that actually matter.',
  content: content,
  author: 'Syed Bilal Shah',
  category: 'Technology',
  tags: [
    'Quantum Computing',
    'quantum computing advancements 2026',
    'quantum computing breakthroughs 2026',
    'quantum computing milestones 2026',
    'quantum computing progress 2026',
    'Technology',
    '2026'
  ],
  publishedAt: '2026-08-19',
  dateModified: '2026-08-19',
  readTime: 13,
  image: '/images/blog/quantum-computing-advancements-2026.jpg',
  faqs: faqs,
  canonicalUrl: 'https://developersmatrix.com/blog/quantum-computing-advancements-2026',
  noindex: false
};

// Prepend new post
blogs.unshift(blogPost);

// Write back with 1-space indent to match existing format
fs.writeFileSync('/root/.openclaw/workspace/projects/developersmatrix/src/data/high-quality-blogs.json', JSON.stringify(blogs, null, ' '));

console.log('Blog post added successfully!');
console.log('ID:', nextId);
console.log('Slug:', blogPost.slug);
console.log('FAQs extracted:', faqs.length);
console.log('Content length:', content.length, 'chars');
