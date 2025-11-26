import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { GastosService } from '../services/gastos.service';
import { CreateGastoDto } from '../dto/create-gasto.dto';
import { UpdateGastoDto } from '../dto/update-gasto.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Gastos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo gasto' })
  @ApiResponse({ status: 201, description: 'Gasto registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.crear(createGastoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los gastos' })
  @ApiQuery({ name: 'patente', required: false, description: 'Filtrar por patente de vehículo' })
  @ApiResponse({ status: 200, description: 'Lista de gastos' })
  encontrarTodos(@Query('patente') patente?: string) {
    if (patente) {
      return this.gastosService.encontrarPorVehiculo(patente);
    }
    return this.gastosService.encontrarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un gasto por ID' })
  @ApiResponse({ status: 200, description: 'Gasto encontrado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  encontrarPorId(@Param('id') id: string) {
    return this.gastosService.encontrarPorId(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un gasto' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  actualizar(@Param('id') id: string, @Body() updateGastoDto: UpdateGastoDto) {
    return this.gastosService.actualizar(+id, updateGastoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un gasto' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  eliminar(@Param('id') id: string) {
    return this.gastosService.eliminar(+id);
  }
}

