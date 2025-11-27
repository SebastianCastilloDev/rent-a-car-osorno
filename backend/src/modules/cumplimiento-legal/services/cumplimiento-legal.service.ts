import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RevisionTecnica } from '../entities/revision-tecnica.entity';
import { PermisoCirculacion } from '../entities/permiso-circulacion.entity';
import { CreateRevisionTecnicaDto } from '../dto/create-revision-tecnica.dto';
import { UpdateRevisionTecnicaDto } from '../dto/update-revision-tecnica.dto';
import { CreatePermisoCirculacionDto } from '../dto/create-permiso-circulacion.dto';
import { UpdatePermisoCirculacionDto } from '../dto/update-permiso-circulacion.dto';

@Injectable()
export class CumplimientoLegalService {
  constructor(
    @InjectRepository(RevisionTecnica)
    private readonly revisionTecnicaRepository: Repository<RevisionTecnica>,
    @InjectRepository(PermisoCirculacion)
    private readonly permisoCirculacionRepository: Repository<PermisoCirculacion>,
  ) {}

  // Revisiones Técnicas
  async crearRevisionTecnica(
    dto: CreateRevisionTecnicaDto,
  ): Promise<RevisionTecnica> {
    const revision = this.revisionTecnicaRepository.create(dto);
    return await this.revisionTecnicaRepository.save(revision);
  }

  async encontrarRevisionesTecnicas(): Promise<RevisionTecnica[]> {
    return await this.revisionTecnicaRepository.find({
      relations: ['vehiculo'],
      order: { fechaRevision: 'DESC' },
    });
  }

  async encontrarRevisionTecnicaPorId(id: number): Promise<RevisionTecnica> {
    const revision = await this.revisionTecnicaRepository.findOne({
      where: { id },
      relations: ['vehiculo'],
    });

    if (!revision) {
      throw new NotFoundException(
        `Revisión técnica con ID ${id} no encontrada`,
      );
    }

    return revision;
  }

  async actualizarRevisionTecnica(
    id: number,
    dto: UpdateRevisionTecnicaDto,
  ): Promise<RevisionTecnica> {
    const revision = await this.encontrarRevisionTecnicaPorId(id);
    Object.assign(revision, dto);
    return await this.revisionTecnicaRepository.save(revision);
  }

  async eliminarRevisionTecnica(id: number): Promise<void> {
    const revision = await this.encontrarRevisionTecnicaPorId(id);
    await this.revisionTecnicaRepository.remove(revision);
  }

  // Permisos de Circulación
  async crearPermisoCirculacion(
    dto: CreatePermisoCirculacionDto,
  ): Promise<PermisoCirculacion> {
    const permiso = this.permisoCirculacionRepository.create(dto);
    return await this.permisoCirculacionRepository.save(permiso);
  }

  async encontrarPermisosCirculacion(): Promise<PermisoCirculacion[]> {
    return await this.permisoCirculacionRepository.find({
      relations: ['vehiculo'],
      order: { anio: 'DESC' },
    });
  }

  async encontrarPermisoCirculacionPorId(
    id: number,
  ): Promise<PermisoCirculacion> {
    const permiso = await this.permisoCirculacionRepository.findOne({
      where: { id },
      relations: ['vehiculo'],
    });

    if (!permiso) {
      throw new NotFoundException(
        `Permiso de circulación con ID ${id} no encontrado`,
      );
    }

    return permiso;
  }

  async actualizarPermisoCirculacion(
    id: number,
    dto: UpdatePermisoCirculacionDto,
  ): Promise<PermisoCirculacion> {
    const permiso = await this.encontrarPermisoCirculacionPorId(id);
    Object.assign(permiso, dto);
    return await this.permisoCirculacionRepository.save(permiso);
  }

  async eliminarPermisoCirculacion(id: number): Promise<void> {
    const permiso = await this.encontrarPermisoCirculacionPorId(id);
    await this.permisoCirculacionRepository.remove(permiso);
  }
}
