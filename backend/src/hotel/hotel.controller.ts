import { Body, Controller, Get, Post } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CotizarHabitacionDto } from './dto/cotizar-habitacion.dto';

@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  /** GET /hotel/habitaciones — catálogo de habitaciones base */
  @Get('habitaciones')
  getHabitaciones() {
    return this.hotelService.getHabitaciones();
  }

  /** GET /hotel/extras — catálogo de servicios adicionales */
  @Get('extras')
  getExtras() {
    return this.hotelService.getExtras();
  }

  /**
   * POST /hotel/cotizar — cotización con patrón Decorator
   *
   * Body: { tipo: 'estandar' | 'deluxe' | 'suite', extras: string[] }
   * Response: { tipo, extras, descripcion, costo }
   */
  @Post('cotizar')
  cotizar(@Body() dto: CotizarHabitacionDto) {
    return this.hotelService.cotizar(dto);
  }
}
