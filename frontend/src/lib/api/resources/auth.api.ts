import { apiClient } from '../client';
import {
  LoginInput,
  LoginResponse,
  RegisterInput,
  RegisterResponse,
} from '@/src/types/auth.types';

export const authApi = {
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterInput): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      data,
    );
    return response.data;
  },
};

