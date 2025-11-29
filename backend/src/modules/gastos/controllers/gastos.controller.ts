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
import { ApiBearerAuth } from '@nestjs/swagger';
import { GastosService } from '../services/gastos.service';
import { CreateGastoDto } from '../dto/create-gasto.dto';
import { UpdateGastoDto } from '../dto/update-gasto.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService) { }

  @Post()
  crear(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.crear(createGastoDto);
  }

  @Get()
  encontrarTodos(@Query('patente') patente?: string) {
    if (patente) {
      return this.gastosService.encontrarPorVehiculo(patente);
    }
    return this.gastosService.encontrarTodos();
  }

  @Get(':id')
  encontrarPorId(@Param('id') id: string) {
    return this.gastosService.encontrarPorId(+id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() updateGastoDto: UpdateGastoDto) {
    return this.gastosService.actualizar(+id, updateGastoDto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.gastosService.eliminar(+id);
  }
}
