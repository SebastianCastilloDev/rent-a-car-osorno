import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vehiculo } from '../../vehiculos/entities/vehiculo.entity';
import { EstadoRevisionTecnica } from '../../../common/constants';

@Entity('revisiones_tecnicas')
export class RevisionTecnica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'vehiculo_patente' })
  vehiculoPatente: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.revisionesTecnicas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehiculo_patente' })
  vehiculo: Vehiculo;

  @Column({ type: 'date', name: 'fecha_revision' })
  fechaRevision: Date;

  @Column({
    type: 'enum',
    enum: EstadoRevisionTecnica,
    default: EstadoRevisionTecnica.APROBADA,
  })
  estado: EstadoRevisionTecnica;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

