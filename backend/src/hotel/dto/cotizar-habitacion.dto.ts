import { IsEnum, IsArray, IsOptional } from 'class-validator';

export enum TipoHabitacion {
  ESTANDAR = 'estandar',
  DELUXE = 'deluxe',
  SUITE = 'suite',
}

export enum TipoExtra {
  DESAYUNO = 'desayuno',
  WIFI = 'wifi',
  VISTA_MAR = 'vista_mar',
  JACUZZI = 'jacuzzi',
}

export class CotizarHabitacionDto {
  @IsEnum(TipoHabitacion, {
    message: 'tipo debe ser: estandar, deluxe o suite',
  })
  tipo: TipoHabitacion;

  @IsOptional()
  @IsArray()
  @IsEnum(TipoExtra, {
    each: true,
    message: 'extras deben ser: desayuno, wifi, vista_mar o jacuzzi',
  })
  extras?: TipoExtra[];
}
