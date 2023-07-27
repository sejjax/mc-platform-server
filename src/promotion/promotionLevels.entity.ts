import { UserLevels } from 'src/users/consts';
import { User } from 'src/users/user.entity';
import { Column, Entity,  JoinColumn,  OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    name: 'promotion_level',
})
export class PromotionLevel {
  @PrimaryGeneratedColumn()
      id: number;

  @Column({
      type: 'enum',
      enum: UserLevels,
      default: UserLevels.Level0,
  })
      level: UserLevels;

  @OneToOne(() => User, (user) => user.promotionLevel)
  @JoinColumn()
      user: User;
}
