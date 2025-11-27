'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { choferesApi } from '@/src/lib/api/resources/choferes.api';
import { Chofer } from '@/src/types/chofer.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { ChoferForm } from '@/src/components/forms/ChoferForm';
import { formatearRUT } from '@/src/lib/utils/formatters';

export default function ChoferesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChofer, setSelectedChofer] = useState<Chofer | null>(null);
  const queryClient = useQueryClient();

  const { data: choferes = [], isLoading } = useQuery({
    queryKey: ['choferes'],
    queryFn: choferesApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: choferesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['choferes'] });
    },
  });

  const handleCreate = () => {
    setSelectedChofer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (chofer: Chofer) => {
    setSelectedChofer(chofer);
    setIsModalOpen(true);
  };

  const handleDelete = async (rut: string) => {
    if (confirm('¿Está seguro de eliminar este chofer?')) {
      await deleteMutation.mutateAsync(rut);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Choferes</h1>
        <Button onClick={handleCreate}>Nuevo Chofer</Button>
      </div>

      <Table headers={['RUT', 'Nombre', 'Apellido', 'Teléfono', 'Acciones']}>
        {choferes.map((chofer) => (
          <TableRow key={chofer.rut}>
            <TableCell>{formatearRUT(chofer.rut)}</TableCell>
            <TableCell>{chofer.nombre}</TableCell>
            <TableCell>{chofer.apellido}</TableCell>
            <TableCell>{chofer.telefono || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(chofer)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(chofer.rut)}>
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
        title={selectedChofer ? 'Editar Chofer' : 'Nuevo Chofer'}
      >
        <ChoferForm
          chofer={selectedChofer}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['choferes'] });
          }}
        />
      </Modal>
    </div>
  );
}

