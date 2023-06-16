import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Accrual } from './accrual.entity';
import { User } from './user.entity';
import { InvestorLevel, Levels } from './consts';

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.packages)
  user: User;

  @Column({
    type: 'enum',
    enum: Levels,
  })
  level: Levels;

  @Column({ type: 'decimal' })
  cost: string;

  @OneToMany(() => Accrual, (accrual) => accrual.order)
  accruals: Accrual[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
