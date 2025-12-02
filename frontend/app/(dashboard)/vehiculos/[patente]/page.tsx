'use client';

import { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
import { formatearPatente, formatearFecha } from '@/src/lib/utils/formatters';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { RevisionTecnicaForm } from '@/src/components/forms/RevisionTecnicaForm';
import { PermisoCirculacionForm } from '@/src/components/forms/PermisoCirculacionForm';
import { RevisionTecnica, PermisoCirculacion } from '@/src/types/cumplimiento-legal.types';
import Link from 'next/link';

export default function VehiculoDetailPage({
  params,
}: {
  params: Promise<{ patente: string }>;
}) {
  const { patente } = use(params);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isPermisoModalOpen, setIsPermisoModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<RevisionTecnica | null>(null);
  const [selectedPermiso, setSelectedPermiso] = useState<PermisoCirculacion | null>(null);

  const { data: vehiculo, isLoading } = useQuery({
    queryKey: ['vehiculos', patente],
    queryFn: () => vehiculosApi.getByPatente(patente),
  });

  const { data: revisiones = [] } = useQuery({
    queryKey: ['revisiones-tecnicas', patente],
    queryFn: cumplimientoLegalApi.revisionesTecnicas.getAll,
    select: (data) => data.filter((r) => r.vehiculoPatente === patente),
  });

  const { data: permisos = [] } = useQuery({
    queryKey: ['permisos-circulacion', patente],
    queryFn: cumplimientoLegalApi.permisosCirculacion.getAll,
    select: (data) => data.filter((p) => p.vehiculoPatente === patente),
  });

  const revisionVigente = revisiones
    .filter((r) => r.estado === 'Aprobada' || r.estado === 'Homologada')
    .sort((a, b) => new Date(b.fechaRevision).getTime() - new Date(a.fechaRevision).getTime())[0];

  const permisoActual = permisos
    .filter((p) => p.anio === new Date().getFullYear())
    .sort((a, b) => b.anio - a.anio)[0];

  const handleCreateRevision = () => {
    setSelectedRevision(null);
    setIsRevisionModalOpen(true);
  };

  const handleCreatePermiso = () => {
    setSelectedPermiso(null);
    setIsPermisoModalOpen(true);
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (!vehiculo) {
    return <div>Vehículo no encontrado</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link 
          href="/vehiculos" 
          className="text-sm text-blue-600 hover:text-blue-700 mb-2 inline-block"
        >
          ← Volver a Vehículos
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        Detalle: {formatearPatente(vehiculo.patente)}
      </h1>

      <div className="space-y-6">
        {/* Información del Vehículo */}
        <div className="bg-white p-6 rounded border border-gray-300">
          <h2 className="text-lg font-semibold mb-4">Información del Vehículo</h2>
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

        {/* Revisión Técnica */}
        <div className="bg-white p-6 rounded border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Revisión Técnica</h2>
            <Button onClick={handleCreateRevision}>Registrar Revisión</Button>
          </div>
          
          {revisionVigente ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Estado:</strong> {revisionVigente.estado}
                </div>
                <div>
                  <strong>Fecha:</strong> {formatearFecha(revisionVigente.fechaRevision)}
                </div>
                {revisionVigente.observaciones && (
                  <div className="col-span-2">
                    <strong>Observaciones:</strong> {revisionVigente.observaciones}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
              No hay revisión técnica vigente registrada. Por favor, registra una revisión técnica aprobada u homologada.
            </div>
          )}

          {revisiones.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Historial de Revisiones</h3>
              <div className="space-y-2">
                {revisiones.map((revision) => (
                  <div key={revision.id} className="text-sm border-b border-gray-200 pb-2">
                    <span className="font-medium">{formatearFecha(revision.fechaRevision)}</span>
                    {' - '}
                    <span>{revision.estado}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Permiso de Circulación */}
        <div className="bg-white p-6 rounded border border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Permiso de Circulación</h2>
            <Button onClick={handleCreatePermiso}>Registrar Permiso</Button>
          </div>
          
          {permisoActual ? (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>Año:</strong> {permisoActual.anio}
                </div>
                <div>
                  <strong>Monto Permiso:</strong> ${permisoActual.montoPermiso.toLocaleString('es-CL')}
                </div>
                <div>
                  <strong>Monto SOAP:</strong> ${permisoActual.montoSoap.toLocaleString('es-CL')}
                </div>
                {permisoActual.fechaPago && (
                  <div>
                    <strong>Fecha de Pago:</strong> {formatearFecha(permisoActual.fechaPago)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
              No hay permiso de circulación registrado para el año actual ({new Date().getFullYear()}). Por favor, registra el permiso del año actual.
            </div>
          )}

          {permisos.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Historial de Permisos</h3>
              <div className="space-y-2">
                {permisos.map((permiso) => (
                  <div key={permiso.id} className="text-sm border-b border-gray-200 pb-2">
                    <span className="font-medium">Año {permiso.anio}</span>
                    {' - '}
                    <span>Permiso: ${permiso.montoPermiso.toLocaleString('es-CL')}</span>
                    {' - '}
                    <span>SOAP: ${permiso.montoSoap.toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Revisión Técnica */}
      <Modal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title={selectedRevision ? 'Editar Revisión Técnica' : 'Nueva Revisión Técnica'}
      >
        <RevisionTecnicaForm
          revision={selectedRevision}
          vehiculoPatente={patente}
          onSuccess={() => {
            setIsRevisionModalOpen(false);
          }}
        />
      </Modal>

      {/* Modal Permiso de Circulación */}
      <Modal
        isOpen={isPermisoModalOpen}
        onClose={() => setIsPermisoModalOpen(false)}
        title={selectedPermiso ? 'Editar Permiso de Circulación' : 'Nuevo Permiso de Circulación'}
      >
        <PermisoCirculacionForm
          permiso={selectedPermiso}
          vehiculoPatente={patente}
          onSuccess={() => {
            setIsPermisoModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}


