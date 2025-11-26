#!/bin/bash

# Script para configurar el entorno de desarrollo
# Uso: ./scripts/dev-setup.sh

set -e

echo "🚀 Configurando entorno de desarrollo..."

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo. Por favor inicia Docker Desktop."
    exit 1
fi

# Iniciar base de datos
echo "📦 Iniciando PostgreSQL en Docker..."
docker-compose up -d postgres

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que PostgreSQL esté listo..."
timeout=30
counter=0
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
    counter=$((counter + 1))
    if [ $counter -ge $timeout ]; then
        echo "❌ Timeout esperando a PostgreSQL"
        exit 1
    fi
done

echo "✅ PostgreSQL está listo!"

# Verificar si existe .env en backend
if [ ! -f "backend/.env" ]; then
    echo "📝 Creando archivo .env desde .env.example..."
    cp backend/.env.example backend/.env
    echo "✅ Archivo .env creado. Por favor revisa las configuraciones si es necesario."
else
    echo "ℹ️  El archivo .env ya existe, no se sobrescribirá."
fi

echo ""
echo "✨ Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "  1. cd backend"
echo "  2. yarn install"
echo "  3. yarn start:dev"
echo ""
echo "La base de datos está disponible en:"
echo "  - Host: localhost"
echo "  - Puerto: 5432"
echo "  - Usuario: postgres"
echo "  - Base de datos: rentacar_db"

