'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth-store';

const itemsMenuBase = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/vehiculos', label: 'Vehículos' },
  { href: '/choferes', label: 'Choferes' },
  { href: '/cumplimiento-legal', label: 'Cumplimiento Legal' },
  { href: '/gastos', label: 'Gastos' },
  { href: '/multas', label: 'Multas' },
];

const itemsMenuAdmin = [
  { href: '/usuarios', label: 'Usuarios', soloAdmin: true },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { esAdmin } = useAuthStore();

  const itemsMenu = [
    ...itemsMenuBase,
    ...(esAdmin ? itemsMenuAdmin : []),
  ];

  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {itemsMenu.map((item) => {
            const estaActivo = pathname === item.href || pathname?.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-4 py-2 rounded ${
                    estaActivo
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


