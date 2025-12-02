export interface Vehiculo {
  patente: string;
  dv: string;
  proveedor?: string;
  numeroFactura?: string;
  fechaCompra?: string;
  tipo: string;
  condicion?: string;
  anio: number;
  marca: string;
  modelo: string;
  motor?: string;
  chassis?: string;
  color?: string;
  transmision?: string;
  combustible?: string;
  ubicacionActual?: string;
  choferRut?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateVehiculoInput {
  patente: string;
  dv: string;
  proveedor?: string;
  numeroFactura?: string;
  fechaCompra?: string;
  tipo: string;
  condicion?: string;
  anio: number;
  marca: string;
  modelo: string;
  motor?: string;
  chassis?: string;
  color?: string;
  transmision?: string;
  combustible?: string;
  ubicacionActual?: string;
  choferRut?: string;
}

export interface UpdateVehiculoInput extends Partial<CreateVehiculoInput> {}
