/**
 * Content Freshness Report
 * 
 * SAFETY: This script is READ-ONLY. It does not modify any content files.
 * It identifies pages that haven't been updated recently and need review.
 * 
 * Why not auto-update dates? Updating `updatedAt` without actual content
 * changes is "freshness manipulation" - Google can detect this and it
 * may hurt rankings. This script only REPORTS what needs attention.
 * 
 * Usage:
 *   node scripts/content-freshness.js
 * 
 * Cron (weekly, Monday 10 AM):
 *   0 10 * * 1 cd /path/to/project && node scripts/content-freshness.js >> logs/content-freshness.log 2>&1
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
  const logFile = path.join(LOG_DIR, `content-freshness-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logLine);
  console.log(logLine.trim());
}

function extractTrendEntries() {
  const content = fs.readFileSync(TRENDS_FILE, 'utf-8');
  const entries = [];
  
  const entryBlocks = content.split(/(?=\s+slug:\s*')/);
  
  for (const block of entryBlocks) {
    const slugMatch = block.match(/slug:\s*'([^']+)'/);
    const titleMatch = block.match(/title:\s*'([^']+)'/);
    const updatedAtMatch = block.match(/updatedAt:\s*'([^']+)'/);
    const trendingMatch = block.match(/trending:\s*(true|false)/);
    const hotMatch = block.match(/hot:\s*(true|false)/);
    
    if (slugMatch && titleMatch && updatedAtMatch) {
      entries.push({
        slug: slugMatch[1],
        title: titleMatch[1],
        updatedAt: updatedAtMatch[1],
        trending: trendingMatch ? trendingMatch[1] === 'true' : false,
        hot: hotMatch ? hotMatch[1] === 'true' : false,
      });
    }
  }
  
  return entries;
}

function daysSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

async function runFreshnessReport() {
  ensureLogDir();
  const staleItems = [];
  
  writeLog('========================================');
  writeLog('Content Freshness Report');
  writeLog(`Date: ${new Date().toISOString()}`);
  writeLog('========================================\n');
  
  writeLog('⚠️  NOTE: This script does NOT modify any files.');
  writeLog('It only identifies content that may need updating.\n');
  
  writeLog('Step 1: Checking trend pages...');
  const trends = extractTrendEntries();
  writeLog(`Found ${trends.length} trend entries\n`);
  
  for (const trend of trends) {
    const days = daysSince(trend.updatedAt);
    
    if (trend.trending && days > 30) {
      staleItems.push({
        type: 'trend',
        slug: trend.slug,
        title: trend.title,
        lastUpdated: trend.updatedAt,
        daysStale: days,
        priority: 'high',
        reason: 'Marked as trending but not updated in 30+ days'
      });
    } else if (trend.hot && days > 45) {
      staleItems.push({
        type: 'trend',
        slug: trend.slug,
        title: trend.title,
        lastUpdated: trend.updatedAt,
        daysStale: days,
        priority: 'high',
        reason: 'Marked as hot but not updated in 45+ days'
      });
    } else if (days > 90) {
      staleItems.push({
        type: 'trend',
        slug: trend.slug,
        title: trend.title,
        lastUpdated: trend.updatedAt,
        daysStale: days,
        priority: 'medium',
        reason: 'Not updated in 90+ days'
      });
    }
  }
  
  staleItems.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return b.daysStale - a.daysStale;
  });
  
  writeLog('========================================');
  writeLog('STALE CONTENT REPORT');
  writeLog('========================================');
  
  if (staleItems.length === 0) {
    writeLog('\n✅ All content is fresh! No updates needed.');
  } else {
    writeLog(`\nFound ${staleItems.length} items needing attention:\n`);
    
    const highPriority = staleItems.filter(i => i.priority === 'high');
    const mediumPriority = staleItems.filter(i => i.priority === 'medium');
    
    if (highPriority.length > 0) {
      writeLog('🔴 HIGH PRIORITY (trending/hot pages):');
      highPriority.forEach(item => {
        writeLog(`\n  📄 /trends/${item.slug}`);
        writeLog(`     Title: ${item.title}`);
        writeLog(`     Last updated: ${item.lastUpdated} (${item.daysStale} days ago)`);
        writeLog(`     Reason: ${item.reason}`);
      });
    }
    
    if (mediumPriority.length > 0) {
      writeLog('\n🟡 MEDIUM PRIORITY (older content):');
      mediumPriority.forEach(item => {
        writeLog(`\n  📄 /trends/${item.slug}`);
        writeLog(`     Title: ${item.title}`);
        writeLog(`     Last updated: ${item.lastUpdated} (${item.daysStale} days ago)`);
      });
    }
    
    writeLog('\n========================================');
    writeLog('RECOMMENDED ACTIONS:');
    writeLog('========================================');
    writeLog('1. Review high-priority pages first');
    writeLog('2. Update statistics and examples with 2026 data');
    writeLog('3. Add new internal links to recent content');
    writeLog('4. Update the `updatedAt` field AFTER making real changes');
    writeLog('5. Re-submit updated URLs to Google Search Console\n');
  }
  
  writeLog('========================================');
  writeLog('Content Freshness Report complete');
  writeLog('========================================\n');
  
  return staleItems;
}

runFreshnessReport().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
