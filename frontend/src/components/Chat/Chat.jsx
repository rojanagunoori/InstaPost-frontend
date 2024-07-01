import React, { useState, useEffect } from 'react';
import socket from '../../socket/socket';
import MessageList from '../MessageList/MessageList';
import './Chat.css';

const Chat = ({ userId, peerId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Register the user
    socket.emit('register', userId);

    // Listen for private messages
    socket.on('private message', ({ content, from }) => {
      setMessages(prevMessages => [...prevMessages, { content, from }]);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off('private message');
    };
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Send the message to the peer
      socket.emit('private message', { content: message, to: peerId });

      // Update the local message list
      setMessages(prevMessages => [...prevMessages, { content: message, from: userId }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <MessageList messages={messages} userId={userId} />
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button type="submit" className="chat-button">Send</button>
      </form>
    </div>
  );
};

export default Chat;
