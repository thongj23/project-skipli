'use client';
import { useRouter } from 'next/navigation';
import authApi from '@/lib/api/authApi';

export interface HeaderProps {
  user: {
    id: string;
    phoneNumber?: string;
    role?: string;
  };
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Management</h1>
        <div className="flex items-center space-x-4">
          <span>
            {user.phoneNumber
              ? `Phone: ${user.phoneNumber}`
              : user.role
              ? `Role: ${user.role}`
              : 'User'}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
