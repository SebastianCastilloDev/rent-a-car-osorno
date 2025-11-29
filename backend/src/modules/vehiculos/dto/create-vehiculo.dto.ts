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
import { Type } from 'class-transformer';

export class CreateVehiculoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{4}\d{2}$|^[A-Z]{2}\d{4}$/, {
    message:
      'La patente debe tener formato chileno válido (ej: AABB12 o AA1234)',
  })
  patente: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1)
  dv: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  proveedor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroFactura?: string;

  @IsOptional()
  @Type(() => Date)
  fechaCompra?: Date;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  tipo: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  condicion?: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  anio: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  marca: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  modelo: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  motor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  chassis?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  color?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  transmision?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  combustible?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ubicacionActual?: string;

  @IsOptional()
  @IsString()
  choferRut?: string;
}
