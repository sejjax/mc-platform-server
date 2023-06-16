import {MigrationInterface, QueryRunner} from "typeorm";

export class calculations1652962509492 implements MigrationInterface {
    name = 'calculations1652962509492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."calculation_accural_type_enum" AS ENUM('referral', 'product')`);
        await queryRunner.query(`CREATE TYPE "public"."calculation_status_enum" AS ENUM('waiting', 'sent', 'error', 'nulled')`);
        await queryRunner.query(`CREATE TABLE "calculation" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "wallet_addr" character varying(100), "amount" character varying(20) NOT NULL, "percent" character varying(4) NOT NULL, "accural_type" "public"."calculation_accural_type_enum" NOT NULL, "product" character varying(20), "status" "public"."calculation_status_enum" NOT NULL DEFAULT 'waiting', "userId" integer, CONSTRAINT "PK_67320bae23a5bfa027f881c271b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-05-19T12:15:13.712Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-19T12:15:13.796Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-19T12:15:13.968Z"'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-05-19T12:15:14.055Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD CONSTRAINT "FK_6e394803e4300099cd424458134" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calculation" DROP CONSTRAINT "FK_6e394803e4300099cd424458134"`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-05-19 09:06:35.398'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-05-19 09:06:35.558'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-05-19 09:06:35.72'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-05-19 09:06:35.638'`);
        await queryRunner.query(`DROP TABLE "calculation"`);
        await queryRunner.query(`DROP TYPE "public"."calculation_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."calculation_accural_type_enum"`);
    }

}
