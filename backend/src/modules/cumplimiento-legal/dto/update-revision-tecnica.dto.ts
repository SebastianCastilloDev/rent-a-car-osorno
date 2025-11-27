import { PartialType } from '@nestjs/swagger';
import { CreateRevisionTecnicaDto } from './create-revision-tecnica.dto';

export class UpdateRevisionTecnicaDto extends PartialType(
  CreateRevisionTecnicaDto,
) {}
