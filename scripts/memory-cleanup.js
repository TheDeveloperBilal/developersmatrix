/**
 * Memory Cleanup - Weekly Maintenance
 * 
 * This script archives old daily memory files to keep the workspace clean.
 * 
 * Usage:
 *   node scripts/memory-cleanup.js
 * 
 * Cron (weekly, Sunday 11 PM):
 *   0 23 * * 0 cd /path/to/project && node scripts/memory-cleanup.js >> logs/memory-cleanup.log 2>&1
 */

const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.join(process.cwd(), '..');
const MEMORY_DIR = path.join(WORKSPACE_DIR, 'memory');
const ARCHIVE_DIR = path.join(MEMORY_DIR, 'archive');
const LOG_DIR = path.join(process.cwd(), 'logs');

const KEEP_DAYS = 14;
const ARCHIVE_KEEP_DAYS = 90;

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writeLog(content) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${content}\n`;
  const logFile = path.join(LOG_DIR, `memory-cleanup-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, logLine);
  console.log(logLine.trim());
}

function daysSince(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function parseDateFromFilename(filename) {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
  if (match) {
    return new Date(match[1]);
  }
  return null;
}

async function runMemoryCleanup() {
  ensureDir(LOG_DIR);
  ensureDir(ARCHIVE_DIR);
  
  writeLog('========================================');
  writeLog('Memory Cleanup - Weekly Maintenance');
  writeLog(`Date: ${new Date().toISOString()}`);
  writeLog('========================================\n');
  
  if (!fs.existsSync(MEMORY_DIR)) {
    writeLog('ℹ️  No memory directory found. Creating...');
    ensureDir(MEMORY_DIR);
    writeLog('✅ Memory directory created');
    return;
  }
  
  const files = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md') && !f.startsWith('archive'));
  writeLog(`Found ${files.length} memory files`);
  
  let archived = 0;
  let kept = 0;
  const archiveSummary = [];
  
  for (const file of files) {
    const fileDate = parseDateFromFilename(file);
    if (!fileDate) continue;
    
    const days = daysSince(fileDate.toISOString().split('T')[0]);
    const filePath = path.join(MEMORY_DIR, file);
    
    if (days > KEEP_DAYS) {
      const archivePath = path.join(ARCHIVE_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      fs.writeFileSync(archivePath, content);
      fs.unlinkSync(filePath);
      
      archived++;
      archiveSummary.push(`${file} (${days} days old)`);
      writeLog(`📦 Archived: ${file} (${days} days old)`);
    } else {
      kept++;
    }
  }
  
  const archiveFiles = fs.readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.md'));
  let deleted = 0;
  
  for (const file of archiveFiles) {
    const fileDate = parseDateFromFilename(file);
    if (!fileDate) continue;
    
    const days = daysSince(fileDate.toISOString().split('T')[0]);
    if (days > ARCHIVE_KEEP_DAYS) {
      fs.unlinkSync(path.join(ARCHIVE_DIR, file));
      deleted++;
      writeLog(`🗑️  Deleted old archive: ${file} (${days} days old)`);
    }
  }
  
  writeLog('\n========================================');
  writeLog('SUMMARY');
  writeLog('========================================');
  writeLog(`Files archived: ${archived}`);
  writeLog(`Files kept (recent): ${kept}`);
  writeLog(`Old archives deleted: ${deleted}`);
  writeLog(`Total archive size: ${archiveFiles.length - deleted} files`);
  
  if (archived > 0) {
    writeLog('\n📋 Archived files:');
    archiveSummary.forEach(s => writeLog(`  - ${s}`));
  }
  
  writeLog('\n✅ Memory cleanup complete');
  writeLog('========================================\n');
}

runMemoryCleanup().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
