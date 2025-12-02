import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RolUsuario } from '../../src/common/constants';

interface RespuestaAutenticacion {
    access_token: string;
}

export const registrarYObtenerTokenJwtParaPruebas = async (
    app: INestApplication,
): Promise<string> => {
    const timestamp = Date.now();
    const rutBase = 10000000 + (timestamp % 8999999);

    const datosRegistro = {
        rut: `${rutBase}K`,
        nombre: 'Usuario',
        apellido: 'Pruebas',
        email: `usuario.pruebas+${timestamp}@example.com`,
        password: 'password123',
        rol: RolUsuario.ADMIN,
    };

    const respuesta = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(datosRegistro)
        .expect(201);

    const cuerpo = respuesta.body as RespuestaAutenticacion;

    return cuerpo.access_token;
};


