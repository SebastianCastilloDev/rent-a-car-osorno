import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RolUsuario, EstadoUsuario } from '../../../common/constants';

@Entity('usuarios')
export class Usuario {
  @PrimaryColumn({ type: 'varchar', length: 12 })
  rut: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
    default: RolUsuario.USUARIO,
  })
  rol: RolUsuario;

  @Column({
    type: 'enum',
    enum: EstadoUsuario,
    default: EstadoUsuario.PENDIENTE,
    name: 'estado',
  })
  estado: EstadoUsuario;

  @Column({ type: 'varchar', length: 12, nullable: true, name: 'aprobado_por' })
  aprobadoPor: string;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'aprobado_por' })
  aprobadorUsuario: Usuario;

  @Column({ type: 'timestamp', nullable: true, name: 'fecha_aprobacion' })
  fechaAprobacion: Date;

  @Column({ type: 'text', nullable: true, name: 'motivo_rechazo' })
  motivoRechazo: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
