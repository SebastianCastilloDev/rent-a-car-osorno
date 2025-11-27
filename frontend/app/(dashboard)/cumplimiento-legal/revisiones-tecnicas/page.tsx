'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
import { RevisionTecnica } from '@/src/types/cumplimiento-legal.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { RevisionTecnicaForm } from '@/src/components/forms/RevisionTecnicaForm';
import { formatearFecha } from '@/src/lib/utils/formatters';

export default function RevisionesTecnicasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState<RevisionTecnica | null>(null);
  const queryClient = useQueryClient();

  const { data: revisiones = [], isLoading } = useQuery({
    queryKey: ['revisiones-tecnicas'],
    queryFn: cumplimientoLegalApi.revisionesTecnicas.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: cumplimientoLegalApi.revisionesTecnicas.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisiones-tecnicas'] });
    },
  });

  const handleCreate = () => {
    setSelectedRevision(null);
    setIsModalOpen(true);
  };

  const handleEdit = (revision: RevisionTecnica) => {
    setSelectedRevision(revision);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta revisión técnica?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Revisiones Técnicas</h1>
        <Button onClick={handleCreate}>Nueva Revisión</Button>
      </div>

      <Table
        headers={['Vehículo', 'Fecha', 'Estado', 'Observaciones', 'Acciones']}
      >
        {revisiones.map((revision) => (
          <TableRow key={revision.id}>
            <TableCell>{revision.vehiculoPatente}</TableCell>
            <TableCell>{formatearFecha(revision.fechaRevision)}</TableCell>
            <TableCell>{revision.estado}</TableCell>
            <TableCell>{revision.observaciones || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(revision)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(revision.id)}>
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
        title={selectedRevision ? 'Editar Revisión Técnica' : 'Nueva Revisión Técnica'}
      >
        <RevisionTecnicaForm
          revision={selectedRevision}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['revisiones-tecnicas'] });
          }}
        />
      </Modal>
    </div>
  );
}

