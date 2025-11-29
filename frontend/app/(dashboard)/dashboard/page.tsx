'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { choferesApi } from '@/src/lib/api/resources/choferes.api';
import { vehiculosApi } from '@/src/lib/api/resources/vehiculos.api';
import { gastosApi } from '@/src/lib/api/resources/gastos.api';
import { multasApi } from '@/src/lib/api/resources/multas.api';
import { cumplimientoLegalApi } from '@/src/lib/api/resources/cumplimiento-legal.api';
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

  const { data: gastos = [], isLoading: isLoadingGastos } = useQuery({
    queryKey: ['gastos'],
    queryFn: () => gastosApi.getAll(),
  });

  const { data: multas = [], isLoading: isLoadingMultas } = useQuery({
    queryKey: ['multas'],
    queryFn: () => multasApi.getAll(),
  });

  const { data: revisionesTecnicas = [], isLoading: isLoadingRevisiones } = useQuery({
    queryKey: ['revisiones-tecnicas'],
    queryFn: cumplimientoLegalApi.revisionesTecnicas.getAll,
  });

  const { data: permisosCirculacion = [], isLoading: isLoadingPermisos } = useQuery({
    queryKey: ['permisos-circulacion'],
    queryFn: cumplimientoLegalApi.permisosCirculacion.getAll,
  });

  const isLoading = isLoadingChoferes || isLoadingVehiculos || isLoadingGastos || isLoadingMultas || isLoadingRevisiones || isLoadingPermisos;
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
      
      {/* Tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Choferes</h3>
          <p className="text-3xl font-bold text-blue-600">{choferes.length}</p>
          <Link href="/choferes" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Ver todos →
          </Link>
        </div>
        
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Vehículos</h3>
          <p className="text-3xl font-bold text-blue-600">{vehiculos.length}</p>
          <Link href="/vehiculos" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Ver todos →
          </Link>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Multas Pendientes</h3>
          <p className="text-3xl font-bold text-red-600">
            {multas.filter((m) => m.estadoPago === 'Pendiente').length}
          </p>
          <Link href="/multas" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Ver todas →
          </Link>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Gastos del Mes</h3>
          <p className="text-3xl font-bold text-green-600">
            ${gastos
              .filter((g) => {
                const fecha = new Date(g.fecha);
                const hoy = new Date();
                return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear();
              })
              .reduce((sum, g) => sum + g.monto, 0)
              .toLocaleString('es-CL')}
          </p>
          <Link href="/gastos" className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Ver todos →
          </Link>
        </div>
      </div>

      {/* Alertas de cumplimiento legal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revisiones Técnicas</h3>
          {revisionesTecnicas.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay revisiones técnicas registradas</p>
          ) : (
            <div className="space-y-2">
              {revisionesTecnicas.slice(0, 5).map((rt) => {
                const fechaRevision = new Date(rt.fechaRevision);
                const fechaVencimiento = new Date(fechaRevision);
                fechaVencimiento.setFullYear(fechaVencimiento.getFullYear() + 1);
                
                const hoy = new Date();
                const diasRestantes = Math.ceil((fechaVencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
                const estaVencido = diasRestantes < 0;
                const esPorVencer = diasRestantes >= 0 && diasRestantes <= 30;

                return (
                  <div key={rt.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-sm">{rt.vehiculoPatente}</p>
                      <p className="text-xs text-gray-500">
                        Revisión: {new Date(rt.fechaRevision).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      estaVencido ? 'bg-red-100 text-red-800' :
                      esPorVencer ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {estaVencido ? 'Vencido' : esPorVencer ? `${diasRestantes}d` : 'Al día'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/cumplimiento-legal" className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Ver todas →
          </Link>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Permisos de Circulación</h3>
          {permisosCirculacion.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay permisos de circulación registrados</p>
          ) : (
            <div className="space-y-2">
              {permisosCirculacion.slice(0, 5).map((pc) => {
                const añoActual = new Date().getFullYear();
                const estaVigente = pc.anio === añoActual;
                const esPorVencer = pc.anio === añoActual - 1;

                return (
                  <div key={pc.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-sm">{pc.vehiculoPatente}</p>
                      <p className="text-xs text-gray-500">
                        Año: {pc.anio}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      !estaVigente ? 'bg-red-100 text-red-800' :
                      esPorVencer ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {estaVigente ? 'Al día' : 'Vencido'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <Link href="/cumplimiento-legal" className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Ver todos →
          </Link>
        </div>
      </div>

      {/* Últimos gastos */}
      <div className="bg-white border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos Gastos</h3>
        {gastos.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay gastos registrados</p>
        ) : (
          <div className="space-y-2">
            {gastos.slice(0, 5).map((gasto) => (
              <div key={gasto.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-sm">{gasto.vehiculoPatente} - {gasto.categoria}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(gasto.fecha).toLocaleDateString('es-CL')}
                  </p>
                </div>
                <span className="font-semibold text-sm">${gasto.monto.toLocaleString('es-CL')}</span>
              </div>
            ))}
          </div>
        )}
        <Link href="/gastos" className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Ver todos →
        </Link>
      </div>
    </div>
  );
}


