'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import authService from '../lib/api/authApi';
import { AxiosResponse, AxiosError } from 'axios';
import { useUserStore } from '@/stores/userStore';
import { User } from '@/types/user';

type Role = 'employee' | 'owner';

interface AccessCodeResponse {
  success: boolean;
  message: string;
  phoneNumber?: string;
  otp?: string;
  accessCode?: string;
  expiresIn?: string;
}

interface LoginState {
  identifier: string;
  setIdentifier: (value: string) => void;
  accessCode: string;
  setAccessCode: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  setStep: (value: number) => void;
  step: number;
  loading: boolean;
  error: string;
  generatedOtp: string;
  user?: User;
  requestCode: () => Promise<void>;
  setUser: (user: LoginState['user']) => void;
  validateCode: () => Promise<void>;
  setupAccount: () => Promise<void>;
  loginWithCredentials: () => Promise<void>;
}

interface ValidateResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
  accountExists?: boolean;
}

interface SetupAccountResponse {
  success: boolean;
  message: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

const normalizePhoneNumber = (phone: string): string => {
  const trimmed = phone.trim();
  if (trimmed.startsWith('0')) return '+84' + trimmed.slice(1);
  if (trimmed.startsWith('+84')) return trimmed;
  return '+84' + trimmed;
};

export function useLogin(role: Role): LoginState {
  const [identifier, setIdentifier] = useState<string>('');
  const [accessCode, setAccessCode] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [step, setStep] = useState<number>(role === 'owner' ? 1 : 4);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [user, setUser] = useState<LoginState['user']>();

  const router = useRouter();

  const requestCode = async (): Promise<void> => {
    if (role !== 'owner') return;

    if (!identifier.trim()) {
      setError('Please enter your phone number.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedOtp('');

    try {
      const normalizedPhone = normalizePhoneNumber(identifier);
      const response: AxiosResponse<AccessCodeResponse> = await authService.requestAccessCode(normalizedPhone);

      if (response.data.success) {
        if (response.data.accessCode) {
          setGeneratedOtp(response.data.accessCode);
          setAccessCode(response.data.accessCode);
          toast.info(`Your OTP is: ${response.data.accessCode}`);
        }

        setStep(2);
        toast.success('Verification code sent to your phone.');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Request code error:', error);
      setError(error.response?.data?.message || error.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateCode = async (): Promise<void> => {
    if (role !== 'owner') return;

    if (!accessCode.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhoneNumber(identifier);
      const response: AxiosResponse<ValidateResponse> = await authService.validateAccessCode(normalizedPhone, accessCode);

      if (response.data.success && response.data.user) {
        useUserStore.getState().setUser(response.data.user);
        setUser(response.data.user);
        toast.success('Login successful!');
        router.push('/owner-dashboard/employee');
      } else {
        setError(response.data.message || 'OTP verification failed.');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('OTP verification error:', error);
      setError(error.response?.data?.message || error.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setupAccount = async (): Promise<void> => {
    if (role !== 'owner') return;

    if (!username.trim()) {
      setError('Please enter a username.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const normalizedPhone = normalizePhoneNumber(identifier);
      const response: AxiosResponse<SetupAccountResponse> = await authService.setupAccount(normalizedPhone, username, password);

      if (response.data.success) {
        toast.success('Account setup successfully!');
        router.push('/owner-dashboard');
      } else {
        setError(response.data.message || 'Account setup failed. Please try again.');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Account setup error:', error);
      setError(error.response?.data?.message || error.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (): Promise<void> => {
    const setUser = useUserStore.getState().setUser;

    if (role !== 'employee') return;

    if (!identifier.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      setError('Invalid email format.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response: AxiosResponse<LoginResponse> = await authService.login(identifier, password);

      if (response.data.success && response.data.token && response.data.user) {
        console.log('[Login] Setting user in Zustand:', response.data.user);
        setUser(response.data.user);
        toast.success('Login successful!');
        window.location.href = '/employee-dashboard/tasks';
      } else {
        setError(response.data.message || 'Incorrect email or password.');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes('404') || errorMessage.includes('not found')) {
        setError('Account not found. Please contact your manager to create an account.');
      } else if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
        setError('Incorrect email or password.');
      } else {
        setError('Login failed. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    identifier,
    setIdentifier,
    accessCode,
    setAccessCode,
    username,
    setUsername,
    password,
    setPassword,
    setStep,
    step,
    loading,
    error,
    generatedOtp,
    requestCode,
    validateCode,
    setupAccount,
    loginWithCredentials,
    user,
    setUser,
  };
}
