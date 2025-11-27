import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gasto } from './entities/gasto.entity';
import { GastosController } from './controllers/gastos.controller';
import { GastosService } from './services/gastos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gasto])],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService, TypeOrmModule],
})
export class GastosModule { }
