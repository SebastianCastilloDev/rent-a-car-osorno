import {
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
} from 'class-validator';
import { EstadoRevisionTecnica } from '../../../common/constants';

export class UpdateRevisionTecnicaDto {
    @IsOptional()
    @IsString()
    vehiculoPatente?: string;

    @IsOptional()
    @IsDate()
    fechaRevision?: Date;

    @IsOptional()
    @IsEnum(EstadoRevisionTecnica)
    estado?: EstadoRevisionTecnica;

    @IsOptional()
    @IsString()
    observaciones?: string;
}
