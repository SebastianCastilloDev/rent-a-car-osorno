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
    const usuario = await this.usuariosService.encontrarPorRUT(payload.sub);

    if (!usuario?.activo) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return {
      rut: usuario.rut,
      email: usuario.email,
      rol: usuario.rol,
    };
  }
}
