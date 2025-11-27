'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vehiculos', label: 'Vehículos' },
  { href: '/choferes', label: 'Choferes' },
  { href: '/cumplimiento-legal/revisiones-tecnicas', label: 'Revisiones Técnicas' },
  { href: '/cumplimiento-legal/permisos-circulacion', label: 'Permisos de Circulación' },
  { href: '/gastos', label: 'Gastos' },
  { href: '/multas', label: 'Multas' },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};


