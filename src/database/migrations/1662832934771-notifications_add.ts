import {MigrationInterface, QueryRunner} from 'typeorm';

export class notificationsAdd1662832934771 implements MigrationInterface {
    name = 'notificationsAdd1662832934771';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "notifications_type" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_269e3d83646acf959e0f5138044" PRIMARY KEY ("id"))');
        await queryRunner.query('ALTER TABLE "notifications" DROP COLUMN "notification_type"');
        await queryRunner.query('ALTER TABLE "notifications" ADD "whom_notify" character varying');
        await queryRunner.query('ALTER TABLE "notifications" ADD "isSite" boolean NOT NULL DEFAULT true');
        await queryRunner.query('ALTER TABLE "notifications" ADD "isEmail" boolean NOT NULL DEFAULT false');
        await queryRunner.query('ALTER TABLE "notifications" ADD "notificationTypeId" integer');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'"2022-09-10T18:02:18.565Z"\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'"2022-09-10T18:02:18.570Z"\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'"2022-09-10T18:02:19.024Z"\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'"2022-09-10T18:02:19.107Z"\'');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'"2022-09-10T18:02:19.190Z"\'');
        await queryRunner.query('ALTER TABLE "notifications" ADD CONSTRAINT "FK_10743966c989299431e483fa780" FOREIGN KEY ("notificationTypeId") REFERENCES "notifications_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "notifications" DROP CONSTRAINT "FK_10743966c989299431e483fa780"');
        await queryRunner.query('ALTER TABLE "wallet_history" ALTER COLUMN "date" SET DEFAULT \'2022-09-07 12:11:14.372\'');
        await queryRunner.query('ALTER TABLE "buy_project_tokens" ALTER COLUMN "Unlock_date" SET DEFAULT \'2022-09-07 12:11:14.214\'');
        await queryRunner.query('ALTER TABLE "withdraw_history" ALTER COLUMN "date" SET DEFAULT \'2022-09-07 12:11:14.3\'');
        await queryRunner.query('ALTER TABLE "calculation" ALTER COLUMN "payment_date" SET DEFAULT \'2022-09-07\'');
        await queryRunner.query('ALTER TABLE "deposit" ALTER COLUMN "date" SET DEFAULT \'2022-09-07 12:11:13.853\'');
        await queryRunner.query('ALTER TABLE "notifications" DROP COLUMN "notificationTypeId"');
        await queryRunner.query('ALTER TABLE "notifications" DROP COLUMN "isEmail"');
        await queryRunner.query('ALTER TABLE "notifications" DROP COLUMN "isSite"');
        await queryRunner.query('ALTER TABLE "notifications" DROP COLUMN "whom_notify"');
        await queryRunner.query('ALTER TABLE "notifications" ADD "notification_type" character varying(100)');
        await queryRunner.query('DROP TABLE "notifications_type"');
    }

}
