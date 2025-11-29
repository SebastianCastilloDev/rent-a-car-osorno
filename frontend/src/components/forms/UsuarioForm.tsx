'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/src/lib/api/resources/usuarios.api';
import { Usuario } from '@/src/types/usuario.types';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { validarRUT, limpiarRUT } from '@/src/lib/utils/validators';

const usuarioSchema = z.object({
  rut: z.string().refine(validarRUT, 'RUT inválido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  rol: z.enum(['admin', 'usuario']),
  activo: z.boolean(),
});

type UsuarioFormData = z.infer<typeof usuarioSchema>;

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSuccess: () => void;
}

export function UsuarioForm({ usuario, onSuccess }: UsuarioFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!usuario;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: isEditing
      ? {
          rut: usuario.rut,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          password: '',
          rol: usuario.rol,
          activo: usuario.activo,
        }
      : {
          rut: '',
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          rol: 'usuario',
          activo: true,
        },
  });

  const createMutation = useMutation({
    mutationFn: usuariosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ rut, data }: { rut: string; data: UsuarioFormData }) =>
      usuariosApi.update(rut, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      onSuccess();
    },
  });

  const onSubmit = async (data: UsuarioFormData) => {
    const cleanData = {
      ...data,
      rut: limpiarRUT(data.rut),
    };

    if (isEditing) {
      const updateData: Record<string, unknown> = {
        nombre: cleanData.nombre,
        apellido: cleanData.apellido,
        email: cleanData.email,
        rol: cleanData.rol,
        activo: cleanData.activo,
      };

      if (cleanData.password) {
        updateData.password = cleanData.password;
      }

      await updateMutation.mutateAsync({
        rut: usuario.rut,
        data: updateData as UsuarioFormData,
      });
    } else {
      if (!cleanData.password || cleanData.password === '') {
        alert('La contraseña es requerida');
        return;
      }
      await createMutation.mutateAsync({
        ...cleanData,
        password: cleanData.password,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="RUT"
        {...register('rut')}
        error={errors.rut?.message}
        disabled={isEditing}
        placeholder="12345678-9"
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
        label={isEditing ? 'Contraseña (dejar vacío para mantener)' : 'Contraseña'}
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rol
        </label>
        <select
          {...register('rol')}
          className="w-full px-4 py-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.rol && (
          <p className="mt-1.5 text-sm text-red-600">{errors.rol.message}</p>
        )}
      </div>

      {isEditing && (
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('activo')}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-900">
            Usuario activo
          </label>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
}

