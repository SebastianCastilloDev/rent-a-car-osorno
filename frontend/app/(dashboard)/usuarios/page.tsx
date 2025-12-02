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

type TabActivo = 'pendientes' | 'todos';

export default function UsuariosPage() {
  const [tabActivo, setTabActivo] = useState<TabActivo>('pendientes');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | null>(null);
  const [modalAprobar, setModalAprobar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const queryClient = useQueryClient();

  const { data: usuariosPendientes = [], isLoading: cargandoPendientes } = useQuery({
    queryKey: ['usuarios', 'pendientes'],
    queryFn: usuariosApi.obtenerPendientes,
  });

  const { data: todosUsuarios = [], isLoading: cargandoTodos } = useQuery({
    queryKey: ['usuarios', 'todos'],
    queryFn: usuariosApi.obtenerTodos,
    enabled: tabActivo === 'todos',
  });

  const aprobarMutation = useMutation({
    mutationFn: (rut: string) => usuariosApi.aprobar(rut, { rol: 'usuario' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setModalAprobar(false);
      setUsuarioSeleccionado(null);
    },
  });

  const rechazarMutation = useMutation({
    mutationFn: ({ rut, motivo }: { rut: string; motivo: string }) => 
      usuariosApi.rechazar(rut, { motivoRechazo: motivo }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setModalRechazar(false);
      setUsuarioSeleccionado(null);
      setMotivoRechazo('');
    },
  });

  const eliminarMutation = useMutation({
    mutationFn: usuariosApi.eliminar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
      setModalEliminar(false);
      setUsuarioSeleccionado(null);
    },
  });

  const manejarCrear = () => {
    setUsuarioSeleccionado(null);
    setModalAbierto(true);
  };

  const manejarEditar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  const abrirModalEliminar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminar(true);
  };

  const confirmarEliminar = async () => {
    if (usuarioSeleccionado) {
      await eliminarMutation.mutateAsync(usuarioSeleccionado.rut);
    }
  };

  const abrirModalAprobar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAprobar(true);
  };

  const abrirModalRechazar = (usuario: Usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalRechazar(true);
  };

  const confirmarAprobar = async () => {
    if (usuarioSeleccionado) {
      await aprobarMutation.mutateAsync(usuarioSeleccionado.rut);
    }
  };

  const confirmarRechazar = async () => {
    if (usuarioSeleccionado && motivoRechazo.trim()) {
      await rechazarMutation.mutateAsync({
        rut: usuarioSeleccionado.rut,
        motivo: motivoRechazo,
      });
    }
  };

  const estaCargando = tabActivo === 'pendientes' ? cargandoPendientes : cargandoTodos;
  const usuarios = tabActivo === 'pendientes' ? usuariosPendientes : todosUsuarios;

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'aprobado': return 'bg-green-100 text-green-800';
      case 'rechazado': return 'bg-red-100 text-red-800';
      case 'suspendido': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenerColorRol = (rol: string) => {
    switch (rol) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (estaCargando) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={manejarCrear}>Nuevo Usuario</Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setTabActivo('pendientes')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tabActivo === 'pendientes'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pendientes
            {usuariosPendientes.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                {usuariosPendientes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTabActivo('todos')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              tabActivo === 'todos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Todos los Usuarios
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <Table headers={['RUT', 'Nombre', 'Email', 'Rol', 'Estado', 'Acciones']}>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.rut}>
            <TableCell>{formatearRUT(usuario.rut)}</TableCell>
            <TableCell>{usuario.nombre} {usuario.apellido}</TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-1 rounded ${obtenerColorRol(usuario.rol)}`}>
                {usuario.rol === 'super_admin' ? 'Super Admin' : 
                 usuario.rol === 'admin' ? 'Admin' : 'Usuario'}
              </span>
            </TableCell>
            <TableCell>
              <span className={`text-xs px-2 py-1 rounded ${obtenerColorEstado(usuario.estado)}`}>
                {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {usuario.estado === 'pendiente' && (
                  <>
                    <Button variant="primary" onClick={() => abrirModalAprobar(usuario)}>
                      Aprobar
                    </Button>
                    <Button variant="danger" onClick={() => abrirModalRechazar(usuario)}>
                      Rechazar
                    </Button>
                  </>
                )}
                {usuario.estado !== 'pendiente' && (
                  <>
                    <Button variant="secondary" onClick={() => manejarEditar(usuario)}>
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => abrirModalEliminar(usuario)}>
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>

      {/* Modal de crear/editar usuario */}
      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title={usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario'}
      >
        <UsuarioForm
          usuario={usuarioSeleccionado}
          onSuccess={() => {
            setModalAbierto(false);
            queryClient.invalidateQueries({ queryKey: ['usuarios'] });
          }}
        />
      </Modal>

      {/* Modal de aprobar */}
      <Modal
        isOpen={modalAprobar}
        onClose={() => setModalAprobar(false)}
        title="Aprobar Usuario"
      >
        <div className="space-y-4">
          <p>¿Está seguro de aprobar al siguiente usuario?</p>
          {usuarioSeleccionado && (
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
              <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
              <p><strong>RUT:</strong> {formatearRUT(usuarioSeleccionado.rut)}</p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setModalAprobar(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmarAprobar}
              disabled={aprobarMutation.isPending}
            >
              {aprobarMutation.isPending ? 'Aprobando...' : 'Aprobar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de rechazar */}
      <Modal
        isOpen={modalRechazar}
        onClose={() => setModalRechazar(false)}
        title="Rechazar Usuario"
      >
        <div className="space-y-4">
          <p>¿Está seguro de rechazar al siguiente usuario?</p>
          {usuarioSeleccionado && (
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
              <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              Motivo del rechazo <span className="text-red-600">*</span>
            </label>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              placeholder="Indique el motivo del rechazo..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setModalRechazar(false)}>
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmarRechazar}
              disabled={rechazarMutation.isPending || !motivoRechazo.trim()}
            >
              {rechazarMutation.isPending ? 'Rechazando...' : 'Rechazar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de eliminar */}
      <Modal
        isOpen={modalEliminar}
        onClose={() => setModalEliminar(false)}
        title="Eliminar Usuario"
      >
        <div className="space-y-4">
          <p>¿Está seguro de eliminar este usuario?</p>
          {usuarioSeleccionado && (
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre} {usuarioSeleccionado.apellido}</p>
              <p><strong>Email:</strong> {usuarioSeleccionado.email}</p>
              <p><strong>RUT:</strong> {formatearRUT(usuarioSeleccionado.rut)}</p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setModalEliminar(false)}>
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmarEliminar}
              disabled={eliminarMutation.isPending}
            >
              {eliminarMutation.isPending ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

