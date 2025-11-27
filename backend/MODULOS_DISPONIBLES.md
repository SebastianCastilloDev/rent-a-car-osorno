# Módulos Disponibles en el Backend

## ✅ Módulos Implementados

### 1. Autenticación (Auth)
- **Ruta base**: `/api/auth`
- **Endpoints**:
  - `POST /api/auth/login` - Iniciar sesión

### 2. Usuarios
- **Ruta base**: `/api/usuarios`
- **Endpoints**:
  - `POST /api/usuarios` - Crear usuario
  - `GET /api/usuarios` - Listar usuarios
  - `GET /api/usuarios/:rut` - Obtener usuario por RUT
  - `PATCH /api/usuarios/:rut` - Actualizar usuario
  - `DELETE /api/usuarios/:rut` - Eliminar usuario

### 3. Vehículos
- **Ruta base**: `/api/vehiculos`
- **Endpoints**:
  - `POST /api/vehiculos` - Crear vehículo
  - `GET /api/vehiculos` - Listar vehículos
  - `GET /api/vehiculos/:patente` - Obtener vehículo por patente
  - `PATCH /api/vehiculos/:patente` - Actualizar vehículo
  - `DELETE /api/vehiculos/:patente` - Eliminar vehículo

### 4. Choferes
- **Ruta base**: `/api/choferes`
- **Endpoints**:
  - `POST /api/choferes` - Crear chofer
  - `GET /api/choferes` - Listar choferes
  - `GET /api/choferes/:rut` - Obtener chofer por RUT
  - `PATCH /api/choferes/:rut` - Actualizar chofer
  - `DELETE /api/choferes/:rut` - Desactivar chofer

### 5. Cumplimiento Legal
- **Ruta base**: `/api/cumplimiento-legal`

#### Revisiones Técnicas
- `POST /api/cumplimiento-legal/revisiones-tecnicas` - Registrar revisión
- `GET /api/cumplimiento-legal/revisiones-tecnicas` - Listar revisiones
- `GET /api/cumplimiento-legal/revisiones-tecnicas/:id` - Obtener revisión
- `PATCH /api/cumplimiento-legal/revisiones-tecnicas/:id` - Actualizar revisión
- `DELETE /api/cumplimiento-legal/revisiones-tecnicas/:id` - Eliminar revisión

#### Permisos de Circulación
- `POST /api/cumplimiento-legal/permisos-circulacion` - Registrar permiso
- `GET /api/cumplimiento-legal/permisos-circulacion` - Listar permisos
- `GET /api/cumplimiento-legal/permisos-circulacion/:id` - Obtener permiso
- `PATCH /api/cumplimiento-legal/permisos-circulacion/:id` - Actualizar permiso
- `DELETE /api/cumplimiento-legal/permisos-circulacion/:id` - Eliminar permiso

### 6. Gastos
- **Ruta base**: `/api/gastos`
- **Endpoints**:
  - `POST /api/gastos` - Registrar gasto
  - `GET /api/gastos` - Listar gastos
  - `GET /api/gastos?patente=AABB12` - Filtrar por vehículo
  - `GET /api/gastos/:id` - Obtener gasto
  - `PATCH /api/gastos/:id` - Actualizar gasto
  - `DELETE /api/gastos/:id` - Eliminar gasto

### 7. Multas
- **Ruta base**: `/api/multas`
- **Endpoints**:
  - `POST /api/multas` - Registrar multa
  - `GET /api/multas` - Listar multas
  - `GET /api/multas?patente=AABB12` - Filtrar por vehículo
  - `GET /api/multas/:id` - Obtener multa
  - `PATCH /api/multas/:id` - Actualizar multa
  - `DELETE /api/multas/:id` - Eliminar multa

## 🔐 Autenticación

Todos los endpoints (excepto `/api/auth/login`) requieren autenticación JWT.

**Header requerido**:
```
Authorization: Bearer <token>
```

## 📊 Modelo de Datos

### Relaciones
- **Chofer** 1 → N **Vehículo**
- **Vehículo** 1 → N **RevisionTecnica**
- **Vehículo** 1 → N **PermisoCirculacion**
- **Vehículo** 1 → N **Multa**
- **Vehículo** 1 → N **Gasto**

### Validaciones Implementadas
- ✅ RUT chileno (validación con dígito verificador)
- ✅ Patente chilena (formatos antiguos y nuevos)
- ✅ Enums para estados y categorías
- ✅ Validación de tipos y rangos

## 🛠️ Características

### Implementadas
- ✅ CRUD completo para todas las entidades
- ✅ Relaciones entre entidades
- ✅ Validación de DTOs
- ✅ Autenticación JWT
- ✅ Documentación Swagger
- ✅ Filtros globales de excepciones
- ✅ Rate limiting
- ✅ Logging con Winston
- ✅ Seguridad con Helmet

### Por Implementar
- ⏳ Sistema de alertas de vencimientos
- ⏳ Dashboard con KPIs
- ⏳ Reportes en PDF/Excel
- ⏳ Migración de datos desde Excel
- ⏳ Testing unitario y e2e

## 📚 Documentación

Swagger disponible en: `http://localhost:3000/api/docs`

## 🚀 Próximos Pasos

1. Iniciar la base de datos: `docker-compose up -d`
2. Configurar `.env`: `cp .env.example .env`
3. Instalar dependencias: `yarn install`
4. Iniciar servidor: `yarn start:dev`
5. Acceder a Swagger: `http://localhost:3000/api/docs`


