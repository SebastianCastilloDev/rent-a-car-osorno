import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { AprobarUsuarioDto } from '../dto/aprobar-usuario.dto';
import { RechazarUsuarioDto } from '../dto/rechazar-usuario.dto';
import { EstadoUsuario, RolUsuario } from '../../../common/constants';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) { }

  async crear(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async encontrarTodos(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      select: [
        'rut',
        'nombre',
        'apellido',
        'email',
        'rol',
        'estado',
        'activo',
        'fechaCreacion',
        'fechaAprobacion',
      ],
      relations: ['aprobadorUsuario'],
    });
  }

  async encontrarPorEstado(estado: EstadoUsuario): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { estado },
      select: [
        'rut',
        'nombre',
        'apellido',
        'email',
        'rol',
        'estado',
        'activo',
        'fechaCreacion',
        'motivoRechazo',
      ],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async encontrarPorRUT(rut: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { rut },
      select: ['rut', 'nombre', 'apellido', 'email', 'rol', 'activo'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    return usuario;
  }

  async encontrarPorEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async actualizar(
    rut: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.encontrarPorRUT(rut);

    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(
        updateUsuarioDto.password,
        10,
      );
    }

    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  async eliminar(rut: string): Promise<void> {
    const usuario = await this.encontrarPorRUT(rut);
    await this.usuarioRepository.remove(usuario);
  }

  async aprobarUsuario(
    rut: string,
    aprobadorRut: string,
    aprobarDto: AprobarUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    if (usuario.estado !== EstadoUsuario.PENDIENTE) {
      throw new BadRequestException(
        `El usuario no está en estado pendiente. Estado actual: ${usuario.estado}`,
      );
    }

    // Si no se especifica rol, usar el rol actual del usuario
    const rolAsignado = aprobarDto.rol || usuario.rol;

    // No permitir asignar SUPER_ADMIN desde aprobación manual
    if (rolAsignado === RolUsuario.SUPER_ADMIN) {
      throw new BadRequestException(
        'No se puede asignar el rol SUPER_ADMIN manualmente',
      );
    }

    usuario.estado = EstadoUsuario.APROBADO;
    usuario.rol = rolAsignado;
    usuario.aprobadoPor = aprobadorRut;
    usuario.fechaAprobacion = new Date();
    usuario.motivoRechazo = null;

    return await this.usuarioRepository.save(usuario);
  }

  async rechazarUsuario(
    rut: string,
    rechazadorRut: string,
    rechazarDto: RechazarUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    if (usuario.estado !== EstadoUsuario.PENDIENTE) {
      throw new BadRequestException(
        `El usuario no está en estado pendiente. Estado actual: ${usuario.estado}`,
      );
    }

    usuario.estado = EstadoUsuario.RECHAZADO;
    usuario.motivoRechazo = rechazarDto.motivoRechazo;
    usuario.aprobadoPor = rechazadorRut;
    usuario.fechaAprobacion = new Date();

    return await this.usuarioRepository.save(usuario);
  }

  async suspenderUsuario(
    rut: string,
    suspensorRut: string,
    motivo: string,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    if (usuario.rol === RolUsuario.SUPER_ADMIN) {
      throw new BadRequestException('No se puede suspender a un Super Admin');
    }

    usuario.estado = EstadoUsuario.SUSPENDIDO;
    usuario.motivoRechazo = motivo;
    usuario.aprobadoPor = suspensorRut;

    return await this.usuarioRepository.save(usuario);
  }

  async reactivarUsuario(rut: string, reactivadorRut: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { rut } });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    if (
      usuario.estado !== EstadoUsuario.SUSPENDIDO &&
      usuario.estado !== EstadoUsuario.RECHAZADO
    ) {
      throw new BadRequestException(
        `El usuario no está suspendido ni rechazado. Estado actual: ${usuario.estado}`,
      );
    }

    usuario.estado = EstadoUsuario.APROBADO;
    usuario.motivoRechazo = null;
    usuario.aprobadoPor = reactivadorRut;
    usuario.fechaAprobacion = new Date();

    return await this.usuarioRepository.save(usuario);
  }
}
