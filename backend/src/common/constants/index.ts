// Roles de usuario
export enum RolUsuario {
  ADMIN = 'admin',
  USUARIO = 'usuario',
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
