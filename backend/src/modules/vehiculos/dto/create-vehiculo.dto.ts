import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVehiculoDto {
  @ApiProperty({
    description: 'Patente del vehículo (formato chileno)',
    example: 'AABB12',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/, {
    message: 'La patente debe tener formato chileno válido (ej: AABB12 o AA1234)',
  })
  patente: string;

  @ApiProperty({ description: 'Dígito verificador de la patente', example: '1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  dv: string;

  @ApiPropertyOptional({
    description: 'Proveedor del vehículo',
    example: 'AutomovilChile',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  proveedor?: string;

  @ApiPropertyOptional({
    description: 'Número de factura',
    example: 'FAC-2024-001',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroFactura?: string;

  @ApiPropertyOptional({
    description: 'Fecha de compra',
    example: '2024-01-15',
  })
  @IsOptional()
  @Type(() => Date)
  fechaCompra?: Date;

  @ApiProperty({ description: 'Tipo de vehículo', example: 'Camioneta' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  @ApiPropertyOptional({ description: 'Condición', example: 'Nuevo' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  condicion?: string;

  @ApiProperty({ description: 'Año del vehículo', example: 2024 })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  anio: number;

  @ApiProperty({ description: 'Marca del vehículo', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  marca: string;

  @ApiProperty({ description: 'Modelo del vehículo', example: 'Hilux' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modelo: string;

  @ApiPropertyOptional({
    description: 'Número de motor',
    example: 'MOT123456',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  motor?: string;

  @ApiPropertyOptional({
    description: 'Número de chassis',
    example: 'CHA123456',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  chassis?: string;

  @ApiPropertyOptional({ description: 'Color del vehículo', example: 'Blanco' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @ApiPropertyOptional({ description: 'Tipo de transmisión', example: 'Manual' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  transmision?: string;

  @ApiPropertyOptional({
    description: 'Tipo de combustible',
    example: 'Diesel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  combustible?: string;

  @ApiPropertyOptional({
    description: 'Ubicación actual del vehículo',
    example: 'Osorno',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ubicacionActual?: string;

  @ApiPropertyOptional({
    description: 'RUT del chofer asignado',
    example: '123456789',
  })
  @IsOptional()
  @IsString()
  choferRut?: string;
}

