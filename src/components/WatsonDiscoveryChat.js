import React, { useState } from 'react';
import axios from 'axios';

const WatsonDiscoveryChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m a virtual assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const sampleQueries = [
    "Find nearby location",
    "Check account balance",
    "See how I can help"
  ];

  const handleSend = async (customText) => {
    const queryText = customText || input;
    if (!queryText.trim()) return;

    const userMessage = { sender: 'user', text: queryText };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5000/ask/legal', {
        query: queryText
      });

      const answer = response.data.answer || 'Sorry, I couldn’t find a relevant answer.';
      setMessages(prev => [...prev, { sender: 'bot', text: answer }]);
    } catch (error) {
      console.error('Error fetching from Flask backend:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Error connecting to legal assistant backend.' }]);
    }

    setInput('');
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <span>Assistant</span>
        <span style={styles.restartIcon} title="Restart">⟳</span>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#D6EFFF' : '#F1F1F1'
            }}
          >
            {msg.text}
          </div>
        ))}

        {messages.length === 1 && (
          <div style={styles.suggestions}>
            {sampleQueries.map((q, i) => (
              <button key={i} onClick={() => handleSend(q)} style={styles.suggestionButton}>
                Example: {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type something..."
          rows={1}
        />
        <button onClick={() => handleSend()} style={styles.sendButton}>➤</button>
      </div>

      <div style={styles.footer}>
        <span>Built with IBM</span>&nbsp;<strong>watsonx</strong>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: 360,
    height: 560,
    border: '1px solid #ccc',
    borderRadius: 10,
    margin: '40px auto',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'IBM Plex Sans, Arial, sans-serif',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#f5f7fa',
    padding: '12px 16px',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd'
  },
  restartIcon: {
    cursor: 'pointer',
    fontSize: 18,
    color: '#0072C3',
    margin: 240
  },
  chatBox: {
    padding: 16,
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  message: {
    padding: 12,
    borderRadius: 18,
    fontSize: 14,
    maxWidth: '80%',
    lineHeight: '1.4'
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 10
  },
  suggestionButton: {
    padding: '8px 12px',
    borderRadius: 20,
    backgroundColor: '#fff',
    border: '1px solid #0072C3',
    color: '#0072C3',
    cursor: 'pointer',
    fontSize: 14
  },
  inputArea: {
    display: 'flex',
    borderTop: '1px solid #ccc'
  },
  input: {
    flex: 1,
    paddingTop: 4,
    paddingRight: 14,
    paddingBottom: 4,
    paddingLeft: 14,
    fontSize: 14,
    border: 'none',
    resize: 'none',
    overflow: 'auto',
    lineHeight: 1.4,
    fontFamily: 'inherit',
    height: 'auto',
    maxHeight: 100,
    minHeight: 40
  },
  sendButton: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    padding: '0 16px',
    color: '#0072C3',
    cursor: 'pointer'
  },
  footer: {
    fontSize: 12,
    // textAlign: 'center',
    padding: '8px',
    color: '#999',
    margin: 10
  }
};

export default WatsonDiscoveryChat;
