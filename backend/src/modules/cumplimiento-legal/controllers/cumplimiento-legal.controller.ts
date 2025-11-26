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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CumplimientoLegalService } from '../services/cumplimiento-legal.service';
import { CreateRevisionTecnicaDto } from '../dto/create-revision-tecnica.dto';
import { UpdateRevisionTecnicaDto } from '../dto/update-revision-tecnica.dto';
import { CreatePermisoCirculacionDto } from '../dto/create-permiso-circulacion.dto';
import { UpdatePermisoCirculacionDto } from '../dto/update-permiso-circulacion.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Cumplimiento Legal')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('cumplimiento-legal')
export class CumplimientoLegalController {
  constructor(
    private readonly cumplimientoLegalService: CumplimientoLegalService,
  ) {}

  // Revisiones Técnicas
  @Post('revisiones-tecnicas')
  @ApiOperation({ summary: 'Registrar una nueva revisión técnica' })
  @ApiResponse({
    status: 201,
    description: 'Revisión técnica registrada exitosamente',
  })
  crearRevisionTecnica(@Body() dto: CreateRevisionTecnicaDto) {
    return this.cumplimientoLegalService.crearRevisionTecnica(dto);
  }

  @Get('revisiones-tecnicas')
  @ApiOperation({ summary: 'Obtener todas las revisiones técnicas' })
  @ApiResponse({ status: 200, description: 'Lista de revisiones técnicas' })
  encontrarRevisionesTecnicas() {
    return this.cumplimientoLegalService.encontrarRevisionesTecnicas();
  }

  @Get('revisiones-tecnicas/:id')
  @ApiOperation({ summary: 'Obtener una revisión técnica por ID' })
  @ApiResponse({ status: 200, description: 'Revisión técnica encontrada' })
  @ApiResponse({ status: 404, description: 'Revisión técnica no encontrada' })
  encontrarRevisionTecnicaPorId(@Param('id') id: string) {
    return this.cumplimientoLegalService.encontrarRevisionTecnicaPorId(+id);
  }

  @Patch('revisiones-tecnicas/:id')
  @ApiOperation({ summary: 'Actualizar una revisión técnica' })
  @ApiResponse({ status: 200, description: 'Revisión técnica actualizada' })
  actualizarRevisionTecnica(
    @Param('id') id: string,
    @Body() dto: UpdateRevisionTecnicaDto,
  ) {
    return this.cumplimientoLegalService.actualizarRevisionTecnica(+id, dto);
  }

  @Delete('revisiones-tecnicas/:id')
  @ApiOperation({ summary: 'Eliminar una revisión técnica' })
  @ApiResponse({ status: 200, description: 'Revisión técnica eliminada' })
  eliminarRevisionTecnica(@Param('id') id: string) {
    return this.cumplimientoLegalService.eliminarRevisionTecnica(+id);
  }

  // Permisos de Circulación
  @Post('permisos-circulacion')
  @ApiOperation({ summary: 'Registrar un nuevo permiso de circulación' })
  @ApiResponse({
    status: 201,
    description: 'Permiso de circulación registrado exitosamente',
  })
  crearPermisoCirculacion(@Body() dto: CreatePermisoCirculacionDto) {
    return this.cumplimientoLegalService.crearPermisoCirculacion(dto);
  }

  @Get('permisos-circulacion')
  @ApiOperation({ summary: 'Obtener todos los permisos de circulación' })
  @ApiResponse({ status: 200, description: 'Lista de permisos de circulación' })
  encontrarPermisosCirculacion() {
    return this.cumplimientoLegalService.encontrarPermisosCirculacion();
  }

  @Get('permisos-circulacion/:id')
  @ApiOperation({ summary: 'Obtener un permiso de circulación por ID' })
  @ApiResponse({ status: 200, description: 'Permiso de circulación encontrado' })
  @ApiResponse({
    status: 404,
    description: 'Permiso de circulación no encontrado',
  })
  encontrarPermisoCirculacionPorId(@Param('id') id: string) {
    return this.cumplimientoLegalService.encontrarPermisoCirculacionPorId(+id);
  }

  @Patch('permisos-circulacion/:id')
  @ApiOperation({ summary: 'Actualizar un permiso de circulación' })
  @ApiResponse({ status: 200, description: 'Permiso de circulación actualizado' })
  actualizarPermisoCirculacion(
    @Param('id') id: string,
    @Body() dto: UpdatePermisoCirculacionDto,
  ) {
    return this.cumplimientoLegalService.actualizarPermisoCirculacion(+id, dto);
  }

  @Delete('permisos-circulacion/:id')
  @ApiOperation({ summary: 'Eliminar un permiso de circulación' })
  @ApiResponse({ status: 200, description: 'Permiso de circulación eliminado' })
  eliminarPermisoCirculacion(@Param('id') id: string) {
    return this.cumplimientoLegalService.eliminarPermisoCirculacion(+id);
  }
}

