export enum CategoriaGasto {
  COMBUSTIBLE = 'Combustible',
  MANTENIMIENTO = 'Mantenimiento',
  PEAJE = 'Peaje',
}

export interface Gasto {
  id: number;
  vehiculoPatente: string;
  fecha: string;
  categoria: CategoriaGasto;
  monto: number;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateGastoInput {
  vehiculoPatente: string;
  fecha: string;
  categoria: CategoriaGasto;
  monto: number;
  descripcion?: string;
}

export interface UpdateGastoInput extends Partial<CreateGastoInput> {}
