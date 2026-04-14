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

// ── Patrón Bridge: envío de recibo ──────────────────────────────────────────

export interface EnviarReciboRequest {
  /** Dirección de correo destino */
  email: string;
  /** HTML completo generado por el ReciboRenderer (PDFReciboRenderer) */
  htmlBody: string;
  /** Número de reserva para el asunto del correo */
  numeroReserva: string;
  /** Costo total para el asunto del correo */
  costoTotal: number;
}

export interface EnviarReciboResponse {
  ok: boolean;
  mensaje: string;
  /** URL de vista previa Ethereal (solo en modo demo sin SMTP real) */
  previewUrl?: string;
}
