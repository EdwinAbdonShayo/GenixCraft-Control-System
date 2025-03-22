function App() {
    const [count, setCount] = React.useState(0);
  
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>GenixCraft - Control System!</h1>
      </div>
    );
  }
  
  // Render App
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
  