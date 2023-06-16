import { MigrationInterface, QueryRunner } from 'typeorm';

export class promotionLevel1683180727034 implements MigrationInterface {
  name = 'promotionLevel1683180727034';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."promotion_level_level_enum" AS ENUM('0', '1', '2', '3', '4', '5', '6', '7', '8', '9')`,
    );
    await queryRunner.query(
      `CREATE TABLE "promotion_level" ("id" SERIAL NOT NULL, "level" "public"."promotion_level_level_enum" NOT NULL DEFAULT '0', "userId" integer, CONSTRAINT "REL_d8b4dc59451fb50d7153539ca1" UNIQUE ("userId"), CONSTRAINT "PK_177e7da98dd6a5d7e6bcf71120e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "promotion_level" ADD CONSTRAINT "FK_d8b4dc59451fb50d7153539ca13" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "promotion" ADD "firstStructure" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "promotion" DROP COLUMN "firstStructure"`);
    await queryRunner.query(
      `ALTER TABLE "promotion_level" DROP CONSTRAINT "FK_d8b4dc59451fb50d7153539ca13"`,
    );
    await queryRunner.query(`DROP TABLE "promotion_level"`);
    await queryRunner.query(`DROP TYPE "public"."promotion_level_level_enum"`);
  }
}
