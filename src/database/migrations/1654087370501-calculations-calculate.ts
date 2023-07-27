import {MigrationInterface, QueryRunner} from 'typeorm';

export class calculationsCalculate1654087370501 implements MigrationInterface {
    name = 'calculationsCalculate1654087370501';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "product"');
        await queryRunner.query('CREATE TYPE "public"."deposit_status_enum" AS ENUM(\'waiting_approval\', \'waiting_calculation\', \'calculated\')');
        await queryRunner.query('ALTER TABLE "deposit" ADD "status" "public"."deposit_status_enum" NOT NULL DEFAULT \'waiting_calculation\'');
        await queryRunner.query('ALTER TABLE "deposit" ADD "ip_wks" character varying(5) NOT NULL');
        await queryRunner.query('ALTER TABLE "deposit" ADD "pp_wks" character varying(5) NOT NULL');
        await queryRunner.query('ALTER TABLE "calculation" ADD "payment_date" TIMESTAMP NOT NULL DEFAULT \'"2022-06-01T12:42:54.569Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ADD "depositId" integer');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-06-01T12:42:54.563Z"\'');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-06-01T12:42:54.824Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-06-01T12:42:55.005Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-06-01T12:42:55.092Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ADD CONSTRAINT "FK_0cb15f5c764a289398144ed74ab" FOREIGN KEY ("depositId") REFERENCES "deposit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "calculation" DROP CONSTRAINT "FK_0cb15f5c764a289398144ed74ab"');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-05-31 11:14:30.582\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-05-31 11:14:30.425\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-05-31 11:14:30.007\'');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-05-31 11:14:30.212\'');
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "depositId"');
        await queryRunner.query('ALTER TABLE "calculation" DROP COLUMN "payment_date"');
        await queryRunner.query('ALTER TABLE "deposit" DROP COLUMN "pp_wks"');
        await queryRunner.query('ALTER TABLE "deposit" DROP COLUMN "ip_wks"');
        await queryRunner.query('ALTER TABLE "deposit" DROP COLUMN "status"');
        await queryRunner.query('DROP TYPE "public"."deposit_status_enum"');
        await queryRunner.query('ALTER TABLE "calculation" ADD "product" character varying(50)');
    }

}
