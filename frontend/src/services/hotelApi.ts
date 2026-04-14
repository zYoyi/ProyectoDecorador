import type {
  CotizarRequest,
  CotizarResponse,
  EnviarReciboRequest,
  EnviarReciboResponse,
  Extra,
  Habitacion,
} from '../types/hotel';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Error de conexión con el servidor' }));
    throw new Error(error.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const hotelApi = {
  getHabitaciones: (): Promise<Habitacion[]> => request('/hotel/habitaciones'),

  getExtras: (): Promise<Extra[]> => request('/hotel/extras'),

  cotizar: (data: CotizarRequest): Promise<CotizarResponse> =>
    request('/hotel/cotizar', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /** Patrón Bridge: envía el recibo (generado por PDFReciboRenderer) por correo */
  enviarRecibo: (data: EnviarReciboRequest): Promise<EnviarReciboResponse> =>
    request('/hotel/enviar-recibo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
