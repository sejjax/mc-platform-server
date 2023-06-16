import {MigrationInterface, QueryRunner} from "typeorm";

export class userInvestorLevel1659944031647 implements MigrationInterface {
    name = 'userInvestorLevel1659944031647'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_investor_level_enum" AS ENUM('0', '1', '2', '3', '4', '5')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "investor_level" "public"."user_investor_level_enum" NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-08-08T07:33:57.538Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-08-08T07:33:57.552Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-08T07:33:57.824Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-08-08T07:33:57.927Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-08T07:33:58.038Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-08-03 12:52:24.683'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-08-03 12:52:24.572'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-08-03 12:52:24.476'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-08-03'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-08-03 12:52:23.905'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "investor_level"`);
        await queryRunner.query(`DROP TYPE "public"."user_investor_level_enum"`);
    }

}
