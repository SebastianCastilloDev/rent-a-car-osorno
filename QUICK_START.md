# Quick Start - Sistema Rent-a-Car

## 🚀 Inicio Rápido (Quick Start)

### Prerrequisitos
Asegúrate de tener instalado:
- Node.js >= 18
- Yarn
- PostgreSQL >= 14 (o Docker)

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Iniciar base de datos
docker-compose up -d

# 2. Backend (Terminal 1)
cd backend
yarn install
yarn seed
yarn start:dev

# 3. Frontend (Terminal 2)
cd frontend
yarn install
yarn dev
```

### Opción 2: Sin Docker

```bash
# 1. Crear base de datos PostgreSQL
createdb rentacar

# 2. Backend (Terminal 1)
cd backend
yarn install
# Configurar .env (ver ejemplo abajo)
yarn seed
yarn start:dev

# 3. Frontend (Terminal 2)
cd frontend
yarn install
yarn dev
```

### Configuración `.env` del Backend

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=rentacar
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_cambiar_en_produccion
```

## 🌐 URLs

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api

## 🔑 Credenciales de Prueba

**Usuario Administrador (creado por seed):**
- Email: `admin@rentacar.cl`
- Password: `Admin123!`

## 📋 Comandos Útiles

### Backend

```bash
# Desarrollo
yarn start:dev

# Build
yarn build

# Ejecutar seed (crear admin)
yarn seed

# Tests E2E
yarn test:e2e

# Ver logs
tail -f logs/combined.log
```

### Frontend

```bash
# Desarrollo
yarn dev

# Build
yarn build

# Start producción
yarn start
```

### Base de Datos

```bash
# Con Docker
docker-compose up -d     # Iniciar
docker-compose down      # Detener
docker-compose logs -f   # Ver logs

# Sin Docker
psql -U postgres         # Conectar a PostgreSQL
\l                       # Listar bases de datos
\c rentacar             # Conectar a la base de datos
\dt                      # Listar tablas
```

## 🧪 Verificación Rápida

### 1. Backend funcionando
```bash
curl http://localhost:3000/api
# Debería abrir Swagger en el navegador
```

### 2. Login funcional
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rentacar.cl","password":"Admin123!"}'
# Debería devolver un token JWT
```

### 3. Frontend funcionando
- Abrir http://localhost:3001
- Debería redirigir a /login

## 🐛 Troubleshooting

### Backend no inicia

**Error: Cannot connect to database**
```bash
# Verificar que PostgreSQL está corriendo
docker ps  # Si usas Docker
# o
pg_isready  # Si usas PostgreSQL local

# Verificar credenciales en .env
cat backend/.env
```

**Error: Port 3000 already in use**
```bash
# Encontrar y matar el proceso
lsof -ti:3000 | xargs kill -9
# o cambiar el puerto en main.ts
```

### Frontend no inicia

**Error: Port 3001 already in use**
```bash
# Matar el proceso
lsof -ti:3001 | xargs kill -9
```

**Error: Cannot connect to backend**
```bash
# Verificar que backend está corriendo
curl http://localhost:3000/api

# Verificar URL en frontend/src/lib/api/client.ts
```

### Base de datos vacía

```bash
cd backend
yarn seed
# Esto creará el usuario admin
```

## 📦 Datos de Prueba Rápidos

### Crear un chofer de prueba

1. Login en http://localhost:3001
2. Ir a "Choferes" → "Nuevo Chofer"
3. Datos de ejemplo:
   - RUT: 12345678-9
   - Nombre: Juan
   - Apellido: Pérez
   - Teléfono: +56912345678

### Crear un vehículo de prueba

1. Ir a "Vehículos" → "Nuevo Vehículo"
2. Datos de ejemplo:
   - Patente: ABCD12
   - DV: 1
   - Marca: Toyota
   - Modelo: Corolla
   - Año: 2023
   - Tipo: Sedan
   - Chofer: Seleccionar el creado anteriormente

### Registrar documentación legal

1. Click en la patente del vehículo
2. "Registrar Revisión Técnica"
   - Fecha revisión: Hoy
   - Fecha vencimiento: Hoy + 1 año
   - Estado: Aprobada
   - Planta: PRT Santiago Centro
3. "Registrar Permiso de Circulación"
   - Año: 2025
   - Número: 123456
   - Fecha inicio: 01/01/2025
   - Fecha fin: 31/12/2025
   - Monto permiso: 120000
   - Monto SOAP: 45000
   - Comuna: Santiago

## 🎯 Flujo de Demostración (5 minutos)

1. **Login** (30 seg)
   - Email: admin@rentacar.cl
   - Password: Admin123!

2. **Dashboard** (30 seg)
   - Mostrar KPIs
   - Explicar sistema de alertas

3. **Crear Chofer** (1 min)
   - Completar formulario rápido
   - Mostrar validación de RUT

4. **Crear Vehículo** (1 min)
   - Completar formulario
   - Asignar chofer

5. **Documentación Legal** (1.5 min)
   - Registrar revisión técnica
   - Registrar permiso de circulación
   - Mostrar alertas en dashboard

6. **Gastos y Multas** (1 min)
   - Registrar un gasto rápido
   - Registrar una multa pendiente
   - Ver en dashboard

## 🔗 Links Útiles

- [README Principal](README_FLUJO_USUARIO.md)
- [Guía de Ejecución Detallada](GUIA_EJECUCION.md)
- [Checklist de Verificación](CHECKLIST_VERIFICACION.md)
- [Resumen de Implementación](RESUMEN_IMPLEMENTACION.md)

## 📞 Soporte

Si encuentras algún problema, verifica:
1. ✅ PostgreSQL está corriendo
2. ✅ Las variables de entorno están configuradas
3. ✅ Los puertos 3000 y 3001 están disponibles
4. ✅ Ejecutaste `yarn install` en ambas carpetas
5. ✅ Ejecutaste `yarn seed` en el backend

---

**¡Listo para empezar! 🎉**

