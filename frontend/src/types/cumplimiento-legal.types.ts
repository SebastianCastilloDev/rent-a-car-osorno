export enum EstadoRevisionTecnica {
  APROBADA = 'Aprobada',
  RECHAZADA = 'Rechazada',
  HOMOLOGADA = 'Homologada',
}

export interface RevisionTecnica {
  id: number;
  vehiculoPatente: string;
  fechaRevision: string;
  estado: EstadoRevisionTecnica;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateRevisionTecnicaInput {
  vehiculoPatente: string;
  fechaRevision: string;
  estado: EstadoRevisionTecnica;
  observaciones?: string;
}

export interface UpdateRevisionTecnicaInput extends Partial<CreateRevisionTecnicaInput> {}

export interface PermisoCirculacion {
  id: number;
  vehiculoPatente: string;
  anio: number;
  montoPermiso: number;
  montoSoap: number;
  fechaPago?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreatePermisoCirculacionInput {
  vehiculoPatente: string;
  anio: number;
  montoPermiso: number;
  montoSoap: number;
  fechaPago?: string;
}

export interface UpdatePermisoCirculacionInput extends Partial<CreatePermisoCirculacionInput> {}
