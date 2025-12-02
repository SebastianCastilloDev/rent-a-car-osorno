'use client';

import Link from 'next/link';

export default function EsperandoAprobacionPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Cuenta en Revisión
          </h1>
          <p className="text-gray-600">
            Tu cuenta está siendo revisada por un administrador
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 mb-8 text-left">
          <h2 className="font-medium text-yellow-900 mb-2">
            ¿Qué sigue?
          </h2>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>✓ Tu cuenta ha sido registrada exitosamente</li>
            <li>⏳ Un administrador revisará tu solicitud</li>
            <li>📧 Te notificaremos por email cuando sea aprobada</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </Link>
          <p className="text-sm text-gray-600">
            Generalmente el proceso de aprobación toma entre 1-3 días hábiles
          </p>
        </div>
      </div>
    </div>
  );
}


