import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RevisionTecnica } from './entities/revision-tecnica.entity';
import { PermisoCirculacion } from './entities/permiso-circulacion.entity';
import { CumplimientoLegalController } from './controllers/cumplimiento-legal.controller';
import { CumplimientoLegalService } from './services/cumplimiento-legal.service';

@Module({
  imports: [TypeOrmModule.forFeature([RevisionTecnica, PermisoCirculacion])],
  controllers: [CumplimientoLegalController],
  providers: [CumplimientoLegalService],
  exports: [CumplimientoLegalService, TypeOrmModule],
})
export class CumplimientoLegalModule { }
