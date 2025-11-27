import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';

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
        'activo',
        'fechaCreacion',
      ],
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
}
