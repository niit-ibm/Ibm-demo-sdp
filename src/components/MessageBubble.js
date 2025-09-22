import React from 'react';

function MessageBubble({ role, text }) {
  return (
    <div className={`bubble ${role}`}>
      <p>{text}</p>
    </div>
  );
}

export default MessageBubble;
