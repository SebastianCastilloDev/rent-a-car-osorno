# 🚀 Instrucciones de Deployment - Sistema de Aprobación de Usuarios

## 🏗️ Infraestructura

- **Backend**: Render (NestJS)
- **Frontend**: Vercel (NextJS)
- **Base de Datos**: PostgreSQL en Render

## 📋 Resumen de Cambios

Se ha implementado un sistema profesional de aprobación de usuarios con los siguientes componentes:

### ✅ Cambios Implementados

1. **Nuevos Roles**
   - `SUPER_ADMIN`: Control total (asignado automáticamente por whitelist)
   - `ADMIN`: Puede aprobar usuarios
   - `USUARIO`: Usuario estándar

2. **Estados de Usuario**
   - `PENDIENTE`: Esperando aprobación
   - `APROBADO`: Puede acceder al sistema
   - `RECHAZADO`: No puede acceder
   - `SUSPENDIDO`: Suspendido temporalmente

3. **Sistema de Whitelist**
   - Variable de entorno `SUPER_ADMIN_EMAILS` para definir Super Admins
   - Usuarios con emails en la lista son automáticamente Super Admins aprobados

4. **Nuevos Endpoints**
   - `GET /api/usuarios/pendientes/aprobacion` - Listar pendientes
   - `POST /api/usuarios/:rut/aprobar` - Aprobar usuario
   - `POST /api/usuarios/:rut/rechazar` - Rechazar usuario
   - `POST /api/usuarios/:rut/suspender` - Suspender usuario
   - `POST /api/usuarios/:rut/reactivar` - Reactivar usuario
   - `GET /api/usuarios/estado/:estado` - Listar por estado

5. **Seguridad Mejorada**
   - ❌ Eliminado campo `rol` del registro (ya no se puede auto-asignar)
   - ✅ Guards de roles implementados
   - ✅ Verificación de estado en login
   - ✅ Protección de rutas administrativas

## 🔧 Pasos para el Deployment

### 1️⃣ Actualizar Variables de Entorno en Render

```bash
# Agregar la nueva variable en Render Dashboard
SUPER_ADMIN_EMAILS=tu@email.com,otro@email.com
```

**⚠️ IMPORTANTE**: Reemplaza con tus emails reales.

#### Via Render Dashboard
1. Ir a tu servicio de backend en Render (https://dashboard.render.com)
2. Click en tu servicio web
3. Ir a la pestaña "Environment"
4. Click en "Add Environment Variable"
5. Agregar nueva variable:
   - **Key**: `SUPER_ADMIN_EMAILS`
   - **Value**: `tu@email.com` (tu email real)
6. Click en "Save Changes"
7. Render reiniciará automáticamente el servicio

### 2️⃣ Sincronización de Base de Datos

**⚠️ IMPORTANTE**: Si estás usando `synchronize: true` en desarrollo, TypeORM creará automáticamente las nuevas columnas y enums cuando reinicies el servidor. **NO necesitas ejecutar migraciones**.

#### Si usas `synchronize: true` (Desarrollo)

1. **Solo necesitas reiniciar el servidor**:
   - Render reiniciará automáticamente cuando agregues la variable `SUPER_ADMIN_EMAILS`
   - TypeORM detectará los cambios en las entidades y actualizará la BD automáticamente

2. **Verificar que los cambios se aplicaron**:
   - Revisar logs de Render para confirmar que no hay errores
   - Verificar que las nuevas columnas existen en la BD

#### Si usas `synchronize: false` (Producción - Migraciones)

Solo si tienes `synchronize: false` en producción, necesitarás migraciones:

**Opción A: Via Render Shell**
1. En Render Dashboard, ve a tu servicio web
2. Click en "Shell" en el menú lateral
3. Ejecutar el comando:
```bash
yarn migration:run
```

**Opción B: Generar migración desde entidades**
```bash
# Primero generar la migración
yarn migration:generate -n AgregarSistemaAprobacionUsuarios

# Luego ejecutarla
yarn migration:run
```

**⚠️ NOTA**: Si estás en desarrollo con `synchronize: true`, **NO necesitas hacer esto**. TypeORM lo hace automáticamente.

### 3️⃣ Verificar el Deployment

```bash
# 1. Verificar que el backend esté corriendo
curl https://tu-backend.onrender.com/

# 2. Probar registro con email de Super Admin
curl -X POST https://tu-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678-9",
    "nombre": "Tu Nombre",
    "apellido": "Tu Apellido",
    "email": "tu@email.com",
    "password": "TuPassword123!"
  }'

# Deberías recibir:
# - access_token (porque eres Super Admin)
# - mensaje: "Registro exitoso. Has sido registrado como Super Administrador."

# 3. Probar login
curl -X POST https://tu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu@email.com",
    "password": "TuPassword123!"
  }'
```

### 4️⃣ Probar Flujo de Usuario Normal

```bash
# 1. Registrar usuario NO en whitelist
curl -X POST https://tu-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "98765432-1",
    "nombre": "Usuario",
    "apellido": "Normal",
    "email": "usuario@normal.com",
    "password": "Password123!"
  }'

# Deberías recibir:
# - mensaje: "Tu cuenta está pendiente de aprobación..."
# - NO access_token

# 2. Intentar login (debe fallar)
curl -X POST https://tu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@normal.com",
    "password": "Password123!"
  }'

# Deberías recibir:
# - statusCode: 401
# - message: "Tu cuenta está pendiente de aprobación por un administrador"

# 3. Como Super Admin, aprobar el usuario
# (Necesitas el token del Super Admin)
curl -X POST https://tu-backend.onrender.com/api/usuarios/98765432-1/aprobar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "rol": "usuario"
  }'

# 4. Ahora el usuario puede hacer login
curl -X POST https://tu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@normal.com",
    "password": "Password123!"
  }'

# Ahora SÍ recibe access_token
```

## 📊 Monitoreo Post-Deployment

### Verificar Logs en Render

1. En Render Dashboard, ve a tu servicio web
2. Click en "Logs" en el menú lateral
3. Buscar mensajes como:
   - ✅ "Migration completed successfully"
   - ✅ "Server running on port..."
   - ⚠️ Cualquier error relacionado con la migración

### Verificar Base de Datos

#### Opción A: Via Render Shell
1. En Render Dashboard, ve a tu servicio de PostgreSQL
2. Click en "Connect" → "External Connection"
3. Copia el comando PSQL
4. Ejecuta desde tu terminal local

#### Opción B: Via terminal local
```bash
# Obtener DATABASE_URL desde Render Dashboard
# Environment Variables → DATABASE_URL
psql "postgresql://user:password@host:port/dbname"

# Verificar que las columnas existen
\d usuarios

# Deberías ver:
# - estado (enum)
# - aprobado_por (varchar)
# - fecha_aprobacion (timestamp)
# - motivo_rechazo (text)

# Verificar enum de roles
SELECT unnest(enum_range(NULL::usuarios_rol_enum));
# Debería mostrar: super_admin, admin, usuario

# Verificar enum de estados
SELECT unnest(enum_range(NULL::usuarios_estado_enum));
# Debería mostrar: pendiente, aprobado, rechazado, suspendido

# Salir
\q
```

## 🔒 Checklist de Seguridad Post-Deployment

- [ ] Variable `SUPER_ADMIN_EMAILS` configurada en Render
- [ ] Servidor reiniciado (TypeORM sincronizará automáticamente si `synchronize: true`)
- [ ] O migración ejecutada (solo si `synchronize: false` en producción)
- [ ] Super Admin puede registrarse e iniciar sesión
- [ ] Usuario normal queda en estado PENDIENTE
- [ ] Usuario pendiente NO puede iniciar sesión
- [ ] Super Admin puede aprobar usuarios
- [ ] Usuario aprobado puede iniciar sesión
- [ ] No se puede enviar `rol` en el registro (debe dar error 400)
- [ ] Endpoints administrativos protegidos con Guards
- [ ] Documentación de Swagger actualizada
- [ ] CORS configurado para permitir requests desde Vercel

## 🆘 Troubleshooting

### Problema: "TypeORM no sincroniza los cambios"

Si usas `synchronize: true` y los cambios no se aplican:

1. **Verificar configuración**:
   - Revisar `database.config.ts` que `synchronize: true` esté activo
   - Verificar que `NODE_ENV=development` o `TYPEORM_SYNCHRONIZE=true`

2. **Reiniciar servidor**:
   - Render Dashboard → tu servicio → Manual Deploy → Clear build cache & deploy

3. **Verificar logs**:
   - Render Dashboard → Logs
   - Buscar errores de TypeORM o PostgreSQL

4. **Si necesitas migraciones** (solo si `synchronize: false`):
   ```bash
   # Generar migración desde entidades
   yarn migration:generate -n AgregarSistemaAprobacionUsuarios
   
   # Ejecutar migración
   yarn migration:run
   ```

### Problema: "No puedo registrarme como Super Admin"

1. Verificar variable de entorno en Render:
   - Dashboard → tu servicio → Environment
   - Buscar `SUPER_ADMIN_EMAILS`

2. Verificar que el email esté exactamente igual (minúsculas):
```bash
# ✅ Correcto
SUPER_ADMIN_EMAILS=juan@example.com

# ❌ Incorrecto (con espacios después de coma)
SUPER_ADMIN_EMAILS=juan@example.com, pedro@example.com

# ✅ Correcto (sin espacios)
SUPER_ADMIN_EMAILS=juan@example.com,pedro@example.com
```

3. Guardar cambios y esperar a que Render reinicie automáticamente (toma 1-2 minutos)

### Problema: "Usuario aprobado no puede iniciar sesión"

Verificar en la base de datos:
```sql
SELECT rut, email, rol, estado, activo FROM usuarios WHERE email = 'email@usuario.com';
```

El usuario debe tener:
- `estado = 'aprobado'`
- `activo = true`

Si no:
```sql
UPDATE usuarios 
SET estado = 'aprobado', activo = true 
WHERE email = 'email@usuario.com';
```

### Problema: "Todos los usuarios quedan en PENDIENTE"

Si olvidaste configurar `SUPER_ADMIN_EMAILS`, puedes:

1. Aprobar un usuario manualmente en la BD:
```sql
UPDATE usuarios 
SET 
  rol = 'super_admin', 
  estado = 'aprobado',
  fecha_aprobacion = NOW()
WHERE email = 'tu@email.com';
```

2. Luego usa ese usuario para aprobar a otros desde la API

## 📝 Notas Finales

### Usuarios Existentes

Si ya tenías usuarios en la BD antes de esta migración:
- ✅ Todos fueron actualizados a estado `APROBADO` automáticamente
- ✅ Pueden seguir iniciando sesión normalmente
- ⚠️ Verifica que sus roles sean correctos

### Próximos Pasos Recomendados

1. **Frontend**: Implementar UI para:
   - Lista de usuarios pendientes
   - Botones de aprobar/rechazar
   - Estados visuales de usuarios

2. **Notificaciones**: Implementar emails cuando:
   - Usuario es aprobado
   - Usuario es rechazado
   - Nuevo usuario pendiente (notificar admins)

3. **Auditoría**: Implementar logs de:
   - Quién aprobó a quién
   - Quién rechazó a quién
   - Cambios de estado

### Problema: "CORS Error desde el Frontend en Vercel"

Si el frontend no puede conectarse al backend:

1. Verificar variable `FRONTEND_URL` en Render:
```bash
# Debe apuntar a tu dominio de Vercel
FRONTEND_URL=https://tu-app.vercel.app
```

2. Si usas múltiples dominios (preview deployments de Vercel):
```bash
# En app.module.ts o main.ts, considera usar un patrón más flexible
FRONTEND_URL=https://*.vercel.app
```

## 🔄 Integración con Vercel (Frontend)

### Variables de Entorno en Vercel

Asegúrate de tener configurado en Vercel (Settings → Environment Variables):

```bash
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

**⚠️ IMPORTANTE**: Después de agregar/modificar variables en Vercel, debes hacer un nuevo deploy para que se apliquen.

### Redeploy del Frontend

Si necesitas actualizar el frontend después de estos cambios:

```bash
# Desde tu repositorio local
git add .
git commit -m "feat: integrar sistema de aprobación de usuarios"
git push origin main

# Vercel hará deploy automáticamente
```

## 📚 Documentación Adicional

- Ver `SISTEMA_APROBACION_USUARIOS.md` para documentación completa
- Ver `VARIABLES_ENTORNO.md` para todas las variables requeridas
- Ver Swagger docs en: `https://tu-backend.onrender.com/api/docs`

## 🌐 URLs de Producción

- **Backend (Render)**: `https://tu-backend.onrender.com`
- **Frontend (Vercel)**: `https://tu-app.vercel.app`
- **Documentación API (Swagger)**: `https://tu-backend.onrender.com/api/docs`

---

**Implementado por**: Cursor AI Assistant  
**Fecha**: Diciembre 2024  
**Versión**: 1.0.0  
**Infraestructura**: Backend en Render + Frontend en Vercel

