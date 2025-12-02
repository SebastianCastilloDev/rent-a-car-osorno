import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class UpdateChoferDto {
    @IsOptional()
    @IsString()
    @Matches(/^\d{7,8}[0-9K]$/, {
        message: 'El RUT debe tener un formato válido',
    })
    rut?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    nombre?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    apellido?: string;

    @IsOptional()
    @IsString()
    @MaxLength(15)
    telefono?: string;
}
