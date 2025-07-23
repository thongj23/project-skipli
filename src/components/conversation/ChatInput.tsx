'use client';
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean; // thêm prop này
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; // chặn nếu chưa sẵn sàng
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center bg-white p-3 rounded-lg shadow">
        <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Reply message"
          className="flex-1 p-2 border-none focus:outline-none"
          disabled={disabled}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-full ml-2"
          disabled={disabled}
        >
          Send
        </button>
        <button
          type="button"
          className="text-gray-500 ml-2"
          disabled={disabled}
        >
          🎙️
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
