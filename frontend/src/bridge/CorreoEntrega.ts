import emailjs from '@emailjs/browser';
import { EntregaRecibo } from './EntregaRecibo';
import type { ReciboRenderer } from './ReciboRenderer';
import type { DatosRecibo, EntregaResultado } from './recibo.types';

/**
 * PATRÓN BRIDGE — Abstracción refinada: Correo electrónico (EmailJS)
 *
 * Utiliza el mismo Implementador (ReciboRenderer) para generar el HTML
 * del recibo y lo envía directamente desde el navegador mediante EmailJS,
 * sin necesidad de pasar por el backend.
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
    // Genera el mismo HTML que usaría la impresión (Implementador compartido)
    const htmlBody = this.renderer.generarHTML(datos);

    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: this.email,
        numero_reserva: datos.numeroReserva,
        html_body: htmlBody,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    );

    return {
      ok: true,
      mensaje: `Recibo enviado a ${this.email}. Revisa tu bandeja de entrada.`,
    };
  }
}
