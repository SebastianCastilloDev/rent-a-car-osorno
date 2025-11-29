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
import { UsuariosService } from '../services/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  crear(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.crear(createUsuarioDto);
  }

  @Get()
  encontrarTodos() {
    return this.usuariosService.encontrarTodos();
  }

  @Get(':rut')
  encontrarPorRUT(@Param('rut') rut: string) {
    return this.usuariosService.encontrarPorRUT(rut);
  }

  @Patch(':rut')
  actualizar(
    @Param('rut') rut: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.actualizar(rut, updateUsuarioDto);
  }

  @Delete(':rut')
  eliminar(@Param('rut') rut: string) {
    return this.usuariosService.eliminar(rut);
  }
}
