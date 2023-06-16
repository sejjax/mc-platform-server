import {MigrationInterface, QueryRunner} from "typeorm";

export class amountValuesToDecimal1654271788592 implements MigrationInterface {
    name = 'amountValuesToDecimal1654271788592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "earn_amount"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "earn_amount" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "currency_amount" TYPE numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-06-03T15:56:32.565Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "amount" numeric NOT NULL`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-06-03T15:56:32.573Z"'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-06-03T15:56:33.000Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-06-03T15:56:33.089Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-06-03T15:56:33.178Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-06-01 19:36:43.18'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-06-01 19:36:43.264'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-06-01 19:36:43.088'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-06-01'`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "amount" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-06-01 19:36:42.656'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "currency_amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP COLUMN "earn_amount"`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD "earn_amount" character varying(40) NOT NULL`);
    }

}
