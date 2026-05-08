const fs = require('fs');

let content = fs.readFileSync('src/data/blog.ts', 'utf8');

// Find all content fields and escape backticks inside them
// This is a complex operation - let me do it differently
// I'll replace all backticks in content strings with escaped versions

// First, let's identify the pattern: content: `...`
// We need to escape backticks inside the template literal

// Simple approach: replace all ` with \` but that will break the outer template literals
// Better approach: use string concatenation with regular quotes

// Actually, let me just replace the template literals with regular string literals
// by splitting on backticks and joining with +

// Find all occurrences of content: ` and escape backticks until the closing `
const lines = content.split('\n');
let inContent = false;
let result = [];
let currentContent = [];

for (let line of lines) {
  if (line.includes('content: `') && !inContent) {
    inContent = true;
    result.push(line);
    continue;
  }
  
  if (inContent) {
    // Check if this line ends the template literal (starts with `)
    if (line.trim() === '`' || line.trim().startsWith('`,') || line.trim().startsWith('` ')) {
      inContent = false;
      result.push(line);
      continue;
    }
    
    // Escape backticks in content
    let escaped = line.replace(/`/g, '\\`');
    result.push(escaped);
  } else {
    result.push(line);
  }
}

fs.writeFileSync('src/data/blog.ts', result.join('\n'));
console.log('Fixed backticks in blog.ts');
