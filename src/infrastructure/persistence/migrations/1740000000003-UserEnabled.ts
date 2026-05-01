import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEnabled1740000000003 implements MigrationInterface {
  name = 'UserEnabled1740000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ADD "enabled" boolean NOT NULL DEFAULT true
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "enabled"`);
  }
}
