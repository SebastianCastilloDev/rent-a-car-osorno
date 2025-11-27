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

@Entity('permisos_circulacion')
export class PermisoCirculacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'vehiculo_patente' })
  vehiculoPatente: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.permisosCirculacion, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehiculo_patente' })
  vehiculo: Vehiculo;

  @Column({ type: 'integer' })
  anio: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monto_permiso' })
  montoPermiso: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monto_soap' })
  montoSoap: number;

  @Column({ type: 'date', name: 'fecha_pago', nullable: true })
  fechaPago: Date;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
