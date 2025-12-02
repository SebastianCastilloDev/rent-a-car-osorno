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
  rol: 'admin' | 'usuario';
}

export interface LoginResponse {
  access_token: string;
  usuario: {
    email: string;
    rut: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}

export type RegisterResponse = LoginResponse;
