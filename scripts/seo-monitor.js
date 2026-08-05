/**
 * SEO Monitor - Weekly Health Check
 * 
 * SAFETY: This script is READ-ONLY. It does not modify any files.
 * It scans the codebase and reports potential SEO issues.
 * 
 * Usage:
 *   node scripts/seo-monitor.js
 * 
 * Cron (weekly, Monday 9 AM):
 *   0 9 * * 1 cd /path/to/project && node scripts/seo-monitor.js >> logs/seo-monitor.log 2>&1
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const TRENDS_FILE = path.join(process.cwd(), 'src', 'data', 'trends-data.ts');

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

function checkLinkValid(link, validSlugs) {
  const cleanLink = link.replace(/\/$/, '');
  
  if (cleanLink.startsWith('/trends/')) {
    const slug = cleanLink.replace('/trends/', '');
    return validSlugs.has(slug);
  }
  
  if (cleanLink.startsWith('/tools/')) {
    const toolName = cleanLink.replace('/tools/', '');
    const toolPath = path.join(process.cwd(), 'src', 'app', 'tools', toolName);
    return fs.existsSync(toolPath);
  }
  
  if (cleanLink.startsWith('/blog/')) {
    const blogSlug = cleanLink.replace('/blog/', '');
    const blogDir = path.join(process.cwd(), 'src', 'app', 'blog');
    if (!fs.existsSync(blogDir)) return false;
    const files = fs.readdirSync(blogDir);
    return files.some(f => f.includes(blogSlug));
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
  
  writeLog('\nStep 2: Checking trend page existence...');
  const validSlugs = new Set();
  for (const slug of trendSlugs) {
    validSlugs.add(slug);
    const dynamicRouteExists = fs.existsSync(
      path.join(process.cwd(), 'src', 'app', 'trends', '[slug]', 'page.tsx')
    );
    if (!dynamicRouteExists) {
      issues.push({
        type: 'error',
        page: `/trends/${slug}`,
        message: 'Trend page route missing',
        details: 'src/app/trends/[slug]/page.tsx not found'
      });
    }
  }
  
  if (issues.filter(i => i.type === 'error').length === 0) {
    writeLog('✅ All trend pages have valid routes');
  }
  
  writeLog('\nStep 3: Checking internal links in trend content...');
  const trendsContent = fs.readFileSync(TRENDS_FILE, 'utf-8');
  const links = extractInternalLinks(trendsContent);
  writeLog(`Found ${links.length} internal links`);
  
  let brokenLinks = 0;
  for (const link of links) {
    if (!checkLinkValid(link, validSlugs)) {
      issues.push({
        type: 'error',
        message: `Broken internal link: ${link}`,
        details: 'Link points to non-existent page'
      });
      brokenLinks++;
    }
  }
  
  if (brokenLinks === 0) {
    writeLog('✅ No broken internal links found');
  } else {
    writeLog(`❌ Found ${brokenLinks} broken internal links`);
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
    issues.push({
      type: 'warning',
      message: `Found ${duplicates.length} duplicate titles`,
      details: duplicates.join(', ')
    });
    writeLog(`⚠️ Found ${duplicates.length} duplicate titles`);
  } else {
    writeLog('✅ No duplicate titles found');
  }
  
  writeLog('\nStep 5: Checking tools directory...');
  const toolsDir = path.join(process.cwd(), 'src', 'app', 'tools');
  if (fs.existsSync(toolsDir)) {
    const tools = fs.readdirSync(toolsDir).filter(f => !f.startsWith('.') && !f.includes('.'));
    writeLog(`Found ${tools.length} tool directories`);
    writeLog('✅ Tools directory accessible');
  }
  
  writeLog('\n========================================');
  writeLog('SUMMARY');
  writeLog('========================================');
  
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  
  writeLog(`Total checks: 5`);
  writeLog(`Errors: ${errors.length}`);
  writeLog(`Warnings: ${warnings.length}`);
  
  if (errors.length > 0) {
    writeLog('\n❌ ERRORS:');
    errors.forEach(e => {
      writeLog(`  - ${e.message}${e.page ? ` (${e.page})` : ''}`);
      if (e.details) writeLog(`    Details: ${e.details}`);
    });
  }
  
  if (warnings.length > 0) {
    writeLog('\n⚠️ WARNINGS:');
    warnings.forEach(w => {
      writeLog(`  - ${w.message}`);
      if (w.details) writeLog(`    Details: ${w.details}`);
    });
  }
  
  if (errors.length === 0 && warnings.length === 0) {
    writeLog('\n✅ All checks passed! No SEO issues found.');
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
