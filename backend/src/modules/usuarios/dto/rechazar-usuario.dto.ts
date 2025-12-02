import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class RechazarUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500, {
    message: 'El motivo de rechazo no puede exceder 500 caracteres',
  })
  motivoRechazo: string;
}

