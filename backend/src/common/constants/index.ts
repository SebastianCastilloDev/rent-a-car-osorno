// Roles de usuario
export enum RolUsuario {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USUARIO = 'usuario',
}

// Estados de usuario (aprobación)
export enum EstadoUsuario {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  SUSPENDIDO = 'suspendido',
}

// Estados de revisión técnica
export enum EstadoRevisionTecnica {
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
  HOMOLOGADA = 'Homologada',
}

// Estados de pago de multa
export enum EstadoPagoMulta {
  PAGADA = 'Pagada',
  PENDIENTE = 'Pendiente',
}

// Categorías de gasto
export enum CategoriaGasto {
  COMBUSTIBLE = 'Combustible',
  MANTENIMIENTO = 'Mantenimiento',
  PEAJE = 'Peaje',
}

// Días de alerta para vencimientos
export const DIAS_ALERTA_VENCIMIENTO = [30, 15, 7];
