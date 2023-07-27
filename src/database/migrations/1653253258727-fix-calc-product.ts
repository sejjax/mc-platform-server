import {MigrationInterface, QueryRunner} from 'typeorm';

export class fixCalcProduct1653253258727 implements MigrationInterface {
    name = 'fixCalcProduct1653253258727';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "product"');
        await queryRunner.query('ALTER TABLE "calculation" ADD "product" character varying(50)');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-05-22T21:01:03.344Z"\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-05-22T21:01:03.431Z"\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-05-22T21:01:03.537Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-05-22T21:01:03.630Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-05-19 12:15:13.796\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-05-19 12:15:14.055\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-05-19 12:15:13.712\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-05-19 12:15:13.968\'');
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "product"');
        await queryRunner.query('ALTER TABLE "calculation" ADD "product" character varying(20)');
    }

}
