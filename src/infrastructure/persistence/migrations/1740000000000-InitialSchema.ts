import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1740000000000 implements MigrationInterface {
  name = 'InitialSchema1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "code" character varying(32) NOT NULL,
        "name" character varying(128) NOT NULL,
        CONSTRAINT "UQ_roles_code" UNIQUE ("code"),
        CONSTRAINT "PK_roles" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying(255) NOT NULL,
        "username" character varying(64) NOT NULL,
        "passwordHash" character varying(255) NOT NULL,
        "firstName" character varying(120) NOT NULL,
        "lastName" character varying(120) NOT NULL,
        "roleId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_role" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "classrooms" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "code" character varying(32) NOT NULL,
        "name" character varying(255) NOT NULL,
        "location" character varying(255),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_classrooms_code" UNIQUE ("code"),
        CONSTRAINT "PK_classrooms" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "classroom_inventories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "classroomId" uuid NOT NULL,
        "laptops" integer NOT NULL DEFAULT 0,
        "mouses" integer NOT NULL DEFAULT 0,
        "chargers" integer NOT NULL DEFAULT 0,
        "tables" integer NOT NULL DEFAULT 0,
        "chairs" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_classroom_inventories_room" UNIQUE ("classroomId"),
        CONSTRAINT "PK_classroom_inventories" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_classroom" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "reports" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "type" character varying(16) NOT NULL,
        "instructorId" uuid NOT NULL,
        "classroomId" uuid NOT NULL,
        "laptops" integer NOT NULL,
        "mouses" integer NOT NULL,
        "chargers" integer NOT NULL,
        "tables" integer NOT NULL,
        "chairs" integer NOT NULL,
        "reportedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reports" PRIMARY KEY ("id"),
        CONSTRAINT "FK_reports_instructor" FOREIGN KEY ("instructorId") REFERENCES "users"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_reports_classroom" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "classroom_inventories"`);
    await queryRunner.query(`DROP TABLE "classrooms"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
