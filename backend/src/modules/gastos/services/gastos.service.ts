import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Gasto } from '../entities/gasto.entity';
import { CreateGastoDto } from '../dto/create-gasto.dto';
import { UpdateGastoDto } from '../dto/update-gasto.dto';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private readonly gastoRepository: Repository<Gasto>,
  ) {}

  async crear(createGastoDto: CreateGastoDto): Promise<Gasto> {
    const gasto = this.gastoRepository.create(createGastoDto);
    return await this.gastoRepository.save(gasto);
  }

  async encontrarTodos(): Promise<Gasto[]> {
    return await this.gastoRepository.find({
      relations: ['vehiculo'],
      order: { fecha: 'DESC' },
    });
  }

  async encontrarPorId(id: number): Promise<Gasto> {
    const gasto = await this.gastoRepository.findOne({
      where: { id },
      relations: ['vehiculo'],
    });

    if (!gasto) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }

    return gasto;
  }

  async encontrarPorVehiculo(patente: string): Promise<Gasto[]> {
    return await this.gastoRepository.find({
      where: { vehiculoPatente: patente },
      relations: ['vehiculo'],
      order: { fecha: 'DESC' },
    });
  }

  async actualizar(id: number, updateGastoDto: UpdateGastoDto): Promise<Gasto> {
    const gasto = await this.encontrarPorId(id);
    Object.assign(gasto, updateGastoDto);
    return await this.gastoRepository.save(gasto);
  }

  async eliminar(id: number): Promise<void> {
    const gasto = await this.encontrarPorId(id);
    await this.gastoRepository.remove(gasto);
  }
}
