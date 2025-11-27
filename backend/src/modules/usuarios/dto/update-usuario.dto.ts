import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiPropertyOptional({
    description: 'Nueva contraseña (mínimo 8 caracteres)',
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
