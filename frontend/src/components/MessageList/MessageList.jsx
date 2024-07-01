import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, userId }) => {
  return (
    <ul className="message-list">
      {messages.map((msg, index) => (
        <li
          key={index}
          className={`message-item ${msg.from === userId ? 'message-own' : 'message-peer'}`}
        >
          <strong>{msg.from}:</strong> {msg.content}
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
