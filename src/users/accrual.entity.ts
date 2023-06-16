import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { User } from './user.entity';

@Entity()
export class Accrual {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Package, (order) => order.accruals)
  order: Package;

  @ManyToOne(() => User, (user) => user.generatedAccruals)
  sourceUser: User;

  @ManyToOne(() => User, (user) => user.accruals)
  targetUser: User;

  @Column({ type: 'int4' })
  line: number;

  @Column({ type: 'decimal' })
  value: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
