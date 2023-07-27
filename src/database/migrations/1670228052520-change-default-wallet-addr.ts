import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeDefaultWalletAddr1670228052520 implements MigrationInterface {
    name = 'changeDefaultWalletAddr1670228052520';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TABLE "change_default_wallet_addr" ("id" SERIAL NOT NULL, "old_wallet" character varying NOT NULL, "new_wallet" character varying NOT NULL, "confirmation_token" character varying NOT NULL, "confirmation_token_expiration" TIMESTAMP NOT NULL, "confirmation_date" TIMESTAMP, "userId" integer, CONSTRAINT "PK_22a1be677797da7573f197a2719" PRIMARY KEY ("id"))',
        );
        await queryRunner.query(
            'ALTER TABLE "change_default_wallet_addr" ADD CONSTRAINT "FK_c9b245e345e3b407a21367bb808" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "change_default_wallet_addr" DROP CONSTRAINT "FK_c9b245e345e3b407a21367bb808"',
        );
        await queryRunner.query('DROP TABLE "change_default_wallet_addr"');
    }
}
