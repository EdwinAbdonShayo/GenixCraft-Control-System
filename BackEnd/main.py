from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import spacy

app = Flask(__name__)
CORS(app)

# Load spaCy model
try:
    nlp = spacy.load("../NLP/ner_GC_model")  # adjust this path to match your project
    print("✅ spaCy model loaded successfully.")
except Exception as e:
    print("❌ Failed to load spaCy model:", e)
    nlp = None  # fallback to prevent server crash

# Initialize DB
def init_db():
    conn = sqlite3.connect("commands.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            sender TEXT
        )
    """)
    conn.commit()
    conn.close()
    print("✅ Database initialized.")

init_db()

# POST /send-command
@app.route('/send-command', methods=['POST'])
def send_command():
    try:
        data = request.get_json()
        user_message = data.get('message')

        print(f"📥 Received from user: {user_message}")

        # Save user message
        conn = sqlite3.connect("commands.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO messages (text, sender) VALUES (?, ?)", (user_message, "user"))
        conn.commit()

        # Run spaCy NER
        if not nlp:
            return jsonify({"error": "spaCy model not loaded"}), 500

        doc = nlp(user_message)
        entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        print("🔍 Entities extracted:", entities)

        # Build bot response
        if entities:
            response_text = ', '.join([f"{ent['text']} - {ent['label']}" for ent in entities])
        else:
            response_text = "No entities found."

        # Save bot message
        cursor.execute("INSERT INTO messages (text, sender) VALUES (?, ?)", (response_text, "bot"))
        conn.commit()
        conn.close()

        return jsonify({"entities": entities})

    except Exception as e:
        print("❌ Error in /send-command:", e)
        return jsonify({"error": "Something went wrong"}), 500

# GET /get-messages
@app.route('/get-messages', methods=['GET'])
def get_messages():
    try:
        conn = sqlite3.connect("commands.db")
        cursor = conn.cursor()
        cursor.execute("SELECT text, sender FROM messages ORDER BY id ASC")
        rows = cursor.fetchall()
        conn.close()

        return jsonify([{"text": row[0], "sender": row[1]} for row in rows])

    except Exception as e:
        print("❌ Error fetching messages:", e)
        return jsonify([]), 500

# Run Flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)
