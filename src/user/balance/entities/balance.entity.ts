import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity()
export class Balance extends BaseEntity {
  @PrimaryGeneratedColumn()
      id: number;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
      user: User;

  @Column({
      type: 'numeric',
      scale: 2,
      precision: 10,
  })
      current_platform_balance: number;

  @Column({
      type: 'numeric',
      scale: 2,
      precision: 10,
  })
      available_to_withdraw_balance: number;

  @CreateDateColumn()
      createdAt: Date;

  @UpdateDateColumn()
      updatedAt: Date;
}
