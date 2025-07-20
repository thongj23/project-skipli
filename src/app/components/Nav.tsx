'use client';

import Link from 'next/link';

export default function Nav() {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <div className="mb-6 h-16 bg-gray-300 rounded"></div>
      <nav className="flex flex-col space-y-4">
        <Link href="/owner-dashboard" className="text-blue-600 font-medium">
          Manage Employee
        </Link>
        <Link href="#" className="text-gray-700 hover:text-blue-600">Manage Task</Link>
        <Link href="#" className="text-gray-700 hover:text-blue-600">Message</Link>
      </nav>
    </div>
  );
}
