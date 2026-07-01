const fs = require('fs');

let content = fs.readFileSync('notes.json', 'utf8');
let notes = JSON.parse(content);

const fixes = [
  ['\u00e2\u20ac\u201c', '\u2014'], // en-dash
  ['\u00e2\u20ac\u201d', '\u2014'], // em-dash
  ['\u00e2\u20ac\u00a6', '\u2026'], // ellipsis
  ['\u00e2\u2020\u0090', '\u2190'], // left arrow
  ['\u00e2\u2020\u2019', '\u2192'], // right arrow
  ['\u00e2\u20ac\u2122', "'"], // right single quotation mark
  ['\u00e2\u20ac\u0153', '"'], // left double quotation mark
  ['\u00e2\u20ac\u009d', '"'], // right double quotation mark
  ['â€“', '-'], // en-dash 
  ['â€”', '-'], // em-dash
  ['â€˜', "'"],
  ['â€™', "'"],
  ['â€œ', '"'],
  ['â€', '"'],
  ['Ã¯â€šÂ§', '•'], // corrupted bullet point
  ['ï‚§', '•'],
];

let replaced = 0;

function fixString(str) {
    if (typeof str !== 'string') return str;
    let newStr = str;
    for (const [garbled, correct] of fixes) {
        if (newStr.includes(garbled)) {
            newStr = newStr.split(garbled).join(correct);
            replaced++;
        }
    }
    return newStr;
}

for (let note of notes) {
    note.title = fixString(note.title);
    note.body = fixString(note.body);
    note.subject = fixString(note.subject);
}

// Function to convert date string to Date object for sorting
const monthMap = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };

function toJSDate(str) {
  if(!str) return new Date(0);
  const parts = str.split("-");
  if(parts.length !== 3) return new Date(0);
  const [d, mText, y] = parts;
  const mNum = Number(monthMap[mText.toUpperCase()]);
  return new Date(Number(y), mNum - 1, Number(d));
}

notes.sort((a, b) => {
    return toJSDate(a.date) - toJSDate(b.date);
});

// Stringify back
const finalContent = JSON.stringify(notes, null, 4);
fs.writeFileSync('notes.json', finalContent, 'utf8');

console.log(`Replaced ${replaced} occurrences of garbled text. Sorted ${notes.length} notes chronologically.`);
