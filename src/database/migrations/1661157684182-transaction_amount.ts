import {MigrationInterface, QueryRunner} from 'typeorm';

export class transactionAmount1661157684182 implements MigrationInterface {
    name = 'transactionAmount1661157684182';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "transaction" ADD "amount" character varying');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-08-22T08:41:26.739Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-08-22T08:41:26.745Z"\'');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "transaction_hash" DROP NOT NULL');
        await queryRunner.query('ALTER TYPE "public"."transaction_status_enum" RENAME TO "transaction_status_enum_old"');
        await queryRunner.query('CREATE TYPE "public"."transaction_status_enum" AS ENUM(\'new\', \'accepted\', \'scam\', \'waiting_approval\')');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "public"."transaction_status_enum" USING "status"::"text"::"public"."transaction_status_enum"');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT \'waiting_approval\'');
        await queryRunner.query('DROP TYPE "public"."transaction_status_enum_old"');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-08-22T08:41:26.965Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-08-22T08:41:27.027Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-08-22T08:41:27.084Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-08-11 09:26:42.62\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-08-11 09:26:42.701\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-08-11 09:26:42.454\'');
        await queryRunner.query('CREATE TYPE "public"."transaction_status_enum_old" AS ENUM(\'new\', \'accepted\', \'scam\')');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "public"."transaction_status_enum_old" USING "status"::"text"::"public"."transaction_status_enum_old"');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT \'new\'');
        await queryRunner.query('DROP TYPE "public"."transaction_status_enum"');
        await queryRunner.query('ALTER TYPE "public"."transaction_status_enum_old" RENAME TO "transaction_status_enum"');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "transaction_hash" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-08-11\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-08-11 09:26:42.097\'');
        await queryRunner.query('ALTER TABLE "transaction" DROP COLUMN "amount"');
    }

}
