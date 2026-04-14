import { EntregaRecibo } from './EntregaRecibo';
import type { ReciboRenderer } from './ReciboRenderer';
import type { DatosRecibo, EntregaResultado } from './recibo.types';
import { hotelApi } from '../services/hotelApi';

/**
 * PATRÓN BRIDGE — Abstracción refinada: Correo electrónico
 *
 * Utiliza el mismo Implementador (ReciboRenderer) para generar el HTML
 * del recibo y lo envía al backend, que lo usa como cuerpo del correo.
 *
 * Este es el punto central del Bridge: ImprimirEntrega y CorreoEntrega
 * comparten exactamente el mismo renderer (mismo formato visual) pero
 * difieren solo en cómo lo entregan al usuario final.
 */
export class CorreoEntrega extends EntregaRecibo {
  private readonly email: string;

  constructor(renderer: ReciboRenderer, email: string) {
    super(renderer);
    this.email = email;
  }

  async entregar(datos: DatosRecibo): Promise<EntregaResultado> {
    // Genera el mismo HTML que usaría la impresión
    const htmlBody = this.renderer.generarHTML(datos);

    // Envía al backend junto con los metadatos esenciales
    const resultado = await hotelApi.enviarRecibo({
      email: this.email,
      htmlBody,
      numeroReserva: datos.numeroReserva,
      costoTotal: datos.cotizacion.costo,
    });

    return resultado;
  }
}
