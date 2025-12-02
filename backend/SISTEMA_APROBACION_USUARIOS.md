# Sistema de Aprobación de Usuarios

## 🏗️ Infraestructura

- **Backend**: Render (NestJS + PostgreSQL)
- **Frontend**: Vercel (NextJS)

## Descripción General

Este sistema implementa un flujo de aprobación de usuarios robusto y seguro, donde los usuarios deben ser aprobados por un administrador antes de poder acceder al sistema.

## Roles de Usuario

### 1. SUPER_ADMIN
- **Cómo se asigna**: Automáticamente al registrarse con un email en la lista blanca (variable de entorno `SUPER_ADMIN_EMAILS`)
- **Permisos**: Control total del sistema, incluyendo:
  - Aprobar/rechazar usuarios
  - Suspender/reactivar usuarios
  - Gestionar todos los recursos del sistema
  - No puede ser suspendido
  - Tiene acceso a todas las funcionalidades

### 2. ADMIN
- **Cómo se asigna**: Un SUPER_ADMIN o ADMIN puede aprobar a un usuario pendiente y asignarle el rol ADMIN
- **Permisos**:
  - Aprobar/rechazar usuarios
  - Suspender/reactivar usuarios (excepto SUPER_ADMIN)
  - Gestionar recursos del sistema

### 3. USUARIO
- **Cómo se asigna**: Por defecto al registrarse (sin estar en la lista blanca)
- **Permisos**: Permisos básicos del sistema según las funcionalidades implementadas

## Estados de Usuario

### 1. PENDIENTE
- Usuario registrado pero no aprobado
- No puede iniciar sesión
- Debe esperar aprobación de un administrador

### 2. APROBADO
- Usuario aprobado por un administrador
- Puede iniciar sesión normalmente
- Tiene acceso según su rol

### 3. RECHAZADO
- Usuario rechazado por un administrador
- No puede iniciar sesión
- Se guarda el motivo del rechazo
- Puede ser reactivado posteriormente

### 4. SUSPENDIDO
- Usuario suspendido temporalmente
- No puede iniciar sesión
- Se guarda el motivo de la suspensión
- Puede ser reactivado posteriormente

## Configuración

### Variables de Entorno

Agregar en el archivo `.env`:

```bash
# Lista de emails de Super Administradores (separados por comas)
SUPER_ADMIN_EMAILS=tu@email.com,otro@email.com
```

**Importante**: Los emails deben estar separados por comas, sin espacios innecesarios.

### Ejemplo de Configuración

```bash
# .env
SUPER_ADMIN_EMAILS=sebastian@example.com,admin@example.com
```

Cuando alguien se registre con `sebastian@example.com`:
- ✅ Se asigna automáticamente el rol **SUPER_ADMIN**
- ✅ Estado: **APROBADO**
- ✅ Puede iniciar sesión inmediatamente

Cuando alguien se registre con otro email:
- ℹ️ Se asigna el rol **USUARIO**
- ⏳ Estado: **PENDIENTE**
- ❌ No puede iniciar sesión hasta ser aprobado

## Flujo de Registro y Aprobación

### Para Usuarios en Lista Blanca (Super Admins)

```
1. Usuario se registra con email en SUPER_ADMIN_EMAILS
   ↓
2. Sistema asigna automáticamente:
   - Rol: SUPER_ADMIN
   - Estado: APROBADO
   ↓
3. Usuario puede iniciar sesión inmediatamente
   ↓
4. Recibe token JWT con permisos completos
```

### Para Usuarios Normales

```
1. Usuario se registra con email NO en lista blanca
   ↓
2. Sistema asigna automáticamente:
   - Rol: USUARIO
   - Estado: PENDIENTE
   ↓
3. Usuario recibe mensaje: "Tu cuenta está pendiente de aprobación"
   ↓
4. Usuario NO puede iniciar sesión
   ↓
5. Admin revisa usuario pendiente
   ↓
6. Admin aprueba/rechaza:
   │
   ├─ APROBAR ─> Estado: APROBADO
   │             Usuario puede iniciar sesión
   │
   └─ RECHAZAR ─> Estado: RECHAZADO
                  Usuario NO puede iniciar sesión
                  Se guarda motivo del rechazo
```

## Endpoints de API

### Listar Usuarios Pendientes
```http
GET /api/usuarios/pendientes/aprobacion
Authorization: Bearer {token}
Roles permitidos: SUPER_ADMIN, ADMIN
```

### Aprobar Usuario
```http
POST /api/usuarios/{rut}/aprobar
Authorization: Bearer {token}
Content-Type: application/json
Roles permitidos: SUPER_ADMIN, ADMIN

Body (opcional):
{
  "rol": "admin"  // Si no se especifica, mantiene rol actual
}
```

### Rechazar Usuario
```http
POST /api/usuarios/{rut}/rechazar
Authorization: Bearer {token}
Content-Type: application/json
Roles permitidos: SUPER_ADMIN, ADMIN

Body:
{
  "motivoRechazo": "No cumple con los requisitos de la empresa"
}
```

### Suspender Usuario
```http
POST /api/usuarios/{rut}/suspender
Authorization: Bearer {token}
Content-Type: application/json
Roles permitidos: SUPER_ADMIN, ADMIN

Body:
{
  "motivo": "Violación de términos de uso"
}
```

### Reactivar Usuario
```http
POST /api/usuarios/{rut}/reactivar
Authorization: Bearer {token}
Roles permitidos: SUPER_ADMIN, ADMIN
```

### Listar por Estado
```http
GET /api/usuarios/estado/{estado}
Authorization: Bearer {token}
Roles permitidos: SUPER_ADMIN, ADMIN

Estados válidos: pendiente, aprobado, rechazado, suspendido
```

## Mensajes de Error al Intentar Login

### Estado PENDIENTE
```json
{
  "statusCode": 401,
  "message": "Tu cuenta está pendiente de aprobación por un administrador"
}
```

### Estado RECHAZADO
```json
{
  "statusCode": 401,
  "message": "Tu cuenta ha sido rechazada. Motivo: No cumple requisitos"
}
```

### Estado SUSPENDIDO
```json
{
  "statusCode": 401,
  "message": "Tu cuenta ha sido suspendida"
}
```

## Seguridad Implementada

### 1. ✅ No se puede enviar rol en el registro
El campo `rol` fue **eliminado** del `RegisterDto`, por lo que ningún usuario puede auto-asignarse un rol al registrarse.

### 2. ✅ Lista blanca de Super Admins
Solo los emails en `SUPER_ADMIN_EMAILS` pueden ser Super Admins.

### 3. ✅ No se puede asignar SUPER_ADMIN manualmente
Al aprobar un usuario, no se puede asignar el rol `SUPER_ADMIN`, solo `ADMIN` o `USUARIO`.

### 4. ✅ Super Admins no pueden ser suspendidos
El sistema previene que un Super Admin sea suspendido.

### 5. ✅ Guards de autorización
- `JwtAuthGuard`: Verifica token JWT válido
- `RolesGuard`: Verifica que el usuario tenga el rol requerido
- `@Roles()`: Decorador para especificar roles permitidos por endpoint

### 6. ✅ Verificación de estado en login
El sistema verifica el estado del usuario antes de permitir el login.

## Migración de Base de Datos

Se incluye una migración que:
1. Agrega el rol `SUPER_ADMIN` al enum de roles
2. Crea el enum de estados de usuario
3. Agrega columnas: `estado`, `aprobado_por`, `fecha_aprobacion`, `motivo_rechazo`
4. Crea FK de `aprobado_por` hacia `usuarios`
5. Actualiza usuarios existentes a estado `APROBADO`

### Ejecutar Migración

```bash
# Ejecutar migración
yarn migration:run

# Revertir migración (si es necesario)
yarn migration:revert
```

## Seed de Usuario Administrador

El seed crea un usuario Super Admin inicial:

```
RUT: 11111111-1
Email: admin@rentacar.cl
Password: Admin123!
Rol: SUPER_ADMIN
Estado: APROBADO
```

### Ejecutar Seed

```bash
yarn seed:run
```

## Recomendaciones de Uso

### 1. Primera Configuración
```bash
# 1. Configurar variable de entorno
echo "SUPER_ADMIN_EMAILS=tu@email.com" >> .env

# 2. Ejecutar migración
yarn migration:run

# 3. Ejecutar seed (opcional, si necesitas un admin inicial)
yarn seed:run

# 4. Iniciar servidor
yarn start:dev
```

### 2. Agregar Nuevo Super Admin
1. Agregar email a `SUPER_ADMIN_EMAILS` en `.env`
2. Reiniciar servidor
3. Usuario se registra con ese email
4. Automáticamente es Super Admin

### 3. Flujo de Onboarding de Empleados
1. Empleado se registra en el sistema
2. Admin recibe notificación (implementar)
3. Admin revisa usuarios pendientes: `GET /api/usuarios/pendientes/aprobacion`
4. Admin aprueba con rol apropiado: `POST /api/usuarios/{rut}/aprobar`
5. Empleado recibe notificación (implementar)
6. Empleado puede iniciar sesión

### 4. Gestión de Usuarios Problemáticos
```bash
# Suspender temporalmente
POST /api/usuarios/{rut}/suspender
{ "motivo": "Investigación pendiente" }

# Reactivar después de investigación
POST /api/usuarios/{rut}/reactivar
```

## Próximas Mejoras (Opcional)

- [ ] Sistema de notificaciones por email
- [ ] Dashboard de gestión de usuarios en frontend
- [ ] Auditoría de acciones administrativas
- [ ] Logs de intentos de login fallidos
- [ ] Sistema de 2FA para Super Admins
- [ ] Expiración automática de cuentas rechazadas/suspendidas
- [ ] Historial de cambios de estado de usuario

## Soporte

Para cualquier duda o problema:
1. Revisar esta documentación
2. Revisar logs del servidor
3. Verificar variables de entorno
4. Consultar documentación de Swagger en `/api/docs`

