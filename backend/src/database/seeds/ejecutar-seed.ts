import { DataSource } from 'typeorm';
import { seedUsuarioAdmin } from './usuario-admin.seed';

async function ejecutarSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number.parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'rentacar_db',
    entities: [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'],
    synchronize: false,
  });

  try {
    console.log('Conectando a la base de datos...');
    await dataSource.initialize();
    console.log('Conexión establecida');

    console.log('\n--- Ejecutando seed de usuario administrador ---');
    await seedUsuarioAdmin(dataSource);

    console.log('\n✅ Seeds ejecutados exitosamente');
  } catch (error) {
    console.error('Error ejecutando seeds:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

ejecutarSeeds();

