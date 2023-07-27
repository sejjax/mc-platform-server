import { MigrationInterface, QueryRunner } from 'typeorm';

export class depositTransactionRelation1675275802201 implements MigrationInterface {
    name = 'depositTransactionRelation1675275802201';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "deposit" ADD "transactionId" integer');
        await queryRunner.query(
            'ALTER TABLE "deposit" ADD CONSTRAINT "UQ_78117afd16cab41003c8332a95e" UNIQUE ("transactionId")',
        );
        await queryRunner.query(
            'ALTER TABLE "deposit" ADD CONSTRAINT "FK_78117afd16cab41003c8332a95e" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "deposit" DROP CONSTRAINT "FK_78117afd16cab41003c8332a95e"',
        );
        await queryRunner.query(
            'ALTER TABLE "deposit" DROP CONSTRAINT "UQ_78117afd16cab41003c8332a95e"',
        );
        await queryRunner.query('ALTER TABLE "deposit" DROP COLUMN "transactionId"');
    }
}
