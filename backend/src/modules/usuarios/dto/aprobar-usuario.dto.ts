import { IsEnum, IsOptional } from 'class-validator';
import { RolUsuario } from '../../../common/constants';

export class AprobarUsuarioDto {
  @IsEnum(RolUsuario)
  @IsOptional()
  rol?: RolUsuario;
}


