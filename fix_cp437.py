import json

def fix_mojibake(text):
    if not isinstance(text, str):
        return text
    
    # Try to decode as if it was mistakenly read as cp437 or cp850
    try:
        # Encode the CP437 characters back to raw bytes, then decode as UTF-8
        return text.encode('cp437').decode('utf-8')
    except:
        pass
    
    try:
        return text.encode('cp850').decode('utf-8')
    except:
        pass

    try:
        return text.encode('latin1').decode('utf-8')
    except:
        pass

    return text

with open('notes.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

count = 0
for note in data:
    for key in ['title', 'body', 'subject']:
        if key in note:
            old_val = note[key]
            new_val = fix_mojibake(old_val)
            if old_val != new_val:
                count += 1
            note[key] = new_val

with open('notes.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Fixed {count} fields with CP437/CP850 mojibake.")
