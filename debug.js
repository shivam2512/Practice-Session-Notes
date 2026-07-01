const fs = require('fs');

const BATCH_RANGES = {
    'DEC_2025':    { start: '19-NOV-2025', end: '21-JAN-2026' },
    'JAN_22_2026': { start: '22-JAN-2026', end: '18-MAR-2026' },
    'FEB_19_2026': { start: '22-FEB-2026', end: '21-APR-2026' },
    'MAR_2026':    { start: '19-MAR-2026', end: '22-MAY-2026' },
    'APR_2026':    { start: '22-APR-2026', end: '25-JUN-2026' },
    'MAY_2026':    { start: '25-MAY-2026', end: '25-JUL-2026' }
};

const CROSS_BATCH_SHARING = {
    'FEB_19_2026': [{ fromBatch: 'JAN_22_2026', subject: 'LINUX' }],
    'MAR_2026':    [{ fromBatch: 'FEB_19_2026', subject: 'SQL'   }],
    'APR_2026':    [
    { fromBatch: 'MAR_2026', subject: 'LINUX' },
    { fromBatch: 'MAY_2026', subject: 'SQL'   }
    ],
    'MAY_2026':    [
    { fromBatch: 'APR_2026', subject: 'SQL'   }
    ]
};

function isNoteForBatch(note, selectedBatch) {
    if (!note || !selectedBatch) return false;
    if (note.batch === selectedBatch) return true;
    const sharing = CROSS_BATCH_SHARING[selectedBatch];
    if (sharing) {
    for (const { fromBatch, subject } of sharing) {
        if (note.batch === fromBatch && note.subject === subject) {
        return true;
        }
    }
    }
    return false;
}

let raw = fs.readFileSync('notes.json', 'utf8');
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const allNotes = JSON.parse(raw);

const filtered = allNotes.filter(n => isNoteForBatch(n, 'APR_2026'));
console.log('Notes for APR_2026:', filtered.length);
if (filtered.length > 0) {
    console.log('Sample note:', filtered[0].batch, filtered[0].subject, filtered[0].date);
}
