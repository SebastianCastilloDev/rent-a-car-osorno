import { apiClient } from '../client';
import { 
  Usuario, 
  CreateUsuarioInput, 
  UpdateUsuarioInput,
  EstadoUsuario,
  AprobarUsuarioInput,
  RechazarUsuarioInput,
  SuspenderUsuarioInput
} from '@/src/types/usuario.types';

export const usuariosApi = {
  obtenerTodos: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/usuarios');
    return response.data;
  },

  obtenerPorRut: async (rut: string): Promise<Usuario> => {
    const response = await apiClient.get<Usuario>(`/usuarios/${rut}`);
    return response.data;
  },

  obtenerPendientes: async (): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>('/usuarios/pendientes/aprobacion');
    return response.data;
  },

  obtenerPorEstado: async (estado: EstadoUsuario): Promise<Usuario[]> => {
    const response = await apiClient.get<Usuario[]>(`/usuarios/estado/${estado}`);
    return response.data;
  },

  crear: async (data: CreateUsuarioInput): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>('/usuarios', data);
    return response.data;
  },

  actualizar: async (rut: string, data: UpdateUsuarioInput): Promise<Usuario> => {
    const response = await apiClient.patch<Usuario>(`/usuarios/${rut}`, data);
    return response.data;
  },

  eliminar: async (rut: string): Promise<void> => {
    await apiClient.delete(`/usuarios/${rut}`);
  },

  aprobar: async (rut: string, data: AprobarUsuarioInput = {}): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>(`/usuarios/${rut}/aprobar`, data);
    return response.data;
  },

  rechazar: async (rut: string, data: RechazarUsuarioInput): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>(`/usuarios/${rut}/rechazar`, data);
    return response.data;
  },

  suspender: async (rut: string, data: SuspenderUsuarioInput): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>(`/usuarios/${rut}/suspender`, data);
    return response.data;
  },

  reactivar: async (rut: string): Promise<Usuario> => {
    const response = await apiClient.post<Usuario>(`/usuarios/${rut}/reactivar`);
    return response.data;
  },

  // Mantener nombres antiguos por compatibilidad
  getAll: async (): Promise<Usuario[]> => {
    return usuariosApi.obtenerTodos();
  },

  getByRut: async (rut: string): Promise<Usuario> => {
    return usuariosApi.obtenerPorRut(rut);
  },

  create: async (data: CreateUsuarioInput): Promise<Usuario> => {
    return usuariosApi.crear(data);
  },

  update: async (rut: string, data: UpdateUsuarioInput): Promise<Usuario> => {
    return usuariosApi.actualizar(rut, data);
  },

  delete: async (rut: string): Promise<void> => {
    return usuariosApi.eliminar(rut);
  },
};

