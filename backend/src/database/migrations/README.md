# Migraciones de Base de Datos

## ⚠️ Estado Actual: Desarrollo con Synchronize

Actualmente el proyecto está configurado con `synchronize: true` en desarrollo, lo que significa que **TypeORM crea/actualiza las tablas automáticamente** basándose en las entidades.

**Por lo tanto, NO es necesario crear migraciones en este momento.**

## 📝 Cuándo Usar Migraciones

Las migraciones son necesarias cuando:

1. **Producción**: `synchronize: false` (por seguridad)
2. **Control de versiones**: Necesitas versionar cambios de esquema
3. **Rollback**: Necesitas poder revertir cambios
4. **Equipo**: Múltiples desarrolladores trabajando en el mismo proyecto

## 🔄 Cuando Pases a Producción

Cuando estés listo para usar migraciones en producción:

1. **Desactivar synchronize**:
   ```typescript
   // En database.config.ts
   synchronize: false // En producción
   ```

2. **Generar migración desde entidades**:
   ```bash
   yarn migration:generate -n NombreDescriptivo
   ```

3. **Revisar y ajustar** la migración generada si es necesario

4. **Ejecutar en producción**:
   ```bash
   yarn migration:run
   ```

## 📚 Formato Correcto de Nombres de Migración

**❌ EVITAR**: Timestamps fijos con muchos ceros
```typescript
// MAL
1733184000000-AgregarSistemaAprobacionUsuarios.ts
```

**✅ USAR**: Formato estándar de TypeORM CLI
```bash
# TypeORM genera automáticamente con timestamp correcto
yarn migration:generate -n AgregarSistemaAprobacionUsuarios

# Resultado: 1234567890123-AgregarSistemaAprobacionUsuarios.ts
```

O formato manual sin timestamp (TypeORM lo agrega):
```typescript
// Nombre descriptivo, TypeORM agregará el timestamp
AgregarSistemaAprobacionUsuarios.ts
```

## 🛠️ Comandos Disponibles

```bash
# Generar migración desde entidades (cuando uses migraciones)
yarn migration:generate -n NombreDescriptivo

# Crear migración vacía
yarn migration:create -n NombreDescriptivo

# Ejecutar migraciones pendientes
yarn migration:run

# Revertir última migración
yarn migration:revert

# Ver estado de migraciones
yarn migration:show
```

## 📌 Nota Importante

**En desarrollo actual**: Las entidades se sincronizan automáticamente. Solo necesitarás migraciones cuando:
- Pases a producción
- Necesites control de versiones de esquema
- Trabajes en equipo y necesites sincronizar cambios

