import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../../usuarios/services/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    try {
      const usuario = await this.usuariosService.encontrarPorRUT(payload.sub);

      if (!usuario?.activo) {
        throw new UnauthorizedException('Usuario no autorizado');
      }

      return {
        sub: usuario.rut, // Usado por los controladores para obtener el RUT del usuario autenticado
        rut: usuario.rut, // Mantener por compatibilidad
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado,
      };
    } catch (error) {
      // Si el usuario no existe o hay cualquier error, lanzar UnauthorizedException
      // para que el interceptor del frontend maneje correctamente el 401
      throw new UnauthorizedException('Usuario no autorizado');
    }
  }
}
