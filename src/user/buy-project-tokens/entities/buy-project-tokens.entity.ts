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
export class BuyProjectTokens extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: User;

  @Column({
    type: 'varchar',
    length: 100,
  })
  project_system_name: string;

  @Column({
    type: 'numeric',
    scale: 2,
    precision: 10,
  })
  amount: number;

  @Column({
    type: 'numeric',
    scale: 2,
    precision: 10,
  })
  APY: number;

  @Column({ type: 'timestamp', default: new Date(), nullable: false })
  Unlock_date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
