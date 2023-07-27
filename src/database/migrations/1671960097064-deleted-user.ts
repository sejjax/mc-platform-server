import { MigrationInterface, QueryRunner } from 'typeorm';

export class deletedUser1671960097064 implements MigrationInterface {
    name = 'deletedUser1671960097064';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'CREATE TYPE "public"."deleted_user_status_enum" AS ENUM(\'active\', \'suspended\')',
        );
        await queryRunner.query(
            'CREATE TYPE "public"."deleted_user_level_enum" AS ENUM(\'0\', \'1\', \'2\', \'3\', \'4\', \'5\', \'6\', \'7\', \'8\', \'9\')',
        );
        await queryRunner.query(
            'CREATE TYPE "public"."deleted_user_investor_level_enum" AS ENUM(\'0\', \'1\', \'2\', \'3\', \'4\', \'5\')',
        );
        await queryRunner.query(
            'CREATE TYPE "public"."deleted_user_agreement_enum" AS ENUM(\'0\', \'1\', \'2\')',
        );
        await queryRunner.query(
            'CREATE TABLE "deleted_user" ("id" SERIAL NOT NULL, "email" character varying, "username" character varying, "fullName" character varying, "password" character varying, "partnerId" character varying, "referrerId" character varying, "default_wallet_address" character varying, "status" "public"."deleted_user_status_enum" NOT NULL DEFAULT \'active\', "passivePayments" boolean NOT NULL DEFAULT true, "level" "public"."deleted_user_level_enum" NOT NULL DEFAULT \'0\', "investor_level" "public"."deleted_user_investor_level_enum" NOT NULL DEFAULT \'0\', "country" character varying, "city" character varying, "mobile" character varying, "hash" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "agreement" "public"."deleted_user_agreement_enum" NOT NULL DEFAULT \'2\', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isAdmin" boolean NOT NULL DEFAULT false, "isTrial" boolean NOT NULL DEFAULT false, "userId" integer NOT NULL, "photoId" uuid, "roleId" integer, CONSTRAINT "UQ_b138878a311a323254af9e9cb44" UNIQUE ("email"), CONSTRAINT "UQ_57d6687f023cad3d237ea5a0d6b" UNIQUE ("username"), CONSTRAINT "UQ_83cbabe2edee318d8cb2d77c8e5" UNIQUE ("mobile"), CONSTRAINT "UQ_6b7ee18f899135a616bc58d041c" UNIQUE ("userId"), CONSTRAINT "PK_e85dad6b83f0681a83fd04fe691" PRIMARY KEY ("id"))',
        );
        await queryRunner.query(
            'CREATE INDEX "IDX_e56b6e9e95bbe45dc6fe70a085" ON "deleted_user" ("hash") ',
        );
        await queryRunner.query(
            'ALTER TABLE "deleted_user" ADD CONSTRAINT "FK_4d52b5e61236b7a0f0085cd85b4" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
        await queryRunner.query(
            'ALTER TABLE "deleted_user" ADD CONSTRAINT "FK_aba8c7e9a219d53bf8cd402b9df" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            'ALTER TABLE "deleted_user" DROP CONSTRAINT "FK_aba8c7e9a219d53bf8cd402b9df"',
        );
        await queryRunner.query(
            'ALTER TABLE "deleted_user" DROP CONSTRAINT "FK_4d52b5e61236b7a0f0085cd85b4"',
        );
        await queryRunner.query('DROP INDEX "public"."IDX_e56b6e9e95bbe45dc6fe70a085"');
        await queryRunner.query('DROP TABLE "deleted_user"');
        await queryRunner.query('DROP TYPE "public"."deleted_user_agreement_enum"');
        await queryRunner.query('DROP TYPE "public"."deleted_user_investor_level_enum"');
        await queryRunner.query('DROP TYPE "public"."deleted_user_level_enum"');
        await queryRunner.query('DROP TYPE "public"."deleted_user_status_enum"');
    }
}
