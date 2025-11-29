# Sistema de Gestión de Flota - Rent-a-Car

Sistema completo de gestión de flota de vehículos para empresas de arriendo de autos en Chile.

## 🚗 Características Principales

### Módulos Implementados

1. **Autenticación y Usuarios**
   - Login y registro de usuarios
   - Roles (Administrador y Usuario)
   - Gestión de usuarios (solo admin)

2. **Gestión de Choferes**
   - CRUD completo de choferes
   - Validación de RUT chileno
   - Gestión de licencias de conducir

3. **Gestión de Vehículos**
   - CRUD completo de vehículos
   - Validación de patentes chilenas (formato antiguo y nuevo)
   - Asignación de choferes a vehículos
   - Vista detallada por vehículo

4. **Cumplimiento Legal**
   - Registro de Revisiones Técnicas
   - Registro de Permisos de Circulación
   - Sistema de alertas de vencimiento (30, 15, 7 días)
   - Estados visuales (verde/amarillo/rojo)

5. **Gestión de Gastos**
   - Registro por vehículo
   - Categorización (Combustible, Mantenimiento, Peaje)
   - Reportes por mes

6. **Gestión de Multas**
   - Registro de infracciones por vehículo
   - Estado de pago (Pendiente/Pagada)
   - Asociación con chofer responsable

7. **Dashboard**
   - Resumen ejecutivo de la flota
   - Indicadores clave (KPIs)
   - Alertas de cumplimiento legal
   - Últimos gastos registrados
   - Multas pendientes

## 🛠️ Stack Tecnológico

### Backend
- **NestJS** - Framework de Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **Swagger** - Documentación de API
- **Winston** - Logging
- **Helmet** - Seguridad
- **Jest** - Testing

### Frontend
- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **TailwindCSS** - Estilos
- **React Query** - Estado del servidor
- **Zustand** - Estado global
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas

## 📋 Arquitectura

El proyecto sigue principios de:
- **Clean Architecture**
- **Domain Driven Design (DDD)**
- **SOLID Principles**
- **Single Source of Truth (SSOT)**

### Estructura Backend
```
backend/
├── src/
│   ├── modules/          # Módulos de negocio
│   │   ├── auth/         # Autenticación
│   │   ├── usuarios/     # Gestión de usuarios
│   │   ├── choferes/     # Gestión de choferes
│   │   ├── vehiculos/    # Gestión de vehículos
│   │   ├── cumplimiento-legal/  # Revisiones y permisos
│   │   ├── gastos/       # Registro de gastos
│   │   └── multas/       # Registro de multas
│   ├── common/           # Utilidades compartidas
│   ├── config/           # Configuración
│   └── database/         # Migraciones y seeds
└── test/                 # Tests E2E
```

### Estructura Frontend
```
frontend/
├── app/                  # App Router de Next.js
│   ├── (dashboard)/      # Rutas protegidas
│   ├── login/           # Página de login
│   └── register/        # Página de registro
└── src/
    ├── components/       # Componentes reutilizables
    │   ├── forms/       # Formularios
    │   ├── layout/      # Layout components
    │   └── ui/          # Componentes UI base
    ├── lib/             # Utilidades
    │   ├── api/         # Cliente API
    │   └── utils/       # Helpers
    ├── store/           # Estado global (Zustand)
    └── types/           # Tipos TypeScript
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js >= 18
- Yarn
- PostgreSQL >= 14

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd rent-a-car
```

2. **Backend**
```bash
cd backend
yarn install
# Configurar .env
yarn seed  # Crear usuario admin
yarn start:dev
```

3. **Frontend**
```bash
cd frontend
yarn install
yarn dev
```

4. **Acceder al sistema**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/api

**Credenciales Admin:**
- Email: admin@rentacar.cl
- Contraseña: Admin123!

## 📖 Flujo de Usuario

### 1. Onboarding (Primera vez)

#### Login/Registro
- Usuario accede a `/login`
- Si no tiene cuenta, va a `/register`
- Crea cuenta con email, RUT, contraseña y rol
- Sistema redirige al dashboard

#### Configuración Inicial
El sistema guía al usuario con un wizard de configuración:

**Paso 1: Crear Choferes**
- Ir a "Choferes"
- Registrar choferes con RUT, nombre, teléfono
- Opcionalmente agregar datos de licencia

**Paso 2: Crear Vehículos**
- Ir a "Vehículos"
- Registrar vehículos con patente, marca, modelo, año
- Asignar chofer al vehículo (opcional)

**Paso 3: Registrar Documentación Legal**
- Desde detalle de cada vehículo:
  - Registrar Revisión Técnica vigente
  - Registrar Permiso de Circulación del año

### 2. Operación Diaria

#### Registro de Gastos
- Ir a "Gastos" → "Nuevo Gasto"
- Seleccionar vehículo
- Ingresar tipo de gasto (combustible, mantención, peaje)
- Registrar monto y fecha

#### Registro de Multas
- Ir a "Multas" → "Nueva Multa"
- Seleccionar vehículo y chofer (opcional)
- Ingresar detalles de la multa
- Marcar estado de pago

#### Consulta de Estado Legal
- Ir a "Cumplimiento Legal"
- Ver estado de revisiones técnicas
- Ver estado de permisos de circulación
- Sistema muestra alertas visuales:
  - 🟢 Verde: Al día (>30 días)
  - 🟡 Amarillo: Por vencer (8-30 días)
  - 🔴 Rojo: Urgente (<7 días) o vencido

### 3. Monitoreo y Control

#### Dashboard Ejecutivo
El dashboard muestra:
- **KPIs principales:**
  - Total de choferes
  - Total de vehículos
  - Multas pendientes
  - Gastos del mes actual

- **Alertas de cumplimiento:**
  - Revisiones técnicas por vencer/vencidas
  - Permisos de circulación por renovar

- **Últimos movimientos:**
  - Gastos recientes
  - Multas sin pagar

#### Gestión de Usuarios (Solo Admin)
- Ir a "Usuarios"
- Crear nuevos usuarios del sistema
- Asignar roles (admin/usuario)
- Activar/desactivar cuentas

### 4. Flujo de Mantenimiento

#### Renovación de Revisión Técnica
1. Dashboard muestra alerta de vencimiento
2. Usuario va a detalle del vehículo
3. Click en "Registrar Revisión"
4. Completa datos de la nueva revisión
5. Sistema actualiza estado automáticamente

#### Renovación de Permiso de Circulación
1. Al iniciar nuevo año, dashboard alerta permisos pendientes
2. Usuario va a detalle del vehículo
3. Click en "Registrar Permiso"
4. Ingresa datos del nuevo permiso
5. Sistema valida y actualiza

### 5. Reportes y Consultas

#### Gastos por Vehículo
- Ir a "Gastos"
- Ver listado completo con filtros
- Ordenar por fecha, vehículo o monto

#### Multas Pendientes
- Ir a "Multas"
- Filtrar por estado "Pendiente"
- Ver detalle de cada multa
- Marcar como pagada cuando corresponda

#### Estado Legal de Flota
- Ir a "Cumplimiento Legal"
- Vista consolidada de toda la flota
- Identificar vehículos con problemas

## 🔐 Seguridad

- Autenticación JWT
- Passwords hasheados con bcrypt
- Validación de datos en backend y frontend
- Protección de rutas por rol
- Rate limiting
- Helmet para headers de seguridad
- CORS configurado

## 📊 Validaciones Chilenas

### RUT
- Formato: 12345678-9
- Validación de dígito verificador

### Patentes
- Formato nuevo: ABCD12
- Formato antiguo: AB1234

### Montos
- Formato chileno con separadores de miles
- Símbolo de peso ($)

### Fechas
- Formato: DD/MM/YYYY
- Zona horaria: America/Santiago

## 🧪 Testing

### Backend
```bash
cd backend
yarn test        # Tests unitarios
yarn test:e2e   # Tests E2E
yarn test:cov   # Coverage
```

Cobertura mínima: 70% en servicios críticos

### Tests E2E Implementados
- ✅ Auth (login/register)
- ✅ Choferes CRUD
- ✅ Vehículos CRUD
- ✅ Cumplimiento Legal
- ✅ Gastos CRUD
- ✅ Multas CRUD

## 📝 Convenciones

### Git Commits
Usar Conventional Commits:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `refactor:` Refactorización
- `test:` Tests

### Código
- Nombres en español
- Nombres descriptivos y largos
- Clean Code principles
- ESLint + Prettier

## 📚 Documentación Adicional

- [Guía de Ejecución](GUIA_EJECUCION.md) - Instrucciones detalladas
- [Guía de Pruebas](GUIA_PRUEBAS.md) - Testing manual
- [Docker](README_DOCKER.md) - Configuración Docker
- [Análisis Frontend](ANALISIS_CONSISTENCIA_FRONTEND_BACKEND.md)

## 🤝 Contribución

Este es un proyecto interno. Para contribuir:
1. Crear feature branch desde `main`
2. Implementar cambios siguiendo convenciones
3. Escribir tests
4. Crear Pull Request

## 📄 Licencia

Propietario: [Tu Empresa]
Uso interno solamente.

## 👥 Equipo

Desarrollado por el equipo de desarrollo interno.

## 📞 Soporte

Para soporte técnico, contactar a: [email o slack]

---

**Versión:** 1.0.0  
**Última actualización:** Noviembre 2025

