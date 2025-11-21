# 🚗 Sistema de Gestión de Flota Rent-a-Car

> Sistema integral de gestión para empresas de arriendo de vehículos en Chile

## 📋 Descripción

Sistema de gestión de flota diseñado específicamente para empresas chilenas de rent-a-car. Migra desde múltiples hojas Excel con datos redundantes hacia una base de datos relacional normalizada, optimizando el control de vehículos, choferes, documentación legal y gastos operacionales.

### Problema que Resuelve

Las empresas de arriendo de vehículos típicamente gestionan su operación con múltiples hojas Excel:
- **Hoja maestra** con inventario de vehículos
- **Hojas de cumplimiento legal** (Revisión Técnica, Permiso de Circulación)
- **Hojas de seguimiento de gastos** (Combustible, Mantenimiento)

Esto genera:
- ❌ Duplicación de datos
- ❌ Inconsistencias entre hojas
- ❌ Dificultad para rastrear vencimientos
- ❌ Pérdida de tiempo en búsquedas manuales
- ❌ Riesgo de multas por documentos vencidos

### Solución Propuesta

✅ Base de datos relacional centralizada  
✅ Alertas automáticas de vencimientos  
✅ Dashboard de estado de flota en tiempo real  
✅ Trazabilidad completa de gastos  
✅ Interfaz moderna y fácil de usar  

---

## 🏗️ Arquitectura

### Stack Tecnológico

**Backend:**
- NestJS (Framework Node.js)
- TypeORM (ORM)
- PostgreSQL (Base de datos)
- JWT (Autenticación)
- Winston (Logging)

**Frontend:**
- Next.js (Framework React)
- TailwindCSS (Estilos)
- Responsive design

**Arquitectura:**
- Clean Architecture
- Domain-Driven Design (DDD)
- Arquitectura modular y escalable

---

## 📊 Modelo de Datos

El sistema está diseñado alrededor de 6 entidades principales:

```
Vehículo (patente como PK)
├── RevisionTecnica (múltiples por vehículo)
├── PermisoCirculacion (registro anual)
├── Multa (registro de infracciones)
└── Gasto (combustible, mantenimiento, peajes)

Chofer (rut como PK)
└── Vehículo (choferes responsables)
```

### Entidades Principales

#### 🚙 Vehículo
- Identificación: patente, dv, chassis, motor
- Información comercial: proveedor, factura, fecha de compra
- Características: marca, modelo, año, color, tipo de combustible
- Estado operacional: ubicación actual, chofer asignado

#### 👤 Chofer
- Identificación: RUT chileno
- Datos de contacto: nombre, apellido, teléfono
- Vehículos asignados

#### 📋 Revisión Técnica
- Seguimiento histórico por vehículo
- Estados: Aprobada, Rechazada, Homologada
- Observaciones y fecha de revisión

#### 📄 Permiso de Circulación
- Registro anual por vehículo
- Montos: permiso + SOAP (Seguro Obligatorio)
- Control de pagos

#### 🚨 Multa
- Registro de infracciones
- Estado de pago: Pagada, Pendiente
- Tipo y monto

#### 💰 Gasto
- Categorías: Combustible, Mantenimiento, Peaje
- Seguimiento temporal con descripción detallada

Ver diagramas completos en `/diagramas/`

---

## 🎯 Funcionalidades

### MVP (Versión 1.0)

#### Módulo de Vehículos
- ✅ CRUD completo de vehículos
- ✅ Vista de estado actual de la flota
- ✅ Asignación de choferes
- ✅ Historial de documentación legal

#### Módulo de Choferes
- ✅ Gestión de choferes
- ✅ Vehículos asignados por chofer
- ✅ Validación de RUT chileno

#### Módulo de Cumplimiento Legal
- ✅ Registro de revisiones técnicas
- ✅ Registro de permisos de circulación
- ✅ **Alertas de vencimientos** (30, 15, 7 días antes)
- ✅ Dashboard de documentos por vencer

#### Módulo de Gastos
- ✅ Registro de gastos por categoría
- ✅ Asociación a vehículo específico
- ✅ Reportes básicos de gastos

#### Módulo de Multas
- ✅ Registro de infracciones
- ✅ Control de estado de pago
- ✅ Vista de multas pendientes

#### Sistema de Usuarios
- ✅ Autenticación con usuario/contraseña
- ✅ Roles: Admin y Usuario
- ✅ Permisos por rol

#### Migración de Datos
- ✅ Importación desde Excel actual
- ✅ Validación de datos
- ✅ Reporte de inconsistencias

### Roadmap Futuro

#### Fase 2 (v2.0)
- 📱 App móvil para choferes
- 📊 Reportes financieros avanzados
- 🔔 Notificaciones push/email
- 📈 Dashboard ejecutivo con KPIs
- 💾 Exportación de reportes (PDF, Excel)

#### Fase 3 (v3.0)
- 🔗 Integración con sistemas contables
- 🤖 Mantenimiento predictivo (ML)
- 📅 Gestión de reservas y contratos
- 🗺️ Tracking GPS de flota
- 📊 Business Intelligence

---

## 🚀 Instalación y Configuración

### Prerrequisitos

```bash
- Node.js >= 18
- PostgreSQL >= 14
- npm o yarn
```

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/rent-a-car.git
cd rent-a-car

# Instalar dependencias backend
cd backend
npm install

# Instalar dependencias frontend
cd ../frontend
npm install
```

### Configuración

```bash
# Backend: crear archivo .env
cp .env.example .env

# Configurar variables:
DATABASE_URL=postgresql://usuario:password@localhost:5432/rentacar
JWT_SECRET=tu-secreto-seguro
PORT=3000
```

### Ejecutar

```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

---

## 🔒 Seguridad

- ✅ Autenticación JWT
- ✅ Encriptación de contraseñas (bcrypt)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Protección contra SQL Injection
- ✅ Validación de inputs
- ✅ Sanitización de datos
- ✅ Headers de seguridad (Helmet)

---

## 📐 Convenciones y Estándares Chilenos

### Formatos Específicos

- **Patente**: Formato chileno (AA-BB-12 o AA-BB-CD)
- **RUT**: Formato con dígito verificador (12.345.678-9)
- **Fecha**: DD/MM/YYYY
- **Moneda**: CLP (Peso Chileno)

### Campos Específicos de Chile

- **Revisión Técnica**: Obligatoria anual o semestral según año del vehículo
- **Permiso de Circulación**: Pago anual en municipalidad
- **SOAP**: Seguro Obligatorio de Accidentes Personales

---

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📚 Documentación

- **API Docs**: `/api/docs` (Swagger)
- **Diagramas**: Ver carpeta `/diagramas/`
- **Manual de Usuario**: (en desarrollo)

---

## 👥 Contribución

Este es un proyecto privado para cliente específico. Para contribuciones internas:

1. Crear branch desde `develop`
2. Seguir convenciones de commits (Conventional Commits)
3. Crear Pull Request con descripción detallada
4. Pasar revisión de código y tests

---

## 📄 Licencia

Propietario - Todos los derechos reservados

---

## 📞 Soporte

Para consultas sobre el proyecto:
- Email: sebastian@tuempresa.cl
- Proyecto: [GitHub Issues](https://github.com/tu-usuario/rent-a-car/issues)

---

## 🗺️ Estado del Proyecto

**⚠️ Fase Actual: DISEÑO Y PLANIFICACIÓN**

- ✅ Análisis de requerimientos
- ✅ Diseño de base de datos
- ✅ Diagramas de arquitectura
- 🔄 Definición de alcance MVP
- ⏳ Desarrollo (pendiente)

**Próximos pasos:**
1. Validación de modelo de datos con cliente
2. Setup inicial del proyecto
3. Desarrollo de módulos core
4. Testing y QA
5. Migración de datos
6. Capacitación y despliegue

---

**Última actualización:** Noviembre 2025
