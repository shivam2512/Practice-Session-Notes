const fs = require('fs');

// Read clean original file
let buf = fs.readFileSync('orig.json');
let str = buf.toString('utf16le');
if (str.startsWith('\uFEFF')) str = str.slice(1);
const cleanNotes = JSON.parse(str);

// Read current corrupted but correctly batched file
const curNotes = require('./notes.json');

// Map current notes to clean content
const fixedNotes = curNotes.map(cur => {
    // Find the original clean note
    const clean = cleanNotes.find(c => 
        c.date === cur.date && 
        c.session === cur.session && 
        c.subject === cur.subject
    );
    
    if (clean) {
        return {
            ...cur,
            title: clean.title,
            body: clean.body,
            subject: clean.subject
        };
    } else {
        console.error("Warning: Could not find clean version for", cur.date, cur.title);
        return cur;
    }
});

// The previous fix_notes_json.js also sorted them chronologically.
// Let's ensure they are perfectly sorted just in case.
const monthMap = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };
function toJSDate(str) {
  if(!str) return new Date(0);
  const parts = str.split("-");
  if(parts.length !== 3) return new Date(0);
  const [d, mText, y] = parts;
  const mNum = Number(monthMap[mText.toUpperCase()]);
  return new Date(Number(y), mNum - 1, Number(d));
}

fixedNotes.sort((a, b) => {
    return toJSDate(a.date) - toJSDate(b.date);
});

// Write it back as UTF-8
fs.writeFileSync('notes.json', JSON.stringify(fixedNotes, null, 4), 'utf8');
console.log('Successfully merged clean content into notes.json and sorted chronologically!');
