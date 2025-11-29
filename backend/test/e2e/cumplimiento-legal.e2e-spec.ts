import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { configuracionValidacionGlobal } from '../../src/config/validation.config';
import { registrarYObtenerTokenJwtParaPruebas } from './utilidades-autenticacion';
import {
    EstadoRevisionTecnica,
} from '../../src/common/constants';

describe('Cumplimiento Legal - Revisiones Técnicas y Permisos de Circulación (e2e)', () => {
    let app: INestApplication;
    let tokenJwt: string;
    const patenteVehiculo = 'BB1234';
    let idRevisionTecnica: number;
    let idPermisoCirculacion: number;

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
                dv: '2',
                tipo: 'SUV',
                anio: anioActual,
                marca: 'Hyundai',
                modelo: 'Tucson',
                color: 'Gris',
            })
            .expect(201);
    });

    afterAll(async () => {
        await app.close();
    });

    it('debería crear una revisión técnica', async () => {
        const respuesta = await request(app.getHttpServer())
            .post('/api/cumplimiento-legal/revisiones-tecnicas')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                vehiculoPatente: patenteVehiculo,
                fechaRevision: new Date().toISOString(),
                estado: EstadoRevisionTecnica.APROBADA,
                observaciones: 'Revisión inicial aprobada',
            })
            .expect(201);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBeDefined();
        idRevisionTecnica = respuesta.body.id;
    });

    it('debería listar las revisiones técnicas', async () => {
        const respuesta = await request(app.getHttpServer())
            .get('/api/cumplimiento-legal/revisiones-tecnicas')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.some(
                (revision: { id: number }) => revision.id === idRevisionTecnica,
            ),
        ).toBe(true);
    });

    it('debería obtener una revisión técnica por ID', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(`/api/cumplimiento-legal/revisiones-tecnicas/${idRevisionTecnica}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBe(idRevisionTecnica);
    });

    it('debería actualizar una revisión técnica', async () => {
        const nuevaObservacion = 'Revisión actualizada';

        const respuesta = await request(app.getHttpServer())
            .patch(`/api/cumplimiento-legal/revisiones-tecnicas/${idRevisionTecnica}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                estado: EstadoRevisionTecnica.HOMOLOGADA,
                observaciones: nuevaObservacion,
            })
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.observaciones).toBe(nuevaObservacion);
    });

    it('debería crear un permiso de circulación', async () => {
        const anioActual = new Date().getFullYear();

        const respuesta = await request(app.getHttpServer())
            .post('/api/cumplimiento-legal/permisos-circulacion')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                vehiculoPatente: patenteVehiculo,
                anio: anioActual,
                montoPermiso: 45000,
                montoSoap: 12000,
                fechaPago: new Date().toISOString(),
            })
            .expect(201);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBeDefined();
        idPermisoCirculacion = respuesta.body.id;
    });

    it('debería listar los permisos de circulación', async () => {
        const respuesta = await request(app.getHttpServer())
            .get('/api/cumplimiento-legal/permisos-circulacion')
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(Array.isArray(respuesta.body)).toBe(true);
        expect(
            respuesta.body.some(
                (permiso: { id: number }) => permiso.id === idPermisoCirculacion,
            ),
        ).toBe(true);
    });

    it('debería obtener un permiso de circulación por ID', async () => {
        const respuesta = await request(app.getHttpServer())
            .get(
                `/api/cumplimiento-legal/permisos-circulacion/${idPermisoCirculacion}`,
            )
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.id).toBe(idPermisoCirculacion);
    });

    it('debería actualizar un permiso de circulación', async () => {
        const nuevoMontoPermiso = 55000;

        const respuesta = await request(app.getHttpServer())
            .patch(
                `/api/cumplimiento-legal/permisos-circulacion/${idPermisoCirculacion}`,
            )
            .set('Authorization', `Bearer ${tokenJwt}`)
            .send({
                montoPermiso: nuevoMontoPermiso,
            })
            .expect(200);

        expect(respuesta.body).toBeDefined();
        expect(respuesta.body.montoPermiso).toBe(nuevoMontoPermiso);
    });

    it('debería eliminar una revisión técnica', async () => {
        await request(app.getHttpServer())
            .delete(`/api/cumplimiento-legal/revisiones-tecnicas/${idRevisionTecnica}`)
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);
    });

    it('debería eliminar un permiso de circulación', async () => {
        await request(app.getHttpServer())
            .delete(
                `/api/cumplimiento-legal/permisos-circulacion/${idPermisoCirculacion}`,
            )
            .set('Authorization', `Bearer ${tokenJwt}`)
            .expect(200);
    });
});


