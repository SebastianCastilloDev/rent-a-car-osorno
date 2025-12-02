export type EstadoUsuario = 'pendiente' | 'aprobado' | 'rechazado' | 'suspendido';
export type RolUsuario = 'super_admin' | 'admin' | 'usuario';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  rut: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface UsuarioAutenticado {
  email: string;
  rut: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  estado: EstadoUsuario;
}

export interface LoginResponse {
  access_token: string;
  usuario: UsuarioAutenticado;
  mensaje?: string;
}

export interface RegisterResponse {
  access_token?: string;
  usuario: UsuarioAutenticado;
  mensaje: string;
}
