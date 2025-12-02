import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';
import { RolUsuario, EstadoUsuario } from '../../common/constants';

export async function seedUsuarioAdmin(dataSource: DataSource): Promise<void> {
    const usuarioRepository = dataSource.getRepository(Usuario);

    // Verificar si ya existe el usuario admin
    const adminExistente = await usuarioRepository.findOne({
        where: { email: 'admin@rentacar.cl' },
    });

    if (adminExistente) {
        console.log('Usuario administrador ya existe');
        return;
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash('Admin123!', 10);

    // Crear el usuario administrador
    const admin = usuarioRepository.create({
        rut: '11111111-1',
        nombre: 'Administrador',
        apellido: 'Sistema',
        email: 'admin@rentacar.cl',
        password: passwordHash,
        rol: RolUsuario.SUPER_ADMIN,
        estado: EstadoUsuario.APROBADO,
        activo: true,
    });

    await usuarioRepository.save(admin);

    console.log('Usuario administrador creado exitosamente');
    console.log('Email: admin@rentacar.cl');
    console.log('Contraseña: Admin123!');
}

