import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,8}[0-9K]$/, {
    message: 'El RUT debe tener un formato válido',
  })
  rut: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}


