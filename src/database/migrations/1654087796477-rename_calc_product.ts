import {MigrationInterface, QueryRunner} from "typeorm";

export class renameCalcProduct1654087796477 implements MigrationInterface {
    name = 'renameCalcProduct1654087796477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calculation" DROP CONSTRAINT "FK_0cb15f5c764a289398144ed74ab"`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "accural_type"`);
        await queryRunner.query(`DROP TYPE "public"."calculation_accural_type_enum"`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "depositId"`);
        await queryRunner.query(`CREATE TYPE "public"."calculation_accrual_type_enum" AS ENUM('referral', 'product')`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "accrual_type" "public"."calculation_accrual_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-06-01T12:50:00.372Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-06-01T12:50:00.379Z"'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-06-01T12:50:00.951Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-06-01T12:50:01.049Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-06-01T12:50:01.134Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD CONSTRAINT "FK_8345d54427863ac92d27a2b200f" FOREIGN KEY ("productId") REFERENCES "deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calculation" DROP CONSTRAINT "FK_8345d54427863ac92d27a2b200f"`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-06-01 12:42:55.005'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-06-01 12:42:55.092'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-06-01 12:42:54.824'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-06-01 12:42:54.569'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-06-01 12:42:54.563'`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "accrual_type"`);
        await queryRunner.query(`DROP TYPE "public"."calculation_accrual_type_enum"`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "depositId" integer`);
        await queryRunner.query(`CREATE TYPE "public"."calculation_accural_type_enum" AS ENUM('referral', 'product')`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "accural_type" "public"."calculation_accural_type_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD CONSTRAINT "FK_0cb15f5c764a289398144ed74ab" FOREIGN KEY ("depositId") REFERENCES "deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
