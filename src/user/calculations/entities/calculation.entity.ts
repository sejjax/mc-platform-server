import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AccrualType, Status } from '../calculations.types';

@Entity()
export class Calculation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  wallet_addr: string;

  @Column({
    type: 'numeric',
    scale: 4,
    precision: 18,
  })
  amount: number;

  @Column({ type: 'varchar', length: 6 })
  percent: string;

  @Column({
    type: 'enum',
    enum: AccrualType,
  })
  accrual_type: AccrualType;

  @Column({
    type: 'date',
    default: new Date(),
  })
  payment_date: Date;

  @Column({ type: 'enum', enum: Status, default: Status.waiting })
  status: Status;

  @ManyToOne(() => Deposit, (deposit) => deposit.calculations)
  product: Deposit;

  @ManyToOne(() => User, (user) => user.calculations)
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  userPartner: User;
}
