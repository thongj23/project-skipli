'use client';
import React from 'react';
import { useEffect,useState } from 'react';
import { useLogin } from '../../../hooks/useLogin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthContext } from '@/context/AuthContext';
interface OwnerLoginFormProps {
  onBack: () => void;
}

export default function OwnerLoginForm({ onBack }: OwnerLoginFormProps) {
  const {
    identifier,
    setIdentifier,
    accessCode,
    setAccessCode,
    step,
    setStep,
    loading,
    error,
    generatedOtp,
    requestCode,
    validateCode,
  } = useAuthContext();

useEffect(() => {
  console.log('accessCode updated:', accessCode);
}, [accessCode]);
  const [copied, setCopied] = useState(false);
  const phone = '0776145916';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm space-y-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          ← Back
        </Button>

        <div className="text-center">
          <h2 className="text-xl font-semibold">Owner Login</h2>
          <p className="text-sm text-gray-600">Use your phone number</p>
      <div className="flex items-center space-x-2 text-center">
      <p className=" text-sm text-gray-600 select-text">Default: {phone}</p>
      <button
        onClick={handleCopy}
        className="text-blue-500 text-sm hover:underline"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Input
              type="tel"
              placeholder="Phone number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
            />
            <Button
              onClick={requestCode}
              disabled={loading || !identifier.trim()}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {generatedOtp && (
              <div className="text-center text-sm text-gray-500">
                Test OTP: <span className="font-bold">{generatedOtp}</span>
              </div>
            )}
            <Input
              type="text"
              placeholder="Enter OTP"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              maxLength={6}
              disabled={loading}
              className="text-center"
            />

            <Button
              onClick={validateCode}
              disabled={loading || !accessCode.trim()}
              className="w-full"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setAccessCode('');
                setStep(1);
              }}
              disabled={loading}
              className="w-full"
            >
              Change Phone Number
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
