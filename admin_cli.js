const fs = require('fs');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const indexFile = path.join(__dirname, 'index.html');
const notesFile = path.join(__dirname, 'notes.json');

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log("=== Admin CLI ===");
    console.log("1. Add a new Batch to index.html");
    console.log("2. Add a new Note to notes.json");
    const choice = await askQuestion("Select an option (1 or 2): ");

    if (choice === '1') {
        const batchName = await askQuestion("Enter batch display name (e.g. 'Batch — Jun 2026'): ");
        const batchValue = await askQuestion("Enter batch internal value (e.g. 'JUN_2026'): ");
        
        let indexContent = fs.readFileSync(indexFile, 'utf8');
        // Insert the new option at the top of the batchSelect dropdown (descending order)
        const selectTag = '<select id="batchSelect" class="batch-select">';
        if (indexContent.includes(selectTag)) {
            const insertOption = `${selectTag}\n        <option value="${batchValue}">${batchName}</option>`;
            indexContent = indexContent.replace(selectTag, insertOption);
            fs.writeFileSync(indexFile, indexContent, 'utf8');
            console.log(`\n✅ Added Batch '${batchName}' permanently to index.html`);
        } else {
            console.log("❌ Could not find <select id=\"batchSelect\" ...> tag in index.html");
        }
        
    } else if (choice === '2') {
        const date = await askQuestion("Date (e.g. 21-JUN-2026): ");
        const session = await askQuestion("Session (Afternoon/Evening): ");
        const title = await askQuestion("Title (e.g. Practice Session): ");
        const subject = await askQuestion("Subject (SQL/LINUX): ");
        const batch = await askQuestion("Batch Internal Value (e.g. JUN_2026): ");
        const time = await askQuestion("Time (e.g. 03:00 PM): ");
        
        console.log("Enter the note body (Type 'EOF' on a new line and press enter to finish):");
        let bodyLines = [];
        
        rl.on('line', (line) => {
            if (line.trim() === 'EOF') {
                const body = bodyLines.join('\n');
                const newNote = { date, session, title, subject, body, time, batch };
                
                try {
                    let notes = JSON.parse(fs.readFileSync(notesFile, 'utf8'));
                    notes.unshift(newNote); // Add to beginning
                    fs.writeFileSync(notesFile, JSON.stringify(notes, null, 4), 'utf8');
                    console.log(`\n✅ Added new note to notes.json`);
                } catch(e) {
                    console.error("❌ Failed to parse or write notes.json", e);
                }
                
                rl.close();
            } else {
                bodyLines.push(line);
            }
        });
        return; // Don't close rl yet
    } else {
        console.log("Invalid option.");
    }
    
    rl.close();
}

main();
