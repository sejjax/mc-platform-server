import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1647911348140 implements MigrationInterface {
  name = 'init1647911348140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accrual" ("id" SERIAL NOT NULL, "line" integer NOT NULL, "value" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "orderId" integer, "sourceUserId" integer, "targetUserId" integer, CONSTRAINT "PK_f8ac224254326076ef43e3a15d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."package_level_enum" AS ENUM('0', '1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `CREATE TABLE "package" ("id" SERIAL NOT NULL, "level" "public"."package_level_enum" NOT NULL, "cost" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_308364c66df656295bc4ec467c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_referrerlevel_enum" AS ENUM('0', '1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_level_enum" AS ENUM('0', '1', '2', '3', '4', '5')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying, "username" character varying, "fullName" character varying, "password" character varying, "partnerId" character varying, "referrerId" character varying, "referrerLevel" "public"."user_referrerlevel_enum", "level" "public"."user_level_enum" NOT NULL DEFAULT '0', "deposit" numeric NOT NULL DEFAULT '0', "country" character varying, "city" character varying, "mobile" character varying, "hash" character varying, "depositDate" TIMESTAMP, "firstDepositAmount" numeric, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "photoId" uuid, "isAdmin" Boolean, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_29fd51e9cf9241d022c5a4e02e6" UNIQUE ("mobile"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e282acb94d2e3aec10f480e4f6" ON "user" ("hash") `,
    );
    await queryRunner.query(
      `CREATE TABLE "forgot" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_087959f5bb89da4ce3d763eab75" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df507d27b0fb20cd5f7bef9b9a" ON "forgot" ("hash") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."project_type_enum" AS ENUM('staking', 'investment', 'investmentPro')`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying, "description" character varying NOT NULL, "apy" double precision NOT NULL, "available" boolean NOT NULL, "risk" integer NOT NULL DEFAULT '0', "type" "public"."project_type_enum" NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "notification_type" character varying(100) NOT NULL, "notification_title" character varying(100) NOT NULL, "notification_text" character varying(400) NOT NULL DEFAULT 'notification text', "notification_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accrual" ADD CONSTRAINT "FK_6828d796ae1e2f97b0a48da783e" FOREIGN KEY ("orderId") REFERENCES "package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accrual" ADD CONSTRAINT "FK_e7801544be2014114f474ef5a7a" FOREIGN KEY ("sourceUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accrual" ADD CONSTRAINT "FK_de0a1d6966de206af64a48f425e" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "package" ADD CONSTRAINT "FK_6dc356455ff7dc7ac56ec2058bc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot" ADD CONSTRAINT "FK_31f3c80de0525250f31e23a9b83" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
INSERT INTO public."user" (id, email, username, "fullName", password, "partnerId", "referrerId", "referrerLevel", level, deposit, country, city, mobile, hash, "depositDate", "firstDepositAmount", "createdAt", "updatedAt", "deletedAt", "isAdmin")
VALUES
('1','first@mail.com','first','First User','$2a$10$ZJf1RPybwoSGg.f1vPIoJuhGklhLxV7vfAUrqQTC0CpqfIQuJAAly','3MDAJR','','1','4','100000','US','','0961811354',NULL,NULL,'0','2022-02-02 09:12:16','2022-02-02 09:12:16',NULL, true),
('2','second@mail.com','second','Second User','$2a$10$cAFh4ZclErWQL2axY5xC8eyRPLtiodBGKqXSC7kBaMS31nQvLoibu','7K2GR4','3MDAJR','0','2','99500','US','','0961811311',NULL,NULL,'0','2022-02-02 09:35:30','2022-02-02 09:48:29',NULL, false),
('3','third@mail.com','third','Third User','$2a$10$tpW9QlB//jJpgkki3.B6Nuj3wRzVUwAJ5lWHhpU0YUDKxYsSgLnKa','7Q39VM','3MDAJR','0','2','99500','US','','0961811312',NULL,NULL,'0','2022-02-02 09:36:30','2022-02-02 09:50:16',NULL, false),
('4','fourth@mail.com','fourth','Fourth User','$2a$10$YcBkf.GxKYaEK8dsLWKusOUAlxnbc6zd9gM4k5SIi3TEZy4yhBbVq','FZ92Q2','7Q39VM','0','3','99000','AU','','0961811314',NULL,NULL,'0','2022-02-02 09:38:15','2022-02-02 09:51:15',NULL, false),
('5','fifth@mail.com','fifth','Fifth User','$2a$10$VgOrdohRIFF7vdin/SaeS.xqObMRWvA/YSeOs3cxvPBl/MABEXpwi','V0QG59','FZ92Q2','0','4','95000','US','','0961811315',NULL,NULL,'0','2022-02-02 09:40:06','2022-02-02 09:52:11',NULL, false),
('6','sixth@mail.com','sixth','Sixth User','$2a$10$iWVoE291rEtC6TwRBuDuoevc9BwNuosUzFrNy.84DTp0lSIushoia','B3C9D4','FZ92Q2','0','2','99500','AT','','0961811316',NULL,NULL,'0','2022-02-02 09:40:52','2022-02-02 09:52:58',NULL, false),
('7','seventh@mail.com','seventh','Seventh User','$2a$10$I56umAziudQ4723zPGN6de8r0WSBMVg7AQi3RBWP0QX42DcgSngfG','ZN2FLH','B3C9D4','0','1','99300','CA','','0971811317',NULL,NULL,'0','2022-02-02 09:41:47','2022-02-02 09:53:37',NULL, false)
`);

    await queryRunner.query(`
INSERT INTO public.package (id, level, cost, "createdAt", "updatedAt", "userId") 
VALUES
('1','2','500','2022-02-02 09:48:29.944268','2022-02-02 09:48:29.944268','2'),
('2','2','500','2022-02-02 09:50:16.107131','2022-02-02 09:50:16.107131','3'),
('3','3','1000','2022-02-02 09:51:15.250371','2022-02-02 09:51:15.250371','4'),
('4','4','5000','2022-02-02 09:52:11.084859','2022-02-02 09:52:11.084859','5'),
('5','2','500','2022-02-02 09:52:58.353584','2022-02-02 09:52:58.353584','6'),
('6','2','500','2022-02-02 09:53:22.73661','2022-02-02 09:53:22.73661','7'),
('7','1','200','2022-02-02 09:53:37.754653','2022-02-02 09:53:37.754653','7')
`);

    await queryRunner.query(`
INSERT INTO public.accrual (id, line, value, "createdAt", "updatedAt", "orderId", "sourceUserId", "targetUserId")
VALUES
('1','0','0','2022-02-02 09:48:29.944268','2022-02-02 09:48:29.944268','1','2','1'),
('2','0','20','2022-02-02 09:50:16.107131','2022-02-02 09:50:16.107131','2','3','1'),
('3','0','30','2022-02-02 09:51:15.250371','2022-02-02 09:51:15.250371','3','4','3'),
('15','0','70','2022-02-02 09:53:37.754653','2022-02-02 09:53:37.754653','7','7','6'),
('16','1','40','2022-02-02 09:53:37.754653','2022-02-02 09:53:37.754653','7','6','4'),
('17','2','160','2022-02-02 09:53:37.754653','2022-02-02 09:53:37.754653','7','4','3'),
('11','0','40','2022-02-02 09:53:22.73661','2022-02-02 09:53:22.73661','6','7','6'),
('9','1','10','2022-02-02 09:52:58.353584','2022-02-02 09:52:58.353584','5','4','3'),
('4','1','60','2022-02-02 09:51:15.250371','2022-02-02 09:51:15.250371','3','3','1'),
('8','0','250','2022-02-02 09:52:58.353584','2022-02-02 09:52:58.353584','5','6','4'),
('14','3','90','2022-02-02 09:53:22.73661','2022-02-02 09:53:22.73661','6','3','1'),
('6','1','150','2022-02-02 09:52:11.084859','2022-02-02 09:52:11.084859','4','4','3'),
('13','2','60','2022-02-02 09:53:22.73661','2022-02-02 09:53:22.73661','6','4','3'),
('10','2','20','2022-02-02 09:52:58.353584','2022-02-02 09:52:58.353584','5','3','1'),
('18','3','20','2022-02-02 09:53:37.754653','2022-02-02 09:53:37.754653','7','3','1'),
('5','0','50','2022-02-02 09:52:11.084859','2022-02-02 09:52:11.084859','4','5','4'),
('12','1','80','2022-02-02 09:53:22.73661','2022-02-02 09:53:22.73661','6','6','4'),
('7','2','220','2022-02-02 09:52:11.084859','2022-02-02 09:52:11.084859','4','3','1')
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "forgot" DROP CONSTRAINT "FK_31f3c80de0525250f31e23a9b83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "package" DROP CONSTRAINT "FK_6dc356455ff7dc7ac56ec2058bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accrual" DROP CONSTRAINT "FK_de0a1d6966de206af64a48f425e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accrual" DROP CONSTRAINT "FK_e7801544be2014114f474ef5a7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accrual" DROP CONSTRAINT "FK_6828d796ae1e2f97b0a48da783e"`,
    );
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TYPE "public"."project_type_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_df507d27b0fb20cd5f7bef9b9a"`,
    );
    await queryRunner.query(`DROP TABLE "forgot"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e282acb94d2e3aec10f480e4f6"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_level_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_referrerlevel_enum"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "package"`);
    await queryRunner.query(`DROP TYPE "public"."package_level_enum"`);
    await queryRunner.query(`DROP TABLE "accrual"`);
  }
}
