import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chofer } from '../../choferes/entities/chofer.entity';
import { RevisionTecnica } from '../../cumplimiento-legal/entities/revision-tecnica.entity';
import { PermisoCirculacion } from '../../cumplimiento-legal/entities/permiso-circulacion.entity';
import { Multa } from '../../multas/entities/multa.entity';
import { Gasto } from '../../gastos/entities/gasto.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryColumn({ type: 'varchar', length: 10 })
  patente: string;

  @Column({ type: 'varchar', length: 1 })
  dv: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  proveedor: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'numero_factura',
  })
  numeroFactura: string;

  @Column({ type: 'date', nullable: true, name: 'fecha_compra' })
  fechaCompra: Date;

  @Column({ type: 'varchar', length: 50 })
  tipo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  condicion: string;

  @Column({ type: 'integer' })
  anio: number;

  @Column({ type: 'varchar', length: 50 })
  marca: string;

  @Column({ type: 'varchar', length: 50 })
  modelo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  motor: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  chassis: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  color: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  transmision: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  combustible: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'ubicacion_actual',
  })
  ubicacionActual: string;

  @Column({ type: 'varchar', length: 12, nullable: true, name: 'chofer_rut' })
  choferRut: string;

  @ManyToOne(() => Chofer, (chofer) => chofer.vehiculos, { nullable: true })
  @JoinColumn({ name: 'chofer_rut' })
  chofer: Chofer;

  @OneToMany(() => RevisionTecnica, (revision) => revision.vehiculo)
  revisionesTecnicas: RevisionTecnica[];

  @OneToMany(() => PermisoCirculacion, (permiso) => permiso.vehiculo)
  permisosCirculacion: PermisoCirculacion[];

  @OneToMany(() => Multa, (multa) => multa.vehiculo)
  multas: Multa[];

  @OneToMany(() => Gasto, (gasto) => gasto.vehiculo)
  gastos: Gasto[];

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}
