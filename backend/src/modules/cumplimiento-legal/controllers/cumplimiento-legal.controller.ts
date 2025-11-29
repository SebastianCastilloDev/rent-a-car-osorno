import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CumplimientoLegalService } from '../services/cumplimiento-legal.service';
import { CreateRevisionTecnicaDto } from '../dto/create-revision-tecnica.dto';
import { UpdateRevisionTecnicaDto } from '../dto/update-revision-tecnica.dto';
import { CreatePermisoCirculacionDto } from '../dto/create-permiso-circulacion.dto';
import { UpdatePermisoCirculacionDto } from '../dto/update-permiso-circulacion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cumplimiento-legal')
export class CumplimientoLegalController {
  constructor(
    private readonly cumplimientoLegalService: CumplimientoLegalService,
  ) { }

  // Revisiones Técnicas
  @Post('revisiones-tecnicas')
  crearRevisionTecnica(@Body() dto: CreateRevisionTecnicaDto) {
    return this.cumplimientoLegalService.crearRevisionTecnica(dto);
  }

  @Get('revisiones-tecnicas')
  encontrarRevisionesTecnicas() {
    return this.cumplimientoLegalService.encontrarRevisionesTecnicas();
  }

  @Get('revisiones-tecnicas/:id')
  encontrarRevisionTecnicaPorId(@Param('id') id: string) {
    return this.cumplimientoLegalService.encontrarRevisionTecnicaPorId(+id);
  }

  @Patch('revisiones-tecnicas/:id')
  actualizarRevisionTecnica(
    @Param('id') id: string,
    @Body() dto: UpdateRevisionTecnicaDto,
  ) {
    return this.cumplimientoLegalService.actualizarRevisionTecnica(+id, dto);
  }

  @Delete('revisiones-tecnicas/:id')
  eliminarRevisionTecnica(@Param('id') id: string) {
    return this.cumplimientoLegalService.eliminarRevisionTecnica(+id);
  }

  // Permisos de Circulación
  @Post('permisos-circulacion')
  crearPermisoCirculacion(@Body() dto: CreatePermisoCirculacionDto) {
    return this.cumplimientoLegalService.crearPermisoCirculacion(dto);
  }

  @Get('permisos-circulacion')
  encontrarPermisosCirculacion() {
    return this.cumplimientoLegalService.encontrarPermisosCirculacion();
  }

  @Get('permisos-circulacion/:id')
  encontrarPermisoCirculacionPorId(@Param('id') id: string) {
    return this.cumplimientoLegalService.encontrarPermisoCirculacionPorId(+id);
  }

  @Patch('permisos-circulacion/:id')
  actualizarPermisoCirculacion(
    @Param('id') id: string,
    @Body() dto: UpdatePermisoCirculacionDto,
  ) {
    return this.cumplimientoLegalService.actualizarPermisoCirculacion(+id, dto);
  }

  @Delete('permisos-circulacion/:id')
  eliminarPermisoCirculacion(@Param('id') id: string) {
    return this.cumplimientoLegalService.eliminarPermisoCirculacion(+id);
  }
}
