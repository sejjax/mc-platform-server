import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionStatusEnum {
  new = 'new',
  accepted = 'accepted',
  scam = 'scam',
  waiting_approval = 'waiting_approval',
  cancelled = 'cancelled',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  transaction_hash: string;

  @Column()
  product_service_description: string;

  @Column()
  wallet_addr: string;

  @Column({ type: 'varchar', nullable: true })
  amount: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @Column({
    type: 'enum',
    enum: TransactionStatusEnum,
    default: TransactionStatusEnum.waiting_approval,
  })
  status: TransactionStatusEnum;

  @CreateDateColumn()
  createdAt: Date;
}
