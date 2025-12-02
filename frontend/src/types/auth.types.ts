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

// Tipo para usuario en respuesta de registro (rol es opcional para usuarios pendientes)
export interface UsuarioRegistro {
  email: string;
  rut: string;
  nombre: string;
  apellido: string;
  rol?: RolUsuario; // Opcional porque usuarios pendientes no tienen rol asignado aún
  estado: EstadoUsuario;
}

export interface LoginResponse {
  access_token: string;
  usuario: UsuarioAutenticado;
  mensaje?: string;
}

export interface RegisterResponse {
  access_token?: string;
  usuario: UsuarioRegistro;
  mensaje: string;
}
