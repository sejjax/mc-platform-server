import {
  Column,
  AfterLoad,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { randomUuid } from 'src/utils/random-uuid';
import { InvestorLevel, Statuses, UserLevels } from 'src/users/consts';
import { Package } from 'src/users/package.entity';
import { Accrual } from 'src/users/accrual.entity';
import { File } from 'src/files/file.entity';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { Team } from 'src/team/entities/team.entity';
import { Transaction } from 'src/transactions/transaction.entity';
import { Role } from './roles.entity';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { UserAgreement, UserAgreementType } from './users.types';
import { ChangeDefaultWalletAddr } from 'src/change-default-wallet-addr/change-default-wallet-addr.entity';
import { Promotion } from 'src/promotion/promotion.entity';
import { PromotionLevel } from 'src/promotion/promotionLevels.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  email: string | null;

  @Column({ unique: true, nullable: true })
  username: string | null;

  @Column({ nullable: true })
  fullName: string | null;

  @ManyToOne(() => File, {
    eager: true,
  })
  photo: File | null;

  @Column({ nullable: true })
  password: string;

  public previousPassword: string;

  @AfterLoad()
  public loadPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @Column({ nullable: true })
  partnerId: string;

  @BeforeInsert()
  async setPartnerId() {
    this.partnerId = await randomUuid(6);
  }

  @Column({ nullable: true })
  referrerId: string;

  @Column({ nullable: true })
  default_wallet_address: string;

  @Column({
    type: 'enum',
    enum: Statuses,
    default: Statuses.active,
  })
  status: Statuses;

  @Column({ type: 'boolean', default: true })
  passivePayments: boolean;

  @Column({
    type: 'enum',
    enum: UserLevels,
    default: UserLevels.Level0,
  })
  level: UserLevels;

  @Column({
    type: 'enum',
    enum: InvestorLevel,
    default: InvestorLevel.Level0,
  })
  investor_level: InvestorLevel;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  mobile: string;

  @Index()
  @Column({ nullable: true })
  hash: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: UserAgreement,
    default: UserAgreement[2],
  })
  agreement: UserAgreementType;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => ChangeDefaultWalletAddr, (dwac) => dwac.user)
  default_wallet_addr_changes: ChangeDefaultWalletAddr[];

  @OneToMany(() => Deposit, (deposit) => deposit.user)
  deposits: Deposit[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Accrual, (accrual) => accrual.targetUser)
  accruals: Accrual[];

  @OneToMany(() => Accrual, (accrual) => accrual.sourceUser)
  generatedAccruals: Accrual[];

  @OneToMany(() => Package, (pkg) => pkg.user)
  packages: Package[];

  @OneToMany(() => Calculation, (calculation) => calculation.user)
  calculations: Calculation[];

  @OneToOne(() => Team, (team) => team.user)
  team: Team;

  @OneToOne(() => Promotion, (promotion) => promotion.user)
  promotion: Promotion;

  @OneToOne(() => PromotionLevel, (promotionLevel) => promotionLevel.user)
  promotionLevel: PromotionLevel;

  @ManyToOne(() => Role, { nullable: true })
  role: Role;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'bool', default: false })
  isTrial: boolean;
}

@Entity()
export class DeletedUser extends User {
  @Column({
    type: 'int',
    unique: true,
  })
  userId: number;
}
