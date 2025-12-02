import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsDate,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPagoMulta } from '../../../common/constants';

export class CreateMultaDto {
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @IsDate()
  @Type(() => Date)
  fechaInfraccion: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipoInfraccion: string;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsEnum(EstadoPagoMulta)
  estadoPago: EstadoPagoMulta;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
