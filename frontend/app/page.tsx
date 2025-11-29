'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/src/store/auth-store';

export default function Home() {
  const router = useRouter();
  const { estaAutenticado } = useAuthStore();

  useEffect(() => {
    if (estaAutenticado) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [estaAutenticado, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Cargando...</p>
    </div>
  );
}
