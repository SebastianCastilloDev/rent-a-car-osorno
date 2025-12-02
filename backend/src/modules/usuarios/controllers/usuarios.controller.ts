import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { AprobarUsuarioDto } from '../dto/aprobar-usuario.dto';
import { RechazarUsuarioDto } from '../dto/rechazar-usuario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { EstadoUsuario, RolUsuario } from '../../../common/constants';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario (solo para uso interno)' })
  crear(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crear(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  encontrarTodos() {
    return this.usuariosService.encontrarTodos();
  }

  @Get('pendientes/aprobacion')
  @Roles(RolUsuario.SUPER_ADMIN, RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Obtener usuarios pendientes de aprobación' })
  encontrarPendientes() {
    return this.usuariosService.encontrarPorEstado(EstadoUsuario.PENDIENTE);
  }

  @Get('estado/:estado')
  @Roles(RolUsuario.SUPER_ADMIN, RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Obtener usuarios por estado' })
  encontrarPorEstado(@Param('estado') estado: EstadoUsuario) {
    return this.usuariosService.encontrarPorEstado(estado);
  }

  @Get(':rut')
  @ApiOperation({ summary: 'Obtener usuario por RUT' })
  encontrarPorRUT(@Param('rut') rut: string) {
    return this.usuariosService.encontrarPorRUT(rut);
  }

  @Patch(':rut')
  @ApiOperation({ summary: 'Actualizar usuario' })
  actualizar(
    @Param('rut') rut: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.actualizar(rut, updateUsuarioDto);
  }

  @Delete(':rut')
  @ApiOperation({ summary: 'Eliminar usuario' })
  eliminar(@Param('rut') rut: string) {
    return this.usuariosService.eliminar(rut);
  }

  @Post(':rut/aprobar')
  @Roles(RolUsuario.SUPER_ADMIN, RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Aprobar un usuario pendiente' })
  aprobarUsuario(
    @Param('rut') rut: string,
    @Request() req,
    @Body() aprobarDto: AprobarUsuarioDto,
  ) {
    const aprobadorRut = req.user.sub;
    return this.usuariosService.aprobarUsuario(rut, aprobadorRut, aprobarDto);
  }

  @Post(':rut/rechazar')
  @Roles(RolUsuario.SUPER_ADMIN, RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Rechazar un usuario pendiente' })
  rechazarUsuario(
    @Param('rut') rut: string,
    @Request() req,
    @Body() rechazarDto: RechazarUsuarioDto,
  ) {
    const rechazadorRut = req.user.sub;
    return this.usuariosService.rechazarUsuario(rut, rechazadorRut, rechazarDto);
  }

  @Post(':rut/suspender')
  @Roles(RolUsuario.SUPER_ADMIN, RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Suspender un usuario' })
  suspenderUsuario(
    @Param('rut') rut: string,
    @Request() req,
    @Body() body: { motivo: string },
  ) {
    const suspensorRut = req.user.sub;
    return this.usuariosService.suspenderUsuario(
      rut,
      suspensorRut,
      body.motivo,
    );
  }

  @Post(':rut/reactivar')
  @Roles(RolUsuario.SUPER_ADMIN, RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Reactivar un usuario suspendido o rechazado' })
  reactivarUsuario(@Param('rut') rut: string, @Request() req) {
    const reactivadorRut = req.user.sub;
    return this.usuariosService.reactivarUsuario(rut, reactivadorRut);
  }
}
