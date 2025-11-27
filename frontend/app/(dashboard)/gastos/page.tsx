'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gastosApi } from '@/src/lib/api/resources/gastos.api';
import { Gasto } from '@/src/types/gasto.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { GastoForm } from '@/src/components/forms/GastoForm';
import { formatearMonto, formatearFecha } from '@/src/lib/utils/formatters';

export default function GastosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<Gasto | null>(null);
  const queryClient = useQueryClient();

  const { data: gastos = [], isLoading } = useQuery({
    queryKey: ['gastos'],
    queryFn: () => gastosApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: gastosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gastos'] });
    },
  });

  const handleCreate = () => {
    setSelectedGasto(null);
    setIsModalOpen(true);
  };

  const handleEdit = (gasto: Gasto) => {
    setSelectedGasto(gasto);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este gasto?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gastos</h1>
        <Button onClick={handleCreate}>Nuevo Gasto</Button>
      </div>

      <Table
        headers={['Vehículo', 'Fecha', 'Categoría', 'Monto', 'Descripción', 'Acciones']}
      >
        {gastos.map((gasto) => (
          <TableRow key={gasto.id}>
            <TableCell>{gasto.vehiculoPatente}</TableCell>
            <TableCell>{formatearFecha(gasto.fecha)}</TableCell>
            <TableCell>{gasto.categoria}</TableCell>
            <TableCell>{formatearMonto(gasto.monto)}</TableCell>
            <TableCell>{gasto.descripcion || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(gasto)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(gasto.id)}>
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
        title={selectedGasto ? 'Editar Gasto' : 'Nuevo Gasto'}
      >
        <GastoForm
          gasto={selectedGasto}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['gastos'] });
          }}
        />
      </Modal>
    </div>
  );
}

