import { apiClient } from '../client';
import { Usuario, CreateUsuarioInput, UpdateUsuarioInput } from '@/src/types/usuario.types';

export const usuariosApi = {
  getAll: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/usuarios');
    return response.data;
  },

  getByRut: async (rut: string): Promise<Usuario> => {
    const response = await apiClient.get<Usuario>(`/usuarios/${rut}`);
    return response.data;
  },

  create: async (data: CreateUsuarioInput): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>('/usuarios', data);
    return response.data;
  },

  update: async (rut: string, data: UpdateUsuarioInput): Promise<Usuario> => {
    const response = await apiClient.patch<Usuario>(`/usuarios/${rut}`, data);
    return response.data;
  },

  delete: async (rut: string): Promise<void> => {
    await apiClient.delete(`/usuarios/${rut}`);
  },
};

