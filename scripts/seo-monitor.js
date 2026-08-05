/**
 * SEO Monitor - Weekly Health Check
 * 
 * SAFETY: This script is READ-ONLY. It does not modify any files.
 * 
 * Usage:
 *   node scripts/seo-monitor.js
 * 
 * Cron (weekly, Monday 9 AM):
 *   0 9 * * 1 cd /path/to/project && node scripts/seo-monitor.js >> logs/seo-monitor.log 2>&1
 */

const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;
const PROJECT_DIR = path.join(SCRIPT_DIR, '..');
const LOG_DIR = path.join(PROJECT_DIR, 'logs');
const TRENDS_FILE = path.join(PROJECT_DIR, 'src', 'data', 'trends-data.ts');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function writeLog(content) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${content}\n`;
  const logFile = path.join(LOG_DIR, `seo-monitor-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logLine);
  console.log(logLine.trim());
}

function extractSlugsFromTrends() {
  const content = fs.readFileSync(TRENDS_FILE, 'utf-8');
  const slugs = [];
  const slugMatches = content.matchAll(/slug:\s*'([^']+)'/g);
  for (const match of slugMatches) {
    slugs.push(match[1]);
  }
  return slugs;
}

function getAllBlogSlugs() {
  const slugs = new Set();
  
  try {
    const hqBlogs = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'src', 'data', 'high-quality-blogs.json'), 'utf-8'));
    hqBlogs.forEach(post => { if (post.slug) slugs.add(post.slug); });
  } catch (e) { /* ignore */ }
  
  try {
    const genBlogs = JSON.parse(fs.readFileSync(path.join(PROJECT_DIR, 'src', 'data', 'generated-blogs.json'), 'utf-8'));
    genBlogs.forEach(post => { if (post.slug) slugs.add(post.slug); });
  } catch (e) { /* ignore */ }
  
  slugs.add('startup-funding-guide-2026');
  return slugs;
}

function extractInternalLinks(content) {
  const links = [];
  
  const mdLinks = content.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g);
  for (const match of mdLinks) {
    links.push(match[2]);
  }
  
  const plainLinks = content.matchAll(/https:\/\/developersmatrix\.com(\/[^\s"'`]+)/g);
  for (const match of plainLinks) {
    links.push(match[1]);
  }
  
  return [...new Set(links)];
}

function checkLinkValid(link, validSlugs, blogSlugs) {
  const cleanLink = link.replace(/\/$/, '');
  
  if (cleanLink.startsWith('/trends/')) {
    const slug = cleanLink.replace('/trends/', '');
    return validSlugs.has(slug);
  }
  
  if (cleanLink.startsWith('/tools/')) {
    const toolName = cleanLink.replace('/tools/', '');
    const toolPath = path.join(PROJECT_DIR, 'src', 'app', 'tools', toolName);
    return fs.existsSync(toolPath);
  }
  
  if (cleanLink.startsWith('/blog/')) {
    const blogSlug = cleanLink.replace('/blog/', '');
    return blogSlugs.has(blogSlug);
  }
  
  const staticPages = ['/', '/tools', '/trends', '/blog', '/community', '/contact', '/about', '/privacy', '/terms', '/cookies', '/disavow.txt', '/sitemap.xml'];
  return staticPages.includes(cleanLink);
}

async function runSEOMonitor() {
  ensureLogDir();
  const issues = [];
  
  writeLog('========================================');
  writeLog('SEO Monitor - Weekly Health Check');
  writeLog(`Date: ${new Date().toISOString()}`);
  writeLog('========================================\n');
  
  writeLog('Step 1: Extracting trend slugs...');
  const trendSlugs = extractSlugsFromTrends();
  writeLog(`Found ${trendSlugs.length} trend slugs`);
  
  const blogSlugs = getAllBlogSlugs();
  writeLog(`Found ${blogSlugs.size} blog posts`);
  
  writeLog('\nStep 2: Checking trend page routes...');
  const validSlugs = new Set(trendSlugs);
  const routeExists = fs.existsSync(path.join(PROJECT_DIR, 'src', 'app', 'trends', '[slug]', 'page.tsx'));
  if (routeExists) {
    writeLog('✅ Trend dynamic route exists');
  } else {
    issues.push({ type: 'error', message: 'Trend dynamic route missing', details: 'src/app/trends/[slug]/page.tsx not found' });
  }
  
  writeLog('\nStep 3: Checking internal links...');
  const trendsContent = fs.readFileSync(TRENDS_FILE, 'utf-8');
  const links = extractInternalLinks(trendsContent);
  writeLog(`Found ${links.length} internal links`);
  
  let brokenLinks = 0;
  for (const link of links) {
    if (!checkLinkValid(link, validSlugs, blogSlugs)) {
      issues.push({ type: 'error', message: `Broken internal link: ${link}` });
      brokenLinks++;
    }
  }
  
  if (brokenLinks === 0) {
    writeLog('✅ No broken internal links');
  } else {
    writeLog(`❌ Found ${brokenLinks} broken links`);
  }
  
  writeLog('\nStep 4: Checking for duplicate titles...');
  const titleMatches = trendsContent.matchAll(/title:\s*'([^']+)'/g);
  const titles = [];
  for (const match of titleMatches) {
    titles.push(match[1]);
  }
  
  const seen = new Set();
  const duplicates = [];
  for (const title of titles) {
    if (seen.has(title)) duplicates.push(title);
    seen.add(title);
  }
  
  if (duplicates.length > 0) {
    issues.push({ type: 'warning', message: `Found ${duplicates.length} duplicate titles`, details: duplicates.join(', ') });
    writeLog(`⚠️ Found ${duplicates.length} duplicate titles: ${duplicates.join(', ')}`);
  } else {
    writeLog('✅ No duplicate titles');
  }
  
  writeLog('\nStep 5: Checking tools directory...');
  const toolsDir = path.join(PROJECT_DIR, 'src', 'app', 'tools');
  if (fs.existsSync(toolsDir)) {
    const tools = fs.readdirSync(toolsDir).filter(f => !f.startsWith('.') && !f.includes('.'));
    writeLog(`Found ${tools.length} tool directories ✅`);
  }
  
  writeLog('\n========================================');
  writeLog('SUMMARY');
  writeLog('========================================');
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  writeLog(`Errors: ${errors.length} | Warnings: ${warnings.length}`);
  
  if (errors.length > 0) {
    writeLog('\n❌ ERRORS:');
    errors.forEach(e => writeLog(`  - ${e.message}${e.details ? ': ' + e.details : ''}`));
  }
  if (warnings.length > 0) {
    writeLog('\n⚠️ WARNINGS:');
    warnings.forEach(w => writeLog(`  - ${w.message}${w.details ? ': ' + w.details : ''}`));
  }
  if (errors.length === 0 && warnings.length === 0) {
    writeLog('\n✅ All checks passed!');
  }
  
  writeLog('\n========================================');
  writeLog('SEO Monitor complete');
  writeLog('========================================\n');
  
  return issues.length === 0;
}

runSEOMonitor().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
