import {
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { CategoriaGasto } from '../../../common/constants';

export class UpdateGastoDto {
    @IsOptional()
    @IsString()
    vehiculoPatente?: string;

    @IsOptional()
    @IsDate()
    fecha?: Date;

    @IsOptional()
    @IsEnum(CategoriaGasto)
    categoria?: CategoriaGasto;

    @IsOptional()
    @IsNumber()
    @Min(0)
    monto?: number;

    @IsOptional()
    @IsString()
    descripcion?: string;
}
