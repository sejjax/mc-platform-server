import {MigrationInterface, QueryRunner} from "typeorm";

export class userDeposit1647974029250 implements MigrationInterface {
    name = 'userDeposit1647974029250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deposit" ("id" SERIAL NOT NULL, "currency" character varying(10) NOT NULL, "platform_amount" numeric(10,2) NOT NULL, "currency_amount" numeric(10,2) NOT NULL, "wallet_addr" character varying(100) NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT '"2022-03-22T18:33:57.914Z"', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b3f1383d11c01f2b6e63c37575b"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
    }

}
