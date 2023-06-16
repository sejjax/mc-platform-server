import {MigrationInterface, QueryRunner} from "typeorm";

export class teamTable1653725214956 implements MigrationInterface {
    name = 'teamTable1653725214956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "team" ("id" SERIAL NOT NULL, "totalReferrals" integer NOT NULL, "firstReferrals" integer NOT NULL, "teamDeposit" integer NOT NULL, "firstDeposit" integer NOT NULL, "referralsIncome" integer NOT NULL, "firstReferralsIncome" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "REL_55a938fda82579fd3ec29b3c28" UNIQUE ("userId"), CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD "userPartnerId" integer`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-05-28T08:06:59.299Z"'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-05-28T08:06:59.391Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-28T08:06:59.475Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-28T08:06:59.556Z"'`);
        await queryRunner.query(`ALTER TABLE "calculation" ADD CONSTRAINT "FK_b55cd545e2ca7a79e78472b9560" FOREIGN KEY ("userPartnerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e"`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP CONSTRAINT "FK_b55cd545e2ca7a79e78472b9560"`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-05-22 21:01:03.344'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-05-22 21:01:03.63'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-05-22 21:01:03.537'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-05-22 21:01:03.431'`);
        await queryRunner.query(`ALTER TABLE "calculation" DROP COLUMN "userPartnerId"`);
        await queryRunner.query(`DROP TABLE "team"`);
    }

}
