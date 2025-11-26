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
import { EstadoPagoMulta } from '../../../common/constants';

@Entity('multas')
export class Multa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'vehiculo_patente' })
  vehiculoPatente: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.multas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehiculo_patente' })
  vehiculo: Vehiculo;

  @Column({ type: 'date', name: 'fecha_infraccion' })
  fechaInfraccion: Date;

  @Column({ type: 'varchar', length: 100, name: 'tipo_infraccion' })
  tipoInfraccion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({
    type: 'enum',
    enum: EstadoPagoMulta,
    default: EstadoPagoMulta.PENDIENTE,
    name: 'estado_pago',
  })
  estadoPago: EstadoPagoMulta;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

