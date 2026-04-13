import { Injectable, BadRequestException } from '@nestjs/common';
import { HabitacionComponent } from './componentes/habitacion.component';
import { HabitacionEstandar } from './componentes/habitacion-estandar';
import { HabitacionDeluxe } from './componentes/habitacion-deluxe';
import { Suite } from './componentes/suite';
import { DesayunoDecorator } from './decoradores/desayuno.decorator';
import { WifiPremiumDecorator } from './decoradores/wifi-premium.decorator';
import { VistaMarDecorator } from './decoradores/vista-mar.decorator';
import { JacuzziDecorator } from './decoradores/jacuzzi.decorator';
import { CotizarHabitacionDto, TipoExtra, TipoHabitacion } from './dto/cotizar-habitacion.dto';

@Injectable()
export class HotelService {
  /** Devuelve el catálogo de habitaciones base con sus metadatos. */
  getHabitaciones() {
    return [
      {
        id: 'estandar',
        nombre: 'Habitación Estándar',
        descripcion:
          'Confort y funcionalidad para una estancia perfecta. Cama king, baño privado y todas las comodidades esenciales.',
        costo: 1200,
        imagen:
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        amenidades: ['Cama King', 'Baño privado', 'Aire acondicionado', 'TV 43"'],
      },
      {
        id: 'deluxe',
        nombre: 'Habitación Deluxe',
        descripcion:
          'Espacio ampliado con sala de estar y detalles de lujo. Ideal para estancias más largas o viajes en pareja.',
        costo: 1800,
        imagen:
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        amenidades: ['Cama King Deluxe', 'Sala de estar', 'Bañera y ducha', 'TV 55"'],
      },
      {
        id: 'suite',
        nombre: 'Suite',
        descripcion:
          'La máxima expresión del lujo. Suite completa con comedor privado, terraza y servicio personalizado.',
        costo: 2800,
        imagen:
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        amenidades: [
          'Cama California King',
          'Comedor privado',
          'Terraza exclusiva',
          'TV 65" + sistema de sonido',
        ],
      },
    ];
  }

  /** Devuelve el catálogo de extras disponibles. */
  getExtras() {
    return [
      {
        id: 'desayuno',
        nombre: 'Desayuno',
        descripcion: 'Desayuno buffet completo para dos personas cada mañana.',
        costo: 250,
        icono: '☕',
      },
      {
        id: 'wifi',
        nombre: 'WiFi Premium',
        descripcion: 'Conexión de fibra óptica de alta velocidad, sin límites.',
        costo: 120,
        icono: '📶',
      },
      {
        id: 'vista_mar',
        nombre: 'Vista al Mar',
        descripcion: 'Habitación con vista panorámica al océano.',
        costo: 350,
        icono: '🌊',
      },
      {
        id: 'jacuzzi',
        nombre: 'Jacuzzi',
        descripcion: 'Jacuzzi privado en habitación o terraza.',
        costo: 500,
        icono: '🛁',
      },
    ];
  }

  /**
   * Aplica el patrón Decorator para calcular descripción y costo final.
   *
   * La cadena de decoradores se construye dinámicamente según los extras
   * seleccionados. Cada decorador envuelve al anterior, delegando la
   * llamada y sumando su propio costo y descripción.
   *
   * Ejemplo: new WifiPremiumDecorator(new DesayunoDecorator(new HabitacionEstandar()))
   */
  cotizar(dto: CotizarHabitacionDto) {
    // 1. Instanciar el componente base según el tipo seleccionado
    let habitacion: HabitacionComponent = this.crearHabitacionBase(dto.tipo);

    // 2. Envolver con decoradores según extras elegidos
    for (const extra of dto.extras ?? []) {
      habitacion = this.aplicarDecorador(habitacion, extra);
    }

    // 3. Delegar a la cadena de decoradores para obtener resultado final
    return {
      tipo: dto.tipo,
      extras: dto.extras ?? [],
      descripcion: habitacion.getDescripcion(),
      costo: habitacion.getCosto(),
    };
  }

  private crearHabitacionBase(tipo: TipoHabitacion): HabitacionComponent {
    switch (tipo) {
      case TipoHabitacion.ESTANDAR:
        return new HabitacionEstandar();
      case TipoHabitacion.DELUXE:
        return new HabitacionDeluxe();
      case TipoHabitacion.SUITE:
        return new Suite();
      default:
        throw new BadRequestException(`Tipo de habitación no reconocido: ${tipo}`);
    }
  }

  private aplicarDecorador(
    habitacion: HabitacionComponent,
    extra: TipoExtra,
  ): HabitacionComponent {
    switch (extra) {
      case TipoExtra.DESAYUNO:
        return new DesayunoDecorator(habitacion);
      case TipoExtra.WIFI:
        return new WifiPremiumDecorator(habitacion);
      case TipoExtra.VISTA_MAR:
        return new VistaMarDecorator(habitacion);
      case TipoExtra.JACUZZI:
        return new JacuzziDecorator(habitacion);
      default:
        throw new BadRequestException(`Extra no reconocido: ${extra}`);
    }
  }
}
