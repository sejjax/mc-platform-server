import {MigrationInterface, QueryRunner} from "typeorm";

export class invsetPeriod1652951191296 implements MigrationInterface {
    name = 'invsetPeriod1652951191296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "investment_period"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "investment_period" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-05-19T09:06:35.398Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-19T09:06:35.558Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-05-19T09:06:35.638Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-19T09:06:35.720Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-05-18 14:40:41.419'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-05-18 14:40:41.575'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-05-18 14:40:41.332'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-05-18 14:40:41.67'`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "investment_period"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "investment_period" character varying(4) NOT NULL`);
    }

}
