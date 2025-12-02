'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/src/lib/api/resources/usuarios.api';
import { Usuario } from '@/src/types/usuario.types';
import { Table, TableRow, TableCell } from '@/src/components/ui/Table';
import { Button } from '@/src/components/ui/Button';
import { Modal } from '@/src/components/ui/Modal';
import { UsuarioForm } from '@/src/components/forms/UsuarioForm';
import { formatearRUT } from '@/src/lib/utils/formatters';

export default function UsuariosPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const queryClient = useQueryClient();

  const { data: usuarios = [], isLoading } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: usuariosApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });

  const handleCreate = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEdit = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleDelete = async (rut: string) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      await deleteMutation.mutateAsync(rut);
    }
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <Button onClick={handleCreate}>Nuevo Usuario</Button>
      </div>

      <Table headers={['RUT', 'Nombre', 'Email', 'Rol', 'Estado', 'Acciones']}>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.rut}>
            <TableCell>{formatearRUT(usuario.rut)}</TableCell>
            <TableCell>{usuario.nombre} {usuario.apellido}</TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-1 rounded ${
                usuario.rol === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
              </span>
            </TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-1 rounded ${
                usuario.activo 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {usuario.activo ? 'Activo' : 'Inactivo'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleEdit(usuario)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(usuario.rut)}>
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
        title={selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UsuarioForm
          usuario={selectedUsuario}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
          }}
        />
      </Modal>
    </div>
  );
}

