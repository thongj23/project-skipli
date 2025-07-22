'use client';
import { useState } from 'react';
import OwnerLoginForm from './Owner/OwnerLoginForm';
import EmployeeLoginForm from './Employee/EmployeeLoginForm';
import { AuthProvider } from '@/context/AuthContext';

type UserType = 'owner' | 'employee' | null;

export default function LoginSelector() {
  const [selectedType, setSelectedType] = useState<UserType>(null);

  const handleBack = () => setSelectedType(null);

  if (selectedType === 'owner') {
    return (
      <AuthProvider role="owner">
        <OwnerLoginForm onBack={handleBack} />
      </AuthProvider>
    );
  }

  if (selectedType === 'employee') {
    return (
      <AuthProvider role="employee">
        <EmployeeLoginForm onBack={handleBack} />
      </AuthProvider>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">Select Account Type</h1>

        <button
          onClick={() => setSelectedType('owner')}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium text-lg hover:bg-blue-700 transition"
        >
          Owner Login
        </button>

        <button
          onClick={() => setSelectedType('employee')}
          className="w-full py-3 bg-green-600 text-white rounded-xl font-medium text-lg hover:bg-green-700 transition"
        >
          Employee Login
        </button>
      </div>
    </div>
  );
}
