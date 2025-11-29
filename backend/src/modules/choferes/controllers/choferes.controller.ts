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
import { ChoferesService } from '../services/choferes.service';
import { CreateChoferDto } from '../dto/create-chofer.dto';
import { UpdateChoferDto } from '../dto/update-chofer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('choferes')
export class ChoferesController {
  constructor(private readonly choferesService: ChoferesService) { }

  @Post()
  crear(@Body() createChoferDto: CreateChoferDto) {
    return this.choferesService.crear(createChoferDto);
  }

  @Get()
  encontrarTodos() {
    return this.choferesService.encontrarTodos();
  }

  @Get(':rut')
  encontrarPorRUT(@Param('rut') rut: string) {
    return this.choferesService.encontrarPorRUT(rut);
  }

  @Patch(':rut')
  actualizar(
    @Param('rut') rut: string,
    @Body() updateChoferDto: UpdateChoferDto,
  ) {
    return this.choferesService.actualizar(rut, updateChoferDto);
  }

  @Delete(':rut')
  eliminar(@Param('rut') rut: string) {
    return this.choferesService.eliminar(rut);
  }
}
