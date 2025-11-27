export enum EstadoPagoMulta {
  PAGADA = 'Pagada',
  PENDIENTE = 'Pendiente',
}

export interface Multa {
  id: number;
  vehiculoPatente: string;
  fechaInfraccion: string;
  tipoInfraccion: string;
  monto: number;
  estadoPago: EstadoPagoMulta;
  descripcion?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateMultaInput {
  vehiculoPatente: string;
  fechaInfraccion: string;
  tipoInfraccion: string;
  monto: number;
  estadoPago: EstadoPagoMulta;
  descripcion?: string;
}

export interface UpdateMultaInput extends Partial<CreateMultaInput> {}
