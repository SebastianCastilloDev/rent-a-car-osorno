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
  const [tipoError, setTipoError] = useState<'general' | 'pendiente' | 'rechazado' | 'suspendido'>('general');
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
    setTipoError('general');

    try {
      const respuesta = await authApi.login(datos);
      iniciarSesion(respuesta);
      router.push('/dashboard');
    } catch (err) {
      const errorApi = err as ApiError;
      const mensaje = errorApi.message || 'Error al iniciar sesión';
      
      // Detectar tipo de error según el mensaje
      if (mensaje.toLowerCase().includes('pendiente')) {
        setTipoError('pendiente');
      } else if (mensaje.toLowerCase().includes('rechazada')) {
        setTipoError('rechazado');
      } else if (mensaje.toLowerCase().includes('suspendida')) {
        setTipoError('suspendido');
      }
      
      setError(mensaje);
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
          <div 
            className={`mb-6 p-5 border-2 rounded-lg text-sm shadow-lg transition-all duration-300 ease-in-out ${
              tipoError === 'pendiente' 
                ? 'bg-yellow-50 border-yellow-300 text-yellow-900'
                : tipoError === 'suspendido'
                ? 'bg-orange-50 border-orange-300 text-orange-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
            role="alert"
            aria-live="assertive"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-semibold mb-2 text-base leading-tight">{error}</p>
                {tipoError === 'pendiente' && (
                  <p className="text-sm mt-2 text-yellow-800 leading-relaxed">
                    Tu cuenta será revisada por un administrador. Te notificaremos cuando sea aprobada.
                  </p>
                )}
                {tipoError === 'rechazado' && (
                  <p className="text-sm mt-2 text-red-800 leading-relaxed">
                    Contacta al administrador del sistema para más información.
                  </p>
                )}
                {tipoError === 'suspendido' && (
                  <p className="text-sm mt-2 text-orange-800 leading-relaxed">
                    Tu cuenta ha sido suspendida. Contacta al administrador del sistema para más información sobre el motivo y los pasos para reactivarla.
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className={`flex-shrink-0 p-1.5 rounded-md hover:bg-opacity-20 transition-colors text-lg font-bold leading-none ${
                  tipoError === 'pendiente'
                    ? 'hover:bg-yellow-600 text-yellow-700'
                    : tipoError === 'suspendido'
                    ? 'hover:bg-orange-600 text-orange-700'
                    : 'hover:bg-red-600 text-red-700'
                }`}
                aria-label="Cerrar mensaje de error"
              >
                ×
              </button>
            </div>
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

