'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import authService from '@/services/apiService/authService'; // điều chỉnh path nếu khác

export default function SetupPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const employeeId = searchParams.get('employeeId');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!employeeId) {
      toast.error('Missing employee ID');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.setupPassword(employeeId, password); 

      toast.success('Password set successfully!');
      router.push('/login');
      //
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Set Your Password</h2>
      <input
        type="password"
        placeholder="Enter password"
        className="w-full mb-3 p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm password"
        className="w-full mb-4 p-2 border rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Setting Password...' : 'Set Password'}
      </button>
    </div>
  );
}
