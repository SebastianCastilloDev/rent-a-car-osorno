import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RolUsuario } from '../../../common/constants';

export class RegisterDto {
  @ApiProperty({
    description: 'RUT del usuario sin puntos ni guión',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,8}[0-9K]$/, {
    message: 'El RUT debe tener un formato válido',
  })
  rut: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: RolUsuario,
    default: RolUsuario.USUARIO,
  })
  @IsEnum(RolUsuario)
  rol: RolUsuario;
}


