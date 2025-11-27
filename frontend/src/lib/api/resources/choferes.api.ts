import { apiClient } from '../client';
import { Chofer, CreateChoferInput, UpdateChoferInput } from '@/src/types/chofer.types';

export const choferesApi = {
  getAll: async (): Promise<Chofer[]> => {
    const response = await apiClient.get<Chofer[]>('/choferes');
    return response.data;
  },

  getByRut: async (rut: string): Promise<Chofer> => {
    const response = await apiClient.get<Chofer>(`/choferes/${rut}`);
    return response.data;
  },

  create: async (data: CreateChoferInput): Promise<Chofer> => {
    const response = await apiClient.post<Chofer>('/choferes', data);
    return response.data;
  },

  update: async (rut: string, data: UpdateChoferInput): Promise<Chofer> => {
    const response = await apiClient.patch<Chofer>(`/choferes/${rut}`, data);
    return response.data;
  },

  delete: async (rut: string): Promise<void> => {
    await apiClient.delete(`/choferes/${rut}`);
  },
};

