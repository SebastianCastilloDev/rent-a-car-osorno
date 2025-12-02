import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { RolUsuario, EstadoUsuario } from '../../../common/constants';

@Injectable()
export class AuthService {
  private readonly emailsSuperAdmin: string[];

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Cargar lista de emails de super admins desde variable de entorno
    const emailsEnv = this.configService.get<string>('SUPER_ADMIN_EMAILS', '');
    this.emailsSuperAdmin = emailsEnv
      .split(',')
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0);
  }

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

    // Verificar estado de aprobación
    if (usuario.estado === EstadoUsuario.PENDIENTE) {
      throw new UnauthorizedException(
        'Tu cuenta está pendiente de aprobación por un administrador',
      );
    }

    if (usuario.estado === EstadoUsuario.RECHAZADO) {
      const mensaje = usuario.motivoRechazo
        ? `Tu cuenta ha sido rechazada. Motivo: ${usuario.motivoRechazo}`
        : 'Tu cuenta ha sido rechazada';
      throw new UnauthorizedException(mensaje);
    }

    if (usuario.estado === EstadoUsuario.SUSPENDIDO) {
      throw new UnauthorizedException('Tu cuenta ha sido suspendida');
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
        estado: usuario.estado,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya existe
    const usuarioExistentePorEmail =
      await this.usuariosService.encontrarPorEmail(registerDto.email);

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

    // Determinar rol y estado según whitelist
    const emailNormalizado = registerDto.email.toLowerCase().trim();
    const esSuperAdmin = this.emailsSuperAdmin.includes(emailNormalizado);

    let rol: RolUsuario;
    let estado: EstadoUsuario;

    if (esSuperAdmin) {
      rol = RolUsuario.SUPER_ADMIN;
      estado = EstadoUsuario.APROBADO;
    } else {
      rol = RolUsuario.USUARIO;
      estado = EstadoUsuario.PENDIENTE;
    }

    // Crear el usuario con rol y estado determinados
    const datosUsuario = {
      ...registerDto,
      rol,
      estado,
    };

    const usuario = await this.usuariosService.crear(datosUsuario);

    // Si es super admin aprobado, generar token inmediatamente
    if (esSuperAdmin) {
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
          estado: usuario.estado,
        },
        mensaje:
          'Registro exitoso. Has sido registrado como Super Administrador.',
      };
    }

    // Si es usuario normal, no generar token (debe esperar aprobación)
    return {
      mensaje:
        'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador. Te notificaremos cuando sea aprobada.',
      usuario: {
        rut: usuario.rut,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        estado: usuario.estado,
      },
    };
  }
}
