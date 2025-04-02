from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import spacy
from textblob import TextBlob
from flask_socketio import SocketIO, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")
print("✅ Flask app initialized.")

nlp = spacy.load("../NLP/GC_model3.0")
print("✅ spaCy model loaded successfully.")

# In-memory state tracking
waiting_for_confirmation = {
    "active": False,
    "last_entities": []
}

# Setup DB
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


# In-memory confirmation state
waiting_for_confirmation = {
    "active": False,
    "last_entities": []
}

# Confirmation/cancellation keywords
# confirmation_keywords = ["yes", "y", "confirm", "confirmed", "okay", "ok", "sure"]
# cancellation_keywords = ["no", "n", "cancel", "not sure", "wrong", "nope"]

@app.route('/send-command', methods=['POST'])
def send_command():
    global waiting_for_confirmation

    try:
        data = request.get_json()
        user_message = data.get('message').strip()
        print(f"📥 User said: {user_message}")

        # Utilizing textblob for spell correction

        blob = TextBlob(user_message)
        corrected_message = str(blob.correct())
        print(f"📝 Corrected message: {corrected_message}")

        conn = sqlite3.connect("commands.db")
        cursor = conn.cursor()
        cursor.execute("INSERT INTO messages (text, sender) VALUES (?, ?)", (corrected_message, "user"))
        conn.commit()

        # Run spaCy NER on every message
        doc = nlp(corrected_message)
        entities = [{"text": ent.text, "label": ent.label_} for ent in doc.ents]
        print("🔍 Entities extracted:", entities)

        # Handle confirmation or cancellation regardless of message content
        if waiting_for_confirmation["active"]:
            entity_labels = [e["label"] for e in entities]

            if "CONFIRMATION" in entity_labels:
                response_text = "✅ Confirmation received. Proceeding with the action."

                command_str = " ".join([e["text"] for e in waiting_for_confirmation["last_entities"]])
                socketio.emit('robot_command', {"command": command_str})

                waiting_for_confirmation = {"active": False, "last_entities": []}

            elif "CANCELLATION" in entity_labels:
                response_text = "❌ Action canceled. Please send a new command."
                waiting_for_confirmation = {"active": False, "last_entities": []}

            else:
                response_text = "❓ Awaiting confirmation. Please reply accordingly (e.g., 'yes', 'no')."

        else:
            if not entities:
                response_text = "I couldn't detect any useful info. Please try rephrasing the command."
            else:
                waiting_for_confirmation = {"active": True, "last_entities": entities}

                object_ = next((e["text"] for e in entities if e["label"] == "OBJECT"), None)
                dest = next((e["text"] for e in entities if e["label"] == "LOCATION"), None)
                time_ = next((e["text"] for e in entities if e["label"] == "TIME"), None)

                parts = []
                if object_:
                    parts.append(f"move {object_}")
                if dest:
                    parts.append(f"to {dest}")
                if time_:
                    parts.append(f"at {time_}")
                sentence = " ".join(parts)
                response_text = f"🧠 Confirm to {sentence}"

        # Save bot response
        cursor.execute("INSERT INTO messages (text, sender) VALUES (?, ?)", (response_text, "bot"))
        conn.commit()
        conn.close()

        return jsonify({"response": response_text})

    except Exception as e:
        print("❌ Error in /send-command:", e)
        return jsonify({"error": "Something went wrong"}), 500



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

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
