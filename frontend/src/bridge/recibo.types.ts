/**
 * PATRÓN BRIDGE — Tipos compartidos
 *
 * Define la estructura de datos que fluye entre la Abstracción
 * (EntregaRecibo) y el Implementador (ReciboRenderer).
 */
export interface DatosRecibo {
  numeroReserva: string;
  fecha: string;
  habitacion: {
    nombre: string;
    descripcion: string;
    costo: number;
  };
  extrasSeleccionados: {
    nombre: string;
    descripcion: string;
    costo: number;
    icono: string;
  }[];
  cotizacion: {
    descripcion: string;
    costo: number;
  };
}

export interface EntregaResultado {
  ok: boolean;
  mensaje: string;
  /** URL de vista previa (solo en modo demo/Ethereal) */
  previewUrl?: string;
}
