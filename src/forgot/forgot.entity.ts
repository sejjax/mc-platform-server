import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

import { User } from '../users/user.entity';

@Entity('forgot')
export class Forgot {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  hash: string;

  @ManyToOne(() => User, {
    eager: true,
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
