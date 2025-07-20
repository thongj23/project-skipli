import apiService from '../config/axios';
import { AxiosResponse } from 'axios';

interface CreateEmployeeResponse {
  success: boolean;
  message: string;
  employeeId?: string;
  email?: string;
  temporaryPassword?: string;
}

interface SendSetupEmailResponse {
  success: boolean;
  message: string;
  emailSent?: boolean;
}

interface EmployeeSetupResponse {
  success: boolean;
  message: string;
  token?: string;
}

interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

const employeeService = {
  createEmployee: async (
    employeeData: {
      email: string;
      fullName: string;
      phoneNumber?: string;
      department?: string;
      position?: string;
    }
  ): Promise<AxiosResponse<CreateEmployeeResponse>> => {
    try {
      const response = await apiService.post<CreateEmployeeResponse>('/owner/create-employee', employeeData);
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to create employee account');
    }
  },
  sendSetupEmail: async (email: string): Promise<AxiosResponse<SendSetupEmailResponse>> => {
    try {
      const response = await apiService.post<SendSetupEmailResponse>('/owner/send-setup-email', { email });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to send setup email');
    }
  },

  setupEmployeePassword: async (
    token: string, 
    newPassword: string
  ): Promise<AxiosResponse<EmployeeSetupResponse>> => {
    try {
      const response = await apiService.post<EmployeeSetupResponse>('/employee/setup-password', {
        token,
        password: newPassword
      });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to setup password');
    }
  },

  requestPasswordReset: async (email: string): Promise<AxiosResponse<ResetPasswordResponse>> => {
    try {
      const response = await apiService.post<ResetPasswordResponse>('/employee/request-password-reset', { email });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to request password reset');
    }
  },

  resetPassword: async (
    token: string, 
    newPassword: string
  ): Promise<AxiosResponse<ResetPasswordResponse>> => {
    try {
      const response = await apiService.post<ResetPasswordResponse>('/employee/reset-password', {
        token,
        password: newPassword
      });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to reset password');
    }
  },

  validateSetupToken: async (token: string): Promise<AxiosResponse<{
    success: boolean;
    message: string;
    email?: string;
    fullName?: string;
    isValid?: boolean;
  }>> => {
    try {
      const response = await apiService.post('/employee/validate-setup-token', { token });
      return response;
    } catch (error) {
      throw new Error((error as Error).message || 'Failed to validate setup token');
    }
  }
};

export default employeeService;