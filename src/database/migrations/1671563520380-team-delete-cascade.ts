import { MigrationInterface, QueryRunner } from 'typeorm';

export class teamDeleteCascade1671563520380 implements MigrationInterface {
  name = 'teamDeleteCascade1671563520380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e"`);
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e"`);
    await queryRunner.query(
      `ALTER TABLE "team" ADD CONSTRAINT "FK_55a938fda82579fd3ec29b3c28e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
