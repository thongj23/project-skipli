'use client';

import React from 'react';

interface ChatTabsProps {
  users: {
    id: string;
    name: string;
  }[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
}

export default function ChatTabs({
  users,
  selectedUserId,
  onSelectUser,
}: ChatTabsProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-2">Danh sách người dùng</h2>
      {users.map((user) => (
        <button
          key={user.id}
          onClick={() => onSelectUser(user.id)}
          className={`w-full text-left px-4 py-2 rounded-md ${
            selectedUserId === user.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {user.name}
        </button>
      ))}
    </div>
  );
}
