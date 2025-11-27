import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Multa } from '../entities/multa.entity';
import { CreateMultaDto } from '../dto/create-multa.dto';
import { UpdateMultaDto } from '../dto/update-multa.dto';

@Injectable()
export class MultasService {
  constructor(
    @InjectRepository(Multa)
    private readonly multaRepository: Repository<Multa>,
  ) { }

  async crear(createMultaDto: CreateMultaDto): Promise<Multa> {
    const multa = this.multaRepository.create(createMultaDto);
    return await this.multaRepository.save(multa);
  }

  async encontrarTodas(): Promise<Multa[]> {
    return await this.multaRepository.find({
      relations: ['vehiculo'],
      order: { fechaInfraccion: 'DESC' },
    });
  }

  async encontrarPorId(id: number): Promise<Multa> {
    const multa = await this.multaRepository.findOne({
      where: { id },
      relations: ['vehiculo'],
    });

    if (!multa) {
      throw new NotFoundException(`Multa con ID ${id} no encontrada`);
    }

    return multa;
  }

  async encontrarPorVehiculo(patente: string): Promise<Multa[]> {
    return await this.multaRepository.find({
      where: { vehiculoPatente: patente },
      relations: ['vehiculo'],
      order: { fechaInfraccion: 'DESC' },
    });
  }

  async actualizar(id: number, updateMultaDto: UpdateMultaDto): Promise<Multa> {
    const multa = await this.encontrarPorId(id);
    Object.assign(multa, updateMultaDto);
    return await this.multaRepository.save(multa);
  }

  async eliminar(id: number): Promise<void> {
    const multa = await this.encontrarPorId(id);
    await this.multaRepository.remove(multa);
  }
}
