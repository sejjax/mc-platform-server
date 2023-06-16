import {MigrationInterface, QueryRunner} from "typeorm";

export class userWithdrawHistory1647975058572 implements MigrationInterface {
    name = 'userWithdrawHistory1647975058572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "withdraw_history" ("id" SERIAL NOT NULL, "currency" character varying(10) NOT NULL, "platform_amount" numeric(10,2) NOT NULL, "currency_amount" numeric(10,2) NOT NULL, "wallet_addr" character varying(100) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT '"2022-03-22T18:51:07.967Z"', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_c5fe833f62249dd76df8a5b36e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-03-22T18:51:07.615Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-03-22T18:51:07.785Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ADD CONSTRAINT "FK_04e88f7c56bf94738adbf1acae3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" DROP CONSTRAINT "FK_04e88f7c56bf94738adbf1acae3"`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-03-22 18:33:58.114'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-03-22 18:33:57.914'`);
        await queryRunner.query(`DROP TABLE "withdraw_history"`);
    }

}
