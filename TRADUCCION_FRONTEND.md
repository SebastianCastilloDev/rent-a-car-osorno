# Traducción del Frontend a Español

## 📋 Cambios Realizados

### ✅ Convención Adoptada

**Español:** Todo lo específico del dominio del negocio y nombres de variables/funciones propias  
**Inglés:** Términos técnicos estándar de la industria (email, password, id, token, etc.)

### Archivos Actualizados

#### 1. **Store de Autenticación** (`src/store/auth-store.ts`)

**Antes (inglés):**
```typescript
interface AuthState {
  token: string | null;
  user: LoginResponse['usuario'] | null;
  isAuthenticated: boolean;
  login: (response: LoginResponse) => void;
  logout: () => void;
}

const getStoredAuth = () => { ... }
```

**Ahora (español):**
```typescript
interface EstadoAutenticacion {
  token: string | null;
  usuario: LoginResponse['usuario'] | null;
  estaAutenticado: boolean;
  iniciarSesion: (response: LoginResponse) => void;
  cerrarSesion: () => void;
}

const obtenerAutenticacionAlmacenada = () => { ... }
```

#### 2. **Header** (`src/components/layout/Header.tsx`)

**Cambios:**
- `user` → `usuario`
- `logout` → `cerrarSesion`
- `handleLogout` → `manejarCierreSesion`

#### 3. **Dashboard Layout** (`app/(dashboard)/layout.tsx`)

**Cambios:**
- `isAuthenticated` → `estaAutenticado`

#### 4. **Página Principal** (`app/page.tsx`)

**Cambios:**
- `isAuthenticated` → `estaAutenticado`

#### 5. **Login** (`app/login/page.tsx`)

**Cambios:**
- `loginSchema` → `esquemaLogin`
- `LoginFormData` → `DatosFormularioLogin`
- `login` → `iniciarSesion`
- `isLoading` → `estaCargando`
- `formMethods` → `metodosFormulario`
- `onSubmit` → `alEnviar`
- `data` → `datos`
- `response` → `respuesta`
- `error` (variable local) → `errorApi` (para no confundir con estado `error`)

#### 6. **Register** (`app/register/page.tsx`)

**Cambios:**
- `registerSchema` → `esquemaRegistro`
- `RegisterFormData` → `DatosFormularioRegistro`
- `login` → `iniciarSesion`
- `isLoading` → `estaCargando`
- `onSubmit` → `alEnviar`
- `data` → `datos`
- `confirmPassword` → `confirmarPassword`
- `registerData` → `datosRegistro`
- `cleanData` → `datosLimpios`
- `response` → `respuesta`

### ✅ Lo que NO se tradujo (términos estándar)

- `email` - Término universal en programación
- `password` - Término estándar de seguridad
- `token` - Término técnico de autenticación
- `id` - Identificador universal
- `router` - Término de Next.js
- `register` (función de react-hook-form) - API estándar
- `handleSubmit` - API estándar de react-hook-form
- `errors` - Objeto estándar de react-hook-form
- Props de React (`children`, `className`, etc.)
- Hooks de React (`useState`, `useEffect`, etc.)
- Tipos de TypeScript (`string`, `null`, `boolean`, etc.)

### 📊 Proporción

- **Variables de negocio:** 100% español
- **Funciones propias:** 100% español  
- **Interfaces propias:** 100% español
- **Términos técnicos estándar:** 100% inglés

## 🎯 Ventajas de esta Convención

1. **Legibilidad:** El código es más fácil de leer en tu idioma nativo
2. **Consistencia con backend:** Los nombres coinciden con el backend NestJS
3. **Estándares:** Se mantienen los términos técnicos universales
4. **Mantenibilidad:** Es claro qué es del dominio y qué es técnico

## 📝 Ejemplos de Convención

### ✅ CORRECTO

```typescript
// Interfaz propia - español
interface EstadoAutenticacion {
  token: string;  // término técnico - inglés
  usuario: Usuario;  // dominio - español
  estaAutenticado: boolean;  // dominio - español
}

// Función propia - español
const iniciarSesion = async (datos: DatosLogin) => {
  const respuesta = await authApi.login(datos);  // API externa - inglés
  return respuesta;
};
```

### ❌ INCORRECTO

```typescript
// Todo en inglés (difícil de leer)
interface AuthenticationState {
  token: string;
  user: User;
  isAuthenticated: boolean;
}

// O todo en español (incluso términos técnicos)
interface EstadoAutenticacion {
  ficha: cadena;  // ❌ No traducir "token"
  usuario: Usuario;
  estaAutenticado: booleano;  // ❌ No traducir tipos
}
```

## 🚀 Estado Actual

✅ **Frontend compilando correctamente**  
✅ **Consistencia con backend**  
✅ **Código más legible**  
✅ **Convención clara y documentada**

## 📖 Guía para Futuros Desarrollos

Al agregar nuevas funcionalidades, seguir esta regla:

**¿Es un término que existe en cualquier lenguaje de programación?**
- ✅ Sí → Dejarlo en inglés (email, password, token, id)
- ❌ No → Escribirlo en español (iniciarSesion, cerrarSesion, obtenerDatos)

**¿Es una API externa o librería?**
- ✅ Sí → Usar su terminología original (router, handleSubmit, useState)
- ❌ No → Escribirlo en español

**¿Es del dominio del negocio?**
- ✅ Sí → Siempre en español (usuario, chofer, vehículo, multa, gasto)

