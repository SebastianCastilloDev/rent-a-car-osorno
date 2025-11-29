import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoRevisionTecnica } from '../../../common/constants';

export class CreateRevisionTecnicaDto {
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @IsDate()
  @Type(() => Date)
  fechaRevision: Date;

  @IsEnum(EstadoRevisionTecnica)
  estado: EstadoRevisionTecnica;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
