'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth-store';
import { Button } from '../ui/Button';

export const Header = () => {
  const router = useRouter();
  const { usuario, cerrarSesion } = useAuthStore();

  const manejarCierreSesion = () => {
    cerrarSesion();
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Rent-a-Car</h1>
        <div className="flex items-center gap-4">
          {usuario && (
            <span className="text-sm text-gray-600">
              {usuario.nombre} {usuario.apellido}
            </span>
          )}
          <Button variant="secondary" onClick={manejarCierreSesion}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};


