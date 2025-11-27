import { apiClient } from '../client';
import { Multa, CreateMultaInput, UpdateMultaInput } from '@/src/types/multa.types';

export const multasApi = {
  getAll: async (patente?: string): Promise<Multa[]> => {
    const params = patente ? { patente } : {};
    const response = await apiClient.get<Multa[]>('/multas', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Multa> => {
    const response = await apiClient.get<Multa>(`/multas/${id}`);
    return response.data;
  },

  create: async (data: CreateMultaInput): Promise<Multa> => {
    const response = await apiClient.post<Multa>('/multas', data);
    return response.data;
  },

  update: async (id: number, data: UpdateMultaInput): Promise<Multa> => {
    const response = await apiClient.patch<Multa>(`/multas/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/multas/${id}`);
  },
};

