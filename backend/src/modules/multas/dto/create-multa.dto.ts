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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoPagoMulta } from '../../../common/constants';

export class CreateMultaDto {
  @ApiProperty({
    description: 'Patente del vehículo',
    example: 'AABB12',
  })
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @ApiProperty({
    description: 'Fecha de la infracción',
    example: '2024-11-26',
  })
  @IsDate()
  @Type(() => Date)
  fechaInfraccion: Date;

  @ApiProperty({
    description: 'Tipo de infracción',
    example: 'Exceso de velocidad',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  tipoInfraccion: string;

  @ApiProperty({
    description: 'Monto de la multa',
    example: 150000,
  })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({
    description: 'Estado de pago de la multa',
    enum: EstadoPagoMulta,
    default: EstadoPagoMulta.PENDIENTE,
  })
  @IsEnum(EstadoPagoMulta)
  estadoPago: EstadoPagoMulta;

  @ApiPropertyOptional({
    description: 'Descripción adicional de la multa',
    example: 'Multa detectada por radar automático',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
