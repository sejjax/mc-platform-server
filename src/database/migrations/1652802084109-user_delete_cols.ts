import {MigrationInterface, QueryRunner} from "typeorm";

export class userDeleteCols1652802084109 implements MigrationInterface {
    name = 'userDeleteCols1652802084109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "referrerLevel"`);
        await queryRunner.query(`DROP TYPE "public"."user_referrerlevel_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deposit"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "depositDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstDepositAmount"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "default_wallet_address" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'suspended')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" "public"."user_status_enum" NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TYPE "public"."user_level_enum" RENAME TO "user_level_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" TYPE "public"."user_level_enum" USING "level"::"text"::"public"."user_level_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "public"."user_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-05-17T15:41:28.104Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-17T15:41:28.189Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-05-17T15:41:28.274Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-17T15:41:28.358Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-03-22 19:04:12.246'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-03-22 19:04:11.676'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-03-22 19:04:12.043'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-03-22 19:04:11.891'`);
        await queryRunner.query(`CREATE TYPE "public"."user_level_enum_old" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" TYPE "public"."user_level_enum_old" USING "level"::"text"::"public"."user_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "public"."user_level_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_level_enum_old" RENAME TO "user_level_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "default_wallet_address"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstDepositAmount" numeric`);
        await queryRunner.query(`ALTER TABLE "user" ADD "depositDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deposit" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE TYPE "public"."user_referrerlevel_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "referrerLevel" "public"."user_referrerlevel_enum"`);
    }

}
