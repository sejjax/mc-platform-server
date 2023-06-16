import { MigrationInterface, QueryRunner } from 'typeorm';

export class promotion1674546052196 implements MigrationInterface {
  name = 'promotion1674546052196';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "promotion" ("id" SERIAL NOT NULL, "teamDeposit" integer NOT NULL, "isComplete" boolean NOT NULL DEFAULT true, "userId" integer, CONSTRAINT "REL_2e7a151d1ec84a16d7a00cda72" UNIQUE ("userId"), CONSTRAINT "PK_fab3630e0789a2002f1cadb7d38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion" ADD CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "promotion" DROP CONSTRAINT "FK_2e7a151d1ec84a16d7a00cda728"`,
    );
    await queryRunner.query(`DROP TABLE "promotion"`);
  }
}
