'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import authService from '../lib/api/authApi';
import { AxiosResponse, AxiosError } from 'axios';

type Role = 'employee' | 'owner';

interface AccessCodeResponse {
  success: boolean;
  message: string;
  phoneNumber?: string;
  otp?: string;
  accessCode?: string;
  expiresIn?: string;
}

interface ValidateResponse {
  success: boolean;
  message: string;
  user?: {
    uid: string;
    phoneNumber: string;
    role: 'owner' | 'manager' | 'employee';
  };
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
  requestCode: () => Promise<void>;
  validateCode: () => Promise<void>;
  setupAccount: () => Promise<void>;
  loginWithCredentials: () => Promise<void>;
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
        setStep(2);
        toast.success('Verification code sent to your phone.');

        if (response.data.otp) {
          setGeneratedOtp(response.data.otp);
          toast.info(`Your OTP is: ${response.data.otp}`);
          console.log('Generated OTP:', response.data.otp);
        }
      } else {
        setError(response.data.message || 'Unable to send OTP. Please check your phone number.');
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
    setError('Please enter the OTP code.');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const normalizedPhone = normalizePhoneNumber(identifier);
    const response: AxiosResponse<ValidateResponse> = await authService.validateAccessCode(
      normalizedPhone,
      accessCode
    );

    if (response.data.success && response.data.user) {
      toast.success('Login successful!');
      localStorage.setItem('phoneNumber', response.data.user.phoneNumber);
      localStorage.setItem('userRole', response.data.user.role);
      localStorage.setItem('uid', response.data.user.uid);

      router.push('/owner-dashboard');
    } else {
      setError(response.data.message || 'Invalid or expired OTP.');
    }
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;
    console.error('Validate code error:', error);
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
        localStorage.setItem('phoneNumber', normalizedPhone);
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', 'owner');
        router.push('/owner-dashboard');
      } else {
        setError(response.data.message || 'Failed to setup account. Please try again.');
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message?: string }>;
      console.error('Setup account error:', error);
      setError(error.response?.data?.message || error.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithCredentials = async (): Promise<void> => {
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

      if (response.data.success && response.data.token) {
        toast.success('Login successful!');
        localStorage.setItem('email', identifier);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', 'employee');
        router.push('/employee-dashboard');
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
  };
}
