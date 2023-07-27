import {MigrationInterface, QueryRunner} from 'typeorm';

export class teamDecimal1653748297338 implements MigrationInterface {
    name = 'teamDecimal1653748297338';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "teamDeposit"');
        await queryRunner.query('ALTER TABLE "team" ADD "teamDeposit" numeric NOT NULL');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "firstDeposit"');
        await queryRunner.query('ALTER TABLE "team" ADD "firstDeposit" numeric NOT NULL');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "referralsIncome"');
        await queryRunner.query('ALTER TABLE "team" ADD "referralsIncome" numeric NOT NULL');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "firstReferralsIncome"');
        await queryRunner.query('ALTER TABLE "team" ADD "firstReferralsIncome" numeric NOT NULL');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-05-28T14:31:42.039Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-05-28T14:31:42.121Z"\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-05-28T14:31:42.210Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-05-28T14:31:42.295Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-05-28 08:06:59.475\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-05-28 08:06:59.391\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-05-28 08:06:59.556\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-05-28 08:06:59.299\'');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "firstReferralsIncome"');
        await queryRunner.query('ALTER TABLE "team" ADD "firstReferralsIncome" integer NOT NULL');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "referralsIncome"');
        await queryRunner.query('ALTER TABLE "team" ADD "referralsIncome" integer NOT NULL');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "firstDeposit"');
        await queryRunner.query('ALTER TABLE "team" ADD "firstDeposit" integer NOT NULL');
        await queryRunner.query('ALTER TABLE "team" DROP COLUMN "teamDeposit"');
        await queryRunner.query('ALTER TABLE "team" ADD "teamDeposit" integer NOT NULL');
    }

}
