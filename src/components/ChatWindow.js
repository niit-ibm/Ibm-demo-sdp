import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { getAIResponse } from '../data/mockData';

function ChatWindow() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMsg = { role: 'user', text: input };
    const botReply = getAIResponse(input); // Watsonx later
    const newBotMsg = { role: 'bot', text: botReply };

    setMessages(prev => [...prev, newUserMsg, newBotMsg]);
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} role={msg.role} text={msg.text} />
        ))}
      </div>

      <div className="input-area">
        <input
          placeholder="Ask about the match, win prediction..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={handleSend}>Ask</button>
      </div>
    </div>
  );
}

export default ChatWindow;
