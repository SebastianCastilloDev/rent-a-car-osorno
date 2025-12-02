import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateChoferDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,8}[0-9K]$/, {
    message: 'El RUT debe tener un formato válido',
  })
  rut: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefono?: string;
}
