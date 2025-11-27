export interface Chofer {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  vehiculos?: any[];
}

export interface CreateChoferInput {
  rut: string;
  nombre: string;
  apellido: string;
  telefono?: string;
}

export interface UpdateChoferInput extends Partial<CreateChoferInput> {}
