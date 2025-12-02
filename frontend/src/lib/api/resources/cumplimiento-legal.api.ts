import { apiClient } from '../client';
import {
  RevisionTecnica,
  CreateRevisionTecnicaInput,
  UpdateRevisionTecnicaInput,
  PermisoCirculacion,
  CreatePermisoCirculacionInput,
  UpdatePermisoCirculacionInput,
} from '@/src/types/cumplimiento-legal.types';

export const cumplimientoLegalApi = {
  // Revisiones Técnicas
  revisionesTecnicas: {
    getAll: async (): Promise<RevisionTecnica[]> => {
      const response = await apiClient.get<RevisionTecnica[]>('/cumplimiento-legal/revisiones-tecnicas');
      return response.data;
    },

    getById: async (id: number): Promise<RevisionTecnica> => {
      const response = await apiClient.get<RevisionTecnica>(`/cumplimiento-legal/revisiones-tecnicas/${id}`);
      return response.data;
    },

    create: async (data: CreateRevisionTecnicaInput): Promise<RevisionTecnica> => {
      const response = await apiClient.post<RevisionTecnica>('/cumplimiento-legal/revisiones-tecnicas', data);
      return response.data;
    },

    update: async (id: number, data: UpdateRevisionTecnicaInput): Promise<RevisionTecnica> => {
      const response = await apiClient.patch<RevisionTecnica>(`/cumplimiento-legal/revisiones-tecnicas/${id}`, data);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/cumplimiento-legal/revisiones-tecnicas/${id}`);
    },
  },

  // Permisos de Circulación
  permisosCirculacion: {
    getAll: async (): Promise<PermisoCirculacion[]> => {
      const response = await apiClient.get<PermisoCirculacion[]>('/cumplimiento-legal/permisos-circulacion');
      return response.data;
    },

    getById: async (id: number): Promise<PermisoCirculacion> => {
      const response = await apiClient.get<PermisoCirculacion>(`/cumplimiento-legal/permisos-circulacion/${id}`);
      return response.data;
    },

    create: async (data: CreatePermisoCirculacionInput): Promise<PermisoCirculacion> => {
      const response = await apiClient.post<PermisoCirculacion>('/cumplimiento-legal/permisos-circulacion', data);
      return response.data;
    },

    update: async (id: number, data: UpdatePermisoCirculacionInput): Promise<PermisoCirculacion> => {
      const response = await apiClient.patch<PermisoCirculacion>(`/cumplimiento-legal/permisos-circulacion/${id}`, data);
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/cumplimiento-legal/permisos-circulacion/${id}`);
    },
  },
};


