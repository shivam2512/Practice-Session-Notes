const fs = require('fs');

let content = fs.readFileSync('notes.json', 'utf8');
let notes = JSON.parse(content);

function fixMojibake(str) {
    if (!str) return str;
    let newStr = str;
    
    // First, try the standard UTF-8 misread as Latin1 recovery
    try {
        const decoded = Buffer.from(newStr, 'latin1').toString('utf8');
        // If it actually contains valid UTF-8 and differs, maybe use it?
        // But doing this globally might break things that are ALREADY valid UTF-8.
        // Instead, let's look for specific patterns using regex.
    } catch(e) {}
    
    return newStr;
}

// Since global recovery is risky, let's find the exact garbled words and print them out with context
const regex = /[^\x00-\x7F]+/g;
let match;
const found = new Set();
for (const note of notes) {
    const textToSearch = note.title + ' ' + note.body + ' ' + note.subject;
    while ((match = regex.exec(textToSearch)) !== null) {
        if (!['—', '…', '←', '→', '•', '’', '”', '“', '‘'].includes(match[0])) {
           const context = textToSearch.substring(Math.max(0, match.index - 15), Math.min(textToSearch.length, match.index + match[0].length + 15));
           found.add(`Garbled: "${match[0]}" in Context: "${context.replace(/\n/g, '\\n')}"`);
        }
    }
}

console.log(Array.from(found).join('\n'));
