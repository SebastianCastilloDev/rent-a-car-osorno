import { Vehiculo } from './vehiculo.types';

export interface Chofer {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  vehiculos?: Vehiculo[];
}

export interface CreateChoferInput {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string;
}

export interface UpdateChoferInput extends Partial<CreateChoferInput> {}
