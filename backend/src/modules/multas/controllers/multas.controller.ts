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
import { MultasService } from '../services/multas.service';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Multas')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('multas')
export class MultasController {
  constructor(private readonly multasService: MultasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva multa' })
  @ApiResponse({ status: 201, description: 'Multa registrada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  crear(@Body() createMultaDto: CreateMultaDto) {
    return this.multasService.crear(createMultaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las multas' })
  @ApiQuery({
    name: 'patente',
    required: false,
    description: 'Filtrar por patente de vehículo',
  })
  @ApiResponse({ status: 200, description: 'Lista de multas' })
  encontrarTodas(@Query('patente') patente?: string) {
    if (patente) {
      return this.multasService.encontrarPorVehiculo(patente);
    }
    return this.multasService.encontrarTodas();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una multa por ID' })
  @ApiResponse({ status: 200, description: 'Multa encontrada' })
  @ApiResponse({ status: 404, description: 'Multa no encontrada' })
  encontrarPorId(@Param('id') id: string) {
    return this.multasService.encontrarPorId(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una multa' })
  @ApiResponse({ status: 200, description: 'Multa actualizada' })
  @ApiResponse({ status: 404, description: 'Multa no encontrada' })
  actualizar(@Param('id') id: string, @Body() updateMultaDto: UpdateMultaDto) {
    return this.multasService.actualizar(+id, updateMultaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una multa' })
  @ApiResponse({ status: 200, description: 'Multa eliminada' })
  @ApiResponse({ status: 404, description: 'Multa no encontrada' })
  eliminar(@Param('id') id: string) {
    return this.multasService.eliminar(+id);
  }
}
