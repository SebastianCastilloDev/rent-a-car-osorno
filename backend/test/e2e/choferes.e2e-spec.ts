import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configuracionValidacionGlobal } from '../../src/config/validation.config';
import { registrarYObtenerTokenJwtParaPruebas } from './utilidades-autenticacion';

describe('Choferes - CRUD (e2e)', () => {
    let app: INestApplication;
    let tokenJwt: string;
    const rutChofer = '123456785';

    beforeAll(async () => {
        const moduloPruebas: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduloPruebas.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(configuracionValidacionGlobal);
        await app.init();

        tokenJwt = await registrarYObtenerTokenJwtParaPruebas(app);
    });

    afterAll(async () => {
        await app.close();
    });

    it('debería crear un chofer', async () => {
        const respuesta = await request(app.getHttpServer())
            .post('/api/choferes')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                rut: rutChofer,
                nombre: 'Juan',
                apellido: 'Pérez',
                telefono: '+56912345678',
            })
            .expect(201);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.rut).toBe(rutChofer);
    });

    it('debería listar los choferes', async () => {
        const respuesta = await request(app.getHttpServer())
            .get('/api/choferes')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.some(
                (chofer: { rut: string }) => chofer.rut === rutChofer,
            ),
        ).toBe(true);
    });

    it('debería obtener un chofer por RUT', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/choferes/${rutChofer}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.rut).toBe(rutChofer);
    });

    it('debería actualizar un chofer', async () => {
        const nuevoNombre = 'Juan Actualizado';

        const respuesta = await request(app.getHttpServer())
            .patch(`/api/choferes/${rutChofer}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                nombre: nuevoNombre,
            })
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.nombre).toBe(nuevoNombre);
    });

    it('debería eliminar (desactivar) un chofer', async () => {
        await request(app.getHttpServer())
            .delete(`/api/choferes/${rutChofer}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);
    });
});


