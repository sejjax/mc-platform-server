import { User } from 'src/users/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  teamDeposit: number;

  @Column({ type: 'int', nullable: true })
  firstStructure: number | null;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'boolean', default: true })
  isComplete: boolean;
}
