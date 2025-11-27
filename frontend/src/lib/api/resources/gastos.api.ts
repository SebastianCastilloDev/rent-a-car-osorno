import { apiClient } from '../client';
import { Gasto, CreateGastoInput, UpdateGastoInput } from '@/src/types/gasto.types';

export const gastosApi = {
  getAll: async (patente?: string): Promise<Gasto[]> => {
    const params = patente ? { patente } : {};
    const response = await apiClient.get<Gasto[]>('/gastos', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Gasto> => {
    const response = await apiClient.get<Gasto>(`/gastos/${id}`);
    return response.data;
  },

  create: async (data: CreateGastoInput): Promise<Gasto> => {
    const response = await apiClient.post<Gasto>('/gastos', data);
    return response.data;
  },

  update: async (id: number, data: UpdateGastoInput): Promise<Gasto> => {
    const response = await apiClient.patch<Gasto>(`/gastos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/gastos/${id}`);
  },
};


