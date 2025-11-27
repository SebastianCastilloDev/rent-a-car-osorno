import { PartialType } from '@nestjs/swagger';
import { CreatePermisoCirculacionDto } from './create-permiso-circulacion.dto';

export class UpdatePermisoCirculacionDto extends PartialType(
  CreatePermisoCirculacionDto,
) {}
