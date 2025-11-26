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
import { CategoriaGasto } from '../../../common/constants';

@Entity('gastos')
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, name: 'vehiculo_patente' })
  vehiculoPatente: string;

  @ManyToOne(() => Vehiculo, (vehiculo) => vehiculo.gastos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vehiculo_patente' })
  vehiculo: Vehiculo;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: CategoriaGasto,
    default: CategoriaGasto.COMBUSTIBLE,
  })
  categoria: CategoriaGasto;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}

