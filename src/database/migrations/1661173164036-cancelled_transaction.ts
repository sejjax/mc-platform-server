import {MigrationInterface, QueryRunner} from 'typeorm';

export class cancelledTransaction1661173164036 implements MigrationInterface {
    name = 'cancelledTransaction1661173164036';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-08-22T12:59:26.872Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-08-22T12:59:26.878Z"\'');
        await queryRunner.query('ALTER TYPE "public"."transaction_status_enum" RENAME TO "transaction_status_enum_old"');
        await queryRunner.query('CREATE TYPE "public"."transaction_status_enum" AS ENUM(\'new\', \'accepted\', \'scam\', \'waiting_approval\', \'cancelled\')');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "public"."transaction_status_enum" USING "status"::"text"::"public"."transaction_status_enum"');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT \'waiting_approval\'');
        await queryRunner.query('DROP TYPE "public"."transaction_status_enum_old"');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-08-22T12:59:27.104Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-08-22T12:59:27.167Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-08-22T12:59:27.227Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-08-22 08:41:27.027\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-08-22 08:41:27.084\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-08-22 08:41:26.965\'');
        await queryRunner.query('CREATE TYPE "public"."transaction_status_enum_old" AS ENUM(\'new\', \'accepted\', \'scam\', \'waiting_approval\')');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" TYPE "public"."transaction_status_enum_old" USING "status"::"text"::"public"."transaction_status_enum_old"');
        await queryRunner.query('ALTER TABLE "transaction" ALTER COLUMN "status" SET DEFAULT \'waiting_approval\'');
        await queryRunner.query('DROP TYPE "public"."transaction_status_enum"');
        await queryRunner.query('ALTER TYPE "public"."transaction_status_enum_old" RENAME TO "transaction_status_enum"');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-08-22\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-08-22 08:41:26.739\'');
    }

}
