# Variables de Entorno Requeridas

## Configuración de Base de Datos

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui
DB_NAME=rentacar_db
```

## Configuración JWT

```bash
JWT_SECRET=tu_secret_key_muy_segura_aqui_cambiala_en_produccion
JWT_EXPIRATION=24h
```

## Configuración del Servidor

```bash
PORT=3000
NODE_ENV=development
```

## Configuración CORS

```bash
FRONTEND_URL=http://localhost:3001
```

## **NUEVA**: Super Admin Emails

```bash
# Lista de emails que serán automáticamente SUPER_ADMIN al registrarse
# Separar múltiples emails con comas, SIN espacios
SUPER_ADMIN_EMAILS=admin@example.com,superadmin@example.com
```

### Ejemplos de Configuración

**Un solo Super Admin:**
```bash
SUPER_ADMIN_EMAILS=sebastian@rentacar.cl
```

**Múltiples Super Admins:**
```bash
SUPER_ADMIN_EMAILS=sebastian@rentacar.cl,admin@rentacar.cl,gerente@rentacar.cl
```

### ⚠️ Importante

- Los emails deben estar en **minúsculas**
- **NO** usar espacios después de las comas
- Si la variable está vacía o no existe, no habrá Super Admins automáticos
- Los usuarios con estos emails serán aprobados automáticamente al registrarse

## Logger

```bash
LOG_LEVEL=info
```

## Ejemplo Completo de .env

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=miPasswordSeguro123!
DB_NAME=rentacar_db

# JWT
JWT_SECRET=esto_es_un_secret_muy_seguro_cambiar_en_produccion_12345
JWT_EXPIRATION=24h

# Server
PORT=3000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3001

# Super Admins
SUPER_ADMIN_EMAILS=sebastian@rentacar.cl,admin@rentacar.cl

# Logger
LOG_LEVEL=info
```

