import {MigrationInterface, QueryRunner} from 'typeorm';

export class calcTimeTodate1654112198626 implements MigrationInterface {
    name = 'calcTimeTodate1654112198626';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-06-01T19:36:42.656Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "payment_date"');
        await queryRunner.query('ALTER TABLE "calculation" ADD "payment_date" date NOT NULL DEFAULT \'"2022-06-01T19:36:42.662Z"\'');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-06-01T19:36:43.088Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-06-01T19:36:43.180Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-06-01T19:36:43.264Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-06-01 12:50:01.049\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-06-01 12:50:01.134\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-06-01 12:50:00.951\'');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "payment_date"');
        await queryRunner.query('ALTER TABLE "calculation" ADD "payment_date" TIMESTAMP NOT NULL DEFAULT \'2022-06-01 12:50:00.379\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-06-01 12:50:00.372\'');
    }

}
