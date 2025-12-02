import { MigrationInterface, QueryRunner } from 'typeorm';

export class AgregarSistemaAprobacionUsuarios1733184000000
  implements MigrationInterface
{
  name = 'AgregarSistemaAprobacionUsuarios1733184000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar el nuevo rol SUPER_ADMIN al enum
    await queryRunner.query(`
      ALTER TYPE "public"."usuarios_rol_enum" RENAME TO "usuarios_rol_enum_old"
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('super_admin', 'admin', 'usuario')
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ALTER COLUMN "rol" TYPE "public"."usuarios_rol_enum" 
      USING "rol"::text::"public"."usuarios_rol_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."usuarios_rol_enum_old"
    `);

    // Crear el enum para estados de usuario
    await queryRunner.query(`
      CREATE TYPE "public"."usuarios_estado_enum" AS ENUM('pendiente', 'aprobado', 'rechazado', 'suspendido')
    `);

    // Agregar columna de estado (por defecto 'pendiente')
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ADD "estado" "public"."usuarios_estado_enum" NOT NULL DEFAULT 'pendiente'
    `);

    // Agregar columna de aprobado_por (FK a usuarios)
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ADD "aprobado_por" VARCHAR(12)
    `);

    // Agregar columna de fecha_aprobacion
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ADD "fecha_aprobacion" TIMESTAMP
    `);

    // Agregar columna de motivo_rechazo
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ADD "motivo_rechazo" TEXT
    `);

    // Crear FK para aprobado_por
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ADD CONSTRAINT "FK_usuarios_aprobado_por" 
      FOREIGN KEY ("aprobado_por") 
      REFERENCES "usuarios"("rut") 
      ON DELETE SET NULL 
      ON UPDATE CASCADE
    `);

    // Actualizar usuarios existentes a estado 'aprobado'
    // (asumimos que los usuarios existentes ya están aprobados)
    await queryRunner.query(`
      UPDATE "usuarios" 
      SET "estado" = 'aprobado' 
      WHERE "estado" = 'pendiente'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar FK
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      DROP CONSTRAINT "FK_usuarios_aprobado_por"
    `);

    // Eliminar columnas
    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      DROP COLUMN "motivo_rechazo"
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      DROP COLUMN "fecha_aprobacion"
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      DROP COLUMN "aprobado_por"
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      DROP COLUMN "estado"
    `);

    // Eliminar enum de estados
    await queryRunner.query(`
      DROP TYPE "public"."usuarios_estado_enum"
    `);

    // Revertir enum de roles
    await queryRunner.query(`
      ALTER TYPE "public"."usuarios_rol_enum" RENAME TO "usuarios_rol_enum_old"
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."usuarios_rol_enum" AS ENUM('admin', 'usuario')
    `);

    await queryRunner.query(`
      ALTER TABLE "usuarios" 
      ALTER COLUMN "rol" TYPE "public"."usuarios_rol_enum" 
      USING "rol"::text::"public"."usuarios_rol_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."usuarios_rol_enum_old"
    `);
  }
}

