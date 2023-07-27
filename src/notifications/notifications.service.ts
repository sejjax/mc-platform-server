import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/notifications.entity';
import { Brackets, Repository } from 'typeorm';
import { NotificationsType } from './entities/notificationsType.entity';
import { CreateNotificationDto } from './dto/create-notifcation.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DeleteNotificationDto } from './dto/delete-notification.dto';

@Injectable()
export class NotificationsService {
    constructor(
    @InjectRepository(Notifications)
    private notificationsRepository: Repository<Notifications>,
    @InjectRepository(NotificationsType)
    private notificationsTypeRepository: Repository<NotificationsType>,
    ) {}

    async getNotifications(userId: number | string) {
        if (typeof userId === 'string') return new BadRequestException();
        const today = new Date();
        today.setHours(today.getHours() + 3);
        return this.notificationsRepository
            .createQueryBuilder('notification')
            .select()
            .where('notification.notification_date < :today', {
                today: today.toISOString(),
            })
            .andWhere(
                new Brackets((qb) => {
                    qb.where('"whom_notify" LIKE(\'%"all"%\')').orWhere(`whom_notify LIKE('%"${userId}"%')`);
                }),
            )
            .andWhere('notification.isSite = true')
            .leftJoinAndSelect('notification.notification_type', 'type')
            .select([
                'notification.id',
                'notification.notification_date',
                'notification.notification_text',
                'notification.notification_title',
            ])
            .addSelect('type.title')
            .getMany();
    }

    async getOneNotification(notificationId: number) {
        return this.notificationsRepository.findOne({
            where: {
                id: notificationId,
            },
            relations: ['notification_type'],
        });
    }

    async getAllNotifications() {
        return this.notificationsRepository.find({
            relations: ['notification_type'],
        });
    }

    getNotificationsType() {
        return this.notificationsTypeRepository.find();
    }

    async addNotification(data: CreateNotificationDto) {
        const stringifiedWhomNotify = JSON.stringify(data.whom_notify);
        const result = await this.notificationsRepository.save({
            ...data,
            whom_notify: stringifiedWhomNotify,
            notification_type: { id: data.notification_type },
        });
        return result;
    }

    async editNotification(data: UpdateNotificationDto) {
        const stringifiedWhomNotify = JSON.stringify(data.whom_notify);
        const result = await this.notificationsRepository
            .createQueryBuilder()
            .update({
                ...data,
                whom_notify: stringifiedWhomNotify,
                notification_type: { id: data.notification_type },
            })
            .where({
                id: data.id,
            })
            .returning('*')
            .execute();
        return result.raw[0];
    }

    async deleteNotification(data: DeleteNotificationDto) {
        await this.notificationsRepository
            .createQueryBuilder()
            .delete()
            .where({ id: data.id })
            .execute();
    }
}
