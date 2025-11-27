'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import {
  PermisoCirculacion,
  CreatePermisoCirculacionInput,
} from '@/src/types/cumplimiento-legal.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const permisoSchema = z.object({
  vehiculoPatente: z.string().min(1, 'Vehículo requerido'),
  anio: z.number().min(2000),
  montoPermiso: z.number().min(0, 'Monto debe ser mayor a 0'),
  montoSoap: z.number().min(0, 'Monto debe ser mayor a 0'),
  fechaPago: z.string().optional(),
});

type PermisoFormData = z.infer<typeof permisoSchema>;

interface PermisoCirculacionFormProps {
  permiso?: PermisoCirculacion | null;
  onSuccess: () => void;
}

export const PermisoCirculacionForm: React.FC<PermisoCirculacionFormProps> = ({
  permiso,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!permiso;

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PermisoFormData>({
    resolver: zodResolver(permisoSchema),
    defaultValues: permiso
      ? {
          ...permiso,
          fechaPago: permiso.fechaPago?.split('T')[0],
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: CreatePermisoCirculacionInput) => {
      return isEdit
        ? cumplimientoLegalApi.permisosCirculacion.update(permiso.id, data)
        : cumplimientoLegalApi.permisosCirculacion.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos-circulacion'] });
      onSuccess();
    },
  });

  const onSubmit = (data: PermisoFormData) => {
    mutation.mutate(data as CreatePermisoCirculacionInput);
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
        label="Año"
        type="number"
        {...register('anio', { valueAsNumber: true })}
        error={errors.anio?.message}
      />

      <Input
        label="Monto Permiso"
        type="number"
        step="0.01"
        {...register('montoPermiso', { valueAsNumber: true })}
        error={errors.montoPermiso?.message}
      />

      <Input
        label="Monto SOAP"
        type="number"
        step="0.01"
        {...register('montoSoap', { valueAsNumber: true })}
        error={errors.montoSoap?.message}
      />

      <Input
        label="Fecha de Pago"
        type="date"
        {...register('fechaPago')}
        error={errors.fechaPago?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};


