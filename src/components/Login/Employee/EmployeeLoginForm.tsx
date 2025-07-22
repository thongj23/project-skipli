'use client';
import React from 'react';
import { useLogin } from '../../../hooks/useLogin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Lock, AlertCircle } from 'lucide-react';
interface EmployeeLoginFormProps {
  onBack: () => void;
}
export default function EmployeeLoginForm({ onBack }: EmployeeLoginFormProps) {
  const {
    identifier,
    setIdentifier,
    password,
    setPassword,
    loading,
    error,
    loginWithCredentials,
  } = useLogin('employee');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentials();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded border border-gray-200">
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Employee Login
        </h2>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={loading}
              placeholder="your.email@company.com"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !identifier.trim() || !password.trim()}
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-gray-500 hover:underline"
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
