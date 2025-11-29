import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  Min,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePermisoCirculacionDto {
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @IsInt()
  @Min(2000)
  anio: number;

  @IsNumber()
  @Min(0)
  montoPermiso: number;

  @IsNumber()
  @Min(0)
  montoSoap: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaPago?: Date;
}
