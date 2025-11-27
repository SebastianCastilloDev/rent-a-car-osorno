'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { choferesApi } from '@/src/lib/api/resources/choferes.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { Button } from '@/src/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();

  const { data: choferes = [], isLoading: isLoadingChoferes } = useQuery({
    queryKey: ['choferes'],
    queryFn: choferesApi.getAll,
  });

  const { data: vehiculos = [], isLoading: isLoadingVehiculos } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculosApi.getAll,
  });

  const isLoading = isLoadingChoferes || isLoadingVehiculos;
  const tieneChoferes = choferes.length > 0;
  const tieneVehiculos = vehiculos.length > 0;
  const estaConfigurado = tieneChoferes && tieneVehiculos;

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!estaConfigurado) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Bienvenido al Sistema de Gestión de Flota</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Configuración Inicial
          </h2>
          <p className="text-blue-800 mb-4">
            Para comenzar a usar el sistema, necesitas completar los siguientes pasos:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                tieneChoferes 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {tieneChoferes ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tieneChoferes ? 'Choferes registrados' : 'Paso 1: Crear Choferes'}
                </h3>
                <p className="text-gray-600 mb-2">
                  {tieneChoferes 
                    ? `Ya tienes ${choferes.length} chofer${choferes.length > 1 ? 'es' : ''} registrado${choferes.length > 1 ? 's' : ''}.`
                    : 'Registra los choferes de tu flota con su RUT, nombre, apellido y teléfono.'
                  }
                </p>
                {!tieneChoferes && (
                  <Button onClick={() => router.push('/choferes')}>
                    Ir a Choferes
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                tieneVehiculos 
                  ? 'bg-green-500 text-white' 
                  : tieneChoferes
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-700'
              }`}>
                {tieneVehiculos ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {tieneVehiculos ? 'Vehículos registrados' : 'Paso 2: Crear Vehículos'}
                </h3>
                <p className="text-gray-600 mb-2">
                  {tieneVehiculos 
                    ? `Ya tienes ${vehiculos.length} vehículo${vehiculos.length > 1 ? 's' : ''} registrado${vehiculos.length > 1 ? 's' : ''}.`
                    : 'Registra los vehículos de tu flota. Puedes asignar un chofer durante la creación o después.'
                  }
                </p>
                {!tieneVehiculos && (
                  <Button 
                    onClick={() => router.push('/vehiculos')}
                    disabled={!tieneChoferes}
                  >
                    Ir a Vehículos
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                estaConfigurado && tieneVehiculos
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}>
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Paso 3: Registrar Documentación Legal
                </h3>
                <p className="text-gray-600 mb-2">
                  Para cada vehículo, registra la Revisión Técnica vigente y el Permiso de Circulación del año actual.
                </p>
                {tieneVehiculos && (
                  <p className="text-sm text-gray-500 mb-2">
                    Ve a la página de detalle de cualquier vehículo para registrar su documentación.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">Bienvenido al sistema de gestión de flota</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Choferes</h3>
          <p className="text-3xl font-bold text-blue-600">{choferes.length}</p>
          <Link href="/choferes" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Ver todos →
          </Link>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Vehículos</h3>
          <p className="text-3xl font-bold text-blue-600">{vehiculos.length}</p>
          <Link href="/vehiculos" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Ver todos →
          </Link>
        </div>
      </div>
    </div>
  );
}


