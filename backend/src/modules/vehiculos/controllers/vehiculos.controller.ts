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
import { VehiculosService } from '../services/vehiculos.service';
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from '../dto/update-vehiculo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Vehículos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo vehículo' })
  @ApiResponse({ status: 201, description: 'Vehículo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.crear(createVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los vehículos' })
  @ApiResponse({ status: 200, description: 'Lista de vehículos' })
  encontrarTodos() {
    return this.vehiculosService.encontrarTodos();
  }

  @Get(':patente')
  @ApiOperation({ summary: 'Obtener un vehículo por patente' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  encontrarPorPatente(@Param('patente') patente: string) {
    return this.vehiculosService.encontrarPorPatente(patente);
  }

  @Patch(':patente')
  @ApiOperation({ summary: 'Actualizar un vehículo' })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  actualizar(
    @Param('patente') patente: string,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculosService.actualizar(patente, updateVehiculoDto);
  }

  @Delete(':patente')
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  @ApiResponse({ status: 200, description: 'Vehículo eliminado' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado' })
  eliminar(@Param('patente') patente: string) {
    return this.vehiculosService.eliminar(patente);
  }
}
