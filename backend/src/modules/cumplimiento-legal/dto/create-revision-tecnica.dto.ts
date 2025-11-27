import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoRevisionTecnica } from '../../../common/constants';

export class CreateRevisionTecnicaDto {
  @ApiProperty({
    description: 'Patente del vehículo',
    example: 'AABB12',
  })
  @IsString()
  @IsNotEmpty()
  vehiculoPatente: string;

  @ApiProperty({
    description: 'Fecha de la revisión técnica',
    example: '2024-11-26',
  })
  @IsDate()
  @Type(() => Date)
  fechaRevision: Date;

  @ApiProperty({
    description: 'Estado de la revisión técnica',
    enum: EstadoRevisionTecnica,
    default: EstadoRevisionTecnica.APROBADA,
  })
  @IsEnum(EstadoRevisionTecnica)
  estado: EstadoRevisionTecnica;

  @ApiPropertyOptional({
    description: 'Observaciones de la revisión',
    example: 'Revisión aprobada sin observaciones',
  })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
