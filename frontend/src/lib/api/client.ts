import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@/src/types/api.types';
import { useAuthStore } from '@/src/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: agregar token JWT
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<{ message?: string; error?: string }>) => {
        if (error.response) {
          const apiError: ApiError = {
            message: error.response.data?.message || 'Error en la petición',
            statusCode: error.response.status,
            error: error.response.data?.error,
          };

          // Si es 401, limpiar token, store y redirigir a login
          // Pero NO redirigir si ya estamos en la página de login (para permitir que se muestre el mensaje de error)
          if (error.response.status === 401) {
            if (typeof window !== 'undefined') {
              // Limpiar localStorage
              localStorage.removeItem('auth_token');
              localStorage.removeItem('auth_user');

              // Limpiar store de Zustand
              useAuthStore.getState().cerrarSesion();

              // Redirigir solo si no estamos en login o register
              const rutaActual = window.location.pathname;
              if (rutaActual !== '/login' && rutaActual !== '/register') {
                window.location.href = '/login';
              }
            }
          }

          return Promise.reject(apiError);
        }

        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().instance;
