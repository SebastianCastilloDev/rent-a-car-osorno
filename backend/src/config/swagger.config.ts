import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const configurarSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Flota Rent-a-Car')
    .setDescription(
      'API para gestión de flota de vehículos, choferes, cumplimiento legal y gastos operacionales',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Autenticación', 'Endpoints para autenticación de usuarios')
    .addTag('Vehículos', 'Gestión de vehículos de la flota')
    .addTag('Choferes', 'Gestión de choferes')
    .addTag('Cumplimiento Legal', 'Revisión técnica y permisos de circulación')
    .addTag('Gastos', 'Registro de gastos operacionales')
    .addTag('Multas', 'Registro de multas e infracciones')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
};
