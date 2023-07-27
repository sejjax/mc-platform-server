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
export class WalletHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
      id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
      user: User;

  @Column({
      type: 'varchar',
      length: 100,
  })
      wallet_addr: string;

  @Column({
      type: 'varchar',
      length: 20,
  })
      type_operation: string;

  @Column({ type: 'timestamp', default: new Date(), nullable: false })
      date: Date;

  @CreateDateColumn()
      createdAt: Date;

  @UpdateDateColumn()
      updatedAt: Date;
}
