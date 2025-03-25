function App() {
  const [messages, setMessages] = React.useState([
    { text: 'Ketchup box found in box A. Confirm to move it to box C', sender: 'bot' },
    { text: 'Move the ketchup box from box A to Box C', sender: 'bot' },
    { text: 'Yes I confirm', sender: 'user' },
  ]);

  const [input, setInput] = React.useState('');

  // 👇 Create a ref to scroll to the bottom
  const messagesEndRef = React.useRef(null);

  // 👇 Scroll when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setInput('');
    }
  };

  const [actions, setActions] = React.useState([
    { acts: 'Ketchup box found in box A. Confirm to move it to box C'},
    { acts: 'Move the ketchup box from box A to Box C'},
  ]);

  // const [input, setInput] = React.useState('');

  // // 👇 Create a ref to scroll to the bottom
  // const messagesEndRef = React.useRef(null);

  // // 👇 Scroll when messages change
  // React.useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  // const handleSend = () => {
  //   if (input.trim()) {
  //     setMessages(prev => [...prev, { text: input, sender: 'user' }]);
  //     setInput('');
  //   }
  // };

  return (
    <>  
      <header>
        <h1>GenixCraft | Dashboard</h1>
      </header>
      <main>
        <div className="action">
          <div className="action-header"><h1>Actions</h1></div>
          <div className="chat-body">
            <div className="chat-container">
              <div className="messages">
                <div style={{ marginTop: 'auto' }}></div> {/* pushes messages to bottom */}
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* for auto scroll */}
              </div>
              {/* <div className="input-area">
                <input
                  type="text"
                  value={input}
                  placeholder="Type in your commands here!"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend}>Send</button>
              </div> */}
            </div>
          </div>
        </div>

        <div className="chat">
          <div className="chat-header"><h1>Chats</h1></div>
          <div className="chat-body">
            <div className="chat-container">
              <div className="messages">
                <div style={{ marginTop: 'auto' }}></div> {/* pushes messages to bottom */}
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* for auto scroll */}
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


// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
