export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    email: string;
    rut: string;
    nombre: string;
    apellido: string;
    rol: string;
  };
}
