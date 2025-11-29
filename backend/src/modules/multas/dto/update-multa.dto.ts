import {
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { EstadoPagoMulta } from '../../../common/constants';

export class UpdateMultaDto {
    @IsOptional()
    @IsString()
    vehiculoPatente?: string;

    @IsOptional()
    @IsDate()
    fechaInfraccion?: Date;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    tipoInfraccion?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    monto?: number;

    @IsOptional()
    @IsEnum(EstadoPagoMulta)
    estadoPago?: EstadoPagoMulta;

    @IsOptional()
    @IsString()
    descripcion?: string;
}
