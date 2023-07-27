import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectTypes } from './projects';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
      id: number;

  @Column({ nullable: true })
      name: string | null;

  @Column({ type: 'varchar' })
      description: string;

  @Column({ type: 'float' })
      apy: number;

  @Column({ type: 'boolean' })
      available: boolean;

  @Column({ type: 'integer', default: 0 })
      risk: number;

  @Column({ type: 'enum', enum: ProjectTypes })
      type: ProjectTypes;

  @Column({ type: 'timestamp with time zone' })
      startDate: Date;

  @Column({ type: 'timestamp with time zone' })
      endDate: Date;
}
