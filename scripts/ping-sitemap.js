/**
 * Sitemap Ping - Search Engine Notification
 * 
 * NOTE: Google and Bing deprecated their sitemap ping endpoints in 2023.
 * This script now focuses on:
 * 1. Reminding you to submit via GSC manually
 * 2. Checking if sitemap is accessible
 * 3. Logging when a ping was attempted (for your records)
 * 
 * For actual indexing, use:
 * - Google Search Console → URL Inspection → Request Indexing
 * - Google Indexing API (requires service account key)
 * - Bing Webmaster Tools → Submit sitemap
 * 
 * Usage:
 *   node scripts/ping-sitemap.js
 * 
 * Cron (weekly, Monday 8 AM):
 *   0 8 * * 1 cd /path/to/project && node scripts/ping-sitemap.js >> logs/ping-sitemap.log 2>&1
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(process.cwd(), 'logs');
const SITEMAP_URL = 'https://developersmatrix.com/sitemap.xml';

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function writeLog(content) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${content}\n`;
  const logFile = path.join(LOG_DIR, `ping-sitemap-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logLine);
  console.log(logLine.trim());
}

async function checkSitemapAccessible() {
  try {
    const response = await fetch(SITEMAP_URL, {
      method: 'HEAD',
      headers: { 'User-Agent': 'DevelopersMatrix-Bot/1.0' }
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function runSitemapPing() {
  ensureLogDir();
  
  writeLog('========================================');
  writeLog('Sitemap Status Check');
  writeLog(`Date: ${new Date().toISOString()}`);
  writeLog(`Sitemap: ${SITEMAP_URL}`);
  writeLog('========================================\n');
  
  writeLog('ℹ️  Note: Google/Bing ping endpoints were deprecated in 2023.');
  writeLog('   This script now performs status checks instead.\n');
  
  // Check if sitemap is accessible
  writeLog('Step 1: Checking sitemap accessibility...');
  const isAccessible = await checkSitemapAccessible();
  
  if (isAccessible) {
    writeLog('✅ Sitemap is accessible');
  } else {
    writeLog('⚠️  Sitemap may not be accessible (or returned non-200)');
    writeLog('   This is normal if the site is not running locally.');
  }
  
  // Check local sitemap file exists
  writeLog('\nStep 2: Checking local sitemap generation...');
  const localSitemap = path.join(process.cwd(), 'src', 'app', 'sitemap.ts');
  if (fs.existsSync(localSitemap)) {
    writeLog('✅ sitemap.ts found in src/app/');
  } else {
    writeLog('❌ sitemap.ts not found');
  }
  
  // Summary
  writeLog('\n========================================');
  writeLog('RECOMMENDED ACTIONS:');
  writeLog('========================================');
  writeLog('1. After deploying new content, manually submit to GSC:');
  writeLog('   https://search.google.com/search-console');
  writeLog('2. Use URL Inspection tool for individual pages');
  writeLog('3. For bulk submissions, use Google Indexing API');
  writeLog('   (requires service account JSON key file)');
  writeLog('4. Sitemap is auto-discovered via robots.txt\n');
  
  writeLog('========================================');
  writeLog('Sitemap status check complete');
  writeLog('========================================\n');
}

runSitemapPing().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
