import {MigrationInterface, QueryRunner} from 'typeorm';

export class userPassivePayments1669624996043 implements MigrationInterface {
    name = 'userPassivePayments1669624996043';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" ADD "passivePayments" boolean NOT NULL DEFAULT true');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "user" DROP COLUMN "passivePayments"');
    }

}
