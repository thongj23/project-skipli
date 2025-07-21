'use client';
import { useRouter } from 'next/navigation';
import { LoginResponse } from '@/lib/api/authApi';

interface HeaderProps {
  user: LoginResponse;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Task Management</h1>
        <div className="flex items-center space-x-4">
          <span>{user.message.includes('email') ? user.message.split(' ')[1] : 'User'}</span>
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