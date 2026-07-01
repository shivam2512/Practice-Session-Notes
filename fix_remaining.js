const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const fixes = [
  ['\u00e2\u20ac\u201c', '\u2014'], // en-dash
  ['\u00f0\u0178\u201d\u201d', '\u{1f514}'], // bell icon
];

let count = 0;
for (const [garbled, correct] of fixes) {
  const before = content;
  content = content.split(garbled).join(correct);
  if (content !== before) {
    count++;
  }
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Fixed ' + count + ' extra garbled chars.');
