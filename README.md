# 🌟 GenixCraft System Overview
This is an **intelligent robotic assistant system** that allows a user to control a robot arm just by **typing natural language commands** through a web-based chat interface. Here's how it all fits together:

## 🧠 1. NLP (Natural Language Processing)
- The system uses spaCy (a powerful NLP library) and TextBlob for:

    - **Spell correction** of user messages.

    - **Entity recognition**: Extracts product names and locations from user input.

    - Example: User says "*move the ketchup to table A*", and the system understands:

        - Object: `ketchup`

        - Locations: **source and destination** (e.g., `Table B` → `Table A`)

## 🤖 2. Robotic Arm Control
- A physical **6-DOF** robotic arm performs tasks like:

    - Picking up items.

    - Moving between specified locations.

    - Placing items down safely.

- This is handled via:

    - **Servo control** for joint movement.

    - **Gripper logic** for picking and releasing items.

    - A **mapping from location names** (like "`table a`") to precise arm angles.

## 👁️ 3. AI Vision (QR-Based Visual Detection)
- A camera scans the environment for **QR codes** on items.

- The robot:

    - **Detects the target item’s QR code** using computer vision (via OpenCV + pyzbar).

    - **Figures out its position** on screen.

    - **Classifies its location zone** (e.g., *top-left*, *center-right*).

    - Then **picks up the object** from there using that zone info.

## 🧮 4. Custom Visual Inverse Kinematics
- Instead of using standard IK solvers, it uses a custom system:

    - Infers where the object is from camera input.

    - Computes **servo offsets** to reach that zone.

    - Executes a **safe pickup sequence** with intermediate positions for stability.

## 🌐 5. Real-Time Communication with Flask + Socket.IO
- Backend runs on **Flask** and uses **Socket.IO** for:

    - Sending user commands to the robot.

    - Receiving live updates from the robot (status, errors, success).

    - Broadcasting updates back to the frontend chat and action logs.

## 💬 6. Interactive Web Dashboard (React + JSX)
- A simple but elegant frontend UI lets the user:

    - Chat with the bot in natural language.

    - See a live **feed of robot actions** (e.g., "*Moving ketchup*", "*Rotating to table B*").

    - Review all past messages (*chat* + *robot logs*).

## 🔗 7. Integrated Product Intelligence
- The system uses a `products.json` knowledge base:

    - Each item has a `product_id`, `name`, `expiry`, and a list of `keywords` for better recognition.

    - Helps the NLP component match vague terms like "*mayo*" to "*mayonnaise jars*".

## 🚀 Summary
System is a complete pipeline of:

    💬 Human Input → 🧠 NLP Understanding → 👁️ AI Vision → 🤖 Robot Motion → 🔁 Live Feedback

It blends **AI**, **robotics**, **vision**, **NLP**, and **web technologies** to creating a fully interactive and intelligent warehouse assistant or domestic automation bot.