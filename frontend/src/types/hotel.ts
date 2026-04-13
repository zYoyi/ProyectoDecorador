export interface Habitacion {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  imagen: string;
  amenidades: string[];
}

export interface Extra {
  id: string;
  nombre: string;
  descripcion: string;
  costo: number;
  icono: string;
}

export interface CotizarRequest {
  tipo: string;
  extras: string[];
}

export interface CotizarResponse {
  tipo: string;
  extras: string[];
  descripcion: string;
  costo: number;
}

export interface EstadoReserva {
  habitacion: Habitacion | null;
  extrasSeleccionados: Extra[];
  cotizacion: CotizarResponse | null;
}
