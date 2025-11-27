import { apiClient } from '../client';
import { Vehiculo, CreateVehiculoInput, UpdateVehiculoInput } from '@/src/types/vehiculo.types';

export const vehiculosApi = {
  getAll: async (): Promise<Vehiculo[]> => {
    const response = await apiClient.get<Vehiculo[]>('/vehiculos');
    return response.data;
  },

  getByPatente: async (patente: string): Promise<Vehiculo> => {
    const response = await apiClient.get<Vehiculo>(`/vehiculos/${patente}`);
    return response.data;
  },

  create: async (data: CreateVehiculoInput): Promise<Vehiculo> => {
    const response = await apiClient.post<Vehiculo>('/vehiculos', data);
    return response.data;
  },

  update: async (patente: string, data: UpdateVehiculoInput): Promise<Vehiculo> => {
    const response = await apiClient.patch<Vehiculo>(`/vehiculos/${patente}`, data);
    return response.data;
  },

  delete: async (patente: string): Promise<void> => {
    await apiClient.delete(`/vehiculos/${patente}`);
  },
};

