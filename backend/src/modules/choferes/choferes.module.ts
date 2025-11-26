import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chofer } from './entities/chofer.entity';
import { ChoferesController } from './controllers/choferes.controller';
import { ChoferesService } from './services/choferes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chofer])],
  controllers: [ChoferesController],
  providers: [ChoferesService],
  exports: [ChoferesService, TypeOrmModule],
})
export class ChoferesModule {}

