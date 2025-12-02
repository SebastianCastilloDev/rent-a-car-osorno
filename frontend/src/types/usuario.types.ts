export type EstadoUsuario = 'pendiente' | 'aprobado' | 'rechazado' | 'suspendido';
export type RolUsuario = 'super_admin' | 'admin' | 'usuario';

export interface Usuario {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
  activo: boolean;
  aprobadoPor?: string;
  fechaAprobacion?: string;
  motivoRechazo?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateUsuarioInput {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol?: RolUsuario;
}

export interface UpdateUsuarioInput {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  rol?: RolUsuario;
  activo?: boolean;
}

export interface AprobarUsuarioInput {
  rol?: RolUsuario;
}

export interface RechazarUsuarioInput {
  motivoRechazo: string;
}

export interface SuspenderUsuarioInput {
  motivo: string;
}

