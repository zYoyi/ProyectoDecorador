import type { DatosRecibo } from './recibo.types';

/**
 * PATRÓN BRIDGE — Implementador (Implementor)
 *
 * Define la interfaz de bajo nivel para generar el contenido del recibo.
 * Las clases Abstractas (EntregaRecibo y sus refinadas) solo conocen
 * esta interfaz, nunca la implementación concreta. Esto permite cambiar
 * el formato (PDF elegante, texto plano, minimalista…) sin tocar la
 * lógica de entrega (imprimir, correo…).
 */
export interface ReciboRenderer {
  /**
   * Genera el HTML completo del recibo listos para renderizar o enviar.
   * @param datos  Información de la reserva.
   * @returns      Cadena con el documento HTML.
   */
  generarHTML(datos: DatosRecibo): string;
}
