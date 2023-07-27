import {MigrationInterface, QueryRunner} from 'typeorm';

export class userIsTrial1663318954786 implements MigrationInterface {
    name = 'userIsTrial1663318954786';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "isTrial" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-09-16T09:02:43.132Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-09-16T09:02:43.142Z"\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-09-16T09:02:44.202Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-09-16T09:02:44.337Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-09-16T09:02:44.469Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-09-10 18:02:19.19\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-09-10 18:02:19.024\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-09-10 18:02:19.107\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-09-10\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-09-10 18:02:18.565\'');
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "isTrial"');
    }

}
