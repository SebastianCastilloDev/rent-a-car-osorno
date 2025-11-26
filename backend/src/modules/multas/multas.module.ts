import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Multa } from './entities/multa.entity';
import { MultasController } from './controllers/multas.controller';
import { MultasService } from './services/multas.service';

@Module({
  imports: [TypeOrmModule.forFeature([Multa])],
  controllers: [MultasController],
  providers: [MultasService],
  exports: [MultasService, TypeOrmModule],
})
export class MultasModule {}

