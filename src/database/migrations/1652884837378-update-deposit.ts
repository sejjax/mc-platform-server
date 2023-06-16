import {MigrationInterface, QueryRunner} from "typeorm";

export class updateDeposit1652884837378 implements MigrationInterface {
    name = 'updateDeposit1652884837378'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "platform_amount"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "product" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "product_service_description" character varying(250) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "apy" character varying(5) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "investment_period" character varying(4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "payment_period" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "earn_amount" character varying(40) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "referals_array" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-18T14:40:41.332Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-18T14:40:41.419Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-05-18T14:40:41.575Z"'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-05-18T14:40:41.670Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-05-17 15:41:28.104'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-05-17 15:41:28.274'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-05-17 15:41:28.358'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-05-17 15:41:28.189'`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "referals_array"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "earn_amount"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "payment_period"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "investment_period"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "apy"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "product_service_description"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "product"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "platform_amount" numeric(10,2) NOT NULL`);
    }

}
