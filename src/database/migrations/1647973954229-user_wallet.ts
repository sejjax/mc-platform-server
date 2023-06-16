import {MigrationInterface, QueryRunner} from "typeorm";

export class userWallet1647973954229 implements MigrationInterface {
    name = 'userWallet1647973954229'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wallet_history" ("id" SERIAL NOT NULL, "wallet_addr" character varying(100) NOT NULL, "type_operation" character varying(20) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT '"2022-03-22T18:32:43.137Z"', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_d753e93ce16ad3202f03980aef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "current_platform_balance" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "available_to_withdraw_balance" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ADD CONSTRAINT "FK_b1dad46c828740b561c549fb1fc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-03-22T18:33:58.114Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet_history" DROP CONSTRAINT "FK_b1dad46c828740b561c549fb1fc"`);
        await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "available_to_withdraw_balance" TYPE numeric(2,0)`);
        await queryRunner.query(`ALTER TABLE "balance" ALTER COLUMN "current_platform_balance" TYPE numeric(2,0)`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-03-22 18:32:43.137'`);
        await queryRunner.query(`DROP TABLE "wallet_history"`);
    }

}
