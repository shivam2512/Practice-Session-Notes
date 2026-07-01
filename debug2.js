const fs = require('fs');

const BATCH_RANGES = {
    'APR_2026':    { start: '22-APR-2026', end: '25-JUN-2026' }
};

const CROSS_BATCH_SHARING = {
    'APR_2026':    [
    { fromBatch: 'MAR_2026', subject: 'LINUX' },
    { fromBatch: 'MAY_2026', subject: 'SQL'   }
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

const session = 'Afternoon';
const selectedBatch = 'APR_2026';

const linuxNotes = allNotes.filter(
    n => n.session === session && n.subject === "LINUX" && isNoteForBatch(n, selectedBatch)
);

console.log('Afternoon Linux Notes:', linuxNotes.length);
