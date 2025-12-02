'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { authApi } from '@/src/lib/api/resources/auth.api';
import { useAuthStore } from '@/src/store/auth-store';
import { ApiError } from '@/src/types/api.types';

const esquemaLogin = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type DatosFormularioLogin = z.infer<typeof esquemaLogin>;

export default function LoginPage() {
  const router = useRouter();
  const { iniciarSesion } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [estaCargando, setEstaCargando] = useState(false);

  const metodosFormulario = useForm<DatosFormularioLogin>({
    resolver: zodResolver(esquemaLogin),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { register, formState: { errors } } = metodosFormulario;

  const alEnviar = async (datos: DatosFormularioLogin) => {
    setEstaCargando(true);
    setError(null);

    try {
      const respuesta = await authApi.login(datos);
      iniciarSesion(respuesta);
      router.push('/dashboard');
    } catch (err) {
      const errorApi = err as ApiError;
      setError(errorApi.message || 'Error al iniciar sesión');
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Iniciar Sesión
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={metodosFormulario.handleSubmit(alEnviar)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={estaCargando}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {estaCargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/register"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

