import { User } from 'src/users/user.entity';
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

@Entity()
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn()
      id: number;

  @Column({
      type: 'int',
  })
      totalReferrals: number;

  @Column({
      type: 'int',
  })
      firstReferrals: number;

  @Column({
      type: 'numeric',
      scale: 4,
      precision: 18,
  })
      teamDeposit: number;

  @Column({
      type: 'numeric',
      scale: 4,
      precision: 18,
  })
      firstDeposit: number;

  @Column({
      type: 'numeric',
      scale: 4,
      precision: 18,
  })
      referralsIncome: number;

  @Column({
      type: 'numeric',
      scale: 4,
      precision: 18,
  })
      firstReferralsIncome: number;

  @OneToOne(() => User, {
      onDelete: 'CASCADE',
  })
  @JoinColumn()
      user: User;

  @CreateDateColumn()
      createdAt: Date;

  @UpdateDateColumn()
      updatedAt: Date;
}
