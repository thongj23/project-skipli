import axiosInstance from './axiosInstance';
import { AxiosResponse, isAxiosError } from 'axios';

interface ErrorResponse {
  error?: string;
  message?: string;
}

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
  accessToken?: string;
  accountExists?: boolean;
}

interface SetupAccountResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

const authApi = {
  requestAccessCode: async (phoneNumber: string): Promise<AxiosResponse<AccessCodeResponse>> => {
    try {
      return await axiosInstance.post<AccessCodeResponse>('/auth/create-access-code', { phoneNumber });
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to request access code');
      }
      throw new Error('Unknown error occurred');
    }
  },

  validateAccessCode: async (phoneNumber: string, accessCode: string): Promise<AxiosResponse<ValidateResponse>> => {
    try {
      return await axiosInstance.post<ValidateResponse>('/auth/validate-access-code', { phoneNumber, accessCode });
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to validate access code');
      }
      throw new Error('Unknown error occurred');
    }
  },

  setupAccount: async (phoneNumber: string, username: string, password: string): Promise<AxiosResponse<SetupAccountResponse>> => {
    try {
      return await axiosInstance.post<SetupAccountResponse>('/auth/setup-account', { phoneNumber, username, password });
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to set up account');
      }
      throw new Error('Unknown error occurred');
    }
  },

  login: async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login-employee', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        await authApi.setCookie(response.data.token);
      }
      return response;
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to login');
      }
      throw new Error('Unknown error occurred');
    }
  },

  setupPassword: async (employeeId: string, password: string): Promise<AxiosResponse<SetupAccountResponse>> => {
    try {
      return await axiosInstance.post<SetupAccountResponse>('/auth/setup-password', { employeeId, password });
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to set up password');
      }
      throw new Error('Unknown error occurred');
    }
  },

  setCookie: async (token: string): Promise<void> => {
    try {
      await axiosInstance.post('/auth/set-cookie', { token });
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to set cookie');
      }
      throw new Error('Unknown error occurred');
    }
  },

  getCurrentUser: async (): Promise<AxiosResponse<LoginResponse>> => {
    try {
      return await axiosInstance.get<LoginResponse>('/auth/me');
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch current user');
      }
      throw new Error('Unknown error occurred');
    }
  },
};

export default authApi;
