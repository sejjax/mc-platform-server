import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'change_default_wallet_addr',
})
export class ChangeDefaultWalletAddr {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.default_wallet_addr_changes)
  user: User;

  @Column()
  old_wallet: string;

  @Column()
  new_wallet: string;

  @Column()
  confirmation_token: string;

  @Column({
    type: 'timestamp',
  })
  confirmation_token_expiration: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  confirmation_date: Date;
}
