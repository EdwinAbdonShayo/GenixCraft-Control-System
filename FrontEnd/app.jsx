function App() {
  const [messages, setMessages] = React.useState([
    { text: 'Ketchup box found in box A. Confirm to move it to box C', sender: 'bot' },
    { text: 'Move the ketchup box from box A to Box C', sender: 'bot' },
    { text: 'Yes I confirm', sender: 'user' },
  ]);

  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

  return (
    <>  
      <header>
        <h1>GenixCraft | Dashboard</h1>
      </header>
      <main>
        <div className="chat-container">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
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
        
      </main>

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

    </>
  );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
