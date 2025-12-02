import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CategoriaGasto } from '../../../common/constants';

export class CreateGastoDto {
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @IsDate()
  @Type(() => Date)
  fecha: Date;

  @IsEnum(CategoriaGasto)
  categoria: CategoriaGasto;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
