'use client';

import LoginSelector from '@/app/components/LoginSelector';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <LoginSelector />
      </div>
    </div>
  );
}
