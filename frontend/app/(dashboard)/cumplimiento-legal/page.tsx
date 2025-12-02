'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { RevisionTecnica, PermisoCirculacion } from '@/src/types/cumplimiento-legal.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { RevisionTecnicaForm } from '@/src/components/forms/RevisionTecnicaForm';
import { PermisoCirculacionForm } from '@/src/components/forms/PermisoCirculacionForm';
import { formatearPatente, formatearFecha } from '@/src/lib/utils/formatters';

type TabType = 'revisiones' | 'permisos';

export default function CumplimientoLegalPage() {
  const [activeTab, setActiveTab] = useState<TabType>('revisiones');
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isPermisoModalOpen, setIsPermisoModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<RevisionTecnica | null>(null);
  const [selectedPermiso, setSelectedPermiso] = useState<PermisoCirculacion | null>(null);
  const queryClient = useQueryClient();

  const { data: vehiculos = [] } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const { data: revisionesTecnicas = [], isLoading: isLoadingRevisiones } = useQuery({
    queryKey: ['revisiones-tecnicas'],
    queryFn: cumplimientoLegalApi.revisionesTecnicas.getAll,
  });

  const { data: permisosCirculacion = [], isLoading: isLoadingPermisos } = useQuery({
    queryKey: ['permisos-circulacion'],
    queryFn: cumplimientoLegalApi.permisosCirculacion.getAll,
  });

  const deleteRevisionMutation = useMutation({
    mutationFn: cumplimientoLegalApi.revisionesTecnicas.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisiones-tecnicas'] });
    },
  });

  const deletePermisoMutation = useMutation({
    mutationFn: cumplimientoLegalApi.permisosCirculacion.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos-circulacion'] });
    },
  });

  const handleCreateRevision = () => {
    setSelectedRevision(null);
    setIsRevisionModalOpen(true);
  };

  const handleEditRevision = (revision: RevisionTecnica) => {
    setSelectedRevision(revision);
    setIsRevisionModalOpen(true);
  };

  const handleDeleteRevision = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta revisión técnica?')) {
      await deleteRevisionMutation.mutateAsync(id);
    }
  };

  const handleCreatePermiso = () => {
    setSelectedPermiso(null);
    setIsPermisoModalOpen(true);
  };

  const handleEditPermiso = (permiso: PermisoCirculacion) => {
    setSelectedPermiso(permiso);
    setIsPermisoModalOpen(true);
  };

  const handleDeletePermiso = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este permiso de circulación?')) {
      await deletePermisoMutation.mutateAsync(id);
    }
  };

  const getEstadoVencimiento = (fechaRevision: Date) => {
    const hoy = new Date();
    const unAnio = new Date(fechaRevision);
    unAnio.setFullYear(unAnio.getFullYear() + 1);
    
    const diasRestantes = Math.ceil((unAnio.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diasRestantes < 0) {
      return { texto: 'Vencido', clase: 'bg-red-100 text-red-800' };
    } else if (diasRestantes <= 7) {
      return { texto: `${diasRestantes}d`, clase: 'bg-red-100 text-red-800' };
    } else if (diasRestantes <= 30) {
      return { texto: `${diasRestantes}d`, clase: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { texto: 'Al día', clase: 'bg-green-100 text-green-800' };
    }
  };

  const isLoading = isLoadingRevisiones || isLoadingPermisos;

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cumplimiento Legal</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300 mb-6">
        <div className="flex gap-4">
          <button
            className={`pb-2 px-4 font-medium ${
              activeTab === 'revisiones'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('revisiones')}
          >
            Revisiones Técnicas
          </button>
          <button
            className={`pb-2 px-4 font-medium ${
              activeTab === 'permisos'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('permisos')}
          >
            Permisos de Circulación
          </button>
        </div>
      </div>

      {/* Contenido de Revisiones Técnicas */}
      {activeTab === 'revisiones' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={handleCreateRevision}>Nueva Revisión Técnica</Button>
          </div>

          {revisionesTecnicas.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
              No hay revisiones técnicas registradas. Crea una nueva para comenzar.
            </div>
          ) : (
            <Table
              headers={['Patente', 'Fecha Revisión', 'Estado', 'Estado Vencimiento', 'Acciones']}
            >
              {revisionesTecnicas.map((revision) => {
                const estadoVencimiento = getEstadoVencimiento(new Date(revision.fechaRevision));
                return (
                  <TableRow key={revision.id}>
                    <TableCell>{formatearPatente(revision.vehiculoPatente)}</TableCell>
                    <TableCell>{formatearFecha(revision.fechaRevision)}</TableCell>
                    <TableCell>{revision.estado}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${estadoVencimiento.clase}`}>
                        {estadoVencimiento.texto}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => handleEditRevision(revision)}>
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteRevision(revision.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          )}
        </div>
      )}

      {/* Contenido de Permisos de Circulación */}
      {activeTab === 'permisos' && (
        <div>
          <div className="flex justify-end mb-4">
            <Button onClick={handleCreatePermiso}>Nuevo Permiso de Circulación</Button>
          </div>

          {permisosCirculacion.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
              No hay permisos de circulación registrados. Crea uno nuevo para comenzar.
            </div>
          ) : (
            <Table
              headers={['Patente', 'Año', 'Monto Permiso', 'Monto SOAP', 'Fecha Pago', 'Acciones']}
            >
              {permisosCirculacion.map((permiso) => {
                const añoActual = new Date().getFullYear();
                const estaVigente = permiso.anio === añoActual;
                
                return (
                  <TableRow key={permiso.id}>
                    <TableCell>{formatearPatente(permiso.vehiculoPatente)}</TableCell>
                    <TableCell>
                      <span className={`${estaVigente ? 'font-semibold text-green-600' : ''}`}>
                        {permiso.anio}
                      </span>
                    </TableCell>
                    <TableCell>${permiso.montoPermiso.toLocaleString('es-CL')}</TableCell>
                    <TableCell>${permiso.montoSoap.toLocaleString('es-CL')}</TableCell>
                    <TableCell>{permiso.fechaPago ? formatearFecha(permiso.fechaPago) : '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => handleEditPermiso(permiso)}>
                          Editar
                        </Button>
                        <Button variant="danger" onClick={() => handleDeletePermiso(permiso.id)}>
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Table>
          )}
        </div>
      )}

      {/* Modal Revisión Técnica */}
      <Modal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        title={selectedRevision ? 'Editar Revisión Técnica' : 'Nueva Revisión Técnica'}
      >
        <RevisionTecnicaForm
          revision={selectedRevision}
          onSuccess={() => {
            setIsRevisionModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['revisiones-tecnicas'] });
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
          onSuccess={() => {
            setIsPermisoModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['permisos-circulacion'] });
          }}
        />
      </Modal>
    </div>
  );
}

