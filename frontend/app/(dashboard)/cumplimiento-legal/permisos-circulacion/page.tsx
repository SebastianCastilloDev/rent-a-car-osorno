'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
import { PermisoCirculacion } from '@/src/types/cumplimiento-legal.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { PermisoCirculacionForm } from '@/src/components/forms/PermisoCirculacionForm';
import { formatearMonto, formatearFecha } from '@/src/lib/utils/formatters';

export default function PermisosCirculacionPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermiso, setSelectedPermiso] = useState<PermisoCirculacion | null>(null);
  const queryClient = useQueryClient();

  const { data: permisos = [], isLoading } = useQuery({
    queryKey: ['permisos-circulacion'],
    queryFn: cumplimientoLegalApi.permisosCirculacion.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: cumplimientoLegalApi.permisosCirculacion.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permisos-circulacion'] });
    },
  });

  const handleCreate = () => {
    setSelectedPermiso(null);
    setIsModalOpen(true);
  };

  const handleEdit = (permiso: PermisoCirculacion) => {
    setSelectedPermiso(permiso);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este permiso de circulación?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Permisos de Circulación</h1>
        <Button onClick={handleCreate}>Nuevo Permiso</Button>
      </div>

      <Table
        headers={['Vehículo', 'Año', 'Monto Permiso', 'Monto SOAP', 'Fecha Pago', 'Acciones']}
      >
        {permisos.map((permiso) => (
          <TableRow key={permiso.id}>
            <TableCell>{permiso.vehiculoPatente}</TableCell>
            <TableCell>{permiso.anio}</TableCell>
            <TableCell>{formatearMonto(permiso.montoPermiso)}</TableCell>
            <TableCell>{formatearMonto(permiso.montoSoap)}</TableCell>
            <TableCell>
              {permiso.fechaPago ? formatearFecha(permiso.fechaPago) : '-'}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(permiso)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(permiso.id)}>
                  Eliminar
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPermiso ? 'Editar Permiso de Circulación' : 'Nuevo Permiso de Circulación'}
      >
        <PermisoCirculacionForm
          permiso={selectedPermiso}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['permisos-circulacion'] });
          }}
        />
      </Modal>
    </div>
  );
}


