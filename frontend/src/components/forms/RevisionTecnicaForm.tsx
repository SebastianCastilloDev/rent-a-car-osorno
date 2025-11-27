'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import {
  RevisionTecnica,
  CreateRevisionTecnicaInput,
  EstadoRevisionTecnica,
} from '@/src/types/cumplimiento-legal.types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const revisionSchema = z.object({
  vehiculoPatente: z.string().min(1, 'Vehículo requerido'),
  fechaRevision: z.string().min(1, 'Fecha requerida'),
  estado: z.nativeEnum(EstadoRevisionTecnica),
  observaciones: z.string().optional(),
});

type RevisionFormData = z.infer<typeof revisionSchema>;

interface RevisionTecnicaFormProps {
  revision?: RevisionTecnica | null;
  onSuccess: () => void;
}

export const RevisionTecnicaForm: React.FC<RevisionTecnicaFormProps> = ({
  revision,
  onSuccess,
}) => {
  const queryClient = useQueryClient();
  const isEdit = !!revision;

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RevisionFormData>({
    resolver: zodResolver(revisionSchema),
    defaultValues: revision
      ? {
          ...revision,
          fechaRevision: revision.fechaRevision.split('T')[0],
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: (data: CreateRevisionTecnicaInput) => {
      return isEdit
        ? cumplimientoLegalApi.revisionesTecnicas.update(revision.id, data)
        : cumplimientoLegalApi.revisionesTecnicas.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisiones-tecnicas'] });
      onSuccess();
    },
  });

  const onSubmit = (data: RevisionFormData) => {
    mutation.mutate(data as CreateRevisionTecnicaInput);
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
        label="Fecha de Revisión"
        type="date"
        {...register('fechaRevision')}
        error={errors.fechaRevision?.message}
      />

      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <select
          {...register('estado')}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        >
          {Object.values(EstadoRevisionTecnica).map((estado) => (
            <option key={estado} value={estado}>
              {estado}
            </option>
          ))}
        </select>
        {errors.estado && (
          <p className="text-red-500 text-sm mt-1">{errors.estado.message}</p>
        )}
      </div>

      <Input
        label="Observaciones"
        {...register('observaciones')}
        error={errors.observaciones?.message}
      />

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
        </Button>
      </div>
    </form>
  );
};


