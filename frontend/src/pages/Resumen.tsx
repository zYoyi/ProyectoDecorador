import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import type { CotizarResponse, Extra, Habitacion } from '../types/hotel';

interface ResumenState {
  cotizacion: CotizarResponse;
  habitacion: Habitacion;
  extrasSeleccionados: Extra[];
}

export default function Resumen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResumenState | null;

  useEffect(() => {
    if (!state) navigate('/', { replace: true });
  }, [state, navigate]);

  if (!state) return null;

  const { cotizacion, habitacion, extrasSeleccionados } = state;

  return (
    <div className="pt-16 bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-stone-100 py-12 px-6 text-center">
        <p className="section-label mb-3">Tu cotización</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light text-stone-900">
          Resumen de reserva
        </h1>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Card principal */}
        <div className="bg-white border border-stone-200 overflow-hidden">
          {/* Imagen de la habitación */}
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

              {/* Amenidades */}
              <div className="flex flex-wrap gap-2 mt-4">
                {habitacion.amenidades.map((a) => (
                  <span
                    key={a}
                    className="px-3 py-1 text-xs border border-stone-200 text-stone-500"
                  >
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

            {/* Descripción del Decorator */}
            <div className="bg-stone-50 border border-stone-100 p-5">
              <p className="section-label mb-2">Descripción generada por Decorator</p>
              <p className="font-serif text-lg text-stone-700 italic leading-relaxed">
                "{cotizacion.descripcion}"
              </p>
              <p className="text-xs text-stone-400 mt-3">
                Esta cadena de texto es el resultado de aplicar cada decorador en secuencia
                sobre la habitación base, sin modificar ninguna clase existente.
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
