import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chofer } from '../entities/chofer.entity';
import { CreateChoferDto } from '../dto/create-chofer.dto';
import { UpdateChoferDto } from '../dto/update-chofer.dto';
import { validarRUT, limpiarRUT } from '../../../common/utils/validators';

@Injectable()
export class ChoferesService {
  constructor(
    @InjectRepository(Chofer)
    private readonly choferRepository: Repository<Chofer>,
  ) {}

  async crear(createChoferDto: CreateChoferDto): Promise<Chofer> {
    const rutLimpio = limpiarRUT(createChoferDto.rut);

    if (!validarRUT(rutLimpio)) {
      throw new NotFoundException(`RUT ${createChoferDto.rut} no es válido`);
    }

    const chofer = this.choferRepository.create({
      ...createChoferDto,
      rut: rutLimpio,
    });

    return await this.choferRepository.save(chofer);
  }

  async encontrarTodos(): Promise<Chofer[]> {
    return await this.choferRepository.find({
      relations: ['vehiculos'],
      where: { activo: true },
    });
  }

  async encontrarPorRUT(rut: string): Promise<Chofer> {
    const rutLimpio = limpiarRUT(rut);
    const chofer = await this.choferRepository.findOne({
      where: { rut: rutLimpio },
      relations: ['vehiculos'],
    });

    if (!chofer) {
      throw new NotFoundException(`Chofer con RUT ${rut} no encontrado`);
    }

    return chofer;
  }

  async actualizar(
    rut: string,
    updateChoferDto: UpdateChoferDto,
  ): Promise<Chofer> {
    const chofer = await this.encontrarPorRUT(rut);

    Object.assign(chofer, updateChoferDto);
    return await this.choferRepository.save(chofer);
  }

  async eliminar(rut: string): Promise<void> {
    const chofer = await this.encontrarPorRUT(rut);
    chofer.activo = false;
    await this.choferRepository.save(chofer);
  }
}

