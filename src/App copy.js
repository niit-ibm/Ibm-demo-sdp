import React, { useState } from 'react';
import WimbledonBot from './components/WimbledonBot';
import ScoreCard from './components/ScoreCard';

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'watsonx', content: 'Hi! Ask me anything about the Wimbledon match performance.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const botResponse = await WimbledonBot(input, newMessages);

    if (botResponse.type === 'score') {
      setMessages([...newMessages, { role: 'watsonx', type: 'score', data: botResponse.data }]);
    } else {
      setMessages([...newMessages, { role: 'watsonx', content: botResponse.content }]);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>🎾 Wimbledon Watsonx Assistant</h1>
      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              ...(msg.role === 'user' ? styles.userMsg : styles.botMsg)
            }}
          >
            {msg.type === 'score' ? (
              <ScoreCard data={msg.data} />
            ) : (
              <p><strong>{msg.role === 'user' ? 'You' : 'Watsonx'}:</strong> {msg.content}</p>
            )}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about score, aces, performance..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
    </div>
  );
}


const styles = {
  container: {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 0 10px #ccc'
  },
  header: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  chatBox: {
    minHeight: '300px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    overflowY: 'auto',
    maxHeight: '400px'
  },
  message: {
    margin: '10px 0',
    padding: '10px',
    borderRadius: '5px'
  },
  userMsg: {
    backgroundColor: '#d0e6ff',
    textAlign: 'right'
  },
  botMsg: {
    backgroundColor: '#d4f8d4',
    textAlign: 'left'
  },
  inputArea: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#0077cc',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  }
};
