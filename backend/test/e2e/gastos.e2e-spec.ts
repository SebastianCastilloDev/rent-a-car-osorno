import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configuracionValidacionGlobal } from '../../src/config/validation.config';
import { registrarYObtenerTokenJwtParaPruebas } from './utilidades-autenticacion';
import { CategoriaGasto } from '../../src/common/constants';

describe('Gastos - CRUD (e2e)', () => {
    let app: INestApplication;
    let tokenJwt: string;
    const patenteVehiculo = 'CCDD12';
    let idGasto: number;

    beforeAll(async () => {
        const moduloPruebas: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduloPruebas.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(configuracionValidacionGlobal);
        await app.init();

        tokenJwt = await registrarYObtenerTokenJwtParaPruebas(app);

        const anioActual = new Date().getFullYear();

        await request(app.getHttpServer())
            .post('/api/vehiculos')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                patente: patenteVehiculo,
                dv: '3',
                tipo: 'Sedán',
                anio: anioActual,
                marca: 'Kia',
                modelo: 'Cerato',
                color: 'Azul',
            })
            .expect(201);
    });

    afterAll(async () => {
        await app.close();
    });

    it('debería crear un gasto', async () => {
        const respuesta = await request(app.getHttpServer())
            .post('/api/gastos')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                vehiculoPatente: patenteVehiculo,
                fecha: new Date().toISOString(),
                categoria: CategoriaGasto.COMBUSTIBLE,
                monto: 50000,
                descripcion: 'Llenado de estanque',
            })
            .expect(201);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBeDefined();
        idGasto = respuesta.body.id;
    });

    it('debería listar los gastos', async () => {
        const respuesta = await request(app.getHttpServer())
            .get('/api/gastos')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.some((gasto: { id: number }) => gasto.id === idGasto),
        ).toBe(true);
    });

    it('debería listar los gastos filtrando por patente', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/gastos?patente=${patenteVehiculo}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.every(
                (gasto: { vehiculoPatente: string }) =>
                    gasto.vehiculoPatente === patenteVehiculo,
            ),
        ).toBe(true);
    });

    it('debería obtener un gasto por ID', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/gastos/${idGasto}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBe(idGasto);
    });

    it('debería actualizar un gasto', async () => {
        const nuevoMonto = 60000;

        const respuesta = await request(app.getHttpServer())
            .patch(`/api/gastos/${idGasto}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                monto: nuevoMonto,
            })
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.monto).toBe(nuevoMonto);
    });

    it('debería eliminar un gasto', async () => {
        await request(app.getHttpServer())
            .delete(`/api/gastos/${idGasto}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);
    });
});


