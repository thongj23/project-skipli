'use client';

import Link from 'next/link';

interface NavProps {
  user: {
    id: string;
    phoneNumber?: string;
    role?: string;
  };
}

export default function Nav({ user }: NavProps) {
  if (!user?.role) return null;

  return (
    <div className="w-64 bg-gray-100 p-4">
      <div className="mb-6 h-16 bg-gray-300 rounded"></div>
      <nav className="flex flex-col space-y-4">
        {user.role === 'manager' && (
          <>
            <Link href="/owner-dashboard" className="text-blue-600 font-medium">
              Manage Employee
            </Link>
            <Link href="/owner-dashboard/task" className="text-gray-700 hover:text-blue-600">
              Manage Task
            </Link>
            <Link href="/owner-dashboard/chat" className="text-gray-700 hover:text-blue-600">
              Message
            </Link>
          </>
        )}

        {user.role === 'employee' && (
          <>
            <Link href="/employee-dashboard/tasks" className="text-gray-700 hover:text-blue-600">
              My Tasks
            </Link>
            <Link href="/employee-dashboard/chat" className="text-gray-700 hover:text-blue-600">
              Chat
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
