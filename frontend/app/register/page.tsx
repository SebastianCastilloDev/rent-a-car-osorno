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

const registerSchema = z.object({
  rut: z.string().refine(validarRUT, 'RUT inválido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  rol: z.enum(['admin', 'usuario']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      rol: 'usuario',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...registerData } = data;
      const cleanData = {
        ...registerData,
        rut: limpiarRUT(registerData.rut),
      };
      const response = await authApi.register(cleanData);
      login(response);
      router.push('/dashboard');
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Error al registrar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Registrarse</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="RUT"
            {...register('rut')}
            error={errors.rut?.message}
            placeholder="123456789"
          />

          <Input
            label="Nombre"
            {...register('nombre')}
            error={errors.nombre?.message}
          />

          <Input
            label="Apellido"
            {...register('apellido')}
            error={errors.apellido?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="Confirmar Contraseña"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              {...register('rol')}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.rol && (
              <p className="text-red-500 text-sm mt-1">{errors.rol.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}

