import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CotizarResponse, Extra, Habitacion } from '../types/hotel';
import { PDFReciboRenderer } from '../bridge/PDFReciboRenderer';
import { ImprimirEntrega } from '../bridge/ImprimirEntrega';
import { CorreoEntrega } from '../bridge/CorreoEntrega';
import type { EntregaResultado } from '../bridge/recibo.types';

interface ResumenState {
  cotizacion: CotizarResponse;
  habitacion: Habitacion;
  extrasSeleccionados: Extra[];
}

type ModoEntrega = 'imprimir' | 'correo';

export default function Resumen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResumenState | null;

  // ── Patrón Bridge: estado de la sección de envío ─────────────────────────
  const [modoEntrega, setModoEntrega] = useState<ModoEntrega | null>(null);
  const [email, setEmail] = useState('');
  const [entregando, setEntregando] = useState(false);
  const [resultado, setResultado] = useState<EntregaResultado | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Número de reserva y fecha generados una sola vez al montar el componente
  const numeroReserva = useMemo(() => {
    const rand = Math.floor(Math.random() * 90000) + 10000;
    return `AURUM-${new Date().getFullYear()}-${rand}`;
  }, []);

  const fechaStr = useMemo(
    () =>
      new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [],
  );

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  // Enfocar el input de correo al seleccionar esa opción
  useEffect(() => {
    if (modoEntrega === 'correo') {
      setTimeout(() => emailRef.current?.focus(), 80);
    }
  }, [modoEntrega]);

  if (!state) return null;

  const { cotizacion, habitacion, extrasSeleccionados } = state;

  // Construye los DatosRecibo para el Implementador
  const datosRecibo = {
    numeroReserva,
    fecha: fechaStr,
    habitacion: {
      nombre: habitacion.nombre,
      descripcion: habitacion.descripcion,
      costo: habitacion.costo,
    },
    extrasSeleccionados: extrasSeleccionados.map((e) => ({
      nombre: e.nombre,
      descripcion: e.descripcion,
      costo: e.costo,
      icono: e.icono,
    })),
    cotizacion: {
      descripcion: cotizacion.descripcion,
      costo: cotizacion.costo,
    },
  };

  /** Crea el Implementador compartido (PDFReciboRenderer) */
  const crearRenderer = () => new PDFReciboRenderer();

  /** Seleccionar modo: limpia resultados previos */
  const seleccionarModo = (modo: ModoEntrega) => {
    setModoEntrega(modo);
    setResultado(null);
    setEmail('');
  };

  /** Ejecuta la entrega según el modo seleccionado (patrón Bridge) */
  const handleEntregar = async () => {
    setEntregando(true);
    setResultado(null);
    try {
      const renderer = crearRenderer();

      let entrega;
      if (modoEntrega === 'imprimir') {
        entrega = new ImprimirEntrega(renderer);
      } else {
        if (!email.trim()) {
          setResultado({ ok: false, mensaje: 'Por favor ingresa un correo electrónico.' });
          setEntregando(false);
          return;
        }
        entrega = new CorreoEntrega(renderer, email.trim());
      }

      const res = await entrega.entregar(datosRecibo);
      setResultado(res);
    } catch (err) {
      setResultado({
        ok: false,
        mensaje: err instanceof Error ? err.message : 'Ocurrió un error inesperado.',
      });
    } finally {
      setEntregando(false);
    }
  };

  return (
    <div className="pt-16 bg-stone-50 min-h-screen">
      {/* ── Header ── */}
      <div className="bg-white border-b border-stone-100 py-12 px-6 text-center">
        <p className="section-label mb-3">Tu cotización</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-900">
          Resumen de reserva
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* ── Card principal ── */}
        <div className="bg-white border border-stone-200 overflow-hidden">
          {/* Imagen */}
          <div className="h-64 overflow-hidden">
            <img
              src={habitacion.imagen}
              alt={habitacion.nombre}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido */}
          <div className="p-8 space-y-8">
            {/* Habitación base */}
            <div>
              <p className="section-label mb-2">Habitación seleccionada</p>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-stone-900">{habitacion.nombre}</h2>
                  <p className="text-stone-500 text-sm mt-1">{habitacion.descripcion}</p>
                </div>
                <p className="font-serif text-2xl text-stone-900 flex-shrink-0 ml-4">
                  ${habitacion.costo.toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {habitacion.amenidades.map((a) => (
                  <span key={a} className="px-3 py-1 text-xs border border-stone-200 text-stone-500">
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Extras */}
            {extrasSeleccionados.length > 0 && (
              <div className="border-t border-stone-100 pt-6">
                <p className="section-label mb-4">Servicios adicionales</p>
                <div className="space-y-3">
                  {extrasSeleccionados.map((extra) => (
                    <div
                      key={extra.id}
                      className="flex items-center justify-between py-2 border-b border-stone-50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{extra.icono}</span>
                        <div>
                          <p className="font-medium text-stone-800 text-sm">{extra.nombre}</p>
                          <p className="text-stone-400 text-xs">{extra.descripcion}</p>
                        </div>
                      </div>
                      <span className="text-stone-700 font-medium">
                        +${extra.costo.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción Decorator */}
            <div className="bg-stone-50 border border-stone-100 p-5">
              <p className="section-label mb-2">Descripción</p>
              <p className="font-serif text-lg text-stone-700 italic leading-relaxed">
                "{cotizacion.descripcion}"
              </p>
            </div>

            {/* Total */}
            <div className="border-t border-stone-200 pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-stone-600 text-sm">Habitación base</span>
                <span className="text-stone-600">${habitacion.costo.toLocaleString()}</span>
              </div>
              {extrasSeleccionados.map((e) => (
                <div key={e.id} className="flex items-center justify-between mb-2">
                  <span className="text-stone-500 text-sm">{e.nombre}</span>
                  <span className="text-stone-500 text-sm">+${e.costo.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-200">
                <span className="font-semibold text-stone-900">Total por noche</span>
                <span className="font-serif text-3xl text-stone-900">
                  ${cotizacion.costo.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                * Impuestos no incluidos. Sujeto a disponibilidad en las fechas seleccionadas.
              </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/personalizar')}
                className="btn-outline flex-1 text-center"
              >
                ← Modificar
              </button>
              <Link to="/contacto" className="btn-primary flex-1 text-center">
                Confirmar reserva
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PATRÓN BRIDGE — Sección de envío del recibo
            Abstracción: ImprimirEntrega / CorreoEntrega
            Implementador: PDFReciboRenderer (formato visual compartido)
        ══════════════════════════════════════════════════════════════════ */}
        <div className="mt-8 bg-white border border-stone-200">
          {/* Cabecera */}
          <div className="px-8 py-6 border-b border-stone-100">
            <p className="section-label mb-1">Obtener recibo</p>
            <h3 className="font-serif text-xl text-stone-900">
              ¿Cómo deseas recibir tu cotización?
            </h3>
            <p className="text-stone-400 text-sm mt-1">
              El recibo se genera en formato PDF con el diseño completo de Aurum Grand Hotel.
            </p>
          </div>

          <div className="p-8">
            {/* Selector de modo: dos tarjetas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Opción: Imprimir / PDF */}
              <button
                onClick={() => seleccionarModo('imprimir')}
                className={`group text-left p-5 border transition-all duration-200 ${
                  modoEntrega === 'imprimir'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 hover:border-stone-400 bg-white text-stone-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">🖨️</span>
                  <div>
                    <p
                      className={`font-semibold text-sm mb-1 ${
                        modoEntrega === 'imprimir' ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      Imprimir / Guardar PDF
                    </p>
                    <p
                      className={`text-xs leading-relaxed ${
                        modoEntrega === 'imprimir' ? 'text-stone-300' : 'text-stone-400'
                      }`}
                    >
                      Abre el diálogo de impresión. Selecciona{' '}
                      <em>"Guardar como PDF"</em> para descargarlo.
                    </p>
                  </div>
                </div>
              </button>

              {/* Opción: Correo electrónico */}
              <button
                onClick={() => seleccionarModo('correo')}
                className={`group text-left p-5 border transition-all duration-200 ${
                  modoEntrega === 'correo'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 hover:border-stone-400 bg-white text-stone-900'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-0.5">✉️</span>
                  <div>
                    <p
                      className={`font-semibold text-sm mb-1 ${
                        modoEntrega === 'correo' ? 'text-white' : 'text-stone-900'
                      }`}
                    >
                      Enviar por correo
                    </p>
                    <p
                      className={`text-xs leading-relaxed ${
                        modoEntrega === 'correo' ? 'text-stone-300' : 'text-stone-400'
                      }`}
                    >
                      Recibe el recibo en tu bandeja de entrada con el diseño completo.
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Panel de acción según el modo */}
            {modoEntrega && (
              <div className="border-t border-stone-100 pt-6 space-y-4">
                {/* Input de correo (solo en modo correo) */}
                {modoEntrega === 'correo' && (
                  <div className="flex gap-3">
                    <input
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEntregar()}
                      placeholder="tu@correo.com"
                      className="flex-1 border border-stone-200 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors"
                    />
                  </div>
                )}

                {/* Botón de entrega */}
                <button
                  onClick={handleEntregar}
                  disabled={entregando}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {entregando ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      {modoEntrega === 'correo' ? 'Enviando…' : 'Preparando PDF…'}
                    </span>
                  ) : modoEntrega === 'imprimir' ? (
                    '🖨️  Abrir vista de impresión'
                  ) : (
                    '✉️  Enviar recibo'
                  )}
                </button>

                {/* Mensaje de resultado */}
                {resultado && (
                  <div
                    className={`p-4 text-sm leading-relaxed ${
                      resultado.ok
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}
                  >
                    <p className="font-medium">{resultado.ok ? '✓' : '✗'} {resultado.mensaje}</p>
                    {resultado.previewUrl && (
                      <p className="mt-2 text-emerald-700 text-xs">
                        <span className="font-medium">Vista previa (modo demo):</span>{' '}
                        <a
                          href={resultado.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-emerald-900"
                        >
                          Ver correo en Ethereal →
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {/* Nota técnica del patrón Bridge */}
                {modoEntrega === 'imprimir' && (
                  <p className="text-[11px] text-stone-400 leading-relaxed pt-1">
                    <span className="font-medium text-stone-500">Patrón Bridge:</span>{' '}
                    ImprimirEntrega usa PDFReciboRenderer para generar el HTML y abre el diálogo de impresión del navegador.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        {/* ── fin sección Bridge ── */}

        {/* Información adicional */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '✓', title: 'Cancelación flexible', desc: 'Sin cargo hasta 48h antes' },
            { icon: '🔒', title: 'Pago seguro', desc: 'Datos protegidos y cifrados' },
            { icon: '💬', title: 'Atención 24/7', desc: 'Siempre disponibles para ti' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-stone-100 p-5 text-center">
              <p className="text-2xl mb-2">{icon}</p>
              <p className="font-medium text-stone-800 text-sm">{title}</p>
              <p className="text-stone-400 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
