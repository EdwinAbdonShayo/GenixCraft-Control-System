import json

# Load the JSON data
with open('data.json', 'r') as file:
    data = json.load(file)

# Iterate over each entry and extract entities
for idx, entry in enumerate(data):
    print(f"Entry {idx+1}:")
    text = entry["text"]
    entities = entry["entities"]
    for start, end, entity_type in entities:
        entity_value = text[start:end]
        print(f"  - {entity_type}: '{entity_value}' (Position: {start}-{end})")
    print()  # Blank line for readability
