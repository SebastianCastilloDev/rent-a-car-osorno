import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProvider } from '@/src/providers/QueryClientProvider';

export const metadata: Metadata = {
  title: "Rent-a-Car - Sistema de Gestión",
  description: "Sistema de gestión de flota de vehículos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
