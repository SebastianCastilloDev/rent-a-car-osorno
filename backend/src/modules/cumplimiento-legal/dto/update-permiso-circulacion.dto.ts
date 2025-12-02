import {
    IsDate,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class UpdatePermisoCirculacionDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    vehiculoPatente?: string;

    @IsOptional()
    @IsInt()
    @Min(2000)
    anio?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    montoPermiso?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    montoSoap?: number;

    @IsOptional()
    @IsDate()
    fechaPago?: Date;
}
