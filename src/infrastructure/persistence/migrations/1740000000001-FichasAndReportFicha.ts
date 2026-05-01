import { MigrationInterface, QueryRunner } from 'typeorm';

const PLACEHOLDER_FICHA_ID = '00000000-0000-4000-8000-0000000000f1';

export class FichasAndReportFicha1740000000001 implements MigrationInterface {
  name = 'FichasAndReportFicha1740000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "fichas" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "numero" character varying(64) NOT NULL,
        "programaFormacion" character varying(255) NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fichas" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `INSERT INTO "fichas" ("id", "numero", "programaFormacion") VALUES ($1, $2, $3)`,
      [
        PLACEHOLDER_FICHA_ID,
        '0000',
        'Migración — reemplace por fichas reales y edite reportes si aplica',
      ],
    );

    await queryRunner.query(
      `ALTER TABLE "reports" ADD "fichaId" uuid`,
    );
    await queryRunner.query(
      `UPDATE "reports" SET "fichaId" = $1 WHERE "fichaId" IS NULL`,
      [PLACEHOLDER_FICHA_ID],
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ALTER COLUMN "fichaId" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "reports"
      ADD CONSTRAINT "FK_reports_ficha"
      FOREIGN KEY ("fichaId") REFERENCES "fichas"("id") ON DELETE RESTRICT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_reports_ficha"`,
    );
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "fichaId"`);
    await queryRunner.query(`DROP TABLE "fichas"`);
  }
}
