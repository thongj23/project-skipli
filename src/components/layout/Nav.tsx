'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavProps {
  user: {
    id: string;
    phoneNumber?: string;
    role?: string;
  };
}

export default function Nav({ user }: NavProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (!user?.role) return null;

  const navItems =
    user.role === 'manager'
      ? [
          { href: '/owner-dashboard', label: 'Manage Employee' },
          { href: '/owner-dashboard/task', label: 'Manage Task' },
          { href: '/conversation', label: 'Message' },
        ]
      : user.role === 'employee'
      ? [
          { href: '/employee-dashboard/tasks', label: 'My Tasks' },
          { href: '/conversation', label: 'Chat' },
        ]
      : [];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`h-screen bg-gray-100 border-r border-gray-800 p-4 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
      >
        {/* Logo */}
        <div
          className={`mb-6 flex items-center justify-center transition-opacity duration-300 ${
            collapsed ? 'opacity-0' : 'opacity-100'
          }`}
       
        >
          {/* Nếu có SVG inline thì thay thế phần img bên dưới */}
          <img
            src="/skipli-logo.png"
            alt="Skipli Logo"
            className="max-h-16 object-contain"
            draggable={false}
          />
        </div>

        {/* Placeholder gray block cũ, có thể giữ hoặc xóa */}
      

        <nav className="flex flex-col space-y-4 flex-1 overflow-auto">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-medium whitespace-nowrap transition-opacity duration-300 ${
                collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Toggle Button */}
        <button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="self-end p-2 rounded hover:bg-gray-200 transition"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </aside>
    </div>
  );
}
