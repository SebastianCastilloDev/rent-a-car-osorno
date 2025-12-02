# Frontend - Sistema de Gestión de Flota Rent-a-Car

Frontend desarrollado con Next.js 16 para la gestión de flota de vehículos, choferes, cumplimiento legal y gastos operacionales.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- Yarn

### Instalación

1. **Instalar dependencias**:
```bash
yarn install
```

2. **Configurar variables de entorno**:
```bash
cp .env.local.example .env.local
```

Editar `.env.local` con la URL del backend:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

3. **Iniciar servidor de desarrollo**:
```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3001`

## 📦 Stack Tecnológico

- **Framework**: Next.js 16
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS 4
- **Estado Global**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios

## 🏗️ Estructura del Proyecto

```
frontend/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # Grupo de rutas del dashboard
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── vehiculos/
│   │   ├── choferes/
│   │   ├── cumplimiento-legal/
│   │   ├── gastos/
│   │   └── multas/
│   ├── login/                    # Página de login
│   └── layout.tsx                # Layout raíz
│
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                   # Componentes base (Button, Input, Table, Modal)
│   │   ├── forms/                # Formularios específicos
│   │   └── layout/               # Header, Sidebar
│   │
│   ├── lib/                      # Utilidades y configuraciones
│   │   ├── api/                  # Cliente API y recursos
│   │   │   ├── client.ts
│   │   │   └── resources/
│   │   └── utils/                # Formatters, validators
│   │
│   ├── store/                     # Estado global (Zustand)
│   │   └── auth-store.ts
│   │
│   ├── types/                     # Tipos TypeScript
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── vehiculo.types.ts
│   │   └── ...
│   │
│   └── providers/                # Providers de React
│       └── QueryClientProvider.tsx
│
└── public/                        # Archivos estáticos
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. El token se almacena en `localStorage` y se envía automáticamente en todas las peticiones mediante interceptors de Axios.

## 📋 Funcionalidades Implementadas

### ✅ Módulos Completos

1. **Autenticación**
   - Login con email y contraseña
   - Manejo de sesión con Zustand
   - Protección de rutas

2. **Vehículos**
   - Listado de vehículos
   - Crear vehículo
   - Editar vehículo
   - Eliminar vehículo
   - Ver detalle de vehículo

3. **Choferes**
   - Listado de choferes
   - Crear chofer
   - Editar chofer
   - Eliminar chofer

4. **Cumplimiento Legal**
   - Revisiones Técnicas (CRUD completo)
   - Permisos de Circulación (CRUD completo)

5. **Gastos**
   - Listado de gastos
   - Crear gasto
   - Editar gasto
   - Eliminar gasto

6. **Multas**
   - Listado de multas
   - Crear multa
   - Editar multa
   - Eliminar multa

## 🎨 Componentes UI

Componentes básicos implementados con estilos mínimos:

- **Button**: Botones con variantes (primary, secondary, danger)
- **Input**: Inputs con label y manejo de errores
- **Table**: Tabla con headers y filas
- **Modal**: Modal para formularios

## 🔧 Configuración

### Variables de Entorno

- `NEXT_PUBLIC_API_URL`: URL base del backend API (default: `http://localhost:3000/api`)

### Cliente API

El cliente API está configurado con:
- Interceptor para agregar token JWT automáticamente
- Manejo de errores 401 (redirige a login)
- Base URL configurable

## 📝 Notas

- Los estilos son básicos y funcionales, listos para ser mejorados
- Todas las validaciones están implementadas (RUT, patente, etc.)
- Los formatters están sincronizados con el backend
- El sistema utiliza React Query para cache y sincronización de datos

## 🚀 Próximos Pasos

- [ ] Mejorar estilos y UI/UX
- [ ] Agregar paginación
- [ ] Implementar filtros y búsqueda
- [ ] Agregar dashboard con KPIs
- [ ] Implementar alertas de vencimientos
- [ ] Agregar reportes en PDF/Excel
