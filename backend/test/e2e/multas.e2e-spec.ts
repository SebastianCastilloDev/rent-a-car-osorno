import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configuracionValidacionGlobal } from '../../src/config/validation.config';
import { registrarYObtenerTokenJwtParaPruebas } from './utilidades-autenticacion';
import { EstadoPagoMulta } from '../../src/common/constants';

describe('Multas - CRUD (e2e)', () => {
    let app: INestApplication;
    let tokenJwt: string;
    const patenteVehiculo = 'DDEE12';
    let idMulta: number;

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
                dv: '4',
                tipo: 'Hatchback',
                anio: anioActual,
                marca: 'Chevrolet',
                modelo: 'Onix',
                color: 'Rojo',
            })
            .expect(201);
    });

    afterAll(async () => {
        await app.close();
    });

    it('debería crear una multa', async () => {
        const respuesta = await request(app.getHttpServer())
            .post('/api/multas')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                vehiculoPatente: patenteVehiculo,
                fechaInfraccion: new Date().toISOString(),
                tipoInfraccion: 'Exceso de velocidad',
                monto: 150000,
                estadoPago: EstadoPagoMulta.PENDIENTE,
                descripcion: 'Multa generada para pruebas',
            })
            .expect(201);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBeDefined();
        idMulta = respuesta.body.id;
    });

    it('debería listar las multas', async () => {
        const respuesta = await request(app.getHttpServer())
            .get('/api/multas')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.some((multa: { id: number }) => multa.id === idMulta),
        ).toBe(true);
    });

    it('debería listar las multas filtrando por patente', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/multas?patente=${patenteVehiculo}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.every(
                (multa: { vehiculoPatente: string }) =>
                    multa.vehiculoPatente === patenteVehiculo,
            ),
        ).toBe(true);
    });

    it('debería obtener una multa por ID', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/multas/${idMulta}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBe(idMulta);
    });

    it('debería actualizar una multa', async () => {
        const nuevoEstado = EstadoPagoMulta.PAGADA;

        const respuesta = await request(app.getHttpServer())
            .patch(`/api/multas/${idMulta}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                estadoPago: nuevoEstado,
            })
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.estadoPago).toBe(nuevoEstado);
    });

    it('debería eliminar una multa', async () => {
        await request(app.getHttpServer())
            .delete(`/api/multas/${idMulta}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);
    });
});


