# Sistema de Gestión de Flota Rent-a-Car

## Descripción del Proyecto

Este es un sistema de gestión de flota para una empresa de arriendo de vehículos chilena, actualmente en fase de diseño de base de datos. El proyecto tiene como objetivo migrar desde múltiples hojas de Excel con datos redundantes a una base de datos relacional normalizada.

## Contexto de Arquitectura

### Estado Actual (ver `diagramas/situacion_actual*.mmd`)

- **Problema**: Datos dispersos en más de 4 hojas de Excel con duplicación extensa
- Hoja maestra (`rentacar-GENERAL`) contiene inventario de vehículos vinculado a:
  - Hojas de cumplimiento legal (Revisión Técnica, Permiso de Circulación)
  - Seguimiento de gastos (Gasto Combustible)
- Todas vinculadas vía `patente` con campos repetidos entre hojas

### Solución Propuesta (ver `diagramas/solucion_propuesta*.mmd`)

- **Entidades principales**: `Vehiculo`, `Chofer`, `RevisionTecnica`, `PermisoCirculacion`, `Multa`, `Gasto`
- **Clave primaria**: `patente` para vehículos, `rut` para choferes
- **Patrón de claves foráneas**: Usa `vehiculo_patente` y `chofer_rut` para las relaciones
- **Relaciones uno-a-muchos**: Un vehículo tiene múltiples revisiones, permisos, multas y gastos

## Convenciones del Modelo de Datos

### Campos Específicos de Chile

- `patente`: Placa patente (identificador principal para vehículos)
- `rut`: Número de RUT chileno (para choferes)
- `dv`: Dígito verificador para patente/rut
- `revision_tecnica`: Revisión técnica obligatoria de vehículo
- `permiso_circulacion`: Permiso de circulación anual
- `soap`: Seguro obligatorio de vehículo (Seguro Obligatorio de Accidentes Personales)

### Campos Categóricos con Valores Definidos

- `RevisionTecnica.estado`: 'Aprobada', 'Rechazada', 'Homologada'
- `Multa.estado_pago`: 'Pagada', 'Pendiente'
- `Gasto.categoria`: 'Combustible', 'Mantenimiento', 'Peaje'

### Patrón de Datos Temporales

- Los documentos legales (permisos, revisiones) están acotados en el tiempo con campos `fecha_*`
- `PermisoCirculacion` rastrea costos anuales (tanto permiso como SOAP) por año
- Los gastos en `Gasto` tienen marca de tiempo para seguimiento histórico

## Decisiones de Diseño

### Por Qué Tablas Separadas para Documentos Legales

- Los vehículos chilenos requieren múltiples documentos legales anuales/periódicos
- La separación permite seguimiento histórico (múltiples revisiones por vehículo en el tiempo)
- Evita la explosión de columnas por año vista en la estructura Excel actual (`permiso_2020`, `permiso_2021`, etc.)

### Por Qué `categoria` en Gasto en Lugar de Tablas Separadas

- Seguimiento flexible de gastos sin categorización rígida
- Se alinea con prácticas contables típicas donde los gastos se categorizan pero comparten atributos comunes

## Etapa de Desarrollo

**Nota**: Este proyecto está actualmente en **fase de diseño/planificación**. Solo existen diagramas de clases Mermaid en `diagramas/`. Al implementar:

1. Usar `solucion_propuesta.mmd` como fuente de verdad para el esquema de base de datos
2. Considerar formatos de fecha chilenos (DD/MM/YYYY) y moneda (CLP pesos chilenos)
3. Validar formato de `patente` según estándares chilenos
4. Incluir índices apropiados en claves foráneas y campos consultados frecuentemente (`patente`, `fecha_*`)

# Tecnicas de programación

## Patrones y arquitectura

- Vamos a construir una rest API con NestJS y typeorm con postgresql.
- Usa una arquitectura modular y escalable siguiendo las mejores prácticas de NestJS.
- Implementa CLEAN ARCHITECTURE, CLEAN CODE y DDD (Domain Driven Design).
- El frontenD será contruido con NextJS y TailwindCSS.
- Programa en español, este es un proyecto pequeño para una empresa chilena.
- Utiliza valores y convenciones chilenas (por ejemplo, RUT, patentes de vehículos, formatos de fecha y moneda).
- Usa control de versiones con Git y GitHub.
- Implementa pruebas unitarias y de integración para asegurar la calidad del código.
- Documenta el código y la API utilizando Swagger o herramientas similares.
- Configura CI/CD para despliegue automático y pruebas.
- Asegura la seguridad de la API con autenticación y autorización (por ejemplo, JWT), con usuario y contraseña. Además, implementa medidas de seguridad como CORS, rate limiting y protección contra ataques comunes (por ejemplo, inyección SQL, XSS).
- Crea un sistema de Roles minimalista (por ejemplo, admin, usuario) para gestionar permisos de acceso.
- Maneja errores y excepciones de manera adecuada, utiliza winston para el logging.
- Optimiza el rendimiento de la API y las consultas a la base de datos.
- Implementa paginación, filtrado y ordenamiento en los endpoints de la API.
- Usa variables de entorno para gestionar configuraciones sensibles.
- Sigue las mejores prácticas de seguridad para proteger los datos y la API.
