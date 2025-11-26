import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.encontrarPorEmail(
      loginDto.email,
    );

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const esPasswordValido = await bcrypt.compare(
      loginDto.password,
      usuario.password,
    );

    if (!esPasswordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!usuario.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const payload = {
      sub: usuario.rut,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}


