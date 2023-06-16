import { MigrationInterface, QueryRunner } from 'typeorm';

export class calcPercentToVarchar61660209998500 implements MigrationInterface {
  name = 'calcPercentToVarchar61660209998500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-08-11T09:26:42.097Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "calculation" ALTER COLUMN "percent" TYPE character varying(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-08-11T09:26:42.103Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-08-11T09:26:42.454Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-11T09:26:42.620Z"'`,
    );
    await queryRunner.query(
      `ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-11T09:26:42.701Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-08-08 07:33:58.038'`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-08-08 07:33:57.824'`,
    );
    await queryRunner.query(
      `ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-08-08 07:33:57.927'`,
    );
    await queryRunner.query(
      `ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-08-08'`,
    );
    await queryRunner.query(
      `ALTER TABLE "calculation" ALTER COLUMN "percent" TYPE character varying(4)`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-08-08 07:33:57.538'`,
    );
  }
}
