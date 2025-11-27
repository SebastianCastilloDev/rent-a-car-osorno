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
import { ChoferesService } from '../services/choferes.service';
import { CreateChoferDto } from '../dto/create-chofer.dto';
import { UpdateChoferDto } from '../dto/update-chofer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Choferes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('choferes')
export class ChoferesController {
  constructor(private readonly choferesService: ChoferesService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo chofer' })
  @ApiResponse({ status: 201, description: 'Chofer creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() createChoferDto: CreateChoferDto) {
    return this.choferesService.crear(createChoferDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los choferes' })
  @ApiResponse({ status: 200, description: 'Lista de choferes' })
  encontrarTodos() {
    return this.choferesService.encontrarTodos();
  }

  @Get(':rut')
  @ApiOperation({ summary: 'Obtener un chofer por RUT' })
  @ApiResponse({ status: 200, description: 'Chofer encontrado' })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  encontrarPorRUT(@Param('rut') rut: string) {
    return this.choferesService.encontrarPorRUT(rut);
  }

  @Patch(':rut')
  @ApiOperation({ summary: 'Actualizar un chofer' })
  @ApiResponse({ status: 200, description: 'Chofer actualizado' })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  actualizar(
    @Param('rut') rut: string,
    @Body() updateChoferDto: UpdateChoferDto,
  ) {
    return this.choferesService.actualizar(rut, updateChoferDto);
  }

  @Delete(':rut')
  @ApiOperation({ summary: 'Eliminar (desactivar) un chofer' })
  @ApiResponse({ status: 200, description: 'Chofer eliminado' })
  @ApiResponse({ status: 404, description: 'Chofer no encontrado' })
  eliminar(@Param('rut') rut: string) {
    return this.choferesService.eliminar(rut);
  }
}
