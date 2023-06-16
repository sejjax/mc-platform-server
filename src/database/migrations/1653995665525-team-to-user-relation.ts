import {MigrationInterface, QueryRunner} from "typeorm";

export class teamToUserRelation1653995665525 implements MigrationInterface {
    name = 'teamToUserRelation1653995665525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '"2022-05-31T11:14:30.007Z"'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '"2022-05-31T11:14:30.212Z"'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-31T11:14:30.425Z"'`);
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '"2022-05-31T11:14:30.582Z"'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT '2022-05-28 14:31:42.295'`);
        await queryRunner.query(`ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT '2022-05-28 14:31:42.121'`);
        await queryRunner.query(`ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT '2022-05-28 14:31:42.21'`);
        await queryRunner.query(`ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT '2022-05-28 14:31:42.039'`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstReferralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "referralsIncome" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "firstDeposit" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "team" ALTER COLUMN "teamDeposit" TYPE numeric`);
    }

}
