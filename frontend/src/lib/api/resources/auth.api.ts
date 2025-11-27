import { apiClient } from '../client';
import { LoginInput, LoginResponse } from '@/src/types/auth.types';

export const authApi = {
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },
};

