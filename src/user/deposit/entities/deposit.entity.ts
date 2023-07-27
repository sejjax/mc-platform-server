import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { DepositStatus } from '../deposit.types';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { generateDepositGuid } from '../helpers/generateDepositGuid';

@Entity()
export class Deposit extends BaseEntity {
  @PrimaryGeneratedColumn()
      id: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
      user: User;

  @Column({
      type: 'varchar',
      length: 10,
  })
      currency: string;

  @Column({
      type: 'varchar',
      length: 100,
  })
      product: string;

  @Column({
      type: 'varchar',
      length: 250,
  })
      product_service_description: string;

  @Column({
      type: 'varchar',
      length: 5,
  })
      apy: string;

  @Column({
      type: 'varchar',
      length: 15,
  })
      investment_period: string;

  @Column({
      type: 'varchar',
      length: 15,
  })
      payment_period: string;

  @Column({
      type: 'numeric',
      scale: 4,
      precision: 18,
  })
      earn_amount: number;

  @Column({
      type: 'varchar',
      length: 200,
  })
      referals_array: string;

  @Column({
      type: 'numeric',
      scale: 4,
      precision: 18,
  })
      currency_amount: number;

  @Column({
      type: 'varchar',
      length: 100,
  })
      wallet_addr: string;

  @Column({
      type: 'enum',
      enum: DepositStatus,
      default: DepositStatus.waiting_calculation,
  })
      status: DepositStatus;

  @Column({
      type: 'varchar',
      length: 5,
  })
      ip_wks: string;

  @Column({
      type: 'varchar',
      length: 5,
  })
      pp_wks: string;

  @Column({ type: 'timestamp', default: new Date(), nullable: false })
      date: Date;

  @OneToMany(() => Calculation, (calculation) => calculation.product)
      calculations: Calculation[];

  @OneToOne(() => Transaction, { nullable: true })
  @JoinColumn()
      transaction: Transaction;

  @CreateDateColumn()
      createdAt: Date;

  @UpdateDateColumn()
      updatedAt: Date;

  guid: string;
  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  generateGUID(): void {
      if(this.id == null) {
          delete this.guid;
          return;
      }
      this.guid = generateDepositGuid(this.id, this.transaction?.id);
  }

  // "isClosed" depends on "ip_wks" and "date" fields by following formula: isClosed = now() > this."date" + interval this."ip_wks"
  @Column({ type: 'boolean', nullable: false, update: false })
      isClosed: boolean;
}
