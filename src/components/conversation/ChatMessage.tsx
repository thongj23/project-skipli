'use client';
import React from 'react';

interface ChatMessageProps {
  sender: string;
  content: string;
  timestamp: string;
  isSender?: boolean; // true nếu là tin nhắn của current user
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  timestamp,
  isSender = false,
}) => {
  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`} aria-label="Chat message">
      {!isSender && (
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-2 flex-shrink-0"></div>
      )}
      <div
        className={`max-w-sm p-3 rounded-lg shadow ${
          isSender ? 'bg-blue-100 text-right' : 'bg-white'
        }`}
      >
        {!isSender && sender && (
          <div className="text-gray-500 text-sm font-medium mb-1">{sender}</div>
        )}
        <div className="text-gray-800 break-words whitespace-pre-line">{content || '[Không có nội dung]'}</div>
        <div className="text-gray-400 text-xs mt-1">{timestamp || ''}</div>
      </div>
      {isSender && (
        <div className="w-10 h-10 bg-gray-300 rounded-full ml-2 flex-shrink-0"></div>
      )}
    </div>
  );
};

export default ChatMessage;
