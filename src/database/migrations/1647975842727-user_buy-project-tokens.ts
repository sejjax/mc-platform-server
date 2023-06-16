import {MigrationInterface, QueryRunner} from "typeorm";

export class userBuyProjectTokens1647975842727 implements MigrationInterface {
    name = 'userBuyProjectTokens1647975842727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "buy_project_tokens" ("id" SERIAL NOT NULL, "project_system_name" character varying(100) NOT NULL, "amount" numeric(10,2) NOT NULL, "APY" numeric(10,2) NOT NULL, "Unlock_date" TIMESTAMP NOT NULL DEFAULT '"2022-03-22T19:04:11.676Z"', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_957bd6be68bce5c94f5f00af10a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-03-22T19:04:11.891Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-03-22T19:04:12.043Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-03-22T19:04:12.246Z"'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ADD CONSTRAINT "FK_d70faa970bc87f32d9fba8b1ce4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" DROP CONSTRAINT "FK_d70faa970bc87f32d9fba8b1ce4"`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-03-22 18:51:07.967'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-03-22 18:51:07.785'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-03-22 18:51:07.615'`);
        await queryRunner.query(`DROP TABLE "buy_project_tokens"`);
    }

}
