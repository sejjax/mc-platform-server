import {MigrationInterface, QueryRunner} from 'typeorm';

export class transactionTable1658820445160 implements MigrationInterface {
    name = 'transactionTable1658820445160';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TYPE "public"."transaction_status_enum" AS ENUM(\'new\', \'accepted\', \'scam\')');
        await queryRunner.query('CREATE TABLE "transaction" ("id" SERIAL NOT NULL, "transaction_hash" character varying NOT NULL, "product_service_description" character varying NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT \'new\', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-07-26T07:27:28.882Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-07-26T07:27:28.888Z"\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-07-26T07:27:29.356Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-07-26T07:27:29.444Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-07-26T07:27:29.528Z"\'');
        await queryRunner.query('ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-06-04 07:28:19.018\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-06-04 07:28:19.119\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-06-04 07:28:19.206\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-06-04\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-06-04 07:28:18.666\'');
        await queryRunner.query('DROP TABLE "transaction"');
        await queryRunner.query('DROP TYPE "public"."transaction_status_enum"');
    }

}
