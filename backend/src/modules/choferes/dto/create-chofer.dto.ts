import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChoferDto {
  @ApiProperty({
    description: 'RUT del chofer sin puntos ni guión',
    example: '123456789',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,8}[0-9K]$/, {
    message: 'El RUT debe tener un formato válido',
  })
  rut: string;

  @ApiProperty({ description: 'Nombre del chofer', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ description: 'Apellido del chofer', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @ApiPropertyOptional({
    description: 'Teléfono del chofer',
    example: '+56912345678',
  })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  telefono?: string;
}
