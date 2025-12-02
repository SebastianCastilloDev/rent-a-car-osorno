import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

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

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const usuarioExistentePorEmail = await this.usuariosService.encontrarPorEmail(
      registerDto.email,
    );

    if (usuarioExistentePorEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el RUT ya existe
    try {
      await this.usuariosService.encontrarPorRUT(registerDto.rut);
      throw new ConflictException('El RUT ya está registrado');
    } catch (error) {
      // Si no existe, continuar con el registro
      if (error instanceof ConflictException) {
        throw error;
      }
    }

    // Crear el usuario
    const usuario = await this.usuariosService.crear(registerDto);

    // Generar token JWT
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
