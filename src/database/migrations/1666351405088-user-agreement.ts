import {MigrationInterface, QueryRunner} from "typeorm";

export class userAgreement1666351405088 implements MigrationInterface {
    name = 'userAgreement1666351405088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_agreement_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "agreement" "public"."user_agreement_enum" NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-10-21T11:23:30.558Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '"2022-10-21T11:23:30.564Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-10-21T11:23:31.080Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-10-21T11:23:31.324Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-10-21T11:23:31.455Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-09-16 09:02:44.469'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-09-16 09:02:44.337'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-09-16 09:02:44.202'`);
        await queryRunner.query(`ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT '2022-09-16'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-09-16 09:02:43.132'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "agreement"`);
        await queryRunner.query(`DROP TYPE "public"."user_agreement_enum"`);
    }

}
