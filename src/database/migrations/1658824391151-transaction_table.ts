import {MigrationInterface, QueryRunner} from "typeorm";

export class transactionTable1658824391151 implements MigrationInterface {
    name = 'transactionTable1658824391151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" ADD "wallet_addr" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-07-26T08:33:14.827Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-07-26T08:33:14.833Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-07-26T08:33:15.262Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-07-26T08:33:15.355Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-07-26T08:33:15.435Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-07-26 07:27:29.528'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-07-26 07:27:29.356'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-07-26 07:27:29.444'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-07-26'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-07-26 07:27:28.882'`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "wallet_addr"`);
    }

}
