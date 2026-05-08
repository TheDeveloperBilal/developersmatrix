const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/root/.openclaw/workspace/projects/developersmatrix/public/images/blog';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const posts = [
  {
    slug: 'faang-interview-playbook-2026',
    title: 'How to Pass FAANG\nTechnical Interviews',
    subtitle: '2026 Complete Playbook',
    bg: ['#1a1a2e', '#16213e'],
    accent: '#e94560'
  },
  {
    slug: 'ats-resume-guide-2026',
    title: 'ATS Resume Format\nfor Software Engineers',
    subtitle: 'The Guide That Actually Works',
    bg: ['#0f3460', '#16213e'],
    accent: '#e94560'
  },
  {
    slug: 'website-audit-checklist-2026',
    title: 'Website Audit\nChecklist',
    subtitle: '47 Things Google Checks',
    bg: ['#1b1b2f', '#2d2d44'],
    accent: '#00d9ff'
  },
  {
    slug: 'built-resume-builder-48-hours',
    title: 'Built an AI Resume\nBuilder in 48 Hours',
    subtitle: 'The Honest Truth',
    bg: ['#16213e', '#1a1a2e'],
    accent: '#e94560'
  },
  {
    slug: 'ai-tools-developers-2026',
    title: '20 AI Tools Every\nDeveloper Uses in 2026',
    subtitle: 'Not Just Hype — Real Tools',
    bg: ['#1b1b2f', '#16213e'],
    accent: '#00d9ff'
  },
  {
    slug: '5-job-offers-30-days-ai',
    title: 'How I Got 5 Job Offers\nin 30 Days',
    subtitle: 'Using Free AI Tools',
    bg: ['#0f3460', '#1a1a2e'],
    accent: '#e94560'
  }
];

function makeSVG(title, subtitle, accent, width, height) {
  // Split title into lines
  const lines = title.split('\n');
  const titleY = height / 2 - 30;
  
  let titleText = '';
  lines.forEach((line, i) => {
    titleText += `<tspan x="${width/2}" dy="${i === 0 ? 0 : 60}" font-size="52" font-weight="bold" fill="white" text-anchor="middle">${line}</tspan>`;
  });

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${posts[0].bg[0]}"/>
          <stop offset="100%" style="stop-color:${posts[0].bg[1]}"/>
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="black" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="${posts[0].bg[0]}"/>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      
      <!-- Decorative elements -->
      <circle cx="${width * 0.85}" cy="${height * 0.2}" r="120" fill="${accent}" opacity="0.08"/>
      <circle cx="${width * 0.15}" cy="${height * 0.8}" r="80" fill="${accent}" opacity="0.06"/>
      <rect x="${width * 0.05}" y="${height * 0.05}" width="4" height="60" fill="${accent}" opacity="0.5"/>
      <rect x="${width * 0.95 - 4}" y="${height * 0.85}" width="4" height="60" fill="${accent}" opacity="0.5"/>
      
      <!-- Brand mark -->
      <text x="${width/2}" y="${height - 40}" font-size="16" fill="white" opacity="0.5" text-anchor="middle" font-family="system-ui, sans-serif">DevelopersMatrix.com</text>
      
      <!-- Subtitle -->
      <text x="${width/2}" y="${titleY - 50}" font-size="20" fill="${accent}" text-anchor="middle" font-family="system-ui, sans-serif" letter-spacing="3" font-weight="600">${subtitle.toUpperCase()}</text>
      
      <!-- Title -->
      <text x="${width/2}" y="${titleY}" font-family="system-ui, -apple-system, sans-serif" text-anchor="middle">
        ${titleText}
      </text>
    </svg>
  `;
}

async function generateImage(post, width = 800, height = 450) {
  const svg = makeSVG(post.title, post.subtitle, post.accent, width, height);
  
  // Replace gradient colors for each post
  const customSvg = svg
    .replace(posts[0].bg[0], post.bg[0])
    .replace(posts[0].bg[1], post.bg[1]);
  
  const outputPath = path.join(OUTPUT_DIR, `${post.slug}.jpg`);
  
  await sharp(Buffer.from(customSvg))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputPath);
  
  console.log(`Generated: ${outputPath}`);
}

async function main() {
  for (const post of posts) {
    await generateImage(post);
  }
  console.log('All blog cover images generated!');
}

main().catch(console.error);
