'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { Vehiculo } from '@/src/types/vehiculo.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { VehiculoForm } from '@/src/components/forms/VehiculoForm';
import { formatearPatente } from '@/src/lib/utils/formatters';
import Link from 'next/link';

export default function VehiculosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState<Vehiculo | null>(null);
  const queryClient = useQueryClient();

  const { data: vehiculos = [], isLoading } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: vehiculosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    },
  });

  const handleCreate = () => {
    setSelectedVehiculo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setIsModalOpen(true);
  };

  const handleDelete = async (patente: string) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      await deleteMutation.mutateAsync(patente);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vehículos</h1>
        <Button onClick={handleCreate}>Nuevo Vehículo</Button>
      </div>

      <Table
        headers={['Patente', 'Marca', 'Modelo', 'Año', 'Tipo', 'Chofer', 'Acciones']}
      >
        {vehiculos.map((vehiculo) => (
          <TableRow key={vehiculo.patente}>
            <TableCell>
              <Link 
                href={`/vehiculos/${vehiculo.patente}`}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {formatearPatente(vehiculo.patente)}
              </Link>
            </TableCell>
            <TableCell>{vehiculo.marca}</TableCell>
            <TableCell>{vehiculo.modelo}</TableCell>
            <TableCell>{vehiculo.anio}</TableCell>
            <TableCell>{vehiculo.tipo}</TableCell>
            <TableCell>{vehiculo.choferRut || '-'}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(vehiculo)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(vehiculo.patente)}
                >
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
        title={selectedVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
      >
        <VehiculoForm
          vehiculo={selectedVehiculo}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
          }}
        />
      </Modal>
    </div>
  );
}


