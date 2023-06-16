import {MigrationInterface, QueryRunner} from "typeorm";

export class userLevel1659531139152 implements MigrationInterface {
    name = 'userLevel1659531139152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-08-03T12:52:23.905Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-08-03T12:52:23.913Z"'`);
        await queryRunner.query(`ALTER TYPE "public"."user_level_enum" RENAME TO "user_level_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" TYPE "public"."user_level_enum" USING "level"::"text"::"public"."user_level_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "public"."user_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-03T12:52:24.476Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-08-03T12:52:24.572Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-03T12:52:24.683Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-07-26 08:33:15.262'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-07-26 08:33:15.355'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-07-26 08:33:15.435'`);
        await queryRunner.query(`CREATE TYPE "public"."user_level_enum_old" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" TYPE "public"."user_level_enum_old" USING "level"::"text"::"public"."user_level_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "level" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "public"."user_level_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_level_enum_old" RENAME TO "user_level_enum"`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-07-26'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-07-26 08:33:14.827'`);
    }

}
