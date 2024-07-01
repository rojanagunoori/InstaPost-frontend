// Notification.js
import React from 'react';

const Notification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-md shadow-lg">
            <p>{message}</p>
            <button
                onClick={onClose}
                className="absolute top-1 right-1 text-white"
            >
                &times;
            </button>
        </div>
    );
};

export default Notification;
