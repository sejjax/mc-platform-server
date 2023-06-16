import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Notifications } from './notifications.entity';

@Entity()
export class NotificationsType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(() => Notifications, (notification) => notification.notification_type)
  notifications: Notifications[];
}
