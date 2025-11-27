'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { multasApi } from '@/src/lib/api/resources/multas.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { Multa, CreateMultaInput, EstadoPagoMulta } from '@/src/types/multa.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const multaSchema = z.object({
  vehiculoPatente: z.string().min(1, 'Vehículo requerido'),
  fechaInfraccion: z.string().min(1, 'Fecha requerida'),
  tipoInfraccion: z.string().min(1, 'Tipo requerido'),
  monto: z.number().min(0, 'Monto debe ser mayor a 0'),
  estadoPago: z.nativeEnum(EstadoPagoMulta),
  descripcion: z.string().optional(),
});

type MultaFormData = z.infer<typeof multaSchema>;

interface MultaFormProps {
  multa?: Multa | null;
  onSuccess: () => void;
}

export const MultaForm: React.FC<MultaFormProps> = ({ multa, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEdit = !!multa;

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MultaFormData>({
    resolver: zodResolver(multaSchema),
    defaultValues: multa
      ? {
          ...multa,
          fechaInfraccion: multa.fechaInfraccion.split('T')[0],
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateMultaInput) => {
      return isEdit
        ? multasApi.update(multa.id, data)
        : multasApi.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multas'] });
      onSuccess();
    },
  });

  const onSubmit = (data: MultaFormData) => {
    mutation.mutate(data as CreateMultaInput);
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
        label="Fecha de Infracción"
        type="date"
        {...register('fechaInfraccion')}
        error={errors.fechaInfraccion?.message}
      />

      <Input
        label="Tipo de Infracción"
        {...register('tipoInfraccion')}
        error={errors.tipoInfraccion?.message}
      />

      <Input
        label="Monto"
        type="number"
        step="0.01"
        {...register('monto', { valueAsNumber: true })}
        error={errors.monto?.message}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Estado de Pago</label>
        <select
          {...register('estadoPago')}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          {Object.values(EstadoPagoMulta).map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        {errors.estadoPago && (
          <p className="text-red-500 text-sm mt-1">{errors.estadoPago.message}</p>
        )}
      </div>

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

