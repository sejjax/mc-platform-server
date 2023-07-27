import { MigrationInterface, QueryRunner } from 'typeorm';

export class defaultNotifications1657722015777 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO public."notifications" (notification_type,notification_title,notification_text)
        VALUES
        ('Приветствие','Поздравляем! Вы зарегистрировались на платформе MCapital!','Обязательно прочитайте данные на странице Помощь, они содержат важную информацию по безопасности!'),
        ('Уведомление' , 'Следите за нами в Telegram','Присоединяйтесь к официальной группе в телеграм и следите за новостями: <a href="https://t.me/+yyIIsNcljPkxYjcy" target=»_blank>https://t.me/+yyIIsNcljPkxYjcy</a>'),
        ('Уведомление', 'Нужна помощь на платформе?','Связывайтесь со службой поддержки в телеграм <a href="https://t.me/MCapital_support" target=»_blank>https://t.me/MCapital_support</a>') 
        `);
    }

    // eslint-disable-next-line
    public async down(queryRunner: QueryRunner): Promise<void> {}
}
