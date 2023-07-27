import {MigrationInterface, QueryRunner} from 'typeorm';

export class userBalance1647967950748 implements MigrationInterface {
    name = 'userBalance1647967950748';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "balance" ("id" SERIAL NOT NULL, "current_platform_balance" numeric(2) NOT NULL, "available_to_withdraw_balance" numeric(2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "REL_9297a70b26dc787156fa49de26" UNIQUE ("userId"), CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "isAdmin" SET NOT NULL');
        await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "isAdmin" SET DEFAULT false');
        await queryRunner.query('ALTER TABLE "balance" ADD CONSTRAINT "FK_9297a70b26dc787156fa49de26b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "balance" DROP CONSTRAINT "FK_9297a70b26dc787156fa49de26b"');
        await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "isAdmin" DROP DEFAULT');
        await queryRunner.query('ALTER TABLE "user" ALTER COLUMN "isAdmin" DROP NOT NULL');
        await queryRunner.query('DROP TABLE "balance"');
    }

}
