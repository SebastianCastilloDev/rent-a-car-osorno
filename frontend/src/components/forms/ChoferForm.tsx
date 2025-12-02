'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { choferesApi } from '@/src/lib/api/resources/choferes.api';
import { Chofer, CreateChoferInput } from '@/src/types/chofer.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validarRUT, limpiarRUT } from '@/src/lib/utils/validators';

const choferSchema = z.object({
  rut: z.string().refine(validarRUT, 'RUT inválido'),
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().min(1, 'Apellido requerido'),
  telefono: z.string().optional(),
});

type ChoferFormData = z.infer<typeof choferSchema>;

interface ChoferFormProps {
  chofer?: Chofer | null;
  onSuccess: () => void;
}

export const ChoferForm: React.FC<ChoferFormProps> = ({ chofer, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEdit = !!chofer;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChoferFormData>({
    resolver: zodResolver(choferSchema),
    defaultValues: chofer || undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateChoferInput) => {
      const cleanData = {
        ...data,
        rut: limpiarRUT(data.rut),
      };
      return isEdit
        ? choferesApi.update(chofer.rut, cleanData)
        : choferesApi.create(cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['choferes'] });
      onSuccess();
    },
  });

  const onSubmit = (data: ChoferFormData) => {
    mutation.mutate(data as CreateChoferInput);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="RUT"
        {...register('rut')}
        error={errors.rut?.message}
        disabled={isEdit}
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
        label="Teléfono"
        {...register('telefono')}
        error={errors.telefono?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};


