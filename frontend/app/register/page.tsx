'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { authApi } from '@/src/lib/api/resources/auth.api';
import { useAuthStore } from '@/src/store/auth-store';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { ApiError } from '@/src/types/api.types';
import { validarRUT, limpiarRUT } from '@/src/lib/utils/validators';

const esquemaRegistro = z.object({
  rut: z.string().refine(validarRUT, 'RUT inválido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmarPassword: z.string().min(1, 'Confirma tu contraseña'),
}).refine((datos) => datos.password === datos.confirmarPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarPassword'],
});

type DatosFormularioRegistro = z.infer<typeof esquemaRegistro>;

export default function RegisterPage() {
  const router = useRouter();
  const { iniciarSesion } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [estaCargando, setEstaCargando] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosFormularioRegistro>({
    resolver: zodResolver(esquemaRegistro),
  });

  const alEnviar = async (datos: DatosFormularioRegistro) => {
    setEstaCargando(true);
    setError(null);
    setMensajeExito(null);

    try {
      const { confirmarPassword, ...datosRegistro } = datos;
      const datosLimpios = {
        ...datosRegistro,
        rut: limpiarRUT(datosRegistro.rut),
      };
      const respuesta = await authApi.register(datosLimpios);
      
      // Si tiene access_token, es Super Admin o usuario aprobado
      if (respuesta.access_token && respuesta.usuario.rol) {
        // Convertir RegisterResponse a LoginResponse para iniciarSesion
        const loginResponse = {
          access_token: respuesta.access_token,
          usuario: {
            ...respuesta.usuario,
            rol: respuesta.usuario.rol, // Ya sabemos que existe por el if
          },
          mensaje: respuesta.mensaje,
        };
        iniciarSesion(loginResponse);
        setMensajeExito(respuesta.mensaje || 'Registro exitoso');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        // Usuario normal pendiente de aprobación
        setMensajeExito(respuesta.mensaje);
        setTimeout(() => router.push('/esperando-aprobacion'), 3000);
      }
    } catch (err) {
      const errorApi = err as ApiError;
      setError(errorApi.message || 'Error al registrar usuario');
    } finally {
      setEstaCargando(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Crear Cuenta
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
            {error}
          </div>
        )}

        {mensajeExito && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
            {mensajeExito}
          </div>
        )}

        <form onSubmit={handleSubmit(alEnviar)} className="space-y-6">
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-2">
              RUT
            </label>
            <input
              id="rut"
              {...register('rut')}
              placeholder="12345678-9"
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.rut && (
              <p className="mt-1.5 text-sm text-red-600">{errors.rut.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                id="nombre"
                {...register('nombre')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.nombre && (
                <p className="mt-1.5 text-sm text-red-600">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <input
                id="apellido"
                {...register('apellido')}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.apellido && (
                <p className="mt-1.5 text-sm text-red-600">{errors.apellido.message}</p>
              )}
            </div>
          </div>

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

          <div>
            <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmar Contraseña
            </label>
            <input
              id="confirmarPassword"
              type="password"
              {...register('confirmarPassword')}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
            {errors.confirmarPassword && (
              <p className="mt-1.5 text-sm text-red-600">{errors.confirmarPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={estaCargando}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {estaCargando ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

