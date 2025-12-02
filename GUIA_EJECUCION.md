# Guía de Ejecución del Sistema Rent-a-Car

## Requisitos Previos
- Node.js >= 18
- Yarn
- PostgreSQL >= 14
- Docker (opcional, para ejecutar con docker-compose)

## Configuración Inicial

### 1. Base de Datos

#### Opción A: Con Docker
```bash
docker-compose up -d
```

#### Opción B: PostgreSQL local
Crear base de datos:
```sql
CREATE DATABASE rentacar;
```

### 2. Backend

```bash
cd backend

# Instalar dependencias
yarn install

# Configurar variables de entorno
# Crear archivo .env con:
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_USERNAME=postgres
# DATABASE_PASSWORD=postgres
# DATABASE_NAME=rentacar
# JWT_SECRET=tu_secreto_jwt_aqui

# Ejecutar migraciones
yarn typeorm migration:run

# Ejecutar seed de usuario administrador
yarn seed

# Iniciar backend en modo desarrollo
yarn start:dev
```

El backend estará corriendo en `http://localhost:3000`

### 3. Frontend

```bash
cd frontend

# Instalar dependencias
yarn install

# Iniciar frontend en modo desarrollo
yarn dev
```

El frontend estará corriendo en `http://localhost:3001`

## Flujo Completo de Usuario

### 1. Acceso Inicial

**Opción A: Usuario Admin (creado por seed)**
- URL: `http://localhost:3001/login`
- Email: `admin@rentacar.cl`
- Contraseña: `Admin123!`

**Opción B: Crear nuevo usuario**
- URL: `http://localhost:3001/register`
- Completar formulario de registro
- Seleccionar rol (admin o usuario)

### 2. Dashboard Principal

Una vez autenticado, serás redirigido al Dashboard donde verás:
- Resumen de choferes y vehículos
- Multas pendientes
- Gastos del mes actual
- Estado de revisiones técnicas
- Estado de permisos de circulación

### 3. Gestión de Choferes

**Crear chofer:**
1. Ir a `Choferes` en el menú lateral
2. Click en "Nuevo Chofer"
3. Completar formulario:
   - RUT (formato chileno: 12345678-9)
   - Nombre
   - Apellido
   - Teléfono
   - Email (opcional)
   - Licencia de conducir (opcional)
   - Fecha de vencimiento licencia (opcional)
4. Click en "Crear"

**Editar/Eliminar:**
- Desde la lista, usar botones "Editar" o "Eliminar"

### 4. Gestión de Vehículos

**Crear vehículo:**
1. Ir a `Vehículos` en el menú lateral
2. Click en "Nuevo Vehículo"
3. Completar formulario:
   - Patente (formato chileno: ABCD12 o AB1234)
   - DV (dígito verificador)
   - Marca
   - Modelo
   - Año
   - Tipo (auto, camioneta, etc.)
   - Color (opcional)
   - Combustible (opcional)
   - Chofer asignado (opcional, seleccionar de lista)
   - Ubicación actual (opcional)
4. Click en "Crear"

**Ver detalle de vehículo:**
- Click en la patente del vehículo en la lista
- Verás toda la información del vehículo
- Podrás registrar revisión técnica y permiso de circulación

### 5. Cumplimiento Legal

**Registrar Revisión Técnica:**
1. Opción A: Desde detalle de vehículo → "Registrar Revisión"
2. Opción B: Desde `Cumplimiento Legal` → Tab "Revisiones Técnicas" → "Nueva Revisión Técnica"
3. Completar:
   - Patente del vehículo
   - Fecha de revisión
   - Fecha de vencimiento
   - Estado (Aprobada/Rechazada/Homologada)
   - Planta de revisión
   - Observaciones (opcional)
4. Click en "Crear"

**Registrar Permiso de Circulación:**
1. Opción A: Desde detalle de vehículo → "Registrar Permiso"
2. Opción B: Desde `Cumplimiento Legal` → Tab "Permisos de Circulación" → "Nuevo Permiso"
3. Completar:
   - Patente del vehículo
   - Año del permiso
   - Número de permiso
   - Fecha de inicio
   - Fecha de fin
   - Monto del permiso (CLP)
   - Monto del SOAP (CLP)
   - Comuna
   - Fecha de pago (opcional)
4. Click en "Crear"

**Alertas:**
- El sistema mostrará alertas visuales:
  - Rojo: Vencido o < 7 días
  - Amarillo: Entre 8-30 días
  - Verde: Más de 30 días

### 6. Registro de Gastos

1. Ir a `Gastos` en el menú lateral
2. Click en "Nuevo Gasto"
3. Completar:
   - Patente del vehículo
   - Fecha del gasto
   - Categoría (Combustible/Mantenimiento/Peaje)
   - Monto (CLP)
   - Descripción (opcional)
4. Click en "Crear"

### 7. Registro de Multas

1. Ir a `Multas` en el menú lateral
2. Click en "Nueva Multa"
3. Completar:
   - Patente del vehículo
   - RUT del chofer (opcional)
   - Fecha de infracción
   - Tipo de infracción
   - Monto (CLP)
   - Número de parte
   - Comuna
   - Estado de pago (Pendiente/Pagada)
   - Fecha de pago (opcional)
4. Click en "Crear"

### 8. Gestión de Usuarios (Solo Admin)

1. Ir a `Usuarios` en el menú lateral
2. Click en "Nuevo Usuario"
3. Completar:
   - RUT
   - Nombre
   - Apellido
   - Email
   - Contraseña
   - Rol (admin/usuario)
4. Click en "Crear"

**Editar usuario:**
- Permite cambiar datos básicos
- Activar/desactivar usuario
- Cambiar rol
- Cambiar contraseña (opcional)

### 9. Cerrar Sesión

- Click en "Cerrar Sesión" en la esquina superior derecha
- Serás redirigido al login

## API Documentation (Swagger)

Acceder a: `http://localhost:3000/api`

## Testing

### Backend - Tests E2E
```bash
cd backend
yarn test:e2e
```

### Frontend - Tests (si existen)
```bash
cd frontend
yarn test
```

## Flujo Recomendado para Demostración

1. **Login** con usuario admin
2. **Crear 2-3 choferes**
3. **Crear 2-3 vehículos** (asignar choferes)
4. **Desde detalle de un vehículo:**
   - Registrar revisión técnica vigente
   - Registrar permiso de circulación del año actual
5. **Registrar gastos** para los vehículos
6. **Registrar una multa** (pendiente de pago)
7. **Volver al Dashboard** para ver el resumen actualizado
8. **Ir a Cumplimiento Legal** para ver el estado de documentación
9. **Crear un usuario nuevo** (si eres admin)
10. **Cerrar sesión**

## Solución de Problemas

### Backend no inicia
- Verificar que PostgreSQL esté corriendo
- Verificar variables de entorno en `.env`
- Verificar que el puerto 3000 esté disponible

### Frontend no conecta con Backend
- Verificar que el backend esté corriendo
- Verificar la URL del API en el frontend (debería ser `http://localhost:3000`)

### Error de autenticación
- Limpiar localStorage del navegador
- Cerrar sesión y volver a iniciar

### Base de datos vacía
- Ejecutar: `yarn seed` en el backend

## Datos de Prueba

### Usuario Admin (creado por seed)
- Email: admin@rentacar.cl
- Contraseña: Admin123!
- Rol: admin

### Ejemplos de RUT válidos (Chile)
- 12345678-9
- 11111111-1
- 98765432-1

### Ejemplos de patentes válidas (Chile)
- ABCD12 (formato nuevo)
- AB1234 (formato antiguo)

## Credenciales y Configuración

### Base de Datos por defecto
- Host: localhost
- Puerto: 5432
- Usuario: postgres
- Contraseña: postgres
- Base de datos: rentacar

### JWT
- Secret: configurar en .env del backend
- Expiración: 1 día

## Notas Importantes

1. El sistema requiere que primero se creen **choferes** antes de asignarlos a vehículos
2. Los **gastos y multas** requieren que exista el vehículo por patente
3. La **revisión técnica y permiso de circulación** se pueden registrar desde el detalle del vehículo o desde la sección de cumplimiento legal
4. El **dashboard** se actualiza automáticamente al refrescar la página
5. Todos los montos son en **pesos chilenos (CLP)**
6. Las fechas se muestran en **formato chileno (DD/MM/YYYY)**

