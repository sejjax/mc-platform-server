import { MigrationInterface, QueryRunner } from 'typeorm';

export class deleteUniqueMobileUser1672169147433 implements MigrationInterface {
  name = 'deleteUniqueMobileUser1672169147433';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_29fd51e9cf9241d022c5a4e02e6"`);
    await queryRunner.query(
      `ALTER TABLE "deleted_user" DROP CONSTRAINT "UQ_83cbabe2edee318d8cb2d77c8e5"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deleted_user" ADD CONSTRAINT "UQ_83cbabe2edee318d8cb2d77c8e5" UNIQUE ("mobile")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_29fd51e9cf9241d022c5a4e02e6" UNIQUE ("mobile")`,
    );
  }
}
