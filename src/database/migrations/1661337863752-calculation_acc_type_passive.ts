import {MigrationInterface, QueryRunner} from 'typeorm';

export class calculationAccTypePassive1661337863752 implements MigrationInterface {
    name = 'calculationAccTypePassive1661337863752';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-08-24T10:44:26.332Z"\'');
        await queryRunner.query('ALTER TYPE "public"."calculation_accrual_type_enum" RENAME TO "calculation_accrual_type_enum_old"');
        await queryRunner.query('CREATE TYPE "public"."calculation_accrual_type_enum" AS ENUM(\'referral\', \'product\', \'passive\')');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "accrual_type" TYPE "public"."calculation_accrual_type_enum" USING "accrual_type"::"text"::"public"."calculation_accrual_type_enum"');
        await queryRunner.query('DROP TYPE "public"."calculation_accrual_type_enum_old"');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-08-24T10:44:26.336Z"\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-08-24T10:44:26.631Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-08-24T10:44:26.685Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-08-24T10:44:26.742Z"\'');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-08-22 12:59:27.227\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-08-22 12:59:27.167\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-08-22 12:59:27.104\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-08-22\'');
        await queryRunner.query('CREATE TYPE "public"."calculation_accrual_type_enum_old" AS ENUM(\'referral\', \'product\')');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "accrual_type" TYPE "public"."calculation_accrual_type_enum_old" USING "accrual_type"::"text"::"public"."calculation_accrual_type_enum_old"');
        await queryRunner.query('DROP TYPE "public"."calculation_accrual_type_enum"');
        await queryRunner.query('ALTER TYPE "public"."calculation_accrual_type_enum_old" RENAME TO "calculation_accrual_type_enum"');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-08-22 12:59:26.872\'');
    }

}
