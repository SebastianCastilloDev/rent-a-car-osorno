'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { formatearPatente, formatearFecha } from '@/src/lib/utils/formatters';

export default function VehiculoDetailPage({
  params,
}: {
  params: Promise<{ patente: string }>;
}) {
  const { patente } = use(params);
  const { data: vehiculo, isLoading } = useQuery({
    queryKey: ['vehiculos', patente],
    queryFn: () => vehiculosApi.getByPatente(patente),
  });

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!vehiculo) {
    return <div>Vehículo no encontrado</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Detalle: {formatearPatente(vehiculo.patente)}
      </h1>
      <div className="bg-white p-6 rounded border border-gray-300">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Patente:</strong> {formatearPatente(vehiculo.patente)}
          </div>
          <div>
            <strong>DV:</strong> {vehiculo.dv}
          </div>
          <div>
            <strong>Marca:</strong> {vehiculo.marca}
          </div>
          <div>
            <strong>Modelo:</strong> {vehiculo.modelo}
          </div>
          <div>
            <strong>Año:</strong> {vehiculo.anio}
          </div>
          <div>
            <strong>Tipo:</strong> {vehiculo.tipo}
          </div>
          <div>
            <strong>Color:</strong> {vehiculo.color || '-'}
          </div>
          <div>
            <strong>Combustible:</strong> {vehiculo.combustible || '-'}
          </div>
          <div>
            <strong>Chofer RUT:</strong> {vehiculo.choferRut || '-'}
          </div>
          <div>
            <strong>Ubicación:</strong> {vehiculo.ubicacionActual || '-'}
          </div>
          <div>
            <strong>Fecha Creación:</strong> {formatearFecha(vehiculo.fechaCreacion)}
          </div>
          <div>
            <strong>Fecha Actualización:</strong> {formatearFecha(vehiculo.fechaActualizacion)}
          </div>
        </div>
      </div>
    </div>
  );
}

