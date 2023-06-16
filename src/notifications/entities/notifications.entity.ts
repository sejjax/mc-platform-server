import { Column, PrimaryGeneratedColumn, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { NotificationsType } from './notificationsType.entity';

@Entity('notifications', {
  orderBy: {
    id: 'DESC',
  },
})
export class Notifications {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => NotificationsType, (type) => type.notifications)
  notification_type: NotificationsType;

  @Column('varchar', { length: 100 })
  notification_title: string;

  @Column({
    type: 'varchar',
    length: 400,
    default: 'notification text',
  })
  notification_text: string;

  @Column({
    nullable: true,
  })
  whom_notify: string;

  @Column({
    type: 'bool',
    default: true,
  })
  isSite: boolean;

  @Column({
    type: 'bool',
    default: false,
  })
  isEmail: boolean;

  @CreateDateColumn()
  notification_date: string;
}
