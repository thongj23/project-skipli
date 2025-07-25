'use client';

import LoginSelector from '@/components/Login/LoginSelector';
import { AuthProvider } from '@/context/AuthContext';
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <LoginSelector />
        
      </div>
    </div>
  );
}
