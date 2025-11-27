'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { Vehiculo, CreateVehiculoInput } from '@/src/types/vehiculo.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validarPatente, limpiarPatente } from '@/src/lib/utils/validators';

const vehiculoSchema = z.object({
  patente: z.string().refine(validarPatente, 'Patente inválida'),
  dv: z.string().min(1, 'DV requerido'),
  proveedor: z.string().optional(),
  numeroFactura: z.string().optional(),
  fechaCompra: z.string().optional(),
  tipo: z.string().min(1, 'Tipo requerido'),
  condicion: z.string().optional(),
  anio: z.number().min(1900).max(new Date().getFullYear() + 1),
  marca: z.string().min(1, 'Marca requerida'),
  modelo: z.string().min(1, 'Modelo requerido'),
  motor: z.string().optional(),
  chassis: z.string().optional(),
  color: z.string().optional(),
  transmision: z.string().optional(),
  combustible: z.string().optional(),
  ubicacionActual: z.string().optional(),
  choferRut: z.string().optional(),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

interface VehiculoFormProps {
  vehiculo?: Vehiculo | null;
  onSuccess: () => void;
}

export const VehiculoForm: React.FC<VehiculoFormProps> = ({ vehiculo, onSuccess }) => {
  const queryClient = useQueryClient();
  const isEdit = !!vehiculo;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: vehiculo
      ? {
          ...vehiculo,
          fechaCompra: vehiculo.fechaCompra?.split('T')[0],
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateVehiculoInput) => {
      const cleanData: CreateVehiculoInput = {
        ...data,
        patente: limpiarPatente(data.patente),
        // Convertir strings vacíos a undefined para campos opcionales
        choferRut: data.choferRut?.trim() || undefined,
        color: data.color?.trim() || undefined,
        combustible: data.combustible?.trim() || undefined,
        ubicacionActual: data.ubicacionActual?.trim() || undefined,
        proveedor: data.proveedor?.trim() || undefined,
        numeroFactura: data.numeroFactura?.trim() || undefined,
        condicion: data.condicion?.trim() || undefined,
        motor: data.motor?.trim() || undefined,
        chassis: data.chassis?.trim() || undefined,
        transmision: data.transmision?.trim() || undefined,
      };
      return isEdit
        ? vehiculosApi.update(vehiculo.patente, cleanData)
        : vehiculosApi.create(cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      onSuccess();
    },
  });

  const onSubmit = (data: VehiculoFormData) => {
    mutation.mutate(data as CreateVehiculoInput);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Patente"
          {...register('patente')}
          error={errors.patente?.message}
          disabled={isEdit}
        />
        <Input
          label="DV"
          {...register('dv')}
          error={errors.dv?.message}
          disabled={isEdit}
        />
        <Input
          label="Marca"
          {...register('marca')}
          error={errors.marca?.message}
        />
        <Input
          label="Modelo"
          {...register('modelo')}
          error={errors.modelo?.message}
        />
        <Input
          label="Año"
          type="number"
          {...register('anio', { valueAsNumber: true })}
          error={errors.anio?.message}
        />
        <Input
          label="Tipo"
          {...register('tipo')}
          error={errors.tipo?.message}
        />
        <Input
          label="Color"
          {...register('color')}
          error={errors.color?.message}
        />
        <Input
          label="Combustible"
          {...register('combustible')}
          error={errors.combustible?.message}
        />
        <Input
          label="Chofer RUT"
          {...register('choferRut')}
          error={errors.choferRut?.message}
        />
        <Input
          label="Ubicación Actual"
          {...register('ubicacionActual')}
          error={errors.ubicacionActual?.message}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};


