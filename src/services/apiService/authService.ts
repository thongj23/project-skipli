import apiService from '../../config/axios';
import { AxiosResponse } from 'axios';

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

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}


const authService = {

  requestAccessCode: async (phoneNumber: string): Promise<AxiosResponse<AccessCodeResponse>> => {
    try {
      const response = await apiService.post<AccessCodeResponse>('/auth/create-access-code', { phoneNumber });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to request access code');
    }
  },


  validateAccessCode: async (phoneNumber: string, accessCode: string): Promise<AxiosResponse<ValidateResponse>> => {
    try {
      const response = await apiService.post<ValidateResponse>('/auth/validate-access-code', { phoneNumber, accessCode });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to validate access code');
    }
  },


  setupAccount: async (phoneNumber: string, username: string, password: string): Promise<AxiosResponse<SetupAccountResponse>> => {
    try {
      const response = await apiService.post<SetupAccountResponse>('/auth/setup-account', { phoneNumber, username, password });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to set up account');
    }
  },


  login: async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login-employee', { email, password });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to login');
    }
  },

  setupPassword: async (
    employeeId: string,
    password: string
  ): Promise<AxiosResponse<SetupAccountResponse>> => {
    try {
      const response = await apiService.post<SetupAccountResponse>('/auth/setup-password', {
        employeeId,
        password,
      });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to set up password');
    }
  },

  setCookie: async (token: string): Promise<void> => {
    try {
      await apiService.post('/auth/set-cookie', { token });
    } catch (error) {
      console.error('Error setting cookie:', error);
      throw new Error('Failed to set cookie.');
    }
  },
};

export default authService;
