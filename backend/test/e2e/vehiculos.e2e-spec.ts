import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configuracionValidacionGlobal } from '../../src/config/validation.config';
import { registrarYObtenerTokenJwtParaPruebas } from './utilidades-autenticacion';

describe('Vehículos - CRUD (e2e)', () => {
    let app: INestApplication;
    let tokenJwt: string;
    const patenteVehiculo = 'AA1234';

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

    it('debería crear un vehículo', async () => {
        const anioActual = new Date().getFullYear();

        const respuesta = await request(app.getHttpServer())
            .post('/api/vehiculos')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                patente: patenteVehiculo,
                dv: '1',
                tipo: 'Camioneta',
                anio: anioActual,
                marca: 'Toyota',
                modelo: 'Hilux',
                color: 'Blanco',
            })
            .expect(201);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.patente).toBe(patenteVehiculo);
    });

    it('debería listar los vehículos', async () => {
        const respuesta = await request(app.getHttpServer())
            .get('/api/vehiculos')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.some(
                (vehiculo: { patente: string }) => vehiculo.patente === patenteVehiculo,
            ),
        ).toBe(true);
    });

    it('debería obtener un vehículo por patente', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/vehiculos/${patenteVehiculo}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.patente).toBe(patenteVehiculo);
    });

    it('debería actualizar un vehículo', async () => {
        const nuevaUbicacion = 'Osorno';

        const respuesta = await request(app.getHttpServer())
            .patch(`/api/vehiculos/${patenteVehiculo}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                ubicacionActual: nuevaUbicacion,
            })
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.ubicacionActual).toBe(nuevaUbicacion);
    });

    it('debería eliminar un vehículo', async () => {
        await request(app.getHttpServer())
            .delete(`/api/vehiculos/${patenteVehiculo}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);
    });
});


