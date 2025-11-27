import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { configuracionWinston } from './config/winston.config';
import { FiltroExcepcionesHttp } from './common/filters/http-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { VehiculosModule } from './modules/vehiculos/vehiculos.module';
import { ChoferesModule } from './modules/choferes/choferes.module';
import { CumplimientoLegalModule } from './modules/cumplimiento-legal/cumplimiento-legal.module';
import { GastosModule } from './modules/gastos/gastos.module';
import { MultasModule } from './modules/multas/multas.module';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'],
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        configService.get('database'),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: Number.parseInt(process.env.THROTTLE_TTL, 10) || 60000,
        limit: Number.parseInt(process.env.THROTTLE_LIMIT, 10) || 10,
      },
    ]),

    // Logging
    WinstonModule.forRoot(configuracionWinston),

    // Módulos de negocio
    AuthModule,
    UsuariosModule,
    VehiculosModule,
    ChoferesModule,
    CumplimientoLegalModule,
    GastosModule,
    MultasModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: FiltroExcepcionesHttp,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule { }
