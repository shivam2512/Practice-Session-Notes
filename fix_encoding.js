const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

// Each garbled sequence -> correct Unicode character
// These are Windows-1252 misinterpretations of UTF-8 emoji/special chars,
// re-saved as UTF-8 (classic mojibake).
const fixes = [
  // em dash — (U+2014): E2 80 94 -> CP1252: â € "
  ['\u00e2\u20ac\u201d', '\u2014'],

  // ellipsis … (U+2026): E2 80 A6 -> CP1252: â € ¦
  ['\u00e2\u20ac\u00a6', '\u2026'],

  // left arrow ← (U+2190): E2 86 90 -> CP1252: â † \x90
  ['\u00e2\u2020\u0090', '\u2190'],

  // right arrow → (U+2192): E2 86 92 -> CP1252: â † '
  ['\u00e2\u2020\u2019', '\u2192'],

  // stopwatch ⏱ (U+23F1): E2 8F B1 -> CP1252: â \x8f ±
  ['\u00e2\u008f\u00b1', '\u23f1'],

  // 🌟 (U+1F31F): F0 9F 8C 9F -> CP1252: ð Ÿ Œ Ÿ
  ['\u00f0\u0178\u0152\u0178', '\u{1f31f}'],

  // 🚀 (U+1F680): F0 9F 9A 80 -> CP1252: ð Ÿ š €
  ['\u00f0\u0178\u0161\u20ac', '\u{1f680}'],

  // 💼 (U+1F4BC): F0 9F 92 BC -> CP1252: ð Ÿ ' ¼
  ['\u00f0\u0178\u2019\u00bc', '\u{1f4bc}'],

  // 🔥 (U+1F525): F0 9F 94 A5 -> CP1252: ð Ÿ " ¥
  ['\u00f0\u0178\u201d\u00a5', '\u{1f525}'],

  // 📔 (U+1F4D4): F0 9F 93 94 -> CP1252: ð Ÿ " "
  ['\u00f0\u0178\u201c\u201d', '\u{1f4d4}'],

  // 📝 (U+1F4DD): F0 9F 93 9D -> CP1252: ð Ÿ " \x9d
  ['\u00f0\u0178\u201c\u009d', '\u{1f4dd}'],

  // 💻 (U+1F4BB): F0 9F 92 BB -> CP1252: ð Ÿ ' »
  ['\u00f0\u0178\u2019\u00bb', '\u{1f4bb}'],

  // 🚫 (U+1F6AB): F0 9F 9A AB -> CP1252: ð Ÿ š «
  ['\u00f0\u0178\u0161\u00ab', '\u{1f6ab}'],
];

let count = 0;
for (const [garbled, correct] of fixes) {
  const before = content;
  content = content.split(garbled).join(correct);
  const replaced = (before.length - content.length) / (garbled.length - correct.length);
  if (replaced > 0) {
    console.log(`Fixed ${replaced}x: ${JSON.stringify(garbled)} -> ${correct}`);
    count++;
  }
}

fs.writeFileSync('index.html', content, 'utf8');
console.log(`\nDone! Fixed ${count} types of garbled characters.`);
