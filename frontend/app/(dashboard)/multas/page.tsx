'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { multasApi } from '@/src/lib/api/resources/multas.api';
import { Multa } from '@/src/types/multa.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { MultaForm } from '@/src/components/forms/MultaForm';
import { formatearMonto, formatearFecha } from '@/src/lib/utils/formatters';

export default function MultasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMulta, setSelectedMulta] = useState<Multa | null>(null);
  const queryClient = useQueryClient();

  const { data: multas = [], isLoading } = useQuery({
    queryKey: ['multas'],
    queryFn: () => multasApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: multasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multas'] });
    },
  });

  const handleCreate = () => {
    setSelectedMulta(null);
    setIsModalOpen(true);
  };

  const handleEdit = (multa: Multa) => {
    setSelectedMulta(multa);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta multa?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Multas</h1>
        <Button onClick={handleCreate}>Nueva Multa</Button>
      </div>

      <Table
        headers={['Vehículo', 'Fecha', 'Tipo', 'Monto', 'Estado', 'Acciones']}
      >
        {multas.map((multa) => (
          <TableRow key={multa.id}>
            <TableCell>{multa.vehiculoPatente}</TableCell>
            <TableCell>{formatearFecha(multa.fechaInfraccion)}</TableCell>
            <TableCell>{multa.tipoInfraccion}</TableCell>
            <TableCell>{formatearMonto(multa.monto)}</TableCell>
            <TableCell>{multa.estadoPago}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(multa)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(multa.id)}>
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
        title={selectedMulta ? 'Editar Multa' : 'Nueva Multa'}
      >
        <MultaForm
          multa={selectedMulta}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['multas'] });
          }}
        />
      </Modal>
    </div>
  );
}


