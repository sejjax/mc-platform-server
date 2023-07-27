import {MigrationInterface, QueryRunner} from 'typeorm';

export class numbericPrecisionTo181654327694717 implements MigrationInterface {
    name = 'numbericPrecisionTo181654327694717';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "earn_amount" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "currency_amount" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-06-04T07:28:18.666Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "amount" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-06-04T07:28:18.672Z"\'');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric(18,4)');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-06-04T07:28:19.018Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-06-04T07:28:19.119Z"\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-06-04T07:28:19.206Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-06-03 16:13:08.072\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-06-03 16:13:08.253\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-06-03 16:13:08.16\'');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric(10,4)');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric(10,4)');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric(10,4)');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric(10,4)');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-06-03\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "amount" TYPE numeric(10,4)');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-06-03 16:13:07.71\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "currency_amount" TYPE numeric(10,4)');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "earn_amount" TYPE numeric(10,4)');
    }

}
