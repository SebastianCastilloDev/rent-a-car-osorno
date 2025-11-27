# 🐳 Configuración Docker para Desarrollo Local

Este proyecto utiliza Docker solo para la base de datos PostgreSQL en desarrollo local. El backend se ejecuta directamente en tu máquina, lo que facilita el despliegue en Render.

## 📋 Prerrequisitos

- Docker y Docker Compose instalados
- Node.js >= 18
- Yarn

## 🚀 Inicio Rápido

### 1. Iniciar la base de datos

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará PostgreSQL 16 en el puerto 5432.

### 2. Verificar que la base de datos está corriendo

```bash
docker-compose ps
```

Deberías ver el contenedor `rent-a-car-postgres` con estado `Up`.

### 3. Configurar el backend

```bash
cd backend
cp .env.example .env
# El .env ya está configurado para conectarse a la base de datos local
```

### 4. Iniciar el backend

```bash
cd backend
yarn install
yarn start:dev
```

## 🛠️ Comandos Útiles

### Ver logs de la base de datos

```bash
docker-compose logs -f postgres
```

### Detener la base de datos

```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ elimina los datos)

```bash
docker-compose down -v
```

### Reiniciar la base de datos

```bash
docker-compose restart postgres
```

### Conectarse a la base de datos con psql

```bash
docker-compose exec postgres psql -U postgres -d rentacar_db
```

## 📊 Información de la Base de Datos

- **Imagen**: `postgres:16-alpine`
- **Puerto**: `5432`
- **Usuario**: `postgres`
- **Contraseña**: `postgres`
- **Base de datos**: `rentacar_db`
- **Host**: `localhost` (desde tu máquina)

## 🔄 Migraciones

Las migraciones de TypeORM se ejecutarán automáticamente en desarrollo (cuando `NODE_ENV=development` y `synchronize: true` en la configuración).

Para producción, usa:

```bash
yarn typeorm migration:run
```

## 🚨 Notas Importantes

1. **Solo para desarrollo**: Este Docker Compose es solo para desarrollo local
2. **Render**: En producción, Render manejará la base de datos automáticamente
3. **Volúmenes**: Los datos se persisten en un volumen de Docker llamado `postgres_data`
4. **Puerto**: Asegúrate de que el puerto 5432 no esté en uso por otra instancia de PostgreSQL

## 🐛 Troubleshooting

### El puerto 5432 ya está en uso

Si tienes PostgreSQL instalado localmente, detén el servicio:

```bash
# macOS
brew services stop postgresql

# Linux
sudo systemctl stop postgresql
```

### No puedo conectarme a la base de datos

Verifica que el contenedor esté corriendo:

```bash
docker-compose ps
```

Revisa los logs:

```bash
docker-compose logs postgres
```

### Resetear la base de datos

```bash
docker-compose down -v
docker-compose up -d
```

Esto eliminará todos los datos y creará una base de datos limpia.


