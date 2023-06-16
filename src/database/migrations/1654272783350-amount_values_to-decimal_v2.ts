import {MigrationInterface, QueryRunner} from "typeorm";

export class amountValuesToDecimalV21654272783350 implements MigrationInterface {
    name = 'amountValuesToDecimalV21654272783350'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "earn_amount" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-06-03T16:13:07.710Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "amount" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-06-03T16:13:07.719Z"'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-06-03T16:13:08.072Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-06-03T16:13:08.160Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-06-03T16:13:08.253Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-06-03 15:56:33.089'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-06-03 15:56:33.178'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-06-03 15:56:33'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-06-03'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-06-03 15:56:32.565'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "earn_amount" TYPE numeric`);
    }

}
