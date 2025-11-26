import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  Min,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePermisoCirculacionDto {
  @ApiProperty({
    description: 'Patente del vehículo',
    example: 'AABB12',
  })
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @ApiProperty({
    description: 'Año del permiso de circulación',
    example: 2024,
  })
  @IsInt()
  @Min(2000)
  anio: number;

  @ApiProperty({
    description: 'Monto del permiso de circulación',
    example: 45000,
  })
  @IsNumber()
  @Min(0)
  montoPermiso: number;

  @ApiProperty({
    description: 'Monto del SOAP (Seguro Obligatorio)',
    example: 12000,
  })
  @IsNumber()
  @Min(0)
  montoSoap: number;

  @ApiPropertyOptional({
    description: 'Fecha de pago',
    example: '2024-03-15',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  fechaPago?: Date;
}

