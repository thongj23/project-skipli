'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const requestCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/createAccessCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      if (res.ok) {
        setStep(2);
        toast.success('Verification code sent via SMS!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send code. Please check your phone number.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/validateAccessCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, accessCode }),
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid verification code.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {step === 1 ? (
          <>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mb-4"
              disabled={loading}
              placeholder="Phone number"
              required
            />
            <Button
              onClick={requestCode}
              disabled={loading || !phoneNumber}
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Sending...' : 'Send Code'}
            </Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full mb-4"
              disabled={loading}
              placeholder="Access code"
              required
            />
            <Button
              onClick={validateCode}
              disabled={loading || !accessCode}
              className="w-full mb-4 bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
