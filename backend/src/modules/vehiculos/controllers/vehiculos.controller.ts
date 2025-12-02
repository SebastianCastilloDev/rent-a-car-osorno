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
import { VehiculosService } from '../services/vehiculos.service';
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from '../dto/update-vehiculo.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) { }

  @Post()
  crear(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.crear(createVehiculoDto);
  }

  @Get()
  encontrarTodos() {
    return this.vehiculosService.encontrarTodos();
  }

  @Get(':patente')
  encontrarPorPatente(@Param('patente') patente: string) {
    return this.vehiculosService.encontrarPorPatente(patente);
  }

  @Patch(':patente')
  actualizar(
    @Param('patente') patente: string,
    @Body() updateVehiculoDto: UpdateVehiculoDto,
  ) {
    return this.vehiculosService.actualizar(patente, updateVehiculoDto);
  }

  @Delete(':patente')
  eliminar(@Param('patente') patente: string) {
    return this.vehiculosService.eliminar(patente);
  }
}
