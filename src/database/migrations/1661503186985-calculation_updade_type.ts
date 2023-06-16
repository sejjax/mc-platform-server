import {MigrationInterface, QueryRunner} from "typeorm";

export class calculationUpdadeType1661503186985 implements MigrationInterface {
    name = 'calculationUpdadeType1661503186985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-08-26T08:39:49.562Z"'`);
        await queryRunner.query(`ALTER TYPE "public"."calculation_accrual_type_enum" RENAME TO "calculation_accrual_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."calculation_accrual_type_enum" AS ENUM('referral', 'product', 'passive', 'upgrade')`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "accrual_type" TYPE "public"."calculation_accrual_type_enum" USING "accrual_type"::"text"::"public"."calculation_accrual_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."calculation_accrual_type_enum_old"`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-08-26T08:39:49.567Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-08-26T08:39:49.784Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-26T08:39:49.845Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-08-26T08:39:49.905Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-08-25 13:30:57.309'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-08-25 13:30:57.425'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-08-25 13:30:57.247'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-08-25'`);
        await queryRunner.query(`CREATE TYPE "public"."calculation_accrual_type_enum_old" AS ENUM('referral', 'product', 'passive')`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "accrual_type" TYPE "public"."calculation_accrual_type_enum_old" USING "accrual_type"::"text"::"public"."calculation_accrual_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."calculation_accrual_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."calculation_accrual_type_enum_old" RENAME TO "calculation_accrual_type_enum"`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-08-25 13:30:56.976'`);
    }

}
