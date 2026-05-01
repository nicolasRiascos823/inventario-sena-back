import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddObservacionToReports1740000000002 implements MigrationInterface {
  name = 'AddObservacionToReports1740000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reports" ADD "observacion" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reports" DROP COLUMN "observacion"`);
  }
}
