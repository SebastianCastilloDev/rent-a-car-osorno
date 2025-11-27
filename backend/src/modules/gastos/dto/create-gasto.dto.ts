import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoriaGasto } from '../../../common/constants';

export class CreateGastoDto {
  @ApiProperty({
    description: 'Patente del vehículo',
    example: 'AABB12',
  })
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @ApiProperty({
    description: 'Fecha del gasto',
    example: '2024-11-26',
  })
  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @ApiProperty({
    description: 'Categoría del gasto',
    enum: CategoriaGasto,
    example: CategoriaGasto.COMBUSTIBLE,
  })
  @IsEnum(CategoriaGasto)
  categoria: CategoriaGasto;

  @ApiProperty({
    description: 'Monto del gasto',
    example: 50000,
  })
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiPropertyOptional({
    description: 'Descripción del gasto',
    example: 'Llenado de estanque completo',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
