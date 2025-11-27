# 🧪 Guía de Pruebas - Sistema Rent-a-Car

## 📊 Estado del Sistema

- ✅ Backend: http://localhost:3000
- ✅ Swagger/Documentación: http://localhost:3000/api/docs
- ✅ PostgreSQL: Corriendo en puerto 5432
- ✅ Base de datos: `rentacar_db`

---

## 🎯 Formas de Probar el Sistema

### Opción 1: Swagger UI (Recomendado para empezar) 🌟

1. **Abre tu navegador** y ve a: http://localhost:3000/api/docs
2. Verás la interfaz de Swagger con todos los endpoints documentados
3. Podrás probar cada endpoint directamente desde el navegador

### Opción 2: cURL (Desde Terminal)

### Opción 3: Postman o Insomnia

---

## 📝 Flujo de Prueba Recomendado

### PASO 1: Crear un Usuario Admin

```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678-9",
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@rentacar.cl",
    "password": "Admin123!",
    "rol": "admin"
  }'
```

**Respuesta esperada:**
```json
{
  "rut": "12345678-9",
  "nombre": "Admin",
  "apellido": "Sistema",
  "email": "admin@rentacar.cl",
  "rol": "admin",
  "activo": true,
  "fechaCreacion": "2025-11-27T...",
  "fechaActualizacion": "2025-11-27T..."
}
```

---

### PASO 2: Hacer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@rentacar.cl",
    "password": "Admin123!"
  }'
```

**Respuesta esperada:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "rut": "12345678-9",
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@rentacar.cl",
    "rol": "admin"
  }
}
```

**⚠️ IMPORTANTE:** Copia el `accessToken` para usarlo en las siguientes peticiones.

---

### PASO 3: Crear un Chofer

```bash
curl -X POST http://localhost:3000/api/choferes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "rut": "98765432-1",
    "nombre": "Juan",
    "apellido": "Pérez",
    "telefono": "+56912345678"
  }'
```

---

### PASO 4: Crear un Vehículo

```bash
curl -X POST http://localhost:3000/api/vehiculos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "patente": "BBCD12",
    "dv": "3",
    "tipo": "Camioneta",
    "anio": 2023,
    "marca": "Toyota",
    "modelo": "Hilux",
    "color": "Blanco",
    "transmision": "Automática",
    "combustible": "Diesel",
    "proveedor": "Automotora Central",
    "numeroFactura": "FAC-001",
    "fechaCompra": "2023-01-15",
    "condicion": "Nuevo",
    "motor": "2.8L",
    "chassis": "MRCHS123456789",
    "ubicacionActual": "Santiago Centro"
  }'
```

---

### PASO 5: Asignar Chofer a Vehículo

```bash
curl -X PATCH http://localhost:3000/api/vehiculos/BBCD12 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "choferRut": "98765432-1"
  }'
```

---

### PASO 6: Registrar una Revisión Técnica

```bash
curl -X POST http://localhost:3000/api/cumplimiento-legal/revisiones-tecnicas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "vehiculoPatente": "BBCD12",
    "fechaRevision": "2025-06-15",
    "estado": "Aprobada",
    "observaciones": "Vehículo en perfectas condiciones"
  }'
```

---

### PASO 7: Registrar un Permiso de Circulación

```bash
curl -X POST http://localhost:3000/api/cumplimiento-legal/permisos-circulacion \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "vehiculoPatente": "BBCD12",
    "anio": 2025,
    "montoPermiso": 150000,
    "montoSoap": 25000,
    "fechaPago": "2025-01-10"
  }'
```

---

### PASO 8: Registrar un Gasto

```bash
curl -X POST http://localhost:3000/api/gastos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "vehiculoPatente": "BBCD12",
    "fecha": "2025-11-27",
    "categoria": "Combustible",
    "monto": 45000,
    "descripcion": "Carga de combustible - Copec Pedro de Valdivia"
  }'
```

---

### PASO 9: Registrar una Multa

```bash
curl -X POST http://localhost:3000/api/multas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI" \
  -d '{
    "vehiculoPatente": "BBCD12",
    "fechaInfraccion": "2025-11-26",
    "tipoInfraccion": "Exceso de velocidad",
    "monto": 80000,
    "estadoPago": "Pendiente",
    "descripcion": "Exceso de velocidad en Autopista Central, km 15"
  }'
```

---

## 🔍 Consultas (GET)

### Listar todos los vehículos

```bash
curl -X GET http://localhost:3000/api/vehiculos \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### Obtener un vehículo específico

```bash
curl -X GET http://localhost:3000/api/vehiculos/BBCD12 \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### Listar todos los choferes

```bash
curl -X GET http://localhost:3000/api/choferes \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### Listar gastos con paginación

```bash
curl -X GET "http://localhost:3000/api/gastos?page=1&limit=10" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

### Listar multas pendientes

```bash
curl -X GET "http://localhost:3000/api/multas?estadoPago=Pendiente" \
  -H "Authorization: Bearer TU_ACCESS_TOKEN_AQUI"
```

---

## 🎨 Usando Swagger (Método Visual)

1. **Abre:** http://localhost:3000/api/docs

2. **Para autenticarte:**
   - Primero ejecuta el endpoint `POST /api/usuarios` para crear un usuario
   - Luego ejecuta `POST /api/auth/login` para obtener el token
   - Copia el `accessToken` de la respuesta
   - Haz clic en el botón "Authorize" (🔓) en la parte superior derecha
   - Pega el token en el campo "value" (sin "Bearer", solo el token)
   - Haz clic en "Authorize" y luego "Close"

3. **Ahora puedes probar todos los endpoints protegidos** directamente desde Swagger

---

## 📊 Endpoints Disponibles

### Auth
- `POST /api/auth/login` - Login de usuario

### Usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:rut` - Obtener usuario por RUT
- `PATCH /api/usuarios/:rut` - Actualizar usuario
- `DELETE /api/usuarios/:rut` - Eliminar usuario (soft delete)

### Vehículos
- `POST /api/vehiculos` - Crear vehículo
- `GET /api/vehiculos` - Listar vehículos
- `GET /api/vehiculos/:patente` - Obtener vehículo por patente
- `PATCH /api/vehiculos/:patente` - Actualizar vehículo
- `DELETE /api/vehiculos/:patente` - Eliminar vehículo

### Choferes
- `POST /api/choferes` - Crear chofer
- `GET /api/choferes` - Listar choferes
- `GET /api/choferes/:rut` - Obtener chofer por RUT
- `PATCH /api/choferes/:rut` - Actualizar chofer
- `DELETE /api/choferes/:rut` - Eliminar chofer (soft delete)

### Cumplimiento Legal - Revisiones Técnicas
- `POST /api/cumplimiento-legal/revisiones-tecnicas` - Registrar revisión técnica
- `GET /api/cumplimiento-legal/revisiones-tecnicas` - Listar revisiones técnicas
- `GET /api/cumplimiento-legal/revisiones-tecnicas/:id` - Obtener revisión técnica
- `PATCH /api/cumplimiento-legal/revisiones-tecnicas/:id` - Actualizar revisión técnica
- `DELETE /api/cumplimiento-legal/revisiones-tecnicas/:id` - Eliminar revisión técnica

### Cumplimiento Legal - Permisos de Circulación
- `POST /api/cumplimiento-legal/permisos-circulacion` - Registrar permiso de circulación
- `GET /api/cumplimiento-legal/permisos-circulacion` - Listar permisos de circulación
- `GET /api/cumplimiento-legal/permisos-circulacion/:id` - Obtener permiso de circulación
- `PATCH /api/cumplimiento-legal/permisos-circulacion/:id` - Actualizar permiso de circulación
- `DELETE /api/cumplimiento-legal/permisos-circulacion/:id` - Eliminar permiso de circulación

### Gastos
- `POST /api/gastos` - Registrar gasto
- `GET /api/gastos` - Listar gastos (con paginación)
- `GET /api/gastos/:id` - Obtener gasto
- `PATCH /api/gastos/:id` - Actualizar gasto
- `DELETE /api/gastos/:id` - Eliminar gasto

### Multas
- `POST /api/multas` - Registrar multa
- `GET /api/multas` - Listar multas (con filtros)
- `GET /api/multas/:id` - Obtener multa
- `PATCH /api/multas/:id` - Actualizar multa
- `DELETE /api/multas/:id` - Eliminar multa

---

## 🐛 Debugging

### Ver logs del backend

Los logs se guardan en `backend/logs/`:
- `combined.log` - Todos los logs
- `error.log` - Solo errores

```bash
# Ver logs en tiempo real
tail -f backend/logs/combined.log
```

### Ver logs de PostgreSQL

```bash
docker logs rent-a-car-postgres
```

### Conectarse directamente a PostgreSQL

```bash
docker exec -it rent-a-car-postgres psql -U postgres -d rentacar_db
```

Luego puedes ejecutar consultas SQL:
```sql
-- Ver todas las tablas
\dt

-- Ver usuarios
SELECT * FROM usuarios;

-- Ver vehículos
SELECT * FROM vehiculos;

-- Salir
\q
```

---

## ✅ Checklist de Pruebas

- [ ] Crear usuario admin
- [ ] Hacer login y obtener token
- [ ] Crear chofer
- [ ] Crear vehículo
- [ ] Asignar chofer a vehículo
- [ ] Registrar revisión técnica
- [ ] Registrar permiso de circulación
- [ ] Registrar gasto
- [ ] Registrar multa
- [ ] Listar vehículos
- [ ] Listar gastos con paginación
- [ ] Actualizar estado de multa a "Pagada"
- [ ] Desactivar un chofer (soft delete)

---

## 🎯 Próximos Pasos

Una vez que hayas probado el backend, puedes:

1. **Desarrollar el Frontend** con Next.js
2. **Crear más tests** unitarios y e2e
3. **Agregar más validaciones** de negocio
4. **Implementar reportes** (gastos por período, multas pendientes, etc.)
5. **Agregar notificaciones** para revisiones técnicas vencidas
6. **Implementar dashboard** con métricas

---

## 💡 Tips

- Todos los endpoints (excepto login y crear usuario) requieren autenticación con JWT
- Los RUT deben tener formato válido chileno (ej: "12345678-9")
- Las patentes chilenas son de 6 caracteres (ej: "BBCD12")
- Todos los montos están en pesos chilenos (CLP)
- Los endpoints de listado soportan paginación con `?page=1&limit=10`
- Los soft deletes mantienen los registros en la base de datos pero los marca como inactivos

