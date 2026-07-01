import json

def fix_mojibake(text):
    if not isinstance(text, str):
        return text
    
    # We will try to decode using 'latin-1' and then 'utf-8'
    # Sometimes it requires doing it twice if it's triple-encoded.
    try:
        # First attempt (double-encoded)
        decoded1 = text.encode('latin-1').decode('utf-8')
        # Second attempt (triple-encoded)
        try:
            decoded2 = decoded1.encode('latin-1').decode('utf-8')
            return decoded2
        except:
            return decoded1
    except:
        return text

with open('notes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for note in data:
    note['title'] = fix_mojibake(note.get('title', ''))
    note['body'] = fix_mojibake(note.get('body', ''))
    note['subject'] = fix_mojibake(note.get('subject', ''))

with open('notes_fixed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Notes fixed and saved to notes_fixed.json")
