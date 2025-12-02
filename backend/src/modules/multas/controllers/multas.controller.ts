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
import { MultasService } from '../services/multas.service';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('multas')
export class MultasController {
  constructor(private readonly multasService: MultasService) { }

  @Post()
  crear(@Body() createMultaDto: CreateMultaDto) {
    return this.multasService.crear(createMultaDto);
  }

  @Get()
  encontrarTodas(@Query('patente') patente?: string) {
    if (patente) {
      return this.multasService.encontrarPorVehiculo(patente);
    }
    return this.multasService.encontrarTodas();
  }

  @Get(':id')
  encontrarPorId(@Param('id') id: string) {
    return this.multasService.encontrarPorId(+id);
  }

  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() updateMultaDto: UpdateMultaDto) {
    return this.multasService.actualizar(+id, updateMultaDto);
  }

  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.multasService.eliminar(+id);
  }
}
