export interface Usuario {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'usuario';
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateUsuarioInput {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: 'admin' | 'usuario';
}

export interface UpdateUsuarioInput {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  rol?: 'admin' | 'usuario';
  activo?: boolean;
}

