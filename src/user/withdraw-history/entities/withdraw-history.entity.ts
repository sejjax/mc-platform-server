import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class WithdrawHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
      id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
      user: User;

  @Column({
      type: 'varchar',
      length: 10,
  })
      currency: string;

  @Column({
      type: 'numeric',
      scale: 2,
      precision: 10,
  })
      platform_amount: number;

  @Column({
      type: 'numeric',
      scale: 2,
      precision: 10,
  })
      currency_amount: number;

  @Column({
      type: 'varchar',
      length: 100,
  })
      wallet_addr: string;

  @Column({ type: 'timestamp', default: new Date(), nullable: false })
      date: Date;

  @CreateDateColumn()
      createdAt: Date;

  @UpdateDateColumn()
      updatedAt: Date;
}
