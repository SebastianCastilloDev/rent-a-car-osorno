import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from '../entities/vehiculo.entity';
import { CreateVehiculoDto } from '../dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from '../dto/update-vehiculo.dto';
import {
  validarPatente,
  limpiarPatente,
} from '../../../common/utils/validators';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
  ) { }

  async crear(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const patenteLimpia = limpiarPatente(createVehiculoDto.patente);

    if (!validarPatente(patenteLimpia)) {
      throw new NotFoundException(
        `Patente ${createVehiculoDto.patente} no es válida`,
      );
    }

    const vehiculo = this.vehiculoRepository.create({
      ...createVehiculoDto,
      patente: patenteLimpia,
    });

    return await this.vehiculoRepository.save(vehiculo);
  }

  async encontrarTodos(): Promise<Vehiculo[]> {
    return await this.vehiculoRepository.find({
      relations: ['chofer', 'revisionesTecnicas', 'permisosCirculacion'],
    });
  }

  async encontrarPorPatente(patente: string): Promise<Vehiculo> {
    const patenteLimpia = limpiarPatente(patente);
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { patente: patenteLimpia },
      relations: [
        'chofer',
        'revisionesTecnicas',
        'permisosCirculacion',
        'multas',
        'gastos',
      ],
    });

    if (!vehiculo) {
      throw new NotFoundException(
        `Vehículo con patente ${patente} no encontrado`,
      );
    }

    return vehiculo;
  }

  async actualizar(
    patente: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const vehiculo = await this.encontrarPorPatente(patente);

    Object.assign(vehiculo, updateVehiculoDto);
    return await this.vehiculoRepository.save(vehiculo);
  }

  async eliminar(patente: string): Promise<void> {
    const vehiculo = await this.encontrarPorPatente(patente);
    await this.vehiculoRepository.remove(vehiculo);
  }
}
