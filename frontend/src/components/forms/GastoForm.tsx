'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { gastosApi } from '@/src/lib/api/resources/gastos.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { Gasto, CreateGastoInput, CategoriaGasto } from '@/src/types/gasto.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const gastoSchema = z.object({
  vehiculoPatente: z.string().min(1, 'Vehículo requerido'),
  fecha: z.string().min(1, 'Fecha requerida'),
  categoria: z.nativeEnum(CategoriaGasto),
  monto: z.number().min(0, 'Monto debe ser mayor a 0'),
  descripcion: z.string().optional(),
});

type GastoFormData = z.infer<typeof gastoSchema>;

interface GastoFormProps {
  gasto?: Gasto | null;
  onSuccess: () => void;
}

export const GastoForm: React.FC<GastoFormProps> = ({ gasto, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEdit = !!gasto;

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GastoFormData>({
    resolver: zodResolver(gastoSchema),
    defaultValues: gasto
      ? {
          ...gasto,
          fecha: gasto.fecha.split('T')[0],
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGastoInput) => {
      return isEdit
        ? gastosApi.update(gasto.id, data)
        : gastosApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
      onSuccess();
    },
  });

  const onSubmit = (data: GastoFormData) => {
    mutation.mutate(data as CreateGastoInput);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Vehículo</label>
        <select
          {...register('vehiculoPatente')}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          <option value="">Seleccione un vehículo</option>
          {vehiculos.map((v) => (
            <option key={v.patente} value={v.patente}>
              {v.patente} - {v.marca} {v.modelo}
            </option>
          ))}
        </select>
        {errors.vehiculoPatente && (
          <p className="text-red-500 text-sm mt-1">{errors.vehiculoPatente.message}</p>
        )}
      </div>

      <Input
        label="Fecha"
        type="date"
        {...register('fecha')}
        error={errors.fecha?.message}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <select
          {...register('categoria')}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          {Object.values(CategoriaGasto).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.categoria && (
          <p className="text-red-500 text-sm mt-1">{errors.categoria.message}</p>
        )}
      </div>

      <Input
        label="Monto"
        type="number"
        step="0.01"
        {...register('monto', { valueAsNumber: true })}
        error={errors.monto?.message}
      />

      <Input
        label="Descripción"
        {...register('descripcion')}
        error={errors.descripcion?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};


