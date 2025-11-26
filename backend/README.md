# 🚗 Backend - Sistema de Gestión de Flota Rent-a-Car

Backend desarrollado con NestJS para la gestión de flota de vehículos, choferes, cumplimiento legal y gastos operacionales.

## 🏗️ Arquitectura

El proyecto sigue los principios de **Clean Architecture** y **Domain-Driven Design (DDD)**:

- **Módulos**: Cada dominio de negocio tiene su propio módulo autocontenido
- **Separación de capas**: Entities, Services, Controllers, DTOs
- **Repositorios**: Abstracción de acceso a datos mediante TypeORM
- **Validación**: DTOs con class-validator para validación de entrada
- **Documentación**: Swagger/OpenAPI para documentación automática de API

## 📦 Stack Tecnológico

- **Framework**: NestJS 10.x
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Autenticación**: JWT (Passport)
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston
- **Seguridad**: Helmet, Rate Limiting
- **Gestor de Paquetes**: Yarn

## 🚀 Instalación

### Prerrequisitos

- Node.js >= 18
- PostgreSQL >= 14
- Yarn

### Pasos

1. **Instalar dependencias**:
```bash
yarn install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de base de datos.

3. **Crear base de datos**:
```sql
CREATE DATABASE rentacar_db;
```

4. **Ejecutar migraciones** (cuando estén disponibles):
```bash
yarn typeorm migration:run
```

5. **Iniciar servidor de desarrollo**:
```bash
yarn start:dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📚 Documentación API

Una vez iniciado el servidor, la documentación Swagger está disponible en:

```
http://localhost:3000/api/docs
```

## 🗂️ Estructura del Proyecto

```
backend/
├── src/
│   ├── main.ts                 # Punto de entrada
│   ├── app.module.ts           # Módulo raíz
│   ├── config/                 # Configuraciones
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── swagger.config.ts
│   │   └── winston.config.ts
│   ├── common/                 # Código compartido
│   │   ├── filters/           # Filtros de excepciones
│   │   ├── guards/            # Guards de autenticación
│   │   ├── utils/             # Utilidades
│   │   └── constants/         # Constantes
│   └── modules/               # Módulos de negocio
│       ├── auth/              # Autenticación
│       ├── usuarios/           # Gestión de usuarios
│       ├── vehiculos/         # Gestión de vehículos
│       ├── choferes/          # Gestión de choferes
│       ├── cumplimiento-legal/# Cumplimiento legal
│       ├── gastos/            # Gestión de gastos
│       └── multas/            # Gestión de multas
├── test/                      # Tests
└── logs/                      # Logs de aplicación
```

## 🔐 Autenticación

El sistema utiliza JWT para autenticación. Para obtener un token:

```bash
POST /api/auth/login
{
  "email": "usuario@example.com",
  "password": "password123"
}
```

El token debe incluirse en las peticiones protegidas:

```
Authorization: Bearer <token>
```

## 🧪 Testing

```bash
# Tests unitarios
yarn test

# Tests en modo watch
yarn test:watch

# Coverage
yarn test:cov

# Tests e2e
yarn test:e2e
```

## 📝 Scripts Disponibles

- `yarn start` - Inicia la aplicación en modo producción
- `yarn start:dev` - Inicia en modo desarrollo con hot-reload
- `yarn start:debug` - Inicia en modo debug
- `yarn build` - Compila el proyecto
- `yarn format` - Formatea el código con Prettier
- `yarn lint` - Ejecuta ESLint

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **JWT**: Autenticación stateless
- **bcrypt**: Encriptación de contraseñas
- **Validación**: Validación de todos los inputs
- **CORS**: Configurado para permitir solo orígenes específicos

## 📊 Logging

Los logs se guardan en la carpeta `logs/`:
- `error.log`: Solo errores
- `combined.log`: Todos los logs

## 🌍 Variables de Entorno

Ver `.env.example` para la lista completa de variables de entorno requeridas.

## 📄 Licencia

Propietario - Todos los derechos reservados
