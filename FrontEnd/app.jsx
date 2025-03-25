function App() {
  // Step 1: Fallback messages for first load
  const [messages, setMessages] = React.useState([
    { text: 'Ketchup box found in box A. Confirm to move it to box C', sender: 'bot' },
    { text: 'Move the ketchup box from box A to Box C', sender: 'bot' },
    { text: 'Yes I confirm', sender: 'user' },
  ]);

  const [input, setInput] = React.useState('');
  const messagesEndRef = React.useRef(null);

  // Step 2: Scroll chat to bottom when messages update
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Step 3: Load messages from backend
  const loadMessages = async () => {
    try {
      const res = await fetch('http://localhost:5000/get-messages');
      const data = await res.json();
      console.log("Fetched from backend:", data); // DEBUG!
      if (Array.isArray(data) && data.length > 0) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // Step 4: Load on first mount
  React.useEffect(() => {
    loadMessages();
  }, []);

  const [actions, setActions] = React.useState([
    { acts: 'Moving Black Peppers from box A to Box C' },
    { acts: 'Moving Ketchup box to table C' },
  ]);
  
  const [act, setAct] = React.useState('');
  const actionsEndRef = React.useRef(null);
  
  React.useEffect(() => {
    actionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [actions]);
  
  const handleNewActions = () => {
    if (act.trim()) {
      setActions(prev => [...prev, { acts: act }]);
      setAct('');
    }
  };
  

  // Step 5: Handle user input
  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: 'user' };
      setMessages(prev => [...prev, userMessage]);

      try {
        const res = await fetch('http://localhost:5000/send-command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input })
        });

        const botResponse = await res.json();

        if (botResponse.entities?.length > 0) {
          const feedback = botResponse.entities
            .map(ent => `${ent.text} [${ent.label}]`)
            .join(', ');
          const botMessage = { text: `Extracted: ${feedback}`, sender: 'bot' };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const botMessage = { text: `No entities found.`, sender: 'bot' };
          setMessages(prev => [...prev, botMessage]);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        const errorMessage = { text: `Server error.`, sender: 'bot' };
        setMessages(prev => [...prev, errorMessage]);
      }

      setInput('');
    }
  };

  return (
    <>
      <header>
        <h1>GenixCraft | Dashboard</h1>
      </header>

      <main>

        <div className="act">
          <div className="act-header"><h1>Actions</h1></div>
          <div className="act-body">
            <div className="act-container">
              <div className="actions">
                <div style={{ marginTop: 'auto' }}></div>
                {actions.map((msg, index) => (
                  <div key={index} className={`action`}>
                    {msg.acts}
                  </div>
                ))}
                <div ref={actionsEndRef} />
              </div>
              <div style={{ marginTop: '10px' }}>
                {/* <input
                  type="text"
                  value={act}
                  placeholder="New Action"
                  onChange={(e) => setAct(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNewActions()}
                /> */}
                {/* <button onClick={handleNewActions}>Add Action</button> */}
              </div>
            </div>
          </div>
        </div>

        <div className="chat">
          <div className="chat-header"><h1>Chats</h1></div>

          <div className="chat-body">
            <div className="chat-container">
              <div className="messages">
                <div style={{ marginTop: 'auto' }}></div>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="input-area">
                <input
                  type="text"
                  value={input}
                  placeholder="Type in your commands here!"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </div>
          </div>
        </div>

        <svg width="0" height="0">
          <defs>
            <filter id="roundedCorners" x="0" y="0" width="100%" height="100%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix in="blur" type="matrix"
                values="1 0 0 0 0  
                        0 1 0 0 0  
                        0 0 1 0 0  
                        0 0 0 20 -10" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
          </defs>
        </svg>
      </main>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
