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
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crear(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  encontrarTodos() {
    return this.usuariosService.encontrarTodos();
  }

  @Get(':rut')
  @ApiOperation({ summary: 'Obtener un usuario por RUT' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  encontrarPorRUT(@Param('rut') rut: string) {
    return this.usuariosService.encontrarPorRUT(rut);
  }

  @Patch(':rut')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  actualizar(
    @Param('rut') rut: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.actualizar(rut, updateUsuarioDto);
  }

  @Delete(':rut')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  eliminar(@Param('rut') rut: string) {
    return this.usuariosService.eliminar(rut);
  }
}
